import React, { useState } from 'react';
import { Sparkles, Layout, List, History, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { understandSource } from '../../services/api';

const AIStudio = ({ activeSource, onClose, isDrawer }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUnderstand = async () => {
    if (!activeSource) return;
    setLoading(true);
    try {
      const { data } = await understandSource(activeSource._id);
      setAnalysis(data.analysis);
    } catch (error) {
      alert('AI Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-80 h-full border-l border-surface-variant bg-[#1A1A1A] flex flex-col shadow-2xl xl:shadow-none ${isDrawer ? 'max-w-[90vw]' : ''}`}>
      <div className="p-4 border-b border-surface-variant flex items-center justify-between text-primary-container font-medium">
        <div className="flex items-center gap-2">
          <Sparkles size={18} fill="currentColor" className="opacity-80" />
          Note Guide
        </div>
        {onClose && (
          <button onClick={onClose} className="xl:hidden p-2 hover:bg-surface-variant rounded-xl text-muted-foreground transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 invisible-scrollbar">
        <section className="space-y-3">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-1">Deep Dive</div>
          <button
            onClick={handleUnderstand}
            disabled={!activeSource || loading}
            className="w-full bg-[#1F2937] border border-blue-500/30 hover:bg-[#374151] text-blue-400 p-4 rounded-2xl flex flex-col items-center text-center gap-2 transition-colors disabled:opacity-50"
          >
            <Sparkles size={24} className={loading ? 'animate-spin' : 'animate-pulse'} />
            <span className="text-sm font-medium">{loading ? 'Analyzing...' : 'Understand this Note'}</span>
          </button>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground font-semibold px-1">
            <span>Summary</span>
            <Layout size={14} />
          </div>
          <div className="bg-surface-variant/50 p-4 rounded-2xl text-xs leading-relaxed text-on-surface/80 border border-transparent hover:border-neutral-700 transition-colors">
            {analysis?.summary || activeSource?.summary || 'AI will generate a summary once you deep dive or save.'}
          </div>
        </section>

        {analysis && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-primary-container font-semibold px-1">
              <span>AI Insights</span>
              <Sparkles size={14} />
            </div>
            <div className="space-y-2">
              {analysis.keyInsights?.map((insight, idx) => (
                <div key={idx} className="text-[11px] bg-blue-500/5 p-3 rounded-xl border border-blue-500/10 text-on-surface/80 italic">
                  "{insight}"
                </div>
              ))}
            </div>
          </motion.section>
        )}

        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground font-semibold px-1">
            <span>Linked Concepts</span>
            <List size={14} />
          </div>
          <div className="flex flex-wrap gap-2">
            {(analysis?.relatedConcepts || activeSource?.tags || []).map(tag => (
              <span key={tag} className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md">
                {tag.toUpperCase()}
              </span>
            ))}
          </div>
        </section>
      </div>

      <div className="p-4 border-t border-surface-variant flex items-center justify-between text-muted-foreground">
        <History size={16} />
        <span className="text-[10px]">Session active</span>
      </div>
    </div>
  );
};

export default AIStudio;
