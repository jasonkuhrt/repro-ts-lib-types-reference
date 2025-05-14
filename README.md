## Points

### Notes

Should not be important but I used NodeJS Version 22.14.0.

### Goal

Author of `package-lib` wants their users to be able to benefit from TS inference with types from their library. Explicit type annotations for types from their library should never be required.

### The Error

Developer building `package-project` sees this error in their code:

```
The inferred type of 'it' cannot be named without a reference to '../node_modules/package-lib/build/types.js'. This is likely not portable. A type annotation is necessary.ts(2742)
```

### A Fix

Author modifies `package-lib` manifest to export its types directly (no ESM namespace or EMS re-export) in an entrypoint in its manifest as follows.

```json
{
	"exports": {
		"./types": "./build/types.js",
	}
}
```

Yes, its mere presence enables the other entrypoints of `package-lib` to work as expected, even though other entrypoints ALSO have the SAME types, just within namspaces or re-exported (see below).

- Good: Solution is on "producer side". DX. Consumer (customer, user), does not have to think about his.
- Bad: This is very suprising for author (how are they supposed to intuit this? Is this documented? Over years have never seen this explained)
- Unclear: In this case author has control over all types. What if author needs to re-export types from another package? Based on points below this seems likely to be a problem ☠. But I have not explicitly explored this case in this repo yet.

### Surprise 1: Cannot ESM re-export types

If author tries to export their types through an ESM re-export it fails.

Why?!

```json
{
	"exports": {
		"./types": "./build/types-re-export.js",
	}
}
```



### Surprise 2: Cannot rely on types in ESM namespaces

Author can export types under namespaces but TypeScript appears to ignore that.

You can observe this by trying out the example in this repo. To recap quickly, given:


```json
{
	"name": "package-lib",
	"exports": {
		".": "./build/index.js",
	}
}
```

```ts
// ./index.ts
export * as A from './a.js'

// ./a.ts
export interface Thing {}
```

... We can see that the consumer can do:

```ts
import { A } from 'package-lib'

type a = A.Thing // <-- type referece available right here!
```

However, when it comes to type inference, TypeScript appears to not be able to "see" `A.Thing`.
