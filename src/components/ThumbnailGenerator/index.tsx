import { useState, useRef, useEffect } from "react";
import { Select, SelectItem } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import {
  Download,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Droplet,
  Shuffle,
  Bold,
  Copy,
} from "lucide-react";
import { Toggle } from "../../components/ui/toggle";
import { BackgroundControls } from "./BackgroundControls";
import { BackgroundType } from "../../types";
import { Input } from "../../components/ui/input";
import { Slider } from "../../components/ui/slider";
import ColorThief from "colorthief";
import { cn } from "../../lib/utils";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";

const FONTS = [
  { name: "GmarketSans", label: "Gmarket Sans" },
  { name: "NanumSquareNeo", label: "NanumSquare Neo" },
  { name: "Pretendard", label: "Pretendard" },
] as const;

const gradientPresets = [
  { from: "#FF6B6B", to: "#4ECDC4" },
  { from: "#A8E6CF", to: "#FFD3B6" },
  { from: "#3494E6", to: "#EC6EAD" },
  { from: "#11998E", to: "#38EF7D" },
  { from: "#FC466B", to: "#3F5EFB" },
  { from: "#8A2387", to: "#F27121" },
  { from: "#43C6AC", to: "#191654" },
  { from: "#FF9966", to: "#FF5E62" },
  { from: "#00B4DB", to: "#0083B0" },
  { from: "#FDC830", to: "#F37335" },
  { from: "#5433FF", to: "#20BDFF" },
  { from: "#A8CABA", to: "#5D4157" },
  { from: "#2193b0", to: "#6dd5ed" },
  { from: "#cc2b5e", to: "#753a88" },
  { from: "#42275a", to: "#734b6d" },
  { from: "#de6262", to: "#ffb88c" },
  { from: "#06beb6", to: "#48b1bf" },
  { from: "#eb3349", to: "#f45c43" },
  { from: "#dd5e89", to: "#f7bb97" },
  { from: "#56ab2f", to: "#a8e063" },
  { from: "#614385", to: "#516395" },
  { from: "#eecda3", to: "#ef629f" },
  { from: "#1fa2ff", to: "#12d8fa" },
  { from: "#4facfe", to: "#00f2fe" },
  { from: "#f83600", to: "#f9d423" },
  { from: "#00cdac", to: "#8ddad5" },
  { from: "#ff0844", to: "#ffb199" },
  { from: "#fbab7e", to: "#f7ce68" },
  { from: "#ff758c", to: "#ff7eb3" },
  { from: "#08203e", to: "#557c93" },
] as const;

