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

// Admin Model
const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
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
  kycApprovedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
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
  kycApprovedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
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
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Sellers',
      key: 'id',
    },
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
  approvedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
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
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id',
    },
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
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
  reviewedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
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
  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
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
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Orders',
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id',
    },
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
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Sellers',
      key: 'id',
    },
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
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
  repairCenterId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'RepairCenters',
      key: 'id',
    },
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
  repairRequestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'RepairRequests',
      key: 'id',
    },
  },
  repairCenterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'RepairCenters',
      key: 'id',
    },
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
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
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
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

// Define relationships
User.hasOne(Admin);
Admin.belongsTo(User);

User.hasOne(Seller);
Seller.belongsTo(User);

User.hasOne(RepairCenter);
RepairCenter.belongsTo(User);

User.hasMany(RefreshToken);
RefreshToken.belongsTo(User);

User.hasMany(KycDocument);
KycDocument.belongsTo(User);

Seller.hasMany(Product);
Product.belongsTo(Seller);

Product.hasMany(ProductImage);
ProductImage.belongsTo(Product);

User.hasMany(Order, { foreignKey: 'buyerId' });
Order.belongsTo(User, { foreignKey: 'buyerId' });

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

Seller.hasMany(OrderItem);
OrderItem.belongsTo(Seller);

User.hasMany(RepairRequest);
RepairRequest.belongsTo(User);

RepairCenter.hasMany(RepairRequest);
RepairRequest.belongsTo(RepairCenter);

RepairRequest.hasMany(RepairQuote);
RepairQuote.belongsTo(RepairRequest);

RepairCenter.hasMany(RepairQuote);
RepairQuote.belongsTo(RepairCenter);

User.hasMany(AuditLog);
AuditLog.belongsTo(User);

User.hasMany(Notification);
Notification.belongsTo(User);

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