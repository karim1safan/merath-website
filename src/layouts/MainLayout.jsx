import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/ui/ScrollToTop';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-secondary-50 dark:bg-secondary-900 transition-colors duration-200">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default MainLayout;
