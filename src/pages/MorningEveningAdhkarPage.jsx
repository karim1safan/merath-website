import { useState, useMemo } from 'react';
import { ArrowRight, Sun, Moon } from 'lucide-react';
import { getMorningAdhkar, getEveningAdhkar } from '../services/adhkarService';
import MorningEveningCard from '../components/dhikr/MorningEveningCard';

const tabs = [
  { id: 'morning', label: 'أذكار الصباح', icon: Sun },
  { id: 'evening', label: 'أذكار المساء', icon: Moon },
];

const MorningEveningAdhkarPage = () => {
  const [activeTab, setActiveTab] = useState('morning');

  const morningAdhkar = useMemo(() => getMorningAdhkar(), []);
  const eveningAdhkar = useMemo(() => getEveningAdhkar(), []);

  const activeAdhkar = activeTab === 'morning' ? morningAdhkar : eveningAdhkar;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <a
          href="/adhikr"
          className="p-2 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
          aria-label="العودة لأذكار المسلم"
        >
          <ArrowRight className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
        </a>
        <div>
          <h1 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">
            أذكار الصباح والمساء
          </h1>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            اضغط على الذكر لعدّ المرات
          </p>
        </div>
      </div>

      <div className="flex gap-2 bg-secondary-100 dark:bg-secondary-800 p-1.5 rounded-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white dark:bg-secondary-700 text-secondary-800 dark:text-secondary-100 shadow-md'
                  : 'text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {activeAdhkar.map((dhikr) => (
          <MorningEveningCard key={dhikr.order} dhikr={dhikr} />
        ))}
      </div>
    </div>
  );
};

export default MorningEveningAdhkarPage;
