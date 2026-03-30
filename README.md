# Ev Programi

Duvara monte tablet icin tasarlanmis, Turkce arayuze sahip aile gorev ve odul uygulamasi.

## Ozellikler

- Kiosk odakli ana ekran
- Ebeveyn PIN girisi
- Cocuklar icin profil secimi
- Gorev, puan, odul ve haftalik planlama
- Supabase tabanli veri modeli
- Framer Motion animasyonlari ve sesli geri bildirim
- Vercel uzerinde calisacak Next.js yapisi

## Kurulum

1. Bagimliliklari yukleyin:

```bash
npm install
```

2. Ortam degiskenlerini hazirlayin:

```bash
copy .env.example .env.local
```

3. `supabase/schema.sql` dosyasini Supabase SQL Editor uzerinden calistirin.

4. Gelistirme sunucusunu baslatin:

```bash
npm run dev
```

## Gerekli ortam degiskenleri

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SESSION_SECRET`

## Kurulum akisi

Uygulama ilk acilista aile adi, ebeveyn adi ve PIN ile baslangic kurulumu ister. Isterseniz ornek cocuklar, gorevler ve oduller de otomatik olusturulur.

## Kiosk modu

- Android tabletlerde uygulamayi ana ekrana ekleyin.
- iPad icin Safari uzerinden ana ekrana ekleyin.
- Uygulama icindeki `Tam Ekran` dugmesi Fullscreen API destekleyen tarayicilarda tarayici cercevesini gizler.
- Tam kiosk deneyimi icin cihaz seviyesinde tek uygulama modu kullanin.
