const BASE_URL = "/api/contacts";

async function handleResponse(res) {
  if (res.status === 204) return null;

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message = body?.errors?.join(" ") || body?.error || "Request failed.";
    throw new Error(message);
  }

  return body;
}

export const contactsApi = {
  list(query = "") {
    const url = query ? `${BASE_URL}?q=${encodeURIComponent(query)}` : BASE_URL;
    return fetch(url).then(handleResponse);
  },
  create(contact) {
    return fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    }).then(handleResponse);
  },
  update(id, contact) {
    return fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    }).then(handleResponse);
  },
  remove(id) {
    return fetch(`${BASE_URL}/${id}`, { method: "DELETE" }).then(handleResponse);
  },
};
