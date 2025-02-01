import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";

const options: ApexOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#3C50E0", "#6577F3", "#8FD0EF"],
  labels: ["Products", "Blogs", "Users"],
  legend: {
    show: false,
    position: "bottom",
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val.toFixed()}%`,
    },
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartThree: React.FC<{
  products: number;
  blogs: number;
  users: number;
}> = ({ products, blogs, users }) => {
  const total = products + blogs + users;
  const series = [
    Number((products / total) * 100),
    Number((blogs / total) * 100),
    Number((users / total) * 100),
  ];

  const legendData = [
    {
      label: "Products",
      value: products,
      percentage: ((products / total) * 100).toFixed(2),
      color: "#3C50E0",
    },
    {
      label: "Blogs",
      value: blogs,
      percentage: ((blogs / total) * 100).toFixed(2),
      color: "#6577F3",
    },
    {
      label: "Users",
      value: users,
      percentage: ((users / total) * 100).toFixed(2),
      color: "#8FD0EF",
    },
  ];

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h5 className="mb-2 text-xl font-semibold text-black dark:text-white">
        Site Statistics
      </h5>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Breakdown of the site statistics
      </p>
      <div>
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {legendData.map((item, index) => (
          <div key={index} className="w-full px-8 sm:w-1/2">
            <div className="flex w-full items-center">
              <span
                className="mr-2 block h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              ></span>
              <p className="text-sm font-medium text-black dark:text-white">
                {item.value} {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartThree;
