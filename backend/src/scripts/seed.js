import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Source from '../models/Source.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const sampleSources = [
    {
        type: 'Note',
        title: 'Mastering the Second Brain Methodology',
        content: 'Building a Second Brain (BASB) is a method for saving and systematically reminding us of the ideas, inspirations, insights, and connections we have gained through our experience. It relies on four pillars: Capture, Organize, Distill, and Express (CODE).',
        summary: 'A summary of the CODE framework for personal knowledge management.',
        tags: ['pkm', 'productivity', 'learning'],
    },
    {
        type: 'Link',
        title: 'NotebookLM Features Overview',
        url: 'https://blog.google/technology/ai/google-notebooklm-features/',
        content: 'An official blog post detailing how NotebookLM uses Gemini to help users ground AI in their own documents.',
        summary: 'Google Blog post about NotebookLM and Gemini integration.',
        tags: ['ai', 'google', 'tech'],
    },
    {
        type: 'Insight',
        title: 'The Power of Atomic Notes',
        content: 'Atomic notes are single-topic notes that are easier to link and navigate. Heavily inspired by the Zettelkasten method, they allow for emergent ideas to form through selective linking.',
        summary: 'Insight on how atomic notes improve knowledge retrieval.',
        tags: ['zettelkasten', 'writing', 'learning'],
    },
    {
        type: 'Note',
        title: 'JavaScript Performance Optimization',
        content: 'Key techniques include debouncing and throttling for UI events, using Web Workers for heavy background tasks, and minimizing DOM manipulations through virtual DOM or efficient reconciliation.',
        summary: 'Technical guide on optimizing JS applications.',
        tags: ['javascript', 'tech', 'performance'],
    }
];

const seedDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/second-brain-ai');
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        await Source.deleteMany();
        console.log('Old samples cleared.');

        await Source.insertMany(sampleSources);
        console.log('4 sample knowledge items seeded successfully!');

        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedDB();
