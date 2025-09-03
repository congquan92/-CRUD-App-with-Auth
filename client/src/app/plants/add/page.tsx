import React from 'react'
import { stackServerApp } from '@/stack';
import { SignUp } from '@stackframe/stack';
import AddPlantForm from './AddPlantForm';

export default async function AddPlantPage() {
  const user = await stackServerApp.getUser();

  return (
    <div className="container mx-auto p-4">
      {user ? (
        <div>
          <h1 className="text-2xl font-bold mb-6">Add New Plant</h1>
          <AddPlantForm />
        </div>
      ) : (
        <div className='flex justify-center items-center mt-5'>
          <SignUp />
        </div>
      )}
    </div>
  )
}
