### 1. Track(s) Chosen:  
*AI in Healthcare*

---

### 2. Problem Statement:  
*Smart Triage Assistant with Multimodal Input*  
Create an assistant that combines text input (symptoms described by the patient) and images (e.g., rash or wound photos) to provide triage recommendations.  
Feasibility: Use public datasets such as DermNet.

---

### 3. Introduction:  
We are building a *Smart Triage Assistant* that leverages both *images* (e.g., skin injuries, rashes, wounds) and *textual symptom input* to classify medical conditions and guide patients toward appropriate next steps.  
Our system is powered by a combination of deep learning and *agentic retrieval* via the Gemini ADK to provide clear, explainable, and scalable triage recommendations. It is designed to be fast, deployable, and practical for frontline medical triage or rural healthcare applications.

---

### 4. Proposed Solution:  
We propose a modular pipeline that includes:  
1. *Image classification* to detect the type of skin injury.  
2. *RAG-based information retrieval* from a structured PDF containing medical definitions.  
3. *Gemini ADK Agent 1* to fetch and summarize the injury description.  
4. *Gemini ADK Agent 2* to assign a severity score based on the retrieved description.  
5. A final *triage recommendation* based on the severity level, including immediate steps that can be taken.

This solution ensures explainability and adaptability and provides better trustworthiness than black-box systems.

