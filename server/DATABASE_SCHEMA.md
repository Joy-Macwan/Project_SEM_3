# Database Schema Documentation

This document provides a comprehensive overview of the database schema for the Repair, Reuse, Reduce e-commerce platform.

## Overview

The platform uses SQLite with Sequelize ORM and follows a relational database model. The schema supports multiple user roles (Admin, Buyer, Seller, RepairCenter) and all associated e-commerce and repair service functionalities.

## Core Models

### User
Central entity representing all users in the system regardless of role.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | STRING | User's full name |
| email | STRING | User's email address (unique) |
| password | STRING | Hashed password |
| role | ENUM | 'admin', 'buyer', 'seller', or 'repairCenter' |
| status | ENUM | 'active', 'inactive', 'suspended', 'pending' |
| emailVerified | BOOLEAN | Whether email has been verified |
| lastLogin | DATE | Timestamp of last login |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### Admin
Admin user profile with extended permissions.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| userId | UUID | Foreign key to User |
| adminLevel | ENUM | 'super_admin', 'support_admin', 'content_admin' |
| mfaEnabled | BOOLEAN | Whether multi-factor auth is enabled |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### Seller
Seller account profile with business information.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| userId | UUID | Foreign key to User |
| businessName | STRING | Name of the seller's business |
| businessAddress | STRING | Business address |
| taxId | STRING | Tax identification number |
| contactPhone | STRING | Business contact phone |
| kycStatus | ENUM | 'pending', 'approved', 'rejected' |
| kycApprovedBy | INTEGER | Foreign key to Admin who approved KYC |
| kycApprovedAt | DATE | Timestamp of KYC approval |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### RepairCenter
Repair center profile with service details.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| userId | UUID | Foreign key to User |
| businessName | STRING | Name of the repair center |
| businessAddress | STRING | Business address |
| taxId | STRING | Tax identification number |
| contactPhone | STRING | Business contact phone |
| serviceRadius | FLOAT | Service radius in miles/kilometers |
| kycStatus | ENUM | 'pending', 'approved', 'rejected' |
| kycApprovedBy | INTEGER | Foreign key to Admin who approved KYC |
| kycApprovedAt | DATE | Timestamp of KYC approval |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### Product
Represents items listed for sale on the platform.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| sellerId | INTEGER | Foreign key to Seller |
| title | STRING | Product title |
| description | TEXT | Detailed product description |
| price | DECIMAL | Product price |
| condition | ENUM | 'new', 'like_new', 'good', 'fair', 'refurbished' |
| category | STRING | Product category |
| brand | STRING | Product brand |
| model | STRING | Product model |
| quantity | INTEGER | Available quantity |
| status | ENUM | 'draft', 'published', 'out_of_stock', 'archived' |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### ProductImage
Images associated with products.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| productId | INTEGER | Foreign key to Product |
| url | STRING | Image URL |
| order | INTEGER | Display order of the image |
| altText | STRING | Alternative text for accessibility |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### Order
Customer orders in the system.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| userId | UUID | Foreign key to User (buyer) |
| addressId | INTEGER | Foreign key to Address |
| orderNumber | STRING | Unique order reference number |
| status | ENUM | 'pending', 'processing', 'shipped', 'delivered', 'cancelled' |
| totalAmount | DECIMAL | Total order amount |
| paymentMethod | STRING | Method of payment |
| paymentStatus | ENUM | 'pending', 'paid', 'failed', 'refunded' |
| shippingCost | DECIMAL | Cost of shipping |
| trackingNumber | STRING | Shipping tracking number |
| notes | TEXT | Additional order notes |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### OrderItem
Individual items within an order.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| orderId | INTEGER | Foreign key to Order |
| productId | INTEGER | Foreign key to Product |
| quantity | INTEGER | Quantity ordered |
| price | DECIMAL | Price at time of order |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

## Additional Models

