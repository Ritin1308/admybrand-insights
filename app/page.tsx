"use client";

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  MousePointer,
  Download,
  Filter,
  Moon,
  Sun,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Eye,
  Share2,
  BarChart3
} from 'lucide-react';

// Mock data generation
const generateRevenueData = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    revenue: Math.floor(Math.random() * 50000) + 30000,
    users: Math.floor(Math.random() * 5000) + 2000,
    conversions: Math.floor(Math.random() * 500) + 200
  }));
};

const generateTrafficData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    organic: Math.floor(Math.random() * 3000) + 1000,
    paid: Math.floor(Math.random() * 2000) + 500,
    social: Math.floor(Math.random() * 1500) + 300
  }));
};

const generateChannelData = () => [
  { name: 'Organic Search', value: 45, color: '#3B82F6' },
  { name: 'Paid Ads', value: 25, color: '#10B981' },
  { name: 'Social Media', value: 15, color: '#F59E0B' },
  { name: 'Direct', value: 10, color: '#EF4444' },
  { name: 'Email', value: 5, color: '#8B5CF6' }
];

const generateTableData = () => {
  const campaigns = ['Summer Sale', 'Black Friday', 'Holiday Special', 'New Year Promo', 'Spring Launch', 'Back to School', 'Winter Collection', 'Flash Sale'];
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    campaign: campaigns[Math.floor(Math.random() * campaigns.length)],
    impressions: Math.floor(Math.random() * 100000) + 10000,
    clicks: Math.floor(Math.random() * 5000) + 500,
    conversions: Math.floor(Math.random() * 200) + 20,
    revenue: Math.floor(Math.random() * 10000) + 1000,
    ctr: ((Math.random() * 5) + 1).toFixed(2),
    status: Math.random() > 0.3 ? 'Active' : 'Paused'
  }));
};

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  isDark: boolean;
}

const MetricCard = ({ title, value, change, icon: Icon, isDark }: MetricCardProps) => {
  const isPositive = change > 0;
  
  return (
    <div className={`p-6 rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-2xl hover:scale-105 backdrop-blur-sm ${
      isDark ? 'bg-gray-800/80 border-gray-700 hover:bg-gray-800/90' : 'bg-white/80 border-gray-200 hover:bg-white/90'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-900/50' : 'bg-blue-50'}`}>
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
          isPositive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </div>
      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {title}
      </div>
    </div>
  );
};

interface LoadingSkeletonProps {
  isDark: boolean;
}

