<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/images/logo-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="public/images/logo-light.png" />
    <img alt="Leetcode Patterns" src="public/images/logo-light.png" width="500" />
  </picture>
</p>

<p align="center">
  <a href="https://github.com/seanprashad/leetcode-patterns/actions/workflows/deploy.yml"><img src="https://github.com/seanprashad/leetcode-patterns/actions/workflows/deploy.yml/badge.svg" alt="Deploy to GitHub Pages" /></a>
  <a href="https://github.com/seanprashad/leetcode-patterns/actions/workflows/update-questions.yml"><img src="https://github.com/seanprashad/leetcode-patterns/actions/workflows/update-questions.yml/badge.svg" alt="Update Questions" /></a>
</p>

## Table of Contents

- [Background](#background)
- [Fork & Attribution](#fork--attribution)
- [Fundamentals](#fundamentals)
- [Notes](#notes)
- [Question List](#question-list)
- [Google Drive Progress Sync](#google-drive-progress-sync)
- [Solutions](#solutions)
- [Contributing](#contributing)
- [Suggestions](#suggestions)
- [Acknowledgements](#acknowledgements)

## Background

This repo is intended for any individual wanting to improve their problem
solving skills for software engineering interviews.

Problems are grouped under their respective subtopic, in order to focus on
repeatedly applying common patterns rather than randomly tackling questions.

All questions are available on [leetcode.com] with some requiring [leetcode premium].

## Fork & Attribution

This repository is a fork/adaptation of [Sean Prashad's Leetcode Patterns][original-repo].
The original project and question list are credited to Sean Prashad.

This fork is maintained by [Justin Mathew][justin] at [mathewjustin/leetcode-patterns][this-fork]
and includes modifications such as a local pattern study UI, debug drills, offline/local-first
progress support, and integration with Justin's blog at [justinmathew.com/leetcode-patterns][blog-app].

The original work is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License][cc-by-nc].
This fork preserves that attribution and indicates that changes have been made. This project is
intended for non-commercial interview preparation and study use.

## Fundamentals

To find the greatest amount of success when practicing, it is highly recommended
to know the methods and runtimes of the following data structures and their
operations:

- Arrays
- Maps
- Linked Lists
- Queues
- Heaps
- Stacks
- Trees
- Graphs

In addition, you should have a good grasp on common algorithms such as:

- Breadth-first search
- Depth-first search
- Binary search
- Recursion

## Notes

[This pdf] contains information for the main data structures in Java.

Other useful methods to know include [`substring()`](https://docs.oracle.com/javase/8/docs/api/java/lang/String.html#substring-int-int-), [`toCharArray()`](https://docs.oracle.com/javase/8/docs/api/java/lang/String.html#toCharArray--), [`Math.max()`](https://docs.oracle.com/javase/8/docs/api/java/lang/Math.html#max-int-int-),
[`Math.min()`](https://docs.oracle.com/javase/8/docs/api/java/lang/Math.html#min-int-int-), and [`Arrays.fill()`](https://docs.oracle.com/javase/8/docs/api/java/util/Arrays.html#fill-int:A-int-).

## Question List

The original question list can be found here:
https://seanprashad.com/leetcode-patterns/.

This fork is published here:
https://justinmathew.com/leetcode-patterns/.

## Google Drive Progress Sync

Study progress is local-first. Completed questions, stars, notes, solved dates,
and reminders are stored in `localStorage` and can optionally sync to a user's
Google Drive.

The sync layer uses the Google Drive `appDataFolder` scope, which creates a hidden
JSON file named `justin-leetcode-patterns-store.v1.json` that only this app can
read or write. The document is versioned and organized by namespace:

```json
{
  "version": 1,
  "app": {
    "id": "leetcode-patterns",
    "name": "LeetCode Patterns",
    "updated_at": "2026-06-02T00:00:00.000Z"
  },
  "namespaces": {
    "progress": {
      "version": 1,
      "updated_at": "2026-06-02T00:00:00.000Z",
      "data": {
        "completed": [],
        "starred": [],
        "notes": {},
        "solved_dates": {},
        "reminders": {}
      }
    },
    "personal_tips": {
      "version": 1,
      "updated_at": "2026-06-09T00:00:00.000Z",
      "data": {
        "items": [],
        "updated_at": "2026-06-09T00:00:00.000Z"
      }
    }
  }
}
```

Built-in programming tips remain part of the app and are read-only. Tips created
by the user are stored under `personal_tips`, where they can sync privately
across browsers. New data types should be added as new namespaces, for example
`debug_drills`, `interview_sessions`, `settings`, or `spaced_repetition`,
instead of mixing them into the `progress` payload.

To enable sync, create a Google OAuth web client and set
`NEXT_PUBLIC_GOOGLE_CLIENT_ID` for the deployment. The mounted blog build also
needs this value because it rebuilds this app before publishing
`/leetcode-patterns/`.

## Solutions

Solutions written in Java can be found in the [solutions] branch.

## Contributing

The app is built with [Next.js] (App Router), [React] 19, [TypeScript], [Tailwind CSS] v4, [TanStack Table] v8, [Lucide React] for icons, and Google Analytics via `@next/third-parties`. Tests use [Vitest] + [React Testing Library].

```bash
npm install
npm run dev         # app: http://localhost:3000, Excalidraw: http://localhost:8080
npm test            # single run
npm run test:watch  # watch mode
```

A local Excalidraw container starts automatically with `npm run dev`. It uses
Docker's `unless-stopped` restart policy, so it also returns when Docker starts
after a reboot. Use `npm run excalidraw:stop` to stop it explicitly and
`npm run excalidraw:start` to start it again.

A [Husky] `pre-push` hook runs `npm test` automatically before every push. This is set up for every clone via the `prepare` script.

## Acknowledgements

Original project: [Sean Prashad's Leetcode Patterns][original-repo].

This list is heavily inspired from [Grokking the Coding Interview] with
additional problems extracted from the [Blind 75 list] and this hackernoon article
on [14 patterns to ace any coding interview question].

[leetcode.com]: https://leetcode.com
[leetcode premium]: https://leetcode.com/subscribe/
[next.js]: https://nextjs.org
[react]: https://react.dev
[typescript]: https://www.typescriptlang.org
[tailwind css]: https://tailwindcss.com
[tanstack table]: https://tanstack.com/table
[lucide react]: https://lucide.dev
[vitest]: https://vitest.dev
[react testing library]: https://testing-library.com/docs/react-testing-library/intro
[husky]: https://typicode.github.io/husky
[this pdf]: https://drive.google.com/open?id=1ao4ZA28zzBttDkuS6MLQI52gDs_CJZEm
[solutions]: https://github.com/SeanPrashad/leetcode-patterns/tree/solutions
[original-repo]: https://github.com/SeanPrashad/leetcode-patterns
[this-fork]: https://github.com/mathewjustin/leetcode-patterns
[justin]: https://github.com/mathewjustin
[blog-app]: https://justinmathew.com/leetcode-patterns/
[cc-by-nc]: https://creativecommons.org/licenses/by-nc/4.0/
[grokking the coding interview]: https://www.educative.io/courses/grokking-the-coding-interview
[issue]: https://github.com/SeanPrashad/leetcode-patterns/issues/new
[blind 75 list]: https://www.teamblind.com/article/New-Year-Gift---Curated-List-of-Top-100-LeetCode-Questions-to-Save-Your-Time-OaM1orEU?utm_source=share&utm_medium=ios_app
[14 patterns to ace any coding interview question]: https://hackernoon.com/14-patterns-to-ace-any-coding-interview-question-c5bb3357f6ed
