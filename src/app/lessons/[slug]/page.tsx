"use client";

import { useState, useCallback, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/nav";
import SqlEditor from "@/components/sql-editor";
import ResultsTable from "@/components/results-table";
import { useSql } from "@/hooks/use-sql";
import { useProgress } from "@/hooks/use-progress";
import { lessons } from "@/lib/lessons";
import type { Exercise } from "@/lib/lessons";
import type { QueryResult, QueryError } from "@/lib/db";

function compareResults(a: QueryResult[], b: QueryResult[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].columns.length !== b[i].columns.length) return false;
    const sortedA = [...a[i].values].map((r) => r.join("|")).sort();
    const sortedB = [...b[i].values].map((r) => r.join("|")).sort();
    if (sortedA.length !== sortedB.length) return false;
    for (let j = 0; j < sortedA.length; j++) {
      if (sortedA[j] !== sortedB[j]) return false;
    }
  }
  return true;
}

function ExerciseBlock({
  exercise,
  exec,
  onComplete,
  isComplete,
}: {
  exercise: Exercise;
  exec: (sql: string) => { results: QueryResult[]; error: null } | { results: null; error: QueryError };
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [results, setResults] = useState<QueryResult[] | null>(null);
  const [error, setError] = useState<QueryError | null>(null);
  const [passed, setPassed] = useState(isComplete);
  const [hintsShown, setHintsShown] = useState(0);

  const handleRun = useCallback(
    (query: string) => {
      const userOut = exec(query);
      if (userOut.error) {
        setError(userOut.error);
        setResults(null);
        setPassed(false);
        return;
      }
      setResults(userOut.results);
      setError(null);

      const expectedOut = exec(exercise.expectedQuery);
      if (expectedOut.results && userOut.results) {
        const match = compareResults(userOut.results, expectedOut.results);
        setPassed(match);
        if (match) onComplete();
      }
    },
    [exec, exercise.expectedQuery, onComplete]
  );

  const difficultyColor = {
    easy: "text-emerald-400",
    medium: "text-yellow-400",
    stretch: "text-orange-400",
  }[exercise.difficulty];

  return (
    <div className={`p-5 rounded-lg border ${passed ? "border-emerald-700 bg-emerald-950/20" : "border-gray-800"}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-medium uppercase ${difficultyColor}`}>
          {exercise.difficulty}
        </span>
        {passed && <span className="text-xs text-emerald-400 font-medium">Passed!</span>}
      </div>
      <p className="text-gray-200 mb-4">{exercise.prompt}</p>

      <SqlEditor onRun={handleRun} />

      {results !== null && !passed && (
        <div className="mt-3 text-sm text-yellow-400 bg-yellow-950/30 border border-yellow-800 rounded-lg p-3">
          Query ran but the result doesn&apos;t match expected output. Check your query and try again.
        </div>
      )}

      <div className="mt-3">
        <ResultsTable results={results} error={error} />
      </div>

      {exercise.hints.length > 0 && !passed && (
        <div className="mt-4">
          {hintsShown > 0 && (
            <div className="space-y-2 mb-2">
              {exercise.hints.slice(0, hintsShown).map((hint, i) => (
                <div key={i} className="text-sm text-blue-300 bg-blue-950/30 border border-blue-800 rounded p-2">
                  Hint {i + 1}: {hint}
                </div>
              ))}
            </div>
          )}
          {hintsShown < exercise.hints.length && (
            <button
              onClick={() => setHintsShown((n) => n + 1)}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Show hint ({hintsShown + 1}/{exercise.hints.length})
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const lesson = lessons.find((l) => l.slug === slug);
  if (!lesson) notFound();

  const { loading, exec } = useSql();
  const { completeExercise, completeLesson, isExerciseComplete, isLessonComplete } = useProgress();
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  const allDone = lesson.exercises.every((e) => isExerciseComplete(e.id));
  const nextLesson = lessons.find((l) => l.number === lesson.number + 1);
  const prevLesson = lessons.find((l) => l.number === lesson.number - 1);

  if (allDone && !isLessonComplete(lesson.slug)) {
    completeLesson(lesson.slug);
  }

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/lessons" className="hover:text-white transition-colors">
            Lessons
          </Link>
          <span>/</span>
          <span className="text-gray-300">Lesson {lesson.number}</span>
        </div>

        <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>

        <div className="bg-emerald-950/20 border border-emerald-800/50 rounded-lg p-4 mb-6">
          <p className="text-emerald-300 text-sm font-medium">Why this matters</p>
          <p className="text-gray-300 mt-1">{lesson.whyItMatters}</p>
        </div>

        <div className="prose prose-invert max-w-none mb-6">
          <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {lesson.concept.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((part, i) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={i} className="text-white">{part.slice(2, -2)}</strong>;
              }
              if (part.startsWith("`") && part.endsWith("`")) {
                return (
                  <code key={i} className="bg-gray-800 text-emerald-300 px-1.5 py-0.5 rounded text-sm">
                    {part.slice(1, -1)}
                  </code>
                );
              }
              return <span key={i}>{part}</span>;
            })}
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mb-8">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">
            Example — click Run to try it
          </p>
          {loading ? (
            <p className="text-gray-500">Loading database...</p>
          ) : (
            <ExampleRunner sql={lesson.example} exec={exec} />
          )}
        </div>

        <h2 className="text-xl font-bold mb-4">Exercises</h2>

        {loading ? (
          <p className="text-gray-400">Loading database...</p>
        ) : (
          <div className="space-y-6 mb-8">
            {lesson.exercises.map((exercise) => (
              <ExerciseBlock
                key={exercise.id}
                exercise={exercise}
                exec={exec}
                isComplete={isExerciseComplete(exercise.id)}
                onComplete={() => completeExercise(exercise.id)}
              />
            ))}
          </div>
        )}

        {allDone && (
          <div className="bg-emerald-950/30 border border-emerald-700 rounded-lg p-6 text-center mb-8">
            <p className="text-emerald-300 text-lg font-semibold">
              Lesson {lesson.number} complete!
            </p>
            {nextLesson && (
              <Link
                href={`/lessons/${nextLesson.slug}`}
                className="inline-block mt-3 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
              >
                Next: {nextLesson.title}
              </Link>
            )}
          </div>
        )}

        <div className="border-t border-gray-800 pt-6">
          <button
            onClick={() => setShowCheatSheet(!showCheatSheet)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {showCheatSheet ? "Hide" : "Show"} Cheat Sheet
          </button>
          {showCheatSheet && (
            <pre className="mt-3 bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 font-mono overflow-x-auto">
              {lesson.cheatSheet}
            </pre>
          )}
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-800">
          {prevLesson ? (
            <Link
              href={`/lessons/${prevLesson.slug}`}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              &larr; {prevLesson.title}
            </Link>
          ) : (
            <div />
          )}
          {nextLesson ? (
            <Link
              href={`/lessons/${nextLesson.slug}`}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {nextLesson.title} &rarr;
            </Link>
          ) : (
            <Link
              href="/challenges"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Try Challenges &rarr;
            </Link>
          )}
        </div>
      </main>
    </>
  );
}

function ExampleRunner({
  sql,
  exec,
}: {
  sql: string;
  exec: (s: string) => { results: QueryResult[]; error: null } | { results: null; error: QueryError };
}) {
  const [results, setResults] = useState<QueryResult[] | null>(null);
  const [error, setError] = useState<QueryError | null>(null);

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
    },
    [exec]
  );

  return (
    <div className="space-y-3">
      <SqlEditor initialValue={sql} onRun={handleRun} />
      <ResultsTable results={results} error={error} />
    </div>
  );
}
