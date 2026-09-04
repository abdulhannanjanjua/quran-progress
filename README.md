# Quran Progress

A small lesson notebook for Affan and Mashal, and the Quran itself, in one web page.

Nothing is installed and there is no login. The teacher opens a link, picks a child, records the lesson, and closes the browser.

---

## 1. What is in this folder

```
quran-progress/
├── index.html      the page itself and the two pop-up forms
├── style.css       all the styling
├── app.js          all the logic, in plain JavaScript
├── quran-data.js   the 114 surah names, ayah counts and juz start points
├── quran/          851 page images, one per page of the Quran
├── .nojekyll       an empty file that tells GitHub to serve the folder as-is
└── README.md       this file
```

Total size is about 68 MB, almost all of it the Quran pages.

---

## 2. Publishing it to GitHub Pages

The Quran folder holds 851 files, which is more than the github.com website will let you drag and drop in one go. GitHub Desktop handles it in one click, so use that.

**Step 1.** Install GitHub Desktop from https://desktop.github.com and sign in with your GitHub account.

**Step 2.** In GitHub Desktop choose **File → Add local repository**, browse to this `quran-progress` folder, and select it.

**Step 3.** It will say the folder is not a Git repository and offer to **create a repository** here. Click that, then click **Create repository**.

**Step 4.** Click **Publish repository** at the top.

* Name: `quran-progress`
* **Untick "Keep this code private".** GitHub Pages only works on free accounts for public repositories. If it stays private the link will not work.

Click **Publish repository**. Uploading 68 MB takes a few minutes.

**Step 5.** Go to https://github.com and open your new `quran-progress` repository.

**Step 6.** Click **Settings** (top right of the repository, not your account settings).

**Step 7.** In the left sidebar click **Pages**.

**Step 8.** Under **Build and deployment → Source**, choose **Deploy from a branch**. Under **Branch** choose **main** and **/ (root)**. Click **Save**.

**Step 9.** Wait one to two minutes, then refresh the page. GitHub will show a green box with your link:

```
https://YOUR-USERNAME.github.io/quran-progress/
```

**Step 10.** Open that link yourself to check it works, then send it to the teacher. She can add it to her phone's home screen if she wants it to feel like an app.

### Changing something later

Edit the file on your computer, open GitHub Desktop, type a short note in the summary box, click **Commit to main**, then click **Push origin**. The live site updates within a minute or so.

---

## 3. Where the Quran comes from

The source is your file `13 line quran with beautiful color coded tajweed rules pdf.pdf`: 851 scanned pages, 84 MB.

Serving that PDF directly would mean the teacher's phone downloading 84 MB before it could show a single page, and nothing can be drawn on top of a PDF that the browser renders itself, so highlighting would have been impossible.

Instead each page was extracted as its own image in `quran/`, named after its page number:

* `quran/004.webp` is page 4, which is Surah Al-Fatihah
* `quran/430.webp` is page 430, which is in Surah Maryam

The page numbers printed in the Quran match these file names exactly, so "page 430" in a lesson record and page 430 in the app are the same page.

The images are the **original pictures taken straight out of the PDF**, not re-rendered or re-coloured. This matters because the tajweed colour coding carries meaning, and re-compressing the pages was shifting some reds towards orange. Each page is about 80 KB, so the teacher's phone only ever downloads the pages she actually opens.

The original PDF is not in this folder. Keep it wherever you like as the master copy. There is also a repaired copy beside it called `quran-repaired.pdf`: the original had a damaged cross-reference table, and that copy is structurally clean and opens faster.

---

## 4. How the data works

Everything the teacher types is stored in her own browser, under a single key called `quranProgress`. It is never sent anywhere. There is no server, no database and no account.

The important consequence: **the teacher's phone and your computer keep separate copies.** Adding a lesson on her phone does not make it appear on yours. Nothing synchronises by itself.

To move data between devices, go to **Settings**:

* **Export Backup** downloads a file such as `quran-progress-backup-2026-09-05.json` containing both children, every lesson, the current positions, the settings and the highlights.
* **Import Backup** on the other device reads that file back. It asks for confirmation first, because importing replaces whatever is already there.
* **Export CSV** gives you the lesson history as a spreadsheet, which is handy for a quick look at how the term went.

`Reset All Data` at the bottom of Settings wipes this device. It asks twice.

The stored shape is deliberately plain:

```js
{
  version: 1,
  students: {
    affan:  { name, currentPosition: { juz, surah, ayah, page }, lessons: [ ... ] },
    mashal: { name, currentPosition: { juz, surah, ayah, page }, lessons: [ ... ] }
  },
  settings:   { lastQuranPage: 430 },
  highlights: { "430": [ { x, y, w, h } ] }
}
```

Each lesson is:

```js
{ id, date, surah, fromAyah, toAyah, page, mark, category, comment, revisionRequired }
```

`surah` is the number, 1 to 114, not the name. The name is looked up from `quran-data.js` when it is shown, so nothing breaks if a spelling is ever corrected.

---

## 5. How the code is laid out

`app.js` reads top to bottom in six labelled sections:

1. **Data** loading, saving, and what a fresh install looks like
2. **Small helpers** date formatting, sorting lessons, working out the progress bar
3. **Views** one function per screen: home, student, Quran, settings
4. **Dialogs** the update-position and add-lesson forms
5. **Backup** export, import, CSV, reset
6. **Router** turns `#/student/affan` in the address bar into the right screen

There is no build step and no framework. If you change a line and refresh the browser, you see the change.

A few things worth knowing if you come back to this in a year:

* The juz number is worked out from the surah and ayah using `JUZ_STARTS` in `quran-data.js`, so the teacher does not have to know it. She can still override it.
* Choosing a mark suggests a category and ticks "revision required" below 7 out of 10. She can change either.
* "Update current position to this lesson" is ticked by default when adding a lesson and unticked when editing one, since editing an old lesson should not drag the child's position backwards.
* Highlights are stored as four fractions of the page rather than pixels, which is why they land in the right place on a phone and a desktop and at every zoom level.

---

## 6. Known limits, stated plainly

* **No synchronisation.** Two devices means two separate sets of records. Export and import is the only bridge. This was a deliberate choice to avoid a server, accounts and passwords.
* **Private browsing.** If the teacher uses a private or incognito window, the browser throws the data away when she closes it. A normal window is needed.
* **Clearing browsing data** will delete the records too. Export a backup now and then.
* **Offline.** Once the page has loaded, adding and editing lessons works with no connection at all. Loading the page for the very first time needs a connection, and reopening it later usually works from the browser's cache but is not guaranteed. A service worker could make offline loading reliable; it was left out because it adds a caching layer that tends to serve stale versions and is awkward to debug.
* **Quran page quality.** The scans in the PDF are 720 pixels wide. Zooming past about 150 per cent will look soft, because there is no more detail in the original file. Nothing in the app can improve that; only a higher resolution scan would.
* **Highlights are per device**, like everything else, and are included in the backup file.
