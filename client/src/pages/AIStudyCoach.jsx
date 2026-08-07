/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

import {
  chatWithAI,
  getChatHistory,
  getConversations,
  deleteConversation,
  renameConversation,
} from "../services/aiService";

import ConversationSidebar from "../components/ai/ConversationSidebar";
import ChatWindow from "../components/ai/ChatWindow";

function AIStudyCoach() {
  const { token } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  async function fetchConversations() {
    try {
      const data = await getConversations(token);

      setConversations(data.data.conversations);

      if (data.data.conversations.length > 0) {
        setActiveConversation(data.data.conversations[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation._id);
    } else {
      setTimeout(() => setMessages([]), 0);
    }
  }, [activeConversation]);

  async function fetchMessages(conversationId) {
    try {
      const data = await getChatHistory(conversationId, token);

      setMessages(data.data.chats);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSend(message) {
    try {
      setLoading(true);

      const data = await chatWithAI(message, activeConversation?._id, token);

      if (!activeConversation) {
        await fetchConversations();

        setActiveConversation({
          _id: data.conversationId,
        });
      } else {
        await fetchMessages(activeConversation._id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // Handle trigger for starting a clean new chat session
  function handleNewChat() {
    setActiveConversation(null);
    setMessages([]);
  }

  async function handleDeleteConversation(id) {
    try {
      await deleteConversation(id, token);

      await fetchConversations();

      if (activeConversation?._id === id) {
        setActiveConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRenameConversation(conversation) {
    const title = prompt("Enter new title", conversation.title);

    if (!title) return;

    try {
      await renameConversation(conversation._id, title, token);

      await fetchConversations();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#faf7f2] overflow-hidden animate-fadeIn">
      {showSidebar && (
        <ConversationSidebar
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectConversation={setActiveConversation}
          onNewChat={handleNewChat}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
        />
      )}

      <ChatWindow
        messages={messages}
        loading={loading}
        activeConversation={activeConversation}
        onSend={handleSend}
        showSidebar={showSidebar}
        onToggleSidebar={() => setShowSidebar((prev) => !prev)}
        onNewChat={handleNewChat}
      />
    </div>
  );
}

export default AIStudyCoach;
