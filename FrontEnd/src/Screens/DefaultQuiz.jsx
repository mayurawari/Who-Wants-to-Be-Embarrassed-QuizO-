import React, { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NextPrevButton } from "@/components/NextPrevButton";
import BlurText from "@/pre-builds/BlurText";
import ShinyText from "@/pre-builds/ShinyText";
import { useNavigate } from "react-router";
import { QuestionCard } from "@/components/QuestionCard";
import { QuestionSkeleton } from "@/components/SkeletonLoader";

const fetchQuizData = async () => {
  const res = await fetch("https://who-wants-to-be-embarrassed-quizo.onrender.com/api/bydefault");
  if (!res.ok) throw new Error("Failed to fetch quiz");
  return res.json();
};

const submitQuizAnswers = async (answers) => {
  const res = await fetch("https://who-wants-to-be-embarrassed-quizo.onrender.com/api/bydefault/getscore", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answers),
  });
  if (!res.ok) throw new Error("Failed to submit quiz");
  return res.json();
};

export const DefaultQuiz = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["defaultquiz"],
    queryFn: fetchQuizData,
    refetchOnWindowFocus: false,
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [time, setTime] = useState(200);

  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem("defaultquiz_selectedAnswers");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [submitted, setSubmitted] = useState(false);
  const [finalscore, setFinalScore] = useState(null);
  const [wrongQA, setWrongQA] = useState([]);
  const [notansweredQA, setNotansweredQA] = useState([]);
  const [showModal, setshowModal] = useState(false);

  const intervalRef = useRef(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        "defaultquiz_selectedAnswers",
        JSON.stringify(selectedAnswers)
      );
    } catch {}
  }, [selectedAnswers]);

  useEffect(() => {
    if (!data || submitted) return;
    setTime(200);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const id = window.setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          confirmSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    intervalRef.current = id;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [data, submitted]);

  const handleAnswersVisible = (obj) => {
    setSelectedAnswers((prev) => ({ ...prev, [obj.id]: obj.index }));
    try {
      const next = { ...(selectedAnswers || {}), [obj.id]: obj.index };
      localStorage.setItem("defaultquiz_selectedAnswers", JSON.stringify(next));
    } catch {}
  };

  const handlePrevious = (index) => {
    const previndex = index - 1;
    if (previndex < 0) return;
    setCurrentQuestionIndex(previndex);
  };

  const handleNext = (index) => {
    if (!data) return;
    const nextindex = index + 1;
    if (nextindex >= data.length) return;
    setCurrentQuestionIndex(nextindex);
  };

  const computeLocalResult = (QAset) => {
    let score = 0;
    const wrong = [];
    const na = [];
    for (const q of QAset) {
      if (q.notanswered) {
        na.push({ id: q.id, question: q.question });
      } else {
        if (q.answer === q.correctoption) {
          score += 1;
        } else {
          wrong.push({
            id: q.id,
            question: q.question,
            answer: q.answer,
            correctoption: q.correctoption,
          });
        }
      }
    }
    return { totalscore: score, wronganswers: wrong, notansweredQA: na };
  };

  const mutation = useMutation({ mutationFn: submitQuizAnswers });

  const handleSubmit = () => {
    setshowModal(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const cancelNext = () => {
    setshowModal(false);
    if (!submitted && !intervalRef.current && data) {
      const id = window.setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            confirmSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      intervalRef.current = id;
    }
  };

  const confirmSubmit = (fromTimeout = false) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setshowModal(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!data) {
      setSubmitted(true);
      setFinalScore(0);
      setWrongQA([]);
      setNotansweredQA([]);
      submittingRef.current = false;
      return;
    }

    let latestSelected = selectedAnswers;
    try {
      const saved = localStorage.getItem("defaultquiz_selectedAnswers");
      if (saved) {
        const parsed = JSON.parse(saved);
        latestSelected = { ...parsed, ...selectedAnswers };
      }
    } catch {}

    const answeredIds = new Set(Object.keys(latestSelected || {}).map(Number));
    const QAobjArr = data.map((q) => {
      if (answeredIds.has(q.id)) {
        return { ...q, answer: latestSelected[q.id], notanswered: false };
      }
      return { ...q, answer: null, notanswered: true };
    });

    const local = computeLocalResult(QAobjArr);
    setFinalScore(local.totalscore);
    setWrongQA(local.wronganswers);
    setNotansweredQA(local.notansweredQA);
    setSubmitted(true);

    mutation.mutate(
      { QAset: QAobjArr },
      {
        onSuccess: (resp) => {
          setFinalScore(resp.totalscore);
          setWrongQA(resp.wronganswers);
          setNotansweredQA(resp.notansweredQA);
          queryClient.invalidateQueries({ queryKey: ["defaultquiz"] });
          try {
            localStorage.removeItem("defaultquiz_selectedAnswers");
          } catch {}
          submittingRef.current = false;
        },
        onError: () => {
          submittingRef.current = false;
        },
      }
    );
  };

  const atLastQuestion = data && currentQuestionIndex === data.length - 1;
  const total = 200;
  const progress = Math.max(0, Math.min(100, ((total - time) / total) * 100));

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-start sm:items-center justify-center px-4 sm:px-6 py-6">
      <div className="w-full max-w-6xl bg-[#EBE9E1] rounded-[28px] shadow-xl border border-[rgba(2,6,23,0.06)]
                      px-5 sm:px-8 md:px-12 lg:px-14 py-6 sm:py-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-[#151618] font-medium text-2xl sm:text-3xl md:text-4xl">
            Quiz
          </h1>

          {!submitted && (
            <div className="w-full md:w-auto md:min-w-[340px]">
              <div className="flex items-center justify-between text-[#151618]">
                <span className="text-sm sm:text-base">Time Remaining</span>
                <span className="text-sm sm:text-base font-bold">
                  {time}sec / 200sec
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-black/10 overflow-hidden">
                <div
                  className="h-full bg-[#E43D12] transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </header>

        {/* Main */}
        <main className="mt-6">
          {!submitted && (
            <section className="w-full">
              <div className="w-full">
                {isLoading ? (
                  <QuestionSkeleton />
                ) : isError ? (
                  <div className="text-[#151618] bg-white/70 border border-[rgba(2,6,23,0.06)] rounded-2xl p-6">
                    Error: {error?.message}
                  </div>
                ) : (
                  <QuestionCard
                    item={data[currentQuestionIndex]}
                    handleAnswer={handleAnswersVisible}
                    selectedAnswers={selectedAnswers}
                  />
                )}
              </div>

              {!isLoading && !isError && (
                <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-6">
                  <div className="flex-1 flex justify-start">
                    {currentQuestionIndex !== 0 && (
                      <NextPrevButton
                        text={"Previous"}
                        isDisabled={currentQuestionIndex === 0}
                        styles="w-full sm:w-auto"
                        handleAction={() => handlePrevious(currentQuestionIndex)}
                      />
                    )}
                  </div>
                  <div className="flex-1 flex justify-end">
                    <NextPrevButton
                      text={atLastQuestion ? "Submit" : "Next"}
                      width="w-full sm:w-auto"
                      isDisabled={false}
                      handleAction={() =>
                        atLastQuestion ? handleSubmit() : handleNext(currentQuestionIndex)
                      }
                    />
                  </div>
                </div>
              )}
            </section>
          )}

          {submitted &&
            wrongQA.length === 0 &&
            notansweredQA.length === (data?.length || 0) && (
              <p className="text-base sm:text-lg md:text-xl text-[#151618] font-semibold text-center">
                No answers were selected. Try again!
              </p>
            )}

          {submitted && (
            <section className="w-full">
              <div className="w-full flex justify-center items-center mb-5">
                <span className="text-4xl sm:text-5xl font-bold text-black mt-3">
                  {finalscore}/{data?.length || 0}
                </span>
              </div>

              <div className="w-full flex flex-col items-center">
                {wrongQA.length !== 0 && (
                  <div className="w-full md:w-3/4 lg:w-1/2">
                    <p className="text-2xl font-medium text-[#151618]">Incorrect Picks</p>
                    {wrongQA.map((QA) => (
                      <div key={QA.id} className="pt-4">
                        <p className="text-lg sm:text-xl mb-2 font-medium text-[#151618]">
                          {QA.id}. {QA.question}
                        </p>
                        <div className="flex flex-col gap-1 text-[#151618]">
                          <p>
                            <span className="text-green-700 mr-2">Correct Answer</span>
                            <span>{data[QA.id - 1]?.options[QA.correctoption]}</span>
                          </p>
                          <p>
                            <span className="text-red-500 mr-2">Your Answer</span>
                            <span>{data[QA.id - 1]?.options[QA.answer]}</span>
                          </p>
                        </div>
                        <div className="bg-gray-700 h-px w-full my-4" />
                      </div>
                    ))}
                  </div>
                )}

                {notansweredQA.length !== 0 && (
                  <div className="w-full md:w-3/4 lg:w-1/2">
                    <p className="text-2xl font-medium text-[#151618]">Not Answered</p>
                    {notansweredQA.map((QA) => (
                      <div key={QA.id} className="pt-4">
                        <p className="text-lg sm:text-xl mb-2 font-medium text-[#151618]">
                          {QA.id}. {QA.question}
                        </p>
                        <div className="bg-gray-700 h-px w-full my-4" />
                      </div>
                    ))}
                  </div>
                )}

                {wrongQA.length === 0 && notansweredQA.length === 0 && (
                  <div className="p-5 mt-2 w-full flex flex-col items-center">
                    <BlurText
                      text="Congrats! You are Tough"
                      delay={250}
                      animateBy="words"
                      direction="top"
                      className="text-2xl sm:text-3xl mb-6 font-[500] text-[#E43D12]"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-lg sm:text-2xl font-medium text-black">Final Score</span>
                      <span className="text-base sm:text-xl font-bold text-black">
                        {finalscore}/{data?.length || 0}
                      </span>
                    </div>
                    <div className="mt-8 w-full flex justify-center">
                      <button
                        onClick={() => navigate("/topic")}
                        className="bg-[#151618] text-white px-6 py-3 rounded-full
                                   hover:bg-[#E43D12] hover:text-[#151618]
                                   focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30
                                   transition"
                      >
                        <ShinyText
                          text="Get Back to the Topic screen. Try custom topic This time"
                          disabled={false}
                          speed={3}
                          className="custom-class font-bold text-base sm:text-xl"
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>

        {/* Modal */}
        {showModal && !submitted && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6">
              <h3 className="text-xl font-bold mb-4 text-[#151618]">Are you sure?</h3>
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                  onClick={cancelNext}
                >
                  No
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  onClick={() => confirmSubmit(false)}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
