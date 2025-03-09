import { useState } from "react";

interface Message {
  user: string;
  bot: string;
}

export default function SpiriterChat() {
  const [query, setQuery] = useState<string>("");
  const [response, setResponse] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleAsk() {
    if (!query.trim()) return;
    setLoading(true);

    const res = await fetch(`/api/chatbot?query=${query}`);
    const data = await res.json();

    setResponse([...response, { user: query, bot: data.message }]);
    setQuery("");
    setLoading(false);
  }

  return (
    <div style={styles.chatContainer}>
      <h1>💬 Spiriter Chatbot</h1>
      <div style={styles.chatBox}>
        {response.map((msg, index) => (
          <div key={index}>
            <p style={styles.userMessage}>👤 {msg.user}</p>
            <p style={styles.botMessage}>🤖 {msg.bot}</p>
          </div>
        ))}
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Ask about a player or team..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleAsk} style={styles.button} disabled={loading}>
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "90vh",
    backgroundColor: "#f4f4f4",
    padding: "20px",
  },
  chatBox: {
    width: "80%",
    maxHeight: "400px",
    overflowY: "auto",
    padding: "10px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  userMessage: {
    background: "#d1e7dd",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "5px",
  },
  botMessage: {
    background: "#f8d7da",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "5px",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
  },
  input: {
    width: "300px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
