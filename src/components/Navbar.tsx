import {
  Apple,
  Dumbbell,
  Flame,
  LayoutDashboard,
  Menu,
  Settings,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';

export type TabId = 'dashboard' | 'meal' | 'exercise' | 'drink' | 'settings';

interface NavbarProps {
  avatarInitials: string;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: '儀表板', icon: LayoutDashboard },
  { id: 'meal', label: '飲食', icon: Apple },
  { id: 'exercise', label: '運動', icon: Dumbbell },
  { id: 'drink', label: '手搖飲', icon: Flame },
  { id: 'settings', label: '設定', icon: Settings },
];

export default function Navbar({ avatarInitials, activeTab, onTabChange }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTabClick = (tab: TabId) => {
    onTabChange(tab);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200/60">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-primary/30">
              <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
                FitFuel
              </span>
              <span className="hidden text-[11px] font-medium text-slate-500 sm:block">
                熱量平衡管理
              </span>
            </div>
          </div>

          {/* Desktop tabs */}
          <div className="hidden items-center gap-1 md:flex">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-700 text-sm font-bold text-white shadow-md ring-2 ring-white">
              {avatarInitials}
            </div>
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="切換選單"
            >
              {mobileOpen ? <X className="h-6 w-6 text-slate-700" /> : <Menu className="h-6 w-6 text-slate-700" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="animate-slide-up border-t border-slate-200/60 py-3 md:hidden">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
}
