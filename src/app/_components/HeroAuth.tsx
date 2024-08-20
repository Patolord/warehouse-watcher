'use client'

import { Authenticated, Unauthenticated } from "convex/react"
import Link from "next/link"
import { SignInDialog } from "../../auth/SignInDialog"
import { GitHubLogo } from "@/components/GitHubLogo"
import { Button } from "@/components/ui/button"

export default function HeroAuth() {
    return (
        <>
            <Authenticated>
                <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
                    <Button asChild>
                        <Link
                            href="/dashboard/materials"
                            className="px-8 py-4 text-lg font-medium text-center text-white bg-indigo-600 rounded-md ">
                            Go to Dashboard
                        </Link>
                    </Button>

                    <Link
                        href="https://github.com/Patolord/warehouse-watcher"
                        target="_blank"
                        rel="noopener"
                        className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                        <GitHubLogo className="w-5 h-5" />
                        <span> View on Github</span>
                    </Link>
                </div>
            </Authenticated>
            <Unauthenticated>
                <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
                    <SignInDialog className="px-8 py-4 text-lg font-medium text-center text-white bg-indigo-600 rounded-md w-25 h-18" />
                    <Link
                        href="https://github.com/Patolord/warehouse-watcher"
                        target="_blank"
                        rel="noopener"
                        className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                        <GitHubLogo className="w-5 h-5" />
                        <span> View on Github</span>
                    </Link>
                </div>
            </Unauthenticated>
        </>
    )
}