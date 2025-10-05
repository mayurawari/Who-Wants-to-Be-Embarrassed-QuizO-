import { TopicContext } from "@/contexts/TopicContext";
import React, { useContext } from "react";
import { useNavigate } from "react-router";

export const RuleBook = () => {
  const navigate = useNavigate();
  const {aiquiz} = useContext(TopicContext)

  const rules = [
    { id: 1, title: "Timeboxed", desc: "Each question is under a global timer; when time’s up, your latest selection is captured." },
    { id: 2, title: "One Pick", desc: "Select exactly one option per question. Change is allowed before submission/time out." },
    { id: 3, title: "Auto-Save", desc: "Your latest choice is saved instantly and recovered even if time ends abruptly." },
    { id: 4, title: "Scoring", desc: "Correct answers add to your score. Unanswered questions are clearly marked." },
    { id: 5, title: "Finalization", desc: "On Submit or timeout, results show immediately while the server validates." },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-[#0f172a]">
      {/* Curved light panel centered on dark shell */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-screen-lg rounded-[28px] bg-[#f5f1e8] shadow-xl border border-[rgba(2,6,23,0.06)]">
          <header className="px-6 sm:px-10 pt-10 pb-6">
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                QuizO Rules
              </h1>
              <button
                onClick={() => aiquiz ? navigate("/aiquiz") :navigate("/defaultquiz")}
                className="inline-flex items-center gap-2 rounded-full bg-[#111827] text-white px-5 py-2.5 hover:bg-[#0f172a] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 active:scale-95 transition"
                aria-label="Start Quiz"
                title="Start Quiz"
              >
                Go to Quiz →
              </button>
            </div>
            <p className="mt-3 text-[#334155]">
              Drop a topic or start a regular quiz. Results are shown instantly after submit or timeout.
            </p>
          </header>

          <main className="px-6 sm:px-10 pb-10">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main content */}
              <div className="lg:col-span-8">
                <div className="rounded-2xl bg-white/60 border border-[rgba(2,6,23,0.06)] overflow-hidden">
                  <div className="p-5 sm:p-7">
                    <h2 className="text-2xl font-semibold mb-4">How it works</h2>

                    <ol className="relative border-l border-[#cdd3dd] pl-6 space-y-5">
                      {rules.map((r, idx) => (
                        <li key={r.id} className="group">
                          <span className="absolute -left-[10px] flex h-5 w-5 items-center justify-center rounded-full border border-[#c5ccd8] bg-[#e7ebf2] text-xs text-[#111827]">
                            {idx + 1}
                          </span>
                          <p className="text-lg font-semibold">{r.title}</p>
                          <p className="text-[#334155]">{r.desc}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              {/* Right tips block to fill space at large screens, stacks on mobile */}
              <aside className="lg:col-span-4">
                <div className="rounded-2xl bg-white/60 border border-[rgba(2,6,23,0.06)] p-5 sm:p-6">
                  <h3 className="text-lg font-semibold mb-3">Quick tips</h3>
                  <ul className="space-y-2 text-[#334155]">
                    <li>Use a stable connection.</li>
                    <li>Check the global timer.</li>
                    <li>Change answers before timeout.</li>
                    <li>Avoid page refresh during quiz.</li>
                    <li>Results appear instantly.</li>
                  </ul>
                  <div className="mt-6">
                    <button
                      onClick={() => aiquiz ? navigate("/aiquiz") :navigate("/defaultquiz")}
                      className="w-full rounded-full bg-[#111827] text-white px-4 py-2.5 hover:bg-[#0f172a] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 active:scale-95 transition"
                    >
                      Start Now
                    </button>
                  </div>
                </div>
              </aside>
            </section>
          </main>

          <footer className="px-6 sm:px-10 pb-8 text-[#334155]">
            <p className="text-sm">Good luck—give it the best shot.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};
