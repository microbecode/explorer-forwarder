## Explorer Forwarder

A simple URL forwarder based on [ERC‑7950](https://eips.ethereum.org/EIPS/eip-7950).

### 1) How the UI operates (ERC‑7950)

- Enter an input in the format `a:b:c` where:
  - `a` = [EIP‑155](https://eips.ethereum.org/EIPS/eip-155) chain id (e.g. `1`, `10`, `137`, `42161`, `11155111`)
  - `b` = value to inject into the route template (e.g. a transaction hash)
  - `c` = route key to look up in the chain JSON. Currently only `tx` is supported.
- The app resolves the route template from `data/eip155-<a>.json`, replaces `{value}` with `b`, and forwards to the resulting URL.

Example: `1:0xabc...:tx` → opens `https://etherscan.io/tx/0xabc...`.

### 2) Adding new chains (via PR)

1. Create a new file under `data/` named `eip155-<chainId>.json`.
2. Use the following syntax:

```json
{
  "name": "Network Name",
  "routes": {
    "tx": "https://explorer.example/tx/{value}"
  }
}
```

3. At minimum, include a `tx` route. You can add more keys later (e.g., `address`, `block`).
4. Submit a pull request with the new file. Keep naming and structure consistent.

### 3) API route (direct use)

`GET /api/resolve?input=a:b:c`

- Resolves the given input and returns JSON:

```json
{
  "url": "https://...",
  "network": "Ethereum Mainnet"
}
```

- On error, returns status 400 with:

```json
{
  "error": "Route key not found in network config"
}
```

- To perform an immediate redirect instead, call:

`GET /api/resolve?input=a:b:c&redirect=1`

This issues a 307 redirect to the resolved URL.

### 4) Run locally

```bash
yarn
yarn dev
```

Then open `http://localhost:3000`.
