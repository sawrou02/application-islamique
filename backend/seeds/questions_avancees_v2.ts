import { Client } from 'pg';

interface QuestionSeed {
  domaine: string;
  sous_domaine?: string;
  niveau: number;
  madhab: string;
  texte_fr: string;
  texte_ar?: string;
  dalil_ref?: string;
  explication?: string;
  grade_hadith?: string;
  reponses: { texte_fr: string; texte_ar?: string; est_correcte: boolean }[];
}

const QUESTIONS: QuestionSeed[] = [
  // ============= AKHLAQ N5 (Expert) =============
  {
    domaine: 'akhlaq', sous_domaine: 'tazkiya', niveau: 5, madhab: 'general',
    texte_fr: "Que signifie le concept d'Ihsan dans le hadith de Jibril ?",
    texte_ar: 'ما هو الإحسان كما عرفه النبي ﷺ في حديث جبريل؟',
    explication: "L'Ihsan est : « Adorer Allah comme si tu Le voyais, car même si tu ne Le vois pas, Lui te voit. » C'est le plus haut degré de la religion après l'Islam et l'Iman.",
    dalil_ref: 'Sahih Muslim n°8 (Hadith de Jibril)',
    grade_hadith: 'Hadith Sahih',
    reponses: [
      { texte_fr: "Adorer Allah comme si tu Le voyais, car Lui te voit", est_correcte: true },
      { texte_fr: "Faire beaucoup d'œuvres surérogatoires", est_correcte: false },
      { texte_fr: "Donner toute son argent en aumône", est_correcte: false },
      { texte_fr: "Réciter le Coran chaque jour", est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq', sous_domaine: 'tazkiya', niveau: 5, madhab: 'general',
    texte_fr: "Qu'est-ce que le Tawakkul (confiance en Allah) selon Ibn al-Qayyim ?",
    texte_ar: 'ما هو التوكل عند ابن القيم؟',
    explication: "Le Tawakkul est l'appui sincère du cœur sur Allah pour obtenir le bien et repousser le mal, accompagné des causes (asbab) qu'Allah a légiférées. Abandonner les causes n'est pas du Tawakkul mais de la négligence.",
    dalil_ref: "Madarij as-Salikin d'Ibn al-Qayyim",
    reponses: [
      { texte_fr: "Appui du cœur sur Allah TOUT EN prenant les causes légiférées", est_correcte: true },
      { texte_fr: "Abandonner toutes les causes et attendre", est_correcte: false },
      { texte_fr: "Ne compter que sur soi-même", est_correcte: false },
      { texte_fr: "Faire des invocations sans agir", est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq', sous_domaine: 'tazkiya', niveau: 5, madhab: 'general',
    texte_fr: "Que signifie le Zuhd (renoncement) selon les savants de Ahlu Sunnah ?",
    texte_ar: 'ما هو الزهد عند علماء أهل السنة؟',
    explication: "Le Zuhd selon Ibn Taymiyya : « Renoncer à ce qui ne profite pas dans l'au-delà. » Il ne consiste pas à abandonner les biens licites mais à ne pas y attacher son cœur.",
    dalil_ref: "Majmu' al-Fatawa d'Ibn Taymiyya",
    reponses: [
      { texte_fr: "Renoncer dans le cœur à ce qui ne profite pas dans l'au-delà", est_correcte: true },
      { texte_fr: "Vivre sans aucun bien matériel", est_correcte: false },
      { texte_fr: "Refuser tout travail rémunéré", est_correcte: false },
      { texte_fr: "S'isoler complètement de la société", est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq', sous_domaine: 'tazkiya', niveau: 5, madhab: 'general',
    texte_fr: "Qu'est-ce que la Muraqaba (surveillance de soi) ?",
    texte_ar: 'ما هي المراقبة في علم التزكية؟',
    explication: "La Muraqaba est la conscience permanente qu'Allah voit et entend tout. Allah dit : « Il sait ce qui pénètre dans la terre et ce qui en sort, ce qui descend du ciel et ce qui y monte ; et Il est avec vous où que vous soyez. » (Al-Hadid 57:4)",
    dalil_ref: 'Sourate Al-Hadid 57:4',
    reponses: [
      { texte_fr: "La conscience permanente qu'Allah voit, entend et sait tout de nous", est_correcte: true },
      { texte_fr: "Surveiller les autres musulmans", est_correcte: false },
      { texte_fr: "Compter ses bonnes actions chaque jour", est_correcte: false },
      { texte_fr: "Se méfier des ennemis de l'islam", est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq', sous_domaine: 'tazkiya', niveau: 5, madhab: 'general',
    texte_fr: "Que signifie le Rida (agrément du décret d'Allah) ?",
    texte_ar: 'ما هو الرضا بقضاء الله؟',
    explication: "Le Rida est le degré au-dessus de la patience (sabr) : le cœur accepte avec sérénité le décret d'Allah sans murmurer ni se révolter. Le Prophète ﷺ disait : « Quiconque dit à matin et soir : Je suis satisfait d'Allah comme Seigneur... a un droit sur Allah qu'Il l'agrée le Jour du Jugement. » (Tirmidhi)",
    dalil_ref: 'Sunan at-Tirmidhi n°3389',
    grade_hadith: 'Hadith Sahih',
    reponses: [
      { texte_fr: "Accepter le décret d'Allah avec sérénité sans murmure", est_correcte: true },
      { texte_fr: "Tout accepter sans rien faire", est_correcte: false },
      { texte_fr: "Approuver le mal", est_correcte: false },
      { texte_fr: "Ne plus invoquer Allah", est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq', sous_domaine: 'tazkiya', niveau: 5, madhab: 'general',
    texte_fr: "Quels sont les trois degrés du Sabr (patience) ?",
    texte_ar: 'ما هي درجات الصبر الثلاث؟',
    explication: "Selon Ibn al-Qayyim : 1) Sabr sur l'obéissance (persévérer dans le bien), 2) Sabr contre la désobéissance (s'abstenir du mal), 3) Sabr face au décret douloureux (épreuves). Le 3e est le plus difficile.",
    dalil_ref: "Uddat as-Sabirin d'Ibn al-Qayyim",
    reponses: [
      { texte_fr: "Sur l'obéissance, contre la désobéissance, face au décret", est_correcte: true },
      { texte_fr: "Avec la famille, au travail, en voyage", est_correcte: false },
      { texte_fr: "Le matin, le midi, le soir", est_correcte: false },
      { texte_fr: "Du jeune, de l'adulte, du vieillard", est_correcte: false },
    ],
  },

  // ============= AKHLAQ N4 =============
  {
    domaine: 'akhlaq', sous_domaine: 'cœur', niveau: 4, madhab: 'general',
    texte_fr: "Quels sont les trois péchés du cœur les plus destructeurs selon les savants ?",
    texte_ar: 'ما هي أعظم آفات القلب الثلاث؟',
    explication: "Selon Ibn al-Qayyim dans al-Fawa'id : 1) le Kibr (orgueil) qui empêcha Iblis de se prosterner, 2) le Hasad (envie) qui poussa le fils d'Adam au meurtre, 3) le Hirs (avidité) qui poussa Adam à manger de l'arbre interdit.",
    dalil_ref: "al-Fawa'id d'Ibn al-Qayyim",
    reponses: [
      { texte_fr: "Kibr (orgueil), Hasad (envie), Hirs (avidité)", est_correcte: true },
      { texte_fr: "Mentir, voler, tromper", est_correcte: false },
      { texte_fr: "Médire, calomnier, insulter", est_correcte: false },
      { texte_fr: "Manger, boire, dormir trop", est_correcte: false },
    ],
  },
  {
    domaine: 'akhlaq', sous_domaine: 'social', niveau: 4, madhab: 'general',
    texte_fr: "Que faire si l'on entend de la médisance (ghiba) sur un musulman absent ?",
    texte_ar: 'ماذا يفعل من سمع غيبة مسلم؟',
    explication: "Le devoir est de défendre le musulman absent. Le Prophète ﷺ a dit : « Quiconque défend l'honneur de son frère, Allah écartera de son visage le feu de l'enfer le Jour de la Résurrection. » (Tirmidhi)",
    dalil_ref: 'Sunan at-Tirmidhi n°1931',
    grade_hadith: 'Hadith Hasan',
    reponses: [
      { texte_fr: "Défendre le musulman absent ou quitter l'assemblée", est_correcte: true },
      { texte_fr: "Participer à la conversation", est_correcte: false },
      { texte_fr: "Rester silencieux et écouter", est_correcte: false },
      { texte_fr: "Aller rapporter à la personne concernée", est_correcte: false },
    ],
  },

  // ============= AQIDA N5 =============
  {
    domaine: 'aqida', sous_domaine: 'asma_sifat', niveau: 5, madhab: 'general',
    texte_fr: "Quelle est la règle des Salaf concernant les attributs d'Allah ?",
    texte_ar: 'ما هي قاعدة السلف في صفات الله؟',
    explication: "Les Salaf affirment les attributs d'Allah tels qu'ils sont mentionnés dans le Coran et la Sunnah authentique, sans tahrif (déformation), ta'til (négation), takyif (modalité) ni tamthil (assimilation). Allah dit : « Il n'y a rien qui Lui ressemble, et Il est l'Audient, le Clairvoyant. » (Ash-Shura 42:11)",
    dalil_ref: 'Sourate Ash-Shura 42:11',
    reponses: [
      { texte_fr: "Affirmer sans déformer, nier, modaliser ni assimiler", est_correcte: true },
      { texte_fr: "Interpréter selon la raison humaine", est_correcte: false },
      { texte_fr: "Nier tous les attributs anthropomorphiques", est_correcte: false },
      { texte_fr: "Comparer Allah à Sa création pour comprendre", est_correcte: false },
    ],
  },
  {
    domaine: 'aqida', sous_domaine: 'fin_temps', niveau: 5, madhab: 'general',
    texte_fr: "Combien de signes majeurs de l'Heure (Ashrat as-Sa'a al-Kubra) ont été annoncés ?",
    texte_ar: 'كم عدد علامات الساعة الكبرى؟',
    explication: "Le Prophète ﷺ a annoncé 10 signes majeurs : le Dajjal, Jésus fils de Marie, Gog et Magog (Ya'juj wa Ma'juj), 3 éclipses (Est, Ouest, Arabie), la Bête, la fumée, le soleil se levant à l'Ouest, et un feu sortant du Yémen.",
    dalil_ref: 'Sahih Muslim n°2901',
    grade_hadith: 'Hadith Sahih',
    reponses: [
      { texte_fr: "10 signes majeurs", est_correcte: true },
      { texte_fr: "5 signes majeurs", est_correcte: false },
      { texte_fr: "12 signes majeurs", est_correcte: false },
      { texte_fr: "7 signes majeurs", est_correcte: false },
    ],
  },
  {
    domaine: 'aqida', sous_domaine: 'qadar', niveau: 5, madhab: 'general',
    texte_fr: "Quels sont les quatre degrés de la croyance au Qadar ?",
    texte_ar: 'ما هي مراتب الإيمان بالقدر الأربع؟',
    explication: "Selon Ahlu Sunnah : 1) al-'Ilm (Allah connaît tout de toute éternité), 2) al-Kitaba (Il l'a inscrit dans la Tablette Préservée), 3) al-Mashi'a (rien n'arrive que par Sa volonté), 4) al-Khalq (Il est le Créateur de toute chose).",
    dalil_ref: "Sharh al-Aqida al-Wasitiyya d'Ibn Uthaymin",
    reponses: [
      { texte_fr: "'Ilm (science), Kitaba (écriture), Mashi'a (volonté), Khalq (création)", est_correcte: true },
      { texte_fr: "Foi, jeûne, prière, aumône", est_correcte: false },
      { texte_fr: "Naissance, vie, mort, résurrection", est_correcte: false },
      { texte_fr: "Passé, présent, futur, éternité", est_correcte: false },
    ],
  },
  {
    domaine: 'aqida', sous_domaine: 'iman', niveau: 5, madhab: 'general',
    texte_fr: "La foi (iman) augmente-t-elle et diminue-t-elle selon Ahlu Sunnah ?",
    texte_ar: 'هل يزيد الإيمان وينقص عند أهل السنة؟',
    explication: "Oui, contrairement aux Murji'a. La foi augmente par l'obéissance et diminue par la désobéissance. Allah dit : « ...afin qu'ils ajoutent foi à leur foi. » (Al-Fath 48:4). Les actes font partie de la foi selon Ahlu Sunnah.",
    dalil_ref: 'Sourate Al-Fath 48:4',
    reponses: [
      { texte_fr: "Oui : elle augmente par l'obéissance et diminue par la désobéissance", est_correcte: true },
      { texte_fr: "Non, elle est constante et ne change pas", est_correcte: false },
      { texte_fr: "Elle augmente seulement, ne diminue jamais", est_correcte: false },
      { texte_fr: "Personne ne peut le savoir", est_correcte: false },
    ],
  },

  // ============= TAFSIR N4-N5 =============
  {
    domaine: 'tafsir', sous_domaine: 'ulum_quran', niveau: 4, madhab: 'general',
    texte_fr: "Qu'est-ce que Asbab an-Nuzul (les causes de la révélation) ?",
    texte_ar: 'ما هي أسباب النزول؟',
    explication: "Les Asbab an-Nuzul sont les évènements ou questions qui ont précédé la révélation de certains versets et qui aident à les comprendre. Exemple : la sourate al-Mujadila fut révélée suite à la plainte de Khawla bint Tha'laba.",
    dalil_ref: "al-Itqan fi 'Ulum al-Qur'an d'as-Suyuti",
    reponses: [
      { texte_fr: "Les évènements ou questions précédant la révélation d'un verset", est_correcte: true },
      { texte_fr: "Les sourates révélées à Médine seulement", est_correcte: false },
      { texte_fr: "Les sourates révélées la nuit", est_correcte: false },
      { texte_fr: "Les versets abrogés", est_correcte: false },
    ],
  },
  {
    domaine: 'tafsir', sous_domaine: 'ulum_quran', niveau: 5, madhab: 'general',
    texte_fr: "Quelles sont les méthodes principales du tafsir selon Ibn Taymiyya ?",
    texte_ar: 'ما هي طرق التفسير عند ابن تيمية؟',
    explication: "Dans Muqaddima fi Usul at-Tafsir, Ibn Taymiyya énumère : 1) Tafsir du Coran par le Coran, 2) Tafsir par la Sunnah, 3) Tafsir par les paroles des Compagnons, 4) Tafsir par les Tabi'in.",
    dalil_ref: "Muqaddima fi Usul at-Tafsir d'Ibn Taymiyya",
    reponses: [
      { texte_fr: "Coran par Coran, Sunnah, paroles des Compagnons puis Tabi'in", est_correcte: true },
      { texte_fr: "L'opinion personnelle uniquement", est_correcte: false },
      { texte_fr: "Le rêve et l'inspiration", est_correcte: false },
      { texte_fr: "L'étymologie arabe seulement", est_correcte: false },
    ],
  },
  {
    domaine: 'tafsir', sous_domaine: 'ulum_quran', niveau: 5, madhab: 'general',
    texte_fr: "Combien de qiraat (lectures) authentiques du Coran sont reconnues ?",
    texte_ar: 'كم عدد القراءات المتواترة للقرآن؟',
    explication: "Il existe 7 qiraat mutawatir reconnues par Ibn Mujahid, puis 10 avec Ibn al-Jazari (les 3 supplémentaires sont Abu Ja'far, Ya'qub, Khalaf). Toutes remontent au Prophète ﷺ par chaînes ininterrompues.",
    dalil_ref: "an-Nashr fi al-Qira'at al-'Ashr d'Ibn al-Jazari",
    reponses: [
      { texte_fr: "10 qiraat mutawatir (7 + 3)", est_correcte: true },
      { texte_fr: "1 seule lecture authentique", est_correcte: false },
      { texte_fr: "100 lectures différentes", est_correcte: false },
      { texte_fr: "4 lectures (une par école juridique)", est_correcte: false },
    ],
  },
  {
    domaine: 'tafsir', sous_domaine: 'ulum_quran', niveau: 4, madhab: 'general',
    texte_fr: "Qu'est-ce que les Muhkamat et les Mutashabihat dans le Coran ?",
    texte_ar: 'ما هي المحكمات والمتشابهات في القرآن؟',
    explication: "Allah dit : « C'est Lui qui a fait descendre sur toi le Livre : il s'y trouve des versets sans équivoque (muhkamat) qui sont la base du Livre, et d'autres qui prêtent à interprétation (mutashabihat). » (Al-Imran 3:7). Les muhkamat sont clairs et les mutashabihat sont à comprendre à la lumière des premiers.",
    dalil_ref: 'Sourate Al-Imran 3:7',
    reponses: [
      { texte_fr: "Muhkamat = versets clairs, base ; Mutashabihat = versets nécessitant interprétation", est_correcte: true },
      { texte_fr: "Muhkamat = versets longs ; Mutashabihat = courts", est_correcte: false },
      { texte_fr: "Muhkamat = mecquois ; Mutashabihat = médinois", est_correcte: false },
      { texte_fr: "Muhkamat = anciens ; Mutashabihat = abrogés", est_correcte: false },
    ],
  },

  // ============= FIQH N5 =============
  {
    domaine: 'fiqh', sous_domaine: 'usul', niveau: 5, madhab: 'general',
    texte_fr: "Quels sont les cinq objectifs supérieurs de la Shariah (Maqasid) ?",
    texte_ar: 'ما هي مقاصد الشريعة الخمس الكبرى؟',
    explication: "Selon ash-Shatibi et al-Ghazali, la Shariah préserve : 1) ad-Din (religion), 2) an-Nafs (vie), 3) al-'Aql (raison), 4) an-Nasl (descendance), 5) al-Mal (biens). Toute règle islamique vise un ou plusieurs de ces objectifs.",
    dalil_ref: "al-Muwafaqat d'ash-Shatibi",
    reponses: [
      { texte_fr: "Religion, vie, raison, descendance, biens", est_correcte: true },
      { texte_fr: "Prière, jeûne, zakat, hajj, jihad", est_correcte: false },
      { texte_fr: "Sunna, Coran, ijma, qiyas, ijtihad", est_correcte: false },
      { texte_fr: "Foi, action, intention, sincérité, suivi", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh', sous_domaine: 'qawaid', niveau: 5, madhab: 'general',
    texte_fr: "Quelle est la règle juridique : « al-mashaqqa tajlibu at-taysir » ?",
    texte_ar: 'ما معنى قاعدة المشقة تجلب التيسير؟',
    explication: "« La difficulté entraîne la facilité. » C'est l'une des 5 grandes règles du fiqh (qawaid kubra). Elle justifie les rukhas (facilitations) : raccourcissement de la prière en voyage, rupture du jeûne pour le malade, tayammum en l'absence d'eau, etc.",
    dalil_ref: "al-Ashbah wa an-Naza'ir d'as-Suyuti",
    reponses: [
      { texte_fr: "La difficulté entraîne la facilité (rukhas dans la religion)", est_correcte: true },
      { texte_fr: "La difficulté annule l'obligation", est_correcte: false },
      { texte_fr: "Il faut toujours choisir le plus dur", est_correcte: false },
      { texte_fr: "La facilité est interdite", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh', sous_domaine: 'mu_amalat', niveau: 5, madhab: 'general',
    texte_fr: "Quelles sont les conditions principales d'une vente licite en islam ?",
    texte_ar: 'ما شروط البيع الصحيح في الإسلام؟',
    explication: "Les conditions incluent : consentement mutuel (Sourate An-Nisa 4:29), capacité juridique des deux parties, objet existant, connu, possédé, licite (pas d'alcool, porc, riba), prix déterminé, transfert clair de propriété. Le Prophète ﷺ a interdit la vente du gharar (incertitude).",
    dalil_ref: 'Sahih Muslim n°1513',
    grade_hadith: 'Hadith Sahih',
    reponses: [
      { texte_fr: "Consentement, capacité, objet licite et connu, prix déterminé, absence de gharar et riba", est_correcte: true },
      { texte_fr: "Seul le consentement suffit", est_correcte: false },
      { texte_fr: "Il faut un témoin musulman uniquement", est_correcte: false },
      { texte_fr: "La vente doit toujours être à crédit", est_correcte: false },
    ],
  },
  {
    domaine: 'fiqh', sous_domaine: 'mu_amalat', niveau: 5, madhab: 'general',
    texte_fr: "Quel est le statut islamique de l'assurance commerciale conventionnelle ?",
    texte_ar: 'ما حكم التأمين التجاري التقليدي في الإسلام؟',
    explication: "Le Conseil de l'Académie du Fiqh de l'OCI a déclaré l'assurance commerciale interdite car elle contient gharar (incertitude majeure), riba (intérêt) et maysir (jeu de hasard). L'alternative est le takaful (assurance mutuelle islamique).",
    dalil_ref: "Décision n°9 (2/2) Académie du Fiqh de l'OCI, 1985",
    reponses: [
      { texte_fr: "Interdite (gharar, riba, maysir) — alternative : takaful", est_correcte: true },
      { texte_fr: "Permise sans restriction", est_correcte: false },
      { texte_fr: "Obligatoire pour tous", est_correcte: false },
      { texte_fr: "Permise seulement pour la santé", est_correcte: false },
    ],
  },

  // ============= HADITH N5 =============
  {
    domaine: 'hadith', sous_domaine: 'mustalah', niveau: 5, madhab: 'general',
    texte_fr: "Quelle est la différence entre Hadith Sahih et Hadith Hasan selon Ibn Hajar ?",
    texte_ar: 'ما الفرق بين الحديث الصحيح والحسن عند ابن حجر؟',
    explication: "Le Sahih a tous ses narrateurs au plus haut degré de précision et d'intégrité (taman ad-dabt). Le Hasan a une chaîne identique mais avec un narrateur dont la précision est légèrement inférieure (khaffa ad-dabt). Les deux sont acceptables comme preuve.",
    dalil_ref: "Nuzhat an-Nazar d'Ibn Hajar",
    reponses: [
      { texte_fr: "Le Sahih a tous ses narrateurs au plus haut degré de précision ; le Hasan en a un de précision moindre", est_correcte: true },
      { texte_fr: "Le Sahih est de Bukhari, le Hasan de Muslim", est_correcte: false },
      { texte_fr: "Le Sahih est long, le Hasan est court", est_correcte: false },
      { texte_fr: "Aucune différence", est_correcte: false },
    ],
  },
  {
    domaine: 'hadith', sous_domaine: 'mustalah', niveau: 5, madhab: 'general',
    texte_fr: "Combien de hadiths Abu Hurayra رضي الله عنه a-t-il rapportés ?",
    texte_ar: 'كم عدد الأحاديث التي رواها أبو هريرة؟',
    explication: "Abu Hurayra رضي الله عنه a rapporté 5374 hadiths, ce qui fait de lui le compagnon ayant le plus rapporté. Il accompagna le Prophète ﷺ pendant 3 ans en y consacrant tout son temps.",
    dalil_ref: 'Tabaqat al-Muhaddithin',
    reponses: [
      { texte_fr: "5374 hadiths", est_correcte: true },
      { texte_fr: "1000 hadiths", est_correcte: false },
      { texte_fr: "10 000 hadiths", est_correcte: false },
      { texte_fr: "100 hadiths", est_correcte: false },
    ],
  },
  {
    domaine: 'hadith', sous_domaine: 'mustalah', niveau: 5, madhab: 'general',
    texte_fr: "Qu'est-ce qu'un hadith Mutawatir ?",
    texte_ar: 'ما هو الحديث المتواتر؟',
    explication: "C'est un hadith rapporté à chaque génération par un nombre tel de narrateurs qu'il est impossible qu'ils se soient concertés sur un mensonge. Il donne une certitude absolue (yaqin). Exemple : « Quiconque ment volontairement sur moi qu'il prépare sa place en enfer. » (rapporté par 70+ Compagnons)",
    dalil_ref: 'Sahih al-Bukhari n°110 ; Muslim n°1 (mutawatir)',
    grade_hadith: 'Hadith Mutawatir',
    reponses: [
      { texte_fr: "Hadith rapporté par un nombre rendant impossible l'entente sur un mensonge", est_correcte: true },
      { texte_fr: "Hadith très long", est_correcte: false },
      { texte_fr: "Hadith rapporté par un seul Compagnon", est_correcte: false },
      { texte_fr: "Hadith Qudsi", est_correcte: false },
    ],
  },

  // ============= SIRAH N4-N5 =============
  {
    domaine: 'sirah', sous_domaine: 'batailles', niveau: 4, madhab: 'general',
    texte_fr: "Combien de musulmans participèrent à la bataille de Badr (2H) ?",
    texte_ar: 'كم عدد المسلمين في غزوة بدر؟',
    explication: "Environ 313 musulmans face à 1000 mecquois. Allah a soutenu les musulmans par des anges et leur a donné la victoire. C'est la « Yawm al-Furqan » (le Jour du Discernement), cf. Al-Anfal 8:41.",
    dalil_ref: 'Sourate Al-Anfal 8:41 ; Sahih al-Bukhari',
    reponses: [
      { texte_fr: "Environ 313 (face à 1000 mecquois)", est_correcte: true },
      { texte_fr: "10 000 musulmans", est_correcte: false },
      { texte_fr: "50 musulmans", est_correcte: false },
      { texte_fr: "1000 musulmans", est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'batailles', niveau: 4, madhab: 'general',
    texte_fr: "Pourquoi les musulmans ont-ils failli perdre la bataille de Uhud (3H) ?",
    texte_ar: 'لماذا كادت غزوة أحد تنتهي بهزيمة المسلمين؟',
    explication: "Les archers placés sur le mont par le Prophète ﷺ ont quitté leur poste en voyant la victoire approcher, désobéissant à l'ordre clair. Khalid ibn al-Walid (encore mécréant à l'époque) contourna alors la position et attaqua par derrière. C'est une grande leçon d'obéissance.",
    dalil_ref: 'Sourate Al-Imran 3:152 ; Sahih al-Bukhari n°4043',
    grade_hadith: 'Hadith Sahih',
    reponses: [
      { texte_fr: "Les archers ont quitté leur poste pour le butin", est_correcte: true },
      { texte_fr: "Le Prophète ﷺ était absent", est_correcte: false },
      { texte_fr: "Les musulmans étaient trop peu nombreux", est_correcte: false },
      { texte_fr: "Il pleuvait fortement", est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'conquetes', niveau: 5, madhab: 'general',
    texte_fr: "En quelle année Umar ibn al-Khattab a-t-il libéré Jérusalem ?",
    texte_ar: 'في أي سنة فتح عمر القدس؟',
    explication: "En l'an 15-16 H (636-637 G), suite à la victoire de Yarmuk. Le patriarche Sophrone exigea qu'Umar vienne en personne pour signer le pacte. Umar conclut le célèbre « Pacte d'Umar » garantissant la protection des chrétiens et de leurs lieux de culte.",
    dalil_ref: 'Tarikh at-Tabari ; al-Bidaya wan-Nihaya',
    reponses: [
      { texte_fr: "15-16 H (636-637 G)", est_correcte: true },
      { texte_fr: "8 H (l'année de la conquête de La Mecque)", est_correcte: false },
      { texte_fr: "100 H", est_correcte: false },
      { texte_fr: "1 H (année de la Hijra)", est_correcte: false },
    ],
  },
  {
    domaine: 'sirah', sous_domaine: 'gouvernance', niveau: 5, madhab: 'general',
    texte_fr: "Quelle innovation administrative Umar ibn al-Khattab introduisit-il pour les soldats ?",
    texte_ar: 'ما النظام الإداري الذي أحدثه عمر للجند؟',
    explication: "Umar رضي الله عنه créa le Diwan (registre administratif) en 15 H pour enregistrer les soldats et fixer leurs pensions selon l'ancienneté dans l'islam. Cela permit une distribution juste et systématique du Bayt al-Mal (Trésor public).",
    dalil_ref: 'Tarikh at-Tabari ; al-Kharaj d\'Abu Yusuf',
    reponses: [
      { texte_fr: "Le Diwan : registre des soldats avec pensions selon ancienneté islamique", est_correcte: true },
      { texte_fr: "Il licencia tous les soldats", est_correcte: false },
      { texte_fr: "Il créa une armée de mercenaires", est_correcte: false },
      { texte_fr: "Il imposa le service militaire à tous", est_correcte: false },
    ],
  },
];

export async function seedQuestionsAvanceesV2(client: Client): Promise<void> {
  console.log('Seeding questions avancées V2 (niveaux 4-5)...');

  let inserted = 0;
  let skipped = 0;

  for (const q of QUESTIONS) {
    const exists = await client.query(
      'SELECT id FROM questions WHERE texte_fr = $1',
      [q.texte_fr]
    );
    if (exists.rows.length > 0) { skipped++; continue; }

    const qResult = await client.query(
      `INSERT INTO questions (domaine, sous_domaine, niveau, madhab, texte_fr, texte_ar, dalil_ref, explication, grade_hadith, statut)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'valide')
       RETURNING id`,
      [
        q.domaine, q.sous_domaine ?? null, q.niveau, q.madhab,
        q.texte_fr, q.texte_ar ?? null,
        q.dalil_ref ?? null, q.explication ?? null,
        q.grade_hadith ?? null,
      ]
    );

    const questionId = qResult.rows[0].id;
    for (const r of q.reponses) {
      await client.query(
        `INSERT INTO reponses (question_id, texte_fr, texte_ar, est_correcte) VALUES ($1,$2,$3,$4)`,
        [questionId, r.texte_fr, r.texte_ar ?? null, r.est_correcte]
      );
    }
    inserted++;
  }

  console.log(`Avancées V2: ${inserted} inserted, ${skipped} skipped.`);
}

if (require.main === module) {
  const { Client } = require('pg');
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  c.connect().then(async () => {
    await seedQuestionsAvanceesV2(c);
    await c.end();
  }).catch((err: unknown) => { console.error(err); process.exit(1); });
}
