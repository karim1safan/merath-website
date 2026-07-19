import { useState } from 'react';
import { MapPin, RefreshCw, Edit2, Bell, BellOff } from 'lucide-react';
import usePrayerTimes, { PRAYER_NAMES, PRAYER_ORDER, parseTime } from '../hooks/usePrayerTimes';
import Spinner from '../components/common/Spinner';
import { PrayerPageSkeleton } from '../components/skeletons';

/* ─── Progress Ring SVG ─────────────────────────────────────── */
function ProgressRing({ pct, size = 200, stroke = 10 }) {
  const r   = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        className="stroke-secondary-200 dark:stroke-secondary-700" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="url(#prayerGrad)" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s linear' }} />
      <defs>
        <linearGradient id="prayerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#166534" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Location Setup Screen ─────────────────────────────────── */
function LocationSetup({ locationState, onRequestGeo, onSetCity }) {
  const [city, setCity]       = useState('');
  const [country, setCountry] = useState('SA');
  const [showCity, setShowCity] = useState(locationState === 'denied');

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-4xl shadow-inner">
        🕌
      </div>
      <div>
        <h2 className="text-2xl font-bold text-secondary-800 dark:text-secondary-100 mb-2">مواقيت الصلاة</h2>
        <p className="text-secondary-500 dark:text-secondary-400 max-w-xs mx-auto">
          نحتاج معرفة موقعك لعرض مواقيت الصلاة الصحيحة
        </p>
      </div>

      {!showCity ? (
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onClick={onRequestGeo}
            disabled={locationState === 'requesting'}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60 transition-colors font-medium">
            {locationState === 'requesting'
              ? <><RefreshCw className="w-4 h-4 animate-spin" />جاري تحديد الموقع...</>
              : <><MapPin className="w-4 h-4" />استخدام موقعي الحالي</>}
          </button>
          <button onClick={() => setShowCity(true)}
            className="px-6 py-3 rounded-2xl border border-secondary-300 dark:border-secondary-600 text-secondary-600 dark:text-secondary-400 hover:border-primary-400 transition-colors font-medium">
            إدخال المدينة يدويًا
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full max-w-xs" dir="rtl">
          <input value={city} onChange={e => setCity(e.target.value)} placeholder="اسم المدينة (مثل: Riyadh)"
            className="px-4 py-3 rounded-xl border-2 border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 focus:border-primary-500 focus:outline-none" />
          <select value={country} onChange={e => setCountry(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 focus:border-primary-500 focus:outline-none">
            <option value="SA">السعودية</option>
            <option value="EG">مصر</option>
            <option value="AE">الإمارات</option>
            <option value="KW">الكويت</option>
            <option value="QA">قطر</option>
            <option value="BH">البحرين</option>
            <option value="OM">عُمان</option>
            <option value="JO">الأردن</option>
            <option value="SY">سوريا</option>
            <option value="IQ">العراق</option>
            <option value="MA">المغرب</option>
            <option value="DZ">الجزائر</option>
            <option value="TN">تونس</option>
            <option value="LY">ليبيا</option>
            <option value="GB">المملكة المتحدة</option>
            <option value="US">الولايات المتحدة</option>
            <option value="TR">تركيا</option>
          </select>
          <button onClick={() => city.trim() && onSetCity(city.trim(), country)}
            disabled={!city.trim()}
            className="px-6 py-3 rounded-2xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium">
            تأكيد
          </button>
          <button onClick={() => { setShowCity(false); onRequestGeo(); }}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            استخدم موقعي بدلاً من ذلك
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Prayer Row ────────────────────────────────────────────── */
function PrayerRow({ name, timeStr, isCurrent, isNext }) {
  const info = PRAYER_NAMES[name];
  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
      isCurrent
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
        : isNext
        ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
        : 'bg-secondary-50 dark:bg-secondary-800/60'
    }`}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{info?.icon}</span>
        <div>
          <p className={`font-bold ${isCurrent ? 'text-white' : 'text-secondary-800 dark:text-secondary-100'}`}>
            {info?.ar || name}
          </p>
          {isNext && <p className="text-xs text-primary-600 dark:text-primary-400">القادمة</p>}
        </div>
      </div>
      <span className={`font-mono font-bold text-lg ${
        isCurrent ? 'text-white' : 'text-secondary-700 dark:text-secondary-300'
      }`}>
        {timeStr?.split(' ')[0]}
      </span>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function PrayerTimesPage() {
  const {
    timings, meta,
    isLoading, error,
    location, locationState,
    requestLocation, setCity, changeLocation,
    currentPrayer, nextPrayer,
    countdown, progressPct,
    now,
  } = usePrayerTimes();

  const [notifGranted, setNotifGranted] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );

  const requestNotif = async () => {
    if (typeof Notification === 'undefined') return;
    const perm = await Notification.requestPermission();
    setNotifGranted(perm === 'granted');
  };

  const arabicTime = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  const hijriDate  = now.toLocaleDateString('ar-SA-u-ca-islamic', { year: 'numeric', month: 'long', day: 'numeric' });

  /* ── Setup screen ── */
  if (!location || locationState === 'idle' || locationState === 'requesting' || locationState === 'denied') {
    return (
      <LocationSetup
        locationState={locationState}
        onRequestGeo={requestLocation}
        onSetCity={setCity}
      />
    );
  }

  /* ── Loading ── */
  if (isLoading) return <PrayerPageSkeleton />;

  /* ── Error ── */
  if (error) return (
    <div className="text-center py-16 space-y-4">
      <p className="text-5xl">⚠️</p>
      <p className="text-secondary-600 dark:text-secondary-400">{error}</p>
      <div className="flex justify-center gap-3">
        <button onClick={changeLocation}
          className="px-4 py-2 rounded-xl border border-secondary-300 dark:border-secondary-600 text-secondary-600 dark:text-secondary-400 hover:border-primary-400 transition-colors text-sm">
          تغيير الموقع
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto space-y-6" dir="rtl">

      {/* Location header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-secondary-500 dark:text-secondary-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>
              {location.type === 'city' ? `${location.city}` : meta?.timezone || 'موقعك الحالي'}
            </span>
          </div>
          <p className="text-xs text-secondary-400 dark:text-secondary-500">{hijriDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={notifGranted ? undefined : requestNotif}
            title={notifGranted ? 'الإشعارات مفعّلة' : 'تفعيل الإشعارات'}
            className={`p-2 rounded-xl transition-colors ${
              notifGranted
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                : 'text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800'
            }`}>
            {notifGranted ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>
          <button onClick={changeLocation}
            className="p-2 rounded-xl text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            title="تغيير الموقع">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero: progress ring + countdown */}
      <div className="relative flex flex-col items-center justify-center py-6 rounded-3xl bg-gradient-to-br from-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative">
          <ProgressRing pct={progressPct} size={200} stroke={10} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-3xl mb-1">{currentPrayer ? PRAYER_NAMES[currentPrayer.key]?.icon : '🕌'}</p>
            <p className="font-bold text-lg">{currentPrayer ? PRAYER_NAMES[currentPrayer.key]?.ar : 'لا توجد بيانات'}</p>
            <p className="text-white/70 text-xs mt-0.5">الصلاة الحالية</p>
          </div>
        </div>

        {nextPrayer && (
          <div className="text-center mt-2">
            <p className="text-white/70 text-xs mb-1">
              {PRAYER_NAMES[nextPrayer.key]?.ar} بعد
            </p>
            <p
              key={countdown}
              className="font-mono text-3xl font-bold tracking-widest"
            >
              {countdown}
            </p>
          </div>
        )}
      </div>

      {/* Prayer list */}
      {timings && (
        <div className="space-y-2">
          {PRAYER_ORDER.map(key => (
            <PrayerRow
              key={key}
              name={key}
              timeStr={timings[key]}
              isCurrent={currentPrayer?.key === key}
              isNext={nextPrayer?.key === key}
            />
          ))}
        </div>
      )}

      {/* Method note */}
      {meta && (
        <p className="text-center text-xs text-secondary-400 dark:text-secondary-600">
          حساب أوقات الصلاة بطريقة {meta.method?.name || 'أم القرى'}
        </p>
      )}
    </div>
  );
}
