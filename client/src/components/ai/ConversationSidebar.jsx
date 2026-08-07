function ConversationSidebar({
  conversations,
  activeConversation,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onRenameConversation,
}) {
  return (
    <div className="flex h-full w-64 md:w-72 flex-col overflow-hidden bg-[#f3f0e8] border-r border-[#eae6db] shrink-0">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[#eae6db] flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          History
        </span>
        <button
          onClick={onNewChat}
          className="rounded-full bg-zinc-950 hover:bg-[#e2583e] px-3.5 py-1.5 text-xs font-bold text-white transition active:scale-95 cursor-pointer shadow-sm"
        >
          + New Chat
        </button>
      </div>

      {/* Sidebar Scroll List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {conversations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-4 text-xs text-zinc-450 text-center font-medium">
            No history yet.
          </div>
        ) : (
          conversations.map((conversation) => {
            const isActive = activeConversation?._id === conversation._id;

            return (
              <div
                key={conversation._id}
                className={`group rounded-xl border p-3 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "border-[#e2583e]/30 bg-[#faf7f2] shadow-sm"
                    : "border-transparent bg-transparent hover:bg-zinc-200/40"
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="space-y-1">
                  <h3 className="truncate text-sm font-bold text-zinc-900">
                    {conversation.title}
                  </h3>
                  <p className="truncate text-xs text-zinc-500 font-medium">
                    {conversation.lastMessage || "No messages yet"}
                  </p>
                </div>

                {/* Inline Action Controls (Visible on hover or active) */}
                <div className="mt-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRenameConversation(conversation);
                    }}
                    className="rounded bg-[#faf7f2]/80 hover:bg-[#faf7f2] px-2 py-0.5 text-[10px] font-bold text-zinc-700 border border-zinc-200 shadow-sm transition"
                  >
                    Rename
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation._id);
                    }}
                    className="rounded bg-rose-50 hover:bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-100 shadow-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ConversationSidebar;
