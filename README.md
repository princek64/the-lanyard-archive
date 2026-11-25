# The Lanyard Archive

A personal exhibition of lanyards and conference badges from London. The prototype presents twenty-two lanyard objects on a scrollable rail, with a physics-driven close-up viewer and a catalogue record for each object.

## Development

Use Node.js 20.9+ with npm.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). Scroll along the rail, drag across the ribbon samples, use the arrows, or choose a badge from **Object index**. Choose **Pick up pass**, then drag and release to watch it swing. Shift-drag to rotate with a mouse, or use **Flip badge**, **Front** and **Back**. Choose **Read print** for an enlarged, scrollable view of either face. Use Escape or **Back to exhibition** to return to the same stop.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

For Vercel, import the project as a Next.js repository and use the standard build settings. The prototype has no runtime environment variables or backend services.

The exhibition order, badge records and artwork paths live in [lib/badges.ts](lib/badges.ts). See the [asset guide](docs/ASSETS.md) for preparing real photographs, [AGENTS.md](AGENTS.md) for project conventions, and [progress](docs/PROGRESS.md) for verification and remaining work.
