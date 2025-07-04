# OpenSDK: Adyen Web SDK Specification Parser

This project parses the [Adyen Web SDK](https://github.com/Adyen/adyen-web) and generates structured specifications for all supported versions of the SDK. It is designed to help developers and integrators understand, document, and maintain the evolving API surface of Adyen's web integration.

## Features
- Fetches and parses TypeScript types from any version of the Adyen Web SDK
- Recursively resolves imports and type references
- Outputs a structured specification for each SDK version
- Caches results for performance

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later (v20+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation
Clone the repository and install dependencies:

```sh
npm install
```

### Usage
To parse a specific version of the Adyen Web SDK and generate its specification, run:

```sh
npx ts-node web/src/utils/processSDKTypes.ts
```

### Project Structure
- `web/src/utils/processSDKTypes.ts` — Main script for parsing and generating specifications
- `web/src/utils/fetchOpenSDK.ts` — Fetches and processes remote SDK type definitions
- `web/src/utils/processTypes.ts` — Utilities for recursive type processing

## Contributing
Pull requests and issues are welcome! Please open an issue to discuss your idea or bug before submitting a PR.

## License
[ISC](LICENSE)
