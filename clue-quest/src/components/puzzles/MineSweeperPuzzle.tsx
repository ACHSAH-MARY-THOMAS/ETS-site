import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bomb, Flag, Target, RotateCcw, Footprints, Lightbulb, Skull, Trophy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface MineSweeperPuzzleProps {
    onSolve?: (answer: string) => void;
    level?: number;
}

const GRID_SIZE = 8;
const START_POS = { row: 7, col: 0 }; // Bottom-left
const END_POS = { row: 0, col: 7 }; // Top-right
const MINE_COUNT = 15; // Number of mines to place

// BFS to check if a valid path exists from start to end
const hasValidPath = (mines: Set<string>): boolean => {
    const visited = new Set<string>();
    const queue: { row: number; col: number }[] = [START_POS];
    visited.add(`${START_POS.row},${START_POS.col}`);
    
    while (queue.length > 0) {
        const current = queue.shift()!;
        
        if (current.row === END_POS.row && current.col === END_POS.col) {
            return true;
        }
        
        // Check all 8 adjacent cells
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                
                const nr = current.row + dr;
                const nc = current.col + dc;
                const key = `${nr},${nc}`;
                
                if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE &&
                    !visited.has(key) && !mines.has(key)) {
                    visited.add(key);
                    queue.push({ row: nr, col: nc });
                }
            }
        }
    }
    
    return false;
};

// Generate random mines ensuring a valid path exists
const generateRandomMines = (): Set<string> => {
    const startKey = `${START_POS.row},${START_POS.col}`;
    const endKey = `${END_POS.row},${END_POS.col}`;
    
    // Create a list of all possible positions except start and end
    const allPositions: string[] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const key = `${row},${col}`;
            if (key !== startKey && key !== endKey) {
                allPositions.push(key);
            }
        }
    }
    
    // Keep trying until we get a valid configuration
    let attempts = 0;
    while (attempts < 100) {
        // Shuffle positions
        for (let i = allPositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
        }
        
        // Place mines
        const testMines = new Set<string>();
        for (let i = 0; i < MINE_COUNT && i < allPositions.length; i++) {
            testMines.add(allPositions[i]);
        }
        
        // Check if a valid path exists
        if (hasValidPath(testMines)) {
            return testMines;
        }
        
        attempts++;
    }
    
    // Fallback: return mines with guaranteed path
    return new Set<string>();
};

const ANSWER = "SAFEPATH";

