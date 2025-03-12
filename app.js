    require('dotenv').config();
    const express = require('express');
    const cors = require('cors');
    const mongoose = require('mongoose');
    const {Schema} = mongoose
    const app = express();
    
    app.use(cors())
    app.use(express.json());  // Parses JSON payloads
    app.use(express.urlencoded({ extended: true }));

    // Connect to MongoDB
    const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
    };
    connectDB();

    const videoSchema = new Schema({ url: String });
    const Video = mongoose.model('Video', videoSchema);

    const getVideo = async () => {
        console.log('Getting video');
        const videos = await Video.find();
        console.log('Videos: ', JSON.stringify(videos));
        return videos;
    }

    const addVideo = async (url) => {
        console.log('Adding video:', url);
        const video = new Video({ url });
        console.log('Video added: ', JSON.stringify(video));
        return await video.save();
    }

    const deleteAllVideos = async () => {
        console.log('Deleting all videos');
        const result = await Video.deleteMany();
        console.log('Delete result: ', JSON.stringify(result));
        return result;
    }

    const deleteVideoByUrl = async (url) => {
        console.log('Deleting video by url:', url);
        const result = await Video.deleteOne({url});
        console.log('Delete result: ', JSON.stringify(result));
        return result;
    }

    app.get('/api/v1/get-video', async (req, res) => {
        res.json({data: await getVideo()});
    });

    app.post('/api/v1/add-video', async (req, res) => {
        const {url} = req.body;
        res.json({message: await addVideo(url)});
    });

    app.post('/api/v1/delete-videos', async (req, res) => {
        res.json({message: await deleteAllVideos()});
    });

    app.post('/api/v1/delete-video', async (req, res) => {  
        const {url} = req.body;
        res.json({message: await deleteVideoByUrl(url)});
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));