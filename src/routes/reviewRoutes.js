import { Router } from "express";
import { createReview, getProductReviews, getSingleReview, updateReviews, deleteReview } from "../controllers/reviewController.js";
const reviewRouter = Router();

reviewRouter.post('/:id/products', createReview);
reviewRouter.get('/:id/products', getProductReviews);
reviewRouter.get('/:id', getSingleReview);
reviewRouter.put('/:id', updateReviews);
reviewRouter.delete('/:id', deleteReview);

export default reviewRouter;