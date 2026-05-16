import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET() {
  const port = Number(process.env.SMTP_PORT ?? '465')

  const config = {
    host: process.env.SMTP_HOST ?? 'NOT SET',
    port,
    user: process.env.SMTP_USER ?? 'NOT SET',
    passSet: !!process.env.SMTP_PASS,
    contactTo: process.env.CONTACT_TO ?? 'NOT SET',
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return NextResponse.json({ error: 'SMTP env vars missing', config }, { status: 500 })
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port !== 587,
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    tls: { rejectUnauthorized: false },
  })

  try {
    const info = await transporter.sendMail({
      from: `"Ziara-Sahla" <${process.env.SMTP_USER}>`,
      to: 'dahoumanekhalil@gmail.com',
      replyTo: process.env.SMTP_USER,
      subject: `Test Ziara-Sahla - ${new Date().toLocaleString('fr-FR')}`,
      text: `Ceci est un email de test envoye depuis Ziara-Sahla.\nSMTP: ${process.env.SMTP_HOST}:${port}\nExpéditeur: ${process.env.SMTP_USER}\nHeure: ${new Date().toISOString()}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:32px auto;padding:32px;background:#fff;border-radius:12px;border:1px solid #e5e7eb;">
          <div style="text-align:center;margin-bottom:24px;">
            <div style="width:56px;height:56px;background:linear-gradient(135deg,#E07B39,#B94A2C);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:24px;line-height:56px;text-align:center;">✅</div>
          </div>
          <h2 style="margin:0 0 12px;color:#1A1208;font-family:Georgia,serif;text-align:center;">Email de test reussi</h2>
          <p style="color:#3D3120;text-align:center;margin:0 0 24px;">Le systeme d'envoi d'emails de <strong>Ziara-Sahla</strong> fonctionne correctement.</p>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr style="border-bottom:1px solid #f0e4cc;"><td style="padding:8px 12px;color:#9A8A72;background:#FFF8F0;">SMTP Host</td><td style="padding:8px 12px;color:#1A1208;font-weight:600;">${process.env.SMTP_HOST}:${port}</td></tr>
            <tr style="border-bottom:1px solid #f0e4cc;"><td style="padding:8px 12px;color:#9A8A72;background:#FFF8F0;">Expediteur</td><td style="padding:8px 12px;color:#1A1208;font-weight:600;">${process.env.SMTP_USER}</td></tr>
            <tr><td style="padding:8px 12px;color:#9A8A72;background:#FFF8F0;">Envoye a</td><td style="padding:8px 12px;color:#1A1208;font-weight:600;">${new Date().toLocaleString('fr-FR')}</td></tr>
          </table>
        </div>
      `,
      headers: {
        'X-Mailer': 'Ziara-Sahla/1.0',
        'X-Priority': '3',
      },
    })

    return NextResponse.json({ ok: true, messageId: info.messageId, response: info.response, config })
  } catch (err: unknown) {
    const e = err as { message?: string; code?: string; response?: string }
    return NextResponse.json({ ok: false, error: e?.message, code: e?.code, smtpResponse: e?.response, config }, { status: 500 })
  }
}
