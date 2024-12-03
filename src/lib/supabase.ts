import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wgbgmbizcbvuffjlcahz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYmdtYml6Y2J2dWZmamxjYWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5MTk0NzQsImV4cCI6MjA0NzQ5NTQ3NH0.4AqHH8NEUDreLTWBJOKPVsCfRDxiC96kfBNp3U49Pfg';

export const supabase = createClient(supabaseUrl, supabaseKey);