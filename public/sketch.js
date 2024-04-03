let socket = io();
let eraseme = false;
let drawingStroke = 2;
let eraserStroke = 10;
let strokeColor = "black";
let backgroundColor = "white";
let flag = false;

const localurl="http://localhost:3000"
const awsurl="https://www.drawhub.online"



socket.on('mouse',(data,currentId) => {
    
    var currentUrl = window.location.href.split('/')[3];
   // console.log("Current URL: " + currentUrl);
    
    if(currentId!==currentUrl) return;

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

document.getElementById("screenshot").addEventListener('click',()=>{
    
        // Send a request to the server to take a screenshot

        let currentUrl = window.location.href.split('/')[3];
    
        let url = awsurl+ "/" + currentUrl;
            // Send a request to the server to take a screenshot
            fetch(awsurl + "/screenshot", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: url })
            })
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error('Network response was not ok.');
            })
            .then(blob => {
                // Create a temporary URL for the screenshot
                const imgUrl = URL.createObjectURL(blob);
                
                // Create an anchor tag
                const a = document.createElement('a');
                a.href = imgUrl;
                a.download = 'screenshot.png'; // Set the filename for the downloaded image
                a.click();

                // Cleanup
                URL.revokeObjectURL(imgUrl);
            })
            .catch(error => {
                console.error('Error taking screenshot:', error);
            });
    });

function setup() {
    
    const Width = window.innerWidth;
    const Height = window.innerHeight;
    createCanvas(Width, Height);
    background(backgroundColor);
    strokeWeight(drawingStroke);
    stroke(strokeColor);

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
    
    
    const currentId = window.location.href.split("/")[3];
    socket.emit('mouse',data,currentId);

    return false;
    
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

