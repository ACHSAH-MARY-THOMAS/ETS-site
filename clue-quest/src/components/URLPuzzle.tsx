import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface URLPuzzleProps {
    onSolve?: (answer: string) => void;
}

export const URLPuzzle = ({ onSolve }: URLPuzzleProps) => {
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [solved, setSolved] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
    const [imageData, setImageData] = useState<string[]>([]);

    // Generate random text noise
    const generateRandomText = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
        let text = "";
        for (let i = 0; i < 800; i++) {
            text += chars[Math.floor(Math.random() * chars.length)];
            if (i % 60 === 0) text += "\n";
        }
        return text;
    };

    const randomNoise = generateRandomText();

    // Generate random codes for image display
    const generateRandomCodes = (includeSecret: boolean = false) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
        const lines: string[] = [];
        
        // Generate random code lines (reduced to fit screen without scrolling)
        for (let i = 0; i < 12; i++) {
            let line = "";
            const lineLength = Math.floor(Math.random() * 40) + 35;
            for (let j = 0; j < lineLength; j++) {
                line += chars[Math.floor(Math.random() * chars.length)];
            }
            lines.push(line);
        }

        // Insert the secret in the middle for the correct URL
        if (includeSecret) {
            const middleIndex = Math.floor(lines.length / 2);
            const insertPosition = Math.floor(lines[middleIndex].length / 2);
            lines[middleIndex] = 
                lines[middleIndex].substring(0, insertPosition) + 
                "<esc-crack>" + 
                lines[middleIndex].substring(insertPosition + 11);
        }

        return lines;
    };

    const handleUrlClick = (url: string) => {
        const isCorrectUrl = url === "xq8/mz/il9_k3/esc-jw/n7.../s2p";
        setSelectedUrl(url);
        setImageData(generateRandomCodes(isCorrectUrl));
    };

    const closeModal = () => {
        setSelectedUrl(null);
        setImageData([]);
    };

    // URLs to display (one contains 'esc')
    const urls = [
        "q/i/l/_k/esq-j/n.../s",
        "xq8/mz/il9_k3/esc-jw/n7.../s2p",
        "f5/r/tq_x/esk-m/k.../bn",
        "j3/w/ki1_m/est-v/t.../fg",
    ];

    // Code blocks (one contains 'esc')
    const codeBlocks = [
        "kilje12569mq",
        "nce354we56",
        "xyz789abc",
        "esc123def",
        "ghi456jkl",
    ];

    const handleSubmit = () => {
        if (answer.toLowerCase() === "crack") {
            setSolved(true);
            setFeedback("✓ ESCAPE ROUTE UNLOCKED!");
            onSolve?.("CRACK");
        } else {
            setFeedback("✗ ACCESS DENIED. Review the clues.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-3xl mx-auto space-y-6"
        >
            {/* Noisy Background with URLs */}
            <div className="relative bg-black/80 border-2 border-primary/30 rounded-lg p-6 overflow-hidden">
                {/* Random text background */}
                <div className="absolute inset-0 overflow-hidden opacity-20 font-mono text-[8px] leading-tight text-green-500 pointer-events-none">
                    {randomNoise}
                </div>

                {/* Glitch overlay images */}
                <div className="absolute top-0 left-0 w-20 h-20 opacity-10">
                    <div className="w-full h-full bg-gradient-to-br from-red-500 to-blue-500 blur-md"></div>
                </div>
                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
                    <div className="w-full h-full bg-gradient-to-tl from-yellow-500 to-purple-500 blur-md"></div>
                </div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 opacity-10">
                    <div className="w-full h-full bg-gradient-to-r from-green-500 to-pink-500 blur-md"></div>
                </div>

                {/* URLs scattered in the noise */}
                <div className="relative z-10 space-y-8">
                    <div className="text-center">
                        <p className="text-red-400 font-['Press_Start_2P'] text-xs mb-4 animate-pulse">
                            ⚠️ INTERFERENCE DETECTED ⚠️
                        </p>
                    </div>

                    {/* URL fragments scattered */}
                    <div className="grid grid-cols-2 gap-4">
                        {urls.map((url, index) => (
                            <motion.button
                                key={index}
                                onClick={() => handleUrlClick(url)}
                                initial={{ opacity: 0, x: Math.random() * 40 - 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className={`font-mono text-xs p-2 rounded border cursor-pointer hover:scale-105 transition-transform ${
                                    url.includes("esc-")
                                        ? "border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                        : "border-primary/30 bg-primary/5 text-primary/60 hover:bg-primary/10"
                                }`}
                            >
                                {url}
                            </motion.button>
                        ))}
                    </div>

                    <div className="border-t border-primary/20 pt-6">
                        <p className="text-yellow-400 font-['Press_Start_2P'] text-[10px] mb-4">
                            CODE FRAGMENTS INTERCEPTED:
                        </p>

                        {/* Code blocks */}
                        <div className="grid grid-cols-3 gap-3">
                            {codeBlocks.map((code, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    className={`font-mono text-xs p-3 rounded border text-center ${
                                        code.includes("esc")
                                            ? "border-cyan-500 bg-cyan-500/10 text-cyan-300 font-bold"
                                            : "border-muted/30 bg-muted/10 text-muted-foreground"
                                    }`}
                                >
                                    {code}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center pt-4">
                        <p className="text-primary/70 font-['Press_Start_2P'] text-[9px]">
                            DECRYPTION KEY: esc → ?
                        </p>
                    </div>
                </div>
            </div>

            {/* Answer Input */}
            <div className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Enter the key..."
                        disabled={solved}
                        className="flex-1 font-['Press_Start_2P'] text-xs uppercase"
                        onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                    />
                    <Button
                        onClick={handleSubmit}
                        disabled={solved}
                        className={`font-['Press_Start_2P'] text-xs uppercase px-6 ${
                            solved ? "bg-green-500" : "bg-primary"
                        } text-black hover:bg-primary/90`}
                    >
                        {solved ? "✓ UNLOCKED" : "SUBMIT"}
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
                                    : "bg-red-500/20 text-red-400 border-red-500"
                            }`}
                        >
                            {feedback}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-black border-4 border-primary rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-['Press_Start_2P'] text-sm text-primary">
                                    URL: {selectedUrl}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-primary hover:text-primary/70 text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Random codes display */}
                            <div className="bg-black/50 border-2 border-primary/30 rounded p-6">
                                <div className="space-y-2 font-mono text-[10px] text-green-400 leading-tight break-all">
                                    {imageData.map((line, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.03 }}
                                        >
                                            {line}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <button
                                    onClick={closeModal}
                                    className="bg-primary text-black px-6 py-2 rounded font-['Press_Start_2P'] text-xs hover:bg-primary/90"
                                >
                                    CLOSE
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
