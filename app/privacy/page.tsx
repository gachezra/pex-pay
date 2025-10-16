'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const sections = [
  {
    title: "1. Information We Collect",
    content: "We collect information you provide directly to us when you create an account, such as your name, email address, phone number, and business details. We also collect information automatically when you use our services, including transaction data, log information, and device information."
  },
  {
    title: "2. How We Use Your Information",
    content: "We use your information to: <ul><li>Provide, maintain, and improve our services.</li><li>Process transactions and send you related information, like confirmations and invoices.</li><li>Send technical notices, updates, security alerts, and support messages.</li><li>Respond to your comments, questions, and requests for customer service.</li><li>Monitor and analyze trends, usage, and activities in connection with our services.</li></ul>"
  },
  {
    title: "3. Information Sharing",
    content: "We do not share your personal information with third parties except in the following cases or as otherwise described in this Policy: <ul><li>With your consent.</li><li>With third-party vendors and service providers who need access to such information to carry out work on our behalf.</li><li>If required by law, regulation, or legal process.</li><li>To protect the rights, property, and safety of PexPay or others.</li></ul>"
  },
  {
    title: "4. Data Security",
    content: "We implement industry-standard security measures to protect your personal information from unauthorized access, use, alteration, or destruction. These measures include data encryption, firewalls, and secure socket layer (SSL) technology."
  },
  {
    title: "5. Your Rights and Choices",
    content: "You have rights over your personal data. Depending on your location, you may have the right to: <ul><li>Access the personal data we hold about you.</li><li>Request that we correct inaccurate or incomplete data.</li><li>Request the deletion of your personal data.</li><li>Object to or restrict our processing of your data.</li></ul>You can exercise these rights by contacting us."
  },
  {
    title: "6. Cookies and Tracking Technologies",
    content: "We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
  },
  {
    title: "7. Changes to This Policy",
    content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the \"Last updated\" date."
  },
  {
    title: "8. Contact Us",
    content: "If you have any questions about this Privacy Policy, please contact us at <a href='mailto:privacy@pexpay.com' class='text-primary hover:underline'>privacy@pexpay.com</a>."
  }
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-extrabold mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
