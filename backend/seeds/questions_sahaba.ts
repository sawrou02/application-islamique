import { Client } from 'pg';

interface QuestionSeed {
  domaine: string;
  sous_domaine?: string;
  niveau: number;
  madhab: string;
  texte_fr: string;
  texte_ar?: string;
  dalil_ref?: string;
  dalil_texte_ar?: string;
  dalil_texte_fr?: string;
  explication?: string;
  savant_reference?: string;
  grade_hadith?: string;
  reponses: { texte_fr: string; texte_ar?: string; est_correcte: boolean }[];
}

const QUESTIONS_SAHABA: QuestionSeed[] = [
  // ===================== SIRAH niveau 4 (Avancé) =====================
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: "Qui fut le premier homme adulte à embrasser l'islam ?",
    texte_ar: 'من هو أول رجل بالغ أسلم؟',
    explication: "Abu Bakr as-Siddiq رضي الله عنه fut le premier homme libre et adulte à accepter l'islam, suite à l'invitation directe du Prophète ﷺ. Khadija fut la première femme, Ali le premier enfant et Zayd ibn Haritha le premier affranchi.",
    dalil_ref: 'Ibn Ishaq, Sirah Nabawiyyah ; Ibn Hisham',
    grade_hadith: 'Tradition',
    reponses: [
      { texte_fr: 'Abu Bakr as-Siddiq', texte_ar: 'أبو بكر الصديق', est_correcte: true },
      { texte_fr: 'Umar ibn al-Khattab', texte_ar: 'عمر بن الخطاب', est_correcte: false },
      { texte_fr: 'Uthman ibn Affan', texte_ar: 'عثمان بن عفان', est_correcte: false },
      { texte_fr: 'Hamza ibn Abd al-Muttalib', texte_ar: 'حمزة بن عبد المطلب', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: 'Quel compagnon est appelé "al-Faruq" (celui qui distingue le vrai du faux) ?',
    texte_ar: 'أي صحابي يلقب بالفاروق؟',
    explication: "Umar ibn al-Khattab رضي الله عنه reçut ce titre du Prophète ﷺ car Allah distinguait par lui la vérité du mensonge. Sa conversion fut un tournant majeur pour la communauté musulmane à La Mecque.",
    dalil_ref: 'Ibn Majah ; Tabaqat Ibn Saad',
    grade_hadith: 'Hadith Hasan',
    reponses: [
      { texte_fr: 'Umar ibn al-Khattab', texte_ar: 'عمر بن الخطاب', est_correcte: true },
      { texte_fr: 'Abu Bakr as-Siddiq', texte_ar: 'أبو بكر الصديق', est_correcte: false },
      { texte_fr: 'Ali ibn Abi Talib', texte_ar: 'علي بن أبي طالب', est_correcte: false },
      { texte_fr: 'Khalid ibn al-Walid', texte_ar: 'خالد بن الوليد', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: 'Quel compagnon le Prophète ﷺ a-t-il surnommé "Dhul-Nurayn" (l\'homme aux deux lumières) ?',
    texte_ar: 'أي صحابي لقبه النبي ﷺ بذي النورين؟',
    explication: "Uthman ibn Affan رضي الله عنه fut nommé ainsi car il épousa successivement deux filles du Prophète ﷺ : Ruqayyah puis Umm Kulthum. Aucun homme n'a eu cet honneur.",
    dalil_ref: 'Tabaqat Ibn Saad ; Tarikh al-Tabari',
    reponses: [
      { texte_fr: 'Uthman ibn Affan', texte_ar: 'عثمان بن عفان', est_correcte: true },
      { texte_fr: 'Ali ibn Abi Talib', texte_ar: 'علي بن أبي طالب', est_correcte: false },
      { texte_fr: 'Zayd ibn Harith', texte_ar: 'زيد بن حارثة', est_correcte: false },
      { texte_fr: 'Abu Bakr as-Siddiq', texte_ar: 'أبو بكر الصديق', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: 'Qui était surnommé "le premier juge de l\'islam" ?',
    texte_ar: 'من هو أول قاض في الإسلام؟',
    explication: "Ali ibn Abi Talib رضي الله عنه fut envoyé au Yémen comme juge par le Prophète ﷺ. Le Prophète invoqua pour lui : 'Ô Allah, guide son cœur et affermis sa langue.'",
    dalil_ref: 'Sunan Abi Dawud n°3582',
    grade_hadith: 'Hadith Sahih',
    reponses: [
      { texte_fr: 'Ali ibn Abi Talib', texte_ar: 'علي بن أبي طالب', est_correcte: true },
      { texte_fr: 'Muadh ibn Jabal', texte_ar: 'معاذ بن جبل', est_correcte: false },
      { texte_fr: 'Umar ibn al-Khattab', texte_ar: 'عمر بن الخطاب', est_correcte: false },
      { texte_fr: 'Zayd ibn Thabit', texte_ar: 'زيد بن ثابت', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: 'Quel compagnon est surnommé "l\'épée tirée d\'Allah" (Sayf Allah al-Maslul) ?',
    texte_ar: 'أي صحابي لقب بسيف الله المسلول؟',
    explication: "Khalid ibn al-Walid رضي الله عنه reçut ce titre du Prophète ﷺ après la bataille de Mu'tah. Il ne perdit aucune bataille de sa carrière militaire.",
    dalil_ref: 'Sahih al-Bukhari n°4262',
    grade_hadith: 'Hadith Sahih',
    reponses: [
      { texte_fr: 'Khalid ibn al-Walid', texte_ar: 'خالد بن الوليد', est_correcte: true },
      { texte_fr: 'Hamza ibn Abd al-Muttalib', texte_ar: 'حمزة بن عبد المطلب', est_correcte: false },
      { texte_fr: 'Saad ibn Abi Waqqas', texte_ar: 'سعد بن أبي وقاص', est_correcte: false },
      { texte_fr: 'Ali ibn Abi Talib', texte_ar: 'علي بن أبي طالب', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: 'Qui était le premier muezzin de l\'islam ?',
    texte_ar: 'من هو أول مؤذن في الإسلام؟',
    explication: "Bilal ibn Rabah al-Habashi رضي الله عنه, ancien esclave éthiopien affranchi par Abu Bakr, fut choisi par le Prophète ﷺ pour appeler à la prière en raison de la beauté de sa voix.",
    dalil_ref: 'Sahih al-Bukhari ; Sahih Muslim',
    reponses: [
      { texte_fr: 'Bilal ibn Rabah', texte_ar: 'بلال بن رباح', est_correcte: true },
      { texte_fr: 'Abdullah ibn Umm Maktum', texte_ar: 'عبد الله بن أم مكتوم', est_correcte: false },
      { texte_fr: 'Saad al-Qaraz', texte_ar: 'سعد القرظ', est_correcte: false },
      { texte_fr: 'Abu Mahdhura', texte_ar: 'أبو محذورة', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: 'Quel compagnon est surnommé "l\'homme à la double ceinture" (Dhat al-Nitaqayn) ?',
    texte_ar: 'من هي ذات النطاقين؟',
    explication: "Asma bint Abi Bakr رضي الله عنها reçut ce titre car elle déchira sa ceinture en deux : une pour porter la nourriture du Prophète ﷺ et d'Abu Bakr cachés dans la grotte de Thawr lors de la Hijra.",
    dalil_ref: 'Sahih al-Bukhari n°3907',
    grade_hadith: 'Hadith Sahih',
    reponses: [
      { texte_fr: 'Asma bint Abi Bakr', texte_ar: 'أسماء بنت أبي بكر', est_correcte: true },
      { texte_fr: 'Aïcha bint Abi Bakr', texte_ar: 'عائشة بنت أبي بكر', est_correcte: false },
      { texte_fr: 'Hafsa bint Umar', texte_ar: 'حفصة بنت عمر', est_correcte: false },
      { texte_fr: 'Fatima az-Zahra', texte_ar: 'فاطمة الزهراء', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: 'Quel compagnon perse parcourut le monde à la recherche de la vraie religion avant de rencontrer le Prophète ﷺ ?',
    texte_ar: 'أي صحابي فارسي طاف العالم بحثاً عن الدين الحق؟',
    explication: "Salman al-Farisi رضي الله عنه quitta sa Perse natale, passa par plusieurs maîtres chrétiens, fut vendu comme esclave puis affranchi par le Prophète ﷺ lui-même. Il est l'un des plus grands compagnons.",
    dalil_ref: 'Musnad Ahmad ; Tabaqat Ibn Saad',
    grade_hadith: 'Hadith Hasan',
    reponses: [
      { texte_fr: 'Salman al-Farisi', texte_ar: 'سلمان الفارسي', est_correcte: true },
      { texte_fr: 'Suhayb ar-Rumi', texte_ar: 'صهيب الرومي', est_correcte: false },
      { texte_fr: 'Bilal al-Habashi', texte_ar: 'بلال الحبشي', est_correcte: false },
      { texte_fr: 'Abu Dharr al-Ghifari', texte_ar: 'أبو ذر الغفاري', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: 'Quel compagnon proposa la stratégie de la tranchée (Khandaq) lors du siège de Médine ?',
    texte_ar: 'من اقترح حفر الخندق في غزوة الأحزاب؟',
    explication: "Salman al-Farisi رضي الله عنه proposa cette tactique perse au Prophète ﷺ. La tranchée bloqua l'armée des coalisés et Allah envoya un vent violent qui les fit fuir.",
    dalil_ref: 'Sirah Ibn Hisham ; Maghazi al-Waqidi',
    reponses: [
      { texte_fr: 'Salman al-Farisi', texte_ar: 'سلمان الفارسي', est_correcte: true },
      { texte_fr: 'Umar ibn al-Khattab', texte_ar: 'عمر بن الخطاب', est_correcte: false },
      { texte_fr: 'Abu Bakr as-Siddiq', texte_ar: 'أبو بكر الصديق', est_correcte: false },
      { texte_fr: 'Khalid ibn al-Walid', texte_ar: 'خالد بن الوليد', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: 'Qui fut le premier martyr de l\'islam ?',
    texte_ar: 'من هو أول شهيد في الإسلام؟',
    explication: "Sumayya bint Khayyat رضي الله عنها, mère de Ammar ibn Yasir, fut torturée à mort par Abu Jahl à La Mecque pour avoir refusé de renier l'islam.",
    dalil_ref: 'Tabaqat Ibn Saad ; Ibn Hisham',
    reponses: [
      { texte_fr: 'Sumayya bint Khayyat', texte_ar: 'سمية بنت خياط', est_correcte: true },
      { texte_fr: 'Hamza ibn Abd al-Muttalib', texte_ar: 'حمزة بن عبد المطلب', est_correcte: false },
      { texte_fr: 'Yasir ibn Amir', texte_ar: 'ياسر بن عامر', est_correcte: false },
      { texte_fr: 'Ammar ibn Yasir', texte_ar: 'عمار بن ياسر', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: 'Qui était surnommé "Sayyid al-Shuhada" (le maître des martyrs) ?',
    texte_ar: 'من لقب بسيد الشهداء؟',
    explication: "Hamza ibn Abd al-Muttalib رضي الله عنه, oncle du Prophète ﷺ, tomba en martyr à la bataille de Uhud. Le Prophète ﷺ dit : 'Le maître des martyrs est Hamza.'",
    dalil_ref: 'al-Mustadrak al-Hakim n°4884',
    grade_hadith: 'Hadith Sahih',
    reponses: [
      { texte_fr: 'Hamza ibn Abd al-Muttalib', texte_ar: 'حمزة بن عبد المطلب', est_correcte: true },
      { texte_fr: 'Husayn ibn Ali', texte_ar: 'الحسين بن علي', est_correcte: false },
      { texte_fr: 'Jafar ibn Abi Talib', texte_ar: 'جعفر بن أبي طالب', est_correcte: false },
      { texte_fr: 'Mus\'ab ibn Umayr', texte_ar: 'مصعب بن عمير', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: 'Quel compagnon fut le premier ambassadeur de l\'islam, envoyé à Médine avant la Hijra ?',
    texte_ar: 'من هو أول سفير في الإسلام أرسل إلى المدينة قبل الهجرة؟',
    explication: "Mus'ab ibn Umayr رضي الله عنه fut envoyé à Médine après le serment de Aqaba pour enseigner l'islam aux Ansar. Il tomba ensuite en martyr à Uhud.",
    dalil_ref: 'Tabaqat Ibn Saad ; Ibn Hisham',
    reponses: [
      { texte_fr: "Mus'ab ibn Umayr", texte_ar: 'مصعب بن عمير', est_correcte: true },
      { texte_fr: "Sa'd ibn Mu'adh", texte_ar: 'سعد بن معاذ', est_correcte: false },
      { texte_fr: 'Abu Ayyub al-Ansari', texte_ar: 'أبو أيوب الأنصاري', est_correcte: false },
      { texte_fr: 'Abdullah ibn Rawaha', texte_ar: 'عبد الله بن رواحة', est_correcte: false },
    ],
  },

  // ===================== SIRAH niveau 5 (Expert) =====================
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 5, madhab: 'general',
    texte_fr: 'Quels furent les 10 compagnons annoncés comme garants du Paradis (al-Ashara al-Mubashshara) ?',
    texte_ar: 'من هم العشرة المبشرون بالجنة؟',
    explication: "Le Prophète ﷺ annonça leur entrée au Paradis dans un même hadith : Abu Bakr, Umar, Uthman, Ali, Talha, Zubayr, Abdurrahman ibn Awf, Saad ibn Abi Waqqas, Saïd ibn Zayd et Abu Ubayda ibn al-Jarrah رضي الله عنهم.",
    dalil_ref: 'Sunan at-Tirmidhi n°3747',
    grade_hadith: 'Hadith Sahih',
    reponses: [
      { texte_fr: 'Abu Bakr, Umar, Uthman, Ali, Talha, Zubayr, Abdurrahman ibn Awf, Saad, Saïd, Abu Ubayda', est_correcte: true },
      { texte_fr: 'Les 4 califes uniquement', est_correcte: false },
      { texte_fr: 'Les fils du Prophète ﷺ uniquement', est_correcte: false },
      { texte_fr: 'Tous les Muhajirun', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 5, madhab: 'general',
    texte_fr: 'Quel compagnon est considéré comme "le confident du Prophète ﷺ" car il connaissait les noms des hypocrites ?',
    texte_ar: 'من هو صاحب سر رسول الله ﷺ؟',
    explication: "Hudhayfa ibn al-Yaman رضي الله عنه reçut du Prophète ﷺ la liste des hypocrites de Médine. Umar lui demandait s'il devait prier sur un défunt et observait son comportement.",
    dalil_ref: 'Sahih Muslim n°2779 ; Hilyat al-Awliya',
    grade_hadith: 'Hadith Sahih',
    reponses: [
      { texte_fr: 'Hudhayfa ibn al-Yaman', texte_ar: 'حذيفة بن اليمان', est_correcte: true },
      { texte_fr: 'Abu Dharr al-Ghifari', texte_ar: 'أبو ذر الغفاري', est_correcte: false },
      { texte_fr: 'Abu Hurayra', texte_ar: 'أبو هريرة', est_correcte: false },
      { texte_fr: 'Anas ibn Malik', texte_ar: 'أنس بن مالك', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 5, madhab: 'general',
    texte_fr: 'Qui fut chargé par Abu Bakr puis Uthman رضي الله عنهما de compiler le Coran ?',
    texte_ar: 'من كلفه أبو بكر ثم عثمان رضي الله عنهما بجمع القرآن؟',
    explication: "Zayd ibn Thabit al-Ansari رضي الله عنه, scribe du Prophète ﷺ, fut chargé d'abord par Abu Bakr (après la mort de nombreux mémorisateurs à al-Yamama) puis par Uthman pour standardiser le Mushaf.",
    dalil_ref: 'Sahih al-Bukhari n°4986',
    grade_hadith: 'Hadith Sahih',
    reponses: [
      { texte_fr: 'Zayd ibn Thabit', texte_ar: 'زيد بن ثابت', est_correcte: true },
      { texte_fr: 'Abdullah ibn Masud', texte_ar: 'عبد الله بن مسعود', est_correcte: false },
      { texte_fr: 'Ubayy ibn Kaab', texte_ar: 'أبي بن كعب', est_correcte: false },
      { texte_fr: 'Muadh ibn Jabal', texte_ar: 'معاذ بن جبل', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 5, madhab: 'general',
    texte_fr: 'Quel compagnon le Prophète ﷺ a-t-il déclaré : "Quiconque veut voir un martyr marchant sur terre, qu\'il regarde celui-ci" ?',
    texte_ar: 'في حق أي صحابي قال النبي ﷺ: من سره أن ينظر إلى شهيد يمشي على وجه الأرض فلينظر إلى هذا؟',
    explication: "Talha ibn Ubaydillah رضي الله عنه fut nommé ainsi car il protégea le Prophète ﷺ à Uhud, perdant l'usage de sa main et recevant plus de 70 blessures sans mourir.",
    dalil_ref: 'Sunan at-Tirmidhi n°3739',
    grade_hadith: 'Hadith Hasan',
    reponses: [
      { texte_fr: 'Talha ibn Ubaydillah', texte_ar: 'طلحة بن عبيد الله', est_correcte: true },
      { texte_fr: 'Zubayr ibn al-Awwam', texte_ar: 'الزبير بن العوام', est_correcte: false },
      { texte_fr: 'Saad ibn Abi Waqqas', texte_ar: 'سعد بن أبي وقاص', est_correcte: false },
      { texte_fr: 'Abu Talha al-Ansari', texte_ar: 'أبو طلحة الأنصاري', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 5, madhab: 'general',
    texte_fr: 'Quel compagnon, surnommé "Amin al-Umma" (le fidèle de la communauté), conduisit l\'armée musulmane lors de la conquête de la Syrie ?',
    texte_ar: 'من هو أمين هذه الأمة؟',
    explication: "Abu Ubayda ibn al-Jarrah رضي الله عنه reçut ce titre du Prophète ﷺ. Umar le nomma commandant en chef en Syrie après avoir destitué Khalid pour montrer que la victoire vient d'Allah, pas des hommes.",
    dalil_ref: 'Sahih al-Bukhari n°3744 ; Sahih Muslim n°2419',
    grade_hadith: 'Hadith Sahih',
    reponses: [
      { texte_fr: 'Abu Ubayda ibn al-Jarrah', texte_ar: 'أبو عبيدة بن الجراح', est_correcte: true },
      { texte_fr: 'Khalid ibn al-Walid', texte_ar: 'خالد بن الوليد', est_correcte: false },
      { texte_fr: 'Amr ibn al-As', texte_ar: 'عمرو بن العاص', est_correcte: false },
      { texte_fr: 'Muadh ibn Jabal', texte_ar: 'معاذ بن جبل', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 5, madhab: 'general',
    texte_fr: 'Quel compagnon dirigea la bataille de al-Qadisiyya contre l\'empire perse ?',
    texte_ar: 'من قاد المسلمين في معركة القادسية؟',
    explication: "Saad ibn Abi Waqqas رضي الله عنه, l'un des 10 promis au Paradis, commanda l'armée victorieuse à al-Qadisiyya (15-16H) qui ouvrit la voie de la chute de l'empire sassanide.",
    dalil_ref: 'Tarikh al-Tabari ; al-Kamil fil-Tarikh',
    reponses: [
      { texte_fr: 'Saad ibn Abi Waqqas', texte_ar: 'سعد بن أبي وقاص', est_correcte: true },
      { texte_fr: 'Khalid ibn al-Walid', texte_ar: 'خالد بن الوليد', est_correcte: false },
      { texte_fr: 'Abu Ubayda ibn al-Jarrah', texte_ar: 'أبو عبيدة بن الجراح', est_correcte: false },
      { texte_fr: "Mu'ana ibn Haritha", texte_ar: 'مثنى بن حارثة', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 5, madhab: 'general',
    texte_fr: 'Quelle Sahabiyya a participé à la bataille de Uhud en soignant les blessés et en défendant le Prophète ﷺ avec une épée ?',
    texte_ar: 'أي صحابية شاركت في غزوة أحد بالسيف دفاعاً عن النبي ﷺ؟',
    explication: "Nusayba bint Kaab (Umm Amara) رضي الله عنها défendit le Prophète ﷺ à Uhud en recevant plus de 12 blessures. Le Prophète dit : 'Où que je me tourne ce jour-là, je voyais Umm Amara qui combattait pour moi.'",
    dalil_ref: 'Tabaqat Ibn Saad ; Musnad Ahmad',
    grade_hadith: 'Hadith Hasan',
    reponses: [
      { texte_fr: 'Nusayba bint Kaab (Umm Amara)', texte_ar: 'نسيبة بنت كعب (أم عمارة)', est_correcte: true },
      { texte_fr: 'Khawla bint al-Azwar', texte_ar: 'خولة بنت الأزور', est_correcte: false },
      { texte_fr: 'Rufayda al-Aslamiyya', texte_ar: 'رفيدة الأسلمية', est_correcte: false },
      { texte_fr: 'Umm Sulaym', texte_ar: 'أم سليم', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 5, madhab: 'general',
    texte_fr: 'Quel compagnon, ancien adversaire à Uhud, conquit l\'Égypte sous le califat de Umar ?',
    texte_ar: 'أي صحابي فتح مصر في عهد عمر؟',
    explication: "Amr ibn al-As رضي الله عنه, brillant stratège, dirigea la conquête de l'Égypte (18-21H) avec une petite armée et fonda Fustat (actuel Caire).",
    dalil_ref: 'Futuh Misr d\'Ibn Abd al-Hakam ; Tarikh al-Tabari',
    reponses: [
      { texte_fr: 'Amr ibn al-As', texte_ar: 'عمرو بن العاص', est_correcte: true },
      { texte_fr: 'Khalid ibn al-Walid', texte_ar: 'خالد بن الوليد', est_correcte: false },
      { texte_fr: 'Saad ibn Abi Waqqas', texte_ar: 'سعد بن أبي وقاص', est_correcte: false },
      { texte_fr: 'Abu Ubayda ibn al-Jarrah', texte_ar: 'أبو عبيدة بن الجراح', est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'sahaba', niveau: 5, madhab: 'general',
    texte_fr: 'Quel compagnon récita le Coran à voix haute pour la première fois publiquement à La Mecque, malgré les persécutions ?',
    texte_ar: 'أي صحابي جهر بقراءة القرآن أول مرة في مكة؟',
    explication: "Abdullah ibn Masud رضي الله عنه récita Sourate ar-Rahman devant la Kaaba malgré les coups des Quraysh. Il fut un des plus grands savants du Coran et du Fiqh parmi les compagnons.",
    dalil_ref: 'Sirah Ibn Hisham ; Tabaqat Ibn Saad',
    reponses: [
      { texte_fr: 'Abdullah ibn Masud', texte_ar: 'عبد الله بن مسعود', est_correcte: true },
      { texte_fr: 'Bilal ibn Rabah', texte_ar: 'بلال بن رباح', est_correcte: false },
      { texte_fr: 'Abu Bakr as-Siddiq', texte_ar: 'أبو بكر الصديق', est_correcte: false },
      { texte_fr: 'Umar ibn al-Khattab', texte_ar: 'عمر بن الخطاب', est_correcte: false },
    ],
  },

  // ===================== AKHLAQ niveau 4 (Avancé) =====================
  {
    domaine: 'akhlaq', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: 'Quelle leçon de générosité Abu Bakr a-t-il donnée lors de l\'expédition de Tabuk ?',
    texte_ar: 'ما درس الكرم الذي قدمه أبو بكر في غزوة تبوك؟',
    explication: "Abu Bakr رضي الله عنه donna la totalité de ses biens. Quand le Prophète ﷺ lui demanda ce qu'il avait laissé pour sa famille, il répondit : 'Allah et Son Messager'. Umar, qui avait donné la moitié de ses biens, dit alors : 'Je ne pourrai jamais le devancer en rien.'",
    dalil_ref: 'Sunan at-Tirmidhi n°3675 ; Sunan Abi Dawud n°1678',
    grade_hadith: 'Hadith Sahih',
    reponses: [
      { texte_fr: "Il donna l'intégralité de ses biens en disant : Allah et Son Messager me suffisent à ma famille", est_correcte: true },
      { texte_fr: 'Il refusa de participer financièrement', est_correcte: false },
      { texte_fr: 'Il donna seulement une partie symbolique', est_correcte: false },
      { texte_fr: 'Il vendit sa maison', est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: 'Quelle leçon d\'humilité Umar a-t-il enseignée en tant que calife ?',
    texte_ar: 'ما درس التواضع الذي قدمه عمر كخليفة؟',
    explication: "Umar رضي الله عنه marchait pieds nus et partageait sa monture avec son serviteur. Lors de la conquête de Jérusalem, il entra en menant lui-même son chameau tandis que son serviteur le montait. Il portait des vêtements rapiécés malgré le pouvoir.",
    dalil_ref: 'Tarikh al-Tabari ; al-Bidaya wan-Nihaya d\'Ibn Kathir',
    reponses: [
      { texte_fr: 'Il alternait avec son serviteur sur la monture et portait des vêtements rapiécés', est_correcte: true },
      { texte_fr: 'Il vivait dans un palais luxueux', est_correcte: false },
      { texte_fr: 'Il refusait de parler aux gens du peuple', est_correcte: false },
      { texte_fr: 'Il portait toujours des vêtements neufs', est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: "Comment Uthman ibn Affan رضي الله عنه a-t-il financé l'armée de l'expédition difficile (Jaysh al-Usra) ?",
    texte_ar: 'كيف جهز عثمان جيش العسرة؟',
    explication: "Uthman رضي الله عنه équipa 950 chameaux, 50 chevaux et 1000 dinars d'or pour l'expédition de Tabuk. Le Prophète ﷺ dit : 'Rien ne nuira à Uthman après ce qu'il a fait aujourd'hui.'",
    dalil_ref: 'Sunan at-Tirmidhi n°3701 ; Musnad Ahmad',
    grade_hadith: 'Hadith Hasan',
    reponses: [
      { texte_fr: 'Il équipa 950 chameaux, 50 chevaux et donna 1000 dinars en or', est_correcte: true },
      { texte_fr: 'Il finança seulement 10 chameaux', est_correcte: false },
      { texte_fr: 'Il ne participa pas financièrement', est_correcte: false },
      { texte_fr: 'Il refusa de donner', est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: 'Quel acte de pardon Ali ibn Abi Talib a-t-il accompli lors d\'un combat singulier ?',
    texte_ar: 'ما موقف العفو الذي أبداه علي رضي الله عنه في القتال؟',
    explication: "Ali رضي الله عنه avait terrassé un ennemi qui lui cracha au visage. Il se releva et le laissa partir, disant : 'Je combattais pour Allah, mais si je t'avais tué après ton crachat, ç'aurait été pour ma colère.' L'homme se convertit alors.",
    dalil_ref: 'Mathnawi de Rumi ; rapporté dans plusieurs ouvrages d\'akhlaq',
    reponses: [
      { texte_fr: "Il épargna un ennemi terrassé qui lui avait craché au visage, pour préserver l'intention pure", est_correcte: true },
      { texte_fr: 'Il tua immédiatement son ennemi', est_correcte: false },
      { texte_fr: 'Il prit son ennemi comme esclave', est_correcte: false },
      { texte_fr: 'Il fuit le combat', est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: "Quelle attitude exemplaire Bilal رضي الله عنه a-t-il eue face à la torture d'Umayya ibn Khalaf ?",
    texte_ar: 'ما موقف بلال تحت التعذيب؟',
    explication: "Sous la torture (pierre sur la poitrine en plein soleil), Bilal رضي الله عنه ne disait qu'un seul mot : 'Ahad, Ahad' (Un, Un — Allah est Un). Sa fermeté dans l'épreuve fit dire à Abu Bakr de l'acheter et l'affranchir.",
    dalil_ref: 'Ibn Hisham, Sirah ; al-Bidaya wan-Nihaya',
    reponses: [
      { texte_fr: 'Il répétait Ahad Ahad (Un, Un) affirmant l\'unicité d\'Allah', est_correcte: true },
      { texte_fr: 'Il renia sa foi sous la torture', est_correcte: false },
      { texte_fr: 'Il insulta ses bourreaux', est_correcte: false },
      { texte_fr: 'Il garda le silence', est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: 'Quelle leçon de modestie Abu Bakr donna-t-il dans son premier discours de calife ?',
    texte_ar: 'ما درس التواضع في خطبة أبي بكر الأولى كخليفة؟',
    explication: "Abu Bakr رضي الله عنه dit : 'J'ai été élu calife mais je ne suis pas le meilleur d'entre vous. Si je fais bien, aidez-moi ; si je fais mal, redressez-moi. Obéissez-moi tant que j'obéis à Allah, mais si je Lui désobéis, vous ne me devez plus obéissance.'",
    dalil_ref: 'Tarikh al-Tabari ; al-Bidaya wan-Nihaya',
    reponses: [
      { texte_fr: "Il déclara n'être pas le meilleur et invita à le corriger s'il s'écartait", est_correcte: true },
      { texte_fr: "Il imposa l'obéissance absolue", est_correcte: false },
      { texte_fr: 'Il refusa la charge', est_correcte: false },
      { texte_fr: "Il déclara qu'il ne pouvait pas se tromper", est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: 'Quelle leçon de fraternité (Mu\'akhat) Allah a-t-il honoré dans la Sourate al-Hashr concernant les Ansar ?',
    texte_ar: 'ما درس الإيثار الذي أنزل الله في حق الأنصار؟',
    explication: "Allah loua les Ansar dans 59:9 : « Ils donnent la préférence (aux Muhajirun) sur eux-mêmes, même s'il y a indigence chez eux. » C'est le summum de l'altruisme (Ithar) — préférer son frère à soi-même.",
    dalil_ref: 'Sourate al-Hashr 59:9',
    reponses: [
      { texte_fr: "L'Ithar : préférer son frère à soi-même, même en cas de besoin", est_correcte: true },
      { texte_fr: "Le don exclusif à sa propre famille", est_correcte: false },
      { texte_fr: "La méfiance envers les étrangers", est_correcte: false },
      { texte_fr: "L'accumulation des biens", est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq', sous_domaine: 'sahaba', niveau: 4, madhab: 'general',
    texte_fr: "Quel exemple d'Ithar (altruisme) un Ansari a-t-il donné lors d'un repas avec un invité affamé ?",
    texte_ar: 'ما مثال الإيثار الذي قدمه أنصاري لضيف جائع؟',
    explication: "Abu Talha al-Ansari رضي الله عنه éteignit la lampe pour faire croire à son invité qu'il mangeait avec lui, alors que sa famille jeûnait. Le verset 59:9 fut révélé. Le Prophète ﷺ sourit en disant : 'Allah s'est étonné de votre acte.'",
    dalil_ref: 'Sahih al-Bukhari n°3798 ; Sahih Muslim n°2054',
    grade_hadith: 'Hadith Sahih',
    reponses: [
      { texte_fr: "Il éteignit la lampe et fit semblant de manger pour que l'invité mange à sa faim", est_correcte: true },
      { texte_fr: "Il chassa l'invité", est_correcte: false },
      { texte_fr: 'Il acheta plus de nourriture', est_correcte: false },
      { texte_fr: "Il refusa d'inviter", est_correcte: false },
    ],
  },

  // ===================== AKHLAQ niveau 5 (Expert) =====================
  {
    domaine: 'akhlaq', sous_domaine: 'sahaba', niveau: 5, madhab: 'general',
    texte_fr: 'Comment Umar ibn al-Khattab résolut-il le procès qu\'un copte fit contre son fils en Égypte ?',
    texte_ar: 'كيف حل عمر قضية القبطي ضد ابن عمرو بن العاص؟',
    explication: "Le fils de Amr ibn al-As avait frappé un copte. Umar convoqua les deux à Médine et fit frapper le fils par le copte en disant à Amr : 'Depuis quand asservissez-vous les hommes alors que leurs mères les ont enfantés libres ?' — leçon mémorable d'égalité devant la justice.",
    dalil_ref: 'Tarikh al-Tabari ; Futuh Misr',
    reponses: [
      { texte_fr: "Il fit frapper le fils par le copte et déclara la liberté innée des hommes", est_correcte: true },
      { texte_fr: 'Il refusa de juger', est_correcte: false },
      { texte_fr: 'Il prit le parti de son fils', est_correcte: false },
      { texte_fr: 'Il bannit le copte', est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq', sous_domaine: 'sahaba', niveau: 5, madhab: 'general',
    texte_fr: "Quelle vertu Uthman رضي الله عنه a-t-il manifestée lors de l'achat du puits de Ruma à Médine ?",
    texte_ar: 'ما الفضيلة التي أظهرها عثمان في شراء بئر رومة؟',
    explication: "Le puits appartenait à un juif qui vendait son eau cher. Uthman رضي الله عنه l'acheta et en fit un waqf pour les musulmans gratuitement. Le Prophète ﷺ avait dit : 'Qui achètera le puits de Ruma et fera siennes parts l'égal des musulmans ? Le Paradis lui est garanti.'",
    dalil_ref: 'Sahih al-Bukhari ; Sunan at-Tirmidhi n°3703',
    grade_hadith: 'Hadith Hasan',
    reponses: [
      { texte_fr: "Il acheta le puits et en fit don gratuit aux musulmans (waqf)", est_correcte: true },
      { texte_fr: "Il en fit une source de revenus pour lui-même", est_correcte: false },
      { texte_fr: 'Il refusa de payer le prix', est_correcte: false },
      { texte_fr: 'Il le revendit plus cher', est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq', sous_domaine: 'sahaba', niveau: 5, madhab: 'general',
    texte_fr: 'Quel principe de gouvernance Umar instaura-t-il en disant : "Si une mule trébuche en Iraq, je serai questionné..." ?',
    texte_ar: 'ما مبدأ الحكم الذي أرساه عمر بقوله: لو عثرت بغلة في العراق؟',
    explication: "Umar رضي الله عنه déclara : 'Si une mule trébuche en Iraq, je crains qu'Allah ne m'en demande compte pour n'avoir pas réparé la route.' — incarnation de la responsabilité (mas'uliyya) du dirigeant envers son peuple.",
    dalil_ref: 'Tarikh al-Tabari ; al-Bidaya wan-Nihaya',
    reponses: [
      { texte_fr: 'La responsabilité totale du dirigeant pour le bien-être de chaque sujet', est_correcte: true },
      { texte_fr: 'Le luxe pour le dirigeant', est_correcte: false },
      { texte_fr: "La non-ingérence dans les affaires du peuple", est_correcte: false },
      { texte_fr: "L'enrichissement personnel", est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq', sous_domaine: 'sahaba', niveau: 5, madhab: 'general',
    texte_fr: 'Pourquoi Abu Dharr al-Ghifari رضي الله عنه fut-il exilé à al-Rabadha ?',
    texte_ar: 'لماذا نفي أبو ذر إلى الربذة؟',
    explication: "Abu Dharr رضي الله عنه dénonçait l'accumulation des richesses par certains gouverneurs sous Uthman, citant 9:34. Il fut éloigné à al-Rabadha où il mourut pauvre — incarnant le zuhd (renoncement) et le commandement du bien.",
    dalil_ref: 'Sahih al-Bukhari ; Hilyat al-Awliya',
    grade_hadith: 'Hadith Sahih',
    reponses: [
      { texte_fr: "Pour avoir dénoncé l'accumulation des richesses, par zuhd et amr bil-ma'ruf", est_correcte: true },
      { texte_fr: "Pour avoir refusé de prier", est_correcte: false },
      { texte_fr: 'Pour avoir comploté', est_correcte: false },
      { texte_fr: 'Pour avoir renié l\'islam', est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq', sous_domaine: 'sahaba', niveau: 5, madhab: 'general',
    texte_fr: 'Que dit Aïcha رضي الله عنها lorsqu\'on l\'interrogeait sur le caractère du Prophète ﷺ ?',
    texte_ar: 'ماذا قالت عائشة عن خلق النبي ﷺ؟',
    explication: "Elle répondit : 'Son caractère était le Coran' (كان خلقه القرآن). Cette réponse synthétise la perfection morale du Prophète ﷺ : il vivait les commandements et interdits du Coran.",
    dalil_ref: 'Sahih Muslim n°746 ; Musnad Ahmad',
    grade_hadith: 'Hadith Sahih',
    reponses: [
      { texte_fr: 'Son caractère était le Coran (كان خلقه القرآن)', est_correcte: true },
      { texte_fr: 'Il était comme tout le monde', est_correcte: false },
      { texte_fr: 'Il était sévère', est_correcte: false },
      { texte_fr: 'Il était distant', est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq', sous_domaine: 'sahaba', niveau: 5, madhab: 'general',
    texte_fr: 'Quelle leçon de fidélité Saad ibn al-Rabi (Ansari) donna-t-il à Abdurrahman ibn Awf (Muhajir) ?',
    texte_ar: 'ما درس الأخوة التي قدمها سعد بن الربيع لعبد الرحمن بن عوف؟',
    explication: "Lors du jumelage (Mu'akhat), Saad proposa à Abdurrahman رضي الله عنهما la moitié de ses biens et même de divorcer une de ses deux épouses pour qu'il l'épouse. Abdurrahman refusa noblement et dit : 'Indique-moi le marché' — il y fit fortune par son commerce.",
    dalil_ref: 'Sahih al-Bukhari n°2049',
    grade_hadith: 'Hadith Sahih',
    reponses: [
      { texte_fr: "Il offrit la moitié de ses biens et de divorcer une épouse pour son frère", est_correcte: true },
      { texte_fr: "Il refusa de l'aider", est_correcte: false },
      { texte_fr: "Il lui prêta de l'argent à intérêt", est_correcte: false },
      { texte_fr: 'Il le rejeta', est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq', sous_domaine: 'sahaba', niveau: 5, madhab: 'general',
    texte_fr: "Quelle preuve d'intégrité Abdullah ibn Umar a-t-il montrée quand on lui offrit le Califat ?",
    texte_ar: 'ما موقف ابن عمر عند عرض الخلافة عليه؟',
    explication: "Pendant la fitna entre les compagnons, Abdullah ibn Umar رضي الله عنهما refusa toute fonction politique pour rester impartial. Il disait : 'Je n'ai pas peur du combat, mais je crains de tuer un musulman.' — exemple de wara' (piété scrupuleuse).",
    dalil_ref: 'Sahih al-Bukhari ; Tabaqat Ibn Saad',
    reponses: [
      { texte_fr: "Il refusa pour ne pas verser le sang musulman, par wara' et piété", est_correcte: true },
      { texte_fr: "Il accepta avec empressement", est_correcte: false },
      { texte_fr: 'Il complota contre Ali', est_correcte: false },
      { texte_fr: 'Il rejoignit les Kharijites', est_correcte: false },
    ],
  },
];

export async function seedQuestionsSahaba(client: Client): Promise<void> {
  console.log('Seeding Sahaba questions (Sirah + Akhlaq niveaux 4-5)...');

  let inserted = 0;
  let skipped = 0;

  for (const q of QUESTIONS_SAHABA) {
    const exists = await client.query(
      'SELECT id FROM questions WHERE texte_fr = $1',
      [q.texte_fr]
    );
    if (exists.rows.length > 0) { skipped++; continue; }

    const qResult = await client.query(
      `INSERT INTO questions (domaine, sous_domaine, niveau, madhab, texte_fr, texte_ar, dalil_ref, dalil_texte_ar, dalil_texte_fr, explication, savant_reference, grade_hadith, statut)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'valide')
       RETURNING id`,
      [
        q.domaine, q.sous_domaine ?? null, q.niveau, q.madhab,
        q.texte_fr, q.texte_ar ?? null,
        q.dalil_ref ?? null, q.dalil_texte_ar ?? null, q.dalil_texte_fr ?? null,
        q.explication ?? null, q.savant_reference ?? null, q.grade_hadith ?? null,
      ]
    );

    const questionId = qResult.rows[0].id;
    for (const r of q.reponses) {
      await client.query(
        `INSERT INTO reponses (question_id, texte_fr, texte_ar, est_correcte)
         VALUES ($1,$2,$3,$4)`,
        [questionId, r.texte_fr, r.texte_ar ?? null, r.est_correcte]
      );
    }
    inserted++;
  }

  console.log(`Sahaba: ${inserted} inserted, ${skipped} skipped.`);
}

if (require.main === module) {
  const { Client } = require('pg');
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  c.connect().then(async () => {
    await seedQuestionsSahaba(c);
    await c.end();
  }).catch((err: unknown) => { console.error(err); process.exit(1); });
}
