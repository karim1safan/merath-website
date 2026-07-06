import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, X } from 'lucide-react';
import { usePersonalities } from '../hooks/usePersonalities';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

const PersonalitiesPage = () => {
  const { personalities, loading } = usePersonalities();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const allTags = useMemo(() => {
    const tags = new Set();
    personalities.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [personalities]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  const filteredPersonalities = useMemo(() => {
    return personalities.filter((person) => {
      const matchesSearch =
        !searchQuery ||
        person.name.includes(searchQuery) ||
        person.title.includes(searchQuery) ||
        person.excerpt.includes(searchQuery);

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => person.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [personalities, searchQuery, selectedTags]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-2xl bg-primary-100 dark:bg-primary-900/30">
            <Users className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          شخصيات إسلامية
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 max-w-lg mx-auto">
          تعرّف على أبرز العلماء والفلاسفة والمفكرين الذين أثروا الحضارة الإسلامية
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن شخصية..."
            className="w-full pr-12 pl-10 py-3 rounded-xl border-2 border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 dark:placeholder-secondary-500 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none transition-colors duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
            >
              <X className="w-4 h-4 text-secondary-400" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={resetFilters}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedTags.length === 0 && !searchQuery
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-600'
          }`}
        >
          الكل
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedTags.includes(tag)
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-600'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {(searchQuery || selectedTags.length > 0) && (
        <p className="text-sm text-secondary-500 dark:text-secondary-400 text-center">
          {filteredPersonalities.length} نتيجة
        </p>
      )}

      {filteredPersonalities.length === 0 ? (
        <EmptyState
          icon={<Search className="w-16 h-16" />}
          title="لا توجد نتائج"
          description="لم يتم العثور على شخصيات تطابق البحث"
          actionLabel="مسح الفلاتر"
          onAction={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersonalities.map((person) => (
            <Link key={person.id} to={`/personalities/${person.id}`}>
              <Card hover className="h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl">{person.icon}</span>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 mb-1">
                      {person.name}
                    </h2>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                      {person.title}
                    </p>
                  </div>
                </div>

                <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-4 flex-1 leading-relaxed">
                  {person.excerpt}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-secondary-100 dark:border-secondary-700">
                  <span className="text-xs text-secondary-500 dark:text-secondary-400">
                    {person.era}
                  </span>
                  <div className="flex gap-1.5">
                    {person.tags.map((tag) => (
                      <Badge key={tag} variant="primary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonalitiesPage;
