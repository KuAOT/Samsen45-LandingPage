# Staff feedback dashboard — locked source + expert analytics

Date: 2026-08-10
Status: approved
Touches: `public/staff-feedback/index.html`, `public/staff-feedback/source.js` (new, gitignored), `.gitignore`

## Why

The dashboard shipped on 2026-08-10 (`5c96715`) asks each staff member to paste the
published-CSV link once and keeps it in `localStorage`. Two problems:

1. Every staff member has to do the setup, and any of them can silently repoint the
   page at a different sheet. There is no single source of truth.
2. The page reports the survey but does not interpret it. It shows *what* people
   answered, never *what to do about it* — which is the only reason the committee
   opens it.

## Part 1 — Lock the source

The CSV URL moves to `public/staff-feedback/source.js`:

```js
window.SS45_FEEDBACK_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv';
```

- The file is listed in `.gitignore`, so the link never reaches the public GitHub repo.
- Firebase Hosting deploys everything under `public/` except dotfiles, so the deployed
  site still gets it. The page works with zero setup and offers no way to change the source.
- Removed from the page: the whole `.setup` section, the `เปลี่ยนแหล่งข้อมูล` button,
  the `ล้างลิงก์…` footer button, `normaliseUrl()`, and the `localStorage` read/write.
- If `source.js` is missing or the fetch fails, the page shows a short staff-facing error
  explaining that `source.js` must be recreated before deploy — no input box.

**Accepted risk (unchanged from before):** the page is unlisted, not protected, and the
published CSV is readable by anyone holding its URL. Moving the URL into a deployed file
means anyone who reaches `/staff-feedback/` can now read that URL too. Real protection
needs Firebase Auth plus a rule; not in scope here.

**Re-clone note:** a fresh clone cannot deploy a working dashboard until someone recreates
`source.js`. That is the intended trade.

## Part 2 — Analytics

Reference data, taken from the live form (`1FAIpQLSc3I1fmGQsAO_ZkXSGHjq-ecnTXi4vvLiszQrE8T9njF6dpug`):
Q1 linear 1–5 · Q2 checkbox ×8 · Q3 grid, 6 rows scored `n (label)` out of 4 ·
Q4–Q7 single choice · Q8 free text. Denominator for reach is **250 attendees**.

Every card carries an `อ่านยังไง` line: what the number means and what decision it feeds.

### A. Executive readout (new, top)
Auto-written Thai summary: headline average, top-box share, response rate, then three
strengths and three fixes drawn from the Q3 means, each stated with its supporting number.
Fixes are ordered by priority score (see C), not by raw score alone.

### B. Response health (new)
- **Response rate** = n / 250. Shown against the 15–30% band typical of post-event surveys.
- **Margin of error** on the Q1 mean: `1.96 · s / √n · √((N−n)/(N−1))`, N = 250. The finite
  population correction matters here — sampling 60 of 250 is far tighter than 60 of infinity.
- **Responses per day** since the form opened, as a small bar row. Timestamps are parsed
  defensively: `d/m/y` with a Buddhist-era year (>2400) converted by subtracting 543.
- **Verdict**: no responses in 48h → `ตัวเลขนิ่งแล้ว`; otherwise `ยังไหลเข้าอยู่` with a
  nudge that a reminder post is still worth it.

### C. Priority matrix (new)
For each of the 6 Q3 areas, Pearson r between that area's score and the Q1 overall score
across respondents who answered both. Plotted as an SVG scatter: impact (r) on Y,
performance (mean/4) on X, split at the median r and the mean performance into
`แก้ก่อน` / `รักษาไว้` / `ไว้ทีหลัง` / `ดีเกินจำเป็น`.

This is importance–performance analysis. It separates "food scored 3.2" from "food scored
3.2 *and* it is what decides whether people liked the night" — the second is a budget
decision, the first is a footnote.

Guard: needs ≥30 complete pairs. Below that the card replaces the scatter with a notice and
the mean-only ranking, because r on 20 points is noise.

### D. Divisiveness — folded into the existing Q3 card
The existing card shows only the mean per area. It gains, per row, the 1/2/3/4 distribution
as a stacked bar and the standard deviation. A 3.5 everyone agrees on is a different problem
from a 3.5 split between 2s and 5s; SD ≥ 0.9 on a 1–4 scale is flagged `ความเห็นแตก`.

Three cards about the same six rows would be redundant, so D merges into the existing card
rather than adding a new one.

### E. Promoter vs detractor gap (new)
Split respondents by Q1: 4–5 promoters, 1–3 detractors. Report each Q3 area's mean for both
groups and the gap, sorted by gap. The widest gap is what separates a great night from an
adequate one — the highest-leverage thing to fix.

Guard: needs ≥8 in each group, else a notice.

### F. Comment intelligence (new)
Q8 free text bucketed by Thai keyword match into: อาหาร & เครื่องดื่ม · สถานที่ & เดินทาง ·
เสียง ดนตรี & เวที · ลงทะเบียน & คิว · ราคา & ความคุ้มค่า · ของชำร่วย & เสื้อ ·
เวลา & กำหนดการ · เพื่อนและบรรยากาศ · ทีมงาน. A comment can land in several buckets.

Each theme also reports the mean Q1 of the people who raised it. Below the overall mean =
raising it correlates with dissatisfaction; that is the pain point, and it is invisible in a
plain word count.

A separate card pins the comments from respondents scoring Q1 ≤ 3, ahead of the full list —
highest signal per line, and the ones most likely to be skimmed past otherwise.

### G. Next-event decisions — folded into the Q4–Q7 cards
Each of the four cards gains a recommendation line built from the real options:

- **Q4 cadence** → the winning interval, plus the share wanting a reunion within 2 years as
  a demand-strength read. `แล้วแต่คณะกรรมการ` is excluded from the cadence share and
  reported separately, since it expresses no preference.
- **Q5 location** → near-school / BTS-MRT / bigger-outer as a venue-search brief.
- **Q6 pricing** → premium 1,300–1,500 vs budget 800–1,000 vs tiered, read as the ticket
  structure to open with.
- **Q7 capacity** → how to handle the friends who missed out.

Each line states whether the result is a **mandate** (top option ≥50%, or leading by ≥15
points) or **split** (leading by <10 points → decide in committee, the survey will not settle it).

### Statistical honesty
Applied throughout, because a confident number off 12 replies does more damage than no number:
- n < 30 → correlations suppressed.
- any subgroup < 8 → that comparison suppressed.
- n < 20 → percentages shown with raw counts alongside.

## Layout order

KPIs (+ response rate) → A → B → Q1 distribution → C → Q3 with distribution and SD (D) →
E → Q2 → Q4–Q7 with recommendations (G) → F themes → detractor comments → all comments.

All new cards are print-safe: they inherit `break-inside: avoid` and the scatter is inline SVG.

## Testing

No test runner in this repo. Verification is a synthetic `responses.csv` built with the exact
column headers the live form produces, served locally, checked card by card — including a
truncated copy that trips every small-sample guard.
