import { SignupForm } from "@/components/auth/SignupForm"
import CinemaSpotlight from "@/components/ui/cinema-spotlight"

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <CinemaSpotlight />
        <SignupForm />
      </div>
    </div>
  )
}
