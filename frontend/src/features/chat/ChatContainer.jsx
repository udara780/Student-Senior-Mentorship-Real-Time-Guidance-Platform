import React, { useState, useEffect, useContext, useRef } from 'react';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Send, User } from 'lucide-react';

export default function ChatContainer() {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // We bind to the proxy root which Vite translates to backend
    const newSocket = io(window.location.origin, {
      path: '/socket.io',
      auth: { token: localStorage.getItem('token') }
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (socket && activeChat) {
      socket.emit('joinChat', activeChat._id);
      fetchMessages(activeChat._id);

      socket.on('receiveMessage', (message) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [socket, activeChat]);

  const fetchChats = async () => {
    try {
      const { data } = await api.get('/chats');
      setChats(data);
    } catch (error) {
      console.error('Failed to fetch chats', error);
      toast.error('Failed to fetch conversations');
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const { data } = await api.get(`/chats/${chatId}/messages`);
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to fetch messages', error);
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !socket) return;

    const messageData = {
      chatId: activeChat._id,
      content: newMessage,
      sender: user._id
    };

    try {
      socket.emit('sendMessage', messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
      toast.error('Failed to send message');
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 animate-fade-in relative z-10">
      <Card className="w-1/3 flex flex-col p-4 shadow-xl border-white/50 h-full">
        <h2 className="text-xl font-bold text-slate-800 mb-4 px-2">Your Conversations</h2>
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {chats.length === 0 ? (
            <p className="text-slate-500 text-sm p-4 text-center mt-10 bg-slate-50 rounded-xl border border-slate-100">No active conversations found.</p>
          ) : (
            chats.map(chat => (
              <div 
                key={chat._id} 
                onClick={() => setActiveChat(chat)}
                className={`p-3.5 rounded-xl cursor-pointer border transition-all duration-200 ${activeChat?._id === chat._id ? 'bg-primary-50 border-primary-200 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'}`}
              >
                <div className="font-semibold text-slate-800 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3 shadow-inner">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="text-[15px]">{chat.student?.name || 'Student'}</div>
                    <div className="text-xs text-slate-500 font-medium">Mentorship chat</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="w-2/3 flex flex-col shadow-xl border-white/50 p-0 overflow-hidden bg-white/60 h-full">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-slate-100 bg-white/90 backdrop-blur-md shadow-sm z-10">
              <h3 className="font-bold text-lg text-slate-800 flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3 shadow-inner">
                  <User size={20} />
                </div>
                {activeChat.student?.name || 'Student'}
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, idx) => {
                const isMe = msg.sender === user._id || msg.sender?._id === user._id;
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                    <div className={`max-w-[75%] p-3.5 px-5 rounded-3xl ${isMe ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-br-sm shadow-lg shadow-primary-500/20' : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm shadow-md shadow-slate-200/50'}`}>
                      <p className="text-[15px] leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white/90 backdrop-blur-md border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-500 transition-all flex items-center">
                  <input 
                    placeholder="Type your message..." 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-slate-700 placeholder-slate-400"
                  />
                </div>
                <Button type="submit" className="px-5 shadow-lg shadow-primary-500/30 rounded-xl" disabled={!newMessage.trim()}>
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Send size={32} className="text-slate-300 ml-1" />
            </div>
            <p className="font-medium text-lg text-slate-500">Select a conversation</p>
            <p className="text-sm">Choose a chat from the sidebar to start messaging.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
