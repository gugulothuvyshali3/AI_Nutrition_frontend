import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      text: "👋 Hi there! I'm your **NutriSmart AI Assistant**.\n\nHave questions about **hostel meals, budget diets, or how to use this app**? Ask me anything below or pick a quick topic!",
      suggestions: [
        'How does this app work?',
        'High protein under ₹100',
        'Best vegetarian hostel meals',
        'Late-night study snacks',
        'How are calories & BMI calculated?',
      ],
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(query);
      const aiMsg = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: res.reply || "I'm sorry, I couldn't process that. Please ask about app features or student nutrition!",
        suggestions: res.suggestions || [],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        id: 'err-' + Date.now(),
        sender: 'ai',
        text: "⚠️ Couldn't connect to server right now. But here's a quick tip: Head to the **Student Details** tab to set your budget and get personalized meal plans!",
        suggestions: ['How does this app work?', 'High protein under ₹100'],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'init-1',
        sender: 'ai',
        text: "Chat cleared! How can I help you today?",
        suggestions: [
          'How does this app work?',
          'High protein under ₹100',
          'Best vegetarian hostel meals',
        ],
        timestamp: new Date(),
      },
    ]);
  };

  // Helper to render markdown bold and list items
  const formatText = (content) => {
    return content.split('\n').map((line, idx) => {
      // Bold formatting
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');

      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div
            key={idx}
            className="chat-list-item"
            dangerouslySetInnerHTML={{ __html: formattedLine }}
          />
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="chat-spacer" />;
      }
      return (
        <p
          key={idx}
          className="chat-paragraph"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });
  };

  return (
    <div className="chat-bot-wrapper">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          className="chat-floating-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Nutrition Assistant"
        >
          <span className="chat-btn-pulse"></span>
          <span className="chat-btn-icon">🤖</span>
          <span className="chat-btn-label">Ask NutriSmart AI</span>
        </button>
      )}

      {/* Chat Drawer Window */}
      {isOpen && (
        <div className="chat-window" role="dialog" aria-label="AI Nutrition Assistant">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar-wrapper">
                <span className="chat-avatar">🤖</span>
                <span className="chat-status-dot" title="Online"></span>
              </div>
              <div>
                <h3 className="chat-title">NutriSmart AI Assistant</h3>
                <p className="chat-subtitle">Student Diet & App Guide</p>
              </div>
            </div>
            <div className="chat-header-actions">
              <button
                className="chat-action-btn"
                onClick={handleClear}
                title="Clear conversation"
              >
                🗑️
              </button>
              <button
                className="chat-action-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="chat-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message-row ${msg.sender === 'user' ? 'user-row' : 'ai-row'}`}
              >
                {msg.sender === 'ai' && <div className="chat-msg-avatar">🤖</div>}
                <div className="chat-message-bubble">
                  <div className="chat-text-content">{formatText(msg.text)}</div>

                  {/* Quick Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="chat-suggestions-group">
                      <span className="chat-suggestions-title">Quick Questions:</span>
                      <div className="chat-chips-container">
                        {msg.suggestions.map((sug, i) => (
                          <button
                            key={i}
                            className="chat-chip"
                            onClick={() => handleSendMessage(sug)}
                            disabled={loading}
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className="chat-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-message-row ai-row">
                <div className="chat-msg-avatar">🤖</div>
                <div className="chat-message-bubble typing-bubble">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-footer">
            <div className="chat-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about app features, high protein, budget..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button
                className="chat-send-btn"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || loading}
                title="Send message"
              >
                ➤
              </button>
            </div>
            <div className="chat-disclaimer">
              Powered by NutriSmart AI • Tailored for Indian Hostel Students
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
