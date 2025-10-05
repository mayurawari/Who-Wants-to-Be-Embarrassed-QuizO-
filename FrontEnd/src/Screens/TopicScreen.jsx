import { TopicContext } from "@/contexts/TopicContext";
import ShinyText from "@/pre-builds/ShinyText";
import React, { useContext } from "react";
import { useNavigate } from "react-router";

const TopicScreen = () => {
  const { topic, setTopic, setAIquiz} = useContext(TopicContext);

  const handleTopicChange = (e) => {
    setAIquiz(true);
    setTopic(e.target.value);
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] px-4 sm:px-6">
      <div className="w-full max-w-5xl flex flex-col items-center bg-[#EBE9E1] rounded-[28px]
                      px-5 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-10">
        <div className="w-full flex flex-col items-center">
          <p className="font-medium text-[#151618] text-center
                         text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-3">
            QuizO Topic
          </p>

          {/* Form card */}
          <div className="w-full flex flex-col justify-between items-center gap-5 py-6 sm:py-8 md:py-10
                          bg-gray-300 rounded-3xl px-4 sm:px-6 md:px-10 mt-4 sm:mt-5">
            <div className="flex flex-col w-full">
              <label
                htmlFor="topicinput"
                className="text-base sm:text-lg md:text-xl mb-3 font-medium text-[#151618] w-full"
              >
                Drop Your Topic On which you want to be quizzed
              </label>
              <input
                type="text"
                id="topicinput"
                onChange={handleTopicChange}
                placeholder="Type Here.."
                className="text-base sm:text-lg font-medium text-[#151618] bg-gray-400 p-3 sm:p-3.5 rounded-xl w-full
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
              />
            </div>

            <div className="flex justify-center items-center w-full">
              <button
                onClick={() => navigate("/rulebook")}
                disabled={!topic}
                className="bg-[#151618] text-white rounded-full
                           w-full sm:w-auto px-5 sm:px-6 py-3
                           disabled:opacity-60 disabled:cursor-not-allowed
                           hover:bg-[#E43D12] hover:text-[#151618]
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30
                           transition-all duration-300 ease-in-out"
              >
                <ShinyText
                  text="Go to Quiz"
                  disabled={false}
                  speed={3}
                  className="custom-class font-bold"
                />
              </button>
            </div>
          </div>

          <div className="bg-gray-700 h-px w-full my-4 sm:my-6" />

          <p className="text-[#151618] font-medium text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">
            OR
          </p>
        </div>

        <div className="flex justify-center items-center mt-6 md:mt-10 w-full">
          <button
            onClick={() => {
              setAIquiz(false);
              navigate("/rulebook")
            }}
            className="bg-[#151618] text-white rounded-full
                       w-full sm:w-auto px-5 sm:px-6 py-3
                       hover:bg-[#E43D12] hover:text-[#151618]
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30
                       transition-all duration-300 ease-in-out"
          >
            <ShinyText
              text="Get Started with Regular quiz"
              disabled={false}
              speed={3}
              className="custom-class font-bold"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicScreen;
