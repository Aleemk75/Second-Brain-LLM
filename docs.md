# Second Brain LLM &middot; Architectural Documentation

This document outlines the core architectural principles and design philosophies that govern the **Second Brain LLM**.

---

## 🏗 1. Portable Architecture: Swappable & Decoupled Layers

The system is built on a modular "plug-and-play" architecture where each layer is strictly decoupled to allow for easy swaps or scaling.

- **UI Independence**: The frontend (React + Vite) is a standalone SPA. It consumes the backend via a unified `api.js` service. This means the backend could be rewritten in Go or Python without touching a single line of UI logic.
- **Service Isolation (LLM Agnostic)**: All AI logic is encapsulated within `backend/src/services/aiService.js`. Currently using **Groq (Llama 3.3)**, but the architecture allows for a total AI swap (to OpenAI, Anthropic, or Local Llama) by simply updating the provider-specific wrapper function.
- **Database Contract**: Using Mongoose schemas as a strict data contract. This ensures that even if we migrate from MongoDB to a Vector DB (like Pinecone) or a Relational DB (PostgreSQL), the controllers remain stable.

---

## ✨ 2. Principles-Based UX: Design for Intelligence

Our AI interaction patterns are guided by four core principles to ensure the user feels in control:

1.  **Grounding as Truth**: AI never "hallucinates" new facts. It is strictly constrained by a "Source of Truth" system prompt, ensuring that summaries and insights are derived *only* from the user's saved data.
2.  **Intentional Flow**: We use **intentional micro-interactions** (responsive skeletons and staggered animations) to eliminate the "blank screen" anxiety common in AI data-fetching.
3.  **Contextual Proximity**: Tools like the **AI Studio** and the **Source Panel** are positioned within the user's peripheral vision, allowing for AI assistance without breaking the focused "writing" state.
4.  **Minimal Friction**: Capture should be fast. AI automation (tagging/summarizing) happens asynchronously during the save process, so the user never waits for the "AI to think."

---

## 🤖 3. Agent Thinking: Self-Maintaining Knowledge

The system doesn't just store data; it functions as a lightweight "agent" that improves the organization of the brain over time:

- **Automated Metadata Loop**: Every save event triggers an background agentic process that analyzes content, extracts tags, and generates a structured summary. The brain organizes itself while you sleep.
- **Deep Dive Synthesis**: The "Understand" feature acts as a research agent, synthesizing long-form content into high-level takeaways that are stored as structured metadata for faster future retrieval.
- **Query Refinement**: The public API translates human questions into filtered semantic contexts, acting as a retrieval agent that sits between the raw database and the LLM core.

---

## 🌐 4. Infrastructure Mindset: The Brain as a Service (BaaS)

We treat the Second Brain not just as a website, but as a piece of personal infrastructure.

- **API-First Design**: The core value—your personal knowledge—is exposed through the **`GET /api/public/brain/query`** endpoint.
- **Extensibility**: Because the query engine is expose via API, users can build their own:
    - **Mobile Shortcuts**: "Hey Siri, ask my brain where I stored the Node.js notes."
    - **Chrome Extensions**: Highlight text on any page and "Save to Second Brain" directly via the API.
    - **CLI Tools**: Query your brain from the terminal while you code.
- **Public Query Logic**: The query endpoint uses a RAG-light (Retrieval-Augmented Generation) pattern, ensuring efficient and scalable usage of LLM tokens by only processing relevant notes.

---

*Architected for clarity, scaled for intelligence.*
