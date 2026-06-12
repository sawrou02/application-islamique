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

const QUESTIONS_AVANCEES: QuestionSeed[] = [
  // ============== FIQH COMPARÉ (niveau 4) ==============
  {
    domaine: 'fiqh_compare', sous_domaine: 'taharah', niveau: 4, madhab: 'general',
    texte_fr: "Selon les Hanafis, quelle est la quantité minimale d'eau considérée comme 'grande quantité' (ma' kathir) qui ne devient pas impure par simple contact d'une najasa ?",
    texte_ar: 'ما حدّ الماء الكثير عند الحنفية الذي لا يتنجس بمجرد ملاقاة النجاسة؟',
    explication: "Pour les Hanafis, l'eau dite 'grande' est celle d'un bassin d'environ 10x10 coudées (dira') de surface ; en deçà elle devient impure par contact. Les Shafi'is utilisent le critère des deux qullas (~ 270 litres).",
    savant_reference: 'Ibn Abidin, Radd al-Muhtar',
    reponses: [
      { texte_fr: "Un bassin d'environ 10 coudées par 10 coudées de surface", est_correcte: true },
      { texte_fr: "Deux qullas (environ 270 litres) comme chez les Shafi'is", est_correcte: false },
      { texte_fr: "Toute eau au-delà d'un sa' (env. 2,7 kg)", est_correcte: false },
      { texte_fr: "Il n'y a aucun critère quantitatif chez les Hanafis", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh_compare', sous_domaine: 'salat', niveau: 4, madhab: 'general',
    texte_fr: "Sur la récitation de la Fatiha derrière l'imam dans une prière à voix haute, quelle est la position du madhhab maliki ?",
    texte_ar: 'ما حكم قراءة الفاتحة خلف الإمام في الجهرية عند المالكية؟',
    explication: "Pour les Malikis, le ma'mum se tait et écoute dans les prières à voix haute (jahriyya), conformément au verset 'Lorsque le Coran est récité, écoutez-le' (7:204). Les Shafi'is exigent la Fatiha dans toutes les rak'at.",
    dalil_ref: 'Sourate Al-A\'raf 7:204',
    reponses: [
      { texte_fr: "Le suiveur se tait et écoute, la Fatiha n'est pas requise en jahriyya", est_correcte: true },
      { texte_fr: "La Fatiha est obligatoire dans toutes les rak'at, comme chez les Shafi'is", est_correcte: false },
      { texte_fr: "Le suiveur récite à voix haute après l'imam", est_correcte: false },
      { texte_fr: "Seule la Basmala doit être récitée par le suiveur", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh_compare', sous_domaine: 'zakat', niveau: 4, madhab: 'general',
    texte_fr: "Selon Abu Hanifa, le nisab du bétail bovin commence à combien de têtes et la zakat correspondante est ?",
    texte_ar: 'ما نصاب البقر وزكاته عند أبي حنيفة؟',
    explication: "Pour 30 vaches : un tabi' (veau d'un an). Pour 40 : une musinna (vache de deux ans). C'est la position de la majorité, dont les Hanafis, basée sur le hadith de Mu'adh envoyé au Yémen.",
    dalil_ref: "Sunan Abu Dawud 1576 (hadith de Mu'adh)",
    reponses: [
      { texte_fr: "30 vaches : un tabi' (veau d'un an)", est_correcte: true },
      { texte_fr: "5 vaches : un mouton", est_correcte: false },
      { texte_fr: "40 vaches : un tabi'", est_correcte: false },
      { texte_fr: "Pas de zakat sur les bovins selon les Hanafis", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh_compare', sous_domaine: 'sawm', niveau: 4, madhab: 'general',
    texte_fr: "Selon le madhhab hanbali, qu'advient-il du jeûne de celui qui mange ou boit par oubli ?",
    texte_ar: 'حكم من أكل أو شرب ناسياً في صيامه عند الحنابلة؟',
    dalil_ref: 'Sahih al-Bukhari 1933, Muslim 1155',
    dalil_texte_ar: 'مَنْ نَسِيَ وَهُوَ صَائِمٌ فَأَكَلَ أَوْ شَرِبَ فَلْيُتِمَّ صَوْمَهُ، فَإِنَّمَا أَطْعَمَهُ اللَّهُ وَسَقَاهُ',
    explication: "Pour les Hanbalis (et la majorité), celui qui mange par oubli poursuit son jeûne qui reste valide. Les Malikis exigent en revanche le qada (rattrapage) du jeûne de Ramadan dans cette situation.",
    reponses: [
      { texte_fr: "Son jeûne reste valide, il poursuit son jour sans qada", est_correcte: true },
      { texte_fr: "Il doit refaire le jour et expier (kaffara)", est_correcte: false },
      { texte_fr: "Il doit refaire le jour mais sans kaffara", est_correcte: false },
      { texte_fr: "Son jeûne est annulé totalement même s'il oublie", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh_compare', sous_domaine: 'hajj', niveau: 4, madhab: 'general',
    texte_fr: "Quelle est la position du madhhab shafi'i sur le tamattu' pour les habitants de La Mecque ?",
    texte_ar: 'حكم التمتع لأهل مكة عند الشافعية؟',
    dalil_ref: 'Sourate Al-Baqara 2:196',
    explication: "Les Shafi'is, basés sur le verset 'cela ne concerne pas ceux dont la famille réside près de la Mosquée Sacrée', considèrent que le tamattu' n'est pas légiféré pour les Mecquois ; s'il est fait, pas de hady obligatoire.",
    reponses: [
      { texte_fr: "Il n'est pas légiféré pour eux, donc pas de hady requis", est_correcte: true },
      { texte_fr: "Obligatoire avec hady comme pour les afaqi", est_correcte: false },
      { texte_fr: "Recommandé sans hady", est_correcte: false },
      { texte_fr: "Strictement interdit pour eux", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh_compare', sous_domaine: 'nikah', niveau: 4, madhab: 'general',
    texte_fr: "Sur la condition du wali dans le mariage, quelle est la divergence principale entre les Hanafis et la majorité ?",
    texte_ar: 'الخلاف في اشتراط الولي في النكاح بين الحنفية والجمهور؟',
    explication: "Les Hanafis (sauf reprise tardive) jugent valide le mariage conclu par la femme majeure sans wali (avec kafa'a) ; la majorité (Maliki, Shafi'i, Hanbali) exige le wali comme condition de validité, citant : 'Pas de mariage sans wali' (Abu Dawud 2085).",
    dalil_ref: 'Sunan Abu Dawud 2085',
    reponses: [
      { texte_fr: "Hanafis : valide sans wali si majeure ; majorité : wali obligatoire", est_correcte: true },
      { texte_fr: "Tous l'exigent à l'identique", est_correcte: false },
      { texte_fr: "Seuls les Shafi'is l'exigent", est_correcte: false },
      { texte_fr: "Les Malikis ne l'exigent pas", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh_compare', sous_domaine: 'muamalat', niveau: 4, madhab: 'general',
    texte_fr: "Quelle est la position des Malikis sur le bay' al-'ina (vente avec rachat à crédit) ?",
    texte_ar: 'حكم بيع العينة عند المالكية؟',
    explication: "Les Malikis (avec Hanbalis et Ibn Taymiyya) considèrent bay' al-'ina comme une ruse (hila) menant au riba et la prohibent. Les Shafi'is la jugent licite au regard du contrat extérieur. Ibn al-Qayyim la réfute fortement dans I'lam al-Muwaqqi'in.",
    savant_reference: "Ibn al-Qayyim, I'lam al-Muwaqqi'in",
    reponses: [
      { texte_fr: "Interdite car ruse vers le riba", est_correcte: true },
      { texte_fr: "Pleinement licite chez les Malikis", est_correcte: false },
      { texte_fr: "Permise uniquement entre proches", est_correcte: false },
      { texte_fr: "Makruh sans plus", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh_compare', sous_domaine: 'taharah', niveau: 4, madhab: 'general',
    texte_fr: "Quel est le hukm de l'eau de mer pour la purification selon la majorité des fuqaha ?",
    texte_ar: 'حكم ماء البحر في الطهارة؟',
    dalil_ref: 'Sunan Abu Dawud 83, At-Tirmidhi 69',
    dalil_texte_ar: 'هُوَ الطَّهُورُ مَاؤُهُ، الْحِلُّ مَيْتَتُهُ',
    grade_hadith: 'sahih',
    explication: "Le hadith authentique du Prophète ﷺ sur la mer ('Son eau est pure, sa charogne est licite') établit que l'eau de mer est tahur (purifiante), à l'unanimité après la levée du désaccord d'Abdullah ibn Amr.",
    reponses: [
      { texte_fr: "Pure et purifiante par texte explicite", est_correcte: true },
      { texte_fr: "Pure mais non purifiante", est_correcte: false },
      { texte_fr: "Impure par excès de sel", est_correcte: false },
      { texte_fr: "Purifiante seulement en cas de nécessité", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh_compare', sous_domaine: 'salat', niveau: 4, madhab: 'general',
    texte_fr: "Sur le qunut dans la prière du Fajr de manière régulière, quelle est la position des Shafi'is ?",
    texte_ar: 'حكم القنوت في الفجر عند الشافعية؟',
    explication: "Les Shafi'is considèrent le qunut du Fajr comme sunna mu'akkada permanente, après le ruku' de la deuxième rak'a. Les Hanbalis et Hanafis le réservent au nawazil (calamités). Les Malikis le considèrent mustahabb avant le ruku'.",
    savant_reference: "An-Nawawi, Al-Majmu'",
    reponses: [
      { texte_fr: "Sunna mu'akkada permanente après le ruku' de la 2e rak'a", est_correcte: true },
      { texte_fr: "Strictement interdit (bid'a)", est_correcte: false },
      { texte_fr: "Réservé aux calamités uniquement", est_correcte: false },
      { texte_fr: "Wajib selon les Shafi'is", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh_compare', sous_domaine: 'janaza', niveau: 4, madhab: 'general',
    texte_fr: "Combien de takbirat la prière funéraire compte-t-elle selon les quatre madhahib ?",
    texte_ar: 'كم تكبيرة في صلاة الجنازة عند المذاهب الأربعة؟',
    dalil_ref: 'Sahih al-Bukhari 1245, Muslim 951',
    explication: "Les quatre madhahib s'accordent sur quatre takbirat, conformément à la prière du Prophète ﷺ sur le Négus. Certaines traditions rapportent jusqu'à cinq takbirat, ce qui constituait des cas particuliers.",
    reponses: [
      { texte_fr: "Quatre takbirat à l'unanimité des quatre madhahib", est_correcte: true },
      { texte_fr: "Cinq selon les Hanafis, quatre pour les autres", est_correcte: false },
      { texte_fr: "Trois pour Malik, quatre pour les autres", est_correcte: false },
      { texte_fr: "Sept selon les Hanbalis", est_correcte: false },
    ],
  },

  // ============== MUSTALAH AL-HADITH (niveau 4-5) ==============
  {
    domaine: 'mustalah_hadith', niveau: 4, madhab: 'general',
    texte_fr: "Qu'est-ce qu'un hadith 'mutawatir' selon les muhaddithun ?",
    texte_ar: 'ما الحديث المتواتر عند المحدثين؟',
    explication: "Le mutawatir est un hadith rapporté par un nombre tellement grand de transmetteurs à chaque niveau de la chaîne qu'il est impossible qu'ils se soient concertés pour mentir, et dont le contenu est sensoriel. Il donne 'ilm yaqini.",
    savant_reference: 'As-Suyuti, Tadrib al-Rawi',
    reponses: [
      { texte_fr: "Rapporté à chaque niveau par un nombre exclusif de complot dans le mensonge", est_correcte: true },
      { texte_fr: "Rapporté uniquement par dix compagnons", est_correcte: false },
      { texte_fr: "Tout hadith dans les Sahihayn", est_correcte: false },
      { texte_fr: "Hadith dont le matn est répété trois fois", est_correcte: false },
    ],
  },
  {
    domaine: 'mustalah_hadith', niveau: 4, madhab: 'general',
    texte_fr: "Que désigne un hadith 'mursal' dans la terminologie classique ?",
    texte_ar: 'ما الحديث المرسل في الاصطلاح؟',
    explication: "Le mursal, selon la définition classique, est un hadith où un tabi'i rapporte directement du Prophète ﷺ sans mentionner le compagnon intermédiaire. Sa recevabilité divise : les Hanafis et Malikis l'acceptent sous conditions, les Shafi'is le rejettent sauf exceptions.",
    savant_reference: 'Ibn al-Salah, Muqaddima',
    reponses: [
      { texte_fr: "Un tabi'i rapporte du Prophète ﷺ sans citer le compagnon", est_correcte: true },
      { texte_fr: "Hadith dont la chaîne est interrompue en début", est_correcte: false },
      { texte_fr: "Hadith rapporté par un seul transmetteur", est_correcte: false },
      { texte_fr: "Hadith dont le matn contredit le Coran", est_correcte: false },
    ],
  },
  {
    domaine: 'mustalah_hadith', niveau: 4, madhab: 'general',
    texte_fr: "Quelle est la différence entre 'sahih li-dhatihi' et 'sahih li-ghayrihi' ?",
    texte_ar: 'الفرق بين الصحيح لذاته والصحيح لغيره؟',
    explication: "Sahih li-dhatihi remplit toutes les conditions d'authenticité par lui-même (chaîne ininterrompue, transmetteurs adl et dabit, absence de shadh et 'illa). Sahih li-ghayrihi est en réalité un hasan li-dhatihi élevé au sahih par la multiplicité des chaînes de soutien.",
    reponses: [
      { texte_fr: "L'un remplit les critères par lui-même, l'autre par multiplicité des voies", est_correcte: true },
      { texte_fr: "L'un est dans Bukhari, l'autre dans Muslim", est_correcte: false },
      { texte_fr: "L'un concerne 'aqida, l'autre fiqh", est_correcte: false },
      { texte_fr: "Aucune différence pratique", est_correcte: false },
    ],
  },
  {
    domaine: 'mustalah_hadith', niveau: 4, madhab: 'general',
    texte_fr: "Que signifie le terme 'munkar' chez les muhaddithun selon Ibn Hajar ?",
    texte_ar: 'ما المنكر عند ابن حجر؟',
    explication: "Pour Ibn Hajar (Nukhbat al-Fikar), le munkar est ce que rapporte un transmetteur faible en contredisant ce que rapporte un transmetteur fiable. Il s'oppose au ma'ruf. Les anciens utilisaient parfois munkar pour tout fard d'un faible.",
    savant_reference: 'Ibn Hajar, Nukhbat al-Fikar',
    reponses: [
      { texte_fr: "Ce qu'un faible rapporte en contradiction avec un fiable", est_correcte: true },
      { texte_fr: "Tout hadith rejeté par Bukhari", est_correcte: false },
      { texte_fr: "Hadith dont le matn paraît étrange", est_correcte: false },
      { texte_fr: "Synonyme exact de mawdu'", est_correcte: false },
    ],
  },
  {
    domaine: 'mustalah_hadith', niveau: 5, madhab: 'general',
    texte_fr: "Quelle est la différence entre 'shadh' et 'munkar' selon la classification d'Ibn Hajar ?",
    texte_ar: 'الفرق بين الشاذ والمنكر عند ابن حجر؟',
    explication: "Selon Ibn Hajar : si un transmetteur fiable (thiqa) contredit un plus fiable, c'est shadh. Si un faible (da'if) contredit un fiable, c'est munkar. Tous deux sont rejetés mais selon des modalités différentes.",
    savant_reference: 'Ibn Hajar, Nuzhat al-Nazar',
    reponses: [
      { texte_fr: "Shadh : thiqa contredit plus thiqa ; Munkar : da'if contredit thiqa", est_correcte: true },
      { texte_fr: "Aucune différence selon Ibn Hajar", est_correcte: false },
      { texte_fr: "Shadh concerne le matn, munkar la chaîne", est_correcte: false },
      { texte_fr: "Shadh est accepté, munkar rejeté", est_correcte: false },
    ],
  },
  {
    domaine: 'mustalah_hadith', niveau: 5, madhab: 'general',
    texte_fr: "Qu'est-ce qu'un hadith 'mu'allaq' et où en trouve-t-on chez al-Bukhari ?",
    texte_ar: 'ما الحديث المعلق وأين يوجد عند البخاري؟',
    explication: "Mu'allaq : un ou plusieurs maillons de la chaîne sont omis à partir du début (côté musannif). Bukhari en a beaucoup dans les tarajim (titres de chapitres). Quand il l'introduit par 'qala' (jazm), c'est sahih chez lui ; par 'yurwa' ou 'yudhkar' (passif), il peut être plus faible.",
    savant_reference: "Ibn Hajar, Hadi al-Sari",
    reponses: [
      { texte_fr: "Chaîne omise du côté musannif ; nombreux dans les tarajim de Bukhari", est_correcte: true },
      { texte_fr: "Mu'allaq signifie un hadith oral sans isnad écrit", est_correcte: false },
      { texte_fr: "On n'en trouve aucun dans Sahih al-Bukhari", est_correcte: false },
      { texte_fr: "Synonyme strict de mursal", est_correcte: false },
    ],
  },
  {
    domaine: 'mustalah_hadith', niveau: 5, madhab: 'general',
    texte_fr: "Que signifie 'al-jarh muqaddam ala al-ta'dil' et avec quelle nuance ?",
    texte_ar: 'معنى الجرح مقدّم على التعديل مع التفصيل؟',
    explication: "Règle de 'ilm al-rijal : la critique négative motivée (mufassar) prime sur l'éloge, car le critique connaît une cause cachée au laudateur. Toutefois, certains savants exigent que le jarh provienne d'un imam connu et qu'il ne soit pas dû à une rivalité personnelle.",
    savant_reference: 'Al-Khatib al-Baghdadi, al-Kifaya',
    reponses: [
      { texte_fr: "Le jarh motivé prime mais doit être expliqué et exempt de rivalité", est_correcte: true },
      { texte_fr: "Tout jarh, même non motivé, prime absolument", est_correcte: false },
      { texte_fr: "Le ta'dil prime toujours sur le jarh", est_correcte: false },
      { texte_fr: "Cette règle ne s'applique qu'aux Compagnons", est_correcte: false },
    ],
  },
  {
    domaine: 'mustalah_hadith', niveau: 5, madhab: 'general',
    texte_fr: "Qu'est-ce que la 'mudraj' dans la terminologie du hadith ?",
    texte_ar: 'ما المدرج في علم الحديث؟',
    explication: "Mudraj : insertion dans la chaîne ou le matn d'un texte qui n'en fait pas partie originellement (parole du rawi confondue avec celle du Prophète ﷺ). Identifiable par recoupement avec d'autres voies. Exemple connu : la fin du hadith 'asbigh al-wudu' chez Abu Hurayra.",
    savant_reference: "Al-Khatib, al-Fasl li-l-Wasl al-Mudraj",
    reponses: [
      { texte_fr: "Insertion dans isnad ou matn d'un texte qui n'en fait pas partie", est_correcte: true },
      { texte_fr: "Hadith dont le rapporteur est inconnu", est_correcte: false },
      { texte_fr: "Hadith faible dont la chaîne est forgée", est_correcte: false },
      { texte_fr: "Synonyme d'inqita'", est_correcte: false },
    ],
  },
  {
    domaine: 'mustalah_hadith', niveau: 5, madhab: 'general',
    texte_fr: "Quelle est la différence entre 'munqati'', 'mu'dal' et 'mu'allaq' ?",
    texte_ar: 'الفرق بين المنقطع والمعضل والمعلق؟',
    explication: "Munqati' : chute d'un rawi (non Compagnon) au milieu de la chaîne. Mu'dal : chute consécutive de deux rawi ou plus. Mu'allaq : chute d'un ou plusieurs au début (du côté musannif). Tous sont des formes d'inqita'.",
    savant_reference: "Ibn al-Salah, Muqaddima",
    reponses: [
      { texte_fr: "Un manquant au milieu / deux consécutifs au milieu / début de chaîne", est_correcte: true },
      { texte_fr: "Trois noms pour la même réalité", est_correcte: false },
      { texte_fr: "Ils diffèrent uniquement par l'auteur du livre", est_correcte: false },
      { texte_fr: "Tous concernent le matn, pas l'isnad", est_correcte: false },
    ],
  },
  {
    domaine: 'mustalah_hadith', niveau: 5, madhab: 'general',
    texte_fr: "Que signifie 'thiqa' vs 'saduq' dans la hiérarchie de Ibn Hajar dans Taqrib al-Tahdhib ?",
    texte_ar: 'الفرق بين الثقة والصدوق في تقريب التهذيب؟',
    explication: "Ibn Hajar établit douze rangs. 'Thiqa' est le 3e rang : adl + dabt parfait, hadith sahih. 'Saduq' est le 4e : adl + dabt léger, hadith hasan. Cette gradation est essentielle pour juger la chaîne.",
    savant_reference: "Ibn Hajar, Taqrib al-Tahdhib (muqaddima)",
    reponses: [
      { texte_fr: "Thiqa (3e rang) = sahih ; Saduq (4e rang) = hasan", est_correcte: true },
      { texte_fr: "Ce sont des synonymes parfaits", est_correcte: false },
      { texte_fr: "Saduq est supérieur à thiqa", est_correcte: false },
      { texte_fr: "Thiqa concerne 'aqida, saduq fiqh", est_correcte: false },
    ],
  },

  // ============== USUL AL-FIQH (niveau 4) ==============
  {
    domaine: 'usul_fiqh', niveau: 4, madhab: 'general',
    texte_fr: "Quelle est la définition du 'ijma' sukuti' (consensus tacite) et son statut ?",
    texte_ar: 'تعريف الإجماع السكوتي وحكمه؟',
    explication: "Ijma' sukuti : un mujtahid émet un avis à son époque, les autres en ont connaissance et se taisent. Les Hanafis et certains Shafi'is l'acceptent comme hujja ; les Malikis et la majorité des Shafi'is la limitent à une présomption.",
    savant_reference: "Al-Amidi, al-Ihkam fi Usul al-Ahkam",
    reponses: [
      { texte_fr: "Avis d'un mujtahid connu sans objection des autres ; statut débattu", est_correcte: true },
      { texte_fr: "Consensus formel par écrit de tous les mujtahidun", est_correcte: false },
      { texte_fr: "Accord unanime des Compagnons uniquement", est_correcte: false },
      { texte_fr: "Une innovation rejetée par tous", est_correcte: false },
    ],
  },
  {
    domaine: 'usul_fiqh', niveau: 4, madhab: 'general',
    texte_fr: "Quelles sont les quatre conditions classiques du qiyas (analogie juridique) ?",
    texte_ar: 'أركان القياس الأربعة؟',
    explication: "Les quatre arkan du qiyas : 1) al-asl (cas originel), 2) al-far' (cas nouveau), 3) hukm al-asl (jugement du cas originel), 4) al-'illa (cause efficiente commune). Exemple : interdiction du nabidh par analogie au khamr via l'iskar.",
    savant_reference: 'Al-Ghazali, al-Mustasfa',
    reponses: [
      { texte_fr: "Al-asl, al-far', hukm al-asl, al-'illa", est_correcte: true },
      { texte_fr: "Nass, ijma', qiyas, istihsan", est_correcte: false },
      { texte_fr: "Halal, haram, mubah, makruh", est_correcte: false },
      { texte_fr: "Wajib, mandub, mubah, mahzur", est_correcte: false },
    ],
  },
  {
    domaine: 'usul_fiqh', niveau: 4, madhab: 'general',
    texte_fr: "Qu'est-ce que l'istihsan dans le madhhab hanafi et pourquoi as-Shafi'i l'a-t-il critiqué ?",
    texte_ar: 'الاستحسان عند الحنفية ونقد الشافعي له؟',
    explication: "L'istihsan hanafi est le passage d'un qiyas apparent à un qiyas caché plus fort, ou à un texte/ijma/nécessité. As-Shafi'i (Ar-Risala) le critiqua comme 'législation par caprice' ; les Hanafis répondirent qu'il s'agit en fait d'un istidlal fondé.",
    savant_reference: "Al-Shafi'i, Ar-Risala ; al-Sarakhsi, al-Mabsut",
    reponses: [
      { texte_fr: "Passer d'un qiyas apparent à un dalil plus fort ; Shafi'i y voyait du tashri'", est_correcte: true },
      { texte_fr: "Choisir la position la plus facile sans dalil ; rejeté par Abu Hanifa", est_correcte: false },
      { texte_fr: "Suivre l'avis du juge ; accepté par tous", est_correcte: false },
      { texte_fr: "Une innovation tardive des Ottomans", est_correcte: false },
    ],
  },
  {
    domaine: 'usul_fiqh', niveau: 4, madhab: 'general',
    texte_fr: "Quelle est la différence entre 'amm' (général) et 'mutlaq' (absolu) ?",
    texte_ar: 'الفرق بين العام والمطلق في الأصول؟',
    explication: "Al-'amm englobe tous les individus du sens (ex. 'al-muslimun'). Al-mutlaq vise la quiddité sans considération de quantité (ex. 'raqaba' = un esclave indéterminé). Le 'amm est restreint par takhsis ; le mutlaq est précisé par taqyid.",
    savant_reference: "Ibn Qudama, Rawdat al-Nazir",
    reponses: [
      { texte_fr: "Le 'amm couvre tous les individus ; le mutlaq vise la quiddité sans quantité", est_correcte: true },
      { texte_fr: "Synonymes exacts", est_correcte: false },
      { texte_fr: "Le 'amm est dans le Coran, le mutlaq dans la Sunna", est_correcte: false },
      { texte_fr: "Le mutlaq est restreint par takhsis", est_correcte: false },
    ],
  },
  {
    domaine: 'usul_fiqh', niveau: 4, madhab: 'general',
    texte_fr: "Que sont les 'maqasid al-shari'a' selon ash-Shatibi ?",
    texte_ar: 'مقاصد الشريعة عند الشاطبي؟',
    explication: "Ash-Shatibi (al-Muwafaqat) systématise les maqasid en daruriyyat (5 : din, nafs, 'aql, nasl, mal), hajiyyat (besoins) et tahsiniyyat (perfectionnements). C'est la grille classique pour le raisonnement maslahi.",
    savant_reference: "Ash-Shatibi, al-Muwafaqat",
    reponses: [
      { texte_fr: "Daruriyyat (5), hajiyyat, tahsiniyyat", est_correcte: true },
      { texte_fr: "Wajib, mandub, mubah, makruh, haram", est_correcte: false },
      { texte_fr: "Tawhid, salat, zakat, sawm, hajj", est_correcte: false },
      { texte_fr: "Coran, Sunna, ijma, qiyas", est_correcte: false },
    ],
  },
  {
    domaine: 'usul_fiqh', niveau: 4, madhab: 'general',
    texte_fr: "Qu'est-ce que la 'maslaha mursala' chez les Malikis ?",
    texte_ar: 'المصلحة المرسلة عند المالكية؟',
    explication: "Maslaha mursala : intérêt non couvert par un texte spécifique ni infirmé par un texte. Les Malikis (et Hanbalis modérément) en font une source. Ses conditions : intérêt réel, général, et non contraire à un texte ni un maqsad.",
    savant_reference: "Ash-Shatibi, al-I'tisam",
    reponses: [
      { texte_fr: "Intérêt non couvert ni infirmé par un texte, sous conditions strictes", est_correcte: true },
      { texte_fr: "Tout avis personnel du juge", est_correcte: false },
      { texte_fr: "Coutume non-islamique", est_correcte: false },
      { texte_fr: "Innovation rejetée par tous", est_correcte: false },
    ],
  },
  {
    domaine: 'usul_fiqh', niveau: 4, madhab: 'general',
    texte_fr: "Quelle est la hiérarchie des sources juridiques chez l'imam ash-Shafi'i ?",
    texte_ar: 'مصادر التشريع عند الشافعي؟',
    explication: "Dans Ar-Risala : Coran et Sunna (équivalents en autorité), puis ijma', puis qiyas. Ash-Shafi'i a rejeté istihsan et la maslaha mursala comme sources indépendantes.",
    savant_reference: "Ash-Shafi'i, Ar-Risala",
    reponses: [
      { texte_fr: "Coran et Sunna, puis ijma', puis qiyas", est_correcte: true },
      { texte_fr: "Coran, Sunna, istihsan, 'urf", est_correcte: false },
      { texte_fr: "Coran seul, le reste rejeté", est_correcte: false },
      { texte_fr: "Sunna, Coran, qiyas, istishab", est_correcte: false },
    ],
  },
  {
    domaine: 'usul_fiqh', niveau: 4, madhab: 'general',
    texte_fr: "Que signifie 'al-asl baqa' ma kana ala ma kana' (istishab) ?",
    texte_ar: 'قاعدة الاستصحاب: الأصل بقاء ما كان على ما كان؟',
    explication: "Istishab : présomption de continuité d'un état établi jusqu'à preuve contraire. Exemple : qui a fait wudu reste en état de pureté jusqu'à preuve de nullité. Très utilisé chez les Shafi'is et Hanbalis.",
    savant_reference: "Ash-Shawkani, Irshad al-Fuhul",
    reponses: [
      { texte_fr: "Présomption de continuité d'un état jusqu'à preuve contraire", est_correcte: true },
      { texte_fr: "Obligation d'imiter strictement les Salaf", est_correcte: false },
      { texte_fr: "Présomption de prohibition par défaut", est_correcte: false },
      { texte_fr: "Conservation des coutumes locales", est_correcte: false },
    ],
  },

  // ============== AQIDA AVANCÉE (niveau 4) ==============
  {
    domaine: 'aqida_avancee', niveau: 4, madhab: 'general',
    texte_fr: "Selon Ahl al-Sunna wa al-Jama'a, comment doit-on traiter les attributs khabariyya (rapportés) comme yad, wajh, istiwa ?",
    texte_ar: 'منهج أهل السنة في الصفات الخبرية؟',
    explication: "Les Salaf et Ahl al-Sunna affirment ces attributs sans tahrif (déformation), ta'til (négation), takyif (modalisation) ni tamthil (assimilation), selon la parole : 'Rien ne Lui est semblable' (42:11). C'est l'imrar tel qu'il est venu.",
    dalil_ref: 'Sourate Ash-Shura 42:11',
    savant_reference: "Ibn Taymiyya, al-'Aqida al-Wasitiyya",
    reponses: [
      { texte_fr: "Les affirmer sans tahrif, ta'til, takyif ni tamthil", est_correcte: true },
      { texte_fr: "Les nier totalement pour préserver le tawhid", est_correcte: false },
      { texte_fr: "Les interpréter métaphoriquement systématiquement", est_correcte: false },
      { texte_fr: "Les comparer aux attributs humains", est_correcte: false },
    ],
  },
  {
    domaine: 'aqida_avancee', niveau: 4, madhab: 'general',
    texte_fr: "Quelles sont les trois catégories du tawhid selon la classification des savants Ahl al-Sunna ?",
    texte_ar: 'أقسام التوحيد الثلاثة عند أهل السنة؟',
    explication: "Tawhid al-rububiyya (unicité de Seigneurie : création, providence), tawhid al-uluhiyya (unicité d'adoration), tawhid al-asma wa al-sifat (unicité des noms et attributs). Catégorisation systématisée notamment par Ibn Taymiyya à partir des textes.",
    savant_reference: "Ibn Taymiyya, Majmu' al-Fatawa",
    reponses: [
      { texte_fr: "Rububiyya, uluhiyya, asma wa sifat", est_correcte: true },
      { texte_fr: "Iman, islam, ihsan", est_correcte: false },
      { texte_fr: "Tawhid du cœur, de la langue, des membres", est_correcte: false },
      { texte_fr: "Tawhid des prophètes, des anges, des livres", est_correcte: false },
    ],
  },
  {
    domaine: 'aqida_avancee', niveau: 4, madhab: 'general',
    texte_fr: "Que sont les six piliers de la foi (arkan al-iman) selon le hadith de Jibril ?",
    texte_ar: 'أركان الإيمان الستة في حديث جبريل؟',
    dalil_ref: 'Sahih Muslim 8',
    explication: "Hadith de Jibril (Muslim 8) : croire en Allah, Ses anges, Ses livres, Ses messagers, le Jour dernier, et le qadar bon et mauvais. C'est le fondement du iman selon Ahl al-Sunna.",
    reponses: [
      { texte_fr: "Allah, anges, livres, messagers, Jour dernier, qadar", est_correcte: true },
      { texte_fr: "Shahada, salat, zakat, sawm, hajj, jihad", est_correcte: false },
      { texte_fr: "Coran, Sunna, ijma', qiyas, urf, maslaha", est_correcte: false },
      { texte_fr: "Tawhid, nubuwwa, ma'ad, 'adl, imama", est_correcte: false },
    ],
  },
  {
    domaine: 'aqida_avancee', niveau: 4, madhab: 'general',
    texte_fr: "Que sont les quatre étapes du qadar selon les savants Ahl al-Sunna ?",
    texte_ar: 'مراتب القدر الأربعة؟',
    explication: "Les quatre maratib du qadar : al-'ilm (science préalable d'Allah), al-kitaba (consignation dans la Lawh Mahfuz), al-mashi'a (volonté divine englobante), al-khalq (création effective). Quiconque nie l'une nie le qadar.",
    savant_reference: "Ibn al-Qayyim, Shifa' al-'Alil",
    reponses: [
      { texte_fr: "'Ilm, kitaba, mashi'a, khalq", est_correcte: true },
      { texte_fr: "Passé, présent, futur, éternité", est_correcte: false },
      { texte_fr: "Naissance, vie, mort, résurrection", est_correcte: false },
      { texte_fr: "Lawh, Qalam, 'Arsh, Kursi", est_correcte: false },
    ],
  },
  {
    domaine: 'aqida_avancee', niveau: 4, madhab: 'general',
    texte_fr: "Quelle est la position d'Ahl al-Sunna sur l'iman : augmente-t-il et diminue-t-il ?",
    texte_ar: 'هل يزيد الإيمان وينقص عند أهل السنة؟',
    dalil_ref: 'Sourate Al-Anfal 8:2',
    dalil_texte_ar: 'وَإِذَا تُلِيَتْ عَلَيْهِمْ آيَاتُهُ زَادَتْهُمْ إِيمَانًا',
    explication: "Pour Ahl al-Sunna, l'iman augmente par la 'ta'a (obéissance) et diminue par les ma'siyat. Comprend la croyance du cœur, la parole de la langue, l'œuvre des membres. Contrairement aux Murji'a qui le limitent au cœur.",
    savant_reference: "Al-Lalika'i, Sharh Usul I'tiqad Ahl al-Sunna",
    reponses: [
      { texte_fr: "Il augmente par l'obéissance et diminue par la désobéissance", est_correcte: true },
      { texte_fr: "Il est fixe et ne change jamais (Murji'a)", est_correcte: false },
      { texte_fr: "Il disparaît totalement au moindre péché (Khawarij)", est_correcte: false },
      { texte_fr: "Il est purement intellectuel sans rapport aux actes", est_correcte: false },
    ],
  },
  {
    domaine: 'aqida_avancee', niveau: 4, madhab: 'general',
    texte_fr: "Que dit Ahl al-Sunna sur la vision d'Allah (ru'ya) au Jour du Jugement ?",
    texte_ar: 'رؤية الله يوم القيامة عند أهل السنة؟',
    dalil_ref: 'Sourate Al-Qiyama 75:22-23 ; Sahih al-Bukhari 554, Muslim 633',
    dalil_texte_ar: 'وُجُوهٌ يَوْمَئِذٍ نَاضِرَةٌ * إِلَى رَبِّهَا نَاظِرَةٌ',
    explication: "Ahl al-Sunna affirme que les croyants verront leur Seigneur au Paradis, par le verset 'des visages ce jour-là rayonnants regardant vers leur Seigneur' et le hadith mutawatir 'Vous verrez votre Seigneur comme vous voyez cette lune'. Les Mu'tazila l'ont niée.",
    reponses: [
      { texte_fr: "Affirmée pour les croyants au Paradis par texte et tawatur", est_correcte: true },
      { texte_fr: "Niée totalement, impossible (position mu'tazilite)", est_correcte: false },
      { texte_fr: "Réservée aux prophètes uniquement", est_correcte: false },
      { texte_fr: "Vision du cœur uniquement, pas des yeux", est_correcte: false },
    ],
  },
  {
    domaine: 'aqida_avancee', niveau: 4, madhab: 'general',
    texte_fr: "Quelle est la position d'Ahl al-Sunna sur les Compagnons et l'interdiction de leur sabb ?",
    texte_ar: 'موقف أهل السنة من سب الصحابة؟',
    dalil_ref: 'Sahih al-Bukhari 3673, Muslim 2540',
    dalil_texte_ar: 'لَا تَسُبُّوا أَصْحَابِي',
    explication: "Ahl al-Sunna : tous les Compagnons sont 'udul (intègres) ; on retient leurs vertus et on se tait sur leurs différends. Les insulter (sabb) est gravement interdit par le hadith 'Ne dénigrez pas mes Compagnons'.",
    savant_reference: "At-Tahawi, al-'Aqida at-Tahawiyya",
    reponses: [
      { texte_fr: "Tous sont 'udul ; les insulter est gravement interdit", est_correcte: true },
      { texte_fr: "On peut librement critiquer leurs erreurs personnelles", est_correcte: false },
      { texte_fr: "Seuls les quatre premiers califes sont 'udul", est_correcte: false },
      { texte_fr: "Position rafidite : seuls les Ahl al-Bayt sont fiables", est_correcte: false },
    ],
  },
  {
    domaine: 'aqida_avancee', niveau: 4, madhab: 'general',
    texte_fr: "Que signifie 'al-Qur'an kalam Allah, ghayr makhluq' et quelle controverse historique cela évoque-t-il ?",
    texte_ar: 'القرآن كلام الله غير مخلوق وفتنة خلق القرآن؟',
    explication: "Position d'Ahl al-Sunna : le Coran est la parole d'Allah, non créée. Lors de la mihna (218-234 H), les Mu'tazila imposèrent au pouvoir la doctrine du Coran créé. L'imam Ahmad endura l'épreuve et incarna la position sunnite.",
    savant_reference: "Ibn Qudama, Lum'at al-I'tiqad",
    reponses: [
      { texte_fr: "Position sunnite défendue par l'imam Ahmad pendant la mihna", est_correcte: true },
      { texte_fr: "Innovation tardive du 5e siècle hégirien", est_correcte: false },
      { texte_fr: "Position mu'tazilite contre Ahmad", est_correcte: false },
      { texte_fr: "Doctrine ash'arite uniquement", est_correcte: false },
    ],
  },

  // ============== TAFSIR AVANCÉ (niveau 4-5) ==============
  {
    domaine: 'tafsir_avance', niveau: 4, madhab: 'general',
    texte_fr: "Quel est l'asbab an-nuzul du verset du tayammum (5:6) selon l'épisode de 'Aisha ?",
    texte_ar: 'سبب نزول آية التيمم في قصة عائشة؟',
    dalil_ref: 'Sahih al-Bukhari 334, Muslim 367',
    explication: "Lors d'une expédition, 'Aisha perdit un collier près de Bayda. L'armée campa sans eau, et le verset du tayammum fut révélé. Usayd ibn Hudayr dit : 'Ce n'est pas la première bénédiction de votre famille, ô famille d'Abu Bakr'.",
    reponses: [
      { texte_fr: "Perte du collier de 'Aisha à Bayda lors d'une expédition", est_correcte: true },
      { texte_fr: "Maladie de blessés au cours de la bataille d'Uhud", est_correcte: false },
      { texte_fr: "Sécheresse à Médine pendant la 5e année", est_correcte: false },
      { texte_fr: "Demande de Mu'adh ibn Jabal au Yémen", est_correcte: false },
    ],
  },
  {
    domaine: 'tafsir_avance', niveau: 4, madhab: 'general',
    texte_fr: "Quel est le tafsir prédominant de 'al-shafa'a' dans le verset 2:255 (Ayat al-Kursi) selon Ibn Kathir ?",
    texte_ar: 'تفسير الشفاعة في آية الكرسي عند ابن كثير؟',
    dalil_ref: 'Sourate Al-Baqara 2:255',
    explication: "Ibn Kathir : nul n'intercède auprès d'Allah sans Son autorisation préalable. Réfute la conception polythéiste d'intercesseurs autonomes. Conditions : agrément du shafi' et du mashfu' lah. Tous deux par le tawhid.",
    savant_reference: 'Tafsir Ibn Kathir',
    reponses: [
      { texte_fr: "Nulle intercession sans permission préalable d'Allah", est_correcte: true },
      { texte_fr: "Intercession automatique des saints", est_correcte: false },
      { texte_fr: "Intercession promise à tous sans condition", est_correcte: false },
      { texte_fr: "Intercession niée totalement", est_correcte: false },
    ],
  },
  {
    domaine: 'tafsir_avance', niveau: 4, madhab: 'general',
    texte_fr: "Que dit as-Sa'di sur 'al-mathani' dans 'Wa laqad ataynaka sab'an min al-mathani' (15:87) ?",
    texte_ar: "تفسير المثاني في آية 'سبعا من المثاني' عند السعدي؟",
    dalil_ref: 'Sourate Al-Hijr 15:87',
    explication: "As-Sa'di (et le hadith authentique de Bukhari 4474) : 'al-sab' al-mathani' = al-Fatiha, ainsi nommée car répétée dans chaque rak'a et car ses sens sont alternés (louange, supplication...). Autre avis : les sept longues sourates.",
    savant_reference: "Tafsir as-Sa'di",
    reponses: [
      { texte_fr: "Al-Fatiha (sept versets répétés)", est_correcte: true },
      { texte_fr: "Les sept cieux", est_correcte: false },
      { texte_fr: "Les sept letters (ahruf)", est_correcte: false },
      { texte_fr: "Les sept Compagnons rapporteurs", est_correcte: false },
    ],
  },
  {
    domaine: 'tafsir_avance', niveau: 4, madhab: 'general',
    texte_fr: "Quel est l'asbab an-nuzul de 'la ikraha fi al-din' (2:256) ?",
    texte_ar: 'سبب نزول لا إكراه في الدين؟',
    dalil_ref: 'Sourate Al-Baqara 2:256 ; Sunan Abu Dawud 2682',
    explication: "Rapporté par Ibn 'Abbas : certains Ansar avaient juré dans la jahiliyya que si leurs enfants survivaient, ils les feraient juifs. Quand les Banu al-Nadir furent expulsés, leurs enfants juifs étaient parmi eux ; les pères voulurent les retenir, le verset descendit.",
    savant_reference: 'Asbab al-Nuzul d\'al-Wahidi ; Tafsir Ibn Kathir',
    reponses: [
      { texte_fr: "Cas des enfants Ansar judaïsés expulsés avec les Banu al-Nadir", est_correcte: true },
      { texte_fr: "Conversion forcée des Quraysh à La Mecque", est_correcte: false },
      { texte_fr: "Bataille de Badr et prisonniers", est_correcte: false },
      { texte_fr: "Traité de Hudaybiyya", est_correcte: false },
    ],
  },
  {
    domaine: 'tafsir_avance', niveau: 5, madhab: 'general',
    texte_fr: "Quelle est la distinction entre tafsir bi-l-ma'thur et tafsir bi-l-ra'y selon Ibn Taymiyya ?",
    texte_ar: 'الفرق بين التفسير بالمأثور والتفسير بالرأي؟',
    explication: "Ibn Taymiyya (Muqaddima fi Usul al-Tafsir) : la meilleure méthode est d'expliquer le Coran par le Coran, puis par la Sunna, puis les paroles des Compagnons, puis des Tabi'in. Le tafsir bi-l-ra'y est blâmable s'il est sans 'ilm, louable s'il s'appuie sur l'arabe et les principes.",
    savant_reference: "Ibn Taymiyya, Muqaddima fi Usul al-Tafsir",
    reponses: [
      { texte_fr: "Bi-l-ma'thur (Coran/Sunna/Salaf) prioritaire ; bi-l-ra'y louable sous conditions", est_correcte: true },
      { texte_fr: "Les deux sont strictement interdits", est_correcte: false },
      { texte_fr: "Bi-l-ra'y est toujours préférable", est_correcte: false },
      { texte_fr: "Aucune distinction n'existe", est_correcte: false },
    ],
  },
  {
    domaine: 'tafsir_avance', niveau: 5, madhab: 'general',
    texte_fr: "Comment les Salaf interprétaient-ils 'al-huruf al-muqatta'at' (lettres isolées) en début de certaines sourates ?",
    texte_ar: 'موقف السلف من الحروف المقطعة؟',
    explication: "La plupart des Salaf (Abu Bakr, 'Umar, 'Ali, Ibn Mas'ud rapporté) disaient : 'Allah a'lam bi-muradihi' (Allah sait mieux ce qu'Il a voulu). D'autres ont avancé des hypothèses (noms d'Allah, noms de sourates, défi de l'i'jaz). Ibn Kathir privilégie l'i'jaz : montrer que le Coran est composé de ces lettres connues.",
    savant_reference: "Tafsir Ibn Kathir, introduction de Al-Baqara",
    reponses: [
      { texte_fr: "Majorité : Allah a'lam ; certains : preuve d'i'jaz", est_correcte: true },
      { texte_fr: "Tous les Salaf prétendaient connaître leur sens", est_correcte: false },
      { texte_fr: "Position ésotérique chiite uniquement", est_correcte: false },
      { texte_fr: "Numérologie acceptée par les Salaf", est_correcte: false },
    ],
  },
  {
    domaine: 'tafsir_avance', niveau: 5, madhab: 'general',
    texte_fr: "Quelle est la position d'Ibn Kathir sur les isra'iliyyat dans le tafsir ?",
    texte_ar: 'موقف ابن كثير من الإسرائيليات؟',
    explication: "Ibn Kathir (dans son introduction) divise les isra'iliyyat en trois : 1) ce que confirme l'Islam, on l'accepte ; 2) ce qu'il infirme, on le rejette ; 3) ce sur quoi il est silencieux, on ne croit ni ne dément ('la nusaddiquhum wa la nukadhdhibuhum').",
    savant_reference: "Tafsir Ibn Kathir, muqaddima",
    reponses: [
      { texte_fr: "Tripartition : confirmé / infirmé / suspendu", est_correcte: true },
      { texte_fr: "Toutes acceptées sans distinction", est_correcte: false },
      { texte_fr: "Toutes rejetées en bloc", est_correcte: false },
      { texte_fr: "Acceptées uniquement si dans Bukhari", est_correcte: false },
    ],
  },
  {
    domaine: 'tafsir_avance', niveau: 4, madhab: 'general',
    texte_fr: "Quel est le sens de 'kawthar' dans la sourate Al-Kawthar selon l'interprétation prophétique authentique ?",
    texte_ar: 'معنى الكوثر في السورة؟',
    dalil_ref: 'Sahih Muslim 400',
    explication: "Dans Sahih Muslim, le Prophète ﷺ explique lui-même que al-Kawthar est un fleuve qu'Allah lui a accordé au Paradis. Cette interprétation est la plus authentique, bien que linguistiquement le mot signifie 'bien abondant'.",
    reponses: [
      { texte_fr: "Un fleuve au Paradis selon le tafsir prophétique", est_correcte: true },
      { texte_fr: "Le titre du Prophète ﷺ", est_correcte: false },
      { texte_fr: "Le nombre des Compagnons de Badr", est_correcte: false },
      { texte_fr: "Une bénédiction matérielle dans cette vie uniquement", est_correcte: false },
    ],
  },

  // ============== SIRAH AVANCÉE (niveau 4) ==============
  {
    domaine: 'sirah_avancee', niveau: 4, madhab: 'general',
    texte_fr: "Quelle est la date de la bataille de Badr et combien de Muslims y prirent part ?",
    texte_ar: 'تاريخ غزوة بدر وعدد المسلمين؟',
    explication: "Bataille de Badr : 17 Ramadan 2 H (mars 624). 313-317 Muslims contre environ 1000 Quraysh. Victoire décisive nommée 'yawm al-furqan' (jour du discernement) dans le Coran (8:41).",
    dalil_ref: 'Sourate Al-Anfal 8:41',
    savant_reference: "Ibn Hisham, Sirat al-Nabawiyya ; Ibn Kathir, al-Bidaya wa al-Nihaya",
    reponses: [
      { texte_fr: "17 Ramadan an 2 H, ~313 Muslims", est_correcte: true },
      { texte_fr: "1er Shawwal an 1 H, ~700 Muslims", est_correcte: false },
      { texte_fr: "10 Dhu al-Qa'da an 6 H, ~1400 Muslims", est_correcte: false },
      { texte_fr: "15 Sha'ban an 3 H, ~1000 Muslims", est_correcte: false },
    ],
  },
  {
    domaine: 'sirah_avancee', niveau: 4, madhab: 'general',
    texte_fr: "Quelles furent les principales clauses du traité de Hudaybiyya (6 H) ?",
    texte_ar: 'بنود صلح الحديبية؟',
    explication: "Hudaybiyya (Dhu al-Qa'da 6 H) : trêve de 10 ans, retour des Muslims sans 'umra cette année, 'umra l'année suivante (3 jours), restitution des Quraysh fugitifs, libre adhésion aux alliances. Annoncé comme 'fath mubin' (48:1).",
    dalil_ref: 'Sourate Al-Fath 48:1',
    savant_reference: "Ibn Ishaq via Ibn Hisham",
    reponses: [
      { texte_fr: "Trêve 10 ans, retour cette année, 'umra l'année suivante", est_correcte: true },
      { texte_fr: "Conversion forcée des Quraysh", est_correcte: false },
      { texte_fr: "Tribut annuel des Muslims aux Quraysh", est_correcte: false },
      { texte_fr: "Mariage politique avec Quraysh", est_correcte: false },
    ],
  },
  {
    domaine: 'sirah_avancee', niveau: 4, madhab: 'general',
    texte_fr: "Quand eut lieu la conquête de La Mecque (Fath Makka) ?",
    texte_ar: 'متى كان فتح مكة؟',
    explication: "Fath Makka : 20 Ramadan 8 H (janvier 630), suite à la rupture du pacte de Hudaybiyya par les Quraysh. Le Prophète ﷺ entra à La Mecque avec 10 000 Muslims et proclama l'amnistie générale (sauf liste restreinte).",
    savant_reference: "Ibn Hisham, Sira",
    reponses: [
      { texte_fr: "20 Ramadan 8 H, avec 10 000 Muslims", est_correcte: true },
      { texte_fr: "1er Muharram 7 H, avec 3000 Muslims", est_correcte: false },
      { texte_fr: "10 Dhu al-Hijja 10 H, avec 100 000 Muslims", est_correcte: false },
      { texte_fr: "15 Sha'ban 5 H, avec 5000 Muslims", est_correcte: false },
    ],
  },
  {
    domaine: 'sirah_avancee', niveau: 4, madhab: 'general',
    texte_fr: "Quel fut le résultat initial de la bataille d'Uhud (3 H) et pourquoi ?",
    texte_ar: 'نتيجة غزوة أحد وسببها؟',
    dalil_ref: 'Sourate Al Imran 3:152-165',
    explication: "Uhud (Shawwal 3 H) : revers Muslims après leur supériorité initiale. Cause : les archers de la colline d'Uhud quittèrent leur poste pour le butin, malgré l'ordre du Prophète ﷺ. Khalid ibn al-Walid (encore non Muslim) contourna et frappa l'arrière. Hamza fut martyrisé.",
    savant_reference: "Ibn Hisham, Sira",
    reponses: [
      { texte_fr: "Revers car les archers quittèrent leur poste contre l'ordre", est_correcte: true },
      { texte_fr: "Victoire complète des Muslims", est_correcte: false },
      { texte_fr: "Annulation sans combat", est_correcte: false },
      { texte_fr: "Trahison de Abu Bakr (à Dieu ne plaise)", est_correcte: false },
    ],
  },
  {
    domaine: 'sirah_avancee', niveau: 4, madhab: 'general',
    texte_fr: "Combien de temps s'écoula entre la première révélation (iqra) et la migration à Médine (hijra) ?",
    texte_ar: 'كم سنة بين بدء الوحي والهجرة؟',
    explication: "Première révélation : 13 ans avant la hijra (610 CE). Hijra : 622 CE. Donc 13 ans à La Mecque, dont 10 ans publiquement après la fin du boycott et l'année du chagrin. Le Prophète ﷺ vécut ensuite 10 ans à Médine avant sa mort.",
    savant_reference: "Ibn Kathir, al-Bidaya wa al-Nihaya",
    reponses: [
      { texte_fr: "13 années", est_correcte: true },
      { texte_fr: "10 années", est_correcte: false },
      { texte_fr: "23 années", est_correcte: false },
      { texte_fr: "7 années", est_correcte: false },
    ],
  },

  // ============== QIRA'AT (niveau 5) ==============
  {
    domaine: 'qira_at', niveau: 5, madhab: 'general',
    texte_fr: "Combien y a-t-il de lectures coraniques mutawatir reconnues, et qui les a systématisées ?",
    texte_ar: 'كم عدد القراءات المتواترة ومن جمعها؟',
    explication: "Sept qira'at mutawatir compilées par Ibn Mujahid (m. 324 H) dans 'Kitab al-Sab'a'. Ash-Shatibi (m. 590 H) en versifia la transmission dans 'al-Shatibiyya'. Ibn al-Jazari y ajouta trois autres (totalisant les 10 mutawatir) dans 'al-Tayyiba'.",
    savant_reference: "Ibn al-Jazari, al-Nashr fi al-Qira'at al-'Ashr",
    reponses: [
      { texte_fr: "Sept (Ibn Mujahid), portées à dix (Ibn al-Jazari)", est_correcte: true },
      { texte_fr: "Une seule (la lecture de Hafs)", est_correcte: false },
      { texte_fr: "Quatorze toutes mutawatir", est_correcte: false },
      { texte_fr: "Quatre seulement", est_correcte: false },
    ],
  },
  {
    domaine: 'qira_at', niveau: 5, madhab: 'general',
    texte_fr: "Qui est l'imam Hafs et de quel lecteur transmet-il la qira'a la plus répandue aujourd'hui ?",
    texte_ar: 'من حفص وعن من يروي؟',
    explication: "Hafs ibn Sulayman al-Asadi al-Kufi (m. 180 H) est le rawi principal de 'Asim ibn Abi al-Najud al-Kufi (m. 127 H). La transmission 'Hafs 'an 'Asim' est la plus répandue dans le monde sunnite (Égypte, Hijaz, Levant...). L'autre rawi de 'Asim est Shu'ba.",
    reponses: [
      { texte_fr: "Hafs ibn Sulayman, rawi de 'Asim al-Kufi", est_correcte: true },
      { texte_fr: "Hafs, rawi de Warsh", est_correcte: false },
      { texte_fr: "Hafs, rawi de Nafi'", est_correcte: false },
      { texte_fr: "Hafs, rawi d'Ibn Kathir al-Makki", est_correcte: false },
    ],
  },
  {
    domaine: 'qira_at', niveau: 5, madhab: 'general',
    texte_fr: "Quelle qira'a est répandue en Afrique du Nord-Ouest et qui en est l'imam ?",
    texte_ar: 'القراءة المنتشرة في المغرب وإمامها؟',
    explication: "La qira'a de Warsh 'an Nafi' (Warsh = 'Uthman ibn Sa'id al-Misri, m. 197 H ; transmettant de Nafi' al-Madani, m. 169 H) est dominante au Maghreb et en Afrique de l'Ouest. Une autre transmission de Nafi' est Qalun.",
    reponses: [
      { texte_fr: "Warsh 'an Nafi'", est_correcte: true },
      { texte_fr: "Hafs 'an 'Asim", est_correcte: false },
      { texte_fr: "Khalaf 'an Hamza", est_correcte: false },
      { texte_fr: "Al-Susi 'an Abi 'Amr", est_correcte: false },
    ],
  },
  {
    domaine: 'qira_at', niveau: 5, madhab: 'general',
    texte_fr: "Que signifie 'al-ahruf al-sab'a' (les sept lettres) mentionnés dans le hadith ?",
    texte_ar: 'ما الأحرف السبعة في الحديث؟',
    dalil_ref: 'Sahih al-Bukhari 4992, Muslim 819',
    dalil_texte_ar: 'أُنْزِلَ الْقُرْآنُ عَلَى سَبْعَةِ أَحْرُفٍ',
    explication: "Plus de 35 avis. Position forte : sept registres ou modes de récitation accordés pour faciliter aux différentes tribus arabes. Ce n'est pas synonyme des sept qira'at d'Ibn Mujahid (qui sont des chaînes de transmission ultérieures restant dans le rasm 'Uthmani).",
    savant_reference: "Ibn al-Jazari, al-Nashr",
    reponses: [
      { texte_fr: "Sept modes de récitation pour faciliter aux tribus arabes", est_correcte: true },
      { texte_fr: "Synonymes des sept qira'at d'Ibn Mujahid", est_correcte: false },
      { texte_fr: "Sept langues différentes de récitation", est_correcte: false },
      { texte_fr: "Les sept noms d'Allah principaux", est_correcte: false },
    ],
  },
  {
    domaine: 'qira_at', niveau: 5, madhab: 'general',
    texte_fr: "Quelle est la différence entre 'qira'a sahiha' et 'qira'a shadhdha' ?",
    texte_ar: 'الفرق بين القراءة الصحيحة والشاذة؟',
    explication: "Selon Ibn al-Jazari (al-Nashr), une qira'a est sahiha si elle remplit trois conditions : 1) conformité au rasm 'uthmani (même avec un seul mushaf), 2) conformité à la grammaire arabe, 3) chaîne authentique. Si l'une manque, c'est shadhdha (non récitée en prière).",
    savant_reference: "Ibn al-Jazari, al-Nashr",
    reponses: [
      { texte_fr: "Trois conditions : rasm, langue arabe, isnad authentique", est_correcte: true },
      { texte_fr: "Aucune différence : toutes les qira'at sont valides", est_correcte: false },
      { texte_fr: "Sahiha = dans Bukhari ; shadhdha = ailleurs", est_correcte: false },
      { texte_fr: "Distinction inventée au 20e siècle", est_correcte: false },
    ],
  },

  // ============== FARAID (niveau 5) ==============
  {
    domaine: 'faraid', niveau: 5, madhab: 'general',
    texte_fr: "Quelle est la part de l'épouse si le défunt laisse des enfants ?",
    texte_ar: 'نصيب الزوجة مع وجود الفرع الوارث؟',
    dalil_ref: 'Sourate An-Nisa 4:12',
    dalil_texte_ar: 'فَإِن كَانَ لَكُمْ وَلَدٌ فَلَهُنَّ الثُّمُنُ',
    explication: "1/8 pour l'épouse (ou les épouses partageant ce 1/8) en présence d'un far' warith (enfant ou petit-enfant agnatique). Sans enfants : 1/4. Verset 4:12.",
    reponses: [
      { texte_fr: "1/8 (un huitième) à partager entre les épouses s'il y en a plusieurs", est_correcte: true },
      { texte_fr: "1/4 dans tous les cas", est_correcte: false },
      { texte_fr: "1/2 si elle est la seule épouse", est_correcte: false },
      { texte_fr: "1/3 selon l'analogie avec la mère", est_correcte: false },
    ],
  },
  {
    domaine: 'faraid', niveau: 5, madhab: 'general',
    texte_fr: "Qu'est-ce que la 'mas'ala 'umariyya' ou 'gharrawayn' et quelle est sa solution ?",
    texte_ar: 'المسألة العمرية (الغراوان) وحلها؟',
    explication: "Cas : défunt laissant épouse (ou époux), mère et père. Par les parts apparentes, la mère prendrait 1/3 du reste après l'époux/épouse. 'Umar trancha que la mère prend 1/3 du reste (et non du total) pour préserver le principe coranique que la part du père est double de la mère.",
    savant_reference: "Ibn Qudama, al-Mughni",
    reponses: [
      { texte_fr: "Mère = 1/3 du reste après la part de l'époux/épouse", est_correcte: true },
      { texte_fr: "Mère = 1/3 du total", est_correcte: false },
      { texte_fr: "Mère = 1/6 toujours", est_correcte: false },
      { texte_fr: "Pas de part pour la mère dans ce cas", est_correcte: false },
    ],
  },
  {
    domaine: 'faraid', niveau: 5, madhab: 'general',
    texte_fr: "Qu'est-ce que la 'awl en faraid et qui en a posé le principe ?",
    texte_ar: 'ما العول وأول من قال به؟',
    explication: "Al-'awl : augmentation du dénominateur de la mas'ala quand la somme des fractions dépasse l'unité, pour réduire proportionnellement chaque part. 'Umar ibn al-Khattab consulta les Compagnons et adopta cette solution avec l'accord de la majorité (sauf Ibn 'Abbas).",
    savant_reference: "Ibn Qudama, al-Mughni",
    reponses: [
      { texte_fr: "Augmentation du dénominateur ; introduite par 'Umar avec ijma' des Compagnons (sauf Ibn 'Abbas)", est_correcte: true },
      { texte_fr: "Diminution des parts ; introduite par 'Ali", est_correcte: false },
      { texte_fr: "Innovation tardive sans fondement", est_correcte: false },
      { texte_fr: "Règle rejetée par les quatre madhahib", est_correcte: false },
    ],
  },
  {
    domaine: 'faraid', niveau: 5, madhab: 'general',
    texte_fr: "Qu'est-ce que la 'mushtaraka' (joint, ou himariyya) ?",
    texte_ar: 'المسألة المشتركة (الحمارية)؟',
    explication: "Cas : époux, mère (ou grand-mère), deux frères utérins et frères germains. Les germains seraient normalement asaba (rien après les fards = 1/2 + 1/6 + 1/3). 'Umar (puis Shafi'is/Malikis) leur fait partager le 1/3 des utérins ; Hanafis et Hanbalis ne le font pas.",
    savant_reference: "Ibn Qudama, al-Mughni",
    reponses: [
      { texte_fr: "Germains partagent le 1/3 des utérins (Maliki/Shafi'i) ; non chez Hanafi/Hanbali", est_correcte: true },
      { texte_fr: "Tous les madhahib font partager identique", est_correcte: false },
      { texte_fr: "Les germains prennent tout exclusivement", est_correcte: false },
      { texte_fr: "Les utérins prennent tout exclusivement", est_correcte: false },
    ],
  },
  {
    domaine: 'faraid', niveau: 5, madhab: 'general',
    texte_fr: "Quelle est la part de la grand-mère (paternelle ou maternelle) en l'absence de la mère ?",
    texte_ar: 'نصيب الجدة في غياب الأم؟',
    dalil_ref: "Sunan Abu Dawud 2894 (hadith de Qabisa ibn Dhu'ayb)",
    explication: "La grand-mère hérite 1/6 selon le hadith où Abu Bakr donna 1/6 à la grand-mère sur témoignage de Mughira ibn Shu'ba et Muhammad ibn Maslama. S'il y a plusieurs grand-mères héritières, elles partagent le 1/6. En présence de la mère, elle est exclue.",
    reponses: [
      { texte_fr: "1/6, partagé si plusieurs grand-mères héritières ; exclue par la mère", est_correcte: true },
      { texte_fr: "1/3 toujours", est_correcte: false },
      { texte_fr: "1/2 si elle est seule", est_correcte: false },
      { texte_fr: "Rien : non héritière selon les madhahib", est_correcte: false },
    ],
  },

  // ============== FURU' AL-FIQH (niveau 5) ==============
  {
    domaine: 'furu_fiqh', niveau: 5, madhab: 'general',
    texte_fr: "Selon les Hanbalis, quel est le hukm de la prière dans une terre usurpée (mughsuba) ?",
    texte_ar: 'حكم الصلاة في الأرض المغصوبة عند الحنابلة؟',
    explication: "Position connue de l'imam Ahmad (rapportée notamment par Ibn Qudama) : la prière dans une terre usurpée est invalide selon une riwaya forte, car l'occupation est haram et la stance (qiyam) en fait partie. La majorité (Hanafi, Maliki, Shafi'i) la juge valide mais le prieur est pécheur.",
    savant_reference: "Ibn Qudama, al-Mughni",
    reponses: [
      { texte_fr: "Invalide selon une riwaya forte d'Ahmad ; valide avec péché chez la majorité", est_correcte: true },
      { texte_fr: "Valide sans aucun péché à l'unanimité", est_correcte: false },
      { texte_fr: "Invalide chez les quatre madhahib", est_correcte: false },
      { texte_fr: "Question jamais traitée par les fuqaha", est_correcte: false },
    ],
  },
  {
    domaine: 'furu_fiqh', niveau: 5, madhab: 'general',
    texte_fr: "Selon les Shafi'is, qu'est-ce que la 'salat al-khawf' (prière de la peur) dans sa forme dite 'salat Dhat al-Riqa' ?",
    texte_ar: 'صلاة الخوف بصفة ذات الرقاع عند الشافعية؟',
    dalil_ref: 'Sourate An-Nisa 4:102',
    explication: "Salat Dhat al-Riqa' : l'imam divise les troupes en deux groupes. Il prie une rak'a avec le premier groupe qui complète seul, puis avec le second groupe la deuxième rak'a et chacun complète. Plusieurs formes authentiques existent ; les Shafi'is en valident plusieurs selon les hadiths.",
    savant_reference: "An-Nawawi, al-Majmu'",
    reponses: [
      { texte_fr: "Division en deux groupes, prière par tour, chacun complète seul", est_correcte: true },
      { texte_fr: "Une seule rak'a sans qira'a ni ruku'", est_correcte: false },
      { texte_fr: "Prière obligatoirement reportée après le combat", est_correcte: false },
      { texte_fr: "Suspension du fard pendant la guerre", est_correcte: false },
    ],
  },
  {
    domaine: 'furu_fiqh', niveau: 5, madhab: 'general',
    texte_fr: "Selon les Malikis, quel est le hukm de manger la viande de cheval ?",
    texte_ar: 'حكم أكل لحم الخيل عند المالكية؟',
    explication: "Les Malikis ont une riwaya selon laquelle la viande de cheval est makruh (la majorité du madhhab) en raison de son usage premier au combat, malgré le hadith de Jabir (Bukhari 5520) la permettant. Hanafis : makruh ou interdite. Shafi'is et Hanbalis : pleinement licite.",
    savant_reference: "Ibn Rushd, Bidayat al-Mujtahid",
    reponses: [
      { texte_fr: "Makruh chez les Malikis ; licite chez Shafi'is et Hanbalis", est_correcte: true },
      { texte_fr: "Licite à l'unanimité sans réserve", est_correcte: false },
      { texte_fr: "Haram à l'unanimité", est_correcte: false },
      { texte_fr: "Licite uniquement en cas de nécessité", est_correcte: false },
    ],
  },
  {
    domaine: 'furu_fiqh', niveau: 5, madhab: 'general',
    texte_fr: "Selon les Hanafis, quel est le statut du witr ?",
    texte_ar: 'حكم الوتر عند الحنفية؟',
    explication: "Abu Hanifa : le witr est wajib (entre fard et sunna selon la terminologie hanafie), distinct du fard. Les Sahibayn (Abu Yusuf et Muhammad) le considèrent sunna mu'akkada comme la majorité. Conséquence : son omission délibérée est blâmable plus fortement chez Abu Hanifa.",
    savant_reference: "Al-Kasani, Bada'i' al-Sana'i'",
    reponses: [
      { texte_fr: "Wajib chez Abu Hanifa ; sunna mu'akkada chez Sahibayn et majorité", est_correcte: true },
      { texte_fr: "Fard 'ayn comme les cinq prières", est_correcte: false },
      { texte_fr: "Mubah simple sans recommandation", est_correcte: false },
      { texte_fr: "Makruh selon Abu Hanifa", est_correcte: false },
    ],
  },
  {
    domaine: 'furu_fiqh', niveau: 5, madhab: 'general',
    texte_fr: "Selon les Hanbalis, quel est le hukm de la 'salat al-tasbih' ?",
    texte_ar: 'حكم صلاة التسبيح عند الحنابلة؟',
    explication: "Les Hanbalis (et beaucoup d'autres) la jugent makruh ou non confirmée, car le hadith principal (Abu Dawud 1297) est faible chez nombreux muhaddithun (al-'Uqayli, Ibn al-Jawzi). Ibn Taymiyya et Ibn al-Qayyim la rejettent. Ahmad lui-même n'en aurait pas vu d'isnad fiable.",
    savant_reference: "Ibn Taymiyya, Majmu' al-Fatawa",
    reponses: [
      { texte_fr: "Non confirmée (hadith faible) chez Ahmad et Ibn Taymiyya", est_correcte: true },
      { texte_fr: "Wajib chez Ahmad", est_correcte: false },
      { texte_fr: "Pilier de l'islam selon les Hanbalis", est_correcte: false },
      { texte_fr: "Faisant l'unanimité comme sunna mu'akkada", est_correcte: false },
    ],
  },

  // ============== TARIKH ISLAM (niveaux 4-5) ==============
  {
    domaine: 'tarikh_islam', niveau: 4, madhab: 'general',
    texte_fr: "Quels sont les quatre califes Rashidun et leurs ordres de succession ?",
    texte_ar: 'الخلفاء الراشدون الأربعة وترتيبهم؟',
    explication: "Abu Bakr al-Siddiq (11-13 H), 'Umar ibn al-Khattab (13-23 H), 'Uthman ibn 'Affan (23-35 H), 'Ali ibn Abi Talib (35-40 H). C'est la khilafa al-rashida totalisant ~30 ans selon le hadith 'La khilafa après moi est de 30 ans' (Abu Dawud 4646).",
    dalil_ref: "Sunan Abu Dawud 4646",
    reponses: [
      { texte_fr: "Abu Bakr, 'Umar, 'Uthman, 'Ali", est_correcte: true },
      { texte_fr: "'Ali, 'Umar, 'Uthman, Abu Bakr", est_correcte: false },
      { texte_fr: "'Umar, Abu Bakr, 'Ali, 'Uthman", est_correcte: false },
      { texte_fr: "Mu'awiya, Yazid, Marwan, 'Abd al-Malik", est_correcte: false },
    ],
  },
  {
    domaine: 'tarikh_islam', niveau: 4, madhab: 'general',
    texte_fr: "Quand et sous quel calife le Coran fut-il compilé en mushaf et standardisé ?",
    texte_ar: 'متى جُمع القرآن في مصحف واحد؟',
    dalil_ref: 'Sahih al-Bukhari 4986-4988',
    explication: "Première compilation sous Abu Bakr (sur conseil de 'Umar après Yamama où nombre de qurra' tombèrent martyrs), par Zayd ibn Thabit. Standardisation et envoi des copies sous 'Uthman (~25 H) face aux divergences entre régions ; mushaf appelé 'al-Imam'.",
    reponses: [
      { texte_fr: "Compilé sous Abu Bakr, standardisé sous 'Uthman", est_correcte: true },
      { texte_fr: "Compilé du vivant du Prophète ﷺ", est_correcte: false },
      { texte_fr: "Compilé sous 'Ali uniquement", est_correcte: false },
      { texte_fr: "Compilé sous les Omeyyades par 'Abd al-Malik", est_correcte: false },
    ],
  },
  {
    domaine: 'tarikh_islam', niveau: 5, madhab: 'general',
    texte_fr: "Qui est l'imam al-Bukhari, quand est-il né et mort, et combien de hadiths contient son Sahih (sans répétitions) ?",
    texte_ar: 'من البخاري ومتى ولد وتوفي وكم حديثاً في صحيحه؟',
    explication: "Muhammad ibn Isma'il al-Bukhari : né en 194 H à Bukhara, mort en 256 H à Khartank. Son Sahih contient ~7563 hadiths avec répétitions, ~2602 (ou 4000 selon comptage) sans répétitions hors mu'allaqat et mutaba'at. Il sélectionna parmi ~600 000.",
    savant_reference: "Ibn Hajar, Hadi al-Sari (muqaddima de Fath al-Bari)",
    reponses: [
      { texte_fr: "194-256 H ; ~2602 hadiths sans répétitions selon Ibn Hajar", est_correcte: true },
      { texte_fr: "180-241 H ; 1000 hadiths", est_correcte: false },
      { texte_fr: "204-261 H ; 4000 hadiths", est_correcte: false },
      { texte_fr: "150-204 H ; 7000 hadiths", est_correcte: false },
    ],
  },
  {
    domaine: 'tarikh_islam', niveau: 5, madhab: 'general',
    texte_fr: "Qui est l'imam Muslim et quelle particularité distingue son Sahih du Sahih al-Bukhari dans la disposition ?",
    texte_ar: 'من الإمام مسلم وما يميّز صحيحه عن البخاري؟',
    explication: "Muslim ibn al-Hajjaj al-Naysaburi (~206-261 H), élève de Bukhari. Son Sahih regroupe toutes les voies d'un même hadith en un seul endroit (meilleur pour étudier les chaînes), tandis que Bukhari les disperse selon les fiqh (meilleur pour le fiqh). Muslim n'inclut pas de mu'allaqat dans le corps.",
    savant_reference: "An-Nawawi, Sharh Sahih Muslim (muqaddima)",
    reponses: [
      { texte_fr: "Muslim groupe les voies d'un même hadith en un lieu unique", est_correcte: true },
      { texte_fr: "Muslim ne rapporte que des hadiths mursal", est_correcte: false },
      { texte_fr: "Muslim n'a aucun hadith sahih", est_correcte: false },
      { texte_fr: "Muslim ne classe pas par chapitres du tout", est_correcte: false },
    ],
  },
  {
    domaine: 'tarikh_islam', niveau: 5, madhab: 'general',
    texte_fr: "Qui sont les ashab al-sunan al-arba'a (les quatre auteurs des Sunan) après Bukhari et Muslim ?",
    texte_ar: 'أصحاب السنن الأربعة؟',
    explication: "Abu Dawud al-Sijistani (m. 275 H), at-Tirmidhi (m. 279 H), an-Nasa'i (m. 303 H), Ibn Majah al-Qazwini (m. 273 H). Ensemble avec Sahihayn ils forment les Kutub al-Sittah (Six Livres). Certains préfèrent le Muwatta de Malik à Ibn Majah dans le 6e rang.",
    reponses: [
      { texte_fr: "Abu Dawud, at-Tirmidhi, an-Nasa'i, Ibn Majah", est_correcte: true },
      { texte_fr: "Ahmad, Malik, Shafi'i, Abu Hanifa", est_correcte: false },
      { texte_fr: "Bayhaqi, Daraqutni, Tabarani, Hakim", est_correcte: false },
      { texte_fr: "Ibn Khuzayma, Ibn Hibban, Bazzar, Daylami", est_correcte: false },
    ],
  },
  {
    domaine: 'tarikh_islam', niveau: 4, madhab: 'general',
    texte_fr: "Qu'est-ce que la 'fitna kubra' dans l'histoire islamique et quand a-t-elle eu lieu ?",
    texte_ar: 'ما الفتنة الكبرى ومتى حدثت؟',
    explication: "Période de troubles débutée par le meurtre d''Uthman (35 H), suivie de Jamal (36 H), Siffin (37 H), Tahkim et émergence des Khawarij, jusqu'à l'assassinat d''Ali (40 H). Premier conflit interne majeur de la communauté. Ahl al-Sunna se tait sur les détails entre Compagnons.",
    savant_reference: "Ibn Kathir, al-Bidaya wa al-Nihaya",
    reponses: [
      { texte_fr: "Meurtre d''Uthman (35H), Jamal, Siffin, jusqu'à 'Ali (40H)", est_correcte: true },
      { texte_fr: "Période des croisades", est_correcte: false },
      { texte_fr: "Invasion mongole de Baghdad (656 H)", est_correcte: false },
      { texte_fr: "Bataille d'Uhud", est_correcte: false },
    ],
  },
];

export async function seedQuestionsAvancees(client: Client): Promise<void> {
  let inserted = 0;
  let skipped = 0;

  console.log('Seeding advanced questions (niveaux 4-5)...');

  for (const q of QUESTIONS_AVANCEES) {
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

  console.log(`questions_avancees: ${inserted} inserted, ${skipped} skipped.`);
}
