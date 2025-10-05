import React from "react";

export const QuestionSkeleton= () => {
  return (
    <div className="animate-pulse rounded-2xl bg-white/70 border border-[rgba(2,6,23,0.06)] p-5 sm:p-6">
      <div className="h-6 w-2/3 bg-gray-300 rounded mb-4" />
      <div className="space-y-3">
        <div className="h-12 bg-gray-300 rounded" />
        <div className="h-12 bg-gray-300 rounded" />
        <div className="h-12 bg-gray-300 rounded" />
        <div className="h-12 bg-gray-300 rounded" />
      </div>
    </div>
  );
};
