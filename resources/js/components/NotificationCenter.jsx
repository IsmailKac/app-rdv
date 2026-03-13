import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import moment from 'moment';

export default function NotificationCenter() {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const checkReminders = async () => {
        try {
            const { data } = await api.post('/notifications/check');
            setNotifications(data);
        } catch (error) {
            console.error("Failed to check reminders", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        checkReminders();

        // Poll for new notifications every 5 minutes
        const interval = setInterval(() => {
            checkReminders();
        }, 300000);

        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, is_read: true } : n
            ));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.post('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all active:scale-95 group"
            >
                <span className="text-xl group-hover:rotate-12 transition-transform">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white ring-2 ring-white shadow-lg shadow-indigo-100">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDropdown(false)}
                    ></div>
                    <div className="absolute right-0 mt-4 w-96 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h3 className="font-extrabold text-slate-900 font-heading text-base tracking-tight">Notifications</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Mises à jour récentes</p>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 transition-colors"
                                >
                                    Tout marquer
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto scrollbar-hide py-2">
                            {notifications.length === 0 ? (
                                <div className="p-16 text-center">
                                    <span className="text-4xl block mb-4 opacity-30">✨</span>
                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest opacity-60">Tout est à jour</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {notifications.map((n, idx) => (
                                        <div
                                            key={n.id}
                                            className={`px-8 py-5 hover:bg-slate-50/80 transition-all cursor-pointer group animate-in slide-in-from-left-2 duration-300`}
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                            onClick={() => !n.is_read && markAsRead(n.id)}
                                        >
                                            <div className="flex gap-4">
                                                <div className={`mt-2 h-2 w-2 rounded-full shrink-0 transition-all duration-500 ${!n.is_read ? 'bg-indigo-600 shadow-lg shadow-indigo-200 scale-125' : 'bg-slate-200 group-hover:bg-slate-300'}`}></div>
                                                <div className="flex-1">
                                                    <p className={`text-sm leading-relaxed ${!n.is_read ? 'text-slate-900 font-extrabold' : 'text-slate-500 font-medium'}`}>
                                                        {n.message}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="h-0.5 w-3 bg-slate-100" />
                                                        <span className="text-[10px] font-bold text-slate-400">
                                                            {moment(n.created_at).fromNow()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-50 text-center">
                            <button
                                onClick={() => setShowDropdown(false)}
                                className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
                            >
                                Fermer le menu
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
