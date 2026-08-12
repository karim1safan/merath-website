import { Link } from 'react-router-dom';
import { BookOpen, Sun, Moon, MessageSquare, BookOpenText } from 'lucide-react';
import { ROUTES } from '../constants';

const AdhkarPage = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
            <BookOpen className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          أذكار المسلم
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 max-w-lg mx-auto">
          اختر القسم للقراءة
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link to={ROUTES.HISN_ALMUSLIM}>
          <div className="text-right rounded-2xl shadow-lg p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-200 dark:border-emerald-800 hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 group h-full">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 mb-1">
              حصن المسلم
            </h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              من كتاب حصن المسلم — اختر القسم للقراءة
            </p>
          </div>
        </Link>

        <Link to={ROUTES.MORNING_ADHKAR}>
          <div className="text-right rounded-2xl shadow-lg p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-800 hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-200 group h-full">
            <div className="flex items-center gap-3 mb-3">
              <Sun className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 mb-1">
              أذكار الصباح
            </h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              أذكار المسلم في الصباح
            </p>
          </div>
        </Link>

        <Link to={ROUTES.EVENING_ADHKAR}>
          <div className="text-right rounded-2xl shadow-lg p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-2 border-indigo-200 dark:border-indigo-800 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 group h-full">
            <div className="flex items-center gap-3 mb-3">
              <Moon className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 mb-1">
              أذكار المساء
            </h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              أذكار المسلم في المساء
            </p>
          </div>
        </Link>

        <Link to={ROUTES.SALAF_QUOTES}>
          <div className="text-right rounded-2xl shadow-lg p-6 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-2 border-violet-200 dark:border-violet-800 hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-200 group h-full">
            <div className="flex items-center gap-3 mb-3">
              <MessageSquare className="w-6 h-6 text-violet-500" />
            </div>
            <h3 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 mb-1">
              أقوال من السلف
            </h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              حكم وأقوال مأثورة من سلف الأمة
            </p>
          </div>
        </Link>

        <Link to={ROUTES.GHARIB_ALQURAN}>
          <div className="text-right rounded-2xl shadow-lg p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-2 border-teal-200 dark:border-teal-800 hover:shadow-xl hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-200 group h-full">
            <div className="flex items-center gap-3 mb-3">
              <BookOpenText className="w-6 h-6 text-teal-500" />
            </div>
            <h3 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 mb-1">
              غريب القرآن
            </h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              بيان معاني المفردات الغريبة في القرآن
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdhkarPage;
