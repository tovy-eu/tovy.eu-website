import { emailTranslations } from "./email-translations";

export const abandonmentEmailTranslations = {
  en: {
    subject: emailTranslations.abandonment.en.subject,
    greeting: "Hello,",
    introTitle: "Secure your automated foundation. This is your first step to automation.",
    introBody: "We noticed you started filling out our project intake form, but didn't quite finish. Your progress has been securely saved so you don't have to start over.",
    progressTitle: "Your Progress: 85% Completed",
    step1: "Qualifications & Budget Details",
    step2: "Contact Details & Email Verification",
    step3: "Final Verification & Onboarding Booking",
    btnText: "Resume Intake Form",
    directConnTitle: "Prefer a direct connection?",
    directConnText: "If you want to bypass the remaining form step entirely, you can:",
    optionReply: "Reply directly to this email or write to us at",
    optionSchedule: "Schedule a brief onboarding call immediately using our",
    optionLinkText: "Google Calendar Link",
    bestRegards: "Best regards,",
    founderTitle: "Founder & Data Engineer, Tovy",
    copyright: emailTranslations.abandonment.en.copyright
  },
  nl: {
    subject: emailTranslations.abandonment.nl.subject,
    greeting: "Beste,",
    introTitle: "Zeker je geautomatiseerde fundament. Dit is je eerste stap naar automatisering.",
    introBody: "We zagen dat je begon met het invullen van ons project-intakeformulier, maar het nog niet helemaal hebt afgerond. Je voortgang is veilig opgeslagen zodat je niet opnieuw hoeft te beginnen.",
    progressTitle: "Je voortgang: 85% Voltooid",
    step1: "Kwalificaties & Budget Details",
    step2: "Contactgegevens & E-mailverificatie",
    step3: "Laatste verificatie & Kennismakingsgesprek plannen",
    btnText: "Hervat intakeformulier",
    directConnTitle: "Liever direct contact?",
    directConnText: "Als je de resterende formulierstappen wilt overslaan, kun je:",
    optionReply: "Beantwoord deze e-mail direct of schrijf ons op",
    optionSchedule: "Plan direct een kort kennismakingsgesprek via onze",
    optionLinkText: "Google Calendar-link",
    bestRegards: "Met vriendelijke groet,",
    founderTitle: "Oprichter & Data-engineer, Tovy",
    copyright: emailTranslations.abandonment.nl.copyright
  },
  de: {
    subject: emailTranslations.abandonment.de.subject,
    greeting: "Hallo,",
    introTitle: "Sichern Sie Ihr automatisiertes Fundament. Dies ist Ihr erster Schritt zur Automatisierung.",
    introBody: "Wir haben festgestellt, dass Sie mit dem Ausfüllen unseres Projektanfrage-Formulars begonnen, es aber noch nicht abgeschlossen haben. Ihr Fortschritt wurde sicher gespeichert, sodass Sie nicht von vorne beginnen müssen.",
    progressTitle: "Ihr Fortschritt: 85% Abgeschlossen",
    step1: "Qualifikationen & Budget-Details",
    step2: "Kontaktdetails & E-Mail-Verifizierung",
    step3: "Letzte Verifizierung & Onboarding-Terminbuchung",
    btnText: "Formular fortsetzen",
    directConnTitle: "Bevorzugen Sie direkten Kontakt?",
    directConnText: "Wenn Sie die verbleibenden Schritte komplett überspringen möchten, können Sie:",
    optionReply: "Direkt auf diese E-Mail antworten oder uns schreiben unter",
    optionSchedule: "Buchen Sie sofort ein kurzes Onboarding-Gespräch über unseren",
    optionLinkText: "Google Calendar Link",
    bestRegards: "Mit freundlichen Grüßen,",
    founderTitle: "Gründer & Data Engineer, Tovy",
    copyright: emailTranslations.abandonment.de.copyright
  },
  es: {
    subject: emailTranslations.abandonment.es.subject,
    greeting: "Hola,",
    introTitle: "Asegure sus cimientos automatizados. Este es su primer paso hacia la automatización.",
    introBody: "Notamos que comenzó a completar nuestro formulario de solicitud de proyecto, pero no llegó a terminarlo. Su progreso se ha guardado de forma segura para que no tenga que empezar de nuevo.",
    progressTitle: "Su progreso: 85% Completado",
    step1: "Detalles de calificación y presupuesto",
    step2: "Detalles de contacto y verificación de correo electrónico",
    step3: "Verificación final y reserva de incorporación",
    btnText: "Reanudir formulario",
    directConnTitle: "¿Prefiere una comunicación directa?",
    directConnText: "Si desea omitir el paso restante del formulario por completo, puede:",
    optionReply: "Responder directamente a este correo electrónico o escribirnos a",
    optionSchedule: "Programar una breve llamada de incorporación inmediatamente usando nuestro",
    optionLinkText: "Enlace de Google Calendar",
    bestRegards: "Saludos cordiales,",
    founderTitle: "Fundador e Ingeniero de Datos, Tovy",
    copyright: emailTranslations.abandonment.es.copyright
  }
};

