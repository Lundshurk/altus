import { CSSProperties, createRef, useEffect, useState } from 'react';
import './App.css'
import { InputAdornment, TextField, styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { converse, getConversations, getMessages } from './api/api';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { ChatResponse } from './api/interfaces';
import {motion} from 'framer-motion'

interface Message {
  sender: string;
  content: string;
}

function Arrow({ style }: { style?: CSSProperties }) {
  return (
    <svg style={style} xmlns="http://www.w3.org/2000/svg" height="50" viewBox="0 -960 960 960" width="40">
      <path d="M440-320h80v-166l64 63 57-57-161-160-160 160 57 56 63-63v167ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Z" /></svg>
  );
}

const WhiteTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'white',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'white',
  },
  '& textarea': {
    color: 'white',
    overflowY: 'scroll',
    maxHeight: '100px'
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
    '& input': {
      color: 'white',
    }
  },
});

function App() {
  const [list, setlist] = useState<Message[]>([]);
  const [uuid, setUuid] = useState<string>('create_new');
  const [textfield, settextfield] = useState <string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('ronin');
  const [history, setHistory] = useState<(ChatResponse & {title?: string})[]>([]);
  const chatArea = createRef<HTMLDivElement>();

  const historyVariants = {
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.02 // Adjust the delay as needed
      }
    }),
    hidden: { opacity: 0 }
  };
  const chatVariants = {
    visible: (i: number) => ({
      opacity: 1,
      y: 0, // end position
      transition: {
        delay: i * 0.01, // delay based on index
        duration: 0.2, // duration of the animation
        ease: "easeOut" // easing function for the animation
      }
    }),
    hidden: { 
      opacity: 0,
      y: 20 // start position (lower)
    }
  };

  useEffect(() => {
    getConversations(username).then(setHistory)
  }, [username])

  useEffect(() => {
    if(uuid == 'create_new') {
      setlist([])
      return;
    }
    getMessages(uuid, username).then((response) => {
      setlist(response.messages.map((m) => {
        return {
          sender: m.role,
          content: m.content
        }
      }))
    })
  }, [uuid])


  useEffect(() => {
    // Scroll chat area to bottom whenever the list of messages changes
    if (chatArea.current) {
      chatArea.current.scrollTop = chatArea.current.scrollHeight;
    }
  }, [list]);


  function send() {
    if(textfield.trim() == '') {
      return;
    }

    

    setSending(true)

    setlist([...list, {sender: 'user', content: textfield}])

    converse(uuid, textfield, username).then((response) => {
      setlist(response.messages.map((m) => {
        return {
          sender: m.role,
          content: m.content
        }
      }))

      if(uuid == 'create_new') {
        getConversations(username).then(setHistory)
      }

      setUuid(response.uuid);
      setSending(false)
      settextfield('')
    })
  }
  

  return (
    <>
      <div className='altusHeader'>
          <h1> ALTUS </h1>
      </div>
      <div style={{height: '87%', display: 'flex'}}>
        <div className='history'>
        <input placeholder='Insert your Name' onChange={(e) => setUsername(e.target.value)} value={username}></input>
          <div className='history_message' onClick={() => setUuid("create_new")}>
            Create New
          </div>
          {history?.map((conv, i) => (
            <motion.div 
            custom={history.length - i}
            initial="hidden"
            animate="visible"
            variants={historyVariants}
            key={conv.uuid} className='history_message' onClick={() => setUuid(conv.uuid)}>
              {conv.title}
            </motion.div>
          )).reverse()}
          
        </div>
        <div style={{width: '80%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          
          <div className='chat' ref={chatArea}>
            {
              list.map((m, i) => (
                <motion.div 
                custom={list.length - i}
                initial="hidden"
                animate="visible"
                variants={chatVariants}
                key={i + m.content}
                className={`chatbox ${m.sender == 'user' ? "right" : ""}`} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(marked.parse(m.content) as string)}}>
                  
                </motion.div>
              ))
            }
          </div>
          <div className='textfield'>
            <WhiteTextField
              id="outlined-multiline-flexible"
              placeholder="Ask a question..."
              onChange={(e: any) => {
                settextfield(e.target.value) 
              }}
              value={textfield}
              multiline
              sx={{
                width: '80%',
                marginBottom: '20px'
              }}
              disabled={sending}
              InputProps={{
                endAdornment: <InputAdornment position="end">
                  <IconButton
                    aria-label="submit prompt button"
                    onClick={send}
                    onMouseDown={() => { }}
                    edge="end"
                    children={<Arrow style={{ width: '100%', height: '100%', objectFit: 'contain' }}></Arrow>}
                    sx={{ width: '50px', height: '50px', marginRight: '0px', }}
                  />

                </InputAdornment>,
              }}

            />
          </div>
          {/* <div className='altusFooter'>
            <h4>footers arent real</h4>
          </div> */}
        </div>
      </div>

    </>
  )
}

export default App
