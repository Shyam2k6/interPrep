import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { chatWithAI, getChatHistory } from "../services/aiService";

function AIStudyCoach() {
  const { token } = useAuth();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getChatHistory(token);
        setMessages(data.data.chats);
      } catch (error) {
        console.log(error);
      }
    }

    fetchHistory();
  }, [token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;
    setMessage("");

    try {
      setLoading(true);

      const data = await chatWithAI(currentMessage, token);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          message: data.response,
        },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold">🤖 AI Study Coach</h1>

        <p className="mt-2 text-slate-500">Ask anything about your learning.</p>
      </header>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm h-[500px] overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "ml-auto bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-900"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))}

          {loading && (
            <div className="max-w-[75%] rounded-2xl bg-slate-100 px-4 py-3">
              Thinking...
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex gap-3">
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask AI..."
            className="flex-1 rounded-xl border p-3 outline-none"
          />

          <button
            disabled={loading}
            className="rounded-xl bg-slate-900 px-6 text-white"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default AIStudyCoach;
