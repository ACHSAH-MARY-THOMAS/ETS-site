import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, HelpCircle, MapPin, Target, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuidingHelperPuzzleProps {
    onSolve?: (answer: string) => void;
}

interface Question {
    id: number;
    text: string;
    options: { label: string; text: string }[];
    correctAnswer: string; // The "correct" reasoning answer
}

const QUESTIONS: Question[] = [
    {
        id: 1,
        text: "What can you catch but never throw?",
        options: [
            { label: "A", text: "A shadow" },
            { label: "B", text: "A disease" },
            { label: "C", text: "A cold" },
            { label: "D", text: "A thought" },
        ],
        correctAnswer: "C",
    },
    {
        id: 2,
        text: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
        options: [
            { label: "A", text: "A ghost" },
            { label: "B", text: "A whisper" },
            { label: "C", text: "An echo" },
            { label: "D", text: "A shadow" },
        ],
        correctAnswer: "C",
    },
    {
        id: 3,
        text: "What comes once in a minute, twice in a moment, but never in a thousand years?",
        options: [
            { label: "A", text: "Time" },
            { label: "B", text: "The letter M" },
            { label: "C", text: "Death" },
            { label: "D", text: "A chance" },
        ],
        correctAnswer: "B",
    },
    {
        id: 4,
        text: "I am always hungry and will die if not fed, but whatever I touch will soon turn red. What am I?",
        options: [
            { label: "A", text: "Fire" },
            { label: "B", text: "Rust" },
            { label: "C", text: "Blood" },
            { label: "D", text: "A vampire" },
        ],
        correctAnswer: "A",
    },
    {
        id: 5,
        text: "The more you take, the more you leave behind. What am I?",
        options: [
            { label: "A", text: "Memories" },
            { label: "B", text: "Time" },
            { label: "C", text: "Footsteps" },
            { label: "D", text: "Regrets" },
        ],
        correctAnswer: "C",
    },
    {
        id: 6,
        text: "What has cities, but no houses; forests, but no trees; and water, but no fish?",
        options: [
            { label: "A", text: "A desert" },
            { label: "B", text: "A map" },
            { label: "C", text: "A painting" },
            { label: "D", text: "A dream" },
        ],
        correctAnswer: "B",
    },
    {
        id: 7,
        text: "What has hands but cannot clap?",
        options: [
            { label: "A", text: "A statue" },
            { label: "B", text: "A clock" },
            { label: "C", text: "A mannequin" },
            { label: "D", text: "A robot" },
        ],
        correctAnswer: "B",
    },
    {
        id: 8,
        text: "What has a head and a tail but no body?",
        options: [
            { label: "A", text: "A snake" },
            { label: "B", text: "A coin" },
            { label: "C", text: "A river" },
            { label: "D", text: "A comet" },
        ],
        correctAnswer: "B",
    },
    {
        id: 9,
        text: "What runs but never walks, has a mouth but never talks?",
        options: [
            { label: "A", text: "A river" },
            { label: "B", text: "Time" },
            { label: "C", text: "A machine" },
            { label: "D", text: "Wind" },
        ],
        correctAnswer: "A",
    },
    {
        id: 10,
        text: "What gets wetter the more it dries?",
        options: [
            { label: "A", text: "A sponge" },
            { label: "B", text: "A towel" },
            { label: "C", text: "Rain" },
            { label: "D", text: "A cloud" },
        ],
        correctAnswer: "B",
    },
    {
        id: 11,
        text: "What has an eye but cannot see?",
        options: [
            { label: "A", text: "A storm" },
            { label: "B", text: "A camera" },
            { label: "C", text: "A needle" },
            { label: "D", text: "A potato" },
        ],
        correctAnswer: "C",
    },
    {
        id: 12,
        text: "I have keys but no locks. I have space but no room. You can enter but can't go inside. What am I?",
        options: [
            { label: "A", text: "A piano" },
            { label: "B", text: "A keyboard" },
            { label: "C", text: "A maze" },
            { label: "D", text: "A door" },
        ],
        correctAnswer: "B",
    },
    {
        id: 13,
        text: "What begins with T, ends with T, and has T in it?",
        options: [
            { label: "A", text: "A tent" },
            { label: "B", text: "A teapot" },
            { label: "C", text: "A trumpet" },
            { label: "D", text: "A toolkit" },
        ],
        correctAnswer: "B",
    },
    {
        id: 14,
        text: "What can travel around the world while staying in a corner?",
        options: [
            { label: "A", text: "A stamp" },
            { label: "B", text: "A postcard" },
            { label: "C", text: "An idea" },
            { label: "D", text: "A spider" },
        ],
        correctAnswer: "A",
    },
    {
        id: 15,
        text: "What has words but never speaks?",
        options: [
            { label: "A", text: "A library" },
            { label: "B", text: "A book" },
            { label: "C", text: "A sign" },
            { label: "D", text: "A mute" },
        ],
        correctAnswer: "B",
    },
    {
        id: 16,
        text: "What breaks when you say its name?",
        options: [
            { label: "A", text: "A secret" },
            { label: "B", text: "Silence" },
            { label: "C", text: "A promise" },
            { label: "D", text: "Trust" },
        ],
        correctAnswer: "B",
    },
];

