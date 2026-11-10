# Graph Report - sap2prod  (2026-11-10)

## Corpus Check
- 123 files · ~64,766 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 717 nodes · 1487 edges · 53 communities (32 shown, 21 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d967fe80`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- sidebar.tsx
- helpers.ts
- cn
- dependencies
- hooks/use-toast.ts
- devDependencies
- pagination.tsx
- utils.ts
- package.json
- navigation-menu.tsx
- compilerOptions
- command.tsx
- components.json
- form.tsx
- types.ts
- compilerOptions
- carousel.tsx
- compilerOptions
- chart.tsx
- compilerOptions
- context-menu.tsx
- dropdown-menu.tsx
- scripts
- vite.config.ts
- sheet.tsx
- drawer.tsx
- select.tsx
- Faq.tsx
- tailwindcss
- @radix-ui/react-popover
- @radix-ui/react-aspect-ratio
- @radix-ui/react-collapsible
- @radix-ui/react-progress
- @radix-ui/react-context-menu
- @radix-ui/react-navigation-menu
- @radix-ui/react-radio-group
- @radix-ui/react-scroll-area
- @radix-ui/react-toast
- @radix-ui/react-hover-card
- @radix-ui/react-tooltip
- react-hook-form
- react-resizable-panels
- @supabase/supabase-js
- @radix-ui/react-slot
- zod@^3.25.76
- card.tsx
- react-day-picker
- sonner.tsx
- tailwind-merge

## God Nodes (most connected - your core abstractions)
1. `cn()` - 226 edges
2. `react` - 64 edges
3. `useLang()` - 35 edges
4. `lucide-react` - 30 edges
5. `compilerOptions` - 19 edges
6. `Index()` - 16 edges
7. `framer-motion` - 14 edges
8. `compilerOptions` - 14 edges
9. `@playwright/test` - 13 edges
10. `class-variance-authority` - 12 edges

## Surprising Connections (you probably didn't know these)
- `CommandShortcut()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts
- `DialogFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/lib/utils.ts
- `DialogHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/lib/utils.ts
- `ContextMenuShortcut()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/context-menu.tsx → src/lib/utils.ts
- `DropdownMenuShortcut()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (53 total, 21 thin omitted)

### Community 0 - "react"
Cohesion: 0.06
Nodes (62): framer-motion, lucide-react, react, react-router-dom, App(), queryClient, ScrollToTop(), pages (+54 more)

### Community 1 - "sidebar.tsx"
Cohesion: 0.07
Nodes (33): @radix-ui/react-separator@^1.1.7, @radix-ui/react-separator, Input, Separator, Sidebar, SidebarContent, SidebarContext, SidebarFooter (+25 more)

### Community 2 - "helpers.ts"
Cohesion: 0.07
Nodes (34): @playwright/test, files, results, evidence, BrowserName, names, profiles, projects (+26 more)

### Community 3 - "cn"
Cohesion: 0.08
Nodes (37): Avatar, AvatarFallback, AvatarImage, Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList (+29 more)

### Community 4 - "dependencies"
Cohesion: 0.06
Nodes (33): dependencies, clsx@^2.1.1, cmdk@^1.1.1, framer-motion@^12.23.25, input-otp@^1.4.2, lucide-react@^0.462.0, @radix-ui/react-accordion@^1.2.11, @radix-ui/react-alert-dialog@^1.1.14 (+25 more)

### Community 5 - "hooks/use-toast.ts"
Cohesion: 0.13
Nodes (25): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+17 more)

### Community 6 - "devDependencies"
Cohesion: 0.08
Nodes (28): devDependencies, autoprefixer@^10.4.21, eslint@^9.32.0, @eslint/js@^9.32.0, eslint-plugin-react-hooks@^5.2.0, eslint-plugin-react-refresh@^0.4.20, globals@^15.15.0, @playwright/test@^1.64.1 (+20 more)

### Community 7 - "pagination.tsx"
Cohesion: 0.12
Nodes (20): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle (+12 more)

### Community 8 - "utils.ts"
Cohesion: 0.09
Nodes (14): Checkbox, HoverCardContent, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, PopoverContent, Progress (+6 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): date-fns@^3.6.0, embla-carousel-react@^8.6.0, @hookform/resolvers@^3.10.0, @radix-ui/react-menubar@^1.1.15, @radix-ui/react-slider@^1.3.5, @radix-ui/react-tabs@^1.1.12, @radix-ui/react-toggle@^1.1.9, recharts@^2.15.4 (+14 more)

