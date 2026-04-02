"use client";

import type { QueryResult, QueryError } from "@/lib/db";

interface ResultsTableProps {
  results: QueryResult[] | null;
  error: QueryError | null;
}

export default function ResultsTable({ results, error }: ResultsTableProps) {
  if (error) {
    return (
      <div className="bg-red-950/50 border border-red-800 rounded-lg p-4 text-red-300 text-sm font-mono">
        <span className="font-bold text-red-400">Error: </span>
        {error.message}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-gray-500 text-sm p-4 bg-gray-900/50 rounded-lg">
        Run a query to see results here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result, idx) => (
        <div key={idx} className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                {result.columns.map((col) => (
                  <th key={col} className="px-4 py-2 font-medium whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-900/50">
              {result.values.length === 0 ? (
                <tr>
                  <td
                    colSpan={result.columns.length}
                    className="px-4 py-3 text-gray-500 text-center"
                  >
                    Query executed successfully. No rows returned.
                  </td>
                </tr>
              ) : (
                result.values.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="border-t border-gray-800 hover:bg-gray-800/50"
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-2 whitespace-nowrap text-gray-200">
                        {cell === null ? (
                          <span className="text-gray-600 italic">NULL</span>
                        ) : (
                          String(cell)
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="bg-gray-800 px-4 py-1.5 text-xs text-gray-400 border-t border-gray-700">
            {result.values.length} row{result.values.length !== 1 ? "s" : ""}
          </div>
        </div>
      ))}
    </div>
  );
}
