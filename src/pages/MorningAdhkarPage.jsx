import { useMemo } from 'react';
import { ArrowRight, Sun } from 'lucide-react';
import { getMorningAdhkar } from '../services/adhkarService';
import MorningEveningCard from '../components/dhikr/MorningEveningCard';
import { ROUTES } from '../constants';
import { useNavigate } from 'react-router-dom';

const MorningAdhkarPage = () => {
  const navigate = useNavigate();
  const morningAdhkar = useMemo(() => getMorningAdhkar(), []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(ROUTES.ADHKAR)}
          className="p-2 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
          aria-label="العودة"
        >
          <ArrowRight className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">
              أذكار الصباح
            </h1>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
            اضغط على الذكر لعدّ المرات
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {morningAdhkar.map((dhikr) => (
          <MorningEveningCard key={dhikr.order} dhikr={dhikr} />
        ))}
      </div>
    </div>
  );
};

export default MorningAdhkarPage;
