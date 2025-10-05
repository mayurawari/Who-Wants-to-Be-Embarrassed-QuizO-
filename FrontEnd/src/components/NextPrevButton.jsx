import React from "react";

export const NextPrevButton = ({ text , handleAction, isDisabled, styles}) => {
  return (
    <div className="flex justify-center items-center">
      <button onClick={handleAction} disabled={isDisabled} className={`bg-black text-white rounded-full hover:bg-[#E43D12] transition-all duration-300 ease-in-out m-2 py-2 px-4 ${styles}`}>
        {text}
      </button>
    </div>
  );
};
