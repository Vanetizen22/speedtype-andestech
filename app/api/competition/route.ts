import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET: fetch the latest active competition and its participants
export async function GET() {
  const supabase = await createClient();

  const { data: competition, error: compError } = await supabase
    .from("competitions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (compError || !competition) {
    return NextResponse.json({ competition: null, participants: [] });
  }

  const { data: participants, error: partError } = await supabase
    .from("participants")
    .select("*")
    .eq("competition_id", competition.id)
    .order("created_at", { ascending: true });

  if (partError) {
    return NextResponse.json({ competition, participants: [] });
  }

  return NextResponse.json({ competition, participants: participants ?? [] });
}

// POST: create a new competition
export async function POST() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("competitions")
    .insert({ name: "Competencia SpeedType" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ competition: data });
}

// DELETE: reset competition (delete all participants, keep competition row)
export async function DELETE(req: Request) {
  const supabase = await createClient();
  const { competitionId } = await req.json();

  const { error } = await supabase
    .from("participants")
    .delete()
    .eq("competition_id", competitionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
