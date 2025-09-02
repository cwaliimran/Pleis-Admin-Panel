interface LoadingBarProps {
  className?: string
  variant?: "default" | "gradient" | "pulse" | "skeleton" | "dots"
}

export function LoadingBar({ className, variant = "default" }: LoadingBarProps) {
  const variants = {
    default: (
      <div className={`w-full h-[2.5px] bg-muted rounded-full overflow-hidden ${className || ""}`}>
        <div className="h-full bg-primary rounded-full animate-[loading_2s_ease-in-out_infinite]" />
      </div>
    ),
    gradient: (
      <div className={`w-full h-1 bg-muted rounded-full overflow-hidden ${className || ""}`}>
        <div className="h-full bg-gradient-to-r from-primary via-chart-1 to-primary bg-[length:200%_100%] rounded-full animate-[gradient-loading_2s_ease-in-out_infinite]" />
      </div>
    ),
    pulse: (
      <div className={`w-full h-1 bg-muted rounded-full overflow-hidden ${className || ""}`}>
        <div className="h-full bg-primary rounded-full animate-[pulse-loading_1.5s_ease-in-out_infinite]" />
      </div>
    ),
    skeleton: (
      <div className={`space-y-2 ${className || ""}`}>
        <div className="h-1 bg-muted rounded-full animate-[skeleton-1_2s_ease-in-out_infinite]" />
        <div className="h-1 bg-muted rounded-full animate-[skeleton-2_2s_ease-in-out_infinite_0.2s]" />
        <div className="h-1 bg-muted rounded-full animate-[skeleton-3_2s_ease-in-out_infinite_0.4s]" />
      </div>
    ),
    dots: (
      <div className={`flex items-center justify-center space-x-1 ${className || ""}`}>
        <div className="w-2 h-2 bg-primary rounded-full animate-[dot-1_1.4s_ease-in-out_infinite]" />
        <div className="w-2 h-2 bg-primary rounded-full animate-[dot-2_1.4s_ease-in-out_infinite_0.2s]" />
        <div className="w-2 h-2 bg-primary rounded-full animate-[dot-3_1.4s_ease-in-out_infinite_0.4s]" />
      </div>
    ),
  }

  return variants[variant]
}