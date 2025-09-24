


// ----- promo code chnages shreya ----

// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { useAuth } from './AuthContext';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import toast from 'react-hot-toast';

// const PromoCodeModal = ({ isOpen, onClose, onSubmit, email }) => {
//   const [promoCode, setPromoCode] = useState('');

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//           Welcome, {email}!
//         </h2>
//         <p className="text-gray-600 dark:text-gray-300 mb-4">
//           Do you have a promo code? (Optional)
//         </p>
//         <input
//           type="text"
//           value={promoCode}
//           onChange={(e) => setPromoCode(e.target.value)}
//           placeholder="Enter promo code"
//           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-4"
//         />
//         <div className="flex justify-end gap-4">
//           <button
//             onClick={() => onSubmit(promoCode)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Submit
//           </button>
//           <button
//             onClick={() => onSubmit('')}
//             className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
//           >
//             Skip
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const GoogleLoginButton = ({ onClose }) => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [showPromoModal, setShowPromoModal] = useState(false);
//   const [pendingData, setPendingData] = useState(null);

//   const currentDomain = window.location.hostname;
//   const isWWW = currentDomain.startsWith('www.');
//   const API_BASE = isWWW
//     ? import.meta.env.WWW_VITE_URL || 'https://www.cmdahub.com/api'
//     : import.meta.env.VITE_URL || 'https://cmdahub.com/api';
//   const AUTH_ENDPOINT = isWWW ? '/auth/google/google-www' : '/auth/google';
//   const clientId = isWWW
//     ? import.meta.env.VITE_GOOGLE_CLIENT_WWW_ID
//     : import.meta.env.VITE_GOOGLE_CLIENT_ID;

//   const handleSuccess = async (credentialResponse) => {
//     console.log('Google Credential:', credentialResponse.credential);
//     try {
//       const response = await axios.post(
//         `${API_BASE}${AUTH_ENDPOINT}`,
//         { credential: credentialResponse.credential },
//         {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//       console.log('Backend Response:', response.data);
//       if (response.data.pendingToken || response.data.status === 'new_user') {
//         console.log('New user detected, showing promo modal');
//         setPendingData({
//           pendingToken: response.data.pendingToken || null,
//           email: response.data.email,
//           name: response.data.name,
//           picture: response.data.profilePicture || response.data.picture,
//         });
//         setShowPromoModal(true);
//       } else {
//         console.log('Existing user, logging in');
//         const { token, email, name, userType, picture } = response.data;
//         login(token);
//         localStorage.setItem('userType', userType || 'individual');
//         localStorage.setItem('userName', name);
//         localStorage.setItem('profilePicture', picture);
//         window.dispatchEvent(new Event('storage'));
//         window.dispatchEvent(new Event('authChange'));
//         toast.success('Logged in with Google successfully!');
//         if (onClose) onClose();
//         navigate('/');
//       }
//     } catch (error) {
//       console.error('Google Sign-In Failed:', error.response?.data || error.message);
//       toast.error(error.response?.data || 'Failed to sign in with Google.');
//     }
//   };

//   const handlePromoSubmit = async (promoCode) => {
//     if (!pendingData) {
//       console.error('No pending data for promo submission');
//       return;
//     }
//     console.log('Submitting promo code:', promoCode);
//     try {
//       const response = await axios.post(
//         `${API_BASE}/auth/google/complete`,
//         {
//           pendingToken: pendingData.pendingToken || '',
//           promoCode: promoCode || '',
//         },
//         {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//       console.log('Complete Registration Response:', response.data);
//       const { token, email, name, userType, picture } = response.data;
//       login(token);
//       localStorage.setItem('userType', userType || 'individual');
//       localStorage.setItem('userName', name);
//       localStorage.setItem('profilePicture', picture);
//       window.dispatchEvent(new Event('storage'));
//       window.dispatchEvent(new Event('authChange'));
//       toast.success('Registered with Google successfully!');
//       setShowPromoModal(false);
//       setPendingData(null);
//       if (onClose) onClose();
//       navigate('/');
//     } catch (error) {
//       console.error('Google Registration Failed:', error.response?.data || error.message);
//       toast.error(error.response?.data || 'Failed to complete registration.');
//     }
//   };

//   const handleError = () => {
//     console.error('Google Sign-In Error');
//     toast.error('An error occurred during Google Sign-In.');
//   };

