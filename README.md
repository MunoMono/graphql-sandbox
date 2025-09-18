# 🎨 GraphQL Sandbox · Cooper Hewitt × Carbon × RCA Design Research

*A playful research tool developed as part of Graham Newman’s PhD project.*

---

## ✨ What is this?
This repo is a **GraphQL sandbox** built with:
- ⚡️ **Vite + React** (modern, lean, fast)  
- 🎨 **Carbon Design System** (IBM’s design language, neatly adapted here)  
- 🗂 **Cooper Hewitt Smithsonian Design Museum API** (real design objects, posters, and archives)  

It’s a **design research playground**:  
- Query the Cooper Hewitt API with GraphQL  
- Explore poster collections and works from designers like *Ikko Tanaka* or *Dieter Rams*  
- Tinker with query parameters and immediately see JSON results + media previews  
- Switch Carbon density modes, toggle light/dark, and clear your editor on demand  

---

## 🧑‍🎓 PhD Context
This tool forms part of Graham Newman’s PhD research at the **Royal College of Art**, examining **synthesis, mapping, and representation in design research**.  

It sits in dialogue with the **Department of Design Research archive** at RCA (1960s–90s), surfacing historical and contemporary practices through **graphical, computational, and archival interfaces**.

Put simply:  
> _What happens when a design archive meets modern design systems and open cultural APIs?_  

This repo is one cheeky, experimental answer.

---

## 🚀 Getting Started

Clone the repo:
```bash
git clone https://github.com/MunoMono/graphql-sandbox.git
cd graphql-sandbox
```

Install dependencies:
```bash
npm install
```

Run locally:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

---

## 🌍 Deployment

This project is ready to deploy via **GitHub Pages** (configured in `vite.config.js`):

```bash
# Push latest build to gh-pages branch
npm run build
git add dist -f
git commit -m "Deploy build"
git subtree push --prefix dist origin gh-pages
```

**Live demo:** [https://munomono.github.io/graphql-sandbox/](https://munomono.github.io/graphql-sandbox/)
---

## 💡 Try it Out

Example queries to copy/paste into the editor:

```graphql
# Ikko Tanaka posters
{
  object(maker:"Ikko Tanaka", general:"poster", hasImages:true, size:5) {
    id
    title
    summary
    date
    multimedia
  }
}

# Dieter Rams objects
{
  object(maker:"Dieter Rams", hasImages:true, size:5) {
    id
    title
    summary
    date
    multimedia
  }
}
```

---

## 🖤 Credits
- **Royal College of Art** — Department of Design Research archive  
- **Smithsonian Cooper Hewitt** — Open API + collections data  
- **IBM Carbon Design System** — UI framework  
- **Vite/React** — build tooling  

Built with equal parts seriousness and sass by Graham Newman.  
Because even PhDs deserve nice buttons. ✌️

---
