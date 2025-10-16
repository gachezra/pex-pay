'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const tiers = [
  {
    name: 'Flex',
    price: { weekly: 'KES 500' },
    description: 'For short-term projects or trying out the service',
    features: [
      'Up to 250 transactions/week',
      'Basic API access',
      'Email support',
      '14-day free trial',
    ],
  },
  {
    name: 'Pro',
    price: { monthly: 'KES 1,500', annually: 'KES 15,000' },
    description: 'For regular users and businesses with consistent needs',
    features: [
      'Up to 2,000 transactions/month',
      'Full API access',
      'Priority email & chat support',
      'Real-time analytics',
      '14-day free trial',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: { monthly: 'Custom' },
    description: 'Custom solutions for large organizations',
    features: [
      'Unlimited transactions',
      'Dedicated API endpoints',
      '24/7 phone support',
      'Custom integrations',
      'Dedicated account manager',
    ],
  },
]

const featureComparison = {
  headers: ['Feature', 'Flex', 'Pro', 'Enterprise'],
  rows: [
    { feature: 'Transactions', flex: '250/week', pro: '2,000/month', enterprise: 'Unlimited' },
    { feature: 'API Access', flex: <Check className="text-green-500" />, pro: <Check className="text-green-500" />, enterprise: 'Dedicated' },
    { feature: 'Support', flex: 'Email', pro: 'Priority Email & Chat', enterprise: '24/7 Phone' },
    { feature: 'Analytics', flex: '-', pro: <Check className="text-green-500" />, enterprise: <Check className="text-green-500" /> },
    { feature: 'Account Manager', flex: '-', pro: '-', enterprise: <Check className="text-green-500" /> },
  ],
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly') // weekly, monthly, annually

  return (
    <div className='min-h-screen'>
      <Header />

      <main className='pt-24 pb-20'>
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-center mb-16'
          >
            <h1 className='text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent'>
              Find Your Perfect Plan
            </h1>
            <p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
              Start for free, then choose a plan that fits your needs. Simple, transparent, and scalable.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Label htmlFor="billing-toggle" className={`text-lg ${billingCycle !== 'annually' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                Monthly
              </Label>
              <Switch
                id="billing-toggle"
                checked={billingCycle === 'annually'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'annually' : 'monthly')}
                className="data-[state=checked]:bg-primary"
              />
              <Label htmlFor="billing-toggle" className={`text-lg ${billingCycle === 'annually' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                Annual <span className="text-sm font-normal text-green-600">(Save 17%)</span>
              </Label>
            </div>
          </motion.div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch'>
            {tiers.map((tier, index) => {
              let price = tier.price.monthly;
              let period = 'month';

              if (billingCycle === 'annually' && tier.price.annually) {
                  price = tier.price.annually;
                  period = 'year';
              } else if (billingCycle !== 'annually' && tier.name === 'Flex') {
                  price = tier.price.weekly;
                  period = 'week';
              } else if (billingCycle !== 'annually' && !tier.price.monthly) {
                  return null;
              }

              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className='h-full'
                >
                  <Card
                    className={`h-full flex flex-col rounded-xl transition-shadow duration-300 ${tier.popular ? 'border-primary border-2 shadow-2xl relative' : 'border-2 dark:border-gray-700 hover:shadow-lg'}`}>
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <CardHeader className="pt-10">
                      <CardTitle className='text-3xl font-bold tracking-tight'>{tier.name}</CardTitle>
                      <CardDescription className="text-md">{tier.description}</CardDescription>
                      <div className='mt-6'>
                        <motion.div
                          key={price}
                          initial={{ opacity: 0, y: -15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className='text-5xl font-extrabold'
                        >
                          {price}
                        </motion.div>
                        {tier.name !== 'Enterprise' && (
                          <p className="text-sm text-muted-foreground mt-1">
                            per {period}
                          </p>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className='flex-grow py-6'>
                      <ul className='space-y-4'>
                        {tier.features.map((feature) => (
                          <li key={feature} className='flex items-start'>
                            <Check className='h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5' />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="pb-6">
                      <Button
                        asChild
                        className={`w-full text-lg py-6 font-semibold ${tier.popular ? 'bg-gradient-to-r from-primary to-accent hover:opacity-95 shadow-lg' : ''}`}
                        variant={tier.popular ? 'default' : 'outline'}
                      >
                        <Link href='/signup'>
                          {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                          {tier.name !== 'Enterprise' && <ArrowRight className="ml-2 h-5 w-5" />}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className='mt-24'
          >
            <h2 className='text-4xl font-bold text-center mb-12'>Feature Comparison</h2>
            <Card className="overflow-x-auto">
              <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <div className="bg-gray-100 dark:bg-gray-800">
                    <div className="grid grid-cols-4 font-semibold text-left">
                        <div className="p-4">{featureComparison.headers[0]}</div>
                        <div className="p-4 text-center">{featureComparison.headers[1]}</div>
                        <div className="p-4 text-center">{featureComparison.headers[2]}</div>
                        <div className="p-4 text-center">{featureComparison.headers[3]}</div>
                    </div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {featureComparison.rows.map((row, i) => (
                      <div key={i} className="grid grid-cols-4 items-center">
                          <div className="p-4 font-medium">{row.feature}</div>
                          <div className="p-4 text-center text-muted-foreground flex justify-center">{row.flex}</div>
                          <div className="p-4 text-center text-muted-foreground flex justify-center">{row.pro}</div>
                          <div className="p-4 text-center text-muted-foreground flex justify-center">{row.enterprise}</div>
                      </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className='mt-24 text-center'
          >
            <h2 className='text-4xl font-bold mb-12'>Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className='max-w-3xl mx-auto text-left'>
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-semibold">What payment methods do you accept?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We accept all major payment methods including M-Pesa, credit cards, and bank transfers for annual plans.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="font-semibold">Can I change my plan later?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be prorated.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="font-semibold">Do you offer a free trial?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, all our plans come with a 14-day free trial so you can explore the features before committing. No credit card is required to start.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className='my-24 text-center bg-gradient-to-r from-primary to-accent p-12 rounded-xl text-primary-foreground'
          >
            <h2 className='text-3xl font-bold mb-4'>Ready to Get Started?</h2>
            <p className="mb-8 max-w-xl mx-auto">
              Explore our features with a no-risk 14-day free trial. No credit card required.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg py-7 px-8 font-semibold hover:opacity-95 shadow-lg">
              <Link href="/signup">Start Your Free Trial Now <ArrowRight className="ml-2" /></Link>
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
