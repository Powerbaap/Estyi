import { supabase } from '../lib/supabase';

// Kullanıcı servisleri
export const userService = {
  // Kullanıcı profil bilgilerini getir
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Kullanıcı profilini güncelle
  updateUserProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);
    
    if (error) throw error;
    return data;
  }
};

// Klinik servisleri
export const clinicService = {
  // Klinik profil bilgilerini getir
  getClinicProfile: async (clinicId: string) => {
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .eq('id', clinicId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Klinik profilini güncelle
  updateClinicProfile: async (clinicId: string, updates: any) => {
    const { data, error } = await supabase
      .from('clinics')
      .update(updates)
      .eq('id', clinicId);
    
    if (error) throw error;
    return data;
  },
  
  // Tüm klinikleri getir
  getAllClinics: async () => {
    const { data, error } = await supabase
      .from('clinics')
      .select('*');
    
    if (error) throw error;
    return data;
  }
};

// Talep servisleri
export const requestService = {
  // Kullanıcının taleplerini getir
  getUserRequests: async (userId: string) => {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Klinik için tüm talepleri getir
  getClinicRequests: async () => {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('status', 'active');
    
    if (error) throw error;
    return data;
  },
  
  // Yeni talep oluştur
  createRequest: async (requestData: any) => {
    const { data, error } = await supabase
      .from('requests')
      .insert(requestData)
      .select('*');
    
    if (error) throw error;
    return data;
  }
};

// Teklif servisleri
export const offerService = {
  // Bir talep için teklif oluştur
  createOffer: async (offerData: any) => {
    const { data, error } = await supabase
      .from('offers')
      .insert(offerData);
    
    if (error) throw error;
    return data;
  },
  
  // Kullanıcının aldığı teklifleri getir
  getUserOffers: async (userId: string) => {
    const { data, error } = await supabase
      .from('offers')
      .select('*, requests(*)')
      .eq('requests.user_id', userId);
    
    if (error) throw error;
    return data;
  },
  
  // Kliniğin gönderdiği teklifleri getir
  getClinicOffers: async (clinicId: string) => {
    const { data, error } = await supabase
      .from('offers')
      .select('*, requests(*)')
      .eq('clinic_id', clinicId);
    
    if (error) throw error;
    return data;
  }
};

// Mesajlaşma servisleri
export const messageService = {
  // Konuşma oluştur
  createConversation: async (conversationData: any) => {
    const { data, error } = await supabase
      .from('conversations')
      .insert(conversationData);
    
    if (error) throw error;
    return data;
  },
  
  // Kullanıcının konuşmalarını getir
  getUserConversations: async (userId: string) => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`user_id.eq.${userId},clinic_id.eq.${userId}`);
    
    if (error) throw error;
    return data;
  },
  
  // Mesaj gönder
  sendMessage: async (messageData: any) => {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData);
    
    if (error) throw error;
    return data;
  },
  
  // Konuşmanın mesajlarını getir
  getConversationMessages: async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};