const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const app = express()
const PORT = 3000

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

// GET all projects
app.get('/api/projects', async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST new project (admin only)
app.post('/api/projects', async (req, res) => {
  if (req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const { data, error } = await supabase
    .from('projects')
    .insert([req.body])
    .select()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data[0])
})

// PUT edit project (admin only)
app.put('/api/projects/:id', async (req, res) => {
  if (req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const { data, error } = await supabase
    .from('projects')
    .update(req.body)
    .eq('id', req.params.id)
    .select()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

// DELETE project (admin only)
app.delete('/api/projects/:id', async (req, res) => {
  if (req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', req.params.id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ success: true })
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))