# Chrome Extension Icon Generator

A **Next.js web app** that instantly generates correctly sized icons (`16x16`, `32x32`, `48x48`, `128x128`) and a ready-to-use `manifest.json` for your Chrome extension. You can upload any image, preview all icon sizes, and download individual PNGs or everything in a ZIP file – all right in your browser!

![UI Preview](./public//Screenshot(1).png) 
![UI Preview](./public//Screenshot(2).png) 
![UI Preview](./public//Screenshot(3).png) 

## ✨ Features

- **Drag & Drop or Browse:** Upload a PNG, JPG, or SVG image.
- **Instant Resizing + Previews:** Generates high-quality preview icons at required Chrome sizes.
- **Download ZIP:** One click to download all icons with an auto-generated `manifest.json`.
- **Download Individually:** Download each icon or the manifest separately.
- **Reset UI:** Quickly start over and upload a new image.
- **Client-Side Only:** No image data ever leaves your browser.

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Sidharth-e/crxicon.git
cd crxicon
npm install
```

### 2. Run Locally

```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Use the App

1. Drag and drop or browse to select an image.
2. Preview your icons.
3. Download icons individually, as a ZIP, or grab the `manifest.json`.

---

## 📁 How It Works

- Your image is resized on the fly, in the browser, to all required Chrome extension sizes:
  - `16x16`
  - `32x32`
  - `48x48`
  - `128x128`
- Downloads a `manifest.json` preconfigured with your icon filenames and Chrome manifest v3 format.
- No files are uploaded to a server.

---

## 🧩 Technologies Used

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [JSZip](https://stuk.github.io/jszip/) (for generating ZIPs client-side)
- [file-saver](https://github.com/eligrey/FileSaver.js/) (for downloads)

---

## 📦 File Structure

- `app/page.tsx`: Main Next.js component with complete logic and UI for the generator.

---

## 🛠️ Customization

- **Manifest:** You may edit the template in the source if you need extra properties.
- **Extra Sizes:** Add or remove sizes in the `ICON_SIZES` array at the top of the file.
- **Branding:** Update colors and UI styles as you wish. The styles use Tailwind CSS classes.

---

## ⚡ Troubleshooting

- **Blurry Icons?** Use a larger, square PNG as your source for best results.
- **SVG Uploads:** Most SVGs work! Complex SVGs may render differently.
- **Nothing happens?** Make sure your browser supports FileReader, the `<canvas>` API, and JavaScript is enabled.

---

## 📄 Example `manifest.json` Output

```json
{
  "manifest_version": 3,
  "name": "Chrome Extension",
  "version": "1.0.0",
  "icons": {
    "16": "icon16.png",
    "32": "icon32.png",
    "48": "icon48.png",
    "128": "icon128.png"
  }
}
```

---

## 🖼️ Credits & License

- Made with ❤️ for [Next.js](https://nextjs.org/).
- MIT License.
- Inspired by [alexleybourne/chrome-extension-icon-generator](https://alexleybourne.github.io/chrome-extension-icon-generator/)
---

**Happy Chrome Extension building!**

---

**Tip:**  
Fork and deploy this app for quick use, or embed it in your toolchain for your dev team 🚀

---