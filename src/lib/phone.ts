export interface FormattedJordanPhone {
  raw: string;
  local: string; // e.g. "0782347865"
  international: string; // e.g. "+962782347865"
  carrier: "Zain" | "Orange" | "Umniah" | "Unknown";
  isValid: boolean;
}

export function formatJordanPhone(input: string): FormattedJordanPhone {
  if (!input) {
    return {
      raw: "",
      local: "",
      international: "",
      carrier: "Unknown",
      isValid: false,
    };
  }

  // Remove all non-digits except leading +
  let cleaned = input.trim().replace(/[^\d+]/g, "");

  // Convert +962... or 00962... to local 07...
  if (cleaned.startsWith("+962")) {
    cleaned = "0" + cleaned.slice(4);
  } else if (cleaned.startsWith("00962")) {
    cleaned = "0" + cleaned.slice(5);
  } else if (cleaned.startsWith("962")) {
    cleaned = "0" + cleaned.slice(3);
  } else if (cleaned.startsWith("7") && cleaned.length === 9) {
    cleaned = "0" + cleaned;
  }

  // Check valid Jordan mobile prefixes: 079 (Zain), 077 (Orange), 078 (Umniah)
  const isValid = /^07[789]\d{7}$/.test(cleaned);

  let carrier: FormattedJordanPhone["carrier"] = "Unknown";
  if (cleaned.startsWith("079")) carrier = "Zain";
  else if (cleaned.startsWith("077")) carrier = "Orange";
  else if (cleaned.startsWith("078")) carrier = "Umniah";

  const local = isValid ? cleaned : input.trim();
  const international = isValid ? "+962" + cleaned.slice(1) : input.trim();

  return {
    raw: input,
    local,
    international,
    carrier,
    isValid,
  };
}
