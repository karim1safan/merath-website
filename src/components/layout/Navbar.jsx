import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Bookmark, CalendarCheck, Users, BookOpen, Home, LayoutGrid, BarChart3, Search } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import useBookmarks from '../../hooks/useBookmarks';
import { ROUTES } from '../../constants';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const { bookmarks } = useBookmarks();

  const navLinks = [
    { path: ROUTES.HOME, label: 'الرئيسية' },
    { path: ROUTES.DAILY, label: 'التحدي اليومي' },
    { path: ROUTES.CATEGORIES, label: 'الأقسام' },
    { path: ROUTES.SEARCH, label: 'بحث' },
    { path: ROUTES.QURAN_EXPLORER, label: 'استكشاف القرآن' },
    { path: ROUTES.PERSONALITIES, label: 'شخصيات' },
    { path: ROUTES.BOOKMARKS, label: 'المحفوظات', count: bookmarks.length },
    { path: ROUTES.STATISTICS, label: 'الإحصائيات' },
  ];

  const isActive = (path) => {
    if (path === ROUTES.HOME) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white dark:bg-secondary-800 shadow-sm sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <img src="/icon.png" alt="ميراث" className="w-8 h-8 rounded-lg" />
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              ميراث
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {link.path === ROUTES.HOME && <Home className="w-4 h-4" />}
                  {link.path === ROUTES.DAILY && <CalendarCheck className="w-4 h-4" />}
                  {link.path === ROUTES.CATEGORIES && <LayoutGrid className="w-4 h-4" />}
                  {link.path === ROUTES.SEARCH && <Search className="w-4 h-4" />}
                  {link.path === ROUTES.QURAN_EXPLORER && <BookOpen className="w-4 h-4" />}
                  {link.path === ROUTES.PERSONALITIES && <Users className="w-4 h-4" />}
                  {link.path === ROUTES.BOOKMARKS && <Bookmark className="w-4 h-4" />}
                  {link.path === ROUTES.STATISTICS && <BarChart3 className="w-4 h-4" />}
                  {link.label}
                  {link.count > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-primary-600 text-white dark:bg-primary-400 dark:text-secondary-900">
                      {link.count}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-700 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={theme === 'light' ? 'الوضع الداكن' : 'الوضع الفاتح'}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-secondary-600" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </button>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-4 pb-4 overflow-x-auto">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                isActive(link.path)
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-secondary-600 dark:text-secondary-400'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {link.path === ROUTES.HOME && <Home className="w-4 h-4" />}
                {link.path === ROUTES.DAILY && <CalendarCheck className="w-4 h-4" />}
                {link.path === ROUTES.CATEGORIES && <LayoutGrid className="w-4 h-4" />}
                {link.path === ROUTES.SEARCH && <Search className="w-4 h-4" />}
                {link.path === ROUTES.QURAN_EXPLORER && <BookOpen className="w-4 h-4" />}
                {link.path === ROUTES.PERSONALITIES && <Users className="w-4 h-4" />}
                {link.path === ROUTES.BOOKMARKS && <Bookmark className="w-4 h-4" />}
                {link.path === ROUTES.STATISTICS && <BarChart3 className="w-4 h-4" />}
                {link.label}
                {link.count > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-primary-600 text-white dark:bg-primary-400 dark:text-secondary-900">
                    {link.count}
                  </span>
                )}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
