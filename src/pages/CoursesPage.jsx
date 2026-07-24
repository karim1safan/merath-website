import { useState, useMemo } from 'react';
import { PlayCircle, ExternalLink } from 'lucide-react';
import { PLAYLISTS, COURSE_CATEGORIES } from '../data/playlists';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const CoursesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const filteredPlaylists = useMemo(() => {
    if (selectedCategory === 'الكل') return PLAYLISTS;
    return PLAYLISTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-2xl bg-primary-100 dark:bg-primary-900/30">
            <PlayCircle className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          دورات وقنوات إسلامية
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 max-w-lg mx-auto">
          مجموعات مختارة من أفضل القنوات التعليمية الإسلامية على يوتيوب لتعزيز معلوماتك في العلوم الشرعية
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {COURSE_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPlaylists.map((playlist) => (
          <Card key={playlist.id} hover className="h-full flex flex-col overflow-hidden">
            <div className="relative h-40 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center -mx-6 -mt-6 mb-4">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-32 h-32 border-2 border-white rounded-full" />
                <div className="absolute bottom-4 left-4 w-20 h-20 border-2 border-white rounded-full" />
              </div>
              <PlayCircle className="w-16 h-16 text-white/90 relative z-10" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="primary" size="sm">
                  {playlist.category}
                </Badge>
                <span className="text-xs text-secondary-500 dark:text-secondary-400">
                  {playlist.videoCount} فيديو
                </span>
              </div>

              <h2 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 mb-1">
                {playlist.title}
              </h2>

              <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-2">
                {playlist.channelName}
              </p>

              <p className="text-secondary-600 dark:text-secondary-400 text-sm leading-relaxed line-clamp-2">
                {playlist.description}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-secondary-100 dark:border-secondary-700">
              <a
                href={playlist.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                مشاهدة على يوتيوب
              </a>
            </div>
          </Card>
        ))}
      </div>

      {filteredPlaylists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-500 dark:text-secondary-400">
            لا توجد دورات في هذا القسم حالياً
          </p>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
