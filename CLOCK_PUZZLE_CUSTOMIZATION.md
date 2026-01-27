# Clock Puzzle - Customization Guide

## Quick Start: Changing the Puzzle

All puzzle parameters are in `src/pages/Game.tsx` in the `DEMO_LEVELS` array.

### Current Configuration
```typescript
{
    id: 1,
    title: "Layer 01",
    type: "clock",
    content: "Check the current time.\nDirections can change time.\n\nSet the clock to the target time by entering the correct sequence of directional inputs.",
    targetTime: "03:15",
    directions: ["UP", "RIGHT", "UP", "DOWN"],
    hint: "Use arrow directions: UP (add 1 hour), RIGHT (add 5 minutes), DOWN (subtract 1 hour), LEFT (subtract 5 minutes)",
    answer: "CLOCK_SOLVED"
}
```

## How to Create New Puzzles

### Step 1: Choose a Target Time
Format: `"HH:MM"` where:
- HH: 01-12 (1 to 12 o'clock)
- MM: 00-59 (minutes)

Examples:
- `"03:15"` → 3:15 AM
- `"12:00"` → 12:00 (noon or midnight)
- `"06:30"` → 6:30 AM
- `"10:45"` → 10:45 AM

### Step 2: Calculate the Direction Sequence
**Starting Position**: 12:00

**Direction Effects**:
- UP: +1 hour
- RIGHT: +5 minutes
- DOWN: -1 hour
- LEFT: -5 minutes

**Example Calculation for 06:45**:
1. Start: 12:00
2. UP: 01:00
3. UP: 02:00
4. UP: 03:00
5. UP: 04:00
6. UP: 05:00
7. UP: 06:00
8. RIGHT: 06:05
9. RIGHT: 06:10
10. RIGHT: 06:15
11. RIGHT: 06:20
12. RIGHT: 06:25
13. RIGHT: 06:30
14. RIGHT: 06:35
15. RIGHT: 06:40
16. RIGHT: 06:45 ✓

**Sequence**: `["UP", "UP", "UP", "UP", "UP", "UP", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT"]`

### Step 3: Update the Code

Edit `src/pages/Game.tsx`:

```typescript
const DEMO_LEVELS: Level[] = [
    {
        id: 1,
        title: "Layer 01",
        type: "clock",
        content: "Check the current time.\nDirections can change time.\n\nSet the clock to the target time by entering the correct sequence of directional inputs.",
        targetTime: "06:45",  // ← Change this
        directions: ["UP", "UP", "UP", "UP", "UP", "UP", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT"],  // ← Change this
        hint: "Use arrow directions...",
        answer: "CLOCK_SOLVED"
    },
```

## Puzzle Design Tips

### Beginner Puzzles (Easy to Solve)
- Use only 1-3 moves
- Combine only UP and RIGHT
- Target times near 12:00

Examples:
```typescript
// 1 hour = 1 move
targetTime: "01:00"
directions: ["UP"]

// 1.5 hours = 4 moves
targetTime: "01:30"
directions: ["UP", "RIGHT", "RIGHT", "RIGHT"]

// 2 hours = 2 moves
targetTime: "02:00"
directions: ["UP", "UP"]
```

### Intermediate Puzzles (Medium Difficulty)
- Use 5-10 moves
- Mix UP, RIGHT, and maybe one DOWN
- Target times scattered throughout the clock
- Can use negative directions to make it tricky

Examples:
```typescript
// Tricky: 02:55 using DOWN
targetTime: "02:55"
directions: ["UP", "UP", "UP", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "DOWN"]

// 08:20
targetTime: "08:20"
directions: ["UP", "UP", "UP", "UP", "UP", "UP", "UP", "UP", "RIGHT", "RIGHT", "RIGHT", "RIGHT"]
```

### Advanced Puzzles (Hard)
- Use LEFT and DOWN strategically
- 10+ moves
- Require thinking backwards
- Can use inefficient paths to confuse players

Examples:
```typescript
// 04:50 - Using wrapping
targetTime: "04:50"
directions: ["UP", "UP", "UP", "UP", "UP", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT"]

// 11:55 - Almost full circle
targetTime: "11:55"
directions: ["DOWN", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT"]
```

## Advanced Customization

### Change Component Props
Edit the ClockPuzzle component call in Game.tsx:

```typescript
<ClockPuzzle
    targetTime={currentPuzzle.targetTime}
    directions={currentPuzzle.directions}
    onSolve={handleClockSolve}
/>
```

### Modify ClockPuzzle Component
File: `src/components/ClockPuzzle.tsx`

**Change Initial Time**:
```typescript
const [hours, setHours] = useState(12);  // Change to start at different hour
const [minutes, setMinutes] = useState(0);  // Change to start at different minute
```

**Change Direction Increments**:
```typescript
const directionMap = {
    UP: { hours: 1, minutes: 0 },      // Change hour increment
    RIGHT: { hours: 0, minutes: 5 },   // Change minute increment
    DOWN: { hours: -1, minutes: 0 },
    LEFT: { hours: 0, minutes: -5 },
};
```

**Example**: To make RIGHT increment by 15 minutes:
```typescript
const directionMap = {
    UP: { hours: 1, minutes: 0 },
    RIGHT: { hours: 0, minutes: 15 },  // ← Changed from 5 to 15
    DOWN: { hours: -1, minutes: 0 },
    LEFT: { hours: 0, minutes: -5 },
};
```

## Difficulty Calculator

Quick reference for how many moves each puzzle requires:

### Minimum Moves
- 1 hour = 1 move (UP)
- 5 minutes = 1 move (RIGHT)
- 15 minutes = 3 moves (RIGHT, RIGHT, RIGHT)
- 30 minutes = 6 moves (RIGHT × 6)
- 1 hour 30 minutes = 4 moves (UP, RIGHT × 6)

### Move Count Examples
| Time | Minimum Moves | Example |
|------|---------------|---------|
| 01:00 | 1 | UP |
| 02:00 | 2 | UP, UP |
| 03:15 | 6 | UP, UP, UP, RIGHT, RIGHT, RIGHT |
| 04:30 | 10 | UP×4, RIGHT×6 |
| 06:45 | 15 | UP×6, RIGHT×9 |
| 09:25 | 13 | UP×9, RIGHT×5 |

## Testing Your Puzzle

1. **Manual Calculation**: Verify the sequence works
2. **Code Execution**: Follow the sequence step-by-step
3. **Playtest**: Actually play through the puzzle
4. **Difficulty Check**: Make sure it matches your intended difficulty

## Debugging

### If Puzzle Won't Solve
- Check `targetTime` format: must be "HH:MM"
- Verify hour is 01-12 (not 00-23)
- Verify minutes are 00-59
- Check direction sequence actually reaches target

### Quick Verification Script
```python
# Python script to verify puzzle solution
hours, minutes = 12, 0
target_h, target_m = 3, 15
directions = ["UP", "RIGHT", "UP", "DOWN"]

direction_map = {
    "UP": (1, 0),
    "DOWN": (-1, 0),
    "RIGHT": (0, 5),
    "LEFT": (0, -5),
}

for direction in directions:
    h_inc, m_inc = direction_map[direction]
    hours = (hours + h_inc + 12) % 12 or 12
    minutes = (minutes + m_inc + 60) % 60
    print(f"{direction}: {hours:02d}:{minutes:02d}")

print(f"Success: {hours == target_h and minutes == target_m}")
```

## Future Features

### Suggested Additions
1. **Time Wrapping**: Show how time wraps on clock face
2. **Difficulty Levels**: Easy/Medium/Hard automatic selection
3. **Challenge Mode**: Solve puzzle in minimum moves
4. **Speed Run**: Complete puzzle within time limit
5. **Score System**: Points based on efficiency
6. **Multiple Clocks**: Solve multiple clock puzzles simultaneously
7. **Custom Times**: Admin interface to create puzzles
8. **Analytics**: Track which puzzles players struggle with
