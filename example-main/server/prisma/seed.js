import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = (p) => bcrypt.hashSync(p, 10);

  // Upsert users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password: hash('password123'),
      role: 'ADMIN',
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      name: 'Owner One',
      email: 'owner@example.com',
      password: hash('password123'),
      role: 'OWNER',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Normal User',
      email: 'user@example.com',
      password: hash('password123'),
      role: 'USER',
    },
  });

  // Create a few stores for the owner (use upsert by slug if present)
  const storesData = [
    {
      name: 'Blue Bottle Cafe',
      description: 'Specialty coffee and pastries in a cozy setting',
    },
    {
      name: 'Sunrise Grocery',
      description: 'Neighborhood grocery with fresh produce and essentials',
    },
    {
      name: 'Tech Haven',
      description: 'Electronics store with latest gadgets and accessories',
    },
  ];

  // Upsert by (name, ownerId) pair to avoid duplicate seeds
  const upsertStoreByNameOwner = async ({ name, description }) => {
    const existing = await prisma.store.findFirst({ where: { name, ownerId: owner.id } });
    if (existing) return existing;
    return prisma.store.create({ data: { name, description, ownerId: owner.id } });
  };

  const stores = [];
  for (const s of storesData) {
    stores.push(await upsertStoreByNameOwner(s));
  }

  // Seed a couple ratings from the normal user
  if (stores[0]) {
    await prisma.rating.upsert({
      where: { userId_storeId: { userId: user.id, storeId: stores[0].id } },
      update: { stars: 5, comment: 'Fantastic coffee!' },
      create: { userId: user.id, storeId: stores[0].id, stars: 5, comment: 'Fantastic coffee!' },
    });
  }
  if (stores[1]) {
    await prisma.rating.upsert({
      where: { userId_storeId: { userId: user.id, storeId: stores[1].id } },
      update: { stars: 4, comment: 'Great veggies and fruits.' },
      create: { userId: user.id, storeId: stores[1].id, stars: 4, comment: 'Great veggies and fruits.' },
    });
  }

  // Output summary
  // eslint-disable-next-line no-console
  console.log('Seed complete:', {
    admin: { email: admin.email },
    owner: { email: owner.email },
    user: { email: user.email },
    stores: stores.map(s => ({ id: s.id, name: s.name })),
  });
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
