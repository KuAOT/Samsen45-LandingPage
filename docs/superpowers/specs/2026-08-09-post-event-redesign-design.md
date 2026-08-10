# Samsen 45 — Post-Event Redesign

**Date:** 2026-08-09 · **Status:** approved

## Context

The reunion ran on Saturday 8 August 2026 at Best Western Chatuchak and was a
success — 250 seats sold out, ~1,200 photos captured. The landing page still sells
tickets to a future event. Every tense on the page is wrong.

## Goal

Turn the site into the event's memory home: the place alumni go to see the photos,
leave feedback, and stay connected until the next reunion.

## Framing

The theme was *Collect the Dots*. Pre-event that was a promise — "ทุกจุดจะกลับมาเชื่อมกัน".
Post-event it is a payoff: **the dots got connected, and here is the proof.**
Every section serves that line.

## Verified facts (no invented numbers)

| Fact | Source |
|---|---|
| 250 seats, sold out | existing page copy |
| 932 photos, `[Official] รูปจากทีมงาน` | Drive folder `1IHzvyv3kAkp-wQPk14aRvKsfbWr1lja-` |
| 213 photobooth shots, `fotoshare` | subfolder `1amASpMRbDCuN3ePHeEjuCl9ydsscuYX2` |
| 63 images and growing, `[Community] รูปจากเพื่อนๆ` | Drive folder `1Y4AoabbdOMt3WMtiKc88Utb1kY4T9Ldm` |
| **1,208 photos** as of 2026-08-10, rising | sum of the above |
| `fotoshare/covers` (126 files) excluded | cover frames of the clips — same timestamps, not new photos |
| Photobooth ran 17:31 → 20:00 | filename timestamps in `fotoshare` |

## External links

- Face search: https://www.pixid.app/g/APZX9
- Photos (team): https://drive.google.com/drive/folders/1IHzvyv3kAkp-wQPk14aRvKsfbWr1lja-
- Photos (friends): https://drive.google.com/drive/folders/1Y4AoabbdOMt3WMtiKc88Utb1kY4T9Ldm
- Evaluation form: https://forms.gle/bqeEbEQCnCTLVfBS6
- Facebook group: https://www.facebook.com/groups/samsen45

## Structure

Single page, Thai, retaining the pink/green + Anuphan + constellation design system so
it reads as the same event rather than a new site.

1. **Hero** — "ขอบคุณที่กลับมาเชื่อมจุดกัน" over a mosaic of real photos from the night.
   Countdown becomes a **count-up** ("ผ่านมาแล้ว N วัน"). CTAs: `ดูรูปทั้งหมด` (primary),
   `ทำแบบประเมิน` (secondary).
2. **Recap** — "คืนนั้นเป็นอย่างไร": stat row + a short timeline of the evening.
3. **Gallery** ★ — ~72 curated photos, mosaic grid, lightbox with keyboard + swipe.
4. **Photobooth** — horizontal strip of `fotoshare` shots (one shared backdrop, tiles well).
5. **Drive** — two folder cards + "อยากเพิ่มรูปของคุณ?".
6. **Survey** — full-width band, single strong CTA to the Google Form.
7. **Facebook** — "จุดยังเชื่อมกันอยู่", keeping the group alive between reunions.
8. **Yearbooks** — the two existing flip-books.
9. **FAQ** — rewritten for post-event questions.
10. **Footer** — includes one gratitude line to sponsors and the organising team.

### Removed

Ticket and register CTAs, sold-out notices, dress code, merch pre-order, prize showcase,
sponsor packages, all `register.samsen45.com` links.

## Technical

- `styles.css` + `styles2.css` remain the design system; new sections live in `styles3.css`.
- `app.js` keeps constellation / nav / spine / reveal; countdown becomes count-up;
  gains gallery + lightbox.
- Photos are downloaded, resized and converted to WebP locally under
  `public/assets/gallery/` — the page must not depend on Google's thumbnail URLs
  remaining available. Two sizes: 640px thumb, 1600px full.
- Curation: ~150 candidates sampled evenly across the (chronological) folders, rendered
  as contact sheets, picked by eye.

## Non-goals

- No backend, no build step. Vanilla HTML/CSS/JS on Firebase Hosting, as today.
- No photo upload feature — community submissions continue via the Drive folder.

## Counting caveat

The community folder is open for uploads, so any exact total goes stale.
The page says "กว่า 1,200 ภาพ" rather than a fixed figure. Do not reintroduce a precise
number unless uploads are closed. `fotoshare/covers` duplicates the boomerangs and must
never be added to the count.
