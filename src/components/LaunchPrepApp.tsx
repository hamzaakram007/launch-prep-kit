"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildChecklist, groupByCategory } from "@/lib/checklist";
import {
  EMPTY_ANSWERS,
  PDF_PRICE,
  answersComplete,
  firstIncompleteStep,
  isValidChoice,
  sanitizeAnswers,
  type StepId,
  type WizardAnswers,
} from "@/lib/types";

type Phase = "landing" | "wizard" | "checklist";

const STORAGE_KEY = "launch-prep-kit:v2";

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
    id: "display",
    title: "TV or display?",
    subtitle: "Picture setup before the long session.",
    options: [
      { value: "tv-4k", label: "4K TV", hint: "HDR / game mode" },
      { value: "tv-hd", label: "HD TV", hint: "1080p-class screen" },
      { value: "monitor", label: "Monitor", hint: "Desk / PC display" },
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
    id: "capture",
    title: "Capturing clips?",
    subtitle: "Screenshots and video need free space too.",
    options: [
      { value: "yes", label: "Yes — I capture", hint: "Clips + screenshots" },
      { value: "maybe", label: "Maybe", hint: "If a moment hits" },
      { value: "no", label: "No capture", hint: "Play only" },
    ],
  },
  {
    id: "access",
    title: "Accessibility needs?",
    subtitle: "Comfort settings before launch night.",
    options: [
      { value: "none", label: "Defaults are fine", hint: "No special setup" },
      { value: "captions", label: "Captions / text", hint: "Subtitles matter" },
      { value: "other", label: "Controls / comfort", hint: "Remap, aim, breaks" },
    ],
  },
  {
    id: "household",
    title: "Household rules?",
    subtitle: "Who shares the room, TV, and quiet hours.",
    options: [
      { value: "alone", label: "Mostly alone", hint: "My setup, my rules" },
      { value: "shared-tv", label: "Shared TV", hint: "Negotiate the screen" },
      { value: "quiet-hours", label: "Quiet hours", hint: "Keep the volume down" },
    ],
  },
  {
    id: "spoilers",
    title: "Spoiler preference?",
    subtitle: "How locked-down should feeds stay.",
    options: [
      { value: "strict", label: "Strict", hint: "Hide everything" },
      { value: "casual", label: "Casual", hint: "Friends mark spoilers" },
      { value: "open", label: "Open", hint: "I can handle chatter" },
    ],
  },
  {
    id: "friends",
    title: "Playing with friends?",
    subtitle: "Set ground rules before day one.",
    options: [
      { value: "solo", label: "Solo", hint: "Just me" },
      { value: "few", label: "A few friends", hint: "2–4 people" },
      { value: "crew", label: "Whole crew", hint: "Discord / group chat" },
    ],
  },
  {
    id: "midnight",
    title: "Launch-day plan?",
    subtitle: "When do you start the first session?",
    options: [
      { value: "yes", label: "Midnight unlock", hint: "Stay up for it" },
      { value: "maybe", label: "Flexible", hint: "Depends on energy" },
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
  const [storageNotice, setStorageNotice] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [printHint, setPrintHint] = useState(false);
  const [printError, setPrintError] = useState<string | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const checklistHeadingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          phase?: Phase;
          stepIndex?: number;
          answers?: unknown;
          checked?: Record<string, boolean>;
        };
        const clean = sanitizeAnswers(saved.answers);
        setAnswers(clean);
        if (
          typeof saved.stepIndex === "number" &&
          saved.stepIndex >= 0 &&
          saved.stepIndex < STEPS.length
        ) {
          setStepIndex(saved.stepIndex);
        }
        if (saved.checked && typeof saved.checked === "object") {
          const safe: Record<string, boolean> = {};
          for (const [k, v] of Object.entries(saved.checked)) {
            if (typeof k === "string" && typeof v === "boolean") safe[k] = v;
          }
          setChecked(safe);
        }
        if (saved.phase === "checklist" && answersComplete(clean)) {
          setPhase("checklist");
        } else if (saved.phase === "wizard" || saved.phase === "checklist") {
          setPhase("wizard");
          if (saved.phase === "checklist" && !answersComplete(clean)) {
            setStepIndex(firstIncompleteStep(clean));
          }
        }
      }
    } catch {
      setStorageNotice(
        "Could not restore a saved session. Starting fresh is fine.",
      );
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
      setStorageNotice(null);
    } catch {
      setStorageNotice(
        "Saving is off in this browser (private mode or full storage). Your checklist still works until you close the tab.",
      );
    }
  }, [phase, stepIndex, answers, checked, hydrated]);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== "wizard") return;
    headingRef.current?.focus();
  }, [phase, stepIndex]);

  useEffect(() => {
    if (phase !== "checklist") return;
    checklistHeadingRef.current?.focus();
  }, [phase]);

  const items = useMemo(
    () => (phase === "checklist" ? buildChecklist(answers) : []),
    [phase, answers],
  );
  const grouped = useMemo(() => groupByCategory(items), [items]);
  const doneCount = items.filter((i) => checked[i.id]).length;
  const progressPct = Math.round((doneCount / Math.max(items.length, 1)) * 100);
  const wizardComplete = answersComplete(answers);

  function clearAdvanceTimer() {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }

  function finishWizard(fromAnswers: WizardAnswers) {
    if (!answersComplete(fromAnswers)) {
      setStepError("Answer every question to build your checklist.");
      setStepIndex(firstIncompleteStep(fromAnswers));
      setPhase("wizard");
      return;
    }
    setStepError(null);
    setChecked({});
    setPrintError(null);
    setPhase("checklist");
  }

  function goNext(fromIndex = stepIndex, withAnswers: WizardAnswers = answers) {
    clearAdvanceTimer();
    const step = STEPS[fromIndex];
    if (!withAnswers[step.id]) {
      setStepError("Pick an option to continue.");
      return;
    }
    setStepError(null);
    if (fromIndex < STEPS.length - 1) {
      setStepIndex(fromIndex + 1);
      return;
    }
    finishWizard(withAnswers);
  }

  function selectOption(stepId: StepId, value: string, autoAdvance = true) {
    if (!isValidChoice(stepId, value)) {
      setStepError("That option is not valid. Pick one from the list.");
      return;
    }

    const nextAnswers = {
      ...answers,
      [stepId]: value,
    } as WizardAnswers;

    setAnswers(nextAnswers);
    setStepError(null);

    if (!autoAdvance || phase !== "wizard") return;

    clearAdvanceTimer();
    const current = stepIndex;
    advanceTimer.current = setTimeout(() => {
      const step = STEPS[current];
      if (step.id !== stepId) return;
      if (current < STEPS.length - 1) {
        setStepIndex(current + 1);
      } else {
        finishWizard(nextAnswers);
      }
    }, 280);
  }

  function prevStep() {
    clearAdvanceTimer();
    setStepError(null);
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
    setStepError(null);
    setPrintError(null);
    setPrintHint(false);
    setPhase("wizard");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  function printChecklist() {
    setPrintError(null);
    setPrintHint(true);
    try {
      if (typeof window.print !== "function") {
        setPrintError(
          "Print is not available here. Open this page in Safari, Chrome, or Edge, then use Print → Save as PDF.",
        );
        return;
      }
      window.print();
    } catch {
      setPrintError(
        "Could not open the print dialog. Try again, or use your browser menu: Print → Save as PDF.",
      );
    }
  }

  function onWaitlistClick() {
    setPayNotice(true);
  }

  useEffect(() => {
    if (phase !== "wizard") return;

    function onKey(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
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
        else setStepError("Pick an option to continue.");
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
        <a href="#main-cta" className="skip-link">
          Skip to get checklist PDF
        </a>
        <Atmosphere />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-6 pb-16 pt-10 sm:px-10">
          <header className="flex items-center justify-between">
            <p className="font-display text-sm tracking-[0.22em] text-cyan-200/90 uppercase">
              NeonGulf
            </p>
            <p className="text-xs text-slate-400">Launch Prep Kit</p>
          </header>

          <section className="mt-auto flex flex-1 flex-col justify-center gap-8 py-16 sm:max-w-xl">
            <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-white sm:text-7xl">
              Launch
              <br />
              Prep Kit
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-slate-300">
              Ten short questions. One personalized console checklist PDF —
              storage, TV, headset, house rules, and launch-day plan.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                id="main-cta"
                type="button"
                onClick={() => {
                  setPhase("wizard");
                  setStepIndex(0);
                  setStepError(null);
                }}
                className="btn-primary min-h-12 px-6 text-base"
              >
                Get my checklist PDF
              </button>
              <span className="text-sm text-slate-400">
                Free · no signup · ~2 minutes
              </span>
            </div>
            {hydrated && answers.console ? (
              <button
                type="button"
                onClick={() => {
                  if (wizardComplete) {
                    setPhase("checklist");
                  } else {
                    setPhase("wizard");
                    setStepIndex(firstIncompleteStep(answers));
                  }
                }}
                className="btn-ghost w-fit min-h-11 text-sm"
              >
                {wizardComplete
                  ? "Open saved checklist"
                  : "Resume where you left off"}
              </button>
            ) : null}
            {storageNotice ? (
              <p className="notice-warn" role="status">
                {storageNotice}
              </p>
            ) : null}
          </section>

          <SoftFooter />
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
        <a href="#wizard-options" className="skip-link">
          Skip to options
        </a>
        <Atmosphere />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-10 sm:px-10">
          <header className="mb-8 flex items-center justify-between gap-4">
            <p className="font-display text-sm tracking-[0.22em] text-cyan-200/90 uppercase">
              NeonGulf · Prep
            </p>
            <p className="text-sm text-slate-400" aria-live="polite">
              Step {stepIndex + 1} / {STEPS.length}
            </p>
          </header>

          <div className="mb-3 flex flex-wrap items-center gap-1.5" aria-hidden>
            {STEPS.map((s, i) => (
              <span
                key={s.id}
                className={`step-dot ${
                  i < stepIndex ? "is-done" : i === stepIndex ? "is-current" : ""
                }`}
              />
            ))}
          </div>

          <div
            className="progress-track mb-8"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Wizard progress, step ${stepIndex + 1} of ${STEPS.length}`}
          >
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div key={step.id} className="animate-rise">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="font-display text-3xl tracking-tight text-white outline-none sm:text-4xl"
            >
              {step.title}
            </h2>
            <p className="mt-3 text-slate-300">{step.subtitle}</p>

            <div
              id="wizard-options"
              className="mt-8 grid gap-3"
              role="radiogroup"
              aria-label={step.title}
              aria-describedby={stepError ? "step-error" : undefined}
            >
              {step.options.map((opt, optIndex) => {
                const selected = currentValue === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => selectOption(step.id, opt.value, true)}
                    className={`wizard-option min-h-14 ${selected ? "is-selected" : ""}`}
                  >
                    <span className="flex min-w-0 items-start">
                      <span className="wizard-option-index" aria-hidden>
                        {optIndex + 1}
                      </span>
                      <span>
                        <span className="block font-medium text-white">
                          {opt.label}
                        </span>
                        <span className="mt-1 block text-sm text-slate-400">
                          {opt.hint}
                        </span>
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

            {stepError ? (
              <p id="step-error" className="notice-error mt-4" role="alert">
                {stepError}
              </p>
            ) : null}
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-12 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={prevStep}
              className="btn-ghost min-h-11"
            >
              Back
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <span className="kbd-hint print-hidden hidden sm:inline-flex">
                <kbd>1</kbd>–<kbd>{step.options.length}</kbd> select ·{" "}
                <kbd>Enter</kbd> next
              </span>
              <button
                type="button"
                onClick={() => goNext()}
                disabled={!currentValue}
                aria-disabled={!currentValue}
                className="btn-primary min-h-11 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {stepIndex === STEPS.length - 1
                  ? "Build my checklist"
                  : "Continue"}
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

  if (!wizardComplete || items.length === 0) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <Atmosphere />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16 sm:px-10">
          <p className="font-display text-sm tracking-[0.22em] text-cyan-200/90 uppercase">
            NeonGulf · Prep
          </p>
          <h2 className="mt-4 font-display text-3xl text-white">
            Checklist not ready yet
          </h2>
          <p className="mt-3 text-slate-300">
            Answer every wizard question so we can build your personalized
            printable checklist.
          </p>
          <button
            type="button"
            onClick={() => {
              setPhase("wizard");
              setStepIndex(firstIncompleteStep(answers));
            }}
            className="btn-primary mt-8 w-fit min-h-12"
          >
            Finish the wizard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <a href="#print-actions" className="skip-link">
        Skip to save PDF
      </a>
      <Atmosphere />
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-10 sm:px-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 print-hidden">
          <p className="font-display text-sm tracking-[0.22em] text-cyan-200/90 uppercase">
            NeonGulf · Prep
          </p>
          <button
            type="button"
            onClick={restart}
            className="btn-ghost min-h-11 text-sm"
          >
            Start over
          </button>
        </header>

        <div className="print-sheet rounded-3xl border border-white/10 bg-[#071018]/90 p-6 shadow-2xl backdrop-blur-md sm:p-10">
          <div className="border-b border-white/10 pb-6">
            <div className="print-only mb-3 text-xs tracking-[0.16em] text-teal-800 uppercase">
              NeonGulf Launch Prep Kit · printed {printedOn}
            </div>
            <p className="font-display print-accent text-xs tracking-[0.2em] text-cyan-200/80 uppercase">
              Your personalized checklist
            </p>
            <h2
              ref={checklistHeadingRef}
              tabIndex={-1}
              className="print-ink mt-2 font-display text-3xl tracking-tight text-white outline-none sm:text-4xl"
            >
              {consoleLabel} launch prep
            </h2>
            <p className="print-muted mt-2 text-slate-300">
              <span className="print-hidden">
                {doneCount} of {items.length} done ({progressPct}%) · tailored
                from your wizard answers
              </span>
              <span className="print-only">
                {items.length} items · tailored from your wizard answers ·{" "}
                {printedOn}
              </span>
            </p>

            <div
              className="progress-track mt-4 print-hidden"
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${doneCount} of ${items.length} checklist items done`}
            >
              <div
                className="progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <SummaryChips answers={answers} />
          </div>

          <div className="mt-8 space-y-8">
            {Object.entries(grouped).map(([category, catItems]) => {
              const catDone = catItems.filter((i) => checked[i.id]).length;
              return (
                <section
                  key={category}
                  className="checklist-section"
                  aria-labelledby={`cat-${category.replace(/\s+/g, "-")}`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3
                      id={`cat-${category.replace(/\s+/g, "-")}`}
                      className="font-display print-accent text-sm tracking-[0.18em] text-teal-200/90 uppercase"
                    >
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
                          <label className="flex min-h-11 cursor-pointer gap-3 rounded-xl border border-transparent px-2 py-2 transition hover:border-white/10 hover:bg-white/5">
                            <input
                              type="checkbox"
                              checked={isOn}
                              onChange={() =>
                                setChecked((prev) => ({
                                  ...prev,
                                  [item.id]: !prev[item.id],
                                }))
                              }
                              className="mt-1 h-5 w-5 shrink-0"
                              aria-describedby={
                                item.detail ? `${item.id}-detail` : undefined
                              }
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
                                <span
                                  id={`${item.id}-detail`}
                                  className="print-muted mt-1 block text-sm text-slate-400"
                                >
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
            NeonGulf · Independent fan utility · Not affiliated with Rockstar,
            Take-Two, Sony, or Microsoft · Original checklist art only ·
            prep.neongulf.com
          </div>

          <div
            id="print-actions"
            className="mt-10 space-y-4 border-t border-white/10 pt-6 print-hidden"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={printChecklist}
                className="btn-primary min-h-12 text-base"
              >
                Download PDF checklist
              </button>
              <button
                type="button"
                onClick={onWaitlistClick}
                aria-disabled="true"
                className="btn-locked min-h-12"
                title="Pro checkout opens soon — join the waitlist"
              >
                <span
                  aria-hidden
                  className="inline-block h-3.5 w-3.5 rounded-sm border border-slate-500 bg-slate-700/80"
                />
                Join waitlist — {PDF_PRICE}
              </button>
            </div>

            {printHint ? (
              <p className="notice-info" role="status">
                In the print dialog, choose <strong>Save as PDF</strong> (or
                “Microsoft Print to PDF”). On iPhone/iPad: Share → Print → tap
                the share icon → Save to Files.
              </p>
            ) : (
              <p className="text-sm text-slate-400">
                Opens your browser print dialog — pick Save as PDF for a clean
                one-page checklist.
              </p>
            )}

            {printError ? (
              <p className="notice-error" role="alert">
                {printError}
              </p>
            ) : null}

            {storageNotice ? (
              <p className="notice-warn" role="status">
                {storageNotice}
              </p>
            ) : null}

            <div className="pay-stub animate-fade">
              <div className="flex flex-wrap items-center gap-2">
                <span className="pay-stub-badge">Opens soon</span>
                <p className="text-sm font-medium text-slate-200">
                  Pro PDF unlock · {PDF_PRICE} one-time
                </p>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
                <li>• Branded NeonGulf PDF download (no browser print dialog)</li>
                <li>• Email delivery + re-download link</li>
                <li>• Secure checkout when Pro opens</li>
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                Free checklist is ready now: use{" "}
                <strong className="font-medium text-slate-400">
                  Download PDF checklist
                </strong>{" "}
                above. Pro checkout opens soon — join the waitlist if you want
                the direct file later.
              </p>
              {payNotice ? (
                <p
                  className="mt-3 rounded-lg border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-xs text-amber-100"
                  role="status"
                >
                  Pro checkout isn&apos;t live yet. You&apos;re on the interest
                  list — use Download PDF checklist for your free export today.
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="print-sticky print-hidden sm:hidden">
          <button
            type="button"
            onClick={printChecklist}
            className="btn-primary w-full min-h-12"
          >
            Download PDF checklist
          </button>
        </div>

        <SoftFooter />
      </div>
    </main>
  );
}

function SoftFooter() {
  return (
    <footer className="mt-10 border-t border-white/10 pt-6 text-xs leading-relaxed text-slate-500 print-hidden">
      A{" "}
      <a
        href="https://neongulf.com"
        className="text-slate-400 underline-offset-2 hover:text-cyan-200 hover:underline"
      >
        NeonGulf
      </a>{" "}
      product. Independent fan utility — not affiliated with Rockstar Games,
      Take-Two, Sony, or Microsoft. No official game assets. Soft link:{" "}
      <a
        href="https://gear.neongulf.com"
        className="text-slate-400 underline-offset-2 hover:text-cyan-200 hover:underline"
      >
        console gear guides
      </a>
      .
    </footer>
  );
}

function SummaryChips({ answers }: { answers: WizardAnswers }) {
  const chips: string[] = [];
  if (answers.console === "ps5") chips.push("PS5");
  if (answers.console === "xbox") chips.push("Xbox");
  if (answers.storage === "plenty") chips.push("Storage OK");
  if (answers.storage === "tight") chips.push("Cleanup needed");
  if (answers.storage === "need-ssd") chips.push("Needs SSD");
  if (answers.display === "tv-4k") chips.push("4K TV");
  if (answers.display === "tv-hd") chips.push("HD TV");
  if (answers.display === "monitor") chips.push("Monitor");
  if (answers.headset === "ready") chips.push("Headset ready");
  if (answers.headset === "need-one") chips.push("Needs headset");
  if (answers.headset === "speakers") chips.push("Speakers");
  if (answers.capture === "yes") chips.push("Capturing");
  if (answers.capture === "maybe") chips.push("Maybe capture");
  if (answers.capture === "no") chips.push("No capture");
  if (answers.access === "captions") chips.push("Captions");
  if (answers.access === "other") chips.push("Access comfort");
  if (answers.household === "shared-tv") chips.push("Shared TV");
  if (answers.household === "quiet-hours") chips.push("Quiet hours");
  if (answers.household === "alone") chips.push("Solo setup");
  if (answers.spoilers === "strict") chips.push("Strict spoilers");
  if (answers.spoilers === "casual") chips.push("Soft spoilers");
  if (answers.spoilers === "open") chips.push("Open feeds");
  if (answers.friends === "solo") chips.push("Solo play");
  if (answers.friends === "few") chips.push("Small group");
  if (answers.friends === "crew") chips.push("Crew");
  if (answers.midnight === "yes") chips.push("Midnight");
  if (answers.midnight === "maybe") chips.push("Flex start");
  if (answers.midnight === "no") chips.push("Morning");

  return (
    <div className="mt-4 flex flex-wrap gap-2" aria-label="Your answers">
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
