import { Client } from 'pg';

/**
 * enrichDalilEn — English translations for dalil (proofs/evidences).
 *
 * Strategy: same rule-based engine as enrich_dalil_v2.ts but updates
 * the English columns: verset_en, hadith_texte_en, parole_savant_en,
 * explication_en. Translations use Sahih International for Quran and
 * Sunnah.com-style translations for hadiths.
 *
 * Matching (identical to v2):
 *  1. priority: (domaine, sous_domaine)
 *  2. then: (domaine, keywords in texte_fr)
 *  3. then: generic fallback for domain
 *  Max 30 questions per rule for diversity.
 */

interface RuleEn {
  id: string;
  domaine: string;
  sous_domaines?: string[];
  keywords?: string[];
  verset_en?: string;
  hadith_texte_en?: string;
  parole_savant_en?: string;
  explication_en: string;
}

// ============================================================
// AQIDA (1-8)
// ============================================================
const RULES_AQIDA_EN: RuleEn[] = [
  {
    id: 'tawhid_uluhiyya',
    domaine: 'aqida',
    sous_domaines: ['tawhid'],
    keywords: ['tawhid', 'unicité', 'shahada', 'adorer', 'adoration', 'ilah'],
    verset_en: 'Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent. (Surah Al-Ikhlas 112:1-4)',
    hadith_texte_en: "Narrated by Ibn 'Umar (may Allah be pleased with him): \"I have been commanded to fight the people until they testify that there is no god worthy of worship but Allah and that Muhammad is the Messenger of Allah.\" (Sahih al-Bukhari no. 7372; Sahih Muslim no. 22)",
    parole_savant_en: "\"The Tawhid with which the Messengers were sent and with which the Books were revealed is Tawhid al-Uluhiyyah, which encompasses Tawhid of Lordship (Rububiyyah). Whoever acknowledges Allah's Lordship alone without dedicating worship exclusively to Him is not a Muslim, for the polytheists of Quraysh themselves acknowledged that Allah was the Creator.\" (Ibn Taymiyyah, Majmu' al-Fatawa, Vol. 1)",
    explication_en: "Tawhid is the absolute foundation of Islam — the common message of all prophets from Adam to Muhammad ﷺ. Scholars of Ahl al-Sunnah wal-Jama'ah, following Ibn Taymiyyah and Ibn al-Qayyim, divide it into three inseparable categories. First, Tawhid al-Rububiyyah: acknowledging that Allah alone is the Creator, Sustainer and Lord of the universe; this was admitted even by the Meccan polytheists, as Allah reminds us in Surah Luqman 31:25. Second, Tawhid al-Uluhiyyah (or Tawhid of worship): dedicating all forms of worship — prayer, supplication, sacrifice, vow, fear, hope and trust — to Allah alone. This is what the prophets' struggle was centred on. Third, Tawhid al-Asma' wa al-Sifat: affirming for Allah the Names and Attributes He has given Himself in the Quran and that His Messenger ﷺ confirmed for Him, without distorting them (tahrif), denying them (ta'til), asking about their modality (takyif), or likening them to the creation (tamthil). The shahada 'La ilaha illa Allah' means precisely 'there is no deity worthy of worship except Allah': it is the negation of every object of worship other than Him and the exclusive affirmation of His right to be worshipped. No deed is accepted without this Tawhid, and shirk is the only sin Allah does not forgive without repentance (cf. Al-Nisa 4:48)."
  },
  {
    id: 'shirk',
    domaine: 'aqida',
    sous_domaines: ['tawhid'],
    keywords: ['shirk', 'associationnisme', 'associer', 'polythéisme', 'idole'],
    verset_en: 'Indeed, Allah does not forgive association with Him, but He forgives what is less than that for whom He wills. And whoever associates others with Allah has certainly fabricated a tremendous sin. (Surah Al-Nisa 4:48)',
    hadith_texte_en: "Narrated by Ibn Mas'ud (may Allah be pleased with him): \"I asked the Prophet ﷺ: Which sin is the greatest before Allah? He said: That you set up a rival to Allah while He created you.\" (Sahih al-Bukhari no. 6001; Sahih Muslim no. 86)",
    parole_savant_en: "\"Shirk is of two kinds: major shirk which takes one outside of Islam and results in eternal abode in Hellfire if one dies upon it (such as invoking the dead, prostrating to an idol, or sacrificing to other than Allah); and minor shirk, such as swearing by other than Allah or riya' (showing off discreetly), which does not expel one from the religion but is still graver than ordinary major sins.\" (Ibn Baz, Majmu' al-Fatawa wa Maqalat)",
    explication_en: "Shirk is the only sin Allah has declared unforgivable without repentance: it is the absolute antithesis of Tawhid. Scholars distinguish three levels. Major shirk (shirk akbar) consists of dedicating a form of worship to other than Allah: invoking the dead, asking saints for what only Allah can provide, sacrificing in the name of another, or pledging religious allegiance to a false deity. Whoever dies committing major shirk without repenting remains eternally in Hell, his deeds rendered void (cf. Al-Zumar 39:65). Minor shirk (shirk asghar) covers acts the Prophet ﷺ called shirk without making them expel one from Islam: riya' (performing acts to be seen by people — the hadith of Mahmud ibn Labid narrated by Ahmad), and swearing by other than Allah ('Whoever swears by other than Allah has committed kufr or shirk' — Tirmidhi). Hidden shirk (shirk khafi) refers to impure interior motivations. Combating every trace of shirk is the very meaning of the testimony of faith 'La ilaha illa Allah': negation (la ilaha) then affirmation (illa Allah). Ibn al-Qayyim explains in Madarij al-Salikin that total sincerity (ikhlas) is the cure for hidden shirk, and that the servant must constantly examine his heart."
  },
  {
    id: 'asma_sifat',
    domaine: 'aqida',
    sous_domaines: ['asma_sifat', 'asma_wa_sifat'],
    keywords: ['noms', 'attributs', 'asma', 'sifat'],
    verset_en: 'There is nothing like unto Him, and He is the Hearing, the Seeing. (Surah Ash-Shura 42:11)',
    hadith_texte_en: "Narrated by Abu Hurayrah (may Allah be pleased with him): \"Allah has ninety-nine names — one hundred minus one — whoever enumerates (memorises and acts upon) them will enter Paradise.\" (Sahih al-Bukhari no. 2736; Sahih Muslim no. 2677)",
    parole_savant_en: "\"Our methodology regarding Allah's Names and Attributes is to affirm what Allah has affirmed for Himself and what His Messenger ﷺ affirmed for Him, without distortion (tahrif), denial (ta'til), asking about modality (takyif), or likening to the creation (tamthil).\" (Ibn Taymiyyah, Al-'Aqidah Al-Wasitiyyah)",
    explication_en: "The way of the Salaf (pious predecessors) regarding Allah's Names and Attributes rests on the foundational verse of Ash-Shura 42:11, which combines the negation of all resemblance ('There is nothing like unto Him') with the affirmation of attributes ('and He is the Hearing, the Seeing'). Ahl al-Sunnah wal-Jama'ah affirms all Names and Attributes mentioned in the Quran and authentic Sunnah according to their apparent meaning befitting Divine Majesty, without falling into four deviations: tahrif (distorting the meaning, as the Jahmiyyah and Mu'tazilah do when they interpret 'the Hand of Allah' as 'His power'); ta'til (outright denial of attributes); takyif (seeking to imagine the modality, such as asking 'how is His Hand?' — Imam Malik famously replied: 'The istiwa is known, the how is unknown, to believe in it is obligatory, and to question it is an innovation'); and tamthil (likening the attributes to those of creatures). The 99 Names do not form a closed list: they are the most well-known, but other Names exist that Allah has kept in the knowledge of the Unseen (cf. the hadith of Ibn Mas'ud narrated by Ahmad). 'Enumerating' (ihsa) these Names includes according to Ibn al-Qayyim three degrees: memorising them, understanding their meanings, and invoking Allah by them (cf. Al-A'raf 7:180)."
  },
  {
    id: 'qadar',
    domaine: 'aqida',
    sous_domaines: ['qadar', 'arkan_iman'],
    keywords: ['qadar', 'destin', 'prédestination', 'décret'],
    verset_en: 'Indeed, all things We created with predestination (qadar). (Surah Al-Qamar 54:49)',
    hadith_texte_en: "Narrated by 'Umar ibn al-Khattab (may Allah be pleased with him): \"[Iman is] that you believe in Allah, His angels, His Books, His messengers, the Last Day, and that you believe in divine decree, both its good and its evil.\" (Sahih Muslim no. 8 — Hadith of Jibril)",
    parole_savant_en: "\"Belief in qadar rests on four inseparable degrees: Allah's eternal Knowledge encompassing all things; His inscription of all decrees in the Preserved Tablet fifty thousand years before the creation of the heavens and earth; His effective Will, nothing occurring without His willing it; and His Creation of all things, including the actions of servants.\" (Ibn al-Qayyim, Shifa' al-'Alil fi Masa'il al-Qada' wal-Qadar)",
    explication_en: "Belief in divine decree (al-qadar) is the sixth pillar of faith, as detailed in the famous Hadith of Jibril. Ahl al-Sunnah wal-Jama'ah holds a balanced position between two condemned extremes: the Qadariyyah (the Mu'tazilah) who deny qadar and claim that the servant's acts are created independently of Allah's will; and the Jabriyyah who claim the servant is totally compelled without any will of his own. The Salaf affirm four degrees: Allah's Knowledge ('Ilm) — He eternally knows all that was, is, and will be; His Writing (Kitabah) — He has inscribed all decrees in the Preserved Tablet (cf. the hadith of 'Abdullah ibn 'Amr, Muslim no. 2653: 'Allah wrote the decrees fifty thousand years before He created the heavens and earth'); His Will (Mashi'ah) — nothing happens in the universe without His will; and His Creation (Khalq) — He is the Creator of all things, including the servants' actions, which nonetheless remain authentically their acts through their free choice (ikhtiyar). The servant thus has a real will that entails his responsibility, but it operates under the all-encompassing Divine Will (cf. Al-Takwir 81:29). Believing in qadar brings peace to the heart: the believer gives thanks in ease and is patient in hardship, knowing that everything is measured by Divine Wisdom."
  },
  {
    id: 'iman_arkan',
    domaine: 'aqida',
    sous_domaines: ['iman', 'arkan_iman'],
    keywords: ['piliers de la foi', 'arkan', 'foi', 'imân', 'iman'],
    verset_en: 'The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers. (Surah Al-Baqarah 2:285)',
    hadith_texte_en: "Narrated by 'Umar ibn al-Khattab: \"[Iman is] that you believe in Allah, His angels, His Books, His messengers, the Last Day, and that you believe in divine decree, both its good and its evil.\" (Sahih Muslim no. 8)",
    parole_savant_en: "\"Iman according to Ahl al-Sunnah is: utterance of the tongue, belief of the heart, and action of the limbs; it increases through obedience and decreases through disobedience. This definition distinguishes them from the Murji'ah (who restrict iman to the heart) and the Khawarij (who declare someone outside the faith for any major sin).\" (Ibn Taymiyyah, Al-Iman)",
    explication_en: "The pillars of faith (arkan al-iman) are six, established by the Hadith of Jibril (Muslim no. 8): belief in Allah, His angels, His revealed Books, His messengers, the Last Day, and in divine decree in its good and its evil. Ahl al-Sunnah wal-Jama'ah defines iman as 'statement, belief and action': profession on the tongue, deep conviction of the heart, and practice by the limbs. This tripartite definition, transmitted by the Salaf such as Al-Awza'i, Sufyan al-Thawri and Ahmad ibn Hanbal, distinguishes the People of the Sunnah from two deviant groups: the Murji'ah, who reduce iman to mere belief of the heart and hold that no sin harms the faith as long as one declares the shahada; and the Khawarij, who excommunicate a Muslim for any major sin. The correct position is that iman increases through obedience and decreases through disobedience (cf. Al-Anfal 8:2: 'when His verses are recited to them, it increases them in faith'), but that a sin — even a major one — does not take the Muslim outside of Islam as long as he does not deem its prohibition lawful. Believing in the angels means recognising that they are creatures made of light (hadith of 'A'ishah, Muslim no. 2996), named and commissioned; believing in the Books means believing in their revelation while knowing that the Quran abrogates and confirms what preceded it."
  },
  {
    id: 'akhira',
    domaine: 'aqida',
    sous_domaines: ['akhira'],
    keywords: ['paradis', 'enfer', 'jannah', 'jahannam', 'jour dernier', 'résurrection', 'qiyama', 'akhira'],
    verset_en: "So whoever does an atom's weight of good will see it, and whoever does an atom's weight of evil will see it. (Surah Az-Zalzalah 99:7-8)",
    hadith_texte_en: "Narrated by Abu Hurayrah (may Allah be pleased with him), the Prophet ﷺ said that Allah said: \"I have prepared for My righteous servants what no eye has seen, no ear has heard, and no human heart has ever imagined.\" (Sahih al-Bukhari no. 3244; Sahih Muslim no. 2824)",
    parole_savant_en: "\"Paradise and Hell are currently created and in existence, as confirmed by authentic evidences. They will never be annihilated: Paradise is eternal by Allah's grace, and Hell is eternal for the disbelievers. This is the position of Ahl al-Sunnah wal-Jama'ah against the Jahmiyyah who claim they will cease to exist.\" (Ibn Taymiyyah, Al-'Aqidah Al-Wasitiyyah)",
    explication_en: "Faith in the Last Day encompasses everything that follows death: the trial of the grave with its comforts or punishments (cf. the hadith of Al-Bara' ibn 'Azib, Ahmad and Abu Dawud), the blast of the horn by the angel Israfil, the resurrection of bodies, the Gathering (mahshar), the presentation of records, the Weighing (mizan), the crossing of the Bridge (sirat) over Hellfire, the great Intercession of the Prophet ﷺ, the Basin (hawd), and finally entry into Paradise or Hell. Allah has described Paradise in dozens of verses: rivers of milk, honey, water and pure wine (cf. Muhammad 47:15), eternal dwellings, and above all the vision (ru'yah) of Allah's Face — the greatest of all rewards, affirmed by Ahl al-Sunnah against the Mu'tazilah (cf. Al-Qiyamah 75:22-23: 'Some faces, that Day, will be radiant, looking at their Lord'). Regarding Hell, it is a place of eternal punishment for disbelievers; a Muslim who enters it for major sins will leave through intercession and divine mercy. Believing in the Hereafter transforms life in this world: the believer acts knowing that nothing is lost, even the weight of an atom of good or evil."
  },
  {
    id: 'prophetologie',
    domaine: 'aqida',
    sous_domaines: ['prophetologie'],
    keywords: ['prophète', 'rasul', 'nabi', 'messager', 'rusul'],
    verset_en: 'Muhammad is not the father of any of your men, but he is the Messenger of Allah and the Seal of the prophets. (Surah Al-Ahzab 33:40)',
    hadith_texte_en: "Narrated by Abu Hurayrah (may Allah be pleased with him): \"My likeness compared to the prophets before me is like a man who built a house, completed and perfected it, except for the place of one brick in a corner. People walk around it and admire it but say: 'If only this brick were put in its place!' I am that brick, and I am the Seal of the Prophets.\" (Sahih al-Bukhari no. 3535; Sahih Muslim no. 2286)",
    parole_savant_en: "\"The prophets were sent by Allah to every community (cf. Al-Nahl 16:36). Believing in them generally is obligatory; believing specifically in those named in the Quran and Sunnah is obligatory in detail. Messengers (Rusul) received a book or a new law, while prophets (Anbiya') confirmed the preceding law.\" (Ibn Kathir, Tafsir Ibn Kathir, commentary on Al-Nisa 4:164)",
    explication_en: "Belief in the prophets is one of the pillars of iman. Allah sent a warner to every community (cf. Fatir 35:24); the Quran names 25 prophets, but their total number exceeds, according to the hadith of Abu Dharr (Ahmad), one hundred and twenty-four thousand, of whom three hundred and thirteen were Messengers. The five Ulu al-'Azm (those of firm resolve) are Nuh, Ibrahim, Musa, 'Isa and Muhammad ﷺ — mentioned together in Al-Ahzab 33:7 and Ash-Shura 42:13. A Muslim must believe that all prophets brought the same fundamental message of Tawhid (cf. Al-Anbiya 21:25: 'We did not send before you any messenger except that We revealed to him that there is no deity except Me, so worship Me'). They are infallible ('ismah) in conveying the divine message, free from shirk and major sins; the minor errors of judgment attributed to them are immediately corrected by revelation. Muhammad ﷺ is the Seal of the Prophets (Khatam al-Nabiyyin): no prophet will come after him. Whoever claims prophethood after him is an impostor, and whoever believes such a person exits Islam — as the community unanimously held regarding Musaylimah, and later regarding the Qadiyani/Ahmadi sects. The mission of Muhammad ﷺ is universal, directed to all humans and jinn until the End of Time (cf. Saba 34:28)."
  },
  {
    id: 'ghayb',
    domaine: 'aqida',
    sous_domaines: ['ghayb'],
    keywords: ['inconnu', 'ghayb', 'invisible', 'occulte'],
    verset_en: 'Say: None in the heavens and earth knows the unseen except Allah. (Surah An-Naml 27:65)',
    hadith_texte_en: "Narrated by Abu Hurayrah (may Allah be pleased with him): \"Whoever goes to a fortune-teller and believes what he says has disbelieved in what was revealed to Muhammad ﷺ.\" (Narrated by Ahmad and Al-Hakim, authenticated by Al-Albani)",
    parole_savant_en: "\"Knowledge of the Unseen (al-ghayb) belongs exclusively to Allah. Whoever claims to know it — fortune-teller, astrologer, soothsayer — is a liar, and believing them constitutes kufr in what was revealed to Muhammad ﷺ according to the hadith of Abu Hurayrah.\" (Ibn Baz, Majmu' al-Fatawa)",
    explication_en: "The Unseen (al-ghayb) refers to everything that escapes the human senses and reason: Allah's essence, the angels, future destiny, the hour of death, the nature of the soul, and so on. The Quran categorically states that its exclusive knowledge belongs to Allah (cf. Al-An'am 6:59: 'And with Him are the keys of the unseen; none knows them except Him'). Prophets only know of the ghayb what Allah reveals to them (cf. Al-Jinn 72:26-27). This settles several crucial questions: (1) Believing fortune-tellers, soothsayers, astrologers, tarot readers or charlatans amounts to associating them with Allah in an attribute exclusive to Him — it is shirk if one affirms they know by themselves; it is a grave sin if one consults without believing (hadith of Safiyyah, Muslim no. 2230: 'The prayer of whoever consults a fortune-teller is not accepted for forty days'). (2) Truthful dreams (ru'ya) may contain glimpses of the ghayb by divine grace, but cannot form the basis of a religious ruling. (3) Believing in the Signs of the Hour (Ashrat al-Sa'ah) — the appearance of the Mahdi, the descent of 'Isa, the emergence of the Dajjal, the emergence of the Beast, the rising of the sun from the West — is part of obligatory faith in the unseen, without speculating about their timing. The believer worships Allah with the certainty that He alone holds the Unseen and that it suffices for His creature to conform to the revelation."
  },
];

