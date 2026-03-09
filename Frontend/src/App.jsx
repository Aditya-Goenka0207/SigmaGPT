import { useState } from "react";
import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function App() {

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currentThreadId, setCurrentThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currentThreadId,
    setCurrentThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads,
  };

  return (
    <div className="app">

      {/* MENU BUTTON */}
      {!sidebarOpen && (
        <button
          className="menuBtn"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
      )}

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <MyContext.Provider value={providerValues}>
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <ChatWindow />
      </MyContext.Provider>

    </div>
  );
}

export default App;