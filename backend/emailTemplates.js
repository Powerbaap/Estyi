// Email şablonları
export const emailTemplates = {
  // Kayıt doğrulama emaili
  verification: (code, userName = 'Kullanıcı') => ({
    subject: 'Estyi - Email Doğrulama Kodu',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🏥 Estyi</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Email Doğrulama</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Merhaba ${userName}! 👋</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Estyi hesabınızı doğrulamak için aşağıdaki kodu kullanın:
          </p>
          
          <div style="background: #f8f9fa; border: 2px dashed #dee2e6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${code}
            </span>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>⏰ Süre:</strong> Bu kod 15 dakika geçerlidir<br>
              <strong>🔒 Güvenlik:</strong> Kodunuzu kimseyle paylaşmayın
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Eğer bu işlemi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
          <p>Bu email Estyi hesap doğrulama işlemi için gönderilmiştir.</p>
          <p>&copy; 2024 Estyi. Tüm hakları saklıdır.</p>
        </div>
      </div>
    `
  }),

  // Şifre sıfırlama emaili
  passwordReset: (code, userName = 'Kullanıcı') => ({
    subject: 'Estyi - Şifre Sıfırlama Kodu',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🔐 Estyi</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Şifre Sıfırlama</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Merhaba ${userName}! 🔑</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Şifrenizi sıfırlamak için aşağıdaki kodu kullanın:
          </p>
          
          <div style="background: #f8f9fa; border: 2px dashed #dee2e6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; color: #dc3545; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${code}
            </span>
          </div>
          
          <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #721c24; font-size: 14px;">
              <strong>⚠️ Güvenlik Uyarısı:</strong> Bu işlemi siz yapmadıysanız, hesabınızı kontrol edin!
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Kod 15 dakika geçerlidir. Güvenliğiniz için kodunuzu kimseyle paylaşmayın.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
          <p>Bu email Estyi şifre sıfırlama işlemi için gönderilmiştir.</p>
          <p>&copy; 2024 Estyi. Tüm hakları saklıdır.</p>
        </div>
      </div>
    `
  }),

  // Hoş geldin emaili
  welcome: (userName = 'Kullanıcı') => ({
    subject: 'Estyi\'ye Hoş Geldiniz! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #00b894 0%, #00a085 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Estyi</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Hoş Geldiniz!</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Merhaba ${userName}! 👋</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Estyi ailesine katıldığınız için teşekkür ederiz! Artık sağlık hizmetlerine daha kolay erişebilirsiniz.
          </p>
          
          <div style="background: #e8f5e8; border: 1px solid #c3e6c3; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #155724; margin-top: 0;">🚀 Neler Yapabilirsiniz?</h3>
            <ul style="color: #155724; margin: 0; padding-left: 20px;">
              <li>Klinikleri arayın ve inceleyin</li>
              <li>Randevu talep edin</li>
              <li>Kliniklerle mesajlaşın</li>
              <li>Değerlendirmelerinizi paylaşın</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'https://your-app.vercel.app'}" 
               style="background: #00b894; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Estyi'yi Keşfet 🏥
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Herhangi bir sorunuz olursa, bizimle iletişime geçmekten çekinmeyin!
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
          <p>Bu email Estyi hoş geldin mesajıdır.</p>
          <p>&copy; 2024 Estyi. Tüm hakları saklıdır.</p>
        </div>
      </div>
    `
  })
};