//   return (
//     <>
//       <GoogleOAuthProvider clientId={clientId}>
//         <div className="w-full">
//           <GoogleLogin
//             onSuccess={handleSuccess}
//             onError={handleError}
//             flow="auth-code"
//             redirect_uri={isWWW ? 'https://www.cmdahub.com/auth/google/callback' : 'https://cmdahub.com/auth/google/callback'}
//             render={(renderProps) => (
//               <button
//                 type="button"
//                 className="flex items-center w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm text-gray-800 dark:text-white overflow-hidden"
//                 onClick={renderProps.onClick}
//                 disabled={renderProps.disabled}
//               >
//                 <img src="/Google_logo.png" alt="Google" className="w-5 h-5 mr-2" />
//                 <span className="truncate">Google</span>
//               </button>
//             )}
//           />
//         </div>
//       </GoogleOAuthProvider>
//       <PromoCodeModal
//         isOpen={showPromoModal}
//         onClose={() => setShowPromoModal(false)}
//         onSubmit={handlePromoSubmit}
//         email={pendingData?.email || ''}
//       />
//     </>
//   );
// };

// export default GoogleLoginButton;



// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { useAuth } from './AuthContext';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import toast from 'react-hot-toast';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import { FaPhone } from 'react-icons/fa';

// const PromoCodeModal = ({ isOpen, onClose, onSubmit, email }) => {
//   const [promoCode, setPromoCode] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState(''); // Local number without country code
//   const [countryCode, setCountryCode] = useState('+91'); // Default country code
//   const [fullPhone, setFullPhone] = useState(''); // Full value for PhoneInput display

//   if (!isOpen) return null;

//   const handlePromoSubmit = (promo, phone, country) => {
//     if (promo && !phone) {
//       toast.error('Mobile number is required when entering a promo code');
//       return; // Do not close modal or submit
//     }
//     // Submit and close if:
//     // 1. Phone number is provided (with or without promo code), or
//     // 2. Both are empty (skip case)
//     if (phone || (!promo && !phone)) {
//       onSubmit(promo || '', { number: phone || '', countryCode: country || '+91' });
//       onClose();
//     }
//   };

//   const handleSkip = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     // Check current state: Prevent skip if promo entered without phone
//     if (promoCode && !phoneNumber) {
//       toast.error('Mobile number is required when entering a promo code');
//       return; // Do not close modal or submit
//     }
//     handlePromoSubmit('', '', countryCode);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//           Welcome, {email}!
//         </h2>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             {promoCode ? <span className="text-red-500">*</span> : null} Contact Number {promoCode ? '' : '(Optional)'}
//           </label>
//           <div className="relative group">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <FaPhone className="text-gray-400 group-hover:text-sky-500 transition-colors" />
//             </div>
//            {/* <PhoneInput
//               country={'in'}
//               value={fullPhone}
//               onChange={(value, country) => {
//                 setFullPhone(value);
//                 setCountryCode('+' + country.dialCode);
//                 setPhoneNumber(value.slice(country.dialCode.length + 1)); // Separate local number (remove + and dialCode)
//               }}
//               inputClass="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-sky-400"
//               placeholder="Enter phone number"
//             />*/}

//           <PhoneInput
//               country={'in'}
//               value={fullPhone}
//               onChange={(value, country) => {
//                 setFullPhone(value); // Store full value for display
//                 const dialCode = '+' + country.dialCode; // e.g., "+91"
//                 setCountryCode(dialCode);
//                 // Extract local number: Remove country code if present
//                 if (value.startsWith(dialCode)) {
//                   setPhoneNumber(value.slice(dialCode.length)); // Remove "+91" to get "9999999999"
//                 } else {
//                   setPhoneNumber(value); // Use as-is if no country code (e.g., user types local number)
//                 }
//               }}
//               inputClass="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-sky-400"
//               placeholder="Enter phone number"
//             />


//           </div>
//         </div>
//         <p className="text-gray-600 dark:text-gray-300 mt-4 mb-2">
//           Do you have a promo code? (Optional)
//         </p>
//         <input
//           type="text"
//           value={promoCode}
//           onChange={(e) => setPromoCode(e.target.value)}
//           placeholder="Enter promo code"
//           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-4"
//         />
//         <div className="flex justify-end gap-4">
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               handlePromoSubmit(promoCode, phoneNumber, countryCode);
//             }}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Submit
//           </button>
//           <button
//             onClick={handleSkip}
//             className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
//           >
//             Skip
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const GoogleLoginButton = ({ onClose }) => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [showPromoModal, setShowPromoModal] = useState(false);
//   const [pendingData, setPendingData] = useState(null);

//   const currentDomain = window.location.hostname;
//   const isWWW = currentDomain.startsWith('www.');
//   const API_BASE = isWWW
//     ? import.meta.env.WWW_VITE_URL || 'https://www.cmdahub.com/api'
//     : import.meta.env.VITE_URL || 'https://cmdahub.com/api';
//   const AUTH_ENDPOINT = isWWW ? '/auth/google/google-www' : '/auth/google';
//   const clientId = isWWW
//     ? import.meta.env.VITE_GOOGLE_CLIENT_WWW_ID
//     : import.meta.env.VITE_GOOGLE_CLIENT_ID;

