"use client";

import * as amplitude from "@amplitude/analytics-browser";

let apiKey = "";
let ready = false;

export function initAmplitude(key?: string) {
  if (typeof window === "undefined") return;
  if (key) apiKey = key;
  if (ready || !apiKey) return;
  amplitude.init(apiKey, {
    autocapture: {
      sessions: true,
      pageViews: false,
      formInteractions: false,
      fileDownloads: false,
      elementInteractions: false,
    },
  });
  ready = true;
}

export function track(
  event: string,
  props?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined" || !apiKey) return;
  if (!ready) initAmplitude();
  amplitude.track(event, props);
}

export function identifyInstagram(instagramId: string) {
  if (typeof window === "undefined" || !apiKey) return;
  if (!ready) initAmplitude();
  amplitude.setUserId(`ig:${instagramId}`);
  const identify = new amplitude.Identify().set("instagram_id", instagramId);
  amplitude.identify(identify);
}
