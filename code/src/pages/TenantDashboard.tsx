
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { database, House, RentalRequest } from '@/lib/database';
import HouseCard from '@/components/HouseCard';
import Layout from '@/components/Layout';
import { Search, Filter } from 'lucide-react';

const TenantDashboard = () => {
  const { user } = useAuth();
  const [houses, setHouses] = useState<House[]>([]);
  const [filteredHouses, setFilteredHouses] = useState<House[]>([]);
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: ''
  });
  const [activeTab, setActiveTab] = useState<'browse' | 'requests'>('browse');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterHouses();
  }, [houses, searchTerm, filters]);

  const loadData = async () => {
    try {
      const [housesData, requestsData] = await Promise.all([
        database.getAllHouses(),
        database.getRequestsByTenant(user!.id)
      ]);
      
      setHouses(housesData.filter(house => house.status === 'available'));
      setRequests(requestsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterHouses = () => {
    let filtered = houses.filter(house => 
      house.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filters.type) {
      filtered = filtered.filter(house => house.type === filters.type);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(house => house.price >= parseInt(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(house => house.price <= parseInt(filters.maxPrice));
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(house => house.bedrooms >= parseInt(filters.bedrooms));
    }

    setFilteredHouses(filtered);
  };

  const handleRequestRental = async (house: House) => {
    if (!user) return;

    const existingRequest = requests.find(req => req.houseId === house.id);
    if (existingRequest) {
      alert('You have already requested this property');
      return;
    }

    const newRequest: RentalRequest = {
      id: Date.now().toString(),
      tenantId: user.id,
      houseId: house.id,
      ownerId: house.ownerId,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      await database.addRequest(newRequest);
      setRequests([...requests, newRequest]);
      alert('Rental request submitted successfully!');
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request');
    }
  };

  const getRequestStatus = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="mt-2 text-gray-600">Find your perfect home</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'browse'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Browse Properties ({filteredHouses.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'requests'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            My Requests ({requests.length})
          </button>
        </div>

        {activeTab === 'browse' ? (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by title, location, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="studio">Studio</option>
                </select>

                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <select
                  value={filters.bedrooms}
                  onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any Bedrooms</option>
                  <option value="1">1+ Bedrooms</option>
                  <option value="2">2+ Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
              </div>
            </div>

            {/* Houses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHouses.map((house) => (
                <HouseCard
                  key={house.id}
                  house={house}
                  onAction={handleRequestRental}
                  actionLabel="Request Rental"
                />
              ))}
            </div>

            {filteredHouses.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">No properties found matching your criteria</div>
              </div>
            )}
          </>
        ) : (
          /* Requests Tab */
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">My Rental Requests</h2>
            </div>
            
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">No requests yet</div>
                <p className="text-gray-500 mt-2">Browse properties and make your first request!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {requests.map((request) => {
                  const house = houses.find(h => h.id === request.houseId);
                  return (
                    <div key={request.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {house ? house.title : 'Property not found'}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {house ? house.address : ''}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Requested on {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="ml-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getRequestStatus(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                      </div>
                      {house && (
                        <div className="mt-4 text-lg font-semibold text-blue-600">
                          ${house.price.toLocaleString()}/month
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TenantDashboard;
