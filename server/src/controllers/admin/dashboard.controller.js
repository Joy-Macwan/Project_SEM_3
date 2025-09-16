const { User, Product, Order, RepairRequest } = require('../../database/models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

// Get dashboard metrics
const getDashboardMetrics = async (req, res) => {
  try {
    // Get counts
    const [
      userCount,
      productCount,
      orderCount,
      repairCount,
      recentUsers,
      recentOrders,
      orderStats,
      productStats
    ] = await Promise.all([
      // User count
      User.count(),
      
      // Product count
      Product.count(),
      
      // Order count
      Order.count(),
      
      // Repair request count
      RepairRequest.count(),
      
      // Recent users
      User.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'name', 'email', 'role', 'status', 'createdAt']
      }),
      
      // Recent orders
      Order.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email']
          }
        ]
      }),
      
      // Order stats by status
      Order.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status']
      }),
      
      // Product stats by category
      Product.findAll({
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['category']
      })
    ]);
    
    // Get today's registrations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayRegistrations = await User.count({
      where: {
        createdAt: {
          [Op.gte]: today
        }
      }
    });
    
    // Get today's orders
    const todayOrders = await Order.count({
      where: {
        createdAt: {
          [Op.gte]: today
        }
      }
    });
    
    // Get today's revenue
    const todayRevenue = await Order.sum('totalAmount', {
      where: {
        createdAt: {
          [Op.gte]: today
        },
        status: {
          [Op.ne]: 'cancelled'
        }
      }
    });
    
    // Format order stats
    const orderStatusStats = {};
    orderStats.forEach(stat => {
      orderStatusStats[stat.status] = stat.get('count');
    });
    
    // Format product stats
    const productCategoryStats = {};
    productStats.forEach(stat => {
      productCategoryStats[stat.category] = stat.get('count');
    });
    
    return res.status(200).json({
      error: false,
      metrics: {
        totalUsers: userCount,
        totalProducts: productCount,
        totalOrders: orderCount,
        totalRepairRequests: repairCount,
        todayRegistrations,
        todayOrders,
        todayRevenue: todayRevenue || 0,
        recentUsers,
        recentOrders,
        orderStatusStats,
        productCategoryStats
      }
    });
  } catch (error) {
    console.error('Get dashboard metrics error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while fetching dashboard metrics'
    });
  }
};

// Get system status
const getSystemStatus = async (req, res) => {
  try {
    // Get database status
    let dbStatus = 'healthy';
    try {
      await sequelize.authenticate();
    } catch (err) {
      dbStatus = 'error';
    }
    
    // Get application status
    const appStatus = 'running';
    
    // Get server memory usage
    const memoryUsage = process.memoryUsage();
    
    // Get recent errors from logs (if you have an error logging system)
    // This is a placeholder - you would implement this based on your logging system
    const recentErrors = [];
    
    return res.status(200).json({
      error: false,
      systemStatus: {
        database: dbStatus,
        application: appStatus,
        memoryUsage: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB'
        },
        uptime: Math.round(process.uptime()) + ' seconds',
        recentErrors
      }
    });
  } catch (error) {
    console.error('Get system status error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while fetching system status'
    });
  }
};

// Get sales statistics
const getSalesStats = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    let startDate, interval, format;
    
    // Set date range based on period
    const now = new Date();
    
    if (period === 'day') {
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      interval = 'hour';
      format = 'HH';
    } else if (period === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      interval = 'day';
      format = 'YYYY-MM-DD';
    } else if (period === 'month') {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      interval = 'day';
      format = 'YYYY-MM-DD';
    } else if (period === 'year') {
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      interval = 'month';
      format = 'YYYY-MM';
    } else {
      return res.status(400).json({
        error: true,
        code: 'INVALID_PERIOD',
        message: 'Invalid period. Use day, week, month, or year'
      });
    }
    
    // Query sales data
    // Note: This is a simplified example - in production, you'd use more sophisticated 
    // date grouping techniques based on your database system
    const salesData = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', interval, sequelize.col('createdAt')), 'date'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount']
      ],
      where: {
        createdAt: {
          [Op.gte]: startDate
        },
        status: {
          [Op.ne]: 'cancelled'
        }
      },
      group: [sequelize.fn('DATE_TRUNC', interval, sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', interval, sequelize.col('createdAt')), 'ASC']]
    });
    
    // Format the results
    const formattedSalesData = salesData.map(item => ({
      date: item.getDataValue('date'),
      revenue: parseFloat(item.getDataValue('revenue') || 0),
      orderCount: parseInt(item.getDataValue('orderCount') || 0)
    }));
    
    return res.status(200).json({
      error: false,
      period,
      salesData: formattedSalesData
    });
  } catch (error) {
    console.error('Get sales stats error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while fetching sales statistics'
    });
  }
};

module.exports = {
  getDashboardMetrics,
  getSystemStatus,
  getSalesStats
};