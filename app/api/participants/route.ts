import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST: add a new participant
export async function POST(req: Request) {
  const supabase = await createClient();
  const { competition_id, name, text } = await req.json();

  const { data, error } = await supabase
    .from("participants")
    .insert({ competition_id, name, text })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ participant: data });
}

// PATCH: update participant result after completing the test
export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { id, time_seconds, errors, wpm } = await req.json();

  const { data, error } = await supabase
    .from("participants")
    .update({ time_seconds, errors, wpm, completed: true })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ participant: data });
}
