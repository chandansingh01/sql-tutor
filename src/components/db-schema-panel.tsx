"use client";

interface SchemaInfo {
  name: string;
  columns: string[];
}

export default function DbSchemaPanel({ schema }: { schema: SchemaInfo[] }) {
  if (!schema.length) return null;

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 space-y-4">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
        Database Schema
      </h3>
      {schema.map((table) => (
        <div key={table.name}>
          <h4 className="text-emerald-400 font-mono text-sm font-bold mb-1">
            {table.name}
          </h4>
          <ul className="text-xs text-gray-400 font-mono space-y-0.5 pl-2">
            {table.columns.map((col) => (
              <li key={col}>{col}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
