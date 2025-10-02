import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, MapPin, Star, Clock, DollarSign, Users, Award } from 'lucide-react';

interface Clinic {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  doctors: string[];
  priceRange: string;
  image: string;
  verified: boolean;
  featured: boolean;
}

const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const locations = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana'];
  const specialties = [
    'Botoks', 'Dolgu', 'Burun Estetiği', 'Göz Estetiği', 'Yüz Germe', 
    'Saç Ekimi', 'Lazer Epilasyon', 'Cilt Bakımı', 'Diş Estetiği'
  ];
  const priceRanges = ['0-1000₺', '1000-5000₺', '5000-15000₺', '15000₺+'];

  // Mock data
  useEffect(() => {
    const mockClinics: Clinic[] = [
      {
        id: '1',
        name: 'Estetik Kliniği',
        location: 'İstanbul',
        rating: 4.8,
        reviewCount: 156,
        specialties: ['Botoks', 'Dolgu', 'Burun Estetiği'],
        doctors: ['Dr. Ahmet Yılmaz', 'Dr. Fatma Kaya'],
        priceRange: '1000-5000₺',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop',
        verified: true,
        featured: true
      },
      {
        id: '2',
        name: 'Güzellik Merkezi',
        location: 'Ankara',
        rating: 4.5,
        reviewCount: 89,
        specialties: ['Lazer Epilasyon', 'Cilt Bakımı'],
        doctors: ['Dr. Mehmet Öz'],
        priceRange: '500-2000₺',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
        verified: true,
        featured: false
      },
      {
        id: '3',
        name: 'Plastik Cerrahi Kliniği',
        location: 'İzmir',
        rating: 4.9,
        reviewCount: 234,
        specialties: ['Burun Estetiği', 'Göz Estetiği', 'Yüz Germe'],
        doctors: ['Dr. Zeynep Aydın', 'Dr. Ali Demir'],
        priceRange: '15000₺+',
        image: 'https://images.unsplash.com/photo-1594824475545-9d0c7c4951c1?w=400&h=300&fit=crop',
        verified: true,
        featured: true
      },
      {
        id: '4',
        name: 'Saç Ekim Merkezi',
        location: 'Bursa',
        rating: 4.3,
        reviewCount: 67,
        specialties: ['Saç Ekimi'],
        doctors: ['Dr. Can Yıldız'],
        priceRange: '5000-15000₺',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
        verified: false,
        featured: false
      }
    ];
    setClinics(mockClinics);
  }, []);

  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         clinic.doctors.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = !selectedLocation || clinic.location === selectedLocation;
    const matchesSpecialty = !selectedSpecialty || clinic.specialties.includes(selectedSpecialty);
    const matchesPrice = !priceRange || clinic.priceRange === priceRange;
    const matchesRating = ratingFilter === 0 || clinic.rating >= ratingFilter;

    return matchesSearch && matchesLocation && matchesSpecialty && matchesPrice && matchesRating;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedSpecialty('');
    setPriceRange('');
    setRatingFilter(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Klinik Ara</h1>
          <p className="text-gray-600 mt-2">Size en uygun kliniği bulun</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filtreler</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Temizle
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Klinik, doktor veya tedavi ara..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Konum</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tüm Konumlar</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Specialty */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Uzmanlık</label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tüm Uzmanlıklar</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat Aralığı</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tüm Fiyatlar</option>
                  {priceRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Puan</label>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setRatingFilter(ratingFilter === rating ? 0 : rating)}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        ratingFilter === rating
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex">
                        {renderStars(rating)}
                      </div>
                      <span>ve üzeri</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {filteredClinics.length} Klinik Bulundu
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Size en uygun kliniği seçin
                  </p>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtreler</span>
                </button>
              </div>
            </div>

            {/* Clinics List */}
            <div className="space-y-6">
              {filteredClinics.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Klinik Bulunamadı</h3>
                  <p className="text-gray-600 mb-6">
                    Arama kriterlerinize uygun klinik bulunamadı. Filtrelerinizi değiştirmeyi deneyin.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span>Filtreleri Temizle</span>
                  </button>
                </div>
              ) : (
                filteredClinics.map((clinic) => (
                  <div key={clinic.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="md:w-1/3">
                        <img
                          src={clinic.image}
                          alt={clinic.name}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{clinic.name}</h3>
                              {clinic.verified && (
                                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Doğrulanmış
                                </div>
                              )}
                              {clinic.featured && (
                                <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                  Öne Çıkan
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{clinic.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span>{clinic.rating}</span>
                                <span>({clinic.reviewCount})</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Specialties */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Uzmanlık Alanları</h4>
                          <div className="flex flex-wrap gap-2">
                            {clinic.specialties.map((specialty) => (
                              <span
                                key={specialty}
                                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Doctors */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Doktorlar</h4>
                          <div className="flex flex-wrap gap-2">
                            {clinic.doctors.map((doctor) => (
                              <span
                                key={doctor}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                              >
                                {doctor}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <DollarSign className="w-4 h-4" />
                              <span>{clinic.priceRange}</span>
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                              Detaylar
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                              Randevu Al
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 