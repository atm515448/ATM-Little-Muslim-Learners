
"use strict";

/* ATM Little Muslim Learners
   Imam An-Nawawi's Complete 42 Hadith
   Arabic and English: fawazahmed0/hadith-api
   Hausa: Independent translation draft
   Audio: Saad al-Ghamadi
   Audio source: Farhat Hashmi / Al-Huda Media
*/

(function () {
  const panel = document.getElementById("hadith");
  if (!panel) return;

  const BASE =
    "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/";

  const SOURCES = {
    arabic: BASE + "ara-nawawi",
    english: BASE + "eng-nawawi"
  };

  const AUDIO_BASE =
    "https://data.alhudamedia.com/Fh/Forty-Hadith-Audio/nawawi";

  const AUDIO_PAGE =
    "https://www.farhathashmi.com/hadith-section/arbain-nawawi/hadith-audios/";

  const HAUSA_TRANSLATIONS = {
    1: `Daga Umar bn Khaddab (Allah Ya yarda da shi), ya ce: Na ji Manzon Allah (tsira da amincin Allah su tabbata a gare shi) yana cewa: "Lallai ayyuka suna kasancewa ne bisa niyya, kuma kowane mutum yana da abin da ya yi niyya. Saboda haka, wanda hijirarsa ta kasance zuwa ga Allah da ManzonSa, to hijirarsa tana zuwa ga Allah da ManzonSa. Wanda kuma hijirarsa ta kasance domin wata duniya da zai samu ko wata mace da zai aura, to hijirarsa tana zuwa ne ga abin da ya yi hijira dominsa."`,

    2: `Daga Umar (Allah Ya yarda da shi), ya ce: Wata rana muna zaune tare da Manzon Allah (tsira da amincin Allah su tabbata a gare shi), sai ga wani mutum ya bayyana a gare mu. Tufafinsa farare ne sosai, gashinsa kuma baƙi ne sosai. Ba a ga alamun tafiya a jikinsa ba, kuma babu wanda ya san shi. Ya zauna kusa da Annabi, ya jingina gwiwoyinsa da gwiwoyin Annabi, ya ɗora tafukansa a kan cinyoyinsa, sannan ya ce: "Ya Muhammad! Ka ba ni labarin Musulunci." Annabi ya ce: "Musulunci shi ne ka shaida cewa babu abin bautawa da gaskiya sai Allah, kuma Muhammad Manzon Allah ne; ka tsayar da sallah; ka bayar da zakka; ka yi azumin Ramadan; ka ziyarci Ɗakin Allah domin aikin Hajji idan kana da ikon zuwa." Mutumin ya ce: "Ka yi gaskiya." Ya tambayi Annabi game da Imani, sai ya bayyana imani da Allah, mala'ikunSa, littattafanSa, manzanninSa, Ranar Lahira da ƙaddara, alherinta da sharrinta. Ya tambayi Ihsani, sai Annabi ya ce: "Ka bauta wa Allah kamar kana ganinsa; ko da ba ka ganinsa, lallai Shi yana ganinka." Ya tambayi lokacin Alƙiyama da alamominta. Daga baya Annabi ya bayyana cewa mutumin Jibrilu ne, ya zo domin ya koya wa mutane addininsu.`,

    3: `Daga Abdullahi bn Umar (Allah Ya yarda da su), ya ce: Na ji Manzon Allah (tsira da amincin Allah su tabbata a gare shi) yana cewa: "An gina Musulunci a kan abubuwa guda biyar: Shaidar cewa babu abin bautawa da gaskiya sai Allah, kuma Muhammad Manzon Allah ne; tsayar da sallah; bayar da zakka; aikin Hajji zuwa Ɗakin Allah; da azumin watan Ramadan."`,

    4: `Daga Abdullahi bn Mas'ud (Allah Ya yarda da shi), ya ce: Manzon Allah (tsira da amincin Allah su tabbata a gare shi), wanda yake mai gaskiya kuma abin gaskatawa, ya ba mu labari cewa: "Lallai ana tattara halittar ɗayanku a cikin mahaifiyarsa na tsawon kwana arba'in a matsayin digon maniyyi. Sannan ya zama gudan jini na tsawon irin wannan lokaci, sannan ya zama tsoka kamar abin taunawa na tsawon irin wannan lokaci. Daga nan sai a aiko mala'ika, a hura masa rai, kuma a umarce shi da rubuta abubuwa huɗu: arzikinsa, ajalinsa, ayyukansa da kuma ko zai kasance cikin 'yan Aljanna ko 'yan Wuta. Na rantse da Allah, wanda babu abin bautawa da gaskiya sai Shi, lallai mutum zai iya yin ayyukan mutanen Aljanna har sai tazarar da ke tsakaninsa da Aljanna ta zama kamar zira'i ɗaya, sai abin da aka rubuta masa ya riga shi, ya aikata ayyukan mutanen Wuta, ya shiga Wuta. Haka kuma mutum zai iya yin ayyukan mutanen Wuta har sai tazarar da ke tsakaninsa da Wuta ta zama kamar zira'i ɗaya, sai abin da aka rubuta masa ya riga shi, ya aikata ayyukan mutanen Aljanna, ya shiga Aljanna."`,

    5: `Daga A'isha (Allah Ya yarda da ita), ta ce: Manzon Allah (tsira da amincin Allah su tabbata a gare shi) ya ce: "Duk wanda ya ƙirƙiro wani abu a cikin wannan al'amarin namu na addini wanda ba ya cikinsa, to za a ƙi shi." A wata riwaya kuma: "Duk wanda ya aikata wani aiki wanda umarninmu bai zo da shi ba, to za a ƙi wannan aikin."`,

    6: `Daga Nu'uman bn Bashir (Allah Ya yarda da su), ya ce: Na ji Manzon Allah (tsira da amincin Allah su tabbata a gare shi) yana cewa: "Lallai halal a bayyane yake, haram kuma a bayyane yake. A tsakaninsu akwai abubuwa masu shakku waɗanda mutane da yawa ba su san hukuncinsu ba. Wanda ya nisanci abubuwan shakku, ya tsare addininsa da mutuncinsa. Wanda kuma ya faɗa cikin abubuwan shakku, yana iya faɗawa cikin haram, kamar makiyayin da yake kiwon dabbobi a gefen wani fili da aka killace, dabbobinsa za su kusan shiga cikinsa. Ku sani, kowane sarki yana da fili da ya killace; fili da Allah Ya killace shi kuwa shi ne abubuwan da Ya haramta. Ku sani, a jiki akwai wata tsoka; idan ta gyaru, dukkan jiki ya gyaru, idan ta lalace kuwa, dukkan jiki ya lalace. Ku sani, ita ce zuciya."`,

    7: `Daga Tamim Ad-Dari (Allah Ya yarda da shi), cewa Annabi (tsira da amincin Allah su tabbata a gare shi) ya ce: "Addini nasiha ne." Mun ce: "Ga wa?" Ya ce: "Ga Allah, LittafinSa, ManzonSa, shugabannin Musulmi da sauran Musulmi baki ɗaya."`,

    8: `Daga Abdullahi bn Umar (Allah Ya yarda da su), cewa Manzon Allah (tsira da amincin Allah su tabbata a gare shi) ya ce: "An umarce ni da in yi yaƙi da mutane har sai sun shaida cewa babu abin bautawa da gaskiya sai Allah, kuma Muhammad Manzon Allah ne, su tsayar da sallah, su bayar da zakka. Idan suka aikata haka, sun tsare jininsu da dukiyoyinsu daga gare ni, sai dai bisa haƙƙin Musulunci; kuma hisabinsu yana wurin Allah."`,

    9: `Daga Abu Huraira (Allah Ya yarda da shi), daga Manzon Allah (tsira da amincin Allah su tabbata a gare shi), ya ce: "Abin da na hana ku, ku nisance shi; abin da na umarce ku da shi, ku aikata gwargwadon ikonsa. Lallai abin da ya halakar da waɗanda suka gabace ku shi ne yawan tambayoyinsu da saɓaninsu ga annabawa."`,

    10: `Daga Abu Huraira (Allah Ya yarda da shi), ya ce: Manzon Allah (tsira da amincin Allah su tabbata a gare shi) ya ce: "Lallai Allah Mai tsarki ne, kuma ba Ya karɓar komai sai mai tsarki. Kuma Allah Ya umarci muminai da abin da Ya umarci manzanni da shi. Allah Ya ce: 'Ya ku manzanni! Ku ci daga abubuwa masu kyau, kuma ku aikata ayyukan ƙwarai.' Kuma Ya ce: 'Ya ku waɗanda suka yi imani! Ku ci daga abubuwa masu kyau da Muka azurta ku da su.' Sannan Annabi ya ambaci mutumin da ya yi doguwar tafiya, gashinsa ya toushe, jikinsa ya ƙura, yana ɗaga hannuwansa zuwa sama yana cewa: 'Ya Ubangijina! Ya Ubangijina!' alhali abincinsa haram ne, abin shansa haram ne, tufafinsa haram ne, kuma an ciyar da shi da haram. Ta yaya za a amsa masa addu'arsa?"`,

    11: `Daga Al-Hasan bn Ali (Allah Ya yarda da su), ya ce: Na haddace daga Manzon Allah (tsira da amincin Allah su tabbata a gare shi) cewa: "Ka bar abin da yake sanya ka cikin shakku, ka koma ga abin da ba ya sanya ka cikin shakku."`,

    12: `Daga Abu Huraira (Allah Ya yarda da shi), cewa Manzon Allah (tsira da amincin Allah su tabbata a gare shi) ya ce: "Daga kyawun Musuluncin mutum akwai barin abin da ba ya shafe shi."`,

    13: `Daga Anas bn Malik (Allah Ya yarda da shi), daga Annabi (tsira da amincin Allah su tabbata a gare shi), ya ce: "Babu ɗayanku da zai cika imani har sai ya so wa ɗan'uwansa abin da yake so wa kansa."`,

    14: `Daga Abdullahi bn Mas'ud (Allah Ya yarda da shi), cewa Manzon Allah (tsira da amincin Allah su tabbata a gare shi) ya ce: "Ba ya halatta zubar da jinin Musulmin da ya shaida cewa babu abin bautawa da gaskiya sai Allah, kuma ni Manzon Allah ne, sai dai a ɗaya daga cikin abubuwa uku: mutumin da ya yi kisan kai, mai aure da ya aikata zina, da wanda ya bar addininsa ya rabu da jama'ar Musulmi." Wannan hadisi bayani ne na hukuncin shari'a; ba izini ba ne ga wani mutum ya ɗauki doka a hannunsa.`,
     
  15: `An karɓo daga Abu Hurairah (Allah Ya yarda da shi), ya ce: Manzon Allah ﷺ ya ce: “Wanda ya yi imani da Allah da Ranar Lahira, ya faɗi alheri ko ya yi shiru. Wanda ya yi imani da Allah da Ranar Lahira, ya girmama maƙwabcinsa. Wanda ya yi imani da Allah da Ranar Lahira, ya girmama baƙonsa.”`,
  16: `An karɓo daga Abu Hurairah (Allah Ya yarda da shi), ya ce: Wani mutum ya ce wa Annabi ﷺ: “Ka yi mini wasiyya.” Sai ya ce: “Kada ka yi fushi.” Mutumin ya maimaita tambayar sau da dama, Annabi ﷺ kuma ya ci gaba da cewa: “Kada ka yi fushi.”`,
  17: `An karɓo daga Shaddad ɗan Aus (Allah Ya yarda da shi), daga Manzon Allah ﷺ, ya ce: “Lallai Allah Ya wajabta kyautatawa a kan komai. Idan za ku kashe, ku kyautata hanyar kashewa; idan za ku yanka, ku kyautata hanyar yankawa. Kowannenku ya wasa wuƙarsa, kuma ya sauƙaƙa wa dabbar da yake yankawa.”`,
  18: `An karɓo daga Abu Dharr Jundub ɗan Junadah da Abu Abdur-Rahman Mu'adh ɗan Jabal (Allah Ya yarda da su), daga Manzon Allah ﷺ, ya ce: “Ka ji tsoron Allah a duk inda kake; ka bi mummunan aiki da kyakkyawan aiki, zai shafe shi; kuma ka mu'amalanci mutane da kyawawan ɗabi'u.”`,
  19: `An karɓo daga Abdullahi ɗan Abbas (Allah Ya yarda da su), ya ce: Wata rana ina bayan Annabi ﷺ, sai ya ce: “Ya kai yaro! Zan koya maka wasu kalmomi: Ka kiyaye Allah, Allah zai kiyaye ka. Ka kiyaye Allah, za ka same Shi a gabanka. Idan za ka roƙa, ka roƙi Allah; idan za ka nemi taimako, ka nemi taimakon Allah. Ka sani cewa da al'umma gaba ɗaya za su haɗu domin su amfane ka da wani abu, ba za su amfane ka ba sai da abin da Allah Ya riga Ya rubuta maka. Idan kuma za su haɗu domin su cutar da kai da wani abu, ba za su cutar da kai ba sai da abin da Allah Ya riga Ya rubuta maka. An ɗaga alƙaluma, kuma takardu sun bushe.”`,
  20: `An karɓo daga Abu Mas'ud Uqbah ɗan Amr Al-Ansari Al-Badri (Allah Ya yarda da shi), ya ce: Manzon Allah ﷺ ya ce: “Daga cikin abin da mutane suka riska daga maganganun annabawa na farko akwai: Idan ba ka jin kunya, to ka aikata abin da ka ga dama.”`,
  21: `An karɓo daga Sufyan ɗan Abdullahi (Allah Ya yarda da shi), ya ce: Na ce: “Ya Manzon Allah! Ka gaya mini wata magana game da Musulunci wadda ba zan tambayi wani ba bayanka.” Sai ya ce: “Ka ce: Na yi imani da Allah, sannan ka tsaya kyam a kan hakan.”`,
  22: `An karɓo daga Abu Abdullahi Jabir ɗan Abdullahi Al-Ansari (Allah Ya yarda da su), cewa wani mutum ya tambayi Manzon Allah ﷺ: “Idan na yi salloli farilla, na yi azumin Ramadan, na halatta halal, na haramta haram, kuma ban ƙara komai a kan haka ba, shin zan shiga Aljanna?” Sai ya ce: “Eh.”`,
  23: `An karɓo daga Abu Malik Al-Harith ɗan Asim Al-Ash'ari (Allah Ya yarda da shi), ya ce: Manzon Allah ﷺ ya ce: “Tsarki rabin imani ne. Alhamdu lillah tana cika ma'auni. Subhanallahi walhamdu lillah suna cika abin da ke tsakanin sammai da ƙasa. Sallah haske ce. Sadaka hujja ce. Haƙuri haske ne. Alƙur'ani hujja ne a gare ka ko a kanka. Kowanne mutum yana fita da safe yana sayar da kansa; ko ya 'yantar da kansa, ko ya halaka ta.”`,
  24: `An karɓo daga Abu Dharr (Allah Ya yarda da shi), daga Annabi ﷺ, cikin abin da ya ruwaito daga Ubangijinsa, cewa Allah Ya ce: “Ya bayina! Na haramta zalunci a kaina, kuma Na sanya shi haram a tsakaninku, saboda haka kada ku zalunci juna. Ya bayina! Dukkanku batattu ne sai wanda Na shiryar; ku nemi shiriyata, Zan shiryar da ku. Ya bayina! Dukkanku mayunwata ne sai wanda Na ciyar; ku nemi abinci daga gare Ni, Zan ciyar da ku. Ya bayina! Dukkanku tsirara ne sai wanda Na tufatar; ku nemi tufafi daga gare Ni, Zan tufatar da ku. Ya bayina! Kuna yin laifi dare da rana, Ni kuma Ina gafarta zunubai gaba ɗaya; ku nemi gafarata, Zan gafarta muku.”`,
  25: `An karɓo daga Abu Dharr (Allah Ya yarda da shi), cewa wasu daga cikin Sahabban Manzon Allah ﷺ suka ce masa: “Ya Manzon Allah! Masu dukiya sun tafi da lada; suna yin sallah kamar yadda muke yi, suna azumi kamar yadda muke yi, kuma suna yin sadaka daga abin da ya wuce dukiyarsu.” Sai ya ce: “Ashe Allah bai sanya muku abin da za ku yi sadaka da shi ba? Kowace tasbihi sadaka ce, kowace kabbara sadaka ce, kowace hamdala sadaka ce, kowace tahlila sadaka ce, umarni da alheri sadaka ne, hani daga mummuna sadaka ne, kuma saduwar ɗayanku da matarsa sadaka ce.”`,
  26: `An karɓo daga Abu Hurairah (Allah Ya yarda da shi), ya ce: Manzon Allah ﷺ ya ce: “A kan kowace gaɓa ta mutum akwai sadaka a kowace rana da rana take fitowa. Yin adalci tsakanin mutane sadaka ne. Taimaka wa mutum ya hau abin hawansa ko ɗaga masa kayansa sadaka ne. Kalma mai kyau sadaka ce. Kowane taku da mutum yake yi zuwa sallah sadaka ne. Kawar da abu mai cutarwa daga hanya sadaka ne.”`,
  27: `An karɓo daga Nawwas ɗan Sam'an (Allah Ya yarda da shi), daga Annabi ﷺ, ya ce: “Kyakkyawan aiki shi ne kyawawan ɗabi'u, zunubi kuma shi ne abin da yake damun zuciyarka, kuma ba ka son mutane su san shi.” Kuma an karɓo daga Wabisah ɗan Ma'bad (Allah Ya yarda da shi), ya ce: Na zo wurin Manzon Allah ﷺ, sai ya ce: “Ka zo ne domin ka tambayi kyakkyawan aiki?” Na ce: “Eh.” Sai ya ce: “Ka tambayi zuciyarka. Kyakkyawan aiki shi ne abin da zuciya ta natsu da shi, kuma rai ya samu nutsuwa a kansa. Zunubi kuma shi ne abin da yake damun zuciyarka kuma yake yawo a ƙirjinka, ko da mutane sun ba ka fatawa.”`,
  28: `An karɓo daga Abu Najih Al-Irbad ɗan Sariyah (Allah Ya yarda da shi), ya ce: Manzon Allah ﷺ ya yi mana wa'azi mai ratsa zukata, har idanu suka zubar da hawaye, zukata suka firgita. Sai muka ce: “Ya Manzon Allah! Kamar wa'azin mai bankwana ne. Ka yi mana wasiyya.” Sai ya ce: “Ina yi muku wasiyya da jin tsoron Allah, da ji da biyayya, ko da bawa ne ya zama shugabanku. Lallai wanda zai rayu a cikinku zai ga saɓani mai yawa. Ku riƙe Sunnata da Sunnar halifofi shiryayyu masu shiryarwa a bayana. Ku manne da ita sosai, kuma ku yi hattara da sababbin abubuwa a addini, domin kowace bidi'a ɓata ce.”`,
  29: `An karɓo daga Mu'adh ɗan Jabal (Allah Ya yarda da shi), ya ce: Na ce: “Ya Manzon Allah! Ka gaya mini wani aiki da zai shigar da ni Aljanna kuma ya nisantar da ni daga Wuta.” Sai ya ambaci ginshiƙan Musulunci, sannan ya ce: “Shin ba zan nuna maka ƙofar alheri ba? Azumi garkuwa ne, sadaka tana kashe zunubi kamar yadda ruwa yake kashe wuta, kuma sallar mutum a tsakiyar dare.” Sai ya karanta: “Gefensu yana nisantar gadaje...” har zuwa ƙarshen ayar. Sannan ya ce: “Shin ba zan gaya maka kan al'amarin, ginshiƙinsa da kololuwarsa ba?” Na ce: “Eh, ya Manzon Allah.” Ya ce: “Kan al'amari shi ne Musulunci, ginshiƙinsa shi ne sallah, kololuwarsa kuma shi ne jihadi.” Sannan ya ce: “Shin ba zan gaya maka abin da yake riƙe dukkan waɗannan ba?” Na ce: “Eh, ya Manzon Allah.” Sai ya riƙe harshensa ya ce: “Ka kame wannan.” Na ce: “Ya Annabin Allah! Shin za a kama mu da abin da muke faɗa?” Ya ce: “Mahaifiyarka ta rasa ka, ya Mu'adh! Shin akwai abin da yake jefa mutane a cikin Wuta a kan fuskokinsu ko hancinsu face sakamakon abin da harsunansu suka girba?”`,
  30: `An karɓo daga Abu Tha'labah Al-Khushani Jurthum ɗan Nashir (Allah Ya yarda da shi), daga Manzon Allah ﷺ, ya ce: “Lallai Allah Maɗaukaki Ya wajabta wasu farillai, saboda haka kada ku yi sakaci da su. Ya sanya wasu iyakoki, saboda haka kada ku ƙetare su. Ya haramta wasu abubuwa, saboda haka kada ku aikata su. Ya yi shiru game da wasu abubuwa saboda rahama gare ku, ba don mantuwa ba, saboda haka kada ku zurfafa bincike a kansu.”`,
  31: `An karɓo daga Abu Al-Abbas Sahl ɗan Sa'ad Al-Sa'idi (Allah Ya yarda da shi), ya ce: Wani mutum ya zo wurin Annabi ﷺ ya ce: “Ya Manzon Allah! Ka nuna mini wani aiki wanda idan na aikata shi Allah zai so ni, mutane kuma za su so ni.” Sai ya ce: “Ka guji son duniya, Allah zai so ka; ka guji abin da yake hannun mutane, mutane za su so ka.”`,
  32: `An karɓo daga Abu Sa'id Sa'ad ɗan Malik ɗan Sinan Al-Khudri (Allah Ya yarda da shi), cewa Manzon Allah ﷺ ya ce: “Kada a cutar, kuma kada a rama cuta da cuta.”`,
  33: `An karɓo daga Abdullahi ɗan Abbas (Allah Ya yarda da su), cewa Manzon Allah ﷺ ya ce: “Da ana ba mutane duk abin da suka yi da'awa, da wasu mutane sun yi da'awar dukiyar wasu da jininsu. Amma hujja tana kan mai da'awa, rantsuwa kuma tana kan wanda ya musanta.”`,
  34: `An karɓo daga Abu Sa'id Al-Khudri (Allah Ya yarda da shi), ya ce: Na ji Manzon Allah ﷺ yana cewa: “Duk wanda ya ga wani abin ƙi daga cikinku, to ya canza shi da hannunsa; idan ba zai iya ba, da harshensa; idan ba zai iya ba, da zuciyarsa. Wannan shi ne mafi raunin imani.”`,
  35: `An karɓo daga Abu Hurairah (Allah Ya yarda da shi), ya ce: Manzon Allah ﷺ ya ce: “Kada ku yi hassada da juna, kada ku yi ha'inci a kasuwanci, kada ku ƙi juna, kada ku juya wa juna baya, kada wani ya yi ciniki a kan cinikin ɗan'uwansa. Ku kasance bayin Allah masu 'yan'uwantaka. Musulmi ɗan'uwan Musulmi ne: ba ya zaluntarsa, ba ya wulaƙanta shi, kuma ba ya ƙin taimakonsa. Tsoron Allah yana nan a nan,” ya nuna ƙirjinsa sau uku. “Ya isa mutum ya zama mugu idan ya raina ɗan'uwansa Musulmi. Jinin Musulmi, dukiyarsa da mutuncinsa haramun ne ga wani Musulmi.”`,
  36: `An karɓo daga Abu Hurairah (Allah Ya yarda da shi), daga Annabi ﷺ, ya ce: “Duk wanda ya yaye wa mumini wata damuwa daga damuwoyin duniya, Allah zai yaye masa wata damuwa daga damuwoyin Ranar Alƙiyama. Duk wanda ya sauƙaƙa wa wanda yake cikin ƙunci, Allah zai sauƙaƙa masa a duniya da Lahira. Duk wanda ya suturta Musulmi, Allah zai suturta shi a duniya da Lahira. Allah yana taimakon bawa matuƙar bawan yana taimakon ɗan'uwansa. Duk wanda ya bi wata hanya domin neman ilimi, Allah zai sauƙaƙa masa hanyar zuwa Aljanna. Babu wasu mutane da suke taruwa a ɗaya daga cikin gidajen Allah suna karanta Littafin Allah kuma suna nazarinsa a tsakaninsu face nutsuwa ta sauka a kansu, rahama ta lulluɓe su, mala'iku su kewaye su, kuma Allah Ya ambace su a wurin waɗanda suke tare da Shi. Duk wanda aikinsa ya jinkirta shi, asalinsa ba zai gaggauta shi ba.”`,
  37: `An karɓo daga Abdullahi ɗan Abbas (Allah Ya yarda da su), daga Manzon Allah ﷺ, cikin abin da ya ruwaito daga Ubangijinsa, cewa Allah Ya rubuta kyawawan ayyuka da munanan ayyuka, sannan Ya bayyana hakan: “Duk wanda ya yi niyyar kyakkyawan aiki amma bai aikata shi ba, Allah zai rubuta masa lada cikakke. Idan kuma ya yi niyyarsa sannan ya aikata shi, Allah zai rubuta masa lada goma har zuwa ninki ɗari da yawa. Idan ya yi niyyar mummunan aiki amma bai aikata shi ba, Allah zai rubuta masa lada cikakke. Idan kuma ya yi niyyarsa sannan ya aikata shi, Allah zai rubuta masa zunubi guda ɗaya.”`,
  38: `An karɓo daga Abu Hurairah (Allah Ya yarda da shi), ya ce: Manzon Allah ﷺ ya ce: Allah Maɗaukaki Ya ce: “Duk wanda ya nuna ƙiyayya ga wani waliyyina, Na sanar da shi yaƙi daga gare Ni. Bawana ba ya kusantata da wani abu da ya fi abin da Na wajabta masa so. Bawana kuma yana ci gaba da kusantata da ayyukan nafila har sai Na so shi. Idan Na so shi, Ni ne jinsa da yake ji da shi, ganinsa da yake gani da shi, hannunsa da yake aiki da shi, ƙafarsa da yake tafiya da ita. Idan ya roƙe Ni, Zan ba shi; idan ya nemi tsarona, Zan tsare shi.”`,
  39: `An karɓo daga Abdullahi ɗan Abbas (Allah Ya yarda da su), cewa Manzon Allah ﷺ ya ce: “Lallai Allah Ya yafe wa al'ummata kuskure, mantuwa, da abin da aka tilasta musu aikatawa.”`,
  40: `An karɓo daga Abdullahi ɗan Umar (Allah Ya yarda da su), ya ce: Manzon Allah ﷺ ya kama kafaɗata ya ce: “Ka kasance a duniya kamar baƙo ko matafiyi.” Ibn Umar ya kasance yana cewa: “Idan ka yi yamma, kada ka jira safiya; idan ka yi safiya, kada ka jira yamma. Ka yi amfani da lafiyarka kafin rashin lafiya, kuma ka yi amfani da rayuwarka kafin mutuwa.”`,
  41: `An karɓo daga Abu Muhammad Abdullahi ɗan Amr ɗan Al-As (Allah Ya yarda da su), ya ce: Manzon Allah ﷺ ya ce: “Imanin ɗayanku ba zai cika ba har sai son zuciyarsa ya bi abin da na zo da shi.”`,
  42: `An karɓo daga Anas ɗan Malik (Allah Ya yarda da shi), ya ce: Na ji Manzon Allah ﷺ yana cewa: Allah Maɗaukaki Ya ce: “Ya kai ɗan Adam! Matukar ka roƙe Ni kuma ka yi fata gare Ni, Zan gafarta maka abin da ya kasance daga gare ka, kuma ba zan damu ba. Ya kai ɗan Adam! Da zunubanka za su kai girman sammai, sannan ka nemi gafarata, Zan gafarta maka. Ya kai ɗan Adam! Da za ka zo Mini da zunubai masu cika duniya, sannan ka haɗu da Ni ba tare da ka yi shirka da Ni ba, Zan zo maka da gafara mai cika duniya.”`
};
    
  let hadiths = [];
  let current = 0;

  const ARABIC_URL =
    "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-nawawi.json";

  const ENGLISH_URL =
    "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-nawawi.json";

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

function audioURL(number) {
  return AUDIO_BASE +
    String(number).padStart(2, "0") + ".mp3";
}

  async function loadEdition(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Unable to load hadith edition.");
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.hadiths)) {
      throw new Error("Invalid hadith data.");
    }

    return data.hadiths;
  }

  function getNumber(item, index) {
    return Number(
      item.hadithnumber ||
      item.hadithNumber ||
      item.number ||
      index + 1
    );
  }

  function getText(item) {
    return item.text || item.hadith || "";
  }

  function getNarrator(text) {
    const patterns = [
      /^On the authority of ([^,]+(?:,\s*[^,]+)?)/i,
      /^It is narrated on the authority of ([^,]+(?:,\s*[^,]+)?)/i,
      /^Narrated by ([^:]+):/i,
      /^Narrated ([^:]+):/i
    ];

    for (const pattern of patterns) {
      const match = String(text || "").match(pattern);
      if (match) return match[1].trim();
    }

    return "";
  }

  function showMessage(message) {
    if (!panel) return;

    panel.innerHTML = `
      <div style="padding:18px;text-align:center;">
        <p>${escapeHTML(message)}</p>
        <button id="hadithRetry"
          style="padding:10px 18px;border:0;border-radius:8px;cursor:pointer;">
          Retry
        </button>
      </div>
    `;

    const retry = document.getElementById("hadithRetry");

    if (retry) {
      retry.addEventListener("click", loadAll);
    }
  }

  function render() {
    if (!panel || !hadiths.length) return;

    const item = hadiths[current];
    const number = item.number;
    const narrator = getNarrator(item.english);
    const hausa = HAUSA_TRANSLATIONS[number] || "";

    panel.innerHTML = `
      <div class="hadith-container">

        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
          <strong>Hadith ${number} of 42</strong>
          <span>Imam An-Nawawi's Forty Hadith</span>
        </div>

        <div style="margin-bottom:16px;">
          <label for="hadithSelect"><strong>Select Hadith</strong></label>
          <select id="hadithSelect"
            style="width:100%;padding:10px;margin-top:6px;border-radius:8px;">
            ${hadiths.map((h, index) => `
              <option value="${index}" ${index === current ? "selected" : ""}>
                Hadith ${h.number}
              </option>
            `).join("")}
          </select>
        </div>

        <div style="margin-bottom:16px;">
          <label for="hadithSearch"><strong>Search Hadith</strong></label>
          <input id="hadithSearch"
            type="search"
            placeholder="Search Arabic, English or Hausa..."
            style="width:100%;padding:10px;margin-top:6px;border-radius:8px;box-sizing:border-box;">
          <div id="hadithSearchResults"></div>
        </div>

        <hr>

        <h3>Arabic</h3>
        <div dir="rtl" lang="ar"
          style="font-size:25px;line-height:2.1;text-align:right;padding:12px 4px;">
          ${escapeHTML(item.arabic)}
        </div>

        <hr>

        <h3>English Translation</h3>
        <div style="line-height:1.8;">
          ${escapeHTML(item.english)}
        </div>

        <hr>

        <h3>Fassarar Hausa</h3>
        <div lang="ha" style="line-height:1.9;">
          ${escapeHTML(hausa)}
        </div>

        <p style="font-size:12px;opacity:0.75;margin-top:10px;">
          Lura: Fassarar Hausa da aka gabatar a nan daftarin aiki ne
          domin taimakon fahimta. Ana buƙatar malami mai ilimi ya duba
          ta kafin a ɗauke ta a matsayin ingantacciyar fassara.
        </p>

        ${narrator ? `
          <p><strong>Narrator (as identified in English text):</strong>
          ${escapeHTML(narrator)}</p>
        ` : ""}

        <hr>

        <h3>Listen to Hadith ${number}</h3>
        <audio controls preload="none" style="width:100%;">
          <source src="${escapeHTML(audioURL(number))}" type="audio/mpeg">
          Your browser does not support audio playback.
        </audio>

        <p style="font-size:12px;">
          Recitation: Saad al-Ghamadi.
          <a href="${escapeHTML(AUDIO_PAGE)}" target="_blank" rel="noopener noreferrer">
            Audio source
          </a>
        </p>

        <hr>

        <div style="display:flex;justify-content:space-between;gap:10px;margin-top:16px;">
          <button id="hadithPrevious"
            ${current === 0 ? "disabled" : ""}
            style="padding:10px 16px;border:0;border-radius:8px;cursor:pointer;">
            Previous
          </button>

          <button id="hadithNext"
            ${current === hadiths.length - 1 ? "disabled" : ""}
            style="padding:10px 16px;border:0;border-radius:8px;cursor:pointer;">
            Next
          </button>
        </div>

      </div>
    `;

    document.getElementById("hadithPrevious")
      ?.addEventListener("click", function () {
        if (current > 0) {
          current--;
          render();
        }
      });

    document.getElementById("hadithNext")
      ?.addEventListener("click", function () {
        if (current < hadiths.length - 1) {
          current++;
          render();
        }
      });

    document.getElementById("hadithSelect")
      ?.addEventListener("change", function (event) {
        current = Number(event.target.value);
        render();
      });

    document.getElementById("hadithSearch")
      ?.addEventListener("input", function (event) {
        const query = event.target.value.trim().toLowerCase();
        const results = document.getElementById("hadithSearchResults");

        if (!results) return;

        if (!query) {
          results.innerHTML = "";
          return;
        }

        const matches = hadiths.filter(function (h) {
          const hausaText = HAUSA_TRANSLATIONS[h.number] || "";

          return (
            h.arabic.toLowerCase().includes(query) ||
            h.english.toLowerCase().includes(query) ||
            hausaText.toLowerCase().includes(query)
          );
        });

        if (!matches.length) {
          results.innerHTML = "<p>No matching hadith found.</p>";
          return;
        }

        results.innerHTML = matches.map(function (h) {
          const index = hadiths.findIndex(
            item => item.number === h.number
          );

          return `
            <button type="button"
              data-hadith-index="${index}"
              style="display:block;width:100%;text-align:left;padding:9px;margin-top:5px;border-radius:6px;cursor:pointer;">
              Hadith ${h.number}
            </button>
          `;
        }).join("");

        results.querySelectorAll("[data-hadith-index]")
          .forEach(function (button) {
            button.addEventListener("click", function () {
              current = Number(button.dataset.hadithIndex);
              render();
            });
          });
      });
  }

  async function loadAll() {
    showMessage("Loading all 42 Hadith...");

    try {
      const [arabicList, englishList] = await Promise.all([
        loadEdition(ARABIC_URL),
        loadEdition(ENGLISH_URL)
      ]);

      const arabicMap = new Map();
      const englishMap = new Map();

      arabicList.forEach(function (item, index) {
        arabicMap.set(getNumber(item, index), getText(item));
      });

      englishList.forEach(function (item, index) {
        englishMap.set(getNumber(item, index), getText(item));
      });

      hadiths = [];

      for (let number = 1; number <= 42; number++) {
        const arabic = arabicMap.get(number);
        const english = englishMap.get(number);

        if (!arabic || !english) {
          throw new Error("Hadith " + number + " could not be loaded.");
        }

        hadiths.push({
          number: number,
          arabic: arabic,
          english: english
        });
      }

      current = 0;
      render();

    } catch (error) {
      console.error("Hadith loading error:", error);

      showMessage(
        "Unable to load the complete Hadith collection. Please check your internet connection and try again."
      );
    }
  }

  loadAll();

})();
        
