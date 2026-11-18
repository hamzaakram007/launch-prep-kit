"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildChecklist, groupByCategory } from "@/lib/checklist";
import { EMPTY_ANSWERS, PDF_PRICE, type WizardAnswers } from "@/lib/types";

type StepId = keyof WizardAnswers;
type Phase = "landing" | "wizard" | "checklist";

const STORAGE_KEY = "launch-prep-kit:v1";

const STEPS: {
  id: StepId;
  title: string;
  subtitle: string;
  options: { value: string; label: string; hint: string }[];
}[] = [
  {
    id: "console",
    title: "Which console?",
    subtitle: "Launch is console-only — pick your box.",
    options: [
      { value: "ps5", label: "PlayStation 5", hint: "Disc or digital" },
      { value: "xbox", label: "Xbox Series X|S", hint: "Any Series console" },
    ],
  },
  {
    id: "storage",
    title: "How is free storage?",
    subtitle: "Big installs + patches eat space fast.",
    options: [
      { value: "plenty", label: "Plenty free", hint: "100+ GB clear" },
      { value: "tight", label: "Getting tight", hint: "Need a cleanup" },
      { value: "need-ssd", label: "Need an SSD", hint: "Expansion required" },
    ],
  },
  {
    id: "headset",
    title: "Audio setup?",
    subtitle: "Story dialogue should stay readable.",
    options: [
      { value: "ready", label: "Headset ready", hint: "Charged & paired" },
      { value: "need-one", label: "Need a headset", hint: "Shopping still" },
      { value: "speakers", label: "TV / speakers", hint: "No headset" },
    ],
  },
  {
    id: "friends",
    title: "Playing with friends?",
    subtitle: "Set spoiler ground rules before day one.",
    options: [
      { value: "solo", label: "Solo", hint: "Just me" },
      { value: "few", label: "A few friends", hint: "2–4 people" },
      { value: "crew", label: "Whole crew", hint: "Discord / group chat" },
    ],
  },
  {
    id: "midnight",
    title: "Midnight launch?",
    subtitle: "Unlock night — are you staying up?",
    options: [
      { value: "yes", label: "Yes — midnight", hint: "Session starts at unlock" },
      { value: "maybe", label: "Maybe", hint: "Depends on energy" },
      { value: "no", label: "Morning start", hint: "Sleep first" },
    ],
  },
];

