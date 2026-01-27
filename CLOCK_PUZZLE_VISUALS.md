# Clock Puzzle - Visual Diagrams

## Game Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ DOOMSDAY//PROTOCOL                                            DOOM MAINFRAME │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ ┌──────────────────────────────┐ ┌──────────────────────────┐ ┌───────────┐ │
│ │ SECURITY LAYERS              │ │ DECRYPTION CHALLENGE     │ │ TIME LEFT │ │
│ │                              │ │                          │ │           │ │
│ │ ● LAYER 01                   │ │ SET CLOCK TO TARGET TIME │ │ 59:45     │ │
│ │   IN PROGRESS                │ │                          │ │           │ │
│ │ ○ LAYER 02                   │ │ ╔══════════════╗        │ │ ACTIVE:   │ │
│ │   ENCRYPTED                  │ │ ║   03:15      ║        │ │ Team A    │ │
│ │ ○ LAYER 03                   │ │ ╚══════════════╝        │ │           │ │
│ │   ENCRYPTED                  │ │                          │ │           │ │
│ │ ○ LAYER 04                   │ │    ╱────────╲           │ │           │ │
│ │   ENCRYPTED                  │ │   │    ↑     │          │ │           │ │
│ │                              │ │   │ ←  ●  → │          │ │           │ │
│ │ PROGRESS: 25%                │ │   │    ↓     │          │ │           │ │
│ │                              │ │    ╲────────╱           │ │           │ │
│ └──────────────────────────────┘ │  (directional pad)      │ │           │ │
│                                  │                          │ │           │ │
│                                  │ INPUT: UP UP UP RIGHT... │ │           │ │
│                                  │                          │ │           │ │
│                                  │ [UNDO] [RESET]           │ │           │ │
│                                  │                          │ │           │ │
│                                  │ ✓ TIME SET CORRECTLY!    │ │           │ │
│                                  │                          │ │           │ │
│                                  └──────────────────────────┘ │           │ │
│                                                                 └───────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Clock Face Progression

### Initial State (12:00)

```
          12
        ╱    ╲
       11    1
      10    2
   9   ●    3
      8    4
       7   5
        ╲   ╱
         6

Hour Hand: Points to 12 (top)
Minute Hand: Points to 12 (top)
Digital Display: 12:00
Target: 03:15
```

### After 1st UP (01:00)

```
          12
        ╱    ╲
       11    1  ◄─ Hour Hand
      10    2
   9   ●    3
      8    4
       7   5
        ╲   ╱
         6

Hour Hand: Moved 30° clockwise (1 hour)
Minute Hand: Still at 12
Digital Display: 01:00
```

### After 2nd UP (02:00)

```
          12
        ╱    ╲
       11    1
      10    2  ◄─ Hour Hand
   9   ●    3
      8    4
       7   5
        ╲   ╱
         6

Hour Hand: Moved another 30° (2 hours total)
Minute Hand: Still at 12
Digital Display: 02:00
```

### After 3rd UP (03:00)

```
          12
        ╱    ╲
       11    1
      10    2
   9   ●    3  ◄─ Hour Hand
      8    4
       7   5
        ╲   ╱
         6

Hour Hand: Moved another 30° (3 hours total)
Minute Hand: Still at 12
Digital Display: 03:00
```

### After 1st RIGHT (03:05)

```
          12
        ╱    ╲
       11    1
      10    2
   9   ●    3  ◄─ Hour Hand
      8    4      (Minute Hand advanced 30°)
       7   5
        ╲   ╱
         6
         ↓ Minute Hand here (5 min)

Hour Hand: At 3 (3 hours)
Minute Hand: Moved to 1 (5 minutes = 1 on the clock)
Digital Display: 03:05
```

### After 2nd RIGHT (03:10)

```
          12
        ╱    ╲
       11    1
      10    2
   9   ●    3  ◄─ Hour Hand
      8    4      (Minute Hand at 2)
       7   5
        ╲   ╱
         6

Hour Hand: At 3
Minute Hand: At 2 (10 minutes)
Digital Display: 03:10
```

### After 3rd RIGHT (03:15) ✓

```
          12
        ╱    ╲
       11    1
      10    2
   9   ●    3  ◄─ Hour Hand
      8    4      
       7   5      ◄─ Minute Hand
        ╲   ╱
         6

Hour Hand: At 3 (3 hours)
Minute Hand: At 3 (15 minutes)
Digital Display: 03:15
TARGET REACHED! ✓ SUCCESS!
```

## Component Architecture

