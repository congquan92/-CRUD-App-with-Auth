"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPlant } from '@/actions/plant.action';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddPlantForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    imgURL: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // convert price and stock to numbers
      const plantData = {
        name: formData.name,
        description: formData.description || undefined,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        imgURL: formData.imgURL || undefined
      };

      const result = await createPlant(plantData);
      
      if (result.success) {
        console.log('Plant created successfully!');
        router.push('/plants'); // go back to plants page
      }
    } catch (error) {
      console.error('Error creating plant:', error);
      alert('Error creating plant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Plant Name *
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter plant name"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter plant description"
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
          value={formData.category}
          onChange={handleInputChange}
          placeholder="e.g., Flower, Herb, Tree"
        />
      </div>

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
          value={formData.price}
          onChange={handleInputChange}
          placeholder="0.00"
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
          value={formData.stock}
          onChange={handleInputChange}
          placeholder="0"
        />
      </div>

      <div>
        <label htmlFor="imgURL" className="block text-sm font-medium mb-1">
          Image URL
        </label>
        <Input
          id="imgURL"
          name="imgURL"
          type="url"
          value={formData.imgURL}
          onChange={handleInputChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Creating...' : 'Create Plant'}
        </Button>
        
        <Button 
          type="button" 
          variant="outline"
          onClick={() => router.push('/plants')}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
