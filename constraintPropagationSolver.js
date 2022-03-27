      const container = document.getElementById("container");
      var boardState = [];
      var undoCount = 0;
      var genBoard;
      var printedClueBoard;

      function test(){
        let puzzle = [[3,0,0,2,0,0,0,0,0],
[0,0,0,1,0,7,0,0,0],
[7,0,6,0,3,0,5,0,0],
[0,7,0,0,0,9,0,8,0],
[9,0,0,0,2,0,0,0,4],
[0,1,0,8,0,0,0,5,0],
[0,0,9,0,4,0,3,0,1],
[0,0,0,7,0,2,0,0,0],
[0,0,0,0,0,8,0,0,6]];
        print(puzzle, 9);
      }

      function clearBoard(){
        var emptyBoard = [];
        if (container.firstChild.rows.length == 4){
          emptyBoard = [                                                   // uses an initial 4 x 4 board of all zeros
            [ 0, 0, 0, 0 ],
            [ 0, 0, 0, 0 ],
            [ 0, 0, 0, 0 ],
            [ 0, 0, 0, 0 ]
            ];
        }
        else if(container.firstChild.rows.length == 9){
          emptyBoard = [                                                   // uses an initial 9 x 9 board of all zeros
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
          emptyBoard = [                                                   // uses an initial 16 x 16 board of all zeros
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
        document.getElementById('checkButton').disabled = true;
        print(emptyBoard, container.firstChild.rows.length);
      }

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
          numberButton.addEventListener("click", function(){disableCheck(i, size, this)});
          buttonDiv.appendChild(numberButton);
        }        
      }

      function disableCheck(i, size, numberButton){
        let board = getBoard();
        let count = 0;

        for(let x = 0; x < size; x++){
          for(let y = 0; y < size; y++){
            if(board[x][y] == i){
              count++;
            }
          }
        }
        if(count == size){            
          numberButton.disabled = true;
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
            if(cell.innerHTML == ""){
              cell.setAttribute('contenteditable', true);
            }
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

      this.tests={backtracks: 0, time: 0};
      function solveSudoku(puzzleArray) {                   // solves the board on screen through the use of Constraint Propagation
        var n = puzzleArray.length;                         // gets the length of the board ie. n x n board with n being 4,9 or 16
        var sqrt = Math.sqrt(n);                            // finds the square root of the length of the board; this is useful for computations regarding the boxes within a Sudoku grid
        this.tests.time = Date.now();  
        
        var isEmptyCell = puzzleArray.flat(Infinity).some(function(e){return e == "" || e == 0});
        while(isEmptyCell){
          let state = JSON.parse(JSON.stringify(puzzleArray));
          singleValues(puzzleArray);
          onlyOption(puzzleArray);
          
          if(arraysEqual(puzzleArray.flat(Infinity), state.flat(Infinity))){
            break;
          }

          isEmptyCell = puzzleArray.flat(Infinity).some(function(e){return e == "" || e == 0});
        }

        if(backtrack(puzzleArray)){
          this.tests.time = Date.now() - this.tests.time;
          alert(this.tests.time + " ms" + " backtracks: " + this.tests.backtracks);
          print(puzzleArray, n);  
          this.tests.backtracks = 0;
        }
      }

      function onlyOption(puzzleArray){
        var allowedValuesArray = allowedValues(puzzleArray);
        var n = puzzleArray.length;

        for(let row = 0; row < n; row++){
          let rowValues = allowedValuesArray.filter(function(e){return e.i == row});
          for(let num = 1; num <= n; num++){
            let count = 0
            for(let k = 0; k < rowValues.length; k++){
              if(rowValues[k].values.includes(num)){
                count++;
              }
            }
            if(count == 1){
              let printedValue = rowValues.filter(function(e){return e.values.includes(num)});
              puzzleArray[printedValue[0].i][printedValue[0].j] = num; 
            }
          }   
        }

        for(let col = 0; col < n; col++){
          let colValues = allowedValuesArray.filter(function(e){return e.j == col});
          for(let num = 1; num <= n; num++){
            let count = 0
            for(let k = 0; k < colValues.length; k++){
              if(colValues[k].values.includes(num)){
                count++;
              }
            }
            if(count == 1){
              let printedValue = colValues.filter(function(e){return e.values.includes(num)});
              puzzleArray[printedValue[0].i][printedValue[0].j] = num; 
            }
          }   
        }

        let sqrt = Math.floor(Math.sqrt(n));
        let rowCount = 0;    
        for(let row = 0; row < sqrt; row++){
          let colCount = 0;
          rowCount++;
          for(let col = 0; col < sqrt; col++){
            colCount++;
            let boxValues = allowedValuesArray.filter(function(e){return row <= e.i <= sqrt * rowCount && col <= e.j <= sqrt * colCount});
            for(let num = 1; num <= n; num++){
              let count = 0
              for(let k = 0; k < boxValues.length; k++){
                if(boxValues[k].values.includes(num)){
                  count++;
                }  
              }
              if(count == 1){
                let printedValue = boxValues.filter(function(e){return e.values.includes(num)});
                puzzleArray[printedValue[0].i][printedValue[0].j] = num; 
              }
            }  
          }
        }

        return puzzleArray;
      }

      function singleValues(puzzleArray){
        var allowedValuesArray = allowedValues(puzzleArray);
        var lengths = [];
        for(let x = 0; x < allowedValuesArray.length; x++){
          lengths[x] = allowedValuesArray[x].values.length;
        }

        var singleOption = lengths.some(function(e) {return e == 1});
        while(singleOption){
          var lengths = [];
          for(let x = 0; x < allowedValuesArray.length; x++){
            lengths[x] = allowedValuesArray[x].values.length;
            if(allowedValuesArray[x].values.length == 1){
              puzzleArray[allowedValuesArray[x].i][allowedValuesArray[x].j] = allowedValuesArray[x].values;
              allowedValuesArray.splice(x, 1);
            }
          }
          allowedValuesArray = allowedValues(puzzleArray);
          singleOption = lengths.some(function(e) {return e == 1});
        }
        return puzzleArray;
      }

      function allowedValues(puzzleArray){
        var allowedValuesArray = [];
        var n = puzzleArray.length;
        var obj = {};
        obj["i"];
        obj["j"];
        obj["values"] = []; 

        loop1:
        for(let i = 0; i < n; i++){              // iterates through each cell in the given grid
          loop2:
          for(let j = 0; j < n; j++){  
            if(puzzleArray[i][j] == ""){                // if the cell is empty
              obj = {};
              obj["values"] = [];    
              for(let k = 1; k <= n; k++){              // cycle through the available value, 1 - 4 / 1 - 9 / 1 - 16
                if(isSafe(puzzleArray, i, j, k)){       // if it is safe store the position and the possible values    
                  obj["i"] = i;
                  obj["j"] = j;
                  obj["values"].push(k);   
                }
              }
              obj["l"] = obj.values.length;
              allowedValuesArray.push(obj);
              //break loop1;
            }
          }
        }  
        return allowedValuesArray;      
      }

      function backtrack(puzzleArray){
        var allowedValuesArray = allowedValues(puzzleArray);
        var n = puzzleArray.length;
        let row = -1;
        let col = -1;
        let isEmpty = true;

        for(let i = 0; i < n; i++){
          for(let j = 0; j < n; j++){
            if (puzzleArray[i][j] == ""){
              row = i;
              col = j;

              isEmpty = false;                          // we still have missing numbers to fill within the grid
              break;
            }
          }

          if(!isEmpty){                                 
            break;
          }
        }

        if(isEmpty){                                   // if this is true we no longer have any empty space (the puzzle is solved)
          return true;
        }

        var shortest = allowedValuesArray.reduce(function(a, b) {
          return a.l <= b.l ? a : b;    
        });
        //alert("i: " + shortest.i +"\n j: " + shortest.j + "\n values: " + shortest.values);

        for(let number = 0; number < shortest.l; number++){     // if the board isnt solved we backtrack
          if(isSafe(puzzleArray, shortest.i, shortest.j, shortest.values[number])){
            puzzleArray[shortest.i][shortest.j] = shortest.values[number];

            if(backtrack(puzzleArray)){                  // checks to see if the updated board is solvable
              return true;                               // returns true so the board can be printed
            }
            else{
              this.tests.backtracks++;
              puzzleArray[shortest.i][shortest.j] = "";                      // if not the number is reset on backtrack
            }
          }
        }
        return false;
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
          if(isSafe(board, row, col, number)){
            board[row][col] = number;
            count = multipleSolutions(row + 1, col, board, n, count);                 // adds solution
          }
        }
        board[row][col] = 0;                                              // resets on backtrack
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
              sudoku.rows[i].cells[j].setAttribute('contenteditable', true);   // prevents cells being edited
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
            blanks = [140, 141, 142, 143, 144, 145];                              // hard (150 - 155 blanks)
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
            var val = sudoku.rows[x].cells[y].innerHTML;
            sudoku.rows[x].cells[y].innerHTML = "";
            var solutions = multipleSolutions(0, 0, getBoard(), N, 0);
            if(solutions == 1){
              sudoku.rows[x].cells[y].setAttribute('contenteditable', false); 
              count++;
            }
            else{
              sudoku.rows[x].cells[y].innerHTML = val;
            }            
          }
        }

        var clueBoard = getBoard();
        printedClueBoard = clueBoard;
        //var solutions = multipleSolutions(0, 0, clueBoard, N, 0);
        //if(solutions != 1){
          //clueCount++;
          //printClues(difficulty, board, N);
        //}
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      function generatePuzzle(difficulty){                                // generates a new Sudoku puzzle
        document.getElementById('checkButton').disabled = false;
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
        var result = multiSolutions(currentBoard, currentBoard.length)
        if(result != 1){
          alert("This is not a valid board");
        }
        else{
          alert("This is a valid board");
        }
        return result;
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
        let sqrt = Math.floor(Math.sqrt(array.length));
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
        if(numberOfSolutions > 1){                // run solve for multiple solutions
          alert("This puzzle has multiple solutions");
          return numberOfSolutions;
        }
        else if (numberOfSolutions == 1){
          //alert("This puzzle has a unique solution");
          return numberOfSolutions;
        }
        else{
          alert("This puzzle has no solutions");
          return numberOfSolutions;
        }
        
      }