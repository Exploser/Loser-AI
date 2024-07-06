import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { ReactNode } from "react";

const DashboardLayout = ({
    children
}: {children :ReactNode}) => {
    return (  
        <div className="dashboard-layout__content h-full relative">
            <div className="hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 z-[80] bg-slate-900 md:w-72">
                <div>
                    <Sidebar />
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