'use server';
import { prisma } from "@/lib/prisma";
import { getUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function getPlants(searchTerm?: string) {
  try {
    const currentUserId = await getUserId();
    console.log(currentUserId);
    const whereClause: { userId: string | undefined; name?: { contains: string; mode: "insensitive" } } = {
      userId: currentUserId, // only plant userid
    };
    
    console.log(whereClause);

    if (searchTerm) {
      whereClause.name = {
        contains: searchTerm,
        mode: "insensitive", //   ASDADAS->asdasd
      };
    }
    const userPlants = await prisma.plant.findMany({
      where: whereClause, // query ( userId + searchTerm )
    }); 
    console.log(userPlants);

    return { success: true, userPlants };

  } catch (error) {
    console.log("Error in getPlants :", error);
    throw new Error("Failed to retrieve plants");
  }
}

// get single plant by id
export async function getPlant(id: string) {
  try {
    const currentUserId = await getUserId();
    
    const plant = await prisma.plant.findFirst({
      where: {
        id: id,
        userId: currentUserId, // make sure user only see their plants
      },
    });

    if (!plant) {
      throw new Error("Plant not found");
    }

    return { success: true, plant };
  } catch (error) {
    console.log("Error in getPlant:", error);
    throw new Error("Failed to get plant");
  }
}

// create new plant
export async function createPlant(plantData: {
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  imgURL?: string;
}) {
  try {
    const currentUserId = await getUserId();
    
    if (!currentUserId) {
      throw new Error("User not authenticated");
    }

    // Trim all string fields to remove whitespace
    const cleanedData = {
      name: plantData.name.trim(),
      description: plantData.description?.trim() || undefined,
      category: plantData.category.trim(),
      price: plantData.price,
      stock: plantData.stock,
      imgURL: plantData.imgURL?.trim() || undefined,
      userId: currentUserId,
    };

    const newPlant = await prisma.plant.create({
      data: cleanedData,
    });

    revalidatePath("/plants"); // refresh plants page
    return { success: true, plant: newPlant };
  } catch (error) {
    console.log("Error in createPlant:", error);
    throw new Error("Failed to create plant");
  }
}

// update plant
export async function updatePlant(
  id: string,
  plantData: {
    name?: string;
    description?: string;
    category?: string;
    price?: number;
    stock?: number;
    imgURL?: string;
  }
) {
  try {
    const currentUserId = await getUserId();

    // check if plant belongs to user
    const existingPlant = await prisma.plant.findFirst({
      where: {
        id: id,
        userId: currentUserId,
      },
    });

    if (!existingPlant) {
      throw new Error("Plant not found or not authorized");
    }

    // Trim all string fields to remove whitespace
    const cleanedData: Partial<{
      name: string;
      description: string | null;
      category: string;
      price: number;
      stock: number;
      imgURL: string | null;
    }> = {};
    if (plantData.name !== undefined) cleanedData.name = plantData.name.trim();
    if (plantData.description !== undefined) cleanedData.description = plantData.description?.trim() || null;
    if (plantData.category !== undefined) cleanedData.category = plantData.category.trim();
    if (plantData.price !== undefined) cleanedData.price = plantData.price;
    if (plantData.stock !== undefined) cleanedData.stock = plantData.stock;
    if (plantData.imgURL !== undefined) cleanedData.imgURL = plantData.imgURL?.trim() || null;

    const updatedPlant = await prisma.plant.update({
      where: { id: id },
      data: cleanedData,
    });

    revalidatePath("/plants"); // refresh plants page
    revalidatePath(`/plants/${id}`); // refresh plant detail page
    return { success: true, plant: updatedPlant };
  } catch (error) {
    console.log("Error in updatePlant:", error);
    throw new Error("Failed to update plant");
  }
}

// delete plant
export async function deletePlant(id: string) {
  try {
    const currentUserId = await getUserId();

    // check if plant belongs to user
    const existingPlant = await prisma.plant.findFirst({
      where: {
        id: id,
        userId: currentUserId,
      },
    });

    if (!existingPlant) {
      throw new Error("Plant not found or not authorized");
    }

    await prisma.plant.delete({
      where: { id: id },
    });

    revalidatePath("/plants"); // refresh plants page
    return { success: true };
  } catch (error) {
    console.log("Error in deletePlant:", error);
    throw new Error("Failed to delete plant");
  }
}
