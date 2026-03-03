import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Link as LinkIcon, Sparkles, Clock, ChevronRight, Edit, Trash2 } from 'lucide-react';

const DashboardGrid = ({ items, onSelect, onEdit, onDelete, activeId, loading }) => {
    const [filter, setFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');

    const filteredItems = items
        .filter(item => filter === 'All' || item.type === filter)
        .sort((a, b) => {
            if (sortBy === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
            return 0;
        });

    return (
        <div className="flex-1 flex flex-col h-full bg-[#1A1A1A]">
            <div className="p-4 md:p-6 border-b border-surface-variant flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto invisible-scrollbar pb-1 md:pb-0 w-full md:w-auto overflow-y-hidden">
                    {['All', 'Note', 'Link', 'Insight'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${filter === f
                                ? 'bg-primary-container text-surface shadow-lg shadow-blue-500/10'
                                : 'bg-surface-variant/20 text-muted-foreground/70 hover:bg-surface-variant/40'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 bg-surface-variant/10 p-1 rounded-xl border border-surface-variant/20 shrink-0">
                    {['Newest', 'Relevance'].map(s => (
                        <button
                            key={s}
                            onClick={() => setSortBy(s)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${sortBy === s
                                ? 'bg-surface-variant text-on-surface'
                                : 'text-muted-foreground/60 hover:text-on-surface hover:bg-surface-variant/20'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="p-5 rounded-[24px] border border-surface-variant bg-[#1F1F1F] animate-pulse">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 bg-surface-variant/40 rounded-2xl"></div>
                                    <div className="w-16 h-3 bg-surface-variant/30 rounded-full"></div>
                                </div>
                                <div className="w-3/4 h-5 bg-surface-variant/40 rounded-lg mb-2"></div>
                                <div className="w-full h-3 bg-surface-variant/30 rounded-full mb-1"></div>
                                <div className="w-5/6 h-3 bg-surface-variant/30 rounded-full mb-4"></div>
                                <div className="flex gap-2">
                                    <div className="w-12 h-4 bg-surface-variant/20 rounded"></div>
                                    <div className="w-12 h-4 bg-surface-variant/20 rounded"></div>
                                </div>
                            </div>
                        ))
                    ) : filteredItems.map((item, idx) => (
                        <motion.div
                            layoutId={item._id}
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => onSelect(item)}
                            className={`p-5 rounded-[24px] border border-surface-variant cursor-pointer transition-all hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/30 group bg-[#1F1F1F] ${activeId === item._id ? 'border-primary-container bg-[#242424]' : ''
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-2.5 rounded-2xl ${item.type === 'Note' ? 'bg-blue-500/10 text-blue-400' :
                                    item.type === 'Link' ? 'bg-emerald-500/10 text-emerald-400' :
                                        'bg-purple-500/10 text-purple-400'
                                    }`}>
                                    {item.type === 'Note' && <FileText size={20} />}
                                    {item.type === 'Link' && <LinkIcon size={20} />}
                                    {item.type === 'Insight' && <Sparkles size={20} />}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 opacity-40">
                                        <Clock size={10} />
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                                            className="p-1.5 hover:bg-surface-variant rounded-lg text-muted-foreground transition-colors"
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDelete(item._id); }}
                                            className="p-1.5 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg text-muted-foreground transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <h3 className="font-semibold text-base mb-2 group-hover:text-primary-container transition-colors line-clamp-1">
                                {item.title}
                            </h3>

                            <p className="text-xs text-muted-foreground mb-4 line-clamp-3 leading-relaxed opacity-70">
                                {item.summary || item.content}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex gap-1.5 flex-wrap">
                                    {item.tags?.slice(0, 2).map(tag => (
                                        <span key={tag} className="text-[9px] bg-surface-variant/50 px-2 py-0.5 rounded text-muted-foreground">
                                            #{tag}
                                        </span>
                                    ))}
                                    {item.tags?.length > 2 && <span className="text-[9px] text-muted-foreground">+{item.tags.length - 2}</span>}
                                </div>
                                <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="h-64 flex flex-col items-center justify-center text-muted-foreground opacity-30">
                        <Sparkles size={48} className="mb-4" />
                        <p>No knowledge items found matching your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardGrid;
