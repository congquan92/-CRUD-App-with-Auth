'use server';
import { prisma } from "@/lib/prisma";
import { getUserId } from "./user.action";
import { revalidatePath } from "next/cache";


export async function getPlants(searchTerm?: String) {
  try {
    const currentUserId = await getUserId();
    console.log(currentUserId);
    const whereClause: any = {
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

    // revalidatePath("/plants");  // deleted cache route("/") and load data new    - goi du lieu thi khong can thiet goi 
    return { success: true, userPlants };

  } catch (error) {
    console.log("Error in getPlants :", error);
    throw new Error("Failed to retrieve plants");
  }
}

// create -> revalidate -> render fast
