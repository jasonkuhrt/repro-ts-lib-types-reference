# Repro/Exploring of "... cannot be named without a reference to ..."

## About

This repo explores a TS error that occurs in the context of:

- Two packages
- Inference across multiple modules

There are two packages, a "library" and a "project". The project depends on the library.

Depending on how the library package is setup and as well as on the project code itself, the project encounters an error of:

```
The inferred type of 'it' cannot be named without a reference to '../node_modules/package-lib/build/types.js'. This is likely not portable. A type annotation is necessary.ts(2742)
```

This error matters for library authors who want their users to be able to benefit from TS inference with types from their library.

To recap quickly an example of the issue, given:

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

There is more to this than just this example. Definitely try the repro yoourself to get a feel for it.

## Repro Steps

To reproduce this error with this repo:

1. Clone this repo
2. Run `pnpm install` on each package
3. Run `pnpm build` in package `package-lib`
4. Remove the manifest export `./types` from `package-lib/package.json`
5. Run `pnpm build` in package `package-project`

It should not be important but I used NodeJS Version 22.14.0.

You can try different cases of success and failure by changing how `package-project` imports from `package-lib` in `package-project/src/resource.ts`. You will see commented out code there to try different imports.

## My Learnings

1. TypeScript will _not_ consider types in a dependency within an ESM namespace to be "nameable" ...
	1. ... unless they are imported into the module where the inference takes place. Just `import '...'` of the dependency is enough, not even having to import the entrypoint's exports.
2. TypeScript _will_ consider types of a dependency to be "nameable" if they are exported directly from _any_ entrypoint of the dependency.
3. If those types are within a namespace exported directly from an entrypoint that works too.

It seems to me that (1) is a bug.

## Points

### The Error

Developer building `package-project` sees this error in their code:

```
The inferred type of 'it' cannot be named without a reference to '../node_modules/package-lib/build/types.js'. This is likely not portable. A type annotation is necessary.ts(2742)
```

### Best Fix?

An author can support TS inference with their library by consumers by exporting their types directly (no ESM namespace or EMS re-export) in some (any) entrypoint in their manifest. For example:

```json
{
	"name": "lib",
	"exports": {
		"./whatever": "./build/whatever.js",
	}
}
```

```ts
// ./whatever.ts
export interface Thing {}
```

The mere presence of the export entry `./whatever` enables consumers to infer with types from `lib` (e.g. `Thing`) that may come from within an ESM namespace.

Rating this solution:

- Good: Solution is on "producer side". Consumer (customer, user), does not have to think about his. Right balance of burden for DX. 
- Bad: In this case author has control over all types. What if author needs to re-export types from another package? Based on points below this seems likely to be a problem ☠. But I have not explicitly explored this case in this repo yet.

Not technical but this solution is very surprising to me and I imagine others. How are we supposed to intuit this? Is this documented? Over years have never seen this well explained.

### Finishing Thoughts

- I wish TS would consider types in ESM namespaces to be "nameable". 
- I wish TS would be consider types in re-exported ESM exports to be "nameable".
- I will open a TS issue and see what it gives