### Address
User addresses for shipping and billing.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| userId | UUID | Foreign key to User |
| addressType | ENUM | 'billing', 'shipping' |
| name | STRING | Recipient name |
| line1 | STRING | Address line 1 |
| line2 | STRING | Address line 2 (optional) |
| city | STRING | City |
| state | STRING | State/province |
| postalCode | STRING | Postal/ZIP code |
| country | STRING | Country |
| phone | STRING | Contact phone number |
| isDefault | BOOLEAN | Whether this is the default address |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### Cart
Shopping cart for buyers.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| userId | UUID | Foreign key to User |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### CartItem
Items in a user's shopping cart.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| cartId | INTEGER | Foreign key to Cart |
| productId | INTEGER | Foreign key to Product |
| quantity | INTEGER | Quantity in cart |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### Wishlist
User wishlist of desired products.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| userId | UUID | Foreign key to User |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### WishlistItem
Items in a user's wishlist.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| wishlistId | INTEGER | Foreign key to Wishlist |
| productId | INTEGER | Foreign key to Product |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### Category
Product categories.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| name | STRING | Category name |
| slug | STRING | URL-friendly name |
| description | TEXT | Category description |
| parentId | INTEGER | Self-reference to parent category |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### ProductCategory
Many-to-many relationship between products and categories.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| productId | INTEGER | Foreign key to Product |
| categoryId | INTEGER | Foreign key to Category |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### Payment
Payment records for orders.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| orderId | INTEGER | Foreign key to Order |
| paymentMethod | STRING | Method of payment |
| amount | DECIMAL | Payment amount |
| status | ENUM | 'pending', 'completed', 'failed', 'refunded' |
| transactionId | STRING | External payment gateway transaction ID |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### Review
Product reviews from buyers.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| userId | UUID | Foreign key to User |
| productId | INTEGER | Foreign key to Product |
| orderId | INTEGER | Foreign key to Order |
| rating | INTEGER | Rating (1-5) |
| title | STRING | Review title |
| comment | TEXT | Review content |
| status | ENUM | 'pending', 'approved', 'rejected' |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### RepairRequest
Service requests for repair centers.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| userId | UUID | Foreign key to User (buyer) |
| repairCenterId | INTEGER | Foreign key to RepairCenter |
| productId | INTEGER | Foreign key to Product (optional) |
| itemType | STRING | Type of item for repair |
| itemBrand | STRING | Brand of item |
| itemModel | STRING | Model of item |
| issueDescription | TEXT | Description of the issue |
| status | ENUM | 'submitted', 'received', 'diagnosed', 'quoted', 'in_progress', 'completed', 'delivered', 'cancelled' |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### RepairQuote
Cost estimates for repair requests.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| repairRequestId | INTEGER | Foreign key to RepairRequest |
| diagnosticFee | DECIMAL | Diagnostic fee |
| repairCost | DECIMAL | Estimated repair cost |
| partsCost | DECIMAL | Cost of parts |
| laborCost | DECIMAL | Cost of labor |
| status | ENUM | 'pending', 'accepted', 'declined', 'expired' |
| validUntil | DATE | Expiration date of quote |
| notes | TEXT | Additional notes |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### RepairPart
Parts used in repairs.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| repairRequestId | INTEGER | Foreign key to RepairRequest |
| name | STRING | Part name |
| description | TEXT | Part description |
| cost | DECIMAL | Cost of the part |
| isRecycled | BOOLEAN | Whether the part is recycled |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### RepairLog
Logs of repair activities.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| repairRequestId | INTEGER | Foreign key to RepairRequest |
| technicianId | UUID | Foreign key to User (repair technician) |
| action | STRING | Action performed |
| notes | TEXT | Detailed notes |
| timeSpent | INTEGER | Time spent in minutes |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### RefreshToken
JWT refresh tokens for authentication.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| userId | UUID | Foreign key to User |
| token | STRING | Refresh token value |
| expiresAt | DATE | Expiration timestamp |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### Notification
User notifications.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| userId | UUID | Foreign key to User |
| type | STRING | Notification type |
| title | STRING | Notification title |
| message | TEXT | Notification content |
| isRead | BOOLEAN | Whether notification has been read |
| relatedId | STRING | Related entity ID (order, product, etc.) |
| relatedType | STRING | Type of related entity |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### KycDocument
Know Your Customer verification documents.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| userId | UUID | Foreign key to User |
| documentType | ENUM | 'id_card', 'passport', 'driver_license', 'business_license', 'tax_document' |
| documentUrl | STRING | Document file URL |
| status | ENUM | 'pending', 'approved', 'rejected' |
| reviewedBy | INTEGER | Foreign key to Admin who reviewed |
| reviewedAt | DATE | Timestamp of review |
| notes | TEXT | Review notes |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

### AuditLog
System audit logs for compliance and security.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| userId | UUID | Foreign key to User who performed action |
| action | STRING | Action performed |
| entityType | STRING | Type of entity affected |
| entityId | STRING | ID of entity affected |
| oldValues | TEXT | Previous values (JSON) |
| newValues | TEXT | New values (JSON) |
| ipAddress | STRING | IP address of user |
| userAgent | STRING | User agent information |
| createdAt | DATE | Record creation timestamp |
| updatedAt | DATE | Record update timestamp |

## Entity Relationships

### User Relationships
- One User can have one Admin, Seller, or RepairCenter profile
- One User can have many Addresses, Orders, Reviews, and RepairRequests
- One User can have one Cart and one Wishlist

### Product Relationships
- One Product belongs to one Seller
- One Product can have many ProductImages
- One Product can be in many Categories (through ProductCategory)
- One Product can be in many CartItems and WishlistItems
- One Product can have many Reviews

### Order Relationships
- One Order belongs to one User (buyer)
- One Order has many OrderItems
- One Order can have many Payments

### Repair Relationships
- One RepairRequest belongs to one User (buyer) and one RepairCenter
- One RepairRequest can have one RepairQuote
- One RepairRequest can have many RepairParts and RepairLogs