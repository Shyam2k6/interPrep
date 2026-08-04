import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

function ChatWindow({ messages, loading, onSend, activeConversation }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  if (!activeConversation) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="mx-4 max-w-lg rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">
            🤖 AI Study Coach
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Start a new conversation to begin chatting.
          </p>

          <div className="mt-8">
            <ChatInput onSend={onSend} loading={loading} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Live chat
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              {activeConversation.title || "Current conversation"}
            </h2>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600">
            AI ready
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-[radial-gradient(circle_at_top_left,_#f8fafc,_#ffffff_70%)] p-4 sm:p-6">
        {messages.map((message) => (
          <MessageBubble key={message._id} message={message} />
        ))}

        {loading && (
          <div className="w-fit rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600">
            Thinking...
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      <ChatInput onSend={onSend} loading={loading} />
    </div>
  );
}

export default ChatWindow;
