import { db } from '../db';
import { categories, products } from '../db/schema';

async function checkDb() {
  try {
    const cats = await db.select().from(categories);
    console.log('Categories in DB:', cats);

    const prods = await db.select().from(products);
    console.log('Products count in DB:', prods.length);
    if (prods.length > 0) {
      console.log('Sample product:', prods[0]);
    }
  } catch (err) {
    console.error('Error querying database:', err);
  }
  process.exit(0);
}

checkDb();
