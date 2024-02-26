'use client'
import { useFormStatus } from "react-dom"
export default function Loading( ) {
      const { pending } = useFormStatus()

    return (
        pending?<span className="d-loading d-loading-ring d-loading-lg self-center justify-self-center"></span>:<></>
    )
}