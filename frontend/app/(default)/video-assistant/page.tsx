"use client";

import InteractiveAvatar from "@/components/heygen/InteractiveAvatar";
import { Badge } from "@/components/ui/badge";

export default function App() {
  return (
    <div className="flex flex-col p-4 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg">
        <div className="container p-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold tracking-tight">AI Healthcare Assistant</h1>
            <Badge variant="secondary" className="bg-white/20 text-white">Beta</Badge>
          </div>
          <p className="text-blue-50 text-sm max-w-[600px] leading-relaxed">
            Your intelligent healthcare companion powered by advanced AI, providing personalized medical guidance through natural conversation.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6">
        <div className="space-y-6">
          {/* Avatar Interface */}
          {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-100 dark:border-gray-700"> */}
            <InteractiveAvatar />
          {/* </div> */}

          {/* Disclaimer */}
          <div className="p-3 bg-blue-50 dark:bg-gray-800 rounded-md text-xs text-blue-700 dark:text-blue-200 border border-blue-100 dark:border-gray-700">
            <p>
              <strong>Medical Disclaimer:</strong> This AI assistant provides general information and support. 
              Always consult healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}