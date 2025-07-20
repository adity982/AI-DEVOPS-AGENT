"use client";

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- DEBUGGING MARKER ---
    // This message should appear in your browser's F12 console the moment you click the button.
    console.log("Form submission initiated..."); 
    
    setIsLoading(true);
    setResponse("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const result = await axios.post(`${apiUrl}/api/generate`, { prompt });
      
      console.log("Received response from backend:", result.data); // Log the raw response
      
      setResponse(result.data.response);
    } catch (error) {
      console.error("Error fetching data from backend:", error);
      setResponse("Error: Could not get a response from the agent.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">AI-Powered Cloud DevOps Agent</h1>
        <p className="text-lg text-gray-600 mt-2">
          Enter a request to generate cloud infrastructure advice or code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'What are the steps to create a secure S3 bucket?'"
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {isLoading ? 'Generating...' : 'Ask Agent'}
        </button>
      </form>

      {response && (
        <div className="mt-10 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Agent's Response:</h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
              {response}
            </pre>
          </div>
        </div>
      )}
    </main>
  );
}
