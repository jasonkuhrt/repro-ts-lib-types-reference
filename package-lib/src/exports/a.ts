//
//
//
//
//
//
//
//
// Re-export ESM namespace (Foo)
// -------------------------------------------------------------------------------

// fail
// ----

export * from '../namespace.js'

// ok
// ----

// export * from './namespace.js'
// export * from './types.js'

//
//
//
//
//
//
//
//
// export ESM namespace
// -------------------------------------------------------------------------------

// fail
// ----

// export * as Foo from './types.js'

// ok
// ----

// export * as Foo from './types.js'
// export * from './types.js'

//
//
//
//
//
//
//
//
// export TS namespace
// -------------------------------------------------------------------------------

// ok
// ----

// export namespace Foo {
//   export interface Bar {
//     x: 1
//   }
// }
