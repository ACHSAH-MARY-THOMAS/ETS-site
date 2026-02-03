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

    // Hexagon grid - honeycomb pattern (7 hexagons)
    // Layout:
    //     0
    //   1   2
    // 3   4   5
    //     6
    const hexagons: Hexagon[] = [
        { id: 0, row: 0, col: 1, x: 150, y: 0 },
        { id: 1, row: 1, col: 0, x: 75, y: 85 },
        { id: 2, row: 1, col: 2, x: 225, y: 85 },
        { id: 3, row: 2, col: 0, x: 0, y: 170 },
        { id: 4, row: 2, col: 1, x: 150, y: 170 },
        { id: 5, row: 2, col: 2, x: 300, y: 170 },
        { id: 6, row: 3, col: 1, x: 150, y: 255 },
    ];

    // Winning combination: hexagons that form a triangle and provide maximum light
    // Triangle formed by: 1, 2, 4 (top-left, top-right, center-bottom)
    const winningCombination = [1, 2, 4];

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
                // Check if it's the winning combination
                const litArray = Array.from(newLitHexagons).sort();
                const isWinning = litArray.every((id, idx) => id === winningCombination[idx]);
                
                if (isWinning) {
                    setSolved(true);
                    setFeedback("✨ PERFECT TRIANGLE! MAXIMUM LIGHT ACHIEVED!");
                    if (onSolve) onSolve("triangle");
                } else {
                    setFeedback("❌ Insufficient coverage. Try a different configuration.");
                }
            }
        }
        
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
                                                    x1={hex1.x + 40}
                                                    y1={hex1.y + 40}
                                                    x2={hex2.x + 40}
                                                    y2={hex2.y + 40}
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
                                        d={getHexagonPath(hex.x + 40, hex.y + 40)}
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
                                        cx={hex.x + 40}
                                        cy={hex.y + 40}
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