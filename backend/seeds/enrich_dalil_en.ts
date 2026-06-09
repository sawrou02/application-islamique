import { Client } from 'pg';

/**
 * enrichDalilEn — Enrichissement anglais (EN) du dalil détaillé.
 *
 * Stratégie : mêmes règles thématiques (par id) que enrich_dalil_v2.ts,
 * appliquées sur les questions DEJA enrichies par la v2 (matching par
 * (verset_ref, hadith_ref) ou directement par (domaine, sous_domaine, keywords)
 * pour rester cohérent.
 *
 * Règle absolue : si la traduction d'un hadith ou d'un verset n'est pas
 * authentique (Sahih International pour Coran, Darussalam pour Bukhari/Muslim,
 * ou équivalent reconnu), le champ reste à NULL — on n'invente rien.
 *
 * Pour les paroles de savants et explications, traduction fidèle.
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

const RULES_EN: RuleEn[] = [
  // ============================================================
  // AQIDA
  // ============================================================
  {
    id: 'tawhid_uluhiyya',
    domaine: 'aqida',
    sous_domaines: ['tawhid'],
    keywords: ['tawhid', 'unicité', 'shahada', 'adorer', 'adoration', 'ilah'],
    verset_en: 'Say, "He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, Nor is there to Him any equivalent."',
    hadith_texte_en: 'Narrated Ibn \'Umar (may Allah be pleased with him): "I have been ordered to fight against the people until they testify that none has the right to be worshipped but Allah and that Muhammad is the Messenger of Allah."',
    parole_savant_en: '"The Tawhid with which the Messengers were sent and with which the Books were revealed is Tawhid al-Uluhiyya, which encompasses Tawhid of Lordship (Rububiyya). Whoever acknowledges Allah\'s Lordship alone without devoting worship to Him is not a Muslim, for the polytheists of Quraysh themselves acknowledged that Allah was the Creator." — Ibn Taymiyyah (661–728 AH), Majmu\' al-Fatawa, vol. 1',
    explication_en: 'Tawhid is the absolute foundation of Islam: it is the common message of all the prophets, from Adam to Muhammad (peace be upon him). The scholars of Ahl al-Sunnah wa\'l-Jama\'ah, following Ibn Taymiyyah and Ibn al-Qayyim, divide it into three inseparable categories. First, Tawhid al-Rububiyyah: recognising that Allah is the sole Creator, Provider, and Master of the universe; this category was admitted even by the polytheists of Makkah, as Allah reminds us in Surah Luqman 31:25. Second, Tawhid al-Uluhiyyah (Tawhid of worship): devoting every form of worship — prayer, supplication, sacrifice, vows, fear, hope, reliance — to Allah alone. It is upon this category that the struggle of the prophets focused. Third, Tawhid al-Asma\' wa al-Sifat: affirming for Allah the Names and Attributes He has given Himself in the Qur\'an and which His Messenger (peace be upon him) confirmed for Him, without distortion (tahrif), without negation (ta\'til), without asking about the modality (takyif), and without likening them to creation (tamthil). The shahada "La ilaha illa Allah" precisely means "there is no deity worthy of worship except Allah": it is the negation of every object of worship besides Him and the exclusive affirmation of His right to be worshipped. No deed is accepted without this Tawhid, and shirk is the only sin Allah does not forgive without repentance (cf. al-Nisa 4:48).',
  },
  {
    id: 'shirk',
    domaine: 'aqida',
    sous_domaines: ['tawhid'],
    keywords: ['shirk', 'associationnisme', 'associer', 'polythéisme', 'idole'],
    verset_en: 'Indeed, Allah does not forgive association with Him, but He forgives what is less than that for whom He wills. And he who associates others with Allah has certainly fabricated a tremendous sin.',
    hadith_texte_en: 'Narrated Ibn Mas\'ud (may Allah be pleased with him): "I asked the Prophet (peace be upon him): Which sin is the greatest in Allah\'s sight? He said: That you set up a rival to Allah while He alone created you."',
    parole_savant_en: '"Shirk is divided into two: major shirk, which expels one from Islam and renders one eternal in Hell if one dies upon it (such as invoking the dead, prostrating to an idol, sacrificing to other than Allah); and minor shirk, such as swearing by other than Allah or riya\' (subtle ostentation), which does not expel from the religion but remains graver than ordinary major sins." — Ibn Baz (1330–1420 AH), Majmu\' al-Fatawa wa Maqalat',
    explication_en: 'Shirk is the only sin Allah has declared unforgivable without repentance: it is the absolute antithesis of Tawhid. The scholars distinguish three levels. Shirk akbar (major) is to devote a form of worship to other than Allah: invoking the dead, asking saints for what only Allah can grant, sacrificing in another\'s name, swearing religious allegiance to a false god. Whoever dies committing major shirk without repenting remains eternally in Hell, his deeds nullified (cf. al-Zumar 39:65). Shirk asghar (minor) covers acts the Prophet (peace be upon him) called shirk without expelling one from Islam: riya\' (doing deeds to be seen by people — hadith of Mahmud ibn Labid reported by Ahmad), swearing by other than Allah ("Whoever swears by other than Allah has disbelieved or committed shirk", al-Tirmidhi). Shirk khafi (hidden) refers to impure inner motivations. To combat every trace of shirk is the very meaning of the testimony "La ilaha illa Allah": negation (la ilaha) followed by affirmation (illa Allah). Ibn al-Qayyim explains in Madarij al-Salikin that total sincerity (ikhlas) is the cure for hidden shirk, and that the servant must constantly examine his heart.',
  },
  {
    id: 'asma_sifat',
    domaine: 'aqida',
    sous_domaines: ['asma_sifat', 'asma_wa_sifat'],
    keywords: ['noms', 'attributs', 'asma', 'sifat'],
    verset_en: 'There is nothing like unto Him, and He is the All-Hearing, the All-Seeing.',
    hadith_texte_en: 'Narrated Abu Hurayrah (may Allah be pleased with him): "Allah has ninety-nine Names — one hundred minus one — whoever enumerates them will enter Paradise."',
    parole_savant_en: '"Our way regarding Allah\'s Names and Attributes is to affirm what Allah affirmed for Himself and what His Messenger (peace be upon him) affirmed for Him, without distortion (tahrif), without negation (ta\'til), without asking about modality (takyif), and without likening Him to creation (tamthil)." — Ibn Taymiyyah (661–728 AH), al-\'Aqidah al-Wasitiyyah',
    explication_en: 'The way of the Salaf (pious predecessors) concerning Allah\'s Names and Attributes rests upon the foundational verse al-Shura 42:11, which combines the negation of any resemblance ("There is nothing like unto Him") with the affirmation of attributes ("And He is the All-Hearing, the All-Seeing"). Ahl al-Sunnah wa\'l-Jama\'ah affirms all the Names and Attributes mentioned in the Qur\'an and authentic Sunnah in their apparent meaning befitting the divine Majesty, without falling into four deviations: tahrif (distorting the meaning, as the Jahmiyyah and Mu\'tazilah do when they interpret "the Hand of Allah" as "His power"); ta\'til (outright denial of the attributes); takyif (trying to imagine the modality, as in asking "how is His Hand?" — Imam Malik famously answered: "Al-istiwa\' is known, the how is unknown, believing in it is obligatory, and asking about it is an innovation"); tamthil (likening the attributes to those of creatures). The 99 Names are not a closed list: they are the most known, but other Names exist which Allah has kept in the knowledge of the Unseen (cf. hadith of Ibn Mas\'ud reported by Ahmad). "Enumerating" (ihsa\') these Names comprises, according to Ibn al-Qayyim, three degrees: memorising them, understanding their meanings, and invoking Allah by them (cf. al-A\'raf 7:180).',
  },
  {
    id: 'qadar',
    domaine: 'aqida',
    sous_domaines: ['qadar', 'arkan_iman'],
    keywords: ['qadar', 'destin', 'prédestination', 'décret'],
    verset_en: 'Indeed, all things We created with predestination.',
    hadith_texte_en: 'Narrated \'Umar ibn al-Khattab (may Allah be pleased with him): "(Iman is) that you believe in Allah, His angels, His Books, His Messengers, the Last Day, and that you believe in divine decree, both its good and its evil."',
    parole_savant_en: '"Belief in al-qadar rests upon four inseparable degrees: Allah\'s eternal Knowledge encompassing all things; His Writing of every decree on the Preserved Tablet fifty thousand years before the creation of the heavens and the earth; His effective Will, nothing occurring without His willing it; and His Creation of all things, including the actions of His servants." — Ibn al-Qayyim (691–751 AH), Shifa\' al-\'Alil',
    explication_en: 'Belief in predestination (al-qadar) is the sixth pillar of faith, made explicit in the famous hadith of Jibril. Ahl al-Sunnah wa\'l-Jama\'ah holds a balanced position between two condemned extremes: that of the Qadariyyah (the Mu\'tazilah) who deny al-qadar and claim that the servant\'s acts are created independently of Allah\'s will; and that of the Jabriyyah who claim the servant is wholly compelled with no will of his own. The Salaf affirm four degrees: Allah\'s Knowledge (\'Ilm) — He eternally knows all that was, is, and will be; His Writing (Kitabah) — He inscribed every decree on the Lawh Mahfuz (cf. hadith of \'Abdullah ibn \'Amr, Muslim no. 2653: "Allah wrote the decrees fifty thousand years before creating the heavens and the earth"); His Will (Mashi\'ah) — nothing happens in the universe without His Will; His Creation (Khalq) — He is the Creator of all things, including the actions of His servants, which nonetheless remain genuinely their own acts through their free choice (ikhtiyar). The servant thus has a real will that engages his responsibility, but it operates under the encompassing divine Will (cf. al-Takwir 81:29). Belief in qadar settles the heart: the believer gives thanks in ease and patiently endures in trial, knowing that everything is measured by divine Wisdom.',
  },
  {
    id: 'iman_arkan',
    domaine: 'aqida',
    sous_domaines: ['iman', 'arkan_iman'],
    keywords: ['piliers de la foi', 'arkan', 'foi', 'imân', 'iman'],
    verset_en: 'The Messenger has believed in what was revealed to him from his Lord, and so have the believers. All of them have believed in Allah and His angels and His Books and His Messengers.',
    hadith_texte_en: 'Narrated \'Umar ibn al-Khattab: "Iman is to believe in Allah, His angels, His Books, His Messengers, the Last Day, and to believe in divine decree, both its good and its evil."',
    parole_savant_en: '"Iman according to Ahl al-Sunnah is: speech of the tongue, belief of the heart, and action of the limbs; it increases through obedience and decreases through disobedience. This definition distinguishes them from the Murji\'ah (who restrict iman to the heart) and from the Khawarij (who expel from faith on account of any major sin)." — Ibn Taymiyyah, Kitab al-Iman',
    explication_en: 'The pillars of faith (arkan al-iman) are six, established by the hadith of Jibril (Muslim no. 8): belief in Allah, in His angels, in His revealed Books, in His Messengers, in the Last Day, and in divine decree both its good and its evil. Ahl al-Sunnah wa\'l-Jama\'ah defines iman as "speech, belief, and action": professing with the tongue, holding firm conviction in the heart, and putting into practice through the limbs. This tripartite definition, transmitted by Salaf such as al-Awza\'i, Sufyan al-Thawri, and Ahmad ibn Hanbal, distinguishes the People of the Sunnah from two errant groups: the Murji\'ah, who reduce iman to belief of the heart alone and hold that no sin harms faith so long as one declares the shahada; and the Khawarij, who excommunicate the Muslim for any major sin. The correct position is that iman increases through obedience and decreases through disobedience (cf. al-Anfal 8:2: "when His verses are recited to them, it increases their faith"), but that a sin — even a major one — does not expel the Muslim from Islam so long as he does not deem its prohibition lawful. Believing in the angels entails recognising that they are creatures of light (hadith of \'A\'ishah, Muslim no. 2996), named and tasked; believing in the Books entails believing in their revelation while knowing that the Qur\'an abrogates and confirms what preceded it.',
  },
  {
    id: 'akhira',
    domaine: 'aqida',
    sous_domaines: ['akhira', 'ashratu_al_sa\'a'],
    keywords: ['paradis', 'enfer', 'jannah', 'jahannam', 'jour dernier', 'résurrection', 'qiyama', 'akhira'],
    verset_en: 'So whoever does an atom\'s weight of good will see it, and whoever does an atom\'s weight of evil will see it.',
    hadith_texte_en: 'Narrated Abu Hurayrah (may Allah be pleased with him): The Prophet (peace be upon him) said that Allah said: "I have prepared for My righteous servants what no eye has seen, no ear has heard, and what no human heart has ever conceived."',
    parole_savant_en: '"Paradise and Hell are presently created and existing, as the authentic proofs have confirmed. They will never perish: Paradise is eternal by the grace of Allah, and Hell is eternal for the disbelievers. This is the position of Ahl al-Sunnah wa\'l-Jama\'ah against the Jahmiyyah who claim their annihilation." — Ibn Taymiyyah, al-\'Aqidah al-Wasitiyyah',
    explication_en: 'Belief in the Last Day encompasses everything that follows death: the trial of the grave with its delights or its torments (cf. hadith of al-Bara\' ibn \'Azib, Ahmad and Abu Dawud), the blowing of the horn by the angel Israfil, the resurrection of the bodies, the gathering (mahshar), the handing over of the records, the weighing (mizan), the crossing of the bridge (sirat) over the Hellfire, the great intercession of the Prophet (peace be upon him), the Pond (hawd), and finally entry into Paradise or into Hell. Allah has described Paradise in dozens of verses: rivers of milk, of honey, of water and of pure wine (cf. Muhammad 47:15), eternal dwellings, and above all the vision (ru\'yah) of the Face of Allah the Most High — the greatest of rewards, affirmed by Ahl al-Sunnah against the Mu\'tazilah and partially against the Ash\'aris (cf. al-Qiyamah 75:22–23: "On that Day there will be radiant faces, looking at their Lord"). As for Hell, it is an abode of eternal punishment for the disbelievers; the Muslim who enters it for his major sins will come out through intercession and divine mercy. Belief in the Hereafter transforms life in this world: the believer acts knowing nothing is lost, not even an atom\'s weight of good or evil (cf. al-Zalzalah 99:7–8).',
  },
  // Prophetologie / ghayb : explication only (verset Quran translation OK)
  {
    id: 'prophetologie',
    domaine: 'aqida',
    sous_domaines: ['prophetologie'],
    keywords: ['prophète', 'rasul', 'nabi', 'messager', 'rusul'],
    verset_en: 'Muhammad is not the father of any of your men, but he is the Messenger of Allah and the Seal of the Prophets.',
    hadith_texte_en: 'Narrated Abu Hurayrah (may Allah be pleased with him): "My example in relation to the prophets who came before me is that of a man who built a house, beautified it and completed it, except for the place of one brick in a corner. People walk around it and marvel, saying: \'If only this missing brick were placed!\' I am that brick, and I am the Seal of the Prophets."',
    parole_savant_en: '"The prophets were sent by Allah to every community (cf. al-Nahl 16:36). To believe in them in general is obligatory; to believe in those named in the Qur\'an and Sunnah is obligatory in detail. The Messengers (Rusul) received a book or a new law; the prophets (Anbiya\') confirmed the previous law." — Ibn Kathir, Tafsir, commentary on al-Nisa 4:164',
    explication_en: 'Belief in the prophets is one of the pillars of iman. Allah sent every community a warner (cf. Fatir 35:24); the Qur\'an names 25 prophets, but according to the hadith of Abu Dharr (Ahmad) their total number exceeds one hundred and twenty-four thousand, of whom three hundred and thirteen were Messengers. The five Ulu al-\'Azm (those of firm resolve) are Nuh, Ibrahim, Musa, \'Isa and Muhammad (peace be upon them all) — mentioned together in al-Ahzab 33:7 and al-Shura 42:13. The Muslim must believe that all the prophets brought the same fundamental message of Tawhid (cf. al-Anbiya\' 21:25: "And We sent not before you any messenger except that We revealed to him that there is no deity except Me, so worship Me"). They are infallible (\'ismah) in conveying the divine message, free from shirk and major sins; minor errors of judgement attributed to them are immediately corrected by revelation. Muhammad (peace be upon him) is the Seal of the Prophets (Khatam al-Nabiyyin): no prophet will come after him. Whoever claims prophethood after him is an impostor, and whoever believes in such an impostor leaves Islam — as the Community unanimously recognised concerning Musaylimah, and later concerning the Qadiyani/Ahmadi sects. The mission of Muhammad (peace be upon him) is universal, addressed to all humans and jinn until the End of Times (cf. Saba\' 34:28).',
  },
  {
    id: 'ghayb',
    domaine: 'aqida',
    sous_domaines: ['ghayb'],
    keywords: ['inconnu', 'ghayb', 'invisible', 'occulte'],
    verset_en: 'Say: "None in the heavens and the earth knows the unseen except Allah."',
    parole_savant_en: '"The knowledge of the Unseen (al-ghayb) belongs exclusively to Allah. Whoever claims to know it — soothsayer, astrologer, fortune-teller — is a liar, and to believe him expels one from Islam, according to the hadith of Abu Hurayrah: \'Whoever goes to a soothsayer and believes what he says has disbelieved in what was revealed to Muhammad (peace be upon him).\'" — Ibn Baz, Majmu\' al-Fatawa',
    explication_en: 'The Unseen (al-ghayb) refers to everything that escapes the senses and human reason: the essence of Allah, the angels, the future destiny, the hour of death, the nature of the soul, and so on. The Qur\'an categorically affirms that its exclusive knowledge belongs to Allah (cf. al-An\'am 6:59: "And with Him are the keys of the Unseen; none knows them except Him"). The prophets know of the unseen only what Allah reveals to them (cf. al-Jinn 72:26–27). This settles several crucial issues: (1) To believe soothsayers, fortune-tellers, astrologers, card-readers or marabouts amounts to associating them with Allah in an attribute that is His alone — it is shirk if one asserts that they know by themselves; it is grave disobedience if one consults without believing (hadith of Safiyyah, Muslim no. 2230: "The prayer of one who consults a soothsayer is not accepted for forty days"). (2) Truthful dreams (ru\'ya) may contain glimpses of the unseen by divine grace, but they cannot ground a religious ruling. (3) Believing in the signs of the Hour (ashrat al-sa\'ah) — the appearance of the Mahdi, the descent of \'Isa, the emergence of the Dajjal, the coming out of the Beast, the rising of the sun from the West — is part of the obligatory belief in the unseen, without speculating on its date. The believer worships Allah trusting that He alone holds the Unseen and that it suffices His creature to conform to revelation.',
  },
  // ============================================================
  // FIQH
  // ============================================================
  {
    id: 'salat_obligation',
    domaine: 'fiqh',
    sous_domaines: ['salat'],
    keywords: ['prière', 'salat', 'salah'],
    verset_en: 'And establish prayer and give zakah and bow with those who bow.',
    hadith_texte_en: 'Narrated Buraydah (may Allah be pleased with him): "The covenant between us and them (the disbelievers) is the prayer. Whoever abandons it has disbelieved."',
    parole_savant_en: '"Prayer is the second pillar of Islam after the two testimonies, and the greatest of the actions of the body. Whoever abandons it out of negligence — while acknowledging its obligation — commits, according to the most correct view, an act of major disbelief expelling from Islam, in accordance with the explicit hadiths of the Prophet (peace be upon him)." — Ibn \'Uthaymin, Sharh al-Mumti\', vol. 2',
    explication_en: 'Prayer (salah) is the second pillar of Islam and the first act the servant will be questioned about on the Day of Resurrection (hadith of Abu Hurayrah, al-Tirmidhi no. 413, sahih). It is obligatory five times a day upon every Muslim who has reached puberty and is of sound mind, men and women alike. Its conditions of validity include: purity of body, clothing, and place; covering the \'awrah; orientation towards the Qiblah; entry of the time; and intention (niyyah). Its pillars (arkan), according to the Hanbalis, are fourteen, including the opening takbir, standing for one who is able, recitation of al-Fatihah in every rak\'ah, bowing, the two prostrations, the final sitting, the tashahhud, and the closing salam. Concerning its abandonment out of negligence (without denying its obligation): the madhhabs differ. The view of the Hanbalis and many Salaf (transmitted from \'Umar, \'Ali, Ibn Mas\'ud, Ibn \'Abbas), upheld by Ibn al-Qayyim and Ibn \'Uthaymin, considers such abandonment to be major disbelief (kufr akbar) on account of the clarity of the texts: the hadith of Buraydah above, and the hadith of Jabir, "Between a man and shirk and disbelief is the abandonment of the prayer" (Muslim no. 82). The view of the Hanafis, Shafi\'is and Malikis considers it a major sin without expelling from Islam. All agree that whoever denies its obligation is an apostate. Whatever the case, prayer is the pillar around which the entire religion revolves.',
  },
  {
    id: 'taharah',
    domaine: 'fiqh',
    sous_domaines: ['taharah'],
    keywords: ['wudu', 'ablution', 'pureté', 'tahara', 'ghusl', 'tayammum'],
    verset_en: 'O you who have believed, when you rise to [perform] prayer, wash your faces and your forearms to the elbows and wipe over your heads and wash your feet to the ankles.',
    hadith_texte_en: 'Narrated Abu Malik al-Ash\'ari (may Allah be pleased with him): "Purification is half of faith."',
    parole_savant_en: '"The obligations of wudu are six: washing the face (including rinsing the mouth and nose according to the most correct view), washing the arms up to and including the elbows, wiping the entire head (including the ears), washing the feet up to and including the ankles, observing order (tartib) and continuity (muwalat)." — Ibn Qudamah, al-Mughni, vol. 1',
    explication_en: 'Ritual purity (taharah) is the prerequisite for prayer, tawaf, and direct recitation of the Qur\'an from the mushaf. It is divided into purity from major hadath (which requires ghusl: major ablution after janabah, end of menstruation, end of postnatal bleeding) and purity from minor hadath (which requires wudu: minor ablution after what exits the two passages, deep sleep, loss of reason, or direct contact with the private parts according to the Shafi\'is and Hanbalis). Verse 5:6 of al-Ma\'idah is the Qur\'anic basis of wudu, listing its obligations: washing the face, washing the arms to the elbows inclusive, wiping the head, washing the feet to the ankles. The Sunnahs of wudu, demonstrated by the Prophet\'s practice (hadith of \'Uthman ibn \'Affan, al-Bukhari and Muslim), include the basmalah at the start, the siwak, washing the hands three times, rinsing the mouth and nose three times, running the fingers through the beard, separating the fingers and toes, and beginning with the right side. Tayammum (dry ablution with pure earth) is permitted in the absence of water or inability to use it (illness, cold without means to warm the water): it is performed by striking the earth once according to the majority, then wiping the hands over the face and hands. Purity also includes purity of the body (removal of najasat) and of the place of prayer. It is through purity that the Muslim draws close to Allah, as the verse indicates: "Indeed, Allah loves those who repent and loves those who purify themselves" (al-Baqarah 2:222).',
  },
  {
    id: 'zakat',
    domaine: 'fiqh',
    sous_domaines: ['zakat'],
    keywords: ['zakat', 'aumône', 'nisab', 'sadaqa'],
    verset_en: 'Take from their wealth a charity by which you purify them and cause them increase, and invoke [Allah\'s blessings] upon them. Indeed, your invocations are reassurance for them.',
    hadith_texte_en: 'Narrated Ibn \'Umar (may Allah be pleased with him): "Islam is built upon five: testifying that there is no deity but Allah and that Muhammad is the Messenger of Allah, establishing the prayer, paying the zakah, performing the pilgrimage, and fasting Ramadan."',
    parole_savant_en: '"Zakah is obligatory on four categories of wealth: gold and silver (and their monetary equivalent), merchandise of trade, grains and fruits, and livestock (camels, cattle, sheep). It only becomes obligatory upon two conditions: reaching the nisab and the passing of a complete lunar year (hawl) for monetary assets and livestock." — Ibn Baz, Majmu\' al-Fatawa, vol. 14',
    explication_en: 'Zakah (purification, growth) is the third pillar of Islam, mentioned more than eighty times in the Qur\'an, generally paired with prayer, which underscores its cardinal importance. It is an obligatory right that Allah has instituted in the wealth of the rich on behalf of the poor; it is neither a favour nor a charity, but a due. The nisab for gold is 85 grams, for silver 595 grams, and currency is aligned with that of silver (which lowers the threshold and makes the obligation frequent). The rate is 2.5% (a quarter of a tenth) on monetary assets, gold, silver, and trade merchandise — collected once per completed lunar year. For harvests, the rate is 10% if irrigation is natural and 5% if it requires effort, collected at harvest time (cf. al-An\'am 6:141). The eight categories of recipients are fixed by al-Tawbah 9:60: the poor (fuqara\'), the needy (masakin), the collectors, those whose hearts are to be reconciled, the freeing of slaves, the indebted, the cause of Allah (fi sabilillah), and the stranded traveller (ibn al-sabil). Refusing zakah out of negligence is a major sin (cf. al-Tawbah 9:34–35); denying its obligation is apostasy. Abu Bakr al-Siddiq fought those who refused to pay it after the Prophet\'s death, demonstrating that it is inseparable from prayer in Islam.',
  },
  {
    id: 'sawm',
    domaine: 'fiqh',
    sous_domaines: ['sawm'],
    keywords: ['jeûne', 'ramadan', 'siyam', 'sawm', 'iftar', 'suhur'],
    verset_en: 'O you who have believed, decreed upon you is fasting as it was decreed upon those before you that you may become righteous.',
    hadith_texte_en: 'Narrated Abu Hurayrah (may Allah be pleased with him): "Whoever does not give up false speech and acting upon it, Allah has no need that he should give up his food and drink."',
    parole_savant_en: '"Fasting Ramadan becomes obligatory as soon as the new moon of Ramadan is sighted by a reliable Muslim witness, or upon the completion of thirty days of Sha\'ban. The Islamic month is lunar, lasting 29 or 30 days. Fasting consists of abstaining, with intention from the previous night, from eating, drinking, and marital relations from the true dawn (Fajr) until sunset (Maghrib)." — Ibn \'Uthaymin, Majalis Shahr Ramadan',
    explication_en: 'Fasting the month of Ramadan is the fourth pillar of Islam, prescribed in the second year of the Hijrah. It is obligatory upon every Muslim who has reached puberty, is of sound mind, capable, and resident. Exempt and required to make up: the temporarily ill and the traveller (cf. al-Baqarah 2:184–185), the menstruating woman and the woman in postnatal bleeding. Exempt with compensation (fidyah = feeding a poor person per day): the chronically ill with no hope of recovery and the incapable elderly. The pregnant or breastfeeding woman fearing for herself or her child may break the fast and make up (Hanafis, Shafi\'is) or make up + fidyah (Hanbalis) according to the views. The fast is invalidated by: eating or drinking intentionally, marital relations (which additionally require expiation: freeing a slave, or fasting two consecutive months, or feeding 60 poor persons — hadith of Abu Hurayrah, al-Bukhari and Muslim), induced vomiting, induced ejaculation, and menstruation/postnatal bleeding. Permissible without breaking the fast: forgetfulness, the siwak, rinsing the mouth without swallowing, blood draws, non-nutritive injections. Beyond the ritual aspect, the deep purpose of fasting is taqwa (piety) as the verse indicates: it is a school of endurance, sincerity, compassion for the poor, and mastery of the passions. The Prophet (peace be upon him) warned that one who fasts without abandoning false speech and vulgarity reaps from his fast only hunger and thirst (al-Bukhari no. 1903; Ibn Majah no. 1690).',
  },
  {
    id: 'hajj',
    domaine: 'fiqh',
    sous_domaines: ['hajj', 'ihram'],
    keywords: ['hajj', 'pèlerinage', 'umra', 'ihram', 'tawaf', 'arafat', 'mina', 'muzdalifa', 'safa', 'marwa'],
    verset_en: 'And [due] to Allah from the people is a pilgrimage to the House — for whoever is able to find thereto a way. But whoever disbelieves — then indeed, Allah is free from need of the worlds.',
    hadith_texte_en: 'Narrated Abu Hurayrah (may Allah be pleased with him): "Whoever performs Hajj for Allah and does not utter obscene speech and does not commit disobedience, returns as on the day his mother gave birth to him."',
    parole_savant_en: '"Hajj is obligatory once in a lifetime upon every Muslim who is free, has reached puberty, is of sound mind, and possesses the physical capacity (health) and financial capacity (provision for himself and his family, travel expenses, safety of the route). Postponing Hajj without excuse despite having the means is a grave sin by unanimous consensus; some scholars even hold that it becomes obligatory in the first year of capacity." — Ibn Baz, Fatawa al-Hajj wal-\'Umrah',
    explication_en: 'Hajj is the fifth pillar of Islam, obligatory once in a lifetime upon whoever has the capacity (istita\'ah). It is performed during the appointed months (Shawwal, Dhul-Qi\'dah, and the first ten days of Dhul-Hijjah). There are three modalities: Tamattu\' (performing \'umrah, then exiting ihram and re-entering ihram for Hajj — recommended by the Prophet (peace be upon him) for those who do not bring an offering), Qiran (combining \'umrah and Hajj under a single ihram with an offering), Ifrad (Hajj alone without an offering). The pillars (arkan) of Hajj whose omission invalidates the rite are four according to the Shafi\'is and Hanbalis: ihram (intention to enter the sacralised state from the miqat), the standing at \'Arafat (the greatest pillar: "Hajj is \'Arafat" — hadith of \'Abd al-Rahman ibn Ya\'mar, al-Tirmidhi sahih), tawaf al-ifadah around the Ka\'bah, and sa\'y between Safa and Marwah. The wajibat whose omission is compensated by a dam (sacrifice) include: assuming ihram from the miqat, spending the night at Muzdalifah, stoning the jamarat, spending the nights at Mina, shaving or trimming the hair, and the farewell tawaf. Hajj is the supreme school of Tawhid: the talbiyah ("Labbayka Allahumma labbayk, labbayka la sharika laka labbayk...") is the proclamation of unicity; the simplicity of ihram erases social distinctions; the standing at \'Arafat is an image of the Gathering of the Last Day. The reward, as the hadith indicates, is the total effacement of sins.',
  },
  {
    id: 'nikah',
    domaine: 'fiqh',
    sous_domaines: ['nikah'],
    keywords: ['mariage', 'nikah', 'mahr', 'wali', 'tuteur', 'épouse', 'époux'],
    verset_en: 'And of His signs is that He created for you from yourselves mates that you may find tranquillity in them; and He placed between you affection and mercy.',
    hadith_texte_en: 'Narrated Ibn Mas\'ud (may Allah be pleased with him): "O young men! Whoever among you can afford it, let him marry, for it is the best safeguard for the gaze and the chastity. And whoever cannot, let him fast, for fasting is a restraint for him."',
    parole_savant_en: '"The pillars of nikah according to the majority (Shafi\'is, Hanbalis, Malikis) are: the prospective husband, the prospective wife free of impediments (already married, in \'iddah, a prohibited relative, a non-kitabiyyah disbeliever), the woman\'s guardian (wali), two upright witnesses, and the formula of offer (ijab) and acceptance (qabul). Without a wali, the marriage is invalid according to the majority, in accordance with the hadith: \'No marriage without a guardian.\'" — Ibn Qudamah, al-Mughni, vol. 7',
    explication_en: 'Marriage (nikah) is the confirmed sunnah of the Prophet (peace be upon him) and the way of all Messengers (cf. al-Ra\'d 13:38). Its juridical status varies with capacity and need: obligatory for one who fears falling into fornication and has the means; recommended for the majority; permissible for one without desire; discouraged for one who cannot fulfil the obligations. The pillars of the contract according to the majority are: the two spouses free of impediments, the woman\'s wali — her father in priority, then the paternal grandfather, the son, the full brother then paternal brother, etc. — two upright Muslim witnesses, and the formula of offer and acceptance. The mahr (dower) is an exclusive right of the woman and a moral pillar of the contract (cf. al-Nisa\' 4:4); it has no maximum and the minimum is anything that may be called wealth according to the majority. Prohibited in marriage are: ascendants (mother, grandmothers), descendants, sisters, paternal and maternal aunts, nieces, foster mothers and foster sisters (10 prohibitions by lineage and breastfeeding enumerated in al-Nisa\' 4:23), as well as the mother-in-law, the stepdaughter (if the marriage with her mother was consummated), and the wife of the biological son. The hadith of \'A\'ishah (Abu Dawud, al-Tirmidhi, authenticated) "No marriage without a wali" is the preponderant view of Ahl al-Sunnah; the Hanafis permit the adult woman to marry without a wali under conditions. Cohabitation outside nikah is zina (fornication), a major sin. The purpose of marriage is chastity, procreation, sakinah (tranquillity), mawaddah (affection), and rahmah (mutual mercy).',
  },
  {
    id: 'muamalat_riba',
    domaine: 'fiqh',
    keywords: ['riba', 'usure', 'intérêt', 'banque'],
    verset_en: 'Allah has permitted trade and has forbidden interest (riba).',
    hadith_texte_en: 'Narrated Jabir (may Allah be pleased with him): "The Messenger of Allah (peace be upon him) cursed the one who consumes riba, the one who pays it, the one who writes it down, and the two who witness it, and he said: They are all equal."',
    parole_savant_en: '"Riba is of two principal categories: riba al-nasi\'ah (the increase in exchange for a delay in repayment, which is the riba of the pre-Islamic Arabs and the riba of contemporary banks) and riba al-fadl (the excess in the exchange of six categories of goods of the same kind — gold, silver, wheat, barley, dates and salt — except hand-to-hand and equal for equal). Both are categorically prohibited by the Qur\'an, the Sunnah, and ijma\'." — Ibn Qudamah, al-Mughni',
    explication_en: 'Riba (interest, usury) is one of the gravest major sins, the only one against which Allah and His Messenger have declared war (cf. al-Baqarah 2:279). The Qur\'an prohibited it in stages, culminating in al-Baqarah 2:275–281, the last passage revealed concerning rulings. Scholars distinguish two main categories. Riba al-nasi\'ah is the excess obtained as the price of a delay in repayment — the foundation of conventional bank loans, of consumer credit with interest, of fixed-rate savings accounts, and of bond yields. Riba al-fadl is the excess in the immediate exchange of six categories of goods identified by the hadith of \'Ubadah ibn al-Samit (Muslim): gold, silver, wheat, barley, dates, and salt — by analogy extended by the majority to currencies, foodstuffs measured or weighed, and any commodity that can be stored. Their exchange in kind must be equal for equal and hand-to-hand. To consume riba, to pay it, to write it down or to witness it falls under the same divine curse (hadith of Jabir, Muslim no. 1598). The Muslim must thus avoid conventional bank financing whenever possible, turn to Sharia-compliant alternatives (murabahah, ijarah, mudarabah, musharakah), and purify any income tainted by riba by spending it on the poor without expecting reward.',
  },
  {
    id: 'janaza',
    domaine: 'fiqh',
    keywords: ['janaza', 'funérailles', 'mort', 'défunt', 'enterrement'],
    verset_en: 'Every soul shall taste death. And only on the Day of Resurrection will you be paid your wages in full.',
    hadith_texte_en: 'Narrated Abu Hurayrah (may Allah be pleased with him): "The rights of a Muslim upon another Muslim are five: returning the greeting, visiting the sick, following the funeral procession, accepting the invitation, and saying \'yarhamuka Allah\' to the one who sneezes (and praises Allah)."',
    parole_savant_en: '"The rites of the funeral are four, the omission of any of which is sinful: washing the deceased, shrouding him, praying over him, and burying him. These are obligations of sufficiency (fard kifayah): if a sufficient number of Muslims undertake them, the sin is lifted from the rest." — Ibn Qudamah, al-Mughni',
    explication_en: 'The rites surrounding death are a collective obligation (fard kifayah) for the Muslim community. They include four essential stages. (1) Washing the deceased (ghusl): performed an odd number of times (three, five, seven) with water and sidr (lotus leaves), beginning with the right side and the parts of wudu. The martyr fallen on the battlefield is exempted from ghusl. (2) Shrouding (takfin): the man is wrapped in three white sheets, the woman in five (a wrapper, a tunic, a head-covering, and two sheets). The shroud is perfumed with non-musk fragrances. (3) The funeral prayer (salat al-janazah): a standing prayer of four takbirs without ruku\' or sujud, comprising al-Fatihah after the first takbir, the salat \'ala al-Nabi after the second, and a du\'a for the deceased after the third (the famous "Allahumma ighfir lihayyina wa mayyitina..."). (4) Burial (dafn): in a grave deep enough to protect from animals and odour, with the body laid on its right side facing the Qiblah, without elaborate construction over the grave (forbidden by the hadith of Jabir, Muslim no. 970). Lamentation, tearing clothes, and excessive wailing are forbidden. Visiting graves is sunnah for men to remember the Hereafter, while women are disputed: the soundest view is permissibility without lamentation. The Muslim accompanies his brothers from the cradle to the grave, fulfilling the right of brotherhood.',
  },
  {
    id: 'miras',
    domaine: 'fiqh',
    keywords: ['héritage', 'miras', 'succession', 'fara\'id'],
    verset_en: 'Allah instructs you concerning your children: for the male, what is equal to the share of two females. (al-Nisa\' 4:11)',
    hadith_texte_en: 'Narrated Ibn \'Abbas (may Allah be pleased with them both): "Give the shares of inheritance to those entitled to them, and what remains goes to the nearest male relative."',
    parole_savant_en: '"The science of inheritance (\'ilm al-fara\'id) is half of knowledge, and it is the first knowledge to be lifted from the community, as the Prophet (peace be upon him) said. It is a collective obligation upon the community to have those among it who master it, for without it the rights of orphans and women are lost." — Ibn Qudamah, al-Mughni, vol. 9',
    explication_en: 'The science of inheritance (\'ilm al-fara\'id or al-mawarith) holds a unique place in Islamic jurisprudence: it is the only domain where the Qur\'an itself fixes the precise shares of most heirs (al-Nisa\' 4:11–12 and 4:176). The Prophet (peace be upon him) called it "half of knowledge" (hadith of Ibn Mas\'ud, Ibn Majah, with weakness but its meaning is sound). Inheritance proceeds in this order: (1) settling the deceased\'s debts, including the right of God (unpaid zakah, unfulfilled Hajj) and the rights of people; (2) executing the bequest (wasiyyah) within the third for non-heirs, since "there is no bequest for an heir" (hadith of Abu Umamah, al-Tirmidhi); (3) distributing the remainder among the heirs by fixed shares (ashab al-furud) such as the half, the quarter, the eighth, the sixth, the third, and the two thirds, then the agnates (\'asabah) who take what remains. The principle of "for the male the share of two females" applies to children, brothers and sisters; it is not a general absolute rule, since the father, mother, and uterine brothers and sisters receive equal shares. Far from disadvantaging the woman, the Islamic system grants her financial security (mahr, maintenance of husband and male relatives) without requiring contribution to family expenses. Disregarding the divine shares to favour one heir over another is a grave sin denounced in al-Nisa\' 4:13–14.',
  },
  {
    id: 'qurbani',
    domaine: 'fiqh',
    keywords: ['qurbani', 'udhiya', 'sacrifice', 'aïd al-adha', 'aid al adha'],
    verset_en: 'So pray to your Lord and sacrifice [to Him alone].',
    hadith_texte_en: 'Narrated Anas (may Allah be pleased with him): "The Prophet (peace be upon him) sacrificed two horned rams of a colour mixed with black. He slaughtered them with his own hand, pronouncing the name of Allah and the takbir."',
    parole_savant_en: '"The udhiyah (sacrifice of \'Id al-Adha) is a confirmed sunnah according to the majority of scholars and an obligation according to Abu Hanifah for the capable resident. Its time begins after the \'Id prayer of the tenth of Dhul-Hijjah and ends at the sunset of the thirteenth (the three days of tashriq)." — Ibn Qudamah, al-Mughni',
    explication_en: 'The sacrifice of \'Id al-Adha (udhiyah or qurbani) commemorates the offering of Ibrahim (peace be upon him) and reminds of the prophetic command in al-Kawthar 108:2. It is a confirmed sunnah (Hanbalis, Shafi\'is, Malikis) — some, like Abu Hanifah, hold it obligatory upon the capable resident. Its time extends from after the \'Id prayer of 10 Dhul-Hijjah until sunset on 13 Dhul-Hijjah (the three days of tashriq). The eligible animals are camels (at least 5 years old), cattle (at least 2 years old), sheep (at least 6 months for the jadha\' and 1 year otherwise), and goats (at least 1 year), free of defects disqualifying for sacrifice: blatant blindness, manifest illness, blatant lameness, extreme emaciation (hadith of al-Bara\' ibn \'Azib, Abu Dawud, sahih). A sheep suffices for one person or one household; a camel or a cow for seven. The owner is recommended to slaughter the animal himself, facing the Qiblah, saying "Bismillah, Allahu akbar, Allahumma minka wa laka." The meat is divided into three parts: one for the family, one for relatives and friends, one for the poor (cf. al-Hajj 22:36). For one who intends to perform the udhiyah, it is recommended from 1 Dhul-Hijjah until the slaughter not to cut his hair or trim his nails (hadith of Umm Salamah, Muslim no. 1977).',
  },
  // ============================================================
  // AKHLAQ
  // ============================================================
  {
    id: 'birr_walidayn',
    domaine: 'akhlaq',
    keywords: ['parents', 'père', 'mère', 'birr', 'piété filiale', 'walidayn'],
    verset_en: 'And your Lord has decreed that you not worship except Him, and to parents, good treatment. Whether one or both of them reach old age [while] with you, say not to them [so much as], "uff," and do not repel them but speak to them a noble word.',
    hadith_texte_en: 'Narrated \'Abdullah ibn \'Amr (may Allah be pleased with them both): "The pleasure of the Lord is in the pleasure of the parent, and the displeasure of the Lord is in the displeasure of the parent."',
    parole_savant_en: '"Piety towards parents (birr al-walidayn) is among the greatest of acts of worship and one of the most certain causes of entering Paradise. Disobedience to them (\'uquq) is among the gravest major sins, paired in the texts with shirk." — Ibn al-Qayyim, Madarij al-Salikin',
    explication_en: 'Piety towards parents (birr al-walidayn) is, after the rights of Allah, the most emphasised duty of the Muslim. The Qur\'an pairs it explicitly with Tawhid in five passages (al-Baqarah 2:83, al-Nisa\' 4:36, al-An\'am 6:151, al-Isra\' 17:23, Luqman 31:14). The mother is given a triple right over the father, according to the well-known hadith of Abu Hurayrah: a man asked the Prophet (peace be upon him) "Who deserves my best companionship?" He said "Your mother." "Then who?" "Your mother." "Then who?" "Your mother." "Then who?" "Your father" (al-Bukhari no. 5971, Muslim no. 2548). Birr includes: obeying parents in everything that is not disobedience to Allah, addressing them with respect, providing maintenance if they are in need, visiting them, praying for them and their forgiveness in their lifetime and after their death, honouring their friends, fulfilling their bequests and their debts. Disobedience (\'uquq) — raising the voice, insulting them, abandoning them, depriving them — is one of the greatest of major sins (al-Bukhari no. 6273). Their rights remain even if they are disbelievers, provided one does not obey them in shirk (cf. Luqman 31:15). Piety towards parents is a cause of long life, abundance of provision, and Paradise (hadith of Anas, al-Bukhari).',
  },
  {
    id: 'patience',
    domaine: 'akhlaq',
    keywords: ['patience', 'sabr', 'épreuve', 'endurance'],
    verset_en: 'O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.',
    hadith_texte_en: 'Narrated Suhayb (may Allah be pleased with him): "How wonderful is the affair of the believer! All his affairs are good for him: if good befalls him, he gives thanks and that is good for him; and if harm befalls him, he is patient and that is good for him. This is for no one but the believer."',
    parole_savant_en: '"Patience (sabr) is of three kinds: patience in obedience to Allah, patience in refraining from what He has forbidden, and patience under the decrees of Allah that are painful. The believer needs all three throughout his life, and his rank with Allah is according to the measure of his patience." — Ibn al-Qayyim, \'Uddat al-Sabirin',
    explication_en: 'Patience (sabr) is one of the noblest stations of faith. The Qur\'an mentions it more than ninety times, and the Prophet (peace be upon him) said: "No one has been given a gift better and more comprehensive than patience" (al-Bukhari no. 1469, Muslim no. 1053). The scholars, following Ibn al-Qayyim in \'Uddat al-Sabirin, divide it into three. (1) Patience in obedience: persevering in prayer, fasting, dhikr, da\'wah, in spite of laziness or the soul\'s aversion. (2) Patience in abstaining from disobedience: restraining the soul from forbidden gazes, riba, ghibah, the temptations of the lower self. (3) Patience under the divine decrees: enduring illness, the loss of a loved one, poverty, slander, without complaining to other than Allah. The believer\'s patience is accompanied by certainty (yaqin) that everything comes from Allah by His Wisdom (cf. al-Hadid 57:22–23), by hope in the immense reward ("Indeed the patient will be given their reward without limit", al-Zumar 39:10), and by recourse to prayer (al-Baqarah 2:153). True patience is at the first strike, before the soul resigns itself by force (hadith of Anas, al-Bukhari no. 1283). Sabr is the gateway to thankfulness (shukr): the patient becomes thankful, and the thankful becomes patient — together they form the wing of faith.',
  },
  {
    id: 'ghiba',
    domaine: 'akhlaq',
    keywords: ['médisance', 'ghiba', 'calomnie', 'namima', 'langue', 'ghibah'],
    verset_en: 'And do not spy or backbite each other. Would one of you like to eat the flesh of his dead brother? You would detest it.',
    hadith_texte_en: 'Narrated Abu Hurayrah (may Allah be pleased with him): The Prophet (peace be upon him) was asked, "Do you know what backbiting is?" They said, "Allah and His Messenger know best." He said, "It is to mention your brother in a way he would dislike." It was said, "What if what I say is true of him?" He said, "If what you say is true of him, you have backbitten him; and if it is not, you have slandered him."',
    parole_savant_en: '"Backbiting (ghibah) is among the gravest major sins, for it combines an offence against the right of Allah and an offence against the right of the person. Its repentance requires sincere remorse, the firm resolution not to return to it, asking forgiveness from Allah, and asking pardon from the offended party if possible without causing greater harm." — al-Nawawi, al-Adhkar',
    explication_en: 'Backbiting (ghibah) and talebearing (namimah) are diseases of the tongue that the Qur\'an and Sunnah have severely condemned. The famous verse al-Hujurat 49:12 compares backbiting to eating the flesh of one\'s dead brother — a powerful image showing the gravity of the act. The Prophet\'s definition (peace be upon him) is precise: ghibah is to mention the believer in his absence with something he would dislike — even if true. Otherwise it is slander (buhtan), which is graver still. The pillars of ghibah are three: the mention, of an absent person, of what he dislikes (concerning his body, religion, family, conduct or possessions). Cases of permitted ghibah are limited and well-defined by al-Nawawi in Riyad al-Salihin and al-Adhkar: complaining of injustice to one who can redress it, seeking a fatwa, warning a Muslim against a danger (marriage proposal, business partnership), denouncing a public sinner who flaunts his sin, identifying a person by an attribute that is the only way to recognise him. Namimah is to transmit the words of one against another to sow discord; the Prophet (peace be upon him) said: "The talebearer will not enter Paradise" (al-Bukhari no. 6056, Muslim no. 105). The Muslim guards his tongue, for it is what most casts people face down into Hell (hadith of Mu\'adh, al-Tirmidhi sahih).',
  },
  {
    id: 'sincerite_ikhlas',
    domaine: 'akhlaq',
    keywords: ['ikhlas', 'sincérité', 'riya', 'ostentation', 'niyya', 'intention'],
    verset_en: 'And they were not commanded except to worship Allah, [being] sincere to Him in religion.',
    hadith_texte_en: 'Narrated \'Umar ibn al-Khattab (may Allah be pleased with him): "Verily, actions are but by intentions, and every person shall have only what he intended. Whoever migrates for Allah and His Messenger, his migration is for Allah and His Messenger; and whoever migrates for some worldly gain or to marry a woman, his migration is for that for which he migrated."',
    parole_savant_en: '"Sincerity (ikhlas) is to purify the deed from any blemish of any creature, so that nothing remains in the intention but the Face of Allah, His pleasure, and the Hereafter. It is the soul of acts of worship and the condition of their acceptance, alongside conformity to the Sunnah." — al-Fudayl ibn \'Iyad, cited by Ibn al-Qayyim',
    explication_en: 'Sincerity (ikhlas) is the soul of every act of worship and the condition of its acceptance. Allah does not accept a deed unless it combines two conditions: ikhlas (the act is done for Him alone) and mutaba\'ah (it conforms to the Sunnah of His Messenger). The famous hadith "Actions are but by intentions" (al-Bukhari no. 1, Muslim no. 1907) is considered by the scholars to be a third of the religion, since the deed is purified or annulled according to its intention. Ostentation (riya\') is the antithesis of ikhlas: it is to perform a worship to be seen by people. The Prophet (peace be upon him) called it "the lesser shirk" (hadith of Mahmud ibn Labid, Ahmad, sahih). Its dangerousness lies in its subtlety: it slips into the prayer, the recitation, the alms, the lecture. To combat it, al-Fudayl ibn \'Iyad transmitted to us this rule: "Abandoning the deed because of people is riya\'; performing it because of people is shirk; ikhlas is that Allah delivers you from both." Sincerity is achieved by: hiding deeds where possible, fearing that the deed not be accepted, frequent dhikr that purifies the heart, contemplating the immense reward of the sincere, and asking Allah for ikhlas (du\'a of \'Umar: "O Allah, make all my deed righteous, devoted to Your Face alone, and let no one have any share in it").',
  },
  {
    id: 'dhikr_dua',
    domaine: 'akhlaq',
    keywords: ['dhikr', 'invocation', 'dua', 'rappel d\'allah', 'rappel'],
    verset_en: 'And remember your Lord much and exalt [Him with praise] in the evening and the morning.',
    hadith_texte_en: 'Narrated Abu Hurayrah (may Allah be pleased with him): The Prophet (peace be upon him) said: "Two words are light on the tongue, heavy on the scales, beloved to the Most Merciful: \'Subhan Allahi wa bi-hamdihi, Subhan Allahi al-\'Azim.\'"',
    parole_savant_en: '"Dhikr of Allah is to the heart what water is to the fish: if it is cut off, the heart dies. It is the greatest of acts of worship for the tongue, accessible at every moment, in every state, and its reward is immense for one who is constant in it." — Ibn al-Qayyim, al-Wabil al-Sayyib',
    explication_en: 'The remembrance of Allah (dhikr) is the most accessible act of worship and one of the most rewarded. The Qur\'an commands abundant dhikr (al-Ahzab 33:41–42) and lauds those who remember Allah standing, sitting, and lying on their sides (Al \'Imran 3:191). Ibn al-Qayyim devoted a luminous book to it, al-Wabil al-Sayyib min al-Kalim al-Tayyib, in which he enumerates more than seventy benefits of dhikr: it drives away Satan, brings down the pleasure of the Most Merciful, dispels worry and sadness, fills the heart with joy, illumines the face, opens provision, brings down mercy, makes one love by Allah and by His creatures. Dhikr includes the legislated formulas: tasbih (Subhan Allah), tahmid (al-hamdu li-Llah), takbir (Allahu akbar), tahlil (La ilaha illa Allah), the prophetic adhkar of morning and evening, the adhkar after prayer, the istighfar (seeking forgiveness), recitation of the Qur\'an, and prophetic du\'as. Du\'a is "the essence of worship" (hadith of al-Nu\'man ibn Bashir, al-Tirmidhi sahih) since it embodies servitude and dependence on Allah. Its conditions of acceptance include: ikhlas, lawful sustenance, presence of the heart, certainty in the response, persistence, choosing the favourable times (the last third of the night, between adhan and iqamah, the hour of Friday, the rain). To neglect dhikr is to die spiritually while still alive (hadith of Abu Musa, al-Bukhari no. 6407).',
  },
  {
    id: 'repentir_tawba',
    domaine: 'akhlaq',
    keywords: ['repentir', 'tawba', 'istighfar', 'pardon'],
    verset_en: 'And turn to Allah in repentance, all of you, O believers, that you might succeed.',
    hadith_texte_en: 'Narrated Abu Hurayrah (may Allah be pleased with him): The Prophet (peace be upon him) said: "Allah, Most High, said: O son of Adam! As long as you call upon Me and hope in Me, I will forgive you whatever proceeds from you, and I do not mind. O son of Adam! Were your sins to reach the clouds of the sky and were you then to ask My forgiveness, I would forgive you, and I do not mind."',
    parole_savant_en: '"Sincere repentance (tawbah nasuh) rests upon three pillars: ceasing the sin immediately, sincerely regretting having committed it, and firmly resolving never to return to it. If the sin involves the right of a person, a fourth condition is added: restoring that right or seeking forgiveness from the offended party." — al-Nawawi, Riyad al-Salihin',
    explication_en: 'Repentance (tawbah) is the constant door that Allah leaves open to His servants, "for sins are erased by repentance, and the one who repents from a sin is as one who has no sin" (hadith of Ibn Mas\'ud, Ibn Majah). Sincere repentance (tawbah nasuh, mentioned in al-Tahrim 66:8) rests upon three pillars unanimously agreed by the scholars. (1) Ceasing the sin immediately: one who delays his repentance to a later date while continuing to sin makes a mockery of repentance. (2) Sincere regret in the heart for having disobeyed Allah, not mere regret over earthly consequences. (3) The firm resolve never to return to it; if one falls again into the sin, a new repentance is needed without despair, for relapse does not invalidate the previous repentance. A fourth condition is added if the sin involves the right of a person: restoring stolen property, restoring slandered reputation, asking forgiveness from the harmed person — unless such a request would cause greater harm. Repentance is accepted as long as the soul has not reached the throat (hadith of Ibn \'Umar, al-Tirmidhi sahih) and the sun has not risen from the West. Allah\'s joy at the repentance of His servant surpasses the joy of a man who finds his lost camel in the desert (hadith of Anas, al-Bukhari and Muslim). The believer combines abundant istighfar with concrete tawbah, for even the Prophet (peace be upon him) sought forgiveness seventy or a hundred times a day.',
  },
  // ============================================================
  // SIRAH / SAHABA
  // ============================================================
  {
    id: 'sahaba',
    domaine: 'sirah',
    keywords: ['sahaba', 'compagnons', 'compagnon'],
    verset_en: 'And the first forerunners [in the faith] among the Muhajirin and the Ansar and those who followed them with good conduct — Allah is pleased with them and they are pleased with Him, and He has prepared for them gardens beneath which rivers flow.',
    hadith_texte_en: 'Narrated Abu Sa\'id al-Khudri (may Allah be pleased with him): The Prophet (peace be upon him) said: "Do not revile my Companions, for if any one of you were to spend gold equivalent to Uhud (in charity), it would not match a handful of theirs nor even half of it."',
    parole_savant_en: '"The Companions are the best of generations after the Prophet (peace be upon him), as is established in the hadith \'The best of people are my generation, then those who follow them, then those who follow them.\' To love them is part of religion, to praise them is part of religion, to follow them is part of religion; to revile them is hypocrisy and innovation." — Ibn Taymiyyah, al-\'Aqidah al-Wasitiyyah',
    explication_en: 'The Companions (Sahabah) are those who met the Prophet (peace be upon him) as believers and died upon Islam. They are, by consensus of Ahl al-Sunnah, the best of this Ummah and the best of all generations after the prophets, as the Qur\'an and Sunnah testify. Allah testifies of His pleasure with them in al-Tawbah 9:100, al-Fath 48:18, and al-Hashr 59:8–9. The Prophet (peace be upon him) declared them the best of generations (al-Bukhari no. 2652, Muslim no. 2533), forbade reviling them, and warned that to revile any one of them is an act so grave that the equivalent of Uhud in gold spent by another could not equal a handful of theirs. Their virtue (\'adalah) is established by the texts: they do not need to be examined like other narrators; their testimony is accepted with no further investigation. Among them, certain ranks are distinguished: the ten promised Paradise (al-\'asharah al-mubashsharun), the people of Badr (about 313), the people of the Pledge of Ridwan (about 1400), the Muhajirin, the Ansar, then those who entered Islam before the conquest of Makkah, then after. Above all stand the four Rightly-Guided Caliphs: Abu Bakr, \'Umar, \'Uthman, \'Ali (may Allah be pleased with them). To love them is part of faith; to hate them or any one of them is hypocrisy. Concerning the conflicts that arose between them (Jamal, Siffin), Ahl al-Sunnah holds silence, accepting that they were qualified mujtahids who, even if mistaken, are rewarded for their effort.',
  },
  {
    id: 'khulafa_rashidun',
    domaine: 'sirah',
    keywords: ['califes', 'khilafah', 'abu bakr', 'umar', 'uthman', 'ali', 'khulafa'],
    verset_en: 'Allah has promised those who have believed among you and done righteous deeds that He will surely grant them succession [to authority] upon the earth just as He granted it to those before them.',
    hadith_texte_en: 'Narrated al-\'Irbad ibn Sariyah (may Allah be pleased with him): "Hold fast to my Sunnah and the Sunnah of the Rightly-Guided Caliphs after me. Hold to it firmly and bite onto it with your molar teeth."',
    parole_savant_en: '"The Rightly-Guided Caliphs are four: Abu Bakr, then \'Umar, then \'Uthman, then \'Ali (may Allah be pleased with them all). Their order in caliphate corresponds, by the consensus of Ahl al-Sunnah, to their order in virtue. To deny their virtue or their legitimate caliphate is innovation, and to dispute over them is to abandon the way of the Prophet (peace be upon him)." — Ibn Taymiyyah, Minhaj al-Sunnah',
    explication_en: 'The four Rightly-Guided Caliphs (al-Khulafa\' al-Rashidun) are, by consensus of Ahl al-Sunnah wa\'l-Jama\'ah, the four successors of the Prophet (peace be upon him): Abu Bakr al-Siddiq (11–13 AH), \'Umar ibn al-Khattab (13–23 AH), \'Uthman ibn \'Affan (23–35 AH), and \'Ali ibn Abi Talib (35–40 AH). Their order in caliphate corresponds to their rank in virtue, as the Companions established by consensus. (1) Abu Bakr al-Siddiq: the first man to embrace Islam, the companion of the cave (al-Tawbah 9:40), the one who freed the most slaves with his wealth, who united the Ummah after the apostasy and fought the deniers of zakah, and who gathered the Qur\'an into a single mushaf. (2) \'Umar al-Faruq: the conqueror of Persia and Byzantium, the just by example, who instituted the Hijri calendar and the diwan. (3) \'Uthman Dhu al-Nurayn: the gentle and generous, who equipped the army of \'Usrah, who standardised the mushaf upon a single dialect. (4) \'Ali ibn Abi Talib: the cousin and son-in-law of the Prophet (peace be upon him), the door of the city of knowledge, the brave of Khaybar. Their authentic caliphate is thirty years, in accordance with the hadith of Safinah (Abu Dawud, al-Tirmidhi, sahih): "The caliphate (according to prophethood) after me will be thirty years; then it will become a kingdom." After them comes the era of the kingdom of the Umayyads, then of the Abbasids. Following their Sunnah is incumbent upon every Muslim.',
  },
  // ============================================================
  // TAFSIR / QURAN
  // ============================================================
  {
    id: 'fatiha',
    domaine: 'tafsir',
    keywords: ['fatiha', 'al-fatiha', 'umm al-kitab', 'sept versets'],
    verset_en: '[All] praise is [due] to Allah, Lord of the worlds — the Most Compassionate, the Most Merciful — Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path — the path of those upon whom You have bestowed favour, not of those who have evoked [Your] anger or of those who are astray.',
    hadith_texte_en: 'Narrated Abu Sa\'id ibn al-Mu\'alla (may Allah be pleased with him): The Prophet (peace be upon him) said: "I shall teach you the greatest surah of the Qur\'an before you leave the mosque." Then he took my hand, and when he intended to leave, I said, "Did you not say you would teach me the greatest surah of the Qur\'an?" He said, "Yes: \'Al-hamdu li-Llahi Rabbi al-\'Alamin\' — these are the seven oft-repeated verses, and the Magnificent Qur\'an which has been given to me."',
    parole_savant_en: '"Al-Fatihah is the Mother of the Book (Umm al-Kitab), the Seven Oft-Repeated (al-Sab\' al-Mathani), the cure (al-Shifa\'), the foundation of the Qur\'an. There is no prayer for one who does not recite it, as the authentic hadith establishes." — Ibn al-Qayyim, Madarij al-Salikin',
    explication_en: 'Surah al-Fatihah (the Opening) is the greatest surah of the Qur\'an, as the famous hadith of Abu Sa\'id ibn al-Mu\'alla testifies (al-Bukhari no. 4474). It bears several names, each reflecting a function: al-Fatihah (the Opener of the Book), Umm al-Kitab (Mother of the Book), al-Sab\' al-Mathani (the Seven Oft-Repeated, cf. al-Hijr 15:87), al-Shifa\' (the Cure), al-Ruqyah (the spiritual healing). It is recited in every rak\'ah of every prayer — without it the prayer is invalid, by consensus for the imam and the prayer in solitude, and according to the prepondering view also for the one praying behind the imam (hadith of \'Ubadah ibn al-Samit, al-Bukhari and Muslim: "No prayer for one who does not recite the Opener of the Book"). It summarises the entire Qur\'an: praise of Allah and affirmation of His Names (al-hamd, al-Rabb, al-Rahman, al-Rahim, al-Malik), Tawhid of worship and of seeking help ("It is You we worship and You we ask for help"), the request for guidance to the straight path (which is the central request of the Muslim, recited at least seventeen times a day), and the warning against the two deviations: those who knew the truth and did not follow it (the Jews, Magdub), and those who worshipped without knowledge (the Christians, Dallin). It is the first communication between the servant and his Lord in prayer, as the qudsi hadith expresses (Muslim no. 395): Allah has divided it into two halves between Himself and His servant.',
  },
  {
    id: 'ayat_kursi',
    domaine: 'tafsir',
    keywords: ['ayat al-kursi', 'verset du trône', 'ayat kursi'],
    verset_en: 'Allah — there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    hadith_texte_en: 'Narrated Abu Hurayrah (may Allah be pleased with him): "Whoever recites Ayat al-Kursi after every obligatory prayer, nothing will prevent him from entering Paradise except death."',
    parole_savant_en: '"Ayat al-Kursi is the greatest verse of the Book of Allah, as the Prophet (peace be upon him) himself testified to Ubayy ibn Ka\'b. It combines the Names of Majesty and the Names of Beauty, the Tawhid of worship and the Tawhid of Names and Attributes." — Ibn Taymiyyah',
    explication_en: 'Ayat al-Kursi (al-Baqarah 2:255) is the greatest verse of the Qur\'an, as the Prophet (peace be upon him) testified to Ubayy ibn Ka\'b (Muslim no. 810). In a few lines, it gathers a summary of the Islamic creed concerning Allah. (1) The Tawhid of Uluhiyyah: "There is no deity except Him". (2) Two foundational Names: al-Hayy (the Ever-Living, who possesses perfect life eternally) and al-Qayyum (the Self-Subsistent, who subsists by Himself and through whom all things subsist). (3) The negation of any deficiency: "Neither drowsiness overtakes Him nor sleep". (4) Absolute ownership of the heavens and the earth. (5) The Tawhid of intercession: no one intercedes except by His permission, refuting the polythéists\' belief in saints as automatic intercessors. (6) The encompassing of all knowledge, past and future. (7) The reality of the Kursi, an immense creation that contains the seven heavens and earths as a ring thrown in the desert (athar of Ibn \'Abbas). (8) Two crowning Names: al-\'Aliyy (the Most High in His Essence, His station, and His attributes) and al-\'Azim (the Most Great). Its specific virtues are immense: its recitation after every obligatory prayer guarantees Paradise upon death; its recitation upon going to bed protects from Satan until morning (hadith of the satanic theft, Bukhari no. 2311). It is a great spiritual ruqyah for the believer.',
  },
  {
    id: 'arba_in_intention',
    domaine: 'hadith',
    keywords: ['intention', 'niyya', 'arba\'in', 'an-nawawi', 'nawawi'],
    verset_en: 'And they were not commanded except to worship Allah, [being] sincere to Him in religion.',
    hadith_texte_en: 'Narrated \'Umar ibn al-Khattab (may Allah be pleased with him): "Verily, actions are but by intentions, and every person shall have only what he intended. Whoever migrates for Allah and His Messenger, his migration is for Allah and His Messenger; and whoever migrates for some worldly gain or to marry a woman, his migration is for that for which he migrated."',
    parole_savant_en: '"This hadith is one third of the religion. It is the scale of inner actions, just as the hadith \'Whoever introduces into our affair something not from it, it is rejected\' is the scale of outward actions. With these two hadiths, all actions are weighed: their inward by the first, their outward by the second." — Ibn Rajab al-Hanbali, Jami\' al-\'Ulum wa al-Hikam',
    explication_en: 'The hadith of \'Umar "Actions are but by intentions" is the very first hadith that Imam al-Nawawi placed in his celebrated Forty Hadiths (al-Arba\'in al-Nawawiyyah), as well as al-Bukhari at the head of his Sahih and al-Bayhaqi at the head of his Sunan al-Kubra. This unanimous choice is no coincidence: the scholars said this hadith is one third — sometimes one quarter — of the religion, because the deed is purified or annulled according to its intention. The hadith establishes three principles. (1) The reality of every action is the intention that animates it: an apparently religious act becomes worldly if the underlying intention is worldly (he who fasts to lose weight is not rewarded for fasting). (2) Sincerity (ikhlas) towards Allah alone is the condition of acceptance: every share given to a creature in the intention reduces or annuls the reward. (3) The same outward deed can yield infinitely diverse rewards according to the depths of intention: the man who eats his food with the intention of strengthening himself for the worship of Allah is rewarded for an ordinary act. The intention precedes the deed and accompanies it; it does not need to be uttered with the tongue — the scholars are unanimous that uttering the intention of prayer or ablution aloud is an innovation, since the Prophet (peace be upon him) and his Companions never did so. Renewing the intention, purifying it, examining it before, during, and after the deed, is the lifelong work of the sincere believer.',
  },
  // ============================================================
  // GENERIC fallbacks
  // ============================================================
  {
    id: 'generic_aqida',
    domaine: 'aqida',
    explication_en: 'This question pertains to Islamic creed (\'aqidah), the foundation of religion. Ahl al-Sunnah wa\'l-Jama\'ah bases its creed exclusively on the Qur\'an, the authentic Sunnah, and the consensus of the pious predecessors (Salaf al-Salih) — the first three generations praised by the Prophet (peace be upon him) in the hadith of \'Imran ibn Husayn (al-Bukhari): "The best of people are my generation, then those who follow them, then those who follow them." The matters of creed are tawqifiyyah (only established by the texts): nothing is affirmed or denied of Allah, the angels, the Books, the Messengers, the Last Day, or the divine decree except by an authentic textual proof. Sound reasoning ne contradicts the authentic transmission, as Ibn Taymiyyah demonstrated in his work Dar\' Ta\'arud al-\'Aql wa al-Naql. The correct creed produces upright deeds, peace of heart in this world, and salvation in the Hereafter.',
  },
  {
    id: 'generic_fiqh',
    domaine: 'fiqh',
    explication_en: 'This question pertains to Islamic jurisprudence (fiqh), the science of practical rulings drawn from their detailed evidences. The four sources of fiqh agreed by the majority of Sunni scholars are: the Qur\'an, the authentic Sunnah, the consensus of the scholars (ijma\'), and analogy (qiyas). To these are added secondary sources used by some madhhabs: customary practice (\'urf), the precepts of preceding revelations not abrogated, the saying of a Companion, public interest (maslahah mursalah), juristic preference (istihsan). The four well-known Sunni schools (Hanafi, Maliki, Shafi\'i, Hanbali) all draw on the same sources but differ on points of detail through legitimate ijtihad. The lay Muslim should follow one of these schools or seek the strongest evidence with the help of trustworthy scholars, without sectarianism between them. Knowing the ruling, its evidence, and its purpose (hikmah) elevates worship from blind imitation to enlightened obedience.',
  },
  {
    id: 'generic_akhlaq',
    domaine: 'akhlaq',
    explication_en: 'This question pertains to Islamic ethics (akhlaq), the inner soul of religion. The Prophet (peace be upon him) said: "I was sent only to perfect noble character" (Ahmad, authenticated by al-Albani). Akhlaq is divided into two: rights upon the Creator (sincerity, love, fear, hope, reliance, gratitude, patience), and rights upon creation (justice, mercy, generosity, truthfulness, fulfilment of trusts, restraint of harm, good companionship). Noble character (husn al-khuluq) is one of the heaviest things in the scales of the Day of Resurrection (hadith of Abu al-Darda\', al-Tirmidhi sahih). The Prophet (peace be upon him) drew the link between faith and ethics: "The most complete of believers in faith is the best of them in character" (Abu Dawud sahih). Sincerity, generosity, patience, and humility are stations of the path to Allah described by Ibn al-Qayyim in Madarij al-Salikin. Outward deeds are purified by inner ones; the work of the heart is the foundation upon which the work of the limbs is built.',
  },
];

// ============================================================
// MOTEUR — réutilise la logique de v2 pour matcher la même règle
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

  for (const r of RULES_EN) {
    if (r.domaine !== q.domaine) continue;
    if (r.sous_domaines && sd && r.sous_domaines.some(s => s.toLowerCase() === sd)) {
      return r;
    }
  }
  for (const r of RULES_EN) {
    if (r.domaine !== q.domaine) continue;
    if (r.keywords && r.keywords.some(k => texte.includes(k.toLowerCase()))) {
      return r;
    }
  }
  for (const r of RULES_EN) {
    if (r.domaine === q.domaine && !r.keywords && !r.sous_domaines) {
      return r;
    }
  }
  return undefined;
}

export async function enrichDalilEn(client: Client): Promise<void> {
  console.log('  Enrichissement EN du dalil...');

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
        verset_en = COALESCE($1, verset_en),
        hadith_texte_en = COALESCE($2, hadith_texte_en),
        parole_savant_en = COALESCE($3, parole_savant_en),
        explication_en = COALESCE($4, explication_en)
       WHERE id = $5`,
      [
        rule.verset_en || null,
        rule.hadith_texte_en || null,
        rule.parole_savant_en || null,
        rule.explication_en,
        q.id,
      ]
    );
    enriched++;
  }

  console.log(`  ✓ Dalil EN enrichi pour ${enriched} questions (sur ${questions.length}).`);
  console.log(`  ✓ ${RULES_EN.length} règles EN actives.`);
}
