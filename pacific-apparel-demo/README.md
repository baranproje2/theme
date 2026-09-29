# Pacific Apparel — Yeni Site Demosu (MVP)

pacapparel.com için hazırlanmış konsept yeniden tasarım. Açık renkli tema; ana sayfa ve ürünler sayfasından oluşuyor.

## Nasıl açılır?

- **En kolayı:** `pacific-apparel-demo.html` (ana sayfa) ve `pacific-apparel-products.html` (ürünler) dosyalarını **aynı klasöre** indir ve ana sayfayı çift tıkla. Tüm görseller dosyaların içinde, iki sayfa birbirine bağlı. İnternet bağlantısı yalnızca fontlar ve animasyonlar için gerekli.
- Bu iki dosyayı WhatsApp ya da e-posta ile doğrudan arkadaşına gönderebilirsin.

## Link olarak paylaşmak

1. https://app.netlify.com/drop adresine git.
2. Bu klasörü (`pacific-apparel-demo`) sürükleyip bırak.
3. Birkaç saniye içinde `https://…netlify.app` gibi bir link verir. Bu linki arkadaşına gönder.

## Ana sayfa (`index.html`)

- Net bir hero: "Your logo, on apparel people actually wear." Gerçek iş fotoğraflarından kolaj, hizmet etiketleri ve temel bilgiler (12 adet minimum, 7–10 gün teslim, üretim öncesi onay)
- Eski sitedeki gerçek müşteri listesiyle kayan "Trusted by" şeridi
- Kaydırdıkça tam ekrana büyüyen atölye fotoğrafı
- Üzerine gelince fotoğraf gösteren hizmet listesi
- **Ürünler bölümü:** tişört, uzun kollu, atlet, acid wash ve kategori linkleri; tamamı ürünler sayfasına gider
- Gerçek "Lilli" nakış fotoğraflarıyla 4 adımlı süreç
- Yatay kayan iş galerisi (her fotoğraf kendi oranında, kırpma yok)
- Eski sitedeki üç müşteri yorumu, teklif formu, SSS

## Ürünler sayfası (`products.html`)

Eski sitenin hizmet ve katalog sayfalarındaki ürünler tek sayfada toplandı:

- Filtre: Tümü / Giyim / Şapka / İş kıyafeti / Çanta & ekstralar / Promosyon
- Tişört & üst giyim, şapkalar, polo/üniforma/iş kıyafetleri, çanta/önlük/monogram, promosyon ürünleri (14 kategori)
- Sözleşmeli fiyatlandırma, katlama/paketleme/etiketleme, minimumsuz dijital baskı
- Eski sitedeki iki tam kataloğa (giyim ve promosyon) bağlantı
- Her üründeki "Request a quote" linki ana sayfadaki teklif formunu ürün adıyla doldurarak açar

## Dosyalar

| Dosya | Açıklama |
|---|---|
| `index.html`, `products.html`, `styles.css`, `main.js` | Kaynak kod |
| `img/` | Mevcut siteden alınıp WebP'ye çevrilmiş fotoğraflar (orijinal boyut ve oranlarında) |
| `pacific-apparel-demo.html`, `pacific-apparel-products.html` | Paylaşım için tek dosya sürümleri (`python3 build-single.py` ile üretilir) |

## Gerçek siteye geçmeden önce

- Fotoğrafların orijinal, yüksek çözünürlüklü halleri ve logonun vektör dosyası (SVG/AI) alınmalı. Özellikle yatay ürün banner'ları (şapka, polo, iş kıyafeti, promosyon) mevcut sitede küçük boyutta.
- Müşteri listesi ve yorumlar eski sitenin nakış sayfasından alındı; güncel olup olmadıkları firmayla teyit edilmeli.
- Min. adet, teslim süresi, ödeme ve kurulum ücreti bilgileri mevcut sitenin SSS ve hizmet sayfalarından alındı.
- Teklif formu şu an e-posta uygulamasını açıyor. Canlı sitede doğrudan gelen kutusuna düşen bir form servisine (ör. Formspree) bağlanabilir.
