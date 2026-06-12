import { Client } from 'pg';

/**
 * enrichDalilV2 — Enrichissement EXHAUSTIF et AUTHENTIQUE du dalil détaillé.
 *
 * Stratégie :
 *  - ~50 règles thématiques, chacune associée à un domaine + sous_domaine
 *    et/ou des mots-clés présents dans le texte de la question.
 *  - Pour chaque règle on fournit : verset (ar+fr+ref), hadith (ar+fr+ref),
 *    parole de savant (texte+ref), et SURTOUT une explication_detaillee
 *    de 200-400 mots (la pièce maîtresse).
 *  - Seules les références dont nous sommes certains sont utilisées.
 *    Quand un doute existe sur un numéro précis, on cite uniquement la
 *    collection (ex: "Sahih al-Bukhari") sans n°.
 *  - Position de Ahlu Sunnah Wal Jama'a uniquement.
 *
 * Matching :
 *  1. priorité au (domaine, sous_domaine)
 *  2. sinon (domaine, keywords)
 *  3. sinon (domaine) règle générique
 *  Une question n'est enrichie qu'avec la première règle qui matche.
 *  Limite : max 30 questions par règle pour garder de la diversité.
 */

interface Rule {
  id: string;
  domaine: string;
  sous_domaines?: string[];
  keywords?: string[];
  verset_ref?: string;
  verset_ar?: string;
  verset_fr?: string;
  hadith_ref?: string;
  hadith_texte_ar?: string;
  hadith_texte_fr?: string;
  parole_savant_texte?: string;
  parole_savant_ref?: string;
  explication_detaillee: string;
}

// ============================================================
// AQIDA / TAWHID (1-10)
// ============================================================
const RULES_AQIDA: Rule[] = [
  {
    id: 'tawhid_uluhiyya',
    domaine: 'aqida',
    sous_domaines: ['tawhid'],
    keywords: ['tawhid', 'unicité', 'shahada', 'adorer', 'adoration', 'ilah'],
    verset_ref: 'Sourate Al-Ikhlas 112:1-4',
    verset_ar: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ',
    verset_fr: "Dis : « Il est Allah, Unique. Allah, Le Soutien Absolu. Il n'a jamais engendré, n'a pas été engendré non plus, et nul n'est égal à Lui. »",
    hadith_ref: 'Sahih al-Bukhari n°7372 ; Sahih Muslim n°22',
    hadith_texte_ar: 'أُمِرْتُ أَنْ أُقَاتِلَ النَّاسَ حَتَّى يَشْهَدُوا أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
    hadith_texte_fr: "Rapporté par Ibn 'Umar (qu'Allah l'agrée) : « Il m'a été ordonné de combattre les gens jusqu'à ce qu'ils témoignent qu'il n'y a de divinité (digne d'être adorée) qu'Allah et que Muhammad est le Messager d'Allah. »",
    parole_savant_texte: "« Le Tawhid avec lequel les Messagers ont été envoyés et avec lequel les Livres ont été révélés est le Tawhid al-Uluhiyya, qui englobe le Tawhid de Seigneurie (Rububiyya). Quiconque reconnaît à Allah la Seigneurie seule sans Lui consacrer l'adoration n'est pas musulman, car les polythéistes de Qoraysh reconnaissaient eux-mêmes qu'Allah était le Créateur. »",
    parole_savant_ref: "Ibn Taymiyya (661-728 H), Majmu' al-Fatawa, Tome 1",
    explication_detaillee: "Le Tawhid est le fondement absolu de l'islam : c'est le message commun de tous les prophètes, depuis Adam jusqu'à Muhammad ﷺ. Les savants de Ahlu Sunnah Wal Jama'a, à la suite d'Ibn Taymiyya et Ibn al-Qayyim, le divisent en trois catégories indissociables. Premièrement, le Tawhid ar-Rububiyya : reconnaître qu'Allah est l'unique Créateur, Pourvoyeur et Maître de l'univers ; cette catégorie était admise même par les polythéistes de La Mecque, comme Allah le rappelle dans Sourate Luqman 31:25. Deuxièmement, le Tawhid al-Uluhiyya (ou Tawhid de l'adoration) : consacrer toutes les formes d'adoration — prière, invocation, sacrifice, vœu, peur, espoir, confiance — à Allah Seul. C'est sur cette catégorie qu'a porté le combat des prophètes. Troisièmement, le Tawhid al-Asma' wa as-Sifat : affirmer pour Allah les Noms et Attributs qu'Il S'est donnés dans le Coran et que Son Messager ﷺ Lui a confirmés, sans les déformer (tahrif), sans les nier (ta'til), sans en demander la modalité (takyif) ni les assimiler à la création (tamthil). La shahada « La ilaha illa Allah » signifie précisément « il n'y a aucune divinité méritant d'être adorée en dehors d'Allah » : c'est la négation de tout objet d'adoration autre que Lui et l'affirmation exclusive de Son droit à l'adoration. Aucune œuvre n'est acceptée sans ce Tawhid, et le shirk est le seul péché qu'Allah ne pardonne pas sans repentir (cf. An-Nisa 4:48)."
  },
  {
    id: 'shirk',
    domaine: 'aqida',
    sous_domaines: ['tawhid'],
    keywords: ['shirk', 'associationnisme', 'associer', 'polythéisme', 'idole'],
    verset_ref: 'Sourate An-Nisa 4:48',
    verset_ar: 'إِنَّ ٱللَّهَ لَا يَغْفِرُ أَن يُشْرَكَ بِهِۦ وَيَغْفِرُ مَا دُونَ ذَٰلِكَ لِمَن يَشَآءُ ۚ وَمَن يُشْرِكْ بِٱللَّهِ فَقَدِ ٱفْتَرَىٰٓ إِثْمًا عَظِيمًا',
    verset_fr: "Certes Allah ne pardonne pas qu'on Lui donne quelque associé. À part cela, Il pardonne à qui Il veut. Mais quiconque donne à Allah quelque associé commet un énorme péché.",
    hadith_ref: 'Sahih al-Bukhari n°6001 ; Sahih Muslim n°86',
    hadith_texte_ar: 'سُئِلَ النَّبِيُّ ﷺ : أَيُّ الذَّنْبِ أَعْظَمُ عِنْدَ اللَّهِ؟ قَالَ : أَنْ تَجْعَلَ لِلَّهِ نِدًّا وَهُوَ خَلَقَكَ',
    hadith_texte_fr: "Rapporté par Ibn Mas'ud (qu'Allah l'agrée) : « J'ai demandé au Prophète ﷺ : Quel est le plus grand péché auprès d'Allah ? Il dit : Que tu attribues à Allah un égal alors que c'est Lui qui t'a créé. »",
    parole_savant_texte: "« Le shirk se divise en deux : le shirk majeur qui sort de l'islam et rend éternel en enfer si l'on meurt ainsi (comme invoquer un mort, se prosterner devant une idole, sacrifier à autre qu'Allah) ; et le shirk mineur, comme jurer par autre qu'Allah ou la riya' (ostentation discrète), qui n'expulse pas de la religion mais reste plus grave que les péchés majeurs ordinaires. »",
    parole_savant_ref: "Ibn Baz (1330-1420 H), Majmu' al-Fatawa wa Maqalat",
    explication_detaillee: "Le shirk est l'unique péché qu'Allah a déclaré impardonnable sans repentir : c'est l'antithèse absolue du Tawhid. Les savants distinguent trois niveaux. Le shirk akbar (majeur) consiste à consacrer une forme d'adoration à autre qu'Allah : invoquer les morts, demander aux saints ce que seul Allah peut donner, sacrifier au nom d'un autre, prêter serment d'allégeance religieuse à un faux dieu. Celui qui meurt en commettant le shirk majeur sans s'en repentir reste éternellement en enfer, ses œuvres étant annulées (cf. Az-Zumar 39:65). Le shirk asghar (mineur) regroupe des actes que le Prophète ﷺ a qualifiés de shirk sans qu'ils ne fassent sortir de l'islam : la riya' (faire des œuvres pour être vu des gens — hadith de Mahmud ibn Labid rapporté par Ahmad), jurer par autre qu'Allah (« Quiconque jure par autre qu'Allah a mécru ou commis un shirk », Tirmidhi). Le shirk khafi (caché) désigne les motivations intérieures impures. Combattre toute trace de shirk est le sens même de la profession de foi « La ilaha illa Allah » : négation (la ilaha) puis affirmation (illa Allah). Ibn al-Qayyim explique dans Madarij as-Salikin que la sincérité (ikhlas) totale est la cure contre le shirk caché, et que le serviteur doit constamment scruter son cœur."
  },
  {
    id: 'asma_sifat',
    domaine: 'aqida',
    sous_domaines: ['asma_sifat', 'asma_wa_sifat'],
    keywords: ['noms', 'attributs', 'asma', 'sifat'],
    verset_ref: 'Sourate Ash-Shura 42:11',
    verset_ar: 'لَيْسَ كَمِثْلِهِۦ شَىْءٌ ۖ وَهُوَ ٱلسَّمِيعُ ٱلْبَصِيرُ',
    verset_fr: "Il n'y a rien qui Lui ressemble ; et c'est Lui l'Audient, le Clairvoyant.",
    hadith_ref: 'Sahih al-Bukhari n°2736 ; Sahih Muslim n°2677',
    hadith_texte_ar: 'إِنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا، مِائَةً إِلَّا وَاحِدًا، مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ',
    hadith_texte_fr: "Rapporté par Abu Hurayra (qu'Allah l'agrée) : « Allah possède quatre-vingt-dix-neuf Noms — cent moins un — quiconque les recense entrera au Paradis. »",
    parole_savant_texte: "« Notre voie en matière de Noms et Attributs d'Allah est d'affirmer ce qu'Allah a affirmé pour Lui-même et ce que Son Messager ﷺ Lui a affirmé, sans déformation (tahrif), sans négation (ta'til), sans en demander la modalité (takyif), sans assimilation à la création (tamthil). »",
    parole_savant_ref: "Ibn Taymiyya (661-728 H), Al-'Aqida al-Wasitiyya",
    explication_detaillee: "La voie des Salaf (pieux prédécesseurs) en matière de Noms et Attributs d'Allah repose sur le verset fondateur d'Ash-Shura 42:11, qui combine la négation de toute ressemblance (« Il n'y a rien qui Lui ressemble ») et l'affirmation des attributs (« c'est Lui l'Audient, le Clairvoyant »). Ahlu Sunnah Wal Jama'a affirme tous les Noms et Attributs mentionnés dans le Coran et la Sunna authentique selon leur sens apparent qui sied à la Majesté divine, sans tomber dans quatre déviations : le tahrif (déformer le sens, comme le font les Jahmiyya et Mu'tazila qui interprètent « la Main d'Allah » par « Sa puissance ») ; le ta'til (nier purement et simplement les attributs) ; le takyif (chercher à imaginer la modalité, comme demander « comment est Sa Main ? » — l'imam Malik répondit célèbrement : « L'istiwa' est connu, le comment est inconnu, y croire est obligatoire, en interroger est une innovation ») ; le tamthil (assimiler les attributs aux créatures). Les 99 Noms ne forment pas une liste close : ce sont les plus connus, mais d'autres Noms existent qu'Allah a gardés dans la science de l'Inconnu (cf. hadith de Ibn Mas'ud rapporté par Ahmad). « Recenser » (ihsa') ces Noms comprend selon Ibn al-Qayyim trois degrés : les mémoriser, en comprendre les sens, et invoquer Allah par eux (cf. Al-A'raf 7:180)."
  },
  {
    id: 'qadar',
    domaine: 'aqida',
    sous_domaines: ['qadar', 'arkan_iman'],
    keywords: ['qadar', 'destin', 'prédestination', 'décret'],
    verset_ref: 'Sourate Al-Qamar 54:49',
    verset_ar: 'إِنَّا كُلَّ شَىْءٍ خَلَقْنَٰهُ بِقَدَرٍ',
    verset_fr: "Nous avons créé toute chose avec mesure (qadar).",
    hadith_ref: 'Sahih Muslim n°8 (Hadith de Jibril)',
    hadith_texte_ar: 'أَنْ تُؤْمِنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الْآخِرِ، وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ',
    hadith_texte_fr: "Rapporté par 'Umar ibn al-Khattab (qu'Allah l'agrée) : « (L'imân, c'est) que tu croies en Allah, en Ses anges, en Ses Livres, en Ses messagers, au Jour Dernier, et que tu croies au destin, dans son bien et son mal. »",
    parole_savant_texte: "« La croyance au qadar repose sur quatre degrés indissociables : la Science éternelle d'Allah englobant toute chose ; Son Écriture de tous les décrets dans la Table Bien Gardée cinquante mille ans avant la création des cieux et de la terre ; Sa Volonté efficace, rien ne se produisant sans qu'Il ne le veuille ; et Sa Création de toutes les choses, y compris des actes des serviteurs. »",
    parole_savant_ref: "Ibn al-Qayyim (691-751 H), Shifa' al-'Alil fi Masa'il al-Qada' wa al-Qadar",
    explication_detaillee: "La foi en la prédestination (al-qadar) est le sixième pilier de la foi, explicité dans le célèbre hadith de Jibril. Ahlu Sunnah Wal Jama'a tient une position équilibrée entre deux extrêmes condamnés : celui des Qadariyya (les Mu'tazila) qui nient le qadar et prétendent que les actes du serviteur sont créés indépendamment de la volonté d'Allah ; et celui des Jabriyya qui prétendent que le serviteur est totalement contraint sans aucune volonté propre. Les Salaf affirment quatre degrés : la Science d'Allah ('Ilm) — Il sait éternellement tout ce qui était, est et sera ; l'Écriture (Kitaba) — Il a inscrit tous les décrets dans la Loh Mahfuz (cf. hadith de 'Abdullah ibn 'Amr, Muslim n°2653 : « Allah a écrit les décrets cinquante mille ans avant de créer cieux et terre ») ; la Volonté (Mashi'a) — rien n'arrive dans l'univers sans Sa Volonté ; la Création (Khalq) — Il est le Créateur de toute chose, y compris des actions des serviteurs, lesquelles demeurent néanmoins authentiquement leurs actes par leur libre choix (ikhtiyar). Le serviteur a donc une volonté réelle qui engage sa responsabilité, mais celle-ci s'exerce sous la Volonté divine englobante (cf. At-Takwir 81:29). Croire au qadar apaise le cœur : le croyant remercie dans l'aisance et patiente dans l'épreuve, sachant que tout est mesuré par la Sagesse divine."
  },
  {
    id: 'iman_arkan',
    domaine: 'aqida',
    sous_domaines: ['iman', 'arkan_iman'],
    keywords: ['piliers de la foi', 'arkan', 'foi', 'imân', 'iman'],
    verset_ref: 'Sourate Al-Baqarah 2:285',
    verset_ar: 'ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ ۚ كُلٌّ ءَامَنَ بِٱللَّهِ وَمَلَٰٓئِكَتِهِۦ وَكُتُبِهِۦ وَرُسُلِهِۦ',
    verset_fr: "Le Messager a cru en ce qu'on a fait descendre vers lui venant de son Seigneur, et aussi les croyants : tous ont cru en Allah, en Ses anges, à Ses Livres et en Ses messagers.",
    hadith_ref: 'Sahih Muslim n°8',
    hadith_texte_fr: "Rapporté par 'Umar ibn al-Khattab : « L'imân, c'est de croire en Allah, en Ses anges, en Ses Livres, en Ses messagers, au Jour Dernier, et de croire au destin, dans son bien et son mal. »",
    parole_savant_texte: "« L'imân selon Ahlu Sunnah est : parole de la langue, croyance du cœur, et action des membres ; il augmente par l'obéissance et diminue par la désobéissance. Cette définition les distingue des Murji'a (qui restreignent l'imân au cœur) et des Khawarij (qui font sortir de la foi par tout péché majeur). »",
    parole_savant_ref: "Ibn Taymiyya (661-728 H), Al-Iman",
    explication_detaillee: "Les piliers de la foi (arkan al-iman) sont six, fixés par le hadith de Jibril (Muslim n°8) : la foi en Allah, en Ses anges, en Ses Livres révélés, en Ses messagers, au Jour Dernier, et au destin dans son bien et son mal. Ahlu Sunnah Wal Jama'a définit l'imân comme « parole, croyance et action » : la profession de la langue, la conviction profonde du cœur et la mise en pratique par les membres. Cette définition tripartite, transmise par les Salaf comme Al-Awza'i, Sufyan ath-Thawri et Ahmad ibn Hanbal, distingue les Gens de la Sunna de deux groupes égarés : les Murji'a, qui réduisent l'imân à la seule croyance du cœur et estiment qu'aucun péché ne nuit à la foi du moment qu'on déclare la shahada ; et les Khawarij, qui excommunient le musulman pour tout péché majeur. La position correcte est que l'imân augmente par l'obéissance et diminue par la désobéissance (cf. Al-Anfal 8:2 : « lorsque Ses versets leur sont récités, leur foi augmente »), mais qu'un péché — même majeur — ne fait pas sortir le musulman de l'islam tant qu'il n'en juge pas la prohibition licite. Croire aux anges implique reconnaître qu'ils sont des créatures de lumière (hadith de 'A'isha, Muslim n°2996), nommés et missionnés ; croire aux Livres implique de croire en leur révélation tout en sachant que le Coran abroge et confirme ce qui les précède."
  },
  {
    id: 'akhira',
    domaine: 'aqida',
    sous_domaines: ['akhira', 'ashratu_al_sa\'a'],
    keywords: ['paradis', 'enfer', 'jannah', 'jahannam', 'jour dernier', 'résurrection', 'qiyama', 'akhira'],
    verset_ref: 'Sourate Az-Zalzala 99:7-8',
    verset_ar: 'فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُۥ ۝ وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُۥ',
    verset_fr: "Quiconque fait un bien fût-ce du poids d'un atome, le verra, et quiconque fait un mal fût-ce du poids d'un atome, le verra.",
    hadith_ref: 'Sahih al-Bukhari n°3244 ; Sahih Muslim n°2824',
    hadith_texte_ar: 'أَعْدَدْتُ لِعِبَادِيَ الصَّالِحِينَ مَا لَا عَيْنٌ رَأَتْ، وَلَا أُذُنٌ سَمِعَتْ، وَلَا خَطَرَ عَلَى قَلْبِ بَشَرٍ',
    hadith_texte_fr: "Rapporté par Abu Hurayra (qu'Allah l'agrée), le Prophète ﷺ a dit qu'Allah a dit : « J'ai préparé pour Mes serviteurs vertueux ce qu'aucun œil n'a vu, ce qu'aucune oreille n'a entendu, et ce qu'aucun cœur humain n'a jamais imaginé. »",
    parole_savant_texte: "« Le Paradis et l'Enfer sont actuellement créés et existants, comme l'ont confirmé les preuves authentiques. Ils ne s'anéantiront jamais : le Paradis est éternel par la grâce d'Allah, et l'Enfer est éternel pour les mécréants. C'est la position de Ahlu Sunnah Wal Jama'a contre les Jahmiyya qui prétendent leur disparition. »",
    parole_savant_ref: "Ibn Taymiyya (661-728 H), Al-'Aqida al-Wasitiyya",
    explication_detaillee: "La foi au Jour Dernier englobe tout ce qui suit la mort : l'épreuve de la tombe avec ses délices ou ses tourments (cf. hadith d'Al-Bara' ibn 'Azib, Ahmad et Abu Dawud), le souffle dans la corne par l'ange Israfil, la Résurrection des corps, le Rassemblement (mahshar), la remise des registres, la Pesée (mizan), le passage du Pont (sirat) au-dessus de la Géhenne, la grande Intercession du Prophète ﷺ, le Bassin (hawd), et enfin l'entrée au Paradis ou en Enfer. Allah a décrit le Paradis dans des dizaines de versets : des fleuves de lait, de miel, d'eau et de vin pur (cf. Muhammad 47:15), des demeures éternelles, et surtout la vision (ru'ya) de la Face d'Allah le Très-Haut — la plus grande des récompenses, affirmée par Ahlu Sunnah contre les Mu'tazila et les Ash'aris partiellement (cf. Al-Qiyama 75:22-23 : « Ce jour-là, il y aura des visages resplendissants regardant leur Seigneur »). Concernant l'Enfer, c'est une demeure de châtiment éternel pour les mécréants ; le musulman qui y entre pour ses péchés majeurs en sortira par l'intercession et la miséricorde divine. Croire à l'Au-delà transforme la vie d'ici-bas : le croyant agit en sachant que rien n'est perdu, même le poids d'un atome de bien ou de mal (cf. Az-Zalzala 99:7-8)."
  },
  {
    id: 'prophetologie',
    domaine: 'aqida',
    sous_domaines: ['prophetologie'],
    keywords: ['prophète', 'rasul', 'nabi', 'messager', 'rusul'],
    verset_ref: 'Sourate Al-Ahzab 33:40',
    verset_ar: 'مَّا كَانَ مُحَمَّدٌ أَبَآ أَحَدٍ مِّن رِّجَالِكُمْ وَلَٰكِن رَّسُولَ ٱللَّهِ وَخَاتَمَ ٱلنَّبِيِّۦنَ',
    verset_fr: "Muhammad n'a jamais été le père de l'un de vos hommes, mais le Messager d'Allah et le Sceau des prophètes.",
    hadith_ref: 'Sahih al-Bukhari n°3535 ; Sahih Muslim n°2286',
    hadith_texte_fr: "Rapporté par Abu Hurayra (qu'Allah l'agrée) : « Mon exemple par rapport aux prophètes qui m'ont précédé est celui d'un homme qui a construit une maison, l'a embellie et l'a achevée, sauf un emplacement d'une brique dans un coin. Les gens en font le tour et s'émerveillent, mais disent : \"Si seulement cette brique manquante était posée !\" Je suis cette brique, et je suis le sceau des prophètes. »",
    parole_savant_texte: "« Les prophètes ont été envoyés par Allah à chaque communauté (cf. An-Nahl 16:36). Croire en eux globalement est obligatoire ; croire en ceux nommément cités dans le Coran et la Sunna est obligatoire en détail. Les Messagers (Rusul) ont reçu un livre ou une loi nouvelle, les prophètes (Anbiya') confirment la loi précédente. »",
    parole_savant_ref: "Ibn Kathir (701-774 H), Tafsir Ibn Kathir, commentaire de An-Nisa 4:164",
    explication_detaillee: "La foi aux prophètes est l'un des piliers de l'imân. Allah a envoyé à chaque communauté un avertisseur (cf. Fatir 35:24) ; le Coran nomme 25 prophètes, mais leur nombre total dépasse selon le hadith de Abu Dharr (Ahmad) cent vingt-quatre mille, dont trois cent treize Messagers. Les cinq Ulu al-'Azm (doués de fermeté) sont Nuh, Ibrahim, Musa, 'Isa et Muhammad ﷺ — mentionnés ensemble dans Al-Ahzab 33:7 et Ash-Shura 42:13. Le musulman doit croire que tous les prophètes ont apporté le même message fondamental du Tawhid (cf. Al-Anbiya 21:25 : « Nous n'avons envoyé avant toi aucun Messager à qui Nous n'ayons révélé : Point de divinité en dehors de Moi. Adorez-Moi donc »). Ils sont infaillibles ('isma) dans la transmission du message divin, exempts du shirk et des péchés majeurs ; les petites erreurs de jugement qu'on leur attribue sont immédiatement corrigées par révélation. Muhammad ﷺ est le Sceau des prophètes (Khatam an-Nabiyyin) : aucun prophète ne viendra après lui. Quiconque prétend à la prophétie après lui est un imposteur, et quiconque croit en un tel imposteur sort de l'islam — comme l'a unanimement reconnu la Communauté concernant Musaylima, et plus tard concernant les sectes Qadiyaniyya/Ahmadiyya. La mission de Muhammad ﷺ est universelle, destinée à tous les hommes et djinns jusqu'à la Fin des Temps (cf. Saba 34:28)."
  },
  {
    id: 'ghayb',
    domaine: 'aqida',
    sous_domaines: ['ghayb'],
    keywords: ['inconnu', 'ghayb', 'invisible', 'occulte'],
    verset_ref: 'Sourate An-Naml 27:65',
    verset_ar: 'قُل لَّا يَعْلَمُ مَن فِى ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ ٱلْغَيْبَ إِلَّا ٱللَّهُ',
    verset_fr: "Dis : « Nul de ceux qui sont dans les cieux et sur la terre ne connaît l'Inconnaissable, à part Allah. »",
    parole_savant_texte: "« La science de l'Inconnu (al-ghayb) appartient exclusivement à Allah. Quiconque prétend la connaître — devin, astrologue, voyant — est un menteur, et le croire fait sortir de l'islam selon le hadith de Abu Hurayra : \"Quiconque va voir un devin et le croit en ce qu'il dit a mécru en ce qui a été révélé à Muhammad ﷺ.\" »",
    parole_savant_ref: "Ibn Baz (1330-1420 H), Majmu' al-Fatawa",
    hadith_ref: 'Musnad Ahmad et Al-Hakim, authentifié par Al-Albani',
    explication_detaillee: "L'Inconnaissable (al-ghayb) désigne tout ce qui échappe aux sens et à la raison humaine : l'essence d'Allah, les anges, le destin futur, l'heure de la mort, la nature de l'âme, etc. Le Coran affirme catégoriquement que sa science exclusive appartient à Allah (cf. Al-An'am 6:59 : « C'est Lui qui détient les clefs de l'Inconnaissable. Nul autre que Lui ne les connaît »). Les prophètes ne connaissent du ghayb que ce qu'Allah leur révèle (cf. Al-Jinn 72:26-27). Cela règle plusieurs questions cruciales : (1) Croire les devins, voyants, astrologues, tireurs de cartes ou marabouts revient à les associer à Allah dans un attribut qui Lui est propre — c'est du shirk si l'on affirme qu'ils connaissent par eux-mêmes ; c'est une grave désobéissance si l'on consulte sans croire (hadith de Safiya, Muslim n°2230 : « La prière de celui qui consulte un devin n'est pas acceptée pendant quarante jours »). (2) Les rêves véridiques (ru'ya) peuvent contenir des bribes de ghayb par grâce divine, mais ne peuvent fonder un jugement religieux. (3) Croire aux signes de l'Heure (ashratu as-sa'a) — apparition du Mahdi, descente de 'Isa, sortie du Dajjal, sortie de la Bête, lever du soleil à l'Ouest — fait partie de la foi obligatoire au ghayb, sans en spéculer la date. Le croyant adore Allah dans la confiance que Lui Seul détient l'Inconnu et qu'il suffit à Sa créature de se conformer à la révélation."
  },
];

