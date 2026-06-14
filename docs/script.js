const BACKEND_URL = "https://Garvit03-robocon-logo-detector.hf.space";

let stream = null;
let detectionInterval = null;
let intervalMs = 300;
let totalDetections = 0;
let framesSent = 0;
let confHistory = [];
let lastFrameTime = 0;
let fpsInterval = null;

const webcam = document.getElementById("webcam");
const output = document.getElementById("canvas-output");
const captureCanvas = document.getElementById("capture-canvas");
const ctx = captureCanvas.getContext("2d");

async function startCamera() {
    try {
        // First check if camera exists
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(d => d.kind === "videoinput");
        
        if (cameras.length === 0) {
            setStatus("", "No camera found on this device");
            alert("No camera found. Please connect a webcam and try again.");
            return;
        }

        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        webcam.srcObject = stream;
        await new Promise(r => webcam.onloadedmetadata = r);

        captureCanvas.width = webcam.videoWidth;
        captureCanvas.height = webcam.videoHeight;

        setStatus("active", "Camera active · starting detection...");
        document.getElementById("startBtn").disabled = true;
        document.getElementById("stopBtn").disabled = false;

        // Start inference loop
        detectionInterval = setInterval(sendFrame, intervalMs);

        // FPS counter
        fpsInterval = setInterval(() => {
            const now = Date.now();
            if (lastFrameTime) {
                const fps = Math.round(1000 / (now - lastFrameTime));
                document.getElementById("fps-counter").textContent = `~${fps} fps`;
            }
        }, 1000);

    } catch (err) {
        if (err.name === "NotAllowedError") {
            setStatus("", "Camera permission denied");
            alert("Camera access was blocked. Click the camera icon in your browser address bar and select Allow, then refresh the page.");
        } else if (err.name === "NotFoundError") {
            setStatus("", "No camera found");
            alert("No camera found. Please connect a webcam and try again.");
        } else {
            setStatus("", "Camera error: " + err.message);
            alert("Camera error: " + err.message);
        }
    }
}

async function sendFrame() {
    if (!stream) return;
    ctx.drawImage(webcam, 0, 0);

    captureCanvas.toBlob(async (blob) => {
        if (!blob) return;
        const start = Date.now();
        lastFrameTime = start;
        framesSent++;
        document.getElementById("frames-sent").textContent = framesSent;
        setStatus("detecting", "Analyzing frame...");

        try {
            const formData = new FormData();
            formData.append("file", blob, "frame.jpg");

            const resp = await fetch(`${BACKEND_URL}/detect`, {
                method: "POST",
                body: formData
            });

            const data = await resp.json();
            const latency = Date.now() - start;

            output.src = data.annotated_image;
            output.style.display = "block";
            webcam.style.display = "none";

            totalDetections += data.count;
            document.getElementById("total-detections").textContent = totalDetections;
            document.getElementById("latency").textContent = latency + "ms";

            updateDetectionList(data.detections);

            if (data.detections.length > 0) {
                const confs = data.detections.map(d => d.confidence);
                confHistory.push(...confs);
                if (confHistory.length > 50) confHistory.shift();
                const avg = (confHistory.reduce((a, b) => a + b, 0) / confHistory.length * 100).toFixed(0);
                document.getElementById("avg-conf").textContent = avg + "%";
            }

            setStatus("active", `Detected ${data.count} logo(s) · ${latency}ms`);
        } catch (e) {
            setStatus("", "Backend error — is the server running?");
            console.error(e);
        }
    }, "image/jpeg", 0.8);
}

function updateDetectionList(detections) {
    const list = document.getElementById("detection-list");
    if (detections.length === 0) {
        list.innerHTML = '<div class="empty-state">No logos in frame</div>';
        return;
    }
    list.innerHTML = detections.map((d, i) => `
      <div class="detection-item">
        <div>
          <div style="font-weight:500;color:var(--text)">${d.class}</div>
          <div class="conf-bar-wrap"><div class="conf-bar" style="width:${d.confidence * 100}%"></div></div>
        </div>
        <div style="color:var(--accent);font-weight:600;font-family:monospace">${(d.confidence * 100).toFixed(1)}%</div>
      </div>
    `).join("");
}

function stopDetection() {
    clearInterval(detectionInterval);
    clearInterval(fpsInterval);
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    webcam.srcObject = null;
    output.style.display = "none";
    webcam.style.display = "block";
    document.getElementById("startBtn").disabled = false;
    document.getElementById("stopBtn").disabled = true;
    document.getElementById("fps-counter").textContent = "-- fps";
    setStatus("", "Stopped");
}

function updateInterval(val) {
    intervalMs = parseInt(val);
    document.getElementById("intervalLabel").textContent = val + "ms";
    if (detectionInterval) {
        clearInterval(detectionInterval);
        detectionInterval = setInterval(sendFrame, intervalMs);
    }
}

function setStatus(type, msg) {
    const dot = document.getElementById("status-dot");
    dot.className = type;
    document.getElementById("status-text").textContent = msg;
}

function generateQR() {
    const mobileUrl = encodeURIComponent("https://garvit-pahwa-03.github.io/Logo-Detection/mobile.html");
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${mobileUrl}&bgcolor=13131a&color=f97316&margin=10`;
    const placeholder = document.getElementById("qr-placeholder");
    placeholder.outerHTML = `<img src="${qrUrl}" alt="QR Code for mobile viewer" />`;
}

// Generate QR on page load
window.addEventListener("load", generateQR);