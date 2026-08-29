import React from 'react';
import { SQLiteProvider as ExpoSQLiteProvider } from 'expo-sqlite';
import { migrate } from './schema';

const DB_NAME = 'observer.db';

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <ExpoSQLiteProvider databaseName={DB_NAME} onInit={migrate}>
      {children}
    </ExpoSQLiteProvider>
  );
}
