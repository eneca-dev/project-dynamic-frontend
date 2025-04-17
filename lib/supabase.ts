import { createClient } from '@supabase/supabase-js'

// Тут необходимо заменить значения на ваши реальные данные из Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mdybpekqfvwugqfvpdqa.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1keWJwZWtxZnZ3dWdxZnZwZHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NzE0MjYsImV4cCI6MjA1NTQ0NzQyNn0.Fe4MLOwsMG3GxcMEdZ1WYqoHsTAIjoGvzJfd0PFAjqc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'test' }
})