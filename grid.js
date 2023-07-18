// Height n Width are fixed. Box sizing will change for more boxes
// Box width
var bw = 600;
// Box height
var bh = 600;
// Padding
var padding = 10;
// Variables for canvas
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");



// Here we add logic for the size modal
let sizeButton = document.getElementById("sizeButton");

sizeButton.addEventListener("click", function(e) {
    e.preventDefault();
    let boxes = document.getElementById("number_boxes");
    
    if (boxes.value == "") {
      alert("Please enter a number greater than 0.")
    } 
    
    else {
        drawBoard(boxes.value)
        $('#sizeModal').modal('hide');
    }
  });



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

// 15 here is just a default starting value for the number of boxes. This can be
// updated by the user on the app
drawBoard(15);