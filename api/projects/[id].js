const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  const { id } = req.query

  if (req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'PUT') {
    const { data, error } = await supabase
      .from('projects')
      .update(req.body)
      .eq('id', id)
      .select()
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data[0])
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ success: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}