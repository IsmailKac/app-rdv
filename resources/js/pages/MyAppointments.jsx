import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function MyAppointments() {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [reviewModal, setReviewModal] = useState({ open: false, doctorId: null, appointmentId: null });
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/appointments');
            setAppointments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return;

        try {
            await api.post(`/appointments/${id}/cancel`);
            setMessage({ type: 'success', text: 'Rendez-vous annulé avec succès.' });
            fetchAppointments();
        } catch (error) {
            console.error("Cancel failed", error);
            setMessage({ type: 'error', text: 'Échec de l\'annulation du rendez-vous.' });
        }
    };


    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/reviews', {
                doctor_id: reviewModal.doctorId,
                rating: reviewForm.rating,
                comment: reviewForm.comment
            });
            setReviewModal({ open: false, doctorId: null, appointmentId: null });
            setReviewForm({ rating: 5, comment: '' });
            setMessage({ type: 'success', text: 'Merci pour votre avis !' });
            fetchAppointments();
        } catch (error) {
            alert("Échec de l'envoi de l'avis");
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Chargement de vos rendez-vous...</p>
        </div>
    );

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-0 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-[0%] right-[0%] w-[500px] h-[500px] bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
                <div className="absolute bottom-[0%] left-[-10%] w-[600px] h-[600px] bg-sky-300/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
            </div>
            <div className="max-w-4xl mx-auto relative z-10">
                <header className="mb-12 animate-fade-in-up">
                    <div className="flex items-center gap-3 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 shadow-[0_0_10px_2px_rgba(79,70,229,0.5)]" />
                        Historique de Santé
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 font-heading tracking-tight mb-4 drop-shadow-sm">
                        Mes <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">Consultations</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
                        Retrouvez ici toute l'activité de votre parcours de santé, gérez vos rendez-vous et donnez votre avis.
                    </p>
                </header>

                {message && (
                    <div className={`mb-10 p-5 rounded-2xl border flex items-center gap-4 animate-in zoom-in-95 duration-300 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'
                        }`}>
                        <div className={`h-2 w-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                        <p className="font-bold text-sm">{message.text}</p>
                    </div>
                )}

                {appointments.length === 0 ? (
                    <div className="glass-card p-24 text-center border border-white/60 shadow-soft">
                        <div className="text-6xl mb-8 animate-float inline-block">📅</div>
                        <h2 className="text-3xl font-extrabold text-slate-900 font-heading tracking-tight mb-4">Aucune réservation pour le moment.</h2>
                        <p className="text-slate-500 text-lg font-medium max-w-md mx-auto mb-10 leading-relaxed">
                            Prenez votre premier rendez-vous en ligne avec l'un de nos spécialistes de santé certifiés.
                        </p>
                        <button
                            onClick={() => navigate('/doctors')}
                            className="human-button-primary px-10 py-5 text-base shadow-indigo-200/50 hover:shadow-indigo-300/50"
                        >
                            Explorer les médecins
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {appointments
                            .filter(appointment => appointment.status !== 'cancelled')
                            .map((appointment, idx) => (
                                <div
                                    key={appointment.id}
                                    className="glass-card bg-white/80 border border-white p-8 group animate-fade-in-up duration-500 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.15)] transition-all hover:-translate-y-1"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-2xl font-heading shadow-sm group-hover:scale-105 transition-transform duration-300">
                                                {appointment.slot?.doctor?.user?.name?.charAt(0) || 'D'}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-extrabold text-slate-900 font-heading tracking-tight mb-1">
                                                    Dr. {appointment.slot?.doctor?.user?.name || 'Spécialiste Médical'}
                                                </h3>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                                                        {appointment.slot?.doctor?.specialty?.name || 'Spécialiste'}
                                                    </span>
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${appointment.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                                        }`}>
                                                        {appointment.status === 'confirmed' ? 'Confirmé' : 'Terminé'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:items-end gap-3 pr-4">
                                            <div className="flex flex-col items-start md:items-end">
                                                <span className="text-sm font-bold text-slate-700">
                                                    {moment(appointment.slot?.start_time).format('DD MMMM YYYY')}
                                                </span>
                                                <span className="text-xs font-bold text-slate-400">
                                                    à {moment(appointment.slot?.start_time).format('HH:mm')}
                                                </span>
                                            </div>
                                            {appointment.status === 'confirmed' && (
                                                <button
                                                    onClick={() => window.open(`/api/appointments/${appointment.id}/download?token=${localStorage.getItem('token')}`, '_blank')}
                                                    className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-colors"
                                                >
                                                    📄 Télécharger PDF
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {appointment.notes && (
                                        <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Notes de consultation</span>
                                            <p className="text-sm text-slate-600 font-medium leading-relaxed">{appointment.notes}</p>
                                        </div>
                                    )}

                                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-6">
                                        <button
                                            onClick={() => setReviewModal({ open: true, doctorId: appointment.slot.doctor.id, appointmentId: appointment.id })}
                                            className="text-xs font-extrabold text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2"
                                        >
                                            <span>⭐</span> Évaluer la visite
                                        </button>
                                        {appointment.status !== 'completed' && (
                                            <button
                                                onClick={() => handleCancel(appointment.id)}
                                                className="text-xs font-extrabold text-red-400 hover:text-red-600 transition-colors flex items-center gap-2"
                                            >
                                                <span>✕</span> Annuler
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {/* REDESIGNED REVIEW MODAL */}
                {reviewModal.open && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fade-in duration-300" onClick={() => setReviewModal({ ...reviewModal, open: false })}></div>
                        <div className="relative bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-md overflow-hidden animate-fade-in-up duration-300">
                            <div className="p-8 pb-0">
                                <div className="h-14 w-14 bg-gradient-to-br from-amber-50 to-amber-100 rounded-[1.25rem] flex items-center justify-center text-3xl mb-6 shadow-inner border border-amber-200/50">⭐</div>
                                <h3 className="text-3xl font-extrabold text-slate-900 font-heading tracking-tight mb-2 drop-shadow-sm">Votre expérience</h3>
                                <p className="text-slate-500 font-medium text-sm">Votre avis aide les autres patients à choisir le bon spécialiste pour leur santé.</p>
                            </div>

                            <form onSubmit={handleReviewSubmit} className="p-8 space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Votre note</label>
                                    <div className="flex justify-between px-2">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => setReviewForm({ ...reviewForm, rating: num })}
                                                className={`text-4xl transition-all duration-300 ${reviewForm.rating >= num ? 'text-amber-400 scale-110' : 'text-slate-200 hover:text-slate-300'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Témoignage</label>
                                    <textarea
                                        rows="4"
                                        className="human-input py-4 text-sm resize-none"
                                        placeholder="Décrivez votre rendez-vous..."
                                        value={reviewForm.comment}
                                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="submit"
                                        className="flex-1 human-button-primary py-4 text-base"
                                    >
                                        Publier l'avis
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setReviewModal({ ...reviewModal, open: false })}
                                        className="px-6 py-4 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-all"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

