import { supabase } from '../lib/supabase';

export const authService = {
  async sendVerificationCode(email: string) {
    const baseUrl = (import.meta as any).env.VITE_API_BASE_URL || (import.meta as any).env.VITE_API_URL || 'http://localhost:3005';
    const response = await fetch(`${baseUrl}/api/send-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send verification code');
    }
    
    return response.json();
  },
  
  async verifyCode(email: string, code: string) {
    const baseUrl = (import.meta as any).env.VITE_API_BASE_URL || (import.meta as any).env.VITE_API_URL || 'http://localhost:3005';
    const response = await fetch(`${baseUrl}/api/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    
    if (!response.ok) {
      throw new Error('Failed to verify code');
    }
    
    return response.json();
  },
  
  async registerUser(email: string, password: string, name: string) {
    // Generate user ID
    const userId = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Create user in Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        user_id: userId,
        email,
        name,
        password, // Note: In production, hash this password
        is_verified: true,
        role: 'user'
      })
      .select()
      .single();
    
    if (userError) throw userError;
    
    return userData;
  },
  
  async loginUser(email: string, password: string) {
    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password) // Note: In production, use bcrypt to compare hashed passwords
      .single();
    
    if (error || !user) {
      throw new Error('Invalid email or password');
    }
    
    return user;
  }
};
