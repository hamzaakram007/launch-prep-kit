import type { ChecklistItem, WizardAnswers } from "./types";
import { answersComplete } from "./types";

export function buildChecklist(answers: WizardAnswers): ChecklistItem[] {
  if (!answersComplete(answers)) return [];

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
    detail:
      "Install the latest OS update before launch night so you are not stuck in a download queue.",
  });

  items.push({
    id: "power-cable",
    category: "Console",
    label: "Check power brick / outlet and HDMI cable",
    detail:
      "Use a free wall outlet if you can. Avoid daisy-chained power strips for long sessions.",
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

  if (answers.display === "tv-4k") {
    items.push({
      id: "display-hdr",
      category: "TV / display",
      label: "Confirm HDMI port, HDR, and game mode on your 4K TV",
      detail: "Use the HDMI port labeled for gaming / ARC when possible.",
    });
    items.push({
      id: "display-vrr",
      category: "TV / display",
      label: "Turn on ALLM / VRR if your TV supports it",
    });
  }

  if (answers.display === "tv-hd") {
    items.push({
      id: "display-hd-mode",
      category: "TV / display",
      label: "Set the console to a stable HD output your TV handles cleanly",
      detail: "Prefer a sharp 1080p over a shaky upscaled picture.",
    });
    items.push({
      id: "display-cable",
      category: "TV / display",
      label: "Swap in a known-good HDMI cable if the picture flickers",
    });
  }

  if (answers.display === "monitor") {
    items.push({
      id: "display-monitor",
      category: "TV / display",
      label: "Match console resolution / refresh to your monitor’s native mode",
    });
    items.push({
      id: "display-audio-path",
      category: "TV / display",
      label: "Confirm audio path (monitor speakers, headset, or DAC)",
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

  if (answers.capture === "yes") {
    items.push({
      id: "capture-space",
      category: "Capture",
      label: "Reserve extra storage for clips and screenshots",
    });
    items.push({
      id: "capture-settings",
      category: "Capture",
      label: "Set clip length / quality so you do not fill the drive mid-session",
    });
  }

  if (answers.capture === "maybe") {
    items.push({
      id: "capture-ready",
      category: "Capture",
      label: "Learn the capture shortcut now — do not hunt for it mid-scene",
    });
  }

  if (answers.capture === "no") {
    items.push({
      id: "capture-off",
      category: "Capture",
      label: "Turn off auto-capture if you want every free gigabyte for the game",
    });
  }

  if (answers.access === "captions") {
    items.push({
      id: "access-captions",
      category: "Accessibility",
      label: "Enable captions / subtitles in system and in-game menus",
    });
    items.push({
      id: "access-text-size",
      category: "Accessibility",
      label: "Bump text size / contrast if your console offers it",
    });
  }

  if (answers.access === "other") {
    items.push({
      id: "access-remap",
      category: "Accessibility",
      label: "Check button remapping, aim assist, and vibration comfort options",
    });
    items.push({
      id: "access-breaks",
      category: "Accessibility",
      label: "Plan seated posture + stretch breaks that work for your body",
    });
  }

  if (answers.access === "none") {
    items.push({
      id: "access-quick",
      category: "Accessibility",
      label: "Skim accessibility toggles once — leave useful defaults on",
    });
  }

  if (answers.household === "alone") {
    items.push({
      id: "house-alone",
      category: "Household",
      label: "Claim the living-room / desk setup so nobody unplugs mid-download",
    });
  }

  if (answers.household === "shared-tv") {
    items.push({
      id: "house-shared",
      category: "Household",
      label: "Agree who gets the TV for launch night and for how long",
      detail: "Write the window down so nobody is surprised.",
    });
    items.push({
      id: "house-alt",
      category: "Household",
      label: "Have a backup screen (bedroom TV / monitor) if plans slip",
    });
  }

  if (answers.household === "quiet-hours") {
    items.push({
      id: "house-quiet",
      category: "Household",
      label: "Set headphones + night volume before midnight unlock",
    });
    items.push({
      id: "house-notify",
      category: "Household",
      label: "Tell housemates the start time so late noise is not a surprise",
    });
  }

  if (answers.spoilers === "strict") {
    items.push({
      id: "spoiler-mute",
      category: "Spoilers",
      label: "Mute YouTube, Reddit, and group chats for story keywords",
    });
    items.push({
      id: "spoiler-feeds",
      category: "Spoilers",
      label: "Hide trending / For You feeds that surface thumbnails",
    });
  }

  if (answers.spoilers === "casual") {
    items.push({
      id: "spoiler-soft",
      category: "Spoilers",
      label: "Ask friends to mark story posts before they share",
    });
  }

  if (answers.spoilers === "open") {
    items.push({
      id: "spoiler-open",
      category: "Spoilers",
      label: "Still skip fake “leaked ending” videos — they are usually scams",
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
      category: "Launch day",
      label: "Plan a short nap or caffeine cutoff so you stay sharp",
    });
    items.push({
      id: "midnight-snacks",
      category: "Launch day",
      label: "Stock water + easy snacks within arm’s reach",
    });
    items.push({
      id: "midnight-queue",
      category: "Launch day",
      label: "Start the install / unlock early so you are not mid-download at 12:01",
    });
  }

  if (answers.midnight === "maybe") {
    items.push({
      id: "midnight-flex",
      category: "Launch day",
      label: "Keep a backup morning start plan if midnight slips",
    });
  }

  if (answers.midnight === "no") {
    items.push({
      id: "midnight-morning",
      category: "Launch day",
      label: "Pre-download overnight and start fresh in the morning",
    });
  }

  items.push({
    id: "controller-charge",
    category: "Launch day",
    label: "Fully charge controllers + spare batteries",
  });

  items.push({
    id: "break-timer",
    category: "Health",
    label: "Set a stretch / eye-break reminder every hour",
  });

  return items;
}

export function groupByCategory(
  items: ChecklistItem[],
): Record<string, ChecklistItem[]> {
  return items.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});
}