const LoadingSkeleton = ({ isDark }: LoadingSkeletonProps) => (
  <div className={`animate-pulse p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
    <div className={`h-4 rounded mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
    <div className={`h-8 rounded mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
    <div className={`h-3 rounded w-1/2 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
  </div>
);

// Type definitions for state and props
interface RevenueData {
  month: string;
  revenue: number;
  users: number;
  conversions: number;
}

interface TrafficData {
  day: string;
  organic: number;
  paid: number;
  social: number;
}

interface ChannelData {
  name: string;
  value: number;
  color: string;
}

interface CampaignTableRow {
  id: number;
  campaign: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: string;
  status: string;
}

interface ColumnDefinition {
  key: keyof CampaignTableRow;
  label: string;
}

const Dashboard = () => {
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof CampaignTableRow>('campaign');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedDateRange, setSelectedDateRange] = useState('7d');
  
  // Initialize states with explicit types and empty arrays
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [channelData, setChannelData] = useState<ChannelData[]>([]);
  const [tableData, setTableData] = useState<CampaignTableRow[]>([]);

  const itemsPerPage = 10;
  const filteredData = tableData.filter(item => 
    item.campaign.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });
  
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Generate data on the client-side to prevent hydration errors
  useEffect(() => {
    const timer = setTimeout(() => {
      setRevenueData(generateRevenueData());
      setTrafficData(generateTrafficData());
      setChannelData(generateChannelData());
      setTableData(generateTableData());
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSort = (field: keyof CampaignTableRow) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const exportData = (format: 'csv' | 'pdf') => {
    const data: string = format === 'csv' ? 'CSV data...' : 'PDF data...';
    console.log(`Exporting ${format.toUpperCase()}:`, data);
    alert(`${format.toUpperCase()} export started!`);
  };

  const tableColumns: ColumnDefinition[] = [
    { key: 'campaign', label: 'Campaign' },
    { key: 'impressions', label: 'Impressions' },
    { key: 'clicks', label: 'Clicks' },
    { key: 'conversions', label: 'Conversions' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'ctr', label: 'CTR' },
    { key: 'status', label: 'Status' }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-yellow-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-pink-400 to-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-20 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              isDark ? 'bg-white' : 'bg-gray-400'
            } opacity-30 animate-bounce`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 5 + 3}s`
            }}
          ></div>
        ))}
        
        <div className={`absolute inset-0 opacity-5`} style={{
          backgroundImage: `
            linear-gradient(${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
          isDark ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
        }`}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ADmyBRAND Insights
                    </h1>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Analytics Dashboard
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                  {['7d', '30d', '90d'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setSelectedDateRange(range)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedDateRange === range
                          ? 'bg-blue-600 text-white shadow-lg'
                          : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setIsDark(!isDark)}
                  className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 ${
                    isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="px-6 py-8">
          {/* Key Metrics */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Overview</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => exportData('csv')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => exportData('pdf')}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <LoadingSkeleton key={i} isDark={isDark} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Revenue"
                  value="$428,567"
                  change={12.3}
                  icon={DollarSign}
                  isDark={isDark}
                />
                <MetricCard
                  title="Active Users"
                  value="24,891"
                  change={8.7}
                  icon={Users}
                  isDark={isDark}
                />
                <MetricCard
                  title="Conversions"
                  value="3,247"
                  change={-2.1}
                  icon={MousePointer}
                  isDark={isDark}
                />
                <MetricCard
                  title="Growth Rate"
                  value="15.8%"
                  change={5.2}
                  icon={TrendingUp}
                  isDark={isDark}
                />
              </div>
            )}
          </section>

          {/* Charts Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Trend */}
            <div className={`p-6 rounded-2xl shadow-lg border transition-all duration-300 backdrop-blur-sm ${
              isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Revenue Trend</h3>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
                  <XAxis dataKey="month" stroke={isDark ? '#9CA3AF' : '#6B7280'} />
                  <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                      borderRadius: '12px',
                      color: isDark ? '#FFFFFF' : '#000000'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Traffic Sources */}
            <div className={`p-6 rounded-2xl shadow-lg border transition-all duration-300 backdrop-blur-sm ${
              isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Traffic Sources</h3>
                <Share2 className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex flex-col lg:flex-row items-center">
                <div className="w-full lg:w-1/2">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={channelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full lg:w-1/2 space-y-3">
                  {channelData.map((channel, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: channel.color }}
                        ></div>
                        <span className="font-medium">{channel.name}</span>
                      </div>
                      <span className="font-bold">{channel.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly Traffic */}
            <div className={`p-6 rounded-2xl shadow-lg border transition-all duration-300 lg:col-span-2 backdrop-blur-sm ${
              isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Weekly Traffic Breakdown</h3>
                <Filter className="w-5 h-5 text-gray-400" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
                  <XAxis dataKey="day" stroke={isDark ? '#9CA3AF' : '#6B7280'} />
                  <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                      borderRadius: '12px',
                      color: isDark ? '#FFFFFF' : '#000000'
                    }}
                  />
                  <Bar dataKey="organic" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="paid" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="social" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Data Table */}
          <section className={`p-6 rounded-2xl shadow-lg border transition-all duration-300 backdrop-blur-sm ${
            isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <h3 className="text-xl font-semibold">Campaign Performance</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded-xl border transition-colors duration-200 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    {tableColumns.map((column) => (
                      <th
                        key={column.key}
                        className={`text-left py-4 px-2 cursor-pointer transition-colors duration-200 ${
                          isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleSort(column.key)}
                      >
                        <div className="flex items-center space-x-1">
                          <span className="font-semibold">{column.label}</span>
                          {sortField === column.key && (
                            sortDirection === 'asc' ? 
                            <ArrowUp className="w-4 h-4" /> : 
                            <ArrowDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row) => (
                    <tr 
                      key={row.id} 
                      className={`border-b transition-colors duration-200 ${
                        isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <td className="py-4 px-2 font-medium">{row.campaign}</td>
                      <td className="py-4 px-2">{row.impressions.toLocaleString()}</td>
                      <td className="py-4 px-2">{row.clicks.toLocaleString()}</td>
                      <td className="py-4 px-2">{row.conversions}</td>
                      <td className="py-4 px-2">${row.revenue.toLocaleString()}</td>
                      <td className="py-4 px-2">{row.ctr}%</td>
                      <td className="py-4 px-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          row.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-4 sm:space-y-0">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    currentPage === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    currentPage === totalPages
                      ? 'opacity-50 cursor-not-allowed'
                      : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;