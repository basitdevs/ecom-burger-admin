"use client";

import React from 'react'
import { RefreshCw } from 'lucide-react'
import { FaUsers } from "react-icons/fa";
import { HiMiniUserPlus } from "react-icons/hi2";
import { FaUserGroup } from "react-icons/fa6";
import { MdOutlineArrowDropUp } from "react-icons/md";
import { BsGenderFemale, BsGenderMale, BsGenderAmbiguous } from "react-icons/bs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PIE_DATA = [
  { name: 'New Customers', value: 63, color: '#273142' },
  { name: 'Frequent Customers', value: 18, color: '#3b82f6' },
  { name: 'Idle Users', value: 14, color: '#f87171' },
  { name: 'Cart Abandoners', value: 5, color: '#fbbf24' },
];

const AGE_DATA = [
  { label: 'Age 18-25', value: 6680, percent: '30%' },
  { label: 'Age 25-45', value: 15234, percent: '65%' },
  { label: 'Age 45-65', value: 2034, percent: '20%' },
  { label: 'Age over 65', value: 792, percent: '10%' },
];

const CustomersPage = () => {
  return (
    <div className='w-full min-h-screen bg-[#020617] flex-col justify-center items-center p-6 font-sans'>

      <div className="w-full bg-[#031123] p-6 rounded-sm flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-[0px_0px_25px_2px_#002351ad] shadow-[0px_0px_19px_2px_#002351ad] shadow-[#002351ad] transition-all duration-300 border border-slate-800/50">
        <h1 className="text-[#D8E9FF] text-3xl font-bold tracking-tight">
          Customers
        </h1>
        <div className="flex items-center gap-8">
          <Button variant="ghost" className="flex items-center gap-2 text-sm font-bold text-[#D8E9FF] hover:bg-transparent hover:text-white hover:opacity-80 transition p-0 h-auto">
            Data Refresh
            <RefreshCw color='#4F89FC' size={20} />
          </Button>
          <div className="bg-[#00193B] border border-[#354585] rounded-sm px-8 py-3 text-[#D8E9FF] text-sm font-bold tracking-wide shadow-[0_0_15px_rgba(29,78,216,0.1)] min-w-[260px] text-center">
            December 14, 2025 18:10 PM
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 w-full">

        <Card className="lg:col-span-2 bg-[#031123] rounded-sm border-slate-800/50 hover:shadow-[0px_0px_25px_2px_#002351ad] shadow-[0px_0px_19px_2px_#002351ad] shadow-[#002351ad] transition-all duration-300">
          <CardContent className="flex flex-col items-center justify-center py-2 px-6 text-center h-full">
            <div className="w-12 h-12 rounded-lg bg-[#00BA9D] flex items-center justify-center mb-4">
              <FaUsers color='#031123' size={20} />
            </div>
            <h2 className="text-[#D8E9FF] text-4xl font-bold mb-1">32,987</h2>
            <p className="text-[#D8E9FF] text-lg font-bold mt-1">All Customers</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-[#031123] rounded-sm border-slate-800/50 hover:shadow-[0px_0px_25px_2px_#002351ad] shadow-[0px_0px_19px_2px_#002351ad] shadow-[#002351ad] transition-all duration-300">
          <CardContent className="flex flex-col items-center justify-center py-2 px-6 text-center h-full">
            <div className="w-12 h-12 rounded-lg bg-[#3b82f6] flex items-center justify-center mb-4">
              <HiMiniUserPlus color='#031123' size={20} />
            </div>
            <h2 className="text-[#D8E9FF] text-4xl font-bold mb-1">17,153</h2>
            <p className="text-[#D8E9FF] text-lg font-bold mt-1">New Customers</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-[#031123] rounded-sm border-slate-800/50 hover:shadow-[0px_0px_25px_2px_#002351ad] shadow-[0px_0px_19px_2px_#002351ad] shadow-[#002351ad] transition-all duration-300">
          <CardContent className="flex flex-col items-center justify-center py-2 px-6 text-center h-full">
            <div className="w-12 h-12 rounded-lg bg-[#ef4444] flex items-center justify-center mb-4">
              <FaUserGroup color='#031123' size={20} />
            </div>
            <h2 className="text-[#D8E9FF] text-4xl font-bold mb-1">7,587</h2>
            <p className="text-[#D8E9FF] text-lg font-bold mt-1">Regular Customers</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-6 py-4 px-2 bg-[#031123] rounded-sm border-slate-800/50 hover:shadow-[0px_0px_25px_2px_#002351ad] shadow-[0px_0px_19px_2px_#002351ad] shadow-[#002351ad] transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#D8E9FF] text-xl font-bold">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex flex-col xl:flex-row gap-8">
              <div className="flex-1 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-0 hover:bg-transparent">
                      <TableHead className="pb-1 pl-0 font-medium text-[#698D99] text-[11px] uppercase tracking-wider">Year</TableHead>
                      <TableHead className="pb-1 font-medium text-[#698D99] text-[11px] uppercase tracking-wider">Customers</TableHead>
                      <TableHead className="pb-1 font-medium text-[#698D99] text-[11px] uppercase tracking-wider">Trend</TableHead>
                      <TableHead className="pb-1 font-medium text-[#698D99] text-[11px] uppercase tracking-wider">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-b border-gray-800 hover:bg-transparent">
                      <TableCell className="py-2 pl-0 font-bold text-[16px] text-[#D8E9FF]">2022</TableCell>
                      <TableCell className="py-2 font-bold text-[16px] text-gray-200">3,234</TableCell>
                      <TableCell className="py-2 font-bold text-[16px] text-gray-200">$10%</TableCell>
                      <TableCell className="py-2 font-bold text-[16px] text-[#D8E9FF]">$124k</TableCell>
                    </TableRow>
                    <TableRow className="border-b-0 hover:bg-transparent">
                      <TableCell className="py-2 pl-0 font-bold text-[16px] text-[#D8E9FF]">2023</TableCell>
                      <TableCell className="py-2 font-bold text-[16px] text-gray-200">12,345</TableCell>
                      <TableCell className="py-2 font-bold text-[16px] text-gray-200">$35%</TableCell>
                      <TableCell className="py-2 font-bold text-[16px] text-[#D8E9FF]">$32k</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="flex gap-8 min-w-fit pt-2">
                <div>
                  <div className="text-3xl font-bold mb-1 text-[#D8E9FF]">32,547</div>
                  <div className="text-[#D8E9FF] text-sm font-medium mb-1">Regular Customers</div>
                  <div className="flex items-center text-[#00d084] text-sm font-bold">
                    <MdOutlineArrowDropUp size={20} /> +14.08%
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1 text-[#D8E9FF]">+12,345</div>
                  <div className="text-[#D8E9FF] text-sm font-medium mb-1">New Customers</div>
                  <div className="flex items-center text-[#00d084] text-sm font-bold">
                    <MdOutlineArrowDropUp size={20} /> +23%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 w-full">
        <Card className="lg:col-span-7 bg-[#031123] rounded-sm border-slate-800/50 hover:shadow-[0px_0px_25px_2px_#002351ad] shadow-[0px_0px_19px_2px_#002351ad] shadow-[#002351ad] transition-all duration-300">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-[#D8E9FF] text-xl font-bold">Customer Retention Rate</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <div className="flex flex-col md:flex-row items-center gap-10">

              <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PIE_DATA}
                      cx="50%"
                      cy="50%"
                      outerRadius="90%"
                      dataKey="value"
                      startAngle={0}
                      endAngle={360}
                      stroke="none"
                    >
                      {PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#031123', borderColor: '#354585', borderRadius: '4px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1">
                <h4 className="text-[#D8E9FF] text-lg font-bold mb-3">Total Customers - 42,986 in 2023</h4>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                  Donec placerat, ipsum et bibendum blandit, ligula lectus ullamcorper lorem, in viverra nisl elit viverra massa. Nullam sodales rutrum arcu. Maecenas sed lorem ut dolor tincidunt mattis. Vestibulum vitae aliquet felis, at iaculis metus
                </p>

                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: '#273142' }}></div>
                    <span className="text-gray-300 text-sm font-medium">
                      New Customers - <span className="text-white font-bold">63%</span>, which is 27,153 visitors
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: '#3b82f6' }}></div>
                    <span className="text-gray-300 text-sm font-medium">
                      Frequent Customers - <span className="text-white font-bold">18%</span>, which is 7,587 visitors
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: '#f43f5e' }}></div>
                    <span className="text-gray-300 text-sm font-medium">
                      Idle Users - <span className="text-white font-bold">14%</span>, which is 5,937 visitors
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: '#fbbf24' }}></div>
                    <span className="text-gray-300 text-sm font-medium">
                      Cart Abandoners - <span className="text-white font-bold">5%</span>, which is 2,309 visitors
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-5 flex flex-col h-full">
          <Card className="bg-[#031123] h-full rounded-sm border-slate-800/50 hover:shadow-[0px_0px_25px_2px_#002351ad] shadow-[0px_0px_19px_2px_#002351ad] shadow-[#002351ad] transition-all duration-300">
            <CardContent className="px-6">

              <div className="mb-10">
                <h3 className="text-[#D8E9FF] text-xl font-bold mb-6">Demographic segmentation by Age</h3>
                <div className="space-y-6">
                  {AGE_DATA.map((item, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-white font-bold text-sm">
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                      <div className="h-3 w-full bg-[#18263a] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#D8E9FF] to-white rounded-full shadow-[0_0_8px_rgba(216,233,255,0.4)]"
                          style={{ width: item.percent }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[#D8E9FF] text-xl font-bold mb-6">Segmentation by Gender</h3>

                <div className="flex gap-12 mb-4">
                  <div className="flex flex-col items-start gap-3">
                    <div className="w-12 h-12 bg-[#3b82f6] rounded-md flex items-center justify-center text-[#031123] shadow-md">
                      <BsGenderFemale size={24} strokeWidth={0.5} />
                    </div>
                    <span className="text-white text-xl font-bold">65%</span>
                  </div>

                  <div className="flex flex-col items-start gap-3">
                    <div className="w-12 h-12 bg-[#3b82f6] rounded-md flex items-center justify-center text-[#031123] shadow-md">
                      <BsGenderMale size={24} strokeWidth={0.5} />
                    </div>
                    <span className="text-white text-xl font-bold">32%</span>
                  </div>

                  <div className="flex flex-col items-start gap-3">
                    <div className="w-12 h-12 bg-[#3b82f6] rounded-md flex items-center justify-center text-[#031123] shadow-md">
                      <BsGenderAmbiguous size={24} strokeWidth={0.5} />
                    </div>
                    <span className="text-white text-xl font-bold">3%</span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                  Nullam sodales rutrum arcu. Maecenas sed lorem ut dolor tincidunt mattis
                </p>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CustomersPage;