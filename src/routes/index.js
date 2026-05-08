import { Router } from "express";
import  productRouter from "./productRoutes.js";
import reviewRouter from "./reviewRoutes.js";
import statRouter from "./statRoutes.js";

const router = Router();
router.use('/products', productRouter);
router.use('/reviews', reviewRouter);
router.use('/products', statRouter);

export default router;