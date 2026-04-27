export type PhoneRegionOption = {
  code: string;
  label: string;
  name: string;
};

export const PHONE_REGION_OPTIONS: PhoneRegionOption[] = [
  { code: "+94", label: "LK +94", name: "Sri Lanka" },
  { code: "+370", label: "LT +370", name: "Lithuania" },
  { code: "+91", label: "IN +91", name: "India" },
  { code: "+971", label: "AE +971", name: "UAE" },
  { code: "+44", label: "UK +44", name: "United Kingdom" },
  { code: "+1", label: "US +1", name: "United States" },
  { code: "+49", label: "DE +49", name: "Germany" },
  { code: "+33", label: "FR +33", name: "France" },
  { code: "+39", label: "IT +39", name: "Italy" },
  { code: "+34", label: "ES +34", name: "Spain" },
  { code: "+31", label: "NL +31", name: "Netherlands" },
  { code: "+46", label: "SE +46", name: "Sweden" },
  { code: "+47", label: "NO +47", name: "Norway" },
  { code: "+45", label: "DK +45", name: "Denmark" },
  { code: "+358", label: "FI +358", name: "Finland" },
  { code: "+48", label: "PL +48", name: "Poland" },
  { code: "+61", label: "AU +61", name: "Australia" },
  { code: "+65", label: "SG +65", name: "Singapore" },
  { code: "+60", label: "MY +60", name: "Malaysia" },
  { code: "+66", label: "TH +66", name: "Thailand" },
  { code: "+81", label: "JP +81", name: "Japan" },
  { code: "+82", label: "KR +82", name: "South Korea" },
  { code: "+86", label: "CN +86", name: "China" },
  { code: "+7", label: "KZ/RU +7", name: "Kazakhstan / Russia" },
  { code: "+27", label: "ZA +27", name: "South Africa" },
  { code: "+20", label: "EG +20", name: "Egypt" },
  { code: "+974", label: "QA +974", name: "Qatar" },
  { code: "+966", label: "SA +966", name: "Saudi Arabia" },
];

export const SORTED_PHONE_REGION_OPTIONS = [...PHONE_REGION_OPTIONS].sort(
  (a, b) => a.name.localeCompare(b.name),
);

export const DEFAULT_PHONE_REGION = PHONE_REGION_OPTIONS[0].code;

export const normalizePhoneDigits = (value: string) => value.replace(/\D/g, "");

export const normalizeRegionCode = (value: string) => {
  const digits = normalizePhoneDigits(value);
  return digits ? `+${digits}` : "";
};

export const combinePhoneNumber = (regionCode: string, localNumber: string) => {
  const normalizedRegion = normalizeRegionCode(regionCode);
  const normalizedLocal = normalizePhoneDigits(localNumber).replace(/^0+/, "");

  if (!normalizedLocal) {
    return "";
  }

  return `${normalizedRegion}${normalizedLocal}`;
};

export const splitPhoneNumber = (phone: string | null | undefined) => {
  const raw = (phone || "").trim();

  if (!raw) {
    return {
      regionCode: DEFAULT_PHONE_REGION,
      localNumber: "",
    };
  }

  const compact = raw.replace(/[\s()-]/g, "");
  const matchedRegion = [...PHONE_REGION_OPTIONS]
    .sort((a, b) => b.code.length - a.code.length)
    .find((option) => compact.startsWith(option.code));

  if (matchedRegion) {
    return {
      regionCode: matchedRegion.code,
      localNumber: compact.slice(matchedRegion.code.length),
    };
  }

  return {
    regionCode: DEFAULT_PHONE_REGION,
    localNumber: normalizePhoneDigits(compact),
  };
};
