"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

import en from "./locales/en.json";
import ko from "./locales/ko.json";
import ja from "./locales/ja.json";
import zh from "./locales/zh.json";
import es from "./locales/es.json";
import de from "./locales/de.json";

type Translations = typeof en;
type Locale = "en" | "ko" | "ja" | "zh" | "es" | "de";

const locales: Record<Locale, Translations> = { en, ko, ja, zh, es, de };

function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language || "";
  const prefix = lang.split("-")[0].toLowerCase();
  if (prefix in locales) return prefix as Locale;
  return "en";
}

function getNestedValue(obj: unknown, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

interface I18nContextType {
  locale: Locale;
  t: (key: string) => string;
  tArray: (key: string) => string[];
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  t: (key) => key,
  tArray: () => [],
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  const t = (key: string): string => {
    const val = getNestedValue(locales[locale], key);
    if (val === key) {
      return getNestedValue(locales.en, key);
    }
    return val;
  };

  const tArray = (key: string): string[] => {
    const keys = key.split(".");
    let current: unknown = locales[locale];
    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = (current as Record<string, unknown>)[k];
      } else {
        current = null;
        break;
      }
    }
    if (Array.isArray(current)) return current as string[];

    // Fallback to English
    current = locales.en;
    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = (current as Record<string, unknown>)[k];
      } else {
        return [];
      }
    }
    return Array.isArray(current) ? (current as string[]) : [];
  };

  return (
    <I18nContext.Provider value={{ locale, t, tArray }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
