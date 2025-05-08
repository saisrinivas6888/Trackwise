'use client'
import React, { useState, useRef, useEffect } from 'react';

function Upgrade() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Gemini API constants
  const GEMINI_API_KEY = "AIzaSyC_Fvkk6qJSVMpNtm1fDKi-EbiFKXhc6Ls";
  const GEMINI_MODEL = "gemini-2.0-flash";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Function to format markdown-like content
  const formatResponse = (text) => {
    // Process text to convert markdown-like syntax to HTML with proper styling
    let formattedText = text;
    
    // Format headings (## Heading -> <h2>Heading</h2>)
    formattedText = formattedText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Format lists
    formattedText = formattedText.replace(/^\s*\*\s+(.+)$/gm, '<li>$1</li>');
    formattedText = formattedText.replace(/(<li>.*<\/li>\n)+/g, '<ul>$&</ul>');
    
    // Format paragraphs
    formattedText = formattedText.replace(/^([^<\n][^\n]+)$/gm, '<p>$1</p>');
    
    return formattedText;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare request data for Gemini API
      const requestData = {
        contents: [
          {
            parts: [{ text: input }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      };

      // Make the API request
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      // Parse the response JSON
      const data = await response.json();
      
      // Extract the text from the response
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
      
      // Format the response text
      const formattedText = formatResponse(text);

      // Add bot message to chat with formatted content
      setMessages(prev => [...prev, { role: 'assistant', content: formattedText, isFormatted: true }]);
    } catch (error) {
      console.error("Error communicating with Gemini API:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, there was an error processing your request. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b">
        <h1 className="text-2xl font-semibold text-gray-800">Finance Chatbot</h1>
        <p className="text-base text-gray-500">Ask me anything and I'll replay with financial advice</p>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg">No messages yet</p>
              <p className="text-base">Start a conversation by sending a message</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-3/4 rounded-lg p-4 ${
                  message.role === 'user' 
                    ? 'bg-blue-100 text-gray-800 text-lg' 
                    : 'bg-white border border-gray-200 text-gray-800 text-lg'
                }`}
                style={{ maxWidth: '80%' }}
              >
                {message.isFormatted ? (
                  <div 
                    className="formatted-content" 
                    dangerouslySetInnerHTML={{ __html: message.content }}
                    style={{ fontSize: '16px', lineHeight: '1.6' }}
                  />
                ) : (
                  <p className="whitespace-pre-wrap" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                    {message.content}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="bg-white border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="flex-1 border border-gray-300 rounded-full px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`bg-blue-500 text-white rounded-full px-8 py-3 text-base font-medium ${
              isLoading || !input.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            Send
          </button>
        </div>
      </form>

      {/* Additional CSS for formatted content */}
      <style jsx global>{`
        .formatted-content h1, .formatted-content strong {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #1a202c;
        }
        .formatted-content h2 {
          font-size: 1.3rem;
          font-weight: bold;
          margin-top: 0.8rem;
          margin-bottom: 0.5rem;
          color: #2d3748;
        }
        .formatted-content p {
          margin-bottom: 0.8rem;
        }
        .formatted-content ul {
          margin-left: 1rem;
          margin-bottom: 1rem;
          list-style-type: disc;
          padding-left: 1rem;
        }
        .formatted-content li {
          margin-bottom: 0.5rem;
        }
        .formatted-content strong {
          display: block;
          font-size: 1.2rem;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}

export default Upgrade;