// Import the supabase client we created earlier
import { supabase } from './supabase_connection' // Adjust path if needed

async function fetchMyData() {
  // Replace 'your_table_name' with the actual name of your table in Supabase
  const { data, error } = await supabase
    .from('your_table_name')
    .select('*')

  if (error) {
    console.error('Error fetching data:', error)
    return
  }

  // Do something with your data!
  console.log('Fetched data:', data)
}

// Call the function to test it
fetchMyData()

