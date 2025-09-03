"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { updatePlant, deletePlant } from '@/actions/plant.action';
import { Input } from "@/components/ui/input";

interface Plant {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  imgURL: string | null;
}

interface PlantDetailsProps {
  plant: Plant;
}

export default function PlantDetails({ plant }: PlantDetailsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [editData, setEditData] = useState({
    name: plant.name,
    description: plant.description || '',
    category: plant.category,
    price: plant.price.toString(),
    stock: plant.stock.toString(),
    imgURL: plant.imgURL || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const updateData = {
        name: editData.name,
        description: editData.description || undefined,
        category: editData.category,
        price: parseFloat(editData.price),
        stock: parseInt(editData.stock),
        imgURL: editData.imgURL || undefined
      };

      const result = await updatePlant(plant.id, updateData);
      
      if (result.success) {
        console.log('Plant updated successfully!');
        setIsEditing(false);
        // refresh page to show updated data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating plant:', error);
      alert('Error updating plant. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(`Are you sure you want to delete "${plant.name}"? This action cannot be undone.`);
    
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const result = await deletePlant(plant.id);
      
      if (result.success) {
        console.log('Plant deleted successfully!');
        router.push('/plants'); // go back to plants list
      }
    } catch (error) {
      console.error('Error deleting plant:', error);
      alert('Error deleting plant. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back button */}
      <Button 
        variant="outline" 
        onClick={() => router.push('/plants')}
        className="mb-6"
      >
        ← Back to Plants
      </Button>

      {/* Plant Image */}
      {plant.imgURL && (
        <div className="mb-6">
          <img 
            src={plant.imgURL} 
            alt={plant.name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Plant Details */}
      {!isEditing ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{plant.name}</h1>
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline"
              >
                Edit
              </Button>
              <Button 
                onClick={handleDelete}
                variant="destructive"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="font-semibold">Category:</span> {plant.category}
            </div>
            <div>
              <span className="font-semibold">Price:</span> ${plant.price}
            </div>
            <div>
              <span className="font-semibold">Stock:</span> {plant.stock}
            </div>
            {plant.description && (
              <div>
                <span className="font-semibold">Description:</span>
                <p className="mt-1">{plant.description}</p>
              </div>
            )}
            <div className="text-sm text-gray-500 pt-4">
              <div>Created: {new Date(plant.createdAt).toLocaleDateString()}</div>
              <div>Updated: {new Date(plant.updatedAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Form */
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Edit Plant</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Plant Name *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={editData.name}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={editData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Category *
              </label>
              <Input
                id="category"
                name="category"
                type="text"
                required
                value={editData.category}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">
                  Price ($) *
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  value={editData.price}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium mb-1">
                  Stock *
                </label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  required
                  value={editData.stock}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="imgURL" className="block text-sm font-medium mb-1">
                Image URL
              </label>
              <Input
                id="imgURL"
                name="imgURL"
                type="url"
                value={editData.imgURL}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex-1"
              >
                {isUpdating ? 'Updating...' : 'Update Plant'}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
