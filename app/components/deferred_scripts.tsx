"use client";

import { useEffect } from "react";

type ThirdPartyScript = {
  id: string;
  src: string;
  async?: boolean;
  defer?: boolean;
  attributes?: Record<string, string>;
};

type DeferredScriptsProps = {
  scripts?: ThirdPartyScript[];
};

/**
 * Loads non-essential third-party scripts only after DOMContentLoaded
 * to keep main-thread work off the critical rendering path (INP).
 */
export default function DeferredScripts({
  scripts = [],
}: DeferredScriptsProps) {
  useEffect(() => {
    if (scripts.length === 0) {
      return;
    }

    const loadScripts = () => {
      for (const script of scripts) {
        if (document.getElementById(script.id)) {
          continue;
        }

        const element = document.createElement("script");
        element.id = script.id;
        element.src = script.src;
        element.async = script.async ?? true;
        element.defer = script.defer ?? true;

        if (script.attributes) {
          for (const [key, value] of Object.entries(script.attributes)) {
            element.setAttribute(key, value);
          }
        }

        document.body.appendChild(element);
      }
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", loadScripts, { once: true });
      return () => document.removeEventListener("DOMContentLoaded", loadScripts);
    }

    loadScripts();
  }, [scripts]);

  return null;
}
