//import './App.css'
import MathEquationSolverChat from "./components/MathEquationSolverChat";


function App() {
  return (
    <div className="App">
      <MathEquationSolverChat />
    </div>
  );
}

export default App;

// import { useState } from "react";

// interface Message {
//     text: string;
//     sender: "user" | "bot";
// }

// function App() {
//     const [input, setInput] = useState("");
//     const [messages, setMessages] = useState<Message[]>([]);

//     const sendMessage = async () => {
//         if (!input.trim()) return; // Ignore empty messages

//         const userMessage: Message = { text: input, sender: "user" };
//         setMessages((prev) => [...prev, userMessage]);

//         try {
//             const res = await fetch("http://127.0.0.1:8000/api/submit", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ expression: input }),
//             });

//             const data = await res.json();
//             const botMessage: Message = { text: `Server: ${data.expression}`, sender: "bot" };
//             setMessages((prev) => [...prev, botMessage]);
//         } catch (error) {
//             console.error("Error:", error);
//             setMessages((prev) => [
//                 ...prev,
//                 { text: "Error: Could not reach the server.", sender: "bot" },
//             ]);
//         }

//         setInput(""); // Clear input field
//     };

//     return (
//         <div className="flex flex-col h-screen bg-gray-100">
//             <div className="flex-1 overflow-auto p-4">
//                 {messages.map((msg, index) => (
//                     <div
//                         key={index}
//                         className={`p-2 my-1 max-w-xs rounded-lg ${
//                             msg.sender === "user"
//                                 ? "bg-blue-500 text-white ml-auto"
//                                 : "bg-gray-300 text-black"
//                         }`}
//                     >
//                         {msg.text}
//                     </div>
//                 ))}
//             </div>

//             <div className="flex items-center p-4 bg-white border-t">
//                 <input
//                     type="text"
//                     className="flex-1 p-2 border rounded-lg"
//                     placeholder="Type a message..."
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                 />
//                 <button
//                     onClick={sendMessage}
//                     className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default App;

