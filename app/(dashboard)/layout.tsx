import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { ReactNode } from "react";

const DashboardLayout = async ({
    children
}: {children :ReactNode}) => {

    const apiLimitCount = await getApiLimitCount();

    return (  
        <div className="dashboard-layout__content h-full relative">
            <div className="hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 z-[50] bg-slate-900 md:w-72">
                <div>
                    <Sidebar apiLimitCount={apiLimitCount} />
                </div>
            </div>
            <main className="md:pl-72">
                <Navbar />
                {children}
            </main>
        </div>
    );
}
 
export default DashboardLayout;