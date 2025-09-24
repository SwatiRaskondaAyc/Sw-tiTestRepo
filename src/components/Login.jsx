

// -working code---------------------------------------

// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import { EyeIcon, EyeOffIcon } from 'lucide-react';
// import emailLogo from '../../public/email.png';
// import { HiOutlineLogout } from 'react-icons/hi';
// import GoogleLoginButton from './GoogleLoginButton';
// import { CgLogIn } from 'react-icons/cg';

// const Login = ({ isOpen, onClose, onSuccess, showButtons = true }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();

//   const navigate = useNavigate();
//   const [errorModal, setErrorModal] = useState({ isOpen: false, message: '', type: 'error' }); // Added type: 'error' or 'success'
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [showOtpSentMessage, setShowOtpSentMessage] = useState(false);
//   const [showOtpErrorMessage, setShowOtpErrorMessage] = useState(false);
//   const [isOtpVerified, setIsOtpVerified] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const otpModalRef = useRef(null);
//   const userTypeModalRef = useRef(null);
//   const errorModalRef = useRef(null);
//   const [signupType, setSignupType] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   // Close modal when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isModalOpen && event.target.classList.contains('modal-overlay')) {
//         handleCloseModal();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isModalOpen]);

//   // Open error modal when errorModal state changes
//   useEffect(() => {
//     if (errorModal.isOpen && errorModalRef.current) {
//       errorModalRef.current.showModal();
//     }
//   }, [errorModal.isOpen]);

//   const handleLogout = () => {
//     localStorage.clear();
//     setIsLoggedIn(false);
//     setErrorModal({ isOpen: true, message: 'Logged out successfully!', type: 'success' });
//     navigate('/');
//   };

//   const handleGoogleLoginSuccess = () => {
//     setIsLoggedIn(true);
//     window.dispatchEvent(new Event('authChange'));
//     onClose();
//     if (onSuccess) onSuccess();
//     navigate('/');
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     reset();
//   };

//   const onSubmit = async (data) => {
//     try {
//       const response = await axios.post(
//         `${API_BASE}/auth/login`,
//         data,
//         {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );

//       if (response.status === 200) {
//         const { token, userType, email } = response.data;
//         localStorage.setItem('authToken', token);
//         localStorage.setItem('userType', userType);
//         localStorage.setItem('userEmail', email);
//         window.dispatchEvent(new Event('storage'));
//         setErrorModal({ isOpen: true, message: 'Logged in successfully!', type: 'success' });
//         handleCloseModal();
//         setIsLoggedIn(true);
//         if (onSuccess) onSuccess();
//       } else {
//         setErrorModal({ isOpen: true, message: 'Invalid credentials', type: 'error' });
//       }
//     } catch (err) {
//       setErrorModal({ isOpen: true, message: 'Login failed. Check email and password.', type: 'error' });
//     }
//   };

//   const sendOtp = async () => {
//     if (!email) {
//       setErrorModal({ isOpen: true, message: 'Enter a valid email.', type: 'error' });
//       return;
//     }
//     try {
//       const res = await axios.post(`${API_BASE}/auth/send-otp`, { email });
//       if (res.status === 200) {
//         setOtpSent(true);
//         setShowOtpSentMessage(true);
//         setTimeout(() => {
//           setShowOtpSentMessage(false);
//         }, 5000);
//       }
//     } catch (err) {
//       setShowOtpErrorMessage(true);
//       setTimeout(() => {
//         setShowOtpErrorMessage(false);
//       }, 7000);
//     }
//   };

