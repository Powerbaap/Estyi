# API Entegrasyon Planı

## 1. Mock Veri Kullanımı Tespiti

Aşağıdaki dosyalarda mock veri kullanımı tespit edilmiştir:

- `src/contexts/AuthContext.tsx`: Mock kullanıcı ve klinik verileri
- `src/components/Dashboard/MessagesModal.tsx`: Mock mesaj verileri
- `src/components/Messages/MessageList.tsx`: Mock konuşma verileri
- `src/components/Messages/ChatWindow.tsx`: Mock mesaj verileri
- `src/pages/Admin/ChangeControl.tsx`: Mock istatistik verileri
- `src/pages/Reviews.tsx`: Mock değerlendirme verileri
- `src/pages/Search.tsx`: Mock klinik verileri

## 2. Supabase Entegrasyonu

Supabase entegrasyonu için aşağıdaki adımlar izlenmelidir:

1. **Kullanıcı Kimlik Doğrulama**:
   - `AuthContext.tsx` içindeki mock kullanıcı verileri kaldırılmalı
   - Supabase Auth API kullanılarak gerçek kimlik doğrulama yapılmalı

2. **Veri İşlemleri**:
   - Tüm mock veriler, Supabase veritabanı tablolarından gerçek verilerle değiştirilmeli
   - Her bileşen için uygun Supabase sorguları oluşturulmalı

## 3. API Entegrasyon Adımları

### 3.1. Kimlik Doğrulama (AuthContext.tsx)

```typescript
// Mock veriler yerine
const login = async (email: string, password: string, requestedRole?: 'user' | 'clinic' | 'admin') => {
  try {
    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Kullanıcı rolünü kontrol et
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (userError || !userData) {
      return { success: false, error: 'Kullanıcı bilgileri alınamadı' };
    }

    // Eğer belirli bir rol istendiyse ve kullanıcının rolü eşleşmiyorsa
    if (requestedRole && userData.role !== requestedRole) {
      await supabase.auth.signOut();
      return { success: false, error: 'Bu e-posta adresi ile giriş yapamazsınız' };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Giriş yapılırken bir hata oluştu' };
  } finally {
    setIsLoading(false);
  }
};
```

### 3.2. Klinik Talepleri (ClinicRequests.tsx)

```typescript
// Mock veriler yerine
const fetchRequests = async () => {
  try {
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('requests')
      .select(`
        *,
        users:user_id (name, avatar_url)
      `)
      .eq('clinic_id', user?.id);
      
    if (error) {
      console.error('Talepler alınırken hata oluştu:', error);
      return;
    }
    
    setRequests(data || []);
  } catch (error) {
    console.error('Talepler alınırken hata oluştu:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### 3.3. Mesajlaşma (ChatWindow.tsx, MessageList.tsx)

```typescript
// Mock veriler yerine
const fetchConversations = async () => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participants:conversation_participants (user_id),
        last_message:messages (content, created_at, sender_id)
      `)
      .eq('participants.user_id', user?.id)
      .order('last_message.created_at', { ascending: false });
      
    if (error) {
      console.error('Konuşmalar alınırken hata oluştu:', error);
      return;
    }
    
    setConversations(data || []);
  } catch (error) {
    console.error('Konuşmalar alınırken hata oluştu:', error);
  }
};
```

## 4. Öncelikli Entegrasyon Sırası

1. Kimlik doğrulama (AuthContext.tsx)
2. Kullanıcı profili ve klinik profili
3. Talep oluşturma ve görüntüleme
4. Mesajlaşma sistemi
5. Değerlendirmeler ve arama
6. Admin paneli

## 5. Güvenlik Önlemleri

- Tüm API isteklerinde kullanıcı kimlik doğrulaması yapılmalı
- Row Level Security (RLS) politikaları Supabase'de yapılandırılmalı
- Hassas veriler için şifreleme kullanılmalı
- API isteklerinde rate limiting uygulanmalı

## 6. Test Stratejisi

1. Her entegrasyon adımı için birim testleri yazılmalı
2. Entegrasyon testleri ile API çağrıları doğrulanmalı
3. End-to-end testler ile kullanıcı senaryoları test edilmeli