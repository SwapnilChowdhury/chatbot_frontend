import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  Snackbar,
  Divider,
  Avatar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Box, styled } from '@mui/system';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Styled components for messages
const UserMessage = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#cce5ff',
  borderRadius: '8px',
  maxWidth: '70%',
  marginBottom: '8px',
  marginLeft: theme.spacing(1),
}));

const BotContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  maxWidth: '70%',
  marginBottom: '8px',
  marginLeft: theme.spacing(1),
  display:'block'
}));

const TypingIndicator = styled(Typography)(({ theme }) => ({
  fontStyle: 'italic',
  color: '#888',
  marginLeft: theme.spacing(1),
}));

const MessageWindow = styled(Paper)(({ theme }) => ({
  padding: '16px',
  maxHeight: '500px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#eaeaea',
}));

const OuterContainer = styled(Container)(({ theme }) => ({
  backgroundColor: '#d8f8d8',
  padding: '20px',
  borderRadius: '8px',
}));

const App = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false); // State for typing indicator
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInput) {
      setSnackbarMessage('Please enter a message!');
      setSnackbarOpen(true);
      return;
    }

    const newMessages = [...messages, { text: userInput, sender: 'user' }];
    setMessages(newMessages);
    setUserInput('');

    setIsTyping(true); // Show typing indicator

    // Simulate a delay before fetching the bot's response
    setTimeout(async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userInput }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const botMessage = {
          text: `${data.dynamic_response}\nSongs Recommendations:\n${data.spotify_recommendations.join('\n')}`,
          sender: 'bot',
        };
        console.log(data);
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        setSnackbarMessage('Error fetching data from the server!');
        setSnackbarOpen(true);
      } finally {
        setIsTyping(false); // Hide typing indicator after response
      }
    }, 1000); // Simulate a 1.5-second typing delay
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <OuterContainer maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Music Recommendation Chatbot
      </Typography>
      <MessageWindow elevation={3}>
        <List style={{ flexGrow: 1 }}>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
              }}
            >
              <Avatar
                alt={message.sender === 'user' ? 'User' : 'Bot'}
                src={message.sender === 'user' ? 'data:image/jpeg;base64,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' : 
                  'data:image/png;base64,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'}
              />
              {message.sender === 'user' ? (
                <UserMessage>{message.text}</UserMessage>
              ) : (
                <Box display='flex' flexDirection='column'>
                <BotContainer style={{marginBottom:'16px'}}>
                <Typography variant="body1">
                    {message.text.split('\n').slice(0,1).map((line, idx) => (
                      <span key={idx}>{line}<br /></span>
                    ))}
                  </Typography>
                </BotContainer>
                <BotContainer style={{marginBottom:'16px'}}>
                  <Typography variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                    Songs Recommendations:
                  </Typography>
                  <Typography variant="body1">
                    {message.text.split('\n').slice(1).map((line, idx) => (
                      <span key={idx}>{line}<br /></span>
                    ))}
                  </Typography>
                </BotContainer>
                </Box>
                
              )}
            </ListItem>
          ))}
          {isTyping && (
            <ListItem
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'row',
              }}
            >
              <Avatar alt="Bot" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..." />
              <TypingIndicator>Typing...</TypingIndicator>
            </ListItem>
          )}
        </List>
        <Divider style={{ margin: '16px 0' }} />
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
          <TextField
            label="Type your message"
            variant="outlined"
            value={userInput}
            onChange={handleInputChange}
            fullWidth
            style={{ backgroundColor: '#fff' }}
          />
          <Button variant="contained" color="primary" type="submit">
            Send
          </Button>
        </form>
      </MessageWindow>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </OuterContainer>
  );
};

export default App;
