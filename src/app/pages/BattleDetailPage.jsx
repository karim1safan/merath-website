import { useParams, Link } from 'react-router';
import { ChevronLeft, MapPin, Users, Calendar, Target, BookOpen } from 'lucide-react';
import { useBattles } from '../hooks/useSeerah';
import { ROUTES } from '../constants';
import Card from '../components/common/Card';

const BattleDetailPage = () => {
  const { id } = useParams();
  const { getBattleById, stats } = useBattles();
  const battle = getBattleById(id);

  if (!battle) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">⚔️</div>
        <h2 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          غزوة غير موجودة
        </h2>
        <Link
          to={ROUTES.SEERAH_BATTLES}
          className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          العودة لقائمة الغزوات
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        to={ROUTES.SEERAH_BATTLES}
        className="inline-flex items-center gap-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm">العودة لقائمة الغزوات</span>
      </Link>

      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-2xl bg-red-100 dark:bg-red-900/30">
            <Target className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          {battle.name}
        </h1>
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            battle.category === 'ghazwa'
              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
          }`}
        >
          {battle.category === 'ghazwa' ? 'غزوة شهدها النبي ﷺ' : 'سرية أرسلها النبي ﷺ'}
        </span>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-500" />
          <div className="text-lg font-bold text-secondary-800 dark:text-secondary-200">
            {battle.date}
          </div>
          <div className="text-xs text-secondary-500 dark:text-secondary-400">
            {battle.dateGregorian}
          </div>
        </Card>
        <Card className="text-center">
          <MapPin className="w-6 h-6 mx-auto mb-2 text-red-500" />
          <div className="text-lg font-bold text-secondary-800 dark:text-secondary-200">
            {battle.location}
          </div>
          <div className="text-xs text-secondary-500 dark:text-secondary-400">
            {battle.distance || 'المدينة'}
          </div>
        </Card>
        {battle.participants && (
          <Card className="text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <div className="text-lg font-bold text-secondary-800 dark:text-secondary-200">
              {battle.participants}
            </div>
            <div className="text-xs text-secondary-500 dark:text-secondary-400">
              مشارك
            </div>
          </Card>
        )}
        <Card className="text-center">
          <Target className="w-6 h-6 mx-auto mb-2 text-green-500" />
          <div className="text-lg font-bold text-secondary-800 dark:text-secondary-200">
            {battle.result}
          </div>
          <div className="text-xs text-secondary-500 dark:text-secondary-400">
            النتيجة
          </div>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <h2 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-500" />
          التفاصيل
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
          {battle.description}
        </p>
      </Card>

      {/* Lessons */}
      {battle.lessons && (
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <h2 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 mb-4 flex items-center gap-2">
            <span className="text-xl">💡</span>
            الدروس المستفادة
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
            {battle.lessons}
          </p>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        {battle.id < stats.total && (
          <Link
            to={`/seerah/battles/${battle.id + 1}`}
            className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <span className="text-sm">الغزوة التالية</span>
          </Link>
        )}
        {battle.id > 1 && (
          <Link
            to={`/seerah/battles/${battle.id - 1}`}
            className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mr-auto"
          >
            <span className="text-sm">الغزوة السابقة</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default BattleDetailPage;
