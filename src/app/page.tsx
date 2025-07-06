"use client";
import React, {useRef, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Image from "next/image";

type IconSize = 16 | 32 | 48 | 128;
const ICON_SIZES: IconSize[] = [16, 32, 48, 128];

export default function IconGeneratorPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("icon");
  const [icons, setIcons] = useState<Partial<Record<IconSize, string>>>({});
  const [manifest, setManifest] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle image upload
  const handleImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
      setFileName(file.name.replace(/\..*$/, ""));
      // Process images
     const newIcons = {} as Record<IconSize, string>;
      for (const size of ICON_SIZES) {
        newIcons[size] = await resizeImage(src, size, size);
      }
      setIcons(newIcons);
      // Create manifest
      setManifest(
        JSON.stringify(
          {
            manifest_version: 3,
            name: "Chrome Extension",
            version: "1.0.0",
            icons: {
              "16": "icon16.png",
              "32": "icon32.png",
              "48": "icon48.png",
              "128": "icon128.png",
            },
          },
          null,
          2
        )
      );
    };
    reader.readAsDataURL(file);
  };

  // Upload/Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleImage(file);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) handleImage(file);
  };

  // Resize image
  async function resizeImage(
    src: string,
    w: number,
    h: number
  ): Promise<string> {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, w, h);
        const ratio = Math.max(w / img.width, h / img.height);
        const nw = img.width * ratio;
        const nh = img.height * ratio;
        const nx = (w - nw) / 2;
        const ny = (h - nh) / 2;
        ctx.drawImage(img, nx, ny, nw, nh);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = src;
    });
  }

  // Download as zip
  const handleZipDownload = async () => {
    const zip = new JSZip();
    for (const size of ICON_SIZES) {
      const img = icons[size];
      if (!img) continue;
      zip.file(`icon${size}.png`, img.split(",")[1], { base64: true });
    }
    zip.file("manifest.json", manifest);
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${fileName}-chrome-icons.zip`);
  };

  // Download one icon
  const downloadIcon = (size: IconSize) => {
    const dataUrl = icons[size];
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `icon${size}.png`;
    a.click();
  };

  // Download manifest.json
  const downloadManifest = () => {
    const blob = new Blob([manifest], { type: "application/json" });
    saveAs(blob, "manifest.json");
  };

  // UI ---------
  return (
    <div
      className="relative w-screen min-h-screen h-full bg-gradient-to-br
        from-[#f6faff] to-[#dce5ef]
        dark:from-[#161925] dark:to-[#22273d]
        flex flex-col
        transition-colors duration-500
      "
    >
      {/* --- Content --- */}
      <main
        className={`
        w-full flex flex-col items-center min-h-screen pt-14 md:pt-10 px-2
        ${!imageSrc ? "justify-center" : ""}
        transition-all duration-1000
      `}
      >
        <div
          className={`
          w-full max-w-4xl
          rounded-3xl shadow-2xl border border-[#e3e7f0] dark:border-[#283046] 
          bg-white/80 dark:bg-[#151929]/80
          backdrop-blur-xl
          p-0 md:py-12 md:px-10 py-8 px-3
          mx-auto
          animate-fadein
        `}
        >
          <h1
            className="
            text-3xl md:text-4xl font-extrabold text-center tracking-tight select-none
            bg-gradient-to-r from-[#7fbbfa] via-[#596aff] to-[#bb86fc] bg-clip-text text-transparent dark:from-[#80eaff] dark:via-[#a99bfa] dark:to-[#d3b0fb]
            drop-shadow-lg mb-10 mt-3
          "
          >
            Chrome Extension Icon Generator
          </h1>
          {!imageSrc ? (
            <div
              className={`relative flex items-center justify-center h-72 sm:h-52
                bg-white/75 dark:bg-[#1c2033]/40
                border-2 border-dashed rounded-2xl select-none transition-all duration-500 shadow-lg cursor-pointer
                ${
                  dragActive
                    ? "border-blue-400 dark:border-cyan-400 shadow-blue-100/50 dark:shadow-cyan-400/20 scale-105"
                    : "border-[#bfc4d6] dark:border-[#32385b] hover:border-[#5b7cf7] dark:hover:border-cyan-400"
                }
                group
              `}
              style={{
                boxShadow: dragActive
                  ? "0 0 15px 4px #6389fa33, 0 2px 16px #62e0fd22"
                  : undefined,
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragActive(false);
              }}
              onDrop={(e) => handleDrop(e)}
              onClick={() => inputRef.current?.click()}
            >
              {/* background pulse */}
              <div
                className={`
                absolute inset-0 pointer-events-none mix-blend-lighten dark:mix-blend-normal
                transition-all duration-500
                ${
                  dragActive
                    ? "animate-pulse bg-blue-100/20 dark:bg-cyan-900/20"
                    : ""
                }
              `}
              />
              <div className="flex flex-col items-center z-10 transition-all duration-300 animate-fadein">
                <svg width="38" height="38" fill="none" viewBox="0 0 36 36">
                  <rect
                    width="36"
                    height="36"
                    rx="12"
                    className="fill-[#b8c6fa] dark:fill-[#3845b0]"
                  />
                  <path
                    d="M18 27v-9m0 9l-5-5m5 5l5-5m-11-4.5a7 7 0 1114 0 7 7 0 01-14 0z"
                    stroke="#222a44"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200 select-none">
                  Drag &amp; drop your image, or&nbsp;
                  <button
                    className="text-blue-700 dark:text-cyan-400 underline font-semibold transition-colors hover:text-blue-500 dark:hover:text-cyan-300 focus:ring focus:ring-blue-200 dark:focus:ring-cyan-600 outline-none"
                    type="button"
                    onClick={() => inputRef.current?.click()}
                  >
                    browse
                  </button>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleChange}
                  />
                </div>
                <div className="text-xs mt-2 text-gray-400 dark:text-gray-500">
                  PNG/JPG recommended. High-res for best results.
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Icon Previews */}
              <div
                className="
                w-full flex flex-wrap gap-6 justify-center items-center mt-1 mb-2
              "
              >
                {ICON_SIZES.map((size, idx) => (
                  <div
                    key={size}
                    className="rounded-xl bg-gradient-to-b from-[#f8fafd] to-[#d7def6] dark:from-[#232749] dark:to-[#151929]
                      shadow-md hover:shadow-blue-200 dark:hover:shadow-cyan-900 hover:-translate-y-[3.5px]
                      transition-all duration-300 flex flex-col items-center py-5 px-4
                      group
                      animate-iconpop
                    "
                    style={{ animationDelay: 0.12 * idx + "s" }}
                  >
                    <Image
                      src={icons[size] as string}
                      width={size}
                      height={size}
                      className="rounded-md border border-[#dadcec] bg-white dark:bg-[#171c33] shadow-sm mb-2 group-hover:scale-110 group-hover:drop-shadow-lg 
                                transition-transform duration-300"
                      alt={`icon${size}`}
                      style={{
                        width: size,
                        height: size,
                        imageRendering: "pixelated",
                      }}
                    />
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-xs text-gray-700 dark:text-gray-200 mb-1 font-medium tracking-wide">
                        {size}x{size}
                      </span>
                      <button
                        className="text-xs min-w-[66px] py-1.5 px-2 font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-cyan-500 dark:to-indigo-600
                        shadow-blue-100/30 dark:shadow-cyan-800/30 text-white
                        transition-all duration-200 hover:from-purple-500 hover:to-pink-500 hover:shadow-md hover:scale-105 active:scale-95"
                        onClick={() => downloadIcon(size)}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Download Actions */}
              <div className="flex flex-col md:flex-row gap-4 mt-10 mb-3 animate-fadein">
                <button
                  className="flex-1 px-6 py-3 text-lg font-semibold rounded-2xl bg-gradient-to-r from-green-400 to-blue-500 dark:from-cyan-500 dark:to-purple-600 shadow-green-100/40 dark:shadow-cyan-800/30
                      text-white transition-all duration-300
                      hover:from-green-500 hover:to-indigo-500 hover:shadow-lg hover:scale-105 active:scale-99"
                  onClick={handleZipDownload}
                >
                  Download All as ZIP
                </button>
                <button
                  className="flex-1 px-6 py-3 text-lg font-semibold rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-[#181e32]/90 text-gray-700 dark:text-gray-100
                    shadow hover:bg-gray-50 dark:hover:bg-[#202950] hover:shadow-md hover:scale-105 active:scale-99 transition-all duration-300"
                  onClick={downloadManifest}
                >
                  Download manifest.json
                </button>
              </div>

              {/* manifest.json display */}
              <div className="mt-10 w-full rounded-xl overflow-hidden shadow-inner bg-[#191c2b]/90 dark:bg-[#101420]/90 max-h-90 animate-fadein">
                <div className="flex items-center justify-between mb-2 px-3 pt-3">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    manifest.json
                  </span>
                  <span className="text-xs text-gray-300 dark:text-gray-700">
                    {fileName}-manifest.json
                  </span>
                </div>
                <pre
                  className="overflow-x-auto text-[#befcff] dark:text-[#71ffdf] text-xs leading-5 p-4 pt-2 select-all"
                  style={{
                    fontFamily: "JetBrains Mono, Fira Mono, Menlo, monospace",
                  }}
                >
                  {manifest}
                </pre>
              </div>
              <div className="text-center mt-10">
                <button
                  className="text-gray-500 dark:text-gray-400 underline transition hover:text-blue-500 dark:hover:text-cyan-300 hover:scale-105"
                  onClick={() => {
                    setImageSrc(null);
                    setIcons({});
                    setManifest("");
                  }}
                >
                  Start Over
                </button>
              </div>
            </>
          )}

          <footer className="mt-16 md:mt-14 text-xs text-gray-300 dark:text-gray-600 text-center select-none animate-fadein">
            Made with{" "}
            <span className="text-pink-600 dark:text-pink-400 font-semibold">
              ❤️
            </span>{" "}
            for <span className="font-semibold">Next.js</span>
          </footer>
        </div>
      </main>

      {/* Animations */}
      <style>{`
        @keyframes fadein {
           0% { opacity:0; transform: translateY(14px);}
           100% {opacity:1; transform: none;}
        }
        @keyframes iconpop {
           0% { opacity:0; transform: scale(0.7) translateY(40px);}
           70%{opacity:1; transform:scale(1.06) translateY(-4px);}
           100% {opacity:1; transform: scale(1) translateY(0);}
        }
        .animate-fadein { animation: fadein 0.95s cubic-bezier(.47,1.44,.14,.89) both; }
        .animate-iconpop { animation: iconpop 0.58s cubic-bezier(.36,1.72,.39,.97) both;}
      `}</style>
    </div>
  );
}
