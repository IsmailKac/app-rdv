import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import moment from 'moment';
import DoctorCalendar from '../components/DoctorCalendar';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user, setUser } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [adminStats, setAdminStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [profileForm, setProfileForm] = useState({
        bio: user?.doctor_profile?.bio || '',
        office_address: user?.doctor_profile?.office_address || ''
    });
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    useEffect(() => {
        if (user?.doctor_profile) {
            setProfileForm({
                bio: user.doctor_profile.bio || '',
                office_address: user.doctor_profile.office_address || ''
            });
        }
    }, [user]);
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                if (user.role === 'admin') {
                    const { data } = await api.get('/admin/stats');
                    setAdminStats(data);
                    setAppointments(data.recent_appointments || []);
                } else {
                    const { data } = await api.get('/appointments');
                    setAppointments(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error("Dashboard data fetch error:", error);
                setAppointments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    const renderStatCard = (title, value, icon, colorClass) => (
        <div className="human-card p-6 flex items-center gap-5 group">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-transform group-hover:scale-110 duration-300 ${colorClass}`}>
                {icon}
            </div>
            <div>
                <dt className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</dt>
                <dd className="text-2xl font-extrabold text-slate-900 font-heading">{value}</dd>
            </div>
        </div>
    );

    const renderAdminView = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {renderStatCard("Utilisateurs", adminStats?.total_users || 0, "👥", "bg-indigo-50 text-indigo-600")}
                {renderStatCard("Rendez-vous", adminStats?.total_appointments || 0, "📅", "bg-emerald-50 text-emerald-600")}
                <div className="human-card p-6 bg-indigo-600 border-indigo-600 text-white flex flex-col justify-between group">
                    <div>
                        <h3 className="text-xs font-bold text-indigo-100 uppercase tracking-widest mb-1">Centre de Contrôle</h3>
                        <p className="text-lg font-bold">Vérification des Médecins</p>
                    </div>
                    <Link to="/admin-doctors" className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-white text-indigo-600 text-sm font-extrabold rounded-lg shadow-lg hover:shadow-indigo-400/20 active:scale-95 transition-all">
                        Accéder maintenant
                    </Link>
                </div>
            </div>

            {/* Analytics Section */}
            {adminStats && (
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="human-card p-8">
                        <h3 className="text-lg font-bold text-slate-900 font-heading mb-6">Statut des Rendez-vous</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Confirmés', value: adminStats.appointments_by_status?.confirmed || 0, color: 'bg-emerald-500', bg: 'bg-emerald-100' },
                                { label: 'En attente', value: adminStats.appointments_by_status?.pending || 0, color: 'bg-amber-500', bg: 'bg-amber-100' },
                                { label: 'Annulés', value: adminStats.appointments_by_status?.cancelled || 0, color: 'bg-red-500', bg: 'bg-red-100' },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <div className="flex justify-between text-sm font-bold text-slate-600 mb-1">
                                        <span>{stat.label}</span>
                                        <span>{stat.value}</span>
                                    </div>
                                    <div className={`h-3 w-full rounded-full ${stat.bg} overflow-hidden`}>
                                        <div
                                            className={`h-full rounded-full ${stat.color} transition-all duration-1000 ease-out`}
                                            style={{ width: `${(stat.value / (adminStats.total_appointments || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="human-card p-8">
                        <h3 className="text-lg font-bold text-slate-900 font-heading mb-6">Top Spécialités</h3>
                        <div className="space-y-3">
                            {adminStats.top_specialties?.map((spec, index) => (
                                <div key={spec.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 h-8 w-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <span className="font-bold text-slate-700">{spec.name}</span>
                                    </div>
                                    <div className="text-sm font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                        {spec.appointments_count} RDV
                                    </div>
                                </div>
                            ))}
                            {(!adminStats.top_specialties || adminStats.top_specialties.length === 0) && (
                                <p className="text-slate-400 italic text-sm text-center py-4">Pas assez de données.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="human-card overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
                    <h3 className="text-lg font-bold text-slate-900 font-heading">Activité de la plateforme</h3>
                    <Link to="/admin-doctors" className="text-xs font-bold text-indigo-600 hover:underline underline-offset-4">Voir tout</Link>
                </div>
                {renderAppointmentList()}
            </div>
        </div>
    );

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setUpdatingProfile(true);
        setStatusMessage(null);
        try {
            const { data } = await api.put('/doctor/profile', profileForm);
            setUser(data);
            setIsProfileModalOpen(false);
            setStatusMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
            setTimeout(() => setStatusMessage(null), 3000);
        } catch (error) {
            console.error("Profile update error:", error);
            setStatusMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil.' });
        } finally {
            setUpdatingProfile(false);
        }
    };

    const renderDoctorView = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="human-card p-8 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 select-none">🩺</div>
                <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-100">
                    <div className="h-16 w-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg shadow-emerald-100 font-bold font-heading">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
                            Bonjour, {user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`}
                        </h2>
                        <p className="text-slate-500 font-medium">
                            Planifié pour aujourd'hui : <span className="text-emerald-600 font-bold">{appointments.filter(a => a.status === 'confirmed').length} consultations</span>
                        </p>
                    </div>
                </div>

                {statusMessage && (
                    <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 animate-in zoom-in-95 duration-300 ${statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                        <div className={`h-2 w-2 rounded-full ${statusMessage.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                        <p className="text-sm font-bold">{statusMessage.text}</p>
                    </div>
                )}

                <div className="flex flex-wrap gap-4 mb-8">
                    <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="human-button-primary text-xs px-6 py-3 flex items-center gap-2">
                        <span>📝</span> Modifier le Profil
                    </button>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <DoctorCalendar />
                </div>
            </div>

            <div className="human-card overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-white">
                    <h3 className="text-lg font-bold text-slate-900 font-heading">Historique des consultations</h3>
                </div>
                {renderAppointmentList()}
            </div>
        </div>
    );

    const renderPatientView = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="human-card p-10 bg-indigo-600 border-indigo-600 relative overflow-hidden shadow-xl shadow-indigo-100">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white opacity-[0.05] rounded-full" />
                <div className="relative z-10">
                    <h2 className="text-3xl font-extrabold text-white font-heading tracking-tight mb-2">Bonjour, {user.name} !</h2>
                    <p className="text-indigo-100 text-lg mb-8 max-w-xl opacity-90 leading-relaxed font-medium">
                        Votre santé est entre de bonnes mains. Trouvez un spécialiste et gérez vos soins en toute tranquillité.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link to="/doctors" className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-indigo-600 font-extrabold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                            Prendre rendez-vous
                        </Link>
                        <Link to="/my-appointments" className="inline-flex items-center px-6 py-3 rounded-xl bg-indigo-500 text-white font-extrabold text-sm hover:bg-indigo-400 transition-all">
                            Mes consultations
                        </Link>
                    </div>
                </div>
            </div>

            <div className="human-card overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
                    <h3 className="text-lg font-bold text-slate-900 font-heading tracking-tight">Récemment réservés</h3>
                    <Link to="/my-appointments" className="text-xs font-bold text-indigo-600 hover:underline underline-offset-4">Voir tout</Link>
                </div>
                {renderAppointmentList()}
            </div>
        </div>
    );

    const renderAppointmentList = () => (
        loading ? (
            <div className="p-20 text-center">
                <div className="flex justify-center mb-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-slate-200 border-b-indigo-600" />
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Chargement...</p>
            </div>
        ) : appointments.length === 0 ? (
            <div className="p-16 text-center">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-slate-500 font-medium mb-6">Aucun rendez-vous pour le moment.</p>
                <Link to="/doctors" className="human-button-primary text-xs px-6 py-3">Explorer les médecins</Link>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Contact</th>
                            <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Date & Heure</th>
                            <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center">Statut</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {appointments.slice(0, 5).map((appointment) => (
                            <tr key={appointment.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 group-hover:border-indigo-200 transition-colors">
                                            {(user.role === 'doctor' || user.role === 'admin' ? appointment.patient?.name : appointment.slot?.doctor?.user?.name)?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">
                                                {user.role === 'doctor' || user.role === 'admin' ? appointment.patient?.name : `Dr. ${appointment.slot?.doctor?.user?.name}`}
                                            </p>
                                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">
                                                {user.role === 'doctor' || user.role === 'admin' ? 'Patient' : (appointment.slot?.doctor?.specialty?.name || 'Spécialiste')}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-700">
                                            {moment(appointment.slot?.start_time).format('DD MMMM YYYY')}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            à {moment(appointment.slot?.start_time).format('HH:mm')}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${appointment.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                        appointment.status === 'completed' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                            'bg-slate-50 text-slate-500 border border-slate-100'
                                        }`}>
                                        {appointment.status === 'confirmed' ? 'Confirmé' : appointment.status === 'completed' ? 'Terminé' : appointment.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    );

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                            Session active
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
                            {user.role === 'admin' ? 'Administration' : 'Tableau de bord'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-xs font-bold text-slate-400">
                        <span>🕒 {moment().format('HH:mm')}</span>
                        <span className="text-slate-200">|</span>
                        <span>📅 {moment().format('DD MMM')}</span>
                    </div>
                </header>

                {user.role === 'admin' && renderAdminView()}
                {user.role === 'doctor' && renderDoctorView()}
                {user.role === 'patient' && renderPatientView()}
            </div>

            {/* Profile Edit Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="human-card w-full max-w-lg bg-white p-8 animate-in zoom-in-95 duration-300 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-extrabold text-slate-900 font-heading">Modifier mon profil</h3>
                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">Information publiques</p>
                            </div>
                            <button
                                onClick={() => setIsProfileModalOpen(false)}
                                className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 transition-colors">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Localisation du cabinet</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">📍</span>
                                    <input
                                        type="text"
                                        required
                                        className="human-input pl-12"
                                        placeholder="ex: 123 Rue de la Santé, Paris"
                                        value={profileForm.office_address}
                                        onChange={(e) => setProfileForm({ ...profileForm, office_address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Bio / Présentation</label>
                                <textarea
                                    className="human-input min-h-[150px] resize-none py-4"
                                    placeholder="Décrivez votre expérience et votre approche..."
                                    required
                                    value={profileForm.bio}
                                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsProfileModalOpen(false)}
                                    className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-100 text-slate-600 font-extrabold text-sm hover:bg-slate-50 transition-colors">
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={updatingProfile}
                                    className="flex-[2] human-button-primary py-4 disabled:opacity-50">
                                    {updatingProfile ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
