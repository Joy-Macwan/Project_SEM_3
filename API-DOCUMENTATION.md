
# API Documentation

## Overview

This document provides comprehensive documentation for the Repair, Reuse, Reduce platform API. The API follows RESTful principles and uses JWT for authentication.

## Base URL

```
http://localhost:5000/api
```

## Authentication

The API uses JWT (JSON Web Token) for authentication with refresh token support.

### Headers

For protected endpoints, include the Authorization header:

```
Authorization: Bearer {access_token}
```

### Authentication Flow

1. User logs in and receives an access token and refresh token
2. Access token is used for API requests (expires after 15 minutes)
3. When access token expires, use refresh token to get a new access token
4. Refresh tokens have a longer lifespan (7 days) but can be revoked

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Authentication endpoints: 10 requests per 15 minutes
- Standard endpoints: 100 requests per 15 minutes

## Common Response Formats

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ] // Optional array of specific errors
}
```

## Endpoints

### Auth Endpoints

#### User Registration

```
POST /api/{role}/auth/register
```

Register a new user based on role (buyer, seller, repairCenter).

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "1234567890",
  // Additional fields based on role
  // For sellers and repair centers:
  "businessName": "Business Name",
  "businessDescription": "Business description",
  // For repair centers:
  "specializations": ["Electronics", "Computers"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "buyer",
      "isVerified": false,
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### User Login

```
POST /api/{role}/auth/login
```

Authenticate a user and get access and refresh tokens.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "buyer"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Refresh Token

```
POST /api/{role}/auth/refresh-token
```

Get a new access token using a refresh token.

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Logout

```
POST /api/{role}/auth/logout
```

Invalidate the refresh token.

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Email Verification

```
GET /api/{role}/auth/verify-email/:token
```

Verify a user's email address using the token sent via email.

**Response:**

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### Password Reset Request

```
POST /api/{role}/auth/forgot-password
```

Request a password reset link sent to email.

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### Password Reset

```
POST /api/{role}/auth/reset-password/:token
```

Reset password using the token sent via email.

**Request Body:**

```json
{
  "password": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

### Buyer Endpoints

#### Get Products

```
GET /api/buyer/products
```

Get a list of products with optional filtering and pagination.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term
- `category`: Category ID
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `condition`: Product condition
- `sort`: Sort field (price, createdAt)
- `order`: Sort order (asc, desc)

**Response:**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Smartphone Pro Max",
        "description": "Latest smartphone with 5G capability",
        "price": 999.99,
        "images": ["url1", "url2"],
        "condition": "new",
        "seller": {
          "id": 1,
          "businessName": "Tech Shop"
        },
        "category": {
          "id": 2,
          "name": "Smartphones"
        },
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "totalItems": 100,
      "totalPages": 10,
      "currentPage": 1,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Get Product Details

```
GET /api/buyer/products/:id
```

Get detailed information about a specific product.

**Response:**

```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "name": "Smartphone Pro Max",
      "description": "Latest smartphone with 5G capability",
      "price": 999.99,
      "stock": 10,
      "images": ["url1", "url2"],
      "condition": "new",
      "seller": {
        "id": 1,
        "businessName": "Tech Shop",
        "rating": 4.5
      },
      "category": {
        "id": 2,
        "name": "Smartphones"
      },
      "reviews": [
        {
          "id": 1,
          "rating": 5,
          "comment": "Excellent product!",
          "user": {
            "id": 3,
            "firstName": "Jane"
          },
          "createdAt": "2023-01-05T00:00:00.000Z"
        }
      ],
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### Get Cart

```
GET /api/buyer/cart
```

Get the current user's shopping cart.

**Response:**

```json
{
  "success": true,
  "data": {
    "cart": {
      "id": 1,
      "items": [
        {
          "id": 1,
          "quantity": 2,
          "product": {
            "id": 1,
            "name": "Smartphone Pro Max",
            "price": 999.99,
            "image": "url1",
            "seller": {
              "id": 1,
              "businessName": "Tech Shop"
            }
          }
        }
      ],
      "totalItems": 2,
      "subtotal": 1999.98
    }
  }
}
```

#### Add to Cart

```
POST /api/buyer/cart/add
```

Add a product to the shopping cart.

**Request Body:**

```json
{
  "productId": 1,
  "quantity": 2
}
```

**Response:**

```json
{
  "success": true,
  "message": "Product added to cart",
  "data": {
    "cart": {
      "id": 1,
      "items": [
        {
          "id": 1,
          "quantity": 2,
          "product": {
            "id": 1,
            "name": "Smartphone Pro Max",
            "price": 999.99
          }
        }
      ],
      "totalItems": 2,
      "subtotal": 1999.98
    }
  }
}
```

#### Update Cart Item

```
PUT /api/buyer/cart/:itemId
```

Update the quantity of a cart item.

**Request Body:**

```json
{
  "quantity": 3
}
```

**Response:**

```json
{
  "success": true,
  "message": "Cart updated",
  "data": {
    "cart": {
      "id": 1,
      "items": [
        {
          "id": 1,
          "quantity": 3,
          "product": {
            "id": 1,
            "name": "Smartphone Pro Max",
            "price": 999.99
          }
        }
      ],
      "totalItems": 3,
      "subtotal": 2999.97
    }
  }
}
```

#### Remove from Cart

```
DELETE /api/buyer/cart/:itemId
```

Remove an item from the shopping cart.

**Response:**

```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": {
    "cart": {
      "id": 1,
      "items": [],
      "totalItems": 0,
      "subtotal": 0
    }
  }
}
```

#### Create Order

```
POST /api/buyer/orders
```

Create a new order from the cart items.

**Request Body:**

```json
{
  "shippingAddressId": 1,
  "paymentMethod": "credit_card",
  "couponCode": "DISCOUNT10" // Optional
}
```

**Response:**

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": 1,
      "orderNumber": "ORD-123456",
      "totalAmount": 2999.97,
      "status": "pending",
      "paymentStatus": "pending",
      "createdAt": "2023-01-10T00:00:00.000Z"
    },
    "paymentUrl": "https://payment-gateway.com/pay/123" // If applicable
  }
}
```

