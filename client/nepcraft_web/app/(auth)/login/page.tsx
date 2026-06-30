'use client';

import LoginForm from '../_components/loginfrom';

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-[#FAF4EE] px-6">

      <div className="w-full max-w-5xl h-[90vh] flex rounded-3xl overflow-hidden shadow-xl bg-white">

        {/* LEFT IMAGE */}
        <div className="hidden lg:block w-1/2">
          <img
            src="/account.jpg"
            className="w-full h-full object-cover"
            alt="login"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-10 overflow-y-auto">
          <LoginForm />
        </div>

      </div>
    </div>
  );
}