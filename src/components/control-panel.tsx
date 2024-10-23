import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

interface ControlPanelProps {
  onImageConfiguration: (
    arithmeticOperation: string,
    orientation: string
  ) => void;

  onApply: () => void;

  orientation: string;
  arithmeticOperation: string;
}

export default function ControlPanel({
  onImageConfiguration,
  arithmeticOperation,
  orientation,
  onApply
}: ControlPanelProps) {
  const handleArithmeticOperationChange = (value: string) => {
    // Convert the select value to match the prop value
    const operation = value === "add" ? "Add" : "Subtract";
    onImageConfiguration(operation, orientation);
  };

  const handleOrientationChange = (value: string) => {
    onImageConfiguration(arithmeticOperation, value);
  };

  return (
    <Card className="flex-1 flex flex-col h-[413px]">
      {" "}
      {/* Match ImageUploader height */}
      <div className="p-3 border-b">
        <h3 className="pt-[2px] pb-[3px] font-semibold">Control Panel</h3>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="arithmetic-operation">Arithmetic Operation</Label>
            <Select
              value={arithmeticOperation.toLowerCase()}
              onValueChange={handleArithmeticOperationChange}
            >
              <SelectTrigger id="arithmetic-operation">
                <SelectValue placeholder="Select operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add</SelectItem>
                <SelectItem value="subtract">Subtract</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="conversion-type">Conversion Type</Label>
            <Select>
              <SelectTrigger id="conversion-type">
                <SelectValue placeholder="Select conversion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grayscale">Grayscale</SelectItem>
                <SelectItem value="sepia">Sepia</SelectItem>
                <SelectItem value="invert">Invert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label>Orientation</Label>
            <RadioGroup
              value={orientation.toLowerCase()}
              onValueChange={handleOrientationChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal">Normal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="flip-horizontal" id="flip-horizontal" />
                <Label htmlFor="flip-horizontal">Flip Horizontal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="flip-vertical" id="flip-vertical" />
                <Label htmlFor="flip-vertical">Flip Vertical</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Additional space for other fields */}
        <div className="flex-grow bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">
          Space for additional fields
        </div>

        {/* Apply button */}
        <div className="mt-4 flex justify-end">
          <Button onClick={onApply}>Apply</Button>
        </div>
      </div>
    </Card>
  );
}
