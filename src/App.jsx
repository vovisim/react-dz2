import { useEffect, useState } from 'react';

const STORAGE_KEY = 'notes';

const CATEGORIES = ['Учёба', 'Работа', 'Личное'];

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

export default function App() {
  const [notes, setNotes] = useState(loadNotes);
  const [text, setText] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  function addNote(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    const note = {
      id: Date.now(),
      text: value,
      category,
      date: new Date().toLocaleString('ru-RU'),
    };
    setNotes([note, ...notes]);
    setText('');
  }

  function deleteNote(id) {
    setNotes(notes.filter((note) => note.id !== id));
  }

  function clearNotes() {
    if (confirm('Удалить все заметки?')) {
      setNotes([]);
    }
  }

  const query = search.trim().toLowerCase();
  const filtered = notes.filter(
    (note) =>
      note.text.toLowerCase().includes(query) ||
      note.category.toLowerCase().includes(query),
  );

  return (
    <div className="app">
      <h1>Мои заметки</h1>

      <form className="form" onSubmit={addNote}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Текст заметки…"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button type="submit" className="btn-add">Добавить</button>
      </form>

      <input
        className="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск по заметкам…"
      />

      <div className="stats">
        <span>Всего заметок: <b>{notes.length}</b></span>
        <span>Найдено: <b>{filtered.length}</b></span>
        <button className="btn-clear" onClick={clearNotes} disabled={!notes.length}>
          Очистить все заметки
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="empty">{notes.length ? 'Ничего не найдено' : 'Заметок пока нет'}</p>
      ) : (
        <ul className="list">
          {filtered.map((note) => (
            <li key={note.id} className="card">
              <div className="card-top">
                <span className={`tag tag-${CATEGORIES.indexOf(note.category)}`}>
                  {note.category}
                </span>
                <button className="btn-delete" onClick={() => deleteNote(note.id)}>
                  ✕
                </button>
              </div>
              <p className="card-text">{note.text}</p>
              <span className="card-date">{note.date}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
