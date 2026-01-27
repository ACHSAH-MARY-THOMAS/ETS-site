import { useState, useEffect } from 'react';
import LevelLadder from './LevelLadder';
import PuzzleTerminal from './PuzzleTerminal';
import ClockPuzzle from './ClockPuzzle';
import StatusPanel from './StatusPanel';
import LevelUpModal from './LevelUpModal';
import DesktopPuzzle from './DesktopPuzzle';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LogOut } from 'lucide-react';

interface GameDashboardProps {
  teamData: {
    id: string;
    teamName: string;
    agent1: string;
    agent2: string;
    currentLevel: number;
    completedLevels: number[];
  };
  onLogout: () => void;
}

const PUZZLES = [
  // LEVEL 1 - Easy Warm-up (Riddle)
  {
    level: 1,
    question: "I have cities, but no houses live there. I have mountains, but no trees grow there. I have water, but no fish swim there. I have roads, but no cars drive there. What am I?",
    answer: "map",
  },
  // LEVEL 2 - Simple Pattern (Mirror)
  {
    level: 2,
    question: "Doom's mirror shows a hidden word. Look at the image and read what you see when reflected.",
    image: "/puzzles/mirror-text.svg",
    answer: "escape",
  },
  // LEVEL 3 - Clock Cipher (Easy visual)
  {
    level: 3,
    question: "Doom encodes messages using time. Each clock shows an hour. If 1=A, 2=B, 3=C... what 3-letter word do these clocks spell?",
    image: "/puzzles/clock-cipher.svg",
    answer: "hec",
  },
  // LEVEL 4 - Number Pattern
  {
    level: 4,
    question: "Doom's security sequence follows a pattern. Look at the image and find the next TWO numbers. Enter them separated by a comma.",
    image: "/puzzles/sequence-pattern.svg",
    answer: "64,128",
  },
  // LEVEL 5 - Riddle with wordplay
  {
    level: 5,
    question: "The more you take, the more you leave behind. What am I?",
    answer: "footsteps",
  },
  // LEVEL 6 - Reverse Reading
  {
    level: 6,
    question: "Doom's arrow reveals the truth. Follow its direction to decode the hidden word.",
    image: "/puzzles/reverse-logic.svg",
    answer: "prison",
  },
  // LEVEL 7 - Symbol Math (Visual Logic)
  {
    level: 7,
    question: "Doom loves equations. Solve for each symbol, then calculate the final answer. Enter just the number.",
    image: "/puzzles/symbol-math.svg",
    hint: "Star=10, work backwards from there. Moon=6, Triangle=3.",
    answer: "19",
  },
  // LEVEL 8 - Number Cipher
  {
    level: 8,
    question: "In Doom's alphabet, A=1, B=2, C=3... and so on. Decode the numbered message in the image. What word does it spell?",
    image: "/puzzles/number-cipher.svg",
    answer: "freedom",
  },
  // LEVEL 9 - Lateral Thinking
  {
    level: 9,
    question: "A man pushes his car to a hotel and tells the owner he's bankrupt. Why?",
    hint: "Think games, not real life.",
    answer: "monopoly",
  },
  // LEVEL 10 - Morse Code
  {
    level: 10,
    question: "Doom's encrypted transmission uses ancient radio code. Decode the visual pattern where DASH (━) is long and DOT (●) is short. What 5-letter word is hidden?",
    image: "/puzzles/morse-code.svg",
    hint: "D=-.. O=--- M=--",
    answer: "dooms",
  },
  // LEVEL 11 - Hidden Word (Visual Search)
  {
    level: 11,
    question: "A word hides within Doom's text grid. The brighter letters form a diagonal path. Find the 6-letter hidden word.",
    image: "/puzzles/hidden-word.svg",
    answer: "shadow",
  },
  // LEVEL 12 - Caesar Cipher
  {
    level: 12,
    question: "Doom uses an ancient Roman cipher. The wheel shows the shift: outer ring is the original, inner ring is the encoded version. Decode 'GRRP' using a shift of 3 backwards. What word emerges?",
    image: "/puzzles/cipher-wheel.svg",
    hint: "G→D, R→O, R→O, P→M. Shift each letter back 3 positions in the alphabet.",
    answer: "doom",
  },
  // LEVEL 13 - Rebus Puzzle
  {
    level: 13,
    question: "Doom speaks in pictures. What single word does this visual equation represent?",
    image: "/puzzles/rebus-eye.svg",
    hint: "Say what you see out loud: Eye + Tin/Can + Sea waves = ?",
    answer: "icantsy",
  },
  // LEVEL 14 - Grid Cipher (Polybius Square)
  {
    level: 14,
    question: "Doom's grid cipher uses coordinates. Each pair of numbers (Row, Column) points to a letter. Decode: 25-34-15-15-33. What 5-letter word is revealed?",
    image: "/puzzles/grid-cipher.svg",
    hint: "2,5=K | 3,4=O | 1,5=E | 1,5=E | 3,3=N",
    answer: "green",
  },
  // LEVEL 15 - Final Challenge (Multiple steps)
  {
    level: 15,
    question: "FINAL BREACH: The letters shown spell part of Dr. Doom's homeland. L-A-T-V-E-R-?-A. What single letter completes this 8-letter country name? (Just enter the missing letter)",
    image: "/puzzles/crossword-clue.svg",
    hint: "This Eastern European nation is fictional but famous in Marvel. It's ruled by Victor Von Doom.",
    answer: "i",
  },
];

const INITIAL_TIME = 3 * 60 * 60; // 3 hours in seconds

