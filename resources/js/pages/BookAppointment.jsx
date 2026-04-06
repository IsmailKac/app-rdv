import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import moment from 'moment';

export default function BookAppointment() {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [doctor, setDoctor] = useState(null);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [lastAppointmentId, setLastAppointmentId] = useState(null);

    useEffect(() => {
        fetchDoctorAndSlots();
    }, [doctorId]);

    const fetchDoctorAndSlots = async () => {
        try {
            setLoading(true);
            const doctorRes = await api.get(`/doctors/${doctorId}`);
            setDoctor(doctorRes.data);

            const slotsRes = await api.get(`/slots?doctor_id=${doctorRes.data.doctor_profile?.id}`);
            const fetchedSlots = slotsRes.data;
            setSlots(fetchedSlots);

            if (fetchedSlots.length > 0) {
                const firstDate = moment(fetchedSlots[0].start_time).format('YYYY-MM-DD');
                setSelectedDate(firstDate);
            }
        } catch (error) {
            console.error("Failed to fetch doctor details", error);
            setMessage({ type: 'error', text: 'Échec du chargement des détails du médecin.' });
        } finally {
            setLoading(false);
        }
    };

    const availableDates = [...new Set(slots.map(slot => moment(slot.start_time).format('YYYY-MM-DD')))].sort();
    const filteredSlots = slots.filter(slot => moment(slot.start_time).format('YYYY-MM-DD') === selectedDate);

    const handleBook = async (slotId) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            setBooking(true);
            const response = await api.post('/appointments', {
                slot_id: slotId,
                notes: notes
            });
            setLastAppointmentId(response.data.id);
            setMessage({ type: 'success', text: 'Rendez-vous réservé avec succès !' });
            setNotes('');
            fetchDoctorAndSlots();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Échec de la réservation.' });
        } finally {
            setBooking(false);
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Chargement...</p>
        </div>
    );

    if (!doctor) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-900">Médecin non trouvé</h2>
            <button onClick={() => navigate('/doctors')} className="mt-4 text-indigo-600 hover:underline">
                Retour à la recherche
            </button>
        </div>
    );

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-0 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-[0%] left-[-10%] w-[500px] h-[500px] bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
                <div className="absolute bottom-[0%] right-[-10%] w-[600px] h-[600px] bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Doctor Brief Card */}
                <div className="glass-card p-10 bg-white/80 border border-white mb-12 animate-fade-in-up duration-500 shadow-premium">
                    <div className="sm:flex items-center gap-8">
                        <div className="h-28 w-28 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-extrabold text-5xl shadow-[0_20px_40px_-15px_rgba(79,70,229,0.5)] font-heading ring-4 ring-white">
                            {doctor.name.charAt(0)}
                        </div>
                        <div className="mt-6 sm:mt-0 flex-1">
                            <div className="flex items-center gap-3 text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">
                                <span className="h-2 w-2 rounded-full bg-indigo-600 shadow-[0_0_10px_2px_rgba(79,70,229,0.5)]" />
                                Spécialiste hautement qualifié
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 font-heading tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-900 pb-1">
                                {doctor.name.startsWith('Dr.') ? doctor.name : `Dr. ${doctor.name}`}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6">
                                <span className="text-sm font-bold text-slate-600 flex items-center gap-2 bg-slate-100/50 px-4 py-2 rounded-xl border border-slate-200/50">
                                    <span className="text-lg opacity-70">🩺</span> {doctor.doctor_profile?.specialty?.name || 'Médecin Généraliste'}
                                </span>
                                <span className="text-sm font-bold text-slate-600 flex items-center gap-2 bg-slate-100/50 px-4 py-2 rounded-xl border border-slate-200/50">
                                    <span className="text-lg opacity-70">📍</span> {doctor.doctor_profile?.office_address || 'Consultation en ligne'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Date and Slots Selection */}
                    <div className="lg:col-span-2 space-y-12">
                        <section className="animate-in fade-in slide-in-from-left-4 duration-500">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <span className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
                                Choisir une date
                            </h3>
                            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                                {availableDates.map((date) => (
                                    <button
                                        key={date}
                                        onClick={() => setSelectedDate(date)}
                                        className={`flex-shrink-0 w-24 py-5 rounded-2xl border-2 transition-all duration-300 ${selectedDate === date
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 -translate-y-1'
                                            : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        <p className="text-[10px] uppercase font-bold mb-1 opacity-70 tracking-tighter">{moment(date).format('ddd')}</p>
                                        <p className="text-2xl font-black font-heading">{moment(date).format('DD')}</p>
                                        <p className="text-[10px] font-bold opacity-60">{moment(date).format('MMM')}</p>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="animate-in fade-in slide-in-from-left-4 duration-700">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <span className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                                Sélectionner un créneau
                            </h3>

                            {message && (
                                <div className={`mb-8 p-5 rounded-2xl border flex items-center gap-4 animate-in zoom-in-95 duration-300 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'
                                    }`}>
                                    <div className={`h-2 w-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                                    <div className="flex-1 flex justify-between items-center">
                                        <p className="text-sm font-bold">{message.text}</p>
                                        {message.type === 'success' && lastAppointmentId && (
                                            <button
                                                onClick={() => window.open(`/api/appointments/${lastAppointmentId}/download?token=${localStorage.getItem('token')}`, '_blank')}
                                                className="text-xs font-black bg-white px-4 py-2 rounded-lg shadow-sm border border-emerald-200 hover:shadow-md transition-shadow"
                                            >
                                                📄 Télécharger PDF
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {filteredSlots.length > 0 ? (
                                    filteredSlots.map((slot, idx) => (
                                        <button
                                            key={slot.id}
                                            onClick={() => handleBook(slot.id)}
                                            disabled={booking}
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                            className="p-5 border-2 border-slate-100 rounded-2xl bg-white hover:border-indigo-600 hover:bg-indigo-50/50 hover:text-indigo-600 transition-all duration-300 font-extrabold text-slate-900 disabled:opacity-50 animate-in fade-in zoom-in-90"
                                        >
                                            {moment(slot.start_time).format('HH:mm')}
                                        </button>
                                    ))
                                ) : (
                                    <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-2">Indisponible</p>
                                        <p className="text-slate-500 font-medium">Aucun créneau pour cette date.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Notes and Summary */}
                    <div className="lg:col-span-1">
                        <div className="glass-card p-8 bg-white/60 border border-white sticky top-12 space-y-8 shadow-soft">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Note (Optionnelle)</h3>
                                <textarea
                                    rows="4"
                                    className="human-input py-4 text-sm resize-none"
                                    placeholder="Détails de votre consultation..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="pt-8 border-t border-slate-100">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Récapitulatif</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-500">Consultation</span>
                                        <span className="font-exrabold text-slate-900 font-heading">150.00 DH</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-500">Frais de service</span>
                                        <span className="text-sm font-extrabold text-emerald-600 font-heading">Gratuit</span>
                                    </div>
                                    <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center text-lg">
                                        <span className="font-extrabold text-slate-900 font-heading">Total</span>
                                        <span className="font-black text-indigo-600 font-heading">150.00 DH</span>
                                    </div>
                                </div>
                                <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] text-slate-400 font-medium leading-relaxed italic">
                                    En réservant, vous acceptez nos conditions de service et l'envoi de rappels automatiques.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
