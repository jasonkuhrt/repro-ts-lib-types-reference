// CASES THAT FAIL

// import type { Foo } from 'package-lib/fail-re-export-esm-namespace'
import type { Foo } from 'package-lib/fail-export-esm-namespace'

// ... But: Make any of the above cases PASS by adding this:


// CASES THAT ARE OK

// import type { Foo } from 'package-lib/ok-re-export-esm-namespace-and-types'
// import type { Foo } from 'package-lib/ok-export-ts-namespace'
// import type { Foo } from 'package-lib/ok-export-esm-namespace-and-types'

export declare const resource: Foo.A
