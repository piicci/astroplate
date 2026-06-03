# Becoming Elysian Post-Launch Checklist

Use this after the production deploy is live at `https://becomingelysian.com`.

## 1. Production Deploy

- [ ] Deploy from the latest intended branch.
- [ ] Confirm the production URL resolves over HTTPS: `https://becomingelysian.com`.
- [ ] Confirm `http://becomingelysian.com` redirects to HTTPS.
- [ ] Confirm `www.becomingelysian.com` either redirects to the canonical host or is intentionally supported.
- [ ] Confirm the deploy output includes:
  - `/robots.txt`
  - `/sitemap-index.xml`
  - `/sitemap-0.xml`
  - `/rss.xml`
  - `/llms.txt`
  - `/llms-full.txt`
- [ ] Confirm 404 handling works at a fake URL such as `/this-page-should-not-exist`.

## 2. Search Console

- [ ] Add a Google Search Console property.
- [ ] Prefer a Domain property if DNS access is available.
- [ ] If using URL-prefix verification, add `https://becomingelysian.com/`.
- [ ] Complete ownership verification.
- [ ] Submit this sitemap index: `https://becomingelysian.com/sitemap-index.xml`.
- [ ] Inspect these URLs after verification:
  - `https://becomingelysian.com/`
  - `https://becomingelysian.com/journal`
  - `https://becomingelysian.com/start-here`
  - One new journal article URL
- [ ] Request indexing for the homepage and a priority article after the deploy is live.

## 3. Crawl And Indexing

- [ ] Open `https://becomingelysian.com/robots.txt` and confirm it returns plain text.
- [ ] Confirm `robots.txt` contains `Sitemap: https://becomingelysian.com/sitemap-index.xml`.
- [ ] Confirm public pages do not have a `noindex` robots tag.
- [ ] Confirm intentionally thin/archive pages do have `noindex` where desired.
- [ ] Confirm no private files or draft content are publicly reachable.
- [ ] Confirm all canonical URLs use `https://becomingelysian.com` and no trailing slash.

## 4. SEO Metadata

- [ ] Confirm each core page has a unique title and meta description.
- [ ] Confirm journal articles have article JSON-LD.
- [ ] Confirm FAQ schema appears only where visible FAQ content exists.
- [ ] Confirm category pages have useful descriptions and canonical URLs.
- [ ] Confirm social preview images return 200.
- [ ] Test a priority URL in:
  - Google Rich Results Test
  - Facebook Sharing Debugger
  - LinkedIn Post Inspector

## 5. Content QA

- [ ] Review homepage hero, newsletter CTA, and footer links.
- [ ] Review journal index and pagination.
- [ ] Review all category pages.
- [ ] Review all legal pages:
  - Privacy Policy
  - Cookie Policy
  - Terms & Conditions
  - Medical Disclaimer
- [ ] Confirm dummy/sample authors are not linked publicly unless intentional.
- [ ] Confirm all article dates are correct for launch.
- [ ] Confirm no placeholder text such as `this is meta description` appears on indexable pages.

## 6. Forms And Email

- [ ] Submit the contact form in production.
- [ ] Submit the newsletter form in production.
- [ ] Confirm Netlify form submissions are received.
- [ ] Confirm spam honeypot behavior is enabled.
- [ ] Confirm notification routing for form submissions.
- [ ] Confirm Brevo/newsletter workflows are connected if signups should enter Brevo.
- [ ] Confirm the lead magnet PDF is reachable: `https://becomingelysian.com/downloads/7-high-protein-breakfasts.pdf`.

## 7. Analytics And Privacy

- [ ] Decide whether Google Tag Manager should be enabled.
- [ ] If enabling GTM, replace `GTM-XXXXXX` in config with the real container ID.
- [ ] Confirm analytics scripts comply with the cookie/privacy policy.
- [ ] Confirm any cookie banner or consent process required for target markets.
- [ ] Confirm Search Console, analytics, and form tools use the right owner accounts.

## 8. Performance And Accessibility

- [ ] Run Lighthouse or PageSpeed Insights on homepage and one article.
- [ ] Check mobile layout at 390px wide.
- [ ] Check desktop layout at 1440px wide.
- [ ] Confirm the header, search, and newsletter forms work with keyboard navigation.
- [ ] Confirm images have useful alt text.
- [ ] Confirm tap targets and form labels are accessible.
- [ ] Confirm Core Web Vitals are monitored after traffic begins.

## 9. Social And Brand

- [ ] Confirm favicon renders in browser tabs.
- [ ] Confirm Apple touch icon renders if saved to a phone home screen.
- [ ] Confirm Open Graph image appears for homepage and one article.
- [ ] Confirm footer/social links point to live profiles or are removed.
- [ ] Confirm the site name is consistent as `Becoming Elysian`.

## 10. Monitoring After Launch

- [ ] Check production logs after first deploy.
- [ ] Check Search Console coverage/indexing daily for the first week.
- [ ] Check form submissions daily for the first week.
- [ ] Watch for 404s from old or malformed URLs.
- [ ] Re-submit the sitemap after large content batches.
- [ ] Review rankings and queries after 2-4 weeks, not immediately on launch day.

## Current Build Notes

- `yarn build` completed successfully on 2026-06-03.
- Astro generated `dist/sitemap-index.xml` and `dist/sitemap-0.xml`.
- `dist/robots.txt` points Google and other crawlers to the sitemap index.
- The default social image was updated from the missing `/images/og-image.png` to `/images/becoming-elysian-about-cover.png`.
- Existing worktree has pre-existing deleted legacy images; verify that those deletions are intentional before committing.

