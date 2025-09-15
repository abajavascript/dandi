import { supabase } from "./supabase.js";

/**
 * Creates or updates a user in the database based on their Google OAuth data
 * @param {Object} userData - User data from Google OAuth
 * @param {string} userData.googleId - Google user ID (from token.sub)
 * @param {string} userData.email - User's email
 * @param {string} userData.name - User's full name
 * @param {string} userData.imageUrl - User's profile picture URL
 * @returns {Promise<{user: Object, isNewUser: boolean}>} - User data and whether they're new
 */
export async function createOrUpdateUser(userData) {
  try {
    const { googleId, email, name, imageUrl } = userData;

    if (!googleId || !email) {
      throw new Error("Google ID and email are required");
    }

    // First, check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("google_id", googleId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "not found" - any other error is a real problem
      throw new Error(`Error fetching user: ${fetchError.message}`);
    }

    if (existingUser) {
      // User exists - update their last login time and any changed profile data
      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({
          name: name || existingUser.name,
          image_url: imageUrl || existingUser.image_url,
          last_login_at: new Date().toISOString(),
        })
        .eq("google_id", googleId)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Error updating user: ${updateError.message}`);
      }

      console.log("✅ User login updated:", { email, name });
      return { user: updatedUser, isNewUser: false };
    } else {
      // User doesn't exist - create new user
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            google_id: googleId,
            email,
            name,
            image_url: imageUrl,
            last_login_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (insertError) {
        throw new Error(`Error creating user: ${insertError.message}`);
      }

      console.log("🎉 New user created:", { email, name });
      return { user: newUser, isNewUser: true };
    }
  } catch (error) {
    console.error("❌ Error in createOrUpdateUser:", error.message);
    throw error;
  }
}

/**
 * Gets a user by their Google ID
 * @param {string} googleId - Google user ID
 * @returns {Promise<Object|null>} - User data or null if not found
 */
export async function getUserByGoogleId(googleId) {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("google_id", googleId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Error fetching user: ${error.message}`);
    }

    return user;
  } catch (error) {
    console.error("❌ Error in getUserByGoogleId:", error.message);
    throw error;
  }
}

/**
 * Gets a user by their email
 * @param {string} email - User's email
 * @returns {Promise<Object|null>} - User data or null if not found
 */
export async function getUserByEmail(email) {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Error fetching user: ${error.message}`);
    }

    return user;
  } catch (error) {
    console.error("❌ Error in getUserByEmail:", error.message);
    throw error;
  }
}

/**
 * Updates user's last login time
 * @param {string} googleId - Google user ID
 * @returns {Promise<Object>} - Updated user data
 */
export async function updateLastLogin(googleId) {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("google_id", googleId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating last login: ${error.message}`);
    }

    return user;
  } catch (error) {
    console.error("❌ Error in updateLastLogin:", error.message);
    throw error;
  }
}
