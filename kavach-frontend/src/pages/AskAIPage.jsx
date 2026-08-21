import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { fetchJSON } from '../utils/api';
import TypingMessage from '../components/TypingMessage';
import { renderMessage } from '../utils/renderMessage';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Hello! I'm Kavach AI — your disaster preparedness assistant. Ask me anything about emergency procedures, safety tips, disaster response, or real-time alerts.",
  done: true,
};

const SUGGESTIONS = [
  "What should I do during an earthquake?",
  "How to prepare a disaster kit?",
  "Emergency numbers in India",
  "What to do during a flood?",
];

function MessageBubble({ msg, isLatest }) {
  const [typingDone, setTypingDone] = useState(msg.done || false);
  const isUser = msg.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-brandDark flex items-center justify-center shrink-0 mt-0.5">
          <Bot size={16} className="text-safetyLime" />
        </div>
      )}

      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-brandDark text-white rounded-br-md'
            : 'bg-white text-slate-700 border border-slate-200 rounded-bl-md shadow-sm'
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{msg.content}</p>
        ) : (
          <div className="text-sm leading-relaxed space-y-2">
            {isLatest && !typingDone ? (
              <TypingMessage
                text={msg.content}
                onComplete={() => setTypingDone(true)}
              />
            ) : (
              renderMessage(msg.content)
            )}
            {isLatest && !typingDone && (
              <span className="inline-block w-1.5 h-4 bg-brandDark/60 animate-pulse ml-0.5 rounded-sm" />
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
          <User size={16} className="text-slate-600" />
        </div>
      )}
    </motion.div>
  );
}

export default function AskAIPage() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = useCallback(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setShowScrollBtn(!atBottom);
  }, []);

  const handleSend = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    const userMessage = { role: 'user', content: trimmed, done: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const history = messages.slice(1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const data = await fetchJSON('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: trimmed,
          history: history.slice(-10),
        }),
      });

      const aiMessage = { role: 'assistant', content: data.reply, done: false };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(err.message || 'Failed to get response');
      setMessages((prev) => [
        prev,
        {
          role: 'assistant',
          content: "Sorry, I couldn't process your request right now. Please try again in a moment.",
          done: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col h-[calc(100vh-10rem)]">
        <div className="mb-4">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1 flex items-center gap-2">
            <Sparkles size={22} className="text-safetyLime" />
            Ask AI
          </h1>
          <p className="text-sm text-slate-500">Get instant answers about disaster preparedness</p>
        </div>

        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto no-scrollbar glass rounded-2xl p-4 mb-4 relative"
        >
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  msg={msg}
                  isLatest={i === messages.length - 1 && msg.role === 'assistant'}
                />
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-brandDark flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-safetyLime" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 rounded-full bg-slate-400"
                    />
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                      className="w-2 h-2 rounded-full bg-slate-400"
                    />
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                      className="w-2 h-2 rounded-full bg-slate-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xs text-center py-2"
              >
                {error}
              </motion.div>
            )}
          </div>

          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <p className="text-xs text-slate-400 font-medium mb-2 px-1">Suggested questions</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSend(s)}
                    className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />

          <AnimatePresence>
            {showScrollBtn && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => scrollToBottom()}
                className="sticky bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
              >
                <ChevronDown size={16} className="text-slate-500" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="glass rounded-full px-4 py-2 flex items-center gap-2 border border-white/50 shadow-sm">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about disaster safety..."
            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
            disabled={loading}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-full bg-brandDark flex items-center justify-center disabled:opacity-40 transition-opacity"
          >
            <Send size={16} className="text-white" />
          </motion.button>
        </div>
      </div>
    </PageWrapper>
  );
}
