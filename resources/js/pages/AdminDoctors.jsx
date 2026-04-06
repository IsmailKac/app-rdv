import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function AdminDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await api.get('/admin/doctors/pending');
                setDoctors(data);
            } catch (error) {
                console.error("Error fetching pending doctors:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const handleVerify = async (id) => {
        setVerifying(id);
        try {
            await api.patch(`/admin/doctors/${id}/verify`);
            setDoctors(doctors.filter(d => d.id !== id));
        } catch (error) {
            console.error("Error verifying doctor:", error);
        } finally {
            setVerifying(null);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen relative font-sans selection:bg-indigo-300 overflow-hidden">
            {/* Ambient Background Gradient Meshes */}
            <div className="fixed inset-0 bg-slate-50 pointer-events-none -z-10">
                 <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[150px]"></div>
                 <div className="absolute top-[20%] -right-40 w-[600px] h-[600px] bg-emerald-200/30 rounded-full mix-blend-multiply filter blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto pt-10 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
                <header className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6 animate-fade-in-down">
                    <div className="relative">
                        <Link to="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 hover:bg-white hover:text-indigo-600 transition-colors">
                            <span>&larr;</span> Retour au portail
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 font-heading tracking-tight leading-none drop-shadow-sm">
                            Vérification des Médecins
                        </h1>
                        <p className="text-sm font-bold text-slate-500 mt-4 max-w-lg">
                            Examinez et validez les accès des praticiens inscrits sur la plateforme pour garantir un environnement de confiance.
                        </p>
                    </div>
                </header>

                {doctors.length === 0 ? (
                    <div className="glass-card p-20 text-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] bg-white/80 animate-fade-in-up border-none relative overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-300/20 rounded-full blur-[80px] pointer-events-none"></div>
                        <div className="text-[5rem] mb-6 inline-block bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 animate-float">✨</div>
                        <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight font-heading relative z-10">Tout est à jour !</h3>
                        <p className="text-slate-500 text-lg font-medium relative z-10">Aucun profil médical n'est en attente d'approbation pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {doctors.map((doctor, index) => (
                            <div key={doctor.id} className="glass-card bg-white p-8 flex flex-col justify-between animate-fade-in-up hover:-translate-y-2 duration-500 group border-transparent hover:border-indigo-200 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.2)]" style={{ animationDelay: `${index * 50}ms` }}>
                                <div className="relative">
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-colors duration-500 -z-10 pointer-events-none"></div>
                                    
                                    <div className="flex items-start justify-between mb-8">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                                            Nouvelle inscription
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                            {new Date(doctor.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-5 mb-8">
                                         <div className="h-16 w-16 rounded-[20px] bg-gradient-to-br from-indigo-50 to-indigo-100/80 border border-indigo-200 flex items-center justify-center text-indigo-700 font-black text-2xl font-heading shadow-inner group-hover:scale-110 transition-transform">
                                            {doctor.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight group-hover:text-indigo-600 transition-colors">Dr. {doctor.name}</h3>
                                            <p className="text-xs font-bold text-slate-500">{doctor.email}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all text-sm font-medium">
                                        <div className="flex items-center text-slate-700">
                                            <span className="w-10 text-center text-lg drop-shadow-sm">📍</span>
                                            {doctor.doctor_profile?.office_address || <span className="text-slate-400 italic">Adresse non renseignée</span>}
                                        </div>
                                        <div className="h-px w-full bg-slate-100"></div>
                                        <div className="flex items-center text-slate-700">
                                            <span className="w-10 text-center text-lg drop-shadow-sm">🩺</span>
                                            <span className="font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-md">
                                                {doctor.doctor_profile?.specialty?.name || <span className="text-slate-400 italic font-normal bg-transparent px-0">Non spécifiée</span>}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <button
                                        onClick={() => handleVerify(doctor.id)}
                                        disabled={verifying === doctor.id}
                                        className="relative w-full overflow-hidden human-button-primary !bg-slate-900 hover:!bg-indigo-600 disabled:opacity-50 border-none shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_-10px_rgba(79,70,229,0.5)] group/btn transition-all duration-300 py-4"
                                    >
                                        <div className="absolute inset-0 bg-white/20 w-0 group-hover/btn:w-full transition-all duration-500 ease-out z-0"></div>
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {verifying === doctor.id ? 'Activation...' : 'Approuver le profil'}
                                            {!verifying && <span className="group-hover/btn:translate-x-1 transition-transform">→</span>}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
