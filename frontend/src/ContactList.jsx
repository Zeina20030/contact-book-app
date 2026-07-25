export default function ContactList({ contacts, loading, onEdit, onDelete }) {
  if (loading) return <p className="empty-state">Loading contacts...</p>;
  if (contacts.length === 0) return <p className="empty-state">No contacts found.</p>;

  return (
    <ul className="contact-list">
      {contacts.map((contact) => (
        <li key={contact.id} className="contact-card">
          <div className="contact-info">
            <h3>{contact.name}</h3>
            {contact.company && <p className="contact-company">{contact.company}</p>}
            {contact.email && <p>{contact.email}</p>}
            {contact.phone && <p>{contact.phone}</p>}
            {contact.notes && <p className="contact-notes">{contact.notes}</p>}
          </div>
          <div className="contact-actions">
            <button onClick={() => onEdit(contact)}>Edit</button>
            <button className="danger" onClick={() => onDelete(contact)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
