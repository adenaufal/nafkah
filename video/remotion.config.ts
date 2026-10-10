import { Config } from "@remotion/cli/config";

// Grafis datar dengan banyak teks: PNG per frame menghindari artefak JPEG di
// tepi huruf sebelum di-encode ke H.264.
Config.setVideoImageFormat("png");
Config.setCodec("h264");
Config.setCrf(16);
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
