"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

const sections = [
  {
    title: "1. Introduction",
    content:
      "Welcome to PexPay. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services. By using our services, you agree to the collection and use of information in accordance with this policy.",
  },
  {
    title: "2. Information We Collect",
    content:
      "We may collect personal information that you provide to us directly, such as your name, email address, phone number, and payment information. We also automatically collect certain information when you use our services, such as your IP address, browser type, and usage data.",
  },
  {
    title: "3. Information Sharing",
    content:
      "We do not share your personal information with third parties except in the following cases or as otherwise described in this Policy: <ul><li>With your consent.</li><li>With third-party vendors and service providers who need access to such information to carry out work on our behalf.</li><li>If required by law, regulation, or legal process.</li><li>To protect the rights, property, and safety of PexPay or others.</li></ul>",
  },
  {
    title: "4. Data Security",
    content:
      "We implement industry-standard security measures to protect your personal information from unauthorized access, use, alteration, or destruction. These measures include data encryption, firewalls, and secure socket layer (SSL) technology.",
  },
  {
    title: "5. Your Rights and Choices",
    content:
      "You have certain rights regarding your personal information. You can access, correct, or delete your personal information by contacting us. You may also opt-out of receiving promotional communications from us by following the instructions in those communications.",
  },
  {
    title: "6. Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our website. You are advised to review this Privacy Policy periodically for any changes.",
  },
  {
    title: "7. Contact Us",
    content:
      "If you have any questions about this Privacy Policy, please contact us at <a href='mailto:support@pexpay.com' className='text-primary hover:underline'>support@pexpay.com</a>.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Privacy Policy
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Last updated: July 22, 2024
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
  );
}