// Direction mapping for answers
// Correct riddle answers move optimally toward destination (row: 0, col: 4)
// Wrong answers move in suboptimal or harmful directions
const DIRECTION_MAPPINGS: { [key: number]: { [key: string]: string } } = {
    1: { A: "left", B: "back", C: "forward-right", D: "right" },
    2: { A: "back", B: "left", C: "forward-right", D: "right" },
    3: { A: "back", B: "forward-right", C: "left", D: "right" },
    4: { A: "forward", B: "left", C: "back", D: "right" },
    5: { A: "left", B: "back", C: "forward", D: "right" },
    6: { A: "left", B: "forward", C: "back", D: "right" },
    7: { A: "back", B: "forward-right", C: "left", D: "right" },
    8: { A: "left", B: "forward", C: "back", D: "right" },
    9: { A: "forward-right", B: "back", C: "left", D: "right" },
    10: { A: "left", B: "forward", C: "back", D: "right" },
    11: { A: "back", B: "right", C: "forward-right", D: "left" },
    12: { A: "left", B: "forward", C: "back", D: "right" },
    13: { A: "back", B: "forward-right", C: "left", D: "right" },
    14: { A: "forward", B: "back", C: "left", D: "right" },
    15: { A: "left", B: "forward", C: "back", D: "right" },
    16: { A: "back", B: "forward-right", C: "left", D: "right" },
};

const GRID_SIZE = 8;
const START_POS = { row: 7, col: 2 }; // Bottom-left area
const END_POS = { row: 0, col: 6 }; // Top-right area
const MAX_WRONG_ANSWERS = 5;

// The correct path sequence (correct riddle answers)
const CORRECT_PATH = ["C", "C", "B", "A", "C", "B", "B", "B", "A", "B", "C", "B", "B", "A", "B", "B"];
const ANSWER = "TOMORROW";

