import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeCrackerPuzzleProps {
    onSolve?: (answer: string) => void;
    level?: number;
}

const clues = [
    { code: ["5", "4", "8"], hint: "One number is correct and well placed" },
    { code: ["5", "3", "0"], hint: "Nothing is correct" },
    { code: ["1", "5", "7"], hint: "Two numbers are correct but wrong place" },
    { code: ["8", "0", "6"], hint: "One number is correct but wrong place" },
    { code: ["6", "4", "7"], hint: "One number is correct but wrong place" },
];

const correctAnswer = "718";

export const CodeCrackerPuzzle = ({ onSolve, level = 12 }: CodeCrackerPuzzleProps) => {
    const [digits, setDigits] = useState<string[]>(["", "", ""]);
    const [feedback, setFeedback] = useState("");
    const [solved, setSolved] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    const handleDigitChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1);
        if (!/^[0-9]?$/.test(value)) return;
        
        const newDigits = [...digits];
        newDigits[index] = value;
        setDigits(newDigits);
        setFeedback("");

        // Auto-focus next input
        if (value && index < 2) {
            const nextInput = document.getElementById(`code-input-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            const prevInput = document.getElementById(`code-input-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleSubmit = () => {
        const answer = digits.join("");
        
        if (answer.length !== 3) {
            setFeedback("Enter all 3 digits");
            return;
        }

        if (answer === correctAnswer) {
            setSolved(true);
            setFeedback("✓ CODE CRACKED! Lock opened!");
            setTimeout(() => {
                onSolve?.(correctAnswer);
            }, 1500);
        } else {
            setIsShaking(true);
            setFeedback("✗ Wrong code. Analyze the clues carefully.");
            setTimeout(() => setIsShaking(false), 500);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col p-4 overflow-hidden"
        >
            {/* Header */}
            <div className="text-center mb-4 flex-shrink-0">
                <h2 className="text-sm md:text-base font-['Press_Start_2P'] text-primary mb-2">
                    CAN YOU CRACK THE CODE?
                </h2>
            </div>

            {/* Lock and Code Input */}
            <div className={cn(
                "flex flex-col items-center gap-4 p-6 border-2 border-primary/30 rounded-lg bg-black/40 mb-4 flex-shrink-0",
                isShaking && "animate-shake"
            )}>
                <Lock className={cn(
                    "w-16 h-16 transition-colors duration-300",
                    solved ? "text-green-500" : "text-primary/60"
                )} />
                
                <div className="text-xs text-muted-foreground uppercase tracking-wider">CODE</div>
                
                <div className="flex gap-3">
                    {digits.map((digit, index) => (
                        <input
                            key={index}
                            id={`code-input-${index}`}
                            type="text"
                            inputMode="numeric"
                            value={digit}
                            onChange={(e) => handleDigitChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            disabled={solved}
                            className={cn(
                                "w-14 h-14 text-center text-2xl font-bold border-2 rounded bg-black",
                                "font-['Press_Start_2P'] focus:outline-none transition-all",
                                solved 
                                    ? "border-green-500 text-green-500" 
                                    : "border-primary/50 text-primary focus:border-primary"
                            )}
                            maxLength={1}
                        />
                    ))}
                </div>
            </div>

            {/* Clues Section */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-4 min-h-0">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                    Will you crack the code?
                </div>
                
                {clues.map((clue, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-3 border border-primary/20 rounded bg-black/30"
                    >
                        <div className="flex gap-1">
                            {clue.code.map((num, i) => (
                                <div
                                    key={i}
                                    className="w-8 h-10 flex items-center justify-center border-2 border-primary/40 rounded bg-black text-primary font-bold text-sm"
                                >
                                    {num}
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] md:text-xs text-foreground/80 italic">
                            {clue.hint}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Submit Button */}
            {!solved && (
                <div className="flex-shrink-0">
                    <Button
                        onClick={handleSubmit}
                        disabled={digits.some(d => !d)}
                        className="w-full bg-primary hover:bg-primary/80 text-black font-bold py-3 text-sm uppercase tracking-wider"
                    >
                        UNLOCK
                    </Button>
                </div>
            )}

            {/* Feedback */}
            {feedback && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                        "flex-shrink-0 mt-3 flex items-center justify-center gap-2 p-3 rounded-lg text-xs font-bold",
                        feedback.includes("✓")
                            ? "bg-green-500/20 text-green-400 border border-green-500/50"
                            : "bg-red-500/20 text-red-400 border border-red-500/50"
                    )}
                >
                    {feedback.includes("✓") ? (
                        <CheckCircle className="w-4 h-4" />
                    ) : (
                        <XCircle className="w-4 h-4" />
                    )}
                    {feedback}
                </motion.div>
            )}

            {/* Success State */}
            {solved && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-shrink-0 mt-4 p-4 bg-primary/20 border-2 border-primary rounded-lg text-center"
                >
                    <p className="text-primary text-xs font-bold">🔓 LOCK OPENED</p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default CodeCrackerPuzzle;
