import express from "express";
import cache from "./cache.mjs";
import { v4 as uuidv4 } from "uuid";

import "@tensorflow/tfjs-node";
import * as canvas from "canvas";
import * as faceapi from "face-api.js";
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function loadModels() {
  const modelsDir = path.join(__dirname, "models");
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsDir);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelsDir);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelsDir);
  console.log("Models Loaded");
}

await loadModels();

async function getFaceDescriptor(imagePath) {
  const img = await canvas.loadImage(imagePath);
  const detections = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  return detections.descriptor;
}

async function faceRecognize(imagePath1, imagePath2) {
  const descriptor1 = await getFaceDescriptor(imagePath1);
  const descriptor2 = await getFaceDescriptor(imagePath2);

  if (!descriptor1 || !descriptor2) {
    console.log("Faces not detected in one or both images.");
    return;
  }

  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  const similarity = distance < 0.6;
  console.log(`Are the faces similar? ${similarity ? "Yes" : "No"}`);

  return { similarity: similarity, distance: distance };
}

faceRecognize("./sample/image2.jpg", "./sample/image3.jpg");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/recognize", (req, res) => {
  const { source, target } = req.body;
  // TODO
  return res.status(201).json({ source, target });
});

app.get("/health", (_, res) => {
  return res.sendStatus(200);
});

app.use((err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  res.status(500);
  res.json({ error: err.message });
});

app.use("*", (_, res) => {
  return res
    .status(404)
    .json({ error: "the requested resource does not exist on this server" });
});

export default app;
