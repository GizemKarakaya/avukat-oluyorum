# ⚖️ Avukatlık Sınavı Çalışma Planı Generator

Avukatlık sınavına hazırlanan öğrenciler için otomatik çalışma planı oluşturan modern web uygulaması.

## 🎯 Özellikler

- **Otomatik Plan Oluşturma**: Başlangıç ve bitiş tarihi girildiğinde otomatik olarak çalışma planı oluşturur
- **Akıllı Dağılım**: Konuları ağırlıklarına göre çalışma günlerine dağıtır
- **Saat Bazlı Planlama**: Her konu için saat bazlı çalışma planı
- **Konu Takip Listesi**: Tüm konuları işaretleyebileceğiniz checklist
- **Tatil Günleri**: Cuma ve Cumartesi günlerini otomatik olarak tatil olarak işaretler
- **Konu Ağırlık Düzenleme**: Her konunun ağırlığını 1-10 arası ayarlayabilirsiniz
- **Özel Konu Ekleme**: Günlük veya haftalık özel konular ekleyebilirsiniz
- **Haftalık Planlar**: Detaylı haftalık çalışma programı
- **İlerleme Takibi**: Çalıştığınız konuları işaretleyip ilerlemenizi takip edin
- **Export Özellikleri**: PDF, Excel ve CSV formatlarında indirme
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **Modern UI**: Material-UI ile güzel ve kullanıcı dostu arayüz

## 📅 Plan Yapısı

### 1. Hafta (Başlangıç & Genel Tarama)
- Medeni Hukuk, Anayasa Hukuku, Ceza Hukuku
- Borçlar Hukuku, İdare Hukuku, İş Hukuku
- Ticaret Hukuku, Ceza Usulü, Türk Hukuk Tarihi

### 2. Hafta (Derinleşme)
- Medeni Hukuk, Anayasa Hukuku, Anayasa Yargısı
- Borçlar Hukuku, Ceza Hukuku, Vergi Usul
- Ticaret Hukuku, İYUK, Hukuk Felsefesi

### 3. Hafta (Alt Konuları Tamamlama)
- Medeni Hukuk, Ceza Hukuku, Türk Hukuk Tarihi
- Borçlar Hukuku, Ceza Usul, İş Hukuku
- Ticaret Hukuku, İdare Hukuku, Anayasa Hukuku

### 4. Hafta (Genel Tekrar + Eksikler)
- Medeni Hukuk, Ticaret Hukuku, Borçlar Hukuku
- Ceza Hukuku, Ceza Usul, Hukuk Felsefesi
- İdare Hukuku, İYUK, Vergi Usul

### Plan Yapısı 📅
- **Normal Çalışma Dönemi**: Başlangıçtan 15 Eylül'e kadar
  - Konular ağırlıklarına göre saat bazlı dağıtılır
  - Alt konular günlere ve saatlere bölünür
  - Günde 6 saat çalışma planı
  - Tatil günleri hariç tüm günler çalışma günü
  
- **15-28 Eylül**: Tekrar ve Deneme Haftası 📚📝
  - Medeni Hukuk, Borçlar, Ticaret, Ceza, Anayasa, İdare, Hukuk Usulü genel tekrarları
  - 3s Deneme Sınavı (tam süre)
  - 3s Yanlışların Tekrarı
  - Konu Testleri
  - Hızlı Tekrar
  - Özet Notlar
  - Dinlenme + Hafif Tekrar
  - **28 Eylül: SINAV GÜNÜ ⚖️**

## 🎯 Özel Dönemler:

- **Normal Çalışma Dönemi**: Başlangıçtan 15 Eylül'e kadar
  - Konular ağırlıklarına göre saat bazlı dağıtılır
  - Alt konular günlere ve saatlere bölünür
  - Günde 6 saat çalışma planı
  - Tatil günleri hariç tüm günler çalışma günü
  - Özel konular plana dahil edilir

- **15-28 Eylül**: Tekrar ve Deneme Dönemi
  - Tüm ana konuların genel tekrarı
  - Deneme sınavları ve yanlışların tekrarı
  - Konu testleri ve hızlı tekrarlar
  - Özet notlar ve son hazırlık
  - 28 Eylül: SINAV GÜNÜ ⚖️

## ⏰ Saat Bazlı Çalışma Planı:

- **Günlük Çalışma**: 6 saat
- **Konu Ağırlıkları**: Her konunun ağırlığına göre saat dağılımı
- **Alt Konu Dağılımı**: Her alt konu için ayrı saat hesaplaması
- **Görsel Saat Gösterimi**: Her konunun yanında çalışma saati
- **Esnek Planlama**: Konular bitene kadar devam eden sistem

## 📋 Konu Takip Listesi:

