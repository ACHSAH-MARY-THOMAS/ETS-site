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
    const [hoveredHex, setHoveredHex] = useState<number | null>(null);
    const [solved, setSolved] = useState(false);

    // Large asymmetric honeycomb - proper alternating offset
    const r = 30; // UPDATED: Increased Hexagon radius
    const vDist = r * 1.5; // Vertical distance for perfectly touching hexagons
    const hDist = r * Math.sqrt(3); // Horizontal distance for perfectly touching hexagons
    const cx = 350; // UPDATED: Centered horizontally in 700px viewBox
    const cy = 270; // UPDATED: Centered vertically (shifted down to prevent clipping top)
    
    // 8-layer honeycomb with proper alternating offset (41 total hexagons - odd number)
    const hexagons: Hexagon[] = [
        // Layer 0: Top 5 hexagons (no offset)
        { id: 0, row: 0, col: 0, x: cx - hDist * 2, y: cy - vDist * 5 },
        { id: 1, row: 0, col: 1, x: cx - hDist, y: cy - vDist * 5 },
        { id: 2, row: 0, col: 2, x: cx, y: cy - vDist * 5 },
        { id: 3, row: 0, col: 3, x: cx + hDist, y: cy - vDist * 5 },
        { id: 4, row: 0, col: 4, x: cx + hDist * 2, y: cy - vDist * 5 },
        
        // Layer 1: 6 hexagons (OFFSET by -0.5)
        { id: 5, row: 1, col: 0, x: cx - hDist * 2.5, y: cy - vDist * 4 },
        { id: 6, row: 1, col: 1, x: cx - hDist * 1.5, y: cy - vDist * 4 },
        { id: 7, row: 1, col: 2, x: cx - hDist * 0.5, y: cy - vDist * 4 },
        { id: 8, row: 1, col: 3, x: cx + hDist * 0.5, y: cy - vDist * 4 },
        { id: 9, row: 1, col: 4, x: cx + hDist * 1.5, y: cy - vDist * 4 },
        { id: 10, row: 1, col: 5, x: cx + hDist * 2.5, y: cy - vDist * 4 },
        
        // Layer 2: 5 hexagons (NO offset - aligned with layer 0)
        { id: 11, row: 2, col: 0, x: cx - hDist * 2, y: cy - vDist * 3 },
        { id: 12, row: 2, col: 1, x: cx - hDist, y: cy - vDist * 3 },
        { id: 13, row: 2, col: 2, x: cx, y: cy - vDist * 3 },
        { id: 14, row: 2, col: 3, x: cx + hDist, y: cy - vDist * 3 },
        { id: 15, row: 2, col: 4, x: cx + hDist * 2, y: cy - vDist * 3 },
        
        // Layer 3: 6 hexagons (OFFSET by -0.5)
        { id: 16, row: 3, col: 0, x: cx - hDist * 2.5, y: cy - vDist * 2 },
        { id: 17, row: 3, col: 1, x: cx - hDist * 1.5, y: cy - vDist * 2 },
        { id: 18, row: 3, col: 2, x: cx - hDist * 0.5, y: cy - vDist * 2 },
        { id: 19, row: 3, col: 3, x: cx + hDist * 0.5, y: cy - vDist * 2 },
        { id: 20, row: 3, col: 4, x: cx + hDist * 1.5, y: cy - vDist * 2 },
        { id: 21, row: 3, col: 5, x: cx + hDist * 2.5, y: cy - vDist * 2 },
        
        // Layer 4: 5 hexagons (NO offset)
        { id: 22, row: 4, col: 0, x: cx - hDist * 2, y: cy - vDist },
        { id: 23, row: 4, col: 1, x: cx - hDist, y: cy - vDist },
        { id: 24, row: 4, col: 2, x: cx, y: cy - vDist },
        { id: 25, row: 4, col: 3, x: cx + hDist, y: cy - vDist },
        { id: 26, row: 4, col: 4, x: cx + hDist * 2, y: cy - vDist },
        
        // Layer 5: 6 hexagons (OFFSET by -0.5)
        { id: 27, row: 5, col: 0, x: cx - hDist * 2.5, y: cy },
        { id: 28, row: 5, col: 1, x: cx - hDist * 1.5, y: cy },
        { id: 29, row: 5, col: 2, x: cx - hDist * 0.5, y: cy },
        { id: 30, row: 5, col: 3, x: cx + hDist * 0.5, y: cy },
        { id: 31, row: 5, col: 4, x: cx + hDist * 1.5, y: cy },
        { id: 32, row: 5, col: 5, x: cx + hDist * 2.5, y: cy },
        
        // Layer 6: 5 hexagons (NO offset)
        { id: 33, row: 6, col: 0, x: cx - hDist * 2, y: cy + vDist },
        { id: 34, row: 6, col: 1, x: cx - hDist, y: cy + vDist },
        { id: 35, row: 6, col: 2, x: cx, y: cy + vDist },
        { id: 36, row: 6, col: 3, x: cx + hDist, y: cy + vDist },
        { id: 37, row: 6, col: 4, x: cx + hDist * 2, y: cy + vDist },
        
        // Layer 7: 3 hexagons (OFFSET by -0.5)
        { id: 38, row: 7, col: 0, x: cx - hDist * 0.5, y: cy + vDist * 2 },
        { id: 39, row: 7, col: 1, x: cx + hDist * 0.5, y: cy + vDist * 2 },
        { id: 40, row: 7, col: 2, x: cx + hDist * 1.5, y: cy + vDist * 2 },
    ];

    // Winning combinations: triangles formed by 3 hexagons across the grid that maximize coverage
    const winningCombinations = [
        [2, 33, 37],  // Ideally spread Triangle 1: Top-center, Lower-left, Lower-right
        [0, 4, 35],   // Ideally spread Triangle 2: Top-left, Top-right, Lower-center
        [22, 26, 39], // Ideally spread Triangle 3: Mid-left, Mid-right, Bottom-center
    ];

    // Helper to calculate distance between two hexagons
    const getDistance = (h1: Hexagon, h2: Hexagon) => {
        return Math.sqrt(Math.pow(h1.x - h2.x, 2) + Math.pow(h1.y - h2.y, 2));
    };

    // Neighbors logic removed as requested - strict source lighting only

    // Calculate light intensity for all hexagons based on selected lights
    // 2 = Source (Brightest)
    // 0 = Dark
    const getLightMap = () => {
        const map = new Map<number, number>();
        hexagons.forEach(h => map.set(h.id, 0));

        litHexagons.forEach(id => {
            // Only light up the source, no neighbors
            map.set(id, 2);
        });
        return map;
    };

    const lightMap = getLightMap();
    
    // Correct solution set for feedback
    const correctSet = new Set(winningCombinations[0]);

    const handleHexagonClick = (hexId: number) => {
        if (solved) return;
        
        // If we already have 3 lights, we can't change anything until reset
        if (litHexagons.size >= 3) {
            setFeedback("⚠️ Maximum lights placed. Press RESET to try again.");
            return;
        }

        const newLitHexagons = new Set(litHexagons);
        
        // Since we are enforcing "3 clicks then reset", we typically don't allow toggling off
        // But if the user misclicked on the 1st or 2nd, maybe they can toggle?
        // The prompt says "it only has three click then they have to reset for again placing the lights"
        // This implies once 3 are placed, you are locked. It doesn't explicitly forbid undoing step 1 or 2
        // IF step 3 hasn't been taken.
        // However, "it only has three click" usually suggests a consumable resource.
        // Let's allow adding only. If you make a mistake, you reset.
        
        if (newLitHexagons.has(hexId)) {
            // Already lit - ignore click according to strict "3 clicks" rule?
            // Or allow toggle? Let's assume strict "only three clicks" means you add 3, then locked.
            // If I let them toggle, they have >3 clicks.
            return; 
        }

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
                setFeedback("✨ PERFECT COVERAGE! MAXIMUM LIGHT ACHIEVED!");
                // Delay moving to the next level so the player can see the success state
                setTimeout(() => {
                    if (onSolve) onSolve("triangle");
                }, 2000);
            } else {
                setFeedback("❌ Insufficient coverage. Press RESET to try again.");
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
    const getHexagonPath = (centerX: number, centerY: number, size: number = 30) => {
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
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Terminal className="text-primary" size={24} />
                        <h2 className="font-['Press_Start_2P'] text-sm text-primary">
                            Security Layer {level?.toString().padStart(2, '0')}
                        </h2>
                    </div>
                    <Button
                        onClick={resetPuzzle}
                        disabled={solved}
                        variant="outline"
                        size="sm"
                        className="font-['Press_Start_2P'] text-[8px] uppercase hover:bg-primary/10 border-primary/50 text-primary h-8"
                    >
                        RESET
                    </Button>
                </div>
                <p className="font-['Press_Start_2P'] text-[10px] text-primary/90 leading-relaxed">
                    THE PLAYER HAS THREE LIGHTS
                </p>
                <p className="font-['Press_Start_2P'] text-[10px] text-primary/90 leading-relaxed mt-2">
                    FIND THE TRIANGLE THAT MAXIMIZES COVERAGE
                </p>
                <p className="font-['Press_Start_2P'] text-[10px] text-primary/90 leading-relaxed mt-2">
                    LIGHT UP THREE AREAS THAT COVER MAXIMUM AREA. YOU ONLY HAVE THREE CLICKS, THEN YOU MUST RESET TO PLACE LIGHTS AGAIN.
                </p>
            </motion.div>

            {/* Hexagon Pattern */}
            <div className="glass-card-glow rounded-lg p-8">
                <div className="relative w-full max-w-3xl mx-auto" style={{ height: "540px" }}>
                    <svg
                        viewBox="0 0 700 540"
                        className="w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Connection Lines (Draw triangle ONLY if solved) */}
                        {litHexagons.size === 3 && solved && (
                            <path
                                d={`M ${Array.from(litHexagons).map(id => {
                                    const h = hexagons.find(hex => hex.id === id);
                                    return `${h?.x},${h?.y}`;
                                }).join(" L ")} Z`}
                                stroke="#22c55e"
                                strokeWidth="2"
                                fill="#22c55e20"
                                className="pointer-events-none transition-all duration-500"
                            />
                        )}

                        {/* Draw hexagons */}
                        {hexagons.map((hex) => {
                            const intensity = lightMap.get(hex.id) || 0;
                            const isSource = intensity === 2;
                            const isCovered = intensity >= 1;

                            // -- Ambient Feedback Logic --
                            let ambientScale = 1;
                            let ambientOpacity = 0; // 0 to 1
                            let ambientColor = "transparent";
                            
                            if (hoveredHex !== null) {
                                const hoverSource = hexagons.find(h => h.id === hoveredHex);
                                if (hoverSource) {
                                    const dist = getDistance(hex, hoverSource);
                                    const isCorrectHover = correctSet.has(hoveredHex);
                                    const reactionRadius = isCorrectHover ? r * 8 : r * 3; // Correct hexes feel "larger"

                                    if (dist < reactionRadius) {
                                        // Normalized intensity (1 = close, 0 = far)
                                        const power = 1 - (dist / reactionRadius);
                                        
                                        if (isCorrectHover) {
                                            // Strong, calm, symmetrical ripple (Cyan/Blue hint)
                                            ambientOpacity = power * 0.15; 
                                            ambientScale = 1 + (power * 0.05); 
                                            ambientColor = "#06b6d4"; // Unified Cyan
                                        } else {
                                            // Weak, irregular flicker (Cyan - same color, different feel)
                                            // Add some noise based on ID to feel "irregular"
                                            const noise = (hex.id % 3) * 0.5; 
                                            ambientOpacity = power * 0.05 * noise;
                                            ambientScale = 1 + (power * 0.02 * (hex.id % 2 === 0 ? 1 : -0.5));
                                            ambientColor = "#06b6d4"; // Unified Cyan
                                        }
                                    }
                                }
                            }

                            // If solution nodes are active/hovered, they might harmonize? 
                            // Check if current node is 'Correct' and hovered - give it extra "calm"
                            if (correctSet.has(hex.id) && hoveredHex === hex.id) {
                                ambientColor = "#06b6d4";
                                ambientOpacity = 0.2;
                                ambientScale = 1.05;
                            }


                            // Colors: Source=Bright Green, Covered=Dim Green, Unlit=Gray
                            const strokeColor = isSource ? "#22c55e" : (isCovered ? "#4ade80" : "#4b5563");
                            const shadow = isSource 
                                ? "drop-shadow(0 0 15px #22c55e)" 
                                : (isCovered ? "drop-shadow(0 0 5px #4ade80)" : "none");

                            return (
                                <g key={hex.id} 
                                   onMouseEnter={() => setHoveredHex(hex.id)}
                                   onMouseLeave={() => setHoveredHex(null)}
                                >
                                    {/* Ambient Glow Underlay */}
                                    <motion.path
                                        d={getHexagonPath(hex.x, hex.y)}
                                        fill={ambientColor}
                                        stroke="transparent"
                                        initial={false}
                                        animate={{ 
                                            opacity: ambientOpacity,
                                            scale: ambientScale 
                                        }}
                                        transition={{ 
                                            duration: correctSet.has(hoveredHex || -1) ? 0.8 : 0.2, // Slow calm vs fast jitter
                                            ease: "easeInOut"
                                        }}
                                        className="pointer-events-none"
                                        style={{ transformOrigin: `${hex.x}px ${hex.y}px` }} 
                                    />

                                    <motion.path
                                        d={getHexagonPath(hex.x, hex.y)}
                                        fill={isCovered ? "#22c55e20" : "transparent"} // Slight fill for covered area
                                        stroke={strokeColor}
                                        strokeWidth={isSource ? "3" : "2"}
                                        onClick={() => handleHexagonClick(hex.id)}
                                        className="cursor-pointer transition-all duration-300"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{ filter: shadow }}
                                    />
                                    {/* Center Dot Indicator */}
                                    <circle
                                        cx={hex.x}
                                        cy={hex.y}
                                        r={isSource ? 8 : (isCovered ? 4 : 2)}
                                        fill={isSource ? "#22c55e" : (isCovered ? "#4ade80" : "#6b7280")}
                                        className="pointer-events-none"
                                        opacity={isCovered ? 1 : 0.5}
                                    >
                                        {isSource && (
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