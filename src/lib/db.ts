import initSqlJs, { type Database } from "sql.js";

let dbInstance: Database | null = null;
let initPromise: Promise<Database> | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = initSqlJs({
    locateFile: () => "/sql-wasm.wasm",
  }).then((SQL) => {
    dbInstance = new SQL.Database();
    return dbInstance;
  });

  return initPromise;
}

export function resetDb(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    initPromise = null;
  }
}

export interface QueryResult {
  columns: string[];
  values: (string | number | null | Uint8Array)[][];
}

export interface QueryError {
  message: string;
}

export function execQuery(
  db: Database,
  sql: string
): { results: QueryResult[]; error: null } | { results: null; error: QueryError } {
  try {
    const results = db.exec(sql);
    return {
      results: results.map((r) => ({ columns: r.columns, values: r.values })),
      error: null,
    };
  } catch (e) {
    return {
      results: null,
      error: { message: e instanceof Error ? e.message : String(e) },
    };
  }
}
