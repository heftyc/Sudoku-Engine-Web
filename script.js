let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");

let sideDimension = Math.max(screen.width * 3 / 4, 720) - 90;
const origin = 9;

let nums = [[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0]];

/*let nums = [[5,0,0,0,4,0,0,0,0],
            [1,0,0,0,2,0,0,0,0],
            [0,0,0,5,0,1,0,0,0],
            [7,3,6,0,0,4,9,0,0],
            [0,8,5,9,0,6,1,7,0],
            [0,0,9,8,0,0,6,3,5],
            [0,0,0,2,0,0,0,0,0],
            [8,0,0,0,6,0,0,1,7],
            [0,0,0,0,1,0,8,0,6]];*/

let squareX = null, squareY=null;
function setUpCanvas() {
    canvas.width = Math.max(screen.width * 3 / 4, 720);
    canvas.height = canvas.width;
}

function drawFrame(){    
    //Draw the main square
    context.lineWidth = 8;
    context.strokeRect(origin,origin,sideDimension,sideDimension);

    //Draw the subsquares
    context.lineWidth = 4;
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            context.strokeRect(origin + i * (sideDimension / 3), origin + j * (sideDimension / 3), sideDimension /3,sideDimension/3);
        }
    }

    //Draw the individual squares
    context.lineWidth = 1;
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            context.strokeRect(origin + i * (sideDimension / 9), origin + j * (sideDimension / 9), sideDimension /9,sideDimension/9);
        }
    }
    context.stroke(); 
}

function updateCanvas(){
    context.clearRect(0,0,canvas.width,canvas.height);
    drawFrame();
    context.font = `${sideDimension / 9 / 2}px Arial`;
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(nums[i][j] !== 0){
                context.fillText(nums[i][j], origin + i * (sideDimension / 9) + (sideDimension / 24), origin + j * (sideDimension / 9) + sideDimension / 12);
           }

           if(i == squareX && j == squareY){
               context.globalAlpha = 0.2;
               context.fillStyle = "cyan";
               context.fillRect(origin + i * (sideDimension / 9), origin + j * (sideDimension / 9), sideDimension /9,sideDimension/9);
               context.globalAlpha = 1.0;
               context.fillStyle = "black";
           }
        }
    }
}

function solve(){
    do {
        changed = false;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (nums[i][j] == 0) {
                    let candidate = 0;
                    for (let k = 1; k < 10; k++) {
                        if (!searchRows(i, k) && !searchCols(j, k) && !searchBox(i, j, k)) {
                            if (candidate == 0) {
                                candidate = k;
                            } else {
                                candidate = -1;
                                break;
                            }
                        }
                    }
                    if (candidate != -1) {
                        nums[i][j] = candidate;
                        changed = true;
                    }

                }
            }
        }
        //Use other algorithm
        if (!changed) {
            for (let num = 1; num < 10; num++) {
                for (let x = 0; x < 3; x++) {
                    for (let y = 0; y < 3; y++) {
                        if (!searchBox(x * 3, y * 3, num)) {
                            let foundCandidate = false;
                            let candidateX = -1, candidateY = -1;
                            for (let xSub = 0; xSub < 3; xSub++) {
                                for (let ySub = 0; ySub < 3; ySub++) {

                                    let locX = x * 3 + xSub;
                                    let locY = y * 3 + ySub;
                                    // if square is clear
                                    if (nums[locX][locY] == 0) {
                                        if (!searchCols(locY, num) && !searchRows(locX, num)) {
                                            if (foundCandidate) {
                                                candidateX = -1;
                                                candidateY = -1;
                                            } else {
                                                foundCandidate = true;
                                                candidateX = locX;
                                                candidateY = locY;
                                            }
                                        }
                                    }
                                }
                            }

                            if (candidateX != -1) {
                                nums[candidateX][candidateY] = num;
                                changed = true;
                            }
                        }
                    }
                }
            }
        }
        updateCanvas();
    } while (changed);
    console.log("finished attempt at puzzle");
}

function searchRows(row, query) {
    for (let i = 0; i < 9; i++) {
        if (nums[row][i] == query) {
            return true;
        }
    }
    return false;
}

function searchCols(col, query) {
    for (let i = 0; i < 9; i++) {
        if (nums[i][col] == query) {
            return true;
        }
    }
    return false;
}

function searchBox(row, col, query) {
    let boxX = row - (row % 3);//(row / 3) * 3;
    let boxY = col - (col % 3);//(col / 3) * 3;

    for (let i = boxX; i < boxX + 3; i++) {
        for (let j = boxY; j < boxY + 3; j++) {
            if (nums[i][j] == query) {
                return true;
            }
        }
    }
    return false;
}

window.addEventListener("keydown", event => {
    if(event.key >="1" && event.key <= "9"){
        if(squareX !== null && squareY !== null){
            nums[squareX][squareY] = parseInt(event.key);
           updateCanvas();
        }
    }
});

canvas.addEventListener("click", event =>{
    
    //context.strokeRect(origin + i * (sideDimension / 9), origin + j * (sideDimension / 9), sideDimension /9,sideDimension/9);

        squareX = parseInt((event.layerX - origin * 2) / sideDimension * 9);
        squareY = parseInt((event.layerY - origin * 2) / sideDimension * 9);
        updateCanvas();
});

setUpCanvas();
updateCanvas();