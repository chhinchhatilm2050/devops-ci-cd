import { faker} from '@faker-js/faker';
import 'dotenv/config';
import { connectDB } from '../config/database.js';
await connectDB();
import ProductModel from '../models/product.js';

const NUMBER_OF_PRODUCTS = 500;
const categories = ['shoes', 'clothing', 'electronics', 'accessories', 'bags'];
const subcategories = {
    shoes: ['running', 'casual', 'formal', 'sports'],
    clothing: ['t-shirts', 'pants', 'jackets', 'hoodies'],
    electronics: ['phones', 'laptops', 'tablets', 'headphones'],
    accessories: ['watches', 'belts', 'sunglasses', 'wallets'],
    bags: ['backpacks', 'handbags', 'travel bags', 'laptop bags']
};
const brands = ['Nike', 'Adidas', 'Apple', 'Samsung', 'Puma', 'Sony', 'LG', 'Zara'];

const generateProduct = (index) => {
    const category = faker.helpers.arrayElement(categories);
    const price = parseFloat(faker.commerce.price({min: 5, max: 1000}));
    const isOnSale = faker.datatype.boolean();
    const comparePrice = isOnSale ? parseFloat((price * faker.number.float({min: 1.1, max: 1.5})).toFixed(2)) : undefined;
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price,
        comparePrice,
        category,
        subcategory: faker.helpers.arrayElement(subcategories[category]),
        brand: faker.helpers.arrayElement(brands),
        sku: `SKU-${index}-${faker.string.alphanumeric(6).toUpperCase()}`,
        images: [
            {
                url: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/640/480`,
                alt: faker.commerce.productName(),
                isPrimary: true
            },
            {
                url: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/640/480`,
                alt: faker.commerce.productName(),
                isPrimary: false
            }
        ],
        stock: faker.number.int({min: 0, max: 500}),
        specifications: new Map([
            ['material', faker.commerce.productMaterial()],
            ['weight',   `${faker.number.int({ min: 100, max: 5000 })}g`],
            ['color',    faker.color.human()],
            ['size',     faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL'])],
            ['warranty', `${faker.number.int({ min: 1, max: 3 })} years`],
        ]),
        tags: faker.helpers.arrayElements(
            ['sale', 'new', 'popular', 'trending', 'limited', 'bestseller'],
            { min: 1, max: 3 }
        ),
        status: faker.helpers.arrayElement(['draft', 'active', 'active', 'active', 'out_of_stock']),
        featured: faker.datatype.boolean(),
        rating: {
            average: parseFloat(faker.number.float({ min: 0, max: 5, fractionDigits: 1 })),
            count: faker.number.int({ min: 0, max: 500 })
        },
        reviewCount: faker.number.int({ min: 0, max: 500 })
    };
}

const products = [];

for(let i = 0; i < NUMBER_OF_PRODUCTS; i++) {
    products.push(generateProduct(i));
};
try {
    await ProductModel.insertMany(products);
} catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
}