export const GuidingHelperPuzzle = ({ onSolve }: GuidingHelperPuzzleProps) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [helperPos, setHelperPos] = useState(START_POS);
    const [path, setPath] = useState<string[]>([]);
    const [visitedCells, setVisitedCells] = useState<{ row: number; col: number; isCorrect?: boolean }[]>([{ ...START_POS, isCorrect: true }]);
    const [wrongAnswerCount, setWrongAnswerCount] = useState(0);
    const [questionSet, setQuestionSet] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [solved, setSolved] = useState(false);
    const [failed, setFailed] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const moveHelper = (direction: string, isCorrectAnswer: boolean) => {
        let newPos = { ...helperPos };

        switch (direction) {
            case "forward-right":
                // Diagonal movement - optimal path toward destination
                newPos.row = Math.max(0, newPos.row - 1);
                newPos.col = Math.min(GRID_SIZE - 1, newPos.col + 1);
                break;
            case "forward-left":
                newPos.row = Math.max(0, newPos.row - 1);
                newPos.col = Math.max(0, newPos.col - 1);
                break;
            case "left":
                // Horizontal movement - not advancing toward goal
                newPos.col = Math.max(0, newPos.col - 1);
                break;
            case "right":
                // Horizontal movement - slight progress
                newPos.col = Math.min(GRID_SIZE - 1, newPos.col + 1);
                break;
            case "back":
                // Moving away from goal - punishment for wrong answer
                newPos.row = Math.min(GRID_SIZE - 1, newPos.row + 1);
                break;
            case "forward":
                // Vertical movement - good progress
                newPos.row = Math.max(0, newPos.row - 1);
                break;
        }

        setHelperPos(newPos);
        setVisitedCells((prev) => [...prev, { ...newPos, isCorrect: isCorrectAnswer }]);
        return newPos;
    };

    const handleAnswer = (answer: string) => {
        if (solved || failed || showResult) return;

        const questionNum = currentQuestion + 1;
        const direction = DIRECTION_MAPPINGS[questionNum][answer];
        const isCorrect = answer === QUESTIONS[currentQuestion].correctAnswer;
        
        // Track wrong answers
        if (!isCorrect) {
            const newWrongCount = wrongAnswerCount + 1;
            setWrongAnswerCount(newWrongCount);
            
            // Reset if 5 wrong answers
            if (newWrongCount >= MAX_WRONG_ANSWERS) {
                setFeedback("⚠ Too many wrong answers! Starting fresh with new questions...");
                setTimeout(() => {
                    setCurrentQuestion(0);
                    setHelperPos(START_POS);
                    setPath([]);
                    setVisitedCells([{ ...START_POS, isCorrect: true }]);
                    setWrongAnswerCount(0);
                    setQuestionSet((prev) => prev + 1);
                    setFeedback("");
                }, 2000);
                return;
            }
        }
        
        const newPos = moveHelper(direction, isCorrect);
        const newPath = [...path, answer];
        setPath(newPath);

        // Check if helper reached destination
        if (newPos.row === END_POS.row && newPos.col === END_POS.col) {
            setSolved(true);
            setFeedback("✓ The helper has reached the destination!");
            setTimeout(() => {
                onSolve?.(ANSWER);
            }, 2000);
            return;
        }

        // Check if this was the last question
        if (currentQuestion >= QUESTIONS.length - 1) {
            setShowResult(true);
            if (newPos.row === END_POS.row && newPos.col === END_POS.col) {
                setSolved(true);
                setFeedback("✓ The helper has reached the destination!");
                setTimeout(() => {
                    onSolve?.(ANSWER);
                }, 2000);
            } else {
                setFailed(true);
                setFeedback("✗ The helper did not reach the destination. The path was incorrect.");
            }
            return;
        }

        // Move to next question
        setTimeout(() => {
            setCurrentQuestion((prev) => prev + 1);
        }, 500);
    };

    const handleReset = () => {
        setCurrentQuestion(0);
        setHelperPos(START_POS);
        setPath([]);
        setVisitedCells([{ ...START_POS, isCorrect: true }]);
        setWrongAnswerCount(0);
        setQuestionSet(0);
        setFeedback("");
        setSolved(false);
        setFailed(false);
        setShowResult(false);
    };

    const question = QUESTIONS[currentQuestion];

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
                    THE RIDDLE CHAMBER
                </h2>
                <p className="text-[9px] md:text-[10px] text-muted-foreground italic">
                    "Ancient wisdom guides the path forward."
                </p>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row gap-3 min-h-0 overflow-hidden items-stretch">
                {/* Grid Section */}
                <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900/30 border border-primary/20 rounded p-3">
                    <div className="text-[8px] text-muted-foreground mb-1 flex flex-col items-center gap-1">
                        <div>Step {Math.min(currentQuestion + 1, QUESTIONS.length)} of {QUESTIONS.length}</div>
                        <div className={cn(
                            "font-bold",
                            wrongAnswerCount >= 4 ? "text-red-500" : wrongAnswerCount >= 3 ? "text-orange-500" : "text-primary"
                        )}>
                            Wrong: {wrongAnswerCount}/{MAX_WRONG_ANSWERS}
                        </div>
                    </div>
                    <div
                        className="grid gap-0.5 bg-zinc-900 p-1 rounded border border-primary/30"
                        style={{
                            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                        }}
                    >
                        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                            const row = Math.floor(index / GRID_SIZE);
                            const col = index % GRID_SIZE;
                            const isHelper = helperPos.row === row && helperPos.col === col;
                            const isEnd = END_POS.row === row && END_POS.col === col;
                            const visitedCell = visitedCells.find((c) => c.row === row && c.col === col);
                            const isVisited = !!visitedCell;
                            const isStart = START_POS.row === row && START_POS.col === col;
                            const wasCorrectMove = visitedCell?.isCorrect;

                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        "w-5 h-5 md:w-7 md:h-7 rounded-sm flex items-center justify-center transition-all duration-300",
                                        isHelper
                                            ? "bg-primary text-black"
                                            : isEnd
                                            ? "bg-green-500/30 border border-green-500"
                                            : isVisited && !isStart
                                            ? wasCorrectMove
                                                ? "bg-primary/30 border border-primary/20"
                                                : "bg-red-500/20 border border-red-500/30"
                                            : "bg-zinc-800"
                                    )}
                                >
                                    {isHelper && <MapPin className="w-3 h-3 md:w-4 md:h-4" />}
                                    {isEnd && !isHelper && <Target className="w-3 h-3 md:w-4 md:h-4 text-green-500" />}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-[8px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-primary rounded-sm" />
                            <span>Helper</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-500/30 border border-green-500 rounded-sm" />
                            <span>Destination</span>
                        </div>
                    </div>
                </div>

                {/* Question Section */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    {!showResult ? (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestion}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col bg-zinc-900/50 border border-primary/20 rounded p-3"
                            >
                                <div className="flex items-start gap-2 mb-3">
                                    <HelpCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                    <p className="text-[10px] md:text-xs text-foreground leading-relaxed">
                                        {question.text}
                                    </p>
                                </div>

                                <div className="flex-1 grid grid-cols-1 gap-2">
                                    {question.options.map((option) => (
                                        <button
                                            key={option.label}
                                            onClick={() => handleAnswer(option.label)}
                                            disabled={solved || failed}
                                            className={cn(
                                                "flex items-center gap-2 p-2 rounded border transition-all text-left",
                                                "bg-zinc-800/50 border-zinc-700 hover:border-primary/50 hover:bg-zinc-800",
                                                "disabled:opacity-50 disabled:cursor-not-allowed"
                                            )}
                                        >
                                            <span className="w-5 h-5 flex items-center justify-center bg-primary/20 text-primary text-[10px] font-bold rounded">
                                                {option.label}
                                            </span>
                                            <span className="text-[9px] md:text-[10px] text-foreground">
                                                {option.text}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-1 flex flex-col items-center justify-center bg-zinc-900/50 border border-primary/20 rounded p-3"
                        >
                            {solved ? (
                                <>
                                    <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
                                    <p className="text-xs text-green-400 text-center">
                                        The helper has arrived.
                                    </p>
                                    <p className="text-[9px] text-muted-foreground mt-1">
                                        Your guidance was true.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-10 h-10 text-red-500 mb-2" />
                                    <p className="text-xs text-red-400 text-center">
                                        The helper is lost.
                                    </p>
                                    <p className="text-[9px] text-muted-foreground mt-1 mb-3">
                                        The path was incorrect.
                                    </p>
                                    <button
                                        onClick={handleReset}
                                        className="flex items-center gap-2 px-3 py-2 bg-primary text-black text-[10px] font-bold rounded hover:bg-primary/90 transition-colors"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                        Try Again
                                    </button>
                                </>
                            )}
                        </motion.div>
                    )}

                    {/* Feedback */}
                    <AnimatePresence>
                        {feedback && !showResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className={cn(
                                    "mt-2 flex items-center justify-center gap-2 py-2 rounded text-[10px] font-mono",
                                    solved
                                        ? "bg-green-500/20 border border-green-500/50 text-green-400"
                                        : "bg-red-500/20 border border-red-500/50 text-red-400"
                                )}
                            >
                                {feedback}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex-shrink-0 mt-2">
                <div className="flex justify-center gap-1">
                    {QUESTIONS.map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                i < currentQuestion
                                    ? "bg-primary"
                                    : i === currentQuestion
                                    ? "bg-primary/50 animate-pulse"
                                    : "bg-zinc-700"
                            )}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default GuidingHelperPuzzle;
