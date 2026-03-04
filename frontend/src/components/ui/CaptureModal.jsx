import React, { useState, useEffect } from 'react';
import { X, Save, FileText, Link as LinkIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CaptureModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'Note',
        url: '',
        tags: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                content: initialData.content || '',
                type: initialData.type || 'Note',
                url: initialData.url || '',
                tags: initialData.tags?.join(', ') || '',
            });
        } else {
            setFormData({ title: '', content: '', type: 'Note', url: '', tags: '' });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const body = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        };
        onSave(body, initialData?._id);
        if (!initialData) {
            setFormData({ title: '', content: '', type: 'Note', url: '', tags: '' });
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative bg-surface border border-surface-variant w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
                    >
                        <div className="p-6 border-b border-surface-variant flex items-center justify-between bg-surface-variant/20 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-container text-surface rounded-xl shadow-lg shadow-blue-500/20">
                                    <Sparkles size={20} />
                                </div>
                                <h2 className="text-xl font-semibold tracking-tight">{initialData ? 'Edit Knowledge' : 'Capture Knowledge'}</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full transition-colors text-muted-foreground">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto invisible-scrollbar">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 ml-1">Knowledge Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Note', 'Link', 'Insight'].map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: t })}
                                            className={`py-2 rounded-xl border text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1.5 ${formData.type === t
                                                ? 'bg-primary-container text-surface border-primary-container shadow-lg shadow-blue-500/20'
                                                : 'bg-surface-variant/20 border-transparent hover:border-surface-variant text-muted-foreground/70'
                                                }`}
                                        >
                                            {t === 'Note' && <FileText size={16} />}
                                            {t === 'Link' && <LinkIcon size={16} />}
                                            {t === 'Insight' && <Sparkles size={16} />}
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 ml-1">Title</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="What did you learn?"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-surface-variant/30 border border-transparent focus:border-blue-500/30 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none transition-all placeholder:text-muted-foreground/30"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 ml-1">
                                    Source URL {formData.type !== 'Link' && <span className="text-[10px] opacity-40 lowercase">(Optional)</span>}
                                </label>
                                <input
                                    required={formData.type === 'Link'}
                                    type="url"
                                    placeholder="https://example.com"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full bg-surface-variant/30 border border-transparent focus:border-blue-500/30 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none transition-all placeholder:text-muted-foreground/30"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 ml-1">Content</label>
                                <textarea
                                    required
                                    placeholder="Details, thoughts, or context..."
                                    rows={formData.type === 'Link' ? 3 : 6}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full bg-surface-variant/30 border border-transparent focus:border-blue-500/30 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none transition-all resize-none placeholder:text-muted-foreground/30 leading-relaxed"
                                />
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="order-2 sm:order-1 flex-1 py-3 lg:py-4 rounded-2xl bg-surface-variant/40 text-[10px] lg:text-xs font-bold uppercase tracking-widest hover:bg-surface-variant/60 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="order-1 sm:order-2 flex-[2] py-3 lg:py-4 rounded-2xl bg-primary-container text-surface text-[10px] lg:text-xs font-bold uppercase tracking-widest hover:shadow-xl hover:shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    Save Knowledge
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CaptureModal;
