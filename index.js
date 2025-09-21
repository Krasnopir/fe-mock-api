import express from "express";
import { faker } from "@faker-js/faker";

const app = express();
const PORT = process.env.PORT || 3000;

const AUTH_TOKEN = "SECRET_TOKEN";

// 🔹 Middleware для авторизации
app.use((req, res, next) => {
  if (req.path.startsWith("/me") || req.path.startsWith("/orders")) {
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${AUTH_TOKEN}`) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
  next();
});

// 🔹 Эндпоинт пользователя
app.get("/me", (req, res) => {
  res.json({
    id: 1,
    name: "Test User",
    email: "test@example.com",
    role: "candidate"
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
app.get("/orders", (req, res) => {
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
