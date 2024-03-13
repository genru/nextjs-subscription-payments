import Link from "next/link";

export default function Breadcrumbs({...props}) {
    return (
        <div className="text-sm d-breadcrumbs">
            <ul>
                {props.paths.map((i: { href: string ; title: string | null | undefined; }, index:number) => index==props.paths.length-1?<li key={i.href}>{i.title}</li>:<li key={i.href}><Link href={i.href}>{i.title}</Link></li>)}
            </ul>
        </div>
    )
}