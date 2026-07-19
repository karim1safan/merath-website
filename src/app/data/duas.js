const DUA_CATEGORIES = [
  { id: 'morning', name: 'أدعية الصباح' },
  { id: 'evening', name: 'أدعية المساء' },
  { id: 'sleep', name: 'أدعية النوم' },
  { id: 'wakeup', name: 'أدعية الاستيقاظ' },
  { id: 'prayer', name: 'أدعية الصلاة' },
  { id: 'travel', name: 'أدعية السفر' },
  { id: 'food', name: 'أدعية الطعام والشراب' },
  { id: 'distress', name: 'أدعية الهم والحزن' },
  { id: 'protection', name: 'أدعية الحفظ والحماية' },
  { id: 'forgiveness', name: 'أدعية الاستغفار' },
  { id: 'rain', name: 'أدعية المطر' },
  { id: 'illness', name: 'أدعية المريض' },
];

const DUAS_BY_CATEGORY = {
  morning: [
    {
      id: 'm1',
      title: 'أذكار الصباح',
      arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      translation: 'We have reached the morning and at this very time all sovereignty belongs to Allah. Praise be to Allah. None has the right to be worshipped but Allah, alone, without partner. To Him belongs all sovereignty and praise and He is over all things omnipotent.',
      source: 'رواه أبو داود',
    },
    {
      id: 'm2',
      title: 'دعاء الاستفتاح',
      arabic: 'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اللَّهُمَّ نَقِّنِي مِنْ خَطَايَايَ كَمَا يُنَقَّى الثَّوْبُ الأَبْيَضُ مِنَ الدَّنَسِ',
      translation: 'O Allah, separate me from my sins as You have separated the East from the West. O Allah, cleanse me of my sins as white cloth is cleansed from dirt.',
      source: 'متفق عليه',
    },
  ],
  evening: [
    {
      id: 'e1',
      title: 'أذكار المساء',
      arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      translation: 'We have reached the evening and at this very time all sovereignty belongs to Allah. Praise be to Allah. None has the right to be worshipped but Allah, alone, without partner. To Him belongs all sovereignty and praise and He is over all things omnipotent.',
      source: 'رواه أبو داود',
    },
  ],
  sleep: [
    {
      id: 's1',
      title: 'دعاء النوم',
      arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
      translation: 'In Your name, O Allah, I die and I live.',
      source: 'رواه البخاري',
    },
    {
      id: 's2',
      title: 'آية الكرسي للنوم',
      arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
      translation: 'Allah - there is no deity except Him, the Ever-Living, the Self-Sustaining. Neither drowsiness overtakes Him nor sleep.',
      source: 'رواه البخاري',
    },
  ],
  wakeup: [
    {
      id: 'w1',
      title: 'دعاء الاستيقاظ',
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
      translation: 'Praise be to Allah, who gave us life after death, and to Him is the resurrection.',
      source: 'رواه البخاري',
    },
  ],
  prayer: [
    {
      id: 'p1',
      title: 'دعاء قبل الصلاة',
      arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
      translation: 'O Allah, open for me the doors of Your mercy.',
      source: 'رواه مسلم',
    },
    {
      id: 'p2',
      title: 'دعاء السجود',
      arabic: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ',
      translation: 'O Allah, forgive me all my sins, small and great, first and last, open and secret.',
      source: 'رواه مسلم',
    },
  ],
  travel: [
    {
      id: 't1',
      title: 'دعاء السفر',
      arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ',
      translation: 'Glory be to Him who has subjected this to us, and we could never have done it by ourselves. And to our Lord we are indeed returning.',
      source: 'رواه مسلم',
    },
  ],
  food: [
    {
      id: 'f1',
      title: 'دعاء قبل الطعام',
      arabic: 'بِسْمِ اللَّهِ',
      translation: 'In the name of Allah.',
      source: 'رواه أبو داود والترمذي',
    },
    {
      id: 'f2',
      title: 'دعاء بعد الطعام',
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
      translation: 'Praise be to Allah who fed me this and provided it for me without any power or strength from me.',
      source: 'رواه أبو داود والترمذي',
    },
  ],
  distress: [
    {
      id: 'd1',
      title: 'دعاء الهم والحزن',
      arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحُزْنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ',
      translation: 'O Allah, I seek refuge in You from anxiety and sorrow. I seek refuge in You from weakness and laziness.',
      source: 'رواه أبو داود والبيهقي',
    },
  ],
  protection: [
    {
      id: 'pr1',
      title: 'دعاء الحفظ',
      arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
      translation: 'In the name of Allah with Whose name nothing on earth or heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
      source: 'رواه أبو داود والترمذي',
    },
  ],
  forgiveness: [
    {
      id: 'fg1',
      title: 'أعظم الاستغفار',
      arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
      translation: 'O Allah, You are my Lord, there is no god but You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I take refuge in You from the evil of what I have done. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for verily none can forgive sin except You.',
      source: 'رواه البخاري',
    },
  ],
  rain: [
    {
      id: 'r1',
      title: 'دعاء المطر',
      arabic: 'اللَّهُمَّ صَيِّبًا نَافِعًا',
      translation: 'O Allah, make it a beneficial rain.',
      source: 'رواه البخاري',
    },
  ],
  illness: [
    {
      id: 'i1',
      title: 'دعاء المريض',
      arabic: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَاسَ وَاشْفِهِ وَأَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ شِفَاءً لَا يُغَادِرُ سَقَمًا',
      translation: 'O Allah, Lord of mankind, remove the affliction and heal him, for You are the Healer. There is no healing except Your healing, a healing that leaves no disease.',
      source: 'متفق عليه',
    },
  ],
};

export async function fetchDuaCategories() {
  return { categories: DUA_CATEGORIES };
}

export async function fetchDuaByCategory(categoryId) {
  const duas = DUAS_BY_CATEGORY[categoryId] || [];
  return { duas };
}
