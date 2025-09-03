import { stackServerApp } from '@/stack';
import { SignUp } from '@stackframe/stack';
import React from 'react'
import InventoryTable from '../../components/inventorytable';
import { getPlants } from '@/actions/plant.action';

export default async function Plants() {
        const user = await stackServerApp.getUser();
        const app = stackServerApp.urls;
        const plant = await getPlants();
  return (
    <div>
        {user  ?  (
            <InventoryTable plants={plant} />
        ) : (
           <div className='flex justify-center items-center mt-5'> <SignUp /></div>
        )}

    </div>
  )
}
