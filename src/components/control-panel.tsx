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
  imageConfig: {
    arithmeticOperation: string;
    orientation: string;
    conversionType: string;
    logicalOp: string;
  };
  onImageConfiguration: (value: string, configuration: ImageVariable) => void;

  onApply: () => void;
}

enum ImageVariable {
  ARITHMETIC_OPERATION,
  CONVERSION_TYPE,
  ORIENTATION,
  LOGICAL_OPS
}

export default function ControlPanel({
  imageConfig,
  onImageConfiguration,
  onApply,
}: ControlPanelProps) {
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
              value={imageConfig.arithmeticOperation}
              onValueChange={(value) => 
                onImageConfiguration(value, ImageVariable.ARITHMETIC_OPERATION)
              }
            >
              <SelectTrigger id="arithmetic-operation">
                <SelectValue placeholder="Select operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="add">Add</SelectItem>
                <SelectItem value="subtract">Subtract</SelectItem>
                <SelectItem value="difference">Difference</SelectItem>
                <SelectItem value="blending">Blending 70%</SelectItem>
                <SelectItem value="linearCombination">
                  Linear Combination
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="conversion-type">Conversion Type</Label>
            <Select
              value={imageConfig.conversionType}
              onValueChange={(value) =>
                onImageConfiguration(value, ImageVariable.CONVERSION_TYPE)
              }
            >
              <SelectTrigger id="conversion-type">
                <SelectValue placeholder="Select conversion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="grayscale">Grayscale</SelectItem>
                <SelectItem value="sepia">Sepia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="conversion-type">Logical Operations</Label>
            <Select
              value={imageConfig.logicalOp}
              onValueChange={(value) =>
                onImageConfiguration(value, ImageVariable.LOGICAL_OPS)
              }
            >
              <SelectTrigger id="logical-operations">
                <SelectValue placeholder="Select Logical Operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="and">And</SelectItem>
                <SelectItem value="not">Not</SelectItem>
                <SelectItem value="or">Or</SelectItem>
                <SelectItem value="xor">Xor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="row-span-2">
            <Label>Orientation</Label>
            <RadioGroup
              value={imageConfig.orientation}
              onValueChange={(value) =>
                onImageConfiguration(value, ImageVariable.ORIENTATION)
              }
              className="flex items-center mt-3"
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