export const MineSweeperPuzzle = ({ onSolve, level = 14 }: MineSweeperPuzzleProps) => {
    const [mines, setMines] = useState<Set<string>>(() => generateRandomMines());
    const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set());
    const [flaggedCells, setFlaggedCells] = useState<Set<string>>(new Set());
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [exploded, setExploded] = useState(false);
    const [explosionPos, setExplosionPos] = useState<{row: number, col: number} | null>(null);
    const [clickCount, setClickCount] = useState(0);
    const [gameKey, setGameKey] = useState(0);

    // Calculate adjacent mine count for a cell
    const getAdjacentMineCount = useCallback((row: number, col: number): number => {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = row + dr;
                const nc = col + dc;
                if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
                    if (mines.has(`${nr},${nc}`)) count++;
                }
            }
        }
        return count;
    }, [mines]);

    // Flood fill to reveal adjacent cells when clicking on a 0
    const floodFill = useCallback((row: number, col: number, revealed: Set<string>) => {
        const cellKey = `${row},${col}`;
        
        if (revealed.has(cellKey) || mines.has(cellKey) || flaggedCells.has(cellKey)) {
            return;
        }
        
        revealed.add(cellKey);
        
        // If this cell has adjacent mines, stop here
        const adjacentMines = getAdjacentMineCount(row, col);
        if (adjacentMines > 0) {
            return;
        }
        
        // Otherwise, recursively reveal adjacent cells
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = row + dr;
                const nc = col + dc;
                if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
                    floodFill(nr, nc, revealed);
                }
            }
        }
    }, [mines, flaggedCells, getAdjacentMineCount]);

    // Handle cell click - reveal cell
    const handleCellClick = (row: number, col: number, e?: React.MouseEvent) => {
        if (gameOver || won) return;
        
        const cellKey = `${row},${col}`;
        
        // Right click to flag
        if (e && e.button === 2) {
            e.preventDefault();
            if (!revealedCells.has(cellKey)) {
                const newFlagged = new Set(flaggedCells);
                if (flaggedCells.has(cellKey)) {
                    newFlagged.delete(cellKey);
                } else {
                    newFlagged.add(cellKey);
                }
                setFlaggedCells(newFlagged);
            }
            return;
        }
        
        // Can't click revealed or flagged cells
        if (revealedCells.has(cellKey) || flaggedCells.has(cellKey)) return;
        
        setClickCount(prev => prev + 1);
        
        // Check if stepping on a mine
        if (mines.has(cellKey)) {
            setExploded(true);
            setExplosionPos({ row, col });
            setGameOver(true);
            // Reveal all mines
            setRevealedCells(new Set([...revealedCells, ...mines]));
            return;
        }
        
        // Reveal cell and flood fill if it's a 0
        const newRevealed = new Set(revealedCells);
        floodFill(row, col, newRevealed);
        setRevealedCells(newRevealed);
        
        // Check win condition - all non-mine cells revealed or reached goal
        const totalCells = GRID_SIZE * GRID_SIZE;
        const isGoalRevealed = newRevealed.has(`${END_POS.row},${END_POS.col}`);
        const allSafeRevealed = newRevealed.size >= totalCells - mines.size;
        
        if (isGoalRevealed || allSafeRevealed) {
            setWon(true);
            setGameOver(true);
            setTimeout(() => {
                onSolve?.(ANSWER);
            }, 2000);
        }
    };

    // Reset game with NEW random mines
    const handleReset = () => {
        const newMines = generateRandomMines();
        setMines(newMines);
        setRevealedCells(new Set());
        setFlaggedCells(new Set());
        setGameOver(false);
        setWon(false);
        setExploded(false);
        setExplosionPos(null);
        setClickCount(0);
        setGameKey(prev => prev + 1);
    };

    // Get cell display content
    const getCellContent = (row: number, col: number) => {
        const cellKey = `${row},${col}`;
        const isEnd = END_POS.row === row && END_POS.col === col;
        const isRevealed = revealedCells.has(cellKey);
        const isMine = mines.has(cellKey);
        const isFlagged = flaggedCells.has(cellKey);
        const isExplosion = explosionPos?.row === row && explosionPos?.col === col;
        const adjacentMines = getAdjacentMineCount(row, col);
        
        if (isExplosion) {
            return (
                <motion.div
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: [1, 1.5, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full flex items-center justify-center bg-red-600"
                >
                    <Skull className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </motion.div>
            );
        }
        
        if (gameOver && isMine && !isExplosion) {
            return (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-full h-full flex items-center justify-center bg-red-900/50"
                >
                    <Bomb className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                </motion.div>
            );
        }
        
        if (isFlagged && !isRevealed) {
            return (
                <div className="w-full h-full flex items-center justify-center bg-orange-600/30">
                    <Flag className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
                </div>
            );
        }
        
        if (isEnd && isRevealed) {
            return (
                <motion.div
                    animate={{ 
                        boxShadow: won 
                            ? ["0 0 0px rgba(0,255,0,0)", "0 0 20px rgba(0,255,0,0.8)", "0 0 0px rgba(0,255,0,0)"]
                            : ["0 0 0px rgba(59,130,246,0)", "0 0 15px rgba(59,130,246,0.6)", "0 0 0px rgba(59,130,246,0)"]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className={cn(
                        "w-full h-full flex items-center justify-center",
                        won ? "bg-green-600" : "bg-blue-600/50"
                    )}
                >
                    <Target className={cn("w-4 h-4 md:w-5 md:h-5", won ? "text-white" : "text-blue-200")} />
                </motion.div>
            );
        }
        
        if (isRevealed) {
            return (
                <div className={cn(
                    "w-full h-full flex items-center justify-center text-[10px] md:text-xs font-bold bg-zinc-700/50",
                    adjacentMines === 0 ? "text-gray-500" :
                    adjacentMines === 1 ? "text-blue-400" :
                    adjacentMines === 2 ? "text-green-400" :
                    adjacentMines === 3 ? "text-yellow-400" :
                    "text-red-400"
                )}>
                    {adjacentMines > 0 ? adjacentMines : ""}
                </div>
            );
        }
        
        return null;
    };

    return (
        <div key={gameKey} className="w-full flex-1 min-h-0 glass-card-glow rounded-sm overflow-hidden transition-all duration-300 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-secondary/60 to-secondary/40 px-5 py-3.5 border-b-2 border-primary/30 flex items-center gap-3 flex-shrink-0 shadow-lg relative">
                <Terminal className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm uppercase tracking-[0.25em] text-primary font-bold">
                    Security Layer {level.toString().padStart(2, '0')}
                </span>
            </div>

            {/* Content */}
            <div className="px-3 py-2 space-y-1 flex flex-col flex-1 min-h-0 overflow-y-auto w-full">
                {/* Question Header */}
                <div className="space-y-1 flex flex-col flex-shrink-0">
                    <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2 py-1 border-l-2 border-primary/50 pl-3 bg-primary/5 flex-shrink-0">
                        <span className="text-primary font-bold text-sm">&gt;</span> 
                        <span className="text-primary/90 font-semibold">MINEFIELD ESCAPE</span>
                    </div>
                </div>

            {/* Game Stats */}
            <div className="flex justify-center gap-4 py-2 mt-2 text-[10px] flex-shrink-0 bg-black/20 rounded border border-primary/10">
                <div className="flex items-center gap-1 text-primary">
                    <Target className="w-3 h-3" />
                    <span>Clicks: {clickCount}</span>
                </div>
                <div className="flex items-center gap-1 text-red-400">
                    <Bomb className="w-3 h-3" />
                    <span>Mines: {MINE_COUNT}</span>
                </div>
                <div className="flex items-center gap-1 text-blue-400">
                    <Flag className="w-3 h-3" />
                    <span>Flagged: {flaggedCells.size}</span>
                </div>
                <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-hidden">
                {/* Game Status */}
                <AnimatePresence>
                    {exploded && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mb-2 p-2 bg-red-900/50 border border-red-500 rounded text-center"
                        >
                            <div className="flex items-center justify-center gap-2 text-red-400 text-[10px] md:text-xs">
                                <Bomb className="w-4 h-4" />
                                <span>BOOM! You stepped on a mine!</span>
                            </div>
                            <button
                                onClick={handleReset}
                                className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-[8px] rounded transition-colors"
                            >
                                Try Again (New Minefield)
                            </button>
                        </motion.div>
                    )}
                    
                    {won && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-2 p-2 bg-green-900/50 border border-green-500 rounded text-center"
                        >
                            <div className="flex items-center justify-center gap-2 text-green-400 text-[10px] md:text-xs">
                                <Trophy className="w-4 h-4" />
                                <span>SUCCESS! You found the safe path!</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Grid */}
                <div 
                    className="bg-zinc-900 p-2 rounded border border-primary/30"
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <div
                        className="grid gap-0.5"
                        style={{
                            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                        }}
                    >
                        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                            const row = Math.floor(index / GRID_SIZE);
                            const col = index % GRID_SIZE;
                            const cellKey = `${row},${col}`;
                            const isRevealed = revealedCells.has(cellKey);
                            const isFlagged = flaggedCells.has(cellKey);
                            const canClick = !gameOver && !isRevealed && !isFlagged;
                            
                            return (
                                <motion.div
                                    key={cellKey}
                                    onClick={(e) => handleCellClick(row, col, e)}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        handleCellClick(row, col, { ...e, button: 2 } as React.MouseEvent);
                                    }}
                                    whileHover={canClick ? { scale: 1.05 } : {}}
                                    whileTap={canClick ? { scale: 0.95 } : {}}
                                    className={cn(
                                        "w-8 h-8 md:w-10 md:h-10 border border-zinc-700 flex items-center justify-center transition-all duration-200",
                                        canClick && "cursor-pointer hover:border-primary/50 hover:bg-zinc-700",
                                        isRevealed && "bg-zinc-800/50",
                                        !isRevealed && "bg-zinc-800"
                                    )}
                                >
                                    {getCellContent(row, col)}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-3 flex flex-wrap justify-center gap-3 text-[7px] md:text-[8px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-600/50 border border-blue-400/50 flex items-center justify-center">
                            <Target className="w-2 h-2 text-blue-200" />
                        </div>
                        <span>Goal</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-orange-600/30 border border-orange-400/50 flex items-center justify-center">
                            <Flag className="w-2 h-2 text-orange-400" />
                        </div>
                        <span>Flag (Right-click)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-blue-400">1</span>
                        <span className="text-green-400">2</span>
                        <span className="text-yellow-400">3</span>
                        <span className="text-red-400">4+</span>
                        <span>= Adjacent mines</span>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-2 text-[7px] md:text-[8px] text-muted-foreground text-center max-w-md">
                    <p>Click cells to reveal. Numbers show adjacent mine count.</p>
                    <p>Right-click to flag mines. Find the <span className="text-blue-400">Goal</span> without hitting a mine!</p>
                </div>
            </div>
            </div>
        </div>
    );
};

export default MineSweeperPuzzle;
