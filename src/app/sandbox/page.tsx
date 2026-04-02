"use client";

import { useState, useCallback } from "react";
import Nav from "@/components/nav";
import SqlEditor from "@/components/sql-editor";
import ResultsTable from "@/components/results-table";
import DbSchemaPanel from "@/components/db-schema-panel";
import { useSql } from "@/hooks/use-sql";
import type { QueryResult, QueryError } from "@/lib/db";

export default function SandboxPage() {
  const { loading, exec, reset, getSchema } = useSql();
  const [results, setResults] = useState<QueryResult[] | null>(null);
  const [error, setError] = useState<QueryError | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const handleRun = useCallback(
    (query: string) => {
      const out = exec(query);
      if (out.error) {
        setError(out.error);
        setResults(null);
      } else {
        setResults(out.results);
        setError(null);
      }
      setHistory((prev) => [query, ...prev.slice(0, 19)]);
    },
    [exec]
  );

  const handleReset = useCallback(() => {
    reset();
    setResults(null);
    setError(null);
    setHistory([]);
  }, [reset]);

  const schema = loading ? [] : getSchema();

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">SQL Sandbox</h1>
            <p className="text-gray-400 text-sm mt-1">
              Free-play mode. Write any SQL against the bookstore database.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-sm border border-gray-700 rounded-md text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          >
            Reset Database
          </button>
        </div>

        {loading ? (
          <div className="text-gray-400 py-12 text-center">Loading database...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <SqlEditor
                initialValue="-- Try a query! For example:\nSELECT * FROM books LIMIT 5;"
                onRun={handleRun}
              />
              <ResultsTable results={results} error={error} />
            </div>

            <div className="space-y-6">
              <DbSchemaPanel schema={schema} />

              {history.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                    History
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {history.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleRun(q)}
                        className="block w-full text-left text-xs font-mono text-gray-400 hover:text-white truncate p-1.5 rounded hover:bg-gray-800 transition-colors"
                        title={q}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
