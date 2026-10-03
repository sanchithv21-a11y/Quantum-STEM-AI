# 🧠 Quantum STEM AI

> An AI-powered STEM assistant designed to help students and engineers solve, understand, and explore Mathematics, Physics, and Engineering problems through natural conversation.
>
**🔗 Live App:**  
https://quantum-stem-ai-308424443632.asia-southeast1.run.app/

## 📖 About

Quantum STEM AI is an AI-powered assistant designed to help students and engineers solve problems, clear doubts, and understand complex STEM concepts.

It focuses on Mathematics, Physics, and core Engineering topics while providing step-by-step explanations, mathematical derivations, interactive simulations, data visualizations, and AI-assisted application scaffolding.

The project was initially prototyped using Google AI Studio and then customized, configured, and deployed as a full-stack web application using Google Cloud Run.

## ✨ Features

- 🎙️ **Conversational AI Assistant** — ask questions in natural language and receive guided, step-by-step explanations
- ➗ **Mathematics & Physics Problem Solving** — solve STEM problems with mathematical expressions rendered using KaTeX
- 🧪 **STEM Simulations** — visualize and explore STEM concepts interactively
- 📊 **Data Visualization** — create charts and graphs using Recharts
- 🛠️ **AI-Assisted App Generation** — scaffold simple applications based on natural-language prompts
- 🧠 **AI-Powered Reasoning** — uses the Google Gemini API to understand prompts and generate STEM-focused responses

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS |
| Animation | Motion |
| Math Rendering | KaTeX |
| Charts | Recharts |
| Backend | Node.js, Express |
| AI Engine | Google Gemini API (`@google/genai`) |
| Email | Nodemailer |
| Deployment | Google Cloud Run |
| Icons | Lucide React |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended) or [Bun](https://bun.sh/)
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### Installation

```bash
git clone https://github.com/sanchithv21-a11y/Quantum-STEM-AI.git
cd Quantum-STEM-AI
npm install
```

### Environment Setup

Create a `.env` file in the project folder and add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```
### Run Locally

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```text
Quantum-STEM-AI/
├── src/                # Frontend React application
├── server/             # Backend Express application
├── assets/             # Static assets
├── server.ts           # Server entry point
├── vite.config.ts      # Vite configuration
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```

## 🌐 Deployment

Quantum STEM AI is deployed on **Google Cloud Run**.

### 🔗 Live Application

https://quantum-stem-ai-308424443632.asia-southeast1.run.app/

Google Cloud Run provides the cloud environment used to deploy the full-stack application.

## 🧑‍💻 Development & Origin

Quantum STEM AI was initially prototyped using **Google AI Studio** and the Google Gemini application template:

https://github.com/google-gemini/aistudio-repository-template

The project was then customized and developed into a full-stack application, with additional configuration, functionality, and deployment work performed as part of the project.

This project represents my exploration of:

- Artificial Intelligence
- Generative AI
- STEM education
- AI-powered applications
- Full-stack development
- Interactive simulations
- Cloud deployment

## 🎯 Project Goals

The goal of Quantum STEM AI is to explore how AI can make STEM learning more:

- 🧠 Understandable
- 🔬 Interactive
- 📊 Visual
- 💬 Conversational
- 🚀 Accessible

Future improvements may include additional STEM tools, improved simulations, enhanced AI capabilities, and more advanced learning workflows.

## 👤 Author

### Sanchith V

**CSE Student | AI/ML Enthusiast | AI Project Builder**

Interested in:

- Artificial Intelligence & Machine Learning
- Generative AI
- Quantum Computing
- STEM Education
- Software Engineering

## 📄 License

No license has currently been granted for this project.

If you would like to use, modify, or redistribute the code, please contact the author first.  