// ============================================================
// FIQH (9-18)
// ============================================================
const RULES_FIQH_EN: RuleEn[] = [
  {
    id: 'salat_obligation',
    domaine: 'fiqh',
    sous_domaines: ['salat'],
    keywords: ['prière', 'salat', 'salah'],
    verset_en: 'And establish prayer and give zakah and bow with those who bow [in worship and obedience]. (Surah Al-Baqarah 2:43)',
    hadith_texte_en: "Narrated by Buraydah (may Allah be pleased with him): \"The covenant which distinguishes us from them (the disbelievers) is the prayer. Whoever abandons it has committed kufr.\" (Sunan al-Tirmidhi no. 2621, sahih; also narrated by Ahmad and Al-Nasa'i)",
    parole_savant_en: "\"Prayer is the second pillar of Islam after the two testimonies, and the greatest of the bodily acts of worship. Whoever abandons it out of negligence — while acknowledging its obligation — commits according to the strongest opinion an act of major disbelief that takes one outside of Islam, in accordance with the explicit hadiths of the Prophet ﷺ.\" (Ibn 'Uthaymin, Sharh al-Mumti' 'ala Zad al-Mustaqni', Vol. 2)",
    explication_en: "Prayer (salat) is the second pillar of Islam and the first act upon which the servant will be questioned on the Day of Resurrection (hadith of Abu Hurayrah, Tirmidhi no. 413, sahih). It is obligatory five times a day for every Muslim who is mature and of sound mind, male and female. Its conditions of validity include: ritual purity of body, clothing and place; covering the private parts ('awrah); facing the Qiblah; the entry of the prayer time; and intention (niyyah). Its pillars (arkan) according to the Hanbalis are fourteen, including the opening takbir, standing for those who are able, recitation of Al-Fatihah in every rak'ah, bowing (ruku'), the two prostrations (sujud), the final sitting, the tashahhud and the final salam. Regarding abandonment of prayer through negligence (without denying its obligation): the schools of law differ. The opinion of the Hanbalis and many of the Salaf (reported from 'Umar, 'Ali, Ibn Mas'ud, Ibn 'Abbas), supported by Ibn al-Qayyim and Ibn 'Uthaymin, considers this abandonment to be major disbelief (kufr akbar) because of the clarity of the texts: the hadith of Buraydah cited above, and the hadith of Jabir 'Between a man and shirk and kufr lies the abandonment of prayer' (Muslim no. 82). The Hanafi, Shafi'i and Maliki view considers it a major sin without exiting Islam. All agree that one who denies its obligation is an apostate. Regardless, prayer is the pillar around which the entire religion revolves."
  },
  {
    id: 'taharah',
    domaine: 'fiqh',
    sous_domaines: ['taharah'],
    keywords: ['wudu', 'ablution', 'pureté', 'tahara', 'ghusl', 'tayammum'],
    verset_en: "O you who have believed, when you rise to [perform] prayer, wash your faces and your forearms to the elbows and wipe over your heads and wash your feet to the ankles. (Surah Al-Ma'idah 5:6)",
    hadith_texte_en: "Narrated by Abu Malik al-Ash'ari (may Allah be pleased with him): \"Purity is half of faith.\" (Sahih Muslim no. 223)",
    parole_savant_en: "\"The obligatory acts of wudu are six: washing the face (including rinsing the mouth and nose according to the strongest view), washing the arms up to and including the elbows, wiping the entire head (including the ears), washing the feet up to and including the ankles, maintaining the order (tartib), and continuity (muwalat).\" (Ibn Qudamah, Al-Mughni, Vol. 1)",
    explication_en: "Ritual purity (taharah) is the precondition for prayer, tawaf, and direct recitation of the Quran from a mushaf. It is divided into purification from major ritual impurity (hadath akbar — which requires ghusl: major ablution after janabah, end of menses, or end of post-natal bleeding) and purification from minor ritual impurity (hadath asghar — which requires wudu: minor ablution after what exits from the two passages, deep sleep, loss of reason, or direct contact of the private parts according to the Shafi'is and Hanbalis). Verse 5:6 of Al-Ma'idah forms the Quranic basis for wudu by enumerating its obligations: washing the face, washing the arms up to and including the elbows, wiping the head, washing the feet up to and including the ankles. The sunnan of wudu, demonstrated by the Prophet's practice ﷺ (hadith of 'Uthman ibn 'Affan, Bukhari and Muslim), include the basmala at the beginning, the siwak, washing the hands three times, rinsing the mouth and nose three times, combing through the beard, running the fingers between the toes and fingers, and starting with the right side. Tayammum (dry ablution with clean earth) is permitted in the absence of water or inability to use it (illness, cold without means of heating water): it is performed by striking the earth once according to the majority, then passing the hands over the face and hands. Purity also encompasses the purity of the body (removal of najasah) and the place of prayer. It is through purity that the Muslim draws close to Allah, as indicated by the hadith: 'Allah loves those who repent and loves those who purify themselves' (Al-Baqarah 2:222)."
  },
  {
    id: 'zakat',
    domaine: 'fiqh',
    sous_domaines: ['zakat'],
    keywords: ['zakat', 'aumône', 'nisab', 'sadaqa'],
    verset_en: "Take from their wealth a charity by which you purify them and cause them increase, and invoke [Allah's blessings] upon them. Indeed, your invocations are reassurance for them. (Surah At-Tawbah 9:103)",
    hadith_texte_en: "Narrated by Ibn 'Umar (may Allah be pleased with him): \"Islam is built on five [pillars]: testifying that there is no god worthy of worship except Allah and that Muhammad is the Messenger of Allah, establishing prayer, paying zakah, performing Hajj, and fasting Ramadan.\" (Sahih al-Bukhari no. 8; Sahih Muslim no. 16)",
    parole_savant_en: "\"Zakah is obligatory on four categories of wealth: gold and silver (and their monetary equivalent), commercial merchandise, grains and fruits, and livestock (camels, cattle, sheep and goats). It only becomes obligatory when two conditions are met: reaching the nisab and the passage of a complete lunar year (hawl) for monetary holdings and livestock.\" (Ibn Baz, Majmu' al-Fatawa, Vol. 14)",
    explication_en: "Zakah (purification, growth) is the third pillar of Islam, mentioned more than eighty times in the Quran, generally coupled with prayer, which underscores its paramount importance. It is an obligatory right that Allah has instituted in the wealth of the rich in favour of the poor; it is neither a favour nor a charity, but a due right. The nisab for gold is 85 grams, for silver 595 grams, and currency is aligned with silver. The rate is 2.5% (a quarter of a tenth) on monetary holdings, gold, silver and commercial goods — collected once per elapsed lunar year. For crops, the rate is 10% if irrigation is natural and 5% if it requires effort, collected at harvest time (cf. Al-An'am 6:141). The eight categories of recipients are fixed by At-Tawbah 9:60: the poor (fuqara'), the needy (masakin), those employed to collect it, those whose hearts are to be reconciled, the freeing of slaves, those in debt, the cause of Allah (fi sabilillah), and the stranded traveller (ibn al-sabil). Refusing to pay zakah out of negligence is a major sin (cf. At-Tawbah 9:34-35); denying its obligation is apostasy. Abu Bakr al-Siddiq fought those who refused to pay it after the Prophet's death ﷺ, demonstrating that it is inseparable from prayer in Islam."
  },
  {
    id: 'sawm',
    domaine: 'fiqh',
    sous_domaines: ['sawm'],
    keywords: ['jeûne', 'ramadan', 'siyam', 'sawm', 'iftar', 'suhur'],
    verset_en: 'O you who have believed, decreed upon you is fasting as it was decreed upon those before you that you may become righteous. (Surah Al-Baqarah 2:183)',
    hadith_texte_en: "Narrated by Abu Hurayrah (may Allah be pleased with him): \"Whoever does not give up false speech and acting upon it, Allah has no need for him to give up his food and his drink.\" (Sahih al-Bukhari no. 1903)",
    parole_savant_en: "\"The Ramadan fast becomes obligatory as soon as the new crescent of Ramadan is sighted by a reliable Muslim witness, or upon the completion of thirty days of Sha'ban. The fast consists of refraining — with intention made the night before — from eating, drinking and marital relations from true dawn (Fajr) until sunset (Maghrib).\" (Ibn 'Uthaymin, Majalis Shahr Ramadan)",
    explication_en: "The fast of Ramadan is the fourth pillar of Islam, prescribed in the second year of the Hijrah. It is obligatory for every Muslim who is mature, of sound mind, capable and resident. Those exempted who must make up missed days include: the temporarily ill and the traveller (cf. Al-Baqarah 2:184-185), and women who are menstruating or experiencing post-natal bleeding. Those exempted with compensation (fidyah = feeding one poor person per day): the chronically ill without hope of recovery and the elderly person who is unable. A pregnant or nursing woman who fears for herself or her child may break the fast and make it up (according to Hanafis and Shafi'is) or make it up and pay fidyah (according to Hanbalis). The fast is invalidated by: intentionally eating or drinking, marital relations (which also require an expiation: freeing a slave, or fasting two consecutive months, or feeding 60 poor people — hadith of Abu Hurayrah, Bukhari and Muslim), deliberately induced vomiting, deliberately induced ejaculation, and menstruation or post-natal bleeding. The deeper purpose of fasting is taqwa (God-consciousness) as the verse indicates: it is a school of endurance, sincerity, compassion for the poor, and control of passions. The Prophet ﷺ warned that whoever fasts without abandoning false speech and vulgar behaviour gains nothing from his fast but hunger and thirst (Bukhari no. 1903; Ibn Majah no. 1690)."
  },
  {
    id: 'hajj',
    domaine: 'fiqh',
    sous_domaines: ['hajj', 'ihram'],
    keywords: ['hajj', 'pèlerinage', 'umra', 'ihram', 'tawaf', 'arafat', 'mina', 'muzdalifa', 'safa', 'marwa'],
    verset_en: "And [due] to Allah from the people is a pilgrimage to the House — for whoever is able to find thereto a way. But whoever disbelieves — then indeed, Allah is free from need of the worlds. (Surah Aal 'Imran 3:97)",
    hadith_texte_en: "Narrated by Abu Hurayrah (may Allah be pleased with him): \"Whoever performs Hajj for Allah and does not commit any obscenity or evil deed, he will return [as pure] as on the day his mother gave birth to him.\" (Sahih al-Bukhari no. 1521; Sahih Muslim no. 1350)",
    parole_savant_en: "\"Hajj is obligatory once in a lifetime for every free, mature, mentally sound Muslim who has the physical ability (health) and financial means (provision for oneself and one's family, travel expenses, safety of the route). Deferring Hajj without excuse when one has the means is a serious sin by consensus; some scholars even hold it becomes obligatory in the first year of ability.\" (Ibn Baz, Fatawa al-Hajj wal-'Umrah)",
    explication_en: "Hajj is the fifth pillar of Islam, obligatory once in a lifetime for whoever has the capability (istita'ah). It is performed during the designated months (Shawwal, Dhul-Qi'dah and the first ten days of Dhul-Hijjah). There are three modes: Tamattu' (performing 'umrah then exiting ihram and re-entering ihram for Hajj — recommended by the Prophet ﷺ); Qiran (combining 'umrah and Hajj under a single ihram with an offering); Ifrad (Hajj only without an offering). The pillars (arkan) of Hajj whose omission invalidates the rite are four according to the Shafi'is and Hanbalis: ihram (intention to enter the consecrated state from the miqat), the standing at 'Arafah (the greatest pillar: 'Hajj is 'Arafah' — hadith of 'Abd al-Rahman ibn Ya'mar, Tirmidhi, sahih), the tawaf al-ifadah around the Ka'bah, and the sa'y between Safa and Marwah. The obligatory acts (wajibat) whose omission is compensated by a dam (sacrifice) include: entering ihram from the miqat, spending the night at Muzdalifah, stoning the jamarat, spending nights at Mina, shaving or cutting the hair, and the farewell tawaf. Hajj is the supreme school of Tawhid: the talbiyah ('Labbayk Allahumma labbayk, labbayka la sharika laka labbayk...') is the proclamation of oneness; the simplicity of ihram erases social distinctions; the standing at 'Arafah is the image of the Gathering on the Day of Judgment. The reward is the complete erasure of sins."
  },
  {
    id: 'nikah',
    domaine: 'fiqh',
    sous_domaines: ['nikah'],
    keywords: ['mariage', 'nikah', 'mahr', 'wali', 'tuteur', 'épouse', 'époux'],
    verset_en: 'And of His signs is that He created for you from yourselves mates that you may find tranquillity in them; and He placed between you affection and mercy. (Surah Ar-Rum 30:21)',
    hadith_texte_en: "Narrated by Ibn Mas'ud (may Allah be pleased with him): \"O young people, whoever among you can afford to marry, let him marry, for it is more effective in lowering the gaze and more protective of chastity. And whoever cannot, let him fast, for it will be a restraint for him.\" (Sahih al-Bukhari no. 5066; Sahih Muslim no. 1400)",
    parole_savant_en: "\"The pillars of nikah according to the majority (Shafi'is, Hanbalis, Malikis) are: the future husband, the future wife who is free from impediments, the guardian (wali) of the woman, two upright witnesses, and the formula of offer (ijab) and acceptance (qabul). Without a wali, the marriage is invalid according to the majority, in accordance with the hadith: 'There is no marriage without a guardian.'\" (Ibn Qudamah, Al-Mughni, Vol. 7)",
    explication_en: "Marriage (nikah) is the confirmed Sunnah of the Prophet ﷺ and the way of all the Messengers (cf. Ar-Ra'd 13:38). Its legal status varies according to capability and need: obligatory for one who fears falling into fornication and has the means; recommended for the majority; permissible for one without desire; and discouraged for one who cannot fulfil its obligations. The pillars of the contract according to the majority are: the two parties free from impediments, the guardian (wali) on the woman's side — her father in priority, then the paternal grandfather, the son, the full brother then the paternal brother, etc. — two upright Muslim witnesses, and the formula of offer and acceptance. The mahr (dowry) is the woman's exclusive right and a moral pillar of the contract (cf. An-Nisa 4:4); it has no maximum and the minimum is anything that can be called property according to the majority. Prohibited in marriage are: female ascendants (mother, grandmothers), female descendants, sisters, paternal and maternal aunts, nieces, and foster sisters (prohibitions through kinship and nursing enumerated in An-Nisa 4:23), as well as the mother-in-law, the step-daughter (if consummation occurred with the mother), and the biological son's wife. The hadith of 'A'ishah (Abu Dawud, Tirmidhi, authenticated): 'There is no marriage without a wali' is the preponderant view of Ahl al-Sunnah. Cohabitation outside of nikah is zina (fornication), a major sin. The purpose of marriage is chastity, procreation, sakinah (tranquillity), mawaddah (affection) and mutual rahmah (mercy)."
  },
  {
    id: 'muamalat_riba',
    domaine: 'fiqh',
    sous_domaines: ['muamalat'],
    keywords: ['riba', 'usure', 'intérêt', 'prêt', 'banque', 'commerce', 'vente'],
    verset_en: 'But Allah has permitted trade and has forbidden interest (riba). (Surah Al-Baqarah 2:275)',
    hadith_texte_en: "Narrated by Jabir ibn 'Abdillah (may Allah be pleased with him): \"The Messenger of Allah ﷺ cursed the one who consumes riba, the one who pays it, the one who writes it down, and its two witnesses. He said: They are all equal [in sin].\" (Sahih Muslim no. 1598)",
    parole_savant_en: "\"Riba is of two kinds: riba al-nasi'ah (riba of delay — interest on loans) and riba al-fadl (riba of excess — unequal exchange of ribawi goods of the same kind). The six ribawi goods specifically named in the Sunnah are: gold, silver, wheat, barley, dates and salt. Any exchange of one of these goods for the same type must be equal in measure and hand-to-hand.\" (Ibn al-Qayyim, I'lam al-Muwaqqi'in, Vol. 2)",
    explication_en: "Riba is one of the seven destructive sins (mubiqat) explicitly cursed in the Quran and Sunnah. Allah has declared war against it in Al-Baqarah 2:279: 'But if you do not, then be informed of a war [against you] from Allah and His Messenger.' It is one of the very few sins mentioned with such gravity. Riba manifests primarily through: (1) interest-bearing loans — whether conventional bank loans, credit cards with interest, standard mortgages, etc.; (2) riba in exchanges, particularly the deferred or unequal exchange of the six ribawi goods named by the Prophet ﷺ (hadith of 'Ubadah ibn al-Samit, Muslim no. 1587), today extended to currencies (dollar for dollar must be hand-to-hand and at parity; dollar for euro may be unequal but must be hand-to-hand — the rule of currency exchange al-sarf). The Muslim must therefore seek alternatives: participatory financing (musharakah), compliant murabahah, ijarah, etc., offered by Islamic banks. Working in an institution whose main activity is riba is forbidden according to the majority of contemporary scholars (Ibn Baz, Ibn 'Uthaymin, the Permanent Committee), unless the position is completely disconnected from usurious operations. Riba destroys the economy by concentrating wealth, ruins solidarity, and its prohibition protects the weak."
  },
  {
    id: 'janaza',
    domaine: 'fiqh',
    sous_domaines: ['janaza', 'janaiz'],
    keywords: ['funérailles', 'janaza', 'mort', 'défunt', 'enterrement'],
    verset_en: "Every soul will taste death. Then to Us will you be returned. (Surah Al-'Ankabut 29:57)",
    hadith_texte_en: "Narrated by Abu Hurayrah (may Allah be pleased with him): \"Whoever attends a funeral until the prayer is offered over the deceased will have a reward equal to one qirat, and whoever stays until the burial will have a reward equal to two qirats. — What are the two qirats? — Like two immense mountains.\" (Sahih al-Bukhari no. 47; Sahih Muslim no. 945)",
    parole_savant_en: "\"The obligations of the living towards a deceased Muslim are four, fard kifayah (collective obligation that is fulfilled if a sufficient part of the community carries it out): washing the body (ghusl), shrouding (kafan), praying over him (salat al-janazah), and burying him in a proper grave with his face turned towards the Qiblah.\" (Ibn Qudamah, Al-Mughni, Vol. 2)",
    explication_en: "The funeral rites in Islam are a fard kifayah: if a sufficient part of the community performs them, the obligation falls from the rest. The deceased Muslim must receive four rights: (1) Washing (ghusl) an odd number of times (three, five or seven), beginning with the right side and the limbs used in wudu, mixed optionally with sidr and camphor — except the martyr on the battlefield who is buried with his blood. (2) The shroud (kafan), preferably three white pieces for a man and five for a woman, without extravagance — the Prophet ﷺ was wrapped in three white Yemeni pieces (hadith of 'A'ishah, Bukhari no. 1264). (3) The funeral prayer (salat al-janazah), which consists of four takbirs: after the first one recites Al-Fatihah, after the second the prayer upon the Prophet ﷺ, after the third a supplication for the deceased, and after the fourth one gives the salam to the right. It is a prayer performed while standing, without bowing or prostration. (4) Burial in a dug grave, preferably with a niche (lahd) on the Qiblah side, the deceased lying on his right side facing the Qiblah. Prohibited are: loud crying and lamentation, tearing one's clothes, and praising the deceased with inscriptions on the grave ('The Prophet ﷺ forbade plastering graves, sitting on them and building structures over them' — Muslim no. 970). The mourning period is three days for everyone, except for a widow who observes four months and ten days (cf. Al-Baqarah 2:234)."
  },
  {
    id: 'miras',
    domaine: 'fiqh',
    sous_domaines: ['miras', 'mirath', 'wasiyya'],
    keywords: ['héritage', 'mirath', 'miras', 'testament', 'wasiyya'],
    verset_en: 'Allah instructs you concerning your children: for the male, what is equal to the share of two females. (Surah An-Nisa 4:11)',
    hadith_texte_en: "Narrated by Ibn 'Abbas (may Allah be pleased with him): \"Give the obligatory shares (fara'id) to their rightful heirs, and whatever remains goes to the nearest male agnate.\" (Sahih al-Bukhari no. 6732; Sahih Muslim no. 1615)",
    parole_savant_en: "\"The science of fara'id (inheritance) is half of all knowledge, as the Prophet ﷺ said. Before any distribution, the following are extracted: funeral expenses, settlement of debts, execution of the will within the limit of one-third and only in favour of non-heirs, then the remainder is distributed according to the Quranic shares.\" (Ibn Qudamah, Al-Mughni, Vol. 6)",
    explication_en: "Islamic inheritance (fara'id) is one of the rare domains where Allah Himself has fixed the shares in the Quran (An-Nisa 4:11-12 and 4:176), leaving no room for personal discretion. Before any distribution, four rights are extracted from the estate in this order: reasonable funeral expenses, debts (both to Allah such as unpaid zakah, and to people), execution of the will (wasiyyah) strictly within one-third of the estate and solely for the benefit of non-heirs ('No will in favour of an heir' — hadith of Abu Umamah, Abu Dawud, Tirmidhi authenticated), and finally distribution to heirs. The rightful heirs with fixed shares (ashab al-furud) are twelve in number: six female (wife, daughter, son's daughter, mother, grandmother, sister) and six male (husband, father, grandfather, uterine brother and son, etc.). The Quranic fractions are 1/2, 1/4, 1/8, 2/3, 1/3 and 1/6. The rule 'to the male the equivalent of the share of two females' concerns only children and certain cousins; it fits into a system where the man alone bears financial obligations (mahr, wife's maintenance, children's maintenance), while the woman keeps entirely what she possesses. In certain cases, the woman inherits as much as or more than a man or is the sole heir. Any distribution contrary to the Quran (systematic equalisation, disinheriting daughters or the wife, etc.) is invalid in the eyes of sharia."
  },
  {
    id: 'qurbani',
    domaine: 'fiqh',
    sous_domaines: ['qurbani', 'aqiqa'],
    keywords: ['sacrifice', 'qurbani', 'udhiya', 'aqiqa'],
    verset_en: 'So pray to your Lord and sacrifice [to Him alone]. (Surah Al-Kawthar 108:2)',
    hadith_texte_en: "Narrated by Abu Hurayrah (may Allah be pleased with him): \"Whoever has the means to sacrifice and does not sacrifice, let him not approach our prayer place [on the day of Eid].\" (Sunan Ibn Majah no. 3123, graded hasan by Al-Albani)",
    parole_savant_en: "\"The udhiyah (sacrifice of Eid al-Adha) is a highly confirmed sunnah according to the majority (Shafi'is, Hanbalis, Malikis), and obligatory for one who has the means according to Abu Hanifah. The minimum age is six months for a lamb, one year for a goat, two years for bovine, and five years for a camel. The animal must be free from major defects: blindness, obvious illness, obvious lameness, or emaciation.\" (Ibn 'Uthaymin, Risalat Ahkam al-Udhiyah)",
    explication_en: "The udhiyah (sacrifice of Eid al-Adha) commemorates the great sacrifice of Ibrahim (may Allah be pleased with him) (cf. As-Saffat 37:102-107). It is performed from the day of Eid (10 Dhul-Hijjah) until the end of the 13th of Dhul-Hijjah inclusive — four days (according to Ahmad and Al-Shafi'i in his later view) — and constitutes a highly confirmed sunnah (sunnah mu'akkadah) for the majority, or even wajib for the Hanafis for one who has the means. The Prophet ﷺ sacrificed two rams, one for himself and his family, and one for his Ummah (hadith of Anas, Bukhari no. 5558). The animal must reach the prescribed age and be free from the four defects enumerated by the Prophet ﷺ (hadith of Al-Bara' ibn 'Azib, Abu Dawud, Tirmidhi authenticated): obviously one-eyed, obviously ill, obviously lame, and emaciated without marrow. The meat is ideally distributed in three thirds: one third consumed, one third given as gifts, and one third distributed to the poor. As for the 'aqiqah, it is a sacrifice made for a newborn on the seventh day: two sheep for a boy and one sheep for a girl (hadith of Umm Kurz, authenticated), accompanied by shaving the head, choosing a good name, and circumcision for a boy. It is a sunnah mu'akkadah expressing gratitude to Allah and attaching the child to the precepts of Islam from birth."
  },
];

