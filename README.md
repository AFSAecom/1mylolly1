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

Avant de déployer l'application, préparez votre projet dans Vercel :

1. Utilisez **Node.js 18** ou une version ultérieure. Indiquez cette version dans le champ `engines` de `package.json` pour que Vercel l'applique.
2. Dans l'onglet **Environment Variables** de Vercel, ajoutez les variables suivantes :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

Ces variables sont nécessaires pour que l'application puisse accéder à Supabase.
Une fois la configuration terminée, déclenchez le déploiement depuis l'interface Vercel ou via la commande `vercel`.
