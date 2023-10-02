// Height n Width are fixed. Box sizing will change for more boxes
// Box width
const bw = 600;
// Box height
const bh = 600;
const padding = 10;
// Default for starting number of boxes
var num_boxes = 15;
// Variables for canvas
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var color = "#000000"
var borderless = false;

// Stores all the color values for the grid so we can save in DB or update screen
// This will be a 2D array aas that makes the most sense for this grid of colors
var gridInfo = initialize_gridInfo(num_boxes);

drawBoard(num_boxes);

// ================================ BUTTONS ======================================
// Gets the color info from the color picker
var backRGB = document.getElementById("color").value;
// When color changes, will update the appropriate variable
document.getElementById("color").onchange = function() {
  backRGB = this.value;
  color = backRGB;
}

// Here we add logic for the size modal
let sizeButton = document.getElementById("sizeButton");
sizeButton.addEventListener("click", function(e) {
    changeGridSize(e)
  });

// Here we add logic for the size modal
let topButton = document.getElementById("topButton");
topButton.addEventListener("click", function(e) {
    e.preventDefault();
    borderless = !borderless
    // Clear the board but we have the colors saved still
    clearBoard()
    // just do one loop here and then check top and replace that but erase rest and then clean up by making helpers. NEED TO MAKE A COLOR BOX FUNC
    for (var i = 0; i < num_boxes; i++) {
        for (var j = 0; j < num_boxes; j++) {
            pos = { x: i, y: j}
            // i and j flipped coz of how 2D arrays work
            color_new = gridInfo[j][i]
            // We only color if it isn't white
            if (color_new != "#FFFFFF") {
                color_square_pos(pos, color_new)
            }
            
        }
    }
    if (borderless) {
        drawBoardBordersOnly(num_boxes)
    }
    else {
        drawBoard(num_boxes)
    }
  });


// ================================ END BUTTONS ======================================

function color_square_coords(coords) {
    // Subtract off the padding as the grid doesn't start at (0,0), it starts at (10,10)
    coords[0] -= padding
    coords[1] -= padding
    // Check if mouse is outside grid but still on canvas
    if ((coords[0] < 0) || (coords[1] < 0)) {
        return;
    }
    else if ((coords[0] >bw) || (coords[1] > bh)) {
        return;
    }
    // First we get the position of where the mouse is and on which block
    // To do this, we just use some simple math and geometry
    let box_size = bw / num_boxes
    let block_index_x = Math.floor(coords[0] / box_size)
    let block_index_y = Math.floor(coords[1] / box_size)
    let block_x = block_index_x * box_size
    let block_y = block_index_y * box_size
    // Here we can draw the rectange
    // Padding for each box. We add some decimal amount as it shouldn't overlap with the grid
    let p_box = padding + 0.6
    let b_size = box_size - 0.1
    // As there is no border, we need to adjust the size and position a bit
    if (borderless) {
        p_box += 1
        b_size -= 1
    }
    context.beginPath();
    context.rect(p_box + block_x, p_box + block_y, b_size, b_size);
    context.fillStyle = color;
    context.fill();
    // Here we check if the user wants borderless canvas or not
    // If they don't want borders, we just set it to the color of the square itself
    if (borderless) {
        context.lineWidth = 1;
        context.strokeStyle = color;
    }
    else {
        context.lineWidth = 1;
        context.strokeStyle = "black";
    }   
    context.stroke();
}


// This function colors a square based on given block number or position of the box instead of coords as done in color_square_coords
function color_square_pos(position, color) {
    let box_size = bw / num_boxes
    let block_x = position.x * box_size
    let block_y = position.y * box_size
    // Here we can draw the rectange
    // Padding for each box. We add some decimal amount as it shouldn't overlap with the grid
    const p_box = padding + 0.6
    const b_size = box_size - 0.1
    context.beginPath();
    context.rect(p_box + block_x, p_box + block_y, b_size, b_size);
    context.fillStyle = color;
    context.fill();
    // Here we check if the user wants borderless canvas or not
    // If they don't want borders, we just set it to the color of the square itself
    if (borderless) {
        context.lineWidth = 1;
        context.strokeStyle = color;
    }
    else {
        context.lineWidth = 1;
        context.strokeStyle = "black";
    }
    context.stroke();
}