export default function LaunchPrepApp() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>(EMPTY_ANSWERS);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [payNotice, setPayNotice] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const continueRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          phase?: Phase;
          stepIndex?: number;
          answers?: WizardAnswers;
          checked?: Record<string, boolean>;
        };
        if (saved.answers) setAnswers({ ...EMPTY_ANSWERS, ...saved.answers });
        if (typeof saved.stepIndex === "number") setStepIndex(saved.stepIndex);
        if (saved.checked) setChecked(saved.checked);
        if (saved.phase === "wizard" || saved.phase === "checklist") {
          setPhase(saved.phase);
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ phase, stepIndex, answers, checked }),
      );
    } catch {
      /* quota / private mode */
    }
  }, [phase, stepIndex, answers, checked, hydrated]);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const items = useMemo(
    () => (phase === "checklist" ? buildChecklist(answers) : []),
    [phase, answers],
  );
  const grouped = useMemo(() => groupByCategory(items), [items]);
  const doneCount = items.filter((i) => checked[i.id]).length;
  const progressPct = Math.round((doneCount / Math.max(items.length, 1)) * 100);

  function clearAdvanceTimer() {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }

  function goNext(fromIndex = stepIndex) {
    clearAdvanceTimer();
    const step = STEPS[fromIndex];
    if (!answers[step.id] && fromIndex === stepIndex) return;
    if (fromIndex < STEPS.length - 1) {
      setStepIndex(fromIndex + 1);
      return;
    }
    setChecked({});
    setPhase("checklist");
  }

  function selectOption(stepId: StepId, value: string, autoAdvance = true) {
    setAnswers((prev) => ({
      ...prev,
      [stepId]: value as WizardAnswers[StepId],
    }));

    if (!autoAdvance || phase !== "wizard") return;

    clearAdvanceTimer();
    const current = stepIndex;
    advanceTimer.current = setTimeout(() => {
      const step = STEPS[current];
      if (step.id !== stepId) return;
      if (current < STEPS.length - 1) {
        setStepIndex(current + 1);
      } else {
        setChecked({});
        setPhase("checklist");
      }
    }, 280);
  }

  function prevStep() {
    clearAdvanceTimer();
    if (stepIndex === 0) {
      setPhase("landing");
      return;
    }
    setStepIndex((i) => i - 1);
  }

  function restart() {
    clearAdvanceTimer();
    setAnswers(EMPTY_ANSWERS);
    setStepIndex(0);
    setChecked({});
    setPayNotice(false);
    setPhase("wizard");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  function printChecklist() {
    window.print();
  }

  function onPayStubClick() {
    setPayNotice(true);
  }

  useEffect(() => {
    if (phase !== "wizard") return;

    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      const step = STEPS[stepIndex];
      const num = Number(e.key);
      if (num >= 1 && num <= step.options.length) {
        e.preventDefault();
        selectOption(step.id, step.options[num - 1].value, true);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (answers[step.id]) goNext();
        return;
      }
      if (e.key === "Backspace" || e.key === "Escape") {
        e.preventDefault();
        prevStep();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- wizard keyboard only needs step/answers
  }, [phase, stepIndex, answers]);

  if (phase === "landing") {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <Atmosphere />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-6 pb-16 pt-10 sm:px-10">
          <header className="flex items-center justify-between">
            <p className="font-display text-sm tracking-[0.22em] text-cyan-200/90 uppercase">
              Launch Prep Kit
            </p>
            <p className="text-xs text-slate-400">by Hamza Akram</p>
          </header>

          <section className="mt-auto flex flex-1 flex-col justify-center gap-8 py-16 sm:max-w-xl">
            <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-white sm:text-7xl">
              Launch
              <br />
              Prep Kit
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-slate-300">
              Answer five quick questions. Get a personalized console launch
              checklist you can print as a PDF.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setPhase("wizard");
                  setStepIndex(0);
                }}
                className="btn-primary"
              >
                Start wizard
              </button>
              <span className="text-sm text-slate-400">~60 seconds · free web checklist</span>
            </div>
            {hydrated && answers.console ? (
              <button
                type="button"
                onClick={() => {
                  const complete = STEPS.every((s) => answers[s.id]);
                  setPhase(complete ? "checklist" : "wizard");
                  if (!complete) {
                    const firstOpen = STEPS.findIndex((s) => !answers[s.id]);
                    setStepIndex(firstOpen === -1 ? 0 : firstOpen);
                  }
                }}
                className="btn-ghost w-fit text-sm"
              >
                Resume where you left off
              </button>
            ) : null}
          </section>

          <footer className="mt-auto border-t border-white/10 pt-6 text-xs leading-relaxed text-slate-500">
            Independent fan utility. Not affiliated with Rockstar Games, Take-Two,
            Sony, or Microsoft. No official game assets. Console-only launch prep.
          </footer>
        </div>
      </main>
    );
  }

  if (phase === "wizard") {
    const step = STEPS[stepIndex];
    const currentValue = answers[step.id];
    const progress = ((stepIndex + 1) / STEPS.length) * 100;

    return (
      <main className="relative min-h-screen overflow-hidden">
        <Atmosphere />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-10 sm:px-10">
          <header className="mb-8 flex items-center justify-between gap-4">
            <p className="font-display text-sm tracking-[0.22em] text-cyan-200/90 uppercase">
              Launch Prep Kit
            </p>
            <p className="text-sm text-slate-400" aria-live="polite">
              Step {stepIndex + 1} / {STEPS.length}
            </p>
          </header>

          <div className="mb-3 flex items-center gap-1.5" aria-hidden>
            {STEPS.map((s, i) => (
              <span
                key={s.id}
                className={`step-dot ${
                  i < stepIndex ? "is-done" : i === stepIndex ? "is-current" : ""
                }`}
              />
            ))}
          </div>

          <div className="progress-track mb-8" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div key={step.id} className="animate-rise">
            <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
              {step.title}
            </h2>
            <p className="mt-3 text-slate-300">{step.subtitle}</p>

            <div className="mt-8 grid gap-3" role="radiogroup" aria-label={step.title}>
              {step.options.map((opt, optIndex) => {
                const selected = currentValue === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => selectOption(step.id, opt.value, true)}
                    className={`wizard-option ${selected ? "is-selected" : ""}`}
                  >
                    <span className="flex min-w-0 items-start">
                      <span className="wizard-option-index" aria-hidden>
                        {optIndex + 1}
                      </span>
                      <span>
                        <span className="block font-medium text-white">{opt.label}</span>
                        <span className="mt-1 block text-sm text-slate-400">{opt.hint}</span>
                      </span>
                    </span>
                    <span
                      className={`ml-2 h-4 w-4 shrink-0 rounded-full border-2 transition-colors ${
                        selected
                          ? "border-cyan-300 bg-cyan-300"
                          : "border-slate-500"
                      }`}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-12">
            <button type="button" onClick={prevStep} className="btn-ghost">
              Back
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <span className="kbd-hint print-hidden hidden sm:inline-flex">
                <kbd>1</kbd>–<kbd>{step.options.length}</kbd> select · <kbd>Enter</kbd> next
              </span>
              <button
                ref={continueRef}
                type="button"
                onClick={() => goNext()}
                disabled={!currentValue}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                {stepIndex === STEPS.length - 1 ? "Build checklist" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const consoleLabel =
    answers.console === "ps5"
      ? "PS5"
      : answers.console === "xbox"
        ? "Xbox"
        : "Console";

  const printedOn = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Atmosphere />
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-10 sm:px-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 print-hidden">
          <p className="font-display text-sm tracking-[0.22em] text-cyan-200/90 uppercase">
            Launch Prep Kit
          </p>
          <button type="button" onClick={restart} className="btn-ghost text-sm">
            Start over
          </button>
        </header>

        <div className="print-sheet rounded-3xl border border-white/10 bg-[#071018]/90 p-6 shadow-2xl backdrop-blur-md sm:p-10">
          <div className="border-b border-white/10 pb-6">
            <div className="print-only mb-3 text-xs tracking-[0.16em] text-teal-800 uppercase">
              Launch Prep Kit · printed {printedOn}
            </div>
            <p className="font-display print-accent text-xs tracking-[0.2em] text-cyan-200/80 uppercase">
              Your personalized checklist
            </p>
            <h2 className="print-ink mt-2 font-display text-3xl tracking-tight text-white sm:text-4xl">
              {consoleLabel} launch prep
            </h2>
            <p className="print-muted mt-2 text-slate-300">
              <span className="print-hidden">
                {doneCount} of {items.length} done ({progressPct}%) · tailored from your
                wizard answers
              </span>
              <span className="print-only">
                {items.length} items · tailored from your wizard answers · {printedOn}
              </span>
            </p>

            <div className="progress-track mt-4 print-hidden" aria-hidden>
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>

            <SummaryChips answers={answers} />
          </div>

          <div className="mt-8 space-y-8">
            {Object.entries(grouped).map(([category, catItems]) => {
              const catDone = catItems.filter((i) => checked[i.id]).length;
              return (
                <section key={category} className="checklist-section">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display print-accent text-sm tracking-[0.18em] text-teal-200/90 uppercase">
                      {category}
                    </h3>
                    <span className="print-hidden text-xs text-slate-500">
                      {catDone}/{catItems.length}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {catItems.map((item) => {
                      const isOn = !!checked[item.id];
                      return (
                        <li key={item.id} className="checklist-item">
                          <label className="flex cursor-pointer gap-3 rounded-xl border border-transparent px-2 py-2 transition hover:border-white/10 hover:bg-white/5">
                            <input
                              type="checkbox"
                              checked={isOn}
                              onChange={() =>
                                setChecked((prev) => ({
                                  ...prev,
                                  [item.id]: !prev[item.id],
                                }))
                              }
                              className="mt-1 h-4 w-4"
                            />
                            <span>
                              <span
                                className={`print-ink block font-medium ${
                                  isOn
                                    ? "text-slate-400 line-through print:text-slate-500 print:no-underline"
                                    : "text-white"
                                }`}
                              >
                                {item.label}
                              </span>
                              {item.detail ? (
                                <span className="print-muted mt-1 block text-sm text-slate-400">
                                  {item.detail}
                                </span>
                              ) : null}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>

          <div className="print-footer print-only">
            Independent fan utility · Not affiliated with Rockstar, Take-Two, Sony, or
            Microsoft · launch-prep-kit.vercel.app
          </div>

          <div className="mt-10 space-y-4 border-t border-white/10 pt-6 print-hidden">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={printChecklist} className="btn-primary">
                Print / Save as PDF
              </button>
              <button
                type="button"
                onClick={onPayStubClick}
                aria-disabled="true"
                className="btn-locked"
                title="Checkout not wired yet — payments coming soon"
              >
                <span
                  aria-hidden
                  className="inline-block h-3.5 w-3.5 rounded-sm border border-slate-500 bg-slate-700/80"
                />
                Unlock PDF — {PDF_PRICE}
              </button>
            </div>

            <div className="pay-stub animate-fade">
              <div className="flex flex-wrap items-center gap-2">
                <span className="pay-stub-badge">Coming soon</span>
                <p className="text-sm font-medium text-slate-200">
                  Paid unlock stub · {PDF_PRICE} one-time
                </p>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
                <li>• Branded PDF download (no browser print dialog)</li>
                <li>• Email delivery + re-download link</li>
                <li>• Stripe / Lemon Squeezy checkout (not connected yet)</li>
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                Free path works now: use <strong className="font-medium text-slate-400">Print / Save as PDF</strong>{" "}
                in your browser. The unlock button is intentionally disabled until payments ship.
              </p>
              {payNotice ? (
                <p className="mt-3 rounded-lg border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-xs text-amber-100" role="status">
                  Payments are not live yet. Use Print / Save as PDF for the free checklist export.
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <footer className="mt-10 border-t border-white/10 pt-6 text-xs leading-relaxed text-slate-500 print-hidden">
          Independent fan utility. Not affiliated with Rockstar Games, Take-Two, Sony,
          or Microsoft. No official game assets.
        </footer>
      </div>
    </main>
  );
}

function SummaryChips({ answers }: { answers: WizardAnswers }) {
  const chips: string[] = [];
  if (answers.console === "ps5") chips.push("PS5");
  if (answers.console === "xbox") chips.push("Xbox");
  if (answers.storage === "plenty") chips.push("Storage OK");
  if (answers.storage === "tight") chips.push("Cleanup needed");
  if (answers.storage === "need-ssd") chips.push("Needs SSD");
  if (answers.headset === "ready") chips.push("Headset ready");
  if (answers.headset === "need-one") chips.push("Needs headset");
  if (answers.headset === "speakers") chips.push("Speakers");
  if (answers.friends === "solo") chips.push("Solo");
  if (answers.friends === "few") chips.push("Small group");
  if (answers.friends === "crew") chips.push("Crew");
  if (answers.midnight === "yes") chips.push("Midnight");
  if (answers.midnight === "maybe") chips.push("Flex start");
  if (answers.midnight === "no") chips.push("Morning");

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span
          key={chip}
          className="print-chip rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100"
        >
          {chip}
        </span>
      ))}
    </div>
  );
}

function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 print-hidden">
      <div className="absolute inset-0 bg-[#040b12]" />
      <div className="absolute -left-24 top-0 h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.22),transparent_65%)] blur-2xl" />
      <div className="absolute -right-16 bottom-0 h-[55vh] w-[55vh] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.18),transparent_60%)] blur-2xl" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(2,12,20,0.9),transparent)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:48px_48px]" />
    </div>
  );
}
