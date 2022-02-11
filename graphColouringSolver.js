const container = document.getElementById("container");
      var boardState = [];
      var undoCount = 0;
      var genBoard;
      var printedClueBoard;

      function generateGridSize(size){                        // generates grid of size 'size'
        if(size == 0){
          container.id = "containerSmall";                    // gives the container an id (this is for the thicker box lines)
          makeGrid(4, 4);                                     // makes the grid
          makeButtons(4);                                     // adds the correct number of buttons
        }
        else if(size == 1){
          container.id = "container";
          makeGrid(9, 9);
          makeButtons(9);
        }
        else if(size == 2){
          container.id = "containerLarge";
          makeGrid(16, 16);
          makeButtons(16);
        }
      }

      function makeButtons(size){
        var buttonDiv = document.getElementById("numberButtonDiv");
        while (buttonDiv.firstChild){
          buttonDiv.removeChild(buttonDiv.firstChild);
        }
        
        for(let i = 1; i <= size; i++){
          let numberButton = document.createElement("Button");
          numberButton.innerHTML = i;
          numberButton.class = "noButton";
          numberButton.addEventListener("click", function(){addNumber(i)});
          buttonDiv.appendChild(numberButton);
        }
      }

      function makeGrid(rows, columns){                                         // function used to make the sudoku grid
        var table = document.createElement("table");                            // initialises table
        table.id = "sudoku";
        for (let i = 0; i < rows; i++){                                         // inserts rows and columns
          var row = table.insertRow(i);
          for (let j = 0; j < columns; j++){
            var cell = row.insertCell(j);   
            cell.setAttribute("clicked", false);                                // adds attribute "clicked" to be used to determine if a cell has been selected
            cell.addEventListener("click", function(){highlight(this)});        // gives each cell the onclick function highlight
          }
        }
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        container.appendChild(table);

        if(container.firstChild.rows.length == 4){
          boardState = [[],[],[],[]];
        }
        else if(container.firstChild.rows.length == 9){
          boardState = [[],[],[],[],[],[],[],[],[]];
        }
        else if(container.firstChild.rows.length == 16){
          boardState= [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],];
        }
      }
      makeGrid(9, 9); 

      function highlight(cell){                                             // highlights cell when clicked on
        var table = document.getElementById("sudoku");                      // get the table
        for(var i = 0; i < table.rows.length; i++){                         // resets all cells to default
          for(var j = 0; j < table.rows.length; j++){
            table.rows[i].cells[j].style.borderRadius = "0px";             
            table.rows[i].cells[j].style.backgroundColor = "lightgrey";
            table.rows[i].cells[j].clicked = false;
          }
        }  
        var cellNumber = cell.innerHTML;
        if(cellNumber == 0){        // if cell is empty do not highlight them all
          cellNumber = -1;
        }

        cell.clicked = true;
        cell.style.borderRadius = "50px";                                   // make these changes to the clicked on cell
        cell.style.backgroundColor = "darkgrey";

        for(var i = 0; i < table.rows.length; i++){                         // if number is clicked on highlight all of the same numbers
          for(var j = 0; j < table.rows.length; j++){
            if(table.rows[i].cells[j].innerHTML == cellNumber){
              table.rows[i].cells[j].style.borderRadius = "50px";
              table.rows[i].cells[j].style.backgroundColor = "darkgrey";
            }
          }
        }
      }

      function addNumber(num){                                      // set clicked on cell to clicked number
        var table = document.getElementById("sudoku");              // get table
        for(let i = 0; i < table.rows.length; i++){                 // iterate through all cells
          for(let j = 0; j < table.rows.length; j++){
            if(table.rows[i].cells[j].clicked == true){             // if the cell is clicked on
              if(table.rows[i].cells[j].style.color == "black" && table.rows[i].cells[j].innerHTML != ""){    // can not edit black numbers i.e clues
                break;
              }
              else{
                var currentState = getBoard();                      // get current board
                boardState[undoCount] = currentState;               // save board state
                undoCount++;                                        // increment undo count
                table.rows[i].cells[j].innerHTML = num;             // set cell to number
                table.rows[i].cells[j].style.color = "blue";        // change colour of user entered values
              }
            }
          }
        }
      }

      function undo(){                                              // undoes the users previous actions
        print(boardState[undoCount - 1], boardState.length);
        undoCount--;
      }

      function reset(){                                             // resets the board 
        print(printedClueBoard, printedClueBoard.length);
      }

      function arraysEqual(arr1, arr2) {      // tests to see if the given arrays are the exact same (Order and value)
        let equal = arr1.toString() === arr2.toString();
        return equal;
      }

      function getCommon(arr1, arr2) {      // gets the common elements of two arrays
        var common = [];                   
        for(let i=0 ; i<arr1.length ; ++i) {
          for(let j=0 ; j<arr2.length ; ++j) {
            if(arr1[i] == arr2[j]) {        // compares all the elements in each array and pushes to another array if they're the same
            common.push(arr1[i]);        
            }
          }
        }
        return common;                     // return the common elements
      }

      function shuffleArray(arr){          // shuffles an array returning the same array but in a random order
        let len = arr.length;

        while (0 !== len){
          let random = Math.floor(Math.random() * len);
          len -= 1;

          let temp = arr[len];
          arr[len] = arr[random];
          arr[random] = temp;
        }
        return arr;
      }

      function arrayRemove(arr, value) {        // removes given element from given array
    
        return arr.filter(function(ele){ 
            return ele != value; 
        });
      }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      function isSafe(board, row, col, n){
        for (let i = 0; i < board.length; i++){       // checks to see if the row is safe
          if (board[row][i] == n){                    // checks n against all values in the row
            return false;
          }
        }

        for(let j = 0; j < board.length; j++){        // checks to see if the column is safe
          if(board[j][col] == n){                     // checks n against all values in the column
            return false;
          }
        }

        var sqrt = Math.floor(Math.sqrt(board.length));
        var boxRowStart = row - row % sqrt;
        var boxColStart = col - col % sqrt;

        for(let r = boxRowStart; r < boxRowStart + sqrt; r++){            // checks to see if the box is safe
          for(let d = boxColStart; d < boxColStart + sqrt; d++){
            if(board[r][d] == n){                                         // checks n against all values inside the same box
              return false;
            }
          }
        }
        // safe
        return true;
      }

      function solveSudoku() {            // solves the given board through the use of backtracking
        // the graph has either 16, 81 or 256 vertices depending on size
        // two distinct vertices are adjacent iff they are in the same row, column or box
        // select cell (first cell)
        // assign colour (number)
        // check adjacent vertices

        // using greedy algorithm
        // find out how many verices are adjacent (20 for each cell)
        // remove clues
        // find the new values of adjacent cells for all cells that arent coloured yet
        // order them from highest to lowest 
        // starting with the vertex with the most adjacent vertices colour it with a new colour (starting from one)
        // colour any cells with the same number that can be based on adjacent vertices
        // remove the newly coloured vertices from the list
        // order the list by highest number of adjacent vertices
        // repeat with the next colour along 

        var initialBoard = getBoard();
        var n = initialBoard.length;
        var adjacentCells = [];                      // initialise connections for adjacent vertices for blank sudoku grid
        var sqrt = Math.floor(Math.sqrt(n));

        if(n == 4){
          adjacentCells = [[],[],[],[]];
        }
        else if(n == 9){
          adjacentCells = [[],[],[],[],[],[],[],[],[]];
        }
        else if(n == 16){
          adjacentCells = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],];
        }

        for (let i = 0; i < n; i++){
          for (let j = 0; j < n; j++){
            if (n == 4){
              adjacentCells[i][j] = 0;          // initialise 4 x 4 grid of zeroes
            }
            else if (n == 9){
              adjacentCells[i][j] = 0;          // initialise 9 x 9 grid of zeroes
            }
            else{
              adjacentCells[i][j] = 0;          // initialise 16 x 16 grid of zeroes
            }
          }
        }

        for (let i = 0; i < n; i++){
          for (let j = 0; j < n; j++){
            var isChecked = [];                 
            if(n == 4){
              isChecked = [[],[],[],[]];
            }
            else if(n == 9){
              isChecked = [[],[],[],[],[],[],[],[],[]];
            }
            else if(n == 16){
              isChecked = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],];
            }

            for (let x = 0; x < n; x++){        // initialise an array of false values in the same format as the Sudoku grid to be used to check if a cell has already been checked    
              for (let y = 0; y < n; y++){      // this will be used to check which cells have already been checked when the rows and grids were checked. This removes the possibility
                isChecked[x][y] = false;        // of checking the same cell twice
              }
            }

            let adjacentClueCount = 0;
            var rowClueCount = 0;
            var colClueCount = 0;
            var boxClueCount = 0;
            if (initialBoard[i][j] == ''){
              let boxStartRow = i - i % sqrt;
              let boxStartCol = j - j % sqrt;

              for (let k = 0; k < n; k++){
                isChecked[i][k] = true;
                isChecked[k][j] = true;

                if (initialBoard[i][k] != ''){          // Checks how many numbers are in the row the current cell is in
                  adjacentClueCount++;
                }
                if (initialBoard[k][j] != ''){          // Checks how many numbers are in the col the current cell is in
                  adjacentClueCount++;
                }
              }

              for (let row = 0; row < sqrt; row++){     // Checks how many numbers are in the box the current cell is in
                for (let col = 0; col < sqrt; col++){
                  if (initialBoard[row + boxStartRow][col + boxStartCol] != ''){
                    if(isChecked[row + boxStartRow][col + boxStartCol] == false){
                      adjacentClueCount++;
                      isChecked[row + boxStartRow][col + boxStartCol] == true;
                    }     
                  }
                }
              }
            }

            if(adjacentClueCount != 0){
              if(n == 4){
                adjacentCells[i][j] = 7 - adjacentClueCount;
              }
              else if(n == 9){
                adjacentCells[i][j] = 20 - adjacentClueCount;
              }
              else if(n == 16){
                adjacentCells[i][j] = 39 - adjacentClueCount;
              }
            }

            //alert(adjacentCells);
          }   
        } 
        // find cell with most adjacent cells that (cells that are clues will be listed as zero)

        var adjacentCells1D = [];
        let count = 0;
        for(let i = 0; i < n; i++){
          for(let j = 0; j < n; j++){
            adjacentCells1D[count] = adjacentCells[i][j];
            count++;
          }
        }

        var mapped = adjacentCells1D.map(function(el, i) {
          if (el != 0){
            return { index: i, value: el };
          } 
        })
       
        mapped.sort(function(a, b) {                                     // sorting the mapped array containing the reduced values
          return b.value - a.value;
        });
        
        var result = mapped.map(function(el){                            // container for the resulting order
          if (el != undefined){
            return adjacentCells1D[el.index];
          }          
        });

        //alert("Result List: " + result);
        //for(let i = 0; i < mapped.length; i++){
        //  alert("index: " + mapped[i].index + " " + "value: " + mapped[i].value);
        //}

        // fill cell with number (1 ... n)
        // check Sudoku constraints, if viable fill cell, if not try with next number until it can be filled
        // find the cell with the next most cells
        // check if the number can be put in this cell if not skip to the next cell, filling cells that can include the number ignoring ones that cannot
        // set filled cell adjacent cell value to zero 
        // repeat from next cell with most adjacent cells with nex number
        // repeat until all cells are filled

        mapped = mapped.filter(function(el){return el != null});

        for(let i = 1; i <= n; i++){                                                   // length of array containing empty cells
          for(let j = 0; j < mapped.length; j++){ 
            var index = mapped[j].index;
            var indexI = Math.floor(index / n);
            var indexJ = index % n; 

            if(isSafe(initialBoard, indexI, indexJ, i)){
              initialBoard[indexI][indexJ] = i;
              //mapped[i] = null;
              //break;
            }
          }
        }
        print(initialBoard, n);
      }

      function mostCommonElement(arr){                                                            // finds most common element in arr (requires 1D array)
        var mf = 1;
        var m = 0;
        var item;
        for (var i = 0; i < arr.length; i++){
          for (var j = i; j < arr.length; j++){
            if (arr[i] == arr[j]){
              m++;
            }
            if (mf < m){
              mf=m; 
              item = arr[i];
            }
          }
          m=0;
        }
        return item;
      }

      function multipleSolutions(row, col, board, n, count) {            // checks for multiple solutions using backtracking                              
        if (row == n){
          row = 0;
          if (++col == n){
            return count + 1;
          }
        }

        if (board[row][col] != 0){                                         // skips filled cells
          return multipleSolutions(row + 1, col, board, n, count);
        }

        for (let number = 1; number <= n && count < 2; ++number){              // searches for 2 solutions and breaks if 2 are found
          //alert("In for loop");
          if(isSafe(board, row, col, number)){
            //alert("In if");
            board[row][col] = number;
            count = multipleSolutions(row + 1, col, board, n, count);                 // adds solution
            //alert("bottom of if");
          }
        }
        //alert("Out of for loop");
        board[row][col] = 0;                                              // resets on backtrack
        //alert("Value being returned");
        return count; 
      }

      function generateSudoku(board, n) {            // generates Sudoku puzzles for the given initialisation board (all zeros)
        let isEmpty = true;
        var row = -1;
        var col = -1

        for(let i = 0; i < n; i++){
          for(let j = 0; j < n; j++){
            if (board[i][j] == 0){
              row = i;
              col = j;
              isEmpty = false;                            // we still have missing numbers to fill within the grid
              break;
            }
          }

          if(!isEmpty){                                   // if this is true we no longer have any empty space (the puzzle is filled)
            break;
          }
        }

        if (isEmpty){
          return true;
        }
        var numbers = [];
        if(n == 4){
          numbers = [1, 2, 3, 4];
        }
        else if(n == 9){
          numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        }
        else if(n == 16){
          numbers =[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        }

        for(let i = 0; i < n; i++){
          var num = numbers[Math.floor(Math.random()*numbers.length)];    // generates random number, filling the board with random numbers 
          //var row = Math.floor(Math.random() * n);                      // selects random cell to fill
          //var col = Math.floor(Math.random() * n);
          if(isSafe(board, row, col, num) /*&& removeTrios(board, row)*/){    // ensures the numbers and placement is safe

            board[row][col] = num;                                        // updates the current cell 
            if(generateSudoku(board, n)){                                 // if it is solvable the puzzle is complete
              return true;
            }
            else{
              board[row][col] = 0;                                        // if not the board is updated and the algorithm backtracks
            }
          }
        }
        return false;
      }

      function splitArrayIntoChunksOfLen(arr, len) {
        var chunks = [], i = 0, n = arr.length;
        while (i < n) {
          chunks.push(arr.slice(i, i += len));
        }
        return chunks;
      }

      function removeTrios(board, row){
        if (row != 0){
          var nextRow = JSON.stringify(board[row]);
          var rowChunks = splitArrayIntoChunksOfLen(board[row -1], 3);
          var rowChunkOne = JSON.stringify(rowChunks[0]).replace('[', '').replace(']', '');
          var rowChunkTwo = JSON.stringify(rowChunks[1]).replace('[', '').replace(']', '');
          var rowChunkThree = JSON.stringify(rowChunks[2]).replace('[', '').replace(']', '');

          if (nextRow.indexOf(rowChunkOne) !== -1 || nextRow.indexOf(rowChunkTwo) !== -1 || nextRow.indexOf(rowChunkThree) !== -1){
            return false;
          }
          else{
            return true;
          }
        }
        else{
          return true;
        }
      }

      function print(board, N){                                                 // prints the given board into the grid on screen
        for(let i = 0; i < N; i++){
          for(let j = 0; j < N; j++){          
            if(board[i][j] == 0 || board[i][j] == ""){                          // prints the empty cells
              sudoku.rows[i].cells[j].innerHTML = "";
              sudoku.rows[i].cells[j].setAttribute('contenteditable', false);   // prevents cells being edited
            }
            else{
              sudoku.rows[i].cells[j].innerHTML = board[i][j];                  // prints cells with numbers
              sudoku.rows[i].cells[j].setAttribute('contenteditable', false);   // prevents cells with numbers being edited
              //sudoku.rows[i].cells[j].style.color = "black";
            }
          }
        }
      }

      var clueCount = 0;
      function printClues(difficulty, board, N){                                // takes a board and removes cells in order to have a Sudoku board
        var blanks;
        if(container.firstChild.rows.length == 4){
          if(difficulty == 0){
            blanks = [8, 9];                                                      // easy (8 - 9 blanks) 
          }
          else if(difficulty == 1){
            blanks = [10, 11];                                                    // medium (10 - 11 blanks)                                    
          }
          else if(difficulty == 2){
            blanks = [12];                                                        // hard (12 blanks)
          }
        }
        else if(container.firstChild.rows.length == 9){
          if(difficulty == 0){
            blanks = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];                // easy (35 - 45 blanks) 
          }
          else if(difficulty == 1){
            blanks = [46, 47, 48, 49];                                            // medium (46 - 49 blanks)
          }
          else if(difficulty == 2){
            blanks = [50, 51, 52, 53];                                            // hard (50 - 53 blanks)
          }
        }
        else if(container.firstChild.rows.length == 16){
          if(difficulty == 0){
            blanks = [120, 121, 122, 123, 124, 125];                              // easy (120 - 125 blanks) 
          }
          else if(difficulty == 1){
            blanks = [130, 131, 132, 133, 134, 135];                              // medium (130 - 135 blanks)
          }
          else if(difficulty == 2){
            blanks = [150, 151, 152, 153, 154, 155];                              // hard (150 - 155 blanks)
          }
        }
        var puzzleBlanks = blanks[Math.floor(Math.random() * blanks.length)];
        for(let i = 0; i < N; i++){                                             // print board
          for(let j = 0; j < N; j++){
            sudoku.rows[i].cells[j].innerHTML = board[i][j];
            sudoku.rows[i].cells[j].setAttribute('contenteditable', false);
            sudoku.rows[i].cells[j].style.color = "black";                       // reset the cell text colour when generated so new puzzles dont have blue in them
          }
        }

        let count = 0;
        while(count != puzzleBlanks){                                            // remove required blanks
          let x = Math.floor(Math.random() * N);
          let y = Math.floor(Math.random() * N);
          if(sudoku.rows[x].cells[y].innerHTML != ""){
            sudoku.rows[x].cells[y].innerHTML = "";
            sudoku.rows[x].cells[y].setAttribute('contenteditable', false);
            count++;
          }
        }
        var clueBoard = getBoard();
        printedClueBoard = clueBoard;
        var solutions = multipleSolutions(0, 0, clueBoard, N, 0);
        if(solutions != 1){
          clueCount++;
          printClues(difficulty, board, N);
        }
      }

      function getBoard(){                                              // used to get the board in the grid
        var playerBoard = [];
        if(container.firstChild.rows.length == 4){
          playerBoard = [[],[],[],[]];
        }
        else if(container.firstChild.rows.length == 9){
          playerBoard = [[],[],[],[],[],[],[],[],[]];
        }
        else if(container.firstChild.rows.length == 16){
          playerBoard = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],];
        }

        var N = container.firstChild.rows.length;
        for(let i = 0; i < N; i++){       
          for(let j = 0; j < N; j++){
            playerBoard[i][j] = sudoku.rows[i].cells[j].innerHTML;      // adds the numbers from the grid to a nested array
          }
        }
        return playerBoard;                                             // returns the new board
      }

      function printBoard(){                    // prints a board
        var playerInput = getBoard()
        let N = playerInput.length;
        
        if(solveSudoku(playerInput, N)){        // checks to see if there is a solution, if so the board is printed
          print(playerInput, N);
        }
        else{
          alert("No solution");
        }
      }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      function generatePuzzle(difficulty){                                // generates a new Sudoku puzzle
        var initBoard = [];
        if (container.firstChild.rows.length == 4){
          initBoard = [                                                   // uses an initial 4 x 4 board of all zeros
            [ 0, 0, 0, 0 ],
            [ 0, 0, 0, 0 ],
            [ 0, 0, 0, 0 ],
            [ 0, 0, 0, 0 ]
            ];
        }
        else if(container.firstChild.rows.length == 9){
          initBoard = [                                                   // uses an initial 9 x 9 board of all zeros
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ] 
            ];
        }
        else if(container.firstChild.rows.length == 16){
          initBoard = [                                                   // uses an initial 16 x 16 board of all zeros
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
            ];
        }
        var N = initBoard.length;
        if(generateSudoku(initBoard, N)){       // generats a puzzle
          genBoard = initBoard;
          solutionNum = multiSolutions(genBoard, N);
          if(solutionNum > 1){
            generatePuzzle(difficulty);
          }
          else{
            printClues(difficulty, genBoard, N);             // prints only specified number of the cells
            //alert("Number of tries to print clues: " + clueCount);
          }
        }
      }

      function checkSolution(){                               // checks the solution to a generated puzzle against the players answer
        var pB = getBoard();
        var result = arraysEqual(genBoard, pB);
        if(result){
          alert("Congratulations, Celebrations, You win!");
        }
        else{
          alert("Try again");
        }
      }

      function checkBoard(){                            // checks to make sure the current board is a valid Sudoku puzzle
        currentBoard = getBoard();
        if(!isValidCell(currentBoard, currentBoard.length)){
          alert("This is not a valid Sudoku puzzle");
        }
        multiSolutions(currentBoard, currentBoard.length);
      }

      function checkRow(array, row){      // checks to make sure the rows are valid (no duplicate numbers)
        let a = new Set();
        for(let i = 0; i < array.length; i++){
          if(a.has(array[row][i])){
            return false;
          }
          if(array[row][i] != ""){
            a.add(array[row][i]);
          }
        }
        return true;
      }

      function checkCol(array, col){        // checks to make sure the columns are valid (no duplicate numbers)
        let a = new Set();
        for(let i = 0; i < array.length; i++){
          if(a.has(array[i][col])){
            return false;
          }
          if(array[i][col] != ""){
            a.add(array[i][col]);
          }
        }
        return true;
      }

      function checkBox(array, sRow, sCol){                 // checks to make sure that the boxes have no duplicates from a starting row and column
        let a = new Set();
        let sqrt = Math.floor(Math.sqrt(array.length))
        for(let row = 0; row < sqrt; row++){
          for(let col = 0; col < sqrt; col++){
            let current = array[row + sRow][col + sCol];    // checks boxes from row 0 column 0 then row 0 column 3 etc
            if(a.has(current)){
              return false;
            }
            if(current != ""){
              a.add(current);
            }
          }
        }
        return true;
      }

      function isValid(array, row, col){      // makes sure all of the Sudoku conditions are met
        let sqrt = Math.floor(Math.sqrt(array.length))
        return checkRow(array, row) && checkCol(array, col) && checkBox(array, row - row % sqrt, col - col% sqrt);
      }

      function isValidCell(array, n){       // checks to make sure a cell is valid
        for(let i = 0; i < n; i++){
          for(let j = 0; j < n; j++){
            if(!isValid(array, i, j)){      // runs the isvalid function for every cell in the grid
              return false;
            }
          }
        }
        return true;
      }

      function multiSolutions(array, n){      // checks for multiple solutions
        var numberOfSolutions = multipleSolutions(0, 0, array, n, 0);
        alert(numberOfSolutions);
        if(numberOfSolutions > 1){                // run solve for multiple solutions
          alert("This puzzle has multiple solutions");
          return 2;
        }
        else if (numberOfSolutions == 1){
          alert("This puzzle has a unique solution");
          return numberOfSolutions;
        }
        else{
          alert("This puzzle has no solutions");
          return 2;
        }
        
      }