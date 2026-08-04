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
  const [showSidebar, setShowSidebar] = useState(false);

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
    <div className="space-y-3">
      <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              AI assistant
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              AI Study Coach
            </h1>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Ask for planning help, feedback, or study guidance in a calm,
              focused workspace.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSidebar((prev) => !prev)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              {showSidebar ? "Hide history" : "Show history"}
            </button>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Personalized support
            </div>
          </div>
        </div>
      </header>

      <div
        className={`grid min-h-[74vh] gap-4 ${showSidebar ? "lg:grid-cols-[240px_minmax(0,1fr)]" : "grid-cols-1"}`}
      >
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
        />
      </div>
    </div>
  );
}

export default AIStudyCoach;