- **Tüm Konular**: Bütün konular ve alt başlıkları listede
- **İlerleme Takibi**: Çalıştıkça konuları işaretleyebilme
- **Görsel İlerleme**: Her konu için progress bar
- **Genel İlerleme**: Toplam ilerleme yüzdesi
- **Otomatik Kaydetme**: İlerleme otomatik olarak kaydedilir
- **İlerleme İndirme**: İlerleme durumunu JSON olarak indirebilme
- **Sıfırlama**: Tüm işaretleri tek tıkla sıfırlayabilme

## 📝 Özel Konu Yönetimi:

- **Günlük Konular**: Belirli tarihler için özel konular ekleyebilirsiniz
- **Haftalık Konular**: Belirli haftalar için özel konular ekleyebilirsiniz
- **Öncelik Seviyeleri**: Yüksek, Orta, Düşük öncelik belirleyebilirsiniz
- **Görsel Ayrım**: Özel konular farklı renklerle gösterilir

## 🚀 Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd avukatlik-sinavi-plan
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Uygulamayı başlatın:
```bash
npm start
```

4. Tarayıcınızda `http://localhost:3000` adresini açın

## 🛠️ Teknolojiler

- **React 18** - Modern React hooks ve functional components
- **JavaScript** - Modern JavaScript ES6+
- **Material-UI (MUI)** - Modern UI bileşenleri
- **date-fns** - Tarih işlemleri
- **jsPDF** - PDF export
- **html2canvas** - HTML to canvas conversion
- **xlsx** - Excel export

## 📊 Konu Ağırlıkları

| Konu | Ağırlık | Öncelik |
|------|---------|---------|
| Medeni Hukuk | 10 | Çok Yüksek |
| Borçlar Hukuku | 9 | Çok Yüksek |
| Ticaret Hukuku | 8 | Yüksek |
| Ceza Hukuku | 8 | Yüksek |
| Ceza Usulü | 7 | Yüksek |
| Hukuk Yargılama Usulü | 7 | Yüksek |
| Anayasa Hukuku | 7 | Yüksek |
| Anayasa Yargısı | 6 | Orta |
| İdare Hukuku | 6 | Orta |
| İYUK | 6 | Orta |
| İş Hukuku | 5 | Orta |
| İcra-İflas | 5 | Orta |
| Vergi Hukuku | 4 | Düşük |
| Vergi Usul | 4 | Düşük |
| Avukatlık Hukuku | 4 | Düşük |
| Hukuk Felsefesi | 3 | Düşük |
| Türk Hukuk Tarihi | 3 | Düşük |

## 📱 Kullanım

1. **Tarih Seçimi**: Başlangıç ve bitiş tarihlerini seçin
2. **Ağırlık Düzenleme**: İsteğe bağlı olarak konu ağırlıklarını ayarlayın
3. **Plan Oluştur**: "Plan Oluştur" butonuna tıklayın
4. **İnceleme**: Haftalık planları genişletip detayları görün
5. **Export**: PDF, Excel veya CSV olarak indirin

## 🎨 Özelleştirme

### Konu Ağırlıklarını Değiştirme
- "Ağırlık Düzenle" butonuna tıklayın
- Slider'ları kullanarak ağırlıkları ayarlayın
- Değişiklikler otomatik olarak plana yansır

### Tatil Günlerini Değiştirme
`src/utils/planGenerator.ts` dosyasında `dayOffDays` array'ini düzenleyin:

```typescript
dayOffDays: ['Cuma', 'Cumartesi'] // İstediğiniz günleri ekleyin
```

### Yeni Konu Ekleme
`src/data/subjects.ts` dosyasına yeni konular ekleyebilirsiniz:

```typescript
{
  id: 'yeni-konu',
  name: 'Yeni Konu',
  weight: 5,
  topics: ['Alt konu 1', 'Alt konu 2']
}
```

## 📄 Export Formatları

### PDF
- Yüksek kaliteli baskı için optimize edilmiş
- Sayfa boyutu: A4
- Tüm plan detayları dahil

### Excel
- İki sayfa: Ana plan ve özet
- Filtrelenebilir ve sıralanabilir
- Hücre formatlaması

### CSV
- Basit metin formatı
- Excel veya Google Sheets'te açılabilir
- Veri analizi için uygun

## 🔧 Geliştirme

### Proje Yapısı
```
src/
├── components/          # React bileşenleri
│   ├── StudyPlanTable.js
│   └── SubjectWeightEditor.js
├── data/               # Veri dosyaları
│   └── subjects.js
├── utils/              # Yardımcı fonksiyonlar
│   ├── planGenerator.js
│   └── exportUtils.js
└── App.js              # Ana uygulama
```

### Scripts
```bash
npm start          # Geliştirme sunucusu
npm run build      # Production build
npm test           # Testleri çalıştır
npm run eject      # CRA eject (dikkatli kullanın)
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🙏 Teşekkürler

- Avukatlık sınavına hazırlanan tüm öğrenciler için
- Material-UI ekibine güzel bileşenler için
- React ve TypeScript topluluklarına

---

**Başarılar! 🎓⚖️**
