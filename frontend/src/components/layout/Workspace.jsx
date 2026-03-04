import React, { useState, useEffect, useRef } from 'react';
import { Type, Code, Link as LinkIcon, Bold, Italic, FileText, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { updateSource } from '../../services/api';

const Workspace = ({ activeSource, onBack, onEdit, onDelete, onUpdate }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (activeSource) {
            setTitle(activeSource.title);
            setContent(activeSource.content || '');
        }
    }, [activeSource]);

    const handleUpdate = (newTitle, newContent) => {
        setTitle(newTitle);
        setContent(newContent);

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(async () => {
            setSaving(true);
            try {
                const body = {
                    title: newTitle,
                    content: newContent,
                    url: activeSource.url
                };
                const { data } = await updateSource(activeSource._id, body);
                if (onUpdate) onUpdate(data);
            } catch (error) {
                console.error('Save error:', error);
            } finally {
                setSaving(false);
            }
        }, 1000);
    };

    if (!activeSource) {
        return (
            <div className="flex-1 h-full flex items-center justify-center bg-surface p-8 text-center text-on-surface/40">
                <div>
                    <div className="w-20 h-20 bg-surface-variant rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                        <FileText size={40} />
                    </div>
                    <h2 className="text-xl font-medium mb-2">Select a source to start</h2>
                    <p className="text-sm max-w-xs mx-auto">Click on a note or link from the source panel to view and edit its content.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 h-full flex flex-col bg-surface overflow-hidden">
            <div className="h-14 lg:h-16 border-b border-surface-variant flex items-center justify-between px-4 lg:px-8 bg-[#1F1F1F]/50 backdrop-blur-sm z-10 shrink-0">
                <div className="flex items-center gap-1 lg:gap-4 overflow-x-auto invisible-scrollbar">
                    {onBack && (
                        <button onClick={onBack} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 transition-colors flex items-center gap-2 border-r border-surface-variant pr-3 lg:pr-4 mr-1 shrink-0">
                            <ArrowLeft size={18} />
                            <span className="hidden sm:inline text-[10px] lg:text-xs font-bold uppercase tracking-widest">Back</span>
                        </button>
                    )}
                    <button className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 transition-colors shrink-0"><Bold size={18} /></button>
                    <button className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 transition-colors shrink-0"><Italic size={18} /></button>
                    <button className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 transition-colors border-l border-surface-variant pl-3 lg:pl-4 shrink-0"><Code size={18} /></button>
                    <button className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 transition-colors shrink-0"><LinkIcon size={18} /></button>
                </div>
                <div className="flex items-center gap-2 lg:gap-4 shrink-0">
                    <div className="hidden sm:block text-[10px] lg:text-xs text-muted-foreground mr-2 lg:mr-4 whitespace-nowrap">
                        {saving ? 'Saving...' : 'All changes saved'}
                    </div>
                    <div className="flex gap-1 lg:gap-2">
                        <button
                            onClick={() => onEdit(activeSource)}
                            className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 transition-colors"
                            title="Edit metadata"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={() => onDelete(activeSource._id)}
                            className="p-2 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg text-neutral-400 transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 lg:p-12 xl:px-32 custom-scrollbar">
                <div className="max-w-3xl mx-auto space-y-4 lg:space-y-6 text-on-surface">
                    <input
                        type="text"
                        placeholder="Untitled Note"
                        value={title}
                        onChange={(e) => handleUpdate(e.target.value, content)}
                        className="w-full bg-transparent text-2xl lg:text-4xl font-semibold focus:outline-none placeholder:opacity-20 transition-all"
                    />
                    <div className="flex gap-2 mb-4 overflow-x-auto invisible-scrollbar whitespace-nowrap">
                        {activeSource.tags?.map(tag => (
                            <span key={tag} className="text-[10px] lg:text-xs font-medium bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full shrink-0">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {(activeSource.type === 'Link' || activeSource.url) && (
                        <div className="flex items-center gap-2 p-3 bg-surface-variant/30 rounded-xl border border-surface-variant mb-6 group">
                            <LinkIcon size={16} className="text-primary-container shrink-0" />
                            <a
                                href={activeSource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] lg:text-sm border-none focus:outline-none flex-1 truncate text-primary-container hover:underline"
                            >
                                {activeSource.url}
                            </a>
                        </div>
                    )}

                    <textarea
                        className="w-full h-full min-h-[400px] lg:min-h-[500px] bg-transparent resize-none focus:outline-none text-sm lg:text-lg leading-relaxed text-on-surface/80 placeholder:opacity-20"
                        placeholder="Start writing or paste content here..."
                        value={content}
                        onChange={(e) => handleUpdate(title, e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Workspace;
