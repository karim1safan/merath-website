const DhikrCard = ({ dhikr }) => {
  return (
    <div className="rounded-2xl shadow-lg p-6 bg-white dark:bg-secondary-800 border-2 border-secondary-100 dark:border-secondary-700">
      <p className="text-2xl leading-[2.2] text-right text-secondary-800 dark:text-secondary-200 font-amiri mb-5">
        {dhikr.arabic}
      </p>

      {dhikr.footnote && (
        <p className="text-[15px] leading-relaxed text-secondary-500 dark:text-secondary-400 text-right border-t border-secondary-100 dark:border-secondary-700 pt-4 font-amiri">
          {dhikr.footnote}
        </p>
      )}
    </div>
  );
};

export default DhikrCard;
