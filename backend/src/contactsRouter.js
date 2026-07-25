import { Router } from "express";
import { db } from "./db.js";

export const contactsRouter = Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateContact(body, { partial = false } = {}) {
  const errors = [];
  const fields = ["name", "email", "phone", "company", "notes"];
  const data = {};

  for (const field of fields) {
    if (body[field] !== undefined) data[field] = String(body[field]).trim();
  }

  if (!partial || data.name !== undefined) {
    if (!data.name) errors.push("Name is required.");
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.push("Email is not valid.");
  }

  return { data, errors };
}

// GET /api/contacts?q=search
contactsRouter.get("/", (req, res) => {
  const q = (req.query.q ?? "").toString().trim();

  let rows;
  if (q) {
    const like = `%${q}%`;
    rows = db
      .prepare(
        `SELECT * FROM contacts
         WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ?
         ORDER BY name COLLATE NOCASE ASC`
      )
      .all(like, like, like, like);
  } else {
    rows = db.prepare(`SELECT * FROM contacts ORDER BY name COLLATE NOCASE ASC`).all();
  }

  res.json(rows);
});

// GET /api/contacts/:id
contactsRouter.get("/:id", (req, res) => {
  const row = db.prepare(`SELECT * FROM contacts WHERE id = ?`).get(req.params.id);
  if (!row) return res.status(404).json({ error: "Contact not found." });
  res.json(row);
});

// POST /api/contacts
contactsRouter.post("/", (req, res) => {
  const { data, errors } = validateContact(req.body ?? {});
  if (errors.length) return res.status(400).json({ errors });

  const stmt = db.prepare(`
    INSERT INTO contacts (name, email, phone, company, notes)
    VALUES (@name, @email, @phone, @company, @notes)
  `);
  const info = stmt.run({
    name: data.name,
    email: data.email ?? "",
    phone: data.phone ?? "",
    company: data.company ?? "",
    notes: data.notes ?? "",
  });

  const created = db.prepare(`SELECT * FROM contacts WHERE id = ?`).get(info.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /api/contacts/:id
contactsRouter.put("/:id", (req, res) => {
  const existing = db.prepare(`SELECT * FROM contacts WHERE id = ?`).get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Contact not found." });

  const { data, errors } = validateContact(req.body ?? {}, { partial: true });
  if (errors.length) return res.status(400).json({ errors });

  const merged = { ...existing, ...data };

  db.prepare(`
    UPDATE contacts
    SET name = @name, email = @email, phone = @phone, company = @company, notes = @notes,
        updated_at = datetime('now')
    WHERE id = @id
  `).run(merged);

  const updated = db.prepare(`SELECT * FROM contacts WHERE id = ?`).get(req.params.id);
  res.json(updated);
});

// DELETE /api/contacts/:id
contactsRouter.delete("/:id", (req, res) => {
  const info = db.prepare(`DELETE FROM contacts WHERE id = ?`).run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Contact not found." });
  res.status(204).end();
});
