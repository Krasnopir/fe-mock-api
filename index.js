import express from "express";
import { faker } from "@faker-js/faker";

const app = express();
const PORT = process.env.PORT || 3000;

const AUTH_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImQ2M2QyYjNmOTE0NjdlZDE4MTBlYmZlZjBlZmJhMjFjIn0.eyJpZCI6ImQ5MjI0MGUzLTc4OWItNGM4NS05OWVkLTY4N2Q2NWRmN2RmZCJ9.2AWJAapQ3jheVjyNIFQvTHg9QytCgzzY4JkcirzmDAMMsEKmXcnyE2nSVYySez3Qxh3bahoJLKKM_zT3WJummg";

// 🔹 Константный uuid
const CLIENT_UUID = "11111111-2222-3333-4444-555555555555";

// 🔹 Middleware для авторизации
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${AUTH_TOKEN}`) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
  next();
});

const sleep = (timeout) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });

// 🔹 Эндпоинт self
app.get("/api/self", async (req, res) => {
  await sleep(200);

  res.json({
    id: CLIENT_UUID,
    firstName: "John",
    lastName: "Doe",
  });
});

// 🔹 Генерация моковых заказов
const orders = Array.from({ length: 120 }).map((_, i) => ({
  id: i + 1,
  createdAt: faker.date
    .between({ from: "2020-01-01T00:00:00.000Z", to: "2025-01-01T00:00:00.000Z" })
    .toISOString(),
  total: faker.commerce.price({ min: 10, max: 1000 }),
  customer: faker.person.fullName(),
  product: faker.commerce.productName()
}));

// Сортируем от новых к старым
orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

// 🔹 Эндпоинт заказов
app.get("/api/orders", async (req, res) => {
  await sleep(300);

  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  const paginated = orders.slice(offset, offset + limit);

  res.json({
    total: orders.length,
    limit,
    offset,
    data: paginated
  });
});

// 🔹 Запуск
app.listen(PORT, () => {
  console.log(`Mock API running on port ${PORT}`);
});

export default app; // для Vercel
