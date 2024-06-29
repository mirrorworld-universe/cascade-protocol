import { Hono } from "hono";
import { handle } from "hono/aws-lambda";

const app = new Hono();
app.get("/", (c) => c.text("Hello Hono!"));

app.get("/hello/:name", (c) => {
  const { name } = c.req.param();
  return c.json({ message: `Hello, ${name}!` });
});

export const handler = handle(app);
