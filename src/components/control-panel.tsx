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
import { Switch } from "@/components/ui/switch";

interface ControlPanelProps {
  imageConfig: {
    arithmeticOperation: string;
    logicalOperation: string;
    morphologicOperation: string;
    orientation: string;
    lowPassFilter: string;
    highPassFilter: string;
    toBinary: boolean;
    toGrayScale: boolean;
    histogramEqualization: boolean;
  };
  onImageConfiguration: (
    value: string | boolean,
    configuration: ImageVariable
  ) => void;

  onApply: () => void;
}

enum ImageVariable {
  ARITHMETIC_OPERATION,
  LOGIC_OPERATION,
  MORPHOLOGIC_OPERATION,
  ORIENTATION,
  LOWPASS_FILTER,
  HIGHPASS_FILTER,
  TO_BINARY,
  TO_GRAYSCALE,
  HISTOGRAM_EQUALIZATION,
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
            <Label htmlFor="arithmetic-operation">Arithmetic Operations</Label>
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
            <Label htmlFor="conversion-type">Logical Operations</Label>
            <Select
              value={imageConfig.logicalOperation}
              onValueChange={(value) =>
                onImageConfiguration(value, ImageVariable.LOGIC_OPERATION)
              }
            >
              <SelectTrigger id="logical-operations">
                <SelectValue placeholder="Select operation" />
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
          <div>
            <Label htmlFor="conversion-type">Morphologic Operations</Label>
            <Select
              value={imageConfig.morphologicOperation}
              onValueChange={(value) =>
                onImageConfiguration(value, ImageVariable.MORPHOLOGIC_OPERATION)
              }
            >
              <SelectTrigger id="morphologic-operation">
                <SelectValue placeholder="Select operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="dilation">Dilation</SelectItem>
                <SelectItem value="erosion">Erosion</SelectItem>
                <SelectItem value="opening">Opening</SelectItem>
                <SelectItem value="closing">Closing</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
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




          <div>
            <Label htmlFor="conversion-type">Low-Pass Filter</Label>
            <Select
              value={imageConfig.lowPassFilter}
              onValueChange={(value) =>
                onImageConfiguration(value, ImageVariable.LOWPASS_FILTER)
              }
            >
              <SelectTrigger id="lowpass-filter">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="min">Min</SelectItem>
                <SelectItem value="max">Max</SelectItem>
                <SelectItem value="mean">Mean</SelectItem>
                <SelectItem value="median">Median</SelectItem>
                <SelectItem value="order">Order Static</SelectItem>
                <SelectItem value="conservative-smoothing">Conservative Smoothing</SelectItem>
                <SelectItem value="gaussian">Gaussian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="conversion-type">High-Pass Filter</Label>
            <Select
              value={imageConfig.highPassFilter}
              onValueChange={(value) =>
                onImageConfiguration(value, ImageVariable.HIGHPASS_FILTER)
              }
            >
              <SelectTrigger id="logical-operations">
                <SelectValue placeholder="Select Logical Operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="prewitt">Prewitt (1st)</SelectItem>
                <SelectItem value="sobel">Sobel (1st)</SelectItem>
                <SelectItem value="laplacian">Laplacian (2nd)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 mt-2 gap-1">
            <div className="flex items-center space-x-2 mt-2 ">
              <Switch
                id="to-binary"
                checked={imageConfig.toBinary}
                onCheckedChange={(checked) => {
                  onImageConfiguration(checked, ImageVariable.TO_BINARY);
                }}
              />
              <Label htmlFor="to-binary">To Binary</Label>
            </div>
            <div className="flex items-center space-x-2 mt-2 ">
              <Switch
                id="grayscale"
                checked={imageConfig.toGrayScale}
                onCheckedChange={(checked) =>
                  onImageConfiguration(checked, ImageVariable.TO_GRAYSCALE)
                }
              />
              <Label htmlFor="histogram-equalization">
                Grayscale
              </Label>
            </div>
            <div className="flex items-center space-x-2 mt-2 ">
              <Switch
                id="histogram-equalization"
                checked={imageConfig.histogramEqualization}
                onCheckedChange={(checked) =>
                  onImageConfiguration(checked, ImageVariable.HISTOGRAM_EQUALIZATION)
                }
              />
              <Label htmlFor="histogram-equalization">
                Histogram Equalization
              </Label>
            </div>
            <div className=" flex self-end">
              <Button onClick={onApply}>Apply</Button>
            </div>
            {/* <button onClick={() => {
              console.log('Current imageConfig state:');
              console.log(`Arithmetic Operation: ${imageConfig.arithmeticOperation}`);
              console.log(`Logical Operation: ${imageConfig.logicalOperation}`);
              console.log(`Morphologic Operation: ${imageConfig.morphologicOperation}`);
              console.log(`Orientation: ${imageConfig.orientation}`);
              console.log(`Low Pass Filter: ${imageConfig.lowPassFilter}`);
              console.log(`High Pass Filter: ${imageConfig.highPassFilter}`);
              console.log(`To Binary: ${imageConfig.toBinary}`);
              console.log(`To Grayscale: ${imageConfig.toGrayScale}`);
              console.log(`Histogram Equalization: ${imageConfig.histogramEqualization}`);
            }}>INFO</button> */}
          </div>
        </div>
      </div>
    </Card>
  );
}
