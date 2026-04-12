// Hareket açıklamaları — programa sadık
export const DESCRIPTIONS = {
  'Decline Push-Up': {
    target: 'Üst göğüs (clavicular head)',
    equipment: 'Sandalye + zemin',
    why: 'Ayaklar yüksekte olduğu için vücut açısı değişir ve üst göğüs kasına maksimum gerilim oluşturur.',
    prep: [
      'Sandalyeyi duvara daya ki kaymasın.',
      'Ayak parmaklarını sandalyenin oturma kısmına koy.',
      'Ellerini yere koy, omuz genişliğinde aç, parmak uçları ileri baksın.',
    ],
    steps: [
      'Kollarını düzleştirerek başlangıç pozisyonuna geç.',
      'Kuyruk sokumunu hafifçe içeri topla (pelvik tilt) — kalça sıkışmasına karşı koruma.',
      'Vücudun baştan ayağa düz bir çizgi oluşturmalı.',
      'Çeneni hafifçe içeri çek (mini chin tuck) — boyun düzleşmesi için.',
      'Nefes al ve 3 saniyede yavaşça göğsünü yere doğru indir.',
      'Dirseklerin vücudunla 45° açı yapmalı.',
      'Göğsün yerden 3-5 cm yukarıda olunca 1 saniye bekle.',
      'Nefes ver, 1 saniyede kendini yukarı it. Kolların tam düzleşsin ama dirsekleri kilitleme.',
    ],
    errors: [
      'Kalçanı düşürme → bel çökmesi = bel ağrısı.',
      'Başını yukarı kaldırma → boyun gerginliği, boyun düzleşmesini kötüleştirir.',
      'Çok hızlı inme → kas aktivasyonu düşer.',
      'Pelvik tilt\'i unutmak → core aktivasyonu %400 düşer.',
    ],
  },

  'Band Row': {
    target: 'Sırt kütlesi (lat, rhomboid, orta trapez) — POSTÜR İÇİN KRİTİK',
    equipment: 'Direnç bandı + sabit bağlantı noktası',
    why: 'Omuzları arkaya çeken kasları güçlendirir. Postür bozulmasının en önemli panzehiri.',
    prep: [
      'Bandı göğüs hizasında sağlam bir yere bağla (kapı kolu, ağır mobilya ayağı).',
      'Alternatif: Bandı ayaklarının altına al, öne eğilerek yap.',
      'Bandın iki ucunu tut, geriye adım at, bandda gerginlik olsun.',
      'Ayaklar omuz genişliğinde, dizler hafif bükük.',
    ],
    steps: [
      'Gövdeni dik tut, omuzları aşağıda ve geride.',
      'Nefes ver, dirseklerini geriye çek — sanki dirseklerle birini itiyormuşsun gibi.',
      'Kürek kemiklerini birbirine sıkıştır.',
      'Bandı göbek hizasına getir, eller yanlarına değsin.',
      '1 saniye bekle — kürek kemiklerindeki sıkışmayı hisset.',
      '2 saniyede kontrollü şekilde kolları ileri uzat.',
    ],
    errors: [
      'Omuzları yukarı kaldırmak → üst trapez çalışır, hedef kaslar devre dışı kalır.',
      'Gövdeyi arkaya savurmak → momentum kullanmak, kas aktivasyonu düşer.',
      'Dirsekleri çok yukarı çekmek → karın hizasında kalsın.',
      'Kolların gücüyle çekmek → hareket sırttan gelmeli.',
    ],
    tip: '"Dirseklerimle arkadakini dürtüyorum" hissiyle çek. Bu lat ve rhomboidleri izole eder.',
  },

  'Chest Dip': {
    target: 'Alt göğüs (abdominal head) — alt göğüs için en etkili hareket',
    equipment: '2 sandalye + duvar',
    why: 'Vücut öne eğildiğinde yük alt göğüse kayar. Dik durulursa triceps hareketi olur.',
    prep: [
      '2 sandalyeyi paralel koy, aralarında omuz genişliğinden biraz fazla boşluk bırak.',
      'Sandalyeleri duvara daya.',
      'Her iki sandalyenin oturma kısmına ellerini koy.',
      'Kollarını düzleştirerek kendini yukarı kaldır.',
      'Dizlerini hafif bük, ayakları arkada çaprazla.',
    ],
    steps: [
      'Gövdeni 30° öne eğ — bu kritik, dik durursan triceps çalışır.',
      'Kuyruk sokumunu içeri topla (pelvik tilt).',
      'Nefes al, 3 saniye boyunca dirseklerini bükerek yavaşça indir.',
      'Dirseklerin hafif yana açılsın (45° civarı).',
      'Üst kolların yerle paralel olana kadar in.',
      'Alt noktada 1 saniye bekle — göğüs kaslarında gerilmeyi hisset.',
      'Nefes ver, 1 saniyede kendini yukarı it.',
    ],
    errors: [
      'Dik durmak → göğüs yerine triceps çalışır.',
      'Çok derin inmek → omuz eklemi zorlanır.',
      'Sandalyelerin kaymasına izin vermek → önce sabitle.',
    ],
  },

  'Band Pull-Apart': {
    target: 'Arka deltoid + rhomboidler + orta trapez',
    equipment: 'Direnç bandı',
    why: 'Omuz sağlığı ve postür için kritik. Göğüs kaslarının sürekli çalıştığı bir programın olmazsa olmazı.',
    prep: [
      'Ayakta dur, ayaklar omuz genişliğinde.',
      'Direnç bandını iki elle tut, avuç içleri aşağı baksın.',
      'Kollarını göğüs hizasında düz ileri uzat.',
      'Ellerin arasında omuz genişliğinden biraz fazla mesafe olsun.',
    ],
    steps: [
      'Omuzlarını aşağı ve arkaya çek.',
      'Nefes ver, 2 saniyede bandı iki yana doğru aç.',
      'Kolların vücudunla aynı hizaya gelene kadar aç — T şekli.',
      'Kürek kemiklerini sık, 1 saniye tut.',
      '2 saniyede kontrollü şekilde başlangıca dön.',
      'Band sürekli gergin kalmalı.',
    ],
    errors: [
      'Omuzları yukarı kaldırmak → üst trapez devreye girer.',
      'Beli geriye esnetmek → hareket izole olmaz.',
      'Dirsekleri bükmek → rowing hareketi olur.',
      'Hızlı ve kontrolsüz yapmak → momentum, kas aktivasyonu düşer.',
    ],
  },

  'Banded Chest Fly': {
    target: 'İç göğüs + horizontal adduksiyon — klasik şınavların eksik bıraktığı fonksiyon',
    equipment: 'Direnç bandı + sabit bağlantı noktası',
    why: 'Klasik şınavlar itme hareketidir, kolları orta hatta getirmez. Fly bu eksikliği kapatır. İç göğüs dolgunluğu için vazgeçilmez.',
    prep: [
      'Bandı arkanda göğüs hizasında bir yere bağla.',
      'Alternatif: Bandı sırtının üst kısmından geçir, iki ucu ellerinde.',
      'Bandın iki ucunu tut, ileri adım at, bandda gerginlik olsun.',
      'Kolları yana açık, hafif bükük (neredeyse düz). Gövde hafif öne eğik.',
    ],
    steps: [
      'Göğüs dik, omuzlar aşağıda.',
      'Nefes ver, 2 saniyede kollarını öne doğru bir yay çizerek birleştir.',
      'Kollar göbeğinin önünde birleşmeli, eller neredeyse değecek.',
      'En ön noktada 2 saniye sıkıştır — göğüs kaslarını bilinçli olarak sık.',
      '2 saniyede kontrollü şekilde kolları geri aç.',
      'Kolları fazla geriye açma — göğüsten gerilme hissi kaybolmasın.',
    ],
    errors: [
      'Dirsekleri aşırı bükmek → bicep curl\'e döner.',
      'Dirsekleri aşırı düzleştirmek → dirsek eklemi zorlanır, hafif bükük kal.',
      'Hareketi çok hızlı yapmak → 2-2-2 tempo kritik.',
      'Tepe noktada sıkıştırmayı unutmak → bu hareketin en önemli kısmı.',
    ],
    tip: 'İlk hafta bandsız öğren — kolları yana aç, öne getir, sıkıştır. Sonra band ekle.',
  },

  'Pike Push-Up': {
    target: 'Ön deltoid (omuz genişliği)',
    equipment: 'Zemin',
    why: 'Vücut ters V pozisyonunda olduğundan yük dikey yönde omuzlara biner. Baş üstü kuvvetinin temel hareketi.',
    prep: [
      'Yere ellerini omuz genişliğinde koy.',
      'Ayaklarını ellere doğru yürüt, kalçanı tavana doğru yükselt.',
      'Vücudun ters V şekli oluşturmalı.',
      'Başın kolların arasında, aşağıya bak.',
    ],
    steps: [
      'Nefes al, 2 saniyede başını yere doğru indir.',
      'Dirseklerin yana doğru açılsın.',
      'Başının üstü neredeyse yere değecek noktaya gel.',
      'Beklemeden nefes vererek 1 saniyede kendini yukarı it.',
    ],
    errors: [
      'Kalçayı düşürmek → hareketi bozar, omuz aktivasyonu düşer.',
      'Başı yere vurmak → tempo kontrolsüz.',
      'Kalça ne kadar yüksek → omuzlara o kadar çok yük biner (daha zor = daha iyi).',
    ],
  },

  'Band Face Pull': {
    target: 'Alt trapez + arka deltoid + rotator cuff — POSTÜR İÇİN EN ÖNEMLİ',
    equipment: 'Direnç bandı + sabit bağlantı noktası',
    why: 'Öne düşen omuzları düzeltir. Rotator cuff\'u güçlendirir. Boyun düzleşmesiyle birlikte en kritik düzeltici hareket.',
    prep: [
      'Bandı göğüs-yüz hizasında bir yere bağla.',
      'Alternatif: Bandı ayak altına al, öne eğil (45°).',
      'Bandın iki ucunu tut, bir adım geriye git.',
      'Ayaklar omuz genişliğinde.',
    ],
    steps: [
      'Nefes ver, bandı yüzüne doğru çek.',
      'Dirseklerini yukarı ve yana aç — dirsekler omuz hizasına gelmeli.',
      'Ellerin kulakların hizasına geldiğinde bandı dışa doğru ayır.',
      'Kürek kemiklerini sık, 1 saniye tut.',
      '2 saniyede kontrollü şekilde ileri uzat.',
    ],
    errors: [
      'Bandı karına doğru çekmek → yüz hizasında olmalı.',
      'Dirsekleri aşağıda tutmak → arka deltoid devre dışı kalır.',
      'Omuzları yukarı kaldırmak → üst trapez devreye girer.',
    ],
  },

  'Dead Bug': {
    target: 'Core + pelvik kontrol (kalça sıkışmasına uygun)',
    equipment: 'Zemin',
    why: 'Belin yere basmasını öğretir. Pelvik kontrolü geliştirir. Kalça sıkışması olan kişiler için güvenli core çalışması.',
    prep: [
      'Sırtüstü yat.',
      'Kollarını tavana doğru uzat.',
      'Dizlerini 90° bük, baldırların yerle paralel.',
      'Belini yere yapıştır — bel ile yer arasında boşluk olmamalı.',
    ],
    steps: [
      'Nefes al, belinin yere bastığından emin ol.',
      'Nefes verirken aynı anda sağ kolunu başının üstüne ve sol bacağını yere doğru uzat.',
      'Ne kol ne bacak yere değsin.',
      'Belin yerden kalkmadığından emin ol — bu en kritik nokta.',
      'Kontrollü şekilde geri gel.',
      'Diğer tarafla tekrarla.',
    ],
    errors: [
      'Belin yerden kalkması → hareketi daha küçük yap.',
      'Çok hızlı yapmak → momentum, core aktivasyonu düşer.',
      'Nefes tutmak → sürekli nefes almaya devam et.',
    ],
  },

  'Pseudo Planche Push-Up': {
    target: 'Alt göğüs + ön omuz — ileri seviye hareket',
    equipment: 'Zemin',
    why: 'Eller normal push-up pozisyonundan aşağı kaydırılır. Bu vücudu öne eğerek ağırlık merkezini değiştirir ve yükü alt göğüse yönlendirir.',
    prep: [
      'Normal push-up pozisyonu.',
      'Ellerini aşağı kaydır — eller kalça/bel hizasında.',
      'Parmakların yana veya hafif arkaya baksın.',
      'ÖNCE BİLEK ISITMASI YAP: 30 sn bilek çevirme.',
    ],
    steps: [
      'Ayak bileklerini gererek omuzlarını ellerin önüne taşı — vücut öne eğilmeli.',
      '2 saniyede dirsekleri bükerek göğsünü yere doğru indir.',
      'Dirseklerin vücuda yakın kalsın.',
      'Göğsün yere yaklaşınca 1 saniye bekle.',
      '1 saniyede yukarı it.',
    ],
    errors: [
      'Elleri normal push-up pozisyonunda bırakmak → sıradan push-up olur.',
      'Öne eğilmemek → yük değişmez.',
      'Bilekleri ısıtmamak → bilekler zorlanır.',
      'İleri seviye hareket — 6 tekrarla başla, acele etme.',
    ],
  },

  'Push-Up to T-Rotation': {
    target: 'Orta göğüs + core rotasyonu',
    equipment: 'Zemin',
    why: 'Push-up sonrası T rotasyonu eklemek harekete stabilizasyon bileşeni katar. Core\'u 3 boyutlu çalıştırır.',
    prep: [
      'Normal push-up başlangıç pozisyonu.',
      'Ayakları hafif açmak dengeyi artırır.',
    ],
    steps: [
      'Normal bir push-up yap (2 sn in, 1 sn çık).',
      'En üste çıkınca sağ kolunu tavana kaldır, gövdeni döndür — T şekli.',
      '1 saniye tut, geri dön.',
      'Bir push-up daha yap, bu sefer sol kolunu kaldır.',
      'Her iki taraf = 1 tekrar sayılır.',
    ],
    errors: [
      'Kalçanın düşmesi → core sıkı tutulmalı.',
      'Çok hızlı dönmek → kontrollü dönüş önemli.',
    ],
  },

  'Bird Dog': {
    target: 'Core + kalça sağlığı (kalça sıkışmasına uygun)',
    equipment: 'Zemin',
    why: 'Kalça eklemini nötr pozisyonda tutar. Core ve kalça stabilizasyonunu aynı anda çalıştırır.',
    prep: [
      'Dört ayak pozisyonu.',
      'Eller omuz altında, dizler kalça altında.',
      'Sırt düz.',
    ],
    steps: [
      'Core sık, sırtını sabit tut.',
      'Sağ kolunu ileri + sol bacağını geriye uzat.',
      'Kol, sırt, bacak tek düz çizgi oluşturmalı.',
      '3 saniye bekle.',
      'Kontrollü şekilde geri gel.',
      'Diğer tarafla tekrarla.',
    ],
    errors: [
      'Kalçanın yana kayması → yavaş yap, sırtı sabit tut.',
      'Bacağı çok yukarı kaldırmak → kalça hizasında tut, kalça sıkışmasını tetikler.',
    ],
  },

  'Glute Bridge': {
    target: 'Kalça sağlığı (kalça sıkışmasına uygun — sığ açı)',
    equipment: 'Zemin',
    why: 'Kalça sıkışması olan kişiler için ayak pozisyonu kritik. Ayakları kalçadan uzak tutmak açıyı azaltır.',
    prep: [
      'Sırtüstü, dizler bükük, ayaklar yerde.',
      'Ayakları kalçadan biraz uzağa koy — dizler 90°\'nin altında kalmalı.',
    ],
    steps: [
      '2 saniyede kalçanı yukarı kaldır.',
      'Kalça, diz, omuz düz çizgi oluşturmalı.',
      'Kalçayı sık, 2 saniye bekle.',
      '1 saniyede yavaşça indir.',
    ],
    errors: [
      'Kalçayı çok yukarı kaldırmak → bel hiperekstansiyonu.',
      'Ayakları kalçaya çok yakın koymak → kalça sıkışmasını tetikler.',
      'Kalçanda sızı hissedersen ayakları biraz daha uzağa koy.',
    ],
  },

  'Archer Push-Up': {
    target: 'Orta göğüs unilateral (tek taraflı yükleme) — ileri seviye',
    equipment: 'Zemin',
    why: 'Tek taraflı yükleme daha derin kas aktivasyonu sağlar. Vücudun zayıf tarafını dengeler.',
    prep: [
      'Çok geniş push-up pozisyonu — eller omuz genişliğinin 2-2.5 katı.',
      'Vücut düz, core sıkı.',
    ],
    steps: [
      '2 saniyede vücudunu sağ eline doğru indir.',
      'Sağ kol bükülür, sol kol neredeyse düz kalmalı.',
      'Göğsün sağ eline yaklaşsın.',
      'Alt noktada 1 saniye bekle.',
      '1 saniyede sağ kolunla yukarı it.',
      'Seti bir tarafla bitir, sonra diğer tarafa geç.',
    ],
    errors: [
      'Düz kalan kolu bükmek → hareketi bozar.',
      'Kalçanın düşmesi → core sıkı tutulmalı.',
      'Çok zorsa düz kol için kitap/yükseltme kullan.',
    ],
  },

  'Diamond Push-Up': {
    target: 'İç göğüs + üst göğüs + triceps',
    equipment: 'Zemin',
    why: 'Ellerin yakın pozisyonu iç göğüse ve tricepsa odaklanır. Göğsün orta çizgisini çalıştıran nadir hareketlerden biri.',
    prep: [
      'Push-up pozisyonu.',
      'Eller üçgen (elmas) şeklinde, göğüs hizasında.',
    ],
    steps: [
      '2 saniyede göğsünü ellerine indir.',
      'Dirsekler vücuduna yakın — yana açılmasın.',
      'Göğsün ellerine değsin.',
      '1 saniye bekle.',
      '1 saniyede yukarı it.',
    ],
    errors: [
      'Dirsekleri yana açmak → göğüs yerine omuz çalışır.',
      'Çok zorsa elleri biraz ayır, kademeli olarak yaklaştır.',
    ],
  },

  'Tricep Dip': {
    target: 'Triceps (direkt izolasyon)',
    equipment: 'Sandalye',
    why: 'Sandalye dip hareketi tricepsu izole eder. Tüm push hareketlerinde destek görevi gören bu kasın direkt çalışması.',
    prep: [
      'Sandalye arkanda, duvara dayalı.',
      'Ellerini sandalyenin kenarına koy, parmaklar öne.',
      'Bacakların düz, topuklar yerde.',
    ],
    steps: [
      '2 saniyede dirsekleri bükerek in.',
      'Dirseklerin arkaya bükülmeli — yana değil.',
      'Üst kollar yerle paralel.',
      '1 saniye bekle.',
      '1 saniyede yukarı çık.',
    ],
    errors: [
      'Dirsekleri yana açmak → omuz zorlanır.',
      'Çok derin inmek → omuz ön kapsülü zorlanır.',
      'Zorlaştırmak için bacakları başka sandalyeye koy.',
    ],
  },

  'Superman Hold': {
    target: 'Tüm arka zincir (erektörler, gluteus, arka deltoid)',
    equipment: 'Zemin',
    why: 'Arka zincir isometrik olarak güçlenir. Günlük oturma pozisyonunun neden olduğu zayıflıkları giderir.',
    prep: [
      'Yüzüstü yat, kollar öne uzat.',
    ],
    steps: [
      'Kollarını, göğsünü ve bacaklarını yerden kaldır.',
      'Vücut hafif U şekli oluşturmalı.',
      'Bakış yere olsun.',
      '30 saniye tut.',
    ],
    errors: [
      'Başı yukarı kaldırmak → boyun zorlanır.',
      'Nefes tutmak → sürekli nefes almaya devam et.',
    ],
  },

  'Hollow Body Hold': {
    target: 'Core ön duvarı + pelvik kontrol',
    equipment: 'Zemin',
    why: 'En etkili isometrik core hareketlerinden biri. Bel nötr pozisyonda kalırken tüm anterior core aktive olur.',
    prep: [
      'Sırtüstü yat.',
      'Belini yere yapıştır — en kritik adım.',
    ],
    steps: [
      'Belini yere bas.',
      'Kolları ve bacakları yerden 15-20 cm kaldır.',
      'Omuz üstleri de hafifçe yerden kalksın.',
      '30 saniye tut.',
    ],
    errors: [
      'Belin yerden kalkması → hareketi küçült, önce dizleri bükerek yap.',
      'Çok zorsa dizleri hafif büküp kademeli olarak düzleştir.',
    ],
  },

  'Chin Tuck': {
    target: 'Derin servikal fleksörler — boyun düzleşmesi (servikal lordoz)',
    equipment: 'Duvar',
    why: 'Boyun düzleşmesi (servikal düzleşme) derin boyun kaslarının zayıflığından kaynaklanır. Bu hareket onları aktive eder ve zamanla eğriyi geri kazandırır.',
    prep: [
      'Duvara sırtını yasla.',
      'Başının arkası, kürek kemiklerin ve kalçan duvara değsin.',
      'Bakışın ileri.',
    ],
    steps: [
      'Çeneni hafifçe aşağı ve geriye çek — çift çene yapıyormuş gibi.',
      'Başının arkasını duvara doğru hafifçe bastır.',
      'Boyun arkasının uzadığını hissetmelisin.',
      '5 saniye tut.',
      'Yavaşça gevşet.',
      '10 tekrar yap.',
    ],
    errors: [
      'Çeneyi aşağı bastırmak (farklı hareket) — çene GERIYE gitmeli.',
      'Çok sert bastırmak → nazik kuvvet yeterli.',
      'Başı yukarı kaldırmak.',
      'Omuzları yukarı kaldırmak.',
    ],
    tip: 'GÜNLÜK: Antrenman dışında da günde 2-3 kez yap. Telefon bakarken bile yapabilirsin. Boyun eğrisini geri kazanmak için tutarlılık en kritik faktör.',
    warning: 'Boyun düzleşmen doktor tarafından teşhis edilmiş. Bu egzersiz bilimsel olarak desteklenmiş olsa da fizyoterapistle görüşmen önerilir.',
  },

  'Kapı Eşiği Göğüs Germe': {
    target: 'Göğüs kaslarının kısalmasını önleme (pectoralis minor/major)',
    equipment: 'Kapı eşiği',
    why: 'Sürekli itme hareketi göğüs kaslarını kısaltır. Bu germe kısalmayı önler ve omuzların öne gelmesini engeller.',
    prep: [
      'Kapı eşiğinin yanında dur.',
    ],
    steps: [
      'Kolunu 90° bükerek kapı kenarına daya — dirsek omuz hizasında.',
      'Aynı taraf ayakla hafifçe öne adım at.',
      'Gövdeni nazikçe ileri ve karşı tarafa döndür.',
      'Göğüs kasında hafif gerilme hisset — ağrı değil.',
      '30 saniye tut.',
      'Diğer tarafla tekrarla.',
    ],
    errors: [
      'Ağrı hissetmek → gerilmeyi azalt.',
      'Dirseği omuz hizasının üstüne koymak → omuz eklemi zorlanır.',
    ],
  },
};
