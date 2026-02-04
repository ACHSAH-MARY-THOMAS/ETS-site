import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lightbulb, Terminal } from "lucide-react";

interface FloorPlanPuzzleProps {
    onSolve?: (answer: string) => void;
    level?: number;
}

interface Hexagon {
    id: number;
    row: number;
    col: number;
    x: number;
    y: number;
}

export const FloorPlanPuzzle = ({ onSolve, level = 10 }: FloorPlanPuzzleProps) => {
    const [litHexagons, setLitHexagons] = useState<Set<number>>(new Set());
    const [feedback, setFeedback] = useState("");
    const [solved, setSolved] = useState(false);

    // Hexagon grid - flower pattern (1 center, 6 surrounding)
    // 0: Center
    // 1: Top
    // 2: Top Right
    // 3: Bottom Right
    // 4: Bottom
    // 5: Bottom Left
    // 6: Top Left
    const r = 45;
    const dist = r * Math.sqrt(3); // ~78
    const cx = 175;
    const cy = 155;
    
    // Helper to calc slight offsets if needed, but standard hex grid math:
    // 30 degrees = PI/6
    const dx = dist * Math.cos(Math.PI / 6); // dist * 0.866
    const dy = dist * Math.sin(Math.PI / 6); // dist * 0.5

    const hexagons: Hexagon[] = [
        { id: 0, row: 1, col: 1, x: cx, y: cy },                     // Center
        { id: 1, row: 0, col: 1, x: cx, y: cy - dist },              // Top
        { id: 2, row: 0, col: 2, x: cx + dx, y: cy - dy },           // Top Right
        { id: 3, row: 2, col: 2, x: cx + dx, y: cy + dy },           // Bottom Right
        { id: 4, row: 2, col: 1, x: cx, y: cy + dist },              // Bottom
        { id: 5, row: 2, col: 0, x: cx - dx, y: cy + dy },           // Bottom Left
        { id: 6, row: 0, col: 0, x: cx - dx, y: cy - dy },           // Top Left
    ];

    // Winning combinations: alternating outer hexagons (equilateral triangles)
    // Option A: 1 (Top), 3 (Bot Right), 5 (Bot Left)
    // Option B: 2 (Top Right), 4 (Bottom), 6 (Top Left)
    const winningCombinations = [
        [1, 3, 5],
        [2, 4, 6]
    ];

    const handleHexagonClick = (hexId: number) => {
        if (solved) return;

        const newLitHexagons = new Set(litHexagons);
        
        if (newLitHexagons.has(hexId)) {
            // Turn off if already lit
            newLitHexagons.delete(hexId);
            setFeedback("");
        } else if (newLitHexagons.size < 3) {
            // Can only light up to 3
            newLitHexagons.add(hexId);
            
            // Check if we have 3 lights
            if (newLitHexagons.size === 3) {
                // Check if it's a winning combination
                const litArray = Array.from(newLitHexagons).sort((a, b) => a - b);
                
                const isWinning = winningCombinations.some(combo => {
                    const sortedCombo = [...combo].sort((a, b) => a - b);
                    return JSON.stringify(litArray) === JSON.stringify(sortedCombo);
                });
                
                if (isWinning) {
                    setSolved(true);
                    setFeedback("✨ PERFECT TRIANGLE! MAXIMUM LIGHT ACHIEVED!");
                    if (onSolve) onSolve("triangle");
                } else {
                    setFeedback("❌ Insufficient coverage. Try a different configuration.");
                }
            }
        }

        setLitHexagons(newLitHexagons);
    };

    const resetPuzzle = () => {
        setLitHexagons(new Set());
        setFeedback("");
        setSolved(false);
    };

    // Draw hexagon path for SVG
    const getHexagonPath = (centerX: number, centerY: number, size: number = 40) => {
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const x = centerX + size * Math.cos(angle);
            const y = centerY + size * Math.sin(angle);
            points.push(`${x},${y}`);
        }
        return `M ${points.join(" L ")} Z`;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-4xl mx-auto space-y-6"
        >
            {/* Security Layer Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-card-glow rounded-lg p-4 mb-6"
            >
                <div className="flex items-center gap-3 mb-3">
                    <Terminal className="text-primary" size={24} />
                    <h2 className="font-['Press_Start_2P'] text-sm text-primary">
                        Security Layer {level?.toString().padStart(2, '0')}
                    </h2>
                </div>
                <p className="font-['Press_Start_2P'] text-[10px] text-primary/90 leading-relaxed">
                    THE HELPER HAS THREE LIGHTS
                </p>
                <p className="font-['Press_Start_2P'] text-[10px] text-primary/90 leading-relaxed mt-2">
                    WHERE SHOULD HE PLACE ALL 3 TO GET MAXIMUM LIGHT?
                </p>
            </motion.div>

            {/* Hexagon Pattern */}
            <div className="glass-card-glow rounded-lg p-8">
                <div className="relative w-full max-w-md mx-auto" style={{ height: "350px" }}>
                    <svg
                        viewBox="0 0 350 310"
                        className="w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Draw connecting lines first (behind hexagons) */}
                        {litHexagons.size === 3 && (
                            <g className="animate-pulse">
                                {Array.from(litHexagons).map((id1, idx1) => {
                                    return Array.from(litHexagons)
                                        .slice(idx1 + 1)
                                        .map((id2) => {
                                            const hex1 = hexagons.find(h => h.id === id1);
                                            const hex2 = hexagons.find(h => h.id === id2);
                                            if (!hex1 || !hex2) return null;
                                            return (
                                                <line
                                                    key={`${id1}-${id2}`}
                                                    x1={hex1.x}
                                                    y1={hex1.y}
                                                    x2={hex2.x}
                                                    y2={hex2.y}
                                                    stroke={solved ? "#22c55e" : "#eab308"}
                                                    strokeWidth="3"
                                                    strokeDasharray={solved ? "0" : "5,5"}
                                                />
                                            );
                                        });
                                })}
                            </g>
                        )}

                        {/* Draw hexagons */}
                        {hexagons.map((hex) => {
                            const isLit = litHexagons.has(hex.id);
                            
                            return (
                                <g key={hex.id}>
                                    <motion.path
                                        d={getHexagonPath(hex.x, hex.y)}
                                        fill={isLit ? (solved ? "#22c55e" : "#eab308") : "#1f2937"}
                                        stroke={isLit ? (solved ? "#22c55e" : "#facc15") : "#4b5563"}
                                        strokeWidth="2"
                                        onClick={() => handleHexagonClick(hex.id)}
                                        className="cursor-pointer transition-all duration-300"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        style={{
                                            filter: isLit
                                                ? `drop-shadow(0 0 10px ${solved ? "#22c55e" : "#facc15"})`
                                                : "none",
                                        }}
                                    />
                                    {/* Light bulb dot in center */}
                                    <circle
                                        cx={hex.x}
                                        cy={hex.y}
                                        r={isLit ? 12 : 6}
                                        fill={isLit ? (solved ? "#ffffff" : "#fef08a") : "#6b7280"}
                                        className="pointer-events-none"
                                    >
                                        {isLit && (
                                            <animate
                                                attributeName="opacity"
                                                values="1;0.5;1"
                                                dur="1s"
                                                repeatCount="indefinite"
                                            />
                                        )}
                                    </circle>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>

            {/* Progress & Controls */}
            <div className="space-y-4">
                <div className="flex items-center justify-between glass-card rounded-lg p-4">
                    <div className="font-['Press_Start_2P'] text-[10px] text-primary">
                        LIGHTS PLACED: {litHexagons.size} / 3
                    </div>
                    <Button
                        onClick={resetPuzzle}
                        disabled={solved}
                        variant="outline"
                        className="font-['Press_Start_2P'] text-[8px] uppercase hover:bg-primary/10"
                    >
                        RESET
                    </Button>
                </div>

                {/* Feedback */}
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`text-center text-xs font-['Press_Start_2P'] p-3 rounded border-2 ${
                                solved
                                    ? "bg-green-500/20 text-green-400 border-green-500"
                                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500"
                            }`}
                        >
                            {feedback}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};