//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       const response = await axios.post(
//         `${API_BASE}${AUTH_ENDPOINT}`,
//         { credential: credentialResponse.credential },
//         {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//       if (response.data.pendingToken) {
//         setPendingData({
//           pendingToken: response.data.pendingToken || null,
//           email: response.data.email,
//           name: response.data.name,
//           picture: response.data.picture,
//         });
//         setShowPromoModal(true);
//       } else {
//         const { token, email, name, userType, picture } = response.data;
//         login(token);
//         localStorage.setItem('userType', userType || 'individual');
//         localStorage.setItem('userName', name);
//         localStorage.setItem('profilePicture', picture);
//         window.dispatchEvent(new Event('storage'));
//         window.dispatchEvent(new Event('authChange'));
//         toast.success('Logged in with Google successfully!');
//         if (onClose) onClose();
//         navigate('/');
//       }
//     } catch (error) {
//       console.error('Google Sign-In Failed:', error.response?.data || error.message);
//       toast.error(error.response?.data || 'Failed to sign in with Google.');
//     }
//   };

//   const handleGoogleSubmit = async (promoCode, phone) => {
//     if (!pendingData) {
//       console.error('No pending data for promo submission');
//       toast.error('No pending data for registration.');
//       setShowPromoModal(false);
//       if (onClose) onClose();
//       return;
//     }

//     const payload = {
//       pendingToken: pendingData.pendingToken || '',
//       promoCode: promoCode || '',
//       countryCode: phone.countryCode || '+91',
//       mobileNum: phone.number || '',
//     };

//     try {
//       const response = await axios.post(
//         `${API_BASE}/auth/google/complete`,
//         payload,
//         {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//       const { token, email, name, userType, picture } = response.data;
//       login(token);
//       localStorage.setItem('userType', userType || 'individual');
//       localStorage.setItem('userName', name);
//       localStorage.setItem('profilePicture', picture);
//       window.dispatchEvent(new Event('storage'));
//       window.dispatchEvent(new Event('authChange'));
//       toast.success('Registered with Google successfully!');
//       setShowPromoModal(false);
//       setPendingData(null);
//       if (onClose) onClose();
//       navigate('/');
//     } catch (error) {
//       console.error('Google Registration Failed:', error.response?.data || error.message);
//       toast.error(error.response?.data || 'Failed to complete registration.');
//       setShowPromoModal(false);
//       if (onClose) onClose();
//     }
//   };

//   const handleError = () => {
//     console.error('Google Sign-In Error');
//     toast.error('An error occurred during Google Sign-In.');
//   };

//   return (
//     <>
//       <GoogleOAuthProvider clientId={clientId}>
//         <div className="w-full">
//           <GoogleLogin
//             onSuccess={handleGoogleSuccess}
//             onError={handleError}
//             render={(renderProps) => (
//               <button
//                 type="button"
//                 className="flex items-center w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm text-gray-800 dark:text-white overflow-hidden"
//                 onClick={renderProps.onClick}
//                 disabled={renderProps.disabled}
//               >
//                 <img src="/Google_logo.png" alt="Google" className="w-5 h-5 mr-2" />
//                 <span className="truncate">Google</span>
//               </button>
//             )}
//           />
//         </div>
//       </GoogleOAuthProvider>
//       <PromoCodeModal
//         isOpen={showPromoModal}
//         onClose={() => {
//           setShowPromoModal(false);
//           setPendingData(null);
//           if (onClose) onClose();
//         }}
//         onSubmit={handleGoogleSubmit}
//         email={pendingData?.email || ''}
//       />
//     </>
//   );
// };

// export default GoogleLoginButton;



//not close modal // mobile number not compulsory logic 

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FaPhone } from 'react-icons/fa';

