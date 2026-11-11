P8 adds reproducible security checks and a public web demo for InDer. Mutation failures now emit fixed diagnostic codes without note contents or raw errors; tests cover SQL injection, log injection, and demo-server path traversal.

The existing SDK 58 upgrade is retained and aligned with Expo-compatible patch versions. Zod is pinned to patched 4.6.6. npm audit still reports moderate minimatch findings in build/lint tooling; these are documented rather than hidden or forced across a major dependency version.

Validation: typecheck/lint, 37 unit tests, 62 total test-runner results, iOS/Android/web export, and fresh-clone install/run/build. Detailed evidence and limits are in docs/pertemuan-8. Web demo supports local notes; native notification delivery remains a device-only flow.
