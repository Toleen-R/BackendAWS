import { PrismaClient } from "@prisma/client"; // Importerar PrismaClient för att interagera med databasen

// Skapar ett obejkt av PrismaClient för att möjliggöra databasoperationer
export const prisma = new PrismaClient();
