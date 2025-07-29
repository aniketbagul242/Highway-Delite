import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { token, setToken } = useContext(StoreContext);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/signin');
    } else {
      fetchNotes();
    }
  }, [token]);

  // getting created notes from backend
  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/notes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data.notes);
    } catch (err) {
      console.error('Failed to fetch notes', err);
    }
  };

  // handling created notes
  const handleCreateNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;
    try {
      const res = await axios.post(
        'http://localhost:3000/api/notes',
        { title: noteTitle, content: noteContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes([...notes, res.data.note]);
      setNoteTitle('');
      setNoteContent('');
      setMessage('Note created!');
    } catch (err) {
      console.error('Failed to create note', err);
    }
  };


  //handling delete notes
  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.error('Failed to delete note', err);
    }
  };


  //for loguout
  const handleSignout = () => {
    setToken(null);
    localStorage.removeItem("user");
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <div className="flex items-center space-x-3">
            <img src="/search.png" alt="Search Icon" className="w-6 h-6" />
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <button
            onClick={handleSignout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>

        {/* User Info */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Welcome, {storedUser?.name}</h2>
          <p className="text-gray-600">Email: {storedUser?.email}</p>
        </div>

        {/* Note Creation */}
        <div className="mb-6 space-y-3">
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Note title"
            className="w-full px-4 py-2 border rounded-md"
          />
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Note content"
            rows="3"
            className="w-full px-4 py-2 border rounded-md"
          />
          <button
            onClick={handleCreateNote}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Add Note
          </button>
          {message && <p className="text-green-600">{message}</p>}
        </div>

        {/* Notes List */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Your Notes</h3>
          {notes.length === 0 ? (
            <p className="text-gray-500">No notes found.</p>
          ) : (
            <ul className="space-y-2">
              {notes.map((note) => (
                <li
                  key={note._id}
                  className="flex justify-between items-start bg-gray-50 p-3 rounded-md"
                >
                  <div>
                    <p className="font-semibold">{note.title}</p>
                    <p className="text-sm text-gray-700">{note.content}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="text-red-600 hover:underline text-sm ml-4"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
