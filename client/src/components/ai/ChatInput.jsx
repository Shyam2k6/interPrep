import { useState } from "react";

function ChatInput({ onSend, loading }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    onSend(message);

    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 bg-transparent p-0"
    >
      <textarea
        rows={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        placeholder="Ask AI study coach anything..."
        className="flex-1 resize-none rounded-3xl border border-[#eae6db] bg-[#faf7f2] px-5 py-3.5 text-sm text-zinc-900 outline-none transition focus:border-[#e2583e] focus:ring-2 focus:ring-[#e2583e]/10 shadow-sm"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-zinc-950 hover:bg-[#e2583e] h-[48px] w-[48px] flex items-center justify-center text-white transition active:scale-95 shadow-md disabled:cursor-not-allowed disabled:opacity-50 shrink-0 cursor-pointer"
        aria-label="Send message"
      >
        {loading ? (
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="h-5 w-5 transform rotate-90" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )}
      </button>
    </form>
  );
}

export default ChatInput;
