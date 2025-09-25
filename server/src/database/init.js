const sequelize = require('./connection');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { setupAssociations, ...allModels } = require('./allModels');

// Helper function to hash passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const seedDatabase = async () => {
  try {
    // Create admin user if not exists
    const adminExists = await allModels.User.findOne({
      where: { email: 'admin@example.com', role: 'admin' }
    });
    
    if (!adminExists) {
      console.log('Creating admin user...');
      
      // Create admin user
      const adminUser = await allModels.User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: await hashPassword('admin123'),
        role: 'admin',
        status: 'active'
      });
      
      // Create admin profile
      await allModels.Admin.create({
        userId: adminUser.id,
        adminLevel: 'super_admin',
        mfaEnabled: false
      });
      
      console.log('Admin user created successfully');
    }

    // Create sample categories if not exist
    const categories = [
      { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets' },
      { name: 'Smartphones', slug: 'smartphones', description: 'Mobile phones and accessories', parentId: 1 },
      { name: 'Laptops', slug: 'laptops', description: 'Laptops and notebooks', parentId: 1 },
      { name: 'Appliances', slug: 'appliances', description: 'Home appliances' },
      { name: 'Furniture', slug: 'furniture', description: 'Home and office furniture' },
      { name: 'Clothing', slug: 'clothing', description: 'Clothing and fashion accessories' }
    ];

    for (const category of categories) {
      const [cat, created] = await allModels.Category.findOrCreate({
        where: { slug: category.slug },
        defaults: category
      });
      
      if (created) {
        console.log(`Created category: ${category.name}`);
      }
    }

    // Create sample seller if not exists
    const sellerExists = await allModels.User.findOne({
      where: { email: 'seller@example.com', role: 'seller' }
    });
    
    if (!sellerExists) {
      console.log('Creating sample seller...');
      
      // Create seller user
      const sellerUser = await allModels.User.create({
        name: 'Sample Seller',
        email: 'seller@example.com',
        password: await hashPassword('seller123'),
        role: 'seller',
        status: 'active'
      });
      
      // Create seller profile
      await allModels.Seller.create({
        userId: sellerUser.id,
        businessName: 'Eco Gadgets',
        businessAddress: '123 Tech Street, Eco City, EC 12345',
        taxId: 'TAX12345678',
        contactPhone: '555-123-4567',
        kycStatus: 'approved',
        kycApprovedBy: 1,
        kycApprovedAt: new Date()
      });
      
      console.log('Sample seller created successfully');

      // Create sample products for this seller
      const smartphones = await allModels.Category.findOne({ where: { slug: 'smartphones' } });
      const laptops = await allModels.Category.findOne({ where: { slug: 'laptops' } });
      
      const seller = await allModels.Seller.findOne({ where: { userId: sellerUser.id } });
      
      // Create smartphone product
      const phone = await allModels.Product.create({
        sellerId: seller.id,
        title: 'Refurbished Smartphone XYZ',
        description: 'A fully refurbished smartphone in excellent condition. Features include 6.1" display, 128GB storage, and 8GB RAM.',
        price: 299.99,
        condition: 'like_new',
        category: 'Electronics',
        brand: 'XYZ',
        model: 'S10',
        quantity: 5,
        status: 'published'
      });
      
      // Create laptop product
      const laptop = await allModels.Product.create({
        sellerId: seller.id,
        title: 'Refurbished Laptop Pro',
        description: 'Professionally refurbished laptop with 15" display, 512GB SSD, 16GB RAM, and latest OS installed.',
        price: 699.99,
        condition: 'good',
        category: 'Electronics',
        brand: 'ProBook',
        model: 'X15',
        quantity: 3,
        status: 'published'
      });
      
            // Add another image
      await allModels.ProductImage.create({
        productId: phone.id,
        url: 'https://example.com/images/smartphone1.jpg',
        order: 1,
        altText: 'Refurbished Smartphone XYZ front view'
      });
      
      await allModels.ProductImage.create({
        productId: laptop.id,
        url: 'https://example.com/images/laptop1.jpg',
        order: 1,
        altText: 'Refurbished Laptop Pro front view'
      });
      
      // Associate products with categories
      if (smartphones) {
        await allModels.ProductCategory.create({
          productId: phone.id,
          categoryId: smartphones.id
        });
      }
      
      if (laptops) {
        await allModels.ProductCategory.create({
          productId: laptop.id,
          categoryId: laptops.id
        });
      }
      
      console.log('Sample products created successfully');
    }

    // Create sample repair center if not exists
    const repairCenterExists = await allModels.User.findOne({
      where: { email: 'repair@example.com', role: 'repairCenter' }
    });
    
    if (!repairCenterExists) {
      console.log('Creating sample repair center...');
      
      // Create repair center user
      const repairUser = await allModels.User.create({
        name: 'Fix It All Center',
        email: 'repair@example.com',
        password: await hashPassword('repair123'),
        role: 'repairCenter',
        status: 'active'
      });
      
      // Create repair center profile
      await allModels.RepairCenter.create({
        userId: repairUser.id,
        businessName: 'Fix It All Center',
        businessAddress: '456 Repair Avenue, Fix City, FC 54321',
        taxId: 'TAX87654321',
        contactPhone: '555-987-6543',
        serviceRadius: 25.0,
        kycStatus: 'approved',
        kycApprovedBy: 1,
        kycApprovedAt: new Date()
      });
      
      console.log('Sample repair center created successfully');
    }

    // Create sample buyer if not exists
    const buyerExists = await allModels.User.findOne({
      where: { email: 'buyer@example.com', role: 'buyer' }
    });
    
    if (!buyerExists) {
      console.log('Creating sample buyer...');
      
      // Create buyer user
      const buyerUser = await allModels.User.create({
        name: 'Sample Buyer',
        email: 'buyer@example.com',
        password: await hashPassword('buyer123'),
        role: 'buyer',
        status: 'active'
      });
      
      // Create buyer address
      await allModels.Address.create({
        userId: buyerUser.id,
        addressType: 'shipping',
        name: 'Sample Buyer',
        line1: '789 Consumer Street',
        city: 'Buyerville',
        state: 'BY',
        postalCode: '98765',
        country: 'US',
        phone: '555-456-7890',
        isDefault: true
      });
      
      // Create cart for buyer
      const cart = await allModels.Cart.create({
        userId: buyerUser.id
      });
      
      // Create wishlist for buyer
      const wishlist = await allModels.Wishlist.create({
        userId: buyerUser.id
      });
      
      console.log('Sample buyer created successfully');
      
      // Add sample product to buyer's cart if products exist
      const product = await allModels.Product.findOne();
      if (product && cart) {
        await allModels.CartItem.create({
          cartId: cart.id,
          productId: product.id,
          quantity: 1
        });
        console.log('Added sample product to buyer cart');
      }
      
      // Add sample product to buyer's wishlist if products exist
      if (product && wishlist) {
        await allModels.WishlistItem.create({
          wishlistId: wishlist.id,
          productId: product.id
        });
        console.log('Added sample product to buyer wishlist');
      }
    }

    console.log('Database seeding complete!');
    
  } catch (error) {
    console.error('Database seeding error:', error);
    throw error;
  }
};

const initDatabase = async () => {
  try {
    // Setup model associations
    setupAssociations();
    console.log('Model associations set up');

    // Sync all models with the database
    // In production, use { force: false } and handle migrations properly
    // Use force: false to avoid dropping tables, alter: true to update schema
    await sequelize.sync({ force: false, alter: false });
    console.log('Database synced successfully');
    
    // Seed database with initial data
    await seedDatabase();
    
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

module.exports = { initDatabase, seedDatabase };