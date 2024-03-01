let socket = io();
let eraseme = false;
let drawingStroke = 2;
let eraserStroke = 10;
let strokeColor = "black";
let backgroundColor = "white";


function setup() {
    const Width = window.screen.width;
    const Height = window.screen.height;
    createCanvas(Width, Height);
    background(backgroundColor);
    strokeWeight(drawingStroke);
    stroke(strokeColor);

    socket.on('mouse',(data) => {
        if(data.era){
            erase(255,255);
            strokeWeight(data.eraserStroke);
            line(data.x, data.y, data.px, data.py);
            noErase();
        }
        else{
            strokeWeight(data.drawingStroke);
            stroke(data.strokeColor);
            line(data.x, data.y, data.px, data.py);
        }
    });
      
}

function touchMoved() {
    if(eraseme){
        erase(255,255);
        strokeWeight(eraserStroke);
        line(mouseX, mouseY, pmouseX, pmouseY);
        noErase();
    }
    else{
        strokeWeight(drawingStroke);
        stroke(strokeColor);
        line(mouseX, mouseY, pmouseX, pmouseY);
    }
    
    const data = {
        x : mouseX,
        y : mouseY,
        px : pmouseX,
        py : pmouseY,
        era: eraseme,
        drawingStroke: drawingStroke,
        strokeColor: strokeColor,
        eraserStroke: eraserStroke
    }
    
    socket.emit('mouse',data);
    return false;
    
}
function mouseWheel(){
    console.log("Works");
    const page  = createCanvas(displayWidth,displayHeight);
    console.log(page);

}

const colorButtons = document.querySelectorAll('.color-button');
const penStrengthSlider = document.getElementById('pen-strength');
const eraserStrengthSlider = document.getElementById('eraser-strength');


colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Handle color button click, you can use the button's background color
        eraseme = false;
        strokeColor = String(button.style.backgroundColor);
        console.log('Selected color:', button.style.backgroundColor);
    });
});

penStrengthSlider.addEventListener('input', () => {
// Handle pen strength slider change
    drawingStroke = penStrengthSlider.value;
    eraseme = false;
    console.log('Pen Strength:', penStrengthSlider.value);
});

eraserStrengthSlider.addEventListener('input', () => {
// Handle eraser strength slider change
    eraseme = true;
    eraserStroke = eraserStrengthSlider.value;
    console.log('Eraser Strength:', eraserStrengthSlider.value);
});



let pageCount = 1;

function createNewPage() {
  const newPage = document.createElement('div');
  newPage.className = 'page';
  newPage.id = `page${pageCount + 1}`;
  newPage.textContent = `Page ${pageCount + 1}`;
  pageCount++;

  // Append the new page to the document
  document.body.appendChild(newPage);
}

// Add a listener for the scroll event
document.addEventListener('scroll', function (event) {
  // Check if the user is scrolling up
  if (event.deltaY < 0) {
    createNewPage();
  }
});

