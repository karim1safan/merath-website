import { useMemo, useState } from 'react';
import SEERAH_TIMELINE, { SEERAH_CATEGORIES, SEERAH_ERAS } from '../data/seerahTimeline';
import BATTLES, { BATTLE_CATEGORIES } from '../data/battles';

export function useSeerah() {
  const [selectedEra, setSelectedEra] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTimeline = useMemo(() => {
    return SEERAH_TIMELINE.filter((event) => {
      if (selectedEra !== 'all' && event.era !== selectedEra) return false;
      if (selectedCategory !== 'all' && event.category !== selectedCategory) return false;
      return true;
    });
  }, [selectedEra, selectedCategory]);

  const timelineByEra = useMemo(() => {
    return {
      makkah: SEERAH_TIMELINE.filter((e) => e.era === 'makkah'),
      madinah: SEERAH_TIMELINE.filter((e) => e.era === 'madinah'),
    };
  }, []);

  const stats = useMemo(() => ({
    total: SEERAH_TIMELINE.length,
    makkah: SEERAH_TIMELINE.filter((e) => e.era === 'makkah').length,
    madinah: SEERAH_TIMELINE.filter((e) => e.era === 'madinah').length,
  }), []);

  return {
    timeline: filteredTimeline,
    allTimeline: SEERAH_TIMELINE,
    categories: SEERAH_CATEGORIES,
    eras: SEERAH_ERAS,
    timelineByEra,
    stats,
    selectedEra,
    selectedCategory,
    setSelectedEra,
    setSelectedCategory,
  };
}

export function useBattles() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredBattles = useMemo(() => {
    return BATTLES.filter((battle) => {
      if (selectedCategory !== 'all' && battle.category !== selectedCategory) return false;
      return true;
    });
  }, [selectedCategory]);

  const getBattleById = (id) => {
    return BATTLES.find((b) => b.id === Number(id));
  };

  const stats = useMemo(() => ({
    total: BATTLES.length,
    ghazwat: BATTLES.filter((b) => b.category === 'ghazwa').length,
    saraya: BATTLES.filter((b) => b.category === 'sariyyah').length,
  }), []);

  return {
    battles: filteredBattles,
    allBattles: BATTLES,
    categories: BATTLE_CATEGORIES,
    getBattleById,
    stats,
    selectedCategory,
    setSelectedCategory,
  };
}