![image](https://assets.devfolio.co/content/0fa04522850e480591d09a1ab869f5d5/b5c0b344-9a16-4b43-a7bf-af3353dc5363.jpeg)

---

### 5. Solution Description:

#### Step 1: Image Classification
- *Input*: Patient-uploaded image (wound, rash, lesion, etc.)
- *Output*: Predicted injury label (e.g., "Laceration", "Acne", "Bruise")
- *Model*: Custom-trained CNN via transfer learning (e.g., ResNet18), fine-tuned on the DermNet dataset.

#### Step 2: PDF-Based Knowledge Base
- A structured *PDF document* is created containing classes and descriptions in the following example format:
  ```
  Classname: Laceration Wound
  Description: Laceration wound is caused by deep cuts in the skin, often needing stitches and care to prevent infection.
  ```
- This serves as the domain-specific knowledge base.

#### Step 3: Agent 1 — Medical Description Retrieval
- *Input*: Predicted injury label from the classifier.
- *Action*: Queries the PDF via Gemini ADK and returns a *brief, readable summary* of the condition.
- *Output*: A simplified explanation of the injury type.

#### Step 4: Agent 2 — Severity Scoring
- *Input*: Description from Agent 1.
- *Action*: Scores the injury severity on a scale of 1–5:
  - 1–2: Mild (home care)
  - 3: Moderate (visit doctor)
  - 4–5: Severe/Critical (urgent care needed)
- *Output*: Severity Score + Reason + Top 3 Possible Diagnoses (with the confidence scores for each)

#### Step 5: Final Triage Output
- Combines:
  - Injury Type  
  - Description  
  - Severity Score  
  - Triage Recommendation (e.g., "Monitor at home", "See doctor", "Visit ER")

---

### 6. Tech Stack:

### Frontend Architecture

- **Framework**: Next.js + React  
  Used for server-side rendering and building modern UI components.

- **UI Framework**: Tailwind CSS  
  Provides responsive and customizable styling.

- **Type Safety**: TypeScript  
  Enables enhanced development experience and static type checking.

- **State Management**: React Context or Redux  
  Manages centralized application state.

- **Form Handling**: React Hook Form  
  Efficient solution for form validation and management.

- **Image Processing**: Browser Image API  
  Handles client-side image preprocessing tasks.

- **UI Components**: Shadcn UI  
  A modern, accessible component library for faster UI development.

- **API Integration**: Axios or TanStack Query  
  Handles efficient data fetching and caching.

---

### Frontend Features

- Intuitive symptom description form  
- Secure image upload and viewing  
- Real-time image preview and validation  
- Interactive triage results display  
- Responsive medical dashboard  
- Dark/Light theme support  
- Accessibility compliance  

---

### Backend Infrastructure

- **Server Framework**: FastAPI  
  A high-performance asynchronous API server.

- **ML Framework**: PyTorch with ResNet  
  Used for implementing deep learning models.

- **Database**: Supabase  
  Stores patient data and uploaded images.

- **Agent System**: Gemini ADK  
  Agent Development Kit (ADK) is a flexible and modular framework for developing and deploying AI agents.

- **Image Processing**: OpenCV or Pillow  
  Performs server-side image preprocessing.

---

### Deployment Stack

- **Vercel**: Frontend deployment and edge functions  
- **Vertex AI**: ML model serving  
- **Render**: Backend API hosting  

---

### 7. Application Flow and Routes:

This section outlines the primary user flows and the corresponding frontend routes for the Smart Triage Assistant.

#### Core User Flows:

1.  **New Triage Assessment:**
    *   The user navigates to a dedicated page to start a new assessment.
    *   They input their symptoms as text and upload a relevant image (e.g., a photo of a skin condition).
    *   Upon submission, the data is sent to the backend for processing (image analysis, symptom interpretation, AI-driven diagnosis and recommendation).
    *   The user is then redirected to a results page displaying the outcome of their assessment.

2.  **Viewing Assessment Results:**
    *   Users can view detailed results for a specific assessment, identified by a unique ID.
    *   This page will show the provided inputs, the AI's analysis (injury type, description, severity), and the final triage recommendation.

3.  **Reviewing Past Assessments (Triage Log):**
    *   Users can access a log or history of their previous assessments.
    *   This provides a summarized view of each past assessment, with options to navigate to the detailed results page for any specific entry.

4.  **Standard Navigation & Account Management:**
    *   Users can navigate to a home/landing page.
    *   If user accounts are implemented, users can view their profile and manage application settings.
    *   A contact page will be available.

#### Frontend Routes:

The following routes will be implemented in the Next.js frontend:

1.  **Home Page**
    *   **Route:** `/`
    *   **Description:** The main landing page of the application. It should provide an overview of the Smart Triage Assistant, explain its purpose and benefits, and feature a prominent call-to-action to begin a new assessment (e.g., a button linking to `/assessment/new`).

2.  **New Triage Assessment Page**
    *   **Route:** `/assessment/new`
    *   **Description:** This page will host the form for users to initiate a new triage assessment.
    *   **Components:**
        *   Text input field for describing symptoms.
        *   Image uploader for submitting visual evidence.
        *   Submission button.
    *   **Process:**
        1.  User fills out the form and uploads an image.
        2.  On submission, the frontend will make an API call (e.g., `POST /api/triage/new`) to the backend with the symptom text and image data.
        3.  The backend processes the request, generates an `assessmentId`, and returns it (or the full assessment data).
        4.  The frontend then redirects the user to the dynamic results page: `/assessment/[assessmentId]`.

3.  **View Triage Assessment Result Page (Dynamic)**
    *   **Route:** `/assessment/[assessmentId]`
    *   **Description:** A dynamic route that displays the detailed results for a specific triage assessment identified by `[assessmentId]`. The content will be similar to what's currently on the `/dashboard` page but will be specific to the given assessment.
    *   **Components:**
        *   Patient Image Viewer (displaying the uploaded image).
        *   Patient Details section (if applicable, or symptom summary).
        *   Triage Assessment Details (identified concern, AI-generated description, severity score, reason, top possible conditions, triage recommendation).
        *   Print and Download report buttons.
    *   **Process:**
        1.  The page loads, extracting `assessmentId` from the URL.
        2.  An API call (e.g., `GET /api/triage/[assessmentId]`) is made to fetch the specific assessment data.
        3.  The fetched data populates the various components on the page.

4.  **Triage Log / History Page**
    *   **Route:** `/assessment` 
    *   **Description:** Displays a list of all past triage assessments for the user (if authentication is implemented) or session.
    *   **Components:**
        *   A table or list displaying a summary of each past assessment (e.g., date, primary concern/injury type, severity level).
        *   Each item in the list will link to its detailed result page (`/assessment/[assessmentId]`).
    *   **Process:**
        1.  The page loads and makes an API call (e.g., `GET /api/triage`) to fetch the list of past assessments.
        2.  The data is rendered into a list format.

5.  **Dashboard / Main Overview Page**
    *   **Route:** `/dashboard`
    *   **Description:** This page can serve as a central hub after login or for returning users.
    *   **Potential Content:**
        *   A brief welcome message.
        *   Quick link/button to start a "New Assessment" (`/assessment/new`).
        *   A summary or list of the most recent assessments (linking to `/assessment/[assessmentId]`).
        *   *Note:* The current `app/(default)/dashboard/page.tsx` fetches a single, non-specific triage. This route should be re-evaluated. It could either become a true summary dashboard or be deprecated if `/assessment/[assessmentId]` becomes the primary way to view specific results. For now, let's assume it's an overview page.

6.  **User Profile Page**
    *   **Route:** `/profile`
    *   **Description:** (If user authentication is implemented) Allows users to view and manage their profile information.

7.  **Settings Page**
    *   **Route:** `/settings`
    *   **Description:** (If user authentication is implemented) Allows users to manage application-related settings, such as preferences or notification settings.

8.  **Contact Page**
    *   **Route:** `/contact`
    *   **Description:** A static page providing contact information or a form to send inquiries.

This structure provides a clear path for users and a logical organization for the application's features.

---
