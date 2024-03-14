import Link from "next/link";

export default function Breadcrumbs({...props}) {
    const listitems = props.paths.map((i: { href: string ; title: string | null | undefined; }, index:number) => index==props.paths.length-1?<li key={index}>{i.title}</li>:<li key={index}><Link href={i.href}>{i.title}</Link></li>)
    return (
        <div className={"text-sm d-breadcrumbs " + props.className}>
            <ul>
                {listitems}
            </ul>
        </div>
    )
}