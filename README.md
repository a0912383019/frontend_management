# Frontend_Vue

## 語言版本號

<table>
    <tr>
      <td>項目</td>
      <td>版本號</td>
    </tr>
    <tr>
      <td>node</td>
      <td>18.13.0</td>
    </tr>
    <tr>
      <td>vue</td>
      <td>3.2.47</td>
    </tr>
    <tr>
      <td>vite</td>
      <td>4.3.4</td>
    </tr>
</table>

## 專案內容

CDP 網站語言改版

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Get latest submodules
.gitmodules 的 remote 地址
url = ssh://git@swissknife.vip:2224/bi/cdp/weblate.git

```sh
第一次請下
git submodule update --init --recursive
git -C src/locales config core.sparseCheckout true
echo "cdp_frontend/*" >> .git/modules/src/locales/info/sparse-checkout
git submodule update --force --checkout src/locales

後續更新 submodule
git submodule update --remote --recursive

或是
git submodule update --force --checkout src/locales
git submodule update --remote --recursive
```