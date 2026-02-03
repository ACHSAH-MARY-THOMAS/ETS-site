import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Terminal, Lightbulb } from "lucide-react";

interface MCQPuzzleProps {
    onSolve?: (answer: string) => void;
    level?: number;
}

export const MCQPuzzle = ({ onSolve, level = 7 }: MCQPuzzleProps) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const [feedback, setFeedback] = useState("");
    const [solved, setSolved] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const question = "Why does an optical illusion happen?";
    const correctAnswer = "BRAIN";
    
    const options = [
        { id: "A", text: "Because of eye defects" },
        { id: "B", text: "Because the brain misinterprets visual information" },
        { id: "C", text: "Because of poor lighting conditions" },
        { id: "D", text: "Because objects change their actual shape" }
    ];

    const handleSubmit = () => {
        if (selectedAnswer === "B") {
            setSolved(true);
            setFeedback("✓ CORRECT! The brain misinterprets visual information!");
            setTimeout(() => {
                onSolve?.(correctAnswer);
            }, 1000);
        } else {
            setFeedback("✗ Incorrect! Think about how your brain processes visual information.");
            setTimeout(() => {
                setFeedback("");
            }, 2000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full flex-1 min-h-0 flex flex-col p-4 space-y-4 overflow-y-auto"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-secondary/60 to-secondary/40 px-5 py-3.5 border-b-2 border-primary/30 flex items-center gap-3 flex-shrink-0 shadow-lg rounded-t">
                <Terminal className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm uppercase tracking-[0.25em] text-primary font-bold">
                    Security Layer {level.toString().padStart(2, '0')}
                </span>
            </div>

            {/* Image */}
            <div className="flex-shrink-0">
                <img 
                    src="/still-room.png" 
                    alt="Optical Illusion" 
                    className="w-full h-auto rounded-lg border-2 border-primary/30"
                />
            </div>

            {/* Question */}
            <div className="text-center flex-shrink-0">
                <p className="text-sm md:text-base font-['Press_Start_2P'] text-foreground leading-relaxed">
                    {question}
                </p>
            </div>

            {/* Options */}
            <div className="space-y-3 flex-shrink-0">
                {options.map((option) => (
                    <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <button
                            onClick={() => !solved && setSelectedAnswer(option.id)}
                            disabled={solved}
                            className={`w-full p-4 text-left border-2 rounded-lg font-['Press_Start_2P'] text-xs transition-all ${
                                selectedAnswer === option.id
                                    ? "bg-primary/20 border-primary text-primary"
                                    : "bg-black/40 border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary/50"
                            } ${solved ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            <span className="text-primary mr-3">{option.id}.</span>
                            {option.text}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Hint Button */}
            <div className="space-y-2 flex-shrink-0">
                <Button
                    onClick={() => setShowHint(!showHint)}
                    variant="outline"
                    className="w-full border-2 border-primary/50 bg-primary/10 hover:bg-primary/20 text-primary font-['Press_Start_2P'] text-xs py-3 flex items-center justify-center gap-2"
                >
                    <Lightbulb className="w-4 h-4" />
                    {showHint ? "HIDE HINT" : "NEED A HINT?"}
                </Button>
                {showHint && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-2 border-green-500/50 rounded-lg p-4 bg-green-500/10"
                    >
                        <p className="text-xs font-['Press_Start_2P'] text-green-400 text-center leading-relaxed">
                            Light explains shadows. Shadows explain lies.
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Submit Button */}
            {!solved && (
                <div className="flex justify-center flex-shrink-0">
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedAnswer || solved}
                        className="bg-primary hover:bg-primary/80 text-primary-foreground font-['Press_Start_2P'] px-8 py-2 text-xs uppercase"
                    >
                        Submit Answer
                    </Button>
                </div>
            )}

            {/* Feedback */}
            {feedback && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-center p-4 rounded-lg font-['Press_Start_2P'] text-xs flex-shrink-0 ${
                        feedback.includes("✓")
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                    }`}
                >
                    {feedback}
                </motion.div>
            )}
        </motion.div>
    );
};
