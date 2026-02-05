import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, ArrowLeft } from "lucide-react";
import { AnswerInput } from "@/components/AnswerInput";

interface MCQPuzzleProps {
    onSolve?: (answer: string) => void;
    level?: number;
}

export const MCQPuzzle = ({ onSolve, level = 7 }: MCQPuzzleProps) => {
    // State for the frame interaction
    const [frameOpened, setFrameOpened] = useState(false);
    const [frameFlipped, setFrameFlipped] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [hasFlipped, setHasFlipped] = useState(false);
    const [userAnswer, setUserAnswer] = useState("");
    
    // Game state
    const [feedback, setFeedback] = useState("");
    const [solved, setSolved] = useState(false);

    const FINAL_ANSWER = "PHONE"; // The correct answer that proceeds to next level
    
    // Riddles and answers for each option
    const riddles = {
        1: "A. I copy you, I only exist when you stand before me.",
        2: "B. I melt as I give light.",
        3: "C. I speak without a mouth, I hear as ears, I hold illusion in my screen.",
        4: "D. I have buttons but I'm not a shirt, I control digital things from afar."
    };

    const answers = {
        1: "MIRROR",
        2: "CANDLE",
        3: "PHONE",
        4: "REMOTE"
    };

    const handleOptionSelect = (optionId: number) => {
        if (!solved) {
            setSelectedOption(optionId);
            setFrameOpened(true);
            setFrameFlipped(true);
            setHasFlipped(true);
            setFeedback("");
            setUserAnswer("");
        }
    };

    const handleSubmitAnswer = async (answer: string): Promise<boolean> => {
        if (!selectedOption) return false;

        const trimmedAnswer = answer.trim().toUpperCase();
        const correctAnswer = answers[selectedOption as keyof typeof answers];

        if (trimmedAnswer === correctAnswer) {
            setFeedback("✓ CORRECT ANSWER!");
            
            // Only proceed to next level if it's option 3 (PHONE)
            if (selectedOption === 3) {
                setSolved(true);
                setTimeout(() => {
                    onSolve?.(FINAL_ANSWER);
                }, 1500);
            }
            return true;
        } else {
            setFeedback("✗ INCORRECT. TRY AGAIN.");
            return false;
        }
    };

    const handleCloseModal = () => {
        setFrameOpened(false);
        setFrameFlipped(false);
        setSelectedOption(null);
        setFeedback("");
        setUserAnswer("");
    };

    const handleGoBack = () => {
        setFrameOpened(false);
        setFrameFlipped(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full flex flex-col overflow-hidden"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-secondary/60 to-secondary/40 px-5 py-3.5 border-b-2 border-primary/30 flex items-center gap-3 flex-shrink-0 shadow-lg">
                <Terminal className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm uppercase tracking-[0.25em] text-primary font-bold">
                    Security Layer {level.toString().padStart(2, '0')}
                </span>
            </div>

            {/* Subheader */}
            <div className="bg-secondary/20 px-5 py-2 border-b border-primary/20 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-primary text-lg">&gt;</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-primary/90 font-semibold">
                        VISUAL ANALYSIS TEST
                    </span>
                </div>
            </div>

            {/* Question */}
            <div className="text-left space-y-1 px-5 pt-4 pb-2 flex-shrink-0">
                <p className="text-xs md:text-sm font-['Press_Start_2P'] text-foreground leading-relaxed">
                    SOLVE THE RIDDLES TO FIND THE KEY
                </p>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-0 relative overflow-hidden p-2">
                <div className="relative rounded-lg overflow-hidden border-2 border-primary/20 shadow-2xl" style={{ maxHeight: '100%', aspectRatio: '16/10' }}>
                    {/* Room Image */}
                    <img 
                        src="/still-room.jpg"
                        alt="A mysterious room"
                        className="w-full h-full object-cover"
                    />

                    {/* MCQ Options Overlay */}
                    <div className="absolute top-[5%] right-[25%] space-y-2 max-w-[35%]">
                        <button
                            onClick={() => handleOptionSelect(1)}
                            disabled={solved}
                            className={`w-full bg-black/70 backdrop-blur-sm border-2 rounded p-2 transition-all cursor-pointer hover:bg-black/80 hover:border-primary/50 ${
                                selectedOption === 1 ? "border-primary bg-primary/20" : "border-primary/30"
                            } ${solved ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <p className={`text-[8px] md:text-[10px] font-['Press_Start_2P'] leading-relaxed ${
                                selectedOption === 1 ? "text-primary" : "text-yellow-400"
                            }`}>
                                1. The image is moving.
                            </p>
                        </button>
                        <button
                            onClick={() => handleOptionSelect(2)}
                            disabled={solved}
                            className={`w-full bg-black/70 backdrop-blur-sm border-2 rounded p-2 transition-all cursor-pointer hover:bg-black/80 hover:border-primary/50 ${
                                selectedOption === 2 ? "border-primary bg-primary/20" : "border-primary/30"
                            } ${solved ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <p className={`text-[8px] md:text-[10px] font-['Press_Start_2P'] leading-relaxed ${
                                selectedOption === 2 ? "text-primary" : "text-yellow-400"
                            }`}>
                                2. The light is changing.
                            </p>
                        </button>
                        <button
                            onClick={() => handleOptionSelect(3)}
                            disabled={solved}
                            className={`w-full bg-black/70 backdrop-blur-sm border-2 rounded p-2 transition-all cursor-pointer hover:bg-black/80 hover:border-primary/50 ${
                                selectedOption === 3 ? "border-primary bg-primary/20" : "border-primary/30"
                            } ${solved ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <p className={`text-[8px] md:text-[10px] font-['Press_Start_2P'] leading-relaxed ${
                                selectedOption === 3 ? "text-primary" : "text-yellow-400"
                            }`}>
                                3. The human eye cannot see everything correctly.
                            </p>
                        </button>
                        <button
                            onClick={() => handleOptionSelect(4)}
                            disabled={solved}
                            className={`w-full bg-black/70 backdrop-blur-sm border-2 rounded p-2 transition-all cursor-pointer hover:bg-black/80 hover:border-primary/50 ${
                                selectedOption === 4 ? "border-primary bg-primary/20" : "border-primary/30"
                            } ${solved ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <p className={`text-[8px] md:text-[10px] font-['Press_Start_2P'] leading-relaxed ${
                                selectedOption === 4 ? "text-primary" : "text-yellow-400"
                            }`}>
                                4. The object is damaged.
                            </p>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal - Opens when option is clicked */}
            <AnimatePresence>
                {frameOpened && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                        onClick={handleCloseModal}
                    >
                        {/* Close button */}
                        {!frameFlipped && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
                                onClick={handleCloseModal}
                            >
                                <X className="w-6 h-6" />
                            </motion.button>
                        )}

                        {/* Flippable Frame */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: "spring", damping: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative"
                            style={{ perspective: '1000px' }}
                        >
                            <motion.div
                                animate={{ rotateY: frameFlipped ? 180 : 0 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                style={{ transformStyle: 'preserve-3d' }}
                                className="relative"
                            >
                                {/* Front - Painting Image */}
                                <motion.div
                                    className="cursor-pointer"
                                    style={{ backfaceVisibility: 'hidden' }}
                                >
                                    {/* Wooden Frame Border */}
                                    <div 
                                        className="p-3 md:p-4 rounded shadow-2xl"
                                        style={{
                                            background: 'linear-gradient(145deg, #6b4423 0%, #4a2f17 25%, #5c3a1d 50%, #3d2512 75%, #5c3a1d 100%)',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)',
                                        }}
                                    >
                                        {/* Inner frame edge */}
                                        <div 
                                            className="p-1 rounded-sm"
                                            style={{
                                                background: 'linear-gradient(145deg, #3d2512 0%, #2a1a0d 100%)',
                                                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
                                            }}
                                        >
                                            {/* Painting Canvas */}
                                            <div className="w-64 h-44 md:w-80 md:h-56 overflow-hidden rounded-sm">
                                                <img 
                                                    src="/still-room.jpg"
                                                    alt="Landscape painting"
                                                    className="w-full h-full object-cover"
                                                    style={{
                                                        objectPosition: '0% 0%',
                                                        transform: 'scale(2.5)',
                                                        transformOrigin: '15% 25%',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                </motion.div>

                                {/* Back - Feedback Message */}
                                <motion.div
                                    className="absolute inset-0"
                                    style={{ 
                                        backfaceVisibility: 'hidden',
                                        transform: 'rotateY(180deg)',
                                    }}
                                >
                                    {/* Wooden Frame Back */}
                                    <div 
                                        className="p-3 md:p-4 rounded shadow-2xl"
                                        style={{
                                            background: 'linear-gradient(145deg, #5c4033 0%, #3d2914 25%, #4a3728 50%, #2d1f14 75%, #4a3728 100%)',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.3)',
                                        }}
                                    >
                                        {/* Wood grain texture */}
                                        <div className="absolute inset-0 opacity-10 rounded"
                                            style={{
                                                backgroundImage: `repeating-linear-gradient(
                                                    0deg,
                                                    transparent,
                                                    transparent 8px,
                                                    rgba(0,0,0,0.1) 8px,
                                                    rgba(5, 5, 5, 0.1) 10px
                                                )`,
                                            }}
                                        />
                                        
                                        {/* Inner dark area with message */}
                                        <div 
                                            className="w-64 h-44 md:w-80 md:h-56 rounded-sm flex flex-col items-center justify-center relative"
                                            style={{
                                                background: 'linear-gradient(135deg, #1a1208 0%, #2d1f14 50%, #1a1208 100%)',
                                                boxShadow: 'inset 0 4px 16px rgba(0,0,0,0.6)',
                                            }}
                                        >
                                            {/* Riddle Message */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                                className="text-center px-4"
                                            >
                                                <div 
                                                    className="text-xs md:text-sm font-serif text-amber-100/90 leading-relaxed"
                                                    style={{ 
                                                        fontFamily: 'Georgia, serif',
                                                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                                    }}
                                                >
                                                    {selectedOption && riddles[selectedOption as keyof typeof riddles]}
                                                </div>
                                            </motion.div>

                                            {/* Back button */}
                                            <motion.button
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.8 }}
                                                onClick={handleGoBack}
                                                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-amber-900/50 hover:bg-amber-900/70 border border-amber-700/50 rounded text-amber-100/80 text-[10px] transition-colors"
                                            >
                                                <ArrowLeft className="w-3 h-3" />
                                                GO BACK
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Answer Input - Shows on main page after going back from flipped */}
            <AnimatePresence>
                {hasFlipped && !frameOpened && selectedOption && !solved && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 flex-shrink-0 w-full max-w-md mx-auto px-4"
                    >
                        <AnswerInput
                            onSubmit={handleSubmitAnswer}
                            successMessage={feedback}
                            errorMessage={feedback}
                            withExecuteButton
                            feedbackPlacement="top"
                            disabled={false}
                            placeholder="TYPE THE ANSWER..."
                            buttonText="EXECUTE"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
