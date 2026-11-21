export type ConsoleChoice = "ps5" | "xbox" | null;
export type StorageChoice = "plenty" | "tight" | "need-ssd" | null;
export type DisplayChoice = "tv-4k" | "tv-hd" | "monitor" | null;
export type HeadsetChoice = "ready" | "need-one" | "speakers" | null;
export type CaptureChoice = "yes" | "no" | "maybe" | null;
export type AccessChoice = "none" | "captions" | "other" | null;
export type HouseholdChoice = "alone" | "shared-tv" | "quiet-hours" | null;
export type SpoilerChoice = "strict" | "casual" | "open" | null;
export type FriendsChoice = "solo" | "few" | "crew" | null;
export type MidnightChoice = "yes" | "no" | "maybe" | null;

export interface WizardAnswers {
  console: ConsoleChoice;
  storage: StorageChoice;
  display: DisplayChoice;
  headset: HeadsetChoice;
  capture: CaptureChoice;
  access: AccessChoice;
  household: HouseholdChoice;
  spoilers: SpoilerChoice;
  friends: FriendsChoice;
  midnight: MidnightChoice;
}

export type StepId = keyof WizardAnswers;

export interface ChecklistItem {
  id: string;
  label: string;
  detail?: string;
  category: string;
}

export const EMPTY_ANSWERS: WizardAnswers = {
  console: null,
  storage: null,
  display: null,
  headset: null,
  capture: null,
  access: null,
  household: null,
  spoilers: null,
  friends: null,
  midnight: null,
};

export const ANSWER_OPTIONS: {
  [K in StepId]: readonly NonNullable<WizardAnswers[K]>[];
} = {
  console: ["ps5", "xbox"],
  storage: ["plenty", "tight", "need-ssd"],
  display: ["tv-4k", "tv-hd", "monitor"],
  headset: ["ready", "need-one", "speakers"],
  capture: ["yes", "no", "maybe"],
  access: ["none", "captions", "other"],
  household: ["alone", "shared-tv", "quiet-hours"],
  spoilers: ["strict", "casual", "open"],
  friends: ["solo", "few", "crew"],
  midnight: ["yes", "no", "maybe"],
};

export const PDF_PRICE = "$4.99";

export function isValidChoice<K extends StepId>(
  step: K,
  value: unknown,
): value is NonNullable<WizardAnswers[K]> {
  return (
    typeof value === "string" &&
    (ANSWER_OPTIONS[step] as readonly string[]).includes(value)
  );
}

export function sanitizeAnswers(raw: unknown): WizardAnswers {
  if (!raw || typeof raw !== "object") return { ...EMPTY_ANSWERS };
  const obj = raw as Record<string, unknown>;
  const out: WizardAnswers = { ...EMPTY_ANSWERS };

  for (const key of Object.keys(EMPTY_ANSWERS) as StepId[]) {
    if (isValidChoice(key, obj[key])) {
      // Validated against ANSWER_OPTIONS for this key
      (out as Record<StepId, WizardAnswers[StepId]>)[key] =
        obj[key] as WizardAnswers[StepId];
    }
  }
  return out;
}

export function answersComplete(answers: WizardAnswers): boolean {
  return (Object.keys(EMPTY_ANSWERS) as StepId[]).every(
    (key) => answers[key] !== null,
  );
}

export function firstIncompleteStep(answers: WizardAnswers): number {
  const keys = Object.keys(EMPTY_ANSWERS) as StepId[];
  const idx = keys.findIndex((key) => answers[key] === null);
  return idx === -1 ? 0 : idx;
}
