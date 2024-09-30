
interface MatrixOperationsCardProps {
  className?: string;
}

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MatrixOperationsCardProps {
  className?: string;
}

export default function MatrixOperationsCard({ className }: MatrixOperationsCardProps) {
  const [operation, setOperation] = useState('add')
  const [value, setValue] = useState('')

  const handleOperationChange = (newOperation: string) => {
    setOperation(newOperation)
  }

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  } 

  return (
    <Card className={`${className} flex flex-col justify-between border-solid border-2`}>
      <CardHeader>
        <CardTitle>Matrix Operations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="operation">Operation</Label>
          <Select onValueChange={handleOperationChange} defaultValue={operation}>
            <SelectTrigger id="operation">
              <SelectValue placeholder="Select operation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="add">Add</SelectItem>
              <SelectItem value="subtract">Subtract</SelectItem>
              <SelectItem value="multiply">Multiply</SelectItem>
              <SelectItem value="divide">Divide</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            type="number"
            placeholder="Enter a number"
            value={value}
            onChange={handleValueChange}
          />
        </div>
      </CardContent>
    </Card>
  )
}