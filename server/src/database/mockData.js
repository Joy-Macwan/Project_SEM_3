const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const allModels = require('./allModels');

// Helper function to hash passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Generate random users
const generateUsers = async (count, role = 'buyer') => {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const user = await allModels.User.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await hashPassword('password123'),
      role: role,
      status: 'active',
      createdAt: faker.date.past(),
    });
    
    // Create address for user
    await allModels.Address.create({
      userId: user.id,
      addressType: 'shipping',
      name: user.name,
      line1: faker.location.streetAddress(),
      line2: faker.location.secondaryAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      postalCode: faker.location.zipCode(),
      country: 'US',
      phone: faker.phone.number(),
      isDefault: true
    });
    
    // Create cart and wishlist for buyers
    if (role === 'buyer') {
      await allModels.Cart.create({
        userId: user.id
      });
      
      await allModels.Wishlist.create({
        userId: user.id
      });
    }
    
    users.push(user);
  }
  
  return users;
};

// Generate sellers with business info
const generateSellers = async (count) => {
  const sellers = [];
  const users = await generateUsers(count, 'seller');
  
  for (const user of users) {
    const seller = await allModels.Seller.create({
      userId: user.id,
      businessName: faker.company.name(),
      businessAddress: faker.location.streetAddress(),
      taxId: `TAX${faker.string.numeric(9)}`,
      contactPhone: faker.phone.number(),
      kycStatus: faker.helpers.arrayElement(['pending', 'approved', 'rejected']),
      createdAt: user.createdAt
    });
    
    sellers.push(seller);
  }
  
  return sellers;
};

// Generate repair centers with business info
const generateRepairCenters = async (count) => {
  const repairCenters = [];
  const users = await generateUsers(count, 'repairCenter');
  
  for (const user of users) {
    const repairCenter = await allModels.RepairCenter.create({
      userId: user.id,
      businessName: `${faker.company.name()} Repairs`,
      businessAddress: faker.location.streetAddress(),
      taxId: `TAX${faker.string.numeric(9)}`,
      contactPhone: faker.phone.number(),
      serviceRadius: faker.number.float({ min: 5, max: 50, precision: 0.1 }),
      kycStatus: faker.helpers.arrayElement(['pending', 'approved', 'rejected']),
      createdAt: user.createdAt
    });
    
    repairCenters.push(repairCenter);
  }
  
  return repairCenters;
};

// Generate products for sellers
const generateProducts = async (sellerId, count) => {
  const products = [];
  const categories = await allModels.Category.findAll();
  
  for (let i = 0; i < count; i++) {
    const condition = faker.helpers.arrayElement(['new', 'like_new', 'good', 'fair', 'parts_only']);
    const price = faker.number.float({ min: 10, max: 1000, precision: 0.01 });
    
    const product = await allModels.Product.create({
      sellerId: sellerId,
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: price,
      condition: condition,
      category: faker.commerce.department(),
      brand: faker.company.name(),
      model: `Model-${faker.string.alphanumeric(4)}`,
      quantity: faker.number.int({ min: 1, max: 50 }),
      status: faker.helpers.arrayElement(['draft', 'pending_approval', 'approved', 'published']),
      createdAt: faker.date.past()
    });
    
    // Add 1-3 product images
    const imageCount = faker.number.int({ min: 1, max: 3 });
    for (let j = 0; j < imageCount; j++) {
      await allModels.ProductImage.create({
        productId: product.id,
        url: faker.image.url(),
        order: j + 1,
        altText: `${product.title} image ${j + 1}`
      });
    }
    
    // Associate with 1-2 random categories
    if (categories.length > 0) {
      const categoryCount = faker.number.int({ min: 1, max: Math.min(2, categories.length) });
      const selectedCategories = faker.helpers.arrayElements(categories, categoryCount);
      
      for (const category of selectedCategories) {
        await allModels.ProductCategory.create({
          productId: product.id,
          categoryId: category.id
        });
      }
    }
    
    products.push(product);
  }
  
  return products;
};