export default function ThumbnailGenerator() {
  const [layout, setLayout] = useState<string>("1:1");
  const [bgType, setBgType] = useState<BackgroundType>("gradient");
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [text, setText] = useState<string>("Thumbs Up");
  const [subText, setSubText] = useState<string>("Sub Title");
  const [textStyle, setTextStyle] = useState({
    bold: false,
    italic: false,
    shadow: true,
    color: "#ffffff",
    align: "center" as CanvasTextAlign,
    fontSize: 10,
    subFontSize: 6,
    font: FONTS[0].name,
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isEditingSubText, setIsEditingSubText] = useState<boolean>(false);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [showSubtitle, setShowSubtitle] = useState<boolean>(true);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [imageBlur, setImageBlur] = useState<number>(0);

  const randomIndex = Math.floor(Math.random() * gradientPresets.length);
  const [bgColor1, setBgColor1] = useState<string>(
    gradientPresets[randomIndex].from
  );
  const [bgColor2, setBgColor2] = useState<string>(
    gradientPresets[randomIndex].to
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  const editableSubRef = useRef<HTMLDivElement>(null);

  const getBackgroundStyle = () => {
    if (bgType === "gradient") {
      return {
        background: `linear-gradient(to bottom right, ${bgColor1}33, ${bgColor2}33)`,
        backdropFilter: "blur(8px)",
      };
    } else if (bgType === "solid") {
      return {
        backgroundColor: `${bgColor1}33`,
        backdropFilter: "blur(8px)",
      };
    } else if (bgType === "image" && bgImage) {
      return {
        background: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9))`,
        backdropFilter: "blur(8px)",
      };
    }
    return {
      background:
        "linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9))",
      backdropFilter: "blur(8px)",
    };
  };

  const onImageLoad = (image: HTMLImageElement) => {
    setImageRef(image);
  };

  const getCroppedImg = () => {
    if (!imageRef) return;

    const canvas = document.createElement("canvas");
    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      imageRef,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    const base64Image = canvas.toDataURL("image/jpeg");
    setCroppedImageUrl(base64Image);

    const img = new Image();
    img.src = base64Image;
    img.onload = () => {
      setBgImage(img);
    };
  };

  const handleRandomGradient = () => {
    const randomIndex = Math.floor(Math.random() * gradientPresets.length);
    const preset = gradientPresets[randomIndex];
    setBgColor1(preset.from);
    setBgColor2(preset.to);
  };

  const handleTextStyleChange = (property: string, value: any) => {
    setTextStyle((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  useEffect(() => {
    if (isEditing && editableRef.current) {
      editableRef.current.focus();
    }
    if (isEditingSubText && editableSubRef.current) {
      editableSubRef.current.focus();
    }
  }, [isEditing, isEditingSubText]);

  useEffect(() => {
    drawThumbnail();
  }, [
    layout,
    bgType,
    bgColor1,
    bgColor2,
    bgImage,
    text,
    subText,
    textStyle,
    showSubtitle,
    imageBlur,
  ]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file || !e.target) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) return;

      const image = new Image();
      image.src = event.target.result as string;
      image.onload = async () => {
        setBgImage(image);

        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);

          const colorThief = new ColorThief();
          const dominantColor = colorThief.getColor(image);
          const brightness =
            (dominantColor[0] * 299 +
              dominantColor[1] * 587 +
              dominantColor[2] * 114) /
            1000;
          handleTextStyleChange(
            "color",
            brightness > 128 ? "#000000" : "#ffffff"
          );
        } catch (error) {
          console.error("Error extracting color:", error);
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const drawThumbnail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width, height;
    switch (layout) {
      case "1:1":
        width = 1200;
        height = 1200;
        break;
      case "4:3":
        width = 1600;
        height = 1200;
        break;
      case "16:9":
        width = 1920;
        height = 1080;
        break;
      default:
        width = 1200;
        height = 1200;
    }

    canvas.width = width;
    canvas.height = height;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (bgType === "gradient") {
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, bgColor1);
      gradient.addColorStop(1, bgColor2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgType === "solid") {
      ctx.fillStyle = bgColor1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgType === "image" && bgImage) {
      if (imageBlur > 0) {
        ctx.filter = `blur(${imageBlur}px)`;
      }
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      ctx.filter = "none";
    }

    if (textStyle.shadow) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
      ctx.shadowBlur = Math.min(canvas.width, canvas.height) / 60;
      ctx.shadowOffsetX = Math.min(canvas.width, canvas.height) / 120;
      ctx.shadowOffsetY = Math.min(canvas.width, canvas.height) / 120;
    } else {
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    ctx.fillStyle = textStyle.color;
    ctx.textAlign = textStyle.align;
    ctx.textBaseline = "middle";
    const fontSize =
      Math.min(canvas.width, canvas.height) * (textStyle.fontSize / 100);
    ctx.font = `${textStyle.italic ? "italic " : ""}${
      textStyle.bold ? "bold" : "normal"
    } ${fontSize}px ${textStyle.font}, Arial`;

    let x;
    switch (textStyle.align) {
      case "left":
        x = 20;
        break;
      case "center":
        x = canvas.width / 2;
        break;
      case "right":
        x = canvas.width - 20;
        break;
      default:
        x = canvas.width / 2;
    }

    const mainTextY = showSubtitle
      ? canvas.height / 2 - fontSize / 2
      : canvas.height / 2;
    ctx.fillText(text, x, mainTextY);

    if (showSubtitle) {
      const subFontSize =
        Math.min(canvas.width, canvas.height) * (textStyle.subFontSize / 100);
      ctx.font = `${textStyle.italic ? "italic " : ""}${
        textStyle.bold ? "bold" : "normal"
      } ${subFontSize}px ${textStyle.font}, Arial`;
      ctx.fillText(subText, x, mainTextY + fontSize / 2 + subFontSize / 2);
    }
  };

  const handleTextEdit = (newText: string) => {
    setText(newText);
    setIsEditing(false);
  };

  const handleSubTextEdit = (newText: string) => {
    setSubText(newText);
    setIsEditingSubText(false);
  };

  const handleStartEditing = (e: React.MouseEvent, type: "main" | "sub") => {
    e.stopPropagation();
    if (type === "main") {
      setIsEditing(true);
      setIsEditingSubText(false);
    } else {
      setIsEditingSubText(true);
      setIsEditing(false);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "thumbnail.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleCopyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, "image/png");
      });

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);

      alert("Image copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy image to clipboard:", err);
      alert("Failed to copy image to clipboard");
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Thumbs Up</h1>
            <nav>
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                GitHub
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div
        className="pt-16 min-h-screen w-full relative overflow-hidden"
        style={getBackgroundStyle()}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />

        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 sticky top-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-xl">
                <div className="relative w-full" style={{ minHeight: "400px" }}>
                  <canvas
                    ref={canvasRef}
                    className="w-full h-auto rounded-lg shadow-inner"
                  />
                  {isEditing && (
                    <div
                      ref={editableRef}
                      className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-64"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onBlur={(e) => handleTextEdit(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleTextEdit(e.currentTarget.value);
                          }
                        }}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2"
                        autoFocus
                      />
                    </div>
                  )}
                  {isEditingSubText && (
                    <div
                      ref={editableSubRef}
                      className="absolute top-2/3 left-1/2 transform -translate-x-1/2 w-64"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={subText}
                        onChange={(e) => setSubText(e.target.value)}
                        onBlur={(e) => handleSubTextEdit(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSubTextEdit(e.currentTarget.value);
                          }
                        }}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2"
                        autoFocus
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleStartEditing(e, "main")}
                      className="bg-black/50 text-white px-4 py-2 rounded mb-2"
                    >
                      Edit Title
                    </button>
                    <button
                      onClick={(e) => handleStartEditing(e, "sub")}
                      className="bg-black/50 text-white px-4 py-2 rounded"
                    >
                      Edit Subtitle
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-96 space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                <div className="mt-6">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Layout
                  </Label>
                  <Select defaultValue={layout} onValueChange={setLayout}>
                    <SelectItem value="1:1">1:1</SelectItem>
                    <SelectItem value="4:3">4:3</SelectItem>
                    <SelectItem value="16:9">16:9</SelectItem>
                  </Select>
                </div>

                <BackgroundControls
                  bgType={bgType}
                  setBgType={setBgType}
                  bgColor1={bgColor1}
                  setBgColor1={setBgColor1}
                  bgColor2={bgColor2}
                  setBgColor2={setBgColor2}
                  handleImageUpload={handleImageUpload}
                />

                {bgType === "image" && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label>Blur</Label>
                      <Slider
                        value={[imageBlur]}
                        onValueChange={([value]) => setImageBlur(value)}
                        min={0}
                        max={20}
                        step={1}
                      />
                    </div>
                  </div>
                )}

                {bgType === "gradient" && (
                  <Button
                    onClick={handleRandomGradient}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Shuffle
                  </Button>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text
                  </label>
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label>Font</Label>
                      <Select
                        value={textStyle.font}
                        onValueChange={(value) =>
                          handleTextStyleChange("font", value)
                        }
                      >
                        {FONTS.map((font) => (
                          <SelectItem key={font.name} value={font.name}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Toggle
                        pressed={textStyle.bold}
                        onPressedChange={(pressed) =>
                          handleTextStyleChange("bold", pressed)
                        }
                        className={cn(
                          "h-10 w-10 p-0",
                          textStyle.bold && "bg-gray-200"
                        )}
                        aria-label="Bold"
                      >
                        <Bold className="h-4 w-4" />
                      </Toggle>
                      <Toggle
                        pressed={textStyle.italic}
                        onPressedChange={(pressed) =>
                          handleTextStyleChange("italic", pressed)
                        }
                        className={cn(
                          "h-10 w-10 p-0",
                          textStyle.italic && "bg-gray-200"
                        )}
                        aria-label="Italic"
                      >
                        <Italic className="h-4 w-4" />
                      </Toggle>
                      <Toggle
                        pressed={textStyle.shadow}
                        onPressedChange={(pressed) =>
                          handleTextStyleChange("shadow", pressed)
                        }
                        className={cn(
                          "h-10 w-10 p-0",
                          textStyle.shadow && "bg-gray-200"
                        )}
                        aria-label="Shadow"
                      >
                        <Droplet className="h-4 w-4" />
                      </Toggle>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant={
                          textStyle.align === "left" ? "default" : "outline"
                        }
                        onClick={() => handleTextStyleChange("align", "left")}
                        className="flex-1"
                      >
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={
                          textStyle.align === "center" ? "default" : "outline"
                        }
                        onClick={() => handleTextStyleChange("align", "center")}
                        className="flex-1"
                      >
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={
                          textStyle.align === "right" ? "default" : "outline"
                        }
                        onClick={() => handleTextStyleChange("align", "right")}
                        className="flex-1"
                      >
                        <AlignRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Title Size</Label>
                        <Slider
                          value={[textStyle.fontSize]}
                          onValueChange={([value]) =>
                            handleTextStyleChange("fontSize", value)
                          }
                          min={5}
                          max={20}
                          step={1}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-subtitle">Show Subtitle</Label>
                        <Switch
                          id="show-subtitle"
                          checked={showSubtitle}
                          onCheckedChange={setShowSubtitle}
                        />
                      </div>
                      {showSubtitle && (
                        <div>
                          <Label>Subtitle Size</Label>
                          <Slider
                            value={[textStyle.subFontSize]}
                            onValueChange={([value]) =>
                              handleTextStyleChange("subFontSize", value)
                            }
                            min={3}
                            max={15}
                            step={1}
                            disabled={!showSubtitle}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={textStyle.color}
                        onChange={(e) =>
                          handleTextStyleChange("color", e.target.value)
                        }
                        className="w-full h-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  onClick={handleCopyToClipboard}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {bgType === "image" && bgImage && !croppedImageUrl && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-3xl w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Crop Image</h2>
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={layout === "1:1" ? 1 : layout === "4:3" ? 4 / 3 : 16 / 9}
            >
              <img
                src={bgImage.src}
                onLoad={(e) => onImageLoad(e.currentTarget)}
                alt="Crop preview"
                className="max-h-[60vh] w-auto"
              />
            </ReactCrop>
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={() => setBgImage(null)}>
                Cancel
              </Button>
              <Button onClick={getCroppedImg}>Apply Crop</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
