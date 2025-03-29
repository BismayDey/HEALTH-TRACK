'use client';

import { Bot, Brain, Send } from 'lucide-react';
import { useState } from 'react';

export default function AiHealth() {
  const [messages, setMessages] = useState<
    { role: 'user' | 'bot'; text: string }[]
  >([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', text: input }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply }]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false); // Hide "AI is typing..."
    }
  };

  return (
    <div className='w-full h-screen grid grid-rows-[70px_auto]'>
      <nav className='shadow-lg flex flex-row items-center px-40 gap-3 relative'>
        <div className='bg-blue-500 p-2 rounded-2xl'>
          <Brain color='white' size={35} />
        </div>
        <div className='flex flex-col'>
          <div className='text-blue-500 font-bold text-2xl'>
            HealthAI Assistant
          </div>
          <div className='text-blue-400 text-sm'>
            Your 24/7 Health Companion
          </div>
        </div>
      </nav>

      <div className='flex flex-row items-center justify-center bg-blue-50'>
        <div className='max-w-[1000px] w-[90%] max-h-[600px] h-[90%] bg-white shadow-lg rounded-3xl flex flex-col overflow-hidden'>
          <div className='bg-blue-400 py-3 items-center flex flex-row px-10 gap-5'>
            <div className='bg-blue-300 p-2 rounded-2xl'>
              <Bot size={30} color='white' />
            </div>
            <div className='flex flex-col'>
              <div className='text-lg font-bold text-white'>
                AI Health Assistant
              </div>
              <div className='flex flex-row items-center gap-2'>
                <span className='flex h-2.5 w-2.5 rounded-full bg-red-400 animate-pulse'></span>
                <div className='flex flex-row text-white items-center'>
                  Online
                  <div className='mx-2 h-1 w-1 bg-white rounded-sm'></div>
                  Ready to help
                </div>
              </div>
            </div>
          </div>

          <div
            className='flex-1 overflow-y-scroll p-6 space-y-4'
            style={{ scrollBehavior: 'smooth' }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl max-w-xs ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white self-end ml-auto'
                    : 'bg-gray-200 text-gray-900 self-start mr-auto'
                }`}>
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className='flex items-center space-x-2 self-start bg-gray-200 text-gray-900 px-4 py-2 rounded-xl animate-pulse'>
                <span className='w-2 h-2 bg-gray-600 rounded-full animate-bounce'></span>
                <span className='w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100'></span>
                <span className='w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200'></span>
                <span className='text-sm'>AI is typing...</span>
              </div>
            )}
          </div>

          <form
            onSubmit={sendMessage}
            className='border-t border-gray-100 p-4 bg-white/50 backdrop-blur-sm'>
            <div className='flex items-center space-x-4 max-w-4xl mx-auto'>
              <input
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Type your health concern...'
                className='flex-1 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:border-blue-200 focus:ring-2 focus:ring-blue-200/20 bg-white/80 placeholder-gray-400 transition-all duration-200 outline-none'
              />
              <button
                type='submit'
                className='bg-gradient-to-r from-blue-300 to-blue-400 text-white rounded-xl p-3 hover:shadow-lg hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2'>
                <Send className='h-5 w-5' />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
