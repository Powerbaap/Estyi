import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/authService';

export function SignUpForm() {
  const { t } = useTranslation();
  
  const signUpSchema = z.object({
    email: z.string().email(t('auth.emailMinLength')),
    password: z.string().min(8, t('auth.passwordMinLength')),
    confirmPassword: z.string(),
    name: z.string().min(2, t('auth.nameMinLength'))
  }).refine(data => data.password === data.confirmPassword, {
    message: t('auth.passwordMismatch'),
    path: ["confirmPassword"]
  });

  type SignUpForm = z.infer<typeof signUpSchema>;

  const [step, setStep] = useState<'email' | 'verification' | 'details'>('email');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema)
  });
  
  const email = watch('email');
  
  const sendCode = async () => {
    if (!email) {
      setError(t('auth.enterEmail'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await authService.sendVerificationCode(email);
      setStep('verification');
    } catch (error) {
      setError(t('auth.codeError'));
    } finally {
      setLoading(false);
    }
  };
  
  const verifyAndRegister = async (data: SignUpForm) => {
    if (!verificationCode) {
      setError(t('auth.enterVerificationCode'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // First verify the code
      await authService.verifyCode(data.email, verificationCode);
      
      // Then register the user
      await authService.registerUser(data.email, data.password, data.name);
      
      alert(t('auth.registrationSuccess'));
      // Redirect to login or dashboard
      
    } catch (error) {
      setError(t('auth.registrationError'));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {t('auth.signupTitle')}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(verifyAndRegister)} className="space-y-4">
        <div>
          <input
            {...register('email')}
            type="email"
            placeholder={t('auth.signupEmailPlaceholder')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={step !== 'email'}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        {step === 'email' && (
          <button
            type="button"
            onClick={sendCode}
            disabled={loading || !email}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? t('auth.sendingCode') : t('auth.sendVerificationCode')}
          </button>
        )}
        
        {step === 'verification' && (
          <>
            <div className="text-center mb-4">
              <p className="text-gray-600">
                <strong>{email}</strong> {t('auth.verificationCodeSent')}
              </p>
            </div>
            
            <input
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder={t('auth.verificationCodePlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
              maxLength={6}
            />
            
            <button
              type="button"
              onClick={() => setStep('details')}
              disabled={!verificationCode || verificationCode.length !== 6}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('auth.verifyAndContinue')}
            </button>
            
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
            >
              {t('auth.backButton')}
            </button>
          </>
        )}
        
        {step === 'details' && (
          <>
            <div className="text-center mb-4">
              <p className="text-green-600 font-medium">
                {t('auth.emailVerified')}
              </p>
            </div>
            
            <input
              {...register('name')}
              placeholder={t('auth.namePlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
            
            <input
              {...register('password')}
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
            
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder={t('auth.confirmPasswordPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? t('auth.registering') : t('auth.register')}
            </button>
            
            <button
              type="button"
              onClick={() => setStep('verification')}
              className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
            >
              {t('auth.backButton')}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
