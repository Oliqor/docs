import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

function NavTitle() {
  return (
    <span className="flex items-center gap-2 font-semibold">
      <span className="inline-flex items-center justify-center rounded-md">
        <img src="https://oliqor.lol/logo.png" alt="Logo" width={30} height={30} />
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
