# Pacific Apparel — Yeni Site Demosu (MVP)

pacapparel.com için hazırlanmış konsept yeniden tasarım. Tek sayfalık, animasyonlu bir ana sayfa.

## Nasıl açılır?

- **En kolayı:** `pacific-apparel-demo.html` dosyasını indir ve çift tıkla. Tüm görseller dosyanın içinde. İnternet bağlantısı yalnızca fontlar ve animasyonlar için gerekli.
- Bu dosyayı WhatsApp ya da e-posta ile doğrudan arkadaşına gönderebilirsin. Bilgisayarda açılması önerilir, telefonda da çalışır.

## Link olarak paylaşmak

1. https://app.netlify.com/drop adresine git.
2. Bu klasörü (`pacific-apparel-demo`) sürükleyip bırak.
3. Birkaç saniye içinde `https://…netlify.app` gibi bir link verir. Bu linki arkadaşına gönder.

## Neler var?

- Açılış animasyonu, dev tipografili hero ve hareketli "iplik" çizgisi
- Kaydırdıkça tam ekrana büyüyen atölye fotoğrafı ("Made on Mission Blvd.")
- Kaydırdıkça beliren manifesto metni
- Üzerine gelince imleci takip eden fotoğraflı hizmet listesi
- Gerçek "Lilli" nakış fotoğraflarıyla 4 adımlı süreç anlatımı
- Yatay kayan iş galerisi (Wavehouse, Karl Strauss, Rabbit Hole, Crack Shack…)
- **Logo Lab:** Ziyaretçi logosunu yükler ya da marka adını yazar, tişört rengini, nakış/baskı tekniğini ve yerleşimi canlı olarak dener
- Teklif formu: Ürün, teknik ve adet seçilir; minimum adet uyarısı verir, talep info@pacapparel.com'a e-posta olarak hazırlanır
- SSS (mevcut sitedeki gerçek cevaplar), San Diego yerel saati, dev "PACIFIC" footer

## Dosyalar

| Dosya | Açıklama |
|---|---|
| `index.html`, `styles.css`, `main.js` | Kaynak kod |
| `img/` | Mevcut siteden alınıp WebP'ye çevrilmiş iş fotoğrafları |
| `pacific-apparel-demo.html` | Paylaşım için tek dosya sürümü (`python3 build-single.py` ile üretilir) |

## Gerçek siteye geçmeden önce

- Fotoğrafların orijinal, yüksek çözünürlüklü halleri ve logonun vektör dosyası (SVG/AI) alınmalı. Şu an sitedeki küçük görseller kullanılıyor.
- "Stitched for" şeridindeki marka isimleri iş fotoğraflarından alındı. Referans olarak gösterilmelerinde sakınca olmadığı firmayla teyit edilmeli.
- Min. adet, teslim süresi, ödeme ve kurulum ücreti bilgileri mevcut sitenin SSS sayfasından alındı. Güncel olup olmadıkları kontrol edilmeli.
- Teklif formu şu an e-posta uygulamasını açıyor. Canlı sitede doğrudan gelen kutusuna düşen bir form servisine (ör. Formspree) bağlanabilir.
