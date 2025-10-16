'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing and using PexPay's services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services."
  },
  {
    title: "2. Use of Service",
    content: "You agree to use our services responsibly and legally. You will: <ul><li>Provide accurate and complete information during registration.</li><li>Maintain the confidentiality and security of your account credentials.</li><li>Not use the service for any illegal or unauthorized purpose.</li><li>Comply with all applicable laws, regulations, and third-party agreements.</li></ul>"
  },
  {
    title: "3. API Usage",
    content: "Your use of our API is subject to the documentation and rate limits we provide. We reserve the right to suspend or terminate API access for abuse, excessive use, or any use that threatens the stability of our systems."
  },
  {
    title: "4. Payment Terms",
    content: "Fees for our services are charged based on the subscription plan you select. All fees are quoted in Kenyan Shillings (KES) and are non-refundable, except as required by law or at our sole discretion."
  },
  {
    title: "5. Termination",
    content: "We may terminate or suspend your account and access to the services at any time, with or without cause or notice, for any reason, including for a violation of these terms. You may also terminate your account at any time."
  },
  {
    title: "6. Limitation of Liability",
    content: "To the fullest extent permitted by law, PexPay shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, resulting from your use of the service."
  },
  {
    title: "7. Changes to Terms",
    content: "We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new terms on this page. Your continued use of the service after any such change constitutes your acceptance of the new Terms of Service."
  },
  {
    title: "8. Contact Information",
    content: "If you have any questions about these Terms of Service, please contact us at <a href='mailto:legal@pexpay.com' class='text-primary hover:underline'>legal@pexpay.com</a>."
  }
]

export default function TermsPage() {
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
            <h1 className="text-5xl font-extrabold mb-4">Terms of Service</h1>
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
