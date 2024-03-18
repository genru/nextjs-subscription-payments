import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PropsWithChildren } from "react";

export default async function LegalLayout({ children }: PropsWithChildren) {
    const links = [{title: "Home", href: '/'}, {title: "Privacy", href:"/"}];
    return (
        <section className="container m-auto border-red-500 border-1">
            <Breadcrumbs paths={links}></Breadcrumbs>
            {children}
        </section>
    );
  }
