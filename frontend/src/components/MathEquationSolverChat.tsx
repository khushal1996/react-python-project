import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ChatMessage {
  sender: "user" | "bot";
  message?: string;
  collapsed?: boolean;
  answer?: string;
  details?: string;
}

const MathEquationSolverChat: React.FC = () => {
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents accidental form submissions
      handleSend();
    }
  };

  const handleSend = async () => {
    if (userInput.trim()) {
      setChat([...chat, { sender: "user", message: userInput }]);
      setUserInput("");
  
      try {
        const response = await fetch("http://127.0.0.1:8000/api/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userInput }), // Ensure this matches the backend's expected format
        });
  
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
  
        const data = await response.json();
  
        setChat((prev) => [
          ...prev,
          { sender: "bot", collapsed: true, answer: data.response, details: data.details },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const toggleCollapse = (index: number) => {
    setChat((prev) =>
      prev.map((message, i) =>
        i === index ? { ...message, collapsed: !message.collapsed } : message
      )
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
      <Card className="max-w-2xl w-full shadow-lg rounded-2xl">
        <CardContent className="p-6 flex flex-col h-[600px]">
          <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">
            Math Equation Solver
          </h2>

          <div className="flex-grow overflow-y-auto bg-gray-100 p-4 rounded-lg shadow-inner mb-4">
            {chat.map((message, index) => (
              <div key={index} className="mb-3">
                {message.sender === "user" ? (
                  <div className="bg-blue-100 text-blue-900 px-4 py-2 rounded-lg shadow-md mb-2">
                    {message.message}
                  </div>
                ) : (
                  <div>
                    <div
                      className="flex items-center cursor-pointer bg-gray-200 px-4 py-2 rounded-lg shadow-md hover:bg-gray-300"
                      onClick={() => toggleCollapse(index)}
                    >
                      {message.collapsed ? message.answer : "Detailed Response"}
                      <span className="ml-auto">
                        {message.collapsed ? <ChevronDown /> : <ChevronUp />}
                      </span>
                    </div>
                    {!message.collapsed && (
                      <div className="mt-2 bg-white text-gray-800 p-3 rounded-lg shadow-inner whitespace-pre-line">
                        {message.details}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Input
              placeholder="Type your math problem here..."
              className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              className="bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MathEquationSolverChat;
