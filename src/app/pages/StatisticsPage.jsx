import { useNavigate } from 'react-router';
import {
  ClipboardCheck,
  BarChart3,
  Trophy,
  TrendingDown,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
} from 'lucide-react';
import { ROUTES } from '../constants';
import useStatistics from '../hooks/useStatistics';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { formatTime } from '../utils';

const StatisticsPage = () => {
  const navigate = useNavigate();
  const { statistics, resetStatistics } = useStatistics();

  const statCards = [
    {
      title: 'اختبارات مكتملة',
      value: statistics.completedQuizzes,
      icon: ClipboardCheck,
      color: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'متوسط الدرجات',
      value: `${statistics.completedQuizzes > 0 ? Math.round(statistics.totalScore / statistics.completedQuizzes) : 0}%`,
      icon: BarChart3,
      color: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'أعلى درجة',
      value: `${statistics.highScore}%`,
      icon: Trophy,
      color: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      title: 'أقل درجة',
      value: statistics.completedQuizzes > 0 ? `${statistics.lowScore}%` : '-',
      icon: TrendingDown,
      color: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
    },
    {
      title: 'إجابات صحيحة',
      value: statistics.correctAnswers,
      icon: CheckCircle2,
      color: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'إجابات خاطئة',
      value: statistics.wrongAnswers,
      icon: XCircle,
      color: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
    },
    {
      title: 'إجمالي الأسئلة',
      value: statistics.totalQuestions,
      icon: HelpCircle,
      color: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'وقت الدراسة',
      value: formatTime(statistics.totalTime),
      icon: Clock,
      color: 'bg-teal-100 dark:bg-teal-900/30',
      iconColor: 'text-teal-600 dark:text-teal-400',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          الإحصائيات
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          تابع تقدمك في تعلم العلوم الإسلامية
        </p>
      </div>

      {statistics.completedQuizzes === 0 ? (
        <Card className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-green-100 dark:bg-green-900/30">
              <BarChart3 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-2">
            لا توجد إحصائيات بعد
          </h3>
          <p className="text-secondary-500 dark:text-secondary-400 mb-6">
            ابدأ اختباراً لتظهر إحصائياتك هنا
          </p>
          <Button onClick={() => navigate(ROUTES.CATEGORIES)}>
            ابدأ اختباراً
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="text-center">
                  <div className={`inline-flex p-3 rounded-xl mb-3 ${stat.color}`}>
                    <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <div className="text-2xl font-bold text-secondary-800 dark:text-secondary-200 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-secondary-500 dark:text-secondary-400">
                    {stat.title}
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={resetStatistics}
              variant="danger"
              size="sm"
            >
              مسح الإحصائيات
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default StatisticsPage;
