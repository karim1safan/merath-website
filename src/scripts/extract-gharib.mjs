#!/usr/bin/env node

/**
 * Scraper script to extract غريب القرآن data from quranpedia.net
 * Run once: node scripts/extract-gharib.mjs
 * Output: src/data/gharib-alquran.json
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, '..', 'src', 'data', 'gharib-alquran.json');

const BASE_URL = 'https://quranpedia.net/book/get-content/491';
const START_PAGE = 5;
const END_PAGE = 431;
const DELAY_MS = 200;

// Arabic-Indic numerals to standard numbers
const ARABIC_NUMS = {
  '٠': 0, '١': 1, '٢': 2, '٣': 3, '٤': 4,
  '٥': 5, '٦': 6, '٧': 7, '٨': 8, '٩': 9,
};

function arabicToNumber(str) {
  let result = 0;
  for (const ch of str) {
    if (ARABIC_NUMS[ch] !== undefined) {
      result = result * 10 + ARABIC_NUMS[ch];
    }
  }
  return result;
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(num))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&lrm;/g, '')
    .replace(/&rlm;/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, '');
}

function parsePage(html, pageNum) {
  const entries = [];

  // Extract chapter title (surah name)
  const chapterMatch = html.match(/data-chapter-title="([^"]+)"/);
  if (!chapterMatch) return entries;

  const chapterTitle = decodeHtmlEntities(chapterMatch[1]);
  // Format: "2 - سورة البقرة" or "78 - سورة النبأ"
  const chapterParts = chapterTitle.split(' - ');
  const surahNumber = parseInt(chapterParts[0]) || 0;
  const surahName = chapterParts.slice(1).join(' - ').trim();

  // Decode the full HTML first
  const decoded = decodeHtmlEntities(html);

  // Split by <br /> (with optional \r before it)
  const lines = decoded.split(/<br\s*\/?>\r?\n?\s*/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Extract word from <span class="book-ayah...">WORD</span>
    const wordMatch = trimmed.match(/<span[^>]*class="book-ayah[^"]*"[^>]*>([^<]+)<\/span>/);
    if (!wordMatch) continue;

    const word = decodeHtmlEntities(wordMatch[1].trim());

    // Extract verse number: (١) or (٢٥) or (١٢٠)
    const verseMatch = trimmed.match(/\(([٠-٩]+)\)/);
    const verse = verseMatch ? arabicToNumber(verseMatch[1]) : 0;

    // Extract meaning: text after the span and "... "
    const afterSpan = trimmed.split(/<\/span>/)[1] || '';
    const meaningClean = stripTags(afterSpan)
      .replace(/^\s*\.\.\.?\s*/, '')
      .replace(/—\s*\d+\s*—/g, '')
      .trim();

    if (word && meaningClean) {
      entries.push({
        surah: surahName,
        surahNumber,
        verse,
        word,
        meaning: meaningClean,
      });
    }
  }

  return entries;
}

async function fetchPage(pageNum) {
  const url = `${BASE_URL}/1/${pageNum}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for page ${pageNum}`);
  const data = await res.json();
  return data.content || '';
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log(`Scraping pages ${START_PAGE}-${END_PAGE}...`);

  const allEntries = [];
  let failedPages = [];

  for (let page = START_PAGE; page <= END_PAGE; page++) {
    try {
      const html = await fetchPage(page);
      const entries = parsePage(html, page);
      allEntries.push(...entries);

      if (page % 50 === 0) {
        console.log(`  Page ${page}/${END_PAGE} — ${allEntries.length} entries so far`);
      }
    } catch (err) {
      console.error(`  Failed page ${page}: ${err.message}`);
      failedPages.push(page);
    }

    if (page < END_PAGE) await sleep(DELAY_MS);
  }

  // Add IDs
  const result = allEntries.map((entry, i) => ({
    id: i + 1,
    ...entry,
  }));

  // Write output
  writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2), 'utf-8');

  console.log(`\nDone!`);
  console.log(`  Total entries: ${result.length}`);
  console.log(`  Failed pages: ${failedPages.length > 0 ? failedPages.join(', ') : 'none'}`);
  console.log(`  Output: ${OUTPUT_PATH}`);

  // Stats by surah
  const bySurah = {};
  for (const e of result) {
    bySurah[e.surah] = (bySurah[e.surah] || 0) + 1;
  }
  console.log(`\n  Entries by surah:`);
  for (const [surah, count] of Object.entries(bySurah)) {
    console.log(`    ${surah}: ${count}`);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
