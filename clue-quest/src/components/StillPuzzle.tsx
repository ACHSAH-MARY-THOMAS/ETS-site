import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Lightbulb, XCircle, X, ArrowLeft } from "lucide-react";

interface StillPuzzleProps {
    onSolve?: (answer: string) => void;
    showMCQ?: boolean;
    level?: number;
}

const ANSWER = "ILLUSION";
const HINT = "Light explains shadows.\nShadows explain lies.";

const ROOM_IMAGE = "/still-room.jpg";

export const StillPuzzle = ({ onSolve, showMCQ = false, level = 6 }: StillPuzzleProps) => {
    const [frameOpened, setFrameOpened] = useState(false);
    const [frameFlipped, setFrameFlipped] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [userInput, setUserInput] = useState("");
    const [inputError, setInputError] = useState(false);
    const [solved, setSolved] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const handleFrameClick = () => {
        if (!frameOpened) {
            setFrameOpened(true);
        }
    };

    const handleOpenedFrameClick = () => {
        if (!frameFlipped) {
            setFrameFlipped(true);
        }
    };

    const handleCloseModal = () => {
        setFrameOpened(false);
        setFrameFlipped(false);
    };

    const handleGoBack = () => {
        setFrameOpened(false);
    };

    const getRiddleText = () => {
        if (!showMCQ) {
            return "OPTICAL ILLUSION";
        }
        switch(selectedOption) {
            case 1:
                return "I copy you, I only exist when you stand before me.";
            case 2:
                return "I melt as I give light.";
            case 3:
                return "I speak without a mouth, I hear as ears, I hold illusion in my screen.";
            case 4:
                return "I have buttons but I'm not a shirt, I control digital things from afar.";
            default:
                return "OPTICAL ILLUSION";
        }
    };

    const handleSubmit = () => {
        const trimmedInput = userInput.trim().toUpperCase();
        
        if (showMCQ) {
            // MCQ mode (Layer 7)
            const validAnswers = ["MIRROR", "CANDLE", "PHONE", "REMOTE"];
            
            if (validAnswers.includes(trimmedInput)) {
                setFeedback("✓ CORRECT! ACCESS GRANTED!");
                setInputError(false);
                
                // Only proceed to next level if answer is PHONE
                if (trimmedInput === "PHONE") {
                    setSolved(true);
                    setTimeout(() => {
                        onSolve?.("ILLUSION");
                    }, 1500);
                } else {
                    // For other correct answers, show success then allow trying again
                    setTimeout(() => {
                        setFeedback("");
                        setUserInput("");
                    }, 2000);
                }
            } else {
                setInputError(true);
                setFeedback("✗ INCORRECT KEY. TRY AGAIN.");
                setTimeout(() => {
                    setInputError(false);
                    setFeedback("");
                }, 2000);
            }
        } else {
            // Original mode (Layer 6)
            if (trimmedInput === ANSWER) {
                setSolved(true);
                setFeedback("✓ CORRECT! ACCESS GRANTED!");
                setInputError(false);
                setTimeout(() => {
                    onSolve?.(ANSWER);
                }, 1500);
            } else {
                setInputError(true);
                setFeedback("✗ INCORRECT KEY. TRY AGAIN.");
                setTimeout(() => {
                    setInputError(false);
                    setFeedback("");
                }, 2000);
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && frameFlipped && !solved) {
            handleSubmit();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full flex flex-col p-2 overflow-hidden"
        >
            {/* Header */}
            <div className="text-center mb-2 flex-shrink-0">
                <h2 className="text-xs md:text-sm font-['Press_Start_2P'] text-primary mb-1">
                    SECURITY LAYER {level.toString().padStart(2, '0')}
                </h2>
                <p className="text-[9px] md:text-[10px] text-muted-foreground leading-relaxed">
                    Q. Why does an optical illusion happen?
                </p>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-0 relative overflow-hidden p-2">
                <div className="relative rounded-lg overflow-hidden border-2 border-primary/20 shadow-2xl" style={{ maxHeight: '100%', aspectRatio: '16/10' }}>
                    {/* Room Image */}
                    <img 
                        src={ROOM_IMAGE}
                        alt="A mysterious room"
                        className="w-full h-full object-cover"
                    />
                    
                    {/* MCQ Options on the wall - top right */}
                    {showMCQ && (
                        <div className="absolute top-[5%] right-[25%] space-y-2 max-w-[35%]">
                        <button
                            onClick={() => {
                                if (!solved) {
                                    setSelectedOption(1);
                                    setFrameOpened(true);
                                    setFrameFlipped(true);
                                }
                            }}
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
                            onClick={() => {
                                if (!solved) {
                                    setSelectedOption(2);
                                    setFrameOpened(true);
                                    setFrameFlipped(true);
                                }
                            }}
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
                            onClick={() => {
                                if (!solved) {
                                    setSelectedOption(3);
                                    setFrameOpened(true);
                                    setFrameFlipped(true);
                                }
                            }}
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
                            onClick={() => {
                                if (!solved) {
                                    setSelectedOption(4);
                                    setFrameOpened(true);
                                    setFrameFlipped(true);
                                }
                            }}
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
                    )}
                    
                    {/* Invisible clickable frame area - positioned over the painting */}
                    <motion.div
                        onClick={handleFrameClick}
                        whileHover={{ scale: 1.02 }}
                        className="absolute cursor-pointer"
                        style={{
                            left: '4%',
                            top: '12%',
                            width: '24%',
                            height: '32%',
                        }}
                    >
                        {/* Transparent clickable area */}
                        <div className="w-full h-full bg-transparent" />
                    </motion.div>
                </div>
            </div>

            {/* Modal - Opens when frame is clicked */}
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
                                    onClick={handleOpenedFrameClick}
                                    className="cursor-pointer"
                                    style={{ backfaceVisibility: 'hidden' }}
                                    whileHover={{ scale: 1.02 }}
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
                                                    src={ROOM_IMAGE}
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

                                {/* Back - Message */}
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
                                            {/* Handwritten style message */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                                className="text-center px-4"
                                            >
                                                <p className="text-amber-100/40 text-[10px] tracking-[0.2em] mb-3">
                                                    THE MESSAGE READS
                                                </p>
                                                <p 
                                                    className="text-sm md:text-base font-serif text-amber-100/70 leading-relaxed"
                                                    style={{ 
                                                        fontFamily: 'Georgia, serif',
                                                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                                    }}
                                                >
                                                    {getRiddleText()}
                                                </p>
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

            {/* Answer Input - Only shows after frame is flipped */}
            <AnimatePresence>
                {frameFlipped && !solved && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 flex-shrink-0"
                    >
                        <div className="flex items-center gap-2 text-primary/60 text-[8px] mb-1">
                            <span>{">"} ENTER THE KEY TO PROCEED...</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type the answer..."
                                className={`flex-1 px-3 py-2 bg-black/60 border-2 rounded text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/50 uppercase tracking-wider ${
                                    inputError ? 'border-red-500/70' : 'border-primary/30'
                                }`}
                                autoFocus
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded text-xs text-primary font-bold transition-colors"
                            >
                                SUBMIT
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Feedback */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`mt-2 p-2 border rounded text-center flex-shrink-0 ${
                            feedback.includes("✓") 
                                ? 'bg-green-900/30 border-green-500/50' 
                                : 'bg-red-900/30 border-red-500/50'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            {feedback.includes("✓") ? (
                                <CheckCircle className="w-3 h-3 text-green-400" />
                            ) : (
                                <XCircle className="w-3 h-3 text-red-400" />
                            )}
                            <span className={`text-[10px] font-bold ${feedback.includes("✓") ? 'text-green-400' : 'text-red-400'}`}>
                                {feedback}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default StillPuzzle;
