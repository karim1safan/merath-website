import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import Card from '../components/common/Card';
import { FadeIn, StaggerChildren, StaggerItem } from '../components/ui/Motion';

const CategoriesPage = () => {
  return (
    <div className="space-y-10">
      <FadeIn>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
            اختبارات
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            اختبر معلوماتك في القرآن الكريم والحديث النبوي والعلوم الإسلامية
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div>
          <h2 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 mb-4">
            اختبارات متنوعة
          </h2>
          <StaggerChildren stagger={0.04} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              return (
                <StaggerItem key={category.id}>
                  <Link to={`/quiz/${category.id}/topics`}>
                    <Card hover className="h-full">
                      <div className="text-center">
                        <div className={`inline-flex p-3 rounded-xl mb-3 ${category.color}`}>
                          <IconComponent className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-1">
                          {category.name}
                        </h3>
                        <p className="text-secondary-500 dark:text-secondary-400 text-xs">
                          {category.description}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </div>
      </FadeIn>
    </div>
  );
};

export default CategoriesPage;
