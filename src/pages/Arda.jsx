import React, { useState, useEffect } from "react";
import axios from "axios";
import Groq from "groq-sdk";
import Sidebar from "../components/arda/Sidebar";
import ChatWindow from "../components/arda/ChatWindow";
import { v4 as uuidv4 } from "uuid";
import useTitle from "../hooks/useTitle";

const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ,
  dangerouslyAllowBrowser: true,
});

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE;
const CX = process.env.REACT_APP_SEARCH_ENGINE_ID;

const Arda = () => {
  const [savedConversations, setSavedConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState({
    id: uuidv4(),
    messages: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const savedConversations = localStorage.getItem("conversations");
    if (savedConversations) {
      setSavedConversations(JSON.parse(savedConversations));
    }
  }, []);

  const saveConversation = (conversations) => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  };

  const loadConversation = (conversation) => {
    setCurrentConversation(conversation);
  };

  const updateCurrentConversation = (updatedConversation) => {
    setCurrentConversation(updatedConversation);

    const conversationIndex = savedConversations.findIndex(
      (conversation) => conversation.id === updatedConversation.id
    );

    if (conversationIndex !== -1) {
      const updatedSavedConversations = [...savedConversations];
      updatedSavedConversations[conversationIndex] = updatedConversation;
      setSavedConversations(updatedSavedConversations);
      saveConversation(updatedSavedConversations);
    } else {
      const newSavedConversations = [
        ...savedConversations,
        updatedConversation,
      ];
      setSavedConversations(newSavedConversations);
      saveConversation(newSavedConversations);
    }
  };

  const deleteConversation = (index) => {
    const updatedConversations = [...savedConversations];
    updatedConversations.splice(index, 1);
    setSavedConversations(updatedConversations);
    saveConversation(updatedConversations);
  };

  const renameConversation = (index) => {
    const newName = prompt("Enter the new name for the conversation:");
    if (newName !== null && newName.trim() !== "") {
      const updatedConversations = [...savedConversations];
      updatedConversations[index].name = newName;
      setSavedConversations(updatedConversations);
      saveConversation(updatedConversations);
    }
  };

  const startNewConversation = () => {
    setCurrentConversation({ id: uuidv4(), messages: [] });
  };

  const searchGoogle = async (query) => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/customsearch/v1",
        {
          params: {
            key: GOOGLE_API_KEY,
            cx: CX,
            q: query,
          },
        }
      );
      return response.data.items; // Return the search results
    } catch (error) {
      console.error("Error performing search:", error);
      return [];
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;
    const results = await searchGoogle(searchQuery);
    setSearchResults(results);
  };

  useTitle("Arda");

  return (
    <>
      <div className="relative flex h-[80vh] w-full dark:bg-gray-900">
        <Sidebar
          conversations={savedConversations}
          onConversationClick={loadConversation}
          onDeleteConversation={deleteConversation}
          onRenameConversation={renameConversation}
          onNewConversation={startNewConversation}
        />
        <ChatWindow
          groq={groq}
          currentConversation={currentConversation}
          onConversationUpdate={updateCurrentConversation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          searchResults={searchResults}
        />
      </div>
    </>
  );
};

export default Arda;
