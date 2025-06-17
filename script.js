// Crossword data
const crosswordData = {
    width: 12,
    height: 9,
    words: [
        {
            id: 'word1',
            number: 1,
            direction: 'horizontal',
            startRow: 0,
            startCol: 2,
            length: 7,
            answer: 'ДНЕВНИК',
            clue: 'Что находилось в телефоне у Юкитэру Амано?',
            cells: []
        },
        {
            id: 'word2',
            number: 2,
            direction: 'horizontal',
            startRow: 1,
            startCol: 1,
            length: 7,
            answer: 'УЧИТЕЛЬ',
            clue: 'Кто был серийным убийцей в "Город, которого меня нет"?',
            cells: []
        },
        {
            id: 'word3',
            number: 3,
            direction: 'horizontal',
            startRow: 2,
            startCol: 0,
            length: 9,
            answer: 'КОППЕЛИОН',
            clue: 'Как называется проект, где люди приобрели полный иммунитет к радиации?',
            cells: []
        },
        {
            id: 'word4',
            number: 4,
            direction: 'horizontal',
            startRow: 3,
            startCol: 2,
            length: 6,
            answer: 'СИНОБУ',
            clue: 'Кто стоял насекомого в организации охотников за демонами?',
            cells: []
        },
        {
            id: 'word5',
            number: 5,
            direction: 'horizontal',
            startRow: 4,
            startCol: 5,
            length: 6,
            answer: 'ПОЧИТА',
            clue: 'Кто стал сердцем Дэндзи из человек бензопила?',
            cells: []
        },
        {
            id: 'word6',
            number: 6,
            direction: 'horizontal',
            startRow: 5,
            startCol: 4,
            length: 7,
            answer: 'СЕДЬМОЕ',
            clue: 'Какое место занял Марко Ботт подготовительного корпуса среди выпускников?',
            cells: []
        },
        {
            id: 'word7',
            number: 7,
            direction: 'horizontal',
            startRow: 6,
            startCol: 3,
            length: 6,
            answer: 'САДАКО',
            clue: 'Какое прозвище получила главная героиня, похожая на девочку из "Звонка"?',
            cells: []
        },
        {
            id: 'word8',
            number: 8,
            direction: 'horizontal',
            startRow: 7,
            startCol: 4,
            length: 4,
            answer: 'ЗИМА',
            clue: 'В какое время года Мафую потерял свою первую любовь?',
            cells: []
        },
        {
            id: 'word9',
            number: 9,
            direction: 'horizontal',
            startRow: 8,
            startCol: 4,
            length: 7,
            answer: 'АКТРИСА',
            clue: 'Кем стала Кёко Могами на пути к мести?',
            cells: []
        }
    ]
};

// Game state
let userAnswers = {};
let selectedCell = null;
let grid = [];

// Initialize the game
function initGame() {
    generateGrid();
    renderGrid();
    renderClues();
    updateProgress();
    
    // Add event listeners
    document.getElementById('resetBtn').addEventListener('click', resetGame);
}

// Generate the crossword grid
function generateGrid() {
    // Initialize empty grid
    grid = Array(crosswordData.height).fill(null).map(() => 
        Array(crosswordData.width).fill(null).map(() => ({
            isBlocked: true,
            belongsToWords: []
        }))
    );

    // Place words in grid
    crosswordData.words.forEach(word => {
        const cells = [];
        for (let i = 0; i < word.length; i++) {
            const row = word.startRow;
            const col = word.startCol + i;
            
            if (row < crosswordData.height && col < crosswordData.width) {
                const cellId = `${row}-${col}`;
                cells.push(cellId);
                
                grid[row][col] = {
                    id: cellId,
                    row,
                    col,
                    isBlocked: false,
                    number: i === 0 ? word.number : undefined,
                    belongsToWords: [...(grid[row][col]?.belongsToWords || []), word.id]
                };
            }
        }
        word.cells = cells;
    });

    // Set IDs for blocked cells
    for (let row = 0; row < crosswordData.height; row++) {
        for (let col = 0; col < crosswordData.width; col++) {
            if (grid[row][col].isBlocked) {
                grid[row][col].id = `${row}-${col}`;
                grid[row][col].row = row;
                grid[row][col].col = col;
            }
        }
    }
}


// Render the crossword grid
function renderGrid() {
    const gridContainer = document.getElementById('crosswordGrid');
    gridContainer.innerHTML = '';

    grid.flat().forEach(cell => {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'cell';
        cellDiv.dataset.cellId = cell.id;
        
        if (cell.isBlocked) {
            cellDiv.classList.add('blocked');
        } else {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.value = userAnswers[cell.id] || '';
            input.addEventListener('input', (e) => handleInput(e, cell));
            input.addEventListener('keydown', (e) => handleKeyDown(e, cell));
            input.addEventListener('focus', () => selectCell(cell.id));
            
            cellDiv.appendChild(input);
            
            if (cell.number) {
                const numberDiv = document.createElement('div');
                numberDiv.className = 'cell-number';
                numberDiv.textContent = cell.number;
                cellDiv.appendChild(numberDiv);
            }
 
        }
        
        cellDiv.addEventListener('click', () => {
            if (!cell.isBlocked) {
                selectCell(cell.id);
            }
        });
        
        gridContainer.appendChild(cellDiv);
    });
}

// Handle input in cells
function handleInput(e, cell) {
    const value = e.target.value.toUpperCase();
    
    // Only allow Russian letters
    if (value && !/[А-ЯЁ]/.test(value)) {
        e.target.value = userAnswers[cell.id] || '';
        return;
    }
    
    userAnswers[cell.id] = value;
    updateCellValidation();
    updateProgress();
    
    // Move to next cell if letter was entered
    if (value) {
        const nextCell = findNextCell(cell.row, cell.col);
        if (nextCell) {
            selectCell(nextCell.id);
        }
    }
}

