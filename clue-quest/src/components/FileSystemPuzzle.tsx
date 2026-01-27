import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FileSystemPuzzleProps {
    onSolve?: (answer: string) => void;
}

type FileItem = {
    id: string;
    name: string;
    type: "file" | "trash";
    isGarbageBin?: boolean;
    hiddenName?: string; // actual name for garbage bin files
    confusionImage?: string; // image URL for confusing files
};

export const FileSystemPuzzle = ({ onSolve }: FileSystemPuzzleProps) => {
    const [userAnswer, setUserAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [solved, setSolved] = useState(false);
    const [openedFile, setOpenedFile] = useState<FileItem | null>(null);
    const [showGarbageImage, setShowGarbageImage] = useState(false);
    const [showBook, setShowBook] = useState(false);
    const [currentPage, setCurrentPage] = useState(0); // 0=cover, 1=page1, 2=page2, 3=answer
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null); // Track which book was clicked
    const [showConfusionImage, setShowConfusionImage] = useState(false);
    const [confusionImageSrc, setConfusionImageSrc] = useState<string>("");

    // Auto-play pages when book opens - fast-forward page flipping animation
    useEffect(() => {
        if (!showBook || currentPage >= 3) return;

        // Fast-forwarded page flipping: quick succession of page turns
        const delays = [300, 700, 1100]; // rapid page flips - one by one
        
        const timers = delays.map((delay, index) => 
            setTimeout(() => {
                setCurrentPage(index + 1);
            }, delay)
        );

        return () => timers.forEach(timer => clearTimeout(timer));
    }, [showBook]);

    // Array of confusing images for each file (using publicly available images)
    const confusionImages = [
        "/dr-doom.png",
        "/dr-doom-latest.png",
        "/download.jpg",
        "/morse-code.jpeg",
        "/intro-bg.png",
        "/Gemini_Generated_Image_jjpkfujjpkfujjpk-removebg-preview.png",
        "/dr-doom-4k.png",
        "/dr-doom-4k-removebg-preview.png",
        "/placeholder.svg",
    ];

    // File system items - 3x7 grid (21 files)
    const files: FileItem[] = [
        // Row 1
        { id: "1", name: "document.txt", type: "file", confusionImage: confusionImages[0] },
        { id: "2", name: "system32", type: "file", confusionImage: confusionImages[1] },
        { id: "3", name: "cache.tmp", type: "file", confusionImage: confusionImages[2] },
        { id: "4", name: "data_v2.exe", type: "file", confusionImage: confusionImages[3] },
        { id: "5", name: "old_backup", type: "file", confusionImage: confusionImages[4] },
        { id: "6", name: "readme.md", type: "file", confusionImage: confusionImages[5] },
        { id: "7", name: "config.ini", type: "file", confusionImage: confusionImages[6] },
        // Row 2
        { id: "8", name: "file_2024", type: "file", confusionImage: confusionImages[7] },
        { id: "9", name: "archive.zip", type: "file", confusionImage: confusionImages[8] },
        { id: "10", name: "check_here", type: "file", hiddenName: "check garbage bin", confusionImage: confusionImages[0] },
        { id: "11", name: "module.js", type: "file", confusionImage: confusionImages[1] },
        { id: "12", name: "settings.json", type: "file", confusionImage: confusionImages[2] },
        { id: "13", name: "temp_file", type: "file", confusionImage: confusionImages[3] },
        { id: "14", name: "images_old", type: "file", confusionImage: confusionImages[4] },
        // Row 3
        { id: "15", name: "look_below", type: "file", hiddenName: "check garbage bin", confusionImage: confusionImages[5] },
        { id: "16", name: "output.txt", type: "file", confusionImage: confusionImages[6] },
        { id: "17", name: "garbage bin", type: "trash", isGarbageBin: true },
        { id: "18", name: "log_file", type: "file", confusionImage: confusionImages[7] },
        { id: "19", name: "script.py", type: "file", confusionImage: confusionImages[8] },
        { id: "20", name: "version1.0", type: "file", confusionImage: confusionImages[0] },
        { id: "21", name: "notes.txt", type: "file", confusionImage: confusionImages[1] },
    ];

    const handleSubmit = () => {
        const correctAnswer = "ABIN";
        if (userAnswer.toUpperCase().trim() === correctAnswer) {
            setSolved(true);
            setFeedback("✓ CORRECT! You found it!");
            setTimeout(() => {
                onSolve?.(correctAnswer);
            }, 1000);
        } else {
            setFeedback("✗ Incorrect! Look carefully at the files.");
        }
    };

    const handleFileClick = (item: FileItem) => {
        if (item.type === "trash" && item.isGarbageBin) {
            setShowGarbageImage(true);
        } else if (item.type === "file" && item.confusionImage) {
            // Open confusion image
            setConfusionImageSrc(item.confusionImage);
            setShowConfusionImage(true);
        }
        setOpenedFile(item);
    };

    const handleBookClick = (bookId: number) => {
        setSelectedBookId(bookId);
        setCurrentPage(0);
        setShowBook(true);
    };

    const closeBook = () => {
        setShowBook(false);
        setCurrentPage(0);
        setSelectedBookId(null);
    };

    const getIcon = (item: FileItem) => {
        if (item.type === "trash") {
            return (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m0 0v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6h12z" 
                        stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            );
        } else {
            return (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#FCD34D" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8.2C3 7.0799 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H9.67452C10.1637 5 10.4083 5 10.6385 5.05526C10.8425 5.10425 11.0376 5.18506 11.2166 5.29472C11.4184 5.4184 11.5914 5.59135 11.9373 5.93726L12.0627 6.06274C12.4086 6.40865 12.5816 6.5816 12.7834 6.70528C12.9624 6.81494 13.1575 6.89575 13.3615 6.94474C13.5917 7 13.8363 7 14.3255 7H17.8C18.9201 7 19.4802 7 19.908 7.21799C20.2843 7.40973 20.5903 7.71569 20.782 8.09202C21 8.51984 21 9.0799 21 10.2V15.8C21 16.9201 21 17.4802 20.782 17.908C20.5903 18.2843 20.2843 18.5903 19.908 18.782C19.4802 19 18.9201 19 17.8 19H6.2C5.07989 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2Z" 
                        fill="#FCD34D" stroke="#F59E0B" strokeWidth="0.5"/>
                </svg>
            );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl mx-auto p-4 space-y-6"
        >
            {/* Simple Question - At the Top */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-primary/20 border-4 border-primary rounded-lg p-8 text-center"
            >
                <h2 className="font-['Press_Start_2P'] text-lg md:text-2xl text-primary mb-4">
                    THE MYSTERY
                </h2>
                <p className="font-['Press_Start_2P'] text-xs md:text-sm text-foreground leading-relaxed">
                    Look at the files on the desktop. Find the garbage bin and look inside it to find the answer hidden in the library.
                </p>
            </motion.div>

            {/* Desktop File System Box with Background */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative border-4 border-primary/50 rounded-lg overflow-hidden"
                style={{
                    backgroundImage: "url('/intro-bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "700px",
                }}
            >
                {/* Dark overlay for better file visibility */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                
                {/* Files Grid Container */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-xs font-['Press_Start_2P'] text-yellow-300 drop-shadow-lg">
                            MY COMPUTER
                        </h3>
                    </div>

                    {/* 3x7 File Grid with Scrollbar */}
                    <div className="grid grid-cols-3 gap-6 overflow-y-auto overflow-x-hidden pr-4 scrollbar scrollbar-thumb-primary/60 scrollbar-track-black/40">
                        {files.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                                onClick={() => handleFileClick(item)}
                                className="flex flex-col items-center gap-3 p-4 rounded-lg"
                            >
                                <div className="p-3 rounded-lg">
                                    {getIcon(item)}
                                </div>
                                <span className="font-['Press_Start_2P'] text-[9px] text-white text-center break-words drop-shadow-lg">
                                    {item.name}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Confusion Image Modal */}
            <AnimatePresence>
                {showConfusionImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                        onClick={() => setShowConfusionImage(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="relative max-w-4xl w-full max-h-[90vh] bg-card border-4 border-primary rounded-lg p-4 overflow-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowConfusionImage(false)}
                                className="absolute top-4 right-4 p-2 bg-primary/20 hover:bg-primary/40 rounded-full transition-colors z-10"
                            >
                                <X className="w-6 h-6 text-primary" />
                            </button>
                            <div className="mt-6">
                                <img
                                    src={confusionImageSrc}
                                    alt="File Content"
                                    className="w-full h-auto rounded border-2 border-primary/30 object-contain"
                                />
                                <p className="text-center text-foreground/50 font-['Press_Start_2P'] text-[10px] mt-4">
                                    This is not what you're looking for. Close and check the GARBAGE BIN.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Garbage Bin Image Modal */}
            <AnimatePresence>
                {showGarbageImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setShowGarbageImage(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl w-full bg-card border-4 border-primary rounded-lg p-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowGarbageImage(false)}
                                className="absolute top-2 right-2 p-2 bg-primary/20 hover:bg-primary/30 rounded-full transition-colors z-10"
                            >
                                <X className="w-5 h-5 text-primary" />
                            </button>
                            <div className="mt-8 relative">
                                <img
                                    src="/boy-library.jpeg"
                                    alt="Garbage Bin Contents - Library"
                                    className="w-full h-auto rounded border-2 border-primary/30"
                                />
                                {/* Clickable book areas - Only specific book is clickable */}
                                <div className="absolute inset-0">
                                    {/* The answer book - Fourth shelf (only this one opens the answer) */}
                                    <motion.div 
                                        onClick={() => handleBookClick(3)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="absolute"
                                        style={{ top: '35%', left: '1%', width: '35%', height: '12%' }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Book Opening Animation with Multi-Page Flipping */}
            <AnimatePresence>
                {showBook && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
                        onClick={closeBook}
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative"
                            style={{ perspective: "2000px" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Book Container with 3D perspective */}
                            <div className="relative w-[900px] h-[600px]" style={{ transformStyle: "preserve-3d" }}>
                                {/* Book Spine - Dark Green */}
                                <div className="absolute left-1/2 top-0 w-6 h-full bg-gradient-to-r from-green-900 via-green-800 to-green-900 -translate-x-1/2 z-20 shadow-2xl" />
                                
                                {/* PAGE 0: COVER - LEFT PAGE */}
                                <motion.div
                                    initial={{ rotateY: 0 }}
                                    animate={{ rotateY: currentPage >= 1 ? -180 : 0 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                    className="absolute left-0 top-0 w-1/2 h-full origin-right"
                                    style={{ transformStyle: "preserve-3d" }}
                                >
                                    {/* Front Cover - Dark Green with Gold trim */}
                                    <div 
                                        className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-700 to-green-900 rounded-l-3xl border-4 border-yellow-600 flex flex-col items-center justify-center shadow-2xl p-8"
                                        style={{ backfaceVisibility: "hidden" }}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: currentPage === 0 ? 1 : 0, scale: currentPage === 0 ? 1 : 0.8 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <div className="text-yellow-300 font-serif text-3xl font-bold mb-4">V.D.</div>
                                            <div className="text-yellow-200 font-serif text-sm text-center">
                                                <p>CLASSIFIED FILE</p>
                                                <p className="text-xs mt-2">TOP SECRET DOCUMENTS</p>
                                            </div>
                                        </motion.div>
                                    </div>
                                    
                                    {/* Back of Left Cover (Page 1) - Story content */}
                                    <div 
                                        className="absolute inset-0 bg-yellow-50 rounded-l-3xl border-2 border-green-900 flex items-center justify-center shadow-inner p-8"
                                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: currentPage >= 1 ? 1 : 0 }}
                                            transition={{ delay: currentPage >= 1 ? 0.4 : 0, duration: 0.5 }}
                                            className="text-green-900 font-serif text-center text-sm leading-relaxed"
                                        >
                                            <p className="font-bold mb-4">Chapter I</p>
                                            <p className="text-xs">Tom is in the library. He is reading.</p>
                                            <p className="text-xs mt-3">Look deeper into the forgotten spaces.</p>
                                        </motion.div>
                                    </div>
                                </motion.div>
                                
                                {/* PAGE 1: RIGHT PAGE */}
                                <motion.div
                                    initial={{ rotateY: 0 }}
                                    animate={{ rotateY: currentPage >= 1 ? 180 : 0 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                    className="absolute right-0 top-0 w-1/2 h-full origin-left"
                                    style={{ transformStyle: "preserve-3d" }}
                                >
                                    {/* Front - Empty (back of cover) */}
                                    <div 
                                        className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-700 to-green-800 rounded-r-3xl border-4 border-yellow-600 shadow-2xl"
                                        style={{ backfaceVisibility: "hidden" }}
                                    />
                                    
                                    {/* Back (Page 2) - Story continues */}
                                    <div 
                                        className="absolute inset-0 bg-yellow-50 rounded-r-3xl border-2 border-green-900 flex items-center justify-center shadow-inner p-8"
                                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: currentPage >= 1 ? 1 : 0 }}
                                            transition={{ delay: currentPage >= 1 ? 0.6 : 0, duration: 0.5 }}
                                            className="text-green-900 font-serif text-center text-sm leading-relaxed"
                                        >
                                            <p className="font-bold mb-4">Chapter II</p>
                                            <p className="text-xs">The answer lies in the disposal unit.</p>
                                            <p className="text-xs mt-3">Search where forgotten things rest.</p>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* PAGE 2: LEFT PAGE (for additional flipping) */}
                                <motion.div
                                    initial={{ rotateY: 0 }}
                                    animate={{ rotateY: currentPage >= 2 ? -180 : 0 }}
                                    transition={{ duration: 0.8, ease: "easeInOut", delay: currentPage >= 2 ? 0.3 : 0 }}
                                    className="absolute left-0 top-0 w-1/2 h-full origin-right"
                                    style={{ transformStyle: "preserve-3d", visibility: currentPage >= 2 ? "visible" : "hidden" }}
                                >
                                    {/* Back of Page 1 */}
                                    <div 
                                        className="absolute inset-0 bg-yellow-50 rounded-l-3xl border-2 border-green-900 flex items-center justify-center shadow-inner p-8"
                                        style={{ backfaceVisibility: "hidden" }}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: currentPage >= 2 ? 1 : 0 }}
                                            transition={{ delay: currentPage >= 2 ? 0.8 : 0, duration: 0.5 }}
                                            className="text-green-900 font-serif text-center text-sm leading-relaxed"
                                        >
                                            <p className="text-xs">The directory contains what many seek but few understand.</p>
                                            <p className="text-xs mt-3">Search where files are discarded.</p>
                                        </motion.div>
                                    </div>
                                    
                                    {/* Front of Page 2 */}
                                    <div 
                                        className="absolute inset-0 bg-yellow-50 rounded-l-3xl border-2 border-green-900 flex items-center justify-center shadow-inner p-8"
                                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: currentPage >= 2 ? 1 : 0 }}
                                            transition={{ delay: currentPage >= 2 ? 0.8 : 0, duration: 0.5 }}
                                            className="text-green-900 font-serif text-center text-sm leading-relaxed"
                                        >
                                            <p className="text-xs">Look for hints within the file names themselves.</p>
                                            <p className="text-xs mt-3">Some whisper of what lies below.</p>
                                        </motion.div>
                                    </div>
                                </motion.div>
                                
                                {/* PAGE 3: RIGHT PAGE - ANSWER PAGE */}
                                <motion.div
                                    initial={{ rotateY: 0 }}
                                    animate={{ rotateY: currentPage >= 2 ? 180 : 0 }}
                                    transition={{ duration: 0.8, ease: "easeInOut", delay: currentPage >= 2 ? 0.3 : 0 }}
                                    className="absolute right-0 top-0 w-1/2 h-full origin-left"
                                    style={{ transformStyle: "preserve-3d", visibility: currentPage >= 2 ? "visible" : "hidden" }}
                                >
                                    {/* Back of Page 2 */}
                                    <div 
                                        className="absolute inset-0 bg-yellow-50 rounded-r-3xl border-2 border-green-900 flex items-center justify-center shadow-inner p-8"
                                        style={{ backfaceVisibility: "hidden" }}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: currentPage >= 2 ? 1 : 0 }}
                                            transition={{ delay: currentPage >= 2 ? 0.8 : 0, duration: 0.5 }}
                                            className="text-green-900 font-serif text-center text-sm leading-relaxed"
                                        >
                                            <p className="text-xs">The repository holds the key.</p>
                                            <p className="text-xs mt-3">Navigate carefully.</p>
                                        </motion.div>
                                    </div>
                                    
                                    {/* ANSWER PAGE - Front of Page 3 */}
                                    <div 
                                        className="absolute inset-0 bg-yellow-50 rounded-r-3xl border-2 border-green-900 flex flex-col items-center justify-center shadow-inner p-8 overflow-hidden"
                                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: currentPage >= 3 ? 1 : 0, scale: currentPage >= 3 ? 1 : 0.9 }}
                                            transition={{ delay: currentPage >= 3 ? 1.1 : 0, duration: 0.6 }}
                                            className="text-center w-full h-full flex flex-col items-center justify-center"
                                        >
                                            <div className="text-green-800/60 font-serif text-xs uppercase tracking-widest mb-4">
                                                CLASSIFIED • 1978 / DEPT. M
                                            </div>
                                            <div className="text-center mb-4">
                                                <div className="text-green-900 font-serif text-xs mb-2">SUBJECT CODE:</div>
                                                <div className="text-green-900 font-mono text-2xl font-bold tracking-wider border-4 border-green-900 p-3 bg-yellow-100">
                                                    R4UJ87JME
                                                </div>
                                            </div>
                                            <div className="text-green-700/50 font-serif text-xs space-y-1">
                                                <p>➤➤ SUBJECT: DOOR</p>
                                                <p>➤➤ ORIGEN: LAYERED</p>
                                                <p>➤➤ CLEARANCE: LEVEL</p>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Page Depth Shadow */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: currentPage > 0 ? 0.4 : 0 }}
                                    className="absolute left-1/2 top-4 w-1/2 h-[calc(100%-2rem)] bg-black/30 blur-xl -translate-x-1/2 pointer-events-none rounded-r-2xl"
                                />
                            </div>
                            
                            {/* Close Button - appears after answer page */}
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: currentPage >= 3 ? 1 : 0 }}
                                transition={{ delay: 1.5, duration: 0.3 }}
                                onClick={closeBook}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="absolute -bottom-20 left-1/2 -translate-x-1/2 px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg font-serif uppercase text-sm"
                            >
                                Close Book
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Answer Input Box */}
            {!solved && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-4 border-primary/50 rounded-lg p-6 bg-primary/10 space-y-4"
                >
                    <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => {
                            setUserAnswer(e.target.value);
                            setFeedback("");
                        }}
                        placeholder="Type your answer..."
                        disabled={solved}
                        className="w-full px-4 py-3 bg-black border-2 border-primary/50 rounded text-foreground font-['Press_Start_2P'] text-sm uppercase focus:outline-none focus:border-primary disabled:opacity-50"
                    />
                    <div className="flex justify-center">
                        <Button
                            onClick={handleSubmit}
                            disabled={solved || userAnswer.length === 0}
                            className="bg-primary hover:bg-primary/80 text-primary-foreground font-['Press_Start_2P'] px-8 py-2 text-xs uppercase"
                        >
                            Submit Answer
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* Feedback */}
            {feedback && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-center p-4 rounded-lg font-['Press_Start_2P'] text-xs ${
                        feedback.includes("✓")
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                    }`}
                >
                    {feedback}
                </motion.div>
            )}
        </motion.div>
    );
};
