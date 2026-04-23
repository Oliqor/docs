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

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      sidebar={{
        banner: <SidebarBanner />,
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
