# Payments Queue

An internal back-office screen. Operations staff work through a queue of outbound payments:
they scan the list, filter it down, and open individual payments to see what happened to them.

Right now the app routes and fetches, and nothing else. **The two screens are empty.**

## Quick start

```bash
npm install
npm start          # → http://localhost:5173
```

Everything runs offline after `npm install`. There's no backend to start, no `.env`, and no
services to connect — the API is mocked in-process over a local JSON file.

```bash
npm run verify     # typecheck + tests — 7 tests, all green on a fresh clone
npm test           # tests only (npm run test:watch to keep them running)
```

Node 20 or newer (`.nvmrc` pins v24.12.0 if you use nvm).

## What's here

```
src/
  App.tsx                 router + React Query provider; both routes already registered
  types/payment.ts        Payment, PaymentStatus, PaymentMethod — read this first
  api/paymentsApi.ts      listPayments() and getPayment(), over realistic latency
  api/paymentsApi.test.ts what the API does, in test form
  data/payments.json      842 payments
  pages/
    PaymentsListPage.tsx    ← empty. /payments
    PaymentDetailPage.tsx   ← empty. /payments/:paymentId
  styles.css              plain but finished — see "You should not need to write CSS"
```

### The API

```ts
listPayments(params?: ListPaymentsParams): Promise<PaymentsPage>
getPayment(paymentId: string): Promise<Payment>   // rejects with PaymentNotFoundError
```

`listPayments` can filter, sort and paginate for you — **and** returns the whole set when you
call it with no arguments. Both are legitimate. Which one you lean on is a decision, not a
detail, and we'd like to hear why you made it the way you did.

Latency is randomised between roughly 120ms and 900ms, the way a real network is.

## Your task

Build the two screens.

### 1. The queue — `/payments`

A table of payments that an ops person can actually work in.

| | |
|---|---|
| **Columns** | At minimum: reference, counterparty, amount, status, created. Add or drop what you think earns its place. |
| **Amount** | `amountMinor` is in the currency's **minor units**. The dataset is multi-currency and **not every currency has two decimal places** — whatever you render has to be right for all five. |
| **Sorting** | At least one sortable column. |
| **Filtering** | Free-text search, and a filter by status. |
| **Opening a row** | Clicking a payment opens its detail screen. |
| **Loading, empty and error** | All three happen. Make them look deliberate. |

### 2. The detail — `/payments/:paymentId`

Everything known about one payment, and a way back to the queue.

The part worth your attention is `method`. A payment moves over one of four rails — ACH, wire,
SEPA, stablecoin — and **they share no fields beyond `kind`**. An ACH payment has a routing
number and an SEC code; a stablecoin payment has a network, a transaction hash and a confirmation
count. Rendering that well is most of this screen.

Assume a fifth rail is coming.

## How this is assessed

**You are not expected to finish.** The scope is deliberately larger than 45 minutes allows.

This session is about **React and TypeScript** — how you model the data in types, and how you get
the rendering and the asynchrony right. Working code that handles the awkward cases beats more
code that doesn't. If you're deciding between adding another feature and making what's on screen
correct, make it correct.

A few things that help us read what you're doing:

- **Talk through your approach before you start typing**, and keep narrating as you go.
- **Tell us what you'd do differently with more time**, and what you're deliberately not doing.
- **Tell us why *not*.** If you considered an approach and rejected it, that reasoning is worth
  as much to us as the code you did write. Same for anything you think is over-engineering.

Expect us to interrupt with questions and suggestions. That's the interview, not an interruption
of it — changing your mind mid-exercise because of something we said is a good outcome, not a bad
one.

Three questions worth having an answer to:

1. A fifth payment rail is coming. What has to change, and what *tells* you where to change it?
2. An ops person filters the queue down to `FAILED`, opens a payment, and hits the browser back
   button. What happens?
3. Someone types quickly in the search box. The response for `nor` takes 800ms and the response
   for `nordwind` takes 150ms. What ends up on screen?

## You should not need to write CSS

`styles.css` is already finished to a level nobody will judge you on, and **styling is not part
of the assessment**. These classes are wired up and waiting:

| Class | For |
|---|---|
| `.toolbar`, `.spacer` | the search / filter row above the table |
| `.tableCard` | the bordered surface a `<table>` sits in |
| `.numeric` | right-aligned, tabular figures — amounts and counts |
| `.cellLink` | a link inside a `<td>` that fills the whole cell |
| `.badge` + `.positive` / `.warning` / `.negative` / `.neutral` | status pills |
| `.state`, `.state.error` | centred loading / empty / error blocks |
| `.panel`, `.fields` (`<dl>`), `.amount`, `.backLink` | the detail screen |
| `.pagination` | a pager strip under the table |

Bare `<table>`, `<input>`, `<select>` and `<button>` are styled already. A `<button>` inside a
`<th>` is styled as a sort header, and `<th aria-sort="ascending">` renders as the active one.

If you'd rather write your own, go ahead — just don't spend the clock on it.

## Ground rules

- You may add, move, rename or delete anything in `src/`, including the tests.
- The dependency set is fixed — `npm install` has to work offline on the day, so please work
  with what's installed: React 19, React Router, React Query, TypeScript, Vitest + RTL.
- Use whatever editor and docs you like. Please don't use an AI coding assistant for this one —
  we want to see how you think, and you'll be reviewing a lot of AI-written code in this role.

## Notes on the Implementation
App component were created with accessibility and maintainability in mind. Tested keyboard navigation and screen reader support, using NVDA reader for verification and adding appropriate ARIA attributes where necessary.

Added a prefixed code for comments explaining the purpose and behavior of different features.
- `//?` to indicate explanatory architectural notes rather than regular comments.
- `//` for regular comments in the code.
- `//!` for important notes or warnings in the code.
- `//TODO` for marking improvements in the code.

Other enhancements that can be made include:
- Sorting by other columns besides counterparty
- Formatting the Created date column to a more human-readable format, we can use the Date object and its methods or a library like date-fns or moment.js.
- Adding pagination controls to improve navigation through large sets of payments.
- Implementing debounce for the search input to reduce the number of API calls and improve performance.
- Adding client-side caching to avoid refetching data that has already been retrieved, which can be achieved using libraries like React Query or by implementing a custom caching mechanism.
- Enhancing error handling to provide better feedback to the user in case of network or server errors.
- Leverage useId() built-in hook that generates unique, consistent IDs for components.
It’s particularly useful for things like:
  - Linking <label>s to <input>s
  - ARIA attributes for accessibility
  - Avoiding duplicate IDs in dynamic UI structures
- The table component was implemented from scratch, ensuring full control over its structure, styling, and behavior, while maintaining accessibility and responsiveness. Another good alternative would be to use a pre-built table component from a UI library, or stand-alone table like TanStack Table (formerly React Table).