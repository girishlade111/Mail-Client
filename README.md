# ✉️ Flowmail — Email That Flows

> A modern, production-grade webmail frontend application built with React. Inspired by Gmail, Outlook, Superhuman, Linear, and Notion Mail.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&style=flat-square)
![CSS](https://img.shields.io/badge/CSS-Custom_Properties-1572B6?logo=css3&style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Build Size](https://img.shields.io/badge/Size-549KB-blue?style=flat-square)
![Files](https://img.shields.io/badge/Files-97-blue?style=flat-square)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Design System](#design-system)
- [Component Reference](#component-reference)
- [Mock Data](#mock-data)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Responsive Design](#responsive-design)
- [Browser Support](#browser-support)
- [Future Integration Points](#future-integration-points)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Quick Start

### Running the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

### How to View Emails

By default, the app opens to the **Inbox** folder. To see all emails:

1. **Inbox** - Default view for new emails (18+ emails)
2. Click **Sent** in sidebar to view sent emails
3. Click **Starred** to view starred emails
4. Click **Archive** to view archived emails
5. Click **Drafts** to view draft emails (3 emails)

> **Tip**: Use keyboard shortcut `g` then `i` to go to Inbox, `g` then `s` for Sent, `g` then `d` for drafts.

### First Steps

1. ✅ View Inbox emails (default)
2. ✅ Click an email to read it
3. ✅ Click "Compose" (or press `c`) to write a new email
4. ✅ Try dark mode (toggle in settings)
5. ✅ Explore sidebar folders

---

## Overview

Flowmail is a **frontend-only** webmail application that demonstrates production-quality UI/UX for email. It's designed to feel like a real, daily-use email product — not a basic template or tutorial project.

### What It Is
- A complete email client frontend with realistic mock data
- Desktop-first responsive design with full mobile support
- Light and dark theme support
- 60+ polished React components
- Ready for backend/API integration

### What It's NOT
- Not a backend/server application
- No real email sending/receiving
- No authentication system
- No database — all data is static/mock

### Design Philosophy
- **Structured**: Clean hierarchy, consistent spacing, refined borders
- **Professional**: Looks like a real SaaS product you'd pay for
- **Productive**: Every pixel serves a purpose
- **Minimal**: No unnecessary decoration — form follows function

---

## Features

### 📬 Core Email Experience
- **Inbox with categories**: Primary, Social, Updates, Promotions, Forums, Team
- **Mail list**: Rich email rows with avatars, labels, timestamps, hover actions
- **Reading pane**: Full message view with sender info, attachments, actions
- **Thread view**: Expandable conversation threads with quoted replies
- **Compose**: Popup/fullscreen composer with rich text toolbar
- **Draft tray**: Minimized drafts docked at bottom
- **Bulk actions**: Select multiple emails for batch operations
- **Star, archive, delete, snooze**: Full email workflow actions

### 🔍 Search & Filters
- **Smart search bar**: Keyword, sender, subject, attachment, date filters
- **Advanced filters panel**: Comprehensive filter combinations
- **Search results view**: Highlighted matches with filter chips
- **Recent & saved searches**: Quick access to past queries
- **AI summary card**: Placeholder for AI-powered search summaries

### 🏷️ Organization
- **Labels management**: Create, edit, delete with color picker
- **Nested labels**: Sub-labels with parent-child hierarchy
- **Filter rules**: Automated label/archive/delete rules
- **Priority indicators**: High, medium, low priority badges

### ✏️ Compose Experience
- **Popup composer**: Gmail-style floating window
- **Fullscreen mode**: Distraction-free writing
- **Rich text editor**: Bold, italic, lists, links, formatting
- **Recipient autocomplete**: Suggest contacts as you type
- **CC/BCC toggle**: Show/hide carbon copy fields
- **Attachment area**: File upload with preview
- **Schedule send**: Send later with date/time picker
- **Signature selector**: Multiple signatures per account
- **AI assist placeholders**: Rewrite, shorten, tone improvement
- **Draft auto-save**: Drafts saved with minimized tray

### 👥 Multi-Account
- **3 connected accounts**: Personal, work, custom domain
- **Unified inbox**: See all mail from all accounts
- **Account switcher**: Quick dropdown to switch
- **Color-coded identities**: Visual account distinction
- **Per-account signatures**: Different signatures per account
- **Storage usage widget**: Visual storage indicator

### 📅 Productivity Widgets
- **Mini calendar**: Month view with event indicators
- **Tasks list**: Todo items linked to emails
- **Quick notes**: Scratchpad for ideas
- **Reminders**: Time-based reminder items
- **Recent attachments**: Quick access to files
- **Follow-ups**: Emails awaiting reply
- **Upcoming schedule**: Next events summary

### 👤 Contacts
- **Contact list**: Alphabetical with search
- **Favorites & recents**: Quick access sections
- **Contact detail drawer**: Full info panel
- **Tags**: Client, lead, vendor, team labels
- **Shared history**: Email exchange timeline
- **Notes**: Per-contact notes

### ⚙️ Settings (14 tabs)
- **General**: Language, timezone, reply behavior
- **Appearance**: Theme, density, font size, layout
- **Inbox**: Categories, importance, inbox type
- **Accounts**: Connected accounts management
- **Signatures**: Rich text signature editor
- **Filters & rules**: Automated email rules
- **Labels**: Label management
- **Notifications**: Desktop, sound, priority settings
- **Shortcuts**: Keyboard reference
- **Privacy**: Tracking protection, blocked senders
- **Security**: Activity log, security settings
- **Integrations**: Third-party app toggles
- **Storage**: Usage breakdown
- **Accessibility**: Font size, contrast, motion

### ⚡ Power User Features
- **Command palette** (Ctrl+K): Quick actions and navigation
- **Keyboard shortcuts** (?): Full shortcut reference
- **Theme toggle**: Light ↔ Dark mode
- **Sidebar collapse**: Full ↔ icon-only mode
- **Density switcher**: Comfortable, Cozy, Compact
- **Toast notifications**: Undo actions with countdown

### 🎨 UI States
- Loading skeleton screens
- Syncing progress indicator
- Offline mode banner
- Error state with retry
- Spam/phishing warning banners
- Empty inbox celebration
- Empty search results
- Draft saved confirmation
- Scheduled send confirmation

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | Component architecture and state management |
| **Vite 6** | Build tool with HMR and optimized production builds |
| **Vanilla CSS** | Design system with CSS custom properties (no framework) |
| **Lucide React** | 1000+ clean, consistent SVG icons |
| **Inter** | Premium UI typeface via Google Fonts |
| **date-fns** | Date formatting and manipulation |

### Why These Choices

- **React** over vanilla JS: 60+ interactive components with complex state needed a framework
- **Vanilla CSS** over Tailwind: Full design control, CSS custom properties for theming
- **Lucide** over Heroicons/Phosphor: Most comprehensive, tree-shakable, consistent weight
- **No router**: Single-page app with internal view state — simpler and faster
- **No state library**: React Context + useReducer is sufficient for frontend-only data

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone or navigate to the project
cd "Mail Client"

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory — ready for deployment to any static hosting (Vercel, Netlify, Cloudflare Pages, etc.)

---

## Architecture

### Project Structure

```
src/
├── main.jsx                    # Entry point
├── App.jsx                     # Root layout + providers
├── App.css                     # Layout grid styles
├── index.css                   # Global design system
│
├── data/                       # Mock data (7 files)
│   ├── emails.js               # 35+ realistic emails
│   ├── contacts.js             # 25+ contacts
│   ├── labels.js               # 12+ labels with colors
│   ├── accounts.js             # 3 connected accounts
│   ├── tasks.js                # 10+ task items
│   ├── calendar.js             # 8+ calendar events
│   └── templates.js            # 5+ email templates
│
├── context/                    # State management (3 providers)
│   ├── ThemeContext.jsx         # Light/dark mode
│   ├── MailContext.jsx          # Email data + actions
│   └── UIContext.jsx            # UI state + navigation
│
├── hooks/                      # Custom hooks (3 files)
│   ├── useKeyboardShortcuts.js
│   ├── useMediaQuery.js
│   └── useClickOutside.js
│
├── utils/                      # Pure functions (4 files)
│   ├── cn.js
│   ├── formatDate.js
│   ├── getInitials.js
│   └── searchUtils.js
│
├── components/
│   ├── ui/              # 22 reusable primitives
│   ├── layout/          # 4 layout components
│   ├── mail/            # 10 mail components
│   ├── compose/         # 8 compose components
│   ├── search/          # 5 search components
│   ├── settings/        # 14 settings components
│   ├── contacts/        # 4 contact components
│   ├── labels/          # 4 label management components
│   ├── accounts/        # 3 account components
│   ├── productivity/    # 7 productivity widgets
│   └── states/          # 6 state components
│
└── assets/
    └── logo.svg
```

### State Architecture

```
┌─────────────────────────────────────────┐
│            ThemeProvider                  │
│  ┌───────────────────────────────────┐  │
│  │          UIProvider                │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │       MailProvider           │  │  │
│  │  │                             │  │  │
│  │  │    < App Component />       │  │  │
│  │  │                             │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**ThemeContext**: `theme` (light/dark), `toggleTheme()`

**UIContext**: `activeView`, `sidebarCollapsed`, `composeOpen`, `density`, `toasts`, `commandPaletteOpen`, + dispatchers

**MailContext**: `emails[]`, `activeEmailId`, `starredIds`, `readIds`, `selectedIds`, `labels[]`, `accounts[]`, `contacts[]`, `tasks[]`, `events[]`, + action dispatchers

### Layout Grid

```
┌──────────────────────────────────────────────────────┐
│                     Header (56px)                     │
├──────────┬───────────────────┬──────────┬────────────┤
│          │                   │          │            │
│ Sidebar  │   Mail List       │ Reading  │  Right     │
│ (240px)  │   (flex)          │  Pane    │  Panel     │
│          │                   │  (flex)  │  (280px)   │
│          │                   │          │            │
├──────────┴───────────────────┴──────────┴────────────┤
│              Compose Modal / Draft Tray               │
└──────────────────────────────────────────────────────┘
```

---

## Design System

### Color Palette

The design uses **CSS custom properties** for full theming support. All colors change seamlessly between light and dark modes via `[data-theme="dark"]`.

#### Core Colors
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--bg-primary` | `#ffffff` | `#111118` | Panel backgrounds |
| `--bg-secondary` | `#f8f9fa` | `#16161e` | Secondary surfaces |
| `--text-primary` | `#1a1a2e` | `#e8e8ed` | Primary text |
| `--text-secondary` | `#495057` | `#9394a0` | Secondary text |
| `--accent` | `#4361ee` | `#6c82f6` | Primary actions |
| `--border` | `#e2e5e9` | `#2a2a3a` | Borders |
| `--danger` | `#e63946` | `#f87171` | Destructive actions |
| `--success` | `#2a9d8f` | `#4ade80` | Success states |

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Scale**: 11px, 12px, 14px (base), 15px, 16px, 18px, 20px, 24px

### Spacing
4px increments: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64

### Shadows
- `sm`: 0 1px 2px (subtle elevation)
- `md`: 0 2px 8px (cards)
- `lg`: 0 8px 24px (modals)
- `xl`: 0 16px 48px (overlays)

---

## Component Reference

### UI Primitives

| Component | Description | Variants |
|-----------|-------------|----------|
| `Button` | Action button | primary, secondary, ghost, danger |
| `IconButton` | Icon-only button | default, ghost |
| `Badge` | Count/status badge | count, dot, status |
| `Chip` | Filter/label chip | default, active, removable |
| `Tag` | Colored label tag | colored by label |
| `Avatar` | User avatar | image, initials |
| `Dropdown` | Menu dropdown | — |
| `Modal` | Dialog overlay | sm, md, lg, fullscreen |
| `Drawer` | Slide-in panel | left, right |
| `Tooltip` | Hover tooltip | top, bottom, left, right |
| `Toast` | Notification | info, success, error, undo |
| `Switch` | Toggle switch | — |
| `Checkbox` | Checkbox input | default, indeterminate |
| `Input` | Text input | text, search, email |
| `Tabs` | Tab navigation | default, pills |
| `Skeleton` | Loading placeholder | line, circle, rect |
| `EmptyState` | No content state | — |
| `CommandPalette` | Quick command menu | — |

### Feature Components

| Area | Components |
|------|-----------|
| **Layout** | Header, Sidebar, MainContent, RightPanel |
| **Mail** | MailList, MailRow, MailDetail, ThreadView, MessageBlock, BulkActions, FilterChips, AttachmentCard |
| **Compose** | ComposeModal, ComposeEditor, RecipientInput, EditorToolbar, DraftTray, AIAssistPanel, ScheduleSend, SignatureSelector |
| **Search** | SearchBar, SearchDropdown, SearchResults, SearchFilters, AISummaryCard |
| **Settings** | 14 settings tab components |
| **Contacts** | ContactList, ContactCard, ContactDetail, ContactGroups |
| **Productivity** | MiniCalendar, TasksList, NotesPad, Reminders, RecentAttachments, FollowUps, UpcomingSchedule |

---

## Mock Data

### Email Data (35+ emails)
Realistic emails across categories:
- **Work/Client** (8): Project updates, approvals, design reviews
- **Team** (6): Announcements, PR reviews, standup summaries
- **Finance** (4): Invoices, payments, budget approvals
- **Meetings** (4): Calendar invites, meeting notes
- **Newsletters** (4): Tech digest, design news
- **Personal** (3): Travel, social, events
- **Marketing** (3): Promos, sales
- **Urgent** (3): Alerts, deadlines, security

### Other Mock Data
- **25+ contacts** with organizations, tags, and communication history
- **12+ labels** with colors and nested hierarchy
- **3 accounts** (personal, work, custom domain)
- **10+ tasks** with due dates and linked emails
- **8+ calendar events** for the current week
- **5+ email templates** for quick replies

---

## Keyboard Shortcuts

### Navigation
| Shortcut | Action |
|----------|--------|
| `g` then `i` | Go to Inbox |
| `g` then `s` | Go to Sent |
| `g` then `d` | Go to Drafts |
| `g` then `t` | Go to Starred |
| `/` | Focus search |
| `?` | Show keyboard shortcuts |
| `Ctrl+K` | Open command palette |

### Actions
| Shortcut | Action |
|----------|--------|
| `c` | Compose new email |
| `r` | Reply |
| `a` | Reply all |
| `f` | Forward |
| `e` | Archive |
| `#` | Delete |
| `!` | Report spam |
| `s` | Toggle star |
| `u` | Mark unread |

### Selection
| Shortcut | Action |
|----------|--------|
| `x` | Select/deselect conversation |
| `Shift+Up/Down` | Extend selection |
| `*` then `a` | Select all |
| `*` then `n` | Deselect all |

### Interface
| Shortcut | Action |
|----------|--------|
| `[` | Collapse sidebar |
| `]` | Expand sidebar |
| `Ctrl+Enter` | Send email |
| `Escape` | Close modal/panel |

---

## Responsive Design

### Breakpoint Strategy

| Range | Layout | Key Changes |
|-------|--------|-------------|
| **< 768px** (Mobile) | Single column | Sidebar → drawer, mail detail → full screen, bottom nav bar |
| **768–1024px** (Tablet) | Two column | Sidebar → icons only, right panel hidden |
| **> 1024px** (Desktop) | Three column | Full layout with all panels |

### Mobile-Specific Features
- Bottom navigation bar with 5 items
- Hamburger menu for sidebar
- Full-screen compose
- Touch-friendly 44px minimum tap targets
- Swipe gesture indicators
- Back navigation in detail views

---

## Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 15+ |
| Edge | 90+ |

---

## Future Integration Points

The frontend is architected for easy backend integration:

### API Connection Points
```
data/emails.js      → GET /api/emails, POST /api/emails
data/contacts.js    → GET /api/contacts
data/labels.js      → GET /api/labels, POST /api/labels
data/accounts.js    → GET /api/accounts
data/tasks.js       → GET /api/tasks, POST /api/tasks
data/calendar.js    → GET /api/calendar/events
```

### Integration Steps
1. Replace static imports in `MailContext.jsx` with `fetch()` calls
2. Add loading states (already built as components)
3. Add error handling (already built as components)
4. Replace Context + useReducer with a data fetching library (SWR/React Query)
5. Add authentication flow (login/signup screens)
6. Connect real-time updates via WebSocket

### Suggested Backend Stack
- **API**: Node.js + Express or Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Email Protocol**: IMAP/SMTP via nodemailer
- **Auth**: NextAuth.js or Clerk
- **Real-time**: WebSocket or Server-Sent Events
- **Storage**: S3-compatible for attachments
- **Search**: Elasticsearch for full-text search

---

## SEO Configuration

The application includes comprehensive SEO optimization for search engines and social media sharing:

### Meta Tags
- **Description**: Comprehensive SEO meta description highlighting features
- **Keywords**: webmail, email client, gmail alternative, etc.
- **Open Graph**: Full OG tags for social media preview
- **Twitter Cards**: Summary card with large image
- **Canonical URL**: Points to https://mail.ladestack.in
- **Theme Color**: Matches accent color (#4361ee)

### Sitemap
- All main routes included with priorities and changefreq
- Dynamic routes: inbox, sent, drafts, starred, archive, trash
- Feature routes: contacts, settings, search

### robots.txt
- Allows all crawlers
- Specifies sitemap location
- Includes crawl-delay for respectful crawling

---

## 🔧 Troubleshooting

### Email Not Visible

**Problem**: Can't see any emails in the inbox.

**Solutions**:
1. Make sure you're viewing the correct folder (Inbox, Sent, Drafts, etc.)
2. Click the folder in the sidebar to switch views
3. Try switching folders: Inbox → Sent → Starred → Archive
4. Check browser console for JavaScript errors (F12)
5. Refresh the browser (Ctrl+R or Cmd+R)

### Development Server Not Starting

**Solutions**:
1. Make sure Node.js 18+ is installed: `node --version`
2. Delete node_modules and reinstall: `rm -rf node_modules && npm install`
3. Kill any process using port 5173: `lsof -ti:5173 | xargs kill`

### Build Errors

**Solutions**:
1. Clear vite cache: `rm -rf node_modules/.vite`
2. Check for syntax errors in recent file changes
3. Run lint if available: `npm run lint`

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

### Code Style
- React functional components only
- CSS modules or BEM-style class naming
- Keep components focused and under 200 lines
- Use semantic HTML elements
- Add aria-labels to all interactive elements

---

## Project Stats

| Metric | Value |
|--------|-------|
| **Source Files** | 97 total (54 JSX/JS, 43 CSS) |
| **Production Bundle** | 549KB (116KB gzipped) |
| **CSS Size** | 109KB (16KB gzipped) |
| **Build Time** | < 1 second |
| **Components** | 60+ React components |

### Build Output
```
dist/
├── index.html         (2.73 KB)
├── assets/
│   ├── *.css        (109 KB)
│   └── *.js         (425 KB)
```

---

## License

MIT License — free for personal and commercial use.

---

<p align="center">
  Built with ❤️ for productivity
  <br>
  <strong>Flowmail</strong> — Email that flows
</p>
