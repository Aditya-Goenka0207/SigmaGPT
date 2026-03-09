import React, { useContext, useState, useEffect, useRef } from "react";
import "./Chat.css";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);

  const [latestReply, setLatestReply] = useState(null);

  /*reference for auto scroll */
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }

    if (!prevChats?.length) return;

    setLatestReply("");

    const content = reply.split("");
    let idx = 0;

    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(""));
      idx++;

      if (idx >= content.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [prevChats, reply]);

  /*auto scroll to bottom when chats update */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prevChats, latestReply]);

  return (
    <>
      {newChat && <h1>Start a New Chat!</h1>}

      <div className="chats">
        {/* existing chats except last reply */}
        {prevChats?.slice(0, -1).map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <div className="gptMessage">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {chat.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {/* typing animation for latest reply */}
        {prevChats?.length > 0 &&
          latestReply !== null &&
          latestReply !== "" && (
            <div className="gptDiv" key={"typing"}>
              <div className="gptMessage">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {latestReply}
                </ReactMarkdown>
              </div>
            </div>
          )}

        {/* previous chats load without typing */}
        {prevChats?.length > 0 && latestReply === null && (
          <div className="gptDiv" key={"non-typing"}>
            <div className="gptMessage">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {prevChats[prevChats.length - 1]?.content}
              </ReactMarkdown>
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>
    </>
  );
}
