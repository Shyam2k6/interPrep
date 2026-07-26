import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { chatWithAI } from "../services/aiService";

function AIStudyCoach() {
  const { token } = useAuth();

  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      setLoading(true);

      const data = await chatWithAI(message, token);

      setResponse(data.response);
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

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
      >
        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask AI..."
          className="w-full rounded-xl border p-3 outline-none"
        />

        <button className="rounded-xl bg-slate-900 px-5 py-3 text-white">
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </form>

      {response && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold">AI Response</h2>

          <p className="mt-3 whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
}

export default AIStudyCoach;
