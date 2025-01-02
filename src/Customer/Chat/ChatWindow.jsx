import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import ConversationList from './ConversationList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { setActiveConversation, sendMessage } from '../../Redux/Chat/Action';

// --- RESPONSIVE UPDATE: Full screen on mobile, fixed size on tablet/desktop ---
const modalStyle = {
  position: 'fixed', // Changed from absolute to fixed for better mobile handling
  bottom: { xs: 0, sm: '20px' },
  right: { xs: 0, sm: '20px' },
  width: { xs: '100%', sm: '400px' },
  height: { xs: '100%', sm: '600px' },
  maxHeight: { xs: '100%', sm: '80vh' },
  bgcolor: 'background.paper',
  borderRadius: { xs: 0, sm: '12px' },
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  outline: 'none', // Remove default focus outline
  zIndex: 1300 // Ensure it's above other elements
};

const ChatWindow = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { auth, chat } = useSelector((store) => store);

  const activeConversation = chat.activeConversation;

  const handleBackToConversations = () => {
    dispatch(setActiveConversation(null));
  };

  const handleSendMessage = (content) => {
    if (!activeConversation) return;

    const messageDTO = {
      conversationId: activeConversation.id,
      content: content,
    };
    dispatch(sendMessage(messageDTO));
  };

  const getHeaderName = () => {
    if (!activeConversation || !auth.user) return 'Hỗ trợ khách hàng';

    return auth.user.role === 'ADMIN'
      ? activeConversation.user.name
      : "Chăm sóc khách hàng";
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="chat-window-modal"
      // Remove default backdrop to allow interaction with background on large screens if needed, 
      // but usually modal blocks interaction. keeping default behavior is safer.
    >
      <Box sx={modalStyle}>
        <Box
          sx={{
            p: 1.5,
            bgcolor: '#9155FD', // Primary color
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 1
          }}
        >
          {activeConversation && (
            <IconButton onClick={handleBackToConversations} size="small" sx={{ color: 'white', mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
          )}

          <Typography variant="subtitle1" fontWeight="bold" sx={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {getHeaderName()}
          </Typography>

          <IconButton onClick={handleClose} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
            {chat.loading && !activeConversation ? (
            <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
                <CircularProgress size={30} />
            </Box>
            ) : !activeConversation ? (
            <ConversationList />
            ) : (
            <>
                <MessageList />
                <MessageInput onSendMessage={handleSendMessage} loading={chat.loading} />
            </>
            )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ChatWindow;