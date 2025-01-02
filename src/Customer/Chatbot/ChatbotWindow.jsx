import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import api from '../../Config/api';

// --- RESPONSIVE UPDATE ---
const style = {
  position: 'fixed',
  bottom: { xs: 0, sm: '80px' },
  right: { xs: 0, sm: '30px' },
  width: { xs: '100%', sm: '400px' },
  height: { xs: '100%', sm: '600px' },
  maxHeight: { xs: '100%', sm: '75vh' },
  bgcolor: 'background.paper',
  borderRadius: { xs: '16px 16px 0 0', sm: '16px' }, // Mobile: Bo tròn góc trên
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
  transform: 'translateY(20px)',
  opacity: 0,
  zIndex: 1300,
  outline: 'none'
};

const openStyle = {
  ...style,
  transform: 'translateY(0)',
  opacity: 1,
};

const ChatbotWindow = ({ open, handleClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: `Chào mừng bạn đến với PC Shop! 💻\nTôi là trợ lý AI chuyên về các dòng Laptop và Linh kiện máy tính. Bạn đang cần tìm dòng máy Gaming, Văn phòng hay Đồ họa? Hãy hỏi tôi nhé!` }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addMessage = (sender, text) => {
    setMessages(prevMessages => [...prevMessages, { sender, text }]);
  };

  const sendMessageToAI = async (userMessage) => {
    setLoading(true);
    setError('');

    addMessage('user', userMessage);

    let queryPayload = userMessage;

    if (messages.length > 1) {
        const historyText = messages.slice(-4).map(msg => { // Only take last 4 messages for context to save tokens
            const role = msg.sender === 'user' ? 'User' : 'Bot';
            return `${role}: ${msg.text}`;
        }).join('\n');

        queryPayload = `--- Lịch sử ---\n${historyText}\n--- Hết lịch sử ---\n\nCâu hỏi mới: ${userMessage}`;
    }

    const payload = {
        userQuery: queryPayload
    };

    try {
      const response = await api.post('/api/chatbot/ask', payload);

      if (!response.data || !response.data.response) {
         throw new Error('Phản hồi không hợp lệ.');
      }

      const botResponseText = response.data.response;
      addMessage('bot', botResponseText);

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError('Lỗi kết nối AI. Vui lòng thử lại.');
      addMessage('bot', `Rất tiếc, tôi đang gặp chút sự cố khi kết nối. Bạn vui lòng thử lại sau nhé.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="chatbot-modal-title"
      closeAfterTransition
      slotProps={{
          backdrop: {
              sx: { backgroundColor: 'rgba(0,0,0,0.1)' } // Light backdrop
          }
      }}
    >
      <Box sx={open ? openStyle : style}>
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
             <h1 id="chatbot-modal-title" className="text-base font-bold">
                Trợ lý ảo AI
             </h1>
          </div>
          <IconButton onClick={handleClose} size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)', '&:hover': {bgcolor: 'rgba(255,255,255,0.3)'} }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>

        <ChatMessages messages={messages} />

        {error && (
          <div className="px-4 py-2 text-red-600 text-xs text-center bg-red-50 border-t border-red-100">
              {error}
          </div>
        )}

        <ChatInput onSendMessage={sendMessageToAI} loading={loading} />
      </Box>
    </Modal>
  );
};

export default ChatbotWindow;