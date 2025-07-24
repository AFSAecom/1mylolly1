# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
## Requirements
- Node.js 18 or later

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```
- Replace `plugin:@typescript-eslint/recommended` with `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Déploiement sur Vercel

Configurez votre projet Vercel avant de lancer le déploiement :

1. Utilisez **Node.js 18** ou une version plus récente. Vous pouvez l'indiquer dans `package.json` via le champ `engines`.
2. Définissez les variables d'environnement suivantes dans l'onglet **Environment Variables** du projet :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

Ces variables permettent de se connecter à Supabase lors du build et à l'exécution.
Une fois la configuration terminée, lancez le déploiement depuis le tableau de bord Vercel ou avec la CLI `vercel`.