### Community 10 - "navigation-menu.tsx"
Cohesion: 0.10
Nodes (21): class-variance-authority@^0.7.1, class-variance-authority, Alert, AlertDescription, AlertTitle, alertVariants, Badge(), BadgeProps (+13 more)

### Community 11 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 12 - "command.tsx"
Cohesion: 0.13
Nodes (16): Command, CommandDialog(), CommandDialogProps, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList (+8 more)

### Community 13 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, registries, @efferd (+10 more)

### Community 14 - "form.tsx"
Cohesion: 0.18
Nodes (14): @radix-ui/react-label@^2.1.7, @radix-ui/react-label, FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext (+6 more)

### Community 15 - "types.ts"
Cohesion: 0.14
Nodes (14): createSupabaseFetch(), isNewSupabaseApiKey(), supabase, brokeredPreviewStorage(), CompositeTypes, Constants, Database, DatabaseWithoutInternals (+6 more)

### Community 16 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+7 more)

### Community 17 - "carousel.tsx"
Cohesion: 0.19
Nodes (14): Button, Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext (+6 more)

### Community 18 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, esModuleInterop, lib, module, moduleResolution, noEmit, skipLibCheck, strict (+4 more)

### Community 19 - "chart.tsx"
Cohesion: 0.27
Nodes (10): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartStyle(), ChartTooltipContent, getPayloadConfigFromPayload() (+2 more)

### Community 20 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, noImplicitAny, noUnusedLocals, noUnusedParameters, paths, skipLibCheck, strictNullChecks (+2 more)

### Community 21 - "context-menu.tsx"
Cohesion: 0.20
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 22 - "dropdown-menu.tsx"
Cohesion: 0.20
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 23 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, build:dev, dev, lint, preview, test:audit, test:audit:report (+1 more)

### Community 24 - "vite.config.ts"
Cohesion: 0.25
Nodes (6): lovable-tagger@^1.1.11, vite@^5.4.19, @vitejs/plugin-react-swc@^3.11.0, lovable-tagger, vite, @vitejs/plugin-react-swc

### Community 25 - "sheet.tsx"
Cohesion: 0.28
Nodes (8): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 26 - "drawer.tsx"
Cohesion: 0.29
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 27 - "select.tsx"
Cohesion: 0.32
Nodes (7): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 28 - "Faq.tsx"
Cohesion: 0.57
Nodes (4): Faq(), AccordionContent, AccordionItem, AccordionTrigger

### Community 29 - "tailwindcss"
Cohesion: 0.40
Nodes (4): tailwindcss-animate@^1.0.7, tailwindcss@^3.4.17, tailwindcss, tailwindcss-animate

### Community 48 - "card.tsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 51 - "sonner.tsx"
Cohesion: 0.29
Nodes (6): next-themes@^0.3.0, sonner@^1.7.4, next-themes, sonner, Toaster(), ToasterProps

## Knowledge Gaps
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `sidebar.tsx`, `cn`, `dependencies`, `hooks/use-toast.ts`, `pagination.tsx`, `utils.ts`, `package.json`, `navigation-menu.tsx`, `command.tsx`, `form.tsx`, `carousel.tsx`, `chart.tsx`, `context-menu.tsx`, `dropdown-menu.tsx`, `sheet.tsx`, `drawer.tsx`, `select.tsx`, `Faq.tsx`, `@radix-ui/react-tooltip`, `card.tsx`?**
  _High betweenness centrality (0.234) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.05797979797979798 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `sidebar.tsx`, `hooks/use-toast.ts`, `pagination.tsx`, `utils.ts`, `navigation-menu.tsx`, `@radix-ui/react-tooltip`, `command.tsx`, `form.tsx`, `card.tsx`, `carousel.tsx`, `chart.tsx`, `context-menu.tsx`, `dropdown-menu.tsx`, `sheet.tsx`, `drawer.tsx`, `select.tsx`, `Faq.tsx`?**
  _High betweenness centrality (0.209) - this node is a cross-community bridge._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06585365853658537 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `helpers.ts` to `package.json`, `devDependencies`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Should `helpers.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07088989441930618 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.0824524312896406 - nodes in this community are weakly interconnected._