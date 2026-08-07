function EmptyState({
  title = "No items found",
  description = "Get started by adding a new item to your workspace.",
  icon = "empty",
  actionElement = null,
}) {
  const getIcon = () => {
    switch (icon) {
      case "goals":
        return (
          <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case "sessions":
        return (
          <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case "roadmaps":
        return (
          <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        );
      case "empty":
      default:
        return (
          <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-.707-.293H4" />
          </svg>
        );
    }
  };

  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center max-w-xl mx-auto flex flex-col items-center justify-center space-y-4 shadow-sm animate-fadeIn">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 border border-slate-100">
        {getIcon()}
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
        <p className="mt-1.5 text-sm text-slate-500 max-w-sm leading-relaxed">{description}</p>
      </div>
      {actionElement && <div className="pt-2">{actionElement}</div>}
    </div>
  );
}

export default EmptyState;
