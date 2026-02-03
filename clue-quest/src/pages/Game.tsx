import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Timer } from "@/components/Timer";
import { AnswerInput } from "@/components/AnswerInput";
import ClockPuzzle from "@/components/ClockPuzzle";
import { URLPuzzle } from "@/components/URLPuzzle";
import { CrosswordPuzzle } from "@/components/CrosswordPuzzle";
import { MorseCodePuzzle } from "@/components/MorseCodePuzzle";
import DesktopPuzzle from "@/components/DesktopPuzzle";
import { AvengersPuzzle } from "@/components/AvengersPuzzle";
import { CodeCrackerPuzzle } from "@/components/CodeCrackerPuzzle";
import { StillPuzzle } from "@/components/StillPuzzle";
import { PhoneKeypadPuzzle } from "@/components/PhoneKeypadPuzzle";
import { ThreeDoorsPuzzle } from "@/components/ThreeDoorsPuzzle";
import { GuidingHelperPuzzle } from "@/components/GuidingHelperPuzzle";
import { MineSweeperPuzzle } from "@/components/MineSweeperPuzzle";
import { FloorPlanPuzzle } from "@/components/FloorPlanPuzzle";
import { LogOut, Shield, Zap, Info, Cpu, Terminal as TerminalIcon, SkipForward, SkipBack, Lightbulb, X } from "lucide-react";

interface Level {
    id: number;
    title: string;
    type?: "clock" | "url" | "crossword" | "morse" | "filesystem" | "avengers" | "codecracker" | "still" | "phonekeypad" | "guidinghelper" | "minesweeper" | "threedoors" | "floorplan" | "video" | "text";
    content: string;
    hint?: string;
    targetTime?: string;
    directions?: string[];
    answer: string;
}

