# What's in that Bill?

AI-powered Congressional bill analysis made accessible. This web application uses AI to provide accessible summaries of bills passed by Congress, helping citizens understand legislation that affects their lives.

## Features

- **AI-Powered Summaries**: Get plain-language explanations of complex legislation
- **Search & Filter**: Find bills by keyword, status, or date
- **Impact Analysis**: Understand who's affected and potential outcomes
- **Daily Updates**: Automatically syncs new bills from Congress.gov
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 16 (App Router), Tailwind CSS 4
- **Database**: PostgreSQL (Supabase) for bill metadata, MongoDB Atlas for AI summaries
- **AI**: LangChain with Claude (Anthropic) and GPT-4 (OpenAI) as fallback
- **Data Source**: [Congress.gov API](https://api.congress.gov/)
- **Hosting**: Vercel with Cron Jobs

## Prerequisites

Before running this project, you need:

1. **Supabase Account** - [Sign up](https://supabase.com/)
2. **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
3. **Congress.gov API Key** - [Register](https://api.congress.gov/sign-up/)
4. **Anthropic API Key** - [Get one](https://console.anthropic.com/)
5. **OpenAI API Key** (optional) - [Get one](https://platform.openai.com/api-keys)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
MONGODB_URI=mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/?retryWrites=true&w=majority

# API Keys
CONGRESS_API_KEY=your_congress_api_key_here
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...  # Optional fallback

# Security
CRON_SECRET=your_random_secret_here  # Generate with: openssl rand -base64 32

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Setup

### PostgreSQL (Supabase)

Run the Drizzle migrations to create the database schema:

```bash
npx drizzle-kit push
```

### MongoDB

The application will automatically create the required collections and indexes on first run.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see above)
4. Run database migrations:
   ```bash
   npx drizzle-kit push
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000)

## Syncing Bills

To manually trigger a bill sync (in development):

```bash
curl -X POST http://localhost:3000/api/cron/sync-bills \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

In production, Vercel Cron runs this automatically daily at 6 AM UTC.

## Project Structure

```
whats-in-that-bill/
├── app/
│   ├── api/
│   │   ├── bills/           # Bill API routes
│   │   └── cron/            # Cron job endpoints
│   ├── bills/[id]/          # Bill detail page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
├── lib/
│   ├── db/                  # Drizzle ORM setup
│   ├── mongodb/             # MongoDB client
│   ├── congress-api/        # Congress API integration
│   └── langchain/           # AI summary generation
├── types/                   # TypeScript types
└── vercel.json              # Vercel cron configuration
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/bills` | GET | List bills with pagination |
| `/api/bills/[id]` | GET | Get single bill with summary |
| `/api/bills/search` | GET | Search bills by query |
| `/api/cron/sync-bills` | POST | Trigger bill sync (protected) |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The cron job is configured in `vercel.json` to run daily.

### Environment Variables for Production

Set these in your Vercel project settings:
- `DATABASE_URL`
- `MONGODB_URI`
- `CONGRESS_API_KEY`
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY` (optional)
- `CRON_SECRET`
- `NEXT_PUBLIC_APP_URL` (your production URL)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Disclaimer

AI summaries are generated for informational purposes and may contain errors. Always refer to the official bill text on Congress.gov for authoritative information.
