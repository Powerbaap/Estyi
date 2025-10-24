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
  process.env.SUPABASE_URL || 'https://haiafkuaamkxudvvhucv.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'your-service-key'
);

// Dev fallback flags (decoupled):
// - Email fallback: when SMTP creds are missing, don't send email; just log and return code
// - Supabase fallback: when service key is missing, don't touch Supabase; keep codes in memory
const useEmailFallback = !process.env.SMTP_USER || !process.env.SMTP_PASS;
const useSupabaseFallback = !process.env.SUPABASE_SERVICE_KEY;
const verificationStore = new Map(); // key: email or userId, value: { code, expiresAt }

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
      const { error } = await supabase
        .from('verification_codes')
        .insert({
          email,
          code: verificationCode,
          expires_at: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        });
      if (error) {
        console.error('Database error:', error);
        throw error;
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
    
    if (error || !data) {
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
    if (useSupabaseFallback) {
      return res.json({ success: true, message: 'Dev fallback: approved', passwordSetRequired: true });
    }
    const id = req.params.id;
    // Fetch application
    const { data: app, error: appErr } = await supabase
      .from('clinic_applications')
      .select('*')
      .eq('id', id)
      .single();
    if (appErr) return res.status(400).json({ error: appErr.message });
    if (!app) return res.status(404).json({ error: 'Application not found' });

    // Create or update clinic auth user
    let clinicAuthId = null;
    let tempPasswordUsed = false;
    try {
      // Try finding existing auth user by email
      const { data: list, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (!listError) {
        const found = list?.users?.find((u) => u.email?.toLowerCase() === String(app.email).toLowerCase());
        if (found) clinicAuthId = found.id;
      }

      if (!clinicAuthId) {
        const tempPassword = app.password || `Estyi${Math.random().toString(36).slice(2, 8)}!${Math.floor(Math.random() * 10)}`;
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: app.email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { role: 'clinic', name: app.clinic_name }
        });
        if (authError) return res.status(400).json({ error: authError.message });
        clinicAuthId = authData.user.id;
        if (!app.password) tempPasswordUsed = true;
      } else if (app.password) {
        // Update existing user password and metadata
        const { error: updUserErr } = await supabase.auth.admin.updateUserById(clinicAuthId, {
          password: app.password,
          user_metadata: { role: 'clinic', name: app.clinic_name }
        });
        if (updUserErr) return res.status(400).json({ error: updUserErr.message });
      }

      // Upsert profile in users table
      const randomUserId = Math.random().toString(36).substring(2, 10).toUpperCase();
      const { data: profileRow, error: profileErr } = await supabase
        .from('users')
        .upsert({
          id: clinicAuthId,
          user_id: randomUserId,
          email: app.email,
          name: app.clinic_name,
          role: 'clinic',
          is_verified: true
        })
        .select('*');
      if (profileErr) return res.status(400).json({ error: profileErr.message });
    } catch (userErr) {
      console.error('Clinic user provision error:', userErr);
      return res.status(500).json({ error: 'Failed to provision clinic user' });
    }

    // If no password provided in application, generate a recovery link and email it
    let recoveryLinkSent = false;
    if (!app.password) {
      try {
        const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
          type: 'recovery',
          email: app.email,
          options: { redirectTo: (process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/reset-password` : undefined) }
        });
        if (!linkErr && linkData?.action_link) {
          if (!useEmailFallback) {
            const html = `
              <div style="font-family: Arial, sans-serif;">
                <h2>Estyi Klinik Erişimi</h2>
                <p>Başvurunuz onaylandı. Şifrenizi belirlemek için aşağıdaki bağlantıyı kullanın:</p>
                <p><a href="${linkData.action_link}" target="_blank">Şifre Belirleme Linki</a></p>
                <p>Bağlantı bir süre sonra geçersiz olur. Sorunuz olursa bu e-postayı yanıtlayabilirsiniz.</p>
              </div>
            `;
            await transporter.sendMail({
              from: process.env.SMTP_USER,
              to: app.email,
              subject: 'Estyi Klinik Giriş – Şifre Belirleme',
              html,
            });
            recoveryLinkSent = true;
          } else {
            console.log(`🔗 DEV: Recovery link for ${app.email}: ${linkData.action_link}`);
            recoveryLinkSent = true;
          }
        }
      } catch (e) {
        console.warn('Recovery link email failed:', (e && e.message) || e);
      }
    }

    // Create clinic (link to auth user id)
    const clinicInsert = {
      id: clinicAuthId, // align with RLS policies (auth.uid() = id)
      name: app.clinic_name,
      email: app.email,
      phone: app.phone || '',
      website: app.website || '',
      location: app.country || '',
      status: 'active',
      rating: 0,
      reviews: 0,
      specialties: app.specialties || []
    };
    const { data: clinicRow, error: clinicErr } = await supabase
      .from('clinics')
      .upsert(clinicInsert)
      .select('*');
    if (clinicErr) return res.status(400).json({ error: clinicErr.message });

    const createdClinic = Array.isArray(clinicRow) ? clinicRow[0] : clinicRow;

    // Update application status
    const { error: updErr } = await supabase
      .from('clinic_applications')
      .update({ status: 'approved' })
      .eq('id', id);
    if (updErr) return res.status(400).json({ error: updErr.message });

    res.json({ success: true, clinic: createdClinic, passwordSetRequired: !app.password, recoveryLinkSent, tempPasswordUsed });
  } catch (error) {
    console.error('Approve clinic application error:', error);
    res.status(500).json({ error: 'Failed to approve application' });
  }
});

app.post('/api/admin/clinic-applications/:id/reject', async (req, res) => {
  try {
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

app.listen(PORT, () => {
  console.log(`🚀 Estyi Backend Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
