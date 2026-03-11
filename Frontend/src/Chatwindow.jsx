import './Chatwindow.css'
import Chat from './Chat.jsx'
import { Mycontext } from './Mycontext.jsx'
import { useContext, useState, useEffect, use } from 'react'
import { v1 as uuid } from 'uuid';
import { ScaleLoader } from 'react-spinners';

export default function Chatwindow() {
    const { prompt, setprompt, reply, setreply, currthreadId, prevchats, setprevchats, setnewchat } = useContext(Mycontext);
    const [loading, setloading] = useState(false);
    const [isOpen, setisOpen] = useState(false);

    const getreply = async () => {
        setloading(true);
        setnewchat(false);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currthreadId
            })
        }

        try {
            const response = await fetch('http://localhost:8080/api/chat', options);

            const res = await response.json();
            console.log(res);
            setreply(res.reply);
        } catch (err) {
            console.error(err);
        }
        setloading(false);
    }
    //Append newchaat message to prevchats
    useEffect(() => {
        if (prompt && reply) {
            setprevchats(prev => {
                return [
                    ...prev,
                    {
                        role: 'user',
                        content: prompt,
                    },
                    {
                        role: 'assistant',
                        content: reply,
                    }
                ];
            });
        }
        setprompt("");
    }, [reply]);

    const handleProfileclick = () => {
        setisOpen(!isOpen);
    }


    return (
        <div className='chatwindow'>
            <div className="navbar">
                <span>PromptIQ <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileclick}>
                    <span className='userIcon'> <i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen &&
                <div className="dropdown">
                    <div className="dropdownItem"><i className="fa-solid fa-arrow-up-right-from-square"></i>Upgrade Plan</div>
                    <div className="dropdownItem"><i className="fa-solid fa-gear"></i>Setting</div>
                    <div className="dropdownItem"><i className="fa-solid fa-arrow-right-from-bracket"></i>Log Out</div>


                </div>

            }

            <Chat />
            <ScaleLoader color="#fff" loading={loading}></ScaleLoader>

            <div className='chatInputDiv'>
                <div className="inputbox">
                    <input
                        placeholder='Ask anything...'
                        value={prompt}
                        onChange={(e) => setprompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && getreply()}
                    />


                    <div id="submit" onClick={getreply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>

                <p className='info'>
                    PromptIQ can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}
