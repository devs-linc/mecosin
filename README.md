# Mecosin website and presentation

Astro website prototype with bilingual product information, local cart and simulated checkout. The English presentation is available at `/presentation/`.

## Shopping preview

- `/design/consumer/`: approved consumer homepage with Laserin/MecoVit highlights.
- `/produk/`: 20-product catalogue, search, brand/category/price filters and sorting.
- `/produk/laserin-sachet/`: example detail with shipping preview, reviews before specifications and description, quantity, add-to-cart and buy-now.
- `/keranjang/` and `/checkout/`: local browser cart and explicitly simulated checkout.

Shopping controls are Indonesian-first. Prices, delivery estimates and rating/sold counts are illustrative; no fictional customer reviews are published. Checkout only accepts fictional choices, never requests payment credentials and sends no data. Product packshots retain original Mecosin artwork. Generated hero/product-set backgrounds are illustrations, not evidence of actual staff or facilities.

## Build

Requires Node.js supported by Astro 7 and npm.

```sh
cd site
npm ci
npm run build
npm run preview -- --port 4342
```

In another terminal, run `cd site && npm run check`. Browser checks require Google Chrome at `/usr/bin/google-chrome`. Set `PREVIEW_URL` when using another preview address.

## Presentation

The self-contained HTML deck is committed so website builds do not require Python. To regenerate it, run from repository root:

```sh
python3 presentation/build.py
node presentation/check-deck.cjs
```

The deck check requires Chrome at `/opt/google/chrome/chrome`. The current deck has 21 slides, including SEO education and owned-commerce strategy; audit findings are excluded.

## Scope

This is a frontend prototype: prices and transactions are simulated. No real payment, order processing or AI service is connected. Product statements require client and qualified review before production use.

Internal workspace documents, audit archives, source intake, browser evidence and credentials are excluded. Source publication does not deploy or approve a production website. Brand and product assets remain subject to their owners' rights.

## Presentation references

- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://seller.shopee.co.id/edu/article/16057
- https://seller-id.tokopedia.com/university/essay?knowledge_id=7753828090824449&lang=id-ID

Marketplace discussion is qualitative. No fee rates or savings guarantees are asserted.
