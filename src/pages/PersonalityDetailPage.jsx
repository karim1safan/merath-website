import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, BookOpenText, Play } from 'lucide-react';
import Markdown from 'react-markdown';
import { usePersonality } from '../hooks/usePersonalities';
import { ROUTES } from '../constants';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import Card from '../components/common/Card';

const PersonalityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { personality, content, loading, error } = usePersonality(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !personality) {
    return (
      <EmptyState
        icon={<BookOpenText className="w-16 h-16" />}
        title="مقال غير موجود"
        description="المقال الذي تبحث عنه غير موجود"
        actionLabel="العودة للقائمة"
        onAction={() => navigate(ROUTES.PERSONALITIES)}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <button
        onClick={() => navigate(ROUTES.PERSONALITIES)}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
      >
        <ArrowRight className="w-4 h-4" />
        العودة للقائمة
      </button>

      <div className="text-center">
        <span className="text-5xl mb-4 block">{personality.icon}</span>
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          {personality.name}
        </h1>
        <p className="text-lg text-primary-600 dark:text-primary-400 font-medium mb-4">
          {personality.title}
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap text-sm text-secondary-500 dark:text-secondary-400">
          {personality.era && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {personality.era}
            </span>
          )}
          {(personality.birth || personality.death) && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {personality.birth}{personality.birth && personality.death ? ' - ' : ''}{personality.death}
            </span>
          )}
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {personality.tags.map((tag) => (
            <Badge key={tag} variant="primary" size="md">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Card className="prose prose-lg dark:prose-invert max-w-none">
        <Markdown
          components={{
            h2: ({ children }) => (
              <h2 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200 mt-8 mb-4 pb-2 border-b border-secondary-200 dark:border-secondary-700">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mt-6 mb-3">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-4">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-2 mb-4 text-secondary-700 dark:text-secondary-300">
                {children}
              </ul>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
            strong: ({ children }) => (
              <strong className="text-secondary-800 dark:text-secondary-200 font-semibold">
                {children}
              </strong>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-r-4 border-primary-500 pr-4 italic text-secondary-600 dark:text-secondary-400 my-4">
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => {
              const isYouTube = href && (href.includes('youtube.com') || href.includes('youtu.be'));
              if (isYouTube) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 no-underline my-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-red-700 dark:text-red-400 block">
                        شاهد الفيديو
                      </span>
                      <span className="text-xs text-red-500 dark:text-red-500 truncate block">
                        {children}
                      </span>
                    </div>
                  </a>
                );
              }
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                  {children}
                </a>
              );
            },
          }}
        >
          {content}
        </Markdown>
      </Card>
    </div>
  );
};

export default PersonalityDetailPage;
