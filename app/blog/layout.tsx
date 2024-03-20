import { PropsWithChildren } from "react";

export default async function BlogLayout({ children }: PropsWithChildren) {
    return (
        <section className="container m-auto">
            {children}
        </section>
    );
}
