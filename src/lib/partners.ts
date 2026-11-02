import type { Partner } from "@/lib/types";

export function selfPartner(partners: Partner[]) {
  return partners.find((partner) => partner.isSelf) ?? null;
}

export function otherPartner(partners: Partner[]) {
  return partners.find((partner) => !partner.isSelf) ?? null;
}

export function displayNames(partners: Partner[]) {
  const mine = selfPartner(partners);
  const theirs = otherPartner(partners);
  if (!mine || !theirs) return "우리";
  return `${mine.name} 그리고 ${theirs.name}`;
}

export function initialOf(name?: string) {
  const trimmed = name?.trim();
  return trimmed ? trimmed.slice(0, 1) : "우";
}
