// src/utils/mediaStore.js
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const store = new Map(); // token -> { filePath, thumbPath?, mime, name, size, expiresAt }

export function createMediaEntry({ filePath, thumbPath = null, mime, name, size, ttlSeconds = 60 * 60 }) {
  const token = uuidv4();
  const expiresAt = Date.now() + ttlSeconds * 1000;
  store.set(token, { filePath, thumbPath, mime, name, size, expiresAt });
  // schedule cleanup (simple)
  setTimeout(() => {
    const entry = store.get(token);
    if (entry && Date.now() >= entry.expiresAt) {
      try { if (entry.filePath && fs.existsSync(entry.filePath)) fs.unlinkSync(entry.filePath); } catch(e){}
      try { if (entry.thumbPath && fs.existsSync(entry.thumbPath)) fs.unlinkSync(entry.thumbPath); } catch(e){}
      store.delete(token);
    }
  }, ttlSeconds * 1000 + 5000);
  return token;
}

export function getMediaEntry(token) {
  const entry = store.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    // expired: cleanup immediate
    try { if (entry.filePath && fs.existsSync(entry.filePath)) fs.unlinkSync(entry.filePath); } catch(e){}
    try { if (entry.thumbPath && fs.existsSync(entry.thumbPath)) fs.unlinkSync(entry.thumbPath); } catch(e){}
    store.delete(token);
    return null;
  }
  return entry;
}

// For listing / debug (optional)
export function listEntries() {
  return Array.from(store.entries()).map(([token, v]) => ({ token, ...v }));
}
