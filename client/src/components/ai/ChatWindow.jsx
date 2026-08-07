import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

function ChatWindow({
  messages,
  loading,
  onSend,
  activeConversation,
  showSidebar,
  onToggleSidebar,
  onNewChat,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[radial-gradient(circle_at_top_left,_#fdf3f0,_#faf7f2_70%)] relative">
      {/* Top Bar Navigation */}
      <div className="border-b border-[#eae6db] bg-[#faf7f2]/80 backdrop-blur-md px-6 py-2.5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-zinc-200/50 rounded-xl transition mr-3 cursor-pointer text-zinc-650"
            title={showSidebar ? "Hide history" : "Show history"}
          >
            <svg className="h-5.5 w-5.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h2 className="text-base font-bold text-zinc-950 truncate max-w-xs md:max-w-md">
              {activeConversation ? (activeConversation.title || "Conversation") : "🤖 AI Study Coach"}
            </h2>
          </div>
        </div>

        <button
          onClick={onNewChat}
          className="rounded-full bg-[#e2583e]/10 hover:bg-[#e2583e]/20 border border-[#e2583e]/20 px-3.5 py-1.5 text-xs font-bold text-[#e2583e] transition active:scale-95 cursor-pointer flex items-center gap-1"
        >
          <span>+ New Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 md:px-6">
        <div className="max-w-3xl mx-auto w-full space-y-3">
          {!activeConversation && messages.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="h-16 w-16 bg-[#e2583e]/10 border border-[#e2583e]/20 rounded-full flex items-center justify-center text-3xl mx-auto shadow-sm">
                🤖
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-xl font-extrabold text-zinc-950">AI Study Coach</h3>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                  Start a new conversation to clarify engineering principles, design database models, structure check-in items, or request active roadmap outlines.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message._id} message={message} />
            ))
          )}

          {loading && (
            <div className="w-fit rounded-3xl border border-[#eef0f2] bg-[#f3f0e8] px-5 py-3.5 text-xs font-bold text-zinc-500 flex items-center gap-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e2583e] animate-bounce"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#e2583e] animate-bounce delay-75"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#e2583e] animate-bounce delay-150"></span>
              <span>Thinking...</span>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>
      </div>

      {/* Floating Input Area */}
      <div className="px-4 pb-4 pt-1 md:px-6 md:pb-5 md:pt-1.5 bg-transparent border-t border-[#eae6db]/10">
        <div className="max-w-3xl mx-auto w-full">
          <ChatInput onSend={onSend} loading={loading} />
          <p className="text-[10px] text-zinc-400 font-medium mt-2.5 text-center">
            AI Study Coach can make errors. Verify complex engineering roadmaps or architectural plans.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
