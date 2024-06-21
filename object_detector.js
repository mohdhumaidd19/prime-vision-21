
const video = document.getElementById("video");
const uploadInput = document.getElementById("upload");
const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");

const worker = new Worker("worker.js");
let boxes = [];
let interval;
let busy = false;

uploadInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        loadVideo(url);
    }
});

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        const videoSrc = card.getAttribute('data-video');
        loadVideo(videoSrc);
    });
});

function loadVideo(src) {
    video.src = src;
    video.style.display = "block";
    playBtn.style.display = "inline-block";
    pauseBtn.style.display = "inline-block";
    document.querySelector("canvas").style.display = "block";
}

video.addEventListener("play", () => {
    const canvas = document.querySelector("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext("2d");
    interval = setInterval(() => {
        const links = document.querySelectorAll("canvas ~ a");
        links.forEach(link => link.remove());

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        draw_boxes(canvas, boxes);
        const input = prepare_input(canvas);
        if (!busy) {
            worker.postMessage(input);
            busy = true;
        }
    }, 30);
});

worker.onmessage = (event) => {
    const output = event.data;
    const canvas = document.querySelector("canvas");
    boxes = process_output(output, canvas.width, canvas.height);
    busy = false;
};

video.addEventListener("pause", () => {
    clearInterval(interval);
});

playBtn.addEventListener("click", () => {
    video.play();
});

pauseBtn.addEventListener("click", () => {
    video.pause();
});

function prepare_input(img) {
    const canvas = document.createElement("canvas");
    canvas.width = 640; 
    canvas.height = 640;
    const context = canvas.getContext("2d");
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const red = [], green = [], blue = [];
    for (let index = 0; index < data.length; index += 4) {
        red.push(data[index] / 255);
        green.push(data[index + 1] / 255);
        blue.push(data[index + 2] / 255);
    }
    return [...red, ...green, ...blue];
}

function process_output(output, img_width, img_height) {
    let boxes = [];
    for (let index = 0; index < 8400; index++) {
        const [class_id, prob] = [...Array(yolo_classes.length).keys()]
            .map(col => [col, output[8400 * (col + 4) + index]])
            .reduce((accum, item) => item[1] > accum[1] ? item : accum, [0, 0]);
        if (prob < 0.5) {
            continue;
        }
        const label = yolo_classes[class_id];
        const xc = output[index];
        const yc = output[8400 + index];
        const w = output[2 * 8400 + index];
        const h = output[3 * 8400 + index];
        const x1 = (xc - w / 2) / 640 * img_width; 
        const y1 = (yc - h / 2) / 640 * img_height; 
        const x2 = (xc + w / 2) / 640 * img_width; 
        const y2 = (yc + h / 2) / 640 * img_height; 
        boxes.push([x1, y1, x2, y2, label, prob]);
    }
    boxes = boxes.sort((box1, box2) => box2[5] - box1[5]);
    const result = [];
    while (boxes.length > 0) {
        result.push(boxes[0]);
        boxes = boxes.filter(box => iou(boxes[0], box) < 0.7 || boxes[0][4] !== box[4]);
    }
    return result;
}

function iou(box1, box2) {
    return intersection(box1, box2) / union(box1, box2);
}

function union(box1, box2) {
    const [box1_x1, box1_y1, box1_x2, box1_y2] = box1;
    const [box2_x1, box2_y1, box2_x2, box2_y2] = box2;
    const box1_area = (box1_x2 - box1_x1) * (box1_y2 - box1_y1);
    const box2_area = (box2_x2 - box2_x1) * (box2_y2 - box2_y1);
    return box1_area + box2_area - intersection(box1, box2);
}

function intersection(box1, box2) {
    const [box1_x1, box1_y1, box1_x2, box1_y2] = box1;
    const [box2_x1, box2_y1, box2_x2, box2_y2] = box2;
    const x1 = Math.max(box1_x1, box2_x1);
    const y1 = Math.max(box1_y1, box2_y1);
    const x2 = Math.min(box1_x2, box2_x2);
    const y2 = Math.min(box1_y2, box2_y2);
    return (x2 - x1) * (y2 - y1);
}

function draw_boxes(canvas, boxes) {
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 3;
    ctx.font = "18px serif";

    boxes.forEach(([x1, y1, x2, y2, label]) => {
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        ctx.fillStyle = "#00ff00";
        const width = ctx.measureText(label).width;
        ctx.fillRect(x1, y1, width + 10, 25);
        ctx.fillStyle = "#000000";
        ctx.fillText(label, x1, y1 + 18);

        const link = document.createElement("a");
        link.href = `https://www.amazon.in/s?k=${encodeURIComponent(label)}`;
        link.target = "_blank";
        link.style.position = "absolute";
        link.style.left = `${x1}px`;
        link.style.top = `${y1}px`;
        link.style.width = `${x2 - x1}px`;
        link.style.height = `${y2 - y1}px`;
        link.style.display = "block";
        link.style.zIndex = "10";
        link.style.border = "2px solid rgba(0, 255, 0, 0.5)";
        canvas.parentElement.appendChild(link);
    });
}

const yolo_classes = [
    'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat',
    'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse',
    'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase',
    'frisbee', 'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 'bottle',
    'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza',
    'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone',
    'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
];
