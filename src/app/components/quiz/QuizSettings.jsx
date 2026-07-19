import { ListFilter, TimerReset } from 'lucide-react';
import Button from '../common/Button';

const DIFFICULTIES = [
  { value: 'all', label: 'الكل' },
  { value: 'easy', label: 'سهل' },
  { value: 'medium', label: 'متوسط' },
  { value: 'hard', label: 'صعب' },
];

const COUNTS = [5, 10, 15, 20, 'all'];
const TIMERS = [
  { value: 0, label: 'بدون مؤقت' },
  { value: 300, label: '5 د' },
  { value: 600, label: '10 د' },
  { value: 1200, label: '20 د' },
];

const optionClass = (selected) =>
  `rounded-xl border-2 px-3 py-2.5 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
    selected
      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold shadow-sm'
      : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600 text-secondary-600 dark:text-secondary-300'
  }`;

const QuizSettings = ({
  title,
  description,
  Icon,
  iconClassName,
  totalQuestions,
  availableQuestions,
  selectedDifficulty,
  onDifficultyChange,
  selectedCount,
  onCountChange,
  timerDuration,
  onTimerChange,
  onStart,
}) => {
  const cannotStart = availableQuestions === 0;

  return (
    <div className="max-w-md mx-auto text-center py-12">
      {Icon && (
        <div className="flex justify-center mb-6">
          <div className={`p-4 rounded-2xl ${iconClassName}`}>
            <Icon className="w-12 h-12" />
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">{title}</h1>
      {description && <p className="text-secondary-600 dark:text-secondary-400 mb-8">{description}</p>}
      <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-5">
        {availableQuestions} سؤال متاح{totalQuestions > availableQuestions ? ` من إجمالي ${totalQuestions}` : ''}
      </p>

      <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-lg p-6 mb-5 space-y-7 text-right">
        <fieldset>
          <legend className="flex items-center gap-2 text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-3">
            <ListFilter className="w-4 h-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
            مستوى الصعوبة
          </legend>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="مستوى صعوبة الأسئلة">
            {DIFFICULTIES.map((difficulty) => {
              const selected = selectedDifficulty === difficulty.value;
              return <button type="button" key={difficulty.value} role="radio" aria-checked={selected} onClick={() => onDifficultyChange(difficulty.value)} className={optionClass(selected)}>{difficulty.label}</button>;
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-3">عدد الأسئلة</legend>
          <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="عدد أسئلة الاختبار">
            {COUNTS.map((count) => {
              const selected = selectedCount === count;
              return <button type="button" key={count} role="radio" aria-checked={selected} onClick={() => onCountChange(count)} className={optionClass(selected)}>{count === 'all' ? 'الكل' : count}</button>;
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="flex items-center gap-2 text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-3">
            <TimerReset className="w-4 h-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
            مدة الاختبار
          </legend>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="مدة الاختبار">
            {TIMERS.map((timer) => {
              const selected = timerDuration === timer.value;
              return <button type="button" key={timer.value} role="radio" aria-checked={selected} onClick={() => onTimerChange(timer.value)} className={optionClass(selected)}>{timer.label}</button>;
            })}
          </div>
        </fieldset>
      </div>

      {cannotStart && <p className="text-danger text-sm mb-4">لا توجد أسئلة متوفرة لهذا المستوى. اختر مستوى آخر.</p>}
      <Button onClick={onStart} size="lg" className="w-full" disabled={cannotStart}>ابدأ الاختبار</Button>
    </div>
  );
};

export default QuizSettings;
