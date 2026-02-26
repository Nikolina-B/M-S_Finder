import { supabase } from '@/app/lib/supabase'
import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function GET() {
  try {
    //Provjera je li Supabase klijent inicijaliziran
    if (!supabase) {
      return NextResponse.json(
        { status: 'error', message: 'Supabase klijent nije inicijaliziran' },
        { status: 500 }
      )
    }

    // Dohvaćanje podataka o autentifikaciji 
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // Testiranje veze s PostgreSQL bazom
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
        postgresError = err instanceof Error ? err.message : 'Nepoznata pogreška'
      }
    }

    return NextResponse.json({
      status: 'success',
      message: '✅ Uspješno povezivanje sa Supabase platformom!',
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
        message: error instanceof Error ? error.message : 'Nepoznata pogreška' 
      },
      { status: 500 }
    )
  }
}