import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string | null;

    if (!file || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing file or userId" }),
        { status: 400 }
      );
    }

    const filePath = `${userId}/${file.name}`;

    // Convert File to Blob -> ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const { data, error } = await supabaseAdmin.storage
      .from("avatar")
      .upload(filePath, new Uint8Array(arrayBuffer), { upsert: true });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage
      .from("avatar")
      .getPublicUrl(filePath);

    return new Response(JSON.stringify({ publicUrl: urlData.publicUrl }), { status: 200 });
  } catch (err) {
  const error = err instanceof Error ? err.message : String(err);
  return new Response(JSON.stringify({ error }), { status: 500 });
}
}