const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

// User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('buyer', 'seller', 'repairCenter', 'admin'),
    defaultValue: 'buyer',
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'suspended'),
    defaultValue: 'active',
  },
  lastLogin: {
    type: DataTypes.DATE,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Defining models with corrected relationships

// Admin Model
const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  adminLevel: {
    type: DataTypes.ENUM('admin', 'super_admin'),
    defaultValue: 'admin',
  },
  mfaEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  mfaSecret: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// RefreshToken Model
const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deviceId: {
    type: DataTypes.STRING,
  },
  ip: {
    type: DataTypes.STRING,
  },
  userAgent: {
    type: DataTypes.STRING,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Seller Model
const Seller = sequelize.define('Seller', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  businessName: {
    type: DataTypes.STRING,
  },
  businessAddress: {
    type: DataTypes.TEXT,
  },
  taxId: {
    type: DataTypes.STRING,
  },
  contactPhone: {
    type: DataTypes.STRING,
  },
  kycStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  kycApprovedAt: {
    type: DataTypes.DATE,
  },
  kycRejectionReason: {
    type: DataTypes.TEXT,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// RepairCenter Model
const RepairCenter = sequelize.define('RepairCenter', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  businessName: {
    type: DataTypes.STRING,
  },
  businessAddress: {
    type: DataTypes.TEXT,
  },
  taxId: {
    type: DataTypes.STRING,
  },
  contactPhone: {
    type: DataTypes.STRING,
  },
  serviceRadius: {
    type: DataTypes.FLOAT,
  },
  kycStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  kycApprovedAt: {
    type: DataTypes.DATE,
  },
  kycRejectionReason: {
    type: DataTypes.TEXT,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Product Model
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  condition: {
    type: DataTypes.ENUM('new', 'like_new', 'good', 'fair', 'parts_only'),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
  },
  brand: {
    type: DataTypes.STRING,
  },
  model: {
    type: DataTypes.STRING,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending_approval', 'approved', 'rejected', 'published', 'out_of_stock'),
    defaultValue: 'draft',
  },
  approvedAt: {
    type: DataTypes.DATE,
  },
  rejectionReason: {
    type: DataTypes.TEXT,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// ProductImage Model
const ProductImage = sequelize.define('ProductImage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  altText: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// KYC Document Model
const KycDocument = sequelize.define('KycDocument', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  documentType: {
    type: DataTypes.ENUM('id_card', 'business_license', 'tax_certificate', 'proof_of_address', 'other'),
    allowNull: false,
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  reviewedAt: {
    type: DataTypes.DATE,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Order Model
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
    defaultValue: 'pending',
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'authorized', 'captured', 'refunded', 'failed'),
    defaultValue: 'pending',
  },
  paymentMethod: {
    type: DataTypes.STRING,
  },
  paymentId: {
    type: DataTypes.STRING,
  },
  shippingAddressId: {
    type: DataTypes.INTEGER,
  },
  billingAddressId: {
    type: DataTypes.INTEGER,
  },
  shippingMethod: {
    type: DataTypes.STRING,
  },
  trackingNumber: {
    type: DataTypes.STRING,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// OrderItem Model
const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
    defaultValue: 'pending',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Repair Request Model
const RepairRequest = sequelize.define('RepairRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  deviceType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
  },
  model: {
    type: DataTypes.STRING,
  },
  issueDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'quoted', 'accepted', 'in_progress', 'awaiting_parts', 'repaired', 'quality_check', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  pickupRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  addressId: {
    type: DataTypes.INTEGER,
  },
  scheduledDate: {
    type: DataTypes.DATE,
  },
  completedDate: {
    type: DataTypes.DATE,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Repair Quote Model
const RepairQuote = sequelize.define('RepairQuote', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  laborCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  partsCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  totalCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  estimatedDays: {
    type: DataTypes.INTEGER,
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'expired'),
    defaultValue: 'pending',
  },
  notes: {
    type: DataTypes.TEXT,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Audit Log Model
const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  beforeSnapshot: {
    type: DataTypes.TEXT,
  },
  afterSnapshot: {
    type: DataTypes.TEXT,
  },
  ip: {
    type: DataTypes.STRING,
  },
  userAgent: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Notification Model
const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  linkUrl: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Define relationships with explicit foreign keys
User.hasOne(Admin, { foreignKey: 'userId' });
Admin.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Seller, { foreignKey: 'userId' });
Seller.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(RepairCenter, { foreignKey: 'userId' });
RepairCenter.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(KycDocument, { foreignKey: 'userId' });
KycDocument.belongsTo(User, { foreignKey: 'userId' });

Seller.hasMany(Product, { foreignKey: 'sellerId' });
Product.belongsTo(Seller, { foreignKey: 'sellerId' });

Product.hasMany(ProductImage, { foreignKey: 'productId' });
ProductImage.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Order, { foreignKey: 'buyerId' });
Order.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

Seller.hasMany(OrderItem, { foreignKey: 'sellerId' });
OrderItem.belongsTo(Seller, { foreignKey: 'sellerId' });

User.hasMany(RepairRequest, { foreignKey: 'userId' });
RepairRequest.belongsTo(User, { foreignKey: 'userId' });

RepairCenter.hasMany(RepairRequest, { foreignKey: 'repairCenterId' });
RepairRequest.belongsTo(RepairCenter, { foreignKey: 'repairCenterId' });

RepairRequest.hasMany(RepairQuote, { foreignKey: 'repairRequestId' });
RepairQuote.belongsTo(RepairRequest, { foreignKey: 'repairRequestId' });

RepairCenter.hasMany(RepairQuote, { foreignKey: 'repairCenterId' });
RepairQuote.belongsTo(RepairCenter, { foreignKey: 'repairCenterId' });

User.hasMany(AuditLog, { foreignKey: 'userId' });
AuditLog.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// Add approving users
User.hasMany(Seller, { foreignKey: 'kycApprovedBy', as: 'approvedSellers' });
Seller.belongsTo(User, { foreignKey: 'kycApprovedBy', as: 'approver' });

User.hasMany(RepairCenter, { foreignKey: 'kycApprovedBy', as: 'approvedRepairCenters' });
RepairCenter.belongsTo(User, { foreignKey: 'kycApprovedBy', as: 'approver' });

User.hasMany(KycDocument, { foreignKey: 'reviewedBy', as: 'reviewedDocuments' });
KycDocument.belongsTo(User, { foreignKey: 'reviewedBy', as: 'reviewer' });

User.hasMany(Product, { foreignKey: 'approvedBy', as: 'approvedProducts' });
Product.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });

// Export models
module.exports = {
  User,
  Admin,
  RefreshToken,
  Seller,
  RepairCenter,
  Product,
  ProductImage,
  KycDocument,
  Order,
  OrderItem,
  RepairRequest,
  RepairQuote,
  AuditLog,
  Notification
};