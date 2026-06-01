import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  BarChart3,
  Box,
  ShoppingBag,
  Users,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  X,
  Search
} from 'lucide-react';
import api from '../services/api.js';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dashboard stats & recent orders
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Products state
  const [productsData, setProductsData] = useState({ products: [], categories: [] });
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    image: '',
    stock: ''
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Users state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Load Overview/Stats
  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoadingStats(false);
    }
  };

  // Load Products (all products for easy admin list)
  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const { data } = await api.get(`/products?limit=100&search=${encodeURIComponent(productSearch)}`);
      setProductsData(data);
    } catch (error) {
      toast.error('Failed to load products list');
    } finally {
      setLoadingProducts(false);
    }
  };

  // Load Orders
  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data } = await api.get('/orders/all');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders list');
    } finally {
      setLoadingOrders(false);
    }
  };

  // Load Users
  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users list');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') {
      loadStats();
    } else if (activeTab === 'products') {
      loadProducts();
    } else if (activeTab === 'orders') {
      loadOrders();
    } else if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab, productSearch]);

  // Product CRUD Handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) return toast.error('Name is required');
    if (!productForm.description.trim()) return toast.error('Description is required');
    if (!productForm.category.trim()) return toast.error('Category is required');
    if (!productForm.price || Number(productForm.price) < 0) return toast.error('Valid price is required');
    if (!productForm.image.trim() || !productForm.image.startsWith('http')) return toast.error('Valid image URL is required');
    if (productForm.stock === '' || Number(productForm.stock) < 0) return toast.error('Valid stock quantity is required');

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock)
    };

    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, payload);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', payload);
        toast.success('Product created successfully');
      }
      setShowProductModal(false);
      setProductForm({ name: '', description: '', category: '', price: '', image: '', stock: '' });
      setEditingProductId(null);
      loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Product operation failed');
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setProductForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: String(product.price),
      image: product.image,
      stock: String(product.stock)
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      loadProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  // Order Handlers
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}`, { status });
      toast.success('Order status updated');
      if (activeTab === 'overview') loadStats();
      else loadOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await api.delete(`/orders/${id}`);
      toast.success('Order deleted');
      loadOrders();
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  // User Handlers
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      loadUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-200 dark:border-emerald-900';
      case 'Shipped': return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200 border-blue-200 dark:border-blue-900';
      case 'Processing': return 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200 border-amber-200 dark:border-amber-900';
      case 'Pending': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';
      case 'Cancelled': return 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200 border-rose-200 dark:border-rose-900';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 border-slate-200';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold text-emerald-600">Console</p>
          <h1 className="text-3xl font-extrabold tracking-normal">Admin Dashboard</h1>
        </div>
        {activeTab === 'products' && (
          <button
            onClick={() => {
              setEditingProductId(null);
              setProductForm({ name: '', description: '', category: '', price: '', image: '', stock: '' });
              setShowProductModal(true);
            }}
            className="btn-primary self-start sm:self-auto font-semibold"
          >
            <Plus size={16} />
            Add Product
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'products', label: 'Products', icon: Box },
          { id: 'orders', label: 'Orders', icon: ShoppingBag },
          { id: 'users', label: 'Users', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            {loadingStats ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="panel h-28 animate-pulse" />
                ))}
              </div>
            ) : (
              stats && (
                <>
                  {/* Metric Cards */}
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { title: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
                      { title: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
                      { title: 'Products Seeded', value: stats.products, icon: Box, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
                      { title: 'Registered Users', value: stats.users, icon: Users, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' }
                    ].map((card) => {
                      const Icon = card.icon;
                      return (
                        <div key={card.title} className="panel p-5 flex items-center justify-between border border-slate-200 dark:border-slate-800">
                          <div>
                            <p className="text-sm font-medium text-slate-500">{card.title}</p>
                            <p className="text-2xl font-extrabold mt-1">{card.value}</p>
                          </div>
                          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${card.color}`}>
                            <Icon size={22} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recent Orders table */}
                  <div className="panel border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                      <h2 className="text-lg font-bold">Recent Orders</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase">
                            <th className="px-5 py-3">Order ID</th>
                            <th className="px-5 py-3">Customer</th>
                            <th className="px-5 py-3">Date</th>
                            <th className="px-5 py-3">Amount</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3">Quick Change</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                          {stats.recentOrders.map((order) => (
                            <tr key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                              <td className="px-5 py-4 font-mono text-xs text-slate-500">{order._id}</td>
                              <td className="px-5 py-4 font-semibold">{order.user?.name || 'Guest'}</td>
                              <td className="px-5 py-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                              <td className="px-5 py-4 font-bold">${order.totalAmount.toFixed(2)}</td>
                              <td className="px-5 py-4">
                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(order.status)}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                  className="input py-1 text-xs max-w-[120px]"
                                >
                                  {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                                    <option key={st} value={st}>{st}</option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                          {stats.recentOrders.length === 0 && (
                            <tr>
                              <td colSpan="6" className="px-5 py-8 text-center text-slate-500">No orders logged yet.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )
            )}
          </>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Filters Bar */}
            <div className="panel p-4 flex flex-col sm:flex-row gap-3 border border-slate-200 dark:border-slate-800">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="input pl-9"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>
            </div>

            {loadingProducts ? (
              <div className="panel h-64 animate-pulse" />
            ) : (
              <div className="panel border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase">
                        <th className="px-5 py-3">Product</th>
                        <th className="px-5 py-3">Category</th>
                        <th className="px-5 py-3">Price</th>
                        <th className="px-5 py-3">Stock</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                      {productsData.products.map((product) => (
                        <tr key={product._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <td className="px-5 py-3 flex items-center gap-3">
                            <img src={product.image} alt="" className="h-10 w-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800" />
                            <span className="font-semibold line-clamp-1 max-w-[260px]">{product.name}</span>
                          </td>
                          <td className="px-5 py-3 text-slate-500">{product.category}</td>
                          <td className="px-5 py-3 font-bold">${product.price.toFixed(2)}</td>
                          <td className="px-5 py-3">
                            <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                              {product.stock} left
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right space-x-2">
                            <button
                              onClick={() => handleEditClick(product)}
                              className="rounded-lg p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-emerald-500"
                              title="Edit product"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="rounded-lg p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-rose-500"
                              title="Delete product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {productsData.products.length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-5 py-8 text-center text-slate-500">No products found match details.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <>
            {loadingOrders ? (
              <div className="panel h-64 animate-pulse" />
            ) : (
              <div className="panel border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase">
                        <th className="px-5 py-3">Order ID</th>
                        <th className="px-5 py-3">Customer</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Amount</th>
                        <th className="px-5 py-3">Payment</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <td className="px-5 py-4 font-mono text-xs text-slate-500">{order._id}</td>
                          <td className="px-5 py-4">
                            <div>
                              <p className="font-semibold">{order.user?.name || 'Deleted User'}</p>
                              <p className="text-xs text-slate-400">{order.user?.email || 'N/A'}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-5 py-4 font-bold">${order.totalAmount.toFixed(2)}</td>
                          <td className="px-5 py-4 text-xs font-semibold uppercase">{order.paymentMethod}</td>
                          <td className="px-5 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className={`input py-1.5 px-2.5 text-xs font-semibold rounded-full border max-w-[130px] ${getStatusBadgeClass(order.status)}`}
                            >
                              {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="rounded-lg p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-rose-500"
                              title="Delete order"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan="7" className="px-5 py-8 text-center text-slate-500">No orders registered in system.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB 4: USERS */}
        {activeTab === 'users' && (
          <>
            {loadingUsers ? (
              <div className="panel h-64 animate-pulse" />
            ) : (
              <div className="panel border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase">
                        <th className="px-5 py-3">User ID</th>
                        <th className="px-5 py-3">Name</th>
                        <th className="px-5 py-3">Email</th>
                        <th className="px-5 py-3">Role</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                      {users.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <td className="px-5 py-4 font-mono text-xs text-slate-500">{item._id}</td>
                          <td className="px-5 py-4 font-semibold">{item.name}</td>
                          <td className="px-5 py-4 text-slate-500">{item.email}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                              item.role === 'admin'
                                ? 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-200 border-purple-200 dark:border-purple-900'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-slate-200'
                            }`}>
                              {item.role}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            {item.role !== 'admin' ? (
                              <button
                                onClick={() => handleDeleteUser(item._id)}
                                className="rounded-lg p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-rose-500"
                                title="Delete user"
                              >
                                <Trash2 size={16} />
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400 italic px-2">Protected</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-5 py-8 text-center text-slate-500">No users found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* CREATE & EDIT PRODUCT SLIDE-OVER MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" onClick={() => setShowProductModal(false)} />
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md panel rounded-none border-y-0 border-r-0 shadow-xl flex flex-col bg-white dark:bg-slate-950">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold">
                  {editingProductId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleProductSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Name</label>
                  <input
                    type="text"
                    className="input mt-1.5"
                    placeholder="e.g. Premium Leather Sneakers"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                  <textarea
                    className="input mt-1.5 min-h-[80px]"
                    placeholder="e.g. Modern athletic leather running shoes..."
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    className="input mt-1.5"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    <option value="">Select a category</option>
                    {['Electronics', 'Fashion', 'Home', 'Beauty', 'Fitness', 'Travel'].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="input mt-1.5"
                      placeholder="e.g. 79.99"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Stock Quantity</label>
                    <input
                      type="number"
                      className="input mt-1.5"
                      placeholder="e.g. 50"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Image URL</label>
                  <input
                    type="url"
                    className="input mt-1.5"
                    placeholder="e.g. https://images.unsplash.com/..."
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  />
                </div>

                {productForm.image && productForm.image.startsWith('http') && (
                  <div className="pt-2">
                    <p className="text-xs text-slate-500 font-semibold mb-2">Image Preview</p>
                    <img src={productForm.image} alt="" className="h-32 w-full object-cover rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50" />
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="pt-5 border-t border-slate-200 dark:border-slate-800 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    {editingProductId ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
