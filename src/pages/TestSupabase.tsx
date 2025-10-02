import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const TestSupabase: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing connection...');

    try {
      // Test 1: Basic connection
      const { data, error } = await supabase.auth.getSession();
      console.log('Test 1 - Session:', data, error);

      if (error) {
        setTestResult(`Connection Error: ${error.message}`);
        return;
      }

      // Test 2: Try to access users table
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(1);

      console.log('Test 2 - Users:', users, usersError);

      if (usersError) {
        setTestResult(`Database Error: ${usersError.message}`);
        return;
      }

      setTestResult('✅ Supabase connection successful! Database accessible.');

    } catch (error) {
      console.error('Test error:', error);
      setTestResult(`❌ Test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testSignup = async () => {
    setIsLoading(true);
    setTestResult('Testing signup...');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'test123456',
        options: {
          data: {
            name: 'Test User',
            role: 'user',
          }
        }
      });

      console.log('Signup test:', data, error);

      if (error) {
        setTestResult(`Signup Error: ${error.message}`);
      } else {
        setTestResult('✅ Signup test successful!');
      }

    } catch (error) {
      setTestResult(`❌ Signup test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testDatabaseTables = async () => {
    setIsLoading(true);
    setTestResult('Testing database tables...');

    try {
      // Test users table
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(1);

      console.log('Users table test:', users, usersError);

      // Test clinics table
      const { data: clinics, error: clinicsError } = await supabase
        .from('clinics')
        .select('*')
        .limit(1);

      console.log('Clinics table test:', clinics, clinicsError);

      if (usersError || clinicsError) {
        setTestResult(`Database Tables Error: ${usersError?.message || clinicsError?.message}`);
      } else {
        setTestResult('✅ Database tables accessible!');
      }

    } catch (error) {
      setTestResult(`❌ Database tables test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Supabase Test</h1>

        <div className="space-y-4">
          <button
            onClick={testConnection}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Connection'}
          </button>

          <button
            onClick={testSignup}
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Signup'}
          </button>

          <button
            onClick={testDatabaseTables}
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Database Tables'}
          </button>
        </div>

        {testResult && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm">{testResult}</p>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          <p>Check browser console for detailed logs</p>
        </div>
      </div>
    </div>
  );
};

export default TestSupabase; 