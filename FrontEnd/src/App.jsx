import React from "react";
import "./App.css";
import { Routes, Route } from "react-router";
import Welcome from "./Screens/Welcome";
import TopicScreen from "./Screens/TopicScreen";
import { DefaultQuiz } from "./Screens/DefaultQuiz";
import { TopicProvider } from "./contexts/TopicContext";
import { AIQuiz } from "./Screens/AIQuiz";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RuleBook } from "./Screens/RuleBook";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className=" w-full bg-[#151618]">
          <TopicProvider>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/topic" element={<TopicScreen />} />
              <Route path="/defaultquiz" element={<DefaultQuiz />} />
              <Route path="/aiquiz" element={<AIQuiz />} />
              <Route path="/rulebook" element={<RuleBook />}/>;
            </Routes>
          </TopicProvider>
        </div>
      </QueryClientProvider>
    </>
  );
}

export default App;

// rgb(21, 22, 24)
// rgb(152, 155, 164)
// rgb(8, 19, 137)
// rgb(155, 156, 161)
