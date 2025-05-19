# Triage Flow: AI-Powered Medical Triage System Frontend
A modern web application for AI-powered medical triage assessments. This frontend application combines multimodal inputs (text + images) with advanced AI agents to provide accurate and explainable triage recommendations.

## Features

- Multimodal input processing for symptoms and images
- Gemini ADK-powered AI agents for intelligent analysis
- Voice assistant for natural interaction
- Video consultation capabilities
- Real-time assessment feedback
- Responsive design for all devices

## Tech Stack

- **Framework**: Next.js 15 
- **Styling**: Tailwind CSS + Shadcn UI
- **Language**: TypeScript
- **Database**: Supabase
- **AI/ML**: Google Gemini ADK, OpenAI, ResNet

## Getting Started

### Prerequisites

- Node.js 18.x or later
- Supabase account and project
- Heygen account and API key
- Resend account and API key
- Google Gemini API key
- OpenAI API key
- ResNet model weights

### Setup

1. Clone the repository:
```bash
git clone triage-flow
cd triage-flow/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the root directory by copying the content of `env.example`:
   ```bash
   cp env.example .env
   ```
   - Fill in the values for the environment variables in the `.env` file.

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```