// Demo levels - will be replaced with database
const DEMO_LEVELS: Level[] = [
    {
        id: 1,
        title: "Layer 01",
        type: "clock",
        content: "TIME IS NOT A SUGGESTION.\nIT IS A SEQUENCE.\n\nTHIS SYSTEM DOES NOT FOLLOW YOUR CLOCK.\nYOU MUST FOLLOW MINE.\n\nSYNCHRONIZE THE ARROWS\nTO MATCH THE AUTHORIZED TIME PATTERN.",
        targetTime: "03:15",
        directions: ["UP", "UP", "UP", "RIGHT", "RIGHT", "RIGHT"],
        hint: "DOOM DESIGNED THIS LAYER\nTO ELIMINATE HUMAN IMPRECISION.\n\nONLY ONE SEQUENCE IS VALID.\nALL OTHERS ARE ERRORS.",
        answer: "CLOCK_SOLVED"
    },
    {
        id: 2,
        title: "Layer 02",
        type: "url",
        content: "COMPARISON IS PAINFUL.\nBUT NECESSARY.\n\nPATTERNS REVEAL WHAT INTUITION HIDES.\n\nIDENTIFY THE FRAGMENT\nTHAT OBEYS THE ESCAPE PROTOCOL.",
        answer: "CRACK"
    },
    {
        id: 3,
        title: "Layer 03 - Morse Code",
        type: "morse",
        content: "Read the dots and dashes to decode the hidden message.",
        hint: "Hop to the word given and escape key is a word in it.",
        answer: "TREND"
    },
    {
        id: 4,
        title: "Layer 04",
        content: "Placeholder puzzle 4\n\nThis is a placeholder for level 4.\nUpdate with actual puzzle content.",
        hint: "Hint for level 4",
        answer: "ANSWER4"
    },
    {
        id: 5,
        title: "Layer 05 - Video Puzzle",
        type: "video",
        content: "What's being communicated?",
        hint: "Sometimes the absence of sound speaks louder than words.",
        answer: "SILENCE"
    },
    {
        id: 6,
        title: "Layer 06 - System Archive",
        type: "filesystem",
        content: "Tom is in the library. He is reading. Find the book and discover the answer key hidden within the archives.",
        hint: "Click on the garbage bin to access the library. Find the book on the right side with the boy reading.",
        answer: "GATWAY"
    },
    {
        id: 7,
        title: "Layer 07 - Observation Puzzle",
        type: "still",
        content: "Look carefully at the image.\nNothing in this room is broken — but something is wrong.\n\nDo not assume everything is fixed.",
        hint: "Light explains shadows. Shadows explain lies.",
        answer: "ILLUSION"
    },
    {
        id: 8,
        title: "Layer 08 - Primitive Comms",
        type: "phonekeypad",
        content: "You've just found a primitive comms device. Everyone you are familiar with is trapped. Both of you must find someone who is NOT acquainted with them.",
        hint: "Look for someone who doesn't belong in this universe...",
        answer: "SHAKTHIMAN"
    },
    {
        id: 9,
        title: "Layer 09 - Crossword Puzzle",
        type: "crossword",
        content: "Solve the crossword puzzle clues to reveal the final message.",
        hint: "When all answers are correct, combine the words to reveal the hidden message.",
        answer: "LIGHT THE WAY BACK HOME"
    },
    {
        id: 10,
        title: "Layer 10 - Doom's Lair",
        type: "floorplan",
        content: "LIGHT THE PATH TO DOOM'S DOOR.\n\nNAVIGATE THE FLOOR PLAN OF DOOM'S LAIR.\nSOME ROOMS CONTAIN BOOBY TRAPS.\n\nILLUMINATE THE 3 SAFE ROOMS\nTO UNLOCK DOOM'S DOOR.",
        answer: "SAFEPATH"
    },
    {
        id: 11,
        title: "Layer 11 - Binary Door Sequence",
        type: "threedoors",
        content: "Open doors according to binary. Initialize with 000. When clicked on any door, it becomes 1 and others become 0. Complete this 8 times to reach 111.",
        hint: "Click strategically - each door click sets that door to 1 and others to 0. After exactly 8 clicks, all three must be at state 1 (111).",
        answer: "111"
    },
    {
        id: 12,
        title: "Layer 12 - Crack the Code",
        type: "codecracker",
        content: "Can you crack the code? Use logic to deduce the 3-digit combination.",
        hint: "Analyze each clue systematically. Eliminate impossible digits first.",
        answer: "718"
    },
    {
        id: 13,
        title: "Layer 13",
        content: "Placeholder puzzle 13\n\nThis is a placeholder for level 13.\nUpdate with actual puzzle content.",
        hint: "Hint for level 13",
        answer: "ANSWER13"
    },
    {
        id: 14,
        title: "Layer 14",
        content: "THE ULTIMATE TEST\n\nThis is a placeholder for the final level.\nUpdate with actual puzzle content.\n\nCombine everything you've learned.",
        hint: "The final challenge awaits.",
        answer: "VICTORY"
    }
];

