import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClockPuzzleProps {
    onSolve?: (sequence: string[]) => void;
}

export const ClockPuzzle = ({ onSolve }: ClockPuzzleProps) => {
    const [rotations, setRotations] = useState<number[]>([0, 0, 0, 0]); // rotation count for each arrow
    const [solved, setSolved] = useState(false);
    const [feedback, setFeedback] = useState<string>("");

    // Target time 12:15 means rotations should be [1, 2, 1, 5]
    const targetRotations = [1, 2, 1, 5];

    const handleArrowClick = (index: number) => {
        if (solved) return;

        setRotations((prev) => {
            const newRotations = [...prev];
            newRotations[index] = (newRotations[index] + 1) % 10; // Wrap 0-9
            return newRotations;
        });
        setFeedback("");
    };

    const handleConfirm = () => {
        // Check if all rotations match the target
        const isCorrect = rotations.every((rotation, index) => rotation === targetRotations[index]);

        if (isCorrect) {
            setSolved(true);
            setFeedback("✓ CORRECT TIME!");
            onSolve?.(["CONFIRMED"]);
        } else {
            setFeedback("✗ Incorrect! Check the time on the clock (12:15)");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mx-auto p-6 space-y-8"
        >
            {/* Question Text */}
            <div className="text-center space-y-2">
                <p className="text-sm md:text-base font-['press_start P'] text-foreground leading-relaxed">
                    Check the current time.
                </p>
                <p className="text-xs md:text-sm font-['Press_Start_2P'] text-muted-foreground leading-relaxed">
                    Directions can change time
                </p>
            </div>

            {/* Clock Face Visual - Static 12:15 */}
            <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 border-4 border-primary rounded-full bg-card shadow-lg">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                        {/* Clock numbers */}
                        {[12, 3, 6, 9].map((num, i) => {
                            const angle = (i * 90 - 90) * (Math.PI / 180);
                            const x = 50 + 40 * Math.cos(angle);
                            const y = 50 + 40 * Math.sin(angle);
                            return (
                                <text
                                    key={num}
                                    x={x}
                                    y={y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-xs fill-foreground font-bold"
                                    fontSize="6"
                                >
                                    {num}
                                </text>
                            );
                        })}

                        {/* Hour hand pointing at 12 - short and thick */}
                        <line
                            x1="50"
                            y1="50"
                            x2="50"
                            y2="25"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-primary"
                            strokeLinecap="round"
                        />

                        {/* Minute hand pointing at 3 (15 minutes) - long and thin */}
                        <line
                            x1="50"
                            y1="50"
                            x2="85"
                            y2="50"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-accent"
                            strokeLinecap="round"
                        />

                        {/* Center dot */}
                        <circle cx="50" cy="50" r="2" className="fill-primary" />
                    </svg>
                </div>
            </div>

            {/* Four Arrows in Sequence */}
            <div className="space-y-6">
                <div className="flex justify-center gap-4">
                    {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                            <button
                                onClick={() => handleArrowClick(index)}
                                disabled={solved}
                                className="p-6 rounded-lg border-2 border-primary bg-primary/20 hover:bg-primary/30 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
                            >
                                <motion.div
                                    animate={{
                                        rotate: rotations[index] * 90,
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    <ArrowUp className="w-8 h-8 text-primary" />
                                </motion.div>
                            </button>
                            <div className="text-xs font-['Press_Start_2P'] text-primary">
                                {rotations[index]}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Confirm Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Button
                        onClick={handleConfirm}
                        disabled={solved}
                        className={`w-full font-['Press_Start_2P'] text-xs uppercase tracking-widest py-4 transition-all ${
                            solved
                                ? "bg-green-500 text-black"
                                : "bg-primary text-black hover:bg-primary/90"
                        }`}
                    >
                        {solved ? "✓ CONFIRMED" : "OK"}
                    </Button>
                </motion.div>

                {/* Feedback Message */}
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className={`text-center text-xs md:text-sm font-['Press_Start_2P'] p-3 rounded border-2 ${
                                solved
                                    ? "bg-green-500/20 text-green-400 border-green-500"
                                    : "bg-red-500/20 text-red-400 border-red-500"
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

