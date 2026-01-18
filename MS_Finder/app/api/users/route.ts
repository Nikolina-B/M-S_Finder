import { supabase } from '@/app/lib/supabase'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Create a new user
export async function POST(request: Request) {
  try {
    const { full_name, email, password } = await request.json()

    // Validate input
    if (!full_name || !email || !password) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user into database using Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          full_name,
          email,
          password: hashedPassword
        }
      ])
      .select()

    if (error) {
      return NextResponse.json(
        { status: 'error', message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      status: 'success',
      message: 'User created successfully',
      data: data
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 400 }
    )
  }
}

// Get user by email
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { status: 'error', message: 'Email parameter required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      return NextResponse.json(
        { status: 'error', message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: 'success',
      data: data
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
