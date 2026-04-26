import React, { useState, useEffect, useContext, useRef } from 'react';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Send, User, MessageSquare, Search, X as XIcon } from 'lucide-react';
import { format } from 'date-fns';

const styles = `
.chat-page {
  height: calc(100vh - 90px);
  padding: 1.5rem;
  font-family: 'Poppins', sans-serif;
  color: #f1f5f9;
  display: flex;
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.chat-glass {
  background: rgba(15,23,42,0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  overflow: hidden;
}

/* Sidebar */
.chat-sidebar {
  width: 340px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.chat-sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.chat-sidebar-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-search-icon {
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;
}

.chat-search-icon:hover {
  color: #93c5fd;
  background: rgba(59,130,246,0.1);
}

.chat-search-input-wrap {
  margin-top: 0.75rem;
  position: relative;
  display: flex;
  align-items: center;
}

.chat-search-field {
  width: 100%;
  background: rgba(15,23,42,0.8);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 0.55rem 2.2rem 0.55rem 0.9rem;
  font-size: 0.85rem;
  color: #f1f5f9;
  font-family: 'Poppins', sans-serif;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.chat-search-field::placeholder { color: #475569; }
.chat-search-field:focus { border-color: rgba(59,130,246,0.5); }

.chat-search-clear {
  position: absolute;
  right: 0.6rem;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.chat-search-clear:hover { color: #f87171; }

.chat-unread-badge {
  background: rgba(59,130,246,0.2);
  border: 1px solid rgba(59,130,246,0.4);
  color: #60a5fa;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.6rem;
  border-radius: 12px;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chat-list::-webkit-scrollbar { width: 6px; }
.chat-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

.chat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.chat-item:hover {
  background: rgba(255,255,255,0.03);
  border-color: rgba(255,255,255,0.05);
}

.chat-item.active {
  background: rgba(59,130,246,0.1);
  border-color: rgba(59,130,246,0.2);
}

.chat-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(59,130,246,0.15);
  border: 1px solid rgba(59,130,246,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #60a5fa;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
}

.chat-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-item-info {
  flex: 1;
  min-width: 0;
}

.chat-item-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-item-msg {
  margin: 0;
  font-size: 0.8rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.chat-item-msg.unread {
  color: #60a5fa;
  font-weight: 600;
}

.chat-item-unread-dot {
  width: 22px;
  height: 22px;
  background: #3b82f6;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 0 10px rgba(59,130,246,0.5);
}

/* Main Area */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-main-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255,255,255,0.01);
}

.chat-header-info h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #f8fafc;
}

.chat-header-status {
  margin: 0;
  font-size: 0.75rem;
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 600;
  margin-top: 2px;
}

.chat-header-status-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 8px #10b981;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(0,0,0,0.1);
}

.chat-messages::-webkit-scrollbar { width: 6px; }
.chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

.message-row {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  max-width: 80%;
}

.message-row.mine {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-row.theirs {
  align-self: flex-start;
}

.message-bubble {
  padding: 0.75rem 1.25rem;
  border-radius: 20px;
  font-size: 0.95rem;
  line-height: 1.5;
  position: relative;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.message-row.mine .message-bubble {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.message-row.theirs .message-bubble {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.05);
  color: #e2e8f0;
  border-bottom-left-radius: 4px;
}

.message-meta {
  display: flex;
  flex-direction: column;
}

.message-row.mine .message-meta {
  align-items: flex-end;
}

.message-row.theirs .message-meta {
  align-items: flex-start;
}

.message-sender {
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.3rem;
  padding: 0 0.2rem;
}

.message-time {
  font-size: 0.7rem;
  color: #64748b;
  margin-top: 0.3rem;
  padding: 0 0.2rem;
}

/* Input Area */
.chat-input-area {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.01);
}

.chat-input-form {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.chat-input-wrapper {
  flex: 1;
  background: rgba(15,23,42,0.8);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 0.85rem 1.25rem;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.chat-input-wrapper:focus-within {
  border-color: rgba(59,130,246,0.5);
  box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
}

.chat-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #f1f5f9;
  font-size: 0.95rem;
  font-family: 'Poppins', sans-serif;
}

.chat-input::placeholder {
  color: #475569;
}

.chat-send-btn {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.chat-send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(59,130,246,0.4);
}

.chat-send-btn:disabled {
  background: rgba(255,255,255,0.05);
  color: #475569;
  cursor: not-allowed;
  box-shadow: none;
}

.chat-empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  text-align: center;
  padding: 2rem;
}

.chat-empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(59,130,246,0.05);
  border: 1px solid rgba(59,130,246,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: #3b82f6;
  box-shadow: inset 0 0 20px rgba(59,130,246,0.1);
}

.chat-empty-state h3 {
  color: #e2e8f0;
  font-size: 1.25rem;
  margin: 0 0 0.5rem;
  font-weight: 700;
}

.chat-empty-state p {
  margin: 0;
  font-size: 0.9rem;
  max-width: 250px;
}
`;

