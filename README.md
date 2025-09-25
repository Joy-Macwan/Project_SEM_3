# Repair, Reuse, Reduce Platform

An e-commerce platform focused on reducing electronic waste through repair services, refurbished product sales, and sustainable consumption.

## Project Overview

The Repair, Reuse, Reduce platform connects:
- **Buyers**: Consumers looking to purchase refurbished electronics or get items repaired
- **Sellers**: Businesses selling refurbished and sustainable products
- **Repair Centers**: Service providers offering repair services
- **Admins**: Platform managers ensuring quality and compliance

## Key Features

- Multi-role user system (Admin, Buyer, Seller, RepairCenter)
- Product marketplace for refurbished items
- Repair service request and fulfillment system
- Shopping cart and wishlist functionality
- Order management and tracking
- Reviews and ratings for products and repair services
- KYC verification for sellers and repair centers
- Comprehensive admin dashboard for platform management
- Secure authentication with JWT and refresh tokens
- Rate limiting for API endpoints
- Audit logging for security monitoring

## Technical Stack

- **Frontend**: React.js with Vite
- **Backend**: Node.js with Express
- **Database**: SQLite with Sequelize ORM
- **Authentication**: JWT with refresh tokens
- **UI Framework**: Material UI (client) / Bootstrap (admin)
- **State Management**: Context API with custom hooks
- **Form Validation**: Formik with Yup validation schemas
- **API Integration**: Axios with request/response interceptors

## Project Structure

```
/client                  # Frontend React application
  /src
    /admin              # Admin dashboard components
      /api              # Admin API integration
      /components       # Admin UI components
      /context          # Admin state management
      /hooks            # Admin custom hooks
      /pages            # Admin page components
    /buyer              # Buyer interface components
      /api              # Buyer API integration
      /components       # Buyer UI components
      /context          # Buyer state management
      /hooks            # Buyer custom hooks
      /pages            # Buyer page components
    /api                # Common API client functions
    /context            # Shared application state
    /hooks              # Shared custom hooks
    
/server                  # Backend Express application
  /src
    /controllers        # Request handlers
      /admin            # Admin-specific controllers
      /buyer            # Buyer-specific controllers
      /seller           # Seller-specific controllers
      /repairCenter     # Repair center controllers
    /routes             # API routes definitions
      /admin            # Admin route modules
      /buyer            # Buyer route modules
      /seller           # Seller route modules
      /repairCenter     # Repair center route modules
    /middleware         # Express middleware
      /auth.middleware.js  # Authentication middleware
      /audit.middleware.js # Audit logging middleware
      /rateLimit.middleware.js # Rate limiting middleware
    /database           # Database configuration
      /connection.js    # Sequelize connection setup
      /init.js          # Database initialization
      /modelsFixed.js   # Core database models
      /additionalModelsFixed.js # Additional models
      /mockData.js      # Mock data generation
    /services           # Business logic services
    /utils              # Utility functions
    /app.js             # Express application setup
    /server.js          # Server entry point
```

## Database Schema

The platform uses SQLite with Sequelize ORM for data persistence. Key entities include:

### Core Entities:
- **User**: Base user account with role-based access control
- **Admin/Buyer/Seller/RepairCenter**: Role-specific profiles
- **Product**: Items listed for sale by sellers
- **Category**: Product categorization hierarchy
- **Order/OrderItem**: Purchase transactions and line items
- **RepairRequest**: Service requests for device repairs
- **Review**: Ratings and comments for products and repair services

### Supporting Entities:
- **Cart/CartItem**: Shopping cart functionality
- **Wishlist/WishlistItem**: Saved items for future purchase
- **Payment**: Transaction records for orders and repairs
- **Address**: User shipping and billing addresses
- **KYC**: Know Your Customer verification for sellers and repair centers
- **Notification**: User notification system
- **Coupon**: Promotional discount codes
- **ReturnRequest/Refund**: Order return management

## Database Setup and Initialization

The project includes several scripts to initialize and populate the database:

