<p align="center">
  <a href="https://github.com/mirrorworld-universe/cascade-protocol">
    <img src="https://github.com/mirrorworld-universe/cascade/blob/main/media/logos/cascade-logotype.png?raw=true" alt="Cascade logo" width="300" />
  </a>
</p>

<h1 align="center">Solana's human-readable explorer. 🌊</h1>

<br />

This repository comprises of two kinds of workspaces:

- **Packages**:
  - [**Core**](./packages/core): The core package provides the basic building blocks for building Solana-first dApps.
  - [**React**](./packages/react): The React package provides a React hooks for building Solana-first dApps, making them easy to use for the end user.
- **Apps**:
  - [**Cascade Explorer**](./apps/explorer): The Cascade Explorer is a web application that allows users to explore the Solana blockchain and interact with programs deployed on Solana or any SVM Rollup.
  - [**Cascade Wallet**](./apps/wallet): The Cascade Wallet is a web application that allows users to interact with programs deployed on Solana or any SVM Rollup.

### npm Packages

| Package                       | Link                                        | Version                                        |
| :---------------------------- | :------------------------------------------ | :--------------------------------------------- |
| **`@cascade-protocol/core`**  | [cascade-protocol-core][cascade-core-npm]   | [![NPM][cascade-core-img]][cascade-core-npm]   |
| **`@cascade-protocol/react`** | [cascade-protocol-react][cascade-react-npm] | [![NPM][cascade-react-img]][cascade-react-npm] |

## Installation

This repository is a monorepo managed with [bun](https://bun.sh/).

To install the dependencies, run `bun install`.

```
bun install
```

## Contributing

Feel like contributing? That's awesome! We have a
[contributing guide](./CONTRIBUTING.md) to help guide you.

<!-- Links -->

[cascade-core-npm]: https://npmjs.com/package/@cascade-protocol/core
[cascade-react-npm]: https://npmjs.com/package/@cascade-protocol/react
[cascade-vue-npm]: https://npmjs.com/package/@cascade-protocol/vue
[cascade-core-img]: https://img.shields.io/npm/v/@cascade-protocol/core?logo=typescript
[cascade-react-img]: https://img.shields.io/npm/v/@cascade-protocol/react?logo=typescript
[cascade-vue-img]: https://img.shields.io/npm/v/@cascade-protocol/vue?logo=typescript

# License

MIT
