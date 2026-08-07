import ReactMarkdown from "react-markdown";

function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[86%] rounded-3xl border px-4 py-3 shadow-sm sm:px-5 ${
          isUser
            ? "border-[#e2583e] bg-[#e2583e] text-white shadow-md shadow-orange-500/5"
            : "border-[#eef0f2] bg-[#faf7f2] text-zinc-850"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words text-sm font-semibold leading-relaxed">{message.message}</p>
        ) : (
          <div className="prose prose-slate max-w-none text-sm leading-relaxed whitespace-pre-wrap break-words">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-base font-extrabold text-zinc-950 mt-3 mb-1.5 first:mt-0">{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-extrabold text-zinc-950 mt-2.5 mb-1 first:mt-0">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xs font-bold text-zinc-950 mt-2 mb-1 first:mt-0">{children}</h3>,
                ul: ({ children }) => <ul className="list-disc pl-5 my-1.5 space-y-1 text-zinc-700 font-medium">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 my-1.5 space-y-1 text-zinc-700 font-medium">{children}</ol>,
                li: ({ children }) => <li className="text-zinc-850">{children}</li>,
                p: ({ children }) => <p className="mb-2 last:mb-0 text-zinc-800 font-medium">{children}</p>,
                code: ({ children }) => (
                  <code className="rounded bg-[#f8f9fa] border border-[#eef0f2] px-1.5 py-0.5 font-mono text-xs font-bold text-[#e2583e]">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="my-2 overflow-x-auto rounded-2xl bg-[#f8f9fa] p-3 font-mono text-xs text-zinc-900 border border-[#eef0f2]">
                    {children}
                  </pre>
                ),
              }}
            >
              {message.message}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
