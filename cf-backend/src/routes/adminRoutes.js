const express = require('express');
const {
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  listUsers,
  deactivateUser,
  reactivateUser,
  changeUserRole,
  getDashboardStats
} = require('../controllers/adminController');
const { listCategories } = require('../controllers/categoryController');
const {
  createProduct,
  updateProduct,
  listAdminProducts,
  getProductById,
  adminGetProductById,
  addProductImage,
  removeProductImage,
  deleteProduct
} = require('../controllers/productController');
const {
  listCollections,
  createCollection,
  updateCollection,
  deleteCollection
} = require('../controllers/collectionController');
const {
  listBrands,
  createBrand,
  updateBrand,
  deleteBrand
} = require('../controllers/brandController');
const {
  listVendors,
  createVendor,
  updateVendor,
  deleteVendor
} = require('../controllers/vendorController');
const {
  listAdminQuotes,
  createAdminQuote,
  updateAdminQuote,
  sendAdminQuote
} = require('../controllers/quoteController');
const {
  listPostsByStatus,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost
} = require('../controllers/postController');
const {
  listAdminReviews,
  approveReview,
  rejectReview,
  deleteReview
} = require('../controllers/reviewController');
const {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');
const {
  listAdminOrders,
  getAdminOrderById,
  updateOrderAdmin,
  markAsRefunded,
  markAsFulfilled,
  cancelOrder
} = require('../controllers/orderController');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { categoryCreateValidation, categoryUpdateValidation } = require('../validators/categoryValidators');
const { subCategoryCreateValidation, subCategoryUpdateValidation } = require('../validators/subCategoryValidators');
const {
  productCreateValidation,
  productUpdateValidation,
  productImageValidation
} = require('../validators/productValidators');
const { entityCreateValidation, entityUpdateValidation } = require('../validators/catalogValidators');
const { quoteAdminCreateValidation, quoteAdminUpdateValidation } = require('../validators/quoteValidators');
const { orderAdminUpdateValidation } = require('../validators/orderValidators');
const { postCreateValidation, postUpdateValidation } = require('../validators/postValidators');
const { testimonialCreateValidation, testimonialUpdateValidation } = require('../validators/testimonialValidators');
const validate = require('../validators/validate');

const router = express.Router();

router.use(authenticate, authorizeRoles('ADMIN'));

router.get('/dashboard/stats', getDashboardStats);

router.get('/categories', listCategories);
router.post('/categories', categoryCreateValidation, validate, createCategory);
router.patch('/categories/:id', categoryUpdateValidation, validate, updateCategory);
router.put('/categories/:id', categoryUpdateValidation, validate, updateCategory);
router.delete('/categories/:id', deleteCategory);

router.post('/subcategories', subCategoryCreateValidation, validate, createSubCategory);
router.patch('/subcategories/:id', subCategoryUpdateValidation, validate, updateSubCategory);
router.delete('/subcategories/:id', deleteSubCategory);

router.get('/users', listUsers);
router.patch('/users/:id/deactivate', deactivateUser);
router.patch('/users/:id/reactivate', reactivateUser);
router.patch('/users/:id/role', changeUserRole);

router.get('/products', listAdminProducts);
router.get('/products/:productId', adminGetProductById);
router.post('/products', productCreateValidation, validate, createProduct);
router.put('/products/:productId', productUpdateValidation, validate, updateProduct);
router.delete('/products/:productId', deleteProduct);
router.post('/products/:productId/images', productImageValidation, validate, addProductImage);
router.delete('/products/:productId/images/:imageId', removeProductImage);

router.get('/collections', listCollections);
router.post('/collections', entityCreateValidation, validate, createCollection);
router.put('/collections/:id', entityUpdateValidation, validate, updateCollection);
router.delete('/collections/:id', deleteCollection);

router.get('/brands', listBrands);
router.post('/brands', entityCreateValidation, validate, createBrand);
router.put('/brands/:id', entityUpdateValidation, validate, updateBrand);
router.delete('/brands/:id', deleteBrand);

router.get('/vendors', listVendors);
router.post('/vendors', entityCreateValidation, validate, createVendor);
router.put('/vendors/:id', entityUpdateValidation, validate, updateVendor);
router.delete('/vendors/:id', deleteVendor);

router.get('/quotes', listAdminQuotes);
router.post('/quotes', quoteAdminCreateValidation, validate, createAdminQuote);
router.put('/quotes/:quoteId', quoteAdminUpdateValidation, validate, updateAdminQuote);
router.post('/quotes/:quoteId/send', sendAdminQuote);

router.get('/orders', listAdminOrders);
router.get('/orders/:orderId', getAdminOrderById);
router.put('/orders/:orderId', orderAdminUpdateValidation, validate, updateOrderAdmin);
router.post('/orders/:orderId/refund', markAsRefunded);
router.post('/orders/:orderId/fulfill', markAsFulfilled);
router.post('/orders/:orderId/cancel', cancelOrder);

router.get('/posts', listPostsByStatus);
router.post('/posts', postCreateValidation, validate, createPost);
router.put('/posts/:postId', postUpdateValidation, validate, updatePost);
router.delete('/posts/:postId', deletePost);
router.post('/posts/:postId/publish', publishPost);
router.post('/posts/:postId/unpublish', unpublishPost);

router.get('/reviews', listAdminReviews);
router.put('/reviews/:reviewId/approve', approveReview);
router.put('/reviews/:reviewId/reject', rejectReview);
router.delete('/reviews/:reviewId', deleteReview);

router.get('/testimonials', listTestimonials);
router.post('/testimonials', testimonialCreateValidation, validate, createTestimonial);
router.put('/testimonials/:id', testimonialUpdateValidation, validate, updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

module.exports = router;
