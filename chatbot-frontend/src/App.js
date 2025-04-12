import React, { useState, useRef, useEffect } from 'react';

function Chatbot() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);
  const backendUrl = 'http://localhost:8000/chat'; // Backend URL

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const userMessage = { text: inputText, sender: 'user' };
      setMessages((prev) => [...prev, userMessage]);
      setInputText('');

      try {
        const response = await fetch(`${backendUrl}/${encodeURIComponent(inputText)}`, {
          method: 'GET',
        });

        if (!response.ok) {
          console.error('Error from backend:', response.status);
          setMessages((prev) => [
            ...prev,
            { text: 'Oops! Something went wrong on the backend.', sender: 'bot' },
          ]);
          return;
        }

        const botReply = await response.text();
        setMessages((prev) => [...prev, { text: botReply, sender: 'bot' }]);
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages((prev) => [
          ...prev,
          { text: 'Failed to send message.', sender: 'bot' },
        ]);
      }
    }
  };

  return (
    <div style={centeredContainer}>
      <div style={chatWindow}>
        <h2 style={titleStyle}>💬 AI Chatbot <span style={modelBadge}>Powered by Mistral</span></h2>
        <div style={divider}></div>

        <div ref={chatContainerRef} style={chatHistory}>
          {messages.map((message, index) => (
            <div key={index} style={message.sender === 'user' ? userMessage : botMessage}>
              {message.text}
            </div>
          ))}
        </div>

        <div style={inputArea}>
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type your message..."
            style={inputStyle}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button onClick={handleSendMessage} style={sendButton}>Send</button>
        </div>
      </div>
    </div>
  );
}

// Styles
const centeredContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f0f0f0',
};

const chatWindow = {
  backgroundColor: '#ffffff',
  width: '90%',
  maxWidth: '600px',
  height: '85vh',
  borderRadius: '12px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '10px',
  fontSize: '22px',
  fontWeight: '600',
  color: '#333',
};

const modelBadge = {
  display: 'inline-block',
  fontSize: '14px',
  marginLeft: '10px',
  padding: '2px 8px',
  backgroundColor: '#007BFF',
  color: 'white',
  borderRadius: '6px',
};

const divider = {
  height: '1px',
  backgroundColor: '#ddd',
  margin: '10px 0 15px',
};

const chatHistory = {
  flexGrow: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: '10px',
};

const userMessage = {
  backgroundColor: '#DCF8C6',
  color: '#1C1C1C',
  padding: '10px 15px',
  borderRadius: '10px',
  alignSelf: 'flex-end',
  marginBottom: '10px',
  maxWidth: '70%',
  wordBreak: 'break-word',
};

const botMessage = {
  backgroundColor: '#E0E0E0',
  color: '#1C1C1C',
  padding: '10px 15px',
  borderRadius: '10px',
  alignSelf: 'flex-start',
  marginBottom: '10px',
  maxWidth: '70%',
  wordBreak: 'break-word',
};

const inputArea = {
  display: 'flex',
  marginTop: '15px',
};

const inputStyle = {
  flexGrow: 1,
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  marginRight: '10px',
  fontSize: '16px',
};

const sendButton = {
  backgroundColor: '#007BFF',
  color: 'white',
  padding: '12px 20px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
};

export default Chatbot;
