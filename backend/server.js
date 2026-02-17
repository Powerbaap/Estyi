import express from 'express';
import cors from 'cors';
import * as nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { emailTemplates } from './emailTemplates.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const isStrongPassword = (password) => {
  if (typeof password !== 'string') return false;
  const lengthOk = password.length >= 8;
  const upperOk = /[A-Z]/.test(password);
  const lowerOk = /[a-z]/.test(password);
  const digitOk = /[0-9]/.test(password);
  const symbolOk = /[^A-Za-z0-9]/.test(password);
  return lengthOk && upperOk && lowerOk && digitOk && symbolOk;
};

// Dev fallback flags (decoupled):
// - Email fallback: when SMTP creds are missing, don't send email; just log and return code
// - Supabase fallback: when service key is missing, don't touch Supabase; keep codes in memory
const useEmailFallback = !process.env.SMTP_USER || !process.env.SMTP_PASS;
const useSupabaseFallback = !process.env.SUPABASE_SERVICE_KEY;
const verificationStore = new Map();

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const getAdminContext = async (req, res) => {
  if (useSupabaseFallback) {
    return { userId: 'DEV_ADMIN' };
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: 'Missing auth token' });
    return null;
  }

  const { data: authData, error: authError } = await supabase.auth.getUser(token);

  if (authError || !authData?.user) {
    res.status(401).json({ error: 'Invalid auth token' });
    return null;
  }

  const user = authData.user;
  let role =
    (user.user_metadata && user.user_metadata.role) ||
    (user.app_metadata && user.app_metadata.role) ||
    null;

  if (!role) {
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      if (profile?.role) {
        role = profile.role;
      }
    } catch {}
  }

  if (role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return null;
  }

  return { userId: user.id };
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Send verification email
app.post('/api/send-verification', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // If code is provided, use it; otherwise generate new one
    const verificationCode = code || Math.floor(100000 + Math.random() * 900000).toString();

    // Save code (Supabase or in-memory)
    if (useSupabaseFallback) {
      const key = email;
      verificationStore.set(key, {
        code: verificationCode,
        expiresAt: Date.now() + 15 * 60 * 1000
      });
      console.log(`🔧 SUPABASE-FALLBACK: stored code for ${email}: ${verificationCode}`);
    } else if (!code) {
      // If no code provided, save to database (for direct API calls)
      try {
        const { error } = await supabase
          .from('verification_codes')
          .insert({
            email,
            code: verificationCode,
            expires_at: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
          });
        if (error) {
          throw error;
        }
      } catch (dbErr) {
        const msg = ((dbErr || {}).message || '').toLowerCase();
        const missing = msg.includes('relation') && msg.includes('verification_codes');
        if (missing) {
          const key = email;
          verificationStore.set(key, {
            code: verificationCode,
            expiresAt: Date.now() + 15 * 60 * 1000
          });
          console.warn(`🔧 SUPABASE TABLE MISSING: falling back to memory store for ${email}`);
        } else {
          console.error('Database error:', dbErr);
          throw dbErr;
        }
      }
    }

    // Email sending
    if (useEmailFallback) {
      // Optional: use Ethereal test SMTP when enabled
      if (process.env.SMTP_USE_ETHEREAL === 'true') {
        try {
          const testAccount = await nodemailer.createTestAccount();
          const etherealTransport = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          });
          const template = emailTemplates.verification(verificationCode);
          const info = await etherealTransport.sendMail({
            from: 'estyi@test',
            to: email,
            subject: template.subject,
            html: template.html,
          });
          const previewUrl = nodemailer.getTestMessageUrl(info);
          console.log(`✉️ ETHEREAL: message preview ${previewUrl}`);
          return res.json({ success: true, message: 'Verification code sent (ethereal)', code: verificationCode, previewUrl });
        } catch (e) {
          console.warn('Ethereal send failed, falling back to dev code only:', e?.message || e);
        }
      }
      console.log(`🔧 EMAIL-FALLBACK: code for ${email} (not sent via SMTP): ${verificationCode}`);
      return res.json({ success: true, message: 'Dev: verification code generated (email not sent)', code: verificationCode });
    } else {
      const template = emailTemplates.verification(verificationCode);
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: template.subject,
        html: template.html
      });
      return res.json({ success: true, message: 'Verification code sent' });
    }
    
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// Verify code endpoint
app.post('/api/verify-code', async (req, res) => {
  try {
    const { email, code, userId } = req.body;
    
    if ((!email && !userId) || !code) {
      return res.status(400).json({ error: 'Email/UserId and code are required' });
    }
    
    // If Supabase fallback is active, verify against in-memory store
    if (useSupabaseFallback) {
      const key = userId || email;
      const entry = verificationStore.get(key);
      if (!entry || entry.code !== code || Date.now() > entry.expiresAt) {
        return res.status(400).json({ error: 'Invalid or expired verification code' });
      }
      verificationStore.delete(key);
      return res.json({ success: true, message: 'Code verified successfully (dev store)' });
    }

    // Check verification code by userId or email
    let query = supabase
      .from('verification_codes')
      .select('*')
      .eq('code', code)
      .gt('expires_at', new Date().toISOString());
    
    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('email', email);
    }
    
    const { data, error } = await query.single();
    
    if (error) {
      const msg = ((error || {}).message || '').toLowerCase();
      const missing = msg.includes('relation') && msg.includes('verification_codes');
      if (missing) {
        const key = userId || email;
        const entry = verificationStore.get(key);
        if (!entry || entry.code !== code || Date.now() > entry.expiresAt) {
          return res.status(400).json({ error: 'Invalid or expired verification code' });
        }
        verificationStore.delete(key);
        return res.json({ success: true, message: 'Code verified successfully (dev store)' });
      }
    }
    
    if (!data) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }
    
    // Delete the used code
    await supabase
      .from('verification_codes')
      .delete()
      .eq('id', data.id);
    
    res.json({ success: true, message: 'Code verified successfully' });
    
  } catch (error) {
    console.error('Code verification error:', error);
    res.status(500).json({ error: 'Failed to verify code' });
  }
});

