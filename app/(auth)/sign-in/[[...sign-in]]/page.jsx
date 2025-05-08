
import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function SignInPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          alt="TrackWise Logo"
          src="/logo.svg"
          width={40}
          height={40}
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign in to your TrackWise account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <SignIn
          appearance={{
            elements: {
              card:
                'shadow-md border border-gray-200 px-6 py-8 rounded-xl bg-white',
              headerTitle: 'text-xl font-semibold text-center text-gray-900',
              headerSubtitle: 'text-sm text-gray-500 text-center',
              formButtonPrimary:
                'w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500',
              formFieldLabel: 'text-sm font-medium text-gray-700',
              formFieldInput:
                'block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
              socialButtonsBlockButton:
                'w-full mb-3 flex items-center justify-center gap-2 rounded-md border bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200',
              footer: 'hidden'
            },
          }}
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          forceRedirectUrl="/dashboard"
        />

        <p className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{' '}
          <a
            href="/sign-up"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
