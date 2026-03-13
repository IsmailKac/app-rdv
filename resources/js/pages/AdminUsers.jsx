import { useState, useEffect } from 'react';
import api from '../api/axios';
import moment from 'moment';

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
        console.log("Opening modal for:", user ? "Edit" : "Create");
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

    if (loading) return <div className="text-center py-10 text-gray-500">Chargement...</div>;
    if (error) return <div className="text-center py-10 text-red-500 font-bold">{error}</div>;

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 md:flex md:items-end md:justify-between">
                    <div>
                        <div className="flex items-center gap-3 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                            Console d'Administration
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 font-heading tracking-tight mb-2">
                            Gestion des <span className="text-indigo-600">Utilisateurs</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
                            Supervisez les comptes, gérez les rôles et vérifiez les profils médicaux en toute simplicité.
                        </p>
                    </div>
                    <div className="mt-8 md:mt-0">
                        <button
                            onClick={() => handleOpenModal()}
                            className="human-button-primary px-6 py-3.5 text-sm font-extrabold flex items-center gap-2"
                        >
                            <span>＋</span> Ajouter un utilisateur
                        </button>
                    </div>
                </header>

                <div className="human-card bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-xl shadow-slate-200/50">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Membre</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Rôle & Statut</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date d'inscription</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users.map((u, idx) => (
                                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-sm uppercase group-hover:scale-110 transition-transform">
                                                    {u.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-extrabold text-slate-900 font-heading tracking-tight">{u.name}</div>
                                                    <div className="text-xs font-medium text-slate-400">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                                        u.role === 'doctor' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                            'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                                {u.role === 'doctor' && (
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.is_verified ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                                                        {u.is_verified ? 'Vérifié' : 'En attente'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-slate-500">
                                            {u.created_at ? moment(u.created_at).format('DD MMM YYYY') : '-'}
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right text-xs font-bold space-x-4">
                                            {u.role === 'doctor' && !u.is_verified && (
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await api.put(`/users/${u.id}`, { is_verified: true });
                                                            fetchUsers();
                                                        } catch (err) { alert("Échec de la vérification"); }
                                                    }}
                                                    className="text-emerald-600 hover:text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 transition-colors"
                                                >
                                                    Vérifier
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleOpenModal(u)}
                                                className="text-indigo-600 hover:text-indigo-800 uppercase tracking-widest"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="text-red-400 hover:text-red-600 uppercase tracking-widest"
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

            {/* MODAL REDESIGN */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        <form onSubmit={handleSubmit}>
                            <div className="p-8 border-b border-slate-50">
                                <h3 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
                                    {editingUser ? 'Modifier le Profil' : 'Nouvel Utilisateur'}
                                </h3>
                                <p className="text-sm font-medium text-slate-400 mt-1">Configurez les accès et informations du membre.</p>
                            </div>

                            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nom Complet</label>
                                        <input
                                            type="text" required
                                            className="human-input py-3"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email</label>
                                        <input
                                            type="email" required
                                            className="human-input py-3"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rôle</label>
                                        <select
                                            className="human-input py-3"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        >
                                            <option value="patient">Patient</option>
                                            <option value="doctor">Médecin</option>
                                            <option value="admin">Administrateur</option>
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mot de passe</label>
                                        <input
                                            type="password" required={!editingUser}
                                            className="human-input py-3"
                                            placeholder={editingUser ? '••••••••' : ''}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {formData.role === 'doctor' && (
                                    <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 animate-in zoom-in-95 duration-300">
                                        <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Spécialité Médicale</label>
                                        <select
                                            required
                                            className="human-input py-3 !bg-white"
                                            value={formData.specialty_id}
                                            onChange={(e) => setFormData({ ...formData, specialty_id: e.target.value })}
                                        >
                                            <option value="" disabled>Sélectionner une spécialité</option>
                                            {Array.isArray(specialties) && specialties.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 bg-slate-50 flex flex-row-reverse gap-4">
                                <button
                                    type="submit"
                                    className="human-button-primary px-8 py-4 text-base"
                                >
                                    {editingUser ? 'Enregistrer les modifications' : 'Créer l\'utilisateur'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-8 py-4 rounded-xl text-slate-500 font-bold text-sm hover:text-slate-700 transition-all"
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
