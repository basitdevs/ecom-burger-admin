import AppAreaChart from "@/components/ui/AppAreaChart";
import AppBarChart from "@/components/ui/AppBarChart";
import AppPieChart from "@/components/ui/AppPieChart";
import AppDataTable from "@/components/ui/AppDataTable";
import AppRadar from "@/components/ui/AppRadar";
import AppRedial from "@/components/ui/AppRedial";
import Image from "next/image";

const HomePage = () => {

    return(
        
        /* 2xl for large screen || lg for medium screen || grid small screen (mobile screen)*/

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">

        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2"><AppBarChart/></div>
        <div className="bg-primary-foreground p-4 rounded-lg"><AppRadar/></div>
        <div className="bg-primary-foreground p-4 rounded-lg"><AppPieChart/></div>
        <div className="bg-primary-foreground p-4 rounded-lg"><AppDataTable/></div>
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2"><AppAreaChart/></div>
        <div className="bg-primary-foreground p-4 rounded-lg"><AppRedial/></div>




        </div>
        



    );

}

export default HomePage;
