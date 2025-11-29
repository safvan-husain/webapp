# Architecture Documentation

**This file has been split into focused steering files for better organization and reduced context usage.**

## 📚 Documentation Structure

All architecture rules are now in `.kiro/steering/`:

### **Core Files (Always Loaded)**

- **`agents-architecture.md`** - Core architecture rules, folder structure, layer responsibilities, naming conventions, import rules

### **Contextual Files (Loaded When Relevant)**

- **`agents-frontend.md`** - Next.js 16, Cache Components, Client/Server Components, form handling
  - Loaded when working in `app/**/*` files

- **`agents-testing.md`** - Testing strategy, unit tests, integration tests, test patterns
  - Loaded when working in `__tests__/**/*` or `*.test.ts` files

- **`agents-error-handling.md`** - Error handling, toast notifications, expandable error details, copy-to-clipboard
  - Loaded when working with error handling, forms, or server actions

### **Manual Files (Load Explicitly)**

- **`agents-progress.md`** - Project progress tracker, completed features, next steps
  - Reference with `#agents-progress.md` when you need to see project status

---

## 🎯 Benefits of This Structure

1. **Reduced Context** - Only load relevant rules when needed
2. **Faster Parsing** - Smaller files = less hallucination risk
3. **Better Organization** - Easy to find and update specific rules
4. **Conditional Loading** - Frontend rules only load for frontend work
5. **Lower Token Usage** - Don't load testing rules when writing UI code

---

## 📖 Quick Reference

**Working on backend logic?** → `agents-architecture.md` (auto-loaded)

**Working on UI/pages?** → `agents-architecture.md` + `agents-frontend.md` (auto-loaded)

**Writing tests?** → `agents-architecture.md` + `agents-testing.md` (auto-loaded)

**Handling errors?** → `agents-architecture.md` + `agents-error-handling.md` (auto-loaded)

**Need project status?** → Reference `#agents-progress.md` in chat

---

**All rules are automatically loaded based on file context. No action needed!**
