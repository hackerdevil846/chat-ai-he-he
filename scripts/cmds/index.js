const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Innertube } = require('youtubei.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize YouTube client
let youtube;

async function initYouTube() {
  try {
    youtube = await Innertube.create();
    console.log('YouTube client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize YouTube client:', error);
  }
}

// Initialize on startup
initYouTube();

// Shairi video configuration
const SHAIRI_CONFIG = {
  name: "shairi",
  version: "3.0.0",
  description: "Send a shairi video stream using youtubei.js",
  videoURL: "https://youtu.be/v7v3TTWaaWU",
  cooldowns: 10
};

// Language messages
const messages = {
  downloading: "📥 Downloading shairi video... Please wait!",
  errorNoFormat: "❌ No suitable video format found",
  errorDownload: "❌ Video download failed",
  sendingVideo: "🎬《 SHAIRI VIDEO 》\nEnjoy the video!",
  errorCatch: "❌ Error: {error}\n\nPlease try again later!",
  success: "✅ Video processed successfully!"
};

// Helper function to get video info and download URL
async function getVideoDownloadInfo(videoId) {
  try {
    if (!youtube) {
      await initYouTube();
    }

    const info = await youtube.getInfo(videoId);
    
    // Get the best quality format
    const formats = info.streaming_data?.formats || [];
    const adaptiveFormats = info.streaming_data?.adaptive_formats || [];
    
    // Combine all formats and find the best video format
    const allFormats = [...formats, ...adaptiveFormats];
    
    // Filter for video formats with audio (mp4 preferred)
    const videoFormats = allFormats.filter(format => 
      format.mime_type?.includes('video/mp4') && 
      format.has_audio !== false
    );
    
    if (videoFormats.length === 0) {
      throw new Error('No suitable video format found');
    }
    
    // Sort by quality (higher quality first)
    videoFormats.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
    
    const selectedFormat = videoFormats[0];
    
    return {
      title: info.basic_info.title,
      duration: info.basic_info.duration?.seconds_total,
      downloadUrl: selectedFormat.decipher(youtube.session.player),
      format: selectedFormat,
      thumbnail: info.basic_info.thumbnail?.[0]?.url
    };
  } catch (error) {
    console.error('Error getting video info:', error);
    throw error;
  }
}

// Extract video ID from YouTube URL
function extractVideoId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Route to get video information
app.get('/api/video-info/:videoId', async (req, res) => {
  try {
    const videoId = req.params.videoId;
    
    if (!videoId) {
      return res.status(400).json({ 
        error: 'Video ID is required',
        message: messages.errorCatch.replace('{error}', 'Video ID is required')
      });
    }

    const videoInfo = await getVideoDownloadInfo(videoId);
    
    res.json({
      success: true,
      data: {
        title: videoInfo.title,
        duration: videoInfo.duration,
        thumbnail: videoInfo.thumbnail,
        downloadUrl: videoInfo.downloadUrl,
        message: messages.sendingVideo
      }
    });
  } catch (error) {
    console.error('Video info error:', error);
    res.status(500).json({ 
      error: error.message,
      message: messages.errorCatch.replace('{error}', error.message)
    });
  }
});

// Route to get default shairi video information
app.get('/api/video-info', async (req, res) => {
  try {
    const videoId = extractVideoId(SHAIRI_CONFIG.videoURL);
    
    if (!videoId) {
      return res.status(400).json({ 
        error: 'Invalid default video URL',
        message: messages.errorCatch.replace('{error}', 'Invalid default video URL')
      });
    }

    const videoInfo = await getVideoDownloadInfo(videoId);
    
    res.json({
      success: true,
      data: {
        title: videoInfo.title,
        duration: videoInfo.duration,
        thumbnail: videoInfo.thumbnail,
        downloadUrl: videoInfo.downloadUrl,
        message: messages.sendingVideo
      }
    });
  } catch (error) {
    console.error('Video info error:', error);
    res.status(500).json({ 
      error: error.message,
      message: messages.errorCatch.replace('{error}', error.message)
    });
  }
});

// Route to download and stream video
app.get('/api/download/:videoId', async (req, res) => {
  try {
    const videoId = req.params.videoId;
    
    if (!videoId) {
      return res.status(400).json({ 
        error: 'Video ID is required',
        message: messages.errorCatch.replace('{error}', 'Video ID is required')
      });
    }

    console.log(`Starting download for video ID: ${videoId}`);
    
    const videoInfo = await getVideoDownloadInfo(videoId);
    
    // Set response headers for video streaming
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${videoInfo.title || 'video'}.mp4"`);
    
    // Stream the video directly to the response
    const https = require('https');
    const http = require('http');
    
    const protocol = videoInfo.downloadUrl.startsWith('https:') ? https : http;
    
    const request = protocol.get(videoInfo.downloadUrl, (videoResponse) => {
      if (videoResponse.statusCode !== 200) {
        return res.status(500).json({ 
          error: 'Failed to fetch video',
          message: messages.errorDownload
        });
      }
      
      // Set content length if available
      if (videoResponse.headers['content-length']) {
        res.setHeader('Content-Length', videoResponse.headers['content-length']);
      }
      
      // Pipe the video stream to the response
      videoResponse.pipe(res);
      
      videoResponse.on('error', (error) => {
        console.error('Video stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ 
            error: error.message,
            message: messages.errorDownload
          });
        }
      });
    });
    
    request.on('error', (error) => {
      console.error('Request error:', error);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: error.message,
          message: messages.errorDownload
        });
      }
    });
    
  } catch (error) {
    console.error('Download error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: error.message,
        message: messages.errorCatch.replace('{error}', error.message)
      });
    }
  }
});