export const getAbandonmentEmailHtml = (docId: string, year: number, lang?: string): string => {
  const l = (lang === "nl" || lang === "de" || lang === "es") ? lang : "en";
  const t = abandonmentEmailTranslations[l];

  return `<!DOCTYPE html>
<html lang="${l}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark only">
  <meta name="supported-color-schemes" content="dark only">
  <title>${t.subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      background-color: #030712;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #030712 !important;
        color: #f8fafc !important;
      }
    }
    a {
      color: #295bff;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
  <!-- Gmail Inbox Go-To Action Schema -->
  <script type="application/ld+json">
  {
    "@context": "http://schema.org",
    "@type": "EmailMessage",
    "potentialAction": {
      "@type": "ViewAction",
      "name": "${t.btnText}",
      "target": "https://tovy.eu/project-request/?id=${docId}"
    },
    "description": "${t.introTitle}"
  }
  </script>
</head>
<body style="margin: 0; padding: 0; background-color: #030712; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="background-color: #030712; background-image: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.25), rgba(3, 7, 18, 0)); padding: 60px 20px; text-align: center;">
    <div style="max-width: 600px; margin: 0 auto; background-color: rgba(3, 7, 18, 0.85); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 32px; padding: 48px 40px; text-align: left; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
      
      <!-- Logo Header -->
      <div style="margin-bottom: 40px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 24px;">
        <img src="https://tovy.eu/images/tovy-logo-email.png" alt="TOVY" height="32" style="border: 0; display: block;" />
      </div>

      <!-- Welcome Message -->
      <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 20px;">
        ${t.greeting}
      </p>

      <p style="font-size: 18px; line-height: 1.6; color: #ffffff; font-weight: 700; margin-bottom: 24px; text-shadow: 0 0 20px rgba(41, 91, 255, 0.35);">
        ${t.introTitle}
      </p>
      
      <p style="font-size: 15px; line-height: 1.6; color: #94a3b8; margin-bottom: 28px;">
        ${t.introBody}
      </p>
      
      <!-- Progress Bar Card Component -->
      <div style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 24px; margin-bottom: 32px; box-shadow: 0 0 20px rgba(41, 91, 255, 0.05);">
        <h4 style="margin: 0 0 16px 0; font-size: 12px; font-weight: bold; color: #5773ff; text-transform: uppercase; letter-spacing: 0.05em;">${t.progressTitle}</h4>
        
        <!-- Progress Bar Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="background-color: rgba(255, 255, 255, 0.08); height: 8px; border-radius: 4px; padding: 0; position: relative;">
              <table style="width: 85%; border-collapse: collapse; height: 8px;">
                <tr>
                  <td style="background: #295bff; background: linear-gradient(90deg, #295bff, #936290); height: 8px; border-radius: 4px; padding: 0;"></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Step List -->
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.5;">
          <tr>
            <td style="padding: 6px 0; color: #10b981; font-weight: bold; width: 28px;">✓</td>
            <td style="padding: 6px 0; color: #cbd5e1;">${t.step1}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #10b981; font-weight: bold;">✓</td>
            <td style="padding: 6px 0; color: #cbd5e1;">${t.step2}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #295bff; font-weight: bold;">➜</td>
            <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${t.step3}</td>
          </tr>
        </table>
      </div>

      <!-- Hero CTA Button with glowing style matching Tovy branding -->
      <div style="text-align: center; margin: 36px 0 32px 0;">
        <a href="https://tovy.eu/project-request/?id=${docId}" 
           style="background: #295bff; background: linear-gradient(90deg, #295bff, #936290); color: #ffffff; text-decoration: none; padding: 16px 36px; font-weight: 700; font-size: 14px; border-radius: 50px; display: inline-block; box-shadow: 0 0 30px rgba(41, 91, 255, 0.45); text-transform: uppercase; letter-spacing: 0.08em; border: 1px solid rgba(255, 255, 255, 0.1);">
          ${t.btnText}
        </a>
      </div>

      <!-- Alternative Action Block -->
      <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 28px; margin-top: 28px; margin-bottom: 28px;">
        <h5 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #ffffff;">${t.directConnTitle}</h5>
        <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; margin: 0 0 16px 0;">
          ${t.directConnText}
        </p>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
          <li style="margin-bottom: 8px;">
            ${t.optionReply} <a href="mailto:info@tovy.eu" style="color: #5773ff; font-weight: 600;">info@tovy.eu</a>
          </li>
          <li>
            ${t.optionSchedule} <a href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3GvYWPuGvxv0-8qtgsYeJKkgMUjmUqu-2D2FZrKqU6z75hXbUv6_FjFmbPdPBHcyew-fiAUXQ2?gv=true" style="color: #5773ff; font-weight: 600;">${t.optionLinkText}</a>
          </li>
        </ul>
      </div>

      <!-- Sign-off Block -->
      <div style="margin-bottom: 40px; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
        <p style="margin-bottom: 5px;">${t.bestRegards}</p>
        <p style="margin: 0; font-weight: 700; color: #ffffff;">Giel Nijkamp</p>
        <p style="margin: 0; font-size: 13px; color: #64748b;">${t.founderTitle}</p>
      </div>

      <!-- Footer with a thread-buster and unique reference to prevent Gmail collapsing threads -->
      <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 24px; text-align: center;">
        <p style="font-size: 11px; color: #64748b; margin: 0 0 8px 0;">${t.copyright.replace('{year}', String(year))}</p>
        <p style="font-size: 9px; color: #334155; margin: 0; font-family: monospace;">Ref: ${docId}</p>
      </div>

    </div>
  </div>
</body>
</html>`;
};
