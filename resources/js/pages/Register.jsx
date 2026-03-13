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
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="flex justify-center mb-8">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:-rotate-3 transition-transform">
                            <span className="text-white text-2xl font-extrabold font-heading">S</span>
                        </div>
                        <span className="text-3xl font-extrabold text-slate-900 font-heading tracking-tight">Sigrem</span>
                    </Link>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
                    Créer votre compte gratuit
                </h2>
                <p className="mt-3 text-center text-sm text-slate-500 font-medium">
                    Vous avez déjà un compte ?{' '}
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-bold decoration-2 underline-offset-4 hover:underline">
                        Connectez-vous ici
                    </Link>
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-5">
                <div className="bg-white py-10 px-8 shadow-xl shadow-slate-200/50 sm:rounded-2xl border border-slate-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-center gap-3 animate-shake">
                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                <div className="text-sm font-bold text-red-800">{error}</div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nom Complet</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="human-input"
                                    placeholder="ex: Jean Dupont"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Adresse email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="human-input"
                                    placeholder="jean@exemple.fr"
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Choisir un profil</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('patient')}
                                    className={`p-3 rounded-lg border-2 transition-all font-bold text-sm ${role === 'patient' ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                                >
                                    Patient
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('doctor')}
                                    className={`p-3 rounded-lg border-2 transition-all font-bold text-sm ${role === 'doctor' ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                                >
                                    Médecin
                                </button>
                            </div>

                            {role === 'doctor' && (
                                <div className="pt-2 animate-in fade-in zoom-in-95 duration-300">
                                    <label className="block text-xs font-bold text-slate-500 mb-2">Votre Spécialité médicale</label>
                                    <select
                                        className="human-input py-2"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Mot de passe</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="human-input"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Confirmation</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className="human-input"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="human-button-primary w-full py-4 text-base font-extrabold shadow-indigo-200 hover:shadow-lg"
                            >
                                Créer mon compte
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-xs text-slate-400 leading-relaxed font-medium">
                        En vous inscrivant, vous acceptez nos <a href="#" className="text-indigo-500 hover:underline">Conditions d'Utilisation</a> et notre <a href="#" className="text-indigo-500 hover:underline">Politique de Confidentialité</a>.
                    </div>
                </div>
            </div>
        </div>
    );
}
