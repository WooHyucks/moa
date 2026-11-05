import { NextResponse } from "next/server";
import { applicationSchema } from "@/lib/application-schema";
import { campaign, isCampaignOpen } from "@/lib/campaign";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET() {
  return NextResponse.json({
    campaignOpen: isCampaignOpen(),
    freeSlots: campaign.freeSlots,
    storageReady: isSupabaseConfigured(),
  });
}

export async function POST(request: Request) {
  if (!isCampaignOpen()) {
    return NextResponse.json(
      { error: "모집이 마감되었습니다." },
      { status: 403 },
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "신청 저장이 아직 준비되지 않았습니다." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "입력값을 확인해 주세요.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "신청 저장이 아직 준비되지 않았습니다." },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("applications").insert({
    partner1_name: data.partner1_name || "",
    partner2_name: data.partner2_name || "",
    anniversary_date: data.anniversary_date || null,
    story_answers: data.story_answers ?? {
      meet: "",
      memorable: "",
      grateful: "",
    },
    instagram_username: data.instagram_username,
    consent_given: true,
    consent_version: data.consent_version,
    consented_at: new Date().toISOString(),
    application_status: "pending",
    utm_source: data.utm_source || null,
    utm_campaign: data.utm_campaign || null,
  });

  if (error) {
    console.error("[applications]", error.message);
    return NextResponse.json(
      { error: "저장에 실패했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
