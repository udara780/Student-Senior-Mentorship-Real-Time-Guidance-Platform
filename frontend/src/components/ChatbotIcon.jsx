import React from 'react';
import helperIcon from '../assets/helper.png';

const ChatbotIcon = () => {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] cursor-pointer hover:scale-105 transition-transform duration-200">
      <img 
        src={helperIcon} 
        alt="Chat Assistant" 
        className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-2xl" 
      />
    </div>
  );
};

export default ChatbotIcon;