#### Get User Orders

```
GET /api/buyer/orders
```

Get a list of the user's orders.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by order status

**Response:**

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 1,
        "orderNumber": "ORD-123456",
        "totalAmount": 2999.97,
        "status": "processing",
        "paymentStatus": "paid",
        "items": [
          {
            "id": 1,
            "quantity": 3,
            "product": {
              "id": A,
              "name": "Smartphone Pro Max",
              "price": 999.99,
              "image": "url1"
            }
          }
        ],
        "createdAt": "2023-01-10T00:00:00.000Z"
      }
    ],
    "pagination": {
      "totalItems": 5,
      "totalPages": 1,
      "currentPage": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

#### Get Order Details

```
GET /api/buyer/orders/:id
```

Get detailed information about a specific order.

**Response:**

```json
{
  "success": true,
  "data": {
    "order": {
      "id": 1,
      "orderNumber": "ORD-123456",
      "totalAmount": 2999.97,
      "status": "processing",
      "paymentStatus": "paid",
      "shippingMethod": "standard",
      "trackingNumber": "TRK-123456",
      "items": [
        {
          "id": 1,
          "quantity": 3,
          "unitPrice": 999.99,
          "total": 2999.97,
          "product": {
            "id": 1,
            "name": "Smartphone Pro Max",
            "image": "url1"
          },
          "seller": {
            "id": 1,
            "businessName": "Tech Shop"
          }
        }
      ],
      "shippingAddress": {
        "id": 1,
        "name": "John Doe",
        "line1": "123 Main St",
        "line2": "Apt 4B",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "US",
        "phone": "1234567890"
      },
      "payment": {
        "id": 1,
        "method": "credit_card",
        "amount": 2999.97,
        "status": "completed",
        "createdAt": "2023-01-10T00:00:00.000Z"
      },
      "timeline": [
        {
          "status": "pending",
          "timestamp": "2023-01-10T00:00:00.000Z"
        },
        {
          "status": "processing",
          "timestamp": "2023-01-11T00:00:00.000Z"
        }
      ],
      "createdAt": "2023-01-10T00:00:00.000Z"
    }
  }
}
```

#### Create Repair Request

```
POST /api/buyer/repair-requests
```

Create a new repair request.

**Request Body:**

```json
{
  "deviceType": "smartphone",
  "brand": "Apple",
  "model": "iPhone 13",
  "issueDescription": "Cracked screen and battery issues",
  "repairCenterId": 1, // Optional, if user has selected a specific repair center
  "pickupRequired": true, // Whether pickup service is needed
  "preferredDate": "2023-01-20T10:00:00.000Z", // Optional preferred appointment
  "addressId": 1, // User's address for the device
  "images": ["base64image1", "base64image2"] // Optional device images
}
```

**Response:**

```json
{
  "success": true,
  "message": "Repair request created successfully",
  "data": {
    "repairRequest": {
      "id": 1,
      "requestNumber": "REP-123456",
      "deviceType": "smartphone",
      "brand": "Apple",
      "model": "iPhone 13",
      "issueDescription": "Cracked screen and battery issues",
      "status": "pending",
      "createdAt": "2023-01-15T00:00:00.000Z"
    }
  }
}
```

#### Get User Repair Requests

```
GET /api/buyer/repair-requests
```

Get a list of the user's repair requests.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by repair status

**Response:**

```json
{
  "success": true,
  "data": {
    "repairRequests": [
      {
        "id": 1,
        "requestNumber": "REP-123456",
        "deviceType": "smartphone",
        "brand": "Apple",
        "model": "iPhone 13",
        "status": "quoted",
        "repairCenter": {
          "id": 1,
          "businessName": "Fix It Center"
        },
        "estimatedCost": 149.99,
        "createdAt": "2023-01-15T00:00:00.000Z"
      }
    ],
    "pagination": {
      "totalItems": 3,
      "totalPages": 1,
      "currentPage": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

#### Get Repair Request Details

```
GET /api/buyer/repair-requests/:id
```

Get detailed information about a specific repair request.

**Response:**

```json
{
  "success": true,
  "data": {
    "repairRequest": {
      "id": 1,
      "requestNumber": "REP-123456",
      "deviceType": "smartphone",
      "brand": "Apple",
      "model": "iPhone 13",
      "issueDescription": "Cracked screen and battery issues",
      "status": "quoted",
      "repairCenter": {
        "id": 1,
        "businessName": "Fix It Center",
        "address": "456 Repair St, Repair City",
        "phone": "9876543210",
        "rating": 4.8
      },
      "estimatedCost": 149.99,
      "estimatedTime": "3-5 days",
      "quote": {
        "id": 1,
        "laborCost": 79.99,
        "partsCost": 60.00,
        "taxAmount": 10.00,
        "totalCost": 149.99,
        "validUntil": "2023-01-25T00:00:00.000Z",
        "notes": "Screen replacement and battery test included"
      },
      "timeline": [
        {
          "status": "pending",
          "timestamp": "2023-01-15T00:00:00.000Z"
        },
        {
          "status": "quoted",
          "timestamp": "2023-01-16T00:00:00.000Z"
        }
      ],
      "address": {
        "id": 1,
        "name": "John Doe",
        "line1": "123 Main St",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001"
      },
      "createdAt": "2023-01-15T00:00:00.000Z"
    }
  }
}
```

#### Accept Repair Quote

```
PUT /api/buyer/repair-requests/:id/accept-quote
```

Accept a repair quote.

**Response:**

```json
{
  "success": true,
  "message": "Repair quote accepted",
  "data": {
    "repairRequest": {
      "id": 1,
      "requestNumber": "REP-123456",
      "status": "accepted",
      "paymentUrl": "https://payment-gateway.com/pay/repair123" // If applicable
    }
  }
}
```

### Seller Endpoints

#### Get Seller Products

```
GET /api/seller/products
```

Get a list of the seller's products.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by product status
- `search`: Search term

**Response:**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Smartphone Pro Max",
        "description": "Latest smartphone with 5G capability",
        "price": 999.99,
        "stock": 10,
        "images": ["url1"],
        "status": "active",
        "sales": 15,
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "totalItems": 20,
      "totalPages": 2,
      "currentPage": 1,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Create Product

```
POST /api/seller/products
```

Create a new product listing.

**Request Body:**

```json
{
  "name": "Laptop Ultra",
  "description": "Powerful laptop with 16GB RAM",
  "price": 1299.99,
  "stock": 5,
  "categoryId": 3,
  "condition": "refurbished",
  "brand": "TechBrand",
  "model": "Ultra X5",
  "images": ["base64image1", "base64image2"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {
      "id": 2,
      "name": "Laptop Ultra",
      "description": "Powerful laptop with 16GB RAM",
      "price": 1299.99,
      "stock": 5,
      "status": "pending_approval",
      "images": ["url1", "url2"],
      "createdAt": "2023-01-20T00:00:00.000Z"
    }
  }
}
```

#### Update Product

```
PUT /api/seller/products/:id
```

Update an existing product.

**Request Body:**

```json
{
  "price": 1199.99,
  "stock": 8,
  "description": "Powerful laptop with 16GB RAM and 512GB SSD"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "product": {
      "id": 2,
      "name": "Laptop Ultra",
      "description": "Powerful laptop with 16GB RAM and 512GB SSD",
      "price": 1199.99,
      "stock": 8,
      "status": "active"
    }
  }
}
```

#### Delete Product

```
DELETE /api/seller/products/:id
```

Delete a product listing.

**Response:**

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

#### Get Seller Orders

```
GET /api/seller/orders
```

Get orders for the seller's products.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by order status

**Response:**

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 1,
        "orderNumber": "ORD-123456",
        "buyer": {
          "id": 3,
          "name": "John Doe"
        },
        "items": [
          {
            "id": 1,
            "productId": 1,
            "productName": "Smartphone Pro Max",
            "quantity": 3,
            "unitPrice": 999.99,
            "total": 2999.97
          }
        ],
        "totalAmount": 2999.97,
        "status": "processing",
        "createdAt": "2023-01-10T00:00:00.000Z"
      }
    ],
    "pagination": {
      "totalItems": 5,
      "totalPages": 1,
      "currentPage": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

#### Update Order Status

```
PUT /api/seller/orders/:id/status
```

Update the status of an order.

**Request Body:**

```json
{
  "status": "shipped",
  "trackingNumber": "TRK-987654" // Required for shipped status
}
```

**Response:**

```json
{
  "success": true,
  "message": "Order status updated to shipped",
  "data": {
    "order": {
      "id": 1,
      "orderNumber": "ORD-123456",
      "status": "shipped",
      "trackingNumber": "TRK-987654",
      "updatedAt": "2023-01-12T00:00:00.000Z"
    }
  }
}
```

#### Submit KYC

```
POST /api/seller/kyc
```

Submit KYC (Know Your Customer) information.

**Request Body:**

```json
{
  "documentType": "businessId",
  "documentNumber": "BIZ123456",
  "businessRegistrationDoc": "base64pdf",
  "idProof": "base64image",
  "addressProof": "base64image"
}
```

**Response:**

```json
{
  "success": true,
  "message": "KYC information submitted successfully",
  "data": {
    "kyc": {
      "id": 1,
      "documentType": "businessId",
      "documentNumber": "BIZ123456",
      "verificationStatus": "pending",
      "createdAt": "2023-01-25T00:00:00.000Z"
    }
  }
}
```

### Repair Center Endpoints

#### Get Repair Requests

```
GET /api/repair-center/repair-requests
```

Get repair requests assigned to the repair center.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by repair status

**Response:**

```json
{
  "success": true,
  "data": {
    "repairRequests": [
      {
        "id": 1,
        "requestNumber": "REP-123456",
        "deviceType": "smartphone",
        "brand": "Apple",
        "model": "iPhone 13",
        "issueDescription": "Cracked screen and battery issues",
        "buyer": {
          "id": 3,
          "name": "John Doe"
        },
        "status": "pending",
        "createdAt": "2023-01-15T00:00:00.000Z"
      }
    ],
    "pagination": {
      "totalItems": 8,
      "totalPages": 1,
      "currentPage": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

#### Provide Repair Quote

```
PUT /api/repair-center/repair-requests/:id/quote
```

Provide a quote for a repair request.

**Request Body:**

```json
{
  "laborCost": 79.99,
  "partsCost": 60.00,
  "taxAmount": 10.00,
  "totalCost": 149.99,
  "estimatedDays": 4,
  "notes": "Screen replacement and battery test included"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Repair quote provided successfully",
  "data": {
    "repairRequest": {
      "id": 1,
      "requestNumber": "REP-123456",
      "status": "quoted",
      "quote": {
        "laborCost": 79.99,
        "partsCost": 60.00,
        "taxAmount": 10.00,
        "totalCost": 149.99,
        "estimatedDays": 4,
        "notes": "Screen replacement and battery test included"
      }
    }
  }
}
```

#### Update Repair Status

```
PUT /api/repair-center/repair-requests/:id/status
```

Update the status of a repair request.

**Request Body:**

```json
{
  "status": "in_progress",
  "notes": "Started disassembly and diagnostics"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Repair status updated to in_progress",
  "data": {
    "repairRequest": {
      "id": 1,
      "requestNumber": "REP-123456",
      "status": "in_progress",
      "updatedAt": "2023-01-18T00:00:00.000Z"
    }
  }
}
```

#### Complete Repair

```
PUT /api/repair-center/repair-requests/:id/complete
```

Mark a repair as completed.

**Request Body:**

```json
{
  "finalCost": 149.99,
  "completionNotes": "Screen replaced and battery optimized",
  "images": ["base64image1"] // Optional images of completed repair
}
```

**Response:**

```json
{
  "success": true,
  "message": "Repair marked as completed",
  "data": {
    "repairRequest": {
      "id": 1,
      "requestNumber": "REP-123456",
      "status": "completed",
      "finalCost": 149.99,
      "completionDate": "2023-01-20T00:00:00.000Z"
    }
  }
}
```

### Admin Endpoints

#### Get All Users

```
GET /api/admin/users
```

Get a list of all users.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `role`: Filter by user role
- `status`: Filter by user status
- `search`: Search by name or email

**Response:**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "role": "buyer",
        "status": "active",
        "isVerified": true,
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "totalItems": 30,
      "totalPages": 3,
      "currentPage": 1,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Update User Status

```
PUT /api/admin/users/:id/status
```

Update a user's status (activate/deactivate).

**Request Body:**

```json
{
  "status": "inactive",
  "reason": "Suspicious activity" // Optional
}
```

**Response:**

```json
{
  "success": true,
  "message": "User status updated to inactive",
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "status": "inactive",
      "updatedAt": "2023-01-30T00:00:00.000Z"
    }
  }
}
```

#### Get All Products

```
GET /api/admin/products
```

Get a list of all products.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by product status
- `sellerId`: Filter by seller
- `search`: Search by product name

**Response:**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Smartphone Pro Max",
        "price": 999.99,
        "seller": {
          "id": 2,
          "businessName": "Tech Shop"
        },
        "status": "active",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "totalItems": 50,
      "totalPages": 5,
      "currentPage": 1,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Update Product Status

```
PUT /api/admin/products/:id/status
```

Approve or reject a product.

**Request Body:**

```json
{
  "status": "approved",
  "reason": "Meets marketplace standards" // Optional
}
```

**Response:**

```json
{
  "success": true,
  "message": "Product approved",
  "data": {
    "product": {
      "id": 1,
      "name": "Smartphone Pro Max",
      "status": "active",
      "updatedAt": "2023-01-05T00:00:00.000Z"
    }
  }
}
```

#### Get Seller Verification Requests

```
GET /api/admin/sellers/verification
```

Get seller KYC verification requests.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by verification status

**Response:**

```json
{
  "success": true,
  "data": {
    "verificationRequests": [
      {
        "id": 1,
        "seller": {
          "id": 2,
          "businessName": "Tech Shop",
          "user": {
            "id": 5,
            "name": "David Wilson",
            "email": "david@seller.com"
          }
        },
        "documentType": "businessId",
        "documentNumber": "BIZ123456",
        "verificationStatus": "pending",
        "createdAt": "2023-01-25T00:00:00.000Z"
      }
    ],
    "pagination": {
      "totalItems": 3,
      "totalPages": 1,
      "currentPage": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

#### Update Seller Verification

```
PUT /api/admin/sellers/:id/verification
```

Approve or reject a seller's verification.

**Request Body:**

```json
{
  "verificationStatus": "verified",
  "notes": "All documents verified" // Optional
}
```

**Response:**

```json
{
  "success": true,
  "message": "Seller verification status updated to verified",
  "data": {
    "seller": {
      "id": 2,
      "businessName": "Tech Shop",
      "verificationStatus": "verified",
      "updatedAt": "2023-01-26T00:00:00.000Z"
    }
  }
}
```

#### Get Dashboard Statistics

```
GET /api/admin/dashboard/stats
```

Get statistics for the admin dashboard.

**Response:**

```json
{
  "success": true,
  "data": {
    "users": {
      "total": 100,
      "buyers": 80,
      "sellers": 15,
      "repairCenters": 5,
      "newToday": 3
    },
    "products": {
      "total": 200,
      "active": 180,
      "pendingApproval": 20
    },
    "orders": {
      "total": 150,
      "pending": 10,
      "processing": 20,
      "shipped": 30,
      "delivered": 80,
      "cancelled": 10,
      "totalRevenue": 50000
    },
    "repairRequests": {
      "total": 75,
      "pending": 15,
      "inProgress": 25,
      "completed": 30,
      "cancelled": 5,
      "totalRevenue": 10000
    },
    "recentActivity": [
      {
        "type": "new_user",
        "details": "New buyer registered",
        "timestamp": "2023-01-30T10:00:00.000Z"
      },
      {
        "type": "new_order",
        "details": "Order #ORD-123456 created",
        "timestamp": "2023-01-30T09:30:00.000Z"
      }
    ]
  }
}
```

## Error Codes

The API uses standard HTTP status codes:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Permission denied
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Common Error Responses

### Validation Error

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Must be a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### Authentication Error

```json
{
  "success": false,
  "message": "Authentication failed",
  "error": "Invalid credentials"
}
```

### Not Found Error

```json
{
  "success": false,
  "message": "Resource not found",
  "error": "The requested product does not exist"
}
```

### Rate Limit Error

```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "error": "Too many requests, please try again later",
  "retryAfter": 60
}
```