import { Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import usePrayerTimes, { PRAYER_NAMES } from '../hooks/usePrayerTimes';
import { ROUTES } from '../constants';
import { PrayerWidgetSkeleton } from './skeletons';

export default function PrayerWidget() {
  const { timings, location, nextPrayer, currentPrayer, countdown, progressPct, isLoading } = usePrayerTimes();

  // Don't render if user hasn't set location yet
  if (!location) return null;
  if (isLoading) return <PrayerWidgetSkeleton />;
  if (!timings) return null;

  const circumference = 2 * Math.PI * 22;
  const offset = circumference - (progressPct / 100) * circumference;

  return (
    <Link to={ROUTES.PRAYER}
      className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-l from-primary-700 to-primary-800 text-white hover:from-primary-600 hover:to-primary-700 transition-all group shadow-lg shadow-primary-900/30">

      {/* Mini ring */}
      <div className="relative shrink-0">
        <svg width="52" height="52" className="-rotate-90">
          <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
          <circle cx="26" cy="26" r="22" fill="none" stroke="white" strokeWidth="4"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xl">
          {currentPrayer ? PRAYER_NAMES[currentPrayer.key]?.icon : '🕌'}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-white/70 text-xs mb-0.5">
          <span>الصلاة الحالية</span>
        </div>
        <p className="font-bold text-base">
          {currentPrayer ? PRAYER_NAMES[currentPrayer.key]?.ar : '--'}
        </p>
        {nextPrayer && (
          <p className="text-white/70 text-xs mt-0.5">
            {PRAYER_NAMES[nextPrayer.key]?.ar} بعد <span className="font-mono font-bold text-white">{countdown}</span>
          </p>
        )}
      </div>

      <ChevronLeft className="w-4 h-4 text-white/50 group-hover:text-white transition-colors shrink-0" />
    </Link>
  );
}
