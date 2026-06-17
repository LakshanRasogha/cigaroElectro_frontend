# Screaming Frog Custom Extraction Config
#
# Import these regex patterns into Screaming Frog SEO Spider:
# Configuration → Custom → Extraction → Add
#
# Recommended crawl settings:
# - Mode: Spider
# - Start URL: https://cigarroelectrico.com
# - Respect robots.txt: enabled
# - Crawl JavaScript: disabled (Next.js SSR pages render server-side)
# - Follow internal links only

## 1. Missing Meta Description
Name: Missing Meta Description
Extract: XPath
Expression: //meta[@name='description' and (not(@content) or @content='')]
Report: Pages where meta description is absent or empty

Alternative Regex (HTML source):
Pattern: <meta\s+name=["']description["']\s+content=["']\s*["']
Match: Pages with empty description attribute

## 2. Missing Canonical Tag
Name: Missing Canonical
Extract: XPath
Expression: //head[not(.//link[@rel='canonical'])]
Report: Pages without a canonical URL

## 3. Missing JSON-LD Product Schema
Name: Missing Product Schema
Extract: Regex
Pattern: "@type"\s*:\s*"Product"
Match: Invert — flag product URLs (/collections/[slug]) that do NOT contain Product schema
Scope: Include only URLs matching /collections/ excluding /collections/category/ and exact /collections

## 4. Missing CollectionPage Schema
Name: Missing CollectionPage Schema
Extract: Regex
Pattern: "@type"\s*:\s*"CollectionPage"
Scope: /collections and /collections/category/*

## 5. Missing BreadcrumbList Schema
Name: Missing Breadcrumb Schema
Extract: Regex
Pattern: "@type"\s*:\s*"BreadcrumbList"
Scope: All indexable catalog routes

## 6. Broken Product Links (404)
Name: Product 404 Check
Method: Use Screaming Frog Response Codes filter
Filter: Client Error (4xx) on URLs matching /collections/
Export: Response Codes → Client Error (4xx)

## 7. Missing Open Graph Tags
Name: Missing OG Title
Extract: XPath
Expression: //head[not(.//meta[@property='og:title'])]

Name: Missing OG Image
Extract: XPath
Expression: //head[not(.//meta[@property='og:image'])]

## 8. Unindexed Dynamic Addresses
Name: Orphan Product Pages
Method: Compare sitemap.xml URLs against crawled URLs
Steps:
1. Crawl https://cigarroelectrico.com/sitemap.xml
2. Export sitemap URLs (List Mode on sitemap)
3. Compare with Spider crawl → Pages not in sitemap or sitemap URLs not crawled

## 9. LCP Image Priority Check
Name: Missing fetchpriority on Hero
Extract: Regex
Pattern: fetchPriority=["']high["']
Scope: / (homepage) and /collections/*
Invert on homepage if hero img lacks fetchPriority="high"

## 10. Image Dimension Check (CLS)
Name: Images Without Dimensions
Extract: XPath
Expression: //img[not(@width) and not(@height) and not(contains(@style,'aspect-ratio'))]
Report: Images missing width/height that may cause layout shift

## Automated Sweep Schedule (recommended)
- Weekly full crawl of production
- Post-deploy smoke crawl (homepage + 5 catalog paths + 3 product URLs)
- Export: Response Codes, Page Titles, Meta Description, Canonicals, Structured Data

## Sitemap Reference
Production sitemap: https://cigarroelectrico.com/sitemap.xml
Robots: https://cigarroelectrico.com/robots.txt

## CI Integration
Pair with Lighthouse CI (.github/workflows/lighthouse.yml) for performance regression gates.
LCP threshold: ≤ 2500ms | CLS threshold: ≤ 0.1 | SEO score: ≥ 0.9
