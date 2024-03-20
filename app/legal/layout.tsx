import { PropsWithChildren } from "react";

export default async function LegalLayout({ children }: PropsWithChildren) {
    return (
        <section className="container m-auto">
            {children}
        </section>
    );
  }
