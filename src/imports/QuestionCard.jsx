import { ExternalLink } from 'lucide-react';
import OptionButton from './OptionButton';
import Badge from '../common/Badge';
import BookmarkButton from '../common/BookmarkButton';
import { DIFFICULTY_LEVELS } from '../../constants';

const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  showExplanation = false,
}) => {
  const difficultyInfo = DIFFICULTY_LEVELS[question.difficulty];

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 transition-colors duration-200">
      <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
        <Badge variant="primary" size="sm">
          السؤال {questionNumber} من {totalQuestions}
        </Badge>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {question.difficulty && (
            <Badge variant={question.difficulty === 'easy' ? 'success' : question.difficulty === 'medium' ? 'warning' : 'danger'} size="sm">
              {difficultyInfo?.label || question.difficulty}
            </Badge>
          )}
          <BookmarkButton question={question} />
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-semibold text-secondary-800 dark:text-secondary-200 mb-8 leading-relaxed">
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <OptionButton
            key={index}
            option={option}
            index={index}
            isSelected={selectedAnswer === index}
            isCorrect={index === question.correctAnswer}
            showResult={showExplanation}
            onClick={() => onAnswerSelect(index)}
          />
        ))}
      </div>

      {showExplanation && question.explanation && (
        <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
          <h4 className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-2">
            المصدر:
          </h4>
          <a
            href={question.explanation}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            عرض التوضيح من المصدر
          </a>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
