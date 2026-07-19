هذه هي هيكلية تقسيم ملفات مشروع merath-website بشكل شجري منظم يوضح توزيع المكونات والمنطق البرمجي:

text
merath-website/
├── public/                     # الملفات العامة المتاحة مباشرة للمتصفح
│   ├── favicon.svg             # أيقونة الموقع المفضلة
│   ├── icon.png                # أيقونة التطبيق العامة
│   └── icons.svg               # أيقونات المتجهات (SVG)
├── scripts/                    # سكربتات مساعدة للبناء أو معالجة البيانات
│   └── extract-gharib.mjs      # سكربت لاستخراج كلمات غريب القرآن
├── src/                        # الكود المصدري الرئيسي للتطبيق
│   ├── assets/                 # الصور والملفات المرئية المستخدمة داخل المكونات
│   │   └── hero.png
│   ├── components/             # المكونات القابلة لإعادة الاستخدام
│   │   ├── common/             # مكونات عامة مشتركة (أزرار، كروت، نوافذ منبثقة، إلخ)
│   │   │   ├── Badge.jsx
│   │   │   ├── BookmarkButton.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Spinner.jsx
│   │   ├── dhikr/              # مكونات خاصة بالأذكار والتسابيح
│   │   │   └── DhikrCounter.jsx
│   │   ├── layout/             # الهيكل الخارجي (الهيدر والفوتر)
│   │   │   ├── Footer.jsx
│   │   │   └── Navbar.jsx
│   │   ├── quiz/               # مكونات خاصة بالاختبارات والمسابقات
│   │   │   ├── OptionButton.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   ├── ShareCard.jsx
│   │   │   └── Timer.jsx
│   │   └── ui/                 # مكونات تفاعلية لواجهة المستخدم
│   │       └── ScrollToTop.jsx
│   ├── constants/              # الثوابت والقيم الثابتة للمشروع
│   │   └── index.js
│   ├── context/                # إدارة حالة التطبيق (State Management)
│   │   ├── ThemeContext.js     # سياق تغيير الوضع الداكن/المضيء
│   │   └── ThemeContext.jsx
│   ├── data/                   # البيانات الثابتة وملفات الـ JSON الخاصة بالمحتوى
│   │   ├── personalities/      # السير والتراجم للشخصيات الإسلامية
│   │   │   ├── abu-ubayda-ibn-al-jarrah.json/.md
│   │   │   ├── al-bukhari.json/.md
│   │   │   ├── al-hajjaj-ibn-yusuf.json/.md
│   │   │   ├── al-zubayr-ibn-al-awwam.json/.md
│   │   │   ├── ibn-kathir.json/.md
│   │   │   ├── ibn-rushd.json/.md
│   │   │   ├── saed-bn-mueadh.json/.md
│   │   │   ├── talha.json/.md
│   │   │   └── index.js
│   │   ├── asmaUlHusna.js      # أسماء الله الحسنى
│   │   ├── battles.js          # الغزوات والمعارك الإسلامية
│   │   ├── duas.js             # الأدعية
│   │   ├── gharib-alquran.json # كلمات غريب القرآن
│   │   └── seerahTimeline.js   # الخط الزمني للسيرة النبوية
│   ├── hooks/                  # الـ Custom Hooks للتعامل مع منطق التطبيق
│   │   ├── useBookmarks.js     # منطق الحفظ والإشارات المرجعية
│   │   ├── useDailyStreak.js   # منطق التحديات المتتالية اليومية
│   │   ├── useDailyVerse.js    # منطق الآية اليومية
│   │   ├── useDuasQuiz.js      # اختبار الأدعية
│   │   ├── useFridayReminder.js# تذكيرات يوم الجمعة
│   │   ├── useGharibQuiz.js    # اختبار غريب القرآن
│   │   ├── useHadithQuiz.js    # اختبار الأحاديث
│   │   ├── useLocalStorage.js  # التخزين المحلي في المتصفح
│   │   ├── useNamesQuiz.js     # اختبار أسماء الله الحسنى
│   │   ├── usePersonalities.js # معالجة بيانات الشخصيات
│   │   ├── useQuiz.js          # اختبارات عامة
│   │   ├── useQuizApi.js
│   │   ├── useQuranExplorer.js # متصفح المصحف الشريف
│   │   ├── useQuranQuiz.js     # اختبار القرآن الكريم
│   │   ├── useSeerah.js        # منطق السيرة النبوية
│   │   ├── useStatistics.js    # إحصائيات تقدم المستخدم
│   │   └── useTheme.js         # منطق تغيير الثيم
│   ├── layouts/                # التنسيقات الرئيسية للصفحات
│   │   └── MainLayout.jsx
│   ├── pages/                  # الصفحات الأساسية للتطبيق
│   │   ├── AdhkarPage.jsx      # صفحة الأذكار
│   │   ├── BattlesPage.jsx / BattleDetailPage.jsx # صفحات الغزوات وتفاصيلها
│   │   ├── BookmarksPage.jsx   # صفحة المحفوظات
│   │   ├── CategoriesPage.jsx  # صفحة الفئات والأقسام
│   │   ├── DailyChallengePage.jsx # تحدي اليوم
│   │   ├── HomePage.jsx        # الصفحة الرئيسية
│   │   ├── PersonalitiesPage.jsx / PersonalityDetailPage.jsx # صفحات الشخصيات
│   │   ├── QuizPage.jsx / ResultPage.jsx / ReviewPage.jsx # صفحات الاختبارات
│   │   ├── QuranExplorerPage.jsx / QuranSurahPage.jsx # صفحات قراءة وتصفح القرآن
│   │   ├── SearchPage.jsx      # صفحة البحث
│   │   ├── SeerahPage.jsx      # صفحة السيرة النبوية
│   │   └── StatisticsPage.jsx  # صفحة الإحصائيات والإنجازات
│   ├── services/               # خدمات جلب البيانات والـ APIs الخارجية
│   │   ├── dhikrApi.js
│   │   ├── hadithApi.js
│   │   ├── quizApi.js
│   │   ├── quranAudioApi.js
│   │   └── quranTextApi.js
│   ├── utils/                  # وظائف برمجية مساعدة وعامة
│   │   ├── index.js
│   │   └── transformQuestions.js
│   ├── App.jsx                 # المكون الرئيسي للتطبيق وبداية المسارات (Routes)
│   ├── index.css               # ملف الأنماط العام والتصميم الافتراضي (CSS)
│   └── main.jsx                # نقطة الانطلاق الرئيسية للتطبيق (Entry Point)
├── .gitignore                  # ملف تحديد الملفات المستثناة من المزامنة بـ Git
├── eslint.config.js            # ملف إعداد فحص جودة الكود وتنظيمه
├── index.html                  # ملف الـ HTML الأساسي للموقع
├── package-lock.json           # تفاصيل إصدارات المكتبات المثبتة بدقة
├── package.json                # ملف تعريف المشروع والمكتبات والسكربتات المستخدمة
├── README.md                   # التوثيق والوصف التعريفي للمشروع
├── vercel.json                 # إعدادات الرفع والاستضافة على منصة Vercel
└── vite.config.js              # ملف إعداد أداة بناء المشروع (Vite config)
12:03 PM
