import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Watch() {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState(null);
  const [showAd, setShowAd] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`/api/video/${id}`)
        .then(res => res.json())
        .then(data => setVideo(data));
      
      fetch(`/api/comments/${id}`)
        .then(res => res.json())
        .then(data => setComments(data));
    }
  }, [id]);

  const postComment = async (e) => {
    e.preventDefault();
    await fetch(`/api/comments/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newComment })
    });
    setNewComment('');
    // রিলোড কমেন্ট
    fetch(`/api/comments/${id}`)
      .then(res => res.json())
      .then(data => setComments(data));
  };

  if (!video) return <div className="bg-black min-h-screen text-white p-8">লোড হচ্ছে...</div>;

  return (
    <div className="bg-black min-h-screen text-white">
      {/* ব্যাক বাটন */}
      <div className="p-6">
        <Link href="/" className="text-red-500 hover:text-red-400">
          ← হোমে ফিরে যান
        </Link>
      </div>

      {/* ভিডিও প্লেয়ার */}
      <div className="relative w-full bg-black" style={{ height: '70vh' }}>
        {showAd ? (
          <div className="relative h-full">
            <img 
              src="https://via.placeholder.com/1920x1080/ff0000/ffffff?text=Ad+Will+Play+Here" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
              <button 
                onClick={() => setShowAd(false)}
                className="bg-white text-black px-6 py-2 rounded"
              >
                স্কিপ অ্যাড (৫)
              </button>
            </div>
          </div>
        ) : (
          <video 
            src={video.videoUrl} 
            controls 
            autoPlay 
            className="w-full h-full"
          />
        )}
      </div>

      {/* ভিডিও ইনফো */}
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
        
        {/* কমেন্ট সেকশন */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">কমেন্ট ({comments.length})</h2>
          
          {/* কমেন্ট ফর্ম */}
          <form onSubmit={postComment} className="mb-6">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="কমেন্ট লিখুন..."
              className="w-full p-3 bg-gray-800 rounded text-white"
            />
            <button 
              type="submit"
              className="mt-2 px-6 py-2 bg-red-600 rounded hover:bg-red-700"
            >
              পোস্ট করুন
            </button>
          </form>

          {/* কমেন্ট লিস্ট */}
          <div className="space-y-4">
            {comments.map((comment, i) => (
              <div key={i} className="border-b border-gray-700 pb-2">
                <p className="font-semibold text-red-400">{comment.user}</p>
                <p>{comment.text}</p>
                <p className="text-sm text-gray-500">{comment.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
