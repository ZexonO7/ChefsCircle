
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  loading?: boolean;
  error?: string;
  success?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({ 
  length = 6, 
  onComplete, 
  loading = false, 
  error, 
  success = false 
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    const otpValue = newOtp.join('');
    if (otpValue.length === length) {
      onComplete(otpValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const pasteArray = pasteData.slice(0, length).split('');
    
    if (pasteArray.every(char => !isNaN(Number(char)))) {
      const newOtp = new Array(length).fill('');
      pasteArray.forEach((char, index) => {
        if (index < length) newOtp[index] = char;
      });
      setOtp(newOtp);
      
      if (pasteArray.length === length) {
        onComplete(pasteArray.join(''));
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-3 justify-center mb-4">
        {otp.map((value, index) => (
          <motion.input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none transition-colors ${
              error 
                ? 'border-red-400 bg-red-50' 
                : success 
                ? 'border-green-400 bg-green-50' 
                : 'border-chef-royal-blue/20 focus:border-chef-royal-blue'
            }`}
            disabled={loading}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
      
      {error && (
        <motion.div
          className="flex items-center gap-2 text-red-600 text-sm justify-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.div>
      )}
      
      {success && (
        <motion.div
          className="flex items-center gap-2 text-green-600 text-sm justify-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CheckCircle className="w-4 h-4" />
          <span>Verification successful!</span>
        </motion.div>
      )}
    </div>
  );
};

export default OTPInput;
