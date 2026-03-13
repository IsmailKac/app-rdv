import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Identifiants invalides');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-8">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-3 transition-transform">
                            <span className="text-white text-2xl font-extrabold font-heading">S</span>
                        </div>
                        <span className="text-3xl font-extrabold text-slate-900 font-heading tracking-tight">Sigrem</span>
                    </Link>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
                    Bon retour parmi nous
                </h2>
                <p className="mt-3 text-center text-sm text-slate-500 font-medium">
                    Pas encore de compte ?{' '}
                    <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-bold decoration-2 underline-offset-4 hover:underline">
                        Créer un accès gratuit
                    </Link>
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md transition-all duration-500 animate-in fade-in zoom-in-95">
                <div className="bg-white py-10 px-8 shadow-xl shadow-slate-200/50 sm:rounded-2xl border border-slate-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                <div className="text-sm font-bold text-red-800">{error}</div>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Adresse email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="human-input"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-bold text-slate-700">
                                    Mot de passe
                                </label>
                                <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-500">
                                    Oublié ?
                                </a>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="human-input"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-slate-600 cursor-pointer">
                                Se souvenir de moi
                            </label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="human-button-primary w-full py-3.5 text-base font-extrabold shadow-indigo-200 hover:shadow-lg"
                            >
                                Se connecter
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400 font-medium italic">
                            Accès sécurisé par cryptage de bout en bout.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
