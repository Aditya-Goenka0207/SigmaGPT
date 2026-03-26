import React, { useContext, useEffect } from "react";
import "./Sidebar.css";
import logo from "./assets/blacklogo.png";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const {
    allThreads,
    setAllThreads,
    currentThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrentThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("https://chatgpt-backend-w9t9.onrender.com/api/thread");

      if (!response.ok) {
        throw new Error("Failed to fetch threads");
      }

      const res = await response.json();

      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));

      setAllThreads(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currentThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrentThreadId(uuidv1());
    setPrevChats([]);
    setSidebarOpen(false);
  };

  const changeThread = async (threadId) => {
    setCurrentThreadId(threadId);

    try {
      const response = await fetch(
        `https://chatgpt-backend-w9t9.onrender.com/api/thread/${threadId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to load thread");
      }

      const res = await response.json();

      setPrevChats(res);
      setNewChat(false);
      setReply(null);

      // close sidebar on mobile
      setSidebarOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `https://chatgpt-backend-w9t9.onrender.com/api/thread/${threadId}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error("Failed to delete thread");
      }

      await response.json();

      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId),
      );

      if (threadId === currentThreadId) {
        createNewChat();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      {/* new chat button */}
      <button onClick={createNewChat}>
        <img src={logo} alt="gpt logo" className="logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      {/* history */}
      <ul className="history">
        {allThreads?.map((thread) => (
          <li
            key={thread.threadId}
            onClick={() => changeThread(thread.threadId)}
            className={thread.threadId === currentThreadId ? "highlighted" : ""}
          >
            {thread.title.length > 35
              ? thread.title.substring(0, 35) + "..."
              : thread.title}

            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      {/* sign */}
      <div className="sign">
        <p>By Aditya Goenka &hearts;</p>
      </div>
    </section>
  );
}