// Handle keyboard navigation
function handleKeyDown(e, cell) {
    const { key } = e;
    
    if (key === 'Backspace' || key === 'Delete') {
        userAnswers[cell.id] = '';
        updateCellValidation();
        updateProgress();
        return;
    }

    // Arrow key navigation
    let newRow = cell.row;
    let newCol = cell.col;
    
    switch (key) {
        case 'ArrowUp':
            newRow = Math.max(0, cell.row - 1);
            break;
        case 'ArrowDown':
            newRow = Math.min(crosswordData.height - 1, cell.row + 1);
            break;
        case 'ArrowLeft':
            newCol = Math.max(0, cell.col - 1);
            break;
        case 'ArrowRight':
            newCol = Math.min(crosswordData.width - 1, cell.col + 1);
            break;
        default:
            return;
    }

    const targetCell = grid[newRow][newCol];
    if (!targetCell.isBlocked) {
        e.preventDefault();
        selectCell(targetCell.id);
    }
}

// Find next cell in the same word
function findNextCell(row, col) {
    for (let c = col + 1; c < crosswordData.width; c++) {
        const cell = grid[row][c];
        if (!cell.isBlocked) return cell;
        if (cell.isBlocked) break;
    }
    return null;
}

// Select a cell
function selectCell(cellId) {
    selectedCell = cellId;
    
    // Update visual selection
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('selected');
    });
    
    const cellElement = document.querySelector(`[data-cell-id="${cellId}"]`);
    if (cellElement) {
        cellElement.classList.add('selected');
        const input = cellElement.querySelector('input');
        if (input) {
            input.focus();
        }
    }
    
    updateClueSelection();
}

// Update cell validation colors
function updateCellValidation() {
    crosswordData.words.forEach(word => {
        const userWord = word.cells.map(cellId => userAnswers[cellId] || '').join('');
        
        word.cells.forEach((cellId, index) => {
            const cellElement = document.querySelector(`[data-cell-id="${cellId}"]`);
            const userChar = userAnswers[cellId] || '';
            const correctChar = word.answer[index];
            
            if (cellElement) {
                cellElement.classList.remove('correct', 'incorrect');
                
                if (userChar) {
                    if (userChar === correctChar) {
                        cellElement.classList.add('correct');
                    } else {
                        cellElement.classList.add('incorrect');
                    }
                }
            }
        });
    });
}

// Render clues list
function renderClues() {
    const cluesList = document.getElementById('cluesList');
    cluesList.innerHTML = '';

    crosswordData.words.forEach(word => {
        const clueDiv = document.createElement('div');
        clueDiv.className = 'clue-item';
        clueDiv.dataset.wordId = word.id;
        
        clueDiv.innerHTML = `
            <div class="clue-header">
                <span class="clue-number">${word.number}</span>
                <div class="clue-text">${word.clue}</div>
            </div>
            <div class="clue-info">
                ${word.length} ${word.length === 1 ? 'буква' : word.length < 5 ? 'буквы' : 'букв'}
            </div>
        `;
        
        clueDiv.addEventListener('click', () => selectWordByClue(word.id));
        cluesList.appendChild(clueDiv);
    });
}

// Select word by clicking on clue
function selectWordByClue(wordId) {
    const word = crosswordData.words.find(w => w.id === wordId);
    if (word && word.cells.length > 0) {
        selectCell(word.cells[0]);
    }
}

// Update clue selection highlighting
function updateClueSelection() {
    const selectedWord = getSelectedWord();
    
    document.querySelectorAll('.clue-item').forEach(clue => {
        clue.classList.remove('selected');
    });
    
    if (selectedWord) {
        const clueElement = document.querySelector(`[data-word-id="${selectedWord.id}"]`);
        if (clueElement) {
            clueElement.classList.add('selected');
        }
    }
}

// Get currently selected word
function getSelectedWord() {
    if (!selectedCell) return null;
    return crosswordData.words.find(word => word.cells.includes(selectedCell));
}

// Update progress
function updateProgress() {
    const completedWords = crosswordData.words.filter(word => {
        const userWord = word.cells.map(cellId => userAnswers[cellId] || '').join('');
        return userWord === word.answer;
    });
    
    const completed = completedWords.length;
    const total = crosswordData.words.length;
    const percentage = (completed / total) * 100;
    
    document.getElementById('progressText').textContent = `${completed} из ${total}`;
    document.getElementById('progressFill').style.width = `${percentage}%`;
    document.getElementById('progressPercent').textContent = `${Math.round(percentage)}% завершено`;
    
    // Update clue completion status
    document.querySelectorAll('.clue-item').forEach(clue => {
        const wordId = clue.dataset.wordId;
        const word = crosswordData.words.find(w => w.id === wordId);
        const userWord = word.cells.map(cellId => userAnswers[cellId] || '').join('');
        
        if (userWord === word.answer) {
            clue.classList.add('completed');
        } else {
            clue.classList.remove('completed');
        }
    });
    
    // Show completion message
    const completionMessage = document.getElementById('completionMessage');
    if (completed === total) {
        completionMessage.classList.remove('hidden');
    } else {
        completionMessage.classList.add('hidden');
    }
}

// Reset the game
function resetGame() {
    userAnswers = {};
    selectedCell = null;
    
    // Clear all inputs
    document.querySelectorAll('.cell input').forEach(input => {
        input.value = '';
    });
    
    // Remove all validation classes
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Remove clue selection
    document.querySelectorAll('.clue-item').forEach(clue => {
        clue.classList.remove('selected', 'completed');
    });
    
    updateProgress();
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);