// ============================================================
// AKHLAQ (19-25)
// ============================================================
const RULES_AKHLAQ_EN: RuleEn[] = [
  {
    id: 'birr_walidayn',
    domaine: 'akhlaq',
    keywords: ['parents', 'birr', 'mère', 'père', 'walidayn'],
    verset_en: "And your Lord has decreed that you not worship except Him, and to parents, good treatment. Whether one or both of them reach old age [while] with you, say not to them [so much as] 'uff,' and do not repel them but speak to them a noble word. (Surah Al-Isra 17:23-24)",
    hadith_texte_en: "Narrated by Abu Hurayrah (may Allah be pleased with him): \"A man came and said: O Messenger of Allah, who is most deserving of my good companionship? He said: Your mother. — Then who? — Your mother. — Then who? — Your mother. — Then who? — Your father.\" (Sahih al-Bukhari no. 5971; Sahih Muslim no. 2548)",
    parole_savant_en: "\"Filial piety (birr al-walidayn) is one of the greatest obligations after the rights of Allah, and appears in the Quran coupled with the command of Tawhid in many places. Its opposite, 'uquq (disobedience and mistreatment of parents), is counted among the seven destructive sins.\" (Al-Nawawi, Riyad al-Salihin, Chapter on Birr al-Walidayn)",
    explication_en: "Piety towards parents (birr al-walidayn) occupies in Islam a central place, immediately after Allah's right. In several places in the Quran, the command of Tawhid is coupled with the command of goodness towards parents (Al-Isra 17:23, Luqman 31:14, Al-An'am 6:151), which underscores the paramount importance of this right. The mother is mentioned three times before the father in the famous hadith, because of the sufferings she endures: pregnancy ('his mother bore him with hardship and gave birth to him with hardship' — Al-Ahqaf 46:15), childbirth, breastfeeding and daily care. Birr includes: speaking to them gently even in disagreement, never saying 'uff' or scolding them, spending on them when they are in need, praying for them alive and dead ('My Lord, have mercy upon them as they raised me when I was young' — Al-Isra 17:24), and preserving their friends and relationships after their death. Obedience to them is due in everything that does not involve disobedience to Allah (cf. Luqman 31:15). 'Uquq (serious disobedience to parents) is one of the seven destructive sins (Bukhari and Muslim) and ranks among the gravest major sins after shirk. The Prophet ﷺ even said that the pleasure of Allah lies in the pleasure of the parent and His anger in the parent's anger (Tirmidhi, authenticated by Al-Albani). Even non-Muslim parents retain this right to kindness ('But accompany them in [this] world with appropriate kindness' — Luqman 31:15)."
  },
  {
    id: 'patience',
    domaine: 'akhlaq',
    keywords: ['patience', 'sabr', 'épreuve', 'endurance'],
    verset_en: 'O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient. (Surah Al-Baqarah 2:153)',
    hadith_texte_en: "Narrated by Suhayb (may Allah be pleased with him): \"How amazing is the affair of the believer! His entire affair is good, and that is for no one but the believer: If something good happens to him he is grateful, and that is good for him; if something harmful befalls him he is patient, and that is good for him.\" (Sahih Muslim no. 2999)",
    parole_savant_en: "\"Patience is of three kinds: patience in obedience to Allah (persevering in acts of worship), patience against sin (resisting forbidden passions), and patience in the face of Allah's painful decree (trials, bereavements, illnesses). The most difficult and the most meritorious is the second.\" (Ibn al-Qayyim, 'Uddat al-Sabirin wa Dhakhirat al-Shakirin)",
    explication_en: "Patience (sabr) is mentioned more than ninety times in the Quran, which underlines its centrality in spiritual life. Allah has promised the patient a reward without measure: 'Indeed, the patient will be given their reward without account' (Az-Zumar 39:10). Ibn al-Qayyim, in 'Uddat al-Sabirin, distinguishes three essential categories: (1) Sabr 'ala al-ta'ah: patience in fulfilling obligations despite weariness, difficulty or obstacles — such as rising for Fajr in winter, fasting in intense heat, or maintaining religious learning. (2) Sabr 'an al-ma'siyah: patience in the face of the temptation to sin — resisting the forbidden gaze, backbiting, unlawful gain — this is according to Ibn al-Qayyim the highest of the three because it involves a voluntary choice in a context of desire. (3) Sabr 'ala al-qadar: patience in the face of a painful decree — loss of a loved one, illness, ruin, injustice suffered. This patience excludes four things: complaining to creatures (complaining to Allah alone is permitted as Ya'qub did: 'I only complain of my suffering and my grief to Allah' — Yusuf 12:86), slapping one's cheeks, tearing one's clothes, and invoking one's own destruction. The Prophet ﷺ said: 'True patience is at the first shock' (Bukhari no. 1283). Sabr is not passive resignation, but an active strength: enduring while holding on to Allah, to prayer and to hope."
  },
  {
    id: 'ghiba',
    domaine: 'akhlaq',
    keywords: ['médisance', 'ghiba', 'calomnie', 'namima', 'rapporteur'],
    verset_en: "O you who have believed, avoid much [negative] assumption. Indeed, some assumption is sin. And do not spy or backbite each other. Would one of you like to eat the flesh of his brother when dead? You would detest it. (Surah Al-Hujurat 49:12)",
    hadith_texte_en: "Narrated by Abu Hurayrah (may Allah be pleased with him): \"Do you know what backbiting is? They said: Allah and His Messenger know best. He said: It is your mentioning your brother by what he dislikes. — And if what I say about him is true? — If what you say is in him, you have backbitten him; and if what you say is not in him, you have slandered him.\" (Sahih Muslim no. 2589)",
    parole_savant_en: "\"Backbiting (ghiba) is forbidden even if what one says is true. If it is false, it is slander (buhtan) — which is even graver. Six exceptional cases permit mentioning someone's faults: complaining of an injustice, seeking advice for a marriage or partnership, warning against an innovator or troublemaker, denouncing an open sin, identifying a defect (such as a widely-used nickname), and giving sincere counsel.\" (Al-Nawawi, Al-Adhkar)",
    explication_en: "Backbiting (ghiba) is among the major sins of the tongue, likened by Allah Himself to eating the flesh of one's dead brother — a striking image designed to produce a natural revulsion in the believer. The hadith of Abu Hurayrah fixes its exact definition: 'mentioning your brother by what he dislikes' whether he is absent or present, whether it concerns his body, his character, his religion, his family, his clothes, or his dwelling. Slander (buhtan) consists of attributing to him what is not in him — doubly blameworthy: lying and violating honour. Talebearing (namimah) consists of carrying words from one person to another to sow discord; the Prophet ﷺ said: 'The qattat (talebearer) will not enter Paradise' (Bukhari no. 6056). Al-Nawawi in Al-Adhkar and Riyad al-Salihin enumerates six cases where mentioning another's fault is lawful or even required: (1) complaining to the judge of an injustice suffered; (2) seeking help to correct a wrong; (3) consulting a mufti by laying out the facts; (4) warning the community against an unreliable narrator, an innovator or a fraudster (the science of jarh wa ta'dil); (5) mentioning a public sinner who does not hide his sin — but only regarding the sin he publicly commits; (6) identifying a person by a commonly-used nickname without intent of contempt when there is no other means of identification. Outside these cases, silence and the protection of a Muslim's honour are prescribed: 'The Muslim is the brother of the Muslim; he does not lie to him, betray him or humiliate him' (Tirmidhi no. 1927, hasan)."
  },
  {
    id: 'sincerite_ikhlas',
    domaine: 'akhlaq',
    sous_domaines: ['tazkiya'],
    keywords: ['ikhlas', 'sincérité', 'riya', 'ostentation'],
    verset_en: 'And they were not commanded except to worship Allah, [being] sincere to Him in religion, inclining to truth. (Surah Al-Bayyinah 98:5)',
    hadith_texte_en: "Narrated by 'Umar ibn al-Khattab (may Allah be pleased with him): \"Actions are [judged] by their intentions, and every person will have only what they intended.\" (Sahih al-Bukhari no. 1; Sahih Muslim no. 1907)",
    parole_savant_en: "\"Sincerity (ikhlas) means purifying one's action from any regard directed towards other than the Creator. Riya' (ostentation) means performing the act to be seen by people; it nullifies the deed. Even more subtle is sum'ah: acting so that people hear about it. These two diseases of the heart must be constantly feared.\" (Ibn al-Qayyim, Al-Fawa'id)",
    explication_en: "Ikhlas (sincerity, exclusivity of intention for Allah) is the condition of validity for every act of worship, without which no deed is accepted. Allah says in a hadith qudsi: 'I am the most self-sufficient of partners; whoever performs a deed in which he associates someone else with Me, I abandon him along with his association' (Muslim no. 2985). The two conditions for the acceptance of a deed, deduced by the Salaf, are: ikhlas (the deed is for Allah alone) and ittiba' (following the Sunnah of the Prophet ﷺ). Riya' (visual ostentation) is called the 'minor shirk' (shirk asghar) — the Prophet ﷺ said: 'What I fear most for you is the minor shirk. — What is it? — Riya'' (Ahmad, authenticated by Al-Albani). More subtle than riya' is sum'ah (acting so that people hear about it); and even more subtle is 'ujb (self-satisfaction that creeps in after the deed). The remedies prescribed by the Salaf: invoking Allah with the du'a of Abu Bakr: 'Allahumma inni a'udhu bika an ushrika bika wa ana a'lam, wa astaghfiruka lima la a'lam'; concealing one's good deeds as much as possible; remembering that people neither benefit nor harm; and acting as if each deed were the last. Ibn al-Qayyim explains that ikhlas is a lifelong struggle, and that this very struggle is what distinguishes the truthful (siddiqun) from others. Without ikhlas, fasting is merely a diet, prayer merely gymnastics, and pilgrimage merely travel."
  },
  {
    id: 'dhikr_dua',
    domaine: 'akhlaq',
    sous_domaines: ['adkar', 'dua'],
    keywords: ['dhikr', 'invocation', 'dua', 'rappel', 'tasbih'],
    verset_en: 'O you who have believed, remember Allah with much remembrance and exalt Him morning and afternoon. (Surah Al-Ahzab 33:41-42)',
    hadith_texte_en: "Narrated by Abu Musa al-Ash'ari (may Allah be pleased with him): \"The example of the one who remembers his Lord and the one who does not is like the living and the dead.\" (Sahih al-Bukhari no. 6407; Sahih Muslim no. 779)",
    parole_savant_en: "\"Dhikr is the soul of acts of worship. Every deed emptied of the remembrance of Allah is a body without a soul. The best formulas are: Subhan Allah, Al-Hamdulillah, La ilaha illa Allah, Allahu Akbar — these are the words most beloved to Allah as the Prophet ﷺ affirmed.\" (Ibn al-Qayyim, Al-Wabil al-Sayyib)",
    explication_en: "Dhikr (remembrance of Allah) is the lightest deed on the tongue, the heaviest in the scale, and the most beloved to the Most Merciful (cf. hadith of Abu Hurayrah, Bukhari no. 6406). The Quran commands abundant remembrance of Allah on numerous occasions (Al-Ahzab 33:41, Al-Jumu'ah 62:10). Ibn al-Qayyim in Al-Wabil al-Sayyib enumerates more than seventy benefits of dhikr: it soothes the heart ('Verily, in the remembrance of Allah do hearts find rest' — Ar-Ra'd 13:28), repels Shaytan, attracts divine satisfaction, illuminates the face and heart, dispels worries, increases provision, and causes the Lord to remember the servant ('Remember Me and I will remember you' — Al-Baqarah 2:152). The best formulas are the 'enduring righteous deeds' (al-baqiyat al-salihat): Subhan Allah, Al-Hamdulillah, La ilaha illa Allah, Allahu Akbar — to which is sometimes added La hawla wa la quwwata illa billah. The morning and evening adhkar (reported by Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i) are a major protection for the believer. As for du'a (supplication), it is 'the marrow of worship' (authenticated hadith, Tirmidhi no. 3371). Its conditions for acceptance are: sincerity, eating halal (a hadith in Muslim no. 1015 mentions the dusty traveller whose supplication is rejected because his food is unlawful), invoking with presence of the heart, and choosing auspicious moments (the last third of the night, between the adhan and iqamah, on Friday, in prostration, during the breaking of the fast, at 'Arafah). All supplications must be addressed to Allah alone; invoking a dead person or an absent one as one invokes Allah is major shirk."
  },
  {
    id: 'repentir_tawba',
    domaine: 'akhlaq',
    keywords: ['repentir', 'tawba', 'istighfar', 'pardon'],
    verset_en: 'O you who have believed, repent to Allah with sincere repentance (tawbah nasuh). (Surah At-Tahrim 66:8)',
    hadith_texte_en: "Narrated by Abu Hurayrah (may Allah be pleased with him), the Prophet ﷺ said: \"By Allah, I seek forgiveness from Allah and repent to Him more than seventy times a day.\" (Sahih al-Bukhari no. 6307)",
    parole_savant_en: "\"Sincere repentance (tawbah nasuh) rests on three conditions if the sin concerns Allah's right alone: immediately abandoning the sin, sincerely regretting it, and firmly resolving never to return to it. If it concerns a human right, a fourth condition is added: returning the right to its owner or seeking their pardon.\" (Al-Nawawi, Riyad al-Salihin, Chapter on Al-Tawbah)",
    explication_en: "Repentance (tawbah) is the immediate obligation of every Muslim who commits a sin — minor or major — and constitutes the most precious deed for the soul. Allah loves those who repent: 'Indeed, Allah loves those who are constantly repentant and loves those who purify themselves' (Al-Baqarah 2:222). Its door remains open as long as the soul has not reached the throat at the point of death and as long as the sun has not risen from the West (hadith of 'Abdullah ibn 'Umar, Tirmidhi no. 3537, hasan). Allah rejoices at the repentance of His servant more than a traveller who has become lost in the desert rejoices at finding his mount laden with provisions (Bukhari no. 6309, Muslim no. 2747). The conditions for valid repentance are four: (1) immediately ceasing to commit the sin; (2) experiencing genuine regret; (3) making a firm resolution not to return to it; (4) if a human right is involved — theft, slander, violation of honour or property — restoring it or seeking pardon from the person. The tawwab (frequent repenter) erases his sins to the point that Allah transforms them into good deeds (cf. Al-Furqan 25:70). Istighfar (seeking forgiveness) is part of repentance and has considerable virtues: it unties anxieties, opens the doors of provision and offspring (cf. Nuh 71:10-12). The Prophet ﷺ — despite already having all his sins forgiven — sought forgiveness more than seventy times a day. The greatest formula of istighfar is sayyid al-istighfar narrated in Bukhari no. 6306."
  },
  {
    id: 'vertus_voisin',
    domaine: 'akhlaq',
    keywords: ['voisin', 'jar', 'voisinage'],
    verset_en: 'Worship Allah and associate nothing with Him, and to parents do good, and to relatives, orphans, the needy, the near neighbour, the neighbour farther away, the companion at your side, the traveller. (Surah An-Nisa 4:36)',
    hadith_texte_en: "Narrated by 'A'ishah (may Allah be pleased with her): \"Jibril kept recommending that I treat the neighbour well until I thought he would make the neighbour an heir.\" (Sahih al-Bukhari no. 6014; Sahih Muslim no. 2625)",
    parole_savant_en: "\"The neighbour has three hierarchical statuses: (1) the Muslim neighbour who is also a relative — he has three rights: neighbourhood, kinship, Islam; (2) the Muslim neighbour only — he has two rights; (3) the non-Muslim neighbour — he has one right, that of neighbourhood. To all, one must show kindness, refrain from harming them, share surplus food, and visit them in illness.\" (Ibn Hajar al-'Asqalani, Fath al-Bari, commentary on Sahih al-Bukhari)",
    explication_en: "The rights of the neighbour in Islam are so extensive that they made the Prophet ﷺ believe Jibril would include the neighbour among the heirs. Verse An-Nisa 4:36 enumerates two categories of neighbours: the 'near neighbour' (al-jar dhi al-qurba) — understood as the related neighbour or the immediately adjacent house — and the 'distant neighbour' (al-jar al-junub) — the unrelated or more geographically distant neighbour. The rights of the neighbour include: not harming them (the Prophet ﷺ said, Bukhari no. 6016: 'By Allah he has not believed! By Allah he has not believed! By Allah he has not believed! — Who, O Messenger of Allah? — The one whose neighbour is not safe from his harm'), sharing good things ('When you cook a broth, increase the water and give some to your neighbours' — Muslim no. 2625), greeting them, visiting them in illness, presenting condolences, congratulating them on joys, and preserving their privacy. The non-Muslim neighbour retains the right to good neighbourly treatment according to the majority of scholars; 'Abdullah ibn 'Amr, when slaughtering a sheep, asked that the first portion be taken to his Jewish neighbour (Tirmidhi, Abu Dawud, hasan). The bad neighbour is so serious that the woman who prays and fasts but injures her neighbours with her tongue is in the Fire according to the hadith of Abu Hurayrah (Ahmad, authenticated). Islam thus builds the social fabric in concentric circles: family, neighbourhood, community, humanity."
  },
];