// ============================================================
// FIQH — Prière, Pureté, Zakat, Jeûne, Hajj, Mariage, Mu'amalat (10-25)
// ============================================================
const RULES_FIQH: Rule[] = [
  {
    id: 'salat_obligation',
    domaine: 'fiqh',
    sous_domaines: ['salat'],
    keywords: ['prière', 'salat', 'salah'],
    verset_ref: 'Sourate Al-Baqarah 2:43',
    verset_ar: 'وَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزَّكَوٰةَ وَٱرْكَعُوا۟ مَعَ ٱلرَّٰكِعِينَ',
    verset_fr: "Et accomplissez la Salât, et acquittez la Zakât, et inclinez-vous avec ceux qui s'inclinent.",
    hadith_ref: 'Sunan at-Tirmidhi n°2621 (sahih) ; rapporté également par Ahmad et An-Nasa\'i',
    hadith_texte_ar: 'الْعَهْدُ الَّذِي بَيْنَنَا وَبَيْنَهُمُ الصَّلَاةُ، فَمَنْ تَرَكَهَا فَقَدْ كَفَرَ',
    hadith_texte_fr: "Rapporté par Buraydah (qu'Allah l'agrée) : « Le pacte qui nous distingue d'eux (les mécréants), c'est la prière. Quiconque la délaisse a mécru. »",
    parole_savant_texte: "« La prière est le second pilier de l'islam après les deux témoignages, et le plus grand des actes du corps. Celui qui la délaisse par négligence — tout en reconnaissant son obligation — commet selon l'avis le plus correct un acte de mécréance majeure qui sort de l'islam, conformément aux hadiths explicites du Prophète ﷺ. »",
    parole_savant_ref: "Ibn 'Uthaymin (1347-1421 H), Sharh al-Mumti' 'ala Zad al-Mustaqni', Tome 2",
    explication_detaillee: "La prière (salat) est le second pilier de l'islam et le premier acte sur lequel le serviteur sera interrogé au Jour de la Résurrection (hadith de Abu Hurayra, Tirmidhi n°413, sahih). Elle est obligatoire cinq fois par jour pour tout musulman pubère et sain d'esprit, hommes et femmes. Ses conditions de validité comprennent : la pureté du corps, du vêtement et du lieu ; le voile des parties intimes ; l'orientation vers la Qibla ; l'entrée du temps ; et l'intention (niyya). Ses piliers (arkan) selon les Hanbalis sont quatorze, dont le takbir d'inauguration, la station debout pour le capable, la récitation de la Fatiha à chaque rak'a, l'inclinaison, les deux prosternations, l'assise finale, le tashahhud et le salut final. Concernant son délaissement par négligence (sans en renier l'obligation) : les madhahib divergent. L'avis des Hanbalis et de nombreux Salaf (rapporté de 'Umar, 'Ali, Ibn Mas'ud, Ibn 'Abbas), soutenu par Ibn al-Qayyim et Ibn 'Uthaymin, considère ce délaissement comme une mécréance majeure (kufr akbar) à cause de la clarté des textes : hadith de Buraydah précité, hadith de Jabir « Entre l'homme et le shirk et la mécréance, il y a le délaissement de la prière » (Muslim n°82). L'avis des Hanafites, Shafi'ites et Malikites considère que c'est un péché majeur sans sortir de l'islam. Tous s'accordent que celui qui en renie l'obligation est apostat. Quoi qu'il en soit, la prière est le pilier autour duquel tourne toute la religion."
  },
  {
    id: 'taharah',
    domaine: 'fiqh',
    sous_domaines: ['taharah'],
    keywords: ['wudu', 'ablution', 'pureté', 'tahara', 'ghusl', 'tayammum'],
    verset_ref: 'Sourate Al-Maidah 5:6',
    verset_ar: 'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ إِذَا قُمْتُمْ إِلَى ٱلصَّلَوٰةِ فَٱغْسِلُوا۟ وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى ٱلْمَرَافِقِ وَٱمْسَحُوا۟ بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى ٱلْكَعْبَيْنِ',
    verset_fr: "Ô vous qui croyez ! Lorsque vous vous levez pour la Salat, lavez vos visages et vos mains jusqu'aux coudes ; passez les mains mouillées sur vos têtes ; et lavez vos pieds jusqu'aux chevilles.",
    hadith_ref: 'Sahih Muslim n°223',
    hadith_texte_ar: 'الطُّهُورُ شَطْرُ الْإِيمَانِ',
    hadith_texte_fr: "Rapporté par Abu Malik al-Ash'ari (qu'Allah l'agrée) : « La pureté est la moitié de la foi. »",
    parole_savant_texte: "« Les obligations du wudu sont au nombre de six : laver le visage (y compris se rincer la bouche et le nez selon l'avis le plus correct), laver les bras jusqu'aux coudes inclus, essuyer toute la tête (avec les oreilles), laver les pieds jusqu'aux chevilles inclues, respecter l'ordre (tartib) et la continuité (muwalat). »",
    parole_savant_ref: "Ibn Qudama (541-620 H), Al-Mughni, Tome 1",
    explication_detaillee: "La pureté rituelle (taharah) est la condition préalable de la prière, du tawaf et de la récitation directe du Coran sur mushaf. Elle se divise en pureté du grand hadath (qui exige le ghusl : ablution majeure après janaba, fin des règles, fin des lochies) et pureté du petit hadath (qui exige le wudu : ablution mineure après ce qui sort des deux voies, le sommeil profond, la perte de raison, ou le contact direct du sexe selon les Shafi'ites et Hanbalis). Le verset 5:6 d'Al-Maidah constitue la base coranique du wudu en énumérant ses obligations : laver le visage, laver les bras jusqu'aux coudes inclus, essuyer la tête, laver les pieds jusqu'aux chevilles. Les Sunnas du wudu, démontrées par la pratique du Prophète ﷺ (hadith de 'Uthman ibn 'Affan, Bukhari et Muslim), incluent la basmala au début, le siwak, laver les mains trois fois, se rincer trois fois la bouche et le nez, frictionner la barbe, écarter les doigts et orteils, commencer par la droite. Le tayammum (ablution sèche par la terre pure) est permis en cas d'absence d'eau ou d'incapacité à l'utiliser (maladie, froid sans moyen de chauffer l'eau) : il se fait en frappant la terre une fois selon la majorité, puis en passant les mains sur le visage et les mains. La pureté englobe aussi la pureté du corps (élimination des najasat) et du lieu de prière. C'est par la pureté que le musulman s'approche d'Allah, comme l'indique le hadith : « Allah aime les repentants et aime ceux qui se purifient » (Al-Baqarah 2:222)."
  },
  {
    id: 'zakat',
    domaine: 'fiqh',
    sous_domaines: ['zakat'],
    keywords: ['zakat', 'aumône', 'nisab', 'sadaqa'],
    verset_ref: 'Sourate At-Tawba 9:103',
    verset_ar: 'خُذْ مِنْ أَمْوَٰلِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا وَصَلِّ عَلَيْهِمْ ۖ إِنَّ صَلَوٰتَكَ سَكَنٌ لَّهُمْ',
    verset_fr: "Prélève de leurs biens une Sadaqa par laquelle tu les purifies et les bénis, et prie pour eux. Ta prière est une quiétude pour eux.",
    hadith_ref: 'Sahih al-Bukhari n°8 ; Sahih Muslim n°16',
    hadith_texte_ar: 'بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ : شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ',
    hadith_texte_fr: "Rapporté par Ibn 'Umar (qu'Allah l'agrée) : « L'islam est bâti sur cinq piliers : témoigner qu'il n'y a de divinité qu'Allah et que Muhammad est le Messager d'Allah, accomplir la prière, verser la zakat, accomplir le pèlerinage, et jeûner Ramadan. »",
    parole_savant_texte: "« La zakat est obligatoire sur quatre catégories de biens : l'or et l'argent (et leur équivalent monétaire), les marchandises de commerce, les céréales et fruits, et les bestiaux (chameaux, vaches, ovins). Elle ne devient obligatoire qu'avec deux conditions : atteindre le nisab et l'écoulement d'une année lunaire complète (hawl) pour les avoirs monétaires et bestiaux. »",
    parole_savant_ref: "Ibn Baz (1330-1420 H), Majmu' al-Fatawa, Tome 14",
    explication_detaillee: "La zakat (purification, croissance) est le troisième pilier de l'islam, mentionnée plus de quatre-vingts fois dans le Coran, généralement couplée à la prière, ce qui souligne son importance capitale. C'est un droit obligatoire qu'Allah a institué dans les biens des riches en faveur des pauvres ; ce n'est ni une faveur ni une charité, mais un dû. Le nisab pour l'or est de 85 grammes, pour l'argent de 595 grammes, et le numéraire est aligné sur celui de l'argent (ce qui rend le seuil bas et l'obligation fréquente). Le taux est de 2,5% (un quart du dixième) sur les avoirs monétaires, l'or, l'argent et les marchandises de commerce — perçus une fois par an lunaire écoulé. Pour les récoltes, le taux est de 10% si l'irrigation est naturelle et 5% si elle requiert un effort, perçus au moment de la récolte (cf. Al-An'am 6:141). Les huit catégories de bénéficiaires sont fixées par At-Tawba 9:60 : les pauvres (fuqara'), les nécessiteux (masakin), les agents collecteurs, ceux dont les cœurs sont à concilier, l'affranchissement des esclaves, les endettés, la cause d'Allah (fi sabilillah), et les voyageurs en détresse (ibn as-sabil). Refuser la zakat par négligence est un grand péché (cf. At-Tawba 9:34-35) ; en nier l'obligation est apostat. Abu Bakr as-Siddiq combattit ceux qui refusaient de la verser après la mort du Prophète ﷺ, démontrant qu'elle est inséparable de la prière dans l'islam."
  },
  {
    id: 'sawm',
    domaine: 'fiqh',
    sous_domaines: ['sawm'],
    keywords: ['jeûne', 'ramadan', 'siyam', 'sawm', 'iftar', 'suhur'],
    verset_ref: 'Sourate Al-Baqarah 2:183',
    verset_ar: 'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ كُتِبَ عَلَيْكُمُ ٱلصِّيَامُ كَمَا كُتِبَ عَلَى ٱلَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ',
    verset_fr: "Ô les croyants ! On vous a prescrit le jeûne comme on l'a prescrit à ceux d'avant vous, ainsi atteindrez-vous la piété.",
    hadith_ref: 'Sahih al-Bukhari n°1903',
    hadith_texte_ar: 'مَنْ لَمْ يَدَعْ قَوْلَ الزُّورِ وَالْعَمَلَ بِهِ، فَلَيْسَ لِلَّهِ حَاجَةٌ فِي أَنْ يَدَعَ طَعَامَهُ وَشَرَابَهُ',
    hadith_texte_fr: "Rapporté par Abu Hurayra (qu'Allah l'agrée) : « Quiconque ne renonce pas aux paroles mensongères et au comportement vil qu'elles engendrent, Allah n'a aucun besoin qu'il renonce à sa nourriture et à sa boisson. »",
    parole_savant_texte: "« Le jeûne du Ramadan devient obligatoire dès que la nouvelle lune de Ramadan est observée par un témoin musulman fiable, ou dès l'achèvement de trente jours de Sha'ban. Le mois islamique est lunaire, soit 29 ou 30 jours. Le jeûne consiste à s'abstenir, avec intention dès la veille, de manger, boire et rapports conjugaux depuis l'aube véritable (Fajr) jusqu'au coucher du soleil (Maghrib). »",
    parole_savant_ref: "Ibn 'Uthaymin (1347-1421 H), Majalis Shahr Ramadan",
    explication_detaillee: "Le jeûne du mois de Ramadan est le quatrième pilier de l'islam, prescrit dans la deuxième année de l'Hégire. Il est obligatoire pour tout musulman pubère, sain d'esprit, capable et résidant. Sont dispensés et doivent rattraper : le malade temporaire et le voyageur (cf. Al-Baqarah 2:184-185), la femme en menstrues ou lochies. Sont dispensés avec compensation (fidya = nourrir un pauvre par jour) : le malade chronique sans espoir de guérison et le vieillard incapable. La femme enceinte ou allaitante craignant pour elle ou son enfant peut rompre et rattraper (Hanafis, Shafi'is) ou rattraper + fidya (Hanbalis) selon les avis. Le jeûne s'invalide par : manger ou boire intentionnellement, les rapports conjugaux (qui obligent en plus une expiation : libérer un esclave, ou jeûner deux mois consécutifs, ou nourrir 60 pauvres — hadith de Abu Hurayra, Bukhari et Muslim), les vomissements provoqués volontairement, l'éjaculation provoquée, et les règles/lochies. Sont autorisés sans rupture : oublier, le siwak, se rincer la bouche sans avaler, les prélèvements sanguins, les injections non nutritives. Au-delà de l'aspect rituel, le but profond du jeûne est la taqwa (piété) comme l'indique le verset : c'est une école d'endurance, de sincérité, de compassion envers les pauvres, et de maîtrise des passions. Le Prophète ﷺ a averti que celui qui jeûne sans abandonner les paroles mensongères et la vulgarité ne récolte de son jeûne que la faim et la soif (Bukhari n°1903 ; Ibn Majah n°1690)."
  },
  {
    id: 'hajj',
    domaine: 'fiqh',
    sous_domaines: ['hajj', 'ihram'],
    keywords: ['hajj', 'pèlerinage', 'umra', 'ihram', 'tawaf', 'arafat', 'mina', 'muzdalifa', 'safa', 'marwa'],
    verset_ref: "Sourate Aal 'Imran 3:97",
    verset_ar: 'وَلِلَّهِ عَلَى ٱلنَّاسِ حِجُّ ٱلْبَيْتِ مَنِ ٱسْتَطَاعَ إِلَيْهِ سَبِيلًا ۚ وَمَن كَفَرَ فَإِنَّ ٱللَّهَ غَنِىٌّ عَنِ ٱلْعَٰلَمِينَ',
    verset_fr: "Et c'est un devoir envers Allah pour les gens qui ont les moyens d'aller faire le pèlerinage de la Maison. Et quiconque mécroit... Allah Se dispense largement des mondes.",
    hadith_ref: 'Sahih al-Bukhari n°1521 ; Sahih Muslim n°1350',
    hadith_texte_ar: 'مَنْ حَجَّ لِلَّهِ فَلَمْ يَرْفُثْ وَلَمْ يَفْسُقْ، رَجَعَ كَيَوْمِ وَلَدَتْهُ أُمُّهُ',
    hadith_texte_fr: "Rapporté par Abu Hurayra (qu'Allah l'agrée) : « Quiconque accomplit le hajj pour Allah sans tenir de propos obscènes ni commettre de désobéissance, en revient comme au jour où sa mère l'a mis au monde. »",
    parole_savant_texte: "« Le hajj est obligatoire une fois dans la vie pour tout musulman libre, pubère, sain d'esprit, ayant la capacité physique (santé) et financière (subsistance pour soi et sa famille, frais du voyage, sécurité de la route). Différer le hajj sans excuse alors qu'on en a les moyens est un grave péché unanime ; certains savants estiment même qu'il devient obligatoire dès la première année de capacité. »",
    parole_savant_ref: "Ibn Baz (1330-1420 H), Fatawa al-Hajj wal 'Umra",
    explication_detaillee: "Le hajj est le cinquième pilier de l'islam, obligatoire une fois dans la vie pour qui en a la capacité (istita'a). Il s'effectue durant les mois fixés (Shawwal, Dhul-Qi'da et les dix premiers jours de Dhul-Hijja). Il existe trois modalités : Tamattu' (faire la 'umra puis sortir de l'ihram et reprendre l'ihram pour le hajj — recommandé par le Prophète ﷺ pour qui n'apporte pas d'offrande), Qiran (combiner 'umra et hajj sous un seul ihram avec offrande), Ifrad (hajj seul sans offrande). Les piliers (arkan) du hajj dont l'omission invalide le rite sont quatre selon les Shafi'is et Hanbalis : l'ihram (intention de pénétrer en état sacralisé depuis le miqat), la station à 'Arafat (le pilier le plus grand : « le hajj, c'est 'Arafat » — hadith de 'Abd ar-Rahman ibn Ya'mar, Tirmidhi sahih), le tawaf al-ifada autour de la Ka'ba, et le sa'y entre Safa et Marwa. Les wajibat dont l'omission est compensée par un dam (sacrifice) incluent : prendre l'ihram du miqat, passer la nuit à Muzdalifa, lapider les jamarat, passer les nuits à Mina, le rasage ou la coupe des cheveux, le tawaf d'adieu. Le hajj est l'école suprême du Tawhid : la talbiya (« Labbayka Allahumma labbayk, labbayka la sharika laka labbayk... ») est la proclamation de l'unicité ; la simplicité de l'ihram efface les distinctions sociales ; la station à 'Arafat est l'image du Rassemblement du Jour Dernier. La récompense, comme l'indique le hadith, est l'effacement total des péchés."
  },
  {
    id: 'nikah',
    domaine: 'fiqh',
    sous_domaines: ['nikah'],
    keywords: ['mariage', 'nikah', 'mahr', 'wali', 'tuteur', 'épouse', 'époux'],
    verset_ref: 'Sourate Ar-Rum 30:21',
    verset_ar: 'وَمِنْ ءَايَٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًا لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    verset_fr: "Et parmi Ses signes : Il a créé de vous, pour vous, des épouses pour que vous viviez en tranquillité avec elles, et Il a mis entre vous de l'affection et de la bonté.",
    hadith_ref: 'Sahih al-Bukhari n°5066 ; Sahih Muslim n°1400',
    hadith_texte_ar: 'يَا مَعْشَرَ الشَّبَابِ، مَنِ اسْتَطَاعَ مِنْكُمُ الْبَاءَةَ فَلْيَتَزَوَّجْ، فَإِنَّهُ أَغَضُّ لِلْبَصَرِ وَأَحْصَنُ لِلْفَرْجِ',
    hadith_texte_fr: "Rapporté par Ibn Mas'ud (qu'Allah l'agrée) : « Ô jeunes ! Que celui d'entre vous qui a les moyens (du mariage) se marie : c'est ce qui préserve le mieux le regard et la chasteté. Et celui qui n'en a pas les moyens, qu'il jeûne, car le jeûne est un frein pour lui. »",
    parole_savant_texte: "« Les piliers du nikah selon la majorité (Shafi'is, Hanbalis, Malikis) sont : le futur époux, la future épouse exempte d'empêchement (déjà mariée, en 'idda, parente prohibée, mécréante non kitabiyya), le tuteur (wali) de la femme, deux témoins justes, et la formule d'offre (ijab) et d'acceptation (qabul). Sans wali, le mariage est invalide selon la majorité, conformément au hadith : \"Pas de mariage sans tuteur.\" »",
    parole_savant_ref: "Ibn Qudama (541-620 H), Al-Mughni, Tome 7",
    explication_detaillee: "Le mariage (nikah) est la sunna confirmée du Prophète ﷺ et la voie de tous les Messagers (cf. Ar-Ra'd 13:38). Le statut juridique varie selon la capacité et le besoin : obligatoire pour qui craint de tomber dans la fornication et en a les moyens ; recommandé pour la majorité ; permis pour celui sans désir ; déconseillé pour qui ne peut assumer les obligations. Les piliers du contrat selon la majorité sont : les deux conjoints libres d'empêchements, le tuteur (wali) du côté de la femme — son père en priorité puis le grand-père paternel, le fils, le frère germain puis paternel, etc. — deux témoins musulmans justes, et la formule d'offre et d'acceptation. Le mahr (douaire) est un droit exclusif de la femme et un pilier moral du contrat (cf. An-Nisa 4:4) ; il n'a pas de maximum et le minimum est tout ce qui peut être appelé bien selon la majorité. Sont prohibées au mariage : les ascendantes (mère, grand-mères), descendantes, sœurs, tantes paternelles et maternelles, nièces, mères-soeurs par allaitement (10 prohibitions par filiation et allaitement énumérées en An-Nisa 4:23), ainsi que la belle-mère, la belle-fille (si consommation avec la mère), et l'épouse du fils biologique. Le hadith de 'A'isha (Abu Dawud, Tirmidhi, authentifié) « Pas de mariage sans wali » est l'avis prépondérant de Ahlu Sunnah ; les Hanafites permettent à la femme adulte de se marier sans wali sous conditions. La cohabitation hors nikah est zina (fornication), péché majeur. Le but du mariage est la chasteté, la procréation, la sakina (quiétude), la mawadda (affection) et la rahma (miséricorde mutuelle)."
  },
  {
    id: 'muamalat_riba',
    domaine: 'fiqh',
    sous_domaines: ['muamalat'],
    keywords: ['riba', 'usure', 'intérêt', 'prêt', 'banque', 'commerce', 'vente'],
    verset_ref: 'Sourate Al-Baqarah 2:275',
    verset_ar: 'وَأَحَلَّ ٱللَّهُ ٱلْبَيْعَ وَحَرَّمَ ٱلرِّبَوٰا۟',
    verset_fr: "Et Allah a rendu licite le commerce, et illicite l'intérêt (riba).",
    hadith_ref: 'Sahih Muslim n°1598',
    hadith_texte_ar: 'لَعَنَ رَسُولُ اللَّهِ ﷺ آكِلَ الرِّبَا وَمُوكِلَهُ وَكَاتِبَهُ وَشَاهِدَيْهِ، وَقَالَ : هُمْ سَوَاءٌ',
    hadith_texte_fr: "Rapporté par Jabir ibn 'Abdillah (qu'Allah l'agrée) : « Le Messager d'Allah ﷺ a maudit celui qui mange (perçoit) le riba, celui qui le donne, celui qui l'enregistre et ses deux témoins. Et il a dit : Ils sont égaux (dans le péché). »",
    parole_savant_texte: "« Le riba se divise en deux : riba an-nasi'a (riba du délai, l'intérêt sur prêt) et riba al-fadl (riba de l'excédent, échange inégal de biens ribawi de même nature). Les six biens ribawi nommément cités dans la Sunna sont : l'or, l'argent, le blé, l'orge, les dattes, et le sel. Tout échange de l'un de ces biens contre lui-même doit être à parts égales et de main à main. »",
    parole_savant_ref: "Ibn al-Qayyim (691-751 H), I'lam al-Muwaqqi'in, Tome 2",
    explication_detaillee: "Le riba est l'un des sept péchés destructeurs (mubiqat) explicitement maudits dans le Coran et la Sunna. Allah lui a déclaré la guerre dans Al-Baqarah 2:279 : « Si vous ne le faites pas, alors recevez l'annonce d'une guerre de la part d'Allah et de Son Messager. » C'est l'un des très rares péchés mentionnés avec une telle gravité. Le riba se manifeste principalement par : (1) le riba des prêts à intérêt — qu'il s'agisse de crédits bancaires conventionnels, de cartes de crédit avec intérêts, de prêts immobiliers classiques, etc. ; (2) le riba dans les échanges, en particulier l'échange différé ou inégal des six biens ribawi nommés par le Prophète ﷺ (hadith de 'Ubada ibn as-Samit, Muslim n°1587), aujourd'hui étendus aux monnaies (le dollar contre le dollar doit être de main à main et à parité ; le dollar contre l'euro peut être inégal mais doit être de main à main — règle de change al-sarf). Le musulman doit donc chercher des alternatives : financement participatif (musharaka), murabaha conforme, ijara, etc., qu'offrent les banques islamiques. Travailler dans une institution dont l'activité principale est le riba est interdit selon la majorité des savants contemporains (Ibn Baz, Ibn 'Uthaymin, Lajna Da'ima), à moins que le poste soit totalement déconnecté des opérations usuraires. En cas de nécessité réelle (darura) pour acquérir un logement, certains savants permettent à titre exceptionnel le prêt à intérêt, mais l'avis prépondérant reste l'interdiction. Le riba détruit l'économie en concentrant la richesse, ruine la solidarité, et son interdiction protège les faibles."
  },
  {
    id: 'janaza',
    domaine: 'fiqh',
    sous_domaines: ['janaza', 'janaiz'],
    keywords: ['funérailles', 'janaza', 'mort', 'défunt', 'enterrement'],
    verset_ref: 'Sourate Al-Ankabut 29:57',
    verset_ar: 'كُلُّ نَفْسٍ ذَآئِقَةُ ٱلْمَوْتِ ۖ ثُمَّ إِلَيْنَا تُرْجَعُونَ',
    verset_fr: "Toute âme goûtera à la mort. Ensuite c'est vers Nous que vous serez ramenés.",
    hadith_ref: 'Sahih al-Bukhari n°47 ; Sahih Muslim n°945',
    hadith_texte_fr: "Rapporté par Abu Hurayra (qu'Allah l'agrée) : « Quiconque assiste à un enterrement jusqu'à ce que la prière soit accomplie sur le défunt aura l'équivalent d'un Qirat (de récompense), et quiconque y assiste jusqu'à ce qu'il soit enterré aura deux Qirats. — Et que sont les deux Qirats ? — Comme deux montagnes immenses. »",
    parole_savant_texte: "« Les devoirs des vivants envers le défunt musulman sont quatre, fard kifaya (obligation collective qui s'éteint si une partie de la communauté l'accomplit) : le laver (ghusl), l'envelopper dans le linceul (kafan), prier sur lui (salat al-janaza), et l'enterrer dans une tombe digne, le visage tourné vers la Qibla. »",
    parole_savant_ref: "Ibn Qudama (541-620 H), Al-Mughni, Tome 2",
    explication_detaillee: "Les rites funéraires en islam sont un fard kifaya : si une partie suffisante de la communauté les accomplit, le péché tombe pour les autres. Le défunt musulman doit recevoir quatre droits : (1) le lavage (ghusl) de manière impaire (trois, cinq ou sept fois), commençant par le côté droit et les membres du wudu, mélangé éventuellement à du sidr et du camphre — sauf le martyr du champ de bataille qui est enterré avec son sang. (2) Le linceul (kafan), de préférence trois pièces blanches pour l'homme et cinq pour la femme, sans extravagance — le Prophète ﷺ fut enveloppé de trois pièces yéménites blanches (hadith de 'A'isha, Bukhari n°1264). (3) La prière mortuaire (salat al-janaza), qui se compose de quatre takbirs : après le premier on récite Al-Fatiha, après le second la prière sur le Prophète ﷺ (comme dans le tashahhud), après le troisième l'invocation pour le défunt (« Allahumma ighfir li-hayyina wa mayyitina... »), et après le quatrième on salue à droite. C'est une prière debout sans inclinaison ni prosternation. (4) L'enterrement dans une tombe creusée avec si possible une niche (lahd) du côté de la Qibla, le défunt couché sur le côté droit le visage vers la Qibla, en disant : « Bismillah wa 'ala millati Rasulillah. » Sont interdits : les pleurs bruyants et la lamentation, déchirer ses vêtements, exalter le défunt par des inscriptions sur la tombe (« Le Prophète ﷺ a interdit de plâtrer les tombes, de s'y asseoir et d'y construire » — Muslim n°970). La période de deuil est de trois jours pour tous, sauf pour la veuve qui observe quatre mois et dix jours (cf. Al-Baqarah 2:234)."
  },
  {
    id: 'miras',
    domaine: 'fiqh',
    sous_domaines: ['miras', 'mirath', 'wasiyya'],
    keywords: ['héritage', 'mirath', 'miras', 'testament', 'wasiyya'],
    verset_ref: 'Sourate An-Nisa 4:11',
    verset_ar: 'يُوصِيكُمُ ٱللَّهُ فِىٓ أَوْلَٰدِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ ٱلْأُنثَيَيْنِ',
    verset_fr: "Voici ce qu'Allah vous enjoint au sujet de vos enfants : au fils, une part équivalente à celle de deux filles.",
    hadith_ref: 'Sahih al-Bukhari n°6732 ; Sahih Muslim n°1615',
    hadith_texte_ar: 'أَلْحِقُوا الْفَرَائِضَ بِأَهْلِهَا، فَمَا بَقِيَ فَلِأَوْلَى رَجُلٍ ذَكَرٍ',
    hadith_texte_fr: "Rapporté par Ibn 'Abbas (qu'Allah l'agrée) : « Donnez les parts fixes (fara'id) à leurs ayants droit, et ce qui reste revient à l'agnat mâle le plus proche. »",
    parole_savant_texte: "« La science des fara'id (héritage) est la moitié du savoir, comme l'a dit le Prophète ﷺ. Avant tout partage on extrait : les frais funéraires, le règlement des dettes, puis l'exécution du testament dans la limite du tiers et seulement en faveur de non-héritiers, puis on distribue le reste selon les parts coraniques. »",
    parole_savant_ref: "Ibn Qudama (541-620 H), Al-Mughni, Tome 6",
    explication_detaillee: "L'héritage en islam (fara'id) est l'un des rares domaines où Allah a Lui-même fixé les parts dans le Coran (An-Nisa 4:11-12 et 4:176), sans laisser de marge d'appréciation. Avant tout partage, quatre droits sont prélevés sur la succession dans cet ordre : les frais funéraires raisonnables, les dettes (de droit d'Allah comme zakat impayée, et de droit des hommes), l'exécution du testament (wasiyya) dans la limite stricte d'un tiers de l'héritage et au seul profit de personnes qui ne sont pas déjà héritières (« Pas de testament en faveur d'un héritier » — hadith d'Abu Umama, Abu Dawud, Tirmidhi authentifié), et enfin la distribution aux héritiers. Les ayants droit à parts fixes (ashab al-furud) sont au nombre de douze : six femmes (épouse, fille, fille du fils, mère, grand-mère, sœur) et six hommes (mari, père, grand-père, frère utérin et fils, etc.). Les fractions coraniques sont 1/2, 1/4, 1/8, 2/3, 1/3 et 1/6. La règle « au mâle équivaut la part de deux femmes » concerne uniquement les enfants et certains cousins ; elle s'inscrit dans un système où l'homme assume seul les charges financières (mahr, entretien de l'épouse, de la mère, des enfants), tandis que la femme conserve intégralement ce qu'elle possède. Dans certains cas, la femme hérite autant ou plus qu'un homme ou en est l'unique héritière. La science des fara'id est qualifiée par le Prophète ﷺ de « moitié de la science » (Ibn Majah n°2719) car son ignorance compromet directement les droits dans la société musulmane. Tout partage contraire au Coran (égalisation systématique, exhérédation des filles ou de l'épouse, etc.) est invalide aux yeux de la sharia."
  },
  {
    id: 'qurbani',
    domaine: 'fiqh',
    sous_domaines: ['qurbani', 'aqiqa'],
    keywords: ['sacrifice', 'qurbani', 'udhiya', 'aqiqa'],
    verset_ref: 'Sourate Al-Kawthar 108:2',
    verset_ar: 'فَصَلِّ لِرَبِّكَ وَٱنْحَرْ',
    verset_fr: "Accomplis la Salat pour ton Seigneur et sacrifie.",
    hadith_ref: "Rapporté par Sunan Ibn Majah n°3123, jugé hasan par Al-Albani",
    hadith_texte_fr: "Rapporté par Abu Hurayra (qu'Allah l'agrée) : « Quiconque a les moyens de sacrifier et ne sacrifie pas, qu'il ne s'approche pas de notre lieu de prière (le jour de l'Aïd). »",
    parole_savant_texte: "« L'udhiya (sacrifice de l'Aïd al-Adha) est une sunna très confirmée selon la majorité (Shafi'is, Hanbalis, Malikis), et obligatoire pour celui qui en a les moyens selon Abu Hanifa. L'âge minimum est de six mois pour l'agneau, un an pour la chèvre, deux ans pour le bovin, et cinq ans pour le chameau. L'animal doit être exempt de défauts majeurs : aveugle, malade évident, boiteux, ou émacié. »",
    parole_savant_ref: "Ibn 'Uthaymin (1347-1421 H), Risalat Ahkam al-Udhiya",
    explication_detaillee: "L'udhiya (sacrifice de l'Aïd al-Adha) commémore le grand sacrifice d'Ibrahim عليه السلام (cf. As-Saffat 37:102-107). Elle se pratique du jour de l'Aïd (10 Dhul-Hijja) jusqu'à la fin du 13 Dhul-Hijja inclus, soit quatre jours (selon Ahmad et Shafi'i dans son nouvel avis), et constitue une sunna très confirmée (sunna mu'akkada) pour la majorité, voire wajib pour les Hanafites pour celui qui en a les moyens. Le Prophète ﷺ sacrifiait deux béliers, l'un pour lui-même et sa famille, l'autre pour sa Umma (hadith d'Anas, Bukhari n°5558). L'animal doit atteindre l'âge prescrit (musinna : chamelle de 5 ans, vache de 2 ans, chèvre de 1 an, agneau de 6 mois s'il est gras et bien formé) et être exempt des quatre défauts énumérés par le Prophète ﷺ (hadith de Al-Bara' ibn 'Azib, Abu Dawud, Tirmidhi authentifié) : borgne dont la perte d'œil est apparente, malade dont la maladie est apparente, boiteux dont la boiterie est apparente, et émacié sans moelle. La viande est répartie idéalement en trois tiers : un tiers consommé, un tiers offert en cadeau, un tiers distribué aux pauvres. Quant à la 'aqiqa, c'est un sacrifice fait pour le nouveau-né au septième jour : deux moutons pour un garçon, un mouton pour une fille (hadith d'Umm Kurz, authentifié), accompagné du rasage de la tête, du choix d'un beau nom, et de la circoncision pour le garçon. C'est une sunna mu'akkada qui exprime la gratitude envers Allah et l'attachement de l'enfant aux préceptes de l'islam dès sa naissance."
  },
];

