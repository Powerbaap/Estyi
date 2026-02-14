/**
 * Talep formu ve klinik başvurusu aynı ülke/şehir listesini kullanır.
 * Eşleştirme: kullanıcı ülke/şehir seçer, klinik kayıtta ülke/şehir seçer.
 */

export const COUNTRY_KEYS = [
  'usa', 'mexico',
  'turkey', 'southKorea', 'thailand', 'brazil', 'colombia',
  'argentina', 'chile', 'peru', 'venezuela', 'ecuador', 'uruguay',
  'paraguay', 'bolivia', 'guyana', 'suriname', 'frenchGuiana',
  'india', 'singapore', 'malaysia', 'indonesia', 'philippines',
  'vietnam', 'cambodia', 'laos', 'myanmar', 'bangladesh', 'sriLanka',
  'nepal', 'bhutan', 'maldives', 'pakistan', 'afghanistan',
  'russia', 'china', 'canada', 'japan', 'germany',
  'unitedKingdom', 'netherlands', 'sweden'
] as const;

export type CountryKey = typeof COUNTRY_KEYS[number];

export const TURKISH_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin', 'Aydın',
  'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa',
  'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce',
  'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane',
  'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir',
  'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kilis',
  'Kocaeli', 'Konya', 'Kütahya',
  'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye',
  'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak',
  'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli',
  'Uşak', 'Van',
  'Yalova', 'Yozgat', 'Zonguldak'
];

export const CITY_OPTIONS: Record<string, string[]> = {
  turkey: TURKISH_CITIES,
  southKorea: [
    'Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Ulsan', 'Sejong',
    'Suwon', 'Seongnam', 'Goyang', 'Yongin', 'Bucheon', 'Ansan', 'Anyang', 'Cheongju',
    'Jeonju', 'Cheonan', 'Gimhae', 'Pohang', 'Gumi', 'Uijeongbu', 'Hwaseong', 'Pyeongtaek',
    'Jeju', 'Mokpo', 'Gunsan', 'Gwangmyeong', 'Yangsan', 'Jinju', 'Wonju', 'Chungju',
    'Sokcho', 'Gangneung', 'Paju', 'Gimpo', 'Icheon', 'Asan', 'Dangjin', 'Naju', 'Yeosu',
    'Andong', 'Gyeongju', 'Samcheok', 'Donghae', 'Taebaek', 'Geoje', 'Tongyeong', 'Masan',
    'Suncheon', 'Jeongeup', 'Gyeongsan', 'Miryang', 'Yeongju', 'Boryeong', 'Hongseong', 'Goesan'
  ],
  thailand: ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Chiang Rai'],
  brazil: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Belo Horizonte', 'Curitiba'],
  mexico: ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Cancún'],
  colombia: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'],
  germany: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
  usa: [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
    'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington',
    'Boston', 'El Paso', 'Nashville', 'Detroit', 'Oklahoma City', 'Portland', 'Las Vegas', 'Memphis', 'Louisville', 'Baltimore',
    'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Mesa', 'Sacramento', 'Atlanta', 'Kansas City', 'Colorado Springs', 'Miami',
    'Raleigh', 'Omaha', 'Long Beach', 'Virginia Beach', 'Oakland', 'Minneapolis', 'Tulsa', 'Arlington', 'Tampa', 'New Orleans',
    'Montgomery', 'Juneau', 'Little Rock', 'Hartford', 'Dover', 'Tallahassee', 'Honolulu', 'Boise', 'Springfield', 'Des Moines',
    'Topeka', 'Frankfort', 'Baton Rouge', 'Augusta', 'Annapolis', 'Lansing', 'Saint Paul', 'Jackson', 'Jefferson City', 'Helena',
    'Lincoln', 'Carson City', 'Concord', 'Trenton', 'Santa Fe', 'Albany', 'Bismarck', 'Salem', 'Harrisburg', 'Providence', 'Columbia',
    'Pierre', 'Salt Lake City', 'Montpelier', 'Richmond', 'Olympia', 'Charleston', 'Madison', 'Cheyenne'
  ],
  unitedKingdom: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow'],
  netherlands: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'],
  sweden: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås'],
  canada: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
  japan: ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo'],
  russia: ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan'],
  china: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Hangzhou'],
  india: ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad'],
  malaysia: ['Kuala Lumpur', 'George Town', 'Johor Bahru', 'Ipoh', 'Kuching'],
  singapore: ['Singapore'],
  argentina: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata'],
  chile: ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta'],
  peru: ['Lima', 'Arequipa', 'Trujillo', 'Cusco', 'Chiclayo'],
  vietnam: ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Haiphong', 'Can Tho'],
  indonesia: ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang'],
  philippines: ['Manila', 'Cebu City', 'Davao City', 'Quezon City', 'Caloocan']
};
