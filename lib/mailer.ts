import nodemailer from 'nodemailer'

export interface QuoteData {
  prenom: string
  nom: string
  email: string
  tel?: string
  groupe: string
  formule?: string
  msg?: string
}

function esc(str: string | undefined | null): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>')
}

function getTransporter() {
  const port = Number(process.env.SMTP_PORT ?? '465')
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.hostinger.com',
    port,
    secure: port !== 587,
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })
}

export async function sendQuoteEmails(data: QuoteData) {
  const transporter = getTransporter()
  const smtpUser = process.env.SMTP_USER!
  const from = `"Ziara-Sahla" <${smtpUser}>`
  const adminTo = process.env.CONTACT_TO ?? smtpUser
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ziara-sahla.com').replace(/\/$/, '')
  const whatsapp = process.env.WHATSAPP_NUMBER ?? '213557610660'

  const commonHeaders = {
    'X-Mailer': 'Ziara-Sahla/1.0',
    'X-Priority': '3',
    'Precedence': 'bulk',
    'List-Unsubscribe': `<mailto:${smtpUser}?subject=Unsubscribe>`,
  }

  // Admin notification
  await transporter.sendMail({
    from,
    to: adminTo,
    replyTo: data.email,
    subject: `Nouvelle demande de devis - ${esc(data.prenom)} ${esc(data.nom)}`,
    text: `Nouvelle demande de ${data.prenom} ${data.nom}\nEmail: ${data.email}\nTel: ${data.tel ?? '-'}\nGroupe: ${data.groupe}\nFormule: ${data.formule ?? '-'}\nMessage: ${data.msg ?? '-'}`,
    html: buildAdminEmail(data, siteUrl, whatsapp),
    headers: commonHeaders,
  })

  // Client confirmation
  await transporter.sendMail({
    from,
    to: data.email,
    replyTo: smtpUser,
    subject: `Votre demande a bien ete recue - Ziara-Sahla`,
    text: `Bonjour ${data.prenom},\n\nNous avons bien recu votre demande de devis.\nNotre equipe vous repondra sous 24-48h.\n\nRecapitulatif:\n- Groupe: ${data.groupe}\n- Formule: ${data.formule ?? '-'}\n\nCordialement,\nL'equipe Ziara-Sahla\n${smtpUser}`,
    html: buildClientEmail(data, siteUrl, whatsapp, smtpUser),
    headers: commonHeaders,
  })
}

