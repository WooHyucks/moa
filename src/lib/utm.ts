export type UtmParams = {
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_content?: string;
};

const KEYS = ["utm_source", "utm_campaign", "utm_medium", "utm_content"] as const;

export function readUtmFromSearch(search: string): UtmParams {
  const params = new URLSearchParams(search);
  const utm: UtmParams = {};
  for (const key of KEYS) {
    const value = params.get(key)?.trim();
    if (value) utm[key] = value;
  }
  return utm;
}

export function persistUtm(utm: UtmParams) {
  if (typeof window === "undefined") return;
  if (!Object.keys(utm).length) return;
  try {
    window.sessionStorage.setItem("moa.utm", JSON.stringify(utm));
  } catch {
    // ignore
  }
}

export function loadUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem("moa.utm");
    if (!raw) return {};
    return JSON.parse(raw) as UtmParams;
  } catch {
    return {};
  }
}
