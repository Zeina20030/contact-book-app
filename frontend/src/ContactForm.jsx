import { useEffect, useState } from "react";

const emptyContact = { name: "", email: "", phone: "", company: "", notes: "" };

export default function ContactForm({ editingContact, onSave, onCancel }) {
  const [form, setForm] = useState(emptyContact);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(editingContact ? { ...emptyContact, ...editingContact } : emptyContact);
    setError("");
  }, [editingContact]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onSave(form);
      setForm(emptyContact);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>{editingContact ? "Edit contact" : "Add contact"}</h2>

      <label>
        Name *
        <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" autoFocus />
      </label>

      <label>
        Email
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" />
      </label>

      <label>
        Phone
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555 123 4567" />
      </label>

      <label>
        Company
        <input name="company" value={form.company} onChange={handleChange} placeholder="Acme Inc." />
      </label>

      <label>
        Notes
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : editingContact ? "Save changes" : "Add contact"}
        </button>
        {editingContact && (
          <button type="button" className="secondary" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
