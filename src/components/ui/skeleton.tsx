import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-full animate-[pulsecolor_4s_linear_infinite] bg-gradient-to-r from-blue-200 via-yellow-200 to-pink-200 bg-150%", className)}
      {...props}
    />
  )
}

export { Skeleton }
