import { CSSProperties, useEffect, useState } from 'react';
import './App.css'
import { InputAdornment, TextField, makeStyles, styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { converse, getMessages } from './api/api';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

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
  const [sending, setSending] = useState <boolean>(false);


  useEffect(() => {
    getMessages(uuid).then((response) => {
      setlist(response.messages.map((m) => {
        return {
          sender: m.role,
          content: m.content
        }
      }))
    })
  }, [])


  function send() {
    setSending(true)

    setlist([...list, {sender: 'user', content: textfield}])

    converse(uuid, textfield).then((response) => {
      setlist(response.messages.map((m) => {
        return {
          sender: m.role,
          content: m.content
        }
      }))
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
      <div className='chat'>
        {
          list.map((m) => (
            <div className={`chatbox ${m.sender == 'user' ? "right" : ""}`} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(marked.parse(m.content))}}>
              
            </div>
          ))
        }
      </div>
      <div className='textfield'>
        <WhiteTextField
          id="outlined-multiline-flexible"
          placeholder="Prompt..."
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
      <div className='altusFooter'>
        <h4>footers arent real</h4>
      </div>


    </>
  )
}

export default App