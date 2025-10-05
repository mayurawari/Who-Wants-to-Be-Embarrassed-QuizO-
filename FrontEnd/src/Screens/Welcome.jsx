import React from "react";
import BlurText from "../pre-builds/BlurText";
import ShinyText from "@/pre-builds/ShinyText";
import { useNavigate } from "react-router";

const Welcome = () => {
  const navigate = useNavigate();

  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] px-4 sm:px-6">
        <div className="flex flex-col items-center justify-start bg-[#EBE9E1] rounded-[28px] w-full max-w-5xl
                        px-5 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-10">
          {/* Brand title scales by breakpoint to avoid overflow */}
          <p className="font-medium text-[#151618]
                         text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl
                         leading-none mb-3 text-center">
            QuizO
          </p>

          {/* Subhead block: centered on mobile, left-aligned from md up */}
          <div className="w-full flex flex-col justify-center items-center md:items-start
                          ml-0 md:ml-10 mt-2">
            <BlurText
              text="WELCOME TO QUIZO"
              delay={150}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="text-base sm:text-lg md:text-xl mb-1 font-medium text-[#E43D12] text-center md:text-left"
            />
            <BlurText
              text="Ready To get Embarrassed?"
              delay={250}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 font-[200] text-[#E43D12] text-center md:text-left"
            />
          </div>

          {/* CTA row: full-width button on small screens, natural width from md+ */}
          <div className="w-full flex flex-col justify-center items-center md:items-start ml-0 md:ml-10 mt-6 md:mt-10">
            <button
              onClick={() => navigate("/topic")}
              className="bg-[#151618] text-white rounded-full
                         px-5 sm:px-6 py-3 w-full sm:w-auto
                         hover:bg-[#E43D12] hover:text-[#151618]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30
                         transition-all duration-300 ease-in-out"
            >
              <ShinyText
                text="Get Started →"
                disabled={false}
                speed={3}
                className="custom-class font-bold"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