// Generate repair requests
const generateRepairRequests = async (buyerIds, repairCenterIds, count) => {
  const requests = [];
  const statuses = ['pending', 'quoted', 'accepted', 'in_progress', 'awaiting_parts', 'repaired', 'quality_check', 'completed', 'cancelled'];
  
  for (let i = 0; i < count; i++) {
    const buyerId = buyerIds[faker.number.int({ min: 0, max: buyerIds.length - 1 })];
    const repairCenterId = repairCenterIds[faker.number.int({ min: 0, max: repairCenterIds.length - 1 })];
    const status = statuses[faker.number.int({ min: 0, max: statuses.length - 1 })];
    
    const request = await allModels.RepairRequest.create({
      userId: buyerId,
      deviceType: faker.helpers.arrayElement(['smartphone', 'laptop', 'tablet', 'desktop', 'appliance']),
      brand: faker.company.name(),
      model: `Model-${faker.string.alphanumeric(4)}`,
      issueDescription: faker.lorem.paragraph(),
      status: status,
      repairCenterId: repairCenterId,
      pickupRequired: faker.datatype.boolean(),
      scheduledDate: faker.date.future(),
      createdAt: faker.date.past()
    });
    
    // If status is beyond pending, create a repair quote
    if (status !== 'pending' && status !== 'cancelled') {
      const laborCost = faker.number.float({ min: 30, max: 200, precision: 0.01 });
      const partsCost = faker.number.float({ min: 0, max: 300, precision: 0.01 });
      const taxAmount = (laborCost + partsCost) * 0.08;
      const totalCost = laborCost + partsCost + taxAmount;
      
      await allModels.RepairQuote.create({
        repairRequestId: request.id,
        repairCenterId: repairCenterId,
        laborCost: laborCost,
        partsCost: partsCost,
        taxAmount: taxAmount,
        totalCost: totalCost,
        estimatedDays: faker.number.int({ min: 1, max: 14 }),
        validUntil: faker.date.future(),
        status: status === 'quoted' ? 'pending' : 'accepted',
        notes: faker.lorem.paragraph(),
        createdAt: request.createdAt
      });
      
      // If repair is in progress or beyond, add repair parts
      if (['in_progress', 'awaiting_parts', 'repaired', 'quality_check', 'completed'].includes(status)) {
        const partsCount = faker.number.int({ min: 1, max: 3 });
        
        for (let j = 0; j < partsCount; j++) {
          await allModels.RepairPart.create({
            repairRequestId: request.id,
            name: `${faker.commerce.productName()} Part`,
            description: faker.lorem.sentence(),
            cost: faker.number.float({ min: 10, max: 100, precision: 0.01 }),
            status: faker.helpers.arrayElement(['needed', 'ordered', 'received', 'installed']),
            createdAt: request.createdAt
          });
        }
        
        // Add some repair logs
        const logCount = faker.number.int({ min: 1, max: 5 });
        
        for (let j = 0; j < logCount; j++) {
          await allModels.RepairLog.create({
            repairRequestId: request.id,
            userId: repairCenterId,
            status: faker.helpers.arrayElement(['started', 'diagnosed', 'parts_ordered', 'parts_received', 'repairing', 'completed']),
            notes: faker.lorem.sentence(),
            createdAt: faker.date.between({ from: request.createdAt, to: new Date() })
          });
        }
      }
      
      // If completed, add payment and possibly a review
      if (status === 'completed') {
        await allModels.Payment.create({
          userId: buyerId,
          repairQuoteId: request.id,
          amount: totalCost,
          method: faker.helpers.arrayElement(['credit_card', 'paypal', 'bank_transfer']),
          status: 'succeeded',
          gatewayId: `PAY-${faker.string.alphanumeric(10)}`,
          createdAt: faker.date.between({ from: request.createdAt, to: new Date() })
        });
        
        // 70% chance to add a review
        if (faker.number.int({ min: 1, max: 10 }) <= 7) {
          await allModels.Review.create({
            userId: buyerId,
            repairRequestId: request.id,
            repairCenterId: repairCenterId,
            rating: faker.number.int({ min: 3, max: 5 }),
            title: faker.lorem.sentence(),
            comment: faker.lorem.paragraph(),
            status: 'approved',
            isVerifiedPurchase: true,
            createdAt: faker.date.between({ from: request.createdAt, to: new Date() })
          });
        }
      }
    }
    
    requests.push(request);
  }
  
  return requests;
};

