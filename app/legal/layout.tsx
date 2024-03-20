import { PropsWithChildren } from "react";

export default async function LegalLayout({ children }: PropsWithChildren) {
    return (
        <section className="container m-auto border-red-500 border-1">
            {children}
        </section>
    );
  }
