# Database Schema Documentation

This document describes the database schema for the Repair, Reuse, Reduce platform.

## Core Models

### User

Central user entity that can have one of several roles (buyer, seller, repairCenter, admin).

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| name | STRING | User's full name |
| email | STRING | Unique email address |
| password | STRING | Hashed password |
| role | ENUM | 'buyer', 'seller', 'repairCenter', 'admin' |
| status | ENUM | 'pending', 'active', 'suspended' |
| lastLogin | DATE | Last login timestamp |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

### Admin

Admin-specific profile information.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| userId | INTEGER | Foreign key to User |
| adminLevel | ENUM | 'admin', 'super_admin' |
| mfaEnabled | BOOLEAN | Whether MFA is enabled |
| mfaSecret | STRING | MFA secret key |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

### RefreshToken

Stores JWT refresh tokens for persistent authentication.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| userId | INTEGER | Foreign key to User |
| token | STRING | Refresh token |
| deviceId | STRING | Device identifier |
| ip | STRING | IP address |
| userAgent | STRING | Browser/device info |
| expiresAt | DATE | Expiration timestamp |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

### Seller

Seller-specific profile information.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| userId | INTEGER | Foreign key to User |
| businessName | STRING | Business name |
| businessAddress | TEXT | Business address |
| taxId | STRING | Tax identification |
| contactPhone | STRING | Contact phone number |
| kycStatus | ENUM | 'pending', 'approved', 'rejected' |
| kycApprovedBy | INTEGER | Foreign key to approving admin |
| kycApprovedAt | DATE | Approval timestamp |
| kycRejectionReason | TEXT | Reason for rejection |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

### RepairCenter

Repair center-specific profile information.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| userId | INTEGER | Foreign key to User |
| businessName | STRING | Business name |
| businessAddress | TEXT | Business address |
| taxId | STRING | Tax identification |
| contactPhone | STRING | Contact phone number |
| serviceRadius | FLOAT | Service radius in miles/km |
| kycStatus | ENUM | 'pending', 'approved', 'rejected' |
| kycApprovedBy | INTEGER | Foreign key to approving admin |
| kycApprovedAt | DATE | Approval timestamp |
| kycRejectionReason | TEXT | Reason for rejection |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

### Address

User addresses for shipping, billing, etc.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| userId | INTEGER | Foreign key to User |
| addressType | ENUM | 'shipping', 'billing', 'repair', 'business' |
| name | STRING | Recipient name |
| line1 | STRING | Address line 1 |
| line2 | STRING | Address line 2 |
| city | STRING | City |
| state | STRING | State/province |
| postalCode | STRING | Postal/zip code |
| country | STRING | Country code |
| phone | STRING | Contact phone |
| isDefault | BOOLEAN | Is default address |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

## Product Models

### Product

Products listed for sale on the platform.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| sellerId | INTEGER | Foreign key to Seller |
| title | STRING | Product title |
| description | TEXT | Product description |
| price | DECIMAL | Product price |
| condition | ENUM | 'new', 'like_new', 'good', 'fair', 'parts_only' |
| category | STRING | Product category |
| brand | STRING | Product brand |
| model | STRING | Product model |
| quantity | INTEGER | Available quantity |
| status | ENUM | 'draft', 'pending_approval', 'approved', 'rejected', 'published', 'out_of_stock' |
| approvedBy | INTEGER | Foreign key to approving admin |
| approvedAt | DATE | Approval timestamp |
| rejectionReason | TEXT | Reason for rejection |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

### ProductImage

Images associated with products.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| productId | INTEGER | Foreign key to Product |
| url | STRING | Image URL |
| order | INTEGER | Display order |
| altText | STRING | Alt text for accessibility |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

### Category

Product categories.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| name | STRING | Category name |
| slug | STRING | URL-friendly name |
| description | TEXT | Category description |
| parentId | INTEGER | Foreign key to parent Category |
| iconUrl | STRING | Category icon URL |
| isActive | BOOLEAN | Category active status |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

### ProductCategory

Junction table for product-category many-to-many relationship.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| productId | INTEGER | Foreign key to Product |
| categoryId | INTEGER | Foreign key to Category |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

## Shopping Models

### Cart

User shopping carts.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| userId | INTEGER | Foreign key to User |
| sessionId | STRING | Guest session ID |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

### CartItem

Items in shopping carts.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| cartId | INTEGER | Foreign key to Cart |
| productId | INTEGER | Foreign key to Product |
| quantity | INTEGER | Item quantity |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

### Wishlist

User wishlists.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| userId | INTEGER | Foreign key to User |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

### WishlistItem

Items in wishlists.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| wishlistId | INTEGER | Foreign key to Wishlist |
| productId | INTEGER | Foreign key to Product |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

## Order Models

### Order

Orders placed by buyers.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| buyerId | INTEGER | Foreign key to User |
| orderNumber | STRING | Unique order number |
| totalAmount | DECIMAL | Total order amount |
| status | ENUM | 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded' |
| paymentStatus | ENUM | 'pending', 'authorized', 'captured', 'refunded', 'failed' |
| paymentMethod | STRING | Payment method |
| paymentId | STRING | Payment identifier |
| shippingAddressId | INTEGER | Foreign key to Address |
| billingAddressId | INTEGER | Foreign key to Address |
| shippingMethod | STRING | Shipping method |
| trackingNumber | STRING | Tracking number |
| notes | TEXT | Order notes |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

### OrderItem

