"use client"

import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig  } from "@/components/ui/chart"

import { Bar , BarChart, CartesianGrid, XAxis} from "recharts"
import { Card, CardContent } from "./card"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]


const chartConfig = {
  desktop: {
    label: "Retail",
    color: "#25a9ebff",
  },
  mobile: {
    label: "Corporate",
    color: "#f80303ff",
  },
} satisfies ChartConfig


const AppBarChart = () => {

return (
<div className="">
    
<Card className="flex flex-col">

    <CardContent className="flex-1 pb-0">

    <h1>Total Revenue</h1>
<ChartContainer config={chartConfig} className="min-h-[200px] w-full">

      <BarChart accessibilityLayer data={chartData}>

        <CartesianGrid vertical={false}/>
           <XAxis
      dataKey="month"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      tickFormatter={(value) => value.slice(0, 3)}
    />

<ChartTooltip content={<ChartTooltipContent />} />
 <ChartLegend content={<ChartLegendContent />} />

        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>

</ChartContainer>
</CardContent>
</Card>

</div>



)



}

export default AppBarChart