const PromoCodeModal = ({ isOpen, onClose, onSubmit, email }) => {
  const [promoCode, setPromoCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Local number without country code
  const [countryCode, setCountryCode] = useState('+91'); // Default country code
  const [fullPhone, setFullPhone] = useState(''); // Full value for PhoneInput display

  if (!isOpen) return null;

  const handlePromoSubmit = (promo, phone, country) => {
    // Do not call onClose here; let the parent handle it based on submission result
    onSubmit(promo || '', { number: phone || '', countryCode: country || '+91' });
  };

  const handleSkip = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Do not call onClose here; let the parent handle it
    handlePromoSubmit('', '', countryCode);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Welcome, {email}!
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contact Number (Optional)
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaPhone className="text-gray-400 group-hover:text-sky-500 transition-colors" />
            </div>
            <PhoneInput
              country={'in'}
              value={fullPhone}
              onChange={(value, country) => {
                setFullPhone(value); // Store full value for display
                const dialCode = '+' + country.dialCode; // e.g., "+91"
                setCountryCode(dialCode);
                // Extract local number: Remove country code if present
                if (value.startsWith(dialCode)) {
                  setPhoneNumber(value.slice(dialCode.length)); // Remove "+91" to get "9999999999"
                } else {
                  setPhoneNumber(value); // Use as-is if no country code
                }
              }}
              inputClass="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-sky-400"
              placeholder="Enter phone number (optional)"
            />
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-4 mb-2">
          Do you have a promo code? (Optional)
        </p>
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Enter promo code"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-4"
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePromoSubmit(promoCode, phoneNumber, countryCode);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
          <button
            onClick={handleSkip}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

const GoogleLoginButton = ({ onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const currentDomain = window.location.hostname;
  const isWWW = currentDomain.startsWith('www.');
  const API_BASE = isWWW
    ? import.meta.env.WWW_VITE_URL || 'https://www.cmdahub.com/api'
    : import.meta.env.VITE_URL || 'https://cmdahub.com/api';
  const AUTH_ENDPOINT = isWWW ? '/auth/google/google-www' : '/auth/google';
  const clientId = isWWW
    ? import.meta.env.VITE_GOOGLE_CLIENT_WWW_ID
    : import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        `${API_BASE}${AUTH_ENDPOINT}`,
        { credential: credentialResponse.credential },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (response.data.pendingToken) {
        setPendingData({
          pendingToken: response.data.pendingToken || null,
          email: response.data.email,
          name: response.data.name,
          picture: response.data.picture,
        });
        setShowPromoModal(true);
      } else {
        const { token, email, name, userType, picture } = response.data;
        login(token);
        localStorage.setItem('userType', userType || 'individual');
        localStorage.setItem('userName', name);
        localStorage.setItem('profilePicture', picture);
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('authChange'));
        toast.success('Logged in with Google successfully!');
        if (onClose) onClose();
        navigate('/');
      }
    } catch (error) {
      console.error('Google Sign-In Failed:', error.response?.data || error.message);
      toast.error(error.response?.data || 'Failed to sign in with Google.');
    }
  };

  const handleGoogleSubmit = async (promoCode, phone) => {
    if (!pendingData) {
      console.error('No pending data for promo submission');
      toast.error('No pending data for registration.');
      setShowPromoModal(false);
      if (onClose) onClose();
      return;
    }

    const payload = {
      pendingToken: pendingData.pendingToken || '',
      promoCode: promoCode || '',
      countryCode: phone.countryCode || '+91',
      mobileNum: phone.number || '',
    };

    try {
      const response = await axios.post(
        `${API_BASE}/auth/google/complete`,
        payload,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const { token, email, name, userType, picture } = response.data;
      login(token);
      localStorage.setItem('userType', userType || 'individual');
      localStorage.setItem('userName', name);
      localStorage.setItem('profilePicture', picture);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('authChange'));
      toast.success('Registered with Google successfully!');
      setShowPromoModal(false);
      setPendingData(null);
      if (onClose) onClose();
      navigate('/');
    } catch (error) {
      console.error('Google Registration Failed:', error.response?.data || error.message);
      const errorMessage = error.response?.data || 'Failed to complete registration.';
      if (errorMessage.includes('Promo code limit has been reached')) {
        toast.error('Promo code limit reached! 🚫 Maximum uses exceeded. Try another code.', {
          duration: 5000,
          icon: <FaPhone className="text-red-500" />,
        });
      } else if (errorMessage.includes('Invalid promo code')) {
        toast.error('Promo code is invalid! ❌ Please check and try again.', {
          duration: 5000,
          icon: <FaPhone className="text-red-500" />,
        });
      } else if (errorMessage.includes('not valid or has expired')) {
        toast.error('Promo code has expired! ⏰ Use a valid active code.', {
          duration: 5000,
          icon: <FaPhone className="text-red-500" />,
        });
      } else {
        toast.error(errorMessage, {
          duration: 5000,
          icon: <FaPhone className="text-red-500" />,
        });
        setShowPromoModal(false); // Close only for non-promo errors
        if (onClose) onClose();
      }
    }
  };

  const handleError = () => {
    console.error('Google Sign-In Error');
    toast.error('An error occurred during Google Sign-In.');
  };

  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <div className="w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleError}
            render={(renderProps) => (
              <button
                type="button"
                className="flex items-center w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm text-gray-800 dark:text-white overflow-hidden"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                <img src="/Google_logo.png" alt="Google" className="w-5 h-5 mr-2" />
                <span className="truncate">Google</span>
              </button>
            )}
          />
        </div>
      </GoogleOAuthProvider>
      <PromoCodeModal
        isOpen={showPromoModal}
        onClose={() => {
          setShowPromoModal(false);
          setPendingData(null);
          if (onClose) onClose();
        }}
        onSubmit={handleGoogleSubmit}
        email={pendingData?.email || ''}
      />
    </>
  );
};

export default GoogleLoginButton;