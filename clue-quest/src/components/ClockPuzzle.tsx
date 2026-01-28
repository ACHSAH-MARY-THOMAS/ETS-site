import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Terminal, Skull, ArrowUp, ArrowRight, ArrowDown, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { submitAnswer } from '@/lib/api';

interface ClockPuzzleProps {
    onCorrectAnswer?: () => void;
    onWrongAnswer?: () => void;
    onSolve?: (answer: string) => void;
    level?: number;
}

type Direction = 'up' | 'right' | 'down' | 'left';

const directionIcons = {
    up: ArrowUp,
    right: ArrowRight,
    down: ArrowDown,
    left: ArrowLeft,
};

const directionRotations = {
    up: 0,
    right: 90,
    down: 180,
    left: 270,
};

const ClockPuzzle = ({ onCorrectAnswer, onWrongAnswer, onSolve, level = 1 }: ClockPuzzleProps) => {
    const [arrows, setArrows] = useState<Direction[]>(['up', 'right', 'up', 'down']);
    const [arrowNumbers, setArrowNumbers] = useState<number[]>([0, 0, 0, 0]);
    const [isShaking, setIsShaking] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showDenied, setShowDenied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Randomize arrow directions on mount
        const randomDirections: Direction[] = ['up', 'right', 'down', 'left'];
        setArrows([
            randomDirections[Math.floor(Math.random() * 4)],
            randomDirections[Math.floor(Math.random() * 4)],
            randomDirections[Math.floor(Math.random() * 4)],
            randomDirections[Math.floor(Math.random() * 4)],
        ]);
    }, []);

    const rotateArrow = (index: number) => {
        if (isSuccess) return;

        const directionCycle: Direction[] = ['up', 'right', 'down', 'left'];
        const currentDirection = arrows[index];
        const currentIndex = directionCycle.indexOf(currentDirection);
        const nextDirection = directionCycle[(currentIndex + 1) % 4];

        const newArrows = [...arrows];
        newArrows[index] = nextDirection;
        setArrows(newArrows);

        // Increment the number indicator (0-9, reset after 9)
        const newNumbers = [...arrowNumbers];
        newNumbers[index] = (newNumbers[index] + 1) % 10;
        setArrowNumbers(newNumbers);
    };

    const handleSubmit = async () => {
        if (isSubmitting || isSuccess) return;
        
        setIsSubmitting(true);
        
        // Format the answer as the 4 digit numbers (e.g., "1215")
        const answer = arrowNumbers.join('');
        
        // Correct answer is 1215 (12:15)
        const correctAnswer = '1215';
        
        try {
            // Try backend validation first
            const response = await submitAnswer(answer);
            
            if (response.correct) {
                setIsSuccess(true);
                setTimeout(() => {
                    onCorrectAnswer?.();
                    onSolve?.('CLOCK_SOLVED');
                }, 800);
            } else {
                setIsShaking(true);
                setShowDenied(true);
                setTimeout(() => setIsShaking(false), 500);
                setTimeout(() => setShowDenied(false), 2000);
                onWrongAnswer?.();
            }
        } catch (error) {
            // Fallback to local validation if backend fails (demo mode)
            console.log('Backend unavailable, using local validation');
            
            if (answer === correctAnswer) {
                setIsSuccess(true);
                setTimeout(() => {
                    onCorrectAnswer?.();
                    onSolve?.('CLOCK_SOLVED');
                }, 800);
            } else {
                setIsShaking(true);
                setShowDenied(true);
                setTimeout(() => setIsShaking(false), 500);
                setTimeout(() => setShowDenied(false), 2000);
                onWrongAnswer?.();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className={cn(
                'w-full flex-1 min-h-0 glass-card-glow rounded-sm overflow-hidden transition-all duration-300 flex flex-col',
                isShaking && 'shake',
                isSuccess && 'flash-green'
            )}
        >
            {/* Header */}
            <div className="bg-secondary/50 px-4 py-3 border-b border-border flex items-center gap-3 flex-shrink-0">
                <Terminal className="h-5 w-5 text-primary" />
                <span className="text-sm uppercase tracking-[0.2em] text-primary font-bold">
                    Security Layer {level.toString().padStart(2, '0')}
                </span>
                <span className="text-muted-foreground text-sm">// AUTHOR: V. VON DOOM</span>
            </div>

            {/* Content */}
            <div className="px-3 py-2 space-y-1 flex flex-col flex-1 min-h-0 overflow-hidden w-full">
                {/* Puzzle Question */}
                <div className="space-y-1 flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <span className="text-primary">&gt;</span> TEMPORAL DECRYPTION CHALLENGE
                    </div>

                    <div className="glass-card p-4 rounded-sm flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
                        <p className="text-foreground text-sm leading-relaxed flex-shrink-0">
                            Check the current time on the clock. The directions can change time.
                            Rotate the arrows to match the correct sequence.
                        </p>

                        {/* Clock Display */}
                        <div className="flex flex-col justify-center items-center flex-1">
                            <div className="relative w-52 h-52">
                                {/* Clock Circle */}
                                <svg viewBox="0 0 200 200" className="w-full h-full">
                                    {/* Clock face */}
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="90"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="text-primary/30"
                                    />

                                    {/* Hour markers */}
                                    {[...Array(12)].map((_, i) => {
                                        const angle = (i * 30 - 90) * (Math.PI / 180);
                                        const x1 = 100 + 75 * Math.cos(angle);
                                        const y1 = 100 + 75 * Math.sin(angle);
                                        const x2 = 100 + 85 * Math.cos(angle);
                                        const y2 = 100 + 85 * Math.sin(angle);
                                        return (
                                            <line
                                                key={i}
                                                x1={x1}
                                                y1={y1}
                                                x2={x2}
                                                y2={y2}
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="text-primary/50"
                                            />
                                        );
                                    })}

                                    {/* Hour hand pointing to 12 */}
                                    <line
                                        x1="100"
                                        y1="100"
                                        x2="100"
                                        y2="45"
                                        stroke="currentColor"
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        className="text-primary"
                                    />

                                    {/* Minute hand pointing to 3 (15 minutes) */}
                                    <line
                                        x1="100"
                                        y1="100"
                                        x2="155"
                                        y2="100"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        className="text-primary"
                                    />

                                    {/* Center dot */}
                                    <circle cx="100" cy="100" r="5" fill="currentColor" className="text-primary" />
                                </svg>
                            </div>
                        </div>

                        {/* Arrow Controls */}
                        <div className="flex-shrink-0">
                            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3 text-center">
                                Rotate arrows to match the pattern
                            </div>
                            <div className="flex justify-center gap-4">
                                {arrows.map((direction, index) => {
                                    const Icon = directionIcons[direction];
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => rotateArrow(index)}
                                            disabled={isSuccess}
                                            className={cn(
                                                'w-16 h-16 rounded-sm glass-card flex items-center justify-center',
                                                'transition-all duration-200 hover:scale-110 hover:border-primary/50',
                                                'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
                                                'border border-border'
                                            )}
                                            style={{
                                                transform: `rotate(${directionRotations[direction]}deg)`,
                                            }}
                                        >
                                            <ArrowUp className="h-7 w-7 text-primary" />
                                        </button>
                                    );
                                })}
                            </div>
                            {/* Direction Indicators */}
                            <div className="flex justify-center gap-4 mt-2">
                                {arrowNumbers.map((num, index) => (
                                    <div key={index} className="w-16 text-center text-primary font-bold text-lg">
                                        {num}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Access Denied Message */}
                {showDenied && (
                    <div className="flex items-center justify-center gap-2 py-2 bg-destructive/10 border border-destructive/50 rounded-sm animate-fade-in flex-shrink-0">
                        <Skull className="h-4 w-4 text-destructive" />
                        <span className="text-destructive font-bold text-xs uppercase tracking-wider">
                            Access Denied. Doom is watching.
                        </span>
                    </div>
                )}

                {/* Success Message */}
                {isSuccess && (
                    <div className="flex items-center justify-center gap-2 py-2 bg-primary/10 border border-primary/50 rounded-sm animate-fade-in flex-shrink-0">
                        <span className="text-primary font-bold text-xs uppercase tracking-wider">
                            Temporal Lock Breached. Proceeding...
                        </span>
                    </div>
                )}

                {/* Submit Button */}
                <Button
                    onClick={handleSubmit}
                    className="w-full bg-primary text-black hover:bg-primary/90 font-bold text-sm uppercase tracking-widest py-3 flex-shrink-0"
                    disabled={isSuccess || isSubmitting}
                >
                    {isSubmitting ? 'VERIFYING...' : 'EXECUTE'}
                </Button>
            </div>
        </div>
    );
};

export default ClockPuzzle;
