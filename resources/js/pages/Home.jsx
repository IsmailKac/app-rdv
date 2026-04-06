import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="bg-slate-50 font-sans selection:bg-indigo-300 overflow-x-hidden">
            {/* HER0 SECTION (ASYMMETRIC) */}
            <section className="relative pt-12 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[800px] h-[800px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none z-0"></div>
                <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none z-0"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
                        
                        {/* Left Side: Copy & CTA */}
                        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mt-10 lg:mt-0">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in-down shadow-sm">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                                La nouvelle norme médicale
                            </div>
                            
                            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black text-slate-900 leading-[1.1] font-heading tracking-tight drop-shadow-sm mb-6 animate-fade-in-up">
                                La santé, <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">sans compromis.</span>
                            </h1>
                            
                            <p className="text-lg md:text-xl text-slate-500 font-medium mb-10 max-w-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                Gérez vos consultations, trouvez les meilleurs spécialistes et reprenez le contrôle de votre santé, le tout depuis une application ultra-sécurisée.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                <Link to="/register" className="human-button-primary px-10 py-5 text-lg flex items-center justify-center gap-2 group">
                                    Commencer <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                                <a href="#features" className="human-button-secondary bg-white px-10 py-5 text-lg flex items-center justify-center">
                                    Découvrir
                                </a>
                            </div>

                            <div className="mt-12 flex items-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                                <div className="flex -space-x-3">
                                    <div className="w-10 h-10 rounded-full border-2 border-slate-50 bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-800">AM</div>
                                    <div className="w-10 h-10 rounded-full border-2 border-slate-50 bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-800">JR</div>
                                    <div className="w-10 h-10 rounded-full border-2 border-slate-50 bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-800">SL</div>
                                </div>
                                <div className="text-sm font-semibold text-slate-600">
                                    <span className="font-extrabold text-slate-900">+10,000</span> patients satisfaits
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Visuals Composition */}
                        <div className="w-full lg:w-1/2 relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <div className="relative w-full max-w-lg mx-auto">
                                {/* The main app preview image */}
                                <div className="rounded-[40px] overflow-hidden shadow-[0_20px_80px_-15px_rgba(0,0,0,0.3)] ring-8 ring-white/60 relative z-10 transform lg:rotate-3 lg:hover:rotate-0 transition-all duration-700">
                                    <img src="/images/app-preview.png" alt="Sigrem App Interface" className="w-full h-auto object-cover" />
                                </div>
                                
                                {/* Floating Badge 1 */}
                                <div className="absolute -top-6 -left-12 z-20 glass-card bg-white/70 backdrop-blur-xl border border-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-float">
                                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-xl">✅</div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase">Consultation</p>
                                        <p className="text-base font-extrabold text-slate-800">Confirmée</p>
                                    </div>
                                </div>

                                {/* Floating Badge 2 */}
                                <div className="absolute -bottom-10 -right-8 z-20 glass-card bg-white/70 backdrop-blur-xl border border-white p-5 rounded-3xl shadow-xl animate-float" style={{ animationDelay: '2s' }}>
                                    <p className="text-xs font-bold text-slate-400 uppercase text-center mb-1">Avis Moyen</p>
                                    <div className="flex items-center gap-2 justify-center">
                                        <span className="text-3xl font-black text-slate-800">4.9</span>
                                        <span className="text-yellow-400 text-2xl">★</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* TRUST BANNER */}
            <div className="border-y border-slate-200/60 bg-white/50 backdrop-blur-md py-8 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <p className="text-sm font-black tracking-widest text-slate-400 uppercase text-center md:text-left">Ils révolutionnent la santé avec nous</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center text-2xl font-black text-slate-300 font-heading">
                        <span>DoctoPlus</span>
                        <span>SanteNet</span>
                        <span>MedSync</span>
                        <span>Clinico</span>
                    </div>
                </div>
            </div>

            {/* BENTO GRID FEATURES */}
            <section id="features" className="py-24 relative z-10 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-3">Fonctionnalités Clés</h2>
                        <h3 className="text-4xl md:text-5xl font-black font-heading text-slate-900 tracking-tight leading-tight">
                            Une expérience sur-mesure pour vous.
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Large Bento Box */}
                        <div className="md:col-span-2 glass-card bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-premium transition-all duration-500 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-[80px] group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="relative z-10 h-full flex flex-col justify-center">
                                <div className="h-16 w-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">
                                    📅
                                </div>
                                <h4 className="text-3xl font-extrabold text-slate-900 mb-4 font-heading">Agenda Intelligent</h4>
                                <p className="text-lg text-slate-500 font-medium max-w-md">
                                    Visualisez les disponibilités exactes des praticiens, synchronisez vos rendez-vous et recevez des rappels automatiques.
                                </p>
                            </div>
                        </div>

                        {/* Medium Bento Box */}
                        <div className="glass-card bg-indigo-600 p-10 rounded-[32px] border border-indigo-500 shadow-lg text-white hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-6 backdrop-blur-md">
                                🔒
                            </div>
                            <h4 className="text-2xl font-extrabold mb-4 font-heading">Dossiers Sécurisés</h4>
                            <p className="text-indigo-100 font-medium">
                                Vos données médicales sensibles sont cryptées de bout en bout et hébergées sur des serveurs HDS.
                            </p>
                        </div>

                        {/* Medium Bento Box */}
                        <div className="glass-card bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-premium transition-all duration-500 text-center flex flex-col items-center justify-center">
                            <div className="h-16 w-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">
                                👨‍⚕️
                            </div>
                            <h4 className="text-2xl font-extrabold text-slate-900 mb-3 font-heading">Réseau d'Experts</h4>
                            <p className="text-slate-500 font-medium">
                                Accédez à des milliers de praticiens vérifiés et reconnus par leurs pairs.
                            </p>
                        </div>

                        {/* Wide Bento Box */}
                        <div className="md:col-span-2 glass-card bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-premium transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex-1">
                                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-widest mb-4">Nouveau</span>
                                <h4 className="text-3xl font-extrabold text-slate-900 mb-4 font-heading">Téléconsultation Intégrée</h4>
                                <p className="text-slate-500 font-medium text-lg">
                                    Consultez votre médecin depuis votre salon, obtenez votre ordonnance digitale immédiatement après la séance.
                                </p>
                            </div>
                            <div className="w-full md:w-1/3 flex justify-center">
                                <div className="h-32 w-32 bg-slate-100 rounded-full border-8 border-white shadow-xl flex items-center justify-center text-5xl">
                                    💻
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MINIMALIST CTA SECTION WITH DOCTORS.PNG */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[48px] overflow-hidden relative shadow-2xl min-h-[500px] flex flex-col md:flex-row bg-slate-900">
                        {/* Image background on right half */}
                        <div className="absolute inset-0 md:left-1/2 bg-slate-800">
                            <img src="/images/doctors.png" alt="Doctors Team" className="w-full h-full object-cover mix-blend-overlay opacity-80" />
                            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
                        </div>
                        
                        {/* Text Content */}
                        <div className="relative z-10 w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 font-heading leading-tight">
                                Prêt à franchir le cap ?
                            </h2>
                            <p className="text-lg text-slate-300 font-medium mb-10 max-w-sm">
                                Créez votre compte gratuitement et découvrez un monde où la gestion de votre santé devient simple.
                            </p>
                            <div className="flex gap-4">
                                <Link to="/register" className="human-button-primary bg-white text-slate-900 hover:bg-slate-100 border-none shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                                    Créer un compte
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
