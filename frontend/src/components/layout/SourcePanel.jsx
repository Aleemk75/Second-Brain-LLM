import React, { useState, useEffect } from 'react';
import { Search, Plus, FileText, Link as LinkIcon, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSources, createSource } from '../../services/api';

const SourcePanel = ({ sources, loading, activeSource, setActiveSource }) => {
    return (
        <div className="flex-1 flex flex-col min-h-0 bg-transparent">
            <div className="px-4 py-4 flex items-center justify-between text-muted-foreground/40">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Recent Knowledge</span>
            </div>

            <div className="flex-1 overflow-y-auto px-2 space-y-1 invisible-scrollbar">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl animate-pulse">
                            <div className="w-8 h-8 bg-surface-variant/40 rounded-xl"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-surface-variant/40 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))
                ) : sources.length === 0 ? (
                    <div className="p-8 text-center text-[10px] text-muted-foreground/30 italic uppercase tracking-widest">
                        Empty Brain
                    </div>
                ) : (
                    sources.slice(0, 3).map((source, idx) => (
                        <motion.div
                            key={source._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            whileHover={{ x: 4 }}
                            onClick={() => setActiveSource(source)}
                            className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${activeSource?._id === source._id ? 'bg-[#2A2B2E] border border-blue-500/30 shadow-lg shadow-blue-500/5' : 'hover:bg-neutral-800/40'
                                }`}
                        >
                            <div className={`p-2 rounded-xl shrink-0 ${source.type === 'Note' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
                                }`}>
                                {source.type === 'Note' ? <FileText size={16} /> : <LinkIcon size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={`text-xs font-medium truncate ${activeSource?._id === source._id ? 'text-primary-container' : 'text-on-surface/70'}`}>{source.title}</h3>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SourcePanel;
