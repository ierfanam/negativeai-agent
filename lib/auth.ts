import { betterAuth } from "better-auth";

const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
const DEVELOPMENT_ALLOWED_HOSTS = ["localhost:*", "127.0.0.1:*"];

function getAllowedHosts(): string[] {
  if (process.env.NODE_ENV === "development") {
    return DEVELOPMENT_ALLOWED_HOSTS;
  }
  const deploymentHosts = [
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.BETTER_AUTH_URL,
    "*.run.app",
    "*.aistudio.google.com",
  ].filter((host): host is string => Boolean(host));
  if (deploymentHosts.length === 0) {
    return ["*"];
  }
  return Array.from(new Set(deploymentHosts));
}

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (value) return value;
  return `mock-${name.toLowerCase()}`;
}

export const auth = betterAuth({
  baseURL: {
    allowedHosts: getAllowedHosts(),
    protocol: process.env.NODE_ENV === "development" ? "auto" : "https",
  },
  secret: requireEnvironmentVariable("BETTER_AUTH_SECRET"),
  session: {
    expiresIn: SESSION_MAX_AGE_SECONDS,
    disableSessionRefresh: true,
    cookieCache: {
      enabled: true,
      maxAge: SESSION_MAX_AGE_SECONDS,
      refreshCache: false,
      strategy: "jwe",
    },
  },
  socialProviders: process.env.VERCEL_APP_CLIENT_ID ? {
    vercel: {
      clientId: process.env.VERCEL_APP_CLIENT_ID,
      clientSecret: process.env.VERCEL_APP_CLIENT_SECRET || "",
    },
  } : undefined,
});
