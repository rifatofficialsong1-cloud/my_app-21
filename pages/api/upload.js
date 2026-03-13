import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const uploadDir = path.join(process.cwd(), 'public/uploads');
  const dataDir = path.join(process.cwd(), 'public/data');
  
  // ডিরেক্টরি তৈরি
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const form = new IncomingForm({
    uploadDir: uploadDir,
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const title = fields.title[0];
    const videoFile = files.video[0];
    const thumbFile = files.thumbnail[0];

    // JSON ডাটা আপডেট
    const videoData = {
      id: Date.now().toString(),
      title: title,
      videoUrl: `/uploads/${path.basename(videoFile.filepath)}`,
      thumbnailUrl: `/uploads/${path.basename(thumbFile.filepath)}`,
      timestamp: new Date().toISOString(),
      comments: []
    };

    const jsonPath = path.join(dataDir, 'videos.json');
    let existingData = { videos: [] };
    
    if (fs.existsSync(jsonPath)) {
      existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    }
    
    existingData.videos.unshift(videoData);
    fs.writeFileSync(jsonPath, JSON.stringify(existingData, null, 2));

    res.status(200).json({ success: true, video: videoData });
  });
}
