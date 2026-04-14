import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import OpenAI from 'openai'

dotenv.config()

const app = express()
const port = process.env.PORT || 8787

app.use(cors())
app.use(express.json())

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

const baseMetrics = {
  cpu: 56,
  memory: 62,
  network: 240,
  containers: 14,
  status: 'Healthy',
}

function randomizeMetric(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2))
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'devops-portfolio-api' })
})

app.get('/api/metrics', (_req, res) => {
  const metrics = {
    cpu: randomizeMetric(35, 88),
    memory: randomizeMetric(40, 92),
    network: randomizeMetric(120, 580),
    containers: Math.floor(randomizeMetric(10, 24)),
    status: Math.random() > 0.15 ? 'Healthy' : 'Degraded',
    timestamp: Date.now(),
  }
  res.json({ ...baseMetrics, ...metrics })
})

app.post('/api/chat', async (req, res) => {
  const message = req.body?.message
  if (!message) {
    return res.status(400).json({ error: 'Message is required' })
  }

  if (!openai) {
    return res.json({
      reply:
        'OpenAI API key is not configured yet. Add OPENAI_API_KEY in backend environment to enable real AI responses.',
    })
  }

  try {
    const completion = await openai.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      input: [
        {
          role: 'system',
          content:
            "You are a DevOps assistant explaining Sudarshan Mane's portfolio, skills, and projects.",
        },
        {
          role: 'user',
          content: message,
        },
      ],
    })

    const reply = completion.output_text || 'I can help with DevOps portfolio questions.'
    res.json({ reply })
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate AI response', details: error.message })
  }
})

app.listen(port, () => {
  console.log(`DevOps portfolio API running on port ${port}`)
})
