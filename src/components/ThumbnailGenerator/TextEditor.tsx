import { Input } from "../../components/ui/input";
import { Toggle } from "../../components/ui/toggle";
import { Bold, Italic } from "lucide-react";
import { TextEditorProps } from "../../types";

export function TextEditor({
  text,
  setText,
  isBold,
  setIsBold,
  isItalic,
  setIsItalic,
  textColor,
  setTextColor,
}: TextEditorProps) {
  return (
    <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text"
        className="flex-grow"
      />
      <Toggle
        pressed={isBold}
        onPressedChange={setIsBold}
        aria-label="Toggle bold"
      >
        <Bold className="w-4 h-4" />
      </Toggle>
      <Toggle
        pressed={isItalic}
        onPressedChange={setIsItalic}
        aria-label="Toggle italic"
      >
        <Italic className="w-4 h-4" />
      </Toggle>
      <Input
        type="color"
        value={textColor}
        onChange={(e) => setTextColor(e.target.value)}
        className="w-10 h-10 p-1 rounded"
        aria-label="Text color"
      />
    </div>
  );
}
