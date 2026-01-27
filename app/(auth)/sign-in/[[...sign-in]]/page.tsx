import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back! 🐻🐼
          </h1>
          <p className="text-gray-600">
            Sign in to access your account and orders
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border border-pink-100 rounded-2xl",
            },
          }}
          fallbackRedirectUrl="/"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}
