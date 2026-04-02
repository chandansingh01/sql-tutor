"use client";

import Link from "next/link";
import Nav from "@/components/nav";
import { lessons } from "@/lib/lessons";
import { useProgress } from "@/hooks/use-progress";

export default function LessonsPage() {
  const { isLessonComplete } = useProgress();

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">The Essential 12</h1>
        <p className="text-gray-400 mb-8">
          The 20% of SQL that covers 80% of real-world work. Master these and you can
          handle most queries thrown at you.
        </p>

        <div className="space-y-3">
          {lessons.map((lesson) => {
            const done = isLessonComplete(lesson.slug);
            return (
              <Link
                key={lesson.slug}
                href={`/lessons/${lesson.slug}`}
                className="block p-4 rounded-lg border border-gray-800 hover:border-emerald-600 hover:bg-gray-900/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      done
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-800 text-gray-400 group-hover:text-white"
                    }`}
                  >
                    {done ? "\u2713" : lesson.number}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-white truncate">
                      {lesson.title}
                    </h2>
                    <p className="text-sm text-gray-500 truncate">
                      {lesson.whyItMatters}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
