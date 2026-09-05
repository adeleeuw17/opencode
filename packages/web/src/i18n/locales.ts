export const docsLocale = [
  "ar",
  "bs",
  "da",
  "de",
  "es",
  "fr",
  "it",
  "ja",
  "ko",
  "nb",
  "pl",
  "pt-br",
  "ru",
  "th",
  "tr",
  "uk",
  "zh-cn",
  "zh-tw",
] as const

export type DocsLocale = (typeof docsLocale)[number]

export const locale = ["root", ...docsLocale] as const

export type Locale = (typeof locale)[number]

export const localeAlias = {
  ar: "ar",
  br: "pt-br",
  bs: "bs",
  da: "da",
  de: "de",
  en: "root",
  es: "es",
  fr: "fr",
  it: "it",
  ja: "ja",
  ko: "ko",
  nb: "nb",
  nn: "nb",
  no: "nb",
  pl: "pl",
  pt: "pt-br",
  "pt-br": "pt-br",
  root: "root",
  ru: "ru",
  th: "th",
  tr: "tr",
  uk: "uk",
  zh: "zh-cn",
  "zh-cn": "zh-cn",
  zht: "zh-tw",
  "zh-tw": "zh-tw",
} as const satisfies Record<string, Locale>

const starts = [
  ["ko", "ko"],
  ["bs", "bs"],
  ["de", "de"],
  ["es", "es"],
  ["fr", "fr"],
  ["it", "it"],
  ["da", "da"],
  ["ja", "ja"],
  ["pl", "pl"],
  ["ru", "ru"],
  ["uk", "uk"],
  ["ar", "ar"],
  ["th", "th"],
  ["tr", "tr"],
  ["en", "root"],
] as const

function parse(input: string) {
  let decoded = ""
  try {
    decoded = decodeURIComponent(input)
  } catch {
    return null
  }

  const value = decoded.trim().toLowerCase()
  if (!value) return null
  return value
}

export function exactLocale(input: string) {
  const value = parse(input)
  if (!value) return null
  if (value in localeAlias) {
    return localeAlias[value as keyof typeof localeAlias]
  }

  return null
}

export function matchLocale(input: string) {
  const value = parse(input)
  if (!value) return null

  if (value.startsWith("zh")) {
    if (value.includes("hant") || value.includes("-tw") || value.includes("-hk") || value.includes("-mo")) {
      return "zh-tw"
    }
    return "zh-cn"
  }

  if (value in localeAlias) {
    return localeAlias[value as keyof typeof localeAlias]
  }

  if (value.startsWith("pt")) return "pt-br"
  if (value.startsWith("no") || value.startsWith("nb") || value.startsWith("nn")) return "nb"

  return starts.find((item) => value.startsWith(item[0]))?.[1] ?? null
}

export function parseAcceptLanguage(header: string | null): { lang: string; q: number }[] {
  if (!header) return []

  return header
    .split(",")
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((raw) => {
      const parts = raw.split(";").map((x) => x.trim())
      const lang = parts[0] ?? ""
      const q = parts
        .slice(1)
        .find((x) => x.startsWith("q="))
        ?.slice(2)
      return {
        lang,
        q: q ? Number.parseFloat(q) : 1,
      }
    })
    .sort((a, b) => b.q - a.q)
}

export function localeFromAcceptLanguage(header: string | null) {
  const items = parseAcceptLanguage(header)

  const locale = items
    .map((item) => item.lang)
    .filter((lang) => lang && lang !== "*")
    .map((lang) => matchLocale(lang))
    .find((lang) => lang)

  return locale ?? "root"
}