// frontend/src/pages/index.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useStore } from '../store/useStore';
import VideoCall from '../components/VideoCall';

const Home: React.FC = () => {
  const { setToken, token } = useStore();
  const [identity, setIdentity] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted && identity) {
      axios.post('http://127.0.0.1:8000/token', { identity })
        .then((response) => {
          setToken(response.data.token);
          setSubmitted(false);
        })
        .catch((error) => {
          console.error("Error fetching the token:", error);
          setSubmitted(false);
        });
    }
  }, [submitted, identity, setToken]);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-4xl mb-4">Video Chat App</h1>
      {!token ? (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            className="p-2 mb-4"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
          />
          <button onClick={handleSubmit} className="p-2 bg-blue-500 rounded">
            Join Call
          </button>
        </div>
      ) : (
        <VideoCall />
      )}
    </div>
  );
};

export default Home;
