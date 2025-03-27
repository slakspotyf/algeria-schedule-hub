
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-10">
          <Link to="/">
            <Button variant="ghost" className="pl-0 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mt-4">Terms of Service</h1>
          <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p>
              Welcome to Sahla-Post. By accessing our website at sahla-post.com, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily use Sahla-Post for personal, non-commercial purposes only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Modify or copy the materials;</li>
              <li>Use the materials for any commercial purpose;</li>
              <li>Attempt to reverse engineer any software contained on Sahla-Post;</li>
              <li>Remove any copyright or other proprietary notations from the materials;</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Account Terms</h2>
            <p>
              To access and use the Sahla-Post services, you must register for a Sahla-Post account. You must provide accurate and complete information, and you are solely responsible for the security of your account.
            </p>
            <p className="mt-2">
              You are responsible for maintaining the security of your account and password. Sahla-Post cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Content</h2>
            <p>
              When you upload content to Sahla-Post or post content through our services, you give us a license to store, display, and use your content in connection with providing our services.
            </p>
            <p className="mt-2">
              You are solely responsible for the content you post through our service. You represent and warrant that you have all necessary rights to post such content and that doing so does not violate or infringe upon the rights of any third party.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
            <p>
              In no event shall Sahla-Post, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our service after these revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at legal@sahla-post.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