/* ─────────────────────────────────────────────
   ADMIN NOTIFICATION EMAIL
───────────────────────────────────────────── */
function buildAdminEmail(d: QuoteData, siteUrl: string, whatsapp: string): string {
  const logoUrl = `${siteUrl}/assets/logo/logo.png`
  const date = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
  const cleanTel = (d.tel ?? '').replace(/[^0-9+]/g, '')
  const waClientLink = cleanTel
    ? `https://wa.me/${cleanTel.replace(/^\+/, '')}?text=Bonjour%20${encodeURIComponent(d.prenom)}%2C%20merci%20pour%20votre%20demande%20Ziara-Sahla%20!`
    : null

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Nouvelle demande – Ziara-Sahla</title>
</head>
<body style="margin:0;padding:0;background:#F5ECD7;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5ECD7;padding:36px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- HEADER -->
  <tr>
    <td style="background:linear-gradient(135deg,#E07B39 0%,#B94A2C 100%);border-radius:18px 18px 0 0;padding:48px 44px 38px;text-align:center;">
      <img src="${logoUrl}" alt="Ziara-Sahla" width="80" height="80" style="border-radius:50%;border:3px solid rgba(255,255,255,.45);display:block;margin:0 auto 20px;" />
      <h1 style="margin:0 0 6px;color:#fff;font-size:27px;font-weight:700;letter-spacing:-.4px;font-family:Georgia,'Times New Roman',serif;">Ziara-Sahla</h1>
      <p style="margin:0;color:rgba(255,255,255,.82);font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;">Agence de Voyages · Algérie</p>
    </td>
  </tr>

  <!-- ALERT BADGE -->
  <tr>
    <td style="background:#FFF8F0;padding:18px 44px;border-left:1px solid #f0e4cc;border-right:1px solid #f0e4cc;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td><span style="display:inline-block;background:#E07B39;color:#fff;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:5px 14px;border-radius:100px;">🔔&nbsp; Nouvelle demande de devis</span></td>
        <td align="right" style="font-size:12px;color:#9A8A72;">${date}</td>
      </tr></table>
    </td>
  </tr>

  <!-- MAIN BODY -->
  <tr>
    <td style="background:#fff;padding:38px 44px 0;border-left:1px solid #f0e4cc;border-right:1px solid #f0e4cc;">
      <h2 style="margin:0 0 24px;font-size:19px;color:#1A1208;font-family:Georgia,serif;">Informations du client</h2>

      <!-- Name row -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;"><tr>
        <td width="50%" style="padding-right:6px;">
          <div style="background:#FFF8F0;border:1px solid #f0e4cc;border-radius:10px;padding:14px 16px;">
            <p style="margin:0 0 5px;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#B94A2C;">Prénom</p>
            <p style="margin:0;font-size:16px;color:#1A1208;font-weight:700;">${esc(d.prenom)}</p>
          </div>
        </td>
        <td width="50%" style="padding-left:6px;">
          <div style="background:#FFF8F0;border:1px solid #f0e4cc;border-radius:10px;padding:14px 16px;">
            <p style="margin:0 0 5px;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#B94A2C;">Nom</p>
            <p style="margin:0;font-size:16px;color:#1A1208;font-weight:700;">${esc(d.nom)}</p>
          </div>
        </td>
      </tr></table>

      <!-- Email -->
      <div style="background:#FFF8F0;border:1px solid #f0e4cc;border-radius:10px;padding:14px 16px;margin-bottom:12px;">
        <p style="margin:0 0 5px;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#B94A2C;">Adresse email</p>
        <a href="mailto:${esc(d.email)}?subject=Suite%20à%20votre%20demande%20–%20Ziara-Sahla" style="color:#E07B39;font-size:15px;font-weight:600;text-decoration:none;">${esc(d.email)}</a>
      </div>

      ${d.tel ? `<!-- Phone -->
      <div style="background:#FFF8F0;border:1px solid #f0e4cc;border-radius:10px;padding:14px 16px;margin-bottom:12px;">
        <p style="margin:0 0 5px;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#B94A2C;">Téléphone</p>
        <a href="tel:${esc(d.tel)}" style="color:#E07B39;font-size:15px;font-weight:600;text-decoration:none;">${esc(d.tel)}</a>
      </div>` : ''}

      <!-- Group & Formula row -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;"><tr>
        <td width="50%" style="padding-right:6px;">
          <div style="background:#FFF8F0;border:1px solid #f0e4cc;border-radius:10px;padding:14px 16px;">
            <p style="margin:0 0 5px;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#B94A2C;">Taille du groupe</p>
            <p style="margin:0;font-size:15px;color:#1A1208;font-weight:700;">${esc(d.groupe)}</p>
          </div>
        </td>
        <td width="50%" style="padding-left:6px;">
          <div style="background:#FFF8F0;border:1px solid #f0e4cc;border-radius:10px;padding:14px 16px;">
            <p style="margin:0 0 5px;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#B94A2C;">Formule souhaitée</p>
            <p style="margin:0;font-size:15px;color:#1A1208;font-weight:700;">${esc(d.formule) || '<span style="color:#9A8A72;font-weight:400;font-style:italic;">Non précisée</span>'}</p>
          </div>
        </td>
      </tr></table>

      ${d.msg ? `<!-- Message -->
      <div style="background:#FFF8F0;border:1px solid #f0e4cc;border-radius:10px;padding:16px 16px 18px;margin-bottom:12px;">
        <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#B94A2C;">Message / Projet</p>
        <p style="margin:0;font-size:14px;color:#3D3120;line-height:1.75;">${esc(d.msg)}</p>
      </div>` : ''}
    </td>
  </tr>

  <!-- CTA BUTTONS -->
  <tr>
    <td style="background:#fff;padding:24px 44px 38px;border-left:1px solid #f0e4cc;border-right:1px solid #f0e4cc;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td width="50%" style="padding-right:6px;">
          <a href="mailto:${esc(d.email)}?subject=Suite%20à%20votre%20demande%20–%20Ziara-Sahla" style="display:block;background:linear-gradient(135deg,#E07B39 0%,#C45E1A 100%);color:#fff;text-decoration:none;text-align:center;padding:14px 18px;border-radius:10px;font-size:13px;font-weight:700;letter-spacing:.02em;">✉️&nbsp; Répondre par email</a>
        </td>
        <td width="50%" style="padding-left:6px;">
          ${waClientLink
      ? `<a href="${waClientLink}" style="display:block;background:#25D366;color:#fff;text-decoration:none;text-align:center;padding:14px 18px;border-radius:10px;font-size:13px;font-weight:700;letter-spacing:.02em;">💬&nbsp; Répondre sur WhatsApp</a>`
      : `<a href="https://wa.me/${whatsapp}" style="display:block;background:#25D366;color:#fff;text-decoration:none;text-align:center;padding:14px 18px;border-radius:10px;font-size:13px;font-weight:700;letter-spacing:.02em;">💬&nbsp; Ouvrir WhatsApp</a>`
    }
        </td>
      </tr></table>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#1A1208;border-radius:0 0 18px 18px;padding:30px 44px;text-align:center;">
      <p style="margin:0 0 6px;color:rgba(255,255,255,.92);font-size:15px;font-weight:700;font-family:Georgia,serif;">Ziara-Sahla</p>
      <p style="margin:0 0 14px;color:rgba(255,255,255,.4);font-size:10px;letter-spacing:.15em;text-transform:uppercase;">Agence de voyages · Algérie authentique</p>
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,.3);">Paris, France · Alger, Algérie · <a href="${siteUrl}" style="color:rgba(224,123,57,.65);text-decoration:none;">${siteUrl}</a></p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

