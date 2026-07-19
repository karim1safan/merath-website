export function GlobalStyles() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style>{`
        /* ── Color variables ── */
        :root {
          --color-primary-50: #f0fdf4;
          --color-primary-100: #dcfce7;
          --color-primary-200: #bbf7d0;
          --color-primary-300: #86efac;
          --color-primary-400: #4ade80;
          --color-primary-500: #22c55e;
          --color-primary-600: #16a34a;
          --color-primary-700: #15803d;
          --color-primary-800: #166534;
          --color-primary-900: #14532d;
          --color-primary-950: #052e16;
          --color-secondary-50: #f8fafc;
          --color-secondary-100: #f1f5f9;
          --color-secondary-200: #e2e8f0;
          --color-secondary-300: #cbd5e1;
          --color-secondary-400: #94a3b8;
          --color-secondary-500: #64748b;
          --color-secondary-600: #475569;
          --color-secondary-700: #334155;
          --color-secondary-800: #1e293b;
          --color-secondary-900: #0f172a;
          --color-secondary-950: #020617;
          --color-success: #22c55e;
          --color-danger: #ef4444;
          --color-warning: #f59e0b;
        }

        /* ── Base ── */
        *, *::before, *::after { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: 'Cairo', sans-serif;
          direction: rtl;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        html { scroll-behavior: smooth; }

        /* ── Tailwind primary color utilities ── */
        .bg-primary-50  { background-color: #f0fdf4 !important; }
        .bg-primary-100 { background-color: #dcfce7 !important; }
        .bg-primary-200 { background-color: #bbf7d0 !important; }
        .bg-primary-300 { background-color: #86efac !important; }
        .bg-primary-400 { background-color: #4ade80 !important; }
        .bg-primary-500 { background-color: #22c55e !important; }
        .bg-primary-600 { background-color: #16a34a !important; }
        .bg-primary-700 { background-color: #15803d !important; }
        .bg-primary-800 { background-color: #166534 !important; }
        .bg-primary-900 { background-color: #14532d !important; }
        .bg-primary-950 { background-color: #052e16 !important; }

        .text-primary-50  { color: #f0fdf4 !important; }
        .text-primary-100 { color: #dcfce7 !important; }
        .text-primary-200 { color: #bbf7d0 !important; }
        .text-primary-300 { color: #86efac !important; }
        .text-primary-400 { color: #4ade80 !important; }
        .text-primary-500 { color: #22c55e !important; }
        .text-primary-600 { color: #16a34a !important; }
        .text-primary-700 { color: #15803d !important; }
        .text-primary-800 { color: #166534 !important; }
        .text-primary-900 { color: #14532d !important; }

        .border-primary-100 { border-color: #dcfce7 !important; }
        .border-primary-200 { border-color: #bbf7d0 !important; }
        .border-primary-300 { border-color: #86efac !important; }
        .border-primary-400 { border-color: #4ade80 !important; }
        .border-primary-500 { border-color: #22c55e !important; }
        .border-primary-600 { border-color: #16a34a !important; }
        .border-primary-700 { border-color: #15803d !important; }
        .border-primary-800 { border-color: #166534 !important; }

        .ring-primary-400 { --tw-ring-color: #4ade80 !important; }
        .ring-primary-500 { --tw-ring-color: #22c55e !important; }
        .focus\\:ring-primary-500:focus { --tw-ring-color: #22c55e !important; }

        .hover\\:bg-primary-50:hover  { background-color: #f0fdf4 !important; }
        .hover\\:bg-primary-100:hover { background-color: #dcfce7 !important; }
        .hover\\:bg-primary-600:hover { background-color: #16a34a !important; }
        .hover\\:bg-primary-700:hover { background-color: #15803d !important; }
        .hover\\:bg-primary-800:hover { background-color: #166534 !important; }
        .hover\\:text-primary-600:hover { color: #16a34a !important; }
        .hover\\:text-primary-700:hover { color: #15803d !important; }
        .hover\\:border-primary-600:hover { border-color: #16a34a !important; }

        .active\\:bg-primary-100:active { background-color: #dcfce7 !important; }
        .active\\:bg-primary-800:active { background-color: #166534 !important; }

        /* opacity variants */
        .bg-primary-900\\/20 { background-color: rgb(20 83 45 / 0.2) !important; }
        .bg-primary-900\\/30 { background-color: rgb(20 83 45 / 0.3) !important; }
        .bg-primary-600\\/10 { background-color: rgb(22 163 74 / 0.1) !important; }
        .bg-primary-600\\/20 { background-color: rgb(22 163 74 / 0.2) !important; }

        /* ── Secondary color utilities ── */
        .bg-secondary-50  { background-color: #f8fafc !important; }
        .bg-secondary-100 { background-color: #f1f5f9 !important; }
        .bg-secondary-200 { background-color: #e2e8f0 !important; }
        .bg-secondary-300 { background-color: #cbd5e1 !important; }
        .bg-secondary-400 { background-color: #94a3b8 !important; }
        .bg-secondary-500 { background-color: #64748b !important; }
        .bg-secondary-600 { background-color: #475569 !important; }
        .bg-secondary-700 { background-color: #334155 !important; }
        .bg-secondary-800 { background-color: #1e293b !important; }
        .bg-secondary-900 { background-color: #0f172a !important; }
        .bg-secondary-950 { background-color: #020617 !important; }

        .text-secondary-50  { color: #f8fafc !important; }
        .text-secondary-100 { color: #f1f5f9 !important; }
        .text-secondary-200 { color: #e2e8f0 !important; }
        .text-secondary-300 { color: #cbd5e1 !important; }
        .text-secondary-400 { color: #94a3b8 !important; }
        .text-secondary-500 { color: #64748b !important; }
        .text-secondary-600 { color: #475569 !important; }
        .text-secondary-700 { color: #334155 !important; }
        .text-secondary-800 { color: #1e293b !important; }
        .text-secondary-900 { color: #0f172a !important; }

        .border-secondary-100 { border-color: #f1f5f9 !important; }
        .border-secondary-200 { border-color: #e2e8f0 !important; }
        .border-secondary-300 { border-color: #cbd5e1 !important; }
        .border-secondary-600 { border-color: #475569 !important; }
        .border-secondary-700 { border-color: #334155 !important; }
        .border-secondary-800 { border-color: #1e293b !important; }

        .hover\\:bg-secondary-200:hover { background-color: #e2e8f0 !important; }
        .hover\\:bg-secondary-300:hover { background-color: #cbd5e1 !important; }
        .hover\\:bg-secondary-700:hover { background-color: #334155 !important; }
        .hover\\:bg-secondary-800:hover { background-color: #1e293b !important; }
        .hover\\:text-secondary-600:hover { color: #475569 !important; }
        .hover\\:text-secondary-700:hover { color: #334155 !important; }

        .active\\:bg-secondary-300:active { background-color: #cbd5e1 !important; }

        .ring-secondary-400 { --tw-ring-color: #94a3b8 !important; }
        .focus\\:ring-secondary-400:focus { --tw-ring-color: #94a3b8 !important; }

        /* opacity */
        .bg-secondary-900\\/90 { background-color: rgb(15 23 42 / 0.9) !important; }
        .bg-secondary-800\\/50 { background-color: rgb(30 41 59 / 0.5) !important; }

        /* ── success / danger / warning ── */
        .bg-success { background-color: #22c55e !important; }
        .text-success { color: #22c55e !important; }
        .bg-danger  { background-color: #ef4444 !important; }
        .text-danger  { color: #ef4444 !important; }
        .bg-warning { background-color: #f59e0b !important; }
        .text-warning { color: #f59e0b !important; }

        /* ── Utility ── */
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .dark { color-scheme: dark; }

        /* ── Dark mode bg/secondary overrides ── */
        .dark .bg-secondary-800 { background-color: #1e293b !important; }
        .dark .bg-secondary-900 { background-color: #0f172a !important; }
        .dark .text-secondary-100 { color: #f1f5f9 !important; }
        .dark .text-secondary-300 { color: #cbd5e1 !important; }
      `}</style>
    </>
  );
}
