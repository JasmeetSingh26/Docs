"use client";

import { useState } from "react";

interface DrawerProps {
  description: string | null;
}

const DrawerAI = ({ description }: DrawerProps) => {
  const [open, setOpen] = useState(false);
  const [wizardSuggestion, setWizardSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleWizardSuggestion = async () => {
    if (!description) {
      setWizardSuggestion("Please provide a valid description!");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: description }),
      });

      const data = await response.json();

      if (response.ok) {
        setWizardSuggestion(data.output);
      }
    } catch (error) {
      console.error("Error generating content:", error);
      setWizardSuggestion("Oops! Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        className="border px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        onClick={() => {
          setOpen(true);
          handleWizardSuggestion();
        }}
      >
        Ask Your Wizard 🧙‍♂;
      </button>

      {open && (
        <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg rounded-l-lg flex flex-col">
          <h2 className="text-lg font-bold mb-4 px-4 pt-4">
            🧙‍♂️ Wizard&apos;s Advice
          </h2>
          {isLoading ? (
            <p className="text-center flex-grow flex items-center justify-center">
              Loading...
            </p>
          ) : (
            <div className="flex-grow px-4 pb-4 overflow-y-auto">
              <p className="whitespace-pre-wrap">
                {wizardSuggestion || "Your suggestion will appear here!"}
              </p>
            </div>
          )}
          <button
            className="m-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default DrawerAI;
