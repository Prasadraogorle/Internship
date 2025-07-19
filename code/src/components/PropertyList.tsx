
import React from 'react';
import { House } from '@/lib/database';
import HouseCard from './HouseCard';

interface PropertyListProps {
  houses: House[];
  onEdit: (house: House) => void;
  onDelete: (id: string) => void;
}

const PropertyList = ({ houses, onEdit, onDelete }: PropertyListProps) => {
  if (houses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No properties added yet.</p>
        <p className="text-gray-400 text-sm mt-2">Click "Add New Property" to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {houses.map((house) => (
        <HouseCard
          key={house.id}
          house={house}
          showActions={true}
          onEdit={() => onEdit(house)}
          onDelete={() => onDelete(house.id)}
        />
      ))}
    </div>
  );
};

export default PropertyList;
