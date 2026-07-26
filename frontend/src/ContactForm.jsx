import { useEffect, useState } from "react";

const emptyContact = { name: "", email: "", phone: "", company: "", notes: "" };

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function fieldError(field, value) {
  if (field === "name" && !value.trim()) return "Name is required.";
  if (field === "email" && value.trim() && !isValidEmail(value.trim())) {
    return "Enter a valid email address.";
  }
  return "";
}

const FIELDS = [
  { name: "name", label: "Name", required: true, placeholder: "Jane Doe", icon: "user" },
  { name: "email", label: "Email", type: "email", placeholder: "jane@example.com", icon: "mail" },
  { name: "phone", label: "Phone", placeholder: "+1 555 123 4567", icon: "phone" },
  { name: "company", label: "Company", placeholder: "Acme Inc.", icon: "briefcase" },
];

function FieldIcon({ kind }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true,
  };
  switch (kind) {
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
          <path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path
            d="M6.5 4.5h2.7l1.3 3.6-1.8 1.6a11.5 11.5 0 0 0 5.6 5.6l1.6-1.8 3.6 1.3v2.7c0 1-.8 1.8-1.8 1.7-6.6-.5-11.9-5.8-12.4-12.4-.1-1 .7-1.8 1.7-1.8Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...common}>
          <rect x="3.5" y="8" width="17" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8.5 8V6.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V8" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3.5 13h17" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ContactForm({ editingContact, onSave, onCancel }) {
  const [form, setForm] = useState(emptyContact);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(editingContact ? { ...emptyContact, ...editingContact } : emptyContact);
    setTouched({});
    setError("");
  }, [editingContact]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true });
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onSave(form);
      setForm(emptyContact);
      setTouched({});
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <h2>{editingContact ? "Edit contact" : "Add contact"}</h2>
      <p className="form-subtitle">
        {editingContact ? "Update the details below." : "Fill in what you know — only name is required."}
      </p>

      {FIELDS.map((field) => {
        const value = form[field.name];
        const showError = touched[field.name] && fieldError(field.name, value);
        return (
          <div className="field" key={field.name}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required-mark">*</span>}
            </label>
            <div className={`input-shell ${showError ? "has-error" : ""}`}>
              <span className="input-icon">
                <FieldIcon kind={field.icon} />
              </span>
              <input
                id={field.name}
                name={field.name}
                type={field.type || "text"}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={field.placeholder}
                autoFocus={field.name === "name"}
                aria-invalid={Boolean(showError)}
                aria-describedby={showError ? `${field.name}-error` : undefined}
              />
            </div>
            {showError && (
              <p className="field-error" id={`${field.name}-error`}>
                {fieldError(field.name, value)}
              </p>
            )}
          </div>
        );
      })}

      <div className="field">
        <label htmlFor="notes">Notes</label>
        <div className="input-shell textarea-shell">
          <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} rows={3} />
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : editingContact ? "Save changes" : "Add contact"}
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
