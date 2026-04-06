import { useState, useEffect } from 'react';
import api from '../api/axios';
import moment from 'moment';
import { Link } from 'react-router-dom';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'patient',
        specialty_id: ''
    });

    useEffect(() => {
        fetchUsers();
        fetchSpecialties();
    }, []);

    const fetchSpecialties = async () => {
        try {
            const { data } = await api.get('/specialties');
            setSpecialties(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Specialties fetch error", err);
            setSpecialties([]);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/users');
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch users", err);
            setError(err.response?.data?.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert("Échec de la suppression");
        }
    };

    const handleOpenModal = (user = null) => {
        try {
            if (user) {
                setEditingUser(user);
                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    password: '',
                    role: user.role || 'patient',
                    specialty_id: user.doctor_profile?.specialty_id || user.doctorProfile?.specialty_id || ''
                });
            } else {
                setEditingUser(null);
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    role: 'patient',
                    specialty_id: ''
                });
            }
            setIsModalOpen(true);
        } catch (err) {
            console.error("Critical error in handleOpenModal:", err);
            setEditingUser(null);
            setIsModalOpen(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                const { data } = await api.put(`/users/${editingUser.id}`, formData);
                setUsers(users.map(u => u.id === data.id ? data : u));
            } else {
                const { data } = await api.post('/users', formData);
                setUsers([...users, data]);
            }
            setIsModalOpen(false);
        } catch (err) {
            alert(err.response?.data?.message || "L'opération a échoué");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
        </div>
    );
    
    if (error) return <div className="text-center py-10 text-red-500 font-bold bg-slate-50 min-h-screen pt-20">{error}</div>;

    return (
        <div className="min-h-screen relative font-sans selection:bg-indigo-300 overflow-hidden">
            {/* High-end Animated Background */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-slate-50">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[150px]"></div>
                <div className="absolute top-[20%] -right-40 w-[600px] h-[600px] bg-purple-200/30 rounded-full mix-blend-multiply filter blur-[120px]"></div>
                <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-emerald-200/20 rounded-full mix-blend-multiply filter blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto pt-10 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
                <header className="mb-12 md:flex md:items-end md:justify-between animate-fade-in-down">
                    <div>
                        <Link to="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 hover:bg-white hover:text-indigo-600 transition-colors">
                            <span>&larr;</span> Retour au portail
                        </Link>
                        <div className="flex items-center gap-3 text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">
                            <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_2px_rgba(99,102,241,0.5)] animate-pulse" />
                            Console d'Administration
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 font-heading tracking-tight mb-4 drop-shadow-sm leading-none">
                            Gestion des <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">Utilisateurs</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl mt-4">
                            Supervisez les comptes, gérez les rôles et vérifiez les profils médicaux en toute simplicité depuis cet espace sécurisé.
                        </p>
                    </div>
                    <div className="mt-8 md:mt-0 flex gap-4">
                        <button
                            onClick={() => handleOpenModal()}
                            className="human-button-primary px-8 py-4 text-sm shadow-indigo-200/50 hover:shadow-indigo-300/50 flex items-center gap-3 transition-transform hover:-translate-y-1"
                        >
                            <span className="text-xl bg-white/20 h-8 w-8 rounded-full flex items-center justify-center -ml-2">＋</span>
                            Ajouter un membre
                        </button>
                    </div>
                </header>

                <div className="glass-card bg-white/60 overflow-hidden animate-fade-in-up duration-500 shadow-premium border-white/50" style={{ animationDelay: '0.2s' }}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="bg-white/80 backdrop-blur-md border-b border-slate-200/60">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-2/5">Membre</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rôle & Statut</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date d'inscription</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white/30 backdrop-blur-sm">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-white transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="h-12 w-12 rounded-[18px] bg-slate-50 border border-slate-200 shadow-inner flex items-center justify-center text-slate-700 font-black text-lg uppercase group-hover:scale-110 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all duration-300">
                                                    {u.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <div className="text-base font-extrabold text-slate-900 font-heading tracking-tight group-hover:text-indigo-600 transition-colors">{u.name}</div>
                                                    <div className="text-xs font-bold text-slate-400 mt-0.5">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex flex-col gap-2 items-start">
                                                <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-purple-100' :
                                                        u.role === 'doctor' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100' :
                                                            'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-indigo-100'
                                                    } shadow-sm`}>
                                                    {u.role}
                                                </span>
                                                {u.role === 'doctor' && (
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${u.is_verified ? 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-200/50' : 'bg-slate-50 text-slate-500 border-slate-200'} shadow-sm`}>
                                                        {u.is_verified && <span className="h-1 w-1 bg-white rounded-full"></span>}
                                                        {u.is_verified ? 'Vérifié' : 'En attente'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-sm font-bold text-slate-600">
                                            {u.created_at ? moment(u.created_at).format('DD MMMM YYYY') : '-'}
                                        </td>
                                        <td className="px-10 py-6 text-right space-x-3 whitespace-nowrap">
                                            {u.role === 'doctor' && !u.is_verified && (
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await api.put(`/users/${u.id}`, { is_verified: true });
                                                            fetchUsers();
                                                        } catch (err) { alert("Échec de la vérification"); }
                                                    }}
                                                    className="inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    Vérifier
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleOpenModal(u)}
                                                className="inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-700 bg-red-50 border border-red-200 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* PREMIUM MODAL REDESIGN */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative glass-card border border-white bg-white w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full blur-[60px] pointer-events-none"></div>
                        
                        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col max-h-[90vh]">
                            <div className="px-10 pt-10 pb-6 border-b border-slate-100">
                                <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-3 border border-indigo-100">
                                    {editingUser ? 'Édition' : 'Création'}
                                </span>
                                <h3 className="text-4xl font-black text-slate-900 font-heading tracking-tight mb-2">
                                    {editingUser ? 'Modifier le Profil' : 'Nouvel Utilisateur'}
                                </h3>
                                <p className="text-sm font-medium text-slate-500">Configurez les accès et informations du membre du système.</p>
                            </div>

                            <div className="px-10 py-8 space-y-6 overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">👤 Nom Complet</label>
                                        <input
                                            type="text" required
                                            className="human-input py-4 bg-slate-50 focus:bg-white text-base font-medium"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">📧 Adresse Email</label>
                                        <input
                                            type="email" required
                                            className="human-input py-4 bg-slate-50 focus:bg-white text-base font-medium"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">🔑 Rôle Système</label>
                                        <select
                                            className="human-input py-4 bg-slate-50 focus:bg-white text-base font-bold text-slate-700"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        >
                                            <option value="patient">Patient</option>
                                            <option value="doctor">Médecin</option>
                                            <option value="admin">Administrateur</option>
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">🔒 Mot de passe</label>
                                        <input
                                            type="password" required={!editingUser}
                                            className="human-input py-4 bg-slate-50 focus:bg-white text-base font-medium"
                                            placeholder={editingUser ? 'Laisser vide pour ne pas modifier' : 'Obligatoire'}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {formData.role === 'doctor' && (
                                    <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 animate-in zoom-in-95 duration-300 shadow-inner">
                                        <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">🩺 Spécialité Médicale</label>
                                        <select
                                            required
                                            className="human-input py-4 bg-white border border-indigo-200 text-base font-bold shadow-sm"
                                            value={formData.specialty_id}
                                            onChange={(e) => setFormData({ ...formData, specialty_id: e.target.value })}
                                        >
                                            <option value="" disabled>Sélectionner une spécialité dans la base</option>
                                            {Array.isArray(specialties) && specialties.map(s => (
                                                <option key={s.id} value={s.id}>{s.name} - Docteur diplômé</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="px-10 py-6 bg-slate-50/80 backdrop-blur-md border-t border-slate-100 flex flex-row-reverse gap-4 rounded-b-[32px]">
                                <button
                                    type="submit"
                                    className="human-button-primary px-10 py-4 text-base shadow-indigo-200/50 hover:-translate-y-1"
                                >
                                    {editingUser ? 'Enregistrer les modifications' : 'Créer l\'utilisateur'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-8 py-4 rounded-2xl text-slate-500 font-bold text-sm hover:bg-slate-200/50 transition-colors"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
