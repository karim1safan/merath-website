import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  Bookmark, CalendarCheck, Users, BookOpen, Home,
  LayoutGrid, BarChart3, Search, ScrollText, BookOpenText, Menu, X, Moon,
} from 'lucide-react';
import useBookmarks from '../../hooks/useBookmarks';
import { ROUTES } from '../../constants';
import CinematicThemeToggle from '../CinematicThemeToggle';
import iconImg from '../../../imports/icon.png';

const NAV_LINKS = [
  { path: ROUTES.HOME, label: 'الرئيسية', Icon: Home },
  { path: ROUTES.DAILY, label: 'التحدي اليومي', Icon: CalendarCheck },
  { path: ROUTES.CATEGORIES, label: 'الأقسام', Icon: LayoutGrid },
  { path: ROUTES.SEARCH, label: 'بحث', Icon: Search },
  { path: ROUTES.QURAN_EXPLORER, label: 'القرآن', Icon: BookOpen },
  { path: ROUTES.PERSONALITIES, label: 'شخصيات', Icon: Users },
  { path: ROUTES.SEERAH, label: 'السيرة', Icon: ScrollText },
  { path: ROUTES.ADHKAR, label: 'الأذكار', Icon: BookOpenText },
  { path: ROUTES.PRAYER, label: 'مواقيت الصلاة', Icon: Moon },
  { path: ROUTES.BOOKMARKS, label: 'المحفوظات', Icon: Bookmark },
  { path: ROUTES.STATISTICS, label: 'الإحصائيات', Icon: BarChart3 },
];

const Navbar = () => {
  const location = useLocation();
  const { bookmarks } = useBookmarks();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === ROUTES.HOME) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const linkClass = (path) =>
    `flex items-center gap-1.5 text-sm font-medium transition-colors duration-150 ${
      isActive(path)
        ? 'text-primary-600 dark:text-primary-400'
        : 'text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-md border-b border-secondary-200/60 dark:border-secondary-700/40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
              <img src={iconImg} alt="" className="w-6 h-6 object-contain rounded-lg" />
            </div>
            <span className="text-xl font-bold text-primary-700 dark:text-primary-400 tracking-tight">
              ميراث
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map(({ path, label, Icon }) => (
              <Link key={path} to={path} className={linkClass(path)}>
                <Icon className="w-3.5 h-3.5" />
                {label}
                {path === ROUTES.BOOKMARKS && bookmarks.length > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-primary-600 text-white dark:bg-primary-400 dark:text-secondary-900">
                    {bookmarks.length}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <CinematicThemeToggle />

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors duration-150"
              aria-label="القائمة"
            >
              {menuOpen
                ? <X className="w-4 h-4 text-secondary-700 dark:text-secondary-300" />
                : <Menu className="w-4 h-4 text-secondary-700 dark:text-secondary-300" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden border-t border-secondary-200/60 dark:border-secondary-700/40 bg-white/95 dark:bg-secondary-900/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 gap-1">
            {NAV_LINKS.map(({ path, label, Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
                  isActive(path)
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                    : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {path === ROUTES.BOOKMARKS && bookmarks.length > 0 && (
                  <span className="mr-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-primary-600 text-white">
                    {bookmarks.length}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
