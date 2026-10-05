AGRICALC PAKISTAN — MONETAG INTEGRATION NOTES

Website root: agricalc-pakistan-main/

What was changed:
- Added the three Monetag tags supplied by the site owner to the <head> of every HTML page (without duplicating the tags on index.html).
- Copied the supplied sw.js file to the website root. It must remain at /sw.js when deployed because the existing site registers it from that root path.
- Updated assets/js/main.js so nested pages under /blog/, /tools/, /category/, /resources/, and /glossary/ load shared JavaScript modules from ../assets/js/.
- Preserved the website's existing logical folder structure, relative links, CSS, images, and page URLs. Flattening all HTML files into one folder would break paths and duplicate index.html names; the site should be deployed with this structure intact.

IMPORTANT AD DISPLAY NOTES:
- These three Monetag tags are the exact formats supplied by the site owner. They do not by themselves guarantee a fixed 728x90, 320x100, or 300x250 in-page banner. Do not add empty banner boxes expecting these scripts to fill them.
- Zone 11940471 is configured by the supplied snippet as a Vignette-style script. The other formats depend on the Monetag dashboard zone settings and traffic/device eligibility.
- Ad display, fill rate, and approval are controlled by Monetag; test on the live HTTPS domain with ad blockers disabled and check the Monetag dashboard.
- sw.js is copied exactly from the user-supplied file. The existing main.js already attempts to register /sw.js.

DEPLOYMENT:
1. Extract the ZIP.
2. Upload the CONTENTS of the agricalc-pakistan-main folder to the Cloudflare Pages project root (not the outer folder itself, unless your build root is set to that folder).
3. Keep sw.js at the root beside index.html, and keep assets/, blog/, tools/, category/, resources/, and glossary/ in place.
4. Deploy, then open several root and nested pages on the live HTTPS site and inspect the browser console and Monetag dashboard.