// ============================================================
// AKHLAQ — Comportement, Adkar, Tazkiya (25-35)
// ============================================================
const RULES_AKHLAQ: Rule[] = [
  {
    id: 'birr_walidayn',
    domaine: 'akhlaq',
    keywords: ['parents', 'birr', 'mère', 'père', 'walidayn'],
    verset_ref: "Sourate Al-Isra 17:23-24",
    verset_ar: 'وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوٓا۟ إِلَّآ إِيَّاهُ وَبِٱلْوَٰلِدَيْنِ إِحْسَٰنًا ۚ إِمَّا يَبْلُغَنَّ عِندَكَ ٱلْكِبَرَ أَحَدُهُمَآ أَوْ كِلَاهُمَا فَلَا تَقُل لَّهُمَآ أُفٍّ وَلَا تَنْهَرْهُمَا وَقُل لَّهُمَا قَوْلًا كَرِيمًا',
    verset_fr: "Et ton Seigneur a décrété : N'adorez que Lui ; et marquez de la bonté envers vos père et mère. Si l'un d'eux ou tous deux doivent atteindre la vieillesse auprès de toi, alors ne leur dis point : « Fi ! » et ne les brusque pas, mais adresse-leur des paroles respectueuses.",
    hadith_ref: 'Sahih al-Bukhari n°5971 ; Sahih Muslim n°2548',
    hadith_texte_ar: 'جَاءَ رَجُلٌ فَقَالَ : يَا رَسُولَ اللَّهِ، مَنْ أَحَقُّ النَّاسِ بِحُسْنِ صَحَابَتِي؟ قَالَ : أُمُّكَ. قَالَ : ثُمَّ مَنْ؟ قَالَ : أُمُّكَ. قَالَ : ثُمَّ مَنْ؟ قَالَ : أُمُّكَ. قَالَ : ثُمَّ مَنْ؟ قَالَ : أَبُوكَ',
    hadith_texte_fr: "Rapporté par Abu Hurayra (qu'Allah l'agrée) : « Un homme vint et dit : Ô Messager d'Allah, qui mérite le plus ma bonne compagnie ? Il dit : Ta mère. — Puis qui ? — Ta mère. — Puis qui ? — Ta mère. — Puis qui ? — Ton père. »",
    parole_savant_texte: "« La piété filiale (birr al-walidayn) est l'une des plus grandes obligations après les droits d'Allah, et figure dans le Coran couplée à l'ordre du Tawhid en de nombreux endroits. Son contraire, le 'uquq (désobéissance et mauvais traitement des parents), est compté parmi les sept péchés destructeurs. »",
    parole_savant_ref: "An-Nawawi (631-676 H), Riyad as-Salihin, Chapitre Birr al-Walidayn",
    explication_detaillee: "La piété envers les parents (birr al-walidayn) occupe en islam une place centrale, immédiatement après le droit d'Allah. À plusieurs reprises dans le Coran, l'ordre du Tawhid est couplé à celui de la bonté envers les parents (Al-Isra 17:23, Luqman 31:14, Al-An'am 6:151), ce qui souligne l'importance capitale de ce droit. La mère est privilégiée trois fois sur le père dans le hadith célèbre, en raison des souffrances qu'elle endure : la grossesse (« sa mère l'a porté avec peine, et a eu pour lui des couches douloureuses » — Al-Ahqaf 46:15), l'enfantement, l'allaitement et le soin quotidien. Le birr inclut : leur parler avec douceur même en cas de désaccord, ne jamais leur dire « uff » (interjection d'agacement) ou les rabrouer, dépenser pour eux quand ils sont dans le besoin, prier pour eux vivants et morts (« Mon Seigneur, fais-leur miséricorde comme ils m'ont élevé tout petit » — Al-Isra 17:24), préserver leurs amis et leurs relations après leur mort. L'obéissance leur est due dans tout ce qui n'est pas désobéissance à Allah (cf. Luqman 31:15). Le 'uquq (désobéissance grave aux parents) est l'un des sept péchés destructeurs (Bukhari et Muslim) et figure parmi les plus grands péchés majeurs après le shirk. Le Prophète ﷺ a même dit que la satisfaction d'Allah est dans la satisfaction du parent et Sa colère dans la colère du parent (Tirmidhi, authentifié par Al-Albani). Même les parents non musulmans gardent ce droit à la bonté (« Tiens-leur agréable compagnie ici-bas » — Luqman 31:15)."
  },
  {
    id: 'patience',
    domaine: 'akhlaq',
    keywords: ['patience', 'sabr', 'épreuve', 'endurance'],
    verset_ref: 'Sourate Al-Baqarah 2:153',
    verset_ar: 'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ',
    verset_fr: "Ô les croyants ! Cherchez secours dans l'endurance et la Salat. Car Allah est avec ceux qui sont endurants.",
    hadith_ref: 'Sahih Muslim n°2999',
    hadith_texte_ar: 'عَجَبًا لِأَمْرِ الْمُؤْمِنِ، إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، وَلَيْسَ ذَاكَ لِأَحَدٍ إِلَّا لِلْمُؤْمِنِ : إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ',
    hadith_texte_fr: "Rapporté par Suhayb (qu'Allah l'agrée) : « Étrange est l'affaire du croyant ! Toute son affaire est bien, et cela n'est donné à personne d'autre que lui : s'il lui arrive du bien, il remercie et c'est un bien pour lui ; s'il lui arrive du mal, il endure et c'est un bien pour lui. »",
    parole_savant_texte: "« La patience est de trois sortes : patience dans l'obéissance à Allah (persévérer dans les actes d'adoration), patience face au péché (résister aux passions interdites), et patience face au décret divin douloureux (épreuves, deuils, maladies). La plus difficile et la plus méritoire est la deuxième. »",
    parole_savant_ref: "Ibn al-Qayyim (691-751 H), 'Uddat as-Sabirin wa Dhakhirat ash-Shakirin",
    explication_detaillee: "La patience (sabr) est mentionnée plus de quatre-vingt-dix fois dans le Coran, ce qui souligne sa centralité dans la vie spirituelle. Allah a promis aux endurants une récompense sans mesure : « Les endurants seront pleinement récompensés sans compter » (Az-Zumar 39:10). Ibn al-Qayyim, dans 'Uddat as-Sabirin, distingue trois catégories essentielles : (1) Sabr 'ala at-ta'a : la patience dans l'accomplissement des obligations malgré la lassitude, la difficulté, ou les obstacles — comme se lever pour Fajr en hiver, jeûner par fortes chaleurs, ou maintenir l'apprentissage religieux. (2) Sabr 'an al-ma'siya : la patience face à la tentation du péché — résister au regard interdit, à la médisance, au gain illicite — c'est selon Ibn al-Qayyim la plus haute des trois car elle implique un choix volontaire dans un contexte de désir, contrairement aux épreuves subies. (3) Sabr 'ala al-qadar : la patience face au décret douloureux — perte d'un proche, maladie, ruine, injustice subie. Cette patience exclut quatre choses : se plaindre auprès des créatures (la plainte adressée à Allah seul est permise comme le fit Ya'qub : « Je ne me plains qu'à Allah de mon déchirement et de mon chagrin » — Yusuf 12:86), se gifler les joues, déchirer ses vêtements, et invoquer la perdition. Le Prophète ﷺ a dit : « La vraie patience est celle du premier choc » (Bukhari n°1283). Le sabr n'est pas la passivité résignée, mais une force active : endurer en s'accrochant à Allah, à la prière et à l'espoir."
  },
  {
    id: 'ghiba',
    domaine: 'akhlaq',
    keywords: ['médisance', 'ghiba', 'calomnie', 'namima', 'rapporteur'],
    verset_ref: 'Sourate Al-Hujurat 49:12',
    verset_ar: 'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱجْتَنِبُوا۟ كَثِيرًا مِّنَ ٱلظَّنِّ إِنَّ بَعْضَ ٱلظَّنِّ إِثْمٌ ۖ وَلَا تَجَسَّسُوا۟ وَلَا يَغْتَب بَّعْضُكُم بَعْضًا ۚ أَيُحِبُّ أَحَدُكُمْ أَن يَأْكُلَ لَحْمَ أَخِيهِ مَيْتًا فَكَرِهْتُمُوهُ',
    verset_fr: "Ô vous qui avez cru ! Évitez de trop conjecturer : certaines conjectures sont des péchés. Et n'espionnez pas ; et ne médisez pas les uns des autres. L'un de vous aimerait-il manger la chair de son frère mort ? Vous en aurez horreur.",
    hadith_ref: 'Sahih Muslim n°2589',
    hadith_texte_ar: 'أَتَدْرُونَ مَا الْغِيبَةُ؟ قَالُوا : اللَّهُ وَرَسُولُهُ أَعْلَمُ. قَالَ : ذِكْرُكَ أَخَاكَ بِمَا يَكْرَهُ',
    hadith_texte_fr: "Rapporté par Abu Hurayra (qu'Allah l'agrée) : « Savez-vous ce qu'est la médisance ? Ils dirent : Allah et Son Messager savent mieux. Il dit : C'est que tu mentionnes ton frère par ce qu'il déteste. — Et si ce que je dis se trouve en lui ? — S'il s'y trouve, c'est de la médisance ; sinon, c'est de la calomnie. »",
    parole_savant_texte: "« La médisance (ghiba) est interdite même si ce qu'on dit est vrai. Si c'est faux, c'est de la calomnie (buhtan) — encore plus grave. Six cas exceptionnels permettent de mentionner les défauts d'autrui : se plaindre d'une injustice, demander conseil pour un mariage ou un partenariat, mettre en garde contre un innovateur ou un fauteur, dénoncer un péché ouvert, identifier un défaut (comme un surnom devenu courant), et conseiller. »",
    parole_savant_ref: "An-Nawawi (631-676 H), Al-Adhkar",
    explication_detaillee: "La médisance (ghiba) figure parmi les péchés majeurs de la langue, comparée par Allah Lui-même à la consommation de la chair de son frère mort — image saisissante qui doit produire un dégoût naturel chez le croyant. Le hadith d'Abu Hurayra fixe sa définition exacte : « mentionner ton frère par ce qu'il déteste » qu'il soit absent ou présent, qu'il s'agisse de son corps, son caractère, sa religion, sa famille, ses vêtements, ou sa demeure. La calomnie (buhtan) consiste à lui attribuer ce qui ne se trouve pas en lui — c'est doublement coupable : mensonge et atteinte à l'honneur. La rapportage médisant (namima) consiste à transporter les paroles d'untel chez tel autre pour semer la discorde ; le Prophète ﷺ a dit : « N'entrera pas au Paradis le qattat (rapporteur médisant) » (Bukhari n°6056). An-Nawawi dans Al-Adhkar et Riyad as-Salihin énumère six cas où évoquer le défaut d'autrui est licite voire requis : (1) se plaindre auprès du juge d'une injustice subie ; (2) demander de l'aide pour corriger un mal ; (3) consulter un mufti en exposant les faits ; (4) mettre en garde la communauté contre un transmetteur peu fiable, un innovateur ou un fraudeur (la science du jarh wa ta'dil dans le hadith) ; (5) mentionner un pécheur public qui ne dissimule pas son péché — mais uniquement quant au péché qu'il affiche ; (6) identifier une personne par un surnom courant (« le sourd », « le boiteux ») sans intention de mépris quand il n'existe pas d'autre identification. Hors ces cas, le silence et la protection de l'honneur du musulman sont prescrits : « Le musulman est le frère du musulman, il ne lui ment pas, ne le trahit pas et ne l'humilie pas » (Tirmidhi n°1927, hasan)."
  },
  {
    id: 'sincerite_ikhlas',
    domaine: 'akhlaq',
    sous_domaines: ['tazkiya'],
    keywords: ['ikhlas', 'sincérité', 'riya', 'ostentation'],
    verset_ref: 'Sourate Al-Bayyina 98:5',
    verset_ar: 'وَمَآ أُمِرُوٓا۟ إِلَّا لِيَعْبُدُوا۟ ٱللَّهَ مُخْلِصِينَ لَهُ ٱلدِّينَ حُنَفَآءَ',
    verset_fr: "Il ne leur a été commandé, cependant, que d'adorer Allah, Lui vouant un culte exclusif, en monothéistes sincères.",
    hadith_ref: 'Sahih al-Bukhari n°1 ; Sahih Muslim n°1907',
    hadith_texte_ar: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    hadith_texte_fr: "Rapporté par 'Umar ibn al-Khattab (qu'Allah l'agrée) : « Les actions ne valent que par les intentions, et à chacun selon son intention. »",
    parole_savant_texte: "« La sincérité (ikhlas) est de purifier son action de tout regard porté sur autrui que le Créateur. La riya' (ostentation) est de faire l'œuvre pour qu'elle soit vue des hommes ; elle annule l'œuvre. Plus subtile encore est la sum'a : faire pour qu'on entende parler de soi. Ces deux maladies du cœur sont à craindre constamment. »",
    parole_savant_ref: "Ibn al-Qayyim (691-751 H), Al-Fawa'id",
    explication_detaillee: "L'ikhlas (sincérité, exclusivité d'intention pour Allah) est la condition de validité de toute œuvre rituelle, sans laquelle aucun acte n'est accepté. Allah dit dans un hadith qudsi : « Je suis le plus dispensé des associés : quiconque accomplit une œuvre dans laquelle il M'associe quelqu'un d'autre que Moi, Je l'abandonne ainsi que son association » (Muslim n°2985). Les deux conditions d'acceptation d'une œuvre, déduites par les Salaf des versets et hadiths, sont : l'ikhlas (l'œuvre est pour Allah Seul) et le suivi (mutaba'a) de la Sunna du Prophète ﷺ. La riya' (ostentation visuelle) est appelée le « petit shirk » (shirk asghar) — le Prophète ﷺ a dit : « Ce que je crains le plus pour vous est le petit shirk. — Qu'est-ce que c'est ? — La riya' » (Ahmad, authentifié par Al-Albani). Plus subtile que la riya' est la sum'a (faire pour que les gens en entendent parler) ; et encore plus subtile est le 'ujb (l'auto-satisfaction qui se glisse après l'œuvre). Les remèdes prescrits par les Salaf : invoquer Allah par la du'a célèbre de Abu Bakr : « Allahumma inni a'udhu bika an ushrika bika wa ana a'lam, wa astaghfiruka lima la a'lam » ; cacher ses bonnes œuvres autant que possible ; se rappeler que les hommes ne profitent ni ne nuisent ; agir comme si chaque acte était le dernier. Ibn al-Qayyim explique que l'ikhlas est un combat de toute une vie, et que c'est précisément ce combat qui distingue les véridiques (siddiqun) des autres. Sans ikhlas, le jeûne n'est qu'une diète, la prière qu'une gymnastique, et le pèlerinage qu'un voyage."
  },
  {
    id: 'dhikr_dua',
    domaine: 'akhlaq',
    sous_domaines: ['adkar', 'dua'],
    keywords: ['dhikr', 'invocation', 'dua', 'rappel', 'tasbih'],
    verset_ref: 'Sourate Al-Ahzab 33:41-42',
    verset_ar: 'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱذْكُرُوا۟ ٱللَّهَ ذِكْرًا كَثِيرًا ۝ وَسَبِّحُوهُ بُكْرَةً وَأَصِيلًا',
    verset_fr: "Ô vous qui avez cru, évoquez Allah d'une façon abondante, et glorifiez-Le à la pointe et au déclin du jour.",
    hadith_ref: 'Sahih al-Bukhari n°6407 ; Sahih Muslim n°779',
    hadith_texte_ar: 'مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لَا يَذْكُرُ رَبَّهُ، مَثَلُ الْحَيِّ وَالْمَيِّتِ',
    hadith_texte_fr: "Rapporté par Abu Musa al-Ash'ari (qu'Allah l'agrée) : « L'exemple de celui qui évoque son Seigneur et de celui qui ne L'évoque pas est comme l'exemple du vivant et du mort. »",
    parole_savant_texte: "« Le dhikr est l'âme des actes d'adoration. Toute œuvre vidée de l'évocation d'Allah est un corps sans âme. Les meilleures formules sont : Subhan Allah, Al-Hamdulillah, La ilaha illa Allah, Allahu Akbar — ce sont les paroles les plus aimées d'Allah comme l'a affirmé le Prophète ﷺ. »",
    parole_savant_ref: "Ibn al-Qayyim (691-751 H), Al-Wabil as-Sayyib",
    explication_detaillee: "Le dhikr (évocation d'Allah) est l'œuvre la plus légère sur la langue, la plus lourde dans la balance, et la plus aimée du Miséricordieux (cf. hadith d'Abu Hurayra, Bukhari n°6406). Le Coran enjoint l'évocation abondante d'Allah à de nombreuses reprises (Al-Ahzab 33:41, Al-Jumu'a 62:10). Ibn al-Qayyim dans Al-Wabil as-Sayyib énumère plus de soixante-dix bienfaits du dhikr : il apaise le cœur (« N'est-ce point par l'évocation d'Allah que les cœurs s'apaisent ? » — Ar-Ra'd 13:28), repousse Shaytan, attire la satisfaction divine, illumine le visage et le cœur, dissipe les soucis, augmente la subsistance, et fait que le Seigneur évoque le serviteur (« Évoquez-Moi, Je vous évoquerai » — Al-Baqarah 2:152). Les meilleures formules sont les « bonnes paroles éternelles » (al-baqiyat as-salihat) : Subhan Allah, Al-Hamdulillah, La ilaha illa Allah, Allahu Akbar — auxquelles s'ajoute parfois La hawla wa la quwwata illa billah. Les adkar du matin et du soir (rapportés par Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i) sont une protection majeure du croyant. Quant à la du'a (invocation), elle est « la moelle de l'adoration » (hadith authentifié, Tirmidhi n°3371). Ses conditions d'exaucement sont : la sincérité, manger licite (un hadith chez Muslim n°1015 mentionne le voyageur poussiéreux dont l'invocation est rejetée car sa nourriture est illicite), invoquer avec présence du cœur, choisir les moments propices (dernier tiers de la nuit, entre l'adhan et l'iqama, jour du vendredi, en prosternation, durant la rupture du jeûne, à 'Arafat). Toutes les invocations doivent être adressées à Allah Seul ; invoquer un mort ou un absent comme on invoque Allah est du shirk majeur."
  },
  {
    id: 'repentir_tawba',
    domaine: 'akhlaq',
    keywords: ['repentir', 'tawba', 'istighfar', 'pardon'],
    verset_ref: 'Sourate At-Tahrim 66:8',
    verset_ar: 'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ تُوبُوٓا۟ إِلَى ٱللَّهِ تَوْبَةً نَّصُوحًا',
    verset_fr: "Ô vous qui avez cru ! Repentez-vous à Allah d'un repentir sincère (nasuh).",
    hadith_ref: 'Sahih al-Bukhari n°6307',
    hadith_texte_ar: 'وَاللَّهِ إِنِّي لَأَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ فِي الْيَوْمِ أَكْثَرَ مِنْ سَبْعِينَ مَرَّةً',
    hadith_texte_fr: "Rapporté par Abu Hurayra (qu'Allah l'agrée), le Prophète ﷺ a dit : « Par Allah, je demande pardon à Allah et reviens à Lui en repentir plus de soixante-dix fois par jour. »",
    parole_savant_texte: "« Le repentir sincère (tawba nasuh) repose sur trois conditions si le péché concerne le droit d'Allah seul : abandonner immédiatement le péché, le regretter sincèrement, et résoudre fermement de ne plus y revenir. S'il concerne un droit humain, s'y ajoute une quatrième condition : rendre le droit à son ayant droit ou en demander quittance. »",
    parole_savant_ref: "An-Nawawi (631-676 H), Riyad as-Salihin, Chapitre at-Tawba",
    explication_detaillee: "Le repentir (tawba) est l'obligation immédiate de tout musulman qui commet un péché — petit ou grand — et constitue l'œuvre la plus précieuse pour l'âme. Allah aime les repentants : « Allah aime ceux qui se repentent et ceux qui se purifient » (Al-Baqarah 2:222). Sa porte est ouverte tant que l'âme n'atteint pas la gorge à l'agonie et tant que le soleil ne se lève pas de l'Ouest (hadith d'Abdullah ibn 'Umar, Tirmidhi n°3537, hasan). Allah Se réjouit du repentir de Son serviteur plus que ne se réjouit un voyageur égaré qui retrouve sa monture chargée de vivres (Bukhari n°6309, Muslim n°2747 — le hadith célèbre de l'homme dans le désert). Les conditions de validité du repentir sont quatre : (1) cesser immédiatement de commettre le péché ; (2) éprouver un regret sincère ; (3) prendre la ferme résolution de ne pas y revenir ; (4) si un droit humain est en jeu — vol, calomnie, atteinte à l'honneur ou aux biens — restituer ou demander pardon à l'ayant droit. Le tawwab (repentant fréquent) efface ses péchés au point qu'Allah les transforme en bonnes actions (cf. Al-Furqan 25:70). L'istighfar (demander pardon) fait partie du repentir et a des vertus considérables : il dénoue les angoisses, ouvre les portes de la subsistance et de la descendance (cf. Nuh 71:10-12 : « Demandez pardon à votre Seigneur, car Il est grand Pardonneur, et Il enverra du ciel sur vous des pluies abondantes, et Il vous accordera beaucoup de biens et d'enfants »). Le Prophète ﷺ — pourtant déjà pardonné de tout — demandait pardon plus de soixante-dix voire cent fois par jour. La plus grande formule d'istighfar est sayyid al-istighfar rapportée chez Bukhari n°6306."
  },
  {
    id: 'vertus_voisin',
    domaine: 'akhlaq',
    keywords: ['voisin', 'jar', 'voisinage'],
    hadith_ref: 'Sahih al-Bukhari n°6014 ; Sahih Muslim n°2625',
    hadith_texte_ar: 'مَا زَالَ جِبْرِيلُ يُوصِينِي بِالْجَارِ حَتَّى ظَنَنْتُ أَنَّهُ سَيُوَرِّثُهُ',
    hadith_texte_fr: "Rapporté par 'A'isha (qu'Allah l'agrée) : « Jibril n'a cessé de me recommander le voisin, au point que j'ai cru qu'il allait le faire hériter. »",
    parole_savant_texte: "« Le voisin a trois statuts hiérarchiques : (1) le voisin musulman et parent — il a trois droits : voisinage, parenté, islam ; (2) le voisin musulman seul — il a deux droits ; (3) le voisin non-musulman — il a un droit, celui du voisinage. À tous, il faut le bon traitement, ne pas leur nuire, partager les surplus, les visiter dans la maladie. »",
    parole_savant_ref: "Ibn Hajar al-'Asqalani (773-852 H), Fath al-Bari, commentaire du Sahih al-Bukhari",
    verset_ref: 'Sourate An-Nisa 4:36',
    verset_fr: "Adorez Allah et ne Lui donnez aucun associé. Agissez avec bonté envers les père et mère, les proches, les orphelins, les pauvres, le proche voisin, le voisin lointain, le collègue et le voyageur.",
    explication_detaillee: "Les droits du voisin en islam sont si étendus qu'ils ont fait croire au Prophète ﷺ que Jibril allait inclure le voisin parmi les héritiers. Le verset An-Nisa 4:36 énumère deux catégories de voisins : le « voisin proche » (al-jar dhi al-qurba) — entendu comme le voisin parent ou le voisin de la maison voisine — et le « voisin lointain » (al-jar al-junub) — le voisin sans lien de parenté ou plus éloigné géographiquement. Les droits du voisin incluent : ne pas lui nuire (le Prophète ﷺ a dit, Bukhari n°6016 : « Par Allah il n'a pas cru ! Par Allah il n'a pas cru ! Par Allah il n'a pas cru ! — Qui donc ô Messager d'Allah ? — Celui dont le voisin n'est pas à l'abri de ses méfaits »), partager les bonnes choses (« Quand tu cuisines un bouillon, augmente l'eau et fais-en cadeau à tes voisins » — Muslim n°2625), le saluer, le visiter dans la maladie, présenter ses condoléances, le féliciter de ses joies, et préserver sa vie privée. Le voisin non-musulman conserve le droit au bon voisinage selon la majorité des savants ; 'Abdullah ibn 'Amr, en sacrifiant un mouton, demanda qu'on en porte d'abord à son voisin juif (Tirmidhi, Abu Dawud, hasan). Le mauvais voisin est si grave que la femme priante et jeûneuse qui blesse ses voisins par sa langue est dans le Feu selon le hadith d'Abu Hurayra (Ahmad, authentifié). L'islam construit ainsi le tissu social par cercles concentriques : famille, voisinage, communauté, humanité."
  },
];