//   const verifyOtp = async () => {
//     setIsVerifying(true);
//     try {
//       const res = await axios.post(`${API_BASE}/auth/verify-otp`, { email, otp });
//       if (res.status === 200) {
//         localStorage.setItem('verifiedEmail', email);
//         setIsOtpVerified(true);
//         setErrorModal({ isOpen: true, message: 'OTP verified!', type: 'success' });
//         setTimeout(() => {
//           if (otpModalRef.current && userTypeModalRef.current) {
//             otpModalRef.current.close();
//             userTypeModalRef.current.showModal();
//           } else {
//             console.error('Modal references are not available');
//             setErrorModal({ isOpen: true, message: 'An error occurred. Please try again.', type: 'error' });
//           }
//         }, 500);
//       }
//     } catch (err) {
//       setErrorModal({ isOpen: true, message: err.response?.data?.message || 'OTP verification failed.', type: 'error' });
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   return (
//     <div className="text-black">
//       {/* Login/Logout Buttons */}
//       {showButtons && (
//         <div className="navbar-end px-4">
//           {isLoggedIn ? (
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
//             >
//               <HiOutlineLogout className="text-xl" />
//               <span className="hidden sm:inline font-medium">Logout</span>
//             </button>
//           ) : (
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 border border-white text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
//             >
//               <CgLogIn className="text-xl" />
//               <span className="hidden sm:inline font-medium">Login</span>
//             </button>
//           )}
//         </div>
//       )}

//       {/* Login Modal */}
//       {isOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center">
//           <div className="fixed inset-0 bg-black bg-opacity-10 modal-overlay backdrop-blur-sm"></div>
//           <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 z-[101] overflow-hidden">
//             <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
//             <button
//               onClick={onClose}
//               className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//             <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
//               <div className="text-center">
//                 <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Welcome Back</h2>
//               </div>
//               <div className="space-y-1">
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
//                 <input
//                   type="email"
//                   placeholder="user@example.com"
//                   {...register('email', { required: 'Email is required' })}
//                   className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:text-white dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                 />
//                 {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//               </div>
//               <div className="space-y-1">
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     placeholder="••••••••"
//                     {...register('password', { required: 'Password is required' })}
//                     className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:text-white dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
//                   >
//                     {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
//                   </button>
//                 </div>
//                 <Link
//                   to="/ForgotPassword"
//                   className="text-sm text-blue-600 mr-0 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
//                   onClick={handleCloseModal}
//                 >
//                   Forgot Password?
//                 </Link>
//                 {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-sky-700 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
//               >
//                 Login
//               </button>
//               {/* <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
//                     Or signup with
//                   </span>
//                 </div>
//               </div> */}
//             {/* <div className="grid grid-cols-1 gap-4">
//                 <div className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
//                   {/* <div className="w-full px-2 py-3">
//                     <GoogleLoginButton
//                       onClose={handleCloseModal}
//                       onSuccess={handleGoogleLoginSuccess}
//                     /> 
//                   </div> *
//     <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md">
//                   <GoogleLoginButton className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600" onClose={onClose} onSuccess={handleGoogleLoginSuccess} />
//                 </div>
//   </div>

//    <button
//     type="button"
//     className="flex items-center justify-center gap-2 bg-sky-700 text-white py-3 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
//     onClick={() => {
//       handleCloseModal();
//       setTimeout(() => otpModalRef.current?.showModal(), 300);
//     }}
//   >
//      Email

//   </button> *
//   <button
//                   type="button"
//                   className="flex items-center justify-center gap-3 w-full bg-slate-800 text-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-md hover:border-blue-400"
//                   onClick={() => {
//                     handleCloseModal();
//       setTimeout(() => otpModalRef.current?.showModal(), 300);
//                   }}
//                 >
//                   <svg className="w-5 h-5 text-gray-100 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
//                   </svg>
//                   Continue with Email
//                 </button>
// </div> */}
//          <div className="relative my-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
//                 </div>
//               </div>
//               <div className="space-y-4">
//                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md">
//                   <GoogleLoginButton className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600" 
//                   onClick={() => {
//                    handleCloseModal();
//                     setTimeout(() => otpModalRef.current?.showModal(), 300);
//                   }}
//                    onSuccess={handleGoogleLoginSuccess} />
//                 </div>
//                 <button
//                   type="button"
//                   className="flex items-center justify-center gap-3 w-full bg-slate-800 text-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-md hover:border-blue-400"
//                   onClick={() => {
//                    handleCloseModal();
//                     setTimeout(() => otpModalRef.current?.showModal(), 300);
//                   }}
//                 >
//                   <svg className="w-5 h-5 text-gray-100 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
//                   </svg>
//                   Continue with Email
//                 </button>
//               </div>

//             </form>
//           </div>
//         </div>
//       )}

//       {/* OTP Modal */}
//       <dialog ref={otpModalRef} className="modal z-[100] backdrop:bg-black/10 backdrop-blur-sm">
//         <div className="modal-box p-0 max-w-md bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl ring-1 ring-sky-500/20 transition-all duration-300">
//           <div className="relative h-2 bg-gradient-to-r from-sky-700 via-cyan-500 to-sky-700 animate-pulse"></div>
//           <button
//             onClick={() => otpModalRef.current?.close()}
//             className="absolute right-4 top-4 text-gray-400 hover:text-sky-500 dark:text-gray-300 dark:hover:text-cyan-400 transition-all duration-200 transform hover:scale-110"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//           <div className="p-8 sm:p-10">
//             <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-3 tracking-tight">
//               Email Verification
//             </h3>
//             <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
//               Enter your email to receive a secure verification code
//             </p>
//             {showOtpSentMessage && (
//               <div className="mb-4 p-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center gap-2 animate-fade-in">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//                 OTP Sent to {email}
//               </div>
//             )}
//             {showOtpErrorMessage && (
//               <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/50 text-yellow-800 dark:text-red-300 rounded-xl flex items-start gap-3 animate-fade-in">
//                 <svg
//                   className="w-5 h-5 mt-1 shrink-0"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   aria-hidden="true"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//                 <div>
//                   <p className="font-semibold mb-1">Oops!</p>
//                   <p>
//                     The email you entered is already registered. <br />
//                     Please log in instead or use a different email to sign up.
//                   </p>
//                 </div>
//               </div>
//             )}
//             <div className="space-y-7">
//               <div className="group">
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   value={email}
//                   placeholder="Enter your email"
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-4 py-3 rounded-xl dark:text-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 bg-gray-50 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group-hover:border-sky-500/50"
//                   disabled={otpSent}
//                 />
//               </div>
//               <button
//                 onClick={sendOtp}
//                 className={`w-full py-3.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-0.5
//                   ${
//                     otpSent
//                       ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
//                       : 'bg-gradient-to-r from-sky-700 to-cyan-500 hover:from-sky-800 hover:to-cyan-600 shadow-cyan-500/30'
//                   } disabled:opacity-50 disabled:cursor-not-allowed`}
//                 disabled={!email || otpSent}
//               >
//                 {otpSent ? (
//                   <span className="flex items-center justify-center gap-2">
//                     OTP Sent{' '}
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                   </span>
//                 ) : (
//                   'Send OTP'
//                 )}
//               </button>
//               {otpSent && (
//                 <>
//                   {isOtpVerified && (
//                     <div className="mb-4 p-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-center">
//                       OTP verified successfully!
//                     </div>
//                   )}
//                   <div className="group">
//                     <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
//                       Verification Code
//                     </label>
//                     <input
//                       type="text"
//                       value={otp}
//                       placeholder="Enter 6-digit code"
//                       onChange={(e) => setOtp(e.target.value)}
//                       className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 bg-gray-50 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-300 group-hover:border-sky-500/50"
//                       maxLength={6}
//                     />
//                   </div>
//                   <button
//                     onClick={verifyOtp}
//                     className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
//                     disabled={!otp || otp.length < 6 || isOtpVerified || isVerifying}
//                   >
//                     {isVerifying ? (
//                       <span className="flex items-center justify-center gap-2">
//                         Verifying...{' '}
//                         <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           ></circle>
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                           ></path>
//                         </svg>
//                       </span>
//                     ) : (
//                       'Verify OTP'
//                     )}
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </dialog>

//       {/* Error/Success Modal */}
//       <dialog ref={errorModalRef} className="modal z-[101] backdrop:bg-black/10 backdrop-blur-sm">
//         <div className="modal-box p-0 max-w-md bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl transition-all duration-300">
//           <div
//             className={`relative h-2 animate-pulse ${
//               errorModal.type === 'success'
//                 ? 'bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-700'
//                 : 'bg-gradient-to-r from-red-700 via-red-500 to-red-700'
//             }`}
//           ></div>
//           <div
//             className={`ring-1 ${
//               errorModal.type === 'success' ? 'ring-emerald-500/20' : 'ring-red-500/20'
//             }`}
//           >
//             <button
//               onClick={() => {
//                 errorModalRef.current?.close();
//                 setErrorModal({ isOpen: false, message: '', type: 'error' });
//               }}
//               className={`absolute right-4 top-4 text-gray-400 transition-all duration-200 transform hover:scale-110 ${
//                 errorModal.type === 'success'
//                   ? 'hover:text-emerald-500 dark:hover:text-emerald-400'
//                   : 'hover:text-red-500 dark:hover:text-red-400'
//               }`}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//             <div className="p-8 sm:p-10">
//               <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 tracking-tight">
//                 {errorModal.type === 'success' ? 'Success' : 'Error'}
//               </h3>
//               <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">{errorModal.message}</p>
//               <button
//                 onClick={() => {
//                   errorModalRef.current?.close();
//                   setErrorModal({ isOpen: false, message: '', type: 'error' });
//                 }}
//                 className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
//                   errorModal.type === 'success'
//                     ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-emerald-500/20'
//                     : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-red-500/20'
//                 }`}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </dialog>

//       {/* Signup Type Modal */}
//       <dialog ref={userTypeModalRef} className="modal backdrop:bg-black/50 backdrop-blur-sm">
//         <div className="modal-box p-0 max-w-md dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
//           <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
//           <button
//             onClick={() => userTypeModalRef.current?.close()}
//             className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//           <div className="p-8">
//             <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Create Account</h3>
//             <p className="text-gray-500 dark:text-gray-300 mb-6">Select your account type</p>
//             <div className="space-y-4 mb-6">
//               <div
//                 className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
//                   signupType === 'individual'
//                     ? 'border-blue-500 bg-blue-50 dark:bg-gray-700 shadow-md'
//                     : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
//                 }`}
//                 onClick={() => setSignupType('individual')}
//               >
//                 <div className="flex items-start">
//                   <div
//                     className={`flex items-center justify-center h-6 w-6 rounded-full border-2 mr-3 mt-1 ${
//                       signupType === 'individual'
//                         ? 'border-blue-500 bg-blue-500'
//                         : 'border-gray-300 dark:border-gray-500'
//                     }`}
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
//                     <h4 className="font-medium text-gray-800 dark:text-white">Individual Account</h4>
//                     <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
//                       For personal use and individual creators
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div
//                 className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
//                   signupType === 'corporate'
//                     ? 'border-blue-500 bg-blue-50 dark:bg-gray-700 shadow-md'
//                     : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
//                 }`}
//                 onClick={() => setSignupType('corporate')}
//               >
//                 <div className="flex items-start">
//                   <div
//                     className={`flex items-center justify-center h-6 w-6 rounded-full border-2 mr-3 mt-1 ${
//                       signupType === 'corporate'
//                         ? 'border-blue-500 bg-blue-500'
//                         : 'border-gray-300 dark:border-gray-500'
//                     }`}
//                   >
//                     {signupType === 'corporate' && (
//                       <svg className="h-3-bd w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
//                         <path
//                           fillRule="evenodd"
//                           d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     )}
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-gray-800 dark:text-white">Business Account</h4>
//                     <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
//                       For companies and organizations
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={() => {
//                 if (signupType === 'individual')
//                   navigate('/individualSignUp', { state: { email, signupType: 'individual' } });
//                 else if (signupType === 'corporate')
//                   navigate('/corporateSignUp', { state: { email, signupType: 'corporate' } });
//                 userTypeModalRef.current?.close();
//               }}
//               disabled={!signupType}
//               className={`w-full py-3 rounded-lg font-medium text-white transition-all ${
//                 !signupType
//                   ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
//                   : 'bg-sky-600 hover:bg-blue-700 shadow-md'
//               }`}
//             >
//               Continue
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5 ml-2 inline"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </dialog>
//     </div>
//   );
// };

// export default Login;
// ----------------wc-------------------------

// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import { EyeIcon, EyeOffIcon } from 'lucide-react';
// import emailLogo from '../../public/email.png';
// import { HiOutlineLogout } from 'react-icons/hi';
// import GoogleLoginButton from './GoogleLoginButton';
// import { CgLogIn } from 'react-icons/cg';

// const Login = ({ isOpen, onClose, onSuccess, showButtons = true }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();

//   const navigate = useNavigate();
//   const [errorModal, setErrorModal] = useState({ isOpen: false, message: '', type: 'error' });
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [showOtpSentMessage, setShowOtpSentMessage] = useState(false);
//   const [showOtpErrorMessage, setShowOtpErrorMessage] = useState(false);
//   const [isOtpVerified, setIsOtpVerified] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [isSending, setIsSending] = useState(false); // Controls button disable state during send
//   const [timer, setTimer] = useState(0); // Timer in seconds for resend OTP (60 seconds)
//   const otpModalRef = useRef(null);
//   const userTypeModalRef = useRef(null);
//   const errorModalRef = useRef(null);
//   const [signupType, setSignupType] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   // Allowed email domains
//   const ALLOWED_DOMAINS = new Set([
//     'aycanalytics.com',
//     'gmail.com',
//     'googlemail.com',
//     'outlook.com',
//     'hotmail.com',
//     'live.com',
//     'msn.com',
//     'yahoo.com',
//     'icloud.com',
//     'me.com',
//     'mac.com',
//     'aol.com',
//     'protonmail.com',
//     'gmx.com',
//     'zoho.com',
//     'yandex.com',
//   ]);

//   // Close modal when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isModalOpen && event.target.classList.contains('modal-overlay')) {
//         handleCloseModal();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isModalOpen]);

//   // Open error modal when errorModal state changes
//   useEffect(() => {
//     if (errorModal.isOpen && errorModalRef.current) {
//       errorModalRef.current.showModal();
//     }
//   }, [errorModal.isOpen]);

//   // Countdown timer for resend OTP
//   useEffect(() => {
//     let interval = null;
//     if (timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prevTimer) => {
//           if (prevTimer <= 1) {
//             clearInterval(interval);
//             return 0;
//           }
//           return prevTimer - 1;
//         });
//       }, 1000);
//     } else if (timer === 0 && otpSent) {
//       setIsSending(false); // Enable resend when timer ends
//     }
//     return () => clearInterval(interval);
//   }, [timer, otpSent]);

//   const handleLogout = () => {
//     localStorage.clear();
//     setIsLoggedIn(false);
//     setErrorModal({ isOpen: true, message: 'Logged out successfully! 🎉', type: 'success' });
//     navigate('/');
//   };

//   const handleGoogleLoginSuccess = () => {
//     setIsLoggedIn(true);
//     window.dispatchEvent(new Event('authChange'));
//     onClose();
//     if (onSuccess) onSuccess();
//     navigate('/');
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     reset();
//     setOtpSent(false);
//     setTimer(0);
//   };

//   const onSubmit = async (data) => {
//     try {
//       const response = await axios.post(
//         `${API_BASE}/auth/login`,
//         data,
//         {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );

//       if (response.status === 200) {
//         const { token, userType, email } = response.data;
//         localStorage.setItem('authToken', token);
//         localStorage.setItem('userType', userType);
//         localStorage.setItem('userEmail', email);
//         window.dispatchEvent(new Event('storage'));
//         setErrorModal({ isOpen: true, message: 'Logged in successfully! 🎉', type: 'success' });
//         handleCloseModal();
//         setIsLoggedIn(true);
//         if (onSuccess) onSuccess();
//       } else {
//         setErrorModal({ isOpen: true, message: 'Invalid credentials 😞', type: 'error' });
//       }
//     } catch (err) {
//       setErrorModal({ isOpen: true, message: 'Login failed. Check email and password. 😞', type: 'error' });
//     }
//   };

//   const sendOtp = async () => {
//     if (!email) {
//       setErrorModal({ isOpen: true, message: 'Please enter an email! 📧', type: 'error' });
//       return;
//     }

//     // Validate domain before sending OTP
//     const domain = email.substring(email.lastIndexOf('@') + 1).toLowerCase();
//     if (!ALLOWED_DOMAINS.has(domain)) {
//       setErrorModal({
//         isOpen: true,
//         message: 'Please use a valid email domain (e.g., gmail.com, aycanalytics.com)! 🚫📧',
//         type: 'error',
//       });
//       return;
//     }

//     // OTP send limit logic
//     let otpData = JSON.parse(localStorage.getItem('otpAttempts')) || {};
//     let emailData = otpData[email] || { attempts: 0, blockedUntil: 0, lastAttempt: 0 };
//     const now = Date.now();

//     if (emailData.blockedUntil > now) {
//       const remaining = Math.ceil((emailData.blockedUntil - now) / 60000);
//       setErrorModal({
//         isOpen: true,
//         message: `You have sent OTP multiple times. Your cooling period is for 5 minutes. Please try again after ${remaining} minutes.`,
//         type: 'error',
//       });
//       return;
//     }

//     // Reset attempts if more than 5 minutes since last attempt
//     if (emailData.lastAttempt && now - emailData.lastAttempt > 300000) {
//       emailData.attempts = 0;
//     }

//     // Check if attempts exceed limit
//     if (emailData.attempts >= 3) {
//       emailData.blockedUntil = now + 300000; // Block for 5 minutes
//       emailData.lastAttempt = now;
//       otpData[email] = emailData;
//       localStorage.setItem('otpAttempts', JSON.stringify(otpData));
//       setErrorModal({
//         isOpen: true,
//         message: 'You have sent OTP multiple times. Your cooling period is for 5 minutes. Please try again after 5 minutes.',
//         type: 'info',
//       });
//       return;
//     }

//     // Proceed to send OTP
//     setIsSending(true);
//     setErrorModal({ isOpen: true, message: 'Sending OTP. Please check your email! 📩⏳', type: 'info' });

//     try {
//       const res = await axios.post(`${API_BASE}/auth/send-otp`, { email });
//       if (res.status === 200) {
//         // Increment attempts after successful send
//         emailData.attempts += 1;
//         emailData.lastAttempt = now;
//         otpData[email] = emailData;
//         localStorage.setItem('otpAttempts', JSON.stringify(otpData));

//         setOtpSent(true);
//         setShowOtpSentMessage(true);
//         setTimer(30); // Start 60-second timer
//         setTimeout(() => setShowOtpSentMessage(false), 5000);
//         otpModalRef.current?.showModal(); // Open OTP verification modal
//       }
//     } catch (err) {
//       setShowOtpErrorMessage(true);
//       setTimeout(() => setShowOtpErrorMessage(false), 7000);
//       setErrorModal({ isOpen: true, message: 'Failed to send OTP. Please try again! 😞', type: 'error' });
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const resendOtp = () => {
//     setOtp('');
//     setOtpSent(false);
//     setTimer(0);
//     sendOtp();
//   };

//   const verifyOtp = async () => {
//     setIsVerifying(true);
//     try {
//       const res = await axios.post(`${API_BASE}/auth/verify-otp`, { email, otp });
//       if (res.status === 200) {
//         localStorage.setItem('verifiedEmail', email);
//         setIsOtpVerified(true);
//         setErrorModal({ isOpen: true, message: 'OTP verified! 🎉', type: 'success' });
//         setTimeout(() => {
//           if (otpModalRef.current && userTypeModalRef.current) {
//             otpModalRef.current.close();
//             userTypeModalRef.current.showModal();
//           } else {
//             console.error('Modal references are not available');
//             setErrorModal({ isOpen: true, message: 'An error occurred. Please try again! 😞', type: 'error' });
//           }
//         }, 500);
//       }
//     } catch (err) {
//       setErrorModal({
//         isOpen: true,
//         message: err.response?.data?.message || 'OTP verification failed! 😞',
//         type: 'error',
//       });
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   // Email domain validation on send click only
//   const handleEmailChange = (e) => {
//     const newEmail = e.target.value;
//     setEmail(newEmail);
//   };

//   return (
//     <div className="text-black">
//       {/* Login/Logout Buttons */}
//       {showButtons && (
//         <div className="navbar-end px-4">
//           {isLoggedIn ? (
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
//             >
//               <HiOutlineLogout className="text-xl" />
//               <span className="hidden sm:inline font-medium">Logout</span>
//             </button>
//           ) : (
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 border border-white text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
//             >
//               <CgLogIn className="text-xl" />
//               <span className="hidden sm:inline font-medium">Login</span>
//             </button>
//           )}
//         </div>
//       )}

//       {/* Login Modal */}
//       {isOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center">
//           <div className="fixed inset-0 bg-black bg-opacity-10 modal-overlay backdrop-blur-sm"></div>
//           <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 z-[101] overflow-hidden">
//             <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
//             <button
//               onClick={onClose}
//               className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//             <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
//               <div className="text-center">
//                 <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Welcome Back</h2>
//               </div>
//               <div className="space-y-1">
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
//                 <input
//                   type="email"
//                   placeholder="user@example.com"
//                   {...register('email', { required: 'Email is required' })}
//                   className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:text-white dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                 />
//                 {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//               </div>
//               <div className="space-y-1">
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     placeholder="••••••••"
//                     {...register('password', { required: 'Password is required' })}
//                     className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:text-white dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
//                   >
//                     {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
//                   </button>
//                 </div>
//                 <Link
//                   to="/ForgotPassword"
//                   className="text-sm text-blue-600 mr-0 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
//                   onClick={handleCloseModal}
//                 >
//                   Forgot Password?
//                 </Link>
//                 {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-sky-700 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
//               >
//                 Login
//               </button>
//               <div className="relative my-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or Register with</span>
//                 </div>
//               </div>
//               <div className="space-y-4">
//                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md">
//                   <GoogleLoginButton
//                     className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600"
//                     onClose={handleCloseModal}
//                     onSuccess={handleGoogleLoginSuccess}
//                   />
//                 </div>
//                 <button
//                   type="button"
//                   className="flex items-center justify-center gap-3 w-full bg-slate-800 text-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-md hover:border-blue-400"
//                   onClick={() => {
//                     handleCloseModal();
//                     setTimeout(() => otpModalRef.current?.showModal(), 300);
//                   }}
//                 >
//                   <svg className="w-5 h-5 text-gray-100 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
//                   </svg>
//                   Register with Email
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* OTP Modal */}
//       <dialog ref={otpModalRef} className="modal z-[100] backdrop:bg-black/10 backdrop-blur-sm">
//         <div className="modal-box p-0 max-w-md bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl ring-1 ring-sky-500/20 transition-all duration-300">
//           <div className="relative h-2 bg-gradient-to-r from-sky-700 via-cyan-500 to-sky-700 animate-pulse"></div>
//           <button
//             onClick={() => otpModalRef.current?.close()}
//             className="absolute right-4 top-4 text-gray-400 hover:text-sky-500 dark:text-gray-300 dark:hover:text-cyan-400 transition-all duration-200 transform hover:scale-110"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//           <div className="p-8 sm:p-10">
//             <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-3 tracking-tight">
//               Email Verification
//             </h3>
//             <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
//               Enter your email to receive a secure verification code
//             </p>
//             {showOtpSentMessage && (
//               <div className="mb-4 p-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center gap-2 animate-fade-in">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//                 OTP Sent to {email} 🎉
//               </div>
//             )}
//             {showOtpErrorMessage && (
//               <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/50 text-yellow-800 dark:text-red-300 rounded-xl flex items-start gap-3 animate-fade-in">
//                 <svg
//                   className="w-5 h-5 mt-1 shrink-0"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   aria-hidden="true"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//                 <div>
//                   <p className="font-semibold mb-1">Oops!</p>
//                   <p>
//                     The email you entered is already registered. <br />
//                     Please log in instead or use a different email to sign up. 😞
//                   </p>
//                 </div>
//               </div>
//             )}
//             <div className="space-y-7">
//               <div className="group">
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   value={email}
//                   placeholder="Enter your email"
//                   onChange={handleEmailChange}
//                   className="w-full px-4 py-3 rounded-xl dark:text-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 bg-gray-50 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group-hover:border-sky-500/50"
//                   disabled={otpSent}
//                 />
//               </div>
//               <button
//                 onClick={sendOtp}
//                 className={`w-full py-3.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${otpSent && timer > 0
//                     ? 'bg-gray-400 cursor-not-allowed'
//                     : otpSent
//                       ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
//                       : 'bg-gradient-to-r from-sky-700 to-cyan-500 hover:from-sky-800 hover:to-cyan-600 shadow-cyan-500/30'
//                   } disabled:opacity-50 disabled:cursor-not-allowed`}
//                 disabled={isSending || !email || (otpSent && timer > 0)}
//               >
//                 {otpSent && timer > 0 ? (
//                   <span className="flex items-center justify-center gap-2">
//                     Resend OTP in {timer} s ⏳
//                   </span>
//                 ) : otpSent ? (
//                   <span
//                     onClick={resendOtp}
//                     className="flex items-center justify-center gap-2 cursor-pointer"
//                   >
//                     Resend OTP 📧
//                   </span>
//                 ) : (
//                   'Send OTP'
//                 )}
//               </button>
//               {otpSent && (
//                 <>
//                   {isOtpVerified && (
//                     <div className="mb-4 p-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-center">
//                       OTP verified successfully! 🎉
//                     </div>
//                   )}
//                   <div className="group">
//                     <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
//                       Verification Code
//                     </label>
//                     <input
//                       type="text"
//                       value={otp}
//                       placeholder="Enter 6-digit code"
//                       onChange={(e) => setOtp(e.target.value)}
//                       className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 bg-gray-50 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-300 group-hover:border-sky-500/50"
//                       maxLength={6}
//                     />
//                   </div>
//                   <button
//                     onClick={verifyOtp}
//                     className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
//                     disabled={!otp || otp.length < 6 || isOtpVerified || isVerifying}
//                   >
//                     {isVerifying ? (
//                       <span className="flex items-center justify-center gap-2">
//                         Verifying...{' '}
//                         <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           ></circle>
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                           ></path>
//                         </svg>
//                       </span>
//                     ) : (
//                       'Verify OTP'
//                     )}
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </dialog>

//       {/* Error/Success/Info Modal */}
//       <dialog ref={errorModalRef} className="modal z-[101] backdrop:bg-black/10 backdrop-blur-sm">
//         <div className="modal-box p-0 max-w-md bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl transition-all duration-300">
//           <div
//             className={`relative h-2 animate-pulse ${errorModal.type === 'success'
//                 ? 'bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-700'
//                 : errorModal.type === 'info'
//                   ? 'bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700'
//                   : 'bg-gradient-to-r from-red-700 via-red-500 to-red-700'
//               }`}
//           ></div>
//           <div
//             className={`ring-1 ${errorModal.type === 'success'
//                 ? 'ring-emerald-500/20'
//                 : errorModal.type === 'info'
//                   ? 'ring-blue-500/20'
//                   : 'ring-red-500/20'
//               }`}
//           >
//             <button
//               onClick={() => {
//                 errorModalRef.current?.close();
//                 setErrorModal({ isOpen: false, message: '', type: 'error' });
//               }}
//               className={`absolute right-4 top-4 text-gray-400 transition-all duration-200 transform hover:scale-110 ${errorModal.type === 'success'
//                   ? 'hover:text-emerald-500 dark:hover:text-emerald-400'
//                   : errorModal.type === 'info'
//                     ? 'hover:text-blue-500 dark:hover:text-blue-400'
//                     : 'hover:text-red-500 dark:hover:text-red-400'
//                 }`}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//             <div className="p-8 sm:p-10">
//               <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 tracking-tight">
//                 {errorModal.type === 'success' ? 'Success' : errorModal.type === 'info' ? 'Info' : 'Error'}
//               </h3>
//               <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">{errorModal.message}</p>
//               <button
//                 onClick={() => {
//                   errorModalRef.current?.close();
//                   setErrorModal({ isOpen: false, message: '', type: 'error' });
//                 }}
//                 className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${errorModal.type === 'success'
//                     ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-emerald-500/20'
//                     : errorModal.type === 'info'
//                       ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-blue-500/20'
//                       : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-red-500/20'
//                   }`}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </dialog>

//       {/* Signup Type Modal */}
//       <dialog ref={userTypeModalRef} className="modal backdrop:bg-black/50 backdrop-blur-sm">
//         <div className="modal-box p-0 max-w-md dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
//           <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
//           <button
//             onClick={() => userTypeModalRef.current?.close()}
//             className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//           <div className="p-8">
//             <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Create Account</h3>
//             <p className="text-gray-500 dark:text-gray-300 mb-6">Select your account type</p>
//             <div className="space-y-4 mb-6">
//               <div
//                 className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${signupType === 'individual'
//                     ? 'border-blue-500 bg-blue-50 dark:bg-gray-700 shadow-md'
//                     : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
//                   }`}
//                 onClick={() => setSignupType('individual')}
//               >
//                 <div className="flex items-start">
//                   <div
//                     className={`flex items-center justify-center h-6 w-6 rounded-full border-2 mr-3 mt-1 ${signupType === 'individual'
//                         ? 'border-blue-500 bg-blue-500'
//                         : 'border-gray-300 dark:border-gray-500'
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
//                     <h4 className="font-medium text-gray-800 dark:text-white">Individual Account</h4>
//                     <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
//                       For personal use and individual creators
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div
//                 className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${signupType === 'corporate'
//                     ? 'border-blue-500 bg-blue-50 dark:bg-gray-700 shadow-md'
//                     : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
//                   }`}
//                 onClick={() => setSignupType('corporate')}
//               >
//                 <div className="flex items-start">
//                   <div
//                     className={`flex items-center justify-center h-6 w-6 rounded-full border-2 mr-3 mt-1 ${signupType === 'corporate'
//                         ? 'border-blue-500 bg-blue-500'
//                         : 'border-gray-300 dark:border-gray-500'
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
//                     <h4 className="font-medium text-gray-800 dark:text-white">Business Account</h4>
//                     <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
//                       For companies and organizations
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={() => {
//                 if (signupType === 'individual')
//                   navigate('/individualSignUp', { state: { email, signupType: 'individual' } });
//                 else if (signupType === 'corporate')
//                   navigate('/corporateSignUp', { state: { email, signupType: 'corporate' } });
//                 userTypeModalRef.current?.close();
//               }}
//               disabled={!signupType}
//               className={`w-full py-3 rounded-lg font-medium text-white transition-all ${!signupType
//                   ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
//                   : 'bg-sky-600 hover:bg-blue-700 shadow-md'
//                 }`}
//             >
//               Continue
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5 ml-2 inline"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </dialog>
//     </div>
//   );
// };

// export default Login;














import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { EyeIcon, EyeOffIcon, TrendingUp, BarChart3, DollarSign, Activity } from 'lucide-react';
import { HiOutlineLogout } from 'react-icons/hi';
import GoogleLoginButton from './GoogleLoginButton';
import { FaRupeeSign } from 'react-icons/fa';
import Navbar from './Navbar';

const Login = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '', type: 'error' });
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const errorModalRef = useRef(null);
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const [showPassword, setShowPassword] = useState(false);

  // Get the previous page's pathname from location.state, default to '/'
  const from = location.state?.from || '/';

  useEffect(() => {
    if (errorModal.isOpen && errorModalRef.current) {
      errorModalRef.current.showModal();
    }
  }, [errorModal.isOpen]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setErrorModal({ isOpen: true, message: 'Logged out successfully!', type: 'success' });
    navigate('/');
  };

  const handleGoogleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    window.dispatchEvent(new Event('authChange'));
    if (onSuccess) onSuccess(userData);
    // Navigate to the previous page and reload
    navigate(from, { replace: true });
    setTimeout(() => window.location.reload(), 0);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE}/auth/login`,
        data,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200) {
        const { token, userType, email } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userType', userType);
        localStorage.setItem('userEmail', email);
        window.dispatchEvent(new Event('storage'));
        setErrorModal({ isOpen: true, message: 'Logged in successfully!', type: 'success' });
        setIsLoggedIn(true);
        if (onSuccess) onSuccess({ token, userType, email });
        reset();
        // Navigate to the previous page and reload
        navigate(from, { replace: true });
        setTimeout(() => window.location.reload(), 0);
      } else {
        setErrorModal({ isOpen: true, message: 'Invalid credentials', type: 'error' });
      }
    } catch (err) {
      if (err.response?.data?.error === 'Account not found. Please register again.') {
        setErrorModal({
          isOpen: true,
          message: 'Your account has been deleted. Please register with email to create a new account.',
          type: 'error',
        });
        setTimeout(() => {
          navigate('/emaillogin', { state: { from, email: data.email } });
          setErrorModal({ isOpen: false, message: '', type: 'error' });
        }, 2000);
      } else {
        setErrorModal({
          isOpen: true,
          message: err.response?.data?.message || 'Login failed. Check email and password.',
          type: 'error',
        });
      }
    }
  };

  return (
    <div className="font-sans text-gray-900 dark:text-gray-100 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col relative overflow-hidden">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
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
        <BarChart3 size={24} />
      </div>
      <div className="absolute bottom-1/3 left-20 text-sky-500">
        <DollarSign size={24} />
      </div>
      <div className="absolute bottom-20 right-24 text-red-500">
        <Activity size={24} />
      </div>
      <div className="absolute top-1/4 left-64 text-green-500">
        <FaRupeeSign size={24} />
      </div>

      {/* Login Form */}
      <div className="flex-grow flex items-center justify-center py-10 px-4 relative z-10">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-3 space-y-6 border border-gray-200 dark:border-gray-700 relative">
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
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">CMDA Access</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Sign in to your CMDA account</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                placeholder="user@example.com"
                {...register('email', { required: 'Email is required' })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              <Link
                to="/ForgotPassword"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Forgot Password?
              </Link>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-sky-600 text-white py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:from-blue-700 hover:to-sky-700"
            >
              Login
            </button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or Register with</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md">
                <GoogleLoginButton
                  className="w-full flex items-center justify-center py-3 text-gray-700 dark:text-gray-200 font-medium transition-all duration-300"
                  onSuccess={handleGoogleLoginSuccess}
                />
              </div>
              <Link
                to="/emaillogin"
                state={{ from }}
                className="flex items-center justify-center gap-3 w-full bg-slate-800 text-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-md hover:border-blue-400"
              >
                <svg className="w-5 h-5 text-gray-100 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                Sign in with Email
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Error/Success Modal */}
      <dialog ref={errorModalRef} className="modal z-[101] backdrop:bg-black/20 backdrop-blur-sm">
        <div className="modal-box p-0 max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
          <div
            className={`h-1 animate-gradient ${errorModal.type === 'success'
              ? 'bg-gradient-to-r from-green-500 via-green-600 to-green-500'
              : 'bg-gradient-to-r from-red-500 via-red-600 to-red-500'
              }`}
          />
          <button
            onClick={() => {
              errorModalRef.current?.close();
              setErrorModal({ isOpen: false, message: '', type: 'error' });
            }}
            className="absolute right-4 top-4 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200 transform hover:scale-110"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
              {errorModal.type === 'success' ? 'Success' : 'Error'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">{errorModal.message}</p>
            <button
              onClick={() => {
                errorModalRef.current?.close();
                setErrorModal({ isOpen: false, message: '', type: 'error' });
              }}
              className={`w-full mt-6 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg ${errorModal.type === 'success'
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                }`}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Login;

