import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';

const TermsAndConditions = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <PageLayout>
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">Effective Date: August 1, 2025</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Definitions</h2>
            <p className="text-gray-600 mb-4">“User,” “you,” or “your” refers to any individual or entity using ChefsCircle.</p>
            <p className="text-gray-600 mb-4">“Content” means all text, images, videos, designs, code, and other material available on ChefsCircle.</p>
            <p className="text-gray-600 mb-4">“Services” means all features, tools, and offerings provided through ChefsCircle.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Eligibility</h2>
            <p className="text-gray-600 mb-4">You must be at least 13 years old to use ChefsCircle. By using the platform, you represent and warrant that you meet this requirement.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
            <p className="text-gray-600 mb-4">To access certain features, you may be required to create an account. You agree to provide accurate information and keep it updated. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">All content, logos, designs, trademarks, code, and materials on ChefsCircle are the exclusive property of ChefsCircle or its licensors. All rights are reserved.</p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Copy, modify, reproduce, republish, or distribute any part of ChefsCircle without prior written consent</li>
              <li>Use any ChefsCircle trademarks without permission</li>
              <li>Reverse engineer or attempt to extract the source code</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. License to Use</h2>
            <p className="text-gray-600 mb-4">We grant you a limited, non-exclusive, non-transferable license to access and use ChefsCircle for personal, non-commercial purposes in accordance with these Terms.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Prohibited Activities</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Use ChefsCircle for any unlawful purpose</li>
              <li>Attempt unauthorized access to any part of ChefsCircle</li>
              <li>Interfere with the security, functionality, or performance of the platform</li>
              <li>Upload or distribute viruses, malware, or harmful code</li>
              <li>Collect or store personal data about other users without consent</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. AI Tools and Content</h2>
            <p className="text-gray-600 mb-4">ChefsCircle may provide AI-powered features, suggestions, and content. While we strive for accuracy, we do not guarantee the completeness, safety, or effectiveness of AI-generated content. You use such features at your own discretion and risk.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Termination</h2>
            <p className="text-gray-600 mb-4">We reserve the right to suspend or terminate your access to ChefsCircle at any time, without notice or liability, for any reason, including violation of these Terms.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-gray-600 mb-4">ChefsCircle is provided on an “as is” and “as available” basis. We disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that ChefsCircle will always be available, secure, or error-free or that any content or information provided is accurate, complete, or reliable.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">To the fullest extent permitted by law, ChefsCircle shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising out of your use or inability to use the platform, even if advised of the possibility of such damages.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Indemnification</h2>
            <p className="text-gray-600 mb-4">You agree to indemnify, defend, and hold harmless ChefsCircle, its affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses, including reasonable attorney’s fees, arising out of your violation of these Terms or your use of ChefsCircle.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-600 mb-4">We may modify these Terms at any time. We will notify you of changes by posting the updated Terms on ChefsCircle. Your continued use after changes constitutes acceptance of the revised Terms.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">13. Governing Law</h2>
            <p className="text-gray-600 mb-4">These Terms are governed by and construed in accordance with the laws of Delhi, India, without regard to conflict of law principles. Any disputes arising from these Terms shall be resolved in the courts of Delhi, India.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">14. Severability</h2>
            <p className="text-gray-600 mb-4">If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">15. Entire Agreement</h2>
            <p className="text-gray-600 mb-4">These Terms constitute the entire agreement between you and ChefsCircle regarding your use of the platform and supersede any prior agreements or understandings.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">16. Contact Us</h2>
            <p className="text-gray-600 mb-4">For questions about these Terms, please contact us at <a href="mailto:Advithya@ChefsCircle.in" className="text-blue-600 underline">Advithya@ChefsCircle.in</a></p>

          </div>
        </div>
      </div>
    </section>
  </PageLayout>;
};

export default TermsAndConditions;
