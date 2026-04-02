import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center space-y-8">
          <h1 className="text-5xl font-bold tracking-tight">
            SQL<span className="text-emerald-400">Tutor</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Learn the <span className="text-white font-semibold">20% of SQL</span> that
            covers <span className="text-white font-semibold">80% of real-world work</span>.
            <br />
            No fluff. No theory dumps. Just the queries you&apos;ll actually write every day.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <Link
              href="/lessons"
              className="group p-5 rounded-xl border border-gray-800 hover:border-emerald-600 hover:bg-gray-900/50 transition-all"
            >
              <div className="text-2xl mb-2">12</div>
              <h2 className="font-semibold text-white mb-1">Essential Lessons</h2>
              <p className="text-sm text-gray-400">
                Progressive curriculum from SELECT to CTEs, with real-world exercises.
              </p>
            </Link>

            <Link
              href="/sandbox"
              className="group p-5 rounded-xl border border-gray-800 hover:border-emerald-600 hover:bg-gray-900/50 transition-all"
            >
              <div className="text-2xl mb-2">&#9654;</div>
              <h2 className="font-semibold text-white mb-1">Free Sandbox</h2>
              <p className="text-sm text-gray-400">
                Open SQL editor with a sample bookstore database. Experiment freely.
              </p>
            </Link>

            <Link
              href="/challenges"
              className="group p-5 rounded-xl border border-gray-800 hover:border-emerald-600 hover:bg-gray-900/50 transition-all"
            >
              <div className="text-2xl mb-2">10</div>
              <h2 className="font-semibold text-white mb-1">Timed Challenges</h2>
              <p className="text-sm text-gray-400">
                Test your skills under time pressure with real-world scenarios.
              </p>
            </Link>
          </div>

          <div className="pt-4">
            <Link
              href="/lessons"
              className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Start Learning
            </Link>
          </div>

          <p className="text-xs text-gray-600">
            Runs entirely in your browser. No sign-up. No backend. Your progress is saved locally.
          </p>
        </div>
      </div>
    </div>
  );
}