const GameDashboard = ({ teamData, onLogout }: GameDashboardProps) => {
  const [currentLevel, setCurrentLevel] = useState(teamData.currentLevel);
  const [completedLevels, setCompletedLevels] = useState<number[]>(teamData.completedLevels);
  const [hintRevealed, setHintRevealed] = useState(false);
  const [timeRemaining] = useState(INITIAL_TIME);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpPhase, setLevelUpPhase] = useState(0);
  const [pendingNextLevel, setPendingNextLevel] = useState<number | null>(null);

  const currentPuzzle = PUZZLES.find(p => p.level === currentLevel) || PUZZLES[0];

  // Save progress to database
  const saveProgress = async (level: number, completed: number[]) => {
    try {
      await supabase
        .from('teams')
        .update({
          current_level: level,
          completed_levels: completed,
        })
        .eq('id', teamData.id);
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };

  const handleCorrectAnswer = () => {
    toast({
      title: "LAYER BREACHED",
      description: `Security Layer ${currentLevel} has been compromised.`,
      className: "bg-card border-primary text-foreground",
    });

    const newCompletedLevels = [...completedLevels, currentLevel];
    setCompletedLevels(newCompletedLevels);
    setHintRevealed(false);

    // Check if we completed a phase (levels 5, 10, or 15)
    if (currentLevel === 5) {
      // Phase 1 complete
      setTimeout(() => {
        setLevelUpPhase(1);
        setPendingNextLevel(6);
        setShowLevelUp(true);
        saveProgress(6, newCompletedLevels);
      }, 1000);
    } else if (currentLevel === 10) {
      // Phase 2 complete
      setTimeout(() => {
        setLevelUpPhase(2);
        setPendingNextLevel(11);
        setShowLevelUp(true);
        saveProgress(11, newCompletedLevels);
      }, 1000);
    } else if (currentLevel === 15) {
      // Game complete - Phase 3
      setTimeout(() => {
        setLevelUpPhase(3);
        setPendingNextLevel(null);
        setShowLevelUp(true);
        saveProgress(15, newCompletedLevels);
      }, 1000);
    } else if (currentLevel < 15) {
      // Regular level progression
      const nextLevel = currentLevel + 1;
      setTimeout(() => {
        setCurrentLevel(nextLevel);
        saveProgress(nextLevel, newCompletedLevels);
      }, 1000);
    }
  };

  const handleLevelUpContinue = () => {
    setShowLevelUp(false);
    if (pendingNextLevel) {
      setCurrentLevel(pendingNextLevel);
      setPendingNextLevel(null);
    }
  };

  const handleWrongAnswer = () => {
    toast({
      title: "ACCESS DENIED",
      description: "Invalid decryption key. Try again.",
      variant: "destructive",
    });
  };

  const handleHintUsed = () => {
    setHintRevealed(true);
    toast({
      title: "INTEL RECEIVED",
      description: "30 second time penalty applied.",
      className: "bg-card border-muted-foreground text-foreground",
    });
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(hsl(120 60% 20% / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(120 60% 20% / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* CRT Overlay */}
      <div className="crt-overlay" />

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-primary font-bold text-lg tracking-wider">
              DOOMSDAY<span className="text-muted-foreground">//</span>PROTOCOL
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider hidden md:block">
              DOOM MAINFRAME v6.6.6
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleCorrectAnswer}
              className="gap-2 border-dashed border-red-500/50 bg-red-950/30 hover:bg-red-900/50 text-red-500"
            >
              SKIP (DEV)
            </Button>
            <Button
              variant="terminal"
              size="sm"
              onClick={onLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">LOGOUT</span>
            </Button>
          </div>
        </div>
      </header >

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Level Ladder */}
          <div className="lg:col-span-3">
            <LevelLadder
              currentLevel={currentLevel}
              totalLevels={15}
              completedLevels={completedLevels}
              onLevelClick={(level) => {
                if (completedLevels.includes(level) || level === currentLevel) {
                  setCurrentLevel(level);
                  setHintRevealed(false);
                }
              }}
            />
          </div>

          {/* Center - Puzzle Terminal */}
          <div className="lg:col-span-6">
            {currentLevel === 1 ? (
              <ClockPuzzle
                onCorrectAnswer={handleCorrectAnswer}
                onWrongAnswer={handleWrongAnswer}
                level={currentLevel}
              />
            ) : currentLevel === 15 ? (
              <DesktopPuzzle
                puzzle={currentPuzzle}
                onCorrectAnswer={handleCorrectAnswer}
                onWrongAnswer={handleWrongAnswer}
              />
            ) : (
              <PuzzleTerminal
                puzzle={currentPuzzle}
                onCorrectAnswer={handleCorrectAnswer}
                onWrongAnswer={handleWrongAnswer}
              />
            )}
          </div>

          {/* Right - Status Panel */}
          <div className="lg:col-span-3">
            <StatusPanel
              teamName={teamData.teamName}
              agent1={teamData.agent1}
              agent2={teamData.agent2}
              currentLevel={currentLevel}
              hint={currentPuzzle.hint}
              onHintUsed={handleHintUsed}
              hintRevealed={hintRevealed}
              timeRemaining={timeRemaining}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-auto py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground/50 uppercase tracking-[0.3em]">
            SHIELD SECURE CONNECTION // DOOMSDAY CLOCK ACTIVE
          </p>
        </div>
      </footer>

      {/* Level Up Modal */}
      <LevelUpModal
        isOpen={showLevelUp}
        phase={levelUpPhase}
        onContinue={handleLevelUpContinue}
      />
    </div>
  );
};

export default GameDashboard;
