import React, { useState, useEffect, useContext, useRef } from 'react';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Send, User, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function ChatContainer() {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({}); // { [chatId]: number }
  const messagesEndRef = useRef(null);
  const activeChatRef = useRef(null); // Ref so socket handler always has latest value

  useEffect(() => {
    const newSocket = io(window.location.origin, {
      path: '/socket.io',
      auth: { token: sessionStorage.getItem('token') }
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

      const handleReceive = (message) => {
        const incomingChatId = message.chat?.toString() || message.chat;
        const currentChatId = activeChatRef.current?._id?.toString();

        if (incomingChatId === currentChatId) {
          // Active chat — show immediately
          setMessages((prev) => [...prev, message]);
          scrollToBottom();
        } else {
          // Different chat — increment unread dot
          setUnreadCounts((prev) => ({
            ...prev,
            [incomingChatId]: (prev[incomingChatId] || 0) + 1,
          }));
        }
      };

      socket.on('receiveMessage', handleReceive);
      return () => socket.off('receiveMessage', handleReceive);
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
    socket.emit('sendMessage', { chatId: activeChat._id, content: newMessage });
    setNewMessage('');
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Set active chat and clear its unread count
  const openChat = (chat) => {
    setActiveChat(chat);
    activeChatRef.current = chat;
    // Clear unread count for this chat
    setUnreadCounts((prev) => ({ ...prev, [chat._id]: 0 }));
  };

  // Determine the "other person" in the conversation (not the logged-in user)
  const getOtherPerson = (chat) => {
    if (!chat) return null;
    const iAmStudent = user._id === chat.student?._id;
    return iAmStudent ? chat.senior : chat.student;
  };

  // Check if a message was sent by the current user
  const isMyMessage = (msg) => {
    const senderId = msg.sender?._id || msg.sender;
    return senderId?.toString() === user._id?.toString();
  };

  const otherPerson = getOtherPerson(activeChat);
  const totalUnread = Object.values(unreadCounts).reduce((sum, n) => sum + n, 0);

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 animate-fade-in relative z-10">

      {/* Sidebar — Conversation List */}
      <Card className="w-1/3 flex flex-col p-4 shadow-xl border-white/50 dark:border-slate-700/50 h-full overflow-hidden">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-5 px-2 font-heading flex items-center gap-2">
          Conversations
          {totalUnread > 0 && (
            <span className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold">
              {totalUnread > 9 ? '9+' : totalUnread}
            </span>
          )}
        </h2>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {chats.length === 0 ? (
            <div className="text-center mt-16 px-4">
              <MessageSquare size={36} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No conversations yet.</p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Chats are created when a mentor request is accepted.</p>
            </div>
          ) : (
            chats.map(chat => {
              const other = getOtherPerson(chat);
              const isActive = activeChat?._id === chat._id;
              return (
                <div
                  key={chat._id}
                  onClick={() => openChat(chat)}
                  className={`p-3.5 rounded-xl cursor-pointer border transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 overflow-hidden border border-primary-200 dark:border-primary-800">
                        {other?.profilePhoto
                          ? <img src={`/${other.profilePhoto}`} alt={other?.name} className="w-full h-full object-cover" />
                          : <User size={20} className="text-primary-500 dark:text-primary-400" />
                        }
                      </div>
                      {/* Unread blue dot indicator */}
                      {unreadCounts[chat._id] > 0 && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-blue-500 border-2 border-white dark:border-slate-800 text-white text-[9px] font-bold px-0.5 shadow-sm">
                          {unreadCounts[chat._id] > 9 ? '9+' : unreadCounts[chat._id]}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`font-semibold text-[15px] truncate ${
                        unreadCounts[chat._id] > 0
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}>
                        {other?.name || 'Unknown'}
                      </p>
                      <p className={`text-xs font-medium ${
                        unreadCounts[chat._id] > 0
                          ? 'text-blue-500 dark:text-blue-400 font-semibold'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {unreadCounts[chat._id] > 0
                          ? `${unreadCounts[chat._id]} new message${unreadCounts[chat._id] > 1 ? 's' : ''}`
                          : 'Mentorship chat'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Main Chat Area */}
      <Card className="w-2/3 flex flex-col shadow-xl border-white/50 dark:border-slate-700/50 p-0 overflow-hidden h-full">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm z-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden border border-primary-200 dark:border-primary-800 flex-shrink-0">
                {otherPerson?.profilePhoto
                  ? <img src={`/${otherPerson.profilePhoto}`} alt={otherPerson?.name} className="w-full h-full object-cover" />
                  : <User size={20} className="text-primary-500 dark:text-primary-400" />
                }
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight font-heading">
                  {otherPerson?.name || 'Unknown'}
                </h3>
                <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  Active
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-900/30">
              {messages.length === 0 ? (
                <div className="text-center mt-20 text-slate-400 dark:text-slate-500">
                  <p className="font-medium text-sm">No messages yet. Say hello! 👋</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const mine = isMyMessage(msg);
                  const senderName = msg.sender?.name || (mine ? user.name : otherPerson?.name || 'Unknown');
                  const senderPhoto = msg.sender?.profilePhoto;

                  // Group consecutive messages from same sender
                  const prevMine = idx > 0 ? isMyMessage(messages[idx - 1]) : null;
                  const showName = prevMine === null || prevMine !== mine;

                  return (
                    <div key={msg._id || idx} className={`flex ${mine ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                      {/* Avatar for other person */}
                      {!mine && (
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0 overflow-hidden border border-primary-100 dark:border-primary-900 self-end mb-0.5">
                          {senderPhoto
                            ? <img src={`/${senderPhoto}`} alt={senderName} className="w-full h-full object-cover" />
                            : <User size={14} className="text-primary-400" />
                          }
                        </div>
                      )}

                      <div className={`flex flex-col ${mine ? 'items-end' : 'items-start'} max-w-[72%]`}>
                        {showName && (
                          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-1 px-1">
                            {mine ? 'You' : senderName}
                          </span>
                        )}
                        <div className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                          mine
                            ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-br-sm shadow-primary-500/25'
                            : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-sm'
                        }`}>
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                          {msg.createdAt ? format(new Date(msg.createdAt), 'h:mm a') : ''}
                        </span>
                      </div>

                      {/* Spacer for my messages (no avatar) */}
                      {mine && <div className="w-8 flex-shrink-0" />}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-700/60">
              <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
                <div className="flex-1 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary-300 dark:focus-within:ring-primary-700 focus-within:border-primary-400 transition-all flex items-center">
                  <input
                    placeholder="Type your message…"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e)}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className="px-5 shadow-lg shadow-primary-500/30 rounded-xl flex-shrink-0"
                  disabled={!newMessage.trim()}
                >
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <MessageSquare size={32} className="text-slate-300 dark:text-slate-600" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg text-slate-500 dark:text-slate-400">Select a conversation</p>
              <p className="text-sm mt-1">Choose a chat from the sidebar to start messaging.</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