// Generate orders
const generateOrders = async (buyerIds, products, count) => {
  const orders = [];
  const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const paymentStatuses = ['pending', 'authorized', 'captured', 'refunded', 'failed'];
  const paymentMethods = ['credit_card', 'paypal', 'bank_transfer'];
  
  for (let i = 0; i < count; i++) {
    const buyerId = buyerIds[faker.number.int({ min: 0, max: buyerIds.length - 1 })];
    const status = orderStatuses[faker.number.int({ min: 0, max: orderStatuses.length - 1 })];
    const paymentStatus = paymentStatuses[faker.number.int({ min: 0, max: paymentStatuses.length - 1 })];
    const paymentMethod = paymentMethods[faker.number.int({ min: 0, max: paymentMethods.length - 1 })];
    
    // Select 1-3 random products for this order
    const orderItemCount = faker.number.int({ min: 1, max: 3 });
    const orderProducts = faker.helpers.arrayElements(products, orderItemCount);
    
    let totalAmount = 0;
    const orderItems = [];
    
    // Calculate total amount from order items
    for (const product of orderProducts) {
      const quantity = faker.number.int({ min: 1, max: 3 });
      const unitPrice = parseFloat(product.price);
      const total = unitPrice * quantity;
      
      totalAmount += total;
      
      orderItems.push({
        productId: product.id,
        quantity: quantity,
        unitPrice: unitPrice,
        total: total,
        status: status,
        sellerId: product.sellerId
      });
    }
    
    // Create the order
    const order = await allModels.Order.create({
      buyerId: buyerId,
      orderNumber: `ORD-${faker.string.alphanumeric(8)}`,
      totalAmount: totalAmount,
      status: status,
      paymentStatus: paymentStatus,
      paymentMethod: paymentMethod,
      paymentId: paymentStatus !== 'pending' ? `PAY-${faker.string.alphanumeric(10)}` : null,
      shippingMethod: faker.helpers.arrayElement(['standard', 'express', 'overnight']),
      trackingNumber: status === 'shipped' || status === 'delivered' ? `TRK-${faker.string.alphanumeric(10)}` : null,
      notes: faker.lorem.sentence(),
      createdAt: faker.date.past()
    });
    
    // Create order items
    for (const item of orderItems) {
      await allModels.OrderItem.create({
        orderId: order.id,
        ...item
      });
    }
    
    // Create payment if applicable
    if (paymentStatus !== 'pending') {
      await allModels.Payment.create({
        userId: buyerId,
        orderId: order.id,
        amount: totalAmount,
        currency: 'USD',
        method: paymentMethod,
        status: paymentStatus,
        gatewayId: `PAY-${faker.string.alphanumeric(10)}`,
        gatewayResponse: JSON.stringify({ success: paymentStatus !== 'failed' }),
        errorMessage: paymentStatus === 'failed' ? 'Payment processing error' : null,
        createdAt: order.createdAt
      });
    }
    
    // Add reviews for delivered orders (50% chance per product)
    if (status === 'delivered') {
      for (const item of orderItems) {
        if (faker.number.int({ min: 1, max: 10 }) <= 5) {
          await allModels.Review.create({
            userId: buyerId,
            productId: item.productId,
            sellerId: item.sellerId,
            rating: faker.number.int({ min: 3, max: 5 }),
            title: faker.lorem.sentence(),
            comment: faker.lorem.paragraph(),
            status: 'approved',
            isVerifiedPurchase: true,
            createdAt: faker.date.between({ from: order.createdAt, to: new Date() })
          });
        }
      }
    }
    
    orders.push(order);
  }
  
  return orders;
};

const generateMockData = async () => {
  try {
    console.log('Generating mock data...');
    
    // Generate users of different roles
    console.log('Generating buyers...');
    const buyers = await generateUsers(20, 'buyer');
    const buyerIds = buyers.map(buyer => buyer.id);
    
    console.log('Generating sellers...');
    const sellers = await generateSellers(5);
    
    console.log('Generating repair centers...');
    const repairCenters = await generateRepairCenters(3);
    const repairCenterIds = repairCenters.map(rc => rc.userId);
    
    // Generate products for each seller
    console.log('Generating products...');
    let allProducts = [];
    for (const seller of sellers) {
      const products = await generateProducts(seller.id, faker.number.int({ min: 3, max: 10 }));
      allProducts = [...allProducts, ...products];
    }
    
    // Generate repair requests
    console.log('Generating repair requests...');
    await generateRepairRequests(buyerIds, repairCenterIds, 15);
    
    // Generate orders
    console.log('Generating orders...');
    await generateOrders(buyerIds, allProducts, 25);
    
    console.log('Mock data generation complete!');
  } catch (error) {
    console.error('Error generating mock data:', error);
    throw error;
  }
};

module.exports = { generateMockData };