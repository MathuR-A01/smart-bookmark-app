
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient('https://hwhyogvwahpnixwspfcn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3aHlvZ3Z3YWhwbml4d3NwZmNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NzA4NTIsImV4cCI6MjA4NjU0Njg1Mn0.mbkRK_ZIPcswaeI2A9XxX2-gIyNMO44go8mg0mw_Bvg')
