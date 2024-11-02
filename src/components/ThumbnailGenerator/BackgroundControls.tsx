import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Palette, Image as ImageIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { BackgroundControlsProps } from "../../types";
import { useState } from "react";

export function BackgroundControls({
  bgType,
  setBgType,
  bgColor1,
  setBgColor1,
  bgColor2,
  setBgColor2,
  handleImageUpload,
}: BackgroundControlsProps) {
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
    handleImageUpload(e);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Background
      </label>
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Button
            variant={bgType === "gradient" ? "default" : "outline"}
            onClick={() => setBgType("gradient")}
            className="flex-1"
          >
            <Palette className="w-4 h-4 mr-2" />
            Gradient
          </Button>
          <Button
            variant={bgType === "solid" ? "default" : "outline"}
            onClick={() => setBgType("solid")}
            className="flex-1"
          >
            <Palette className="w-4 h-4 mr-2" />
            Solid
          </Button>
          <Button
            variant={bgType === "image" ? "default" : "outline"}
            onClick={() => setBgType("image")}
            className="flex-1"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Image
          </Button>
        </div>

        {bgType === "gradient" && (
          <div className="flex space-x-2">
            <Input
              type="color"
              value={bgColor1}
              onChange={(e) => setBgColor1(e.target.value)}
            />
            <Input
              type="color"
              value={bgColor2}
              onChange={(e) => setBgColor2(e.target.value)}
            />
          </div>
        )}

        {bgType === "solid" && (
          <Input
            type="color"
            value={bgColor1}
            onChange={(e) => setBgColor1(e.target.value)}
          />
        )}

        {bgType === "image" && (
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className={cn(
                "flex items-center justify-center w-full px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer",
                "hover:border-gray-400 hover:bg-gray-50 transition-colors duration-150",
                "text-sm text-gray-600"
              )}
            >
              <div className="flex flex-col items-center space-y-2 py-4">
                <ImageIcon className="w-8 h-8 text-gray-400" />
                {selectedFileName ? (
                  <>
                    <span className="font-medium">Selected file:</span>
                    <span className="text-xs text-gray-500">
                      {selectedFileName}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-medium">Click to upload image</span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG up to 10MB
                    </span>
                  </>
                )}
              </div>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
