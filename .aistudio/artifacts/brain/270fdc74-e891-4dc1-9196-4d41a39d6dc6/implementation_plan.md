# NoTrack Models & Endpoints Integration

Integrate comprehensive NoTrack endpoints (`notrack-uncensored`, `notrack-vision`, `notrack-media`, `notrack-search`) with categorized model selection, custom API key configuration, key generation links, and fully functional agent chat integration.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> - **Model Categories**: Models will be organized into clear categories: Uncensored Coder, Vision, Media & Image Generation, Search & Chat.
> - **API Keys & Key Generation**: Each endpoint comes with pre-configured free keys as provided by the user, with custom input and direct links to key generation pages.

- **Confirmed Decision**: Implement robust model switching in the agent chat interface supporting all requested NoTrack endpoints and models.
- **Open Question**: None. Proceeding with the complete NoTrack integration.

---

## 1. Overview & Core Concept

- **What It Does**: Adds a comprehensive model selection drawer/dropdown and settings panel for NoTrack endpoints (`notrack-uncensored`, `notrack-vision`, `notrack-media`, `notrack-search`), allowing users to easily switch models, manage API keys, and generate keys.
- **Target Audience**: Developers and users utilizing NoTrack AI models and uncensored endpoints.
- **Key Value**: Seamless multi-model agent interaction across NoTrack's specialized infrastructure.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. User opens the model selector in the chat header or settings drawer.
  2. Models are categorized cleanly (Uncensored Coder, Vision, Media/Image, Search/Chat).
  3. User can view key status, input custom API keys, or click to open key generation pages.
  4. Selecting a model updates the agent backend proxy route to forward prompts to the correct NoTrack endpoint and base URL.
- **Visual Identity & Theme**: Professional SaaS developer dashboard aesthetic, utilizing clean typography, 60-30-10 color distribution, and tabular numbers.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1**: Client-side model selection state coupled with server-side proxy routing.
  - *Why*: Secures API keys and ensures seamless multi-endpoint switching without CORS issues.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────┐      ┌──────────────────────────────┐
│  Client Agent UI / Selector │ ───> │  Next.js API Route (/api/ai) │
└─────────────────────────────┘      └──────────────────────────────┘
                                                    │
             ┌──────────────────────────────────────┴──────────────────────────────────────┐
             │                                                                             │
             ▼                                                                             ▼
┌─────────────────────────┐                                                   ┌─────────────────────────┐
│ NoTrack Uncensored /    │                                                   │ NoTrack Vision / Media /│
│ Chat Endpoint           │                                                   │ Search Endpoints        │
└─────────────────────────┘                                                   └─────────────────────────┘
```
