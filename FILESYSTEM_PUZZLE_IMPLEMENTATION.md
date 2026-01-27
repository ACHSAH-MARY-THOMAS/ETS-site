# FileSystem Puzzle Implementation

## Overview
A desktop-themed file system puzzle that guides users to find the correct answer by exploring confusing files and discovering the garbage bin.

## Structure

### 1. Simple Question (Top)
- Clear instruction: "Look at the files on the desktop. Find the garbage bin and look inside it to find the answer hidden in the library."
- Styled with primary color border and background

### 2. Desktop Box (Main Content)
- **Background**: Uses `/intro-bg.png` with dark overlay for visibility
- **Layout**: 3x7 Grid (21 files total)
- **Title**: "MY COMPUTER" in retro style
- **File Styling**: 
  - Regular files: Blue icons with file names
  - Garbage bin: Red icon
  - Hover effects with scale animations

### 3. File Items (3 Rows × 7 Columns)

#### Row 1 (7 files):
1. document.txt
2. system32
3. cache.tmp
4. data_v2.exe
5. old_backup
6. readme.md
7. config.ini

#### Row 2 (7 files):
8. file_2024
9. archive.zip
10. check_here **(Hidden: "check garbage bin")**
11. module.js
12. settings.json
13. temp_file
14. images_old

#### Row 3 (7 files):
15. look_below **(Hidden: "check garbage bin")**
16. output.txt
17. **garbage bin** ⭐ (THE KEY FILE)
18. log_file
19. script.py
20. version1.0
21. notes.txt

### 4. Confusion Mechanism

**When clicking regular files:**
- Opens a modal showing a confusing image
- Displays message: "This is not what you're looking for. Close and check the GARBAGE BIN."
- Images cycled from available assets in `/public` folder

**Available Images for Confusion:**
- `/dr-doom.png`
- `/dr-doom-latest.png`
- `/download.jpg`
- `/morse-code.jpeg`
- `/intro-bg.png`
- `/Gemini_Generated_Image_jjpkfujjpkfujjpk-removebg-preview.png`
- `/dr-doom-4k.png`
- `/dr-doom-4k-removebg-preview.png`
- `/placeholder.svg`

### 5. Garbage Bin Feature

**When clicking "garbage bin":**
- Opens full screen modal showing `/boy-library.jpeg`
- Library image contains interactive hotspots on book shelves (7 shelves)
- Clicking any book triggers the book opening animation

### 6. Book Animation

**When clicking a book:**
- Book cover appears with 3D flip animation
- Left page shows: Story about "Tom in the library reading"
- Right page reveals: **The answer "ABIN"** in large animated text
- Close button to return to file system

### 7. Answer Input & Validation

**After exploring:**
- User enters answer in text input box
- Correct answer: `ABIN`
- Success message: "✓ CORRECT! You found it!"
- Triggers `onSolve` callback

## Implementation Details

### Component State:
- `userAnswer`: User's input
- `feedback`: Validation message
- `solved`: Completion status
- `showGarbageImage`: Garbage bin modal visibility
- `showBook`: Book modal visibility
- `bookOpened`: Book animation state
- `showConfusionImage`: Confusion file modal visibility
- `confusionImageSrc`: Current confusion image URL

### Key Functions:
- `handleFileClick()`: Routes file clicks to correct handler
- `handleBookClick()`: Initiates book opening animation
- `closeBook()`: Closes book modal
- `handleSubmit()`: Validates answer

## User Flow:
1. Read the question
2. Browse desktop files
3. Click files to see confusing images
4. Notice hints in file names ("check_here", "look_below", "garbage bin")
5. Click "garbage bin" 
6. See library image
7. Click any book to trigger opening animation
8. Read the story and see answer "ABIN"
9. Type answer in input box
10. Submit and complete puzzle

## Styling:
- **Font**: Press Start 2P (retro style)
- **Colors**: Primary theme colors, red for trash, blue for files
- **Animations**: Smooth transitions, 3D book flip, scale hovers
- **Responsive**: Adapts to different screen sizes

## Images Used:
- Background: `/intro-bg.png`
- Garbage content: `/boy-library.jpeg`
- Confusion files: 9 various PNG/JPG assets from `/public`

This implementation creates an engaging, slightly confusing puzzle experience that guides users to discover the hidden answer.
