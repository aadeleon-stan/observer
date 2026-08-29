import { useCallback, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from 'expo-router';
import type { Entry } from '../types/entry';
import type { Category } from '../types/entry';
import * as entriesDb from '../db/entries';

export function useEntriesByDate(localDate: string) {
  const db = useSQLiteContext();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await entriesDb.getEntriesByDate(db, localDate);
    setEntries(result);
    setLoading(false);
  }, [db, localDate]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { entries, loading, refresh };
}

export function useAllEntries() {
  const db = useSQLiteContext();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await entriesDb.getAllEntriesGrouped(db);
    setEntries(result);
    setLoading(false);
  }, [db]);

  // Refresh every time the screen gains focus
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return { entries, loading, refresh };
}

export function useEntry(id: string) {
  const db = useSQLiteContext();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await entriesDb.getEntryById(db, id);
    setEntry(result);
    setLoading(false);
  }, [db, id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const update = useCallback(
    async (body: string, category: Category) => {
      await entriesDb.updateEntry(db, id, body, category);
      await refresh();
    },
    [db, id, refresh],
  );

  const remove = useCallback(async () => {
    await entriesDb.softDelete(db, id);
  }, [db, id]);

  return { entry, loading, refresh, update, remove };
}
