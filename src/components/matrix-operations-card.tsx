import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Operation } from "@/imageUtils/transformations";

interface MatrixOperationsCardProps {
  operation: Operation | null;  
  setOperation: (operation: Operation | null) => void;  
}

export default function MatrixOperationsCard({
  operation,
  setOperation,
}: MatrixOperationsCardProps) {
  const handleTypeChange = (value: string) => {
    const newType = value as "Add" | "Subtract" | "Multiply" | "Divide";    
    if(operation){
      setOperation({ ...operation, type: newType });
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (operation) {
      setOperation({ ...operation, value: newValue });
    } else {
      setOperation({ type: "Add", value: newValue });
    }
  };

  return (
    <Card
      className={`w-1/2 h-64 flex flex-col justify-between border-solid border-2`}
    >
      <CardHeader>
        <CardTitle>Matrix Operations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="operation">Operation</Label>
          <Select
            onValueChange={handleTypeChange}
            defaultValue={operation?.type || "Add"}
          >
            <SelectTrigger id="operation">
              <SelectValue placeholder="Select operation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Add">Add</SelectItem>
              <SelectItem value="Subtract">Subtract</SelectItem>
              <SelectItem value="Multiply">Multiply</SelectItem>
              <SelectItem value="Divide">Divide</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="value">Value</Label>
          <Input id="value" type="number" placeholder="Enter a number" value={operation?.value} onChange={handleValueChange} />
        </div>
      </CardContent>
    </Card>
  );
}
