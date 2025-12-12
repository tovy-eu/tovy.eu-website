
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal Notice | Tovy',
  description: 'Legal Notice and company information for Tovy.',
};

export default function LegalNoticePage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-6">Legal Notice (Impressum)</h1>
      <div className="space-y-4 text-muted-foreground">
        <p>Information pursuant to the German Telemedia Act (TMG) and other relevant EU regulations.</p>
        
        <div className="space-y-2 pt-4 text-foreground">
          <h2 className="text-xl font-semibold">Company Name:</h2>
          <p className="text-muted-foreground">[Your Company's Full Legal Name]</p>

          <h2 className="text-xl font-semibold">Address:</h2>
          <p className="text-muted-foreground">
            [Street Name & Number]<br />
            [Postal Code], [City]<br />
            [Country]
          </p>
          
          <h2 className="text-xl font-semibold">Contact:</h2>
          <p className="text-muted-foreground">
            Email: <a href="mailto:info@tovy.eu" className="underline hover:text-primary">info@tovy.eu</a><br />
            {/* Phone: [Your Company Phone Number] */}
          </p>

          <h2 className="text-xl font-semibold">Represented by:</h2>
          <p className="text-muted-foreground">[Name of Legal Representative, e.g., CEO or Managing Director]</p>

          <h2 className="text-xl font-semibold">Register Entry:</h2>
          <p className="text-muted-foreground">
            Register Court: [e.g., Amtsgericht Charlottenburg]<br />
            Registration Number: [e.g., HRB 123456 B]
          </p>
          
          <h2 className="text-xl font-semibold">VAT ID:</h2>
          <p className="text-muted-foreground">
            Value Added Tax Identification Number: [Your VAT ID Number]
          </p>
        </div>

        <div className="pt-6">
            <h2 className="text-2xl font-semibold text-foreground">Disclaimer</h2>
            <p className="mt-2">The contents of our pages have been created with the utmost care. However, we cannot guarantee the contents' accuracy, completeness or topicality. According to statutory provisions, we are furthermore responsible for our own content on these web pages. In this matter, please note that we are not obliged to monitor the transmitted or saved information of third parties, or investigate circumstances pointing to illegal activity.</p>
        </div>
      </div>
    </div>
  );
}
