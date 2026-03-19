<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activation de votre compte TakeIt</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #f6f7fb;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
        }
        .container {
            max-width: 640px;
            margin: 0 auto;
            padding: 32px 16px 48px;
        }
        .card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
        }
        .header {
            background: linear-gradient(135deg, #f97316, #fb923c);
            color: #ffffff;
            padding: 28px 24px;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 6px;
            font-size: 26px;
            letter-spacing: 0.3px;
        }
        .header p {
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 28px 24px 8px;
        }
        .content h2 {
            margin: 0 0 12px;
            font-size: 20px;
        }
        .muted {
            color: #6b7280;
            font-size: 14px;
        }
        .credentials {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-left: 4px solid #f97316;
            border-radius: 12px;
            padding: 16px 18px;
            margin: 18px 0 22px;
        }
        .credentials p {
            margin: 6px 0;
            font-size: 14px;
        }
        .button-wrap {
            text-align: center;
            padding: 8px 24px 28px;
        }
        .button {
            background: #f97316;
            color: #ffffff;
            padding: 12px 26px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            font-weight: 600;
            font-size: 14px;
        }
        .footer {
            text-align: center;
            margin-top: 24px;
            color: #6b7280;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <h1>TakeIt</h1>
                <p>Plateforme de gestion des tâches</p>
            </div>

            <div class="content">
                <h2>Bonjour {{ $nom }},</h2>
                <p>Votre compte a été créé sur TakeIt. Voici vos identifiants :</p>

                <div class="credentials">
                    <p><strong>Email :</strong> {{ $email }}</p>
                    <p><strong>Mot de passe temporaire :</strong> {{ $password_temp }}</p>
                </div>

                <p>Pour activer votre compte et définir votre mot de passe, cliquez sur le bouton ci-dessous :</p>
            </div>

            <div class="button-wrap">
                <a href="{{ $lien }}" class="button">Activer mon compte</a>
                <p class="muted" style="margin-top: 18px;">
                    Ce lien expirera dans 24 heures. Si vous n'avez pas demandé ce compte, ignorez cet email.
                </p>
            </div>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} TakeIt - Sopra HR. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
