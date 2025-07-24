# Le Compas Olfactif

Le Compas Olfactif is an online fragrance boutique built with React, TypeScript and Vite. The application uses Supabase for authentication and data storage and Tailwind CSS for styling.

## Setup

1. Install dependencies
   ```bash
   npm install
   ```
2. Create a `.env` file at the project root and provide the following environment variables:
   ```env
   VITE_SUPABASE_URL=<your-supabase-url>
   VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   # Optional: used when generating Supabase types
   SUPABASE_PROJECT_ID=<your-project-id>
   # Development helpers
   VITE_TEMPO=true
   TEMPO=true
   ```

## Running the project

Start a local development server with hot reload:

```bash
npm run dev
```

## Building for production

Generate an optimized production build:

```bash
npm run build
```

You can preview the built site locally with:

```bash
npm run preview
```

This outputs the static assets to the `dist` directory which can be served by any static hosting solution or deployed to providers like Vercel.

