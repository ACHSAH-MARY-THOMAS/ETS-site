import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Terminal, File, Trash, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import BookReveal from './BookReveal';

// Constants
const DECOY_IMAGES = [
    '/dr-doom.png',
    '/dr-doom-latest.png',
    '/download.jpg',
    '/morse-code.jpeg',
    '/intro-bg.png',
    '/Gemini_Generated_Image_jjpkfujjpkfujjpk-removebg-preview.png',
    '/dr-doom-4k.png',
    '/dr-doom-4k-removebg-preview.png',
    '/placeholder.svg',
];

interface DesktopPuzzleProps {
    puzzle: {
        question: string;
        answer: string;
    };
    onCorrectAnswer: () => void;
    onWrongAnswer: () => void;
}

interface FileItem {
    id: string;
    name: string;
    type: 'file' | 'bin';
    content?: string;
}

interface ClickZone {
    x: number; // percentage
    y: number; // percentage
    w: number; // percentage
    h: number; // percentage
    content: string;
    isTarget: boolean;
}

const DesktopPuzzle = ({ puzzle, onCorrectAnswer, onWrongAnswer }: DesktopPuzzleProps) => {
    const [answer, setAnswer] = useState('');
    const [files, setFiles] = useState<FileItem[]>([]);
    const [openFile, setOpenFile] = useState<FileItem | null>(null);
    const [showLibrary, setShowLibrary] = useState(false);

    // Book Reveal State
    const [bookReveal, setBookReveal] = useState<{ isOpen: boolean; content: string; isTarget: boolean; startPos: { x: number; y: number } }>({
        isOpen: false,
        content: '',
        isTarget: false,
        startPos: { x: 0, y: 0 }
    });

    const libraryRef = useRef<HTMLDivElement>(null);

    // Initialize files
    useEffect(() => {
        const fileNames = [
            'sys_log.txt', 'dump_01', 'temp_x', 'check garbage bin', 'y_data', 'config', 'user_a',
            'cache_v', 'bin_check', 'check garbage bin', 'x_files', 'sys_32', 'garbage bin', 'run_exe',
            'data_z', 'audit_log', 'temp_02', 'kernel_panic', 'doomsday_notes', 'doom_v1', 'boot_seq'
        ];

        const newFiles: FileItem[] = fileNames.map((name, index) => ({
            id: `file-${index}`,
            name: name,
            type: name.includes('garbage bin') && name !== 'check garbage bin' ? 'bin' : 'file',
            content: name === 'garbage bin'
                ? '/boy-library.jpeg'
                : DECOY_IMAGES[Math.floor(Math.random() * DECOY_IMAGES.length)]
        }));

        setFiles(newFiles);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Check for 'GATWAY' (from the book) or 'ABIN' (from original puzzle)
        const userAnswer = answer.toUpperCase().trim();
        if (userAnswer === 'GATWAY' || userAnswer === 'ABIN') {
            onCorrectAnswer();
        } else {
            onWrongAnswer();
            setAnswer('');
        }
    };

    const handleFileClick = (file: FileItem) => {
        if (file.type === 'bin') {
            setShowLibrary(true);
        } else {
            setOpenFile(file);
        }
    };

    const handleLibraryClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!libraryRef.current) return;

        const rect = libraryRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Define zones based on the provided image description
        // Navy blue book is in the bookshelf on the LEFT side
        // Specifically in the upper-middle shelves

        let clickedZone: ClickZone | null = null;

        // Target Zone: Navy blue book in the bookshelf
        // Left side bookshelf: X: 0-30%, Navy blue books are around Y: 20-45%
        if (x < 30 && y > 20 && y < 45) {
            clickedZone = { x, y, w: 0, h: 0, content: 'GATWAY', isTarget: true };
        }
        // No decoy zone - only the navy blue book can be clicked

        if (clickedZone) {
            setBookReveal({
                isOpen: true,
                content: clickedZone.content,
                isTarget: clickedZone.isTarget,
                startPos: { x: e.clientX, y: e.clientY }
            });
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="bg-secondary/50 px-4 py-3 border-b border-border flex items-center gap-3 rounded-sm">
                <Terminal className="h-4 w-4 text-primary" />
                <span className="text-xs uppercase tracking-[0.2em] text-primary font-bold">
                    Security Layer 15
                </span>
                <span className="text-muted-foreground text-xs">// SYSTEM BREACH DETECTED</span>
            </div>

            {/* Question */}
            <div className="glass-card p-4 rounded-sm">
                <p className="text-foreground leading-relaxed text-lg font-mono">
                    {puzzle.question}
                </p>
            </div>

            {/* Desktop Environment */}
            <div className="relative border border-primary/30 rounded-md overflow-hidden bg-[#000000] h-[500px] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 10% 20%, rgba(0, 50, 255, 0.1) 0%, transparent 20%), 
                                         radial-gradient(circle at 90% 80%, rgba(255, 0, 50, 0.1) 0%, transparent 20%)`
                    }}
                />

                {/* Files Grid */}
                <div className="grid grid-cols-3 gap-4 p-6 relative z-10 selection:bg-transparent overflow-y-auto h-full pr-2 scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-transparent hover:scrollbar-thumb-primary/60">
                    {files.map((file) => (
                        <div
                            key={file.id}
                            onClick={() => handleFileClick(file)}
                            className="flex flex-col items-center justify-center p-2 gap-2 cursor-pointer hover:bg-white/5 rounded-lg transition-colors group"
                        >
                            <div className="relative">
                                {/* Custom Yellow Folder Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="#fbbf24"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    className="w-12 h-12 drop-shadow-lg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                                </svg>
                                {file.type === 'bin' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-[8px] font-bold text-black/50 uppercase tracking-tighter">BIN</span>
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-primary/80 font-mono text-center break-all px-1 group-hover:text-primary bg-black/50 rounded px-2 py-0.5">
                                {file.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Input Section */}
            <form onSubmit={handleSubmit} className="flex gap-4">
                <Input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="ENTER DECRYPTION KEY..."
                    className="flex-1 bg-black/50 border-primary/50 text-foreground font-mono placeholder:text-muted-foreground focus-visible:ring-primary"
                    autoFocus
                />
                <Button type="submit" variant="default" size="lg">
                    EXECUTE
                </Button>
            </form>

            {/* Decoy File Modal */}
            <Dialog open={!!openFile} onOpenChange={(open) => !open && setOpenFile(null)}>
                <DialogContent className="bg-black/95 border-primary p-0 max-w-3xl overflow-hidden">
                    <DialogHeader className="p-4 border-b border-primary/30 flex flex-row items-center justify-between">
                        <DialogTitle className="text-primary font-mono flex items-center gap-2">
                            <File className="w-4 h-4" />
                            {openFile?.name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-0 bg-zinc-900/50 flex items-center justify-center min-h-[400px]">
                        {openFile?.content && (
                            <img
                                src={openFile.content}
                                alt="File Content"
                                className="max-w-full max-h-[60rem] object-contain shadow-2xl opacity-80"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Library Interaction Modal (Full Screen Overlay) */}
            {showLibrary && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-5xl aspect-video bg-black border border-primary/20 shadow-2xl overflow-hidden rounded-lg">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowLibrary(false)}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors border border-white/10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div
                            ref={libraryRef}
                            className="w-full h-full relative cursor-default"
                            onClick={handleLibraryClick}
                        >
                            <img
                                src="/boy-library.jpeg"
                                alt="Library Archive"
                                className="w-full h-full object-contain pointer-events-none"
                            />

                            {/* Invisible Click Zones Visualization (Dev only - remove opacity in prod) */}
                            {/* <div className="absolute top-0 left-0 w-[35%] h-full bg-red-500/20 pointer-events-none" /> */}
                            {/* <div className="absolute top-[60%] left-[60%] w-[25%] h-[30%] bg-green-500/20 pointer-events-none" /> */}
                        </div>

                        {/* Hint Text */}
                        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                            <span className="bg-black/80 px-4 py-2 text-primary/50 text-xs font-mono uppercase tracking-widest border border-primary/10 rounded-full">
                                ARCHIVE VIEW // SEARCH ACTIVE
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Book Reveal Animation */}
            <BookReveal
                isOpen={bookReveal.isOpen}
                onClose={() => setBookReveal(prev => ({ ...prev, isOpen: false }))}
                content={bookReveal.content}
                isTarget={bookReveal.isTarget}
                startPos={bookReveal.startPos}
            />
        </div>
    );
};

export default DesktopPuzzle;