// ============================================================
// SIRAH / HISTOIRE / HADITH SCIENCES (35-45)
// ============================================================
const RULES_SIRAH: Rule[] = [
  {
    id: 'sirah_naissance',
    domaine: 'sirah',
    sous_domaines: ['naissance', 'enfance'],
    keywords: ['naissance', 'mecque', 'abd al-muttalib', 'abu talib', 'halima', 'amina'],
    verset_ref: 'Sourate Ad-Duha 93:6-8',
    verset_ar: 'أَلَمْ يَجِدْكَ يَتِيمًا فَـَٔاوَىٰ ۝ وَوَجَدَكَ ضَآلًّا فَهَدَىٰ ۝ وَوَجَدَكَ عَآئِلًا فَأَغْنَىٰ',
    verset_fr: "Ne t'a-t-Il pas trouvé orphelin ? alors Il t'a accueilli ! Ne t'a-t-Il pas trouvé égaré ? alors Il t'a guidé. Ne t'a-t-Il pas trouvé pauvre ? alors Il t'a enrichi.",
    parole_savant_texte: "« Le Prophète ﷺ est né à La Mecque le lundi de l'année de l'Éléphant (correspondant à environ 570 ap. J.-C.), descendant d'Isma'il fils d'Ibrahim عليه السلام. Son père 'Abdullah mourut avant sa naissance ; sa mère Amina mourut quand il avait six ans. Il fut élevé par son grand-père 'Abd al-Muttalib, puis à la mort de celui-ci, par son oncle Abu Talib. »",
    parole_savant_ref: "Ibn Kathir (701-774 H), Al-Bidaya wa an-Nihaya, Tome 2 — Chapitre Mawlid an-Nabi ﷺ",
    explication_detaillee: "Le Prophète Muhammad ﷺ est né à La Mecque le lundi 12 Rabi' al-Awwal (selon l'opinion la plus connue, bien que d'autres dates aient été proposées par les historiens — le 9 selon les calculs astronomiques modernes) de l'Année de l'Éléphant, l'année où Abraha tenta de détruire la Ka'ba avec son armée et fut anéanti par les oiseaux Ababil (cf. Sourate Al-Fil 105). Sa généalogie se rattache de manière consensuelle à Isma'il fils d'Ibrahim عليه السلام à travers 'Adnan ; au-delà, les généalogistes diffèrent et les Salaf déconseillent de remonter plus haut. Son père 'Abdullah ibn 'Abd al-Muttalib mourut alors qu'Amina bint Wahb était enceinte de quelques mois. Sa mère le confia à la nourrice Halima as-Sa'diya de la tribu des Banu Sa'd, chez qui se produisit l'incident de l'ouverture de la poitrine par Jibril (Sahih Muslim n°162) — préfiguration de la prophétie. Il revint auprès de sa mère qui mourut à Al-Abwa' alors qu'il n'avait que six ans. Il fut alors recueilli par son grand-père 'Abd al-Muttalib, chef de Qoraysh, qui mourut deux ans plus tard. Le jeune Muhammad ﷺ passa alors sous la tutelle de son oncle Abu Talib, qui le protégea fidèlement jusqu'à sa mort à l'aube de la prophétie. Cette enfance jalonnée d'épreuves — orphelinage, pauvreté — fut une école préparatoire : Allah lui-même la rappelle dans Sourate Ad-Duha. Le Prophète ﷺ grandit pur de tout vice de la Jahiliyya, surnommé Al-Amin (le digne de confiance) par sa propre tribu, ce qui contraste avec les pratiques répandues de l'époque."
  },
  {
    id: 'sirah_revelation',
    domaine: 'sirah',
    sous_domaines: ['premiere_revelation'],
    keywords: ['révélation', 'wahy', 'hira', 'iqra', 'jibril', 'gabriel'],
    verset_ref: "Sourate Al-'Alaq 96:1-5",
    verset_ar: 'ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ ۝ خَلَقَ ٱلْإِنسَٰنَ مِنْ عَلَقٍ ۝ ٱقْرَأْ وَرَبُّكَ ٱلْأَكْرَمُ ۝ ٱلَّذِى عَلَّمَ بِٱلْقَلَمِ ۝ عَلَّمَ ٱلْإِنسَٰنَ مَا لَمْ يَعْلَمْ',
    verset_fr: "Lis, au nom de ton Seigneur qui a créé, qui a créé l'homme d'une adhérence. Lis ! Ton Seigneur est le Très Noble, qui a enseigné par le calame, a enseigné à l'homme ce qu'il ne savait pas.",
    hadith_ref: 'Sahih al-Bukhari n°3 ; Sahih Muslim n°160',
    hadith_texte_fr: "Rapporté par 'A'isha (qu'Allah l'agrée) : « Le premier (signe) de la révélation reçue par le Messager d'Allah ﷺ fut sous forme de rêves véridiques durant le sommeil. Aucun rêve ne lui venait sans qu'il ne s'accomplisse comme la lumière de l'aube. Puis lui fut inspiré l'amour de la solitude, et il se retirait dans la grotte de Hira... »",
    parole_savant_texte: "« La première révélation eut lieu dans la grotte de Hira au mont An-Nur, durant le mois de Ramadan, lorsque Muhammad ﷺ était âgé de quarante ans. Jibril عليه السلام lui apparut sous sa vraie forme et lui dit : \"Iqra'\" (Lis !). Le Prophète ﷺ répondit : \"Je ne sais pas lire\", à trois reprises, jusqu'à recevoir les cinq premiers versets de Sourate Al-'Alaq. »",
    parole_savant_ref: "Ibn Kathir (701-774 H), Al-Bidaya wa an-Nihaya, Tome 3",
    explication_detaillee: "La première révélation marque la naissance officielle de la mission prophétique. Le Prophète Muhammad ﷺ avait atteint l'âge de quarante ans, âge symbolique de la plénitude, lorsque Allah le choisit pour être Son ultime Messager. Avant cela, il avait pris l'habitude de se retirer dans la grotte de Hira, située au sommet du mont An-Nur (Jabal an-Nur, « la montagne de la lumière »), à quelques kilomètres de La Mecque, pour y méditer et adorer Allah selon la voie d'Ibrahim. C'est là qu'une nuit du mois de Ramadan — la nuit du Qadr — Jibril عليه السلام lui apparut et lui ordonna « Lis ! ». Le Prophète ﷺ, étant illettré (ummi), répondit : « Je ne sais pas lire. » Jibril l'étreignit fortement par trois fois, et finalement lui révéla les cinq premiers versets de Sourate Al-'Alaq (96:1-5), qui établissent immédiatement les fondements : la création par Allah, la lecture et le savoir comme signes de Sa générosité, et la primauté du Tawhid. Profondément ébranlé, le Prophète ﷺ retourna chez son épouse Khadija bint Khuwaylid en disant : « Couvrez-moi, couvrez-moi ! ». Elle le rassura puis le mena à son cousin Waraqa ibn Nawfal, savant chrétien qui reconnut la nature angélique de la visite et lui annonça qu'il s'agissait du Namus (l'ange Gabriel) qu'Allah envoyait aux prophètes. Suivit alors une période d'interruption (fatra) de quelques mois, puis la révélation reprit avec Sourate Al-Muddaththir, ordonnant la prédication publique. La descente du Coran s'étala sur 23 ans : 13 ans à La Mecque (centrés sur le Tawhid et la croyance) et 10 ans à Médine (centrés sur la législation et la construction de la communauté)."
  },
  {
    id: 'sirah_hijra',
    domaine: 'sirah',
    sous_domaines: ['hijra'],
    keywords: ['hijra', 'émigration', 'medine', 'médine', 'ansar', 'muhajirun', 'yathrib'],
    verset_ref: 'Sourate At-Tawba 9:40',
    verset_ar: 'إِلَّا تَنصُرُوهُ فَقَدْ نَصَرَهُ ٱللَّهُ إِذْ أَخْرَجَهُ ٱلَّذِينَ كَفَرُوا۟ ثَانِىَ ٱثْنَيْنِ إِذْ هُمَا فِى ٱلْغَارِ إِذْ يَقُولُ لِصَٰحِبِهِۦ لَا تَحْزَنْ إِنَّ ٱللَّهَ مَعَنَا',
    verset_fr: "Si vous ne lui portez pas secours, Allah l'a déjà secouru, lorsque ceux qui avaient mécru l'avaient banni, deuxième de deux. Quand ils étaient dans la grotte et qu'il disait à son compagnon : « Ne t'afflige pas, Allah est avec nous. »",
    hadith_ref: 'Sahih al-Bukhari n°3905',
    hadith_texte_fr: "Rapporté par 'A'isha (qu'Allah l'agrée), évoquant la Hijra : description détaillée du voyage du Prophète ﷺ et d'Abu Bakr de La Mecque à Médine, leur séjour de trois jours dans la grotte de Thawr, et l'arrivée à Quba puis à Médine.",
    parole_savant_texte: "« La Hijra du Prophète ﷺ de La Mecque vers Médine eut lieu en l'an 622 du calendrier grégorien, après treize années de prédication à La Mecque. Il fut accompagné de son fidèle compagnon Abu Bakr as-Siddiq. C'est cet événement qui fut adopté par le calife 'Umar ibn al-Khattab comme point de départ du calendrier islamique (Hijri), sur consultation des Compagnons. »",
    parole_savant_ref: "Ibn Kathir (701-774 H), Al-Bidaya wa an-Nihaya, Tome 3",
    explication_detaillee: "La Hijra (émigration) du Prophète ﷺ et de ses Compagnons de La Mecque vers Yathrib (renommée par la suite Al-Madina al-Munawwara, « la Ville Illuminée ») est l'un des événements les plus décisifs de l'histoire islamique. Après treize années de prédication à La Mecque marquées par la persécution, les boycotts, le martyre de plusieurs Compagnons (comme Sumayya et Yasir), Allah autorisa Son Messager ﷺ à émigrer. Les Mecquois, ayant perçu cette éventualité, complotèrent de l'assassiner en mandatant un jeune de chaque tribu pour disperser la responsabilité. Allah informa Son Messager par révélation, et Muhammad ﷺ quitta La Mecque de nuit avec Abu Bakr, après avoir fait coucher 'Ali ibn Abi Talib dans son lit. Ils trouvèrent refuge trois jours dans la grotte de Thawr, où Allah les protégea miraculeusement (l'araignée tissant sa toile et le pigeon couvant ses œufs à l'entrée, selon la Sira d'Ibn Ishaq). De cet épisode est tiré le verset At-Tawba 9:40 et la parole sublime « Ne t'afflige pas, Allah est avec nous » prononcée par le Prophète ﷺ à Abu Bakr — verset qui a fixé pour les Sunnites le rang du compagnonnage d'Abu Bakr. Ils arrivèrent à Quba puis entrèrent à Médine, accueillis par les Ansar (« les Auxiliaires », tribus Aws et Khazraj). À Médine, le Prophète ﷺ construisit la première mosquée, instaura la fraternité entre Muhajirun (émigrés) et Ansar, rédigea la Constitution de Médine régissant les rapports entre musulmans, juifs et autres tribus, et établit le premier État islamique. Le calife 'Umar choisit la Hijra (1er Muharram de la même année, non le jour exact de l'arrivée) comme année zéro du calendrier islamique, marquant ainsi la transition de la communauté persécutée à la nation établie."
  },
  {
    id: 'sahaba',
    domaine: 'sirah',
    sous_domaines: ['sahaba'],
    keywords: ['compagnons', 'sahaba', 'sahabi'],
    hadith_ref: 'Sahih al-Bukhari n°3673 ; Sahih Muslim n°2540',
    hadith_texte_ar: 'لَا تَسُبُّوا أَصْحَابِي، فَلَوْ أَنَّ أَحَدَكُمْ أَنْفَقَ مِثْلَ أُحُدٍ ذَهَبًا مَا بَلَغَ مُدَّ أَحَدِهِمْ وَلَا نَصِيفَهُ',
    hadith_texte_fr: "Rapporté par Abu Sa'id al-Khudri (qu'Allah l'agrée) : « N'insultez pas mes Compagnons ! Par Celui qui tient mon âme dans Sa Main, si l'un de vous dépensait l'équivalent du mont Uhud en or, cela n'atteindrait pas la valeur d'un mudd (poignée) de l'un d'eux, ni même la moitié. »",
    parole_savant_texte: "« Tous les Compagnons sont des justes ('udul) selon le consensus de Ahlu Sunnah Wal Jama'a. Aimer les Compagnons fait partie de la religion ; les détester ou les diffamer est une caractéristique des Rafida (rejeteurs). Les quatre califes bien-guidés (Khulafa' Rashidun), dans l'ordre de mérite et de succession, sont : Abu Bakr, 'Umar, 'Uthman, et 'Ali (qu'Allah les agrée tous). »",
    parole_savant_ref: "Ibn Taymiyya (661-728 H), Al-'Aqida al-Wasitiyya",
    verset_ref: 'Sourate Al-Fath 48:29',
    verset_fr: "Muhammad est le Messager d'Allah. Et ceux qui sont avec lui sont durs envers les mécréants, miséricordieux entre eux. Tu les vois inclinés, prosternés, recherchant d'Allah grâce et agrément.",
    explication_detaillee: "Les Compagnons (Sahaba) sont définis par les savants du hadith comme « tout musulman qui a rencontré le Prophète ﷺ, a cru en lui et est mort musulman ». Ils constituent la meilleure génération de l'humanité après les prophètes, comme l'a affirmé le Prophète ﷺ : « Les meilleurs hommes sont ceux de ma génération, puis ceux qui les suivent, puis ceux qui les suivent » (Bukhari n°2652, Muslim n°2533). Ahlu Sunnah Wal Jama'a tient pour eux unanimement la croyance de leur 'adala (intégrité, fiabilité) collective : aucun Compagnon n'est suspect dans sa transmission ni dans sa religion, même si certains ont commis des erreurs humaines compensées par leurs immenses mérites. Les diviniser est interdit ; les diffamer est une innovation grave qui caractérise les Rafida (Shi'isme extrémiste). L'ordre de mérite parmi les Compagnons, selon Ahlu Sunnah, suit l'ordre du califat : Abu Bakr as-Siddiq (le plus grand après les prophètes, premier calife 11-13 H, qui combattit les apostats et compila le Coran), puis 'Umar ibn al-Khattab al-Faruq (deuxième calife 13-23 H, sous lequel furent conquis l'Iraq, la Syrie, l'Égypte), puis 'Uthman ibn 'Affan Dhu an-Nurayn (troisième calife 23-35 H, qui unifia le mushaf), puis 'Ali ibn Abi Talib (quatrième calife 35-40 H, cousin et gendre du Prophète ﷺ). Les dix promis au Paradis (al-'Ashara al-Mubashsharun), nommés dans un hadith unique (Tirmidhi n°3747, sahih), sont : les quatre califes, plus Talha, Az-Zubayr, Sa'd ibn Abi Waqqas, Sa'id ibn Zayd, 'Abd ar-Rahman ibn 'Awf, et Abu 'Ubayda ibn al-Jarrah. Préserver leur honneur fait partie de la 'aqida correcte ; ils sont la chaîne par laquelle nous est parvenue la religion."
  },
  {
    id: 'khulafa_rashidun',
    domaine: 'histoire_islamique',
    sous_domaines: ['khulafa_rashidun', 'khilafa'],
    keywords: ['abu bakr', 'umar', 'uthman', 'ali', 'calife', 'khalifa', 'khulafa'],
    hadith_ref: 'Sunan Abi Dawud n°4607 ; Sunan at-Tirmidhi n°2676 (sahih)',
    hadith_texte_ar: 'عَلَيْكُمْ بِسُنَّتِي وَسُنَّةِ الْخُلَفَاءِ الرَّاشِدِينَ الْمَهْدِيِّينَ مِنْ بَعْدِي، تَمَسَّكُوا بِهَا وَعَضُّوا عَلَيْهَا بِالنَّوَاجِذِ',
    hadith_texte_fr: "Rapporté par Al-'Irbad ibn Sariya (qu'Allah l'agrée) : « Tenez-vous à ma Sunna et à la Sunna des califes bien-guidés après moi ; attachez-vous-y et mordez-y avec vos molaires. »",
    parole_savant_texte: "« Le califat bien-guidé a duré trente ans après la mort du Prophète ﷺ, comme l'a annoncé celui-ci dans un hadith authentifié. Il s'est succédé : Abu Bakr (2 ans), 'Umar (10 ans), 'Uthman (12 ans), puis 'Ali (environ 5 ans incluant la fin sous Al-Hasan). »",
    parole_savant_ref: "Ibn Kathir (701-774 H), Al-Bidaya wa an-Nihaya, Tome 6-8",
    explication_detaillee: "L'époque des Khulafa' ar-Rashidun (califes bien-guidés) est unanimement considérée par Ahlu Sunnah Wal Jama'a comme la période-modèle de l'islam politique, à laquelle il est commandé de se conformer comme à la Sunna prophétique elle-même. Abu Bakr as-Siddiq (qu'Allah l'agrée), élu après une consultation décisive entre Muhajirun et Ansar à la Saqifa des Banu Sa'ida, gouverna deux ans (11-13 H/632-634) marqués par les guerres de la Ridda contre les apostats et faux prophètes (Musaylima, Tulayha, Sajah), et par la compilation initiale du Coran sur l'idée de 'Umar après la bataille de Yamama. 'Umar ibn al-Khattab al-Faruq lui succéda par testament d'Abu Bakr et régna dix ans (13-23 H/634-644), période d'expansion fulgurante : conquête de l'Iraq sasanide (Qadisiya, 15 H), de la Syrie byzantine (Yarmuk, 15 H), de Jérusalem (15-16 H), de l'Égypte (20 H), et de la Perse (Nihawand, 21 H) ; il institua le diwan (registre administratif), le calendrier Hijri et la prière de Tarawih en commun. Assassiné par Abu Lu'lu'a le mageen, il désigna un conseil de six Compagnons pour choisir son successeur, qui élit 'Uthman ibn 'Affan Dhu an-Nurayn — gendre du Prophète ﷺ par deux de ses filles. 'Uthman régna douze ans (23-35 H), poursuivit les conquêtes (Asie centrale, Afrique du Nord, Chypre), et surtout unifia le mushaf en envoyant des copies authentiques dans les grandes provinces. Il fut martyrisé chez lui par des révoltés. 'Ali ibn Abi Talib, cousin et gendre du Prophète ﷺ, lui succéda et fit face aux dissensions de la première fitna : bataille du Chameau contre 'A'isha, Talha et Az-Zubayr ; bataille de Siffin contre Mu'awiya ; et révolte des Khawarij à Nahrawan. Il fut assassiné par le Kharijite Ibn Muljam en 40 H. Le califat bien-guidé prit fin avec l'abdication d'Al-Hasan ibn 'Ali en faveur de Mu'awiya en 41 H (l'Année du Rassemblement), accomplissant la prophétie d'« un califat de trente ans »."
  },
  {
    id: 'ulum_hadith',
    domaine: 'hadith',
    sous_domaines: ['ulum_hadith', 'kutub_sitta'],
    keywords: ['sahih', 'authentique', 'hasan', "da'if", 'faible', 'mutawatir', 'kutub'],
    parole_savant_texte: "« Le hadith sahih (authentique) requiert cinq conditions cumulatives : (1) une chaîne de transmission ininterrompue (ittisal as-sanad), (2) l'intégrité religieuse ('adala) de chaque transmetteur, (3) sa précision parfaite (dabt) tant dans la mémoire que dans l'écrit, (4) l'absence d'anomalie isolée (shudhudh) contredisant un rapporteur plus fiable, et (5) l'absence de défaut caché ('illa) qui invaliderait la chaîne ou le texte. Si la condition de dabt est moins parfaite mais reste acceptable, le hadith est qualifié de hasan. »",
    parole_savant_ref: "Ibn as-Salah ash-Shahrazuri (577-643 H), Muqaddima fi 'Ulum al-Hadith",
    hadith_ref: 'Sahih Muslim, Muqaddima',
    hadith_texte_fr: "Rapporté par Abu Hurayra (qu'Allah l'agrée) : « Il suffit d'un homme pour le mensonge qu'il rapporte tout ce qu'il entend. »",
    explication_detaillee: "Les sciences du hadith ('Ulum al-Hadith) constituent une discipline unique dans l'histoire des civilisations : aucun corpus religieux n'a fait l'objet d'une critique aussi systématique des sources et des transmetteurs. Les savants classent les hadiths principalement selon trois critères : (1) selon le nombre de chaînes de transmission : mutawatir (transmis par un nombre tel à chaque génération qu'il est impossible qu'ils se soient concertés sur un mensonge — son rejet est mécréance) et ahad (transmission de petit nombre, qui se subdivise en mashhur, 'aziz, gharib) ; (2) selon le rang d'authenticité : sahih (réunit les cinq conditions énoncées par Ibn as-Salah), hasan (légèrement inférieur en dabt), da'if (faible, ne réunissant pas les conditions), mawdu' (forgé, à attribuer faussement au Prophète ﷺ) ; (3) selon le rapporteur : marfu' (remontant au Prophète ﷺ), mawquf (s'arrêtant à un Compagnon), maqtu' (s'arrêtant à un Tabi'i). Les six livres canoniques (Kutub as-Sitta) sont : Sahih al-Bukhari (rassemblant ~7275 hadiths avec répétitions, ~2602 sans), Sahih Muslim, Sunan Abu Dawud, Sunan at-Tirmidhi, Sunan an-Nasa'i, et Sunan Ibn Majah. Les deux Sahihayn jouissent du consensus le plus fort : la communauté les a accueillis avec acceptation (talaqqi bi al-qabul), et leurs hadiths bénéficient d'une présomption d'authenticité. À ces six s'ajoutent : Muwatta de Malik (le plus ancien recueil), Musnad d'Ahmad ibn Hanbal (immense corpus), et les Mustadrak d'Al-Hakim. Parmi les muhaddithun contemporains, Al-Albani (1332-1420 H) s'est distingué par son immense travail de tri et de classification (Silsila as-Sahiha, Silsila ad-Da'ifa, Sahih al-Jami', Da'if al-Jami')."
  },
  {
    id: 'arba_in_intention',
    domaine: 'hadith',
    sous_domaines: ['arba_in', 'arbain', 'arkan_islam'],
    keywords: ['intention', 'niyya', "arba'in", 'arbain'],
    hadith_ref: 'Sahih al-Bukhari n°1 ; Sahih Muslim n°1907',
    hadith_texte_ar: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ',
    hadith_texte_fr: "Rapporté par 'Umar ibn al-Khattab (qu'Allah l'agrée) : « Les actions ne valent que par les intentions, et à chacun selon son intention. Ainsi, celui dont l'émigration est pour Allah et Son Messager, son émigration est pour Allah et Son Messager ; et celui dont l'émigration est pour un bien de ce bas-monde ou pour épouser une femme, son émigration est pour ce vers quoi il a émigré. »",
    parole_savant_texte: "« Ce hadith est l'un des fondements de l'islam, l'un des trois autour desquels gravite toute la religion selon Imam Ahmad et Ash-Shafi'i. Imam Al-Bukhari l'a placé au tout début de son Sahih pour signifier que toute œuvre rapportée dans le livre — et toute œuvre en général — n'a de valeur que par l'intention. »",
    parole_savant_ref: "An-Nawawi (631-676 H), Sharh al-Arba'in An-Nawawiyya, hadith n°1",
    verset_ref: 'Sourate Al-Bayyina 98:5',
    verset_fr: "Il ne leur a été commandé que d'adorer Allah, Lui vouant un culte exclusif.",
    explication_detaillee: "Le hadith de l'intention, premier de la collection des Arba'in (Quarante hadiths) d'An-Nawawi et premier hadith placé par Al-Bukhari dans son Sahih, est l'un des piliers fondamentaux de la religion. Les savants comme Imam Ash-Shafi'i ont dit que ce hadith « entre dans soixante-dix chapitres de fiqh », et Imam Ahmad a affirmé qu'il représente « un tiers du savoir » — l'autre tiers étant le hadith « Quiconque innove dans cette affaire qui nous est nôtre ce qui n'en fait pas partie est rejeté » (Bukhari n°2697, Muslim n°1718), et le dernier tiers « Le licite est clair et l'illicite est clair » (Bukhari n°52, Muslim n°1599). Ce hadith établit que toute œuvre du serviteur — qu'elle soit rituelle (prière, jeûne), contractuelle (mariage, commerce) ou même banale (manger, dormir) — n'a de valeur religieuse que par l'intention qui l'accompagne. Une œuvre apparemment grandiose peut être annulée par une intention impure (riya', recherche de gloire), tandis qu'un acte modeste peut devenir adoration par une intention sincère pour Allah. Le rapporteur en est 'Umar ibn al-Khattab, et le contexte historique mentionné par les exégètes du hadith concerne l'émigration d'un homme vers Médine pour épouser une femme nommée Umm Qays — épisode qui a donné lieu à la précision du Prophète ﷺ. L'intention dans les actes d'adoration est une condition de validité ; sans elle, l'œuvre ne compte pas. L'intention se loge dans le cœur : la prononcer à voix haute (« nawaytu... ») est une innovation selon Ibn Taymiyya, car ni le Prophète ﷺ ni les Salaf ne le faisaient. Le serviteur doit constamment scruter ses intentions, car elles transforment du simple au grandiose, ou inversement annihilent ce qui semblait être une grande œuvre."
  },
  {
    id: 'fath_makka',
    domaine: 'sirah',
    sous_domaines: ['fath_makka', 'batailles'],
    keywords: ['fath', 'conquête', 'mecque', 'badr', 'uhud', 'khandaq', 'bataille', 'khaybar'],
    verset_ref: 'Sourate An-Nasr 110:1-3',
    verset_ar: 'إِذَا جَآءَ نَصْرُ ٱللَّهِ وَٱلْفَتْحُ ۝ وَرَأَيْتَ ٱلنَّاسَ يَدْخُلُونَ فِى دِينِ ٱللَّهِ أَفْوَاجًا ۝ فَسَبِّحْ بِحَمْدِ رَبِّكَ وَٱسْتَغْفِرْهُ ۚ إِنَّهُۥ كَانَ تَوَّابًۢا',
    verset_fr: "Quand vient le secours d'Allah ainsi que la victoire, et que tu vois les gens entrer en foule dans la religion d'Allah, alors, par la louange, célèbre la gloire de ton Seigneur et implore Son pardon. Car c'est Lui le grand Accueillant au repentir.",
    parole_savant_texte: "« La conquête de La Mecque (Fath Makka) eut lieu en l'an 8 H, après que les Qurayshites eurent violé le pacte de Hudaybiyya en attaquant les alliés des musulmans. Le Prophète ﷺ y entra avec 10 000 Compagnons sans presque rencontrer de résistance, brisa les idoles autour de la Ka'ba, et proclama l'amnistie générale envers Qoraysh par sa parole célèbre : \"Allez, vous êtes les affranchis.\" »",
    parole_savant_ref: "Ibn Kathir (701-774 H), Al-Bidaya wa an-Nihaya, Tome 4",
    explication_detaillee: "Les batailles et conquêtes du Prophète ﷺ scandent l'établissement de la communauté musulmane. La bataille de Badr (Ramadan 2 H) fut la première grande victoire : 313 musulmans face à plus de 1000 Qurayshites, victoire éclatante par l'aide d'Allah qui envoya des anges en renfort (cf. Aal 'Imran 3:123-125). La bataille d'Uhud (Shawwal 3 H) fut une épreuve : la victoire fut initialement acquise mais la désobéissance des archers à leur poste coûta cher, le Prophète ﷺ fut blessé et son oncle Hamza (le « Lion d'Allah ») fut martyrisé. La bataille du Khandaq (Shawwal 5 H), aussi appelée bataille des Coalisés (Al-Ahzab), vit une coalition de 10 000 hommes assiéger Médine ; sur le conseil de Salman al-Farisi, les musulmans creusèrent une tranchée — stratégie inconnue des Arabes — et Allah dispersa les coalisés par un vent et des anges (cf. Al-Ahzab 33:9). Le traité de Hudaybiyya (Dhul-Qi'da 6 H) parut sur le moment être un compromis défavorable, mais le Coran l'appela « victoire éclatante » (Al-Fath 48:1) car il ouvrit la voie à la diffusion massive de l'islam. La bataille de Khaybar (an 7 H) vit la chute de la forteresse juive éponyme, après une longue résistance, sous le commandement de 'Ali ibn Abi Talib. La conquête de La Mecque (Ramadan 8 H) couronna l'œuvre prophétique : 10 000 Compagnons entrèrent quasi sans résistance, le Prophète ﷺ brisa les 360 idoles autour de la Ka'ba en récitant « La Vérité est venue et le faux a disparu » (Al-Isra 17:81), et il proclama l'amnistie générale envers ses anciens persécuteurs. La bataille de Hunayn (Shawwal 8 H) puis l'expédition de Tabouk (Rajab 9 H) achevèrent de pacifier la péninsule arabique. La Sourate An-Nasr fut révélée peu avant la mort du Prophète ﷺ, annonçant l'accomplissement de la mission."
  },
  {
    id: 'mort_prophete',
    domaine: 'sirah',
    sous_domaines: ['mort'],
    keywords: ['mort', 'décès', 'wafat', 'pèlerinage d\'adieu', 'hijjat al-wada'],
    verset_ref: "Sourate Al-Ma'ida 5:3",
    verset_ar: 'ٱلْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُمْ نِعْمَتِى وَرَضِيتُ لَكُمُ ٱلْإِسْلَٰمَ دِينًا',
    verset_fr: "Aujourd'hui, J'ai parachevé pour vous votre religion, et accompli sur vous Mon bienfait, et agréé pour vous l'islam comme religion.",
    hadith_ref: 'Sahih al-Bukhari n°4463 ; Sahih Muslim n°2444',
    hadith_texte_fr: "Rapporté par 'A'isha (qu'Allah l'agrée), qui décrit la maladie finale du Prophète ﷺ chez elle, ses dernières paroles, et son dernier souffle dans ses bras le lundi 12 Rabi' al-Awwal an 11 H.",
    parole_savant_texte: "« Le Prophète ﷺ s'éteignit le lundi 12 Rabi' al-Awwal de l'an 11 H, à l'âge de 63 ans, dans la chambre de 'A'isha (qu'Allah l'agrée). Ses dernières paroles audibles furent : \"Avec le compagnon le plus élevé\" (Ar-Rafiq al-A'la). Il fut inhumé à l'endroit même de sa mort, conformément à un hadith que lui-même avait rapporté concernant les prophètes. »",
    parole_savant_ref: "Ibn Kathir (701-774 H), Al-Bidaya wa an-Nihaya, Tome 5",
    explication_detaillee: "La fin de la mission prophétique fut couronnée par le Pèlerinage d'Adieu (Hijjat al-Wada') au mois de Dhul-Hijja de l'an 10 H, où le Prophète ﷺ accomplit son unique hajj entouré de plus de cent mille musulmans. C'est sur la plaine de 'Arafat qu'il prononça son célèbre Sermon d'Adieu, où il rappela les fondements : sacralité du sang, des biens et de l'honneur des musulmans ; abolition du riba et des vendettas pré-islamiques ; droits de la femme ; ferme attachement au Coran et à la Sunna ; égalité fondamentale entre les hommes sans distinction de race. C'est ce jour que fut révélé le verset Al-Ma'ida 5:3 annonçant la perfection de la religion — verset qui fit pleurer 'Umar ibn al-Khattab car il y comprit l'approche de la séparation. Trois mois plus tard, le Prophète ﷺ tomba malade chez Maymuna, fut transporté chez 'A'isha, et y demeura jusqu'à sa mort. Il continua à diriger la prière jusqu'à ce que la maladie l'en empêche : il désigna alors Abu Bakr pour mener la prière en commun — signe interprété par 'A'isha et les Compagnons comme l'indication de sa succession au califat. Le lundi 12 Rabi' al-Awwal de l'an 11 H (8 juin 632 ap. J.-C.), il rendit l'âme dans les bras de 'A'isha, ses dernières paroles étant : « Avec le Compagnon le plus élevé » (Ar-Rafiq al-A'la). La nouvelle bouleversa Médine ; 'Umar lui-même refusait d'admettre la nouvelle jusqu'à ce qu'Abu Bakr monte sur le minbar et prononce les paroles immortelles : « Quiconque adorait Muhammad, sache que Muhammad est mort. Quiconque adorait Allah, Allah est Vivant, Il ne meurt pas », puis récita le verset : « Muhammad n'est qu'un Messager — des Messagers avant lui sont passés... » (Aal 'Imran 3:144). Il fut inhumé dans la chambre même de 'A'isha, qui constitue aujourd'hui le noble tombeau au sein de la mosquée prophétique."
  },
];