```bash
# Setup the database schema (creates tables)
node server/src/database/init.js

# Generate mock data for testing
node server/src/generate-mock-data.js

# Complete setup script (installs dependencies, initializes DB, runs tests)
./setup-and-test.sh
```

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/Project_SEM_3.git
   cd Project_SEM_3
   ```

2. Run the setup script (installs dependencies, initializes DB, and tests API)
   ```bash
   ./setup-and-test.sh
   ```

   Or manually install dependencies:

   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

### Running the Application

1. Start the backend server
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend client
   ```bash
   cd client
   npm run dev
   ```

3. Access the application
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## API Documentation

The API follows RESTful principles with the following main endpoints:

### Authentication Endpoints

- `POST /api/admin/auth/login` - Admin login
- `POST /api/buyer/auth/login` - Buyer login
- `POST /api/buyer/auth/register` - Buyer registration
- `POST /api/seller/auth/login` - Seller login
- `POST /api/seller/auth/register` - Seller registration
- `POST /api/repair-center/auth/login` - Repair center login
- `POST /api/repair-center/auth/register` - Repair center registration
- `POST /api/*/auth/refresh-token` - Refresh access token
- `POST /api/*/auth/logout` - User logout

### Buyer Endpoints

- `GET /api/buyer/products` - List all products
- `GET /api/buyer/products/:id` - Get product details
- `GET /api/buyer/cart` - View shopping cart
- `POST /api/buyer/cart/add` - Add item to cart
- `PUT /api/buyer/cart/:itemId` - Update cart item
- `DELETE /api/buyer/cart/:itemId` - Remove from cart
- `POST /api/buyer/orders` - Create new order
- `GET /api/buyer/orders` - List user orders
- `GET /api/buyer/orders/:id` - Get order details
- `POST /api/buyer/repair-requests` - Create repair request
- `GET /api/buyer/repair-requests` - List user repair requests
- `GET /api/buyer/repair-requests/:id` - Get repair request details

### Seller Endpoints

- `GET /api/seller/products` - List seller products
- `POST /api/seller/products` - Create new product
- `PUT /api/seller/products/:id` - Update product
- `DELETE /api/seller/products/:id` - Delete product
- `GET /api/seller/orders` - List orders for seller products
- `PUT /api/seller/orders/:id/status` - Update order status
- `POST /api/seller/kyc` - Submit KYC information

### Repair Center Endpoints

- `GET /api/repair-center/repair-requests` - List assigned repair requests
- `PUT /api/repair-center/repair-requests/:id/quote` - Provide repair quote
- `PUT /api/repair-center/repair-requests/:id/status` - Update repair status
- `GET /api/repair-center/repair-requests/:id` - Get repair request details
- `POST /api/repair-center/kyc` - Submit KYC information

### Admin Endpoints

- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/sellers` - List all sellers
- `PUT /api/admin/sellers/:id/verification` - Update seller verification
- `GET /api/admin/repair-centers` - List all repair centers
- `PUT /api/admin/repair-centers/:id/verification` - Update repair center verification
- `GET /api/admin/products` - List all products
- `PUT /api/admin/products/:id/status` - Update product status
- `GET /api/admin/orders` - List all orders
- `GET /api/admin/repair-requests` - List all repair requests
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

## Sample Users

After running the mock data generation script, the following users are available for testing:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | Password123! |
| Buyer | john@example.com | Password123! |
| Buyer | jane@example.com | Password123! |
| Seller | david@seller.com | Password123! |
| Seller | sarah@seller.com | Password123! |
| Repair Center | thomas@repair.com | Password123! |
| Repair Center | lisa@repair.com | Password123! |

## Testing

The project includes a test script that validates API endpoints:

```bash
# Run API tests
node server/src/test-api.js
```

This script tests various endpoints for each user role, including:
- User registration and authentication
- Product listing and management
- Cart and order operations
- Repair request creation and management

## Security Features

1. **JWT Authentication**: Secure token-based authentication with short-lived access tokens and longer-lived refresh tokens
2. **Password Hashing**: Passwords stored using bcrypt with salt rounds
3. **Rate Limiting**: Prevents brute force attacks on authentication endpoints
4. **Input Validation**: Request validation using express-validator
5. **Audit Logging**: Records security-relevant events for monitoring
6. **Role-Based Access Control**: Ensures users can only access appropriate resources

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- This project was created as part of the semester 3 coursework.
- Thanks to all contributors who have helped shape this platform.