// ============================================================
// SIRAH (26-31)
// ============================================================
const RULES_SIRAH_EN: RuleEn[] = [
  {
    id: 'sirah_naissance',
    domaine: 'sirah',
    sous_domaines: ['naissance', 'enfance'],
    keywords: ['naissance', 'mecque', 'abd al-muttalib', 'abu talib', 'halima', 'amina'],
    verset_en: "Did He not find you an orphan and give [you] refuge? And He found you lost and guided [you], And He found you poor and made [you] self-sufficient. (Surah Ad-Duha 93:6-8)",
    hadith_texte_en: "The Prophet ﷺ said: \"I am the supplication of my father Ibrahim, the glad tiding of my brother 'Isa, and my mother saw a light emerge from her that illuminated the palaces of Syria.\" (Narrated by Ahmad, authenticated by Al-Albani)",
    parole_savant_en: "\"The Prophet ﷺ was born in Makkah on a Monday in the Year of the Elephant (approximately 570 CE), a descendant of Isma'il son of Ibrahim (may Allah be pleased with them). His father 'Abdullah died before his birth; his mother Aminah died when he was six years old. He was raised by his grandfather 'Abd al-Muttalib, and upon his death, by his uncle Abu Talib.\" (Ibn Kathir, Al-Bidayah wa Al-Nihayah, Vol. 2)",
    explication_en: "The Prophet Muhammad ﷺ was born in Makkah on a Monday, 12 Rabi' al-Awwal of the Year of the Elephant — the year when Abrahah attempted to destroy the Ka'bah with his army and was annihilated by the birds of Ababeel (cf. Surah Al-Fil 105). His lineage is consensually traced back to Isma'il son of Ibrahim (may Allah be pleased with them) through 'Adnan; beyond this, the Salaf discouraged going further. His father 'Abdullah ibn 'Abd al-Muttalib died while Aminah bint Wahb was pregnant. His mother entrusted him to the wet nurse Halimah al-Sa'diyyah of the Banu Sa'd tribe, with whom occurred the incident of the opening of the chest by Jibril (Sahih Muslim no. 162) — a prefiguration of the prophethood. He returned to his mother who died at Al-Abwa' when he was only six years old. He was then taken in by his grandfather 'Abd al-Muttalib, who died two years later. The young Muhammad ﷺ then came under the guardianship of his uncle Abu Talib, who faithfully protected him until his death at the dawn of the prophethood. This childhood marked by trials — orphanhood, poverty — was a preparatory school: Allah Himself refers to it in Surah Ad-Duha. The Prophet ﷺ grew up pure from all the vices of the Jahiliyyah, nicknamed Al-Amin (the Trustworthy) by his own tribe, which contrasts with the widespread practices of the era."
  },
  {
    id: 'sirah_revelation',
    domaine: 'sirah',
    sous_domaines: ['premiere_revelation'],
    keywords: ['révélation', 'wahy', 'hira', 'iqra', 'jibril', 'gabriel'],
    verset_en: "Recite in the name of your Lord who created — Created man from a clinging substance. Recite, and your Lord is the most Generous — Who taught by the pen — Taught man that which he knew not. (Surah Al-'Alaq 96:1-5)",
    hadith_texte_en: "Narrated by 'A'ishah (may Allah be pleased with her): \"The first [sign] of the revelation to the Messenger of Allah ﷺ was a righteous dream during sleep. Every dream he had came true like the brightness of dawn. Then he was inspired to love seclusion, and he would retire to the cave of Hira...\" (Sahih al-Bukhari no. 3; Sahih Muslim no. 160)",
    parole_savant_en: "\"The first revelation took place in the cave of Hira on Mount Al-Nur, during the month of Ramadan, when Muhammad ﷺ was forty years old. Jibril (may Allah's peace be upon him) appeared to him in his true form and said: 'Iqra'' (Recite!). The Prophet ﷺ replied: 'I cannot read,' three times, until he received the first five verses of Surah Al-'Alaq.\" (Ibn Kathir, Al-Bidayah wa Al-Nihayah, Vol. 3)",
    explication_en: "The first revelation marks the official beginning of the prophetic mission. The Prophet Muhammad ﷺ had reached the age of forty when Allah chose him as His final Messenger. Before that, he had taken the habit of retiring to the cave of Hira, located at the top of Jabal al-Nur ('the Mountain of Light'), a few kilometres from Makkah, to meditate and worship Allah in the way of Ibrahim. It was there that one night in the month of Ramadan — the Night of Qadr — Jibril appeared to him and commanded 'Recite!' The Prophet ﷺ, being illiterate (ummi), replied: 'I cannot read.' Jibril embraced him tightly three times, and finally revealed to him the first five verses of Surah Al-'Alaq (96:1-5), which immediately establish the foundations: creation by Allah, reading and knowledge as signs of His generosity, and the primacy of Tawhid. Deeply shaken, the Prophet ﷺ returned to his wife Khadijah bint Khuwaylid saying: 'Cover me, cover me!' She reassured him and then took him to her cousin Waraqah ibn Nawfal, a Christian scholar who recognised the angelic nature of the visit. Followed then a period of interruption (fatrah) of a few months, after which the revelation resumed with Surah Al-Muddaththir, commanding public preaching. The descent of the Quran spanned 23 years: 13 years in Makkah (centred on Tawhid and belief) and 10 years in Madinah (centred on legislation and community building)."
  },
  {
    id: 'sirah_hijra',
    domaine: 'sirah',
    sous_domaines: ['hijra'],
    keywords: ['hijra', 'émigration', 'medine', 'médine', 'ansar', 'muhajirun', 'yathrib'],
    verset_en: "If you do not aid him — Allah has already aided him when those who disbelieved had driven him out [of Makkah] as one of two, when they were in the cave and he said to his companion, 'Do not grieve; indeed Allah is with us.' (Surah At-Tawbah 9:40)",
    hadith_texte_en: "Narrated by 'A'ishah (may Allah be pleased with her): \"Then one day, unexpectedly, the Messenger of Allah ﷺ came to us at noon. Abu Bakr concealed him and the Messenger of Allah ﷺ said: 'Allah has given me permission to depart and emigrate.' Abu Bakr said: 'Companionship [on the journey], O Messenger of Allah?' He said: 'Companionship.'\" (Sahih al-Bukhari no. 3905)",
    parole_savant_en: "\"The Hijrah to Madinah was the pivotal turning point in Islamic history: it marks the beginning of the Islamic calendar established by 'Umar ibn al-Khattab (may Allah be pleased with him) upon consultation with the Companions. The Ansar (Helpers) earned their noble title by receiving and supporting the Muhajirun (Emigrants) in the most generous display of brotherhood the world had witnessed.\" (Ibn Kathir, Al-Bidayah wa Al-Nihayah, Vol. 3)",
    explication_en: "The Hijrah (migration) from Makkah to Madinah in 622 CE represents the foundational event of the Islamic state and the pivot of Islamic history. After thirteen years of persecution in Makkah — torture of the weak believers, economic boycott, assassination attempts against the Prophet ﷺ — Allah granted permission to emigrate to Yathrib (later renamed Madinah al-Munawwarah). The Prophet ﷺ and Abu Bakr al-Siddiq slipped away at night, sought refuge for three days in the cave of Thawr, then made their way to Madinah. The Ansar (the Helpers — the Muslims of Madinah from the tribes of Aws and Khazraj) welcomed the Muhajirun (the Emigrants from Makkah) with a brotherhood (mu'akhat) that the Prophet ﷺ established between each Emigrant and an Ansari, who would share his home and wealth. This event led to the establishment of the first Islamic calendar by 'Umar ibn al-Khattab (may Allah be pleased with him) by consensus of the Companions. In Madinah, the Prophet ﷺ established the first mosque (Masjid Quba'), then Masjid al-Nabawi, laid down the Constitution of Madinah, and organised the nascent Muslim community. The Hijrah teaches that emigration for the sake of preserving one's faith is an obligation when one is unable to practise it in one's land (cf. An-Nisa 4:97)."
  },
  {
    id: 'sirah_sahaba',
    domaine: 'sirah',
    sous_domaines: ['sahaba', 'khulafa'],
    keywords: ['compagnon', 'sahabi', 'abu bakr', 'umar', 'uthman', 'ali', 'khalifa'],
    verset_en: "Muhammad is the Messenger of Allah; and those with him are forceful against the disbelievers, merciful among themselves. You see them bowing and prostrating [in prayer], seeking bounty from Allah and [His] pleasure. (Surah Al-Fath 48:29)",
    hadith_texte_en: "Narrated by 'Abdullah ibn Mas'ud (may Allah be pleased with him): \"The best of people are those of my generation, then those who follow them, then those who follow them.\" (Sahih al-Bukhari no. 2652; Sahih Muslim no. 2533)",
    parole_savant_en: "\"The Companions of the Prophet ﷺ are the best of this Ummah after the Prophets, and the most honourable among them are the four rightly-guided caliphs in order: Abu Bakr, 'Umar, 'Uthman, then 'Ali (may Allah be pleased with them all). Loving them all and refraining from criticising their disputes is the way of Ahl al-Sunnah wal-Jama'ah.\" (Ibn Taymiyyah, Al-'Aqidah Al-Wasitiyyah)",
    explication_en: "The Companions (Sahabah) of the Prophet ﷺ are those who met him as believers and died as believers. They are the best generation of this Ummah, as explicitly affirmed by the Prophet ﷺ in the hadith of Ibn Mas'ud. Ahl al-Sunnah wal-Jama'ah holds several fundamental positions regarding them: (1) Loving all the Companions without exception and testifying to their uprightness ('adalah) in the transmission of the religion. (2) Refraining from criticising any Companion, particularly regarding the disputes that arose between them — the fitnah between 'Ali and Mu'awiyah is interpreted charitably: those who erred did so through ijtihad and not through malice or apostasy, and each side is given their proper rank. (3) Affirming the superiority of the four Rightly-Guided Caliphs (Al-Khulafa Al-Rashidun) in the following order: Abu Bakr al-Siddiq, 'Umar ibn al-Khattab, 'Uthman ibn 'Affan, then 'Ali ibn Abi Talib (may Allah be pleased with them all). (4) Recognising the special status of the ten Companions promised Paradise (Al-'Asharah Al-Mubashsharun), the people of Badr, the people of the Tree (Bay'at al-Ridwan), and the wives of the Prophet ﷺ (Mothers of the Believers). Cursing or belittling any Companion is a grave sin and a path of innovation (bid'ah) condemned by the Salaf."
  },
  {
    id: 'sirah_jihad',
    domaine: 'sirah',
    sous_domaines: ['jihad', 'ghazawat'],
    keywords: ['jihad', 'bataille', 'badr', 'uhud', 'khandaq', 'ghazwa'],
    verset_en: "And prepare against them whatever you are able of power and of steeds of war by which you may terrify the enemy of Allah and your enemy. (Surah Al-Anfal 8:60)",
    hadith_texte_en: "Narrated by Abu Hurayrah (may Allah be pleased with him): \"Whoever dies without having fought and without having resolved to fight has died upon a branch of hypocrisy.\" (Sahih Muslim no. 1910)",
    parole_savant_en: "\"Jihad in the way of Allah is the peak of Islam and the deed by which the Muslim defends his religion, his honour and his community. It is fard kifayah (collective obligation) when enemies do not invade Muslim lands, and becomes fard 'ayn (individual obligation) when they invade. The greatest jihad is jihad against the soul (jihad al-nafs) — commanding it to obey Allah and restraining it from sin.\" (Ibn al-Qayyim, Zad al-Ma'ad, Vol. 3)",
    explication_en: "Jihad (striving in the path of Allah) in its military dimension is a central institution of Islam established to defend the Muslim community and propagate the religion. The Battle of Badr (2 AH / 624 CE) was the first major confrontation: 313 poorly armed Muslims defeated an army of approximately 1,000 Quraysh warriors, a victory Allah attributed to His direct support (cf. Al-Anfal 8:9). The Battle of Uhud (3 AH) delivered a lesson in obedience: the Prophet ﷺ had stationed archers on a hill and forbidden them to leave their post; some disobeyed when they thought victory was assured, allowing the Qurayshi cavalry to outflank the Muslim army, resulting in the martyrdom of 70 Companions including Hamzah ibn 'Abd al-Muttalib. The Battle of the Trench (Al-Khandaq, 5 AH) demonstrated the strategy of Salman al-Farisi (digging a trench) to neutralise a coalition of 10,000 enemies. The Conquest of Makkah (8 AH) was the greatest victory without bloodshed: the Prophet ﷺ pardoned the Makkans generously, saying 'Go, for you are free.' Scholars distinguish four types of jihad: jihad al-nafs (against the soul), jihad al-Shaytan (against the devil), jihad against the hypocrites (by argument and proof), and jihad against enemies (by force when necessary)."
  },
];

