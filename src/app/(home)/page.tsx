import Link from 'next/link';
import { Button } from '@/components/button';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      title: 'Real-Time Gateway',
      description: 'HTTP/2 + Protocol Buffers for efficient binary streaming',
      icon: '⚡',
    },
    {
      title: 'REST API',
      description: 'Complete REST interface with Discord-compatible snake_case',
      icon: '🔌',
    },
    {
      title: 'Voice Signaling',
      description: 'WebSocket-based WebRTC peer negotiation for audio/video',
      icon: '🎙️',
    },
    {
      title: 'Bot Interactions',
      description: 'Slash commands, webhooks, and automated responses',
      icon: '🤖',
    },
    {
      title: 'Analytics',
      description: 'Member growth, activity metrics, and engagement insights',
      icon: '📊',
    },
    {
      title: 'OAuth2',
      description: 'Third-party integrations and delegated access',
      icon: '🔐',
    },
  ];

  const quickLinks = [
    { title: 'Authentication', href: '/docs/authentication', icon: '🔑' },
    { title: 'Guilds', href: '/docs/guilds', icon: '🏛️' },
    { title: 'Channels & Messages', href: '/docs/channels', icon: '💬' },
    { title: 'Gateway Events', href: '/docs/gateway-events', icon: '📡' },
  ];

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center py-20 px-4 bg-gradient-to-b from-fd-background to-fd-card">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text">
            Oliqor Gateway API
          </h1>
          <p className="text-xl text-fd-muted-foreground mb-8 max-w-2xl mx-auto">
            The single backend entry point for all real-time and REST operations. Build community clients, mobile apps, and bots with a modern, Discord-compatible API.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/docs">
              <Button className="gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/docs/authentication">
              <Button variant="secondary">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg border border-fd-border bg-fd-card hover:bg-fd-accent transition-colors"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-fd-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 px-4 bg-fd-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Start</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="p-6 rounded-lg border border-fd-border bg-fd-background hover:border-fd-primary transition-colors group"
              >
                <div className="text-2xl mb-3">{link.icon}</div>
                <h3 className="font-semibold group-hover:text-fd-primary transition-colors">
                  {link.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Built For Performance</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-fd-primary mb-2">HTTP/2</div>
              <p className="text-fd-muted-foreground">ConnectRPC for efficient streaming</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-fd-primary mb-2">Protobuf</div>
              <p className="text-fd-muted-foreground">Binary serialization for speed</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-fd-primary mb-2">REST</div>
              <p className="text-fd-muted-foreground">Discord-compatible API</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-fd-card text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-fd-muted-foreground mb-8">
            Start integrating the Oliqor Gateway API today and create amazing community experiences.
          </p>
          <Link href="/docs/authentication">
            <Button size="lg" className="gap-2">
              Read the Docs
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
