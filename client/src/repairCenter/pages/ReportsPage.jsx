import React, { useState, useEffect } from 'react';
import RepairCenterLayout from '../components/RepairCenterLayout';

const ReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('repairs');
  const [timeRange, setTimeRange] = useState('month');
  const [reportData, setReportData] = useState(null);
  
  // Generate mock data for reports
  useEffect(() => {
    const generateReportData = () => {
      // Simulate API call delay
      setTimeout(() => {
        let data;
        
        if (reportType === 'repairs') {
          data = {
            title: 'Repair Summary Report',
            timeRange: getTimeRangeText(),
            summary: {
              total: 156,
              completed: 124,
              inProgress: 22,
              pending: 10,
              avgCompletionTime: '3.2 days',
              revenue: 12450.75
            },
            byStatus: [
              { status: 'Completed', count: 124, percentage: 79.5 },
              { status: 'In Progress', count: 22, percentage: 14.1 },
              { status: 'Pending', count: 10, percentage: 6.4 }
            ],
            byType: [
              { type: 'Screen Replacement', count: 68, percentage: 43.6 },
              { type: 'Battery Replacement', count: 42, percentage: 26.9 },
              { type: 'Water Damage', count: 18, percentage: 11.5 },
              { type: 'Charging Port', count: 15, percentage: 9.6 },
              { type: 'Other', count: 13, percentage: 8.4 }
            ],
            byDevice: [
              { device: 'Smartphones', count: 92, percentage: 59.0 },
              { device: 'Laptops', count: 34, percentage: 21.8 },
              { device: 'Tablets', count: 22, percentage: 14.1 },
              { device: 'Desktops', count: 8, percentage: 5.1 }
            ],
            monthlyTrend: [
              { month: 'Jan', count: 42 },
              { month: 'Feb', count: 38 },
              { month: 'Mar', count: 45 },
              { month: 'Apr', count: 39 },
              { month: 'May', count: 41 },
              { month: 'Jun', count: 48 }
            ]
          };
        } else if (reportType === 'inventory') {
          data = {
            title: 'Inventory Summary Report',
            timeRange: getTimeRangeText(),
            summary: {
              totalItems: 248,
              totalValue: 32650.85,
              lowStock: 28,
              outOfStock: 12,
              mostUsed: 'Screen Assemblies'
            },
            byCategory: [
              { category: 'Displays', count: 76, value: 15680.50 },
              { category: 'Batteries', count: 62, value: 4850.75 },
              { category: 'Charging Components', count: 45, value: 3240.25 },
              { category: 'Motherboards', count: 28, value: 5420.80 },
              { category: 'Other Components', count: 37, value: 3458.55 }
            ],
            topMoving: [
              { item: 'iPhone 12 Display Assembly', units: 32 },
              { item: 'Samsung Galaxy S21 Battery', units: 28 },
              { item: 'MacBook Pro Charging Port', units: 24 },
              { item: 'iPad Pro 12.9" Screen', units: 18 },
              { item: 'OnePlus 9 Pro Camera Module', units: 15 }
            ],
            lowStockItems: [
              { item: 'Dell XPS 13 Keyboard', current: 2, minimum: 3 },
              { item: 'HP Spectre x360 Hinge', current: 1, minimum: 2 },
              { item: 'MacBook Air Logic Board', current: 1, minimum: 1 },
              { item: 'iPhone 13 Pro Camera Assembly', current: 2, minimum: 3 },
              { item: 'Samsung Galaxy Tab S7 Battery', current: 1, minimum: 2 }
            ]
          };
        } else if (reportType === 'revenue') {
          data = {
            title: 'Revenue Report',
            timeRange: getTimeRangeText(),
            summary: {
              totalRevenue: 56850.75,
              totalCost: 32450.50,
              profit: 24400.25,
              profitMargin: 42.9,
              avgTicketValue: 365.75
            },
            byService: [
              { service: 'Screen Repairs', revenue: 24680.50, percentage: 43.4 },
              { service: 'Battery Replacements', revenue: 12450.25, percentage: 21.9 },
              { service: 'Water Damage Recovery', revenue: 8750.50, percentage: 15.4 },
              { service: 'Motherboard Repairs', revenue: 6540.25, percentage: 11.5 },
              { service: 'Other Services', revenue: 4429.25, percentage: 7.8 }
            ],
            monthlyRevenue: [
              { month: 'Jan', revenue: 8750.25 },
              { month: 'Feb', revenue: 9120.50 },
              { month: 'Mar', revenue: 10240.75 },
              { month: 'Apr', revenue: 9450.25 },
              { month: 'May', revenue: 9680.50 },
              { month: 'Jun', revenue: 9608.50 }
            ],
            topCustomers: [
              { name: 'John Smith', repairs: 8, spent: 1850.75 },
              { name: 'ABC Corporation', repairs: 12, spent: 3450.25 },
              { name: 'Jane Doe', repairs: 5, spent: 1250.50 },
              { name: 'Tech Solutions LLC', repairs: 9, spent: 2840.75 },
              { name: 'Robert Johnson', repairs: 4, spent: 980.25 }
            ]
          };
        } else if (reportType === 'customer') {
          data = {
            title: 'Customer Report',
            timeRange: getTimeRangeText(),
            summary: {
              totalCustomers: 345,
              newCustomers: 48,
              returningCustomers: 297,
              avgRepairsPerCustomer: 1.8,
              satisfactionRate: 94.5
            },
            customerSegmentation: [
              { segment: 'One-time', count: 176, percentage: 51.0 },
              { segment: 'Repeat (2-3)', count: 118, percentage: 34.2 },
              { segment: 'Loyal (4+)', count: 51, percentage: 14.8 }
            ],
            customerFeedback: {
              averageRating: 4.7,
              ratings: [
                { stars: 5, count: 210, percentage: 68.4 },
                { stars: 4, count: 65, percentage: 21.2 },
                { stars: 3, count: 22, percentage: 7.2 },
                { stars: 2, count: 6, percentage: 2.0 },
                { stars: 1, count: 4, percentage: 1.2 }
              ]
            },
            referralSources: [
              { source: 'Word of Mouth', count: 142, percentage: 41.2 },
              { source: 'Google Search', count: 108, percentage: 31.3 },
              { source: 'Social Media', count: 52, percentage: 15.1 },
              { source: 'Local Advertising', count: 27, percentage: 7.8 },
              { source: 'Other', count: 16, percentage: 4.6 }
            ]
          };
        }
        
        setReportData(data);
        setLoading(false);
      }, 1200);
    };
    
    setLoading(true);
    generateReportData();
  }, [reportType, timeRange]);
  
  // Get text description of time range
  const getTimeRangeText = () => {
    const now = new Date();
    
    if (timeRange === 'week') {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
    } else if (timeRange === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      return `${monthStart.toLocaleDateString()} - ${monthEnd.toLocaleDateString()}`;
    } else if (timeRange === 'quarter') {
      const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
      
      return `${quarterStart.toLocaleDateString()} - ${quarterEnd.toLocaleDateString()}`;
    } else if (timeRange === 'year') {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      const yearEnd = new Date(now.getFullYear(), 11, 31);
      
      return `${yearStart.toLocaleDateString()} - ${yearEnd.toLocaleDateString()}`;
    }
    
    return '';
  };
  
  // Progress bar component
  const ProgressBar = ({ percentage, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500',
      pink: 'bg-pink-500'
    };
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`${colorClasses[color]} h-2.5 rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };
  
  return (
    <RepairCenterLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">
            View and analyze your repair center performance
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Report controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
                Report Type
              </label>
              <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="repairs">Repairs Report</option>
                <option value="inventory">Inventory Report</option>
                <option value="revenue">Revenue Report</option>
                <option value="customer">Customer Report</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 mb-1">
                Time Range
              </label>
              <select
                id="timeRange"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
            
            <div className="flex-grow"></div>
            
            <div className="self-end">
              <button
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md"
                onClick={() => alert('Export functionality would go here')}
              >
                Export Report
              </button>
            </div>
          </div>
        </div>
        
        {/* Report content */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-500">Generating report...</p>
          </div>
        ) : reportData ? (
          <div className="space-y-6">
            {/* Report header */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800">{reportData.title}</h2>
              <p className="text-gray-600 mt-1">
                Period: {reportData.timeRange}
              </p>
            </div>
            
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {reportType === 'repairs' && (
                <>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Total Repairs</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{reportData.summary.total}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">{reportData.summary.completed} Completed</span>
                        <span className="text-blue-600">{reportData.summary.inProgress} In Progress</span>
                        <span className="text-yellow-600">{reportData.summary.pending} Pending</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Avg. Completion Time</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{reportData.summary.avgCompletionTime}</p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Repair Revenue</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(reportData.summary.revenue)}</p>
                  </div>
                </>
              )}
              
              {reportType === 'inventory' && (
                <>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Total Inventory Items</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{reportData.summary.totalItems}</p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Inventory Value</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(reportData.summary.totalValue)}</p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Stock Issues</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{reportData.summary.lowStock + reportData.summary.outOfStock}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-yellow-600">{reportData.summary.lowStock} Low Stock</span>
                        <span className="text-red-600">{reportData.summary.outOfStock} Out of Stock</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Most Used Category</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{reportData.summary.mostUsed}</p>
                  </div>
                </>
              )}
              
              {reportType === 'revenue' && (
                <>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(reportData.summary.totalRevenue)}</p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Profit</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(reportData.summary.profit)}</p>
                    <p className="mt-1 text-sm text-green-600">
                      {reportData.summary.profitMargin.toFixed(1)}% margin
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Average Ticket Value</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(reportData.summary.avgTicketValue)}</p>
                  </div>
                </>
              )}
              
              {reportType === 'customer' && (
                <>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{reportData.summary.totalCustomers}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">{reportData.summary.newCustomers} New</span>
                        <span className="text-blue-600">{reportData.summary.returningCustomers} Returning</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Avg. Repairs Per Customer</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{reportData.summary.avgRepairsPerCustomer}</p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Customer Satisfaction</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{reportData.summary.satisfactionRate}%</p>
                  </div>
                </>
              )}
            </div>
            
            {/* Detailed report sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reportType === 'repairs' && (
                <>
                  {/* Repairs by Status */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Repairs by Status</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {reportData.byStatus.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">{item.status}</span>
                              <div className="text-sm text-gray-500">
                                {item.count} ({item.percentage.toFixed(1)}%)
                              </div>
                            </div>
                            <ProgressBar 
                              percentage={item.percentage} 
                              color={index === 0 ? 'green' : index === 1 ? 'blue' : 'yellow'}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Repairs by Type */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Repairs by Type</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {reportData.byType.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">{item.type}</span>
                              <div className="text-sm text-gray-500">
                                {item.count} ({item.percentage.toFixed(1)}%)
                              </div>
                            </div>
                            <ProgressBar 
                              percentage={item.percentage} 
                              color={['blue', 'green', 'yellow', 'purple', 'pink'][index % 5]}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Repairs by Device */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Repairs by Device</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {reportData.byDevice.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">{item.device}</span>
                              <div className="text-sm text-gray-500">
                                {item.count} ({item.percentage.toFixed(1)}%)
                              </div>
                            </div>
                            <ProgressBar 
                              percentage={item.percentage} 
                              color={['indigo', 'blue', 'purple', 'pink'][index % 4]}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Monthly Trend */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Monthly Repair Trend</h3>
                    </div>
                    <div className="p-6">
                      <div className="h-64 flex items-end space-x-2">
                        {reportData.monthlyTrend.map((item, index) => {
                          const maxCount = Math.max(...reportData.monthlyTrend.map(i => i.count));
                          const height = (item.count / maxCount) * 100;
                          
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full bg-blue-500 rounded-t"
                                style={{ height: `${height}%` }}
                              ></div>
                              <div className="mt-2 text-xs text-gray-600">{item.month}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {reportType === 'inventory' && (
                <>
                  {/* Inventory by Category */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Inventory by Category</h3>
                    </div>
                    <div className="p-6">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Count
                            </th>
                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Value
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {reportData.byCategory.map((item, index) => (
                            <tr key={index}>
                              <td className="px-3 py-4 text-sm font-medium text-gray-900">
                                {item.category}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-500 text-right">
                                {item.count}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-900 font-medium text-right">
                                {formatCurrency(item.value)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                              {reportData.byCategory.reduce((sum, item) => sum + item.count, 0)}
                            </th>
                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                              {formatCurrency(reportData.byCategory.reduce((sum, item) => sum + item.value, 0))}
                            </th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                  
                  {/* Top Moving Items */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Top Moving Items</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {reportData.topMoving.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">{item.item}</span>
                              <div className="text-sm text-gray-500">
                                {item.units} units
                              </div>
                            </div>
                            <ProgressBar 
                              percentage={(item.units / reportData.topMoving[0].units) * 100} 
                              color={['blue', 'indigo', 'purple', 'green', 'yellow'][index % 5]}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Low Stock Items */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Low Stock Items</h3>
                    </div>
                    <div className="p-6">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Item
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Current
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Minimum
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {reportData.lowStockItems.map((item, index) => (
                            <tr key={index}>
                              <td className="px-3 py-4 text-sm font-medium text-gray-900">
                                {item.item}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-500 text-center">
                                {item.current}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-500 text-center">
                                {item.minimum}
                              </td>
                              <td className="px-3 py-4 text-center">
                                <span 
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    item.current === 0 
                                      ? 'bg-red-100 text-red-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {item.current === 0 ? 'Out of Stock' : 'Low Stock'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
              
              {reportType === 'revenue' && (
                <>
                  {/* Revenue by Service */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Revenue by Service</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {reportData.byService.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">{item.service}</span>
                              <div className="text-sm text-gray-500">
                                {formatCurrency(item.revenue)} ({item.percentage.toFixed(1)}%)
                              </div>
                            </div>
                            <ProgressBar 
                              percentage={item.percentage} 
                              color={['green', 'blue', 'indigo', 'purple', 'yellow'][index % 5]}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Monthly Revenue */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Monthly Revenue</h3>
                    </div>
                    <div className="p-6">
                      <div className="h-64 flex items-end space-x-2">
                        {reportData.monthlyRevenue.map((item, index) => {
                          const maxRevenue = Math.max(...reportData.monthlyRevenue.map(i => i.revenue));
                          const height = (item.revenue / maxRevenue) * 100;
                          
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full bg-green-500 rounded-t"
                                style={{ height: `${height}%` }}
                              ></div>
                              <div className="mt-2 text-xs text-gray-600">{item.month}</div>
                              <div className="text-xs text-gray-500">{formatCurrency(item.revenue)}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {/* Top Customers */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Top Customers</h3>
                    </div>
                    <div className="p-6">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Customer
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Repairs
                            </th>
                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Spent
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {reportData.topCustomers.map((item, index) => (
                            <tr key={index}>
                              <td className="px-3 py-4 text-sm font-medium text-gray-900">
                                {item.name}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-500 text-center">
                                {item.repairs}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-900 font-medium text-right">
                                {formatCurrency(item.spent)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
              
              {reportType === 'customer' && (
                <>
                  {/* Customer Segmentation */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Customer Segmentation</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {reportData.customerSegmentation.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">{item.segment}</span>
                              <div className="text-sm text-gray-500">
                                {item.count} ({item.percentage.toFixed(1)}%)
                              </div>
                            </div>
                            <ProgressBar 
                              percentage={item.percentage} 
                              color={['blue', 'indigo', 'purple'][index % 3]}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Customer Feedback */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Customer Feedback</h3>
                    </div>
                    <div className="p-6">
                      <div className="text-center mb-4">
                        <span className="text-4xl font-bold text-gray-900">{reportData.customerFeedback.averageRating}</span>
                        <div className="flex items-center justify-center mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-5 w-5 ${
                                star <= Math.round(reportData.customerFeedback.averageRating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Average rating from {reportData.customerFeedback.ratings.reduce((sum, item) => sum + item.count, 0)} reviews</p>
                      </div>
                      <div className="space-y-3 mt-6">
                        {reportData.customerFeedback.ratings.map((item, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-12 text-sm font-medium text-gray-700 flex items-center">
                              {item.stars} 
                              <svg
                                className="h-4 w-4 text-yellow-400 ml-1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                            <div className="w-full ml-4">
                              <div className="bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-yellow-400 h-2 rounded-full" 
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="w-16 ml-4 text-sm text-gray-500 text-right">
                              {item.count} ({item.percentage.toFixed(1)}%)
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Referral Sources */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Referral Sources</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {reportData.referralSources.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">{item.source}</span>
                              <div className="text-sm text-gray-500">
                                {item.count} ({item.percentage.toFixed(1)}%)
                              </div>
                            </div>
                            <ProgressBar 
                              percentage={item.percentage} 
                              color={['blue', 'indigo', 'purple', 'green', 'yellow'][index % 5]}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No report data available.</p>
          </div>
        )}
      </div>
    </RepairCenterLayout>
  );
};

export default ReportsPage;