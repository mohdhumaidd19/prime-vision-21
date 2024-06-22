# YOLOv8 object detection in videos in a web browser

**PROTOTYPE LINK**: https://prime-vision-21.vercel.app/

**PPT Link**: https://1drv.ms/p/c/77f6ef183d598fba/EWDVVsYm4fxMuf2Hvao_tMsBbQZ9XpSwHogmom9IbwMAdg?e=vbr843


This is a web interface to [YOLOv8 object detection neural network](https://ultralytics.com/yolov8) that allows to run object detection right in a web browser without any backend using [ONNX runtime](https://onnxruntime.ai/).



# Install

Clone this repository: `git clone https://github.com/mohdhumaidd19/prime-vision-21`

Download the last version of the "ort-wasm-simd.wasm" from here: https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort-wasm-simd.wasm to the root of the repository.

# Run

You need to run `index.html` using any local webserver, for example internal webserver of Visual Studio Code. Ensure that 
the ONNX runtime library `ort-wasm-simd.wasm`, the model file `yolov8n.onnx` and the `sample.mp4` video file exist in the same folder with `index.html`.

Using the interface, you can press "Play" button to start object detection on the sample video. 

