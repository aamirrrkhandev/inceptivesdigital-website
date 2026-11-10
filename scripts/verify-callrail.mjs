// Uses the shared complete form journeys with both real vendor SDKs and mocked transport.
process.env.QA_CALLRAIL_NATIVE='1';
await import('./verify-ghl-tracking.mjs');