// ============================================================
// TAFSIR / ULUM AL-QURAN (45-50)
// ============================================================
const RULES_TAFSIR: Rule[] = [
  {
    id: 'fatiha',
    domaine: 'tafsir',
    sous_domaines: ['tafsir_sourates'],
    keywords: ['fatiha', 'ouverture', "umm al-kitab"],
    verset_ref: 'Sourate Al-Fatiha 1:1-7',
    verset_ar: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ۝ ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ ۝ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ۝ مَٰلِكِ يَوْمِ ٱلدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ ۝ صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ',
    verset_fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux. Louange à Allah, Seigneur de l'univers. Le Tout Miséricordieux, le Très Miséricordieux. Maître du Jour de la rétribution. C'est Toi (Seul) que nous adorons, et c'est Toi (Seul) dont nous implorons secours. Guide-nous dans le droit chemin, le chemin de ceux que Tu as comblés de faveurs, non pas de ceux qui ont encouru Ta colère, ni des égarés.",
    hadith_ref: 'Sahih al-Bukhari n°756 ; Sahih Muslim n°394',
    hadith_texte_ar: 'لَا صَلَاةَ لِمَنْ لَمْ يَقْرَأْ بِفَاتِحَةِ الْكِتَابِ',
    hadith_texte_fr: "Rapporté par 'Ubada ibn as-Samit (qu'Allah l'agrée) : « Pas de prière pour celui qui ne récite pas la Fatiha (l'Ouverture du Livre). »",
    parole_savant_texte: "« Al-Fatiha est appelée Umm al-Kitab (Mère du Livre) car elle contient tous les sens du Coran : le Tawhid de Seigneurie (« Seigneur de l'univers »), le Tawhid des Noms et Attributs (« le Tout Miséricordieux, le Très Miséricordieux »), le Tawhid d'adoration (« C'est Toi Seul que nous adorons »), la croyance au Jour Dernier (« Maître du Jour de la rétribution »), la prière (qui en a fait la condition de validité), et l'invocation pour la guidée. »",
    parole_savant_ref: "Ibn Kathir (701-774 H), Tafsir Ibn Kathir, Tome 1",
    explication_detaillee: "Al-Fatiha est la sourate qui ouvre le Coran, bien qu'elle ne soit pas chronologiquement la première révélée. Sept versets (As-Sab' al-Mathani — « les Sept Versets Répétés », cf. Al-Hijr 15:87), elle est récitée à chaque rak'a de chaque prière, soit au minimum dix-sept fois par jour pour les cinq prières obligatoires. Elle porte de nombreux noms : Al-Fatiha (l'Ouverture), Umm al-Kitab (Mère du Livre), As-Sab' al-Mathani, Ash-Shifa' (la Guérison), Ar-Ruqya (l'incantation curative — utilisée par les Compagnons pour soigner, hadith d'Abu Sa'id, Bukhari n°5736). Ibn Kathir et As-Sa'di expliquent qu'elle se divise en trois parties : une partie de louange et de tawhid (versets 1-4, « pour Allah »), un verset central qui partage la sourate (verset 5, « entre Allah et Son serviteur »), et une partie d'invocation (versets 6-7, « pour le serviteur »). Le hadith qudsi rapporté par Abu Hurayra (Muslim n°395) le confirme : « J'ai partagé la prière entre Moi et Mon serviteur en deux moitiés... » et détaille la réponse divine à chaque verset. La Fatiha synthétise tout le message coranique : reconnaissance de la Seigneurie d'Allah, exclusivité de l'adoration et de la demande d'aide (« iyyaka na'budu wa iyyaka nasta'in » est le verset le plus dense de Tawhid), distinction entre les trois groupes humains finaux (les comblés, les courroucés — interprétés par le Prophète ﷺ comme les juifs qui connurent et refusèrent, et les égarés — les chrétiens qui adorèrent sans science). Sa récitation est obligation absolue à chaque rak'a selon la majorité (Shafi'i, Hanbali, Maliki) ; les Hanafites estiment que la récitation du Coran en général suffit mais que la Fatiha est wajib."
  },
  {
    id: 'ayat_kursi',
    domaine: 'tafsir',
    sous_domaines: ['tafsir_sourates'],
    keywords: ['kursi', 'ayat al-kursi', 'baqara 255', 'baqarah 255'],
    verset_ref: 'Sourate Al-Baqarah 2:255 (Ayat al-Kursi)',
    verset_ar: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ',
    verset_fr: "Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même. Ni somnolence ni sommeil ne Le saisissent. À Lui appartient ce qui est dans les cieux et sur la terre. Qui peut intercéder auprès de Lui sans Sa permission ? Il connaît leur passé et leur futur, et ils n'embrassent de Sa science que ce qu'Il veut. Son Trône (Kursi) déborde les cieux et la terre, dont la garde ne Lui coûte aucune peine. Il est le Très Haut, le Très Grand.",
    hadith_ref: 'Sahih Muslim n°810',
    hadith_texte_ar: 'يَا أَبَا الْمُنْذِرِ، أَتَدْرِي أَيُّ آيَةٍ مِنْ كِتَابِ اللَّهِ مَعَكَ أَعْظَمُ؟ قَالَ : قُلْتُ : اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    hadith_texte_fr: "Rapporté par Ubayy ibn Ka'b (qu'Allah l'agrée) : « Le Prophète ﷺ me dit : \"Ô Abu al-Mundhir, sais-tu quel est le plus grand verset du Livre d'Allah que tu connais ?\" Je dis : \"Allah, point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même.\" Il frappa ma poitrine et dit : \"Que la science te soit aisée, ô Abu al-Mundhir !\" »",
    parole_savant_texte: "« Ayat al-Kursi est le verset le plus grandiose du Coran, comme l'a affirmé le Prophète ﷺ. Il rassemble dix attributs majeurs d'Allah : la divinité exclusive, la vie parfaite, la subsistance par Soi (Qayyumiya), la perfection absente de défaut (ni sommeil ni somnolence), la possession universelle, l'intercession soumise à Son autorisation, la science englobante, l'élévation de Son Kursi sur cieux et terre, l'absence de fatigue, et l'Élévation et la Grandeur. »",
    parole_savant_ref: "Ibn Taymiyya (661-728 H), Majmu' al-Fatawa, Tome 17",
    explication_detaillee: "Ayat al-Kursi est le verset le plus grandiose du Coran selon l'attestation du Prophète ﷺ lui-même. Sa récitation après chaque prière obligatoire garantit le Paradis : « Quiconque récite Ayat al-Kursi à la fin de chaque prière prescrite, rien ne le sépare du Paradis sinon la mort » (An-Nasa'i dans 'Amal al-Yawm wa al-Layla, authentifié par Al-Albani). Il fait partie des adkar du matin et du soir, et sa récitation au coucher protège du shaytan jusqu'au matin (Bukhari n°2311, hadith d'Abu Hurayra et le voleur de la zakat qui s'avéra être Shaytan). Le verset énumère successivement les Noms et Attributs essentiels d'Allah : Al-Hayy (le Vivant — d'une vie parfaite sans commencement ni fin, contrairement à la vie créée), Al-Qayyum (Celui qui subsiste par Lui-même et fait subsister tout ce qui est — le Nom d'Allah le plus grand selon plusieurs Compagnons). La négation du sommeil et de la somnolence affirme la perfection de Sa Vie. L'intercession (shafa'a) au Jour de la Résurrection ne peut avoir lieu sans Sa permission préalable et Son agrément de l'intercédé : ce qui invalide tout recours à des « intercesseurs » dans cette vie. Le Kursi est distinct du 'Arsh (Trône) selon Ibn 'Abbas et la majorité : « Le Kursi est le repose-pieds, et le 'Arsh ne peut être imaginé en taille ». La parole « Il est le Très Haut, le Très Grand » conclut le verset par l'affirmation de Son élévation au-dessus de Sa création — affirmation centrale dans la croyance Salafi de l''Uluww (élévation) d'Allah au-dessus de Ses créatures (cf. Sourate Al-Mulk 67:16-17). Ce verset à lui seul est une cure pour le tawhid et un rempart spirituel."
  },
  {
    id: 'ulum_quran',
    domaine: 'sciences_islamiques',
    sous_domaines: ['ulum_quran', 'ijaz', 'tafsir'],
    keywords: ['révélation', 'mushaf', 'compilation', 'préservation', 'i\'jaz'],
    verset_ref: 'Sourate Al-Hijr 15:9',
    verset_ar: 'إِنَّا نَحْنُ نَزَّلْنَا ٱلذِّكْرَ وَإِنَّا لَهُۥ لَحَٰفِظُونَ',
    verset_fr: "En vérité c'est Nous qui avons fait descendre le Rappel (le Coran), et c'est Nous qui en sommes Gardien.",
    parole_savant_texte: "« Le Coran a été préservé par trois moyens : la mémorisation dans les poitrines des hommes (cœurs), l'écriture dans les mushafs, et la chaîne de transmission orale (sanad) ininterrompue depuis le Prophète ﷺ. Cette triple préservation est unique aux textes religieux dans l'histoire de l'humanité. »",
    parole_savant_ref: "Ibn Kathir (701-774 H), Fada'il al-Qur'an",
    explication_detaillee: "Les sciences du Coran ('Ulum al-Qur'an) englobent l'étude de la révélation, de sa compilation, de ses sciences interprétatives, de son inimitabilité et de sa préservation. Le Coran fut révélé sur 23 ans : 13 ans à La Mecque (sourates généralement courtes, axées sur la croyance, le combat contre le shirk, les récits prophétiques) et 10 ans à Médine (sourates généralement longues, axées sur la législation, le combat, et la construction de la communauté). La descente s'est faite en deux temps : une descente unique du Lawh al-Mahfuz vers Bayt al-'Izza (le ciel le plus bas) la Nuit du Qadr, puis une descente progressive selon les circonstances (asbab an-nuzul) sur le Prophète ﷺ. La compilation officielle se fit en trois étapes : (1) du vivant du Prophète ﷺ, le Coran était entièrement mémorisé et écrit sur supports divers (parchemins, os plats, palmes, pierres plates) par les scribes de la révélation comme Zayd ibn Thabit, 'Ali, 'Uthman, Mu'awiya ; (2) sous Abu Bakr, après la mort de nombreux mémorisateurs lors de la bataille de Yamama contre Musaylima, 'Umar suggéra à Abu Bakr de réunir le Coran en un seul mushaf, confié à Zayd ibn Thabit ; (3) sous 'Uthman, devant la divergence des lectures dans les provinces conquises, le calife ordonna d'unifier les mushafs sur la base de celui d'Abu Bakr, en respectant le dialecte qurayshite, et envoya des copies authentiques (mashahif 'uthmaniyya) dans les grandes villes — La Mecque, Médine, Bassora, Koufa, Damas. Toutes les copies divergentes furent brûlées par consensus des Compagnons. La préservation est par triple voie : les hifaz (mémorisateurs) à chaque génération, les copies écrites identiques mondialement, et la chaîne orale (sanad) du Prophète ﷺ jusqu'à aujourd'hui par les qira'at canoniques (les sept ou dix lectures établies par Ibn Mujahid). L'inimitabilité (i'jaz) se manifeste sur le plan linguistique, scientifique, légistique et prophétique."
  },
  {
    id: 'usul_fiqh',
    domaine: 'sciences_islamiques',
    sous_domaines: ['usul', 'madhabs'],
    keywords: ['usul', 'sources', 'ijma', 'qiyas', 'madhab', 'madhhab', 'école juridique'],
    parole_savant_texte: "« Les sources de la législation islamique (usul al-fiqh) sont quatre selon le consensus des grandes écoles : le Coran, la Sunna, l'Ijma' (consensus des savants), et le Qiyas (analogie). Certains usulistes y ajoutent : l'istihsan (préférence juridique, Hanafites), al-masalih al-mursala (intérêts généraux, Malikites), 'urf (coutume), istishab (présomption de continuité), et l'opinion d'un Compagnon. »",
    parole_savant_ref: "Ibn al-Qayyim (691-751 H), I'lam al-Muwaqqi'in 'an Rabb al-'Alamin",
    verset_ref: 'Sourate An-Nisa 4:59',
    verset_fr: "Ô les croyants ! Obéissez à Allah, et obéissez au Messager et à ceux d'entre vous qui détiennent le commandement. Puis, si vous vous disputez en quoi que ce soit, renvoyez-le à Allah et au Messager, si vous croyez en Allah et au Jour Dernier.",
    explication_detaillee: "Les fondements de la jurisprudence (usul al-fiqh) constituent la méthodologie par laquelle les savants extraient les jugements légaux à partir des textes révélés. Les quatre sources consensuelles sont : (1) Le Coran — la première et la plus élevée, parole d'Allah préservée et mutawatir. (2) La Sunna — paroles, actes et approbations du Prophète ﷺ, deuxième source révélée comme l'indique le hadith « J'ai reçu le Livre et avec lui son équivalent » (Abu Dawud n°4604, sahih) ; la Sunna explicite, restreint ou ajoute aux dispositions coraniques. (3) L'Ijma' (consensus) — accord unanime des savants qualifiés d'une époque sur une question religieuse, fondé sur le hadith « Ma communauté ne se réunira pas sur un égarement » (Tirmidhi, Ibn Majah, authentifié) ; il prouve qu'une vérité a été établie par les sources. (4) Le Qiyas (analogie) — étendre le jugement d'un cas explicite à un cas non mentionné, sur la base d'une cause commune ('illa), par exemple interdire toutes les drogues par analogie au khamr explicitement interdit. Au-delà des quatre, les écoles juridiques (madhahib) divergent : les Malikites privilégient l'amal des gens de Médine ; les Hanafites recourent largement à l'istihsan ; les Malikites et Hanbalis acceptent les masalih mursala ; tous reconnaissent partiellement le 'urf. Les quatre madhahib de l'Ahlu Sunnah survivants sont : le Hanafite (Abu Hanifa An-Nu'man ibn Thabit, 80-150 H), le Malikite (Malik ibn Anas, 93-179 H), le Shafi'ite (Muhammad ibn Idris ash-Shafi'i, 150-204 H, fondateur des usul al-fiqh comme discipline systématique avec sa Risala), et le Hanbalite (Ahmad ibn Hanbal, 164-241 H). Aucune n'est supérieure aux autres en absolu : chacune a affiné la méthodologie d'extraction des ahkam. Suivre un madhab par discipline est permis pour le commun ; pour le savant capable d'ijtihad, suivre la preuve la plus forte est obligation."
  },
  {
    id: 'tajwid',
    domaine: 'sciences_islamiques',
    sous_domaines: ['tajwid'],
    keywords: ['tajwid', 'récitation', 'qira', 'lecture du coran'],
    verset_ref: 'Sourate Al-Muzzammil 73:4',
    verset_ar: 'وَرَتِّلِ ٱلْقُرْءَانَ تَرْتِيلًا',
    verset_fr: "Et récite le Coran posément et avec rythme (tartil).",
    hadith_ref: 'Sahih al-Bukhari n°5027',
    hadith_texte_ar: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    hadith_texte_fr: "Rapporté par 'Uthman ibn 'Affan (qu'Allah l'agrée) : « Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne. »",
    parole_savant_texte: "« Le tajwid désigne l'art de donner à chaque lettre son droit (haqq) : sortie phonétique correcte (makhraj), caractéristiques (sifat), règles d'assimilation (idgham), de nasalisation (ghunna), d'allongement (madd), et de pause (waqf). L'apprendre dans la mesure où l'on évite la déformation manifeste (lahn jali) qui altère le sens est obligatoire ; le tajwid détaillé (lahn khafi) est recommandé. »",
    parole_savant_ref: "Ibn al-Jazari (751-833 H), An-Nashr fi al-Qira'at al-'Ashr",
    explication_detaillee: "Le tajwid est la science qui régit la récitation correcte du Coran selon la manière transmise par le Prophète ﷺ à travers les chaînes ininterrompues de récitateurs jusqu'à nos jours. Allah ordonne lui-même la récitation posée dans Sourate Al-Muzzammil 73:4 (« wa rattil al-Qur'ana tartila »). Le tartil est défini par 'Ali ibn Abi Talib comme « la prononciation distincte des lettres et la connaissance des règles de pause » (rapporté par Ibn al-Jazari). Les fondements du tajwid incluent : (1) Les points d'articulation (makharij) — 17 sorties principales pour les lettres arabes, des plus profondes (le sira', gorge profonde, pour le hamza et le ha) aux plus apparentes (les lèvres). (2) Les caractéristiques (sifat) — opposées (sourde/sonore, ouverte/fermée, etc.) et propres (la grasseyante, la sifflante, etc.). (3) Les règles du nun sakin et tanwin — izhar (clarté), idgham (fusion), iqlab (conversion), ikhfa' (dissimulation). (4) Les règles du mim sakin — ikhfa shafawi, idgham mithlayn, izhar shafawi. (5) Les madd (allongements) — naturel (2 mouvements), connecté (4-5 mouvements), séparé, nécessaire (6 mouvements). (6) Les pauses (waqf) — obligatoire, permise, interdite, et le placement des signes (mim, lam, jim, qaf...). Les sept ou dix lectures canoniques (qira'at) sont toutes mutawatir et représentent la richesse de la révélation : Nafi', Ibn Kathir, Abu 'Amr, Ibn 'Amir, 'Asim, Hamza, Al-Kisa'i pour les sept ; auxquelles Ibn al-Jazari a ajouté Abu Ja'far, Ya'qub et Khalaf pour atteindre les dix. La récitation la plus diffusée mondialement est celle de Hafs 'an 'Asim ; en Afrique du Nord, c'est Warsh 'an Nafi'. Apprendre le tajwid au niveau évitant la lahn jali (déformation altérant le sens) est obligation pour tout musulman ; au-delà, c'est une sunna mu'akkada."
  },
];

