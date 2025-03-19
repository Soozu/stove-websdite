import { useRouter } from 'next/router'
import Link from 'next/link'

export default function ErrorPage() {
  const router = useRouter()
  const { error } = router.query

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'OAuthSignin':
        return 'Error starting the Discord sign in process.'
      case 'OAuthCallback':
        return 'Error receiving the response from Discord.'
      case 'OAuthCreateAccount':
        return 'Error creating your account.'
      case 'EmailCreateAccount':
        return 'Error creating your account with email.'
      case 'Callback':
        return 'Error during the callback process.'
      case 'AccessDenied':
        return 'You do not have permission to sign in.'
      default:
        return 'An error occurred during authentication.'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Authentication Error</h1>
        <p className="text-gray-300 mb-6">
          {error ? getErrorMessage(error as string) : 'An unknown error occurred.'}
        </p>
        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
} 