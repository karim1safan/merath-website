import { Link } from 'react-router';
import { Home, Search } from 'lucide-react';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center min-h-[60vh]">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-4xl font-bold text-secondary-800 dark:text-secondary-200 mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-secondary-700 dark:text-secondary-300 mb-4">
        الصفحة غير موجودة
      </h2>
      <p className="text-secondary-500 dark:text-secondary-400 mb-8 max-w-md">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى عنوان آخر.
      </p>
      <div className="flex gap-4">
        <Link to="/">
          <Button variant="primary">
            <Home className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Button>
        </Link>
        <Link to="/search">
          <Button variant="secondary">
            <Search className="w-4 h-4 ml-2" />
            البحث
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