// User registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, role = 'user', name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    if (useSupabaseFallback) {
      const userId = 'DEV_' + Math.random().toString(36).substring(2, 10).toUpperCase();
      console.log(`🔧 DEV: registered user ${email} with id ${userId}`);
      return res.json({ success: true, userId, message: 'User registered successfully (dev)' });
    }

    // Generate user ID
    const userId = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        user_id: userId,
        role,
        name: name || email.split('@')[0]
      }
    });
    
    if (authError) {
      console.error('Auth creation error:', authError);
      return res.status(400).json({ error: authError.message });
    }
    
    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        user_id: userId,
        email,
        name: name || email.split('@')[0],
        role,
        is_verified: false
      });
    
    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({ error: 'User profile creation failed' });
    }
    
    res.json({ 
      success: true, 
      userId: authData.user.id,
      message: 'User registered successfully' 
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Send welcome email
app.post('/api/send-welcome', async (req, res) => {
  try {
    const { email, userName } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const template = emailTemplates.welcome(userName);
    
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: template.subject,
      html: template.html
    });
    
    res.json({ success: true, message: 'Welcome email sent' });
    
  } catch (error) {
    console.error('Welcome email error:', error);
    res.status(500).json({ error: 'Failed to send welcome email' });
  }
});

// Send password reset email
app.post('/api/send-password-reset', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }
    
    const template = emailTemplates.passwordReset(code);
    
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: template.subject,
      html: template.html
    });
    
    res.json({ success: true, message: 'Password reset email sent' });
    
  } catch (error) {
    console.error('Password reset email error:', error);
    res.status(500).json({ error: 'Failed to send password reset email' });
  }
});

