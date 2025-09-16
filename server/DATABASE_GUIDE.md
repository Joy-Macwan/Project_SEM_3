# Repair, Reuse, Reduce Platform Database Guide

This document provides instructions for working with the database layer of the Repair, Reuse, Reduce e-commerce platform.

## Setup

The platform uses SQLite with Sequelize ORM for data persistence. The database file is located at:

```
/server/database/repair_reuse_reduce.sqlite
```

## Database Initialization

We provide several npm scripts to initialize and manage the database:

```bash
# Initialize database with basic data
npm run db:init

# Reset database (WARNING: this deletes all data)
npm run db:reset

# Initialize with additional mock data
npm run db:mock

# Reset and initialize with mock data
npm run db:reset-mock

# Check database status
npm run db:check
```

## Model Structure

The database models are organized in two main files:

1. `modelsFixed.js` - Core models (User, Admin, Seller, RepairCenter, Product, Order)
2. `additionalModelsFixed.js` - Additional models (Cart, Wishlist, Category, etc.)

All models are exported together in `allModels.js` for convenience.

## Working with Models

To use the models in your controllers, import them from the `allModels.js` file:

```javascript
const { User, Product, Cart, CartItem } = require('../database/allModels');
```

### Basic Query Examples

#### Finding records

```javascript
// Find a user by email
const user = await User.findOne({ where: { email: 'user@example.com' } });

// Find all active products
const products = await Product.findAll({ 
  where: { status: 'published' },
  order: [['createdAt', 'DESC']]
});

// Find product with relations
const product = await Product.findByPk(productId, {
  include: [
    { model: ProductImage },
    { model: Review }
  ]
});
```

#### Creating records

```javascript
// Create a new user
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: hashedPassword,
  role: 'buyer',
  status: 'active'
});

// Create a cart for the user
const cart = await Cart.create({
  userId: user.id
});

// Add item to cart
await CartItem.create({
  cartId: cart.id,
  productId: 1,
  quantity: 2
});
```

#### Updating records

```javascript
// Update a product
await Product.update(
  { price: 149.99, quantity: 10 },
  { where: { id: productId } }
);

// Update order status
await Order.update(
  { status: 'shipped', trackingNumber: 'TRACK123456' },
  { where: { id: orderId } }
);
```

#### Deleting records

```javascript
// Remove an item from cart
await CartItem.destroy({
  where: {
    cartId: cart.id,
    productId: productId
  }
});

// Delete a user account (careful!)
await User.destroy({
  where: { id: userId }
});
```

## Transactions

For operations that modify multiple tables, use transactions to ensure data integrity:

```javascript
const transaction = await sequelize.transaction();

try {
  // Create order
  const order = await Order.create({
    userId: user.id,
    addressId: shippingAddress.id,
    orderNumber: generateOrderNumber(),
    status: 'pending',
    totalAmount: totalAmount,
    // ... other order fields
  }, { transaction });
  
  // Create order items
  for (const item of cartItems) {
    await OrderItem.create({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    }, { transaction });
    
    // Update product inventory
    await Product.decrement('quantity', {
      by: item.quantity,
      where: { id: item.productId },
      transaction
    });
  }
  
  // Clear the cart
  await CartItem.destroy({
    where: { cartId: cart.id },
    transaction
  });
  
  // Commit the transaction
  await transaction.commit();
  
  return order;
} catch (error) {
  // Rollback in case of error
  await transaction.rollback();
  throw error;
}
```

## Database Schema Documentation

For a complete overview of all database models and their relationships, refer to the [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) file.

## Troubleshooting

If you encounter database issues, you can:

1. Check the database status with `npm run db:check`
2. Reset the database with `npm run db:reset` (warning: this deletes all data)
3. Examine the database file directly with a SQLite browser
4. Check the console logs for Sequelize errors

## Best Practices

1. Always use transactions for multi-table operations
2. Add proper validation in your models
3. Handle database errors gracefully in your controllers
4. Use eager loading (include) to avoid N+1 query problems
5. Add indexes for frequently queried fields
6. Be careful with cascade delete operations