
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
          <p className="text-muted-foreground">Tovy</p>

          <h2 className="text-xl font-semibold">Legal Structure:</h2>
          <p className="text-muted-foreground">Sole Proprietorship (Eenmanszaak)</p>
          
          <h2 className="text-xl font-semibold">Address:</h2>
          <p className="text-muted-foreground">
            Markendaalseweg 347<br />
            4811KW Breda<br />
            Nederland
          </p>
          
          <h2 className="text-xl font-semibold">Contact:</h2>
          <p className="text-muted-foreground">
            Email: <a href="mailto:info@tovy.eu" className="underline hover:text-primary">info@tovy.eu</a><br />
            Phone: +31 6 46879498
          </p>

          <h2 className="text-xl font-semibold">Represented by (Proprietor):</h2>
          <p className="text-muted-foreground">Gerrit Cornelis Nijkamp</p>

          <h2 className="text-xl font-semibold">Commercial Registry:</h2>
          <p className="text-muted-foreground">
            Dutch Chamber of Commerce (Kamer van Koophandel)
          </p>
          
          <h2 className="text-xl font-semibold">KvK Number (Registration Number):</h2>
          <p className="text-muted-foreground">
            98787055
          </p>

          <h2 className="text-xl font-semibold">VAT Identification Number:</h2>
          <p className="text-muted-foreground">
            NL005353903B84
          </p>

          <h2 className="text-xl font-semibold">Primary Business Activity:</h2>
          <p className="text-muted-foreground">
            Support of business process automation (consulting and engineering)
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
