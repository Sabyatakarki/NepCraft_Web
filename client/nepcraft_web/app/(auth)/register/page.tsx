'use client';

import RegisterForm from '../_components/registerform';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF4EE] px-6">
      
      {/* Main container */}
      <div className="w-full max-w-6xl flex rounded-3xl overflow-hidden shadow-xl bg-white">
        
        {/* Left side - Image */}
        <div className="hidden lg:block w-1/2">
          <img
            src="/account.jpg"   // replace with your image
            alt="NepCraft"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-10">
          <RegisterForm />
        </div>

      </div>
    </div>
  );
}