# `dtif-to-svg`
Convert DTIF to SVG using D3.js.

## Why `opentype.js`

TypeScript Support: opentype.js comes with built-in TypeScript definitions. This makes it a more suitable choice for projects written in TypeScript, as it allows for type checking and autocompletion in compatible editors.

NPM Package: opentype.js is available as an NPM package, which simplifies the installation process and makes version management easier.

No Dependency on window: Unlike Typr.js, opentype.js doesn't rely on the global window object for its functionality. This makes it more portable and suitable for environments where window may not be available, such as server-side Node.js or worker threads.

It's worth noting, however, that there are trade-offs associated with choosing opentype.js over Typr.js. Some users have reported that opentype.js might be slower and less precise than Typr.js in some cases. Nonetheless, we believe that the advantages of opentype.js, especially its support for TypeScript and its availability as an NPM package, outweigh these potential downsides for the purposes of dtif-to-svg.
