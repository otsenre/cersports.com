# picks.json IS THE FREE PICK

**Read this before changing anything that touches `picks.json`.**

## The definition — Node 0, 2026-08-09. Final.

> **Every pick in this file is a FREE PICK.** All of them. No exceptions.
> A free pick is any pick we PUBLISHED PUBLICLY.

Publication is what makes a pick free — **not its origin**. If it went out on
the site where anyone could see it without paying, the public got it for free.
Some of these wagers also ran on the paid card. That is irrelevant here. Two
audiences, two deliveries, two records:

    cersports_site/picks.json   what the PUBLIC got free   <- THIS. the free pick.
    data/picks_ledger.csv       what SUBSCRIBERS paid for  <- the daily card

## It is called THE FREE PICK. Nothing else.

Node 0: *"the pick might be called many things — best pick, my life depends on
this pick, the company's existence relies on this pick — but we call it the free
pick, never anything else."*

Not "BEST". Not "published play". Not "best bet". Not "hero pick". The label
`sport: "BEST"` is a historical artifact; **nothing may branch on it**, because
a label that can be checked is a label that can be got wrong.

## Rules

1. **Every row counts.** The free-pick scorecard population is this entire file.
   No filter by sport, tier, label or origin — ever.
2. **Rows are NEVER removed.** Grade it or void it. A pick that was published
   cannot be unpublished. The row count must never decrease.
3. **Going forward: at most ONE new pick per day.** Some days none. Never two.
   History stays exactly as it is; this governs new picks only.
4. **Missing price/odds is a FIX, not a filter.** `fix_master_prices.py` works
   that queue. A LOSS needs no price (net = −stake); only unpriced WINS block a
   number.
6. **Every row carries its ADVISED STAKE, and the site shows it.** See below.

## The stake — Node 0, 2026-08-23. Settled, after two reversals.

> *"Isn't the correct thing to have the units as sized, as that's part of the
> wager selection?"* — yes.

**This has flipped twice. Read the history before flipping it a third time.**

| date | commit | decision |
|---|---|---|
| 2026-08-08 | `36c4c8b` | inherit master's stake — *"the free picks have units"* |
| 2026-08-10 | `7b24cc9` | revert to flat 1u — *"it's 1u, the free pick is always 1u"* |
| 2026-08-23 | `advised_stake.py` | **inherit AND disclose** |

The 08-10 objection was that master's units are the *card's* sizing, so
publishing them on a free surface leaks the paid product's risk model. That was
real, but narrower than it looked. The actual defect was this:

> **picks.json carried 0.5–2.0u while `index.html` rendered `+1u`** — a plus
> sign next to a WIN badge, which reads as profit, not stake. A units-weighted
> ROI whose weights the reader cannot see is a staking plan nobody could have
> followed.

Inheritance was never the problem; **undisclosed** inheritance was. Disclosed,
the stake is not the paid model smuggled in — it is the system's own advice,
stated.

**The two halves are a PAIR.** If `index.html` ever stops rendering the per-pick
stake, `render_picks_json.py` must go back to flat 1u the same day, or the
published free ROI silently becomes unfollowable again.
`tests/test_free_pick_definition.py` fails if either half moves without the
other — `test_the_site_still_discloses_the_stake` is the tripwire.

The stake itself comes from **`advised_stake.py`**, the single implementation
shared with the paid card, so the two products can never quote a different
stake for the same wager. Where several models propose the same wager at
different sizes, it is the mean on the quarter-unit grid — not the max, because
ROI by stake size is non-monotonic across 17k settled rows.

5. **Generated, not hand-edited.** `render_picks_json.py` is the generator. Fix
   the source and regenerate.

## The mistake already made once — do not repeat it

A session read the card-derived rows here as CONTAMINATION and proposed
stripping them out. That was wrong, and it would have destroyed the record of
what the public was actually given. The file may be messy in places; that does
not change what its rows ARE.

Full reasoning: `ai.ingest/FREE_PICK_LOCKDOWN_PLAN.md`.
Scorecard spec: `brand/STYLE_GUIDE.md` §7b. Producer: `brand/gauge.py`.
