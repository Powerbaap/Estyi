import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Heart, Star } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqItems = [
    {
              question: "Estyi nasıl çalışır?",
        answer: "Estyi, hastaların estetik tedavi taleplerini dünya çapındaki sertifikalı kliniklere iletir. Hastalar fotoğraf ve bilgilerini paylaşır, klinikler teklif gönderir."
    },
    {
      question: "Hizmet ücretli mi?",
              answer: "Hayır, Estyi platformu hastalar için tamamen ücretsizdir. Sadece tedavi ücretlerini kliniklere ödersiniz."
    },
    {
      question: "Verilerim güvende mi?",
      answer: "Evet, tüm verileriniz şifrelenmiş olarak saklanır ve GDPR uyumludur. Kişisel bilgileriniz güvenle korunur."
    },
    {
      question: "Hangi ülkelerde hizmet veriyorsunuz?",
      answer: "Türkiye, Güney Kore, Tayland, Meksika, Brezilya, Almanya, Polonya, Çek Cumhuriyeti, Hindistan ve Dubai'de hizmet veriyoruz."
    },
    {
      question: "Klinik seçimi nasıl yapılır?",
      answer: "Tüm kliniklerimiz sertifikalı ve akreditelidir. Kliniklerin profillerini inceleyebilir, değerlendirmelerini okuyabilirsiniz."
    },
    {
      question: "Tedavi sonrası destek var mı?",
      answer: "Evet, tedavi öncesi ve sonrası sürekli destek sağlıyoruz. Herhangi bir sorunuzda bize ulaşabilirsiniz."
    },
    {
      question: "Ödeme nasıl yapılır?",
      answer: "Ödemeler güvenli ödeme sistemleri üzerinden yapılır. Klinik ile anlaştığınız fiyat üzerinden ödeme yaparsınız."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 sm:py-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 sm:p-12">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Sık Sorulan Sorular
              </h1>
              <p className="text-gray-600 mt-2">Size yardımcı olmak için buradayız</p>
            </div>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200/50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
                >
                  <span className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">{item.question}</span>
                  <div className="flex items-center space-x-2">
                    {openItems.includes(index) ? (
                      <ChevronUp className="w-5 h-5 text-purple-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-purple-500 transition-colors" />
                    )}
                  </div>
                </button>
                {openItems.includes(index) && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed pt-4">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-900">Hala sorunuz mu var?</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Sorularınız için bizimle iletişime geçebilirsiniz. Size en kısa sürede yanıt vereceğiz.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <a 
                href="mailto:support@estyi.com" 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Heart className="w-4 h-4" />
                <span>E-posta Gönder</span>
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-medium border border-purple-200 hover:bg-purple-50 transition-all duration-300"
              >
                <Star className="w-4 h-4" />
                <span>İletişim Sayfası</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;