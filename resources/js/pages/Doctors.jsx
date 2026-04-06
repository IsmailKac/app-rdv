import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        name: '',
        specialty_id: '',
        location: ''
    });

    useEffect(() => {
        fetchSpecialties();
        fetchDoctors();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchDoctors();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [filters]);

    const fetchSpecialties = async () => {
        try {
            const { data } = await api.get('/specialties');
            setSpecialties(data);
        } catch (error) {
            console.error("Failed to fetch specialties", error);
        }
    };

    const fetchDoctors = async () => {
        const params = new URLSearchParams();
        if (filters.name) params.append('name', filters.name);
        if (filters.specialty_id) params.append('specialty_id', filters.specialty_id);
        if (filters.location) params.append('location', filters.location);

        try {
            setLoading(true);
            const { data } = await api.get(`/doctors?${params.toString()}`);
            setDoctors(data);
        } catch (error) {
            console.error("Failed to fetch doctors", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <div className="flex items-center gap-3 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                        Réseau Médical Premium
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 font-heading tracking-tight mb-4">
                        Trouver un <span className="text-indigo-600">Spécialiste</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">
                        Prenez rendez-vous en quelques clics avec les meilleurs professionnels de santé certifiés et vérifiés.
                    </p>
                </header>

                {/* Refined Search Container */}
                <div className="glass-card p-10 bg-white/80 border border-white mb-16 shadow-premium relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-2xl pointer-events-none"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span className="opacity-70">🔍</span> Nom du médecin
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="ex: Dr. Martin..."
                                value={filters.name}
                                onChange={handleFilterChange}
                                className="human-input group-hover:border-indigo-100 transition-colors bg-white/50 backdrop-blur-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span className="opacity-70">🩺</span> Spécialité
                            </label>
                            <select
                                name="specialty_id"
                                value={filters.specialty_id}
                                onChange={handleFilterChange}
                                className="human-input group-hover:border-indigo-100 transition-colors bg-white/50 backdrop-blur-sm cursor-pointer"
                            >
                                <option value="">Toutes les spécialités</option>
                                {specialties.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span className="opacity-70">📍</span> Localisation
                            </label>
                            <input
                                type="text"
                                name="location"
                                placeholder="ex: Paris, Lyon..."
                                value={filters.location}
                                onChange={handleFilterChange}
                                className="human-input group-hover:border-indigo-100 transition-colors bg-white/50 backdrop-blur-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-80">
                        <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-slate-200 border-b-indigo-600 mb-4" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recherche en cours...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {doctors.map((doctor, index) => (
                            <div
                                key={doctor.id}
                                className="human-card flex flex-col group animate-fade-in-up hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.15)] duration-500 bg-white"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="p-8">
                                    <div className="flex items-start justify-between mb-6 relative">
                                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-2xl font-heading shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 z-10 relative">
                                            {doctor.name.charAt(0)}
                                        </div>
                                        <div className="absolute top-2 left-2 w-16 h-16 bg-indigo-400/20 rounded-2xl blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500 -z-0"></div>
                                        
                                        <div className="flex flex-col items-end gap-2 relative z-10">
                                            <span className="human-badge human-badge-emerald shadow-sm">
                                                ✅ Vérifié
                                            </span>
                                            <div className="flex items-center text-amber-500 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100/50 shadow-sm">
                                                <span className="text-xs font-black mr-1.5">
                                                    {Number(doctor.doctor_profile?.reviews_avg_rating || 0).toFixed(1)}
                                                </span>
                                                <span className="text-[10px]">★</span>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-extrabold text-slate-900 font-heading mb-1 tracking-tight group-hover:text-indigo-700 transition-colors">
                                        Dr. {doctor.name}
                                    </h3>
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6">
                                        {doctor.doctor_profile?.specialty?.name || 'Médecin Généraliste'}
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex flex-col text-sm text-slate-500 font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group-hover:border-slate-200 transition-colors relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-indigo-50 to-transparent opacity-50 rounded-bl-full pointer-events-none"></div>
                                            <div className="flex items-start mb-2">
                                                <span className="mr-3 text-lg opacity-70">📍</span>
                                                <span className="leading-tight">{doctor.doctor_profile?.office_address || 'Consultation en ligne'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto p-8 pt-0 relative z-10">
                                    <Link
                                        to={`/book/${doctor.id}`}
                                        className="human-button-primary w-full py-4 text-base shadow-indigo-100"
                                    >
                                        Prendre rendez-vous
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {doctors.length === 0 && (
                            <div className="col-span-full human-card p-20 text-center bg-slate-50/50 border-dashed">
                                <div className="text-5xl mb-6 opacity-30">🔍</div>
                                <h3 className="text-2xl font-bold text-slate-900 font-heading mb-2">Aucun médecin trouvé</h3>
                                <p className="text-slate-500 font-medium max-w-sm mx-auto">
                                    Nous n'avons trouvé aucun résultat pour vos critères. Essayez d'ajuster les filtres ou la localisation.
                                </p>
                                <button
                                    onClick={() => setFilters({ name: '', specialty_id: '', location: '' })}
                                    className="mt-8 text-indigo-600 font-bold hover:underline"
                                >
                                    Effacer tous les filtres
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
