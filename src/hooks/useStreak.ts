import { useCallback, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { getDistinctWrittenDates } from '../db/entries';

function todayLocal(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export function useStreak() {
  const db = useSQLiteContext();
  const [streak, setStreak] = useState(0);

  const recheckStreak = useCallback(async () => {
    const dates = await getDistinctWrittenDates(db);
    const dateSet = new Set(dates);
    const today = todayLocal();

    if (!dateSet.has(today)) {
      setStreak(0);
      return;
    }

    let count = 1;
    let current = today;
    while (true) {
      const prev = addDays(current, -1);
      if (dateSet.has(prev)) {
        count++;
        current = prev;
      } else {
        break;
      }
    }
    setStreak(count);
  }, [db]);

  useEffect(() => {
    recheckStreak();
  }, [recheckStreak]);

  return { streak, recheckStreak };
}
