import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join the DuBuBu Family! 🐻🐼
          </h1>
          <p className="text-gray-600">
            Create an account to track orders and save favorites
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border border-pink-100 rounded-2xl",
            },
          }}
          fallbackRedirectUrl="/"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}
