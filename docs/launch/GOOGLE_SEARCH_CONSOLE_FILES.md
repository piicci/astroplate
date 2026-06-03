# Google Search Console Files And Submission Guide

Production site: `https://becomingelysian.com`

## Submit This Sitemap

Submit this URL in Google Search Console under **Sitemaps**:

```text
https://becomingelysian.com/sitemap-index.xml
```

If Search Console shows **Couldn't fetch** immediately after submission, first confirm both URLs load in the browser:

```text
https://becomingelysian.com/sitemap-index.xml
https://becomingelysian.com/sitemap-0.xml
```

If both return XML, the sitemap is reachable. Wait a few minutes, refresh the report, then try submitting the child sitemap directly:

```text
https://becomingelysian.com/sitemap-0.xml
```

For a URL-prefix property where Search Console already shows `https://becomingelysian.com/` before the input field, submit only:

```text
sitemap-index.xml
```

or:

```text
sitemap-0.xml
```

Generated source after `yarn build`:

```text
dist/sitemap-index.xml
dist/sitemap-0.xml
```

The sitemap index currently references:

```text
https://becomingelysian.com/sitemap-0.xml
```

Google says a sitemap can be submitted in Search Console or referenced in `robots.txt`. This site does both.

## Robots File

Live URL to check:

```text
https://becomingelysian.com/robots.txt
```

Generated source after `yarn build`:

```text
dist/robots.txt
```

Expected contents:

```text
User-agent: *
Allow: /
Disallow: /api/
Disallow: /__forms.html
Disallow: /brevo-
Sitemap: https://becomingelysian.com/sitemap-index.xml
```

## Ownership Verification

Google Search Console ownership verification cannot be fully pre-created in this repo because Google generates an account-specific token.

Recommended options:

- Domain property: add the DNS TXT record Google gives you at the DNS provider. This covers all protocols and subdomains.
- URL-prefix property: use Google's HTML file upload method if DNS access is not convenient.

For HTML file verification:

1. In Search Console, choose the HTML file upload method.
2. Download the exact file Google provides, usually named like `google1234567890abcdef.html`.
3. Add that exact file to:

```text
public/google1234567890abcdef.html
```

4. Run `yarn build`.
5. Confirm it exists at:

```text
https://becomingelysian.com/google1234567890abcdef.html
```

Do not rename or edit the verification file. Google requires the exact file name and contents.

## Other Useful Public Files

These are not submitted to Google Search Console as sitemaps, but they are useful launch checks:

```text
https://becomingelysian.com/rss.xml
https://becomingelysian.com/llms.txt
https://becomingelysian.com/llms-full.txt
```

Generated source after `yarn build`:

```text
dist/rss.xml
dist/llms.txt
dist/llms-full.txt
```

## Priority URLs To Inspect

After verification, use the URL Inspection tool for:

```text
https://becomingelysian.com/
https://becomingelysian.com/journal
https://becomingelysian.com/start-here
https://becomingelysian.com/journal/high-protein-breakfast-ideas-for-steady-energy
```

## Official References

- Google sitemap submission: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google robots.txt guidance: https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt
- Google site ownership verification: https://support.google.com/webmasters/answer/9008080
- Google URL Inspection tool: https://support.google.com/webmasters/answer/9012289
