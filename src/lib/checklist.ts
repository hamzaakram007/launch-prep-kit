import type { ChecklistItem, WizardAnswers } from "./types";

export function buildChecklist(answers: WizardAnswers): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  const consoleLabel =
    answers.console === "ps5"
      ? "PlayStation 5"
      : answers.console === "xbox"
        ? "Xbox Series X|S"
        : "your console";

  items.push({
    id: "update-console",
    category: "Console",
    label: `Update ${consoleLabel} system software`,
    detail: "Install the latest OS update before launch night so you are not stuck in a download queue.",
  });

  items.push({
    id: "power-cable",
    category: "Console",
    label: "Check power brick / outlet and HDMI cable",
    detail: "Use a free wall outlet if you can. Avoid daisy-chained power strips for long sessions.",
  });

  if (answers.console === "ps5") {
    items.push({
      id: "ps-rest-mode",
      category: "Console",
      label: "Turn on Rest Mode + auto-download",
      detail: "Pre-loads and patches can finish while the console sleeps.",
    });
    items.push({
      id: "ps-account",
      category: "Accounts",
      label: "Confirm PlayStation Network sign-in + 2FA recovery codes",
    });
  }

  if (answers.console === "xbox") {
    items.push({
      id: "xbox-quick-resume",
      category: "Console",
      label: "Clear space for Quick Resume if you leave other titles suspended",
    });
    items.push({
      id: "xbox-account",
      category: "Accounts",
      label: "Confirm Xbox network sign-in + payment method on the console",
    });
  }

  items.push({
    id: "official-store",
    category: "Purchase",
    label: "Buy or redeem only from the official console store / retailer",
    detail: "No PC build is announced for launch. Skip random download links.",
  });

  if (answers.storage === "plenty") {
    items.push({
      id: "storage-verify",
      category: "Storage",
      label: "Double-check free space covers the full install + day-one patch",
      detail: "Leave a buffer for captures and temporary updates.",
    });
  }

  if (answers.storage === "tight") {
    items.push({
      id: "storage-cleanup",
      category: "Storage",
      label: "Delete or archive games you will not play this week",
      detail: "Aim for a comfortable buffer beyond the base install size.",
    });
    items.push({
      id: "storage-external",
      category: "Storage",
      label: "Move older titles to external storage (if your console allows)",
    });
  }

  if (answers.storage === "need-ssd") {
    items.push({
      id: "storage-ssd",
      category: "Storage",
      label: "Order / install a console-compatible expansion SSD before launch",
      detail: "Confirm the drive is on your console maker’s compatibility list.",
    });
    items.push({
      id: "storage-format",
      category: "Storage",
      label: "Format the new drive and migrate at least one large game as a test",
    });
  }

  if (answers.headset === "ready") {
    items.push({
      id: "headset-charge",
      category: "Audio",
      label: "Charge your headset and pair it tonight",
    });
    items.push({
      id: "headset-levels",
      category: "Audio",
      label: "Set chat / game balance so dialogue stays clear",
    });
  }

  if (answers.headset === "need-one") {
    items.push({
      id: "headset-buy",
      category: "Audio",
      label: "Pick a headset that keeps story dialogue readable",
      detail: "Console-native USB / wireless is simplest for launch night.",
    });
  }

  if (answers.headset === "speakers") {
    items.push({
      id: "speakers-tv",
      category: "Audio",
      label: "Test TV / soundbar volume and night-mode settings",
      detail: "Neighbors matter if you are starting at midnight.",
    });
  }

  if (answers.friends === "solo") {
    items.push({
      id: "friends-spoiler",
      category: "Social",
      label: "Mute spoiler-heavy group chats for launch week",
    });
  }

  if (answers.friends === "few") {
    items.push({
      id: "friends-sync",
      category: "Social",
      label: "Agree on a spoiler rule with your small group",
      detail: "Story titles stay blurred until everyone clears the same chapter.",
    });
    items.push({
      id: "friends-invite",
      category: "Social",
      label: "Confirm friend codes / gamertags work on this console",
    });
  }

  if (answers.friends === "crew") {
    items.push({
      id: "friends-channel",
      category: "Social",
      label: "Create a launch chat channel with spoiler roles",
    });
    items.push({
      id: "friends-schedule",
      category: "Social",
      label: "Share a rough play-session window so nobody waits alone",
    });
  }

  if (answers.midnight === "yes") {
    items.push({
      id: "midnight-sleep",
      category: "Launch night",
      label: "Plan a short nap or caffeine cutoff so you stay sharp",
    });
    items.push({
      id: "midnight-snacks",
      category: "Launch night",
      label: "Stock water + easy snacks within arm’s reach",
    });
    items.push({
      id: "midnight-queue",
      category: "Launch night",
      label: "Start the install / unlock early so you are not mid-download at 12:01",
    });
  }

  if (answers.midnight === "maybe") {
    items.push({
      id: "midnight-flex",
      category: "Launch night",
      label: "Keep a backup morning start plan if midnight slips",
    });
  }

  if (answers.midnight === "no") {
    items.push({
      id: "midnight-morning",
      category: "Launch night",
      label: "Pre-download overnight and start fresh in the morning",
    });
  }

  items.push({
    id: "controller-charge",
    category: "Launch night",
    label: "Fully charge controllers + spare batteries",
  });

  items.push({
    id: "spoiler-shield",
    category: "Spoilers",
    label: "Mute YouTube / Reddit keywords for story beats you have not reached",
  });

  items.push({
    id: "break-timer",
    category: "Health",
    label: "Set a stretch / eye-break reminder every hour",
  });

  return items;
}

export function groupByCategory(items: ChecklistItem[]): Record<string, ChecklistItem[]> {
  return items.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});
}