/* ─────────────────────────────────────────────
   CLIENT CONFIRMATION EMAIL
───────────────────────────────────────────── */
function buildClientEmail(d: QuoteData, siteUrl: string, whatsapp: string, contactEmail: string): string {
  const logoUrl = `${siteUrl}/assets/logo/logo.png`

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Votre demande – Ziara-Sahla</title>
</head>
<body style="margin:0;padding:0;background:#F5ECD7;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5ECD7;padding:36px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- HEADER -->
  <tr>
    <td style="background:linear-gradient(135deg,#E07B39 0%,#B94A2C 100%);border-radius:18px 18px 0 0;padding:48px 44px 38px;text-align:center;">
      <img src="${logoUrl}" alt="Ziara-Sahla" width="80" height="80" style="border-radius:50%;border:3px solid rgba(255,255,255,.45);display:block;margin:0 auto 20px;" />
      <h1 style="margin:0 0 6px;color:#fff;font-size:27px;font-weight:700;letter-spacing:-.4px;font-family:Georgia,'Times New Roman',serif;">Ziara-Sahla</h1>
      <p style="margin:0;color:rgba(255,255,255,.82);font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;">Agence de Voyages · Algérie</p>
    </td>
  </tr>

  <!-- GREETING -->
  <tr>
    <td style="background:#fff;padding:40px 44px 0;border-left:1px solid #f0e4cc;border-right:1px solid #f0e4cc;">
      <!-- Check icon -->
      <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#4CAF50,#2E7D32);margin:0 auto 22px;text-align:center;line-height:56px;font-size:24px;">✓</div>

      <h2 style="margin:0 0 14px;font-size:22px;color:#1A1208;text-align:center;font-family:Georgia,serif;">Demande bien reçue, ${esc(d.prenom)}&nbsp;!</h2>
      <p style="margin:0 0 24px;font-size:15px;color:#3D3120;line-height:1.78;text-align:center;">Merci pour votre intérêt. Notre équipe a bien reçu votre demande et s'engage à vous proposer une offre personnalisée dans les <strong>24 à 48 heures</strong>.</p>

      <!-- Divider -->
      <div style="height:1px;background:linear-gradient(to right,transparent,#e8d8c0,transparent);margin:0 0 28px;"></div>

      <!-- Summary box -->
      <h3 style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#B94A2C;">Récapitulatif de votre demande</h3>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0e4cc;border-radius:10px;overflow:hidden;margin-bottom:28px;">
        <tr style="border-bottom:1px solid #f0e4cc;">
          <td style="padding:11px 16px;background:#FFF8F0;font-size:12px;color:#9A8A72;font-weight:600;text-transform:uppercase;letter-spacing:.08em;width:40%;">Nom complet</td>
          <td style="padding:11px 16px;font-size:14px;color:#1A1208;font-weight:700;">${esc(d.prenom)} ${esc(d.nom)}</td>
        </tr>
        <tr style="border-bottom:1px solid #f0e4cc;">
          <td style="padding:11px 16px;background:#FFF8F0;font-size:12px;color:#9A8A72;font-weight:600;text-transform:uppercase;letter-spacing:.08em;">Email</td>
          <td style="padding:11px 16px;font-size:14px;color:#1A1208;">${esc(d.email)}</td>
        </tr>
        <tr style="border-bottom:1px solid #f0e4cc;">
          <td style="padding:11px 16px;background:#FFF8F0;font-size:12px;color:#9A8A72;font-weight:600;text-transform:uppercase;letter-spacing:.08em;">Groupe</td>
          <td style="padding:11px 16px;font-size:14px;color:#1A1208;font-weight:700;">${esc(d.groupe)}</td>
        </tr>
        ${d.formule ? `<tr style="border-bottom:1px solid #f0e4cc;">
          <td style="padding:11px 16px;background:#FFF8F0;font-size:12px;color:#9A8A72;font-weight:600;text-transform:uppercase;letter-spacing:.08em;">Formule</td>
          <td style="padding:11px 16px;font-size:14px;color:#1A1208;font-weight:700;">${esc(d.formule)}</td>
        </tr>` : ''}
        <tr>
          <td style="padding:11px 16px;background:#FFF8F0;font-size:12px;color:#9A8A72;font-weight:600;text-transform:uppercase;letter-spacing:.08em;">Statut</td>
          <td style="padding:11px 16px;font-size:14px;color:#2E7D32;font-weight:700;">✓ Reçue — en traitement</td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- NEXT STEPS -->
  <tr>
    <td style="background:#fff;padding:0 44px 36px;border-left:1px solid #f0e4cc;border-right:1px solid #f0e4cc;">
      <h3 style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#B94A2C;">Ce qui va se passer</h3>

      <!-- Step 1 -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;"><tr>
        <td width="42" valign="top" style="padding-right:14px;">
          <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#E07B39,#C45E1A);text-align:center;line-height:38px;">
            <span style="color:#fff;font-size:15px;font-weight:800;display:block;width:38px;height:38px;line-height:38px;text-align:center;">1</span>
          </div>
        </td>
        <td valign="top">
          <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#1A1208;">Analyse de votre projet</p>
          <p style="margin:0;font-size:13px;color:#7A6A52;line-height:1.65;">Nos spécialistes étudient vos besoins et préparent une offre entièrement sur-mesure.</p>
        </td>
      </tr></table>

      <!-- Step 2 -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;"><tr>
        <td width="42" valign="top" style="padding-right:14px;">
          <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#E07B39,#C45E1A);text-align:center;line-height:38px;">
            <span style="color:#fff;font-size:15px;font-weight:800;display:block;width:38px;height:38px;line-height:38px;text-align:center;">2</span>
          </div>
        </td>
        <td valign="top">
          <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#1A1208;">Devis personnalisé sous 24–48h</p>
          <p style="margin:0;font-size:13px;color:#7A6A52;line-height:1.65;">Vous recevrez un devis détaillé avec les programmes, hébergements et tarifs adaptés à votre groupe.</p>
        </td>
      </tr></table>

      <!-- Step 3 -->
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td width="42" valign="top" style="padding-right:14px;">
          <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#E07B39,#C45E1A);text-align:center;line-height:38px;">
            <span style="color:#fff;font-size:15px;font-weight:800;display:block;width:38px;height:38px;line-height:38px;text-align:center;">3</span>
          </div>
        </td>
        <td valign="top">
          <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#1A1208;">Votre voyage commence !</p>
          <p style="margin:0;font-size:13px;color:#7A6A52;line-height:1.65;">Une fois le devis validé, nous prenons en charge l'intégralité de votre séjour en Algérie.</p>
        </td>
      </tr></table>
    </td>
  </tr>

  <!-- CONTACT CTA -->
  <tr>
    <td style="background:#FFF8F0;border:1px solid #f0e4cc;padding:30px 44px;text-align:center;">
      <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#1A1208;">Une question en attendant ?</p>
      <p style="margin:0 0 20px;font-size:13px;color:#7A6A52;">Notre équipe est disponible et prête à vous répondre.</p>
      <a href="https://wa.me/${whatsapp}?text=Bonjour%20Ziara-Sahla%2C%20suite%20à%20ma%20demande%20de%20devis..." style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:13px 30px;border-radius:100px;font-size:14px;font-weight:700;margin-bottom:14px;">💬 &nbsp;Discuter sur WhatsApp</a>
      <br>
      <a href="mailto:${contactEmail}" style="font-size:13px;color:#E07B39;text-decoration:none;">${contactEmail}</a>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#1A1208;border-radius:0 0 18px 18px;padding:30px 44px;text-align:center;">
      <p style="margin:0 0 6px;color:rgba(255,255,255,.92);font-size:15px;font-weight:700;font-family:Georgia,serif;">Ziara-Sahla</p>
      <p style="margin:0 0 14px;color:rgba(255,255,255,.4);font-size:10px;letter-spacing:.15em;text-transform:uppercase;">Agence de voyages · Algérie authentique</p>
      <p style="margin:0 0 10px;font-size:11px;color:rgba(255,255,255,.3);">Paris, France · Alger, Algérie · <a href="${siteUrl}" style="color:rgba(224,123,57,.65);text-decoration:none;">${siteUrl}</a></p>
      <p style="margin:0;font-size:10px;color:rgba(255,255,255,.18);">Cet email vous a été envoyé suite à votre demande sur ${siteUrl}. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement ce message.</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`
}
