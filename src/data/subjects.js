export const subjects = [
  {
    id: 'medeni-hukuk',
    name: 'Medeni Hukuk',
    weight: 10,
    topics: [
      'Genel Esaslar, Kişiler Hukuku',
      'Aile Hukuku (nişan, evlenme, boşanma)',
      'Eşya Hukuku: Mülkiyet, Zilyetlik',
      'Mal Rejimleri, Nafaka',
      'Miras: Yasal Mirasçılık, Atanmış Mirasçılık',
      'Mirasın Paylaşılması, Reddi Miras',
      'Genel Tekrar (Kişiler + Aile)',
      '4. Hafta: Medeni Hukuk Genel Tekrar',
      '5. Hafta: Medeni Hukuk Deneme Sınavı'
    ]
  },
  {
    id: 'borclar-hukuku',
    name: 'Borçlar Hukuku',
    weight: 9,
    topics: [
      'Borcun Kaynağı',
      'Borcun İfası, Sona Ermesi',
      'Borçlunun Sorumluluğu, Temerrüt',
      'Sözleşmenin Hükümsüzlüğü',
      'Özel Borç İlişkileri (Satım, Kira)',
      'Özel Borç İlişkileri (Vekalet, Hizmet)',
      'Genel Hükümler Tekrarı'
    ]
  },
  {
    id: 'ticaret-hukuku',
    name: 'Ticaret Hukuku',
    weight: 8,
    topics: [
      'Ticari İşletme, Tacir ve Yardımcılar',
      'Şirketler Hukuku (Kollektif, Komandit)',
      'Şirketler (Anonim, Limited)',
      'Kıymetli Evrak (Bono, Poliçe, Çek)'
    ]
  },
  {
    id: 'ceza-hukuku',
    name: 'Ceza Hukuku',
    weight: 8,
    topics: [
      'Suçun Unsurları',
      'Kast, Taksir, Kusurluluk',
      'Hukuka Uygunluk Sebepleri',
      'Suçların İçtimaı, Yaptırımlar'
    ]
  },
  {
    id: 'ceza-usul',
    name: 'Ceza Usulü',
    weight: 7,
    topics: [
      'Temel İlkeler',
      'Soruşturma Evresi',
      'Kovuşturma Evresi'
    ]
  },
  {
    id: 'hukuk-usul',
    name: 'Hukuk Yargılama Usulü',
    weight: 7,
    topics: [
      'Kavramlar, Görev-Yetki',
      'Dava Açma, Taraflar',
      'Dava Şartları, İlk İtirazlar',
      'Deliller, Hüküm, Kesin Hüküm'
    ]
  },
  {
    id: 'anayasa-hukuku',
    name: 'Anayasa Hukuku',
    weight: 7,
    topics: [
      'Temel Kavramlar, Anayasa Türleri',
      '1982 Anayasası Genel Esaslar, Devletin Temel Nitelikleri',
      'Temel Hak ve Özgürlükler',
      'Yasama, Yürütme, Yargı',
      'Cumhurbaşkanlığı Sistemi, OHAL'
    ]
  },
  {
    id: 'anayasa-yargisi',
    name: 'Anayasa Yargısı',
    weight: 6,
    topics: [
      'Kuruluş ve Görevler'
    ]
  },
  {
    id: 'idare-hukuku',
    name: 'İdare Hukuku',
    weight: 6,
    topics: [
      'İdarenin Örgütlenmesi',
      'Kamu Görevlileri, Kamu Hizmeti',
      'İdari İşlemler, İdari Sözleşmeler',
      'Kamu Malları, Kolluk Faaliyeti'
    ]
  },
  {
    id: 'iyuk',
    name: 'İYUK',
    weight: 6,
    topics: [
      'Dava Türleri',
      'Yürütmenin Durdurulması, Yargı Yolları'
    ]
  },
  {
    id: 'is-hukuku',
    name: 'İş Hukuku',
    weight: 5,
    topics: [
      'İş Sözleşmesi ve Türleri',
      'İşverenin Borçları',
      'Sona Erme, Tazminatlar'
    ]
  },
  {
    id: 'icra-iflas',
    name: 'İcra-İflas',
    weight: 5,
    topics: [
      'İlamsız İcra',
      'İlâmlı İcra, Haciz',
      'İflas, Konkordato'
    ]
  },
  {
    id: 'vergi-hukuku',
    name: 'Vergi Hukuku',
    weight: 4,
    topics: [
      'Vergi Borcu, Mükellefiyet',
      'Vergi Alacağının Doğması'
    ]
  },
  {
    id: 'vergi-usul',
    name: 'Vergi Usul',
    weight: 4,
    topics: [
      'Vergilendirme Süreci',
      'Vergi Denetimi, Hatalar'
    ]
  },
  {
    id: 'avukatlik-hukuku',
    name: 'Avukatlık Hukuku',
    weight: 4,
    topics: [
      'Mesleğe Giriş Şartları',
      'Avukatın Hak ve Yükümlülükleri',
      'Meslek Kuralları, Barolar',
      'Avukatlık Ücreti'
    ]
  },
  {
    id: 'hukuk-felsefesi',
    name: 'Hukuk Felsefesi',
    weight: 3,
    topics: [
      'Hukukun Tanımı, Adalet Kavramı',
      'Hukuk ve Ahlak, Akımlar',
      'Hukuk Sosyolojisi'
    ]
  },
  {
    id: 'turk-hukuk-tarihi',
    name: 'Türk Hukuk Tarihi',
    weight: 3,
    topics: [
      'İslamiyet Öncesi, Selçuklu',
      'Mecelle ve Tanzimat'
    ]
  }
];

export const weekDescriptions = [
  'Başlangıç & Genel Tarama',
  'Derinleşme',
  'Alt Konuları Tamamlama',
  'Genel Tekrar + Eksikler',
  'Deneme Haftası',
  'Son Hazırlık'
];
