'use client'
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { redirectToPath } from "../auth-helpers/server";

export async function handleRequest(
    e: React.FormEvent<HTMLFormElement>|FormData,
    requestFunc: (formData: FormData) => Promise<string>,
    router: AppRouterInstance | null = null
  ): Promise<boolean | void> {
    // Prevent default form submission refresh
    // e.preventDefault();

    let formData : FormData;
    if('currentTarget' in e ) {
        formData = new FormData(e.currentTarget);
    } else {
        formData = e;
    }
    const redirectUrl: string = await requestFunc(formData);

    if (router) {
      // If client-side router is provided, use it to redirect
      return router.push(redirectUrl);
    } else {
      // Otherwise, redirect server-side
      return await redirectToPath(redirectUrl);
    }
  }