```
Game.tsx
├── Header
│   ├── Title: "DOOMSDAY//PROTOCOL"
│   └── Logout Button
│
├── Main Layout (3-column)
│   ├── Left Column: Security Layers
│   │   ├── Layer List
│   │   └── Progress Bar
│   │
│   ├── Center Column: Puzzle Display
│   │   └── ClockPuzzle Component
│   │       ├── Clock SVG
│   │       │   ├── Clock Face (circle)
│   │       │   ├── Hour Hand (line)
│   │       │   ├── Minute Hand (line)
│   │       │   ├── Center Dot
│   │       │   └── Numbers (12, 3, 6, 9)
│   │       │
│   │       ├── Digital Display
│   │       │   ├── Current Time (HH:MM)
│   │       │   └── Target Time (HH:MM)
│   │       │
│   │       ├── Directional Pad
│   │       │   ├── UP Button
│   │       │   ├── LEFT Button
│   │       │   ├── CENTER (disabled)
│   │       │   ├── RIGHT Button
│   │       │   └── DOWN Button
│   │       │
│   │       ├── Input Sequence Display
│   │       │   └── "UP UP UP RIGHT RIGHT RIGHT"
│   │       │
│   │       ├── Action Buttons
│   │       │   ├── UNDO
│   │       │   └── RESET
│   │       │
│   │       ├── Feedback Message
│   │       │   └── "✓ TIME SET CORRECTLY!"
│   │       │
│   │       └── Hint Display
│   │           └── Direction sequence hint
│   │
│   └── Right Column: System Status
│       ├── Timer
│       ├── Active Unit
│       ├── Hint
│       └── Status Info
│
└── Footer
    └── Grid background pattern
```

## State Flow Diagram

```
┌─────────────────┐
│  Initial State  │
├─────────────────┤
│ hours: 12       │
│ minutes: 0      │
│ solved: false   │
│ sequence: []    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Player Clicks   │
│ Direction Btn   │
├─────────────────┤
│ UP/DOWN/LEFT/   │
│ RIGHT           │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Update Clock Position   │
├─────────────────────────┤
│ - Calculate new hour    │
│ - Calculate new minutes │
│ - Add to sequence       │
│ - Update display        │
└────────┬────────────────┘
         │
         ▼
     ┌────────────┐
     │ Check      │◄──────┐
     │ Target?    │       │
     └──┬──────┬──┘       │
        │      │          │
       NO     YES         │
        │      │          │
        │      ▼          │
        │   ┌──────────┐  │
        │   │ Success! │  │
        │   ├──────────┤  │
        │   │ - Disable│  │
        │   │   btns   │  │
        │   │ - Show   │  │
        │   │   message│  │
        │   │ - Call   │  │
        │   │   onSolve│  │
        │   └─────┬────┘  │
        │         │       │
        │         ▼       │
        │  ┌────────────┐ │
        │  │ Progress to│ │
        │  │ Next Layer │ │
        │  └────────────┘ │
        │                 │
        └─────────────────┘
         (Player may click
          UNDO or RESET)
```

## Direction Effects Table

```
Direction: UP                Direction: RIGHT
┌──────────┐                ┌──────────┐
│  12:00   │                │  03:00   │
│   △      │  ──────────►   │   △      │
│   │      │  +1 HOUR       │   │      │
│   ●      │                │   ●      │
│          │                │   ──►    │
│  01:00   │                │  03:05   │
└──────────┘                └──────────┘

Direction: DOWN              Direction: LEFT
┌──────────┐                ┌──────────┐
│  03:00   │                │  03:15   │
│   △      │  ──────────►   │   △      │
│   │      │  -1 HOUR       │   │      │
│   ●      │                │   ●      │
│          │                │   ◄──    │
│  02:00   │                │  03:10   │
└──────────┘                └──────────┘
```

## Animation Timeline

```
User Clicks Direction Button
         │
         ▼
    ┌─────────┐
    │ 0ms     │  Button highlight/press
    └────┬────┘
         │
         ▼
    ┌─────────┐
    │ 50ms    │  Calculate new time
    └────┬────┘
         │
         ▼
    ┌─────────────┐
    │ 100ms       │  Update hand positions (animated)
    └────┬────────┘
         │
         ▼
    ┌─────────────┐
    │ 150ms       │  Display updates
    └────┬────────┘
         │
         ▼
    ┌─────────────────────┐
    │ 200ms               │  Sequence display updates
    └────┬────────────────┘
         │
         ▼
    ┌──────────────────────┐
    │ 200-500ms (optional) │  Success animation if solved
    └─────────────────────┘
```

## Responsive Design Breakpoints

```
Mobile (< 768px)
┌────────────┐
│  Stack:    │
│  Vertical  │
│  Layout    │
│            │
│  Smaller   │
│  Clock     │
│            │
│  Touch     │
│  Optimized │
└────────────┘

Tablet (768px - 1024px)
┌──────────────────┐
│  2-Column        │
│  Layout:         │
│  Info | Puzzle   │
│                  │
│  Medium Clock    │
│  Size            │
└──────────────────┘

Desktop (> 1024px)
┌──────────────────────────┐
│  3-Column Layout:        │
│  Layers | Puzzle | Stats │
│                          │
│  Full-size Clock         │
│  All Info Visible        │
└──────────────────────────┘
```

## Color Scheme

```
Primary (Emerald): #00FF64
├─ Clock hands
├─ Buttons active
├─ Text highlights
└─ Borders

Secondary (Dark): #0A0E27
├─ Background
├─ Cards
└─ Overlays

Text (Light): #FFFFFF
├─ Primary text
├─ Digital display
└─ Labels

Accent (Green for success): #00FF64
├─ Success message
├─ Completion feedback
└─ Validation color

Muted: #6B7280
├─ Inactive text
├─ Hints
└─ Secondary info
```

---

**Visual Design**: Retro 8-bit arcade aesthetic  
**Font**: Press Start 2P (monospace, pixel-style)  
**Animation**: Smooth transitions with Framer Motion  
**Responsiveness**: Mobile-first design approach
