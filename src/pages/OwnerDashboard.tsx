import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { database, House, RentalRequest } from '@/lib/database';
import Layout from '@/components/Layout';
import PropertyForm from '@/components/PropertyForm';
import PropertyList from '@/components/PropertyList';
import RentalRequestsList from '@/components/RentalRequestsList';
import { Plus } from 'lucide-react';

interface PropertyFormData {
  title: string;
  address: string;
  rent: string;
  bedrooms: string;
  bathrooms: string;
  description: string;
  images: string[];
}

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [houses, setHouses] = useState<House[]>([]);
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    address: '',
    rent: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    images: []
  });

  useEffect(() => {
    loadHouses();
    loadRentalRequests();
  }, [user]);

  const loadHouses = async () => {
    if (user) {
      const userHouses = await database.getHousesByOwner(user.id);
      setHouses(userHouses);
    }
  };

  const loadRentalRequests = async () => {
    if (user) {
      const requests = await database.getRequestsByOwner(user.id);
      setRentalRequests(requests);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      address: '',
      rent: '',
      bedrooms: '',
      bathrooms: '',
      description: '',
      images: []
    });
    setEditingHouse(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const houseData: House = {
      id: editingHouse ? editingHouse.id : `house_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ownerId: user.id,
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.rent),
      address: formData.address,
      type: 'apartment', // You might want to add this to your form
      area: 0, // You might want to add this to your form
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      images: formData.images,
      status: 'available',
      createdAt: editingHouse ? editingHouse.createdAt : new Date(),
    };

    try {
      if (editingHouse) {
        await database.updateHouse(editingHouse.id, {
          title: formData.title,
          address: formData.address,
          rent: parseFloat(formData.rent),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          description: formData.description,
          images: formData.images,
          ownerId: user.id,
          ownerName: user.name,
          ownerEmail: user.email,
          ownerPhone: user.phone || '',
        }, houseData);
      } else {
        await database.addHouse(houseData);
      }

      await loadHouses();
      resetForm();
    } catch (error) {
      console.error('Error saving house:', error);
    }
  };

  const handleEdit = (house: House) => {
    setFormData({
      title: house.title,
      address: house.address,
      rent: house.price.toString(),
      bedrooms: house.bedrooms.toString(),
      bathrooms: house.bathrooms.toString(),
      description: house.description,
      images: house.images || []
    });
    setEditingHouse(house);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await database.deleteHouse(id);
        await loadHouses();
      } catch (error) {
        console.error('Error deleting house:', error);
      }
    }
  };

  const handleRequestApproval = async (requestId: string) => {
    try {
      const request = rentalRequests.find(r => r.id === requestId);
      if (request) {
        const updatedRequest: RentalRequest = {
          ...request,
          status: 'approved',
          updatedAt: new Date()
        };
        await database.updateRequest(updatedRequest);
        await loadRentalRequests();
      }
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleRequestRejection = async (requestId: string) => {
    try {
      const request = rentalRequests.find(r => r.id === requestId);
      if (request) {
        const updatedRequest: RentalRequest = {
          ...request,
          status: 'rejected',
          updatedAt: new Date()
        };
        await database.updateRequest(updatedRequest);
        await loadRentalRequests();
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your properties and rental requests</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Property</span>
            </button>
          </div>
        </div>

        {(showAddForm || editingHouse) && (
          <PropertyForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            isEditing={!!editingHouse}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Properties</h2>
              <PropertyList
                houses={houses}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>

          <div>
            <RentalRequestsList
              requests={rentalRequests}
              onApprove={handleRequestApproval}
              onReject={handleRequestRejection}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OwnerDashboard;