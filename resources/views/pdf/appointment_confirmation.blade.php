<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Confirmation de Rendez-vous - SIGREM</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 40px;
        }

        .header {
            text-align: center;
            margin-bottom: 50px;
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 20px;
        }

        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #4f46e5;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .logo span {
            color: #1e1b4b;
        }

        .title {
            font-size: 24px;
            margin-top: 10px;
            color: #1e1b4b;
        }

        .section {
            margin-bottom: 30px;
            padding: 20px;
            background: #f9fafb;
            border-radius: 10px;
        }

        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
        }

        .info-grid {
            width: 100%;
        }

        .info-label {
            width: 30%;
            font-weight: bold;
            color: #374151;
        }

        .info-value {
            width: 70%;
            color: #111827;
        }

        .badge {
            display: inline-block;
            padding: 5px 12px;
            background: #dcfce7;
            color: #166534;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }

        .qr-placeholder {
            margin-top: 20px;
            text-align: right;
            font-size: 10px;
            color: #d1d5db;
        }
    </style>
</head>

<body>
    <div class="header">
        <div class="logo">SIG<span>REM</span></div>
        <div class="title">Confirmation de Rendez-vous</div>
    </div>

    <div class="section">
        <div class="section-title">Informations du Patient</div>
        <table class="info-grid">
            <tr>
                <td class="info-label">Nom :</td>
                <td class="info-value">{{ $appointment->patient->name }}</td>
            </tr>
            <tr>
                <td class="info-label">Email :</td>
                <td class="info-value">{{ $appointment->patient->email }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Détails de la Consultation</div>
        <table class="info-grid">
            <tr>
                <td class="info-label">Médecin :</td>
                <td class="info-value">Dr. {{ $appointment->slot->doctor->user->name }}</td>
            </tr>
            <tr>
                <td class="info-label">Spécialité :</td>
                <td class="info-value">{{ $appointment->slot->doctor->specialty->name }}</td>
            </tr>
            <tr>
                <td class="info-label">Date :</td>
                <td class="info-value">
                    {{ \Carbon\Carbon::parse($appointment->slot->start_time)->translatedFormat('l d F Y') }}
                </td>
            </tr>
            <tr>
                <td class="info-label">Heure :</td>
                <td class="info-value">{{ \Carbon\Carbon::parse($appointment->slot->start_time)->format('H:i') }}
                </td>
            </tr>
            <tr>
                <td class="info-label">Statut :</td>
                <td class="info-value"><span class="badge">{{ $appointment->status }}</span></td>
            </tr>
        </table>
    </div>

    @if($appointment->notes)
        <div class="section">
            <div class="section-title">Notes de Consultation</div>
            <p class="info-value">{{ $appointment->notes }}</p>
        </div>
    @endif

    <div class="qr-placeholder">
        Document généré électroniquement par SIGREM™<br>
        ID Document: #CONF-{{ str_pad($appointment->id, 6, '0', STR_PAD_LEFT) }}
    </div>

    <div class="footer">
        SIGREM - Système Intelligent de Gestion des Rendez-vous et de l’Espace Médical<br>
        &copy; {{ date('Y') }} Tous droits réservés.
    </div>
</body>

</html>