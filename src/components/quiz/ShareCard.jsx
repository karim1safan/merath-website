import { useRef, useCallback, useState } from 'react';
import { Download, Share2, Check } from 'lucide-react';
import { CATEGORIES } from '../../constants';
import { getResultMessage, formatTime } from '../../utils';

const CARD_WIDTH = 600;
const CARD_HEIGHT = 360;

const ShareCard = ({ score, totalQuestions, percentage, timeSpent, category }) => {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const categoryName =
    category === 'daily'
      ? 'التحدي اليومي'
      : CATEGORIES.find((c) => c.id === category)?.name || category;

  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = CARD_WIDTH * 2;
    canvas.height = CARD_HEIGHT * 2;
    ctx.scale(2, 2);

    const bg = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
    bg.addColorStop(0, '#16a34a');
    bg.addColorStop(1, '#15803d');
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(0, 0, CARD_WIDTH, CARD_HEIGHT, 24);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(CARD_WIDTH - 60, 60, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(80, CARD_HEIGHT - 40, 80, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ميراث', CARD_WIDTH / 2, 40);

    ctx.font = '14px Cairo, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(categoryName, CARD_WIDTH / 2, 65);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px Cairo, sans-serif';
    ctx.fillText(`${percentage}%`, CARD_WIDTH / 2, 150);

    ctx.font = '18px Cairo, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(getResultMessage(percentage), CARD_WIDTH / 2, 185);

    const statsY = 230;
    const colWidth = CARD_WIDTH / 3;

    ctx.font = 'bold 28px Cairo, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`${score}/${totalQuestions}`, colWidth * 0.5, statsY);

    ctx.font = '13px Cairo, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('الإجابات الصحيحة', colWidth * 0.5, statsY + 22);

    ctx.font = 'bold 28px Cairo, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${totalQuestions - score}`, colWidth * 1.5, statsY);

    ctx.font = '13px Cairo, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('الإجابات الخاطئة', colWidth * 1.5, statsY + 22);

    ctx.font = 'bold 28px Cairo, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(formatTime(timeSpent), colWidth * 2.5, statsY);

    ctx.font = '13px Cairo, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('الوقت المستغرق', colWidth * 2.5, statsY + 22);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '11px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('اختبر معلوماتك في العلوم الإسلامية', CARD_WIDTH / 2, CARD_HEIGHT - 20);
  }, [score, totalQuestions, percentage, timeSpent, categoryName]);

  const handleDownload = useCallback(() => {
    drawCard();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `quiz-result-${percentage}%.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [drawCard, percentage]);

  const handleShare = useCallback(async () => {
    drawCard();
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );
      const file = new File([blob], 'quiz-result.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `ميراث - ${percentage}%`,
          text: `حصلت على ${percentage}% في اختبار ${categoryName}!`,
          files: [file],
        });
      } else {
        const url = URL.createObjectURL(blob);
        const text = `حصلت على ${percentage}% في اختبار ${categoryName} - ميراث`;
        const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(shareUrl, '_blank');
        URL.revokeObjectURL(url);
      }
    } catch {
      handleDownload();
    }
  }, [drawCard, percentage, categoryName, handleDownload]);

  const handleCopyText = useCallback(() => {
    const text = `获得了 ${percentage}% في ميراث - ${categoryName}\n✅ ${score}Correct | ❌ ${totalQuestions - score}Wrong | ⏱ ${formatTime(timeSpent)}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [percentage, categoryName, score, totalQuestions, timeSpent]);

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        className="w-full rounded-2xl shadow-lg"
        style={{ width: '100%', height: 'auto' }}
      />
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 font-semibold hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors duration-200"
        >
          <Download className="w-5 h-5" />
          تحميل الصورة
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors duration-200"
        >
          <Share2 className="w-5 h-5" />
          مشاركة
        </button>
        <button
          onClick={handleCopyText}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 font-semibold hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors duration-200"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Share2 className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ShareCard;
