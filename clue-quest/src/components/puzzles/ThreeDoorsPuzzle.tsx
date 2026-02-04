import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThreeDoorsPuzzleProps {
    onSolve?: (answer: string) => void;
    level?: number;
}

export const ThreeDoorsPuzzle = ({ onSolve, level = 11 }: ThreeDoorsPuzzleProps) => {
    const [doorStates, setDoorStates] = useState<[number, number, number]>([0, 0, 0]);
    const [firstDoorIndex, setFirstDoorIndex] = useState<number | null>(null);
    const [binaryCounter, setBinaryCounter] = useState(0);
    const [puzzleSolved, setPuzzleSolved] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [status, setStatus] = useState("Click any door to start binary counting...");
    const [statusType, setStatusType] = useState<"" | "success" | "error">("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [hint, setHint] = useState("Each door creates a unique binary counting pattern!");
    const [confetti, setConfetti] = useState<Array<{ id: number; left: string; color: string; size: string; duration: string }>>([]);

    // Sequence info for each door
    const sequenceInfo: { [key: number]: string } = {
        0: 'Door 1 sequence: 000→100→001→101→010→110→011→111',
        1: 'Door 2 sequence: 000→010→100→110→001→011→101→111',
        2: 'Door 3 sequence: 000→001→010→011→100→101→110→111'
    };

    // Winning patterns based on which door was clicked first
    // "Triangle has 3 sides"
    const winningPatterns: { [key: number]: [number, number, number] } = {
        0: [1, 0, 1],  // Door 1 first: 101
        1: [1, 1, 0],  // Door 2 first: 110
        2: [0, 1, 0]   // Door 3 first: 010
    };

    const isWinningState = (): boolean => {
        if (firstDoorIndex === null) return false;
        const target = winningPatterns[firstDoorIndex];
        return doorStates[0] === target[0] && 
               doorStates[1] === target[1] && 
               doorStates[2] === target[2];
    };

    const getWinningPattern = (): string => {
        if (firstDoorIndex === null) return "???";
        return winningPatterns[firstDoorIndex].join('');
    };

    const updateDoorsFromBinary = (counter: number, firstDoor: number): [number, number, number] => {
        // Convert binary counter to 3-bit representation
        const bit0 = (counter >> 0) & 1; // Least significant bit
        const bit1 = (counter >> 1) & 1; // Middle bit
        const bit2 = (counter >> 2) & 1; // Most significant bit
        
        let newStates: [number, number, number] = [0, 0, 0];
        
        if (firstDoor === 0) {
            // Door 1 clicked first: 000,100,001,101,010,110,011,111
            // Door1=bit0, Door3=bit1, Door2=bit2
            newStates[0] = bit0;  // Door 1
            newStates[1] = bit2;  // Door 2
            newStates[2] = bit1;  // Door 3
        } else if (firstDoor === 1) {
            // Door 2 clicked first: 000,010,100,110,001,011,101,111
            // Door2=bit0, Door1=bit1, Door3=bit2
            newStates[0] = bit1;  // Door 1
            newStates[1] = bit0;  // Door 2
            newStates[2] = bit2;  // Door 3
        } else if (firstDoor === 2) {
            // Door 3 clicked first (normal binary): 000,001,010,011,100,101,110,111
            // Door3=bit0, Door2=bit1, Door1=bit2
            newStates[0] = bit2;  // Door 1
            newStates[1] = bit1;  // Door 2
            newStates[2] = bit0;  // Door 3
        }
        
        return newStates;
    };

    const handleDoorClick = (doorIndex: number) => {
        if (puzzleSolved) return;

        if (!gameStarted) {
            // First click - start the sequence at step 1
            setFirstDoorIndex(doorIndex);
            setGameStarted(true);
            const newCounter = 1;
            setBinaryCounter(newCounter);
            
            const newStates = updateDoorsFromBinary(newCounter, doorIndex);
            setDoorStates(newStates);

            const binaryString = newStates.join('');
            setStatus(`${sequenceInfo[doorIndex]} - Current: ${binaryString} (step ${newCounter})`);
            setHint(`Following Door ${doorIndex + 1}'s unique pattern!`);
            return;
        }

        // If currently at winning pattern, clicking any door resets to 000
        if (isWinningState()) {
            setBinaryCounter(0);
            const newStates = updateDoorsFromBinary(0, firstDoorIndex!);
            setDoorStates(newStates);
            setStatus(`Sequence reset! Current: 000 (step 0). Find the triangle pattern!`);
            setStatusType('');
            setHint(`Following Door ${firstDoorIndex! + 1}'s unique pattern!`);
            return;
        }

        // Subsequent clicks - advance the counter
        const newCounter = binaryCounter + 1;
        // If counter exceeds 7, reset to 0
        const actualCounter = newCounter > 7 ? 0 : newCounter;
        setBinaryCounter(actualCounter);
        const newStates = updateDoorsFromBinary(actualCounter, firstDoorIndex!);
        setDoorStates(newStates);

        const binaryString = newStates.join('');
        const targetPattern = getWinningPattern();
        
        // Check if this new state is the winning pattern
        const target = winningPatterns[firstDoorIndex!];
        const isWin = newStates[0] === target[0] && newStates[1] === target[1] && newStates[2] === target[2];
        
        if (isWin) {
            setStatus(`🎉 Triangle found! Current: ${binaryString} - Click PROCEED to win!`);
            setStatusType('success');
            setHint('Click the PROCEED button now, or click a door to restart!');
        } else {
            setStatus(`Current: ${binaryString} (step ${actualCounter}). Find pattern ${targetPattern}!`);
            setStatusType('');
        }
    };

    const handleProceed = () => {
        if (puzzleSolved) return;
        
        // Only proceed if doors show the winning pattern for the first door clicked
        if (isWinningState()) {
            const binaryString = doorStates.join('');
            setPuzzleSolved(true);
            setStatus('🎉 PUZZLE SOLVED! 🎉');
            setStatusType('success');
            celebrate();
            setShowSuccess(true);

            setTimeout(() => {
                onSolve?.(binaryString);
            }, 2000);
        } else {
            const targetPattern = getWinningPattern();
            setStatus(`❌ Doors must show ${targetPattern} to proceed! Keep clicking...`);
            setStatusType('error');
        }
    };

    const resetPuzzle = () => {
        setPuzzleSolved(false);
        setDoorStates([0, 0, 0]);
        setFirstDoorIndex(null);
        setBinaryCounter(0);
        setGameStarted(false);
        setStatus("Click any door to start binary counting...");
        setStatusType('');
        setShowSuccess(false);
        setHint("Each door creates a unique binary counting pattern!");
    };

    const celebrate = () => {
        const colors = ['#d4af37', '#f0e6d2', '#c4941f', '#FFD700', '#90EE90'];
        const newConfetti: Array<{ id: number; left: string; color: string; size: string; duration: string }> = [];
        
        for (let i = 0; i < 150; i++) {
            newConfetti.push({
                id: i,
                left: `${Math.random() * 100}%`,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: `${Math.random() * 10 + 5}px`,
                duration: `${Math.random() * 2 + 2}s`
            });
        }
        setConfetti(newConfetti);

        setTimeout(() => setConfetti([]), 4000);
    };

    // Shoji Door Component
    const ShojiDoor = ({ index, isOpen }: { index: number; isOpen: boolean }) => {
        return (
            <div 
                className="relative cursor-pointer group"
                style={{ perspective: '2000px' }}
                onClick={() => handleDoorClick(index)}
            >
                {/* Door Label */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-amber-500 font-bold text-sm whitespace-nowrap z-10">
                    Door {index + 1}
                </div>

                {/* Door Track/Frame */}
                <div 
                    className={cn(
                        "w-[140px] h-[280px] md:w-[180px] md:h-[360px] border-4 rounded-lg relative overflow-hidden transition-all duration-300",
                        "bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]",
                        "border-[#5c4033] group-hover:border-[#8b6f47]",
                        "shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] group-hover:shadow-[inset_0_0_40px_rgba(212,175,55,0.3)]"
                    )}
                >
                    {/* Middle rail */}
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#5c4033] to-transparent" />

                    {/* The actual door panel that swings open */}
                    <motion.div
                        className="absolute inset-0 origin-left"
                        style={{ transformStyle: 'preserve-3d' }}
                        animate={{
                            rotateY: isOpen ? -90 : 0
                        }}
                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {/* Door Panel */}
                        <div 
                            className="w-full h-full rounded-lg relative"
                            style={{
                                background: 'linear-gradient(to bottom, #f5e6d3, #e8d5c0)',
                                border: '3px solid #5c4033',
                                boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.4)',
                                backfaceVisibility: 'hidden'
                            }}
                        >
                            {/* Inner border */}
                            <div className="absolute top-[5%] left-[5%] right-[5%] bottom-[5%] border border-[#8b6f47] pointer-events-none" />

                            {/* Lattice Grid - Top Half */}
                            <div className="absolute top-[8%] left-[8%] right-[8%] h-[40%] grid grid-cols-4 grid-rows-5 gap-[2px]">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <div 
                                        key={`top-${i}`} 
                                        className="bg-white/50 border border-[#8b6f47] relative"
                                    >
                                        <div className="absolute w-[1px] h-full left-1/2 top-0 bg-[#8b6f47]" />
                                        <div className="absolute w-full h-[1px] left-0 top-1/2 bg-[#8b6f47]" />
                                    </div>
                                ))}
                            </div>

                            {/* Lattice Grid - Bottom Half */}
                            <div className="absolute bottom-[8%] left-[8%] right-[8%] h-[40%] grid grid-cols-4 grid-rows-5 gap-[2px]">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <div 
                                        key={`bottom-${i}`} 
                                        className="bg-white/50 border border-[#8b6f47] relative"
                                    >
                                        <div className="absolute w-[1px] h-full left-1/2 top-0 bg-[#8b6f47]" />
                                        <div className="absolute w-full h-[1px] left-0 top-1/2 bg-[#8b6f47]" />
                                    </div>
                                ))}
                            </div>

                            {/* Door Handle */}
                            <div 
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-12 rounded-md"
                                style={{
                                    background: 'linear-gradient(to right, #2a2a2a, #4a4a4a, #2a2a2a)',
                                    boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.4)'
                                }}
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#1a1a1a] rounded-full" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    };

    return (
        <div 
            className="w-full h-full flex flex-col items-center justify-center p-4 overflow-hidden relative"
            style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
            }}
        >
            {/* Puzzle Frame */}
            <div 
                className="relative p-4 md:p-8 rounded-2xl overflow-hidden"
                style={{
                    background: 'linear-gradient(to bottom, #2a1810, #1a0f08)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)'
                }}
            >
                {/* Frame border */}
                <div className="absolute top-2 left-2 right-2 bottom-2 border-2 border-[#8b4513] rounded-xl pointer-events-none z-0" />

                {/* Three Doors */}
                <div className="flex gap-3 md:gap-6 justify-center items-center relative z-10 mb-4">
                    <ShojiDoor index={0} isOpen={doorStates[0] === 1} />
                    <ShojiDoor index={1} isOpen={doorStates[1] === 1} />
                    <ShojiDoor index={2} isOpen={doorStates[2] === 1} />
                </div>

                {/* Proceed Button - always visible */}
                <div className="mt-3 flex flex-col items-center gap-2">
                    <button
                        onClick={handleProceed}
                        disabled={puzzleSolved}
                        className={cn(
                            "px-6 py-2 rounded-lg font-bold text-sm transition-all",
                            "bg-[#d4af37] text-[#1a0f08] hover:bg-[#FFD700]",
                            puzzleSolved && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        PROCEED
                    </button>
                </div>
            </div>

            {/* Confetti Celebration */}
            <div className="fixed inset-0 pointer-events-none z-50">
                {confetti.map((c, i) => (
                    <motion.div
                        key={c.id}
                        className="absolute"
                        initial={{ 
                            top: -20,
                            left: c.left,
                            opacity: 1,
                            rotate: 0
                        }}
                        animate={{ 
                            top: '100vh',
                            opacity: 0,
                            rotate: 720
                        }}
                        transition={{ 
                            duration: parseFloat(c.duration),
                            delay: i * 0.02,
                            ease: 'linear'
                        }}
                        style={{
                            width: c.size,
                            height: c.size,
                            background: c.color,
                        }}
                    />
                ))}
            </div>

            {/* Success Message */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', damping: 15 }}
                        className="fixed inset-0 flex items-center justify-center z-[100] bg-black/50"
                    >
                        <div 
                            className="px-8 py-8 md:px-12 md:py-10 rounded-2xl text-center"
                            style={{
                                background: 'rgba(42, 24, 16, 0.98)',
                                border: '4px solid #d4af37',
                                boxShadow: '0 0 60px rgba(212, 175, 55, 0.7)'
                            }}
                        >
                            <div className="text-2xl md:text-4xl text-[#f0e6d2] font-serif">
                                🎉 PUZZLE SOLVED! 🎉
                            </div>
                            <div className="text-base md:text-lg text-[#d4af37] mt-4">
                                Binary 111 = Decimal 7
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ThreeDoorsPuzzle;
