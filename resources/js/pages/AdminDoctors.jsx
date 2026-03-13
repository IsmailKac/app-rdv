import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(null);
    const navigate = useNavigate();

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
            // Optional: Show success toast
        } catch (error) {
            console.error("Error verifying doctor:", error);
        } finally {
            setVerifying(null);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 font-heading">Vérification des Médecins</h1>
                    <p className="text-slate-500 mt-2">Validez les profils des nouveaux médecins inscrits.</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-slate-500 hover:text-indigo-600 font-bold transition-colors"
                >
                    &larr; Retour au Dashboard
                </button>
            </div>

            {doctors.length === 0 ? (
                <div className="human-card p-12 text-center">
                    <div className="text-6xl mb-6">✅</div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Tout est à jour !</h3>
                    <p className="text-slate-500">Aucun médecin en attente de vérification.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map(doctor => (
                        <div key={doctor.id} className="human-card p-6 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-4">
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide">
                                        Médecin
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">
                                        Inscrit le {new Date(doctor.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{doctor.name}</h3>
                                <p className="text-slate-500 text-sm mb-4">{doctor.email}</p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-sm text-slate-600">
                                        <span className="w-6 text-center mr-2">📍</span>
                                        {doctor.doctor_profile?.office_address || "Adresse non renseignée"}
                                    </div>
                                    <div className="flex items-center text-sm text-slate-600">
                                        <span className="w-6 text-center mr-2">🩺</span>
                                        {doctor.doctor_profile?.specialty?.name || "Spécialité non renseignée"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleVerify(doctor.id)}
                                    disabled={verifying === doctor.id}
                                    className="flex-1 bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {verifying === doctor.id ? 'Validation...' : 'Approuver'}
                                </button>
                                {/* Future: Reject button */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDoctors;