const Game = () => {
    const navigate = useNavigate();
    const [currentLevel, setCurrentLevel] = useState(1);
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [teamId, setTeamId] = useState("");
    const [teamName, setTeamName] = useState("");
    const [agent1, setAgent1] = useState("");
    const [agent2, setAgent2] = useState("");
    const [successDialogue, setSuccessDialogue] = useState<string | null>(null);
    const [showIntelBulb, setShowIntelBulb] = useState(false);
    const [intelOpen, setIntelOpen] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
        const teamData = sessionStorage.getItem("lockstep_team");
        if (!teamData) {
            navigate("/");
            return;
        }

        const parsed = JSON.parse(teamData);
        setTeamId(parsed.teamId);
        setTeamName(parsed.teamName);
        setAgent1(parsed.agent1);
        setAgent2(parsed.agent2);
        setStartTime(new Date(parsed.startTime));

        const savedLevel = sessionStorage.getItem("lockstep_level");
        if (savedLevel) {
            setCurrentLevel(parseInt(savedLevel));
        }
    }, [navigate]);

    useEffect(() => {
        // Timer for showing the intel bulb after 5 minutes (300 seconds) - only for layer 1
        if (currentLevel === 1) {
            const timer = setInterval(() => {
                setTimeElapsed(prev => {
                    const newTime = prev + 1;
                    if (newTime >= 300 && !showIntelBulb) {
                        setShowIntelBulb(true);
                    }
                    return newTime;
                });
            }, 1000);

            return () => clearInterval(timer);
        } else {
            setShowIntelBulb(false);
            setTimeElapsed(0);
        }
    }, [currentLevel, showIntelBulb]);

    const handleClockSolve = () => {
        const messages = [
            "IMPUDENT FOOL! YOU'VE BYPASSED ONE LAYER, BUT MY MAINFRAME REMAINS ABSOLUTE.",
            "DO YOU THINK ONE DECRYPTED NODE MAKES YOU AN AGENT? PATHETIC.",
            "YOU'RE NAVIGATING MY WORLD NOW. DON'T GET COMFORTABLE.",
            "A MINOR SETBACK. MY SYSTEM HAS BILLIONS OF PROCESSES YOU CANNOT COMPREHEND.",
            "INCONSIDERABLE PROGRESS. THE DOOMSDAY CLOCK STILL TICKS."
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setSuccessDialogue(randomMsg);

        // Display dialogue for 3.5 seconds before progressing
        setTimeout(() => {
            setSuccessDialogue(null);
            if (currentLevel < DEMO_LEVELS.length) {
                const nextLevel = currentLevel + 1;
                setCurrentLevel(nextLevel);
                sessionStorage.setItem("lockstep_level", nextLevel.toString());
            } else {
                // Handle Game Win
                alert("PROTOCOL BREACHED: ALL LAYERS DECRYPTED.");
            }
        }, 3500);
    };

    const handleAnswer = async (answer: string): Promise<boolean> => {
        const level = DEMO_LEVELS[currentLevel - 1];
        if (!level) return false;

        await new Promise((resolve) => setTimeout(resolve, 800));

        if (answer.toUpperCase() === level.answer) {
            const messages = [
                "IMPUDENT FOOL! YOU'VE BYPASSED ONE LAYER, BUT MY MAINFRAME REMAINS ABSOLUTE.",
                "DO YOU THINK ONE DECRYPTED NODE MAKES YOU AN AGENT? PATHETIC.",
                "YOU'RE NAVIGATING MY WORLD NOW. DON'T GET COMFORTABLE.",
                "A MINOR SETBACK. MY SYSTEM HAS BILLIONS OF PROCESSES YOU CANNOT COMPREHEND.",
                "INCONSIDERABLE PROGRESS. THE DOOMSDAY CLOCK STILL TICKS."
            ];
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            setSuccessDialogue(randomMsg);

            // Display dialogue for 3.5 seconds before progressing
            setTimeout(() => {
                setSuccessDialogue(null);
                if (currentLevel < DEMO_LEVELS.length) {
                    const nextLevel = currentLevel + 1;
                    setCurrentLevel(nextLevel);
                    sessionStorage.setItem("lockstep_level", nextLevel.toString());
                } else {
                    // Handle Game Win
                    alert("PROTOCOL BREACHED: ALL LAYERS DECRYPTED.");
                }
            }, 3500);

            return true;
        }
        return false;
    };

    const handleLogout = () => {
        sessionStorage.removeItem("lockstep_team");
        sessionStorage.removeItem("lockstep_level");
        navigate("/");
    };

    const handleSkip = () => {
        if (currentLevel < DEMO_LEVELS.length) {
            const nextLevel = currentLevel + 1;
            setCurrentLevel(nextLevel);
            sessionStorage.setItem("lockstep_level", nextLevel.toString());
        } else {
            alert("PROTOCOL BREACHED: ALL LAYERS DECRYPTED.");
        }
    };

    const handlePreview = () => {
        // Go to previous level
        if (currentLevel > 1) {
            const prevLevel = currentLevel - 1;
            setCurrentLevel(prevLevel);
            sessionStorage.setItem("lockstep_level", prevLevel.toString());
        }
    };

    const currentPuzzle = DEMO_LEVELS[currentLevel - 1];

    return (
        <div className="h-screen bg-background text-foreground font-['Press_Start_2P'] flex flex-col relative overflow-hidden">

            {/* Global Emerald Grid Background */}
            <div className="fixed inset-0 noise opacity-20 pointer-events-none z-0" />
            <div
                className="fixed inset-0 opacity-5 pointer-events-none z-0"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
                        linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
                    `,
                    backgroundSize: "60px 60px"
                }}
            />

            {/* Top Header Bar */}
            <header className="h-16 flex items-center justify-between px-8 border-b-2 border-primary/20 bg-black/40 backdrop-blur-md z-20">
                <div className="flex items-center gap-4">
                    <span className="text-primary text-xs md:text-sm tracking-widest animate-pulse">DOOMSDAY//PROTOCOL</span>
                    <span className="text-[9px] text-muted-foreground/60 tracking-wide hidden md:inline">// V. VON DOOM</span>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-2 text-[10px] text-muted-foreground">
                        <Cpu className="w-3 h-3 text-primary" />
                        DOOM MAINFRAME V6.6.6
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 border border-primary/40 text-[10px] text-primary hover:bg-primary/20 transition-all rounded"
                    >
                        <LogOut className="w-3 h-3" />
                        LOGOUT
                    </button>
                </div>
            </header>

            {/* Main 3-Column Content Dashboard */}
            <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 z-10 overflow-hidden">

                {/* Left Column: Security Layers */}
                <section className="w-full md:w-1/4 h-full flex flex-col">
                    <div className="border-2 border-primary/10 bg-black/20 p-4 rounded backdrop-blur-sm flex-1 flex flex-col min-h-0">
                        <div className="text-xs text-primary/60 mb-4 border-b border-primary/10 pb-2 flex justify-between items-center flex-shrink-0">
                            <span>SECURITY LAYERS</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePreview}
                                    className="p-1 rounded bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30 transition-all"
                                    title="Previous Level"
                                >
                                    <SkipBack className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={handleSkip}
                                    className="p-1 rounded bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30 transition-all"
                                    title="Skip Level"
                                >
                                    <SkipForward className="w-3 h-3" />
                                </button>
                                <span>{currentLevel}/{DEMO_LEVELS.length}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent min-h-0">
                        {DEMO_LEVELS.map((layer) => (
                            <div
                                key={layer.id}
                                className={`flex items-center gap-3 p-3 border rounded text-xs transition-all duration-300 flex-shrink-0 ${layer.id === currentLevel
                                    ? "border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(0,255,100,0.2)]"
                                    : layer.id < currentLevel
                                        ? "border-primary/20 text-primary/40"
                                        : "border-white/5 text-muted-foreground/30 grayscale"
                                    }`}
                            >
                                <div className={`w-3 h-3 rounded-full ${layer.id === currentLevel ? "bg-primary animate-pulse" : layer.id < currentLevel ? "bg-primary/40" : "bg-white/10"}`} />
                                <div className="flex flex-col">
                                    <span className="font-bold">LAYER {layer.id.toString().padStart(2, '0')}</span>
                                    <span className="text-[10px] opacity-60">
                                        {layer.id === currentLevel ? "IN PROGRESS" : layer.id < currentLevel ? "BREACHED" : "ENCRYPTED"}
                                    </span>
                                </div>
                                {layer.id < currentLevel && <Zap className="w-3 h-3 ml-auto text-primary" />}
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto pt-3 border-t border-primary/10 text-xs flex justify-between text-muted-foreground/50 flex-shrink-0">
                        <span>PROGRESS</span>
                        <span>{Math.round((currentLevel / DEMO_LEVELS.length) * 100)}%</span>
                    </div>
                    </div>
                </section>

                {/* Middle Column: Decryption Challenge (The Main Box) */}
                <section className="flex-1 h-full relative border-2 border-primary/30 rounded-lg overflow-hidden flex flex-col shadow-2xl glow-primary">


                    {/* Content inside Box */}
                    <div className="relative z-10 flex-1 flex flex-col p-2 min-h-0">
                        <div className="flex-1 flex flex-col min-h-0">

                            <AnimatePresence mode="wait">
                                {currentPuzzle?.type === "clock" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <ClockPuzzle
                                            onCorrectAnswer={handleClockSolve}
                                            onSolve={handleClockSolve}
                                            level={1}
                                        />
                                    </motion.div>
                                ) : currentPuzzle?.type === "url" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <URLPuzzle onSolve={handleAnswer} level={2} />
                                    </motion.div>
                                ) : currentPuzzle?.type === "crossword" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col items-center justify-center"
                                    >
                                        <CrosswordPuzzle
                                            onSolve={handleAnswer}
                                            level={currentLevel}
                                        />
                                    </motion.div>
                                ) : currentPuzzle?.type === "morse" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col items-center justify-center overflow-y-auto"
                                    >
                                        <MorseCodePuzzle
                                            onSolve={handleAnswer}
                                            level={currentLevel}
                                        />
                                    </motion.div>
                                ) : currentPuzzle?.type === "filesystem" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col items-center justify-center overflow-y-auto"
                                    >
                                        <DesktopPuzzle
                                            level={currentLevel}
                                            puzzle={{
                                                question: currentPuzzle.content,
                                                answer: currentPuzzle.answer
                                            }}
                                            onCorrectAnswer={() => handleAnswer(currentPuzzle.answer)}
                                            onWrongAnswer={() => {
                                                // Wrong answer feedback
                                            }}
                                        />
                                    </motion.div>
                                ) : currentPuzzle?.type === "avengers" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <AvengersPuzzle
                                            onSolve={handleAnswer}
                                        />
                                    </motion.div>
                                ) : currentPuzzle?.type === "codecracker" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <CodeCrackerPuzzle
                                            onSolve={handleAnswer}
                                            level={currentLevel}
                                        />
                                    </motion.div>
                                ) : currentPuzzle?.type === "still" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <StillPuzzle
                                            onSolve={handleAnswer}
                                            level={currentLevel}
                                        />
                                    </motion.div>
                                ) : currentPuzzle?.type === "phonekeypad" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <PhoneKeypadPuzzle
                                            onSolve={handleAnswer}
                                            level={currentLevel}
                                        />
                                    </motion.div>
                                ) : currentPuzzle?.type === "guidinghelper" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <GuidingHelperPuzzle
                                            onSolve={handleAnswer}
                                        />
                                    </motion.div>
                                ) : currentPuzzle?.type === "minesweeper" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <MineSweeperPuzzle
                                            onSolve={handleAnswer}
                                        />
                                    </motion.div>
                                ) : currentPuzzle?.type === "floorplan" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <FloorPlanPuzzle
                                            onSolve={handleAnswer}
                                            level={currentLevel}
                                        />
                                    </motion.div>
                                ) : currentPuzzle?.type === "threedoors" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <ThreeDoorsPuzzle
                                            onSolve={handleAnswer}
                                            level={currentLevel}
                                        />
                                    </motion.div>
                                ) : currentPuzzle?.type === "video" ? (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="flex-1 flex flex-col items-center justify-center min-h-0"
                                    >
                                        <div className="w-full max-w-2xl">
                                            <video 
                                                controls 
                                                muted
                                                controlsList="nodownload nofullscreen noplaybackrate"
                                                disablePictureInPicture
                                                className="w-full rounded-lg border-2 border-primary/30 shadow-lg [&::-webkit-media-controls-volume-slider]:hidden [&::-webkit-media-controls-mute-button]:hidden [&::-webkit-media-controls-volume-control-container]:hidden"
                                                src="/z070h4fejhrmr0cw3ppt8649t0_result_.mp4"
                                                style={{ pointerEvents: 'auto' }}
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                            <p className="text-center text-xs text-muted-foreground mt-4">{currentPuzzle?.content}</p>
                                        </div>
                                        <div className="mt-4 w-full max-w-md">
                                            <AnswerInput
                                                onSubmit={(answer) => handleAnswer(answer)}
                                                correctAnswer={currentPuzzle?.answer || ""}
                                                errorMessage="You are listening too Hard"
                                            />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={currentLevel}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="bg-black/60 border-2 border-primary/20 p-6 md:p-10 rounded shadow-inner text-xs md:text-sm leading-loose tracking-wide overflow-y-auto max-h-[250px]"
                                    >
                                        <p className="whitespace-pre-wrap">{currentPuzzle?.content}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Integrated Answer Area - Only for text puzzles */}
                            {currentPuzzle?.type !== "clock" && currentPuzzle?.type !== "url" && currentPuzzle?.type !== "crossword" && currentPuzzle?.type !== "morse" && currentPuzzle?.type !== "filesystem" && currentPuzzle?.type !== "avengers" && currentPuzzle?.type !== "codecracker" && currentPuzzle?.type !== "still" && currentPuzzle?.type !== "phonekeypad" && currentPuzzle?.type !== "guidinghelper" && currentPuzzle?.type !== "threedoors" && currentPuzzle?.type !== "floorplan" && currentPuzzle?.type !== "video" && (
                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center gap-2 text-primary/60 text-[8px]">
                                        <span>{">"} ENTER DECRYPTION KEY...</span>
                                    </div>
                                    <AnswerInput
                                        onSubmit={handleAnswer}
                                        cooldown={5}
                                        compactView={true}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Right Column: System Status */}
                <section className="w-full md:w-1/4 h-full flex flex-col border-2 border-primary/10 bg-black/20 p-4 rounded backdrop-blur-sm">
                    <div className="space-y-4 flex-1 flex flex-col">

                        {/* Timer */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] text-primary/60 border-b border-primary/10 pb-2">
                                <Info className="w-3 h-3" />
                                <span>TIME REMAINING</span>
                            </div>
                            <div className="p-4 bg-black/40 border border-primary/20 rounded text-center">
                                <Timer startTime={startTime} />
                            </div>
                        </div>

                        {/* Active Unit */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] text-primary/60 border-b border-primary/10 pb-2">
                                <Zap className="w-3 h-3" />
                                <span>ACTIVE UNIT</span>
                            </div>
                            <div className="p-4 bg-black/40 border border-primary/20 rounded">
                                <div className="text-primary text-[10px] mb-2 uppercase font-bold">{teamName || "TEAM"}</div>
                                <div className="text-[8px] text-muted-foreground opacity-60 uppercase">{agent1 || "AGENT 1"} • {agent2 || "AGENT 2"}</div>
                            </div>
                        </div>

                        {/* Current Objective */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] text-primary/60 border-b border-primary/10 pb-2">
                                <Shield className="w-3 h-3" />
                                <span>CURRENT OBJECTIVE</span>
                            </div>
                            <div className="p-4 bg-black/40 border border-primary/20 rounded text-[10px] text-primary animate-pulse">
                                BREACH LAYER {currentLevel.toString().padStart(2, '0')}
                            </div>
                        </div>

                        {/* Intel Display */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] text-primary/60 border-b border-primary/10 pb-2">
                                <Info className="w-3 h-3" />
                                <span>INTEL</span>
                            </div>
                            {currentLevel === 1 ? (
                                <div className="p-4 bg-black/40 border border-primary/20 rounded">
                                    {!intelOpen ? (
                                        <button
                                            onClick={() => setIntelOpen(true)}
                                            className="w-full text-[8px] uppercase tracking-wider font-semibold py-2 px-3 rounded transition-all duration-300 bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30"
                                        >
                                            INTEL
                                        </button>
                                    ) : (
                                        <div className="space-y-3 text-center">
                                            <p className="text-[8px] font-medium tracking-wide text-gray-200 leading-relaxed">
                                                DOOM DESIGNED THIS LAYER TO ELIMINATE HUMAN IMPRECISION.
                                            </p>
                                            <div className="pt-2 border-t border-yellow-500/30">
                                                <p className="text-[8px] font-medium tracking-wide text-yellow-400 leading-relaxed">
                                                    ONLY ONE SEQUENCE IS VALID. ALL OTHERS ARE ERRORS.
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setIntelOpen(false)}
                                                className="w-full text-[7px] uppercase tracking-wider font-semibold py-1.5 px-3 rounded transition-all duration-300 bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50 mt-3"
                                            >
                                                CLOSE
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : currentPuzzle?.type === "morse" ? (
                                <div className="p-4 bg-black/40 border border-primary/20 rounded">
                                    <img 
                                        src="/morse-code.jpeg" 
                                        alt="Morse Code Reference" 
                                        className="w-full h-auto rounded border border-primary/30"
                                    />
                                </div>
                            ) : currentPuzzle?.type === "avengers" ? (
                                <div className="p-3 bg-black/40 border border-primary/20 rounded space-y-1 max-h-[200px] overflow-y-auto">
                                    <p className="text-[8px] text-yellow-400 font-bold mb-2">DECRYPTION HINTS:</p>
                                    <p className="text-[7px] text-muted-foreground">• "Steps into metal" = shield</p>
                                    <p className="text-[7px] text-muted-foreground">• "Survives ice" = frozen in time</p>
                                    <p className="text-[7px] text-muted-foreground">• "Exiled royalty" = loss of power</p>
                                    <p className="text-[7px] text-muted-foreground">• "Blue planet" = Earth</p>
                                    <p className="text-[7px] text-muted-foreground">• "Experiment splits a man" = dual identity</p>
                                    <p className="text-[7px] text-muted-foreground">• "World prefers invisible" = avoidance</p>
                                    <p className="text-[7px] text-muted-foreground">• "Prisoner creates armor" = captivity</p>
                                    <p className="text-[7px] text-muted-foreground">• "Fires tools from wrists" = tech suit</p>
                                    <p className="text-[7px] text-muted-foreground">• "Lost their past" = amnesia</p>
                                    <p className="text-[7px] text-muted-foreground">• "Sky that isn't home" = space</p>
                                </div>
                            ) : currentLevel === 2 ? (
                                <div className="p-4 bg-black/40 border border-primary/20 rounded">
                                    <div className="space-y-2 text-center">
                                        <p className="text-[8px] font-medium tracking-wide text-gray-200 leading-relaxed">
                                            HUMANS TRUST INSTINCT.
                                        </p>
                                        <p className="text-[8px] font-medium tracking-wide text-gray-200 leading-relaxed">
                                            DOOM TRUSTS COMPARISON.
                                        </p>
                                        <p className="text-[8px] font-medium tracking-wide text-yellow-400 leading-relaxed">
                                            WHAT SURVIVES COMPARISON IS WORTH PRESERVING.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 text-[8px] text-muted-foreground/40 leading-relaxed italic">
                                    {currentPuzzle?.hint ? currentPuzzle.hint : "No intel available for this layer. You're on your own, agent."}
                                </div>
                            )}
                        </div>



                    </div>

                    <div className="mt-auto text-[6px] text-center text-primary/30 tracking-[0.3em] uppercase">
                        Shield Secure Connection
                    </div>
                </section>

            </main>

            {/* Footer Bar */}
            <footer className="h-10 border-t-2 border-primary/10 bg-black/60 flex items-center justify-center text-[7px] md:text-[9px] text-primary/40 tracking-[0.5em] uppercase z-20 shrink-0">
                Shield Secure Connection // Doomsday Clock Active
            </footer>

            {/* Success Dialogue - Corner Popup */}
            <AnimatePresence>
                {successDialogue && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
                        className="fixed bottom-12 right-4 md:right-8 z-50 flex items-end gap-4 max-w-[90vw] md:max-w-md pointer-events-none"
                    >
                        <div className="bg-card border-4 border-primary p-4 rounded-lg shadow-[0_0_30px_rgba(0,255,100,0.3)] relative overflow-hidden pointer-events-auto">
                            <div className="absolute top-0 right-0 p-1 opacity-10"><TerminalIcon className="w-8 h-8" /></div>
                            <div className="text-primary text-[8px] mb-2 border-b border-primary/20 pb-1 uppercase tracking-widest flex items-center gap-2">
                                <Zap className="w-2 h-2" />
                                Incoming Comm // Dr. Doom
                            </div>
                            <p className="text-foreground text-[10px] leading-relaxed uppercase tracking-wider">
                                {successDialogue}
                            </p>
                            <div className="mt-3 flex justify-end">
                                <div className="text-[6px] text-primary/40 animate-pulse">ENCRYPTING NEXT LAYER...</div>
                            </div>
                        </div>
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-background border-4 border-primary rounded-lg overflow-hidden shrink-0 shadow-lg glow-primary self-end">
                            <img src="/dr-doom-latest.png" alt="Doom" className="w-full h-full object-cover" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Game;
