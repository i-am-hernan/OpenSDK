# OpenSDK: Adyen Web SDK Schema Extractor

Extracts structured JSON schemas from the public TypeScript declarations (`.d.ts`) of [`@adyen/adyen-web`](https://github.com/Adyen/adyen-web). The output powers docs, AI-assisted config generation, version diffing, and validation tooling.

## How it works

1. Installs `@adyen/adyen-web@<version>` in an isolated temp directory (`/tmp/sdk-extract/`)
2. Resolves the `.d.ts` entrypoint from the package's `package.json`
3. Parses declarations with [ts-morph](https://ts-morph.com/)
4. Builds a normalized schema with `$ref`-style type references
5. Writes the schema to `schemas/<version>.json`

Supports `v6.0.0+` (the version range that ships bundled `.d.ts` files with all types publicly exported).

## Prerequisites

- Node.js v18+ (v20+ recommended)
- npm

## Setup

```sh
npm install
```

## Usage

Extract the schema for a specific SDK version:

```sh
npx ts-node src/extract.ts 6.34.0
```

Output: `schemas/6.34.0.json`

## Schema format

The schema is a dictionary of types keyed by name. Properties use structured type descriptors with `$ref`-style references:

```json
{
  "packageName": "@adyen/adyen-web",
  "version": "6.34.0",
  "extractedAt": "2026-07-03T06:23:15.542Z",
  "types": {
    "CoreConfiguration": {
      "kind": "interface",
      "exported": true,
      "properties": [
        {
          "name": "amount",
          "type": { "kind": "ref", "typeName": "PaymentAmount" },
          "rawType": "PaymentAmount | undefined",
          "optional": true,
          "jsDoc": "Amount of the payment"
        }
      ]
    },
    "PaymentAmount": {
      "kind": "interface",
      "exported": true,
      "properties": [
        { "name": "value", "type": { "kind": "primitive", "value": "number" } },
        { "name": "currency", "type": { "kind": "primitive", "value": "string" } }
      ]
    }
  }
}
```

### Type descriptor kinds

| Kind | Description | Example |
|------|-------------|---------|
| `primitive` | Built-in types | `{ kind: "primitive", value: "string" }` |
| `literal` | String/number literals | `{ kind: "literal", value: "test" }` |
| `ref` | Reference to another type in the schema | `{ kind: "ref", typeName: "PaymentAmount" }` |
| `array` | Array with element type | `{ kind: "array", elementType: { kind: "primitive", value: "string" } }` |
| `union` | Union of types | `{ kind: "union", types: [...] }` |
| `intersection` | Intersection of types | `{ kind: "intersection", types: [...] }` |
| `function` | Callable with signature | `{ kind: "function", signature: "(state: SubmitData) => void" }` |
| `object` | Inline anonymous object | `{ kind: "object", properties: [...] }` |
| `unknown` | Fallback for unclassified types | `{ kind: "unknown", raw: "..." }` |

## Project structure

```
src/
  extract.ts          ← Extractor script (install, parse, output)
schemas/
  6.34.0.json         ← Extracted schema (one per version)
web/                  ← Legacy extractor (deprecated, kept for reference)
```

## License

[ISC](LICENSE)
