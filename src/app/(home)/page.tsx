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
  Terminal,
  Code2,
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

const techStack = [
  {
    label: 'HTTP/2 + ConnectRPC',
    sub: 'Binary-framed streaming over a single multiplexed connection',
    icon: Zap,
  },
  {
    label: 'Protocol Buffers',
    sub: 'Compact, schema-first binary serialization',
    icon: Code2,
  },
  {
    label: 'WebSocket Gateway',
    sub: 'Persistent real-time event delivery to connected clients',
    icon: Terminal,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_-10%,hsl(var(--tw-color-fd-primary)/0.14),transparent)]" />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-b from-transparent to-fd-background" />
        </div>

        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* Left: copy */}
          <div className="flex flex-col items-start">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-fd-primary/30 bg-fd-primary/10 px-3 py-1 text-xs font-medium text-fd-primary mb-6">
              <span className="size-1.5 rounded-full bg-fd-primary animate-pulse" />
              Gateway API v1 · Public Beta
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5 leading-[1.08]">
              <span className="bg-linear-to-br from-fd-foreground via-fd-foreground to-fd-primary bg-clip-text text-transparent">
                Build on Oliqor
              </span>
            </h1>

            <p className="text-lg text-fd-muted-foreground mb-8 max-w-md leading-relaxed">
              A single backend entry point for all real-time and REST operations.
              Modern, Discord-compatible, and built for scale.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link href="/docs">
                <Button className="gap-2 shadow-lg shadow-fd-primary/20">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/docs/authentication">
                <Button variant="secondary">API Reference</Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-9 text-xs text-fd-muted-foreground">
              {['HTTP/2 Streaming', 'Protobuf Binary', 'WebSocket Gateway', 'OAuth2'].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-fd-primary/60" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Right: code window */}
          <div className="relative lg:block hidden">
            <div className="absolute -inset-3 rounded-2xl bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,hsl(var(--tw-color-fd-primary)/0.12),transparent)]" />
            <div className="relative rounded-xl border border-fd-border bg-fd-card overflow-hidden shadow-2xl shadow-fd-primary/5">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-fd-border bg-fd-muted/40">
                <div className="flex gap-1.5">
                  <span className="size-3 rounded-full bg-red-400/50" />
                  <span className="size-3 rounded-full bg-yellow-400/50" />
                  <span className="size-3 rounded-full bg-green-400/50" />
                </div>
                <span className="text-xs text-fd-muted-foreground font-mono ml-1.5">gateway.js</span>
              </div>
              <pre className="p-5 text-[11.5px] font-mono leading-[1.8] overflow-x-auto text-fd-foreground/85 select-none">
{`// Connect to the Gateway
const ws = new WebSocket(
  "wss://gateway.oliqor.io/v1"
);

ws.onopen = () => {
  ws.send(JSON.stringify({
    op: 2, // IDENTIFY
    d: { token: "Bot YOUR_TOKEN" }
  }));
};

ws.onmessage = ({ data }) => {
  const { t, d } = JSON.parse(data);
  if (t === "MESSAGE_CREATE") {
    console.log(\`#\${d.channel}: \${d.content}\`);
  }
};`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest text-fd-primary uppercase mb-3">Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-bold">Everything you need to build</h2>
            <p className="text-fd-muted-foreground mt-3 max-w-lg mx-auto text-sm">
              From real-time messaging to analytics, the Oliqor API covers the full stack of community platform needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-fd-border rounded-2xl overflow-hidden border border-fd-border">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-7 bg-fd-background hover:bg-fd-card transition-colors duration-200"
                >
                  <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-fd-primary/10 text-fd-primary group-hover:bg-fd-primary/20 transition-colors">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-sm font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-fd-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-24 px-4 border-y border-fd-border bg-fd-card/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest text-fd-primary uppercase mb-3">Quick Start</p>
            <h2 className="text-3xl md:text-4xl font-bold">Jump right in</h2>
            <p className="text-fd-muted-foreground mt-3 text-sm">
              Pick the area you need and go straight to the reference.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className="group flex flex-col gap-4 p-6 rounded-xl border border-fd-border bg-fd-background hover:border-fd-primary/50 hover:shadow-md hover:shadow-fd-primary/5 transition-all duration-200"
                >
                  <div className="inline-flex size-10 items-center justify-center rounded-lg bg-fd-muted text-fd-muted-foreground group-hover:bg-fd-primary/10 group-hover:text-fd-primary transition-colors">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm group-hover:text-fd-primary transition-colors">{link.title}</p>
                    <p className="text-xs text-fd-muted-foreground mt-1 leading-relaxed">{link.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-fd-muted-foreground/50 group-hover:text-fd-primary transition-colors">
                    <span>Read docs</span>
                    <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech internals */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest text-fd-primary uppercase mb-3">Internals</p>
            <h2 className="text-3xl md:text-4xl font-bold">Engineered for performance</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {techStack.map(({ label, sub, icon: Icon }) => (
              <div key={label} className="flex items-start gap-4 p-6 rounded-xl border border-fd-border bg-fd-card">
                <div className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-fd-primary/10 text-fd-primary">
                  <Icon size={16} />
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">{label}</div>
                  <p className="text-xs text-fd-muted-foreground leading-relaxed">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 border-t border-fd-border relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_70%_at_50%_110%,hsl(var(--tw-color-fd-primary)/0.1),transparent)]" />
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to build?</h2>
          <p className="text-fd-muted-foreground mb-8 leading-relaxed max-w-sm mx-auto">
            Start integrating the Oliqor Gateway API today and create amazing community experiences.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/docs">
              <Button size="lg" className="gap-2 shadow-lg shadow-fd-primary/20">
                Read the Docs
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/docs/authentication">
              <Button size="lg" variant="secondary">
                View Reference
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