app.post('/api/clinic-applications/apply', async (req, res) => {
  try {
    const body = req.body || {};
    const clinic_name = body.clinic_name;
    const email = body.email;
    const password = body.password;
    const countries = Array.isArray(body.countries) ? body.countries : [];
    const specialties = Array.isArray(body.specialties) ? body.specialties : [];
    if (!clinic_name || !email || !password) {
      return res.status(400).json({ error: 'clinic_name, email ve password zorunludur.' });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: 'Şifre en az 8 karakter olmalı ve en az bir büyük harf, küçük harf, rakam ve sembol içermelidir.' });
    }
    if (!countries.length || !specialties.length) {
      return res.status(400).json({ error: 'En az bir ülke ve uzmanlık alanı seçilmelidir.' });
    }
    if (useSupabaseFallback) {
      const fakeId = 'DEV_APP_' + Math.random().toString(36).substring(2, 10).toUpperCase();
      const application = {
        id: fakeId,
        clinic_name,
        email,
        phone: body.phone || '',
        website: body.website || '',
        country: countries[0] || null,
        countries,
        cities_by_country: body.cities_by_country || {},
        specialties,
        description: body.description || '',
        certificate_files: Array.isArray(body.certificate_files) ? body.certificate_files : [],
        status: 'pending',
        submitted_by: null
      };
      return res.json({ success: true, application });
    }
    let authUserId = null;
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          role: 'clinic',
          name: clinic_name
        }
      });
      if (authError) {
        const msg = (authError.message || '').toLowerCase();
        const already =
          msg.includes('already') &&
          (msg.includes('registered') || msg.includes('exists') || msg.includes('in use'));
        if (already) {
          return res.status(409).json({ error: 'Bu e-posta ile zaten hesap var. Giriş yapın veya Şifremi Unuttum kullanın.' });
        }
        console.error('Clinic auth creation error:', authError);
        return res.status(400).json({ error: authError.message || 'Clinic auth user creation failed' });
      } else if (authData && authData.user) {
        authUserId = authData.user.id;
        try {
          const randomUserId = Math.random().toString(36).substring(2, 10).toUpperCase();
          const { error: profileError } = await supabase
            .from('users')
            .upsert({
              id: authUserId,
              user_id: randomUserId,
              email,
              name: clinic_name,
              role: 'clinic',
              is_verified: false
            });
          if (profileError) {
            console.warn('Clinic profile upsert on apply warning:', profileError);
          }
        } catch (e) {
          console.warn('Clinic profile upsert on apply exception:', e && e.message ? e.message : e);
        }
      }
    } catch (e) {
      console.error('Clinic auth create exception:', e && e.message ? e.message : e);
    }
    if (!authUserId) {
      return res.status(400).json({ error: 'Klinik kullanıcısı oluşturulamadı.' });
    }
    const insertPayload = {
      clinic_name,
      email,
      phone: body.phone || null,
      website: body.website || null,
      country: countries[0] || null,
      countries,
      cities_by_country: body.cities_by_country && typeof body.cities_by_country === 'object' ? body.cities_by_country : {},
      specialties,
      description: body.description || null,
      certificate_files: Array.isArray(body.certificate_files) ? body.certificate_files : [],
      status: 'pending',
      submitted_by: authUserId
    };
    const { data, error } = await supabase
      .from('clinic_applications')
      .insert(insertPayload)
      .select('*');
    if (error) {
      console.error('Clinic application insert error:', error);
      return res.status(400).json({ error: error.message });
    }
    const row = Array.isArray(data) ? data[0] : data;
    res.json({ success: true, application: row || null });
  } catch (error) {
    console.error('Clinic application apply error:', error);
    res.status(500).json({ error: 'Failed to submit clinic application' });
  }
});

app.post('/api/requests', async (req, res) => {
  try {
    if (useSupabaseFallback) {
      return res.status(503).json({ error: 'Supabase service unavailable' });
    }
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: 'Missing auth token' });
    }
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData?.user) {
      return res.status(401).json({ error: 'Invalid auth token' });
    }

    const body = req.body || {};
    const allowedKeys = [
      'procedure_key',
      'description',
      'photos',
      'params',
      'status',
      'created_at',
      'updated_at',
      'gender',
      'country',
      'city',
      'countries',
      'cities_tr',
      'cities_by_country'
    ];
    const payload = { user_id: authData.user.id };
    allowedKeys.forEach((key) => {
      if (body[key] !== undefined) {
        payload[key] = body[key];
      }
    });
    if (payload.cities_tr === undefined && body.citiesTR !== undefined) {
      payload.cities_tr = body.citiesTR;
    }

    if (!payload.procedure_key) {
      return res.status(400).json({ error: 'procedure_key is required' });
    }
    const now = new Date().toISOString();
    payload.status = payload.status || 'active';
    payload.created_at = payload.created_at || now;
    payload.updated_at = payload.updated_at || now;

    const { data, error } = await supabase
      .from('requests')
      .insert(payload)
      .select('*');
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const row = Array.isArray(data) ? data[0] : data;
    res.json(row || null);
  } catch (error) {
    console.error('Request create error:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// Admin user provision (create or promote to admin)
app.post('/api/admin/provision', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (useSupabaseFallback) {
      console.log(`🔧 SUPABASE-FALLBACK: provision admin ${email} with password (dev only)`);
      return res.json({ success: true, message: 'Admin provisioned (dev fallback)' });
    }

    // Try to find user by email in users table first
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, name, role')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.warn('User profile query warning:', profileError?.message || profileError);
    }

    let userId = profile?.id;

    // Fallback: search auth users by email
    if (!userId) {
      const { data: list, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (listError) {
        console.error('List users error:', listError?.message || listError);
      } else {
        const found = list?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
        if (found) {
          userId = found.id;
        }
      }
    }

    if (userId) {
      // Update existing user: set password and role=admin
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        password,
        user_metadata: {
          ...(profile?.name ? { name: profile.name } : {}),
          role: 'admin',
        },
      });

      if (updateError) {
        console.error('Update user error:', updateError?.message || updateError);
        return res.status(400).json({ error: updateError.message });
      }

      // Update users table role as well
      const { error: updateProfileError } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', userId);

      if (updateProfileError) {
        console.warn('Profile update warning:', updateProfileError?.message || updateProfileError);
      }

      return res.json({ success: true, message: 'Existing user promoted to admin and password set', userId });
    } else {
      // Create new admin user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          role: 'admin',
          name: name || email.split('@')[0],
        },
      });

      if (authError) {
        console.error('Create user error:', authError?.message || authError);
        return res.status(400).json({ error: authError.message });
      }

      // Create profile in users table
      const { error: profileInsertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          user_id: Math.random().toString(36).substring(2, 10).toUpperCase(),
          email,
          name: name || email.split('@')[0],
          role: 'admin',
          is_verified: true,
        });

      if (profileInsertError) {
        console.warn('Profile insert warning:', profileInsertError?.message || profileInsertError);
      }

      return res.json({ success: true, message: 'Admin user created', userId: authData.user.id });
    }
  } catch (error) {
    console.error('Admin provision error:', error);
    res.status(500).json({ error: 'Failed to provision admin' });
  }
});

