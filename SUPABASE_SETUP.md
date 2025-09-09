# Supabase Setup Guide

This guide will help you connect your API Key Management dashboard to a Supabase database.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Your Next.js project (already set up)

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `api-key-manager` (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
5. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **Anon public key** (under "Project API keys")

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in your project root (`dandi/.env.local`)
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Replace the placeholder values with your actual credentials from Step 2.

## Step 4: Create the Database Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query and paste the following SQL:

```sql
-- Create the api_keys table
CREATE TABLE api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  permissions TEXT NOT NULL DEFAULT 'read',
  usage_limit INTEGER DEFAULT 1000,
  api_key TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES auth.users(id) -- Optional: for user-specific keys
);

-- Create indexes for better performance
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed for your security requirements)
-- Allow all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on api_keys" ON api_keys
  FOR ALL USING (true);
```

3. Click "Run" to execute the SQL

## Step 5: Test the Connection

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `/dashboards` in your browser
3. Try creating a new API key to test the connection

## Step 6: Security Considerations (Optional)

For production use, consider implementing these security measures:

### User Authentication

If you want user-specific API keys, enable Supabase Auth:

1. Go to **Authentication** > **Settings** in your Supabase dashboard
2. Configure your preferred authentication method
3. Update the RLS policies to filter by `auth.uid()`

### Restricted Policies

Replace the permissive policy with more restrictive ones:

```sql
-- Drop the permissive policy
DROP POLICY "Allow all operations on api_keys" ON api_keys;

-- Create user-specific policies
CREATE POLICY "Users can view their own api_keys" ON api_keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own api_keys" ON api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own api_keys" ON api_keys
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own api_keys" ON api_keys
  FOR DELETE USING (auth.uid() = user_id);
```

## Troubleshooting

### Common Issues

1. **"Failed to load API keys" error**

   - Check your environment variables are correctly set
   - Verify your Supabase credentials
   - Ensure the database table exists

2. **"Row Level Security" errors**

   - Make sure RLS policies are configured
   - For testing, you can temporarily disable RLS: `ALTER TABLE api_keys DISABLE ROW LEVEL SECURITY;`

3. **Connection timeout**
   - Check your internet connection
   - Verify the Supabase project URL is correct

### Database Schema Updates

If you need to modify the table structure later, you can run migrations in the SQL Editor:

```sql
-- Example: Add a new column
ALTER TABLE api_keys ADD COLUMN new_field TEXT;

-- Example: Modify an existing column
ALTER TABLE api_keys ALTER COLUMN usage_limit SET DEFAULT 5000;
```

## Features Included

✅ **CRUD Operations**: Create, Read, Update, Delete API keys
✅ **Real-time Updates**: Changes are immediately reflected
✅ **Error Handling**: Proper error messages and loading states
✅ **Security**: API key masking and visibility toggle
✅ **Performance**: Indexed database queries
✅ **Scalability**: Cloud-hosted database with automatic backups

## Next Steps

- Set up user authentication (optional)
- Implement API key usage tracking
- Add API key expiration dates
- Set up email notifications for key events
- Create API endpoints to validate keys

Your API Key Management system is now connected to a production-ready database! 🎉
