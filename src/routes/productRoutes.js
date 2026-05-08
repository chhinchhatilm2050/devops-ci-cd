import { Router } from "express";
import { 
    createProduct, getProductWithAllQuery, 
    getProductWithCursor, getProductByFeatured,
    getProductBySearch, getSingleProduct,
    updateProduct, deleteProduct, getProductOnsale
} from "../controllers/productController.js";

const productRouter = Router();
productRouter.post('', createProduct);
productRouter.get('', getProductWithAllQuery);
productRouter.get('/cursor', getProductWithCursor);
productRouter.get('/featured', getProductByFeatured);
productRouter.get('/search', getProductBySearch);
productRouter.get('/onSale', getProductOnsale);
productRouter.get('/:id', getSingleProduct);
productRouter.put('/:id', updateProduct);
productRouter.delete('/:id', deleteProduct);

export default productRouter;