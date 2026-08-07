/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../services/notificationService";

function DashboardHeader() {
  const { token, user } = useAuth();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Derive current page name from path
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/goals":
        return "Goals";
      case "/roadmaps":
        return "Roadmaps";
      case "/study-session":
        return "Study Sessions";
      case "/ai-coach":
        return "AI Study Coach";
      case "/ai-roadmap":
        return "AI Roadmap";
      default:
        return "Workspace";
    }
  };

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await getNotifications(token);
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // Poll notifications every 30s or fetch on mount/token change
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [token]);

  // Sync/fetch when dropdown is opened to ensure fresh status
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Click outside detector
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id, token);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead(token);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id, token);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllNotifications(token);
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "warning":
        return (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-100">
            ⏳
          </span>
        );
      case "success":
        return (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-[#e2583e] border border-orange-100">
            🎉
          </span>
        );
      case "info":
      default:
        return (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
            🔥
          </span>
        );
    }
  };

  return (
    <header className="flex items-center justify-between border-b border-[#eef0f2] bg-white/90 px-6 py-4 backdrop-blur-md sticky top-0 z-40 shadow-sm shadow-zinc-100/50">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* User Info Capsule */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#eef0f2] bg-[#f8f9fa] px-3.5 py-1.5 text-sm text-zinc-600">
          <span className="h-2 w-2 rounded-full bg-[#e2583e] animate-pulse"></span>
          <span>Hello, <strong>{user?.name || "Learner"}</strong></span>
        </div>

        {/* Notifications Icon and Dropdown Panel */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#eef0f2] bg-white text-zinc-650 shadow-sm transition hover:bg-[#f8f9fa] hover:text-zinc-950 active:scale-95 cursor-pointer"
            aria-label="Notifications"
          >
            <svg
              className="h-5.5 w-5.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#e2583e] text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Box */}
          {isOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 origin-top-right rounded-3xl border border-[#eef0f2] bg-white p-4 shadow-xl shadow-zinc-200/50 ring-1 ring-black/5 focus:outline-none transition-all">
              <div className="flex items-center justify-between border-b border-[#eef0f2] pb-3">
                <div>
                  <h3 className="font-bold text-zinc-950">Notifications</h3>
                  <p className="text-xs text-zinc-500">
                    {unreadCount} unread alert{unreadCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs font-semibold text-[#e2583e] hover:text-[#c8452d] transition cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-xs font-semibold text-zinc-500 hover:text-zinc-700 transition cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-3 max-h-80 overflow-y-auto space-y-2.5 pr-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-zinc-400">
                    <p className="text-2xl mb-1">🔔</p>
                    All caught up! No notifications.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => !notif.read && handleMarkRead(notif._id)}
                      className={`group relative flex items-start gap-3 rounded-2xl p-3 border transition cursor-pointer ${
                        notif.read
                          ? "bg-[#f8f9fa]/50 border-[#eef0f2] hover:bg-[#f8f9fa]"
                          : "bg-orange-500/5 border-orange-500/10 hover:bg-orange-500/10"
                      }`}
                    >
                      {getNotificationIcon(notif.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm ${
                              notif.read
                                ? "font-semibold text-zinc-700"
                                : "font-extrabold text-zinc-950"
                            }`}
                          >
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-zinc-400">
                            {new Date(notif.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-zinc-500 leading-relaxed pr-4">
                          {notif.message}
                        </p>
                      </div>

                      {/* Small inline delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notif._id);
                        }}
                        className="absolute right-2 top-2 hidden group-hover:flex items-center justify-center h-5 w-5 rounded-full bg-zinc-100 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition"
                        title="Delete notification"
                      >
                        &times;
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
