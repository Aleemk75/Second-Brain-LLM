import React, { useState, useEffect } from 'react';
import SourcePanel from './components/layout/SourcePanel';
import Workspace from './components/layout/Workspace';
import AIStudio from './components/layout/AIStudio';
import DashboardGrid from './components/layout/DashboardGrid';
import CaptureModal from './components/ui/CaptureModal';
import DeleteConfirmModal from './components/ui/DeleteConfirmModal';
import { getSources, createSource, updateSource, deleteSource } from './services/api';
import { Sparkles, Plus, Search, Upload, Network, Brain, Menu, X, ChevronRight, MessageSquareCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
    const [activeSource, setActiveSource] = useState(null);
    const [sources, setSources] = useState([]);
    const [isCaptureOpen, setIsCaptureOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingSource, setEditingSource] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAIStudioOpen, setIsAIStudioOpen] = useState(false);

    useEffect(() => {
        fetchSources();
    }, [search]);

    const fetchSources = async () => {
        try {
            const { data } = await getSources({ search });
            setSources(data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveKnowledge = async (body, id) => {
        try {
            if (id) {
                const { data } = await updateSource(id, body);
                setSources(sources.map(s => s._id === id ? data : s));
                if (activeSource?._id === id) setActiveSource(data);
            } else {
                const { data } = await createSource(body);
                setSources([data, ...sources]);
                setActiveSource(data);
            }
        } catch (error) {
            alert('Error saving knowledge');
        }
    };

    const handleDeleteKnowledge = (id) => {
        const item = sources.find(s => s._id === id);
        if (item) {
            setItemToDelete(item);
            setIsDeleteModalOpen(true);
        }
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteSource(itemToDelete._id);
            setSources(sources.filter(s => s._id !== itemToDelete._id));
            if (activeSource?._id === itemToDelete._id) setActiveSource(null);
        } catch (error) {
            alert('Error deleting knowledge');
        } finally {
            setItemToDelete(null);
        }
    };

    return (
        <div className="flex h-screen w-full bg-surface text-on-surface overflow-hidden font-sans">
            {/* Sidebar Overlay for Mobile */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-surface-variant flex flex-col bg-[#1A1A1A] p-4 lg:p-6 shrink-0 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} text-on-surface`}>
                <div className="flex items-center justify-between mb-10 px-2 lg:px-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-surface-variant bg-surface-variant/20 rounded-xl flex items-center justify-center text-primary-container shrink-0">
                            <Brain size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black tracking-tighter text-on-surface">Second Brain LLM</span>
                            <span className="text-[10px] text-primary-container font-medium uppercase tracking-[0.2em] leading-none">Neural OS</span>
                        </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-surface-variant rounded-xl text-muted-foreground">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto invisible-scrollbar">
                    <SourcePanel
                        sources={sources}
                        loading={loading}
                        activeSource={activeSource}
                        setActiveSource={(src) => {
                            setActiveSource(src);
                            setIsSidebarOpen(false);
                        }}
                    />

                    <div className="pt-4 pb-4 space-y-4 border-t border-surface-variant/30">
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold px-4">
                            Upcoming Features
                        </div>

                        <div className="space-y-4 px-2">
                            <div className="group flex flex-col gap-1 p-2 rounded-xl border border-transparent hover:border-surface-variant hover:bg-surface-variant/20 transition-all cursor-help">
                                <div className="flex items-center gap-3 text-on-surface/70 group-hover:text-primary-container transition-colors">
                                    <div className="p-1.5 rounded-lg bg-surface-variant/30"><Upload size={14} /></div>
                                    <span className="text-xs font-semibold">File Upload</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground/50 leading-relaxed ml-9 pl-0.5">
                                    Support document uploads with metadata extraction
                                </p>
                            </div>

                            <div className="group flex flex-col gap-1 p-2 rounded-xl border border-transparent hover:border-surface-variant hover:bg-surface-variant/20 transition-all cursor-help">
                                <div className="flex items-center gap-3 text-on-surface/70 group-hover:text-primary-container transition-colors">
                                    <div className="p-1.5 rounded-lg bg-surface-variant/30"><Network size={14} /></div>
                                    <span className="text-xs font-semibold">Graph Visualization</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground/50 leading-relaxed ml-9 pl-0.5">
                                    Show relationships between notes using React Flow or D3
                                </p>
                            </div>
                        </div>
                    </div>
                </nav>

                <button
                    onClick={() => { setEditingSource(null); setIsCaptureOpen(true); setIsSidebarOpen(false); }}
                    className="w-full bg-primary-container text-surface p-4 rounded-3xl flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-blue-500/10 font-bold mt-4"
                >
                    <Plus size={24} />
                    <span className="text-sm text-surface">Capture</span>
                </button>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-full relative">
                <header className="h-20 border-b border-surface-variant flex items-center px-4 lg:px-8 bg-[#1F1F1F]/80 backdrop-blur-md z-30 shrink-0 gap-4">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-surface-variant rounded-xl text-muted-foreground">
                        <Menu size={20} />
                    </button>

                    <div className="flex-1 max-w-2xl relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-40 " size={18} />
                        <input
                            type="text"
                            placeholder="Search your second brain..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-surface-variant/40 border border-transparent focus:border-blue-500/30 rounded-full py-2.5 lg:py-3 pl-10 lg:pl-12 pr-6 text-[11px] lg:text-sm focus:outline-none transition-all placeholder:text-muted-foreground/50"
                        />
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4 ml-auto">
                        {activeSource && (
                            <button
                                onClick={() => setIsAIStudioOpen(!isAIStudioOpen)}
                                className={`p-2 lg:px-4 lg:py-2 rounded-xl flex items-center gap-2 transition-all xl:hidden ${isAIStudioOpen ? 'bg-primary-container text-surface' : 'bg-surface-variant/30 text-muted-foreground hover:bg-surface-variant/50'}`}
                            >
                                <Sparkles size={18} />
                                <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">AI Guide</span>
                            </button>
                        )}
                        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border border-surface-variant overflow-hidden cursor-pointer hover:border-primary-container transition-colors ring-4 ring-transparent hover:ring-blue-500/5 shrink-0">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aleem" alt="User profile icon" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 flex overflow-hidden">
                    {activeSource ? (
                        <div className="flex-1 flex overflow-hidden relative">
                            <Workspace
                                activeSource={activeSource}
                                onBack={() => setActiveSource(null)}
                                onEdit={(item) => { setEditingSource(item); setIsCaptureOpen(true); }}
                                onDelete={handleDeleteKnowledge}
                                onUpdate={(updated) => {
                                    setSources(prev => prev.map(s => s._id === updated._id ? updated : s));
                                    setActiveSource(updated);
                                }}
                            />

                            {/* AI Studio Sidebar / Drawer */}
                            <div className={`fixed xl:static inset-y-0 right-0 z-40 transition-transform duration-300 xl:translate-x-0 ${isAIStudioOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}`}>
                                <AIStudio
                                    activeSource={activeSource}
                                    onClose={() => setIsAIStudioOpen(false)}
                                    isDrawer={true}
                                />
                            </div>

                            {/* AI Studio Toggle Button Overlay for small screens */}
                            <AnimatePresence>
                                {isAIStudioOpen && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setIsAIStudioOpen(false)}
                                        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-30 xl:hidden"
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <DashboardGrid
                            items={sources}
                            onSelect={setActiveSource}
                            onEdit={(item) => { setEditingSource(item); setIsCaptureOpen(true); }}
                            onDelete={handleDeleteKnowledge}
                            activeId={activeSource?._id}
                            loading={loading}
                        />
                    )}
                </main>
            </div>

            <CaptureModal
                isOpen={isCaptureOpen}
                onClose={() => { setIsCaptureOpen(false); setEditingSource(null); }}
                onSave={handleSaveKnowledge}
                initialData={editingSource}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title={itemToDelete?.title}
            />
        </div>
    );
}

export default App;
