"use client";

import Link from "next/link";
import Nav from "@/components/nav";
import { challenges } from "@/lib/challenges";
import { useProgress } from "@/hooks/use-progress";

export default function ChallengesPage() {
  const { getChallengeScore } = useProgress();

  const grouped = {
    easy: challenges.filter((c) => c.difficulty === "easy"),
    medium: challenges.filter((c) => c.difficulty === "medium"),
    hard: challenges.filter((c) => c.difficulty === "hard"),
  };

  const totalScore = challenges.reduce(
    (sum, c) => sum + (getChallengeScore(c.id) ?? 0),
    0
  );
  const maxScore = challenges.reduce((sum, c) => sum + c.points, 0);

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Challenges</h1>
            <p className="text-gray-400 text-sm mt-1">
              Timed SQL challenges with real-world scenarios.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-400">{totalScore}</div>
            <div className="text-xs text-gray-500">/ {maxScore} pts</div>
          </div>
        </div>

        {(["easy", "medium", "hard"] as const).map((diff) => (
          <div key={diff} className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 text-gray-400">
              <span
                className={
                  diff === "easy"
                    ? "text-emerald-400"
                    : diff === "medium"
                    ? "text-yellow-400"
                    : "text-red-400"
                }
              >
                {diff}
              </span>{" "}
              — {diff === "easy" ? "90s" : diff === "medium" ? "120-150s" : "180s"}
            </h2>
            <div className="space-y-2">
              {grouped[diff].map((c) => {
                const score = getChallengeScore(c.id);
                return (
                  <Link
                    key={c.id}
                    href={`/challenges/${c.id}`}
                    className="block p-4 rounded-lg border border-gray-800 hover:border-emerald-600 hover:bg-gray-900/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{c.title}</h3>
                        <p className="text-sm text-gray-500">{c.context}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        {score !== null ? (
                          <span className="text-emerald-400 font-bold">{score} pts</span>
                        ) : (
                          <span className="text-gray-600">{c.points} pts</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </>
  );
}
