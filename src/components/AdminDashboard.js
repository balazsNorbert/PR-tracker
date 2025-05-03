import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [ideas, setIdeas] = useState([]);
  const [replies, setReplies] = useState({});
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await axios.get(`${apiURL}/idea/all`);
        setIdeas(res.data);
      } catch (err) {
        console.error("Error fetching feedback:", err);
      }
    };
    fetchIdeas();
  },[apiURL]);


  const handleReplySubmit = async (e, ideaId) => {
    e.preventDefault();
    const reply = replies[ideaId];

    try {
      await axios.post(`${apiURL}/idea/reply/${ideaId}`, { reply });
      setIdeas((prev) =>
        prev.map((idea) =>
          idea._id === ideaId ? { ...idea, reply } : idea
        )
      );
      setReplies((prev) => ({ ...prev, [ideaId]: "" }));
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  if (!user?.isAdmin) {
    return <div className="text-red-500 p-4">Access Denied</div>
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="flex flex-col gap-5 items-center w-full mx-5">
        <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 my-10">Admin Feedback Dashboard</h2>
        <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 shadow border border-gray-700 text-center">
          <p className="text-sm text-gray-400">Total Feedback</p>
          <p className="text-2xl font-bold text-white">{ideas.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 shadow border border-gray-700 text-center">
          <p className="text-sm text-gray-400">Unanswered</p>
          <p className="text-2xl font-bold text-yellow-400">
            {ideas.filter((i) => !i.reply).length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 shadow border border-gray-700 text-center">
          <p className="text-sm text-gray-400">Answered</p>
          <p className="text-2xl font-bold text-green-400">
            {ideas.filter((i) => i.reply).length}
          </p>
        </div>
      </div>
        {ideas.length === 0 ? (
          <p className="text-gray-400">No feedback found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {ideas.map((item) => (
              <div key={item._id} className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
                <div className="mb-2">
                  <span className="text-sm text-gray-400">Date:</span>
                  <p className="text-sm">{new Date(item.createdAt).toLocaleString()}</p>
                </div>

                <div className="mb-2">
                  <span className="text-sm text-gray-400">Idea:</span>
                  <p className="text-base font-medium text-teal-300">{item.idea}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-400">Reply:</span>
                  <p className={item.reply ? "text-green-400" : "text-yellow-400"}>
                    {item.reply || "No reply yet."}
                  </p>
                </div>
                {!item.reply && (
                <form onSubmit={(e) => handleReplySubmit(e, item._id)} className="mt-2">
                  <textarea
                    rows="2"
                    placeholder="Write a reply..."
                    value={replies[item._id] || ""}
                    onChange={(e) =>
                      setReplies((prev) => ({ ...prev, [item._id]: e.target.value }))
                    }
                    className="w-full p-2 rounded bg-gray-700 text-white"
                  />
                  <button
                    type="submit"
                    className="mt-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded font-semibold"
                  >
                    Send Reply
                  </button>
                </form>
              )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard;
