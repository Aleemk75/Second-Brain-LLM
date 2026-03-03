import asyncHandler from 'express-async-handler';
import Source from '../models/Source.js';
import { generateSummary, generateTags, analyzeSource } from '../services/aiService.js';

export const getSources = asyncHandler(async (req, res) => {
    const { search, tag, type, sort } = req.query;
    let query = {};

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
        ];
    }

    if (tag) {
        query.tags = tag;
    }

    if (type && type !== 'All') {
        query.type = type;
    }

    let sortQuery = { createdAt: -1 };
    if (sort === 'Relevance') {
        sortQuery = { title: 1 };
    }

    const sources = await Source.find(query).sort(sortQuery);
    res.status(200).json(sources);
});

export const createSource = asyncHandler(async (req, res) => {
    const { type, title, content, url } = req.body;

    if (!type || !title) {
        res.status(400);
        throw new Error('Please add type and title');
    }

    const source = await Source.create({
        type,
        title,
        content,
        url,
    });

    try {
        const summary = await generateSummary(title, content);
        const tags = await generateTags(title, content);

        source.summary = summary;
        source.tags = tags;
        await source.save();
    } catch (error) {
        console.error('AI Processing Error:', error);
    }

    res.status(201).json(source);
});

export const getSource = asyncHandler(async (req, res) => {
    const source = await Source.findById(req.params.id);

    if (!source) {
        res.status(404);
        throw new Error('Source not found');
    }

    res.status(200).json(source);
});

export const updateSource = asyncHandler(async (req, res) => {
    const source = await Source.findById(req.params.id);

    if (!source) {
        res.status(404);
        throw new Error('Source not found');
    }

    const { title, content, url, type } = req.body;

    const contentChanged = (title && title !== source.title) ||
        (content && content !== source.content) ||
        (url && url !== source.url);

    const updatedSource = await Source.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    if (contentChanged) {
        try {
            const summary = await generateSummary(updatedSource.title, updatedSource.content);
            const tags = await generateTags(updatedSource.title, updatedSource.content);

            updatedSource.summary = summary;
            updatedSource.tags = tags;
            await updatedSource.save();
        } catch (error) {
            console.error('Update AI Error:', error);
        }
    }

    res.status(200).json(updatedSource);
});

export const deleteSource = asyncHandler(async (req, res) => {
    const source = await Source.findById(req.params.id);

    if (!source) {
        res.status(404);
        throw new Error('Source not found');
    }

    await source.deleteOne();

    res.status(200).json({ id: req.params.id });
});

export const understandSource = asyncHandler(async (req, res) => {
    const source = await Source.findById(req.params.id);

    if (!source) {
        res.status(404);
        throw new Error('Source not found');
    }

    const analysis = await analyzeSource(source.title, source.content);

    res.status(200).json({
        ...source.toObject(),
        analysis,
    });
});
