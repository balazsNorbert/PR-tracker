import { useState, useEffect } from 'react';
import axios from 'axios';

const Note = ({workoutDate, onNoteSaved, existingNote}) => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [note, setNote] = useState(existingNote || "");
  const [showModal,setShowModal] = useState(false);

  useEffect(() => {
    setNote(existingNote || "");
  }, [existingNote]);

  const handleAddNote = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveNote = async () => {
    if(note.trim()) {
      try{
        const token = localStorage.getItem("token");
        const formattedDate = workoutDate.split("T")[0];
        await axios.put(`${apiURL}/workouts/${formattedDate}/note`, { note }, {
          headers: { Authorization: `Bearer ${token}` },
        })
        onNoteSaved(formattedDate, note);
      } catch (error) {
        console.log('Error saving note', error);
      }
    }
    setShowModal(false);
  }

  const handleDeleteNote = async () => {
    setNote("");
    try{
      const token = localStorage.getItem("token");
        const formattedDate = workoutDate.split("T")[0];
        await axios.delete(`${apiURL}/workouts/${formattedDate}/note`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        onNoteSaved(formattedDate, "");
      } catch (error) {
        console.log('Error saving note', error);
      }
  }


  return (
    <div>
      <button onClick={handleAddNote} className="absolute bottom-1 md:bottom-5 right-2">
        <span className={`material-icons text-xl md:text-2xl
          ${note.trim() ? "text-yellow-500 dark:text-yellow-400 dark:hover:text-yellow-300 hover:text-yellow-300"
          : "text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:text-blue-300"}`}>
        {note.trim() ? "sticky_note_2" : "note_add"}
        </span>
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10">
          <div className="flex flex-col gap-2 bg-white rounded-lg p-4">
            <h3 className="text-lg font-semibold text-black">Add Note</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note to your workout..."
              className="w-full h-32 p-2 border border-gray-300 text-black rounded-lg"
            />
            <div className="flex justify-between gap-3">
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-800">
                Cancel
              </button>
              <button onClick={handleDeleteNote} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                Delete
              </button>
              <button onClick={handleSaveNote} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Note;