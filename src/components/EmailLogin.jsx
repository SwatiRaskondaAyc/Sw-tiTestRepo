import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from './Navbar';

const EmailLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1); // Tracks current step (1: Email, 2: OTP, 3: Account Type)
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showOtpSentMessage, setShowOtpSentMessage] = useState(false);
  const [showOtpErrorMessage, setShowOtpErrorMessage] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [signupType, setSignupType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const from = location.state?.from || '/';

  const sendOtp = async () => {
    if (!email) {
      setErrorMessage('Please enter a valid email.');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/auth/send-otp`, { email });
      if (res.status === 200) {
        setOtpSent(true);
        setShowOtpSentMessage(true);
        setErrorMessage('');
        setStep(2);
        setTimeout(() => setShowOtpSentMessage(false), 5000);
      }
    } catch (err) {
      setShowOtpErrorMessage(true);
      setErrorMessage('This email is already registered. Please log in or use a different email.');
      setTimeout(() => setShowOtpErrorMessage(false), 7000);
    }
  };

  const verifyOtp = async () => {
    setIsVerifying(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/verify-otp`, { email, otp });
      if (res.status === 200) {
        localStorage.setItem('verifiedEmail', email);
        setIsOtpVerified(true);
        setSuccessMessage('OTP verified successfully!');
        setErrorMessage('');
        setTimeout(() => {
          setSuccessMessage('');
          setStep(3);
        }, 2000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'OTP verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAccountSelection = () => {
    if (signupType === 'individual') {
      navigate('/individualSignUp', { state: { email, signupType: 'individual', from } });
    } else if (signupType === 'corporate') {
      navigate('/corporateSignUp', { state: { email, signupType: 'corporate', from } });
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen p-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-10 px-4 relative overflow-hidden">
      {/* Animated stock chart background */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,50 L20,45 L40,60 L60,30 L80,40 L100,20" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-blue-500" />
          <path d="M0,70 L20,65 L40,80 L60,50 L80,60 L100,40" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-green-500" />
          <path d="M0,30 L20,25 L40,40 L60,10 L80,20 L100,5" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-sky-500" />
        </svg>
      </div>

      {/* Floating stock indicators */}
      <div className="absolute top-10 left-10 text-green-500 animate-pulse">
        <TrendingUp size={24} />
      </div>
      <div className="absolute top-1/4 right-16 text-blue-500">
        <TrendingUp size={24} />
      </div>

      {/* Main Content */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-lg mx-4 p-8 space-y-6 border border-gray-200 dark:border-gray-700 relative z-10">
        <Link
          to={from}
          className="absolute right-4 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          aria-label="Close and return to previous page"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-sky-600 p-3 rounded-full">
              <TrendingUp className="text-white" size={32} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Email Sign In</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Step {step} of 3: {step === 1 ? 'Enter Email' : step === 2 ? 'Verify OTP' : 'Choose Account Type'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className={`w-1/3 h-1 ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'} rounded-full`}></div>
          <div className={`w-1/3 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'} rounded-full mx-2`}></div>
          <div className={`w-1/3 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'} rounded-full`}></div>
        </div>

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full mt-1 px-4 py-3 rounded-xl dark:text-white border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                disabled={otpSent}
              />
            </div>
            {showOtpErrorMessage && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <div>
                  <p className="font-semibold">Oops!</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}
            <button
              onClick={sendOtp}
              className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg ${
                !email || otpSent
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
              }`}
              disabled={!email || otpSent}
            >
              Send OTP
            </button>
          </div>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <div className="space-y-4">
            {showOtpSentMessage && (
              <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                OTP Sent to {email}
              </div>
            )}
            {successMessage && (
              <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                {errorMessage}
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 dark:text-white dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                maxLength={6}
              />
            </div>
            <button
              onClick={verifyOtp}
              className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg ${
                !otp || otp.length < 6 || isOtpVerified || isVerifying
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
              }`}
              disabled={!otp || otp.length < 6 || isOtpVerified || isVerifying}
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-2">
                  Verifying...
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </span>
              ) : (
                'Verify OTP'
              )}
            </button>
          </div>
        )}

        {/* Step 3: Choose Account Type */}
        {step === 3 && (
          <div className="space-y-4">
            <div
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                signupType === 'individual'
                  ? 'border-blue-500 bg-blue-50 dark:bg-gray-700 shadow-md'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => setSignupType('individual')}
            >
              <div className="flex items-start">
                <div
                  className={`flex items-center justify-center h-6 w-6 rounded-full border-2 mr-3 mt-1 ${
                    signupType === 'individual' ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-500'
                  }`}
                >
                  {signupType === 'individual' && (
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Individual Account</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">For personal use and individual creators</p>
                </div>
              </div>
            </div>
            <div
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                signupType === 'corporate'
                  ? 'border-blue-500 bg-blue-50 dark:bg-gray-700 shadow-md'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => setSignupType('corporate')}
            >
              <div className="flex items-start">
                <div
                  className={`flex items-center justify-center h-6 w-6 rounded-full border-2 mr-3 mt-1 ${
                    signupType === 'corporate' ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-500'
                  }`}
                >
                  {signupType === 'corporate' && (
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Business Account</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">For companies and organizations</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleAccountSelection}
              className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg ${
                !signupType
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
              }`}
              disabled={!signupType}
            >
              Continue
              <svg className="h-5 w-5 ml-2 inline" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default EmailLogin;



// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
// import Navbar from './Navbar';

// const EmailLogin = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [showOtpSentMessage, setShowOtpSentMessage] = useState(false);
//   const [showOtpErrorMessage, setShowOtpErrorMessage] = useState(false);
//   const [isOtpVerified, setIsOtpVerified] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [signupType, setSignupType] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const from = location.state?.from || '/';

//   const sendOtp = async () => {
//     if (!email) {
//       setErrorMessage('Please enter a valid email.');
//       return;
//     }
//     try {
//       const res = await axios.post(`${API_BASE}/auth/send-otp`, { email });
//       if (res.status === 200) {
//         setOtpSent(true);
//         setShowOtpSentMessage(true);
//         setErrorMessage('');
//         setStep(2);
//         setTimeout(() => setShowOtpSentMessage(false), 5000);
//       }
//     } catch (err) {
//       setShowOtpErrorMessage(true);
//       setErrorMessage('This email is already registered. Please log in or use a different email.');
//       setTimeout(() => setShowOtpErrorMessage(false), 7000);
//     }
//   };

//   const verifyOtp = async () => {
//     setIsVerifying(true);
//     try {
//       const res = await axios.post(`${API_BASE}/auth/verify-otp`, { email, otp });
//       if (res.status === 200) {
//         localStorage.setItem('verifiedEmail', email);
//         setIsOtpVerified(true);
//         setSuccessMessage('OTP verified successfully!');
//         setErrorMessage('');
//         setTimeout(() => {
//           setSuccessMessage('');
//           setStep(3);
//         }, 2000);
//       }
//     } catch (err) {
//       setErrorMessage(err.response?.data?.message || 'OTP verification failed.');
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleAccountSelection = () => {
//     if (signupType === 'individual') {
//       navigate('/individualSignUp', { state: { email, signupType: 'individual', from } });
//     } else if (signupType === 'corporate') {
//       navigate('/corporateSignUp', { state: { email, signupType: 'corporate', from } });
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
//         {/* Animated background elements */}
//         <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5 pointer-events-none">
//           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
//             <path d="M0,50 L20,45 L40,60 L60,30 L80,40 L100,20" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-blue-400 animate-pulse" />
//             <path d="M0,70 L20,65 L40,80 L60,50 L80,60 L100,40" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-green-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
//             <path d="M0,30 L20,25 L40,40 L60,10 L80,20 L100,5" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-sky-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
//           </svg>
//         </div>

//         {/* Floating decorative icons */}
//         <div className="absolute top-12 left-12 text-blue-400 animate-float">
//           <TrendingUp size={28} />
//         </div>
//         <div className="absolute bottom-12 right-12 text-green-400 animate-float" style={{ animationDelay: '0.5s' }}>
//           <TrendingUp size={28} />
//         </div>

//         {/* Main Content */}
//         <div className="bg-white dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 border border-gray-100/50 dark:border-gray-700/50 relative z-10 transition-all duration-300">
//           <Link
//             to={from}
//             className="absolute right-4 top-4 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors duration-200"
//             aria-label="Close and return to previous page"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </Link>
//           <div className="text-center">
//             <div className="flex justify-center mb-4">
//               <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full shadow-lg">
//                 <TrendingUp className="text-white" size={36} />
//               </div>
//             </div>
//             <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Email Sign In</h2>
//             <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium">
//               Step {step} of 3: {step === 1 ? 'Enter Email' : step === 2 ? 'Verify OTP' : 'Choose Account Type'}
//             </p>
//           </div>

//           {/* Progress Bar */}
//           <div className="flex items-center justify-between mb-8">
//             {[1, 2, 3].map((s) => (
//               <div
//                 key={s}
//                 className={`flex-1 h-1.5 ${step >= s ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200 dark:bg-gray-600'} rounded-full mx-1 transition-all duration-300`}
//               ></div>
//             ))}
//           </div>

//           {/* Step 1: Enter Email */}
//           {step === 1 && (
//             <div className="space-y-5">
//               <div>
//                 <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Email Address</label>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="user@example.com"
//                   className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500"
//                   disabled={otpSent}
//                 />
//               </div>
//               {showOtpErrorMessage && (
//                 <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg flex items-start gap-3 animate-slide-in">
//                   <AlertCircle className="w-5 h-5 mt-0.5" />
//                   <div>
//                     <p className="font-semibold text-sm">Error</p>
//                     <p className="text-sm">{errorMessage}</p>
//                   </div>
//                 </div>
//               )}
//               <button
//                 onClick={sendOtp}
//                 className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-xl ${!email || otpSent
//                     ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
//                     : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
//                   }`}
//                 disabled={!email || otpSent}
//               >
//                 Send OTP
//               </button>
//             </div>
//           )}

//           {/* Step 2: Enter OTP */}
//           {step === 2 && (
//             <div className="space-y-5">
//               {showOtpSentMessage && (
//                 <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg flex items-center gap-3 animate-slide-in">
//                   <CheckCircle className="w-5 h-5" />
//                   <span className="text-sm">OTP Sent to {email}</span>
//                 </div>
//               )}
//               {successMessage && (
//                 <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg flex items-center gap-3 animate-slide-in">
//                   <CheckCircle className="w-5 h-5" />
//                   <span className="text-sm">{successMessage}</span>
//                 </div>
//               )}
//               {errorMessage && (
//                 <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg flex items-start gap-3 animate-slide-in">
//                   <AlertCircle className="w-5 h-5 mt-0.5" />
//                   <span className="text-sm">{errorMessage}</span>
//                 </div>
//               )}
//               <div>
//                 <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Verification Code</label>
//                 <input
//                   type="text"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   placeholder="Enter 6-digit code"
//                   className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500"
//                   maxLength={6}
//                 />
//               </div>
//               <button
//                 onClick={verifyOtp}
//                 className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-xl ${!otp || otp.length < 6 || isOtpVerified || isVerifying
//                     ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
//                     : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
//                   }`}
//                 disabled={!otp || otp.length < 6 || isOtpVerified || isVerifying}
//               >
//                 {isVerifying ? (
//                   <span className="flex items-center justify-center gap-2">
//                     Verifying...
//                     <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       />
//                     </svg>
//                   </span>
//                 ) : (
//                   'Verify OTP'
//                 )}
//               </button>
//             </div>
//           )}

//           {/* Step 3: Choose Account Type */}
//           {step === 3 && (
//             <div className="space-y-5">
//               <div
//                 className={`p-5 border-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${signupType === 'individual'
//                     ? 'border-indigo-500 bg-indigo-50 dark:bg-gray-700 shadow-lg'
//                     : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 hover:bg-indigo-50/30 dark:hover:bg-gray-700/30'
//                   }`}
//                 onClick={() => setSignupType('individual')}
//               >
//                 <div className="flex items-start">
//                   <div
//                     className={`flex items-center justify-center h-6 w-6 rounded-full border-2 mr-3 mt-1 transition-colors duration-200 ${signupType === 'individual' ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300 dark:border-gray-500'
//                       }`}
//                   >
//                     {signupType === 'individual' && (
//                       <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
//                         <path
//                           fillRule="evenodd"
//                           d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     )}
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-800 dark:text-white">Individual Account</h4>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">For personal use and individual creators</p>
//                   </div>
//                 </div>
//               </div>
//               <div
//                 className={`p-5 border-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${signupType === 'corporate'
//                     ? 'border-indigo-500 bg-indigo-50 dark:bg-gray-700 shadow-lg'
//                     : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 hover:bg-indigo-50/30 dark:hover:bg-gray-700/30'
//                   }`}
//                 onClick={() => setSignupType('corporate')}
//               >
//                 <div className="flex items-start">
//                   <div
//                     className={`flex items-center justify-center h-6 w-6 rounded-full border-2 mr-3 mt-1 transition-colors duration-200 ${signupType === 'corporate' ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300 dark:border-gray-500'
//                       }`}
//                   >
//                     {signupType === 'corporate' && (
//                       <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
//                         <path
//                           fillRule="evenodd"
//                           d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     )}
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-800 dark:text-white">Business Account</h4>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">For companies and organizations</p>
//                   </div>
//                 </div>
//               </div>
//               <button
//                 onClick={handleAccountSelection}
//                 className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2 ${!signupType
//                     ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
//                     : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
//                   }`}
//                 disabled={!signupType}
//               >
//                 Continue
//                 <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//                   <path
//                     fillRule="evenodd"
//                     d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-10px); }
//         }
//         .animate-float {
//           animation: float 4s ease-in-out infinite;
//         }
//         @keyframes slide-in {
//           0% { opacity: 0; transform: translateY(-10px); }
//           100% { opacity: 1; transform: translateY(0); }
//         }
//         .animate-slide-in {
//           animation: slide-in 0.3s ease-out;
//         }
//       `}</style>
//     </>
//   );
// };

// export default EmailLogin;