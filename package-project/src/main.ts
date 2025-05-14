import { something } from './lib/something.js'
import { resource } from './resource.js'


/**

TypeScript will mark the following value's inferred type
as an error saying something like:

The inferred type of 'it' cannot be named without a reference to '../node_modules/package-lib/build/types.js'. This is likely not portable. A type annotation is necessary.ts(2742)

Fix it by chanigng how resource type is referenced in ./resource.ts

-> But why??

This has implications for library design DX in that we care
how types are presented to our users. For example I do not want to force
a project to make a random import from my library or pollute my default
entrypoint with many types.

*/

export const it = something(resource)
