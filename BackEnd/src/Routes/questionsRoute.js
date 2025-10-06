import { Router } from "express";
import { config } from "dotenv";
import questionModel from "../Models/questionModel.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
config();
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

const QRoute = Router();

//Sample Data

// {
//     "id": 10,
//     "question": "What is H2O commonly known as?",
//     "options": ["Oxygen", "Hydrogen", "Water", "Carbon Dioxide"],
//     "correctOptionIndex": 2,
//     "hint": "It's essential for life and covers most of Earth's surface."
// }

QRoute.get("/bydefault", async (req, res) => {
  try {
    let getquestions = await questionModel.find().select("-correctOptionIndex");
    res.status(200).send(getquestions);
  } catch (error) {
    console.log(error);
  }
});

// Object To Be Received From client side.
// {
//     "_id": "68da943322b60dc4dce9bce9",
//     "id": 5,
//     "question": "Which gas do humans breathe in to survive?",
//     "options": [
//         "Oxygen",
//         "Carbon Dioxide",
//         "Nitrogen",
//         "Helium"
//     ],
//     "hint": "Without it, we can't produce energy in our cells.",
//     "answer": 0,
//     "notanswered": false
// }
QRoute.post("/bydefault/getscore", async (req, res) => {
  const { QAset } = req.body;
  try {
    if (!QAset) {
      console.log("Fields Cannot be empty....");
      res.status(400).json({ message: "Error! fields are empty." });
    }

    // {"_id":{"$oid":"68da943322b60dc4dce9bce5"},
    // "id":{"$numberInt":"1"},
    // "question":"What is the capital of France?",
    // "options":["Paris","London","Berlin","Madrid"],
    // "correctOptionIndex":{"$numberInt":"0"},
    // "hint":"It's also called the City of Lights."}

    let getquestions = await questionModel.find();
    let totalmarks = 0;
    let wrongQA = [];
    let notAnsweredQA = [];
    for (let obj of QAset) {
      const question = getquestions.find((q) => q.id === obj.id);
      if (!question) continue;
      if (obj.answer === question.correctOptionIndex) {
        totalmarks += 1;
      } else if (obj.notanswered === true) {
        notAnsweredQA.push(obj);
      } else {
        obj["correctoption"] = question.correctOptionIndex;
        wrongQA.push(obj);
      }
    }
    res.status(200).json({
      totalscore: totalmarks,
      wronganswers: wrongQA,
      notansweredQA: notAnsweredQA,
    });
  } catch (error) {
    console.log(error, "Error in /getScore");
  }
});

QRoute.post("/AIquestions", async (req, res) => {
  const { customtopic } = req.body;
  const parser = new JsonOutputParser();
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0,
  });

  const quizPrompt = new PromptTemplate({
    inputVariables: ["usertopic"],
    template: `
You are a quiz data generator.

Generate an array of 10 question objects based on the topic: {usertopic}.

Each object must strictly follow this structure:

{{
  "id": 1,
  "question": "string",
  "options": ["option1", "option2", "option3", "option4"],
  "correctOptionIndex": 1,//correct answer index
  "hint": "string"
}}

Instructions:
- Generate exactly 10 questions.
- Each question carries 1 mark.
- The topic is {usertopic}.
- Maintain a difficulty mix: about 70% hard questions and 30% easy questions.
- Include factual, conceptual, and analytical questions.
- Make options challenging — avoid obvious answers.
- Hints should provide subtle guidance, not reveal the answer.
- Ensure correctOptionIndex matches the correct answer accurately.
- Avoid duplicate questions or options.
- Return output strictly as a valid JSON array — no markdown, comments, or extra text.

Example:
[[
  {{
    "id": 1,
    "question": "What is the capital of France?",
    "options": ["Paris","London","Berlin","Madrid"],
    "correctOptionIndex": 1,//correct answer index
    "hint": "It's also called the City of Lights."
  }}
]]
`,
  });

  const chain = RunnableSequence.from([
    quizPrompt,
    model, 
    parser,
  ]);

  try {
    const result = await chain.invoke({ usertopic: customtopic });
    if (!Array.isArray(result) || result.length !== 10) {
      return res.status(400).json({ error: "Invalid quiz data generated." });
    }
    res.status(200).send(result);
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: "Failed to generate quiz questions." });
  }
});

QRoute.post("/ai/getscore", async (req, res) => {
  try {
    const { QAset } = req.body;
    if (!QAset || !Array.isArray(QAset)) {
      return res.status(400).json({ message: "Error! fields are empty or invalid format." });
    }

    let totalmarks = 0;
    let wrongQA = [];
    let notAnsweredQA = [];

    // Loop through all client-side question data
    for (let obj of QAset) {
      const { correctOptionIndex, answer, notanswered } = obj;

      if (notanswered === true || answer === null || answer === undefined) {
        notAnsweredQA.push(obj);
        continue;
      }
      if (answer === correctOptionIndex) {
        totalmarks += 1;
      } 
      else {
        obj["correctoption"] = correctOptionIndex; // include correct option for clarity
        wrongQA.push(obj);
      }
    }

    res.status(200).json({
      totalscore: totalmarks,
      wronganswers: wrongQA,
      notansweredQA: notAnsweredQA,
    });

  } catch (error) {
    console.error("Error in /bydefault/getscore:", error);
    res.status(500).json({ message: "Internal server error while calculating score" });
  }
});



export default QRoute;
