import {Router} from "express";
import { protectAdmin } from "../middlewares/protectRoute.mjs";
import { createCategory, deleteCategory, updateCategory, readCategory, readByIdCategory } from "../controllers/categories.mjs";

const categoryRouter = Router()

categoryRouter.post('/',protectAdmin, createCategory)
categoryRouter.get('/', readCategory)
categoryRouter.get('/:categoryId', readByIdCategory)
categoryRouter.delete('/:categoryId', protectAdmin, deleteCategory)
categoryRouter.put('/:categoryId', protectAdmin, updateCategory)


export default categoryRouter