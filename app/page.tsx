'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Zap,
  Brain,
  Shield,
  Clock,
  BarChart3,
  Network,
} from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Network className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">NAIAS</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Sign In
            </Link>
            <Button asChild size="sm">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6 mb-16">
          <Badge variant="outline" className="mx-auto">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered Investigation Platform
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground text-balance leading-tight">
            Investigate Network Incidents at
            <span className="text-primary"> Lightning Speed</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Network AI Autonomous System (NAIAS) uses intelligent queries and multi-agent orchestration to identify root causes and resolve incidents in minutes, not hours.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: Brain,
              title: 'AI Query Generation',
              description: 'Claude analyzes your incident and generates optimal queries automatically',
            },
            {
              icon: Clock,
              title: 'Rapid RCA',
              description: 'Get root cause analysis in minutes with AI-powered correlation and analysis',
            },
            {
              icon: Shield,
              title: 'Security Focused',
              description: 'Designed for fintech compliance with PCI-DSS and security audit support',
            },
            {
              icon: Zap,
              title: 'Real-time Processing',
              description: 'Live query execution with cost estimation and progress tracking',
            },
            {
              icon: BarChart3,
              title: 'Visual Analytics',
              description: 'Interactive timelines, topology diagrams, and evidence mapping',
            },
            {
              icon: Network,
              title: 'Multi-Service Integration',
              description: 'Correlate data from Athena, CloudWatch, VPC Flows, and Security Hub',
            },
          ].map((feature, idx) => (
            <Card key={idx} className="border-border/50 bg-card/50 hover:bg-card/80 transition">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border/50 bg-card/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { label: '< 2 Minutes', description: 'Average Investigation Time' },
              { label: '99%', description: 'Query Accuracy with AI' },
              { label: '50%', description: 'Faster MTTR vs Traditional Tools' },
            ].map((stat, idx) => (
              <div key={idx}>
                <p className="text-3xl font-bold text-primary">{stat.label}</p>
                <p className="text-sm text-muted-foreground mt-2">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">
            Ready to Transform Your Incident Response?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join infrastructure teams at leading fintech companies using NAIAS for faster incident resolution.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">Request Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2024 NAIAS by Pine Labs. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground transition">
              Docs
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
