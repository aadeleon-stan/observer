import { useCallback, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { hasEntryForDate } from '../db/entries';

function todayLocal(): string {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

export function useDailyGoal() {
  const db = useSQLiteContext();
  const [hasWrittenToday, setHasWrittenToday] = useState(false);

  const check = useCallback(async () => {
    const result = await hasEntryForDate(db, todayLocal());
    setHasWrittenToday(result);
  }, [db]);

  useEffect(() => {
    check();
  }, [check]);

  return { hasWrittenToday, recheckGoal: check };
}