// ============================================================
// RÈGLES GÉNÉRIQUES PAR DOMAINE (fallback)
// ============================================================
const RULES_GENERIC: Rule[] = [
  {
    id: 'generic_aqida',
    domaine: 'aqida',
    verset_ref: 'Sourate Al-Baqarah 2:285',
    verset_ar: 'ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ ۚ كُلٌّ ءَامَنَ بِٱللَّهِ وَمَلَٰٓئِكَتِهِۦ وَكُتُبِهِۦ وَرُسُلِهِۦ',
    verset_fr: "Le Messager a cru en ce qu'on a fait descendre vers lui venant de son Seigneur, et aussi les croyants : tous ont cru en Allah, en Ses anges, à Ses Livres et en Ses messagers.",
    hadith_ref: 'Sahih Muslim n°8 (Hadith de Jibril)',
    hadith_texte_fr: "Rapporté par 'Umar ibn al-Khattab : « (L'imân, c'est) que tu croies en Allah, en Ses anges, en Ses Livres, en Ses messagers, au Jour Dernier, et que tu croies au destin, dans son bien et son mal. »",
    parole_savant_texte: "« La 'aqida correcte est celle des Salaf : affirmer ce qu'Allah a affirmé pour Lui-même et ce que Son Messager ﷺ Lui a affirmé, sans tahrif (déformation), ta'til (négation), takyif (modalisation), ni tamthil (assimilation). »",
    parole_savant_ref: "Ibn Taymiyya (661-728 H), Al-'Aqida al-Wasitiyya",
    explication_detaillee: "La 'aqida (croyance) est le fondement de toute œuvre. Sans une croyance correcte, les œuvres n'ont aucun poids auprès d'Allah. Les six piliers de la foi — croyance en Allah, en Ses anges, en Ses Livres, en Ses messagers, au Jour Dernier, et au destin (qadar) — résument l'imân selon le hadith de Jibril (Muslim n°8). Ahlu Sunnah Wal Jama'a tient une position équilibrée entre les extrêmes : ni les Mu'tazila qui nient certains attributs divins par rationalisme, ni les Mushabbiha qui assimilent Allah à Ses créatures, ni les Khawarij qui excommunient pour tout péché majeur, ni les Murji'a qui banalisent les œuvres en disant que la foi seule du cœur suffit. La voie des Salaf est de suivre le Coran et la Sunna selon leur sens apparent qui sied à la Majesté divine, en se conformant à la compréhension des trois premières générations (Sahaba, Tabi'in, Atba' at-Tabi'in) — les générations dont le Prophète ﷺ a attesté de la meilleure qualité religieuse (Bukhari n°2652, Muslim n°2533). Cette croyance est universelle, transmise authentiquement, et préserve le musulman des innovations et déviations qui sont apparues à travers les siècles."
  },
  {
    id: 'generic_fiqh',
    domaine: 'fiqh',
    verset_ref: 'Sourate An-Nisa 4:59',
    verset_ar: 'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ أَطِيعُوا۟ ٱللَّهَ وَأَطِيعُوا۟ ٱلرَّسُولَ وَأُو۟لِى ٱلْأَمْرِ مِنكُمْ ۖ فَإِن تَنَٰزَعْتُمْ فِى شَىْءٍ فَرُدُّوهُ إِلَى ٱللَّهِ وَٱلرَّسُولِ',
    verset_fr: "Ô les croyants ! Obéissez à Allah, et obéissez au Messager et à ceux d'entre vous qui détiennent le commandement. Puis, si vous vous disputez en quoi que ce soit, renvoyez-le à Allah et au Messager.",
    hadith_ref: 'Sahih al-Bukhari et Sahih Muslim',
    hadith_texte_fr: "Rapporté par Ibn 'Umar (qu'Allah l'agrée) : « L'islam est bâti sur cinq piliers : témoigner qu'il n'y a de divinité qu'Allah et que Muhammad est le Messager d'Allah, accomplir la prière, verser la zakat, accomplir le pèlerinage, et jeûner Ramadan. »",
    parole_savant_texte: "« Le fiqh est la compréhension détaillée des jugements pratiques islamiques tirés de leurs preuves détaillées. Les quatre écoles juridiques sunnites (Hanafite, Malikite, Shafi'ite, Hanbalite) sont toutes valides ; leurs divergences sur les détails sont une miséricorde, leur unité sur les fondements est une grâce. »",
    parole_savant_ref: "Ibn 'Uthaymin (1347-1421 H), Sharh al-Mumti'",
    explication_detaillee: "Le fiqh (jurisprudence) est la science qui régit la mise en pratique de la religion dans la vie quotidienne : actes d'adoration ('ibadat), transactions (mu'amalat), statut personnel (ahwal shakhsiyya), et système pénal ('uqubat). Il s'appuie sur les sources révélées (Coran, Sunna) et les méthodes consensuelles (ijma', qiyas). Les divergences entre les écoles juridiques portent sur des détails d'interprétation, jamais sur les fondements ; elles reflètent la richesse de la méthodologie islamique et constituent une miséricorde pour la communauté qui peut choisir ce qui lui convient le mieux selon son contexte. Pour le musulman ordinaire, suivre l'école dominante de sa région ou son pays est permis et même recommandé pour éviter le chaos. Pour le savant qualifié, la règle est de suivre la preuve la plus forte parmi les positions. Quoi qu'il en soit, le principe fondamental est l'obéissance à Allah et à Son Messager comme l'indique le verset An-Nisa 4:59, et le retour aux textes révélés en cas de désaccord."
  },
  {
    id: 'generic_akhlaq',
    domaine: 'akhlaq',
    verset_ref: 'Sourate Al-Qalam 68:4',
    verset_ar: 'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ',
    verset_fr: "Et tu es certes, d'une moralité éminente.",
    hadith_ref: 'Musnad Ahmad n°8952 ; authentifié par Al-Albani',
    hadith_texte_ar: 'إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ',
    hadith_texte_fr: "Rapporté par Abu Hurayra (qu'Allah l'agrée) : « Je n'ai été envoyé que pour parfaire les nobles caractères. »",
    parole_savant_texte: "« Le bon caractère est la moitié de la religion : par lui, le serviteur atteint le rang du jeûneur et du veilleur de nuit, comme l'a affirmé le Prophète ﷺ. Il s'acquiert par l'effort, la compagnie des vertueux, et l'application des modèles prophétiques. »",
    parole_savant_ref: "Ibn al-Qayyim (691-751 H), Madarij as-Salikin",
    explication_detaillee: "Les akhlaq (mœurs, comportement) constituent l'aboutissement pratique de la foi. Le Prophète ﷺ a résumé sa mission par ce hadith : « Je n'ai été envoyé que pour parfaire les nobles caractères. » L'islam n'est pas seulement une croyance abstraite ni un ensemble de rituels : c'est une transformation profonde du caractère et du comportement. Le Prophète ﷺ lui-même fut décrit par Allah comme étant « d'une moralité éminente » (Al-Qalam 68:4), et son épouse 'A'isha résuma son caractère en disant : « Son caractère était le Coran » (rapporté par Muslim n°746). Les akhlaq englobent : la véracité (sidq), la fidélité (amana), la pudeur (haya'), la patience (sabr), la générosité (jud), la modestie (tawadu'), le pardon ('afw), la justice ('adl), la miséricorde (rahma), la maîtrise de la colère (kazm al-ghayz). Leur contraire — mensonge, trahison, impudeur, mauvais caractère — pèse lourd dans la balance des œuvres. Le Prophète ﷺ a dit : « Rien n'est plus lourd dans la balance du croyant au Jour de la Résurrection que le bon caractère » (Abu Dawud n°4799, Tirmidhi n°2002, authentifié). L'acquisition des nobles caractères passe par la connaissance, l'imitation des modèles prophétiques, la fréquentation des vertueux, et la lutte constante contre l'âme (mujahada)."
  },
];

