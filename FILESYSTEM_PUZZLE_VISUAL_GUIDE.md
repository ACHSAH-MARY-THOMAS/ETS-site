# FileSystem Puzzle - Visual Layout

## Question Box (Top)
```
┌─────────────────────────────────────────┐
│         THE MYSTERY                     │
│                                         │
│  Look at the files on the desktop.     │
│  Find the garbage bin and look inside  │
│  it to find the answer hidden in the   │
│  library.                               │
└─────────────────────────────────────────┘
```

## Desktop Box (3x7 File Grid)
```
Desktop Background: /intro-bg.png (with dark overlay)

MY COMPUTER

┌──────────────────────────────────────────────────────────────┐
│  [File]     [File]      [File]     [File]    [File]          │
│document.txt system32    cache.tmp  data_v2.exe old_backup   │
│                                                               │
│  [File]     [File]      [File]     [File]    [File]          │
│readme.md    config.ini  file_2024  archive.zip check_here*  │
│                                                               │
│  [File]     [File]      [File]     [Trash]   [File]          │
│module.js    settings.json temp_file look_below* garbage bin │
│                                                               │
│  [File]     [File]      [File]     [File]    [File]          │
│images_old   output.txt  log_file   script.py version1.0    │
│                                                               │
│  [File]     [File]                                            │
│notes.txt    (empty space)                                     │
│                                                               │
└──────────────────────────────────────────────────────────────┘

* Hidden messages embedded in file names to guide users
```

## File Grid Details

### Actual Files (Click Shows Confusion Images):
- document.txt → shows image 1
- system32 → shows image 2
- cache.tmp → shows image 3
- data_v2.exe → shows image 4
- old_backup → shows image 5
- readme.md → shows image 6
- config.ini → shows image 7
- file_2024 → shows image 8
- archive.zip → shows image 9
- check_here → shows image 1 (HINT: "check garbage bin")
- module.js → shows image 2
- settings.json → shows image 3
- temp_file → shows image 4
- images_old → shows image 5
- look_below → shows image 6 (HINT: "check garbage bin")
- output.txt → shows image 7
- log_file → shows image 8
- script.py → shows image 9
- version1.0 → shows image 1
- notes.txt → shows image 2

### Special File:
- **garbage bin** → Opens /boy-library.jpeg with interactive books

## Garbage Bin Modal (When Clicked)
```
┌─────────────────────────────────────────┐
│  [X] Close                              │
├─────────────────────────────────────────┤
│                                         │
│   [Library Image with 7 Shelves]       │
│                                         │
│   Left Side (Clickable Books):         │
│   ┌─────────────────────────────────┐  │
│   │ Shelf 1: [Book Areas - Click me]│  │
│   │ Shelf 2: [Book Areas - Click me]│  │
│   │ Shelf 3: [Book Areas - Click me]│  │
│   │ Shelf 4: [Book Areas - Click me]│  │
│   │ Shelf 5: [Book Areas - Click me]│  │
│   │ Shelf 6: [Book Areas - Click me]│  │
│   │ Shelf 7: [Book Areas - Click me]│  │
│   └─────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

## Book Animation (When Any Book Clicked)
```
Before Opening:                  After Opening:
┌─────────────────────┐         ┌──────────┬──────────┐
│  LIBRARY            │         │ Inside   │  Inside  │
│  BOOK               │ ──→     │  Left    │  Right   │
│                     │         │          │          │
│  (Brown Cover)      │         │ Story:   │  Answer: │
└─────────────────────┘         │ Tom is   │  ABIN    │
                                │ in the   │ (Pulsing)│
                                │ library  │          │
                                │ reading. │          │
                                └──────────┴──────────┘
```

## Confusion Image Modal
```
┌─────────────────────────────────────────┐
│  [X] Close                              │
├─────────────────────────────────────────┤
│                                         │
│   [Random Confusing Image]             │
│   (Dr. Doom, Morse Code, etc.)         │
│                                         │
│   "This is not what you're looking    │
│    for. Close and check GARBAGE BIN."  │
│                                         │
└─────────────────────────────────────────┘
```

## Answer Input Section (Bottom)
```
┌──────────────────────────────────────────┐
│  Answer Input Box:                       │
│  ┌──────────────────────────────────┐   │
│  │ Type your answer...              │   │
│  │ ┌─────────────────────────────┐  │   │
│  │ │                             │  │   │
│  │ └─────────────────────────────┘  │   │
│  │          [SUBMIT ANSWER]         │   │
│  └──────────────────────────────────┘   │
│                                          │
│  Feedback: ✓ CORRECT! You found it!     │
└──────────────────────────────────────────┘
```

## Color Scheme:
- **Primary Color**: Cyan/Blue
- **File Icons**: Blue (#60a5fa)
- **Trash Icon**: Red (#f87171)
- **Background**: Dark with overlay
- **Text**: White with retro "Press Start 2P" font
- **Hover Effects**: Blue/Red tinted with scale animation

## Interaction Flow:
```
START
  ↓
Read Question
  ↓
Explore Desktop Files (click to see confusion images)
  ↓
See hints in file names (check_here, look_below)
  ↓
Find & Click Garbage Bin
  ↓
View Library Image
  ↓
Click Any Book
  ↓
See Book Open Animation
  ↓
Read Story & See Answer "ABIN"
  ↓
Type "ABIN" in Answer Box
  ↓
Click Submit
  ↓
SUCCESS! ✓
```

## Technical Details:
- **Grid Layout**: CSS Grid (3 columns)
- **Grid Gap**: 1.5rem (6 * 0.25rem)
- **Card Size**: Auto-sizing based on content
- **Animations**: Framer Motion
  - File grid: Staggered entry (0.05s delay between items)
  - File hover: Scale 1.05 on hover
  - File click: Active state with background color
  - Modal: Fade in/out (0.3s)
  - Book: 3D flip animation (1s ease-in-out)
  - Confusion image: Scale animation (0.4s)

- **Responsive**: 
  - Max width: 80rem (6xl)
  - Desktop spacing: 32px (p-8)
  - File size: Adjusts to container
  - Text: Scales with responsive font sizes
