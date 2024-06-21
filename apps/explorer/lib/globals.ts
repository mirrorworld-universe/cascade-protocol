// Global node polyfill.

import { Buffer } from "buffer";
import process from "process";
import { canUseDOM } from "./dom";

export function initializeGlobals() {
  if (!canUseDOM()) return;
  window.global = window;
  window.Buffer = Buffer;
  window.process = process;
}

initializeGlobals();
