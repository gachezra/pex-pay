
"use client"

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Code, TrendingUp, Zap, Lock, BarChart3 } from 'lucide-react'
import { auth } from '@/lib/firebase/client';
import { onAuthStateChanged } from 'firebase/auth';

const features = [
  {
    icon: Shield,
    title: 'Secure API Keys',
    description: 'Bank-grade encryption for all your API keys and sensitive data.'
  },
  {
    icon: Code,
    title: 'Developer Friendly',
    description: 'Clean, well-documented API with code examples in multiple languages.'
  },
  {
    icon: TrendingUp,
    title: 'Real-time Analytics',
    description: 'Track every transaction with detailed insights and reporting.'
  },
  {
    icon: Zap,
    title: 'Instant Processing',
    description: 'Lightning-fast STK push notifications delivered in milliseconds.'
  },
  {
    icon: Lock,
    title: 'PCI Compliant',
    description: 'Enterprise-grade security that meets industry standards.'
  },
  {
    icon: BarChart3,
    title: 'Detailed Reports',
    description: 'Comprehensive transaction history and financial reporting.'
  }
]

const steps = [
  {
    number: '01',
    title: 'Sign Up',
    description: 'Create your free account in seconds'
  },
  {
    number: '02',
    title: 'Configure',
    description: 'Add your M-Pesa business details'
  },
  {
    number: '03',
    title: 'Generate Key',
    description: 'Get your secure API key instantly'
  },
  {
    number: '04',
    title: 'Integrate',
    description: 'Start accepting payments immediately'
  }
]

const testimonials = [
  {
    quote: "PexPay transformed how we handle payments. The integration was seamless and support is outstanding.",
    author: "Sarah Kamau",
    role: "CTO, TechVenture Kenya"
  },
  {
    quote: "The best M-Pesa API I've worked with. Clean documentation and reliable service every time.",
    author: "James Ochieng",
    role: "Lead Developer, PayFlow"
  },
  {
    quote: "We processed over 10,000 transactions last month without a single issue. Absolutely reliable.",
    author: "Grace Mwangi",
    role: "Product Manager, ShopHub"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-16">
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-card">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />

          <div className="container mx-auto px-4 py-20 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                Seamless M-Pesa Payments for Your Application
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-muted-foreground mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                Powerful, secure, and developer-friendly API for M-Pesa STK Push integration
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                {isLoggedIn ? (
                  <Button size="lg" asChild className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8">
                    <Link href="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" asChild className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8">
                    <Link href="/signup">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                )}
                <Button size="lg" variant="outline" asChild className="text-lg px-8">
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-4">
                Everything You Need
              </motion.h2>
              <motion.p variants={itemVariants} className="text-xl text-muted-foreground">
                Built for developers who demand excellence
              </motion.p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-accent">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-muted-foreground">Get started in four simple steps</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center relative"
                >
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-accent to-transparent" />
                  )}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-4 relative z-10">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Trusted by Developers</h2>
              <p className="text-xl text-muted-foreground">See what our customers say</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <p className="text-lg mb-4 italic">\"{testimonial.quote}\"</p>
                      <div className="border-t pt-4">
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join hundreds of developers already using PexPay
              </p>
              {isLoggedIn ? (
                <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                  <Link href="/signup">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
