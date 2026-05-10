import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { tasks } from '../db/schema'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())

const routes = app
  .get('/api/health', (c) => c.json({ status: 'ok' }))
  .get('/api/tasks', async (c) => {
    const db = drizzle(c.env.DB)
    const rows = await db.select().from(tasks).all()
    return c.json(rows)
  })
  .post('/api/tasks', async (c) => {
    const { title } = await c.req.json<{ title: string }>()
    const db = drizzle(c.env.DB)
    const [row] = await db.insert(tasks).values({ title }).returning()
    return c.json(row, 201)
  })
  .patch('/api/tasks/:id', async (c) => {
    const id = Number(c.req.param('id'))
    const { completed } = await c.req.json<{ completed: boolean }>()
    const db = drizzle(c.env.DB)
    const [row] = await db
      .update(tasks)
      .set({ completed })
      .where(eq(tasks.id, id))
      .returning()
    return c.json(row)
  })
  .delete('/api/tasks/:id', async (c) => {
    const id = Number(c.req.param('id'))
    const db = drizzle(c.env.DB)
    await db.delete(tasks).where(eq(tasks.id, id)).run()
    return c.json({ id })
  })

export type AppType = typeof routes
export default app
