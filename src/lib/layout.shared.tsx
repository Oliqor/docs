import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';
import { Layers } from 'lucide-react';

function NavTitle() {
  return (
    <span className="flex items-center gap-2 font-semibold">
      <span className="inline-flex size-6 items-center justify-center rounded-md bg-fd-primary text-fd-primary-foreground">
        <Layers size={13} />
      </span>
      {appName}
    </span>
  );
}

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <NavTitle />,
      links: [
        {
          text: 'Documentation',
          url: '/docs',
          active: 'nested',
        },
      ],
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  } as any;
}
