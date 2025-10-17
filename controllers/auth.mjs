import { AuthService } from '../services/authService.mjs';

//REGISTER
export const register = async (req, res) => {
  const { email, password, username, name } = req.body;

  try {
    const result = await AuthService.register(email, password, username, name);
    
    if (result.success) {
      res.status(201).json({
        message: result.message,
        user: result.user,
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      error: "An error occurred during registration",
      details: error.message 
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
      error: "An error occurred during login",
      details: error.message 
    });
  }
};

//GETUSER
export const getUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const result = await AuthService.getUser(token);
    
    if (result.success) {
      res.status(200).json(result.user);
    } else {
      const statusCode = result.error.includes("Token missing") ? 401 : 
                        result.error.includes("Unauthorized") ? 401 : 
                        result.error.includes("not found") ? 404 : 500;
      res.status(statusCode).json({ error: result.error });
    }
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
};

//RESET_PASSWORD
export const resetPassword = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { oldPassword, newPassword } = req.body;

  try {
    const result = await AuthService.resetPassword(token, oldPassword, newPassword);
    
    if (result.success) {
      res.status(200).json({
        message: result.message,
        user: result.user,
      });
    } else {
      const statusCode = result.error.includes("Token missing") ? 401 : 
                        result.error.includes("Unauthorized") ? 401 : 
                        result.error.includes("required") ? 400 : 
                        result.error.includes("Invalid") ? 400 : 500;
      res.status(statusCode).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//UPDATE_PROFILE_PIC
export const updateProfilePic = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { name, username } = req.body;

  try {
    const result = await AuthService.updateProfile(token, name, username, req.imageUrl);
    
    if (result.success) {
      res.status(200).json({
        message: result.message,
        user: result.user,
      });
    } else {
      const statusCode = result.error.includes("Token missing") ? 401 : 
                        result.error.includes("Unauthorized") ? 401 : 
                        result.error.includes("not found") ? 404 : 500;
      res.status(statusCode).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
