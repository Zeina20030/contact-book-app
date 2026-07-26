import { useEffect, useState } from "react";
import { contactsApi } from "./api";
import ContactForm from "./ContactForm";
import ContactList from "./ContactList";
import "./App.css";

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [editingContact, setEditingContact] = useState(null);

  async function loadContacts(query = search) {
    setLoading(true);
    setError("");
    try {
      const data = await contactsApi.list(query);
      setContacts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContacts("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    loadContacts(search);
  }

  async function handleSave(form) {
    if (editingContact) {
      await contactsApi.update(editingContact.id, form);
    } else {
      await contactsApi.create(form);
    }
    setEditingContact(null);
    await loadContacts();
  }

  async function handleDelete(contact) {
    if (!window.confirm(`Delete ${contact.name}?`)) return;
    try {
      await contactsApi.remove(contact.id);
      if (editingContact?.id === contact.id) setEditingContact(null);
      await loadContacts();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <header>
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="3" width="16" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
              <path d="M9 3v18" stroke="currentColor" strokeWidth="1.6" />
              <path d="M13 9h4M13 13h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1>Contact Book</h1>
            <p className="brand-subtitle">
              {loading ? "Loading your contacts…" : `${contacts.length} contact${contacts.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>
      </header>

      <main>
        <section className="sidebar">
          <ContactForm
            editingContact={editingContact}
            onSave={handleSave}
            onCancel={() => setEditingContact(null)}
          />
        </section>

        <section className="content">
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <span className="search-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          {error && <p className="form-error">{error}</p>}

          <ContactList
            contacts={contacts}
            loading={loading}
            onEdit={setEditingContact}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
}
