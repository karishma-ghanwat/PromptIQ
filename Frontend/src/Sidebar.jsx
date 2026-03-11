import './Sidebar.css'
import { useContext, useEffect } from 'react'
import { Mycontext } from './Mycontext.jsx'
import { v1 as uuidv1 } from 'uuid';

export default function Sidebar() {
    const { allthreads, setallthreads, currthreadId,
        setnewchat, setprompt, setreply,
        setcurrthreadId, setprevchats } = useContext(Mycontext);

    const getallThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();

            const filterdData = res.map(thread => ({
                threadId: thread.threadId,
                title: thread.title
            }));

            setallthreads(filterdData);

        } catch (err) {
            console.log("Error in fetching all threads:", err);
        }
    }

    useEffect(() => {
        getallThreads();
    }, [currthreadId]);

    const createNewchat = () => {
        setnewchat(true);
        setprompt("");
        setreply(null);
        setcurrthreadId(uuidv1());
        setprevchats([]);
    }

    const changeThread = async (newthreadId) => {
        setcurrthreadId(newthreadId);   // highlight triggers here
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newthreadId}`);
            const res = await response.json();
            setprevchats(res);
            setnewchat(false);
            setreply(null);
        } catch (err) {
            console.log(err);
        }
    }

    const deleteThread = async (threadId) => {
        try {
            await fetch(`http://localhost:8080/api/thread/${threadId}`, { method: "DELETE" });

            setallthreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if (threadId === currthreadId) {
                createNewchat();
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section className="sidebar">

            <button onClick={createNewchat}>
                <img src='./src/assets/blacklogo.png' alt='gpt-logo' className='logo' />
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className="history">
                {
                    allthreads?.map((thread, idx) => (
                        <li
                            key={idx}
                            onClick={() => changeThread(thread.threadId)}
                            className={thread.threadId === currthreadId ? "highlighted" : ""}
                        >
                            {thread.title}

                            <i
                                className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteThread(thread.threadId);
                                }}>
                            </i>
                        </li>
                    ))
                }
            </ul>

        </section>
    )
}
