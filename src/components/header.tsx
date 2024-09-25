import { Image } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function Header() {
  return (
    <header className="w-full py-4 px-6 bg-background border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Pixel Ops</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Button variant="ghost">Home</Button>
            </li>
            <li>
              <Button variant="ghost">About</Button>
            </li>
            <li>
              <Button variant="ghost">Contact</Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}