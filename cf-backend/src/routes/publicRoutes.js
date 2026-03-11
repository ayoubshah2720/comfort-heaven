const express = require('express');
const { listCategories, getCategoryBySlug } = require('../controllers/categoryController');
const {
  listProducts,
  getProductById,
  search
} = require('../controllers/productController');
const { listInvoices, getInvoiceById } = require('../controllers/invoiceController');
const { getCart, addCartItem, updateCartItem, removeCartItem } = require('../controllers/cartController');
const { listOrders, getOrderById, checkout } = require('../controllers/orderController');
const { listCollections } = require('../controllers/collectionController');
const { listBrands } = require('../controllers/brandController');
const { listVendors } = require('../controllers/vendorController');
const {
  listPosts,
  getPostBySlug,
  listTags
} = require('../controllers/postController');
const {
  listQuotes,
  getQuoteById,
  createQuote,
  acceptQuote,
  rejectQuote
} = require('../controllers/quoteController');
const {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require('../controllers/addressController');
const {
  listReviews,
  createReview
} = require('../controllers/reviewController');
const { listTestimonials } = require('../controllers/testimonialController');
const { productListQueryValidation } = require('../validators/productValidators');
const { cartItemValidation, cartItemUpdateValidation } = require('../validators/cartValidators');
const { quoteCreateValidation } = require('../validators/quoteValidators');
const { reviewCreateValidation } = require('../validators/reviewValidators');
const { checkoutValidation } = require('../validators/orderValidators');
const { addressCreateValidation, addressUpdateValidation } = require('../validators/addressValidators');
const { authenticate } = require('../middleware/auth');
const validate = require('../validators/validate');

const router = express.Router();

router.get('/categories', listCategories);
router.get('/categories/:slug', getCategoryBySlug);

router.get('/collections', listCollections);
router.get('/brands', listBrands);
router.get('/vendors', listVendors);
router.get('/products', productListQueryValidation, validate, listProducts);
router.get('/invoices', authenticate, listInvoices);
router.get('/invoices/:invoiceId', authenticate, getInvoiceById);
router.get('/search', search);
router.get('/products/search', search);
router.get('/products/:productId', getProductById);
router.get('/cart', authenticate, getCart);
router.post('/cart/items', authenticate, cartItemValidation, validate, addCartItem);
router.put('/cart/items/:itemId', authenticate, cartItemUpdateValidation, validate, updateCartItem);
router.delete('/cart/items/:itemId', authenticate, removeCartItem);
router.post('/checkout', authenticate, checkoutValidation, validate, checkout);
router.get('/orders', authenticate, listOrders);
router.get('/orders/:orderId', authenticate, getOrderById);
router.get('/reviews', listReviews);
router.post('/reviews', authenticate, reviewCreateValidation, validate, createReview);
router.get('/testimonials', listTestimonials);
router.get('/posts', listPosts);
router.get('/posts/:slug', getPostBySlug);
router.get('/tags', listTags);

router.get('/addresses', authenticate, listAddresses);
router.post('/addresses', authenticate, addressCreateValidation, validate, createAddress);
router.put('/addresses/:addressId', authenticate, addressUpdateValidation, validate, updateAddress);
router.delete('/addresses/:addressId', authenticate, deleteAddress);
router.post('/addresses/:addressId/default', authenticate, setDefaultAddress);

router.get('/quotes', authenticate, listQuotes);
router.post('/quotes', authenticate, quoteCreateValidation, validate, createQuote);
router.get('/quotes/:quoteId', authenticate, getQuoteById);
router.post('/quotes/:quoteId/accept', authenticate, acceptQuote);
router.post('/quotes/:quoteId/reject', authenticate, rejectQuote);


module.exports = router;
