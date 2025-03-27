# Music Collection

A Next.js application for managing and showcasing a collection of music videos with admin capabilities and click tracking.

## Project Structure

```
music-collection/
├── app/                    # Next.js app directory (App Router)
├── components/            # Reusable React components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and shared code
├── node_modules/         # Project dependencies
├── public/               # Static assets
├── styles/              # Global styles and CSS modules
├── supabase/            # Supabase configuration and migrations
│   └── functions/       # Database functions
├── .env.local           # Local environment variables
├── .gitignore           # Git ignore configuration
├── components.json      # Components configuration
├── middleware.ts        # Next.js middleware
├── next-env.d.ts       # Next.js TypeScript declarations
├── next.config.mjs     # Next.js configuration
├── package.json        # Project dependencies and scripts
├── pnpm-lock.yaml     # PNPM lock file
├── postcss.config.mjs # PostCSS configuration
├── tailwind.config.ts # Tailwind CSS configuration
└── tsconfig.json      # TypeScript configuration
```

## Features

- Music video collection management
- Admin interface for video management
- Click tracking for video popularity
- YouTube video integration
- Responsive design with Tailwind CSS
- Authentication system
- Dark mode support

## Tech Stack

- Next.js (App Router)
- TypeScript
- Supabase (Database & Authentication)
- Tailwind CSS
- PNPM (Package Manager)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd music-collection
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

The project uses Supabase as the database. The schema includes:
- Music videos table with click tracking
- User authentication
- Database functions for video management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 