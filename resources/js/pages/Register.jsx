import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [role, setRole] = useState('patient');
    const [specialties, setSpecialties] = useState([]);
    const [specialtyId, setSpecialtyId] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { register } = useAuth();

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const { data } = await api.get('/specialties');
                setSpecialties(data);
                if (data.length > 0) setSpecialtyId(data[0].id);
            } catch (err) {
                console.error("Failed to fetch specialties", err);
            }
        };
        fetchSpecialties();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await register(name, email, password, passwordConfirmation, role, role === 'doctor' ? specialtyId : null);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Inscription échouée');
        }
    };

    return (
        <div className="min-h-screen flex font-sans selection:bg-indigo-200">
            {/* Left Column: Form */}
            <div className="w-full lg:w-[50%] flex flex-col justify-center py-12 px-8 sm:px-16 bg-white relative z-10 shadow-2xl overflow-y-auto">
                <div className="w-full max-w-lg mx-auto animate-fade-in-up py-8">
                    <div className="flex justify-start mb-10">
                        <Link to="/" className="flex items-center gap-4 group">
                            <img src="/images/logo.png" alt="Sigrem Logo" className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md" />
                            <span className="text-4xl font-extrabold text-slate-900 font-heading tracking-tight drop-shadow-sm">Sigrem</span>
                        </Link>
                    </div>

                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight font-heading drop-shadow-sm mb-3">
                        Rejoignez-nous 🚀
                    </h2>
                    <p className="text-sm text-slate-500 font-medium mb-10">
                        Vous avez déjà un compte ?{' '}
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-black decoration-2 underline-offset-4 hover:underline transition-all">
                            Connectez-vous ici
                        </Link>
                    </p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-2xl bg-red-50 p-4 border border-red-100 flex items-center gap-3 animate-fade-in-up">
                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                <div className="text-sm font-bold text-red-800">{error}</div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nom Complet</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="human-input hover:border-indigo-300 focus:bg-white bg-slate-50/50"
                                    placeholder="ex: Jean Dupont"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Adresse email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="human-input hover:border-indigo-300 focus:bg-white bg-slate-50/50"
                                    placeholder="votre@email.com"
                                />
                            </div>
                        </div>

                        <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Je me connecte en tant que</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('patient')}
                                    className={`p-3 rounded-xl border-2 transition-all font-extrabold text-sm flex items-center justify-center gap-2 ${role === 'patient' ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200/50' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                                >
                                    <span>👤</span> Patient
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('doctor')}
                                    className={`p-3 rounded-xl border-2 transition-all font-extrabold text-sm flex items-center justify-center gap-2 ${role === 'doctor' ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200/50' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                                >
                                    <span>🩺</span> Médecin
                                </button>
                            </div>

                            {role === 'doctor' && (
                                <div className="pt-4 mt-4 border-t border-slate-200/60 animate-fade-in">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Spécialité médicale</label>
                                    <select
                                        className="human-input py-3 cursor-pointer bg-white"
                                        value={specialtyId}
                                        required
                                        onChange={(e) => setSpecialtyId(e.target.value)}
                                    >
                                        {specialties.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Mot de passe</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="human-input hover:border-indigo-300 focus:bg-white bg-slate-50/50"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Confirmer</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className="human-input hover:border-indigo-300 focus:bg-white bg-slate-50/50"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="human-button-primary w-full py-4 text-base shadow-indigo-300/50 hover:shadow-indigo-400/50"
                            >
                                Créer mon compte
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400 leading-relaxed font-semibold">
                        En vous inscrivant, vous acceptez nos <a href="#" className="text-indigo-500 hover:underline">Conditions d'Utilisation</a> et <a href="#" className="text-indigo-500 hover:underline">Politique de Confidentialité</a>.
                    </div>
                </div>
            </div>

            {/* Right Column: Image */}
            <div className="hidden lg:block lg:w-[50%] relative overflow-hidden bg-slate-900 border-l border-white/10">
                <div className="absolute inset-0 bg-gradient-to-bl from-indigo-900/90 to-purple-900/70 z-10 mix-blend-multiply"></div>
                <img src="/images/doctors.png" alt="Medical Team" className="absolute inset-0 w-full h-full object-cover grayscale-[20%]" />
                
                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/20 blur-[150px] rounded-full z-10 pointer-events-none"></div>

                <div className="absolute inset-0 z-20 flex flex-col justify-center p-24 text-white">
                    <div className="max-w-md animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <h2 className="text-5xl lg:text-6xl font-extrabold font-heading mb-8 tracking-tight leading-tight">
                            L'excellence médicale,<br/>à votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-200">portée.</span>
                        </h2>
                        <ul className="space-y-6 text-lg font-medium text-slate-200">
                            <li className="flex items-center gap-4">
                                <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20">🩺</span>
                                Profils médecins détaillés et vérifiés
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20">⚡</span>
                                Inscription rapide, sécurisée et 100% gratuite
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
