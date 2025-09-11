This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## MicroManager

MicroManager is a lightweight, no-sign-in habit builder. All data is stored locally on your device.

### Tech

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui + lucide icons
- Zustand for state, localStorage for primary state, IndexedDB (idb-keyval) for logs (optional)
- Recharts for charts, Framer Motion for subtle animations

### Data Model

```
type Habit = {
  id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'x_per_week';
  timesPerWeek?: number;
  targetMinutes?: number;
  category?: string;
  color?: string;
  isArchived: boolean;
  createdAt: string;
}

type HabitEntry = {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  status: 'done' | 'skipped' | 'partial';
  minutes?: number;
  note?: string;
  createdAt: string;
}
```

### Storage

- Primary state (habits, entries) is persisted with `zustand` + `localStorage` under the key `micromanager_store`.
- Demo data seeds on first load if the store is empty.
- Optional logs can be written to IndexedDB using `idb-keyval`.

### Streaks & Stats

- Streaks: current streak counts consecutive days with status = `done`. Best streak is the longest such run.
- Consistency: completion rates over last 7/30/90 days and by weekday.
- Minutes: daily and rolling averages; charts handle empty states gracefully.
- X-per-week: shows weekly progress like `2/5 this week`.

### Keyboard Shortcuts (Today page)

- D: mark selected habit Done
- S: mark Skipped
- P: mark Partial
- M: focus minutes input
- N: focus note input

### Export / Import

- Export creates a downloadable JSON of your local data.
- Import restores from a JSON backup. Use Settings → Data.
- Analytics → Raw Entries provides CSV export of the entries table.

### Development

- `npm run dev` — start dev server at http://localhost:3000
- `npm run build` — production build
- `npm run start` — serve built app

### PWA (Optional)

- A minimal `manifest.json` and `public/sw.js` are included for offline capability. Registration happens client-side.

### Deploy

1. Push to GitHub.
2. Create a new Vercel project from this repo.
3. Use Next.js defaults; no env required. Build and deploy.
