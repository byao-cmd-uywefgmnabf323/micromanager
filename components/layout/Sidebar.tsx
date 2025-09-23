"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { Home, ListTodo, BarChart3, Calendar, Settings, ChevronLeft, ChevronRight, ChevronDown, Star, Folder, FileText, Users, Rocket, Medal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/habits", label: "Habits", icon: ListTodo },
  { href: "/badges", label: "Badges", icon: Medal },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/planner", label: "Planner", icon: Calendar },
  { href: "/settings", label: "Settings", icon: Settings },
];

const SAMPLE_SPACES = [
  {
    id: "space-1",
    name: "Personal",
    favorites: ["Morning Routine"],
    projects: [
      { id: "proj-1", name: "Health", notes: ["Nutrition", "Workouts"] },
      { id: "proj-2", name: "Learning", notes: ["Books", "Courses"] },
    ],
  },
  {
    id: "space-2",
    name: "Work",
    favorites: ["Weekly Plan"],
    projects: [
      { id: "proj-3", name: "Side Project", notes: ["Ideas", "Milestones"] },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openSpaces, setOpenSpaces] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mm_sidebar_collapsed");
      if (raw) setCollapsed(raw === "1");
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("mm_sidebar_collapsed", collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);

  function toggleSpace(id: string) {
    setOpenSpaces((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <TooltipProvider>
      <aside className={cn(
        "sticky top-0 h-dvh shrink-0 border-r bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70",
        collapsed ? "w-[72px]" : "w-64"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 px-3 py-3 border-b">
            <div className="h-8 w-8 rounded-md bg-gradient-to-tr from-purple-500 to-blue-500" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="font-semibold leading-tight truncate">Workspace Alpha</div>
                <button className="text-xs text-muted-foreground hover:underline">Switch workspace</button>
              </div>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Toggle sidebar" onClick={() => setCollapsed((v) => !v)}>
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Main nav */}
          <nav className="px-2 py-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              const content = (
                <div className={cn(
                  "flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted",
                  active && "bg-muted text-foreground"
                )}>
                  <Icon className="h-5 w-5" />
                  {!collapsed && <span className="truncate text-sm">{item.label}</span>}
                </div>
              );
              return collapsed ? (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>{content}</Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              ) : (
                <Link key={item.href} href={item.href}>{content}</Link>
              );
            })}
          </nav>


          {/* Spaces tree */}
          <div className="px-3 py-2 overflow-auto">
            {!collapsed && <div className="text-xs uppercase text-muted-foreground mb-1">Spaces</div>}
            <div className="space-y-1">
              {SAMPLE_SPACES.map((space) => {
                const open = openSpaces[space.id] ?? true;
                return (
                  <div key={space.id} className="rounded-lg">
                    <button className={cn("w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted", collapsed && "justify-center")}
                      onClick={() => toggleSpace(space.id)}>
                      <ChevronDown className={cn("h-4 w-4 transition", !open && "-rotate-90", collapsed && "hidden")} />
                      <Folder className="h-4 w-4" />
                      {!collapsed && <span className="text-sm font-medium truncate">{space.name}</span>}
                    </button>
                    {open && (
                      <div className={cn("mt-1 pl-6 space-y-1", collapsed && "hidden") }>
                        {space.projects.map((p) => (
                          <div key={p.id} className="">
                            <Link href={`/habits?q=${encodeURIComponent(p.name)}`} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted">
                              <Folder className="h-4 w-4" />
                              <span className="text-sm truncate">{p.name}</span>
                            </Link>
                            <div className="pl-6 space-y-1">
                              {p.notes.map((n) => (
                                <Link key={n} href={`/habits?q=${encodeURIComponent(n)}`} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted">
                                  <FileText className="h-4 w-4" />
                                  <span className="text-sm truncate">{n}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </aside>
    </TooltipProvider>
  );
}
