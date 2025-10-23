import * as AuthRepository from "../repositories/authRepository.mjs";

// Register
export async function register(email, password, username, name) {
  try {
    // Convert email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    const { data: existingUser, error: usernameError } =
      await AuthRepository.checkUsernameExists(username);

    if (usernameError) throw new Error("Database error during username check");

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      throw new Error("Username already exists");
    }

    const { data: authData, error: supabaseError } =
      await AuthRepository.createAuthUser(normalizedEmail, password);

    if (supabaseError) {
      console.error("Supabase auth error:", supabaseError);

      if (
        supabaseError.message.includes("User already registered") ||
        supabaseError.message.includes("duplicate key value") ||
        supabaseError.message.includes("already exists")
      ) {
        throw new Error("Email already exists");
      }

      throw new Error("Failed to create user. Please try again.");
    }
    const supabaseUserId = authData.user.id;

    const { data: newUser, error: insertError } =
      await AuthRepository.createUserProfile({
        id: supabaseUserId,
        username: username,
        name: name,
        role: "user",
      });

    if (insertError) {
      throw new Error("Failed to create user profile");
    }

    return {
      success: true,
      message: "User created successfully",
      user: newUser,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Login
export async function login(email, password) {
  try {
    // Convert email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    const { data, error } = await AuthRepository.signIn(
      normalizedEmail,
      password
    );

    if (error) {
      if (
        error.code === "invalid_credentials" ||
        error.message.includes("Invalid login credentials")
      ) {
        throw new Error(
          "Your password is incorrect or this email doesn't exist"
        );
      }
      throw new Error(error.message);
    }

    return {
      success: true,
      message: "Signed in successfully",
      access_token: data.session.access_token,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Get User
export async function getUser(userId, email) {
  try {
    if (!userId) {
      throw new Error("Unauthorized: User ID missing");
    }

    const { data: userData, error: userError } =
      await AuthRepository.getUserById(userId);

    if (userError || !userData) {
      throw new Error("User not found in database");
    }

    return {
      success: true,
      user: {
        id: userData.id,
        email: email,
        username: userData.username,
        bio: userData.bio,
        name: userData.name,
        role: userData.role,
        profilePic: userData.profile_pic,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Reset Password
export async function resetPassword(userId, email, oldPassword, newPassword) {
  try {
    if (!userId) {
      throw new Error("Unauthorized: User ID missing");
    }

    if (!email) {
      throw new Error("Email is required");
    }

    if (!newPassword) {
      throw new Error("New password is required");
    }

    const { error: loginError } = await AuthRepository.verifyPassword(
      email,
      oldPassword
    );
    if (loginError) {
      throw new Error("Invalid old password");
    }

    const { data, error } = await AuthRepository.updatePassword(newPassword);
    if (error) {
      throw new Error(error.message);
    }

    const { data: newSession, error: sessionError } =
      await AuthRepository.signIn(email, newPassword);

    if (sessionError) {
      throw new Error("Failed to refresh session after password update");
    }

    return {
      success: true,
      message: "Password updated successfully",
      access_token: newSession.session.access_token,
      user: newSession.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Update Profile
export async function updateAdminProfile(userId, name, username, bio, imageUrl) {
  try {
    if (!userId) {
      throw new Error("Unauthorized: User ID missing");
    }

    const updateData = {
      name: name,
      username: username,
      bio: bio,
    };
    if (imageUrl !== null) {
      updateData.profile_pic = imageUrl;
    }
    const { data: updatedUser, error: updateError } =
      await AuthRepository.updateProfile(userId, updateData);

    if (updateError || !updatedUser) {
      throw new Error("User not found");
    }
    return {
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        name: updatedUser.name,
        role: updatedUser.role,
        profilePic: updatedUser.profile_pic,
        bio: updatedUser.bio,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Update User Profile
export async function updateUserProfile(userId, name, username, imageUrl) {
  try {
    if (!userId) {
      throw new Error("Unauthorized: User ID missing");
    }

    const updateData = {
      name: name,
      username: username,
    };
    if (imageUrl !== null) {
      updateData.profile_pic = imageUrl;
    }
    const { data: updatedUser, error: updateError } =
      await AuthRepository.updateProfile(userId, updateData);

    if (updateError || !updatedUser) {
      throw new Error("User not found");
    }
    return {
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        name: updatedUser.name,
        profilePic: updatedUser.profile_pic,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
