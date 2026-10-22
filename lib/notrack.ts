export interface NotrackModelConfig {
  id: string;
  name: string;
  category: "uncensored" | "vision" | "media" | "search" | "free";
  baseUrl: string;
  defaultApiKey: string;
  freeKey: boolean;
  models: string[];
  keyGenUrl: string;
  description: string;
}

export const NOTRACK_PROVIDERS: NotrackModelConfig[] = [
  {
    id: "notrack-uncensored",
    name: "NoTrack Coder Uncensored",
    category: "uncensored",
    baseUrl: "https://endpoint.notrackcoder.com/v1",
    defaultApiKey: "d7f909723bdf883ae4513615ee7ac3832e4139e8892ba1b2",
    freeKey: true,
    models: ["notrack-coder-uncensored", "notrack-deepseek-r1-uncensored", "notrack-llama-3-70b-unfiltered", "notrack-coder-base"],
    keyGenUrl: "https://notrackcoder.com",
    description: "Fully uncensored cloud coding and reasoning models with free tier access.",
  },
  {
    id: "notrack-vision",
    name: "NoTrack Vision",
    category: "vision",
    baseUrl: "https://endpoint2.notrackcoder.com/v1",
    defaultApiKey: "d7f909723bdf883ae4513615ee7ac3832e4139e8892ba1b6",
    freeKey: true,
    models: ["PrntScr", "notrack-vision-pro", "notrack-ocr-reader"],
    keyGenUrl: "https://notrackcoder.com/vision",
    description: "Advanced vision, image analysis and screenshot OCR models.",
  },
  {
    id: "notrack-media",
    name: "NoTrack Media & Image Gen",
    category: "media",
    baseUrl: "https://endpoint3.notrackcoder.com/v1",
    defaultApiKey: "d7f909723bdf883ae4513615ee7ac3832e4139e8892ba1b6",
    freeKey: true,
    models: ["sdxl-realvisxl", "flux-schnell-notrack", "sd3-medium"],
    keyGenUrl: "https://notrackcoder.com/media",
    description: "High quality generative media, SDXL RealVisXL, and Flux models.",
  },
  {
    id: "notrack-search",
    name: "NoTrack Search & Partner Chat",
    category: "search",
    baseUrl: "https://partner.notrack.ai/v1",
    defaultApiKey: "nt-ad2560678683d7f88ba181e2275876ae62b9ad1c00765938",
    freeKey: false,
    models: ["notrack-chat", "notrack-search-pro"],
    keyGenUrl: "https://notrack.ai/partner",
    description: "Partner search-grounded intelligent assistant models.",
  },
  {
    id: "notrack-free",
    name: "NoTrack Community Free Tier",
    category: "free",
    baseUrl: "https://endpoint.notrackcoder.com/v1",
    defaultApiKey: "d7f909723bdf883ae4513615ee7ac3832e4139e8892ba1b2",
    freeKey: true,
    models: ["notrack-free-mini", "notrack-community-chat"],
    keyGenUrl: "https://notrackcoder.com/free",
    description: "Keyless community models available completely free without registration.",
  },
];
