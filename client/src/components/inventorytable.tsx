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
import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { getPlants, deletePlant } from "@/actions/plant.action";
import { useRouter } from "next/navigation";

type Plant = Awaited<ReturnType<typeof getPlants>>;
interface InventoryTableProps {
  plants: Plant
}

interface PlantItem {
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

export default function InventoryTable({ plants }: InventoryTableProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Get unique categories from plants data
  const availableCategories = useMemo(() => {
    if (!plants?.userPlants) return [];
    const categories = plants.userPlants.map(plant => plant.category);
    return [...new Set(categories)].sort(); // Remove duplicates and sort
  }, [plants?.userPlants]);

  // filter plants by name and category (if selected)
  const filteredPlants = plants?.userPlants?.filter((plant: PlantItem) => {
    return plant.name.toLowerCase().includes(searchTerm.toLowerCase()) && (selectedCategory === "" || plant.category === selectedCategory)
  });

  const handleProductClick = (product: PlantItem) => {
    const slugifiedName = product.name.toLowerCase().replace(/\s+/g, "-");
    const slug = `${product.id}--${slugifiedName}`;
    const productUrl = `/plants/${slug}`;
    router.push(productUrl);
  };

  const handleEdit = (e: React.MouseEvent, plantId: string) => {
    e.stopPropagation(); // prevent row click
    const plant = plants?.userPlants?.find(p => p.id === plantId);
    if (plant) {
      const slugifiedName = plant.name.toLowerCase().replace(/\s+/g, "-");
      const slug = `${plant.id}--${slugifiedName}`;
      router.push(`/plants/${slug}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent, plantId: string, plantName: string) => {
    e.stopPropagation(); // prevent row click
    
    const confirmDelete = confirm(`Are you sure you want to delete "${plantName}"? This action cannot be undone.`);
    if (!confirmDelete) return;

    setDeletingId(plantId);
    try {
      const result = await deletePlant(plantId);
      if (result.success) {
        console.log('Plant deleted successfully!');
        // refresh the page to show updated list
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting plant:', error);
      alert('Error deleting plant. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddPlant = () => {
    router.push('/plants/add');
  };

  // Calculate total value
  const totalValue = filteredPlants?.reduce((sum, plant) => sum + (plant.price * plant.stock), 0) || 0;

  return (
    <div className="w-full">
      {/* search bar */}
      <div className="flex items-center justify-between gap-2 p-4">
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-sm ">
            <Input
              placeholder="Search plants..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
          </div>
          <Combobox 
            value={selectedCategory} 
            onChange={(value) => setSelectedCategory(value)}
            categories={availableCategories}
          />
        </div>
        <Button onClick={handleAddPlant} variant="default">
          Add Plant
        </Button>
      </div>

      <Table>
        <TableCaption>Your plant inventory management system.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPlants && filteredPlants.length > 0 ? (
            filteredPlants.map((plant: PlantItem) => (
              <TableRow key={plant.id} onClick={() => handleProductClick(plant)} className="cursor-pointer hover:bg-gray-50">
                <TableCell className="font-medium">{plant.id.slice(0, 8)}...</TableCell>
                <TableCell>{plant.name}</TableCell>
                <TableCell>{plant.category}</TableCell>
                <TableCell>${plant.price.toFixed(2)}</TableCell>
                <TableCell className="font-bold">{plant.stock}</TableCell>
                <TableCell>${(plant.price * plant.stock).toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => handleEdit(e, plant.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => handleDelete(e, plant.id, plant.name)}
                      disabled={deletingId === plant.id}
                    >
                      {deletingId === plant.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No plants found. 
                <Button variant="link" onClick={handleAddPlant}>
                  Add your first plant
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total Inventory Value</TableCell>
            <TableCell className="font-bold">${totalValue.toFixed(2)}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}