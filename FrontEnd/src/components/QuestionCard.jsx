import React, { useState } from "react";

export const QuestionCard = ({ item, handleAnswer, selectedAnswers }) => {
  const [showHint, setShowHint] = useState(false);

  const onToggleHint = () => setShowHint((s) => !s);

  return (
    <div className="w-full max-w-3xl">
      {/* Question text */}
      <p className="text-lg sm:text-xl mb-3 font-medium text-[#151618]">
        {item.id}. {item.question}
      </p>

      {/* Options */}
      <div className="flex flex-col justify-start items-start mt-3 w-full">
        {item.options.map((option, index) => (
          <div key={index} className="mb-2">
            <input
              type="radio"
              id={`q${item.id}o${index}`}
              name={`q${item.id}`}
              value={index}
              checked={selectedAnswers[item.id] === index}
              className="mr-2"
              onChange={(e) =>
                handleAnswer({ id: item.id, index: parseInt(e.target.value, 10) })
              }
            />
            <label
              htmlFor={`q${item.id}o${index}`}
              className="text-base sm:text-lg font-medium text-[#151618]"
            >
              {option}
            </label>
          </div>
        ))}
      </div>

      {/* Hint toggle */}
      {item?.hint ? (
        <div className="mt-4">
          {!showHint ? (
            <button
              onClick={onToggleHint}
              className="rounded-full bg-[#151618] text-white px-4 py-2 text-sm sm:text-base
                         hover:bg-[#E43D12] hover:text-[#151618]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30
                         transition"
              aria-expanded="false"
              aria-controls={`hint-${item.id}`}
            >
              Take Hint
            </button>
          ) : (
            <div
              id={`hint-${item.id}`}
              className="rounded-2xl bg-white/70 border border-[rgba(2,6,23,0.06)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[#151618] text-sm sm:text-base leading-relaxed">
                  {item.hint}
                </p>
                <button
                  onClick={onToggleHint}
                  className="shrink-0 rounded-full bg-[#151618] text-white px-3 py-1.5 text-xs
                             hover:bg-[#E43D12] hover:text-[#151618]
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30
                             transition"
                  aria-expanded="true"
                  aria-controls={`hint-${item.id}`}
                >
                  Hide
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <span className="inline-block text-sm text-[#151618]/70">
            Hint not available
          </span>
        </div>
      )}

      <div className="bg-gray-500 h-px w-full my-4"></div>
    </div>
  );
};
