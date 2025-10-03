import express from 'express';
import cors from 'cors';
import * as nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { emailTemplates } from './emailTemplates.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://haiafkuaamkxudvvhucv.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'your-service-key'
);

// Email transporter
const transporter = nodemailer.createTransporter({
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
    
    // If no code provided, save to database (for direct API calls)
    if (!code) {
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
    
    // Get email template
    const template = emailTemplates.verification(verificationCode);
    
    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: template.subject,
      html: template.html
    });
    
    res.json({ success: true, message: 'Verification code sent' });
    
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

app.listen(PORT, () => {
  console.log(`🚀 Estyi Backend Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
