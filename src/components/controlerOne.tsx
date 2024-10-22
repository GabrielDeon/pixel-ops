import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ControlerOne() {
  const [selectedOperation, setSelectedOperation] = useState("default");
  return (
    <header className="flex flex-col justify-between w-full py-4 px-6 bg-background border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold">Controll</h2>
      <div className="flex flex-1 mt-6">
        <div className=" w-64 max-w-72 space-y-3">
          <h2 className="text-sm font-bold text-left text-gray-900 dark:text-gray-100">
            Operations between Images
          </h2>
          <RadioGroup
            value={selectedOperation}
            onValueChange={setSelectedOperation}
            className="grid gap-2"
          >
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow">
              <RadioGroupItem value="default" id="default" />
              <Label htmlFor="default" className="font-medium text-xs">
                Default
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow">
              <RadioGroupItem value="sum" id="sum" />
              <Label htmlFor="sum" className="font-medium text-xs">
                Sum
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow">
              <RadioGroupItem value="subtraction" id="subtraction" />
              <Label htmlFor="subtraction" className="font-medium text-xs">
                Subtraction
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      <div className="flex justify-end">
        <Button className="px-10">Apply</Button>
      </div>
    </header>
  );
}
