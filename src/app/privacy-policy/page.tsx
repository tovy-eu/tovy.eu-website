
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Tovy',
  description: 'Review the privacy policy for Tovy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="space-y-6 text-muted-foreground">
        <p>
          Your privacy is important to us. It is Tovy's policy to respect your privacy regarding any information we may collect from you across our website. This policy is compliant with the General Data Protection Regulation (GDPR).
        </p>

        <h2 className="text-2xl font-semibold text-foreground pt-4">1. Information We Collect</h2>
        <p>
          We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and explicit consent. We also let you know why we’re collecting it and how it will be used.
        </p>
        <p>
          The personal information that we may collect includes:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>Contact details, such as your first name, last name, email address, and phone number.</li>
          <li>Company information and project details you provide through our project intake form.</li>
          <li>Email addresses for our newsletter subscription.</li>
          <li>Usage data, which may include information about how you use our website, collected via cookies.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground pt-4">2. How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>Respond to your inquiries and project requests.</li>
          <li>Send you newsletters if you have subscribed.</li>
          <li>Communicate with you about our services.</li>
          <li>Improve our website and services based on usage patterns.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground pt-4">3. Data Retention and Security</h2>
        <p>
          We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
        </p>

        <h2 className="text-2xl font-semibold text-foreground pt-4">4. Your Rights Under GDPR</h2>
        <p>
          As a user, you have the following rights regarding your personal data:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Right to be informed:</strong> You have the right to know how your data is collected and used.</li>
            <li><strong>Right of access:</strong> You have the right to request a copy of the information we hold about you.</li>
            <li><strong>Right to rectification:</strong> You have the right to have inaccurate personal data corrected.</li>
            <li><strong>Right to erasure:</strong> You have the right to have your personal data deleted.</li>
            <li><strong>Right to restrict processing:</strong> You can request that we limit the way we use your data.</li>
            <li><strong>Right to data portability:</strong> You have the right to receive your data in a machine-readable format.</li>
            <li><strong>Right to object:</strong> You have the right to object to the processing of your personal data.</li>
        </ul>
        <p>
            To exercise any of these rights, please contact us at our data protection contact email below.
        </p>

        <h2 className="text-2xl font-semibold text-foreground pt-4">5. Cookies</h2>
        <p>
          We use cookies to help improve your experience of our website. A cookie is a small piece of data that our website stores on your computer. We ask for your consent before storing any non-essential cookies. You can manage your cookie preferences at any time. At this time, we only use essential cookies for basic site functionality and to remember your cookie consent preference.
        </p>

        <h2 className="text-2xl font-semibold text-foreground pt-4">6. Contact Us</h2>
        <p>
          For any questions or concerns regarding your privacy, or to exercise your GDPR rights, you may contact our Data Protection Officer at: <a href="mailto:info@tovy.eu" className="underline hover:text-primary">info@tovy.eu</a>
        </p>

        <p className="pt-4">This policy is effective as of July 30, 2024.</p>
      </div>
    </div>
  );
}