export default function ChatContainer() {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const activeChatRef = useRef(null);

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
          setMessages((prev) => [...prev, message]);
          scrollToBottom();
        } else {
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

  const openChat = (chat) => {
    setActiveChat(chat);
    activeChatRef.current = chat;
    setUnreadCounts((prev) => ({ ...prev, [chat._id]: 0 }));
    // Mark all incoming messages in this chat as read on the backend
    api.put(`/chats/${chat._id}/read`).catch(() => {});
  };

  const getOtherPerson = (chat) => {
    if (!chat) return null;
    const iAmStudent = user._id === chat.student?._id;
    return iAmStudent ? chat.senior : chat.student;
  };

  const isMyMessage = (msg) => {
    const senderId = msg.sender?._id || msg.sender;
    return senderId?.toString() === user._id?.toString();
  };

  const otherPerson = getOtherPerson(activeChat);
  const totalUnread = Object.values(unreadCounts).reduce((sum, n) => sum + n, 0);

  return (
    <>
      <style>{styles}</style>
      <div className="chat-page">
        
        {/* Sidebar */}
        <div className="chat-sidebar chat-glass">
          <div className="chat-sidebar-header">
            <h2>
              Conversations
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {totalUnread > 0 && (
                  <span className="chat-unread-badge">
                    {totalUnread > 9 ? '9+' : totalUnread} new
                  </span>
                )}
                <span
                  className="chat-search-icon"
                  onClick={() => { setShowSearch(s => !s); setSearchQuery(''); }}
                  title="Search conversations"
                >
                  <Search size={17} />
                </span>
              </div>
            </h2>
            {showSearch && (
              <div className="chat-search-input-wrap">
                <input
                  className="chat-search-field"
                  placeholder="Search by name…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <span className="chat-search-clear" onClick={() => setSearchQuery('')}>
                    <XIcon size={14} />
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="chat-list">
            {chats.length === 0 ? (
              <div className="chat-empty-state" style={{ padding: '3rem 1rem' }}>
                <MessageSquare size={36} color="#475569" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1rem', color: '#94a3b8', margin: '0 0 0.5rem' }}>No conversations yet</h3>
                <p style={{ fontSize: '0.8rem', margin: 0 }}>Chats are created when a mentorship request is accepted.</p>
              </div>
            ) : (
              chats
                .filter(chat => {
                  if (!searchQuery.trim()) return true;
                  const other = getOtherPerson(chat);
                  return other?.name?.toLowerCase().includes(searchQuery.toLowerCase());
                })
                .map(chat => {
                const other = getOtherPerson(chat);
                const isActive = activeChat?._id === chat._id;
                const unread = unreadCounts[chat._id] || 0;
                
                return (
                  <div
                    key={chat._id}
                    onClick={() => openChat(chat)}
                    className={`chat-item ${isActive ? 'active' : ''}`}
                  >
                    <div className="chat-avatar">
                      {other?.profilePhoto ? (
                        <img src={other.profilePhoto} alt={other?.name} />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    
                    <div className="chat-item-info">
                      <p className="chat-item-name">{other?.name || 'Unknown User'}</p>
                      <p className={`chat-item-msg ${unread > 0 ? 'unread' : ''}`}>
                        {unread > 0 
                          ? `${unread} new message${unread > 1 ? 's' : ''}` 
                          : 'Mentorship chat'}
                      </p>
                    </div>

                    {unread > 0 && (
                      <div className="chat-item-unread-dot">
                        {unread > 9 ? '9+' : unread}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="chat-main chat-glass">
          {activeChat ? (
            <>
              {/* Header */}
              <div className="chat-main-header">
                <div className="chat-avatar" style={{ width: '40px', height: '40px' }}>
                  {otherPerson?.profilePhoto ? (
                    <img src={otherPerson.profilePhoto} alt={otherPerson?.name} />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <div className="chat-header-info">
                  <h3>{otherPerson?.name || 'Unknown User'}</h3>
                  <p className="chat-header-status">
                    <span className="chat-header-status-dot"></span>
                    Active Now
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="chat-empty-state">
                    <p style={{ fontWeight: 600 }}>No messages yet.</p>
                    <p style={{ fontSize: '0.85rem' }}>Send a message to start the conversation! 👋</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const mine = isMyMessage(msg);
                    const senderName = msg.sender?.name || (mine ? user.name : otherPerson?.name || 'Unknown');
                    const senderPhoto = msg.sender?.profilePhoto;

                    const prevMine = idx > 0 ? isMyMessage(messages[idx - 1]) : null;
                    const showName = prevMine === null || prevMine !== mine;

                    return (
                      <div key={msg._id || idx} className={`message-row ${mine ? 'mine' : 'theirs'}`}>
                        
                        {!mine && (
                          <div className="chat-avatar" style={{ width: '32px', height: '32px', marginBottom: '1.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            {senderPhoto ? (
                              <img src={senderPhoto} alt={senderName} />
                            ) : (
                              <User size={14} color="#94a3b8" />
                            )}
                          </div>
                        )}

                        <div className="message-meta">
                          {showName && (
                            <span className="message-sender">
                              {mine ? 'You' : senderName}
                            </span>
                          )}
                          <div className="message-bubble">
                            {msg.content}
                          </div>
                          <span className="message-time">
                            {msg.createdAt ? format(new Date(msg.createdAt), 'h:mm a') : ''}
                          </span>
                        </div>

                        {mine && <div style={{ width: '32px', flexShrink: 0 }} />}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="chat-input-area">
                <form onSubmit={handleSendMessage} className="chat-input-form">
                  <div className="chat-input-wrapper">
                    <input
                      className="chat-input"
                      placeholder="Type your message here..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e)}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="chat-send-btn"
                    disabled={!newMessage.trim()}
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="chat-empty-state">
              <div className="chat-empty-icon">
                <MessageSquare size={36} />
              </div>
              <h3>Your Messages</h3>
              <p>Select a conversation from the sidebar to view your chat or start a new message.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