// Route to download default shairi video
app.get('/api/download', async (req, res) => {
  try {
    const videoId = extractVideoId(SHAIRI_CONFIG.videoURL);
    
    if (!videoId) {
      return res.status(400).json({ 
        error: 'Invalid default video URL',
        message: messages.errorCatch.replace('{error}', 'Invalid default video URL')
      });
    }

    console.log(`Starting download for default shairi video ID: ${videoId}`);
    
    const videoInfo = await getVideoDownloadInfo(videoId);
    
    // Set response headers for video streaming
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="shairi-video.mp4"`);
    
    // Stream the video directly to the response
    const https = require('https');
    const http = require('http');
    
    const protocol = videoInfo.downloadUrl.startsWith('https:') ? https : http;
    
    const request = protocol.get(videoInfo.downloadUrl, (videoResponse) => {
      if (videoResponse.statusCode !== 200) {
        return res.status(500).json({ 
          error: 'Failed to fetch video',
          message: messages.errorDownload
        });
      }
      
      // Set content length if available
      if (videoResponse.headers['content-length']) {
        res.setHeader('Content-Length', videoResponse.headers['content-length']);
      }
      
      // Pipe the video stream to the response
      videoResponse.pipe(res);
      
      videoResponse.on('error', (error) => {
        console.error('Video stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ 
            error: error.message,
            message: messages.errorDownload
          });
        }
      });
    });
    
    request.on('error', (error) => {
      console.error('Request error:', error);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: error.message,
          message: messages.errorDownload
        });
      }
    });
    
  } catch (error) {
    console.error('Download error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: error.message,
        message: messages.errorCatch.replace('{error}', error.message)
      });
    }
  }
});

// Route for the original shairi command functionality
app.post('/api/shairi', async (req, res) => {
  try {
    const videoId = extractVideoId(SHAIRI_CONFIG.videoURL);
    
    if (!videoId) {
      return res.status(400).json({ 
        error: 'Invalid shairi video URL',
        message: messages.errorCatch.replace('{error}', 'Invalid shairi video URL')
      });
    }

    // Send initial downloading message
    const response = {
      status: 'downloading',
      message: messages.downloading,
      videoId: videoId
    };

    // Get video info for the response
    try {
      const videoInfo = await getVideoDownloadInfo(videoId);
      response.videoInfo = {
        title: videoInfo.title,
        duration: videoInfo.duration,
        thumbnail: videoInfo.thumbnail
      };
      response.downloadUrl = `/api/download/${videoId}`;
      response.status = 'ready';
      response.message = messages.sendingVideo;
    } catch (error) {
      response.status = 'error';
      response.message = messages.errorCatch.replace('{error}', error.message);
    }

    res.json(response);
  } catch (error) {
    console.error('Shairi command error:', error);
    res.status(500).json({ 
      error: error.message,
      message: messages.errorCatch.replace('{error}', error.message)
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    config: SHAIRI_CONFIG,
    youtube_ready: !!youtube
  });
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.json({
    name: SHAIRI_CONFIG.name,
    version: SHAIRI_CONFIG.version,
    description: SHAIRI_CONFIG.description,
    endpoints: {
      '/api/health': 'GET - Health check',
      '/api/shairi': 'POST - Get shairi video info and download URL',
      '/api/video-info/:videoId': 'GET - Get video information for any YouTube video',
      '/api/download/:videoId': 'GET - Download/stream any YouTube video',
      '/api/download': 'GET - Download/stream the default shairi video'
    },
    usage: {
      shairi: 'POST /api/shairi',
      custom_video: 'GET /api/download/VIDEO_ID or GET /api/video-info/VIDEO_ID'
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: messages.errorCatch.replace('{error}', 'Internal server error')
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Shairi Video API server running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  GET  / - API documentation');
  console.log('  GET  /api/health - Health check');
  console.log('  POST /api/shairi - Get shairi video');
  console.log('  GET  /api/download/:videoId - Download video');
  console.log('  GET  /api/video-info/:videoId - Get video info');
});

module.exports = app;

