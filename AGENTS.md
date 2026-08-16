# Read this before you change anything in here

**This directory is a separate git repository** (`otsenre/cersports.com`). It
sits inside `nba_data_pull`, but it is not part of it. Committing
`nba_data_pull` does **not** commit this.

## The rule

> If we make changes to the site repo, the whole git commit has to be done.
> — Ernie, 2026-08-06

Leave this worktree **fully committed**. Not "mostly". Not "I'll do it after the
next thing".

## Why it matters more than it looks

The morning pipeline calls `check_site_complete.py` before it does anything
else. If this tree has **any** uncommitted, untracked or deleted file, the run
**stops with exit 73** and nothing publishes — no card, no free pick, no email.

It is a fail-fast on purpose: better to stop at 07:00 than to discover at 09:40,
after three hours of harvesting, that the outward push cannot go. But it means a
single stray file here costs the entire day.

This has happened for real:

* **2026-08-08** — 17 consecutive runs blocked by an untracked file.
* **2026-08-15** — an uncommitted `survivor.html` sat here for 40 minutes;
  `nba_data_pull` had been committed, this had not.

## What to do, depending on what you touched

**An authored file** (a page, CSS, copy) — commit it here, then push:

```bash
git -C cersports_site add -A
git -C cersports_site commit -m "..."
git -C cersports_site push
```

**A generated artifact** (something a script writes every run) — do **not**
hand-commit it daily. It belongs in one of two places:

* on `publish_public.OWNED`, if it should be published and version-controlled —
  the pipeline then stages and commits it as part of its own transaction; or
* in `.gitignore`, if it is purely local.

An artifact that is neither is exactly how 2026-08-08 happened: a producer
writing a file that nothing was responsible for committing.

## What is enforcing this

You do not have to remember any of the above. Three layers, in `nba_data_pull`:

| | |
|---|---|
| `.githooks/post-commit` | tells you the moment you commit `nba_data_pull` and leave this dirty |
| `.githooks/pre-push` | **refuses** to push `nba_data_pull` while this is incomplete |
| `watch.site_dirty` | every 30 min, alerts on a change of state (`site_dirty_watch.py`) |
| `watch.site_complete` | 22:00 + 23:30 nightly full check |

Check by hand any time:

```bash
nba_model_env/bin/python check_site_complete.py
```

There is a `SITE_GATE_BYPASS=1` escape on the push hook. It buys you nothing:
the morning run reads this **worktree**, not the remote, so bypassing the push
only delays the discovery until the run fails.

## What is NOT the fix

Auto-committing this tree. It would make the gate green and defeat its purpose —
the gate exists so half-finished pages cannot ship. Committing work nobody has
reviewed is the failure it was built to prevent, not a shortcut past it.
