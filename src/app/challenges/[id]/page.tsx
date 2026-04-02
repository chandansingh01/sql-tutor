"use client";

import { useState, useCallback, useEffect, useRef, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/nav";
import SqlEditor from "@/components/sql-editor";
import ResultsTable from "@/components/results-table";
import { useSql } from "@/hooks/use-sql";
import { useProgress } from "@/hooks/use-progress";
import { challenges } from "@/lib/challenges";
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

export default function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const challenge = challenges.find((c) => c.id === id);
  if (!challenge) notFound();

  const { loading, exec } = useSql();
  const { saveChallengeScore, getChallengeScore } = useProgress();

  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState<QueryResult[] | null>(null);
  const [error, setError] = useState<QueryError | null>(null);
  const [passed, setPassed] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const bestScore = getChallengeScore(challenge.id);

  useEffect(() => {
    if (!started || finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished]);

  const handleRun = useCallback(
    (query: string) => {
      if (!started) {
        setStarted(true);
      }
      const userOut = exec(query);
      if (userOut.error) {
        setError(userOut.error);
        setResults(null);
        setPassed(false);
        return;
      }
      setResults(userOut.results);
      setError(null);

      const expectedOut = exec(challenge.expectedQuery);
      if (expectedOut.results && userOut.results) {
        const match = compareResults(userOut.results, expectedOut.results);
        setPassed(match);
        if (match) {
          if (timerRef.current) clearInterval(timerRef.current);
          setFinished(true);
          const timeBonus = Math.round(
            (timeLeft / challenge.timeLimit) * challenge.points
          );
          const finalScore = Math.max(
            Math.round(challenge.points * 0.5),
            timeBonus
          );
          setScore(finalScore);
          saveChallengeScore(challenge.id, finalScore);
        }
      }
    },
    [exec, challenge, started, timeLeft, saveChallengeScore]
  );

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const nextChallenge = challenges.find(
    (c) => challenges.indexOf(c) === challenges.indexOf(challenge) + 1
  );

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/challenges" className="hover:text-white transition-colors">
            Challenges
          </Link>
          <span>/</span>
          <span className="text-gray-300">{challenge.title}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{challenge.title}</h1>
          <div className="flex items-center gap-4">
            {bestScore !== null && (
              <span className="text-sm text-gray-500">
                Best: <span className="text-emerald-400 font-bold">{bestScore} pts</span>
              </span>
            )}
            <div
              className={`text-2xl font-mono font-bold ${
                timeLeft <= 30 ? "text-red-400" : timeLeft <= 60 ? "text-yellow-400" : "text-white"
              }`}
            >
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">
            Scenario
          </p>
          <p className="text-gray-300">{challenge.context}</p>
        </div>

        <div className="bg-blue-950/20 border border-blue-800/50 rounded-lg p-4 mb-6">
          <p className="text-blue-300 font-medium">{challenge.prompt}</p>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading database...</p>
        ) : (
          <>
            {!started && !finished && (
              <p className="text-sm text-gray-500 mb-4">
                Timer starts when you run your first query.
              </p>
            )}

            <SqlEditor onRun={handleRun} disabled={finished} />

            <div className="mt-4">
              <ResultsTable results={results} error={error} />
            </div>

            {finished && passed && score !== null && (
              <div className="mt-6 bg-emerald-950/30 border border-emerald-700 rounded-lg p-6 text-center">
                <p className="text-emerald-300 text-xl font-bold mb-1">
                  Challenge Complete!
                </p>
                <p className="text-3xl font-bold text-white mb-2">{score} pts</p>
                <p className="text-sm text-gray-400">
                  {timeLeft > 0
                    ? `Solved with ${formatTime(timeLeft)} remaining`
                    : "Just in time!"}
                </p>
                {nextChallenge && (
                  <Link
                    href={`/challenges/${nextChallenge.id}`}
                    className="inline-block mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                  >
                    Next Challenge
                  </Link>
                )}
              </div>
            )}

            {finished && !passed && (
              <div className="mt-6 bg-red-950/30 border border-red-700 rounded-lg p-6 text-center">
                <p className="text-red-300 text-xl font-bold mb-1">Time&apos;s Up!</p>
                <p className="text-sm text-gray-400 mb-4">
                  Don&apos;t worry — try again to improve your score.
                </p>
                <button
                  onClick={() => {
                    setTimeLeft(challenge.timeLimit);
                    setStarted(false);
                    setFinished(false);
                    setResults(null);
                    setError(null);
                    setPassed(false);
                    setScore(null);
                  }}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {results !== null && !passed && !finished && (
              <div className="mt-3 text-sm text-yellow-400 bg-yellow-950/30 border border-yellow-800 rounded-lg p-3">
                Not quite — the result doesn&apos;t match. Keep trying!
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
