import Source from '../models/Source.js';
import { queryKnowledge } from '../services/aiService.js';

export const queryPublicBrain = async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Query parameter "q" is required.' });
    }

    try {
        const sources = await Source.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { content: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } }
            ]
        }).limit(5);

        if (sources.length === 0) {
            return res.json({
                answer: "I couldn't find any specific notes in your Second Brain that match that query. Try rephrasing or adding more details!",
                sources: []
            });
        }

        const answer = await queryKnowledge(q, sources);

        res.json({
            answer,
            sources: sources.map(s => ({
                id: s._id,
                title: s.title,
                type: s.type
            }))
        });
    } catch (error) {
        console.error('Public Query Error:', error);
        res.status(500).json({ error: 'An error occurred while querying your brain.' });
    }
};
