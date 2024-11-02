// src/types/index.ts

export type BackgroundType = "gradient" | "solid" | "image";

export interface TextPosition {
  x: number;
  y: number;
}

export interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
  isBold: boolean;
  setIsBold: (bold: boolean) => void;
  isItalic: boolean;
  setIsItalic: (italic: boolean) => void;
  textColor: string;
  setTextColor: (color: string) => void;
}

export interface BackgroundControlsProps {
  bgType: BackgroundType;
  setBgType: (type: BackgroundType) => void;
  bgColor1: string;
  setBgColor1: (color: string) => void;
  bgColor2: string;
  setBgColor2: (color: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
