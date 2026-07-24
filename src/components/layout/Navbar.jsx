import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Moon,
  Sun,
  BookOpen,
  Home,
  LayoutGrid,
  BarChart3,
  Search,
  ScrollText,
  Menu,
  X,
  ChevronDown,
  Heart,
  GraduationCap,
  Users,
  Bookmark,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { ROUTES } from "../../constants";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  const closeMobile = () => setMobileOpen(false);

  const closeMore = () => setMoreOpen(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    if (moreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [moreOpen]);

  const mainLinks = [
    { path: ROUTES.HOME, label: "الرئيسية", icon: Home },
    { path: ROUTES.CATEGORIES, label: "اختبارات", icon: LayoutGrid },
    { path: ROUTES.SEARCH, label: "بحث", icon: Search },
    { path: ROUTES.QURAN_EXPLORER, label: " المصحف", icon: BookOpen },
    { path: ROUTES.SEERAH, label: "السيرة", icon: ScrollText },
    { path: ROUTES.STATISTICS, label: "الإحصائيات", icon: BarChart3 },
  ];

  const moreLinks = [
    { path: ROUTES.ADHKAR, label: "الأذكار", icon: Heart },
    { path: ROUTES.COURSES, label: "الدورات", icon: GraduationCap },
    { path: ROUTES.PERSONALITIES, label: "مقالات", icon: Users },
    { path: ROUTES.BOOKMARKS, label: "المفضلة", icon: Bookmark },
  ];

  const navLinks = [...mainLinks, ...moreLinks];

  const isActive = (path) => {
    if (path === ROUTES.HOME) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const renderNavLink = (link) => {
    const Icon = link.icon;
    return (
      <Link
        key={link.path}
        to={link.path}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
          isActive(link.path)
            ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
            : "text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700"
        }`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span>{link.label}</span>
        {link.count > 0 && (
          <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-primary-600 text-white dark:bg-primary-400 dark:text-secondary-900 mr-auto">
            {link.count}
          </span>
        )}
      </Link>
    );
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

          <div className="hidden md:flex items-center gap-1">
            {mainLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}

            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  moreLinks.some((l) => isActive(l.path))
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400"
                }`}
              >
                المزيد
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    moreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {moreOpen && (
                <div className="absolute top-full right-0 mt-1 w-44 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-700 py-1 z-50">
                  {moreLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={closeMore}
                        className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-200 ${
                          isActive(link.path)
                            ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                            : "text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-700 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={theme === "light" ? "الوضع الداكن" : "الوضع الفاتح"}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-secondary-600" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg bg-secondary-100 dark:bg-secondary-700 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              ) : (
                <Menu className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-secondary-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-secondary-200 dark:border-secondary-700">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2"
            onClick={closeMobile}
          >
            <img src="/icon.png" alt="ميراث" className="w-8 h-8 rounded-lg" />
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              ميراث
            </span>
          </Link>
          <button
            onClick={closeMobile}
            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200"
            aria-label="إغلاق القائمة"
          >
            <X className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
          </button>
        </div>

        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100%-64px)]">
          {navLinks.map((link) => renderNavLink(link))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
