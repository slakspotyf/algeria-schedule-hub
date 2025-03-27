
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link 
          to="/" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to Sahla-Post. We respect your privacy and are committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
            use our service.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when you:
          </p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>Create an account</li>
            <li>Connect social media accounts</li>
            <li>Create and schedule posts</li>
            <li>Contact our support team</li>
            <li>Participate in surveys or promotions</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Social Media Integration</h2>
          <p>
            Our service allows you to connect your social media accounts. When you choose to connect a social 
            media account, we request access to certain information from that platform. The specific permissions 
            we request are displayed during the connection process and you can review them before granting access.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Process and complete transactions</li>
            <li>Send administrative information</li>
            <li>Send marketing communications</li>
            <li>Respond to your comments and questions</li>
            <li>Analyze usage patterns and trends</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. How We Share Your Information</h2>
          <p>
            We do not sell your personal information. We may share your information in the following situations:
          </p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>With your consent</li>
            <li>With third-party service providers that help us operate our business</li>
            <li>To comply with legal obligations</li>
            <li>In connection with a business transfer or transaction</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect the security of your 
            personal information. However, no method of transmission over the Internet or electronic storage 
            is completely secure, so we cannot guarantee absolute security.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, such as:
          </p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>Access to your personal information</li>
            <li>Correction of inaccurate data</li>
            <li>Deletion of your personal information</li>
            <li>Restriction of processing</li>
            <li>Data portability</li>
            <li>Objection to processing</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
            the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mt-2">
            <strong>Email:</strong> privacy@sahla-post.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
