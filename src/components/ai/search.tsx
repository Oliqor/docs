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
import { Bot, Loader2, RefreshCw, SearchIcon, Send, Sparkles, Square, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { buttonVariants } from '../ui/button';
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
        'flex items-center gap-3 px-4 py-3 border-b border-fd-border shrink-0',
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-center size-7 rounded-lg bg-fd-primary/15 text-fd-primary shrink-0">
        <Sparkles size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-none">Oliqor AI</p>
        <p className="text-[11px] text-fd-muted-foreground mt-1 leading-none">
          Answers may be inaccurate — verify before use
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-fd-border bg-fd-muted px-1.5 py-0.5 text-[10px] text-fd-muted-foreground font-mono">
          ⌘/
        </kbd>
        <button
          aria-label="Close"
          className={cn(
            buttonVariants({
              size: 'icon-sm',
              color: 'ghost',
              className: 'text-fd-muted-foreground rounded-md hover:text-fd-foreground',
            }),
          )}
          onClick={() => setOpen(false)}
        >
          <X size={15} />
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
          className={cn(
            buttonVariants({
              color: 'ghost',
              size: 'sm',
              className: 'rounded-full gap-1.5 text-fd-muted-foreground text-xs h-7',
            }),
          )}
          onClick={() => regenerate()}
        >
          <RefreshCw size={12} />
          Retry
        </button>
      )}
      <button
        type="button"
        className={cn(
          buttonVariants({
            color: 'ghost',
            size: 'sm',
            className: 'rounded-full text-fd-muted-foreground text-xs h-7',
          }),
        )}
        onClick={() => setMessages([])}
      >
        Clear chat
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
      className={cn('flex items-end gap-2 p-3', props.className)}
      onSubmit={onStart}
    >
      <GrowingTextarea
        value={input}
        placeholder={isLoading ? 'Answering…' : 'Ask anything…'}
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
          className="shrink-0 flex items-center justify-center size-8 rounded-full bg-fd-primary/10 text-fd-primary hover:bg-fd-primary/20 transition-colors"
          onClick={stop}
        >
          <Square size={13} className="fill-current" />
        </button>
      ) : (
        <button
          key="send"
          type="submit"
          aria-label="Send"
          disabled={input.trim().length === 0}
          className="shrink-0 flex items-center justify-center size-8 rounded-full bg-fd-primary text-fd-primary-foreground hover:opacity-90 disabled:opacity-30 transition-all"
        >
          <Send size={13} />
        </button>
      )}
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
          'resize-none bg-transparent placeholder:text-fd-muted-foreground focus-visible:outline-none max-h-36 overflow-y-auto',
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
      className={cn('flex gap-2.5', isUser && 'flex-row-reverse')}
      {...props}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="shrink-0 mt-0.5 flex items-center justify-center size-6 rounded-full bg-fd-primary/15 text-fd-primary">
          <Bot size={13} />
        </div>
      )}

      <div className={cn('flex flex-col gap-1.5 min-w-0', isUser ? 'items-end' : 'items-start flex-1')}>
        {/* Bubble */}
        <div
          className={cn(
            'rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
            isUser
              ? 'bg-fd-primary text-fd-primary-foreground rounded-tr-sm max-w-[85%]'
              : 'bg-fd-muted text-fd-foreground rounded-tl-sm w-full',
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{markdown}</p>
          ) : (
            <div className="prose prose-sm max-w-none [&_p:last-child]:mb-0">
              <Markdown text={markdown} />
            </div>
          )}
        </div>

        {/* Search tool indicators */}
        {searchCalls.map((call) => (
          <div
            key={call.toolCallId}
            className="flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-background px-2.5 py-1 text-[11px] text-fd-muted-foreground"
          >
            <SearchIcon size={11} />
            {call.output ? `${call.output.length} results found` : 'Searching…'}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Message list with empty state ───────────────────────────────────────────

const suggestions = [
  'How do I authenticate with the API?',
  'What events does the Gateway emit?',
  'How do bots send messages?',
];

export function AISearchPanelList({ className, style, ...props }: ComponentProps<'div'>) {
  const chat = useChatContext();
  const messages = chat.messages.filter((msg) => msg.role !== 'system');

  return (
    <List
      className={cn('overscroll-contain', className)}
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent, black 1.5rem, black calc(100% - 1.5rem), transparent)',
        ...style,
      }}
      {...props}
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center size-full px-4 py-8 gap-5 text-center">
          <div className="flex items-center justify-center size-10 rounded-xl bg-fd-primary/12 text-fd-primary">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-fd-foreground mb-1">Ask Oliqor AI</p>
            <p className="text-xs text-fd-muted-foreground">
              Get instant answers about the Gateway API.
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full max-w-65">
            {suggestions.map((q) => (
              <button
                key={q}
                onClick={(e) => {
                  e.stopPropagation();
                  void chat.sendMessage({
                    role: 'user',
                    parts: [
                      { type: 'data-client', data: { location: location.href } },
                      { type: 'text', text: q },
                    ],
                  });
                }}
                className="rounded-xl border border-fd-border bg-fd-card hover:border-fd-primary/40 hover:bg-fd-primary/5 px-3 py-2 text-xs text-fd-muted-foreground hover:text-fd-foreground text-left transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 px-3 py-4">
          {chat.error && (
            <div className="rounded-xl border border-fd-error/30 bg-fd-error/8 px-3 py-2.5">
              <p className="text-xs font-medium text-fd-error mb-0.5">{chat.error.name}</p>
              <p className="text-xs text-fd-muted-foreground">{chat.error.message}</p>
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
            from { translate: 100% 0; }
            to   { translate: 0 0; }
          }
          @keyframes ask-ai-close {
            from { width: var(--ai-chat-width); }
            to   { width: 0px; }
          }
        `}
      </style>

      {/* Mobile backdrop */}
      <Presence present={open}>
        <div
          data-state={open ? 'open' : 'closed'}
          className="fixed inset-0 z-30 backdrop-blur-xs bg-fd-overlay data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out lg:hidden"
          onClick={() => setOpen(false)}
        />
      </Presence>

      {/* Panel */}
      <Presence present={open}>
        <div
          className={cn(
            'overflow-hidden z-30 [--ai-chat-width:380px] 2xl:[--ai-chat-width:440px]',
            'max-lg:fixed max-lg:inset-x-3 max-lg:inset-y-4 max-lg:rounded-2xl max-lg:shadow-2xl',
            'lg:sticky lg:top-0 lg:h-dvh lg:border-s lg:ms-auto lg:in-[#nd-docs-layout]:[grid-area:toc] lg:in-[#nd-notebook-layout]:row-span-full lg:in-[#nd-notebook-layout]:col-start-5',
            'bg-fd-background text-fd-foreground border border-fd-border',
            open
              ? 'animate-fd-dialog-in lg:animate-[ask-ai-open_200ms_ease]'
              : 'animate-fd-dialog-out lg:animate-[ask-ai-close_200ms_ease]',
          )}
        >
          <div className="flex flex-col size-full lg:w-(--ai-chat-width)">
            <AISearchPanelHeader />

            <AISearchPanelList className="flex-1 py-2" />

            {/* Bottom input area */}
            <div className="border-t border-fd-border shrink-0">
              <div className="flex items-center gap-1 px-3 pt-2 empty:hidden min-h-0">
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

  return (
    <button
      data-state={open ? 'open' : 'closed'}
      className={cn(
        position === 'float' && [
          'fixed bottom-4 gap-2 inset-e-[calc(--spacing(4)+var(--removed-body-scroll-bar-size,0))] shadow-lg z-20 transition-[translate,opacity]',
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
