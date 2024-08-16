import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getItems() {
  return await prisma.item.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });
}

export async function countItemsByType(itemType: string) {
  return await prisma.item.count({
    where: {
      itemType,
    },
  });
}

export async function getMonthlyPercentageChange(itemType: string) {
  const currentMonth = new Date();
  const previousMonth = new Date(currentMonth);
  previousMonth.setMonth(currentMonth.getMonth() - 1);

  const currentMonthCount = await prisma.item.count({
    where: {
      itemType,
      createdAt: {
        gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
        lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
      }
    }
  });

  const previousMonthCount = await prisma.item.count({
    where: {
      itemType,
      createdAt: {
        gte: new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1),
        lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      }
    }
  });

  if (previousMonthCount === 0) {
    return "não tem registro";
  }

  const percentageChange = ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
  return `+${percentageChange.toFixed(1)}% do que no mês passado`;
}

export async function getItemByCode(itemCode: string) {
  return await prisma.item.findUnique({
    where: {
      itemCode,
    },
  });
}
