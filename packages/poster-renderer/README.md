# `@pda/renderer`

### Bundle remotion while building package?
I've decided to bundle it on the client so while building the package.
This way this package does not require any react dependency
and just remotion `@remotion/renderer` which would make the package size smaller.
In addition can I test the bundle locally and thus assure whether it actually works more easily than on the server.
