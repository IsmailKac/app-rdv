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
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
        </div>
    );

    const renderStatCard = (title, value, icon, colorClass, gradient, delay = 0) => (
        <div className="glass-card relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 animate-fade-in-up shadow-sm hover:shadow-premium border-white/50 bg-white" style={{ animationDelay: `${delay}s` }}>
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-20 transition-transform duration-700 group-hover:scale-150 ${gradient}`}></div>
            <div className="p-8 relative z-10 flex flex-col justify-between h-full">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-6 bg-slate-50 border border-slate-100 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500`}>
                    {icon}
                </div>
                <div>
                    <dt className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</dt>
                    <dd className={`text-4xl font-extrabold font-heading tracking-tight ${colorClass}`}>{value}</dd>
                </div>
            </div>
        </div>
    );

    const renderAdminView = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Bento Grid - 4 Columns Layout */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {renderStatCard("Utilisateurs", adminStats?.total_users || 0, "👥", "text-indigo-600", "bg-indigo-400")}
                {renderStatCard("Rendez-vous", adminStats?.total_appointments || 0, "📅", "text-emerald-600", "bg-emerald-400", 0.1)}
                
                {/* Wide Call-to-Action Card for Doctors Verification */}
                <div className="lg:col-span-2 glass-card p-8 bg-slate-900 border-none shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] text-white flex flex-col md:flex-row justify-between items-center group relative overflow-hidden hover:-translate-y-1 transition-all duration-500" style={{ animationDelay: '0.2s' }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-800/40 mix-blend-overlay pointer-events-none"></div>
                    <div className="absolute -top-40 -right-20 w-80 h-80 bg-indigo-500 rounded-full blur-[80px] opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700 pointer-events-none"></div>
                    
                    <div className="relative z-10 mb-6 md:mb-0">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_2px_rgba(52,211,153,0.5)]"></span>
                            <h3 className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Centre de Contrôle</h3>
                        </div>
                        <p className="text-3xl font-black font-heading text-white">Vérification Médicale</p>
                        <p className="text-sm text-indigo-200 mt-2 font-medium max-w-sm">Gérez et certifiez les nouveaux praticiens souhaitant rejoindre la plateforme Sigrem.</p>
                    </div>
                    <Link to="/admin-doctors" className="relative z-10 whitespace-nowrap inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 text-sm font-extrabold rounded-2xl shadow-xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all w-full md:w-auto">
                        Accéder au portail
                    </Link>
                </div>
            </div>

            {/* Analytics Section - Side by Side Bento */}
            {adminStats && (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Progress Bars */}
                    <div className="lg:col-span-2 glass-card p-10 bg-white">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-extrabold text-slate-900 font-heading">Statut des Rendez-vous</h3>
                            <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest">Temps Réel</div>
                        </div>
                        <div className="space-y-8">
                            {[
                                { label: 'Confirmés', value: adminStats.appointments_by_status?.confirmed || 0, color: 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]', bg: 'bg-emerald-50' },
                                { label: 'En attente', value: adminStats.appointments_by_status?.pending || 0, color: 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]', bg: 'bg-amber-50' },
                                { label: 'Annulés', value: adminStats.appointments_by_status?.cancelled || 0, color: 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]', bg: 'bg-red-50' },
                            ].map((stat) => (
                                <div key={stat.label} className="group">
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="text-sm font-extrabold text-slate-700 uppercase tracking-wide group-hover:text-slate-900 transition-colors">{stat.label}</span>
                                        <span className="text-2xl font-black text-slate-900 font-heading">{stat.value}</span>
                                    </div>
                                    <div className={`h-4 w-full rounded-full ${stat.bg} shadow-inner overflow-hidden`}>
                                        <div
                                            className={`h-full rounded-full ${stat.color} transition-all duration-1000 ease-out relative overflow-hidden`}
                                            style={{ width: `${(stat.value / (adminStats.total_appointments || 1)) * 100}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 w-full"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Specialties */}
                    <div className="glass-card p-10 bg-white shadow-premium relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-[40px] -z-10 pointer-events-none"></div>
                        <h3 className="text-2xl font-extrabold text-slate-900 font-heading mb-8">Top Spécialités</h3>
                        <div className="space-y-4">
                            {adminStats.top_specialties?.map((spec, index) => (
                                <div key={spec.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm shadow-sm
                                            ${index === 0 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                              index === 1 ? 'bg-slate-200 text-slate-700 border border-slate-300' :
                                              index === 2 ? 'bg-amber-900/10 text-amber-900 border border-amber-900/20' :
                                              'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                                            {index + 1}
                                        </div>
                                        <span className="font-extrabold text-slate-800">{spec.name}</span>
                                    </div>
                                    <div className="text-xs font-black text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-100 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                                        {spec.appointments_count}
                                    </div>
                                </div>
                            ))}
                            {(!adminStats.top_specialties || adminStats.top_specialties.length === 0) && (
                                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold text-sm">Données insuffisantes.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Activity List */}
            <div className="glass-card overflow-hidden bg-white">
                <div className="px-8 py-6 border-b border-slate-100/80 flex flex-col md:flex-row items-start md:items-center justify-between bg-white/80 backdrop-blur-md gap-4">
                    <div>
                        <h3 className="text-2xl font-extrabold text-slate-900 font-heading">Activité Récente</h3>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Derniers rendez-vous générés</p>
                    </div>
                    <Link to="/admin-users" className="human-button-secondary text-xs px-6 py-2 shadow-none border-2">Gérer les utilisateurs</Link>
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
            setStatusMessage({ type: 'error', text: 'Erreur lors de la mise à jour.' });
        } finally {
            setUpdatingProfile(false);
        }
    };

    const renderDoctorView = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* High-end Asymmetric Doctor Banner */}
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3 glass-card p-10 bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 border-none relative overflow-hidden shadow-[0_20px_40px_-15px_rgba(4,120,87,0.4)] group">
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                    <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-teal-400 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="h-20 w-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] flex items-center justify-center text-4xl text-white shadow-xl font-bold font-heading mb-8 group-hover:scale-105 transition-transform">
                                {user.name.charAt(0)}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white font-heading tracking-tight mb-2">
                                {user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`}
                            </h2>
                            <p className="text-emerald-200 font-medium text-sm leading-relaxed mb-8">
                                Gérez vos consultations et vos disponibilités depuis votre espace praticien.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-between">
                                <span className="text-xs text-emerald-200 uppercase tracking-widest font-bold">Consultations ce jour</span>
                                <span className="text-2xl font-black text-white">{appointments.filter(a => a.status === 'confirmed').length}</span>
                            </div>
                            <button
                                onClick={() => setIsProfileModalOpen(true)}
                                className="w-full human-button-primary bg-white text-emerald-900 hover:bg-emerald-50 border-none hover:-translate-y-0.5">
                                Modifier mon Profil
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:w-2/3 glass-card bg-white p-6 shadow-sm border border-slate-100">
                    <DoctorCalendar />
                </div>
            </div>

            {statusMessage && (
                <div className="glass-card p-4 flex items-center gap-4 bg-white animate-in zoom-in-95 duration-300">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl ${statusMessage.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                        {statusMessage.type === 'success' ? '✨' : '⚠️'}
                    </div>
                    <p className={`font-bold ${statusMessage.type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>{statusMessage.text}</p>
                </div>
            )}

            <div className="glass-card overflow-hidden bg-white">
                <div className="px-8 py-6 border-b border-slate-100/50 flex items-center justify-between bg-white/50 backdrop-blur-md">
                    <h3 className="text-2xl font-extrabold text-slate-900 font-heading">Historique clinique</h3>
                </div>
                {renderAppointmentList()}
            </div>
        </div>
    );

    const renderPatientView = () => (
        <div className="space-y-8 animate-in fade-in-up duration-500">
            {/* Bento Layout for Patient */}
            <div className="grid lg:grid-cols-3 gap-8 mb-10">
                <div className="lg:col-span-2 glass-card p-10 bg-slate-900 border-none relative overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] group min-h-[300px] flex flex-col justify-end text-white hover:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.4)] transition-all duration-500">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500 opacity-30 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-[1500ms] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-purple-600 opacity-20 rounded-full blur-[100px] group-hover:rotate-12 transition-transform duration-[2000ms] pointer-events-none" />
                    
                    <div className="absolute right-10 top-10 w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] flex items-center justify-center text-4xl shadow-xl transform rotate-12 group-hover:rotate-0 transition-transform duration-500 pointer-events-none">
                        ✨
                    </div>

                    <div className="relative z-10 w-full md:w-3/4">
                        <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 text-[10px] font-black uppercase tracking-widest">
                            Espace Patient • Premium
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-white font-heading tracking-tight mb-4 drop-shadow-sm leading-tight">Bonjour, <br/> {user.name} !</h2>
                        <div className="flex flex-wrap items-center gap-4 mt-8">
                            <Link to="/doctors" className="inline-flex items-center px-10 py-5 rounded-[20px] bg-white text-slate-900 font-extrabold text-base shadow-[0_0_40px_-5px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.4)] hover:scale-105 transition-all duration-300">
                                Prendre un rendez-vous
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    <Link to="/my-appointments" className="flex-1 glass-card p-8 bg-indigo-600 border-none relative overflow-hidden group hover:-translate-y-1 hover:shadow-premium transition-all duration-300 text-white flex flex-col justify-between">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 blur-2xl rounded-full group-hover:scale-150 transition-transform pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl mb-4 border border-white/20">
                                📅
                            </div>
                            <h3 className="text-2xl font-extrabold font-heading mb-1">Mes Consultations</h3>
                            <p className="text-sm font-medium text-indigo-100">Gérez vos rendez-vous médicaux.</p>
                        </div>
                        <div className="relative z-10 mt-6 flex items-center text-indigo-100 font-bold text-sm uppercase tracking-widest group-hover:text-white">
                            Accéder <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                        </div>
                    </Link>
                    
                    <div className="flex-1 glass-card p-8 bg-white group hover:border-emerald-200 transition-colors flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -z-10 group-hover:bg-emerald-100 transition-colors"></div>
                        <div className="relative z-10">
                            <div className="text-emerald-500 mb-4 bg-emerald-50 w-12 h-12 flex items-center justify-center rounded-xl p-2 border border-emerald-100 text-2xl">
                                🛡️
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 font-heading mb-2">Dossier Sécurisé</h3>
                            <p className="text-xs text-slate-500 font-medium">Vos informations sont chiffrées selon les normes HDS.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card overflow-hidden bg-white">
                <div className="px-10 py-8 border-b border-slate-100/50 flex flex-col sm:flex-row sm:items-center justify-between bg-white/80 backdrop-blur-md gap-4">
                    <h3 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">Activité Récente</h3>
                    <Link to="/my-appointments" className="human-button-secondary py-2.5 px-6 text-xs text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 shadow-none">Afficher tout</Link>
                </div>
                {renderAppointmentList()}
            </div>
        </div>
    );

    const renderAppointmentList = () => (
        loading ? (
            <div className="p-24 text-center">
                <div className="flex justify-center mb-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-indigo-600" />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Chargement sécurisé...</p>
            </div>
        ) : appointments.length === 0 ? (
            <div className="p-20 text-center bg-slate-50/50">
                <div className="text-6xl mb-6 inline-block bg-white p-6 rounded-full shadow-sm border border-slate-100 animate-float">📭</div>
                <p className="text-slate-500 font-medium text-lg mb-8 max-w-sm mx-auto">Votre historique clinique est vide. Aucun rendez-vous récent n'a été trouvé.</p>
                {user.role === 'patient' && <Link to="/doctors" className="human-button-primary px-8 py-4">Explorer les praticiens</Link>}
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 backdrop-blur-md border-b border-slate-200/60">
                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-1/3">Profil</th>
                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Heure</th>
                            <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Statut</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80 bg-white/50 backdrop-blur-sm">
                        {appointments.slice(0, 5).map((appointment) => (
                            <tr key={appointment.id} className="group hover:bg-white transition-colors">
                                <td className="px-10 py-6">
                                    <div className="flex items-center gap-5">
                                        <div className="h-12 w-12 rounded-[18px] bg-slate-100 shadow-inner flex items-center justify-center text-slate-700 font-black text-lg border border-slate-200/60 group-hover:border-indigo-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-300 transform group-hover:scale-105">
                                            {(user.role === 'doctor' || user.role === 'admin' ? appointment.patient?.name : appointment.slot?.doctor?.user?.name)?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                {user.role === 'doctor' || user.role === 'admin' ? appointment.patient?.name : `Dr. ${appointment.slot?.doctor?.user?.name}`}
                                            </p>
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                                {user.role === 'doctor' || user.role === 'admin' ? 'Patient' : (appointment.slot?.doctor?.specialty?.name || 'Spécialiste')}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-6">
                                    <div className="flex flex-col">
                                        <span className="text-base font-bold text-slate-700">
                                            {moment(appointment.slot?.start_time).format('DD MMMM YYYY')}
                                        </span>
                                        <span className="text-xs font-bold text-indigo-600/70 mt-0.5">
                                            à {moment(appointment.slot?.start_time).format('HH:mm')}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-10 py-6 text-right">
                                    <span className={`inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                                        appointment.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100/50' :
                                        appointment.status === 'completed' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-indigo-100/50' :
                                        'bg-slate-50 text-slate-600 border-slate-200'
                                        }`}>
                                        <span className={`h-1.5 w-1.5 rounded-full mr-2 ${appointment.status === 'confirmed' ? 'bg-emerald-500' : appointment.status === 'completed' ? 'bg-indigo-500' : 'bg-slate-400'}`}></span>
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
        <div className="min-h-screen relative font-sans selection:bg-indigo-300 overflow-hidden">
            {/* Ambient Background Gradient Meshes for the whole page */}
            <div className="fixed inset-0 bg-slate-50 pointer-events-none -z-10">
                 <div className="absolute -top-60 -right-60 w-[800px] h-[800px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[150px]"></div>
                 <div className="absolute top-[20%] -left-40 w-[600px] h-[600px] bg-emerald-200/30 rounded-full mix-blend-multiply filter blur-[120px]"></div>
                 <div className="absolute -bottom-40 right-[10%] w-[700px] h-[700px] bg-purple-200/30 rounded-full mix-blend-multiply filter blur-[150px]"></div>
                 <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            <div className="max-w-7xl mx-auto pt-10 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
                <header className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6 animate-fade-in-down">
                    <div className="relative">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-slate-200 text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-6">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Environnement Sécurisé
                        </div>
                        <h1 className="text-5xl md:text-[3.5rem] font-black text-slate-900 font-heading tracking-tight leading-none drop-shadow-sm">
                            {user.role === 'admin' ? 'Administration.' : 'Tableau de bord.'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-3.5 rounded-2xl shadow-sm border border-slate-200/60 transition-transform hover:scale-105 duration-300">
                        <div className="flex flex-col items-center border-r border-slate-200 pr-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Heure</span>
                            <span className="text-lg font-bold text-slate-800">{moment().format('HH:mm')}</span>
                        </div>
                        <div className="flex flex-col items-center pl-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</span>
                            <span className="text-sm font-bold text-indigo-600">{moment().format('DD MMM')}</span>
                        </div>
                    </div>
                </header>

                {user.role === 'admin' && renderAdminView()}
                {user.role === 'doctor' && renderDoctorView()}
                {user.role === 'patient' && renderPatientView()}
            </div>

            {/* Profile Edit Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsProfileModalOpen(false)}></div>
                    <div className="human-card relative w-full max-w-lg bg-white p-10 animate-in zoom-in-95 duration-300 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] border border-slate-100">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full blur-3xl -z-10"></div>
                        
                        <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-6">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 font-heading tracking-tight">Profil Public</h3>
                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-2">Mise à jour des informations</p>
                            </div>
                            <button
                                onClick={() => setIsProfileModalOpen(false)}
                                className="h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold text-xl transition-colors border border-slate-200">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">📍 Adresse de votre cabinet</label>
                                <input
                                    type="text"
                                    required
                                    className="human-input py-4 text-base font-medium placeholder-slate-400 bg-slate-50 focus:bg-white"
                                    placeholder="ex: 123 Rue de la Santé, Paris"
                                    value={profileForm.office_address}
                                    onChange={(e) => setProfileForm({ ...profileForm, office_address: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">✍️ Biographie & Expertise</label>
                                <textarea
                                    className="human-input min-h-[160px] resize-none py-4 text-base font-medium placeholder-slate-400 bg-slate-50 focus:bg-white"
                                    placeholder="Décrivez votre parcours, vos spécialités et votre approche médicale..."
                                    required
                                    value={profileForm.bio}
                                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                />
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsProfileModalOpen(false)}
                                    className="px-8 py-4 rounded-2xl text-slate-500 font-bold hover:bg-slate-100 transition-colors">
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={updatingProfile}
                                    className="flex-1 human-button-primary py-4 shadow-indigo-200/50 hover:shadow-indigo-300/50 disabled:opacity-50">
                                    {updatingProfile ? 'Enregistrement...' : 'Confirmer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
