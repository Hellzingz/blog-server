export const validatePost = (req, res, next) => {
  const formData = req.body;
  
  if (!formData.title) {
    return res.status(400).json({ message: "Title is required" });
  }
  if (!formData.category_id) {
    return res.status(400).json({ message: "Category ID is required" });
  }

  if (!formData.description) {
    return res.status(400).json({ message: "Description is required" });
  }

  if (!formData.content) {
    return res.status(400).json({ message: "Content is required" });
  }

  if (!formData.status_id) {
    return res.status(400).json({ message: "Status ID is required" });
  }

  if (typeof formData.title !== "string") {
    return res.status(400).json({ message: "Title must be string" });
  }
  if (typeof Number(formData.category_id) !== "number") {
    return res.status(400).json({ message: "Category ID must be a number" });
  }
  if (typeof formData.description !== "string") {
    return res.status(400).json({ message: "Description must be string" });
  }
  if (typeof formData.content !== "string") {
    return res.status(400).json({ message: "Content must be string" });
  }
  if (typeof Number(formData.status_id) !== "number") {
    return res.status(400).json({ message: "Status ID must be a number" });
  }
  next();
};
