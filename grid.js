// Height n Width are fixed. Box sizing will change for more boxes
// Box width
var bw = 600;
// Box height
var bh = 600;
var padding = 10;
// Default for starting number of boxes
var num_boxes = 15;
// Variables for canvas
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

// Here we add logic for the size modal
let sizeButton = document.getElementById("sizeButton");

sizeButton.addEventListener("click", function(e) {
    e.preventDefault();
    let boxes = document.getElementById("number_boxes");
    if (boxes.value <= 0) {
      alert("Please enter a number greater than 0.")
    } 
    else {
        num_boxes = boxes.value
        drawBoard(boxes.value)
    }
  });

var right = 2;
// Checks for mouse click
canvas.addEventListener('mousedown', function (e){
    // Simpler to check if not right button as left is denoted in diff ways in diff browsers
    if(e.button != right){
        coords = getCursorPosition(e)
        console.log(coords)
        // Subtract off the padding as the grid doesn't start at (0,0), it starts at (10,10)
        coords[0] -= padding
        coords[1] -= padding

        // First we get the position of where the mouse is and on which block
        // To do this, we just use some simple math and geometry
        var box_size = bw / num_boxes
        block_x = Math.floor(coords[0] / box_size) * box_size
        block_y = Math.floor(coords[1] / box_size) * box_size
        console.log(block_x)
        // Here we can draw the rectange
        // Padding for each box. We add +1 as it shouldn't overlap with the grid
        const p_box = padding + 1
        const b_size = box_size - 1
        context.rect(p_box + block_x, p_box + block_y, b_size, b_size);
        context.fillStyle = "black";
        context.fill();
    }
}, false);



// This function will draw the grid
function drawBoard(number_of_boxes){
    context.clearRect(0, 0, canvas.width, canvas.height);
    var box_size_px = bw / number_of_boxes
    // The plus one for the middle conditions is to deal with any rounding issues and sorts
    context.beginPath();
    for (var x = 0; x <= bw+1; x += box_size_px) {
        context.moveTo(0.5 + x + padding, padding);
        context.lineTo(0.5 + x + padding, bh + padding);
    }
    for (var x = 0; x <= bh+1; x += box_size_px) {
        context.moveTo(padding, 0.5 + x + padding);
        context.lineTo(bw + padding, 0.5 + x + padding);
    }
    context.strokeStyle = "black";
    context.stroke();
}

drawBoard(num_boxes);


// Returns the coordinates for the cursor relative to the canvas
function getCursorPosition(event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return [x, y]
}