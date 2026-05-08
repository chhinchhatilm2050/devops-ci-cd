import { Router } from "express";
import { getSummaryProduct, getProductPerCagetory, getProductTopRated } from "../controllers/statController.js";

const statRouter = Router();
statRouter.get('/stats/summary', getSummaryProduct);
statRouter.get('/stats/by-category', getProductPerCagetory);
statRouter.get('/stats/top-rated', getProductTopRated);

export default statRouter;