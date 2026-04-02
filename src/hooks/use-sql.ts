"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Database } from "sql.js";
import { getDb, resetDb, execQuery, type QueryResult, type QueryError } from "@/lib/db";
import { SEED_SQL } from "@/lib/seed-data";

export function useSql() {
  const [db, setDb] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const seeded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    getDb().then((database) => {
      if (cancelled) return;
      if (!seeded.current) {
        database.run(SEED_SQL);
        seeded.current = true;
      }
      setDb(database);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const exec = useCallback(
    (sql: string): { results: QueryResult[]; error: null } | { results: null; error: QueryError } => {
      if (!db) return { results: null, error: { message: "Database not initialized" } };
      return execQuery(db, sql);
    },
    [db]
  );

  const reset = useCallback(() => {
    resetDb();
    seeded.current = false;
    setLoading(true);
    getDb().then((database) => {
      database.run(SEED_SQL);
      seeded.current = true;
      setDb(database);
      setLoading(false);
    });
  }, []);

  const getSchema = useCallback((): { name: string; columns: string[] }[] => {
    if (!db) return [];
    const tables = db.exec(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    );
    if (!tables.length) return [];
    return tables[0].values.map(([name]) => {
      const info = db.exec(`PRAGMA table_info("${name}")`);
      const columns = info.length
        ? info[0].values.map(
            (row) => `${row[1]} (${row[2]}${row[3] ? ", NOT NULL" : ""}${row[5] ? ", PK" : ""})`
          )
        : [];
      return { name: String(name), columns };
    });
  }, [db]);

  return { db, loading, exec, reset, getSchema };
}
