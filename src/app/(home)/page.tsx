import Link from 'next/link';
import { Button } from '@/components/button';
import {
  ArrowRight,
  Zap,
  Globe,
  Mic,
  Bot,
  BarChart2,
  ShieldCheck,
  KeyRound,
  Building2,
  MessageSquare,
  Radio,
  ChevronRight,
} from 'lucide-react';

const features = [
  {
    title: 'Real-Time Gateway',
    description: 'HTTP/2 + Protocol Buffers for efficient binary streaming with sub-millisecond latency.',
    icon: Zap,
  },
  {
    title: 'REST API',
    description: 'Complete REST interface with Discord-compatible snake_case naming conventions.',
    icon: Globe,
  },
  {
    title: 'Voice Signaling',
    description: 'WebSocket-based WebRTC peer negotiation for high-quality audio and video.',
    icon: Mic,
  },
  {
    title: 'Bot Interactions',
    description: 'Slash commands, webhooks, and automated response pipelines.',
    icon: Bot,
  },
  {
    title: 'Analytics',
    description: 'Member growth, activity metrics, and engagement insights in real time.',
    icon: BarChart2,
  },
  {
    title: 'OAuth2',
    description: 'Third-party integrations and delegated access with standard OAuth2 flows.',
    icon: ShieldCheck,
  },
];

const quickLinks = [
  { title: 'Authentication', desc: 'Tokens, sessions, and API keys', href: '/docs/authentication', icon: KeyRound },
  { title: 'Guilds', desc: 'Server management and settings', href: '/docs/guilds', icon: Building2 },
  { title: 'Channels', desc: 'Messaging, threads, and reactions', href: '/docs/channels', icon: MessageSquare },
  { title: 'Gateway Events', desc: 'Real-time event subscriptions', href: '/docs/gateway-events', icon: Radio },
];

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <section className="relative flex flex-col justify-center items-center text-center pt-28 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-fd-primary/6 via-transparent to-transparent" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(var(--tw-color-fd-primary)/0.12),transparent)]" />

        <div className="inline-flex items-center gap-1.5 rounded-full border border-fd-primary/30 bg-fd-primary/10 px-3 py-1 text-xs font-medium text-fd-primary mb-6">
          <span className="size-1.5 rounded-full bg-fd-primary animate-pulse" />
          Gateway API v1 · Public Beta
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
          <span className="bg-linear-to-br from-fd-foreground via-fd-foreground to-fd-primary bg-clip-text text-transparent">
            Oliqor
          </span>
          <br />
          <span className="text-fd-muted-foreground text-4xl md:text-5xl font-semibold">
            Gateway API
          </span>
        </h1>

        <p className="text-lg text-fd-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
          The single backend entry point for all real-time and REST operations.
          Build community clients, mobile apps, and bots with a modern, Discord-compatible API.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/docs">
            <Button className="gap-2 shadow-lg shadow-fd-primary/20">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/docs/authentication">
            <Button variant="secondary">
              View Reference
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest text-fd-primary uppercase mb-3">Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-bold">Everything you need to build</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative p-6 rounded-xl border border-fd-border bg-fd-card hover:border-fd-primary/40 hover:bg-fd-card transition-all duration-200"
                >
                  <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-fd-primary/10 text-fd-primary group-hover:bg-fd-primary/15 transition-colors">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-base font-semibold mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-fd-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-20 px-4 bg-fd-card border-y border-fd-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest text-fd-primary uppercase mb-3">Quick Start</p>
            <h2 className="text-3xl md:text-4xl font-bold">Jump right in</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className="group flex flex-col gap-3 p-5 rounded-xl border border-fd-border bg-fd-background hover:border-fd-primary/50 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="inline-flex size-9 items-center justify-center rounded-lg bg-fd-muted text-fd-muted-foreground group-hover:bg-fd-primary/10 group-hover:text-fd-primary transition-colors">
                      <Icon size={16} />
                    </div>
                    <ChevronRight size={14} className="text-fd-muted-foreground/50 group-hover:text-fd-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm group-hover:text-fd-primary transition-colors">{link.title}</p>
                    <p className="text-xs text-fd-muted-foreground mt-0.5">{link.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Performance stats */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest text-fd-primary uppercase mb-3">Performance</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-14">Built for speed</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { label: 'HTTP/2', sub: 'ConnectRPC streaming' },
              { label: 'Protobuf', sub: 'Binary serialization' },
              { label: 'REST', sub: 'Discord-compatible API' },
            ].map(({ label, sub }) => (
              <div key={label} className="p-6 rounded-xl border border-fd-border bg-fd-card">
                <div className="text-3xl font-bold text-fd-primary mb-2">{label}</div>
                <p className="text-sm text-fd-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-fd-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to build?</h2>
          <p className="text-fd-muted-foreground mb-8 leading-relaxed">
            Start integrating the Oliqor Gateway API today and create amazing community experiences.
          </p>
          <Link href="/docs">
            <Button size="lg" className="gap-2 shadow-lg shadow-fd-primary/20">
              Read the Docs
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
