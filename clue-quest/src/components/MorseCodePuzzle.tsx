import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";

interface MorseCodePuzzleProps {
    onSolve?: (answer: string) => void;
    level?: number;
}

export const MorseCodePuzzle = ({ onSolve, level = 3 }: MorseCodePuzzleProps) => {
    const [userAnswer, setUserAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [solved, setSolved] = useState(false);
    const [showUnscrambleHint, setShowUnscrambleHint] = useState(false);

    // Morse code for TREMENDOUS (only codes, no letters shown)
    const tremendousMorse = ["−", "•−•", "•", "−−", "•", "−•", "−••", "−−−", "••−", "•••"];

    const handleSubmit = () => {
        const answer = userAnswer.toUpperCase().trim();
        
        // If they enter "TREMENDOUS" - show the unscramble hint
        if (answer === "TREMENDOUS") {
            setShowUnscrambleHint(true);
            setFeedback("🔍 UNSCRAMBLE AND FIND THE WORD WITHIN");
            return;
        }
        
        // Correct answer is "TREND"
        if (answer === "TREND") {
            setSolved(true);
            setFeedback("✓ CORRECT! You decoded it!");
            setTimeout(() => {
                onSolve?.("TREND");
            }, 1000);
        } else {
            setFeedback("✗ Incorrect! Read the hint carefully and look at the morse code.");
        }
    };

    return (
        <div className="w-full flex-1 min-h-0 glass-card-glow rounded-sm overflow-hidden transition-all duration-300 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-secondary/60 to-secondary/40 px-5 py-3.5 border-b-2 border-primary/30 flex items-center gap-3 flex-shrink-0 shadow-lg">
                <Terminal className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm uppercase tracking-[0.25em] text-primary font-bold">
                    Security Layer {level.toString().padStart(2, '0')}
                </span>
            </div>

            {/* Content */}
            <div className="px-3 py-2 space-y-4 flex flex-col flex-1 min-h-0 overflow-y-auto w-full">
                {/* Question/Title */}
                <div className="text-center">
                    <p className="text-sm md:text-base font-['Press_Start_2P'] text-foreground leading-relaxed">
                        Read the Dots and Dashes
                    </p>
                </div>

            {/* Morse Code Display */}
            <div className="border-4 border-primary/50 rounded-lg p-6 bg-black/60 space-y-4">
                <h3 className="text-xs font-['Press_Start_2P'] text-primary text-center mb-4">
                    MORSE CODE MESSAGE
                </h3>
                
                <div className="flex flex-wrap justify-center gap-3">
                    {tremendousMorse.map((code, index) => (
                        <div 
                            key={index}
                            className="flex items-center justify-center p-3 bg-primary/10 border-2 border-primary/40 rounded-lg min-w-[60px]"
                        >
                            <span className="font-['Press_Start_2P'] text-2xl text-primary">
                                {code}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hint Box - After morse code */}
            <div className="border-2 border-yellow-500/50 rounded-lg p-4 bg-yellow-500/10">
                <p className="text-xs font-['Press_Start_2P'] text-yellow-400 text-center leading-relaxed">
                    Hop to the word given and escape key is a word in it
                </p>
            </div>

            {/* Answer Input Box - Bottom */}
            {!solved && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
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
                            : feedback.includes("🔍")
                            ? "bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500/50"
                            : "bg-red-500/20 text-red-400"
                    }`}
                >
                    {feedback}
                </motion.div>
            )}
            </div>
        </div>
    );
};
