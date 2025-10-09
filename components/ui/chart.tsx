import type React from "react"
export const Chart = () => {
  return null
}

export const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export const ChartTooltip = ({ content, children }: { content: React.ReactNode; children: React.ReactNode }) => {
  return <>{children}</>
}

export const ChartTooltipContent = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export const ChartTooltipItem = ({ label, value }: { label: string; value: (value: any) => string }) => {
  return (
    <div>
      {label}: {value("value")}
    </div>
  )
}
