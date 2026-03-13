import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="bg-slate-50">
            {/* Hero Section */}
            <section className="relative pt-16 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            Votre santé, notre priorité
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
                            Prenez rendez-vous avec les <span className="text-indigo-600">meilleurs</span> spécialistes.
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
                            Une plateforme simple, rapide et sécurisée pour gérer votre santé au quotidien. Trouvez un médecin et réservez en quelques clics.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                            <Link to="/login" className="human-button-primary text-base px-8 py-4 shadow-lg hover:shadow-indigo-200">
                                Trouver un médecin
                            </Link>
                            <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-base shadow-sm hover:bg-slate-50 transition-all">
                                Créer un compte
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: 'Médecins vérifiés', val: '2,500+' },
                            { label: 'Patient satisfaits', val: '50k+' },
                            { label: 'Spécialités', val: '45+' },
                            { label: 'Support 24/7', val: '99.9%' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm transition-transform hover:-translate-y-1 duration-300">
                                <p className="text-3xl font-extrabold text-slate-900 mb-1 font-heading">{stat.val}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Pourquoi choisir Sigrem ?</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            Nous avons conçu une expérience intuitive pour simplifier votre parcours de soins.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                title: 'Recherche Intelligente',
                                desc: 'Trouvez facilement des médecins par spécialité, ville ou disponibilité avec notre moteur de recherche optimisé.',
                                icon: '🔍',
                                color: 'bg-indigo-50 text-indigo-600 border-indigo-100'
                            },
                            {
                                title: 'Rappels Automatiques',
                                desc: 'Recevez des notifications personnalisées pour ne jamais rater un rendez-vous important.',
                                icon: '⏰',
                                color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            },
                            {
                                title: 'Dossier Sécurisé',
                                desc: 'Consultez l\'historique de vos consultations et documents médicaux dans un espace hautement protégé.',
                                icon: '🛡️',
                                color: 'bg-blue-50 text-blue-600 border-blue-100'
                            }
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="human-card p-10 group hover:-translate-y-2 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                                style={{ animationDelay: `${i * 150}ms` }}
                            >
                                <div className={`h-16 w-16 rounded-2xl ${feature.color} border flex items-center justify-center text-3xl mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-extrabold text-slate-900 mb-4 font-heading tracking-tight leading-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-500 leading-relaxed font-medium">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-indigo-600 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-xl">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white opacity-[0.03] rounded-full"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-white opacity-[0.03] rounded-full"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight font-heading">
                                Prêt à simplifier votre santé ?
                            </h2>
                            <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto opacity-90">
                                Rejoignez des milliers de patients et profitez d'une gestion de rendez-vous fluide et moderne.
                            </p>
                            <Link to="/register" className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-white text-indigo-600 font-extrabold text-lg shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95">
                                Commencer maintenant
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