// ============================================================
// TAFSIR (32-38)
// ============================================================
const RULES_TAFSIR_EN: RuleEn[] = [
  {
    id: 'tafsir_fatiha',
    domaine: 'tafsir',
    sous_domaines: ['fatiha'],
    keywords: ['fatiha', 'ouverture', 'al-fatiha', 'ihdina', 'sirat'],
    verset_en: "[All] praise is [due] to Allah, Lord of the worlds — The Entirely Merciful, the Especially Merciful — Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path — the path of those upon whom You have bestowed favour, not of those who have earned [Your] anger or of those who are astray. (Surah Al-Fatihah 1:1-7)",
    hadith_texte_en: "Narrated by Abu Hurayrah (may Allah be pleased with him): \"Allah, the Mighty and Majestic, said: 'I have divided the prayer between Myself and My servant into two halves, and My servant shall have what he asks for. When the servant says: \"All praise is due to Allah, Lord of the worlds\" — Allah says: My servant has praised Me...'\" (Sahih Muslim no. 395)",
    parole_savant_en: "\"Al-Fatihah is the greatest surah of the Quran: it encompasses the entire Quran in summary. It contains the affirmation of Tawhid of Lordship (\"Lord of the worlds\"), Tawhid of Names and Attributes (\"Al-Rahman Al-Rahim\"), Tawhid of Worship (\"It is You we worship\"), the principle of seeking help (\"and You we ask for help\"), supplication for guidance to the straight path, and the affirmation of the paths of Allah's favour and warning against going astray.\" (Ibn al-Qayyim, Madarij al-Salikin, Vol. 1)",
    explication_en: "Al-Fatihah (The Opening) is the greatest surah of the Quran, called Umm al-Quran (Mother of the Quran), Umm al-Kitab, and Al-Sab' Al-Mathani (the Seven Often-Repeated). It is obligatory to recite it in every unit (rak'ah) of prayer — its omission invalidates the prayer according to the majority (cf. hadith of 'Ubadah ibn al-Samit: 'There is no prayer for whoever does not recite the Opening of the Book' — Bukhari no. 756). The hadith qudsi narrated by Muslim (no. 395) reveals the unique interactive nature of this surah: each verse is answered by Allah. 'Al-Hamdulillahi Rabb al-'Alamin' is the affirmation of Tawhid al-Rububiyyah — Allah is the Lord, Master and Sustainer of all worlds. 'Al-Rahman Al-Rahim' are two Names from Tawhid al-Asma' wa al-Sifat. 'Maliki yawm al-din' (Sovereign of the Day of Recompense) motivates both fear and hope. 'Iyyaka na'budu wa iyyaka nasta'in' (It is You we worship and You we ask for help) is the core of Tawhid al-Uluhiyyah: worship exclusively for Allah and help sought exclusively from Him. 'Ihdina al-sirat al-mustaqim' (Guide us to the straight path) is the most important supplication. The 'straight path' is the path of those whom Allah has blessed — the prophets, the truthful (siddiqun), the martyrs and the righteous (cf. An-Nisa 4:69). The surah concludes with seeking refuge from the path of those who earned anger and those who went astray."
  },
  {
    id: 'tafsir_ayat_kursi',
    domaine: 'tafsir',
    sous_domaines: ['ayat_kursi'],
    keywords: ['ayat al-kursi', 'kursi', 'throne verse', 'al-baqarah 255'],
    verset_en: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great. (Surah Al-Baqarah 2:255)",
    hadith_texte_en: "Narrated by Abu Hurayrah (may Allah be pleased with him): \"When you go to bed, recite Ayat al-Kursi for there will be a guardian from Allah protecting you throughout the night, and Shaytan will not approach you until morning.\" (Sahih al-Bukhari no. 2311)",
    parole_savant_en: "\"Ayat al-Kursi is the greatest verse of the Quran because it contains the greatest concentration of Names, Attributes and descriptions of Allah — ten Names and Attributes in a single verse. It provides comprehensive protection when recited upon sleeping, and reciting it after every obligatory prayer is among the causes of entering Paradise.\" (Ibn Kathir, Tafsir Ibn Kathir, commentary on Al-Baqarah 2:255)",
    explication_en: "Ayat al-Kursi (Al-Baqarah 2:255) is explicitly identified by the Prophet ﷺ as the greatest verse of the Quran in the hadith of Ubayy ibn Ka'b (Muslim no. 810). It is a concentrated declaration of Tawhid al-Asma' wa al-Sifat, containing in a single verse: the declaration of absolute uniqueness ('no deity except Him'); the Attribute of Life (Al-Hayy); the Attribute of Self-Sustaining Maintenance (Al-Qayyum); the negation of drowsiness and sleep — affirming perfect, uninterrupted watchfulness; exclusive ownership of all in the heavens and earth; the restriction of intercession — it can only occur with His permission; His all-encompassing Knowledge; the inaccessibility of His Knowledge except what He wills to reveal; the immensity of the Kursi (footstool) which encompasses the heavens and earth; and the ease with which He preserves all of this. The verse concludes with two supreme Names: Al-'Aliyy (the Most High) and Al-'Azim (the Most Great). Among its virtues: reciting it after every obligatory prayer is among the causes of entering Paradise (hadith of Abu Umamah, Al-Nasa'i, authenticated by Al-Albani); reciting it before sleep ensures divine protection throughout the night (Bukhari no. 2311)."
  },
  {
    id: 'tafsir_ikhlas',
    domaine: 'tafsir',
    sous_domaines: ['ikhlas', 'surat_ikhlas'],
    keywords: ['ikhlas', 'samad', 'ahad', 'sourate 112'],
    verset_en: 'Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent. (Surah Al-Ikhlas 112:1-4)',
    hadith_texte_en: "Narrated by Abu Sa'id al-Khudri (may Allah be pleased with him): \"The Prophet ﷺ said about 'Say: He is Allah, the One': 'By the One in Whose hand is my soul, it is equivalent to one-third of the Quran.'\" (Sahih al-Bukhari no. 5013)",
    parole_savant_en: "\"Surah Al-Ikhlas is called 'the surah of sincerity' (al-ikhlas) because it purifies the description of Allah from everything that does not befit His Majesty. It contains the three types of Tawhid in summary: 'Ahad' (One) negates all partnership in Lordship; 'Al-Samad' (the Eternal Refuge) affirms the Attribute of absolute Sufficiency; 'lam yalid wa lam yulad' negates the attribute of fatherhood and sonship; 'wa lam yakun lahu kufuwan ahad' negates all similarity or equivalent.\" (Ibn Kathir, Tafsir Ibn Kathir)",
    explication_en: "Surah Al-Ikhlas (Chapter 112) is one of the most profound theological statements in the Quran, encapsulating the entire doctrine of Tawhid in four short verses. Its title Al-Ikhlas refers to purification — it purifies the description of Allah from all false attributions. 'Qul Huwa Allahu Ahad' (Say: He is Allah, the One): 'Ahad' in Arabic denotes absolute uniqueness — not merely numerical oneness (wahid) but incomparable singularity with no parallel or like whatsoever. This negates all forms of polytheism. 'Allahu Al-Samad' (Allah, the Eternal Refuge): Al-Samad is the One to whom all creation turns in need, the One who is entirely self-sufficient and upon whom all others depend. Ibn 'Abbas interpreted it as 'the master who is perfect in his mastership, the noble who is perfect in his nobility, the great who is perfect in his greatness.' 'Lam yalid wa lam yulad' (He neither begets nor is born): this directly refutes the Christian doctrine of divine fatherhood and sonship, and the pagan Arab belief that the angels are Allah's daughters. 'Wa lam yakun lahu kufuwan ahad' (nor is there to Him any equivalent): the ultimate affirmation of Divine transcendence, negating any equivalent, resemblance, or comparison. The Prophet ﷺ said it equals one-third of the Quran (Bukhari no. 5013) because the Quran covers three themes: Tawhid, stories (qasas), and rulings (ahkam) — and this surah covers the theme of Tawhid entirely."
  },
  {
    id: 'tafsir_nas_falaq',
    domaine: 'tafsir',
    sous_domaines: ["mu'awwidhat", 'falaq', 'nas'],
    keywords: ['falaq', 'nas', "mu'awwidhat", 'protection', 'refuge'],
    verset_en: "Say: I seek refuge in the Lord of daybreak — from the evil of that which He created — and from the evil of darkness when it settles — and from the evil of the blowers in knots — and from the evil of an envier when he envies. Say: I seek refuge in the Lord of mankind — the Sovereign of mankind — the God of mankind — from the evil of the retreating whisperer — who whispers [evil] into the breasts of mankind — from among the jinn and mankind. (Surahs Al-Falaq 113 and Al-Nas 114)",
    hadith_texte_en: "Narrated by 'A'ishah (may Allah be pleased with her): \"The Prophet ﷺ, every night when he went to bed, would cup his hands together and blow into them and recite into them 'Say: He is Allah, the One', 'Say: I seek refuge in the Lord of daybreak', and 'Say: I seek refuge in the Lord of mankind,' then he would wipe his hands over his body as much as he was able.\" (Sahih al-Bukhari no. 5748)",
    parole_savant_en: "\"The two Mu'awwidhatain (the two surahs of refuge) are the most complete and comprehensive of the Quran's protection formulas. Al-Falaq seeks refuge from external evils — created things, darkness, witchcraft and envy. Al-Nas seeks refuge from internal evil — the whispering of Shaytan and humans into the heart. Together they cover all the evil that can afflict the servant from without and within.\" (Ibn al-Qayyim, Al-Fawa'id)",
    explication_en: "The two Mu'awwidhatain — Surah Al-Falaq (113) and Surah Al-Nas (114) — are among the last surahs revealed and represent the Quran's most comprehensive formula of seeking divine protection. The Prophet ﷺ reportedly said to 'Uqbah ibn 'Amir: 'Shall I not teach you two surahs the like of which have not been revealed in the Torah, nor the Injil, nor the Psalms, nor the Quran?' (Ahmad and Al-Tirmidhi). Surah Al-Falaq seeks refuge in the 'Lord of daybreak' from four categories of evil: (1) 'the evil of that which He created' — general evil in creation; (2) 'the evil of darkness when it settles' — the dangers of the night; (3) 'the evil of the blowers in knots' (al-naffathat fi al-'uqad) — witchcraft and sorcery; (4) 'the evil of an envier when he envies' — the evil eye and envy (hasad). Surah Al-Nas specifically addresses the most dangerous of evils — the internal evil: the whispering (waswasah) of Shaytan who whispers into the heart and retreats when one remembers Allah. The refuge is sought in three of Allah's Names applied to 'mankind': 'Lord of mankind' (Rabb al-nas), 'Sovereign of mankind' (Malik al-nas), 'God of mankind' (Ilah al-nas), corresponding to the three types of Tawhid. Reciting these two surahs three times in the morning and evening (as narrated by Abu Dawud and Al-Tirmidhi) is among the most powerful forms of daily protection."
  },
  {
    id: 'tafsir_verse_light',
    domaine: 'tafsir',
    sous_domaines: ['ayat_nur', 'nur'],
    keywords: ['lumière', 'nour', 'nur', 'sourate 24', 'al-nur'],
    verset_en: "Allah is the Light of the heavens and the earth. The example of His light is like a niche within which is a lamp, the lamp is within glass, the glass as if it were a pearly [white] star lit from [the oil of] a blessed olive tree, neither of the east nor of the west, whose oil would almost glow even if untouched by fire. Light upon light. Allah guides to His light whom He wills. (Surah An-Nur 24:35)",
    hadith_texte_en: "Narrated by 'Abdullah ibn 'Abbas (may Allah be pleased with them): \"The Prophet ﷺ used to say: 'O Allah, place light in my heart, light in my hearing, light in my sight, light on my right, light on my left, light above me, light below me, light in front of me, light behind me, and increase for me light.'\" (Sahih Muslim no. 763)",
    parole_savant_en: "\"Ayat Al-Nur (the Verse of Light, An-Nur 24:35) is one of the most profound verses regarding Allah's Attribute of Al-Nur (the Light). Ibn 'Abbas said: it means 'the Guide of the inhabitants of the heavens and the earth.' The light of faith in the believer's heart — fed by the Quran, the prophetic guidance, the remembrance of Allah — is likened to this lamp that illuminates from within.\" (Ibn Kathir, Tafsir Ibn Kathir, commentary on An-Nur 24:35)",
    explication_en: "The Verse of Light (Ayat Al-Nur, An-Nur 24:35) is one of the most celebrated verses in the Quran for its depth of theological and spiritual meaning. Allah describes Himself as 'Al-Nur' (the Light) in the sense that He is the one who illuminates and guides — all light in creation derives from Him. The parable of the niche, lamp and glass is interpreted by scholars in several complementary ways: (1) The physical meaning: a lamp in a niche gives light in all directions — this is how the divine guidance radiates to fill the universe. (2) The spiritual meaning (the most common interpretation among the Salaf): the 'niche' is the heart of the believer; the 'lamp' is the light of the Quran and faith within it; the 'glass' is the purified heart that amplifies and protects this light; the 'blessed olive tree' is the prophetic wisdom; 'neither of the east nor of the west' means the pure religion, not confined to any one direction or culture. 'Light upon light' (nurun 'ala nur) refers to the light of the Quran combined with the light of prophetic guidance combined with the light of divine tawfiq (success), each reinforcing the other. Allah guides to this light whom He wills — a reminder of the grace and will of Allah in granting guidance, and the responsibility of the servant to seek it sincerely. The hadith of Ibn 'Abbas demonstrates the Prophet ﷺ's constant seeking of this light in every faculty and limb."
  },
  {
    id: 'tafsir_isra_miraj',
    domaine: 'tafsir',
    sous_domaines: ['isra', 'miraj'],
    keywords: ['isra', 'mi\'raj', 'miraj', 'nuit', 'ascension'],
    verset_en: "Exalted is He who took His Servant by night from Al-Masjid Al-Haram to Al-Masjid Al-Aqsa, whose surroundings We have blessed, to show him of Our signs. Indeed, He is the Hearing, the Seeing. (Surah Al-Isra 17:1)",
    hadith_texte_en: "Narrated by Anas ibn Malik (may Allah be pleased with him): \"The Messenger of Allah ﷺ said: 'I was brought the Buraq... I was then taken to Jerusalem and I tied it to the ring used by the prophets. I then entered the mosque and prayed two rak'ahs in it, then I came out and Jibril brought me a vessel of wine and a vessel of milk. I chose the milk, and Jibril said: You have chosen the fitrah (natural disposition)...'\" (Sahih Muslim no. 162)",
    parole_savant_en: "\"The Isra (Night Journey) and Mi'raj (Ascension) are established by the Quran and Mutawatir Sunnah; denying them is disbelief. The Night Journey took place with the body and soul of the Prophet ﷺ while he was awake, according to the correct opinion of Ahl al-Sunnah. During it, the five daily prayers were prescribed upon the Ummah as a gift from Allah — a reduction from fifty to five, while retaining the reward of fifty.\" (Ibn Kathir, Tafsir Ibn Kathir, commentary on Al-Isra 17:1)",
    explication_en: "The Night Journey (Al-Isra) and Ascension (Al-Mi'raj) are among the greatest miracles of the Prophet Muhammad ﷺ, confirmed both by the Quran (Al-Isra 17:1 for the earthly journey; An-Najm 53:1-18 for the heavenly ascension) and by mass-transmitted (mutawatir) hadiths. During the Isra, the Prophet ﷺ was transported on the Buraq (a heavenly mount) from Al-Masjid Al-Haram in Makkah to Al-Masjid Al-Aqsa in Jerusalem, where he led all the prophets in prayer — symbolising his leadership over all of prophethood. During the Mi'raj, he ascended through the seven heavens, meeting prophets at each level (Adam, Yahya and 'Isa, Yusuf, Idris, Harun, Musa, Ibrahim). He was then brought to Sidrat al-Muntaha (the Lote Tree of the Utmost Boundary) beyond which no creation can pass, and received the command of the five daily prayers. The Quraysh rejected this account, and it became a test for the Companions: Abu Bakr al-Siddiq believed without hesitation, earning his title 'Al-Siddiq' (the Truthful Believer). The station Al-Aqsa is the third holiest site in Islam after Al-Masjid Al-Haram and Al-Masjid Al-Nabawi, and liberating and maintaining access to it is a duty of the Muslim Ummah. The Mi'raj confirms the reality of the heavens and of what lies beyond material existence, and its primary gift — the five daily prayers — remains the daily spiritual ascension (mi'raj) of every believer."
  },
];

