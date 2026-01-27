# Clock Puzzle - User Guide

## Puzzle Overview

```
┌─────────────────────────────────────┐
│         CLOCK PUZZLE                │
│                                     │
│           ╔═════════╗               │
│           ║ 12:00   ║               │
│           ╚═════════╝               │
│                                     │
│         ╔────────────╗              │
│         ║     │      ║              │
│         ║  ─┼─   9   ║   3          │
│         ║     │      ║              │
│         ╚────────────╝              │
│                                     │
│        TARGET: 03:15                │
│                                     │
│              ↑                      │
│         ← CENTER →                  │
│              ↓                      │
│                                     │
│   INPUT: UP RIGHT UP DOWN           │
│                                     │
│   [UNDO] [RESET]                   │
│                                     │
└─────────────────────────────────────┘
```

## Controls

### Directional Pad
- **UP Arrow** ↑: Adds 1 hour
- **RIGHT Arrow** →: Adds 5 minutes
- **DOWN Arrow** ↓: Subtracts 1 hour
- **LEFT Arrow** ←: Subtracts 5 minutes

### Action Buttons
- **UNDO**: Takes back the last move
- **RESET**: Returns clock to 12:00 and clears input

## Example Puzzle

### Objective
Set the clock to **03:15** (3:15 AM)

### Starting Position
- Current Time: **12:00**
- Target Time: **03:15**
- Time Difference: +3 hours 15 minutes

### Solution Steps

| Step | Action | Current Time | Notes |
|------|--------|--------------|-------|
| 0    | Start  | 12:00        | Initial position |
| 1    | UP     | 01:00        | +1 hour |
| 2    | RIGHT  | 01:05        | +5 minutes |
| 3    | UP     | 02:05        | +1 hour |
| 4    | RIGHT  | 02:10        | +5 minutes |
| 5    | UP     | 03:10        | +1 hour |
| 6    | RIGHT  | 03:15        | +5 minutes → ✓ SUCCESS! |

**Correct Sequence**: UP → RIGHT → UP → RIGHT → UP → RIGHT

## Features

### Visual Feedback
- ✓ Analog clock with moving hands
- ✓ Digital time display (HH:MM format)
- ✓ Target time shown below current time
- ✓ Input sequence displayed as you enter commands
- ✓ Green "✓ TIME SET CORRECTLY!" message on success

### Interactive Elements
- ✓ Clickable direction buttons
- ✓ Disabled buttons when puzzle is solved
- ✓ Undo button to take back moves
- ✓ Reset button to start over
- ✓ Hint showing expected direction sequence

### Mobile Support
- ✓ Responsive design works on phones and tablets
- ✓ Touch-friendly button sizes
- ✓ Scales appropriately for all screen sizes

## Tips for Players

1. **Count Your Moves**: Each direction input counts. Minimize unnecessary moves.
2. **Use Undo**: If you make a mistake, use UNDO instead of RESET.
3. **Check the Hint**: The hint shows which directions to use (though not in order).
4. **Work Backwards**: If needed, think about what combination reaches the target.
5. **Remember Modulo**: Hours wrap from 12 to 1 (not 0), and minutes wrap from 59 to 0.

## Keyboard Shortcuts (Future Enhancement)

These could be added:
- **Arrow Keys**: Navigate directions
- **Enter**: Confirm
- **Backspace**: Undo last move
- **R**: Reset puzzle

## Difficulty Variants

### Easy
- Target: **01:00** (1 hour)
- Sequence: **UP**

### Medium
- Target: **02:30** (2 hours 30 minutes)
- Sequence: **UP, UP, RIGHT, RIGHT, RIGHT**

### Hard
- Target: **06:45** (6 hours 45 minutes)
- Sequence: **UP, UP, UP, UP, UP, UP, RIGHT, RIGHT, RIGHT, RIGHT, RIGHT, RIGHT, RIGHT, RIGHT, RIGHT**

### Expert
- Target: **10:50** with counterintuitive path using DOWN and LEFT

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Clock hands not moving | Make sure you're clicking the direction buttons |
| Stuck at wrong time | Click UNDO to go back one move |
| Want to start over | Click RESET to return to 12:00 |
| Can't reach target | Double-check the time - remember hours wrap to 1-12 |
| Buttons not responding | Make sure puzzle isn't already solved |

## Game Integration

- **Part of**: Layer 01 in Doomsday Protocol
- **Difficulty**: Introductory puzzle to teach game mechanics
- **Time Limit**: Determined by game timer (right panel)
- **Progress**: Solving this puzzle unlocks Layer 02
- **Success Message**: AI Villain responds with sarcastic dialogue
