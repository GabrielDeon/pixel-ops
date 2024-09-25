import { Separator } from "@/components/ui/separator"

export default function Footer() {
  return (
    <footer className="w-full pb-6 bg-background">
      <Separator className="mb-6" />
      <div className="container mx-auto flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Created by Gabriel B. Deon
        </p>
      </div>
    </footer>
  )
}