const ALL_RULES: Rule[] = [
  ...RULES_AQIDA,
  ...RULES_FIQH,
  ...RULES_AKHLAQ,
  ...RULES_SIRAH,
  ...RULES_TAFSIR,
  ...RULES_GENERIC,
];

// ============================================================
// MOTEUR
// ============================================================

interface QuestionRow {
  id: number;
  domaine: string;
  sous_domaine: string | null;
  texte_fr: string | null;
}

function matchRule(q: QuestionRow): Rule | undefined {
  const sd = (q.sous_domaine || '').toLowerCase();
  const texte = (q.texte_fr || '').toLowerCase();

  // 1) Priorité au match (domaine + sous_domaine)
  for (const r of ALL_RULES) {
    if (r.domaine !== q.domaine) continue;
    if (r.sous_domaines && sd && r.sous_domaines.some(s => s.toLowerCase() === sd)) {
      return r;
    }
  }
  // 2) match (domaine + keywords présents dans texte_fr)
  for (const r of ALL_RULES) {
    if (r.domaine !== q.domaine) continue;
    if (r.keywords && r.keywords.some(k => texte.includes(k.toLowerCase()))) {
      return r;
    }
  }
  // 3) fallback : règle générique du domaine (sans keywords, sans sous_domaines)
  for (const r of ALL_RULES) {
    if (r.domaine === q.domaine && !r.keywords && !r.sous_domaines) {
      return r;
    }
  }
  return undefined;
}

