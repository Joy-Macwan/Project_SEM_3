// Import model files
const models = require('./modelsFixed');
const additionalModels = require('./additionalModelsFixed');

// Set up associations between models
function setupAssociations() {
  // Import models from modelsFixed.js
  const { 
    User, Admin, Seller, RepairCenter, Product, ProductImage,
    KycDocument, Order, OrderItem, RepairRequest, RepairQuote,
    AuditLog, Notification, RefreshToken
  } = models;
  
  // Import models from additionalModelsFixed.js
  const {
    Address, Cart, CartItem, Wishlist, WishlistItem, Payment,
    RepairLog, RepairPart, Review, Category, ProductCategory
  } = additionalModels;

  // User associations
  if (User && Address) {
    User.hasMany(Address, { foreignKey: 'userId' });
    Address.belongsTo(User, { foreignKey: 'userId' });
  }

  if (User && Cart) {
    User.hasOne(Cart, { foreignKey: 'userId' });
    Cart.belongsTo(User, { foreignKey: 'userId' });
  }

  if (User && Wishlist) {
    User.hasOne(Wishlist, { foreignKey: 'userId' });
    Wishlist.belongsTo(User, { foreignKey: 'userId' });
  }

  if (User && RefreshToken) {
    User.hasMany(RefreshToken, { foreignKey: 'userId' });
    RefreshToken.belongsTo(User, { foreignKey: 'userId' });
  }

  if (User && Payment) {
    User.hasMany(Payment, { foreignKey: 'userId' });
    Payment.belongsTo(User, { foreignKey: 'userId' });
  }

  if (User && Review) {
    User.hasMany(Review, { foreignKey: 'userId' });
    Review.belongsTo(User, { foreignKey: 'userId' });
  }

  if (User && Admin) {
    User.hasOne(Admin, { foreignKey: 'userId' });
    Admin.belongsTo(User, { foreignKey: 'userId' });
  }

  if (User && Seller) {
    User.hasOne(Seller, { foreignKey: 'userId' });
    Seller.belongsTo(User, { foreignKey: 'userId' });
  }

  if (Seller && Product) {
    Seller.hasMany(Product, { foreignKey: 'sellerId' });
    Product.belongsTo(Seller, { foreignKey: 'sellerId' });
  }

  if (User && RepairCenter) {
    User.hasOne(RepairCenter, { foreignKey: 'userId' });
    RepairCenter.belongsTo(User, { foreignKey: 'userId' });
  }

  if (RepairCenter && RepairRequest) {
    RepairCenter.hasMany(RepairRequest, { foreignKey: 'repairCenterId' });
    RepairRequest.belongsTo(RepairCenter, { foreignKey: 'repairCenterId' });
  }

  if (Cart && CartItem) {
    Cart.hasMany(CartItem, { foreignKey: 'cartId' });
    CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
  }

  if (Product && CartItem) {
    Product.hasMany(CartItem, { foreignKey: 'productId' });
    CartItem.belongsTo(Product, { foreignKey: 'productId' });
  }

  if (Wishlist && WishlistItem) {
    Wishlist.hasMany(WishlistItem, { foreignKey: 'wishlistId' });
    WishlistItem.belongsTo(Wishlist, { foreignKey: 'wishlistId' });
  }

  if (Product && WishlistItem) {
    Product.hasMany(WishlistItem, { foreignKey: 'productId' });
    WishlistItem.belongsTo(Product, { foreignKey: 'productId' });
  }

  if (Product && ProductImage) {
    Product.hasMany(ProductImage, { foreignKey: 'productId' });
    ProductImage.belongsTo(Product, { foreignKey: 'productId' });
  }

  if (Product && Category && ProductCategory) {
    Product.belongsToMany(Category, { through: ProductCategory, foreignKey: 'productId' });
    Category.belongsToMany(Product, { through: ProductCategory, foreignKey: 'categoryId' });
  }

  if (Product && Review) {
    Product.hasMany(Review, { foreignKey: 'productId', as: 'productReviews' });
    Review.belongsTo(Product, { foreignKey: 'productId' });
  }

  if (Category) {
    Category.hasMany(Category, { as: 'subCategories', foreignKey: 'parentId' });
    Category.belongsTo(Category, { as: 'parentCategory', foreignKey: 'parentId' });
  }

  if (Order && OrderItem) {
    Order.hasMany(OrderItem, { foreignKey: 'orderId' });
    OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
  }

  if (OrderItem && Product) {
    OrderItem.belongsTo(Product, { foreignKey: 'productId' });
    Product.hasMany(OrderItem, { foreignKey: 'productId' });
  }

  if (Order && Payment) {
    Order.hasMany(Payment, { foreignKey: 'orderId' });
    Payment.belongsTo(Order, { foreignKey: 'orderId' });
  }

  if (RepairRequest && RepairLog) {
    RepairRequest.hasMany(RepairLog, { foreignKey: 'repairRequestId' });
    RepairLog.belongsTo(RepairRequest, { foreignKey: 'repairRequestId' });
  }

  if (RepairRequest && RepairPart) {
    RepairRequest.hasMany(RepairPart, { foreignKey: 'repairRequestId' });
    RepairPart.belongsTo(RepairRequest, { foreignKey: 'repairRequestId' });
  }

  if (RepairRequest && Payment) {
    RepairRequest.hasMany(Payment, { foreignKey: 'repairQuoteId' });
    Payment.belongsTo(RepairRequest, { foreignKey: 'repairQuoteId', as: 'repairPayment' });
  }

  if (RepairRequest && Review) {
    RepairRequest.hasOne(Review, { foreignKey: 'repairRequestId', as: 'repairReview' });
    Review.belongsTo(RepairRequest, { foreignKey: 'repairRequestId' });
  }

  if (RepairRequest && RepairQuote) {
    RepairRequest.hasMany(RepairQuote, { foreignKey: 'repairRequestId' });
    RepairQuote.belongsTo(RepairRequest, { foreignKey: 'repairRequestId' });
  }

  if (User && RepairRequest) {
    User.hasMany(RepairRequest, { foreignKey: 'userId' });
    RepairRequest.belongsTo(User, { foreignKey: 'userId' });
  }

  if (User && AuditLog) {
    User.hasMany(AuditLog, { foreignKey: 'userId' });
    AuditLog.belongsTo(User, { foreignKey: 'userId' });
  }

  if (User && Notification) {
    User.hasMany(Notification, { foreignKey: 'userId' });
    Notification.belongsTo(User, { foreignKey: 'userId' });
  }
}

// Export combined models and setup function
module.exports = {
  ...models,
  ...additionalModels,
  setupAssociations
};

// Export combined models and setup function
module.exports = {
  ...models,
  ...additionalModels,
  setupAssociations
};