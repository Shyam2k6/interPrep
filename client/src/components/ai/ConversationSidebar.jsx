function ConversationSidebar({
  conversations,
  activeConversation,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onRenameConversation,
}) {
  return (
    <div className="flex h-full min-h-[420px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
      <div className="border-b border-slate-200 bg-white/80 p-3">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Conversations
        </div>
        <button
          onClick={onNewChat}
          className="w-full rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          + New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 p-2.5">
        {conversations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            No conversations yet.
          </div>
        ) : (
          conversations.map((conversation) => {
            const isActive = activeConversation?._id === conversation._id;

            return (
              <div
                key={conversation._id}
                className={`mb-2 rounded-2xl border p-3 transition ${
                  isActive
                    ? "border-slate-300 bg-white shadow-sm"
                    : "border-transparent bg-transparent hover:border-slate-200 hover:bg-white"
                }`}
              >
                <div
                  onClick={() => onSelectConversation(conversation)}
                  className="cursor-pointer space-y-1"
                >
                  <h3 className="truncate font-semibold text-slate-900">
                    {conversation.title}
                  </h3>

                  <p className="truncate text-sm text-slate-500">
                    {conversation.lastMessage || "No messages yet"}
                  </p>
                </div>

                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => onRenameConversation(conversation)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Rename
                  </button>

                  <button
                    onClick={() => onDeleteConversation(conversation._id)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-100"
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
