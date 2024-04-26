// React imports
import React, { useState, useEffect, useRef } from "react";

// Third-party library imports
import { Tooltip } from "react-tooltip";
import Groq from "groq-sdk";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import copy from "clipboard-copy";

// Component imports
import { ReactComponent as GroqLogo } from "../assets/chatbot/groq-seeklogo.svg";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

// Asset imports
import Me from "../assets/home/Me.png";

const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ,
  dangerouslyAllowBrowser: true,
});

const Arda = () => {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [responses]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    setResponses((prevResponses) => [
      ...prevResponses,
      { role: "user", content: message },
    ]);
    setIsTyping(true);

    setMessage("");

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You will now act and introduce yourself as Arda, A general purpose assistant running on llama3-70b-8192 model via GROQ on Marcus David Alo's portfolio website",
        },
        ...responses,
        {
          role: "assistant",
          content:
            "Hello! I'm your Programming Assistant. I am using the llama3-70b-8192 model via GROQ. How may I assist you with your code today?",
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama3-70b-8192",
      temperature: 0.5,
      max_tokens: 768,
      top_p: 0.75,
    });

    setIsTyping(false);
    setResponses((prevResponses) => [
      ...prevResponses,
      {
        role: "assistant",
        content: chatCompletion.choices[0]?.message?.content || "",
      },
    ]);
  };

  const components = {
    code: ({ node, inline, children, ...props }) => {
      return !inline ? (
        <div className="relative rounded-md shadow-sm font-mono font-normal text-base">
          <button
            className="absolute right-0 top-0 m-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded px-2 py-1"
            onClick={() => copy(children)}
          >
            Copy
          </button>
          <pre className="p-4 rounded-md bg-gray-800 text-white overflow-auto">
            <code {...props}>{children}</code>
          </pre>
          <p className="text-xs font-mono text-right text-gray-500 pr-2 pb-1">
            This code was generated by AI. Please review properly.
          </p>
        </div>
      ) : (
        <code {...props}>{children}</code>
      );
    },
  };

  return (
    <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-950 border-x-8 border-gray-300 dark:border-gray-800 p-6 rounded-2xl max-w-full h-[80vh]">
      <div className="flex justify-start mx-2 mb-2">
        <p className="text-base text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 rounded-md">
          Powered by{" "}
          <a href="https://groq.com/" rel="noreferrer noopener" target="_blank">
            <GroqLogo
              data-tooltip-id="groqtooltip"
              className="inline h-8 w-8 mx-1 text-black dark:text-white"
            />
            <Tooltip
              id="groqtooltip"
              place="top"
              effect="solid"
              className="max-w-lg rounded-md font-mono"
            >
              This opens a new tab to groq's main site.
            </Tooltip>
          </a>
        </p>
      </div>
      <div className="overflow-x-hidden h-full w-full mb-4">
        {responses.map((response, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 p-3 m-2 rounded-lg border-b-4 border-r-4 border-indigo-800/50 ${
              response.role === "assistant"
                ? "bg-indigo-100 text-indigo-800"
                : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            }`}
          >
            {response.role === "assistant" && (
              <img
                src={Me}
                alt="Your Name"
                className="h-10 w-10 rounded-full"
              />
            )}
            <ReactMarkdown
              components={components}
              remarkPlugins={[gfm]}
              className="font-semibold text-base flex flex-col max-w-[60vw] md:text-lg"
            >
              {response.content}
            </ReactMarkdown>
          </div>
        ))}
        {isTyping && <div className="typing-animation">Arda is typing...</div>}
        <div ref={chatEndRef} />
      </div>
      <div className="flex w-full items-center space-x-2">
        <InformationCircleIcon
          data-tooltip-id="disclaimerTooltip"
          className="h-6 w-6 text-gray-700  dark:text-gray-300 cursor-pointer hover:scale-110"
        />
        <Tooltip
          id="disclaimerTooltip"
          place="top"
          effect="solid"
          className="max-w-lg rounded-md font-mono z-40"
        >
          Please Note: This AI Assistant is continuously being refined and may
          occasionally provide inaccurate details about my background and
          professional endeavors. Your understanding is appreciated.
        </Tooltip>
        <div className="flex justify-center items-center relative w-full">
          <textarea
            value={message}
            onChange={(e) => {
              if (e.target.value.length <= 12000) {
                setMessage(e.target.value);
                setCharCount(e.target.value.length);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isTyping) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="w-full bg-white dark:bg-gray-800 text-black dark:text-white flex-1 px-2 py-2 border min-h-16 border-gray-300 rounded-md"
            disabled={isTyping}
            placeholder="Type your message here..."
            rows={3}
            maxLength={12000}
            autoComplete="on"
            spellCheck="true"
            autoCorrect="false"
            autoCapitalize="false"
            wrap="soft"
          />

          <p className="absolute bottom-0 left-2 text-lg text-gray-700 dark:text-gray-300">
            {charCount}/12000
          </p>
          <button
            onClick={sendMessage}
            className="inline-flex absolute right-2 items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            disabled={isTyping}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Arda;