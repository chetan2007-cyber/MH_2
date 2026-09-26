import React from 'react';

interface AppShellProps {
  topbar: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  sidebarCollapsed?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  topbar,
  sidebar,
  children,
  sidebarCollapsed = false,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
      {/* Top Navigation */}
      {topbar}

      {/* Main Body with Sidebar + Content */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {sidebar}
        <main
          style={{
            flex: 1,
            padding: '1.75rem 2rem',
            maxWidth: '1440px',
            margin: '0 auto',
            width: '100%',
            overflowX: 'hidden',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
