import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const apiFormData = new FormData();
    apiFormData.append("media", file);
    apiFormData.append("models", "genai");

    // Grabs your new Sightengine credentials from .env.local
    apiFormData.append("api_user", process.env.SIGHTENGINE_API_USER);
    apiFormData.append("api_secret", process.env.SIGHTENGINE_API_SECRET);

    // Fetches from Sightengine, not Eden AI
    const response = await fetch("https://api.sightengine.com/1.0/check.json", {
      method: "POST",
      body: apiFormData,
    });

    const data = await response.json();

    if (data.status !== "success") {
      console.error("Sightengine Error:", data);
      return NextResponse.json(
        { error: data.error?.message || "Analysis failed." },
        { status: 500 },
      );
    }

    const aiScore = data.type.ai_generated;
    const isAi = aiScore > 0.5;
    const confidence = (aiScore * 100).toFixed(2);

    return NextResponse.json({
      isAi: isAi,
      confidence: confidence,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
