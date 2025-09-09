import { supabase } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

// Update last_used timestamp for API key
const updateLastUsed = async (keyId) => {
  try {
    const { error } = await supabase
      .from("api_keys")
      .update({ last_used: new Date().toISOString() })
      .eq("id", keyId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error updating last_used:", error);
    return { error: error.message };
  }
};

// Validate API key against Supabase table
const validateApiKey = async (apiKey) => {
  try {
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, name, is_active")
      .eq("api_key", apiKey)
      .eq("is_active", true)
      .single();

    if (error) {
      // If no matching record found, it's invalid
      if (error.code === "PGRST116") {
        return { isValid: false, error: null };
      }
      throw error;
    }

    // If we get here, the key exists and is active
    // Update the last_used timestamp
    if (data) {
      await updateLastUsed(data.id);
    }

    return { isValid: true, keyData: data, error: null };
  } catch (error) {
    console.error("Error validating API key:", error);
    return { isValid: false, error: error.message, keyData: null };
  }
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { isValid: false, error: "API key is required" },
        { status: 400 }
      );
    }

    const result = await validateApiKey(apiKey);

    return NextResponse.json(result, {
      status: result.isValid ? 200 : 401,
    });
  } catch (error) {
    console.error("Error in validate-api-key endpoint:", error);
    return NextResponse.json(
      { isValid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Also support GET requests for easier testing
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get("apiKey");

  if (!apiKey) {
    return NextResponse.json(
      { isValid: false, error: "API key is required" },
      { status: 400 }
    );
  }

  const result = await validateApiKey(apiKey);

  return NextResponse.json(result, {
    status: result.isValid ? 200 : 401,
  });
}
