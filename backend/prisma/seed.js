const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { id: 'seed-admin-user-id' },
    update: {},
    create: {
      id: 'seed-admin-user-id',
      email: 'admin@assetflow.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const laptop = await prisma.asset.upsert({
    where: { id: 'asset-laptop-1' },
    update: {},
    create: {
      id: 'asset-laptop-1',
      name: 'MacBook Pro 16"',
      serialNumber: 'C02DG43LMD6R',
      status: 'AVAILABLE',
      location: 'HQ - Floor 3',
    },
  });

  const camera = await prisma.asset.upsert({
    where: { id: 'asset-camera-1' },
    update: {},
    create: {
      id: 'asset-camera-1',
      name: 'Sony A7IV Camera',
      serialNumber: 'ILCE-7M4-001',
      status: 'AVAILABLE',
      location: 'Marketing Dept',
    },
  });

  const printer = await prisma.asset.upsert({
    where: { id: 'asset-printer-1' },
    update: {},
    create: {
      id: 'asset-printer-1',
      name: 'HP LaserJet Pro',
      serialNumber: 'VNC3J12345',
      status: 'AVAILABLE',
      location: 'HQ - Floor 1',
    },
  });

  console.log('Seeded admin:', admin.email);
  console.log('Seeded assets:', laptop.name, camera.name, printer.name);
}

main().catch(console.error).finally(() => prisma.$disconnect());
