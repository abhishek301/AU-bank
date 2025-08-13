import { useEffect, useState, useMemo } from 'react'
import { MetricCard } from "./MetricCard";
import salesIcon from "./assets/sales-icon.svg";
import quantityIcon from "./assets/quantity-icon.svg";
import discountIcon from "./assets/discount-icon.svg";
import profitIcon from "./assets/profit-icon.svg";
import Layout from "./Layout";
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DataTable from './DataTable';
import HorizontalStackedBarChart from './HorizontalStackedBarChart';
import DonutChart from './DonutChart';
import { useStates, useDateRange, useStats } from './hooks/useSalesApi';

export default function DashboardPage() {
  const [openFrom, setOpenFrom] = useState(false)
  const [openTo, setOpenTo] = useState(false)
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)
  const [ selectedState, setSelectedState ] = useState<string | undefined>('')
  const { states, loading: statesLoading } = useStates()
  const { dateRange, loading: dateLoading } = useDateRange(selectedState || '')
  
  const statsFilters = useMemo(() => ({
    state: selectedState,
    startDate: fromDate?.toISOString().split('T')[0],
    endDate: toDate?.toISOString().split('T')[0]
  }), [selectedState, fromDate, toDate]);
  

const { stats, loading: statsLoading } = useStats(statsFilters); 

  useEffect(() => {
    if (dateRange) {
      setFromDate(new Date(dateRange.minDate));
      setToDate(new Date(dateRange.maxDate));
    }
  }, [dateRange])

    useEffect(() => {
    if (!statesLoading && states.length > 0) {
      setSelectedState(states[0]);
    }
  }, [statesLoading])

  
  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-[32px]">
        <h1 className="font-inter font-bold text-2xl leading-none tracking-normal">
          Sales Overview
        </h1>

        <div className='flex flex-wrap gap-4'>
          {/* State Selector */}
          {!statesLoading ? (<div>
            <Label className='mb-[5px] block'>Select a state</Label>
            <Select value={selectedState} 
                onValueChange={(selectedValue: string) => {
                setSelectedState(selectedValue);
              }}>
              <SelectTrigger className="w-[140px] border-0 rounded-none dark:bg-card bg-white">
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {states.map(state => <SelectItem value={state}>{state}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>): (
            <div>
              <Skeleton className="h-[14px] w-[140px] dark:bg-card bg-white mb-[5px]" />
              <Skeleton className="h-[36px] w-[140px] dark:bg-card bg-white" />
            </div>
            )}

          {/* From Date Picker */}
          {!dateLoading ? (<div>
            <Label className='mb-[5px] block'>Select From date</Label>
            <Popover open={openFrom} onOpenChange={setOpenFrom}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="from-date"
                  className="w-[140px] border-0 rounded-none dark:bg-card bg-white justify-between font-normal"
                >
                  {fromDate ? fromDate.toLocaleDateString() : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0 dark:bg-card" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  captionLayout="dropdown"
                    {...(dateRange ? { disabled: { before: new Date(dateRange.minDate), after: new Date(dateRange.maxDate) } } : {})}
                  onSelect={(date) => {
                    setFromDate(date)
                    setOpenFrom(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>) :  (
            <div>
              <Skeleton className="h-[14px] w-[140px] dark:bg-card bg-white mb-[5px]" />
              <Skeleton className="h-[36px] w-[140px] dark:bg-card bg-white" />
            </div>
            )}

          {/* To Date Picker */}
          {!dateLoading ? (<div>
            <Label className='mb-[5px] block'>Select To date</Label>
            <Popover open={openTo} onOpenChange={setOpenTo}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="to-date"
                  className="w-[140px] border-0 rounded-none dark:bg-card bg-white justify-between font-normal"
                >
                  {toDate ? toDate.toLocaleDateString() : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0 dark:bg-card" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  captionLayout="dropdown"
                  {...(dateRange ? { disabled: { 
                    before: new Date(dateRange.minDate),
                    after: new Date(dateRange.maxDate)
                  } } : {})}
                  onSelect={(date) => {
                    setToDate(date)
                    setOpenTo(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>):  (
            <div>
              <Skeleton className="h-[14px] w-[140px] dark:bg-card bg-white mb-[5px]" />
              <Skeleton className="h-[36px] w-[140px] dark:bg-card bg-white" />
            </div>
            )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {!statsLoading ? (
          <>
            <MetricCard title="Total Sales" value={`$${stats?.totalSales}`} icon={<img src={salesIcon} />} />
            <MetricCard title="Quantity Sold" value={`${stats?.quantitySold}`} icon={<img src={quantityIcon} />} />
            <MetricCard title="Discount %" value={`${stats?.discountPercentage}%`} icon={<img src={discountIcon} />} />
            <MetricCard title="Profit" value={`$${stats?.totalProfit}`} icon={<img src={profitIcon} />} />
          </>):(
          <>
            <Skeleton className="h-[112px] w-[542px] dark:bg-card bg-white mb-[5px]" />
            <Skeleton className="h-[112px] w-[542px] dark:bg-card bg-white mb-[5px]" />
            <Skeleton className="h-[112px] w-[542px] dark:bg-card bg-white mb-[5px]" />
            <Skeleton className="h-[112px] w-[542px] dark:bg-card bg-white mb-[5px]" />
          </>
        )
      }
      </div>

      {/* Sales Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <HorizontalStackedBarChart   
          title="Sales by City"
          data={[
            { label: "Auburn", value: 35, total: 100 },
            { label: "Decatur", value: 50, total: 100 },
            { label: "Florence", value: 30, total: 100 },
            { label: "Hoover", value: 55, total: 100 },
            { label: "Huntsville", value: 70, total: 100 },
            { label: "Mobile", value: 45, total: 100 },
            { label: "Montgomery", value: 60, total: 100 },
            { label: "Tuscaloosa", value: 30, total: 100 },
          ]}
          />
        <DataTable
          title="Sales by Products"
          headers={["Product Name", "Sales in $"]}
          data={[
            { product: '1.7 Cubic Foot Compact "Cube" Office Refrigerators', sales: "$200" },
            { product: '14-7/8 x 11 Blue Bar Computer Printout Paper', sales: "$400" },
            { product: 'Acme Stainless Steel Office Snips', sales: "$300" },
            { product: 'Acrylic Self-Standing Desk Frames', sales: "$500" },
            { product: 'Ampad Phone Message Book, Recycled, 400 Message Capacity, 5 ¾" x 11"', sales: "$345" },
            { product: 'Anker Astro Mini 3000mAh Ultra-Compact Portable Charger', sales: "$245" },
            { product: 'Anker Ultrathin Bluetooth Wireless Keyboard Aluminum Cover with Stand', sales: "$234" },
            { product: 'Assorted Color Push Pins', sales: "$2322" },
            { product: 'AT&T 17929 Landline Telephone', sales: "$236" },
            { product: 'Avaya IP Phone 1140E VoIP phone', sales: "$6755" },
          ]}
           cellColors={{
            product: "#D6EFF3",
            sales: "#8BD0E0",
          }}
        />
      </div>      

      {/* Additional Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <DonutChart 
          title="Sales by Category"
          data={[
            { value: 200, name: "Technology", color: "oklch(80% 0.14 90)" },
            { value: 500, name: "Furniture", color: "oklch(60% 0.12 250)" },
            { value: 300, name: "Office Supplies", color: "oklch(70% 0.14 40)" },
          ]}
        />
                <DataTable
          title="Sales By Sub Category"
          headers={["Sub Category", "Sales in $"]}
          data={[
            { subCategory: "Accessories", sales: '$200' },
            { subCategory: "Appliances", sales: '$400' },
            { subCategory: "Art", sales: '$300' },
            { subCategory: "Binders", sales: '$500' },
            { subCategory: "Bookcases", sales: '$345' },
            { subCategory: "Chairs", sales: '$245' },
            { subCategory: "Copiers", sales: '$234' },
            { subCategory: "Envelopes", sales: '$2322' },
            { subCategory: "Fasteners", sales: '$236' },
            { subCategory: "Furnishings", sales: '$6755' }
          ]}
           cellColors={{
            subCategory: "#D6EFF3",
            sales: "#8BD0E0",
          }}
        />
        <DonutChart 
          title="Sales By Segment"
          data={[
            { value: 25, name: 'Home Office', color: '#F4B35D' },
            { value: 60, name: 'Consumer', color: '#2E83B8'  },
            { value: 15, name: 'Corporate', color: '#CC7262'  },
          ]}
        />
      </div>
    </Layout>
  );
}
