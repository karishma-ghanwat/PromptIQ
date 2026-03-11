import './Chat.css'
import { useState, useEffect, useContext } from 'react'
import { Mycontext } from './Mycontext'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import "highlight.js/styles/github-dark.css";

export default function Chat() {
    const { newchat, prevchats, reply } = useContext(Mycontext)
    const [latestreply, setlatestreply] = useState(null)

    useEffect(() => {
        if (reply === null) {
            setlatestreply(null);
            return;
        }
        if (!prevchats?.length || !reply) return;

        const content = reply.split(" ");
        let idx = 0;

        const interval = setInterval(() => {
            setlatestreply(content.slice(0, idx + 1).join(" "));
            idx++;

            if (idx === content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);
    }, [prevchats, reply]);

    return (
        <>
            {newchat && <h1>Start a new chat!</h1>}
            <div className="chats">

                {prevchats?.slice(0, -1).map((chat, idx) =>
                    <div className={chat.role === 'user' ? 'userdiv' : 'gptdiv'} key={idx}>
                        {chat.role === 'user'
                            ? <p className='usermessage'>{chat.content}</p>
                            : (
                                <div className='gptdiv'>
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                        {chat.content}
                                    </ReactMarkdown>
                                </div>
                            )
                        }
                    </div>
                )}

                {prevchats.length > 0 && latestreply !== null &&
                    <div className='gptdiv' key={"typing"}>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                            {latestreply}
                        </ReactMarkdown>
                    </div>
                }
                {
                    prevchats.length > 0 && latestreply === null &&
                    <div className='gptdiv' key={"typing"}>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                            {prevchats[prevchats.length - 1].content}
                        </ReactMarkdown>
                    </div>
                }

            </div>
        </>
    )
}
