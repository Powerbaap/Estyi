import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const TestAuth: React.FC = () => {
  const { signup, verifyEmail, login, user, isLoading } = useAuth();
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('test123456');
  const [verificationCode, setVerificationCode] = useState('');
  const [userId, setUserId] = useState('');
  const [result, setResult] = useState('');

  const handleSignup = async () => {
    setResult('Kayıt olunuyor...');
    const response = await signup(testEmail, testPassword, 'user');
    if (response.success) {
      setResult(`✅ Kayıt başarılı! User ID: ${response.userId}`);
      setUserId(response.userId || '');
    } else {
      setResult(`❌ Kayıt hatası: ${response.error}`);
    }
  };

  const handleVerify = async () => {
    if (!userId || !verificationCode) {
      setResult('❌ User ID ve doğrulama kodu gerekli');
      return;
    }
    
    setResult('Doğrulanıyor...');
    const response = await verifyEmail(userId, verificationCode);
    if (response.success) {
      setResult('✅ Email doğrulama başarılı!');
    } else {
      setResult(`❌ Doğrulama hatası: ${response.error}`);
    }
  };

  const handleLogin = async () => {
    setResult('Giriş yapılıyor...');
    const response = await login(testEmail, testPassword);
    if (response.success) {
      setResult('✅ Giriş başarılı!');
    } else {
      setResult(`❌ Giriş hatası: ${response.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Auth Test Sayfası</h1>
        
        <div className="space-y-6">
          {/* Test Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Email
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Test Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Password
            </label>
            <input
              type="password"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Verification Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doğrulama Kodu (6 haneli)
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleSignup}
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Yükleniyor...' : 'Kayıt Ol'}
            </button>
            
            <button
              onClick={handleVerify}
              disabled={isLoading || !userId || !verificationCode}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Yükleniyor...' : 'Doğrula'}
            </button>
            
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? 'Yükleniyor...' : 'Giriş Yap'}
            </button>
          </div>

          {/* Result */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-700 mb-2">Sonuç:</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{result}</p>
          </div>

          {/* User Info */}
          {user && (
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-700 mb-2">Giriş Yapılmış Kullanıcı:</h3>
              <p className="text-sm text-blue-600">
                Email: {user.email}<br/>
                Role: {user.user_metadata?.role || 'N/A'}<br/>
                User ID: {user.user_metadata?.user_id || 'N/A'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestAuth;
