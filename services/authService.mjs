import * as AuthRepository from "../repositories/authRepository.mjs";

// Register
export async function register(email, password, username, name) {
  try {
    // Business logic: Check if username already exists
    const { data: existingUser, error: usernameError } =
      await AuthRepository.checkUsernameExists(username);

    if (usernameError) {
      throw new Error("Database error during username check");
    }

    if (existingUser && existingUser.length > 0) {
      throw new Error("This username is already taken");
    }

    // Call Repository: Create auth user
    const { data: authData, error: supabaseError } =
      await AuthRepository.createAuthUser(email, password);

    if (supabaseError) {
      if (supabaseError.code === "user_already_exists") {
        throw new Error("User with this email already exists");
      }
      throw new Error("Failed to create user. Please try again.");
    }

    const supabaseUserId = authData.user.id;

    // Call Repository: Create user profile
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
    // Call Repository
    const { data, error } = await AuthRepository.signIn(email, password);

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
export async function getUser(token) {
  try {
    if (!token) {
      throw new Error("Unauthorized: Token missing");
    }

    // Call Repository: Get user from token
    const { data, error } = await AuthRepository.getUserFromToken(token);
    if (error) {
      throw new Error("Unauthorized or token expired");
    }

    const supabaseUserId = data.user.id;
    
    // Call Repository: Get user profile
    const { data: userData, error: userError } =
      await AuthRepository.getUserById(supabaseUserId);

    if (userError || !userData) {
      throw new Error("User not found in database");
    }

    // Business logic: Format user data
    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
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
export async function resetPassword(token, oldPassword, newPassword) {
  try {
    if (!token) {
      throw new Error("Unauthorized: Token missing");
    }

    if (!newPassword) {
      throw new Error("New password is required");
    }

    // Call Repository: Get user from token
    const { data: userData, error: userError } =
      await AuthRepository.getUserFromToken(token);
    if (userError) {
      throw new Error("Unauthorized: Invalid token");
    }

    // Call Repository: Verify old password
    const { error: loginError } = await AuthRepository.verifyPassword(
      userData.user.email,
      oldPassword
    );
    if (loginError) {
      throw new Error("Invalid old password");
    }

    // Call Repository: Update password
    const { data, error } = await AuthRepository.updatePassword(newPassword);
    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: "Password updated successfully",
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Update Profile
export async function updateProfile(token, name, username, bio, imageUrl) {
  try {
    if (!token) {
      throw new Error("Unauthorized: Token missing");
    }

    // Call Repository: Get user from token
    const { data: userData, error: userError } =
      await AuthRepository.getUserFromToken(token);
    if (userError) {
      throw new Error("Unauthorized: Invalid token");
    }

    const supabaseUserId = userData.user.id;

    // Business logic: Prepare update data
    const updateData = {
      name: name,
      username: username,
      bio: bio,
    };

    // Add profile_pic only when there's a new image
    if (imageUrl !== null) {
      updateData.profile_pic = imageUrl;
    }

    // Call Repository: Update user profile
    const { data: updatedUser, error: updateError } =
      await AuthRepository.updateUserProfile(supabaseUserId, updateData);

    if (updateError || !updatedUser) {
      throw new Error("User not found");
    }

    // Business logic: Format response data
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

// Login
export async function login(email, password) {
  try {
    const { data, error } = await AuthRepository.signIn(email, password);

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
export async function getUser(token) {
  try {
    if (!token) {
      throw new Error("Unauthorized: Token missing");
    }

    const { data, error } = await AuthRepository.getUserFromToken(token);
    if (error) {
      throw new Error("Unauthorized or token expired");
    }

    const supabaseUserId = data.user.id;
    const { data: userData, error: userError } =
      await AuthRepository.getUserById(supabaseUserId);

    if (userError || !userData) {
      throw new Error("User not found in database");
    }

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
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
export async function resetPassword(token, oldPassword, newPassword) {
  try {
    if (!token) {
      throw new Error("Unauthorized: Token missing");
    }

    if (!newPassword) {
      throw new Error("New password is required");
    }

    const { data: userData, error: userError } =
      await AuthRepository.getUserFromToken(token);
    if (userError) {
      throw new Error("Unauthorized: Invalid token");
    }

    const { error: loginError } = await AuthRepository.verifyPassword(
      userData.user.email,
      oldPassword
    );
    if (loginError) {
      throw new Error("Invalid old password");
    }

    const { data, error } = await AuthRepository.updatePassword(newPassword);
    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: "Password updated successfully",
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Update Profile
export async function updateProfile(token, name, username, bio, imageUrl) {
  try {
    if (!token) {
      throw new Error("Unauthorized: Token missing");
    }

    const { data: userData, error: userError } =
      await AuthRepository.getUserFromToken(token);
    if (userError) {
      throw new Error("Unauthorized: Invalid token");
    }

    const supabaseUserId = userData.user.id;

    // สร้าง object สำหรับอัปเดต โดยไม่รวม profile_pic ถ้า imageUrl เป็น null
    const updateData = {
      name: name,
      username: username,
      bio: bio,
    };

    // เพิ่ม profile_pic เฉพาะเมื่อมี imageUrl ใหม่
    if (imageUrl !== null) {
      updateData.profile_pic = imageUrl;
    }

    const { data: updatedUser, error: updateError } =
      await AuthRepository.updateUserProfile(supabaseUserId, updateData);

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
