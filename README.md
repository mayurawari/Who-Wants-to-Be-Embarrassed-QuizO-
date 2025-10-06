#                    QuizO – AI‑Powered Quizzes                 #

### Description:
QUIZO is a Topic aware fast and interactive quiz application for testing knowledge quickly.  
It delivers a smooth user experience with responsive design and real-time feedback.

- "Test your brain, embrace the embarrassment! QuizO turns every guess into entertainment."

----------------------------------------------
# Initialization Process:

## 1. Clone and enter the project
 git clone https://github.com/mayurawari/Who-Wants-to-Be-Embarrassed-QuizO-.git
 cd quizo

## 2. Install dependencies
npm install

## 3. Set up environment variables

Create a .env file at the project root:

PORT=5000
DB_URI=your_database_connection_string

## 4. Run the project
### Start backend server
npm run server

### Start frontend client
npm run dev

## 5. Access the app

Open your browser and navigate to the generated link in terminal. 
It will look like http://localhost:3000 <- Port can be different.

## Tech Stack:

- Frontend: React.js, Tailwind CSS, React Bits (Pre-Build Comps)

- AI Integration: Langchain, Gemini

- Model: Gemini-2.0-flash

- State Management: React Query

- Routing: React Router

- Backend: Node.js, Express.js

- Database: MongoDB (or any preferred DB)

- API Requests: Fetch API

## Features:

- Topic Aware AI Quiz Generation

- Smooth single-page quiz flow

- Overall timer for entire quiz

- Track and submit answers efficiently

- Responsive UI for mobile and desktop

- Real-time results and feedback

## Main Focus:

- Deliver a clean, distraction-free quiz experience

- Ensure fast loading and responsive design

- Maintain efficient data fetching and caching with React Query

## Design Choices:

- Overall timer instead of per-question timer

- Minimal UI to keep focus on quizzes

- Mobile-first responsive design

- Option selection and results tracking handled locally before backend submission

## ScreenShots:
<p align="center">
  <img src="FrontEnd/src/assets/ss/Screenshot (32).png" alt="Topic" width="360" />
  <img src="FrontEnd/src/assets/ss/Screenshot (31).png" alt="RuleBook" width="360" />
  <img src="FrontEnd/src/assets/ss/Screenshot (33).png" alt="Welcome" width="360" />
  <img src="FrontEnd/src/assets/ss/Screenshot (35).png" alt="Quiz" width="360" />
</p>

## Deployed Links:
- 🔗 **Live Quiz:** [Click here to try](https://who-wants-to-be-embarrassed-quiz-o-two.vercel.app/)  
📹 **Explanatory Video:** [Watch Demo](https://drive.google.com/file/d/1yHzuGrmkWLZ5W1uAFTR-sfueMoDXOyCO/view?usp=sharing)  

