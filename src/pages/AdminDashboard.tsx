
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { database, User, House, RentalRequest } from '@/lib/database';
import Layout from '@/components/Layout';
import { Users, Home, Search, BarChart3, Bell } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'houses'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, housesData, requestsData] = await Promise.all([
        database.getAllUsers(),
        database.getAllHouses(),
        database.getAllRequests()
      ]);
      
      setUsers(usersData);
      setHouses(housesData);
      setRequests(requestsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserBlock = async (targetUser: User) => {
    if (targetUser.id === user?.id) {
      alert("You cannot block yourself!");
      return;
    }

    const updatedUser = { ...targetUser, blocked: !targetUser.blocked };
    
    try {
      await database.updateUser(updatedUser);
      setUsers(users.map(u => u.id === targetUser.id ? updatedUser : u));
      alert(`User ${updatedUser.blocked ? 'blocked' : 'unblocked'} successfully!`);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (targetUser: User) => {
    if (targetUser.id === user?.id) {
      alert("You cannot delete yourself!");
      return;
    }

    if (window.confirm(`Are you sure you want to delete user ${targetUser.name}?`)) {
      try {
        await database.deleteUser(targetUser.id);
        setUsers(users.filter(u => u.id !== targetUser.id));
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteHouse = async (house: House) => {
    if (window.confirm(`Are you sure you want to delete property "${house.title}"?`)) {
      try {
        await database.deleteHouse(house.id);
        setHouses(houses.filter(h => h.id !== house.id));
        alert('Property deleted successfully!');
      } catch (error) {
        console.error('Error deleting house:', error);
        alert('Failed to delete property');
      }
    }
  };

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    tenants: users.filter(u => u.role === 'tenant').length,
    owners: users.filter(u => u.role === 'owner').length,
    admins: users.filter(u => u.role === 'admin').length,
    totalHouses: houses.length,
    availableHouses: houses.filter(h => h.status === 'available').length,
    rentedHouses: houses.filter(h => h.status === 'rented').length,
    soldHouses: houses.filter(h => h.status === 'sold').length,
    totalRequests: requests.length,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    approvedRequests: requests.filter(r => r.status === 'approved').length,
    rejectedRequests: requests.filter(r => r.status === 'rejected').length
  };

  // Chart data
  const userRoleData = [
    { name: 'Tenants', value: stats.tenants, color: '#3B82F6' },
    { name: 'Owners', value: stats.owners, color: '#10B981' },
    { name: 'Admins', value: stats.admins, color: '#F59E0B' }
  ];

  const houseStatusData = [
    { name: 'Available', value: stats.availableHouses, color: '#10B981' },
    { name: 'Rented', value: stats.rentedHouses, color: '#3B82F6' },
    { name: 'Sold', value: stats.soldHouses, color: '#6B7280' }
  ];

  const requestStatusData = [
    { name: 'Pending', count: stats.pendingRequests },
    { name: 'Approved', count: stats.approvedRequests },
    { name: 'Rejected', count: stats.rejectedRequests }
  ];

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHouses = houses.filter(h => 
    h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">System overview and management</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Users ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('houses')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
              activeTab === 'houses'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Properties ({houses.length})</span>
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Home className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Properties</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalHouses}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Bell className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Role</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userRoleData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userRoleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={houseStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {houseStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Status Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={requestStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((targetUser) => (
                      <tr key={targetUser.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{targetUser.name}</div>
                            <div className="text-sm text-gray-500">{targetUser.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                            targetUser.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            targetUser.role === 'owner' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {targetUser.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {targetUser.phone || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            targetUser.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {targetUser.blocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(targetUser.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {targetUser.id !== user?.id && (
                            <>
                              <button
                                onClick={() => handleToggleUserBlock(targetUser)}
                                className={`${
                                  targetUser.blocked ? 'text-green-600 hover:text-green-900' : 'text-yellow-600 hover:text-yellow-900'
                                }`}
                              >
                                {targetUser.blocked ? 'Unblock' : 'Block'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(targetUser)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </>
                          )}
                          {targetUser.id === user?.id && (
                            <span className="text-gray-400">Current User</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'houses' && (
          <div>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties by title, address, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredHouses.map((house) => {
                      const owner = users.find(u => u.id === house.ownerId);
                      return (
                        <tr key={house.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{house.title}</div>
                              <div className="text-sm text-gray-500">{house.address}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                              {house.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${house.price.toLocaleString()}/month
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                              house.status === 'available' ? 'bg-green-100 text-green-800' :
                              house.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {house.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {owner ? owner.name : 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDeleteHouse(house)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
