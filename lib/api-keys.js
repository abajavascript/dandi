import { supabase } from "./supabase";

/**
 * Database Schema for api_keys table:
 *
 * CREATE TABLE api_keys (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   description TEXT,
 *   permissions TEXT NOT NULL DEFAULT 'read',
 *   usage_limit INTEGER DEFAULT 1000,
 *   api_key TEXT NOT NULL UNIQUE,
 *   is_active BOOLEAN DEFAULT true,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   last_used TIMESTAMP WITH TIME ZONE,
 *   user_id UUID REFERENCES auth.users(id) -- Optional: for user-specific keys
 * );
 *
 * -- Create indexes for better performance
 * CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
 * CREATE INDEX idx_api_keys_is_active ON api_keys(is_active);
 */

// Generate a random API key
export const generateApiKey = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "dandi-";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Get all API keys
export const getApiKeys = async (userId = null) => {
  try {
    let query = supabase
      .from("api_keys")
      .select("*")
      .order("created_at", { ascending: false });

    // If userId is provided, filter by user
    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return { data: null, error: error.message };
  }
};

// Create a new API key
export const createApiKey = async (keyData, userId = null) => {
  try {
    const newKey = {
      name: keyData.name,
      description: keyData.description || "",
      permissions: keyData.permissions || "read",
      usage_limit: parseInt(keyData.usageLimit) || 1000,
      api_key: generateApiKey(),
      is_active: true,
      user_id: userId,
    };

    const { data, error } = await supabase
      .from("api_keys")
      .insert([newKey])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error creating API key:", error);
    return { data: null, error: error.message };
  }
};

// Update an API key
export const updateApiKey = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from("api_keys")
      .update({
        name: updates.name,
        description: updates.description,
        permissions: updates.permissions,
        usage_limit: parseInt(updates.usageLimit) || 1000,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating API key:", error);
    return { data: null, error: error.message };
  }
};

// Delete an API key
export const deleteApiKey = async (id) => {
  try {
    const { error } = await supabase.from("api_keys").delete().eq("id", id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error("Error deleting API key:", error);
    return { error: error.message };
  }
};

// Toggle API key status
export const toggleApiKeyStatus = async (id, isActive) => {
  try {
    const { data, error } = await supabase
      .from("api_keys")
      .update({ is_active: isActive })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error toggling API key status:", error);
    return { data: null, error: error.message };
  }
};

// Update last used timestamp
export const updateLastUsed = async (id) => {
  try {
    const { data, error } = await supabase
      .from("api_keys")
      .update({ last_used: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating last used:", error);
    return { data: null, error: error.message };
  }
};

// Validate API key against Supabase table
export const validateApiKey = async (apiKey) => {
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
