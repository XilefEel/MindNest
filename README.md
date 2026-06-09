# MindNest

> Your mind deserves a cozy nest. 🪺

MindNest is a cozy desktop productivity app where you create **Nests** (workspaces) and fill them with whatever **Nestlings** (tools) you need, like notes, boards, planners, galleries, bookmarks, mind maps, and more.

Built with Tauri and React for a lightweight, native feel.

## Why MindNest?

Most productivity apps nowadays are incredibly powerful, but I only ever used them to make some simple notes, quick to-do lists, and maybe a few bookmarks. In the end, I only use like 5% of their features, and the rest just adds to the complexity.

MindNest is built around one idea: give me a handful of simple, focused tools that I'll actually use, without having to manage an entire ecosystem.

## Screenshots

<img src="./screenshots/home.png" width="49%" alt="home"/><img src="./screenshots/note.png" width="49%" alt="note"/>

<img src="./screenshots/bookmark.png" width="49%" alt="bookmark"/>

## Tech Stack

**Frontend:** React, TypeScript, TailwindCSS, shadcn/ui

**State Management:** Zustand

**Backend:** Tauri, SQLite

**Libraries:** DnD Kit, Tiptap, XYFlow

## Features

- **Nests**: Personalized workspaces with a built-in home page.
- **Nestlings**: Building blocks you can add to your nests. You can make:
  - 📝 Notes
  - 📋 Boards
  - 📅 Planners
  - 🖼️ Galleries
  - 🔖 Bookmarks
  - 🧠 Mind Maps
  - 🗄️ Databases _(work in progress)_
- Folders and Tags
- Sidebar with Drag & Drop
- Emoji Icons Picker for Nestlings
- Upload Background Image and Music to Nests
- Light, Dark, and System Theme
- **Adaptive Glassmorphism**: Cards, modals, and menus turn translucent when a background image is set

## Requirements

- [Node.js](https://nodejs.org/)
- [Rust](https://rustup.rs/)
- [Tauri CLI prerequisites](https://tauri.app/start/prerequisites/)

## Run Locally

```bash
git clone https://github.com/XilefEel/MindNest.git
cd mindnest
npm install
npm run tauri dev
```

## Roadmap

- Database Nestlings
- Export Nests
- Share and Discover Nests
- Web and Mobile Versions
- Cross Device Sync

## License

[MIT](./LICENSE)
