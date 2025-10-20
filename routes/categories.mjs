import { Router } from "express";
import { protectAdmin } from "../middlewares/protectRoute.mjs";
import { validateRequired, validateTypes } from "../middlewares/validation.mjs";
import { createCategory, deleteCategory, updateCategory, readCategory, readByIdCategory } from "../controllers/categories.mjs";

const categoryRouter = Router();

//POST Routes
categoryRouter.post('/', protectAdmin, validateRequired(['name']), validateTypes({ name: 'string' }), createCategory);

//GET Routes
categoryRouter.get('/', readCategory);
categoryRouter.get('/:categoryId', readByIdCategory);

//PUT Routes
categoryRouter.put('/:categoryId', protectAdmin, validateRequired(['name']), validateTypes({ name: 'string' }), updateCategory);

//DELETE Routes
categoryRouter.delete('/:categoryId', protectAdmin, deleteCategory);

export default categoryRouter;