Individual items in an order.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| orderId | INTEGER | Foreign key to Order |
| productId | INTEGER | Foreign key to Product |
| quantity | INTEGER | Item quantity |
| unitPrice | DECIMAL | Price per unit |
| total | DECIMAL | Total for line item |
| status | ENUM | 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded' |
| sellerId | INTEGER | Foreign key to Seller |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

## Repair Models

### RepairRequest

Repair requests submitted by users.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| userId | INTEGER | Foreign key to User |
| deviceType | STRING | Type of device |
| brand | STRING | Device brand |
| model | STRING | Device model |
| issueDescription | TEXT | Description of issue |
| status | ENUM | 'pending', 'quoted', 'accepted', 'in_progress', 'awaiting_parts', 'repaired', 'quality_check', 'completed', 'cancelled' |
| repairCenterId | INTEGER | Foreign key to RepairCenter |
| pickupRequired | BOOLEAN | Whether pickup is needed |
| addressId | INTEGER | Foreign key to Address |
| scheduledDate | DATE | Scheduled repair date |
| completedDate | DATE | Completion date |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

### RepairQuote

Quotes provided for repair requests.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| repairRequestId | INTEGER | Foreign key to RepairRequest |
| repairCenterId | INTEGER | Foreign key to RepairCenter |
| laborCost | DECIMAL | Labor cost |
| partsCost | DECIMAL | Parts cost |
| taxAmount | DECIMAL | Tax amount |
| totalCost | DECIMAL | Total cost |
| estimatedDays | INTEGER | Estimated days to repair |
| validUntil | DATE | Quote validity date |
| status | ENUM | 'pending', 'accepted', 'rejected', 'expired' |
| notes | TEXT | Quote notes |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

### RepairLog

Activity logs for repairs.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| repairRequestId | INTEGER | Foreign key to RepairRequest |
| userId | INTEGER | Foreign key to User |
| status | STRING | Status update |
| notes | TEXT | Log notes |
| createdAt | DATE | Creation timestamp |

### RepairPart

Parts used in repairs.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| repairRequestId | INTEGER | Foreign key to RepairRequest |
| name | STRING | Part name |
| description | TEXT | Part description |
| cost | DECIMAL | Part cost |
| status | ENUM | 'needed', 'ordered', 'received', 'installed' |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

## Payment and Reviews

### Payment

Payment records for orders and repairs.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| userId | INTEGER | Foreign key to User |
| orderId | INTEGER | Foreign key to Order |
| repairQuoteId | INTEGER | Foreign key to RepairQuote |
| amount | DECIMAL | Payment amount |
| currency | STRING | Currency code |
| method | STRING | Payment method |
| status | ENUM | 'pending', 'processing', 'succeeded', 'failed', 'refunded' |
| gatewayId | STRING | Payment gateway ID |
| gatewayResponse | TEXT | Response from gateway |
| errorMessage | STRING | Error message if failed |
| refundedAmount | DECIMAL | Amount refunded |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

### Review

Reviews for products, sellers, and repair centers.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| userId | INTEGER | Foreign key to User |
| productId | INTEGER | Foreign key to Product |
| repairRequestId | INTEGER | Foreign key to RepairRequest |
| sellerId | INTEGER | Foreign key to Seller |
| repairCenterId | INTEGER | Foreign key to RepairCenter |
| rating | INTEGER | Rating (1-5) |
| title | STRING | Review title |
| comment | TEXT | Review text |
| status | ENUM | 'pending', 'approved', 'rejected' |
| isVerifiedPurchase | BOOLEAN | Is from verified purchase |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

## System Models

### KycDocument

KYC (Know Your Customer) documents for sellers and repair centers.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| userId | INTEGER | Foreign key to User |
| documentType | ENUM | 'id_card', 'business_license', 'tax_certificate', 'proof_of_address', 'other' |
| documentUrl | STRING | Document URL |
| status | ENUM | 'pending', 'approved', 'rejected' |
| reviewedBy | INTEGER | Foreign key to reviewing admin |
| reviewedAt | DATE | Review timestamp |
| notes | TEXT | Review notes |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

### AuditLog

System audit logs.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| userId | INTEGER | Foreign key to User |
| action | STRING | Action performed |
| targetType | STRING | Target entity type |
| targetId | INTEGER | Target entity ID |
| beforeSnapshot | TEXT | Data before change |
| afterSnapshot | TEXT | Data after change |
| ip | STRING | IP address |
| userAgent | STRING | Browser/device info |
| createdAt | DATE | Creation timestamp |

### Notification

User notifications.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| userId | INTEGER | Foreign key to User |
| type | STRING | Notification type |
| title | STRING | Notification title |
| message | TEXT | Notification message |
| read | BOOLEAN | Read status |
| linkUrl | STRING | Related URL |
| createdAt | DATE | Creation timestamp |
| updatedAt | DATE | Last update timestamp |

## Entity Relationships

### User Relationships
- User has one Admin, Seller, or RepairCenter profile
- User has many Addresses
- User has one Cart and one Wishlist
- User has many Orders (as buyer)
- User has many RepairRequests
- User has many Reviews
- User has many Payments
- User has many AuditLogs and Notifications

### Product Relationships
- Product belongs to a Seller
- Product has many ProductImages
- Product belongs to many Categories (through ProductCategory)
- Product has many CartItems and WishlistItems
- Product has many OrderItems
- Product has many Reviews

### Order Relationships
- Order belongs to a User (buyer)
- Order has many OrderItems
- Order has many Payments

### Repair Relationships
- RepairRequest belongs to a User
- RepairRequest belongs to a RepairCenter
- RepairRequest has many RepairQuotes
- RepairRequest has many RepairLogs
- RepairRequest has many RepairParts
- RepairRequest has one Review