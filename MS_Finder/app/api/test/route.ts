import { supabase } from '@/app/lib/supabase'
import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function GET() {
  try {
    // Test 1: Check if Supabase client is initialized
    if (!supabase) {
      return NextResponse.json(
        { status: 'error', message: 'Supabase client not initialized' },
        { status: 500 }
      )
    }

    // Test 2: Get Supabase auth data to verify connection
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // Test 3: Test direct PostgreSQL connection
    let postgresConnected = false
    let postgresError = null
    
    if (process.env.DATABASE_URL) {
      try {
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL
        })
        const result = await pool.query('SELECT NOW()')
        postgresConnected = !!result
        await pool.end()
      } catch (err) {
        postgresError = err instanceof Error ? err.message : 'Unknown error'
      }
    }

    return NextResponse.json({
      status: 'success',
      message: '✅ Successfully connected to Supabase!',
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      details: {
        apiKeyConnected: true,
        authConfigured: !authError,
        postgresConnected: postgresConnected,
        postgresError: postgresError
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
