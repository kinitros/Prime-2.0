import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pksvfeetsgkomyjknmxw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrc3ZmZWV0c2drb215amtubXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDczODUsImV4cCI6MjA3OTcyMzM4NX0.bBo5QcAPiq0czRAPV9oc5Hn_PdD8lzcsxjovofiPZ24';

export const supabase = createClient(supabaseUrl, supabaseKey);
