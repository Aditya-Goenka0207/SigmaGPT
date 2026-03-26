import React, { useContext, useState, useEffect } from "react";
import "./ChatWindow.css";
import Chat from "./Chat";
import { MyContext } from "./MyContext";
import { ScaleLoader } from "react-spinners";

export default function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currentThreadId,
    prevChats,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setNewChat(false);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currentThreadId,
      }),
    };

    try {
      const response = await fetch("https://chatgpt-backend-w9t9.onrender.com/api/chat", options);
      if (!response.ok) {
        throw new Error("Failed to fetch reply");
      }

      const data = await response.json();
      setReply(data.reply);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  // Append new chat to previous chats
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }

    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          SigmaGPT&nbsp;<i className="fa-solid fa-chevron-down"></i>
        </span>

        <div
          className="userIconDiv"
          onClick={() => {
            handleProfileClick();
          }}
        >
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i> Settings
          </div>
          <div className="dropDownItem">
            <i className="fa-regular fa-circle-question"></i> Help
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
          </div>
        </div>
      )}

      <Chat />

      {/* loader */}
      <ScaleLoader color="#fff" loading={loading} />

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") getReply();
            }}
          />

          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        <p className="info">
          SigmaGPT can make mistakes. Check important info. See{" "}
          <a href="#">Cookie Preferences</a>.
        </p>
      </div>
    </div>
  );
}