// This function will draw the grid.
function drawBoard(number_of_boxes){
    var box_size_px = bw / number_of_boxes
    context.beginPath();
    // The plus one for the middle conditions is to deal with any rounding issues and sorts
    for (var x = 0; x <= bw + 1; x += box_size_px) {
        context.moveTo(0.5 + x + padding, padding);
        context.lineTo(0.5 + x + padding, bh + padding);
    }
    for (var x = 0; x <= bh + 1; x += box_size_px) {
        context.moveTo(padding, 0.5 + x + padding);
        context.lineTo(bw + padding, 0.5 + x + padding);
    }
    context.lineWidth = 1.2;
    context.stroke();
}

// Clear board
function clearBoard(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}


// This function will draw a black border for borderless coloring
// Will not clear board
function drawBoardBordersOnly(number_of_boxes){
    var box_size_px = bw / number_of_boxes
    // This gets used in the for loop. Basically, we skip all the middle lines and
    // only draw the top and bottom edges. Basically drawing two sides of the large square.
    make_all_boxes = number_of_boxes
    context.beginPath();
    // The plus one for the middle conditions is to deal with any rounding issues and sorts
    // This one does left and right lines
    for (var x = 0; x <= bw + 1; x += box_size_px * make_all_boxes) {
        context.moveTo(0.5 + x + padding, padding);
        context.lineTo(0.5 + x + padding, bh + padding);
    }
    for (var x = 0; x <= bh + 1; x += box_size_px * make_all_boxes) {
        context.moveTo(padding, 0.5 + x + padding);
        context.lineTo(bw + padding, 0.5 + x + padding);
    }
    context.lineWidth = 1;
    context.strokeStyle = "black";
    context.stroke();
}


// ================================ MOUSE MOVEMENT ======================================
var mousePosition, holding;
var right = 2;
// This function deals with the mouse being held down
function myInterval() {
var setIntervalId = setInterval(function() {
    if (!holding) clearInterval(setIntervalId);
    if (holding) {
        coords = getCursorPosition(mousePosition)
        color_square_coords(coords)
        // Now we store the box info into a grid array for later use
        // It is flipped due to how 2D arrays work
        let box_size = bw / num_boxes
        let block_index_x = Math.floor(coords[0] / box_size)
        let block_index_y = Math.floor(coords[1] / box_size)
        gridInfo[block_index_y][block_index_x] = color;
        // Redraw the border to avoid overlaps.
        if (borderless) {
            drawBoardBordersOnly(num_boxes)
        }
    }
    
}, 1); // 1 is the wait time between each event in ms
}

// All these mouse functions deal with checking if the mouse is pressed down
// or released
canvas.addEventListener('mousedown', function(e) {
    if(e.button != right){
        holding = true;
        myInterval();
    }
})
canvas.addEventListener('mouseup', function(e) {
    holding = false;
    myInterval();
})
canvas.addEventListener('mouseleave', function() {
    holding = false;
    myInterval();
})
canvas.addEventListener('mousemove', function(e) {
    mousePosition = e;
})


// ================================ END MOUSE MOVEMENT ======================================


// ================= HELPERS ==============================

// Returns the coordinates for the cursor relative to the canvas
function getCursorPosition(event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return [x, y]
}

// This function will initialize the grid array to contain a 2d array of white colors as 
// that is the starting point with the initial size
function initialize_gridInfo(sizeArray){
    var gridArray = []
    startColor = "#FFFFFF"
    for (var i = 0; i < sizeArray; i++) {
        var arr = []
        for (var j = 0; j < sizeArray; j++) {
            arr.push(startColor)
        }
        gridArray.push(arr)
    }
    return gridArray
}

// Helper function which clears the board and changes the number of squares in the grid
function changeGridSize(e) {
    e.preventDefault();
    let boxes = document.getElementById("number_boxes");
    if (boxes.value <= 0) {
      alert("Please enter a number greater than 0.")
    } 
    else {
        num_boxes = boxes.value
        clearBoard()
        if (borderless) {
            drawBoardBordersOnly(num_boxes)
        }
        else {
            drawBoard(num_boxes)
        }
        gridInfo = initialize_gridInfo(num_boxes);
    }
}