// ============================================================
// GENERIC FALLBACKS (39-43)
// ============================================================
const RULES_GENERIC_EN: RuleEn[] = [
  {
    id: 'generic_aqida',
    domaine: 'aqida',
    verset_en: 'The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers. (Surah Al-Baqarah 2:285)',
    hadith_texte_en: "Narrated by 'Umar ibn al-Khattab: \"[Iman is] that you believe in Allah, His angels, His Books, His messengers, the Last Day, and that you believe in divine decree, both its good and its evil.\" (Sahih Muslim no. 8 — Hadith of Jibril)",
    parole_savant_en: "\"The correct 'aqidah is that of the Salaf: affirming what Allah has affirmed for Himself and what His Messenger ﷺ affirmed for Him, without tahrif (distortion), ta'til (denial), takyif (modality questioning), or tamthil (likening to creation).\" (Ibn Taymiyyah, Al-'Aqidah Al-Wasitiyyah)",
    explication_en: "Islamic creed ('aqidah) is the foundation of all deeds. Without a correct belief, deeds carry no weight before Allah. The six pillars of faith — belief in Allah, His angels, His Books, His messengers, the Last Day, and in divine decree (qadar) — summarise iman according to the Hadith of Jibril (Muslim no. 8). Ahl al-Sunnah wal-Jama'ah holds a balanced position between extremes: neither the Mu'tazilah who deny certain Divine Attributes through rationalism, nor the Mushabbiha who liken Allah to His creatures, nor the Khawarij who excommunicate for any major sin, nor the Murji'ah who trivialise deeds by saying that faith of the heart alone is sufficient. The way of the Salaf is to follow the Quran and Sunnah according to their apparent meaning befitting Divine Majesty, in conformity with the understanding of the first three generations (Sahabah, Tabi'un, Atba' al-Tabi'in) — the generations of whom the Prophet ﷺ attested the best religious quality (Bukhari no. 2652, Muslim no. 2533). This belief is universal, authentically transmitted, and preserves the Muslim from innovations and deviations that have appeared throughout the centuries."
  },
  {
    id: 'generic_fiqh',
    domaine: 'fiqh',
    verset_en: 'O you who have believed, obey Allah and obey the Messenger and those in authority among you. And if you disagree over anything, refer it to Allah and the Messenger. (Surah An-Nisa 4:59)',
    hadith_texte_en: "Narrated by Ibn 'Umar (may Allah be pleased with him): \"Islam is built on five [pillars]: testifying that there is no god worthy of worship except Allah and that Muhammad is the Messenger of Allah, establishing prayer, paying zakah, performing Hajj, and fasting Ramadan.\" (Sahih al-Bukhari and Sahih Muslim)",
    parole_savant_en: "\"Fiqh is the detailed understanding of practical Islamic rulings derived from their detailed evidences. The four Sunni legal schools (Hanafi, Maliki, Shafi'i, Hanbali) are all valid; their divergence on details is a mercy, their unity on fundamentals is a blessing.\" (Ibn 'Uthaymin, Sharh Al-Mumti')",
    explication_en: "Islamic jurisprudence (fiqh) is the science that governs the practical implementation of religion in daily life: acts of worship ('ibadat), transactions (mu'amalat), personal status (ahwal shakhsiyyah), and penal code ('uqubat). It relies on the revealed sources (Quran, Sunnah) and the consensual methodologies (ijma', qiyas). The divergences between the legal schools concern matters of interpretation, never the fundamentals; they reflect the richness of Islamic methodology and constitute a mercy for the community. For the ordinary Muslim, following the dominant school of his region or country is permitted and even recommended to avoid confusion. For the qualified scholar, the rule is to follow the strongest evidence among the positions. In any case, the fundamental principle is obedience to Allah and His Messenger as indicated by verse An-Nisa 4:59, and returning to the revealed texts in case of disagreement."
  },
  {
    id: 'generic_akhlaq',
    domaine: 'akhlaq',
    verset_en: 'And indeed, you are of a great moral character. (Surah Al-Qalam 68:4)',
    hadith_texte_en: "Narrated by Abu Hurayrah (may Allah be pleased with him): \"I was only sent to perfect noble character.\" (Musnad Ahmad no. 8952; authenticated by Al-Albani)",
    parole_savant_en: "\"Good character is half of the religion: through it, the servant reaches the rank of the one who fasts and keeps night vigil, as the Prophet ﷺ affirmed. It is acquired through effort, the company of the righteous, and the application of prophetic models.\" (Ibn al-Qayyim, Madarij al-Salikin)",
    explication_en: "Islamic character (akhlaq) constitutes the practical culmination of faith. The Prophet ﷺ summarised his mission with the hadith: 'I was only sent to perfect noble character.' Islam is not merely an abstract belief nor a set of rituals: it is a profound transformation of character and behaviour. The Prophet ﷺ himself was described by Allah as being 'of a great moral character' (Al-Qalam 68:4), and his wife 'A'ishah summarised his character by saying: 'His character was the Quran' (narrated by Muslim no. 746). Noble character encompasses: truthfulness (sidq), trustworthiness (amanah), modesty (haya'), patience (sabr), generosity (jud), humility (tawadu'), forgiveness ('afw), justice ('adl), mercy (rahmah), and control of anger (kazm al-ghayz). Their opposites — lying, betrayal, immodesty, bad character — weigh heavily in the scale of deeds. The Prophet ﷺ said: 'Nothing is heavier in the scale of the believer on the Day of Resurrection than good character' (Abu Dawud no. 4799, Tirmidhi no. 2002, authenticated). The acquisition of noble character comes through knowledge, imitating prophetic models, keeping the company of the virtuous, and constant struggle against the soul (mujahada)."
  },
  {
    id: 'generic_sirah',
    domaine: 'sirah',
    verset_en: 'There has certainly been for you in the Messenger of Allah an excellent pattern for anyone whose hope is in Allah and the Last Day and [who] remembers Allah often. (Surah Al-Ahzab 33:21)',
    hadith_texte_en: "Narrated by 'A'ishah (may Allah be pleased with her), when asked about the Prophet's character ﷺ: \"His character was the Quran.\" (Sahih Muslim no. 746)",
    parole_savant_en: "\"Knowing the Seerah (biography) of the Prophet ﷺ is an obligation for every Muslim: it is the detailed explanation of the Quran in action, the living model for all of humanity, and the source from which we draw the understanding of Islamic rulings and values. Whoever does not know the Seerah does not know the context of the revelation nor the meanings of the text.\" (Ibn al-Qayyim, Zad al-Ma'ad, Introduction)",
    explication_en: "The Seerah (prophetic biography) is the most comprehensive biographical study in human history, preserved with unmatched precision through the science of hadith. Allah commands us to follow the Messenger ﷺ as the perfect model: verse Al-Ahzab 33:21 makes this following an obligation for 'whoever hopes in Allah and the Last Day.' The Seerah can be divided into major phases: the Makkan period (610-622 CE), characterised by the call to Tawhid, persecution of the believers, and patient endurance; and the Medinan period (622-632 CE), characterised by community building, legislation, jihad and the expansion of Islam. The Seerah teaches: how to call to Allah with wisdom (cf. An-Nahl 16:125); how to respond to persecution with patience; how to govern with justice; how to treat enemies with mercy (the Conquest of Makkah); how to maintain family ties and friendships; and how to face death with serenity (the final sermon, the final illness). Studying the Seerah is also a remedy for the heart: it generates love for the Prophet ﷺ, which is itself a condition of complete faith (cf. the hadith: 'None of you will have faith until I am more beloved to him than his children, his father and all of humanity' — Bukhari no. 14)."
  },
  {
    id: 'generic_tafsir',
    domaine: 'tafsir',
    verset_en: 'Indeed, it is We who sent down the Quran and indeed, We will be its guardian. (Surah Al-Hijr 15:9)',
    hadith_texte_en: "Narrated by 'Uthman ibn 'Affan (may Allah be pleased with him): \"The best of you are those who learn the Quran and teach it.\" (Sahih al-Bukhari no. 5027)",
    parole_savant_en: "\"Tafsir is the most honourable of the Islamic sciences because its subject is the Word of Allah. The correct methodology in tafsir is: (1) interpreting the Quran by the Quran itself; (2) then by the authentic Sunnah of the Prophet ﷺ; (3) then by the statements of the Sahabah; (4) then by the statements of the Tabi'un; (5) then by the Arabic language; and finally using juristic reasoning (ijtihad) within its proper conditions.\" (Ibn Kathir, Introduction to Tafsir Ibn Kathir)",
    explication_en: "The science of tafsir (Quranic exegesis) is the noblest of the Islamic sciences because its subject is the direct Word of Allah. The Prophet ﷺ confirmed: 'The best of you are those who learn the Quran and teach it' (Bukhari no. 5027). The methodology of tafsir follows a strict hierarchy: the first and best method is interpreting the Quran by the Quran itself — Allah explains in one place what He has stated briefly in another. The second method is by the Sunnah of the Prophet ﷺ who was commanded to clarify the revelation (cf. An-Nahl 16:44). The third method is by the statements of the Sahabah who witnessed the revelation in its context. The fourth is by the statements of the Tabi'un. The fifth is by the Arabic language in which the Quran was revealed. Any interpretation contradicting these foundations is rejected, even if it appears linguistically valid. The Quran was revealed in seven recitation modes (ahruf) as a mercy to facilitate its recitation, and the ten canonical recitations (qira'at) are all authentic. The Quran is the eternal miracle of Islam: it challenges humanity to produce even one surah like it (Al-Baqarah 2:23) and affirms its preservation by Allah Himself (Al-Hijr 15:9). Its recitation is an act of worship with great rewards, its memorisation an honour, and its implementation the highest human achievement."
  },
];

