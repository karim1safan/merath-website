import { Link } from 'react-router-dom';
import { CATEGORIES, UMMMAH_CATEGORIES } from '../constants';
import Card from '../components/common/Card';

const CategoriesPage = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          اختار القسم
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          اختر القسم الذي تريد اختبار معلوماتك فيه
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((category) => {
          const IconComponent = category.icon;
          return (
            <Link key={category.id} to={`/quiz/${category.id}`}>
              <Card hover className="h-full">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${category.color}`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200 mb-6">
          اختبارات القرآن والحديث
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {UMMMAH_CATEGORIES.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.id} to={`/quiz/${category.id}`}>
                <Card hover className="h-full">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${category.color}`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