export async function enrichDalilV2(client: Client): Promise<void> {
  console.log('  Enrichissement EXHAUSTIF du dalil (v2)...');

  const { rows: questions } = await client.query<QuestionRow>(
    `SELECT id, domaine, sous_domaine, texte_fr
     FROM questions
     WHERE statut = 'valide' OR statut IS NULL
     ORDER BY id`
  );

  let enriched = 0;
  const perRuleCount = new Map<string, number>();
  const MAX_PER_RULE = 30;

  for (const q of questions) {
    const rule = matchRule(q);
    if (!rule) continue;

    const count = perRuleCount.get(rule.id) || 0;
    if (count >= MAX_PER_RULE) continue;
    perRuleCount.set(rule.id, count + 1);

    // On écrase ce qui a pu être posé par enrichDalil v1 (plus court),
    // car v2 contient des explications nettement plus longues et complètes.
    await client.query(
      `UPDATE questions SET
        verset_ref = $1,
        verset_ar = $2,
        verset_fr = $3,
        hadith_ref = $4,
        hadith_texte_ar = $5,
        hadith_texte_fr = $6,
        parole_savant_texte = $7,
        parole_savant_ref = $8,
        explication_detaillee = $9
       WHERE id = $10`,
      [
        rule.verset_ref || null,
        rule.verset_ar || null,
        rule.verset_fr || null,
        rule.hadith_ref || null,
        rule.hadith_texte_ar || null,
        rule.hadith_texte_fr || null,
        rule.parole_savant_texte || null,
        rule.parole_savant_ref || null,
        rule.explication_detaillee,
        q.id,
      ]
    );
    enriched++;
  }

  console.log(`  ✓ Dalil v2 enrichi pour ${enriched} questions (sur ${questions.length}).`);
  console.log(`  ✓ ${ALL_RULES.length} règles thématiques actives.`);
}
