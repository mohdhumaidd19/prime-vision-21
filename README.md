# Visual AI and E-Commerce

**PROTOTYPE LINK**: https://prime-vision-21.vercel.app/

**PPT Link**: https://1drv.ms/p/c/77f6ef183d598fba/EWDVVsYm4fxMuf2Hvao_tMsBbQZ9XpSwHogmom9IbwMAdg?e=vbr843


This is a web interface to [YOLOv8 object detection neural network](https://ultralytics.com/yolov8) that allows to run object detection right in a web browser without any backend using [ONNX runtime](https://onnxruntime.ai/).

# Screen Shots
1) Click to any video or upload any video you want.
<img width="947" alt="image" src="https://github.com/mohdhumaidd19/prime-vision-21/assets/139005276/de8b479c-1b0f-44a3-b1f3-b08b67d0df8a">

2)Click Play for object detection in video.
<img width="932" alt="image" src="https://github.com/mohdhumaidd19/prime-vision-21/assets/139005276/4a98496a-5d6c-4157-bbc6-722fcf136857">  

3)View results on Amazon E-Commerse website.
<img width="904" alt="image" src="https://github.com/mohdhumaidd19/prime-vision-21/assets/139005276/e398888c-23ee-405d-b8e6-9961c6c54f2f">

## Project Structure

- **HTML/CSS**: Frontend interface for video upload, playback, and displaying detection results.
- **JavaScript**: Handles video processing, object detection, and communication with the Web Worker.
- **YOLOv8**: Implemented for real-time object detection in user-uploaded video content.

# Install

Clone this repository: `git clone https://github.com/mohdhumaidd19/prime-vision-21`

Download the last version of the "ort-wasm-simd.wasm" from here: https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort-wasm-simd.wasm to the root of the repository.

# Run

You need to run `index.html` using any local webserver, for example internal webserver of Visual Studio Code. Ensure that 
the ONNX runtime library `ort-wasm-simd.wasm`, the model file `yolov8n.onnx` and the `sample.mp4` video file exist in the same folder with `index.html`.

Using the interface, you can press "Play" button to start object detection on the sample video. 

#  How to Use

1. **Upload a video**: Use the "Upload Video" button to upload your video.
2.  **Play the video**: Watch the video to see real-time object detection in action.
3.  **Interact with Objects**: Click on the highlighted objects to view related products on Amazon

