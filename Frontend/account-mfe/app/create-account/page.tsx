import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BankSidebar } from "@/components/bank-sidebar"
import { BankHeader } from "@/components/bank-header"
import { CreateAccountForm } from "@/components/create-account-form"

export default function CreateAccountPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BankSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <BankHeader />

        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          <div className="mb-6 flex items-center gap-4">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Back to accounts"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create New Account</h1>
              <p className="text-sm text-muted-foreground">
                Fill in the details below to open a new bank account
              </p>
            </div>
          </div>

          <CreateAccountForm />
        </main>
      </div>
    </div>
  )
}
