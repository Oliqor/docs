import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { AISearch, AISearchPanel, AISearchTrigger } from '@/components/ai/search';
import { MessageCircleIcon, BookOpen } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { gitConfig } from '@/lib/shared';

function SidebarBanner() {
  return (
    <div className="mx-2 mb-1 flex items-center gap-2 rounded-lg border border-fd-primary/20 bg-fd-primary/8 px-3 py-2">
      <BookOpen size={13} className="text-fd-primary shrink-0" />
      <span className="text-xs font-medium text-fd-primary">Gateway API</span>
      <span className="ml-auto rounded-full bg-fd-primary/15 px-2 py-0.5 text-[10px] font-semibold text-fd-primary">
        v1 Beta
      </span>
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className="border-t border-fd-border px-3 py-3">
      <a
        href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground transition-colors"
      >
        <svg viewBox="0 0 24 24" className="size-3.5 shrink-0 fill-current" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
        View on GitHub
      </a>
    </div>
  );
}

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      sidebar={{
        banner: <SidebarBanner />,
        footer: <SidebarFooter />,
        collapsible: true,
      }}
    >
      <AISearch>
        <AISearchPanel />
        <AISearchTrigger
          position="float"
          className={cn(
            buttonVariants({
              variant: 'secondary',
              className: 'text-fd-muted-foreground rounded-2xl gap-1.5 shadow-md',
            }),
          )}
        >
          <MessageCircleIcon className="size-4" />
          Ask AI
        </AISearchTrigger>
      </AISearch>
      {children}
    </DocsLayout>
  );
}
