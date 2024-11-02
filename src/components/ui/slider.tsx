import * as React from "react";
import { cn } from "../../lib/utils";

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      defaultValue,
      value,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const [localValue, setLocalValue] = React.useState(value || [min]);
    const sliderRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (value !== undefined) {
        setLocalValue(value);
      }
    }, [value]);

    const handleSliderClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;

      const slider = sliderRef.current;
      if (!slider) return;

      const rect = slider.getBoundingClientRect();
      const percent = (event.clientX - rect.left) / rect.width;
      const newValue = min + percent * (max - min);
      const snappedValue = Math.round(newValue / step) * step;
      const clampedValue = Math.min(Math.max(snappedValue, min), max);

      setLocalValue([clampedValue]);
      onValueChange([clampedValue]);
    };

    const percentages = localValue.map(
      (val) => ((val - min) / (max - min)) * 100
    );

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <div
          ref={sliderRef}
          className={cn(
            "relative h-2 w-full rounded-full bg-gray-100",
            !disabled && "cursor-pointer"
          )}
          onClick={handleSliderClick}
        >
          <div
            className="absolute h-full rounded-full bg-primary"
            style={{ width: `${percentages[0]}%` }}
          />
          {!disabled && (
            <div
              className="absolute h-4 w-4 rounded-full bg-primary transform -translate-x-1/2 -translate-y-1/2 cursor-grab"
              style={{
                left: `${percentages[0]}%`,
                top: "50%",
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                const startX = e.clientX;
                const startValue = localValue[0];
                const slider = sliderRef.current;
                if (!slider) return;
                const rect = slider.getBoundingClientRect();

                const handleMouseMove = (e: MouseEvent) => {
                  const deltaX = e.clientX - startX;
                  const deltaPercent = deltaX / rect.width;
                  const deltaValue = deltaPercent * (max - min);
                  const newValue = startValue + deltaValue;
                  const snappedValue = Math.round(newValue / step) * step;
                  const clampedValue = Math.min(
                    Math.max(snappedValue, min),
                    max
                  );

                  setLocalValue([clampedValue]);
                  onValueChange([clampedValue]);
                };

                const handleMouseUp = () => {
                  document.removeEventListener("mousemove", handleMouseMove);
                  document.removeEventListener("mouseup", handleMouseUp);
                };

                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
              }}
            />
          )}
        </div>
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
export type { SliderProps };
