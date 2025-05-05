import { React, useState, useEffect } from 'react';
import axios from 'axios';

const Idea = ( {user} ) => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [idea, setIdea] = useState("");
  const [message, setMessage] = useState("");
  const [latestFeedback, setLatestFeedback] = useState(null);

  useEffect(() => {
    const fetchLatestFeedback = async () => {
      if(!user?.userId) return;
      try {
        const res = await axios.get(`${apiURL}/idea/latest`);
        console.log(res.data);
        setLatestFeedback(res.data);
      } catch (err) {
        console.log("No previous feedback or error:", err);
      }
    };
    fetchLatestFeedback();
  }, [user, apiURL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!idea){
      alert("Feedback is empty!");
      return;
    }

    try{
      await axios.post(`${apiURL}/idea/send-idea`, { idea, userId: user.userId });
      setMessage("We got your feedback! Thank you !😊");
      setIdea("");
    } catch (error) {
      console.log("Error sending the idea:", error);
      setMessage("Something went wrong. Please try again.");
    }
  }

  const handleDeleteFeedback = async (id) => {
    try {
      await axios.delete(`${apiURL}/idea/delete/${id}`);
      setLatestFeedback(null);
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 bg-teal-700 dark:bg-gray-700 w-full rounded-lg p-4">
      <h3 className="font-bold text-xl">Feedback</h3>
      {latestFeedback?.reply && (
        <div className="relative flex flex-col items-start w-full bg-teal-600 text-white rounded-lg p-3">
          <p className="font-semibold text-sm">Answer for you last feedback:</p>
          <p className="italic">{latestFeedback.reply}</p>
          <button
            className="absolute bottom-2 right-2"
            onClick={() => handleDeleteFeedback(latestFeedback._id)}
          >
            <span className="material-icons text-red-600 hover:text-red-700 transition duration-300 text-2xl">
              delete
            </span>
          </button>
        </div>
      )}
      <label className="text-sm md:text-base self-start mt-2">Give us an idea, if you have one!</label>
      <form onSubmit={handleSubmit} className="w-full">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Write your feedback here..."
          className="text-black dark:text-white w-full rounded-lg p-3 border dark:border-none shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 dark:bg-gray-900
        dark:focus:ring-teal-400 transition duration-300"
          rows="3"
        />
        <button type="submit" className="flex items-center gap-2 ml-auto w-fit bg-teal-800 dark:bg-gray-900 text-white
        font-bold py-2 px-4 rounded-lg transition mt-1">
          <span className="text-lg">Send</span>
          <span className="material-icons">send</span>
        </button>
      </form>
      {message && <p className="mt-2 text-sm font-semibold text-white">{message}</p>}
    </div>
  )
}

export default Idea;