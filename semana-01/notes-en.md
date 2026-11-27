# Week 01 — Technical English Notes (Modern JS, ES Modules & Git)

## Day 1 — Arrow Functions & Core Technical Verbs (`utils.js`)

**MDN Key Takeaway:** Arrow function expressions provide a compact alternative to traditional function expressions, but they have semantic limitations—most importantly, they do not bind their own `this` value.

| Verb | Meaning in Programming | Example from `utils.js` |
|---|---|---|
| **return** | Produce a value from a function | `calculateIVA` returns an object containing `subtotal`, `iva`, and `total` as numbers. |
| **pass** | Send an argument into a function | We pass a numeric amount and an optional currency symbol to `formatUSD`. |
| **evaluate** | Compute or resolve an expression | JavaScript evaluates the default parameter `rate = 0.15` only when the argument is `undefined`. |
| **invoke** | Call or execute a function | `buildOrderSummary` invokes `normalizeText`, `calculateIVA`, and `formatUSD` to avoid duplicating logic. |
| **bind** | Attach a specific context (such as `this`) | Arrow functions do not bind their own `this`; they inherit it from the surrounding lexical scope. |

---

## Day 2 — JSDoc & Immutable Transformations (`catalog.js`)

**JSDoc Conventions:**
* Start every description with a third-person singular verb (*Filters*, *Calculates*, *Transforms*, *Combines*, *Rounds*).
* Use leading asterisks (`*`) on every line inside the comment block—never hyphens (`-`)—so VS Code parses `@param` and `@returns` types properly.
* Wrap optional parameters with default values in square brackets, such as `@param {string} [category=""]`.

**Core Takeaway (Immutability in `.map()`):**
* `applyDiscount` creates a new object with spread syntax (`{ ...product, ... }`) instead of updating `product.price` directly. Mutating properties inside `.map()` modifies the original `products` array in memory and introduces hidden bugs in other parts of the app.

---

## Day 3 — `Array.prototype.reduce()` & Search Methods (`analytics.js`)

**MDN Key Takeaway:** Always provide an `initialValue` as the second argument to `.reduce()`. Calling `.reduce()` on an empty array without an `initialValue` throws a `TypeError`.

| Term | Technical Meaning | Example from `analytics.js` |
|---|---|---|
| **accumulator** | Value carried across iterations of `reduce` | In `groupProductsByCategory`, the accumulator stores an object grouped by category name. |
| **currentValue** | Current element being processed | In `calculateCartTotal`, `currentValue` represents each cart line (`productId` and `quantity`). |
| **short-circuit** | Stop iterating once the result is determined | `find`, `some`, and `every` short-circuit as soon as a matching or failing element is found. |
| **fallback value** | Safe default returned when data is missing | `findProductById` returns `null` as an explicit fallback value when no product matches the ID. |

**How `.reduce()` Works (3-Sentence Summary):**
1. Before the loop starts, the `accumulator` is set to the `initialValue` (such as `0` or `{}`) and stores the running result across every step.
2. On each iteration, the callback receives the `currentValue` from the array and combines it with the `accumulator`.
3. After processing the last element, `.reduce()` returns the final accumulated value without mutating the original array.

---

## Day 4 — Mutable vs Immutable Data (`calculations.js`)

**Key Vocabulary:**
* **Mutate (in place):** Change an existing object or array directly in memory.
* **Shallow copy:** Duplicate top-level properties (for example, `{ ...obj }`) while still sharing references to nested objects.
* **Side effect:** An unintended change outside a function's local scope.

**5-Line Summary:**
1. Mutable data can be modified directly in memory after it is created, such as pushing items into an existing array or reassigning object properties.
2. Mutating shared data in place causes hard-to-trace bugs because other functions holding a reference to that object receive unexpected changes.
3. Immutable data avoids direct modifications by creating new copies whenever a value changes, commonly using spread syntax (`{ ...obj }` or `[...arr]`).
4. In `calculations.js`, `updateProductImmutable` returns a new catalog where the matching item is cloned with `{ ...product, ...changes, id: product.id }`, keeping the original array intact.
5. However, spread syntax only performs a shallow copy, so nested objects inside a cloned object still share the same memory reference unless deep-cloned (for example, with `structuredClone()`).

---

## Day 5 — Conventional Commits (`fase1-js-api`)

**Golden Rule (Present Imperative):** A commit description must complete the sentence:
> *"If applied, this commit will **[your commit message]**."*

**Common Types:**
* `feat`: new functionality (`add`, `implement`, `create`)
* `fix`: bug fix (`fix`, `prevent`, `resolve`)
* `refactor`: internal code restructuring with no behavior change (`extract`, `migrate`, `simplify`)
* `docs`: documentation or notes only (`document`, `update`, `clarify`)
* `chore`: setup, tooling, or maintenance (`initialize`, `configure`, `remove`)

### Commit Message Audit

| Defective Message | Main Issue | Rewritten Conventional Commit |
|---|---|---|
| `updated stuff` | Vague, missing type, past tense | `refactor(week-01): update input validations in calculations` |
| `Fixed bug in IVA.` | Capitalized, past tense, trailing period | `fix(week-01): prevent floating-point rounding error in calculateIVA` |
| `feat: Adding ES modules and cleaned files` | Gerund, past tense, mixes two actions | `refactor(week-01): migrate utility and catalog scripts to ES modules` |
| `subi los apuntes de ingles` | Written in Spanish, missing type, past tense | `docs(week-01): add technical English study notes` |
| `chore: deleted unused scripts` | Past tense verb (`deleted`) | `chore(week-01): remove unused standalone scripts` |
| `fix: arreglé el error de precio negativo en formatUSD` | Mixes Spanish and past tense | `fix(week-01): place minus sign before currency symbol in formatUSD` |