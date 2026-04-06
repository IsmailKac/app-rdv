import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from './NotificationCenter';

export default function Layout() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    const isHomePage = location.pathname === '/';
    const isFullWidthPage = isAuthPage || isHomePage;

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
                                    <Link to="/" className="flex items-center gap-3 group">
                                        <img src="/images/logo.png" alt="Sigrem Logo" className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm" />
                                        <span className="text-3xl font-extrabold text-slate-800 tracking-tight font-heading">Sigrem</span>
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
                                            <span className="text-sm font-bold text-slate-900 leading-none">{user.name}</span>
                                            <span className="text-[10px] text-indigo-600 uppercase tracking-widest font-black mt-1">{user.role}</span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="ml-4 text-sm font-black text-red-500 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl"
                                        >
                                            Déconnexion
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-5">
                                        <Link to="/login" className="text-sm font-extrabold text-slate-600 hover:text-indigo-600 transition-colors tracking-wide">Connexion</Link>
                                        <Link to="/register" className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl border border-transparent text-sm font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 hover:-translate-y-0.5 transform transition-all">
                                            S'inscrire
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            <main className={`flex-grow ${isFullWidthPage ? "" : "py-12"}`}>
                <div className={isFullWidthPage ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
                    <Outlet />
                </div>
            </main>

            {!isAuthPage && (
                <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 group cursor-pointer w-fit">
                                    <img src="/images/logo.png" alt="Sigrem Logo" className="h-10 w-auto object-contain opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
                                    <span className="text-2xl font-extrabold text-slate-400 group-hover:text-slate-600 tracking-tight font-heading transition-colors">Sigrem</span>
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
