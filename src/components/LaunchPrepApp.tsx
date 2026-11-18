"use client";

import { useMemo, useState } from "react";
import { buildChecklist, groupByCategory } from "@/lib/checklist";
import { EMPTY_ANSWERS, PDF_PRICE, type WizardAnswers } from "@/lib/types";

type StepId = keyof WizardAnswers;

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
    subtitle: "Nov 19 unlock — are you staying up?",
    options: [
      { value: "yes", label: "Yes — midnight", hint: "Session starts at unlock" },
      { value: "maybe", label: "Maybe", hint: "Depends on energy" },
      { value: "no", label: "Morning start", hint: "Sleep first" },
    ],
  },
];

export default function LaunchPrepApp() {
  const [phase, setPhase] = useState<"landing" | "wizard" | "checklist">("landing");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>(EMPTY_ANSWERS);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const items = useMemo(
    () => (phase === "checklist" ? buildChecklist(answers) : []),
    [phase, answers],
  );
  const grouped = useMemo(() => groupByCategory(items), [items]);
  const doneCount = items.filter((i) => checked[i.id]).length;

  function selectOption(stepId: StepId, value: string) {
    setAnswers((prev) => ({
      ...prev,
      [stepId]: value as WizardAnswers[StepId],
    }));
  }

  function nextStep() {
    const step = STEPS[stepIndex];
    if (!answers[step.id]) return;
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1);
      return;
    }
    setChecked({});
    setPhase("checklist");
  }

  function prevStep() {
    if (stepIndex === 0) {
      setPhase("landing");
      return;
    }
    setStepIndex((i) => i - 1);
  }

  function restart() {
    setAnswers(EMPTY_ANSWERS);
    setStepIndex(0);
    setChecked({});
    setPhase("wizard");
  }

  function printChecklist() {
    window.print();
  }

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
          <header className="mb-10 flex items-center justify-between">
            <p className="font-display text-sm tracking-[0.22em] text-cyan-200/90 uppercase">
              Launch Prep Kit
            </p>
            <p className="text-sm text-slate-400">
              Step {stepIndex + 1} / {STEPS.length}
            </p>
          </header>

          <div className="mb-8 h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="animate-rise">
            <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
              {step.title}
            </h2>
            <p className="mt-3 text-slate-300">{step.subtitle}</p>

            <div className="mt-8 grid gap-3">
              {step.options.map((opt) => {
                const selected = currentValue === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => selectOption(step.id, opt.value)}
                    className={`group flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition-all duration-200 ${
                      selected
                        ? "border-cyan-300/60 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(103,232,249,0.25)]"
                        : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/8"
                    }`}
                  >
                    <span>
                      <span className="block font-medium text-white">{opt.label}</span>
                      <span className="mt-1 block text-sm text-slate-400">{opt.hint}</span>
                    </span>
                    <span
                      className={`ml-4 h-4 w-4 shrink-0 rounded-full border-2 transition-colors ${
                        selected
                          ? "border-cyan-300 bg-cyan-300"
                          : "border-slate-500 group-hover:border-slate-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 pt-12">
            <button type="button" onClick={prevStep} className="btn-ghost">
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              disabled={!currentValue}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              {stepIndex === STEPS.length - 1 ? "Build checklist" : "Continue"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Checklist phase
  const consoleLabel =
    answers.console === "ps5"
      ? "PS5"
      : answers.console === "xbox"
        ? "Xbox"
        : "Console";

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Atmosphere />
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-10 sm:px-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <p className="font-display text-sm tracking-[0.22em] text-cyan-200/90 uppercase">
            Launch Prep Kit
          </p>
          <button type="button" onClick={restart} className="btn-ghost text-sm">
            Start over
          </button>
        </header>

        <div className="print-sheet rounded-3xl border border-white/10 bg-[#071018]/90 p-6 shadow-2xl backdrop-blur-md sm:p-10">
          <div className="border-b border-white/10 pb-6">
            <p className="font-display text-xs tracking-[0.2em] text-cyan-200/80 uppercase print:text-teal-700">
              Your personalized checklist
            </p>
            <h2 className="mt-2 font-display text-3xl tracking-tight text-white print:text-slate-900 sm:text-4xl">
              {consoleLabel} launch prep
            </h2>
            <p className="mt-2 text-slate-300 print:text-slate-600">
              {doneCount} of {items.length} done · tailored from your wizard answers
            </p>
            <SummaryChips answers={answers} />
          </div>

          <div className="mt-8 space-y-8">
            {Object.entries(grouped).map(([category, catItems]) => (
              <section key={category}>
                <h3 className="font-display text-sm tracking-[0.18em] text-teal-200/90 uppercase print:text-teal-800">
                  {category}
                </h3>
                <ul className="mt-3 space-y-3">
                  {catItems.map((item) => {
                    const isOn = !!checked[item.id];
                    return (
                      <li key={item.id}>
                        <label className="flex cursor-pointer gap-3 rounded-xl border border-transparent px-2 py-2 transition hover:border-white/10 hover:bg-white/5 print:hover:bg-transparent">
                          <input
                            type="checkbox"
                            checked={isOn}
                            onChange={() =>
                              setChecked((prev) => ({
                                ...prev,
                                [item.id]: !prev[item.id],
                              }))
                            }
                            className="mt-1 h-4 w-4 accent-cyan-400"
                          />
                          <span>
                            <span
                              className={`block font-medium ${
                                isOn
                                  ? "text-slate-400 line-through"
                                  : "text-white print:text-slate-900"
                              }`}
                            >
                              {item.label}
                            </span>
                            {item.detail ? (
                              <span className="mt-1 block text-sm text-slate-400 print:text-slate-600">
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
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 print:hidden sm:flex-row sm:items-center">
            <button type="button" onClick={printChecklist} className="btn-primary">
              Print / Save as PDF
            </button>
            <button
              type="button"
              disabled
              title="Payments coming soon — Stripe / Lemon Squeezy stub"
              className="btn-locked"
            >
              Unlock PDF — {PDF_PRICE}
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-500 print:hidden">
            Browser print works now. Paid unlock is a stub for the MVP — button stays
            disabled until checkout is wired.
          </p>
        </div>

        <footer className="mt-10 border-t border-white/10 pt-6 text-xs leading-relaxed text-slate-500 print:hidden">
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
    <div className="mt-4 flex flex-wrap gap-2 print:gap-1">
      {chips.map((chip) => (
        <span
          key={chip}
          className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100 print:border-teal-700/30 print:bg-teal-50 print:text-teal-900"
        >
          {chip}
        </span>
      ))}
    </div>
  );
}

function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 print:hidden">
      <div className="absolute inset-0 bg-[#040b12]" />
      <div className="absolute -left-24 top-0 h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.22),transparent_65%)] blur-2xl" />
      <div className="absolute -right-16 bottom-0 h-[55vh] w-[55vh] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.18),transparent_60%)] blur-2xl" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(2,12,20,0.9),transparent)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:48px_48px]" />
    </div>
  );
}
