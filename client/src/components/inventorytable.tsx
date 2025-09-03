"use client"
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { Combobox } from "./ui/combox";
import { useState } from "react";
import { Button } from "./ui/button";
import { getPlants } from "@/actions/plant.action";
// const plants = [
//   {
//     id: "INV001",
//     name: "Plant A",
//     category: "Flower",
//     price: 100,
//     stock: 50,
//     // action : "Edit/Delete"
//   },
// ];

type Plant =  Awaited<ReturnType<typeof getPlants>>;
interface InventoryTableProps {
  plants:Plant
}

export default function InventoryTable({plants}: InventoryTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // filter plants by name and category (if selected)
  const filteredPlants = plants?.userPlants?.filter((plant : any) => {
   return plant.name.toLowerCase().includes(searchTerm.toLowerCase()) && (selectedCategory === "" || plant.category === selectedCategory)
});

  return (

    <div className="w-full">
      {/* search bar */}
      <div className="flex items-center justify-between gap-2 p-4">
       <div className="flex items-center gap-2">
          <div className="relative w-full max-w-sm ">
            <Input
              placeholder="Search..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
          </div>
          <Combobox value={selectedCategory} onChange={(value) => setSelectedCategory(value)} />
       </div>
          <Button variant="outline">Add Plant</Button>
      </div>

      <Table>
        <TableCaption>A list of your recent invoice.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPlants.map((plants : any) => (
            <TableRow key={plants.id}>
              <TableCell className="font-medium">{plants.id}</TableCell>
              <TableCell>{plants.name}</TableCell>
              <TableCell>{plants.category}</TableCell>
              <TableCell>{plants.price}</TableCell>
              <TableCell className="font-bold">{plants.stock}</TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end space-x-4">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                </div>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

    </div>





  );
}