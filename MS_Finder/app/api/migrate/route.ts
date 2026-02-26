import { NextResponse } from 'next/server'

async function runMigration() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/setup_users_table`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey!,
        Authorization: `Bearer ${supabaseKey}`
      }
    }).catch(() => null)

    
    if (!response || response.status === 404) {
      const sqlResponse = await fetch(
        'https://api.supabase.io/platform/v1/projects/efsgkttzlznxgobbxtxw/database/setup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`
          },
          body: JSON.stringify({
            query: `
              CREATE TABLE IF NOT EXISTS users (
                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                full_name text NOT NULL,
                email text UNIQUE NOT NULL,
                password text NOT NULL,
                created_at timestamp DEFAULT now()
              );
            `
          })
        }
      ).catch(e => ({ status: 500, json: async () => ({ error: e.message }) }))

      if (sqlResponse && sqlResponse.status === 200) {
        return {
          status: 'success',
          message: '✅ Users table created successfully!'
        }
      }
    }

    
    return {
      status: 'info',
      message: '⚠️ Please create users table manually in Supabase dashboard. Instructions sent to console.',
      sqlToRun: `CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name text NOT NULL,
        email text UNIQUE NOT NULL,
        password text NOT NULL,
        created_at timestamp DEFAULT now()
      );`
    }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function GET() {
  const result = await runMigration()
  return NextResponse.json(result)
}

export async function POST() {
  const result = await runMigration()
  return NextResponse.json(result)
}
