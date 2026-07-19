import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { BookOpen, BarChart3, CalendarCheck, Flame, Clock, Play, Pause, Users, Bookmark, Layers, X, BookOpenText, Star } from 'lucide-react';
import { CATEGORIES, UMMMAH_CATEGORIES, ROUTES } from '../constants';
import useDailyStreak from '../hooks/useDailyStreak';
import useDailyVerse from '../hooks/useDailyVerse';
import useFridayReminder from '../hooks/useFridayReminder';
import { ScrollReveal } from '../components/ScrollReveal';
import iconImg from '../../imports/icon.png';
import PrayerWidget from '../components/PrayerWidget';

const FEATURES = [
  { to: ROUTES.DAILY, Icon: CalendarCheck, color: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400', label: 'التحدي اليومي', desc: '10 أسئلة متنوعة يوميًا مع تتبع السيري' },
  { to: ROUTES.QURAN_EXPLORER, Icon: BookOpen, color: 'bg-primary-100 dark:bg-primary-900/30', iconColor: 'text-primary-600 dark:text-primary-400', label: 'استكشاف القرآن', desc: 'تصفح السور واستمع التلاوة' },
  { to: ROUTES.PERSONALITIES, Icon: Users, color: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400', label: 'الشخصيات الإسلامية', desc: 'تعرف على الصحابة والعلماء' },
  { to: ROUTES.SEERAH, Icon: Star, color: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400', label: 'السيرة النبوية', desc: 'رحلة النبي ﷺ من المولد إلى الوفاة' },
  { to: ROUTES.ADHKAR, Icon: BookOpenText, color: 'bg-teal-100 dark:bg-teal-900/30', iconColor: 'text-teal-600 dark:text-teal-400', label: 'الأذكار', desc: 'أذكار المسلم اليومية من القرآن والسنة' },
  { to: ROUTES.BOOKMARKS, Icon: Bookmark, color: 'bg-rose-100 dark:bg-rose-900/30', iconColor: 'text-rose-600 dark:text-rose-400', label: 'المحفوظات', desc: 'احفظ الأسئلة للمراجعة لاحقًا' },
  { to: ROUTES.STATISTICS, Icon: BarChart3, color: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600 dark:text-green-400', label: 'الإحصائيات', desc: 'تابع تقدمك ونتائجك' },
  { to: ROUTES.CATEGORIES, Icon: Layers, color: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400', label: 'أنواع اختبارات', desc: 'أكثر من 10 أنواع اختبارات متنوعة' },
];

const HomePage = () => {
  const { currentStreak, todayCompleted } = useDailyStreak();
  const { verse } = useDailyVerse();
  const { showBanner, dismiss } = useFridayReminder();
  const [now, setNow] = useState(new Date());
  const [verseAudio, setVerseAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handlePlayVerse = () => {
    if (!verse?.audio) return;
    if (verseAudio) { verseAudio.pause(); setVerseAudio(null); setIsPlaying(false); return; }
    const audio = new Audio(verse.audio);
    audio.play().catch(console.error);
    audio.onended = () => { setVerseAudio(null); setIsPlaying(false); };
    setVerseAudio(audio);
    setIsPlaying(true);
  };

  const arabicDate = now.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const arabicTime = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const hijriDate = now.toLocaleDateString('ar-SA-u-ca-islamic', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-10" dir="rtl">

      {/* Friday banner */}
      {showBanner && (
        <ScrollReveal>
          <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-primary-700 rounded-2xl p-6 text-white shadow-md">
            <button onClick={dismiss} className="absolute top-4 left-4 p-1.5 rounded-lg hover:bg-white/20 transition-colors" aria-label="إغلاق">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white/15 flex-shrink-0"><BookOpen className="w-7 h-7" /></div>
              <div className="flex-1">
                <h3 className="text-base font-bold mb-1">تذكير: قراءة سورة الكهف</h3>
                <p className="text-sm text-emerald-100 mb-3">«من قرأ سورة الكهف يوم الجمعة أضاء له من النور ما بين الجمعتين»</p>
                <Link to="/quran/18" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-emerald-700 font-semibold text-sm hover:bg-emerald-50 transition-colors">
                  <BookOpen className="w-4 h-4" /> ابدأ القراءة
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Hero */}
      <ScrollReveal>
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white px-8 py-14 text-center shadow-xl">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex justify-center mb-5">
              <div className="w-20 h-20 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-lg">
                <img src={iconImg} alt="ميراث" className="w-14 h-14 rounded-xl object-contain" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-3 tracking-tight">ميراث</h1>
            <p className="text-lg text-primary-100 max-w-xl mx-auto mb-8 leading-relaxed">
              اختبر معلوماتك في العلوم الإسلامية واستكشف القرآن والسيرة والأذكار
            </p>
            <div className="inline-flex flex-col items-center gap-2 px-7 py-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-200" />
                <span className="text-3xl font-bold font-mono tracking-widest" dir="ltr">{arabicTime}</span>
              </div>
              <div className="h-px w-full bg-white/20" />
              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-sm">
                <span className="font-semibold text-primary-50">{hijriDate}</span>
                <span className="hidden sm:inline text-primary-300">•</span>
                <span className="text-primary-200">{arabicDate}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={ROUTES.CATEGORIES}>
                <button className="px-8 py-3.5 rounded-2xl bg-white text-primary-700 font-bold text-base hover:bg-primary-50 active:scale-95 transition-all shadow-md">
                  ابدأ الاختبار
                </button>
              </Link>
              <Link to={ROUTES.STATISTICS}>
                <button className="px-8 py-3.5 rounded-2xl bg-white/15 border border-white/30 text-white font-semibold text-base hover:bg-white/25 active:scale-95 transition-all">
                  الإحصائيات
                </button>
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Prayer Times Widget */}
      <ScrollReveal delay={0.03}>
        <PrayerWidget />
      </ScrollReveal>

      {/* Daily Challenge */}
      <ScrollReveal delay={0.05}>
        <section>
          <Link to={ROUTES.DAILY}>
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-secondary-800 border border-secondary-200/70 dark:border-secondary-700/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-orange-100 dark:bg-orange-900/30 shrink-0">
                  <CalendarCheck className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-secondary-800 dark:text-secondary-200">التحدي اليومي</h3>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">10 أسئلة متنوعة كل يوم</p>
                </div>
                {currentStreak > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 shrink-0">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{currentStreak}</span>
                  </div>
                )}
              </div>
              {todayCompleted && (
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">مكتمل ✓</span>
                </div>
              )}
            </div>
          </Link>
        </section>
      </ScrollReveal>

      {/* Verse of the Day */}
      {verse && (
        <ScrollReveal delay={0.08}>
          <section>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/60 dark:from-primary-900/25 dark:to-primary-900/10 border border-primary-200/60 dark:border-primary-800/40 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-5 rounded-full bg-primary-500" />
                  <h3 className="text-base font-bold text-secondary-800 dark:text-secondary-200">آية اليوم</h3>
                </div>
                {verse.audio && (
                  <button onClick={handlePlayVerse} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-100 dark:bg-primary-900/40 hover:bg-primary-200 dark:hover:bg-primary-900/60 transition-colors text-primary-700 dark:text-primary-400 text-sm font-medium">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'إيقاف' : 'استماع'}
                  </button>
                )}
              </div>
              <p className="text-2xl leading-loose text-right text-secondary-800 dark:text-secondary-100 mb-4 font-amiri">
                {verse.arabic}
              </p>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm font-medium text-primary-700 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/40 px-3 py-1 rounded-full">
                  {verse.surahName} — الآية {verse.ayahNumber}
                </span>
                {verse.translation && (
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 italic max-w-xs text-left">"{verse.translation}"</p>
                )}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Quiz Categories */}
      <ScrollReveal delay={0.05}>
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-secondary-800 dark:text-secondary-200">اختبر معلوماتك</h2>
            <Link to={ROUTES.CATEGORIES} className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">عرض الكل ←</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map((category, i) => {
              const IconComponent = category.icon;
              return (
                <ScrollReveal key={category.id} delay={i * 0.04}>
                  <Link to={`/quiz/${category.id}`} className="block h-full">
                    <div className="h-full bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-200/70 dark:border-secondary-700/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-secondary-300 dark:hover:border-secondary-600 transition-all duration-200 p-5 cursor-pointer">
                      <div className="text-center">
                        <div className={`inline-flex p-3 rounded-2xl mb-3 ${category.color}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-semibold text-secondary-800 dark:text-secondary-200 mb-1">{category.name}</h3>
                        <p className="text-secondary-500 dark:text-secondary-400 text-xs leading-relaxed">{category.description}</p>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </section>
      </ScrollReveal>

      {/* Quran & Hadith */}
      <ScrollReveal delay={0.05}>
        <section>
          <h2 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 mb-5">اختبارات القرآن والحديث</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {UMMMAH_CATEGORIES.map((category, i) => {
              const IconComponent = category.icon;
              return (
                <ScrollReveal key={category.id} delay={i * 0.05}>
                  <Link to={`/quiz/${category.id}`} className="block h-full">
                    <div className="h-full bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-200/70 dark:border-secondary-700/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 cursor-pointer">
                      <div className="text-center">
                        <div className={`inline-flex p-3 rounded-2xl mb-3 ${category.color}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-semibold text-secondary-800 dark:text-secondary-200 mb-1">{category.name}</h3>
                        <p className="text-secondary-500 dark:text-secondary-400 text-xs leading-relaxed">{category.description}</p>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </section>
      </ScrollReveal>

      {/* Why Meerath */}
      <ScrollReveal delay={0.05}>
        <section className="rounded-3xl bg-gradient-to-br from-secondary-100 to-secondary-50 dark:from-secondary-900 dark:to-secondary-950 border border-secondary-200/60 dark:border-secondary-800/40 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">لماذا ميراث؟</h2>
            <p className="text-secondary-500 dark:text-secondary-400 max-w-md mx-auto text-sm">تجربة تعليمية متكاملة تجمع بين الاختبارات والمراجعة والاستكشاف</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {FEATURES.map(({ to, Icon, color, iconColor, label, desc }, i) => (
              <ScrollReveal key={to} delay={i * 0.05}>
                <Link to={to} className="group text-center block">
                  <div className={`inline-flex p-3.5 rounded-2xl mb-3 ${color} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-secondary-800 dark:text-secondary-200 mb-1">{label}</h3>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">{desc}</p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

    </div>
  );
};

export default HomePage;
