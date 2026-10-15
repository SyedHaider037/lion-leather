import "server-only";

// A small logger for server code. Each call prints one JSON line, so logs stay
// easy to search on any host. It sends nothing anywhere else.
//
// Sensitive data is removed before printing: values under keys such as token,
// authorization, email, phone, password or cookie are replaced, and email
// addresses or bearer tokens inside text are masked.

export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogContext = Record<string, unknown>;

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const REDACTED = "[redacted]";
const MAX_DEPTH = 4;

const SENSITIVE_KEY =
  /token|authorization|auth|email|phone|whatsapp|password|passwd|secret|cookie|api[-_]?key|session/i;
const EMAIL_IN_TEXT = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const BEARER_IN_TEXT = /\bBearer\s+[A-Za-z0-9._~+/=-]+/gi;

function scrubText(text: string): string {
  return text
    .replace(EMAIL_IN_TEXT, REDACTED)
    .replace(BEARER_IN_TEXT, REDACTED);
}

function serializeError(err: Error): LogContext {
  const out: LogContext = { name: err.name, message: scrubText(err.message) };
  // Stack traces name files on the server, so keep them out of production logs.
  if (process.env.NODE_ENV !== "production" && err.stack) {
    out.stack = scrubText(err.stack);
  }
  return out;
}

/** Returns a copy of `value` that is safe to print. */
export function redact(value: unknown, depth = 0): unknown {
  if (typeof value === "string") return scrubText(value);
  if (value instanceof Error) return serializeError(value);
  if (value === null || typeof value !== "object") return value;
  if (depth >= MAX_DEPTH) return "[truncated]";

  if (Array.isArray(value)) {
    return value.map((item) => redact(item, depth + 1));
  }

  const out: LogContext = {};
  for (const [key, item] of Object.entries(value)) {
    out[key] = SENSITIVE_KEY.test(key) ? REDACTED : redact(item, depth + 1);
  }
  return out;
}

export type LoggerOptions = {
  /** Lowest level that is printed. */
  minLevel: LogLevel;
  /** Where lines go. Defaults to the console. */
  write?: (level: LogLevel, line: string) => void;
  /** Clock, replaceable in tests. */
  now?: () => Date;
};

function consoleWrite(level: LogLevel, line: string) {
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export function createLogger({
  minLevel,
  write = consoleWrite,
  now = () => new Date(),
}: LoggerOptions) {
  function log(level: LogLevel, message: string, context?: LogContext) {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[minLevel]) return;
    const entry: LogContext = {
      time: now().toISOString(),
      level,
      msg: scrubText(message),
    };
    if (context) {
      for (const [key, item] of Object.entries(redact(context) as LogContext)) {
        // Keep the three standard fields from being overwritten.
        if (!(key in entry)) entry[key] = item;
      }
    }
    write(level, JSON.stringify(entry));
  }

  return {
    debug: (message: string, context?: LogContext) =>
      log("debug", message, context),
    info: (message: string, context?: LogContext) =>
      log("info", message, context),
    warn: (message: string, context?: LogContext) =>
      log("warn", message, context),
    error: (message: string, context?: LogContext) =>
      log("error", message, context),
  };
}

/** The logger used across the app: debug messages are off in production. */
export const logger = createLogger({
  minLevel: process.env.NODE_ENV === "production" ? "info" : "debug",
});
