// Backend test scripti
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001';

async function testBackend() {
  console.log('🧪 Backend testleri başlatılıyor...\n');

  try {
    // 1. Health check
    console.log('1. Health check testi...');
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);

    // 2. Email gönderme testi
    console.log('\n2. Email gönderme testi...');
    const emailResponse = await fetch(`${API_URL}/api/send-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'test@example.com',
        code: '123456'
      })
    });
    
    if (emailResponse.ok) {
      console.log('✅ Email gönderme başarılı');
    } else {
      const error = await emailResponse.json();
      console.log('❌ Email gönderme hatası:', error.error);
    }

    // 3. Kullanıcı kayıt testi
    console.log('\n3. Kullanıcı kayıt testi...');
    const registerResponse = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123456',
        role: 'user'
      })
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Kullanıcı kayıt başarılı:', registerData.userId);
    } else {
      const error = await registerResponse.json();
      console.log('❌ Kullanıcı kayıt hatası:', error.error);
    }

    console.log('\n🎉 Backend testleri tamamlandı!');

  } catch (error) {
    console.error('❌ Test hatası:', error.message);
  }
}

// Backend çalışıyor mu kontrol et
async function checkBackend() {
  try {
    const response = await fetch(`${API_URL}/health`);
    if (response.ok) {
      testBackend();
    } else {
      console.log('❌ Backend çalışmıyor. Lütfen backend\'i başlatın:');
      console.log('cd backend && npm start');
    }
  } catch (error) {
    console.log('❌ Backend bağlantı hatası. Lütfen backend\'i başlatın:');
    console.log('cd backend && npm start');
  }
}

checkBackend();
