// Supabase bağlantı testi
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://haiafkuaamkxudvvhucv.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'your-service-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  console.log('🔍 Supabase bağlantısı test ediliyor...');
  
  try {
    // Test 1: Bağlantı kontrolü
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase bağlantı hatası:', error.message);
      return;
    }
    
    console.log('✅ Supabase bağlantısı başarılı!');
    
    // Test 2: Tabloları kontrol et
    const tables = ['users', 'clinics', 'requests', 'offers', 'messages', 'verification_codes'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`⚠️  ${table} tablosu bulunamadı:`, error.message);
      } else {
        console.log(`✅ ${table} tablosu mevcut`);
      }
    }
    
    // Test 3: Auth kontrolü
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('⚠️  Auth servisi:', authError.message);
    } else {
      console.log('✅ Auth servisi çalışıyor');
    }
    
  } catch (error) {
    console.error('❌ Test hatası:', error.message);
  }
}

testSupabase();


