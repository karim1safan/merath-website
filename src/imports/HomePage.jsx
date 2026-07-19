import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, BarChart3, CalendarCheck, Flame, Clock, Play, Users, Bookmark, Layers, X, BookOpenText } from 'lucide-react';
import { CATEGORIES, UMMMAH_CATEGORIES, ROUTES } from '../constants';
import useDailyStreak from '../hooks/useDailyStreak';
import useDailyVerse from '../hooks/useDailyVerse';
import useFridayReminder from '../hooks/useFridayReminder';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const HomePage = () => {
  const { currentStreak, todayCompleted } = useDailyStreak();
  const { verse } = useDailyVerse();
  const { showBanner, dismiss } = useFridayReminder();

  const [now, setNow] = useState(new Date());
  const [verseAudio, setVerseAudio] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePlayVerse = () => {
    if (!verse?.audio) return;
    if (verseAudio) {
      verseAudio.pause();
      setVerseAudio(null);
      return;
    }
    const audio = new Audio(verse.audio);
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
    audio.onended = () => setVerseAudio(null);
    setVerseAudio(audio);
  };

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const arabicDate = now.toLocaleDateString('ar-SA', dateOptions);
  const arabicTime = now.toLocaleTimeString('ar-SA', timeOptions);
  const hijriDate = now.toLocaleDateString('ar-SA-u-ca-islamic', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-12">
      {showBanner && (
        <section className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-6 text-white relative">
          <button
            onClick={dismiss}
            className="absolute top-4 left-4 p-1 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white/20 flex-shrink-0">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">
                تذكير: قراءة سورة الكهف
              </h3>
              <p className="text-sm text-emerald-100 mb-3">
                اليوم الجمعة، اقرأ سورة الكهف لتنال أجرها — قال ﷺ: "من قرأ سورة الكهف يوم الجمعة أضاء له من النور ما بين الجمعتين"
              </p>
              <Link
                to="/quran/18"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-emerald-700 font-semibold text-sm hover:bg-emerald-50 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                ابدأ القراءة
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="text-center py-12">
        <div className="flex justify-center mb-6">
          <img src="/icon.png" alt="ميراث" className="w-20 h-20 rounded-2xl" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 dark:text-secondary-200 mb-4">
          ميراث
        </h1>
        <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto mb-4">
          اختبر معلوماتك في العلوم الإسلامية عبر اختبارات تفاعلية ممتعة
        </p>
        <div className="inline-flex flex-col items-center gap-3 px-6 py-4 rounded-2xl bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-700 mb-8">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
            <Clock className="w-5 h-5" />
            <span className="text-2xl sm:text-3xl font-bold font-mono" dir="ltr">{arabicTime}</span>
          </div>
          <div className="h-px w-full bg-secondary-200 dark:bg-secondary-700" />
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="text-lg font-semibold text-secondary-800 dark:text-secondary-200">{hijriDate}</span>
            <span className="hidden sm:inline text-secondary-300 dark:text-secondary-600">|</span>
            <span className="text-base text-secondary-500 dark:text-secondary-400">{arabicDate}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to={ROUTES.CATEGORIES}>
            <Button size="lg">ابدأ الاختبار</Button>
          </Link>
          <Link to={ROUTES.STATISTICS}>
            <Button variant="outline" size="lg">الإحصائيات</Button>
          </Link>
        </div>
      </section>

      <section>
        <Link to={ROUTES.DAILY}>
          <Card hover className="relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30">
                <CalendarCheck className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-secondary-800 dark:text-secondary-200">
                  التحدي اليومي
                </h3>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  10 أسئلة متنوعة كل يوم - اختبر معلوماتك
                </p>
              </div>
              {currentStreak > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                    {currentStreak}
                  </span>
                </div>
              )}
            </div>
            {todayCompleted && (
              <div className="absolute top-3 left-3">
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                  مكتمل ✓
                </span>
              </div>
            )}
          </Card>
        </Link>
      </section>

      {verse && (
        <section>
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/40 border-primary-200 dark:border-primary-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-secondary-800 dark:text-secondary-200">
                آية اليوم
              </h3>
              {verse.audio && (
                <button
                  onClick={handlePlayVerse}
                  className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                >
                  <Play className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </button>
              )}
            </div>
            <p className="text-xl leading-loose text-right text-secondary-800 dark:text-secondary-200 mb-4 font-arabic">
              {verse.arabic}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-500 dark:text-secondary-400">
                {verse.surahName} - الآية {verse.ayahNumber}
              </span>
              {verse.translation && (
                <p className="text-xs text-secondary-400 dark:text-secondary-500 italic max-w-md text-left">
                  "{verse.translation}"
                </p>
              )}
            </div>
          </Card>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">
            اختبر معلوماتك
          </h2>
          <Link
            to={ROUTES.CATEGORIES}
            className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
          >
            عرض الكل
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.id} to={`/quiz/${category.id}`}>
                <Card hover className="h-full">
                  <div className="text-center">
                    <div className={`inline-flex p-3 rounded-xl mb-3 ${category.color}`}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-secondary-500 dark:text-secondary-400 text-xs">
                      {category.description}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">
            اختبارات القرآن والحديث
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {UMMMAH_CATEGORIES.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.id} to={`/quiz/${category.id}`}>
                <Card hover className="h-full">
                  <div className="text-center">
                    <div className={`inline-flex p-3 rounded-xl mb-3 ${category.color}`}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-secondary-500 dark:text-secondary-400 text-xs">
                      {category.description}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200 mb-4">
            لماذا ميراث؟
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 mb-8 max-w-xl mx-auto">
            تجربة تعليمية متكاملة تجمع بين الاختبارات والمراجعة والاستكشاف
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <Link to={ROUTES.DAILY} className="text-center group">
              <div className="inline-flex p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 mb-3 group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-1">
                التحدي اليومي
              </h3>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                10 أسئلة متنوعة كل يوم مع تتبع السيري
              </p>
            </Link>
            <Link to={ROUTES.QURAN_EXPLORER} className="text-center group">
              <div className="inline-flex p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-1">
                استكشاف القرآن
              </h3>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                تصفح سور القرآن الكريم واستمع التلاوة
              </p>
            </Link>
            <Link to={ROUTES.PERSONALITIES} className="text-center group">
              <div className="inline-flex p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-1">
                الشخصيات الإسلامية
              </h3>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                تعرف علي كبار العلماء والصحاباء
              </p>
            </Link>
            <Link to={ROUTES.SEERAH} className="text-center group">
              <div className="inline-flex p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-1">
                السيرة النبوية
              </h3>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                رحلة النبي ﷺ من المولد إلى الوفاة
              </p>
            </Link>
            <Link to={ROUTES.ADHKAR} className="text-center group">
              <div className="inline-flex p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 mb-3 group-hover:scale-110 transition-transform">
                <BookOpenText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-1">
                الأذكار
              </h3>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                أذكار المسلم اليومية من القرآن والسنة
              </p>
            </Link>
            <Link to={ROUTES.BOOKMARKS} className="text-center group">
              <div className="inline-flex p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 mb-3 group-hover:scale-110 transition-transform">
                <Bookmark className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-1">
                المحفوظات
              </h3>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                احفظ الأسئلة للمراجعة لاحقاً
              </p>
            </Link>
            <Link to={ROUTES.STATISTICS} className="text-center group">
              <div className="inline-flex p-3 rounded-xl bg-green-100 dark:bg-green-900/30 mb-3 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-1">
                الإحصائيات
              </h3>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                تتبع تقدمك ونتائجك
              </p>
            </Link>
            <Link to={ROUTES.CATEGORIES} className="text-center group">
              <div className="inline-flex p-3 rounded-xl bg-rose-100 dark:bg-rose-900/30 mb-3 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-1">
                أنواع اختبارات
              </h3>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                أكثر من 10 أنواع اختبارات متنوعة
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
