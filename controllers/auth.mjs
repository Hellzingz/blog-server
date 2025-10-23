import * as AuthService from "../services/authService.mjs";

//REGISTER
export const register = async (req, res) => {
  const { email, password, username, name } = req.body;

  try {
    const result = await AuthService.register(email, password, username, name);

    if (result.success) {
      res.status(201).json({
        message: result.message,
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error("Registration error:", error);

    const statusCode = error.message.includes("already exists")
      ? 400
      : error.message.includes("Database error")
      ? 500
      : error.message.includes("Failed to create")
      ? 500
      : 400;

    res.status(statusCode).json({
      message: error.message,
    });
  }
};

//LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await AuthService.login(email, password);

    if (result.success) {
      res.status(200).json({
        message: result.message,
        access_token: result.access_token,
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET User
export const getUser = async (req, res) => {
  try {
    const result = await AuthService.getUser(req.user.id, req.user.email);

    if (result.success) {
      res.status(200).json(result.user);
    } else {
      const statusCode = result.error.includes("Token missing")
        ? 401
        : result.error.includes("Unauthorized")
        ? 401
        : result.error.includes("not found")
        ? 404
        : 500;
      res.status(statusCode).json({ error: result.error });
    }
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// RESET Password
export const resetPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const result = await AuthService.resetPassword(
      req.user.id,
      req.user.email,
      oldPassword,
      newPassword
    );

    if (result.success) {
      res.status(200).json({
        message: result.message,
        user: result.user,
        access_token: result.access_token,
      });
    } else {
      const statusCode = result.error.includes("Token missing")
        ? 401
        : result.error.includes("Unauthorized")
        ? 401
        : result.error.includes("required")
        ? 400
        : result.error.includes("Invalid")
        ? 400
        : 500;
      res.status(statusCode).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE Profile
export const updateAdminProfile = async (req, res) => {
  const { name, username, bio } = req.body;

  try {
    // ถ้าไม่มีรูปใหม่ ส่ง null แทน undefined
    const imageUrl = req.imageUrl || null;
    const result = await AuthService.updateAdminProfile(
      req.user.id,
      name,
      username,
      bio,
      imageUrl
    );

    if (result.success) {
      res.status(200).json({
        message: result.message,
        user: result.user,
      });
    } else {
      const statusCode = result.error.includes("Token missing")
        ? 401
        : result.error.includes("Unauthorized")
        ? 401
        : result.error.includes("not found")
        ? 404
        : 500;
      res.status(statusCode).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE User Profile
export const updateUserProfile = async (req, res) => {
  console.log("=== UPDATE USER PROFILE DEBUG ===");
  console.log("req.user:", req.user);
  console.log("req.body:", req.body);
  console.log("req.imageUrl:", req.imageUrl);
  
  const { name, username } = req.body;
  const imageUrl = req.imageUrl || null;
  
  try {
    const result = await AuthService.updateUserProfile(
      req.user.id,
      name,
      username,
      imageUrl
    );
    
    console.log("Service result:", result);
    
    if (result.success) {
      res.status(200).json({
        message: result.message,
        user: result.user,
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({ message: error.message });
  }
};
