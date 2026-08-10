/* Template for public/staff-feedback/source.js — copy this file to source.js
   and paste the real link in.

   source.js is gitignored on purpose: this repository is public, and a
   published-CSV link is readable by anyone who has it, so committing it would
   publish every survey response. Firebase Hosting still deploys source.js
   (only dotfiles and node_modules are skipped), so the live dashboard works.

   To get the link:
     1. Open the form -> the "คำตอบ (Responses)" tab -> the Google Sheets icon.
     2. In the sheet: ไฟล์ -> แชร์ -> เผยแพร่ไปยังเว็บ.
     3. Pick the response sheet, choose ค่าที่คั่นด้วยจุลภาค (.csv), publish.
     4. Paste the resulting link below.

   Anyone re-cloning this repo must recreate source.js before deploying. */

window.SS45_FEEDBACK_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-XXXXXXXX/pub?gid=0&single=true&output=csv';
