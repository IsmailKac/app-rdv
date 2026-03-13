# 🏥 Application de Prise de Rendez-vous Médicaux

Une plateforme moderne et intuitive connectant patients et professionnels de santé, conçue avec une esthétique "Human-Made" premium.

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Fonctionnalités Clés

### 🎨 Design & Expérience Utilisateur
- **Esthétique "Human-Made"** : Une interface soignée avec des polices Google Fonts premium (*Outfit* & *Inter*), des couleurs harmonieuses (Indigo/Slate/Emerald) et des micro-interactions fluides.
- **Composants UI** : Cartes, boutons et champs de saisie personnalisés pour une expérience homogène.

### 👨‍⚕️ Pour les Médecins
- **Gestion de Profil** : Modification de la bio, de l'adresse du cabinet et des informations publiques.
- **Tableau de Bord** : Vue d'ensemble des rendez-vous du jour et des prochaines consultations.
- **Génération Auto de Créneaux** : Création automatique de créneaux de disponibilité lors de l'inscription.

### 👤 Pour les Patients
- **Prise de Rendez-vous** : Recherche de médecins par spécialité et réservation simple.
- **Rappels Automatiques** : Système de notification par Email, SMS (simulation) et in-app 24h avant le rendez-vous.
- **Historique** : Suivi des consultations passées et à venir.

### 🛡️ Pour les Administrateurs
- **Centre de Vérification** : Validation des nouveaux médecins inscrits via un flux de travail dédié.
- **Gestion des Utilisateurs** : CRUD complet (Créer, Lire, Modifier, Supprimer) pour tous les types d'utilisateurs (Patients, Médecins, Admins).
- **Analytiques** : Graphiques et statistiques sur l'activité de la plateforme (inscriptions, rendez-vous par statut, top spécialités).

---

## 🛠️ Installation & Démarrage

### Prérequis
- PHP 8.2+
- Node.js & NPM
- Composer
- Base de données (MySQL/SQLite)

### Commandes
1. **Installation des dépendances**
    ```bash
    composer install
    npm install
    ```

2. **Configuration de l'environnement**
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

3. **Base de données & Seeders**
    ```bash
    php artisan migrate:fresh --seed
    ```

4. **Lancement**
    - **Backend** : `php artisan serve`
    - **Frontend** : `npm run dev`

---

## ✅ Commandes de Vérification

Le projet inclut des commandes artisan personnalisées pour vérifier le bon fonctionnement des fonctionnalités critiques sans interface graphique :

| Commande | Description |
| :--- | :--- |
| `php artisan verify:admin-features` | Vérifie le flux de validation des médecins et les statistiques admin. |
| `php artisan verify:user-management` | Teste les opérations CRUD sur les utilisateurs et la génération de profils. |
| `php artisan app:send-reminders` | Déclenche l'envoi manuel des rappels de rendez-vous (simulé dans les logs). |

---

## 📂 Structure du Projet

- **Backend** : API Laravel (`routes/api.php`, `app/Http/Controllers/Api`).
- **Frontend** : React (`resources/js`), avec un point d'entrée unique `App.jsx` et le routeur `react-router-dom`.
- **Design System** : Variables CSS globales et classes utilitaires dans `resources/css/app.css`.

---

## 🎤 Plan de Présentation du Projet

Voici une structure suggérée pour présenter ce projet lors d'une soutenance ou d'une démo :

### 1. Introduction & Contexte
- **Problème** : Difficulté pour les patients de trouver des médecins et pour les médecins de gérer leur agenda.
- **Solution** : Une application web centralisée, esthétique et fonctionnelle pour simplifier la prise de rendez-vous.
- **Cible** : Patients (accès facile aux soins), Médecins (gestion simplifiée), Administrateurs (supervision).

### 2. Démonstration (Live Demo)
- **Flux Patient** :
    - Inscription/Connexion.
    - Recherche d'un médecin (filtre par spécialité).
    - Prise de rendez-vous (choix du créneau).
    - Réception de la notification de rappel (simulée).
- **Flux Médecin** :
    - Connexion et vue du tableau de bord (RDV du jour).
    - Modification du profil (Bio, Adresse).
    - Consultation de l'historique des patients.
- **Flux Administrateur** :
    - Vue d'ensemble (Statistiques).
    - Validation d'un nouveau médecin inscrit.
    - Gestion des utilisateurs (ajout/suppression).

### 3. Choix Techniques
- **Backend (Laravel)** : Robustesse, sécurité, gestion des API RESTful, Eloquent ORM pour la base de données.
- **Frontend (React)** : Réactivité, composants réutilisables, expérience utilisateur fluide (SPA).
- **Design (Tailwind CSS)** : Design "Human-Made" personnalisé, responsive et moderne sans utiliser de composants préfabriqués génériques.

### 4. Conclusion & Améliorations Futures
- **Bilan** : Application fonctionnelle avec toutes les fonctionnalités essentielles (MVP).
- **Futur** : Intégration d'un système de paiement réel (Stripe), téléconsultation vidéo, application mobile native.