// Admin data endpoints
app.get('/api/admin/users', async (req, res) => {
  try {
    if (useSupabaseFallback) return res.json([]);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data || []);
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/admin/clinics', async (req, res) => {
  try {
    if (useSupabaseFallback) return res.json([]);
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data || []);
  } catch (error) {
    console.error('Admin clinics error:', error);
    res.status(500).json({ error: 'Failed to fetch clinics' });
  }
});

app.get('/api/admin/requests', async (req, res) => {
  try {
    if (useSupabaseFallback) return res.json([]);
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data || []);
  } catch (error) {
    console.error('Admin requests error:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

app.get('/api/admin/clinic-applications', async (req, res) => {
  try {
    const admin = await getAdminContext(req, res);
    if (!admin) return;
    if (useSupabaseFallback) return res.json([]);
    const { data, error } = await supabase
      .from('clinic_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data || []);
  } catch (error) {
    console.error('Admin clinic applications error:', error);
    res.status(500).json({ error: 'Failed to fetch clinic applications' });
  }
});

app.post('/api/admin/clinic-applications/:id/approve', async (req, res) => {
  try {
    const admin = await getAdminContext(req, res);
    if (!admin) return;
    if (useSupabaseFallback) {
      return res.json({ success: true, message: 'Dev fallback: approved' });
    }
    const id = req.params.id;
    const { approved_specialties } = req.body || {};
    const { data: app, error: appErr } = await supabase
      .from('clinic_applications')
      .select('*')
      .eq('id', id)
      .single();
    if (appErr) return res.status(400).json({ error: appErr.message });
    if (!app) return res.status(404).json({ error: 'Application not found' });

    if (app.status === 'approved') {
      return res.json({ success: true, message: 'Application already approved' });
    }

    if (!app.submitted_by) {
      return res.status(400).json({ error: 'Application is missing submitted_by' });
    }

    const authUserId = app.submitted_by;

    const applicationSpecialties = Array.isArray(app.specialties) ? app.specialties : [];
    const approved =
      Array.isArray(approved_specialties) && approved_specialties.length > 0
        ? approved_specialties
        : applicationSpecialties;

    if (approved.length === 0 && applicationSpecialties.length > 0) {
      return res.status(400).json({ error: 'At least one specialty must be approved' });
    }

    const countries = Array.isArray(app.countries) ? app.countries : [];
    const citiesByCountry = app.cities_by_country && typeof app.cities_by_country === 'object'
      ? app.cities_by_country
      : {};

    let location = '';
    if (countries.length > 0) {
      const firstCountry = countries[0];
      const cities = citiesByCountry && citiesByCountry[firstCountry];
      if (Array.isArray(cities) && cities.length > 0) {
        location = `${firstCountry} / ${cities[0]}`;
      } else {
        location = firstCountry;
      }
    } else if (app.country) {
      location = app.country;
    }

    const clinicInsert = {
      id: authUserId,
      name: app.clinic_name,
      email: app.email,
      phone: app.phone || '',
      website: app.website || '',
      location,
      description: app.description || '',
      status: 'active',
      rating: 0,
      reviews: 0,
      specialties: approved,
      countries,
      cities_by_country: citiesByCountry
    };
    const { data: clinicRow, error: clinicErr } = await supabase
      .from('clinics')
      .upsert(clinicInsert)
      .select('*');
    if (clinicErr) return res.status(400).json({ error: clinicErr.message });

    const createdClinic = Array.isArray(clinicRow) ? clinicRow[0] : clinicRow;

    const { error: updErr } = await supabase
      .from('clinic_applications')
      .update({ status: 'approved', approved_at: new Date().toISOString() })
      .eq('id', id);
    if (updErr) return res.status(400).json({ error: updErr.message });

    try {
      await supabase
        .from('users')
        .update({ role: 'clinic', is_verified: true })
        .eq('id', authUserId);
    } catch {}

    res.json({ success: true, clinic: createdClinic });
  } catch (error) {
    console.error('Approve clinic application error:', error);
    res.status(500).json({ error: 'Failed to approve application' });
  }
});

app.post('/api/admin/clinic-applications/:id/resend-invite', async (req, res) => {
  try {
    const admin = await getAdminContext(req, res);
    if (!admin) return;
    if (useSupabaseFallback) {
      return res.json({ success: true, message: 'Dev fallback: invite link (dev only)' });
    }
    const id = req.params.id;
    const { data: app, error: appErr } = await supabase
      .from('clinic_applications')
      .select('*')
      .eq('id', id)
      .single();
    
    if (appErr || !app) return res.status(404).json({ error: 'Application not found' });
    if (app.status !== 'approved') return res.status(400).json({ error: 'Application must be approved first' });

    const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: app.email,
      options: { redirectTo: (process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/auth/callback` : 'http://localhost:5173/auth/callback') }
    });

    if (linkErr) throw linkErr;

    if (!useEmailFallback) {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded-lg;">
          <h2 style="color: #4F46E5;">Estyi Klinik Erişimi</h2>
          <p>Merhaba <strong>${app.clinic_name}</strong>,</p>
          <p>Şifre belirleme talebiniz üzerine yeni bir link oluşturuldu:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${linkData.action_link}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Şifremi Belirle</a>
          </div>
          <p style="color: #666; font-size: 14px;">Bu bağlantı bir süre sonra geçersiz olacaktır.</p>
        </div>
      `;
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: app.email,
        subject: 'Estyi Klinik – Şifre Belirleme (Yeni Link)',
        html,
      });
    } else {
      console.log(`🔗 DEV: Resend recovery link for ${app.email}: ${linkData.action_link}`);
    }

    res.json({ success: true, message: 'Invite link resent' });
  } catch (error) {
    console.error('Resend invite error:', error);
    res.status(500).json({ error: 'Failed to resend invite' });
  }
});

app.post('/api/admin/clinic-applications/:id/reject', async (req, res) => {
  try {
    const admin = await getAdminContext(req, res);
    if (!admin) return;
    if (useSupabaseFallback) {
      return res.json({ success: true, message: 'Dev fallback: rejected' });
    }
    const id = req.params.id;
    const { reason } = req.body || {};
    const { data, error } = await supabase
      .from('clinic_applications')
      .update({ status: 'rejected', description: reason || null })
      .eq('id', id)
      .select('*');
    if (error) return res.status(400).json({ error: error.message });
    const updated = Array.isArray(data) ? data[0] : data;
    res.json({ success: true, application: updated });
  } catch (error) {
    console.error('Reject clinic application error:', error);
    res.status(500).json({ error: 'Failed to reject application' });
  }
});

app.post('/api/requests/:id/accept', async (req, res) => {
  try {
    const requestId = req.params.id;
    const { clinic_id } = req.body || {};
    if (!requestId || !clinic_id) {
      return res.status(400).json({ error: 'request_id and clinic_id required' });
    }
    if (useSupabaseFallback) {
      return res.json({ success: true, idempotent: true, snapshot_id: 'DEV_SNAPSHOT', conversation_id: 'DEV_CONV' });
    }
    const { data, error } = await supabase.rpc('accept_request', {
      p_request_id: requestId,
      p_clinic_id: clinic_id
    });
    if (error) {
      return res.status(400).json({ error: error.message || 'Accept failed' });
    }
    res.json({ success: true, ...data });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ error: 'Accept failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Estyi Backend Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
