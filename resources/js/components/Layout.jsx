import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from './NotificationCenter';

export default function Layout() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {!isAuthPage && (
                <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="flex-shrink-0 flex items-center">
                                    <Link to="/" className="flex items-center gap-2 group">
                                        <span className="text-2xl font-black text-indigo-600 tracking-tighter font-heading">SIGREM<span className="text-slate-900"></span></span>
                                    </Link>
                                </div>
                                <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                                    {user && (
                                        <div className="flex space-x-8 text-sm font-medium">
                                            <Link to="/dashboard" className={`inline-flex items-center px-1 pt-1 border-b-2 transition-colors ${location.pathname === '/dashboard' ? 'border-indigo-600 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                                                Tableau de bord
                                            </Link>
                                            {user.role === 'patient' && (
                                                <Link to="/my-appointments" className={`inline-flex items-center px-1 pt-1 border-b-2 transition-colors ${location.pathname === '/my-appointments' ? 'border-indigo-600 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                                                    Mes rendez-vous
                                                </Link>
                                            )}
                                            {user.role === 'admin' && (
                                                <Link to="/admin-users" className={`inline-flex items-center px-1 pt-1 border-b-2 transition-colors ${location.pathname === '/admin-users' ? 'border-indigo-600 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                                                    Utilisateurs
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {user ? (
                                    <div className="flex items-center gap-4">
                                        <NotificationCenter />
                                        <div className="hidden md:flex flex-col items-end">
                                            <span className="text-sm font-semibold text-slate-900 leading-none">{user.name}</span>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{user.role}</span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="ml-4 text-sm font-medium text-red-600 hover:text-red-500 transition-colors"
                                        >
                                            Déconnexion
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Connexion</Link>
                                        <Link to="/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm active:scale-95 transition-all">
                                            S'inscrire
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            <main className={`flex-grow ${isAuthPage ? "" : "py-12"}`}>
                <div className={isAuthPage ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
                    <Outlet />
                </div>
            </main>

            {!isAuthPage && (
                <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-black text-indigo-600 tracking-tighter font-heading">SIGREM<span className="text-slate-900">.</span></span>
                                </div>
                                <p className="text-slate-500 text-sm max-w-xs">
                                    La plateforme de confiance pour la gestion de vos rendez-vous médicaux en toute simplicité.
                                </p>
                            </div>
                            <div className="flex flex-col items-center md:items-end gap-2">
                                <p className="text-sm text-slate-400">
                                    &copy; {new Date().getFullYear()} Sigrem. Tous droits réservés.
                                </p>
                                <div className="flex gap-4 text-xs font-medium text-slate-500">
                                    <a href="#" className="hover:text-indigo-600">Confidentialité</a>
                                    <a href="#" className="hover:text-indigo-600">Conditions</a>
                                    <a href="#" className="hover:text-indigo-600">Contact</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}