const ALL_RULES_EN: RuleEn[] = [
  ...RULES_AQIDA_EN,
  ...RULES_FIQH_EN,
  ...RULES_AKHLAQ_EN,
  ...RULES_SIRAH_EN,
  ...RULES_TAFSIR_EN,
  ...RULES_GENERIC_EN,
];

// ============================================================
// MATCHING ENGINE (identical logic to enrich_dalil_v2.ts)
// ============================================================

interface QuestionRow {
  id: number;
  domaine: string;
  sous_domaine: string | null;
  texte_fr: string | null;
}

function matchRuleEn(q: QuestionRow): RuleEn | undefined {
  const sd = (q.sous_domaine || '').toLowerCase();
  const texte = (q.texte_fr || '').toLowerCase();

  // 1) Priority: match (domaine + sous_domaine)
  for (const r of ALL_RULES_EN) {
    if (r.domaine !== q.domaine) continue;
    if (r.sous_domaines && sd && r.sous_domaines.some(s => s.toLowerCase() === sd)) {
      return r;
    }
  }
  // 2) match (domaine + keywords present in texte_fr)
  for (const r of ALL_RULES_EN) {
    if (r.domaine !== q.domaine) continue;
    if (r.keywords && r.keywords.some(k => texte.includes(k.toLowerCase()))) {
      return r;
    }
  }
  // 3) fallback: generic rule for the domain (no keywords, no sous_domaines)
  for (const r of ALL_RULES_EN) {
    if (r.domaine === q.domaine && !r.keywords && !r.sous_domaines) {
      return r;
    }
  }
  return undefined;
}

export async function enrichDalilEn(client: Client): Promise<void> {
  console.log('  Enrichissement ANGLAIS du dalil...');

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
    const rule = matchRuleEn(q);
    if (!rule) continue;

    const count = perRuleCount.get(rule.id) || 0;
    if (count >= MAX_PER_RULE) continue;
    perRuleCount.set(rule.id, count + 1);

    await client.query(
      `UPDATE questions SET
        verset_en        = $1,
        hadith_texte_en  = $2,
        parole_savant_en = $3,
        explication_en   = $4
       WHERE id = $5`,
      [
        rule.verset_en        || null,
        rule.hadith_texte_en  || null,
        rule.parole_savant_en || null,
        rule.explication_en,
        q.id,
      ]
    );
    enriched++;
  }

  console.log(`  ✓ Dalil EN enrichi pour ${enriched} questions (sur ${questions.length}).`);
  console.log(`  ✓ ${ALL_RULES_EN.length} règles thématiques EN actives.`);
}
