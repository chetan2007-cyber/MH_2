import React from 'react';
import {
  Cpu,
  Layers,
  Award,
  Terminal,
  Search,
  Briefcase,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileCode,
  LayoutDashboard,
  Users,
  Compass,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  user: any;
  currentView: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate: (view: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  currentView,
  collapsed,
  onToggleCollapse,
  onNavigate,
  mobileOpen,
  onCloseMobile,
}) => {
  // Construct Navigation Groups depending on user role
  let groups: NavGroup[] = [];

  if (!user) {
    groups = [
      {
        groupTitle: 'EXPLORE',
        items: [
          { id: 'landing', label: 'Overview & Manifesto', icon: <Compass size={17} /> },
          { id: 'challenges', label: 'Challenge Catalog', icon: <Cpu size={17} /> },
          { id: 'recruiter', label: 'Verified Talent Feed', icon: <Search size={17} /> },
        ],
      },
    ];
  } else if (user.role === 'CANDIDATE') {
    groups = [
      {
        groupTitle: 'WORK',
        items: [
          { id: 'overview', label: 'Engineering Overview', icon: <LayoutDashboard size={17} /> },
          { id: 'challenges', label: 'Challenge Catalog', icon: <Cpu size={17} />, badge: 15 },
          { id: 'workspace', label: 'Workspace Studio', icon: <Terminal size={17} /> },
          { id: 'projects', label: 'Projects & Evidence', icon: <FileCode size={17} /> },
        ],
      },
      {
        groupTitle: 'PROOF',
        items: [
          { id: 'proofgraph', label: 'ProofGraph™', icon: <Layers size={17} />, badge: 'LIVE' },
          { id: 'passport', label: 'Proof Passport™', icon: <Award size={17} /> },
          { id: 'reviews', label: 'Peer Reviews', icon: <CheckCircle size={17} /> },
        ],
      },
      {
        groupTitle: 'OPPORTUNITIES',
        items: [
          { id: 'opportunities', label: 'Inbound Opportunities', icon: <Briefcase size={17} />, badge: '1 NEW' },
        ],
      },
      {
        groupTitle: 'SYSTEM',
        items: [
          { id: 'trust', label: 'Trust Center', icon: <ShieldCheck size={17} /> },
          { id: 'settings', label: 'Settings & Security', icon: <Settings size={17} /> },
        ],
      },
    ];
  } else if (user.role === 'REVIEWER') {
    groups = [
      {
        groupTitle: 'REVIEW DESK',
        items: [
          { id: 'reviewer', label: 'Review Queue', icon: <Terminal size={17} />, badge: 3 },
          { id: 'challenges', label: 'Challenge Rubrics', icon: <Cpu size={17} /> },
          { id: 'trust', label: 'Calibration & RRI', icon: <ShieldCheck size={17} /> },
        ],
      },
      {
        groupTitle: 'SYSTEM',
        items: [
          { id: 'settings', label: 'Settings', icon: <Settings size={17} /> },
        ],
      },
    ];
  } else if (user.role === 'RECRUITER') {
    groups = [
      {
        groupTitle: 'TALENT SOURCING',
        items: [
          { id: 'recruiter', label: 'Discover & Vector Search', icon: <Search size={17} /> },
          { id: 'proofgraph', label: 'ProofGraph Explorer', icon: <Layers size={17} /> },
          { id: 'opportunities', label: 'Sent Opportunities', icon: <Briefcase size={17} /> },
        ],
      },
      {
        groupTitle: 'SYSTEM',
        items: [
          { id: 'trust', label: 'Integrity & Verification', icon: <ShieldCheck size={17} /> },
          { id: 'settings', label: 'Organization Settings', icon: <Settings size={17} /> },
        ],
      },
    ];
  } else if (user.role === 'ADMIN') {
    groups = [
      {
        groupTitle: 'GOVERNANCE',
        items: [
          { id: 'admin', label: 'System Overview & Users', icon: <LayoutDashboard size={17} /> },
          { id: 'challenges', label: 'Challenge Catalog', icon: <Cpu size={17} /> },
          { id: 'reviewer', label: 'Review Moderation', icon: <Terminal size={17} /> },
        ],
      },
      {
        groupTitle: 'COMPLIANCE',
        items: [
          { id: 'trust', label: 'Trust Center Signals', icon: <ShieldCheck size={17} /> },
          { id: 'settings', label: 'Platform Settings', icon: <Settings size={17} /> },
        ],
      },
    ];
  }

  const handleSelect = (viewId: string) => {
    onNavigate(viewId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.75)',
            zIndex: 140,
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: collapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)',
          background: 'var(--bg-subtle)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 150,
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: mobileOpen ? 'translateX(0)' : undefined,
          overflow: 'hidden',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: 'var(--topbar-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: collapsed ? '0' : '0 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div
            onClick={() => handleSelect(user ? (user.role === 'CANDIDATE' ? 'overview' : user.role.toLowerCase()) : 'landing')}
            style={{ cursor: 'pointer' }}
          >
            <BrandLogo size={26} showWordmark={!collapsed} tagline={false} />
          </div>

          {!collapsed && (
            <button
              className="btn btn-ghost btn-icon-sm"
              onClick={onToggleCollapse}
              title="Collapse Sidebar"
              style={{ color: 'var(--text-muted)' }}
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: collapsed ? '0.75rem 0.35rem' : '0.75rem 0.625rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {groups.map((group, gIdx) => (
            <div key={gIdx}>
              {!collapsed && (
                <div
                  style={{
                    padding: '0.25rem 0.625rem 0.4rem',
                    fontSize: '0.6875rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {group.groupTitle}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                {group.items.map((item) => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      title={collapsed ? item.label : undefined}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'space-between',
                        padding: collapsed ? '0.625rem 0' : '0.5rem 0.625rem',
                        borderRadius: 'var(--radius-md)',
                        background: isActive ? 'var(--bg-surface-active)' : 'transparent',
                        border: '1px solid',
                        borderColor: isActive ? 'var(--border-medium)' : 'transparent',
                        color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.12s ease',
                        width: '100%',
                        textAlign: 'left',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'var(--bg-surface-hover)';
                          e.currentTarget.style.color = 'var(--text-main)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <span style={{ color: isActive ? 'var(--accent-primary)' : 'inherit', display: 'flex' }}>
                          {item.icon}
                        </span>
                        {!collapsed && (
                          <span
                            style={{
                              fontSize: '0.8125rem',
                              fontWeight: isActive ? 600 : 500,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.label}
                          </span>
                        )}
                      </div>

                      {!collapsed && item.badge && (
                        <span
                          className={`badge ${
                            item.badge === 'LIVE'
                              ? 'badge-cyan'
                              : item.badge === '1 NEW'
                              ? 'badge-amber'
                              : 'badge-neutral'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Collapsed Toggle Button at Bottom when collapsed */}
        {collapsed && (
          <div
            style={{
              padding: '0.75rem 0',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <button
              className="btn btn-ghost btn-icon-sm"
              onClick={onToggleCollapse}
              title="Expand Sidebar"
              style={{ color: 'var(--text-muted)' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Footer Role / Provenance info */}
        {!collapsed && user && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-app)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Signed in as
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.1rem' }}>
                {user.role}
              </div>
            </div>
            <span className="badge badge-emerald">Active</span>
          </div>
        )}
      </aside>
    </>
  );
};
