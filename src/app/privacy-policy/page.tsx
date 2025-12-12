
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

        <h2 className="text-2xl font-semibold text-foreground pt-4">1. Data Controller</h2>
        <p>
          Tovy is the data controller for the personal information collected through this website. For any questions, you can contact us at <a href="mailto:info@tovy.eu" className="underline hover:text-primary">info@tovy.eu</a>.
        </p>

        <h2 className="text-2xl font-semibold text-foreground pt-4">2. Information We Collect and How We Use It</h2>
        <p>
          We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and explicit consent. The legal bases for our processing are primarily consent, contractual necessity, and legitimate interest.
        </p>
        <ul className="list-disc list-inside space-y-4 pl-4">
          <li>
            <strong>Project Intake Form:</strong> We collect your name, contact details (email, phone), company information, and project details. This data is stored in Google Cloud Firestore and is used to evaluate and respond to your project request. The legal basis is the intention to enter into a contract.
          </li>
          <li>
            <strong>Newsletter Subscription:</strong> We collect your email address when you subscribe to our newsletter. This data is stored in Google Cloud Firestore and used solely for sending you newsletters. The legal basis is your explicit consent.
          </li>
          <li>
            <strong>Server Logs:</strong> Our web server, hosted by Firebase Hosting, automatically logs requests, which may include your IP address, browser type, and the pages you visit. This data is used for security monitoring and diagnostics. The legal basis is our legitimate interest in maintaining a secure and functional website.
          </li>
          <li>
            <strong>Cookies:</strong> We use essential cookies to manage your consent preferences regarding tracking. We do not use non-essential or tracking cookies (like those for Google Analytics) without your explicit prior consent via our cookie banner.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground pt-4">3. Data Residency and Transfers</h2>
        <p>
          To protect your data, we have configured our primary database (Cloud Firestore) to be located within the European Union (`eur3` multi-region). While we prioritize EU-based services, some of our subprocessors (like Google) may transfer data internationally. All such transfers are conducted under legally compliant mechanisms, such as Standard Contractual Clauses.
        </p>

        <h2 className="text-2xl font-semibold text-foreground pt-4">4. Data Retention and Security</h2>
        <p>
          We retain collected information only for as long as necessary to provide our services or as required by law. For example, subscription data is kept until you unsubscribe. We protect stored data within commercially acceptable means to prevent loss, theft, and unauthorized access.
        </p>

        <h2 className="text-2xl font-semibold text-foreground pt-4">5. Your Rights Under GDPR</h2>
        <p>
          As a user, you have the following rights regarding your personal data:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Right to be informed:</strong> You have the right to know how your data is collected and used.</li>
            <li><strong>Right of access:</strong> You can request a copy of the information we hold about you.</li>
            <li><strong>Right to rectification:</strong> You can have inaccurate personal data corrected.</li>
            <li><strong>Right to erasure ("Right to be Forgotten"):</strong> You can request that we delete your personal data.</li>
            <li><strong>Right to restrict processing:</strong> You can limit how we use your data.</li>
            <li><strong>Right to data portability:</strong> You have the right to receive your data in a machine-readable format.</li>
            <li><strong>Right to object:</strong> You can object to the processing of your personal data.</li>
        </ul>
        <p className="mt-2">
            To exercise any of these rights, please contact us at our data protection contact email below.
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
