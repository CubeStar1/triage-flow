import { GradientText } from "@/components/global/gradient-text"
import { Separator } from "@/components/ui/separator"

export function PageHeader({ title }: { title: string }) {
  return (
    <div className="">
      <GradientText>{title}</GradientText>
      <div className="pt-2">
        <Separator className="w-full" />
      </div>
    </div>
  )
}
