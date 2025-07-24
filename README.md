# MyLolly

This project is built with **React**, **TypeScript**, **Vite** and **Tailwind CSS**. Data is stored in **Supabase**.

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file at the project root containing:
   ```bash
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## Deployment on Vercel

The repository includes a `vercel.json` file so deployments on Vercel run `npm run build` automatically.  In the Vercel dashboard, define the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to match your `.env` file.

Run the following to create an optimized production build locally:

```bash
npm run build
```
