import fs from 'fs';
import path from 'path';

async function fetchProductsFromShopify() {
  console.log('Fetching real hair products directly from Shopify API (https://www.naijabeautyhair.com/products.json)...');

  try {
    const res = await fetch('https://www.naijabeautyhair.com/products.json?limit=50', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!res.ok) {
      throw new Error(`Shopify API returned status ${res.status}`);
    }

    const data = await res.json();
    const shopifyProducts = data.products || [];

    console.log(`Found ${shopifyProducts.length} real hair products from Naija Beauty Hair!`);

    fs.mkdirSync(path.join(process.cwd(), 'public/seed/products'), { recursive: true });
    fs.mkdirSync(path.join(process.cwd(), 'public/seed/hero'), { recursive: true });
    fs.mkdirSync(path.join(process.cwd(), 'public/seed/testimonials'), { recursive: true });

    const downloadedProducts: Array<{
      name: string;
      slug: string;
      description: string;
      price: number;
      compareAtPrice: number | null;
      images: string[];
      categorySlug: string;
      stockStatus: string;
      isBestSeller: boolean;
      isFeatured: boolean;
      searchTags: string[];
    }> = [];

    for (let i = 0; i < shopifyProducts.length && i < 30; i++) {
      const p = shopifyProducts[i];
      const title = p.title;
      const slug = p.handle || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const bodyHtml = (p.body_html || 'High quality 100% human hair product. Pre-plucked natural hairline and premium quality.').replace(/<[^>]*>?/gm, '').slice(0, 150);
      
      const priceStr = p.variants?.[0]?.price || '120000';
      const rawPrice = Math.round(parseFloat(priceStr));
      // Adjust price to Naira standard if in USD or low numbers
      const priceNaira = rawPrice < 1000 ? rawPrice * 1200 : rawPrice;

      const comparePriceStr = p.variants?.[0]?.compare_at_price;
      const rawComparePrice = comparePriceStr ? Math.round(parseFloat(comparePriceStr)) : null;
      const comparePriceNaira = rawComparePrice ? (rawComparePrice < 1000 ? rawComparePrice * 1200 : rawComparePrice) : null;

      const productImages: string[] = [];

      for (let j = 0; j < Math.min(2, p.images?.length || 0); j++) {
        const rawImgUrl = p.images[j].src;
        // Get high res image URL
        const cleanUrl = rawImgUrl.split('?')[0];
        const ext = path.extname(cleanUrl) || '.jpg';
        const localFileName = `hair-product-${i + 1}-${j + 1}${ext}`;
        const localPath = path.join(process.cwd(), 'public/seed/products', localFileName);

        try {
          const imgRes = await fetch(rawImgUrl);
          if (imgRes.ok) {
            const buffer = Buffer.from(await imgRes.arrayBuffer());
            fs.writeFileSync(localPath, buffer);
            productImages.push(`/seed/products/${localFileName}`);
            console.log(`Saved product image ${localFileName}`);
          }
        } catch (imgErr) {
          console.error(`Error downloading image for ${title}:`, imgErr);
        }
      }

      if (productImages.length === 0) continue;

      // Determine category
      const typeLower = (p.product_type || title).toLowerCase();
      let categorySlug = 'wigs';
      if (typeLower.includes('bundle') || title.toLowerCase().includes('bundle')) categorySlug = 'bundles';
      else if (typeLower.includes('closure') || title.toLowerCase().includes('closure') || title.toLowerCase().includes('frontal')) categorySlug = 'closures';
      else if (typeLower.includes('extension') || title.toLowerCase().includes('extension') || title.toLowerCase().includes('braid')) categorySlug = 'extensions';
      else if (typeLower.includes('accessory') || typeLower.includes('band') || typeLower.includes('cap') || title.toLowerCase().includes('wrap') || title.toLowerCase().includes('band')) categorySlug = 'accessories';

      downloadedProducts.push({
        name: title,
        slug,
        description: bodyHtml,
        price: priceNaira,
        compareAtPrice: comparePriceNaira,
        images: productImages,
        categorySlug,
        stockStatus: 'in_stock',
        isBestSeller: i % 3 === 0,
        isFeatured: i % 2 === 0,
        searchTags: [categorySlug, 'human hair', 'virgin hair', 'hd lace', title.toLowerCase().split(' ')[0]],
      });
    }

    console.log(`Successfully fetched and saved ${downloadedProducts.length} actual hair products!`);

    // Write exported JSON data for the seed script
    fs.writeFileSync(
      path.join(process.cwd(), 'scripts/naija-hair-products.json'),
      JSON.stringify(downloadedProducts, null, 2)
    );

  } catch (err) {
    console.error('Error fetching Shopify products:', err);
    process.exit(1);
  }
}

fetchProductsFromShopify();
