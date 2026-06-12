// Adhkar — sélection authentique tirée de Hisn al-Muslim (Sa'id al-Qahtani)
// Chaque dhikr : texte arabe, translittération (FR), traduction (FR/EN), nombre de répétitions, source.

export interface Dhikr {
  ar: string;
  translit?: string;
  fr: string;
  en?: string;
  count: number; // nombre de répétitions recommandé
  source: string;
}

export interface AdhkarCategory {
  id: string;
  name_fr: string;
  name_ar: string;
  name_en: string;
  icon: string;
  description_fr: string;
  description_ar: string;
  description_en: string;
  dhikrs: Dhikr[];
}

export const ADHKAR_CATEGORIES: AdhkarCategory[] = [
  {
    id: 'matin',
    name_fr: 'Adhkar du matin',
    name_ar: 'أذكار الصباح',
    name_en: 'Morning remembrance',
    icon: '🌅',
    description_fr: 'À réciter après la prière du Fajr jusqu’au lever du soleil.',
    description_ar: 'تُقال بعد صلاة الفجر إلى طلوع الشمس.',
    description_en: 'Recited after Fajr until sunrise.',
    dhikrs: [
      {
        ar: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
        fr: 'Verset du Trône (Ayat al-Kursi). Quiconque le récite le matin est protégé des djinns jusqu’au soir.',
        en: 'Ayat al-Kursi. Whoever recites it in the morning is protected from jinn until evening.',
        count: 1,
        source: 'Coran 2:255 — Sahih (al-Hakim)',
      },
      {
        ar: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        fr: 'Sourate Al-Ikhlas — équivaut au tiers du Coran.',
        en: 'Surah Al-Ikhlas — equivalent to a third of the Qur’an.',
        count: 3,
        source: 'Abu Dawud 5082, Tirmidhi 3575 — Sahih',
      },
      {
        ar: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        fr: 'Sourate Al-Falaq — protection contre tout mal.',
        en: 'Surah Al-Falaq — protection against all evil.',
        count: 3,
        source: 'Abu Dawud 5082 — Sahih',
      },
      {
        ar: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ',
        fr: 'Sourate An-Nas — protection contre les murmures de Satan.',
        en: 'Surah An-Nas — protection from Satan’s whispers.',
        count: 3,
        source: 'Abu Dawud 5082 — Sahih',
      },
      {
        ar: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
        fr: 'Nous voici au matin, et le royaume appartient à Allah. Toute louange à Allah. Pas de divinité sauf Allah, Seul, sans associé. À Lui la royauté et la louange, et Il est Tout-Puissant. Seigneur, je Te demande le bien de ce jour et de ce qui suit, et je cherche refuge auprès de Toi contre le mal de ce jour et de ce qui suit. Seigneur, je cherche refuge auprès de Toi contre la paresse et la décrépitude. Seigneur, je cherche refuge auprès de Toi contre le châtiment de l’Enfer et celui de la tombe.',
        count: 1,
        source: 'Sahih Muslim 2723',
      },
      {
        ar: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
        fr: 'Ô Allah, par Toi nous voici au matin et par Toi au soir, par Toi nous vivons et par Toi nous mourons, et vers Toi sera la résurrection.',
        count: 1,
        source: 'Tirmidhi 3391 — Hasan',
      },
      {
        ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
        fr: 'Sayyid al-Istighfar — Maître de la demande de pardon. Qui le récite le matin avec certitude et meurt avant le soir est du peuple du Paradis.',
        en: 'Master of seeking forgiveness. Whoever says it with certainty and dies that day is of the people of Paradise.',
        count: 1,
        source: 'Sahih al-Bukhari 6306',
      },
      {
        ar: 'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
        fr: 'Ô Allah, je Te prends à témoin ce matin, ainsi que les porteurs de Ton Trône, Tes anges et toutes Tes créatures, que Tu es Allah, nulle divinité sinon Toi, Seul, sans associé, et que Muhammad est Ton serviteur et Ton messager.',
        count: 4,
        source: 'Abu Dawud 5069 — Sahih',
      },
      {
        ar: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
        fr: 'Allah me suffit, point de divinité sinon Lui, je place ma confiance en Lui, Il est le Seigneur du Trône immense.',
        count: 7,
        source: 'Abu Dawud 5081 — Sahih',
      },
      {
        ar: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        fr: 'Au nom d’Allah avec le nom duquel rien ne peut nuire ni sur terre ni au ciel, et Il est l’Audient, l’Omniscient.',
        count: 3,
        source: 'Abu Dawud 5088 — Sahih',
      },
      {
        ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        translit: 'SubhanAllahi wa bi-hamdihi',
        fr: 'Gloire et louange à Allah.',
        en: 'Glory and praise be to Allah.',
        count: 100,
        source: 'Sahih Muslim 2692',
      },
      {
        ar: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        fr: 'Il n’y a de divinité qu’Allah, Seul, sans associé. À Lui la royauté et la louange, et Il est Tout-Puissant.',
        count: 10,
        source: 'Sahih (an-Nasai)',
      },
    ],
  },

  {
    id: 'soir',
    name_fr: 'Adhkar du soir',
    name_ar: 'أذكار المساء',
    name_en: 'Evening remembrance',
    icon: '🌙',
    description_fr: 'À réciter après la prière du ’Asr jusqu’au coucher du soleil.',
    description_ar: 'تُقال بعد صلاة العصر إلى غروب الشمس.',
    description_en: 'Recited after ’Asr until sunset.',
    dhikrs: [
      {
        ar: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...',
        fr: 'Verset du Trône (Ayat al-Kursi). Protection jusqu’au matin.',
        count: 1,
        source: 'Coran 2:255',
      },
      {
        ar: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        fr: 'Sourate Al-Ikhlas × 3.',
        count: 3,
        source: 'Abu Dawud 5082 — Sahih',
      },
      {
        ar: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ...',
        fr: 'Sourate Al-Falaq × 3.',
        count: 3,
        source: 'Abu Dawud 5082 — Sahih',
      },
      {
        ar: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ...',
        fr: 'Sourate An-Nas × 3.',
        count: 3,
        source: 'Abu Dawud 5082 — Sahih',
      },
      {
        ar: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا',
        fr: 'Nous voici au soir, et le royaume appartient à Allah… (variante soir).',
        count: 1,
        source: 'Sahih Muslim 2723',
      },
      {
        ar: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
        fr: 'Ô Allah, par Toi nous voici au soir et par Toi au matin, par Toi nous vivons et par Toi nous mourons, et vers Toi est le retour.',
        count: 1,
        source: 'Tirmidhi 3391 — Hasan',
      },
      {
        ar: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        fr: 'Je cherche refuge dans les Paroles parfaites d’Allah contre le mal de ce qu’Il a créé.',
        count: 3,
        source: 'Sahih Muslim 2709',
      },
      {
        ar: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        fr: 'Au nom d’Allah avec le nom duquel rien ne peut nuire…',
        count: 3,
        source: 'Abu Dawud 5088 — Sahih',
      },
      {
        ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ',
        fr: 'Gloire et louange à Allah, autant que Ses créatures, autant que Son agrément, autant que pèse Son Trône et que l’encre de Ses Paroles.',
        count: 3,
        source: 'Sahih Muslim 2726',
      },
    ],
  },

  {
    id: 'apres_priere',
    name_fr: 'Après chaque prière',
    name_ar: 'أذكار بعد الصلاة',
    name_en: 'After each prayer',
    icon: '🕌',
    description_fr: 'À réciter après les salutations finales (taslim) de chaque prière obligatoire.',
    description_ar: 'تُقال بعد التسليم من كل صلاة فريضة.',
    description_en: 'Recited after the taslim of every obligatory prayer.',
    dhikrs: [
      {
        ar: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ',
        translit: 'AstaghfiruLlah × 3',
        fr: 'Je demande pardon à Allah × 3.',
        count: 1,
        source: 'Sahih Muslim 591',
      },
      {
        ar: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
        fr: 'Ô Allah, Tu es la Paix et de Toi vient la paix, Tu es Béni, Ô Détenteur de la Majesté et de la Générosité.',
        count: 1,
        source: 'Sahih Muslim 591',
      },
      {
        ar: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
        fr: 'Pas de divinité sauf Allah, Seul, sans associé… Ô Allah, nul ne peut empêcher ce que Tu accordes ni accorder ce que Tu empêches, et la fortune n’est d’aucun secours auprès de Toi.',
        count: 1,
        source: 'Sahih al-Bukhari 844, Muslim 593',
      },
      {
        ar: 'سُبْحَانَ اللَّهِ',
        translit: 'SubhanAllah',
        fr: 'Gloire à Allah.',
        en: 'Glory be to Allah.',
        count: 33,
        source: 'Sahih Muslim 597',
      },
      {
        ar: 'الْحَمْدُ لِلَّهِ',
        translit: 'Al-hamduliLlah',
        fr: 'Louange à Allah.',
        en: 'Praise be to Allah.',
        count: 33,
        source: 'Sahih Muslim 597',
      },
      {
        ar: 'اللَّهُ أَكْبَرُ',
        translit: 'Allahu Akbar',
        fr: 'Allah est le Plus Grand.',
        en: 'Allah is the Greatest.',
        count: 34,
        source: 'Sahih Muslim 597',
      },
      {
        ar: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        fr: 'Il n’y a de divinité qu’Allah, Seul, sans associé. À Lui la royauté et la louange, et Il est Tout-Puissant. (Compléter les 100 dhikrs avec ce 100e.)',
        count: 1,
        source: 'Sahih Muslim 597',
      },
    ],
  },

  {
    id: 'sommeil',
    name_fr: 'Avant de dormir',
    name_ar: 'أذكار النوم',
    name_en: 'Before sleeping',
    icon: '🛏️',
    description_fr: 'À réciter avant de s’endormir.',
    description_ar: 'تُقال قبل النوم.',
    description_en: 'Recited before sleeping.',
    dhikrs: [
      {
        ar: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...',
        fr: 'Ayat al-Kursi (Coran 2:255). Une protection d’Allah dure toute la nuit.',
        count: 1,
        source: 'Sahih al-Bukhari 2311',
      },
      {
        ar: 'قُلْ هُوَ اللَّهُ أَحَدٌ + قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ + قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        fr: 'Les trois sourates de protection (souffler dans les paumes et essuyer le corps).',
        count: 3,
        source: 'Sahih al-Bukhari 5017',
      },
      {
        ar: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        translit: 'BismikaLlahumma amutu wa ahya',
        fr: 'En Ton Nom, ô Allah, je meurs et je vis.',
        count: 1,
        source: 'Sahih al-Bukhari 6324',
      },
      {
        ar: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
        fr: 'Ô Allah, préserve-moi de Ton châtiment le jour où Tu ressusciteras Tes serviteurs.',
        count: 3,
        source: 'Abu Dawud 5045 — Sahih',
      },
      {
        ar: 'سُبْحَانَ اللَّهِ × 33، الْحَمْدُ لِلَّهِ × 33، اللَّهُ أَكْبَرُ × 34',
        fr: 'SubhanAllah 33×, Alhamdulillah 33×, Allahu Akbar 34× — meilleur que d’avoir un serviteur (hadith Ali).',
        count: 1,
        source: 'Sahih al-Bukhari 5362',
      },
    ],
  },

  {
    id: 'reveil',
    name_fr: 'Au réveil',
    name_ar: 'أذكار الاستيقاظ',
    name_en: 'Upon waking up',
    icon: '☀️',
    description_fr: 'À dire en se réveillant.',
    description_ar: 'تُقال عند الاستيقاظ.',
    description_en: 'Said upon waking up.',
    dhikrs: [
      {
        ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        fr: 'Louange à Allah qui nous a ramenés à la vie après nous avoir fait mourir, et vers Lui sera la résurrection.',
        count: 1,
        source: 'Sahih al-Bukhari 6324',
      },
    ],
  },

  {
    id: 'avant_repas',
    name_fr: 'Avant de manger',
    name_ar: 'قبل الطعام',
    name_en: 'Before eating',
    icon: '🍽️',
    description_fr: 'À dire avant le repas.',
    description_ar: 'تُقال قبل الأكل.',
    description_en: 'Said before eating.',
    dhikrs: [
      {
        ar: 'بِسْمِ اللَّهِ',
        translit: 'BismiLlah',
        fr: 'Au nom d’Allah.',
        en: 'In the name of Allah.',
        count: 1,
        source: 'Sahih al-Bukhari 5376',
      },
      {
        ar: 'بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ',
        fr: 'Au nom d’Allah au début et à la fin (à dire si on a oublié le bismillah).',
        count: 1,
        source: 'Abu Dawud 3767 — Sahih',
      },
    ],
  },

  {
    id: 'apres_repas',
    name_fr: 'Après manger',
    name_ar: 'بعد الطعام',
    name_en: 'After eating',
    icon: '🤲',
    description_fr: 'À dire après le repas.',
    description_ar: 'تُقال بعد الأكل.',
    description_en: 'Said after eating.',
    dhikrs: [
      {
        ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
        fr: 'Louange à Allah qui m’a nourri et accordé ceci sans force ni puissance de ma part.',
        count: 1,
        source: 'Abu Dawud 4023 — Hasan',
      },
    ],
  },

  {
    id: 'maison',
    name_fr: 'Entrée / sortie de la maison',
    name_ar: 'دخول وخروج المنزل',
    name_en: 'Entering / leaving home',
    icon: '🏠',
    description_fr: 'À dire en entrant et en sortant de chez soi.',
    description_ar: 'تُقال عند دخول وخروج المنزل.',
    description_en: 'Said when entering and leaving the home.',
    dhikrs: [
      {
        ar: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
        fr: 'En sortant : Au nom d’Allah, je place ma confiance en Allah, et il n’y a de force ni de puissance qu’en Allah.',
        count: 1,
        source: 'Abu Dawud 5095 — Sahih',
      },
      {
        ar: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
        fr: 'En entrant : Au nom d’Allah nous entrons, au nom d’Allah nous sortons, et en Allah notre Seigneur nous plaçons notre confiance.',
        count: 1,
        source: 'Abu Dawud 5096 — Sahih',
      },
    ],
  },

  {
    id: 'mosquee',
    name_fr: 'Entrée / sortie de la mosquée',
    name_ar: 'دخول وخروج المسجد',
    name_en: 'Entering / leaving the mosque',
    icon: '🕋',
    description_fr: 'À dire en entrant et en sortant de la mosquée.',
    description_ar: 'تُقال عند دخول وخروج المسجد.',
    description_en: 'Said when entering and leaving the mosque.',
    dhikrs: [
      {
        ar: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
        fr: 'En entrant : Ô Allah, ouvre-moi les portes de Ta miséricorde.',
        count: 1,
        source: 'Sahih Muslim 713',
      },
      {
        ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
        fr: 'En sortant : Ô Allah, je Te demande de Ta grâce.',
        count: 1,
        source: 'Sahih Muslim 713',
      },
    ],
  },

  {
    id: 'wc',
    name_fr: 'Entrée / sortie des toilettes',
    name_ar: 'دخول وخروج الخلاء',
    name_en: 'Entering / leaving the bathroom',
    icon: '🚪',
    description_fr: 'À dire avant d’entrer et après être sorti.',
    description_ar: 'تُقال قبل الدخول وبعد الخروج.',
    description_en: 'Said before entering and after leaving.',
    dhikrs: [
      {
        ar: 'بِسْمِ اللَّهِ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
        fr: 'Avant d’entrer : Au nom d’Allah. Ô Allah, je cherche refuge auprès de Toi contre les démons mâles et femelles.',
        count: 1,
        source: 'Sahih al-Bukhari 142',
      },
      {
        ar: 'غُفْرَانَكَ',
        translit: 'Ghufranak',
        fr: 'En sortant : Ton pardon, ô Allah.',
        count: 1,
        source: 'Abu Dawud 30 — Sahih',
      },
    ],
  },

  {
    id: 'voyage',
    name_fr: 'En voyage',
    name_ar: 'أذكار السفر',
    name_en: 'When travelling',
    icon: '✈️',
    description_fr: 'Invocations à dire en montant dans un véhicule et durant le voyage.',
    description_ar: 'تُقال عند ركوب وسيلة النقل وأثناء السفر.',
    description_en: 'Said when boarding a vehicle and while travelling.',
    dhikrs: [
      {
        ar: 'بِسْمِ اللَّهِ. الْحَمْدُ لِلَّهِ. سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ. الْحَمْدُ لِلَّهِ × 3. اللَّهُ أَكْبَرُ × 3. سُبْحَانَكَ اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
        fr: 'Invocation du voyage en montant dans le véhicule.',
        count: 1,
        source: 'Tirmidhi 3446 — Sahih',
      },
    ],
  },

  {
    id: 'detresse',
    name_fr: 'Tristesse, angoisse, détresse',
    name_ar: 'الكرب والضيق',
    name_en: 'Distress and anxiety',
    icon: '💚',
    description_fr: 'Invocations prophétiques contre le chagrin et l’anxiété.',
    description_ar: 'أذكار نبوية لرفع الكرب والهمّ.',
    description_en: 'Prophetic du’a for distress and worry.',
    dhikrs: [
      {
        ar: 'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
        fr: 'Pas de divinité sinon Allah, l’Immense, le Doux ; pas de divinité sinon Allah, Seigneur du Trône immense ; pas de divinité sinon Allah, Seigneur des cieux, de la terre et du Trône généreux.',
        count: 1,
        source: 'Sahih al-Bukhari 6346',
      },
      {
        ar: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
        fr: 'Ô Vivant, ô Subsistant, par Ta miséricorde j’implore Ton secours. Améliore tous mes états et ne me confie pas à moi-même un battement de cil.',
        count: 1,
        source: 'an-Nasai dans ’Amal al-Yawm — Hasan',
      },
      {
        ar: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
        fr: 'Allah nous suffit et Il est le meilleur Garant.',
        count: 7,
        source: 'Coran 3:173',
      },
    ],
  },
];
