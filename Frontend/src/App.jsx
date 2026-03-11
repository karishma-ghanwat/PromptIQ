import './App.css'
import Sidebar from './Sidebar.jsx'
import Chatwindow from './Chatwindow.jsx'
import { Mycontext } from './Mycontext.jsx'
import { useState } from 'react'
import { v1 as uuidv1 } from 'uuid';

function App() {
  const [prompt, setprompt] = useState("");
  const [reply, setreply] = useState(null);
  const [currthreadId, setcurrthreadId] = useState(uuidv1()); // FIXED
  const [prevchats, setprevchats] = useState([]); // Stores all prev chats of thread
  const [newchat, setnewchat] = useState(true); // To trigger new chat creation
  const [allthreads, setallthreads] = useState([]); // Stores all threads

  const providerValues = {
    prompt, setprompt,
    reply, setreply,
    currthreadId, setcurrthreadId, // FIXED
    prevchats, setprevchats,
    newchat, setnewchat,
    allthreads, setallthreads
  };

  return (
    <div className="app">
      <Mycontext.Provider value={providerValues}>
        <Sidebar />
        <Chatwindow />
      </Mycontext.Provider>
    </div>
  )
}

export default App
