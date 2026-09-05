import { describe, expect, test } from "bun:test"
import { parseAcceptLanguage, localeFromAcceptLanguage } from "./i18n/locales"

describe("parseAcceptLanguage", () => {
  test("returns empty array for null header", () => {
    expect(parseAcceptLanguage(null)).toEqual([])
  })

  test("parses a single language with no q value as q=1", () => {
    expect(parseAcceptLanguage("fr")).toEqual([{ lang: "fr", q: 1 }])
  })

  test("parses multiple languages and sorts by q value descending", () => {
    const result = parseAcceptLanguage("en;q=0.5,fr;q=0.9,de")
    expect(result.map((r) => r.lang)).toEqual(["de", "fr", "en"])
  })

  test("ignores empty segments from trailing commas", () => {
    const result = parseAcceptLanguage("en,,fr")
    expect(result.map((r) => r.lang)).toEqual(["en", "fr"])
  })
})

describe("localeFromAcceptLanguage", () => {
  test("returns 'root' for null header", () => {
    expect(localeFromAcceptLanguage(null)).toBe("root")
  })

  test("picks the highest-weighted matching locale", () => {
    expect(localeFromAcceptLanguage("en;q=0.5,fr;q=0.9")).toBe("fr")
  })

  test("returns 'root' when no listed language matches a known locale", () => {
    expect(localeFromAcceptLanguage("xx-XX")).toBe("root")
  })

  test("skips wildcard entries", () => {
    expect(localeFromAcceptLanguage("*;q=0.9,de;q=0.5")).toBe("de")
  })
})