# The Lanyard Archive

The current milestone is a fifteen-stop exhibition with a suspended, inspectable badge at each stop. Read [the concept](docs/CONCEPT.md) and [the design notes](docs/DESIGN.md) before changing the experience.

- Use the Next.js App Router and keep the page and metadata server rendered. Load Three.js and Rapier in the client viewer.
- Keep artwork, dimensions in millimetres, and event data in `lib/badges.ts`. The scene modules should accept a badge configuration without knowing the event or asset names.
- Keep drag, release and face selection available on a narrow touch viewport. Preserve native page scrolling outside the badge hit target and keep the static viewer usable without WebGL.
- Run `npm run lint`, `npm run typecheck` and `npm run build` after source changes. Check pointer release, touch scrolling and keyboard face selection when editing interactions.
- Record lasting architecture decisions in `docs/DECISIONS.md` and update `docs/PROGRESS.md` with verified status and outstanding checks.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
