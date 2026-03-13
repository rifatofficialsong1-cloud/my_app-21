import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => setVideos(data));
  }, []);

  return (
    <div className="bg-black min-h-screen text-white">
      {/* হেডার */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black to-transparent p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-red-600">MyApp21</h1>
          <nav className="space-x-6">
            <a href="#" className="hover:text-red-500">হোম</a>
            <a href="#" className="hover:text-red-500">মুভিজ</a>
            <a href="#" className="hover:text-red-500">মোর</a>
          </nav>
        </div>
      </header>

      {/* হিরো সেকশন */}
      {videos.length > 0 && (
        <div className="relative h-[80vh] mb-12">
          <img 
            src={videos[0].thumbnailUrl} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-20 left-12 max-w-2xl">
            <h2 className="text-6xl font-bold mb-4">{videos[0].title}</h2>
            <p className="text-lg mb-6">হটেস্ট অ্যাডাল্ট ভিডিও এখনই দেখুন</p>
            <Link href={`/watch/${videos[0].id}`}>
              <button className="bg-red-600 text-white px-8 py-3 rounded-lg text-xl hover:bg-red-700">
                এখনই দেখুন
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* ভিডিও গ্রিড */}
      <div className="px-12">
        <h2 className="text-2xl font-bold mb-6">ট্রেন্ডিং ভিডিও</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {videos.map((video, i) => (
            <Link href={`/watch/${video.id}`} key={video.id}>
              <div className="relative group cursor-pointer transition transform hover:scale-110">
                <img 
                  src={video.thumbnailUrl} 
                  className="rounded-lg w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition rounded-lg flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100">▶️ প্লে</span>
                </div>
                <p className="mt-2 text-sm">{video.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
    }
