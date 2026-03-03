import mongoose from 'mongoose';

const sourceSchema = mongoose.Schema(
    {
        type: {
            type: String,
            required: [true, 'Please add a type (Note, Link, or Insight)'],
            enum: ['Note', 'Link', 'Insight'],
        },
        title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        content: {
            type: String,
            required: function () { return this.type === 'Note'; },
        },
        url: {
            type: String,
            required: function () { return this.type === 'Link'; },
        },
        summary: {
            type: String,
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Source', sourceSchema);
