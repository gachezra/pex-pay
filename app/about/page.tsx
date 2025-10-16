'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Zap, ShieldCheck, Server, Handshake, Users, ArrowRight, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const values = [
  { 
    icon: <Zap className="h-10 w-10 text-primary" />, 
    title: 'Developer First', 
    description: 'We build powerful, intuitive tools that developers love to use, making integration effortless.' 
  },
  { 
    icon: <ShieldCheck className="h-10 w-10 text-primary" />, 
    title: 'Unyielding Security', 
    description: "Your customers' data is sacred. We protect it with industry-leading security protocols."
  },
  { 
    icon: <Server className="h-10 w-10 text-primary" />, 
    title: 'Rock-Solid Reliability', 
    description: 'With 99.9%+ uptime, we ensure your business never stops running, day or night.' 
  },
  { 
    icon: <Handshake className="h-10 w-10 text-primary" />, 
    title: 'Radical Transparency', 
    description: 'No hidden fees or confusing terms. We believe in clear pricing and honest communication.' 
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 pb-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-20 px-4"
        >
          <h1 className='text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent'>
            Simplifying M-Pesa Payments for Developers
          </h1>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            We're on a mission to make mobile money integration simple, secure, and accessible for every business in Kenya.
          </p>
        </motion.div>

        <div className="container mx-auto px-4 max-w-5xl">
          {/* Our Story Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="my-24"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold tracking-tight">Our Story: Built for Developers, by Developers</h2>
                <p className="text-muted-foreground text-lg">
                  PexPay was born from a common frustration: the tedious, time-consuming process of integrating M-Pesa. As developers ourselves, we knew there had to be a better way.
                </p>
                <p className="text-muted-foreground text-lg">
                  We set out to build the platform we wished existed—a clean, well-documented, and robust API that turns a complex challenge into a simple solution. Today, we empower hundreds of businesses to innovate faster and serve their customers better.
                </p>
              </div>
              <div className="flex justify-center">
                <Target className="w-48 h-48 text-primary opacity-20" />
              </div>
            </div>
          </motion.div>

          {/* Our Values Section */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="my-24 text-center"
          >
            <h2 className="text-4xl font-bold mb-16">The Values That Drive Us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {values.map((value) => (
                <div key={value.title} className="flex flex-col items-center space-y-4">
                  {value.icon}
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground text-center">{value.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className='my-24 text-center bg-gradient-to-r from-primary to-accent p-12 rounded-xl text-primary-foreground'
          >
            <h2 className='text-3xl font-bold mb-4'>Ready to Build the Future?</h2>
            <p className="mb-8 max-w-xl mx-auto">
              Join hundreds of other developers and businesses using PexPay to power their payments. Get started with our 14-day free trial.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg py-7 px-8 font-semibold hover:opacity-95 shadow-lg">
              <Link href="/signup">Start Your Free Trial <ArrowRight className="ml-2" /></Link>
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
