import React from 'react'
import { stackServerApp } from '@/stack';
import { SignUp } from '@stackframe/stack';
import { getPlant } from '@/actions/plant.action';
import PlantDetails from './PlantDetails';

interface PlantPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PlantPage({ params }: PlantPageProps) {
  const user = await stackServerApp.getUser();
  const resolvedParams = await params;
  
  // Extract plant ID from slug (format: id--plant-name)
  const plantId = resolvedParams.slug.split('--')[0];

  if (!user) {
    return (
      <div className='flex justify-center items-center mt-5'>
        <SignUp />
      </div>
    );
  }

  try {
    const result = await getPlant(plantId);
    
    if (!result.success || !result.plant) {
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold text-red-500">Plant not found</h1>
          <p className="mt-2">The plant you're looking for doesn't exist or you don't have permission to view it.</p>
        </div>
      );
    }

    return (
      <div className="container mx-auto p-4">
        <PlantDetails plant={result.plant} />
      </div>
    );
  } catch (error) {
    console.error('Error loading plant:', error);
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-red-500">Error loading plant</h1>
        <p className="mt-2">There was an error loading the plant details. Please try again.</p>
      </div>
    );
  }
}
