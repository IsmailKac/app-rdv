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
        <div className="min-h-screen flex font-sans selection:bg-indigo-200">
            {/* Left Column: Form */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center py-12 px-8 sm:px-16 lg:px-20 bg-white relative z-10 shadow-2xl">
                <div className="w-full max-w-md mx-auto animate-fade-in-up">
                    <div className="flex justify-start mb-12">
                        <Link to="/" className="flex items-center gap-4 group">
                            <img src="/images/logo.png" alt="Sigrem Logo" className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md" />
                            <span className="text-4xl font-extrabold text-slate-900 font-heading tracking-tight drop-shadow-sm">Sigrem</span>
                        </Link>
                    </div>

                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight font-heading drop-shadow-sm mb-3">
                        Bon retour 👋
                    </h2>
                    <p className="text-sm font-medium text-slate-500 mb-10">
                        Pas encore de compte ?{' '}
                        <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-black decoration-2 underline-offset-4 hover:underline transition-all">
                            Créer un accès gratuit
                        </Link>
                    </p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-2xl bg-red-50 p-4 border border-red-100 flex items-center gap-3 animate-fade-in-up">
                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                <div className="text-sm font-bold text-red-800">{error}</div>
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                Adresse email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="human-input bg-slate-50/50 hover:bg-white focus:bg-white"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
                                    Mot de passe
                                </label>
                                <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4 transition-all">
                                    Oublié ?
                                </a>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="human-input bg-slate-50/50 hover:bg-white focus:bg-white"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center pt-2 pb-4">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-5 w-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-all"
                            />
                            <label htmlFor="remember-me" className="ml-3 block text-sm font-bold text-slate-600 cursor-pointer">
                                Se souvenir de moi
                            </label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="human-button-primary w-full py-4 text-base shadow-indigo-300/50"
                            >
                                Se connecter
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
                            <span>🔒</span> Accès sécurisé par cryptage de bout en bout.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column: Image */}
            <div className="hidden lg:block lg:w-[55%] relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/90 to-emerald-900/60 z-10 mix-blend-multiply"></div>
                <img src="/images/app-preview.png" alt="Medical App" className="absolute inset-0 w-full h-full object-cover scale-105" />
                
                {/* Decorative Overlays */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/20 blur-[150px] rounded-full z-10 pointer-events-none"></div>

                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-center p-24 text-white">
                    <div className="max-w-xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <h2 className="text-5xl md:text-6xl font-extrabold font-heading mb-8 tracking-tight leading-tight drop-shadow-xl">
                            Votre santé,<br/>entre de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-100">bonnes mains.</span>
                        </h2>
                        <ul className="space-y-6 text-lg font-medium text-slate-200">
                            <li className="flex items-center gap-4">
                                <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20">📅</span>
                                Prenez rendez-vous 24h/24 et 7j/7
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20">📁</span>
                                Gérez l'historique de vos consultations
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20">🔍</span>
                                Trouvez les meilleurs praticiens
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
