import { createContext, useState } from "react";

export const TopicContext = createContext();

export const TopicProvider = ({ children }) => {
  const [topic, setTopic] = useState("");
  const [aiquiz, setAIquiz] = useState(false);

  return (
    <TopicContext.Provider value={{ topic, setTopic, aiquiz, setAIquiz }}>
      {children}
    </TopicContext.Provider>
  );
};
