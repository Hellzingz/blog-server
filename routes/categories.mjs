import {Router} from "express";
import { protectAdmin } from "../middlewares/protectRoute.mjs";
import { createCategory, deleteCategory, updateCategory, readCategory, readByIdCategory } from "../controllers/categories.mjs";

const categoryRouter = Router()

categoryRouter.post('/',protectAdmin, createCategory)
categoryRouter.get('/',protectAdmin, readCategory)
categoryRouter.get('/:categoryId',protectAdmin, readByIdCategory)
categoryRouter.delete('/:categoryId', protectAdmin, deleteCategory)
categoryRouter.put('/:categoryId', protectAdmin, updateCategory)


export default categoryRouter