import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm bg-[#1A1A1A] border border-red-500/20 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full text-muted-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/5">
                                <AlertTriangle size={32} />
                            </div>

                            <h3 className="text-xl font-bold text-on-surface mb-2">Delete Knowledge?</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed px-4">
                                Are you sure you want to delete <span className="text-on-surface font-semibold">"{title}"</span>? This action cannot be undone.
                            </p>

                            <div className="flex gap-3 w-full mt-8">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 rounded-2xl bg-surface-variant/40 hover:bg-surface-variant/60 text-on-surface font-semibold text-sm transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className="flex-1 px-4 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-lg shadow-red-600/20 hover:scale-[1.02] active:scale-95"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DeleteConfirmModal;
