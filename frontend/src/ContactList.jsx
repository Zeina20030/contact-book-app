const AVATAR_PALETTE = [
  { bg: "#f3e4e8", ink: "#7a2942" }, // wine
  { bg: "#f6ecd9", ink: "#8a6323" }, // brass
  { bg: "#e6e6f2", ink: "#4b4b8a" }, // slate-violet
  { bg: "#e3eee7", ink: "#2f6f4f" }, // sage
  { bg: "#f0e6f5", ink: "#6b3f8a" }, // plum
  { bg: "#e8eef4", ink: "#2f5a8a" }, // dusty blue
];

function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColors(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20h4L18.5 9.5a2.121 2.121 0 0 0-3-3L5 17v3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 7h14M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-8 0 1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ContactCard({ contact, onEdit, onDelete }) {
  const { bg, ink } = getAvatarColors(contact.name);

  return (
    <li className="contact-card">
      <div className="contact-card-top">
        <div className="avatar" style={{ background: bg, color: ink }}>
          {getInitials(contact.name)}
        </div>
        <div className="contact-heading">
          <h3>{contact.name}</h3>
          {contact.company && <p className="contact-company">{contact.company}</p>}
        </div>
        <div className="contact-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => onEdit(contact)}
            aria-label={`Edit ${contact.name}`}
            title="Edit"
          >
            <EditIcon />
          </button>
          <button
            type="button"
            className="icon-btn danger"
            onClick={() => onDelete(contact)}
            aria-label={`Delete ${contact.name}`}
            title="Delete"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {(contact.email || contact.phone) && (
        <div className="contact-meta">
          {contact.email && <span className="contact-meta-row">{contact.email}</span>}
          {contact.phone && <span className="contact-meta-row">{contact.phone}</span>}
        </div>
      )}

      {contact.notes && <p className="contact-notes">{contact.notes}</p>}
    </li>
  );
}

export default function ContactList({ contacts, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <ul className="contact-list" aria-busy="true">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="contact-card skeleton" aria-hidden="true">
            <div className="contact-card-top">
              <div className="avatar skeleton-block" />
              <div className="contact-heading">
                <div className="skeleton-line" style={{ width: "60%" }} />
                <div className="skeleton-line" style={{ width: "40%" }} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p>No contacts found.</p>
      </div>
    );
  }

  return (
    <ul className="contact-list">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
}
