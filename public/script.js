const canvas = new fabric.Canvas('canvas');
const imageInput = document.getElementById('imageInput');
const textInput = document.getElementById('textInput');

imageInput.addEventListener('change', function (event) {
    handleImage(event);
    updateStacks(); // Update stack after handling the image
});

const textColorInput = document.getElementById('textColor');
const fontSizeInput = document.getElementById('fontSize');
const fontFamilyInput = document.getElementById('fontFamily');

function addText() {
    const text = new fabric.IText(textInput.value, {
        left: 100,
        top: 100,
        fill: textColorInput.value,
        fontSize: parseInt(fontSizeInput.value, 10) || 20,
        fontFamily: fontFamilyInput.value || 'Arial',
    });
    canvas.add(text);
    updateStacks(); 
}

function handleImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const fabricImg = new fabric.Image(img);
            canvas.setWidth(img.width);
            canvas.setHeight(img.height);
            canvas.add(fabricImg);
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}



function saveImage() {
    const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 0.8,
    });

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'edited_image.png';
    link.click();
}

const undoStack = [];
const redoStack = [];

function updateStacks() {
    const json = canvas.toDatalessJSON();
    undoStack.push(json);
    redoStack.length = 0; 
}

function undo() {
    if (undoStack.length > 1) 
    {
        const lastState = undoStack.pop();
        redoStack.push(lastState);
        const prevState = undoStack[undoStack.length - 1];
        canvas.loadFromDatalessJSON(prevState, canvas.renderAll.bind(canvas));
    }

}

function redo() {
    if (redoStack.length > 0) {
        const nextState = redoStack.pop();
        undoStack.push(nextState);
        canvas.loadFromDatalessJSON(nextState, canvas.renderAll.bind(canvas));
    }
}