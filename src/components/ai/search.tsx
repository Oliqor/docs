'use client';
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  type SyntheticEvent,
  use,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Bot, RefreshCw, SearchIcon, Send, Sparkles, Square, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useChat, type UseChatHelpers } from '@ai-sdk/react';
import { DefaultChatTransport, type Tool, type UIToolInvocation } from 'ai';
import { Markdown } from '../markdown';
import { Presence } from '@radix-ui/react-presence';
import type { ChatUIMessage, SearchTool } from '../../app/api/chat/route';

const Context = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  chat: UseChatHelpers<ChatUIMessage>;
} | null>(null);

// ─── Header ──────────────────────────────────────────────────────────────────

export function AISearchPanelHeader({ className, ...props }: ComponentProps<'div'>) {
  const { setOpen } = useAISearchContext();

  return (
    <div
      className={cn(
        'relative flex items-center gap-3 px-4 py-3.5 shrink-0',
        'border-b border-fd-border/70',
        'bg-linear-to-r from-fd-primary/5 via-transparent to-transparent',
        className,
      )}
      {...props}
    >
      {/* Glow accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-fd-primary/40 via-fd-primary/20 to-transparent" />

      <div className="relative flex items-center justify-center size-8 rounded-xl shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-fd-primary/30 to-fd-primary/10" />
        <div className="absolute inset-0 bg-fd-primary/10 blur-sm" />
        <Sparkles size={15} className="relative text-fd-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-none tracking-tight text-fd-foreground">
          Ask Quin AI
        </p>
        <p className="text-[11px] text-fd-muted-foreground mt-1 leading-none">
          Quin was trained with the Oliqor Gateway API docs
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-fd-border bg-fd-muted/60 px-1.5 py-0.5 text-[10px] text-fd-muted-foreground font-mono">
          ⌘/
        </kbd>
        <button
          aria-label="Close"
          className={cn(
            'flex items-center justify-center size-7 rounded-lg',
            'text-fd-muted-foreground hover:text-fd-foreground',
            'hover:bg-fd-muted/80 transition-colors',
          )}
          onClick={() => setOpen(false)}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Input Actions (retry / clear) ───────────────────────────────────────────

export function AISearchInputActions() {
  const { messages, status, setMessages, regenerate } = useChatContext();
  const isLoading = status === 'streaming';

  if (messages.length === 0) return null;

  return (
    <>
      {!isLoading && messages.at(-1)?.role === 'assistant' && (
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted/70 transition-colors"
          onClick={() => regenerate()}
        >
          <RefreshCw size={11} />
          Regenerate
        </button>
      )}
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted/70 transition-colors"
        onClick={() => setMessages([])}
      >
        New chat
      </button>
    </>
  );
}

// ─── Chat Input ───────────────────────────────────────────────────────────────

const StorageKeyInput = '__ai_search_input';

export function AISearchInput(props: ComponentProps<'form'>) {
  const { status, sendMessage, stop } = useChatContext();
  const [input, setInput] = useState(() => localStorage.getItem(StorageKeyInput) ?? '');
  const isLoading = status === 'streaming' || status === 'submitted';

  const onStart = (e?: SyntheticEvent) => {
    e?.preventDefault();
    const message = input.trim();
    if (message.length === 0) return;
    void sendMessage({
      role: 'user',
      parts: [
        { type: 'data-client', data: { location: location.href } },
        { type: 'text', text: message },
      ],
    });
    setInput('');
    localStorage.removeItem(StorageKeyInput);
  };

  useEffect(() => {
    if (isLoading) document.getElementById('nd-ai-input')?.focus();
  }, [isLoading]);

  return (
    <form
      {...props}
      className={cn('px-3 pb-3', props.className)}
      onSubmit={onStart}
    >
      <div className="relative flex items-end gap-2 rounded-2xl border border-fd-border bg-fd-muted/40 px-3.5 py-2.5 focus-within:border-fd-primary/50 focus-within:bg-fd-background focus-within:shadow-[0_0_0_3px_hsl(var(--color-fd-primary)/0.08)] transition-all">
        <GrowingTextarea
          value={input}
          placeholder={isLoading ? 'Answering…' : 'Ask anything about the docs…'}
          autoFocus
          disabled={isLoading}
          onChange={(e) => {
            setInput(e.target.value);
            localStorage.setItem(StorageKeyInput, e.target.value);
          }}
          onKeyDown={(event) => {
            if (!event.shiftKey && event.key === 'Enter') {
              onStart(event);
            }
          }}
        />
        {isLoading ? (
          <button
            key="stop"
            type="button"
            aria-label="Stop"
            className="shrink-0 mb-0.5 flex items-center justify-center size-7 rounded-lg bg-fd-primary/15 text-fd-primary hover:bg-fd-primary/25 transition-colors"
            onClick={stop}
          >
            <Square size={11} className="fill-current" />
          </button>
        ) : (
          <button
            key="send"
            type="submit"
            aria-label="Send"
            disabled={input.trim().length === 0}
            className="shrink-0 mb-0.5 flex items-center justify-center size-7 rounded-lg bg-fd-primary text-fd-primary-foreground hover:opacity-85 disabled:opacity-25 transition-all"
          >
            <Send size={12} />
          </button>
        )}
      </div>
      <p className="mt-1.5 text-center text-[10px] text-fd-muted-foreground/60">
        AI can make mistakes — verify important information
      </p>
    </form>
  );
}

// ─── Auto-growing textarea ────────────────────────────────────────────────────

function GrowingTextarea(props: ComponentProps<'textarea'>) {
  const shared = cn('col-start-1 row-start-1 text-sm leading-relaxed', props.className);

  return (
    <div className="grid flex-1 min-w-0">
      <textarea
        id="nd-ai-input"
        rows={1}
        {...props}
        className={cn(
          'resize-none bg-transparent placeholder:text-fd-muted-foreground/70 focus-visible:outline-none max-h-36 overflow-y-auto',
          shared,
        )}
      />
      <div className={cn(shared, 'break-all invisible pointer-events-none whitespace-pre-wrap')}>
        {`${props.value?.toString() ?? ''}\n`}
      </div>
    </div>
  );
}

// ─── Scrolling message list ───────────────────────────────────────────────────

function List(props: Omit<ComponentProps<'div'>, 'dir'>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      const el = containerRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: 'instant' });
    });
    const el = containerRef.current?.firstElementChild;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      {...props}
      className={cn('fd-scroll-container overflow-y-auto min-w-0 flex flex-col', props.className)}
    >
      {props.children}
    </div>
  );
}

// ─── Message ──────────────────────────────────────────────────────────────────

function Message({ message, ...props }: { message: ChatUIMessage } & ComponentProps<'div'>) {
  let markdown = '';
  const searchCalls: UIToolInvocation<SearchTool>[] = [];

  for (const part of message.parts ?? []) {
    if (part.type === 'text') {
      markdown += part.text;
      continue;
    }
    if (part.type.startsWith('tool-')) {
      const toolName = part.type.slice('tool-'.length);
      const p = part as UIToolInvocation<Tool>;
      if (toolName !== 'search' || !p.toolCallId) continue;
      searchCalls.push(p);
    }
  }

  const isUser = message.role === 'user';

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn('flex gap-2.5', isUser ? 'flex-row-reverse' : 'flex-row')}
      {...props}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="shrink-0 mt-0.5 flex items-center justify-center size-6 rounded-lg bg-linear-to-br from-fd-primary/25 to-fd-primary/10 text-fd-primary ring-1 ring-fd-primary/20">
          <Bot size={12} />
        </div>
      )}

      <div className={cn('flex flex-col gap-1.5 min-w-0', isUser ? 'items-end' : 'items-start flex-1')}>
        {/* Bubble */}
        {isUser ? (
          <div className="rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm leading-relaxed bg-fd-primary text-fd-primary-foreground max-w-[85%]">
            <p className="whitespace-pre-wrap">{markdown}</p>
          </div>
        ) : (
          <div className="w-full text-sm leading-relaxed text-fd-foreground">
            <div className="prose prose-sm max-w-none [&_p:last-child]:mb-0 [&_pre]:bg-fd-muted [&_pre]:border [&_pre]:border-fd-border [&_pre]:rounded-xl [&_code:not(pre_code)]:bg-fd-primary/10 [&_code:not(pre_code)]:text-fd-primary [&_code:not(pre_code)]:rounded [&_code:not(pre_code)]:px-1 [&_code:not(pre_code)]:py-0.5 [&_code:not(pre_code)]:text-xs">
              <Markdown text={markdown} />
            </div>
          </div>
        )}

        {/* Search tool indicators */}
        {searchCalls.map((call) => (
          <div
            key={call.toolCallId}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors',
              call.output
                ? 'bg-fd-primary/8 text-fd-primary/80 border border-fd-primary/15'
                : 'bg-fd-muted/60 text-fd-muted-foreground border border-fd-border/60 animate-pulse',
            )}
          >
            <SearchIcon size={10} />
            {call.output ? `Found ${call.output.length} results` : 'Searching docs…'}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Message list with empty state ───────────────────────────────────────────

const suggestions = [
  { text: 'How do I authenticate with the API?', icon: '🔑' },
  { text: 'What events does the Gateway emit?', icon: '⚡' },
  { text: 'How do bots send messages?', icon: '🤖' },
];

export function AISearchPanelList({ className, style, ...props }: ComponentProps<'div'>) {
  const chat = useChatContext();
  const messages = chat.messages.filter((msg) => msg.role !== 'system');

  return (
    <List
      className={cn('overscroll-contain', className)}
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent, black 1rem, black calc(100% - 1rem), transparent)',
        ...style,
      }}
      {...props}
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center size-full px-5 py-8 gap-6 text-center">
          {/* Icon */}
          <div className="relative flex items-center justify-center size-14 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-fd-primary/20 to-fd-primary/5" />
            <div className="absolute inset-0 bg-fd-primary/10 blur-xl" />
            <Sparkles size={22} className="relative text-fd-primary" />
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <p className="text-base font-semibold tracking-tight text-fd-foreground">
              How can I help?
            </p>
            <p className="text-xs text-fd-muted-foreground leading-relaxed max-w-52">
              Ask anything about the Oliqor Gateway API — I'll search the docs for you.
            </p>
          </div>

          {/* Suggestion chips */}
          <div className="flex flex-col gap-2 w-full max-w-72">
            {suggestions.map(({ text, icon }) => (
              <button
                key={text}
                onClick={(e) => {
                  e.stopPropagation();
                  void chat.sendMessage({
                    role: 'user',
                    parts: [
                      { type: 'data-client', data: { location: location.href } },
                      { type: 'text', text },
                    ],
                  });
                }}
                className={cn(
                  'group flex items-center gap-3 rounded-xl border border-fd-border/70 bg-fd-card/50 px-3.5 py-2.5',
                  'hover:border-fd-primary/35 hover:bg-fd-primary/5 hover:shadow-sm',
                  'text-left transition-all text-xs text-fd-muted-foreground hover:text-fd-foreground',
                )}
              >
                <span className="text-base leading-none">{icon}</span>
                <span className="flex-1">{text}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 px-4 py-4">
          {chat.error && (
            <div className="rounded-xl border border-red-200/70 bg-red-50/80 dark:border-red-900/40 dark:bg-red-950/30 px-3.5 py-3">
              <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-0.5">
                {chat.error.name}
              </p>
              <p className="text-xs text-red-600/80 dark:text-red-500/80">{chat.error.message}</p>
            </div>
          )}
          {messages.map((item) => (
            <Message key={item.id} message={item} />
          ))}
        </div>
      )}
    </List>
  );
}

// ─── Root panel ──────────────────────────────────────────────────────────────

export function AISearchPanel() {
  const { open, setOpen } = useAISearchContext();
  useHotKey();

  return (
    <>
      <style>
        {`
          @keyframes ask-ai-open {
            from { translate: 100% 0; opacity: 0.6; }
            to   { translate: 0 0; opacity: 1; }
          }
          @keyframes ask-ai-close {
            from { width: var(--ai-chat-width); opacity: 1; }
            to   { width: 0px; opacity: 0; }
          }
        `}
      </style>

      {/* Mobile backdrop */}
      <Presence present={open}>
        <div
          data-state={open ? 'open' : 'closed'}
          className="fixed inset-0 z-30 backdrop-blur-sm bg-fd-overlay/80 data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out lg:hidden"
          onClick={() => setOpen(false)}
        />
      </Presence>

      {/* Panel */}
      <Presence present={open}>
        <div
          className={cn(
            'overflow-hidden z-30 [--ai-chat-width:380px] 2xl:[--ai-chat-width:420px]',
            // Mobile: centered modal with rounded corners
            'max-lg:fixed max-lg:inset-x-3 max-lg:bottom-4 max-lg:top-[env(safe-area-inset-top,1rem)] max-lg:rounded-2xl max-lg:shadow-2xl max-lg:shadow-fd-primary/10',
            // Desktop: sticky sidebar panel
            'lg:sticky lg:top-0 lg:h-dvh lg:border-s lg:ms-auto lg:in-[#nd-docs-layout]:[grid-area:toc] lg:in-[#nd-notebook-layout]:row-span-full lg:in-[#nd-notebook-layout]:col-start-5',
            'bg-fd-background/95 backdrop-blur-xl text-fd-foreground border border-fd-border/80',
            open
              ? 'animate-fd-dialog-in lg:animate-[ask-ai-open_220ms_cubic-bezier(0.16,1,0.3,1)]'
              : 'animate-fd-dialog-out lg:animate-[ask-ai-close_180ms_ease]',
          )}
        >
          <div className="flex flex-col size-full lg:w-(--ai-chat-width)">
            <AISearchPanelHeader />

            <AISearchPanelList className="flex-1 py-2" />

            {/* Bottom input area */}
            <div className="border-t border-fd-border/70 shrink-0 pt-2 bg-linear-to-t from-fd-background to-transparent">
              <div className="flex items-center gap-0.5 px-4 mb-1.5 min-h-0 empty:hidden">
                <AISearchInputActions />
              </div>
              <AISearchInput />
            </div>
          </div>
        </div>
      </Presence>
    </>
  );
}

// ─── Trigger button ───────────────────────────────────────────────────────────

export function AISearchTrigger({
  position = 'default',
  className,
  ...props
}: ComponentProps<'button'> & { position?: 'default' | 'float' }) {
  const { open, setOpen } = useAISearchContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const button = (
    <button
      data-state={open ? 'open' : 'closed'}
      className={cn(
        position === 'float' && [
          'fixed bottom-4 right-4 gap-2 shadow-lg shadow-fd-primary/20 z-9999 transition-[translate,opacity]',
          open && 'translate-y-10 opacity-0',
        ],
        className,
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {props.children}
    </button>
  );

  if (position === 'float') {
    return mounted ? createPortal(button, document.body) : null;
  }

  return button;
}

// ─── Provider / hooks ─────────────────────────────────────────────────────────

export function AISearch({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const chat = useChat<ChatUIMessage>({
    id: 'search',
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  return (
    <Context value={useMemo(() => ({ chat, open, setOpen }), [chat, open])}>
      {children}
    </Context>
  );
}

export function useHotKey() {
  const { open, setOpen } = useAISearchContext();

  const onKeyPress = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      setOpen(false);
      e.preventDefault();
    }
    if (e.key === '/' && (e.metaKey || e.ctrlKey) && !open) {
      setOpen(true);
      e.preventDefault();
    }
  });

  useEffect(() => {
    window.addEventListener('keydown', onKeyPress);
    return () => window.removeEventListener('keydown', onKeyPress);
  }, []);
}

export function useAISearchContext() {
  return use(Context)!;
}

function useChatContext() {
  return use(Context)!.chat;
}
