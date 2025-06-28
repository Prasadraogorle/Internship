
import React from 'react';
import { House } from '@/lib/database';

interface HouseCardProps {
  house: House;
  onAction?: (house: House) => void;
  actionLabel?: string;
  showOwnerActions?: boolean;
  onEdit?: (house: House) => void;
  onDelete?: (house: House) => void;
}

const HouseCard = ({ 
  house, 
  onAction, 
  actionLabel = "Request", 
  showOwnerActions = false,
  onEdit,
  onDelete 
}: HouseCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'rented':
        return 'bg-blue-100 text-blue-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        {house.images && house.images.length > 0 ? (
          <img
            src={house.images[0]}
            alt={house.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{house.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(house.status)}`}>
            {house.status}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{house.description}</p>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-blue-600">{formatPrice(house.price)}</span>
          <span className="text-sm text-gray-500 capitalize">{house.type}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span>{house.bedrooms} bed</span>
          <span className="mx-1">•</span>
          <span>{house.bathrooms} bath</span>
          <span className="mx-1">•</span>
          <span>{house.area} sq ft</span>
        </div>
        
        <p className="text-sm text-gray-500 mb-4 truncate">{house.address}</p>
        
        <div className="flex space-x-2">
          {onAction && house.status === 'available' && (
            <button
              onClick={() => onAction(house)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              {actionLabel}
            </button>
          )}
          
          {showOwnerActions && (
            <>
              <button
                onClick={() => onEdit?.(house)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(house)}
                className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HouseCard;
