export type ConsoleChoice = "ps5" | "xbox" | null;
export type StorageChoice = "plenty" | "tight" | "need-ssd" | null;
export type HeadsetChoice = "ready" | "need-one" | "speakers" | null;
export type FriendsChoice = "solo" | "few" | "crew" | null;
export type MidnightChoice = "yes" | "no" | "maybe" | null;

export interface WizardAnswers {
  console: ConsoleChoice;
  storage: StorageChoice;
  headset: HeadsetChoice;
  friends: FriendsChoice;
  midnight: MidnightChoice;
}

export interface ChecklistItem {
  id: string;
  label: string;
  detail?: string;
  category: string;
}

export const EMPTY_ANSWERS: WizardAnswers = {
  console: null,
  storage: null,
  headset: null,
  friends: null,
  midnight: null,
};

export const PDF_PRICE = "$4.99";
