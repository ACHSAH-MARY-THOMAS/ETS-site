import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle, XCircle, Terminal } from "lucide-react";
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
        <div className="w-full flex-1 min-h-0 glass-card-glow rounded-sm overflow-hidden transition-all duration-300 flex flex-col">
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
                <div className="space-y-1 flex flex-col">
                    <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2 py-1 border-l-2 border-primary/50 pl-3 bg-primary/5 flex-shrink-0">
                        <span className="text-primary font-bold text-sm">&gt;</span> 
                        <span className="text-primary/90 font-semibold">LOGIC DECRYPTOR</span>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center flex-1 py-4">
                    <div className="text-center mb-4 flex-shrink-0">
                        <h2 className="text-xs md:text-sm font-['Press_Start_2P'] text-primary/80 mb-2">
                            CAN YOU CRACK THE CODE?
                        </h2>
                    </div>

                    {/* Lock and Code Input */}
                    <div className={cn(
                        "flex flex-col items-center gap-4 p-6 border-2 border-primary/30 rounded-lg bg-black/40 mb-4 flex-shrink-0 shadow-[0_0_15px_rgba(0,255,0,0.1)]",
                        isShaking && "animate-shake"
                    )}>
                        <Lock className={cn(
                            "w-12 h-12 transition-colors duration-300",
                            solved ? "text-green-500 dropdown-shadow" : "text-primary/60"
                        )} />
                        
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">CODE</div>
                        
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
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    className={cn(
                                        "w-12 h-12 text-center text-xl font-bold border-2 rounded bg-black",
                                        "font-['Press_Start_2P'] focus:outline-none transition-all",
                                        solved 
                                            ? "border-green-500 text-green-500" 
                                            : "border-primary/50 text-primary focus:border-primary shadow-[0_0_10px_rgba(0,255,0,0.2)]"
                                    )}
                                    maxLength={1}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Clues Section */}
                    <div className="w-full max-w-md space-y-2 mb-4">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 text-center">
                            ANALYSIS DATA:
                        </div>
                        
                        {clues.map((clue, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-4 p-2 border border-primary/20 rounded bg-black/30 hover:bg-white/5 transition-colors"
                            >
                                <div className="flex gap-1">
                                    {clue.code.map((num, i) => (
                                        <div
                                            key={i}
                                            className="w-6 h-8 flex items-center justify-center border border-primary/40 rounded bg-black text-primary font-bold text-xs shadow-sm"
                                        >
                                            {num}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-foreground/80 italic font-mono">
                                    {clue.hint}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Feedback */}
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex-shrink-0 mt-3 flex items-center justify-center gap-2 p-3 rounded-lg text-xs font-bold w-full max-w-sm",
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
                </div>
            </div>

            {/* Footer */}
            <div className="space-y-4 mt-auto p-4 z-20 relative bg-black/50 border-t border-primary/20 backdrop-blur-sm">
                {!solved && (
                    <Button
                        onClick={handleSubmit}
                        disabled={digits.some(d => !d)}
                        className="w-full bg-primary hover:bg-primary/80 text-black font-bold py-6 text-sm uppercase tracking-[0.15em] shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] transition-all"
                    >
                        UNLOCK SYSTEM
                    </Button>
                )}
                {solved && (
                    <div className="w-full text-center py-4 text-green-500 font-bold text-sm tracking-widest border border-green-500/30 bg-green-500/10 rounded">
                        ACCESS GRANTED
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodeCrackerPuzzle;
