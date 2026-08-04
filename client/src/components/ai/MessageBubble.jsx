function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[86%] rounded-2xl border px-3.5 py-2.5 shadow-sm sm:px-4 ${
          isUser
            ? "border-slate-900 bg-slate-900 text-white"
            : "border-slate-200 bg-slate-50 text-slate-800"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.message}</p>
      </div>
    </div>
  );
}

export default MessageBubble;
