import { useEffect, useRef, useState } from "react";
import './VoiceForm.css'
import { useNavigate } from "react-router-dom";

const fields = [
  { key: "name", label: "पूरा नाम", question: "कृपया अपना पूरा नाम बताइए" },
  { key: "age", label: "उम्र", question: "कृपया अपनी उम्र बताइए" },
  { key: "gender", label: "लिंग", question: "कृपया अपना जेंडर बताएं।" },
  { key: "height", label: "लंबाई (सेमी)", question: "कृपया अपनी लंबाई फुट और इंच में बताएं।" },
  { key: "weight", label: "वजन (किलो)", question: "कृपया अपना वजन किलो में बताइए" },
  { key: "address", label: "पता", question: "कृपया अपना पूरा पता बताइए" },
  { key: "genetic", label: "जेनेटिक समस्या", question: "क्या आपको कोई जेनेटिक समस्या है" },
  { key: "sugar", label: "ब्लड शुगर", question: "कृपया अपना ब्लड शुगर लेवल बताइए" },
  { key: "medical", label: "मेडिकल समस्या", question: "क्या आपको कोई पुरानी मेडिकल समस्या है" },
  { key: "aadhaar", label: "आधार नंबर", question: "कृपया अपना आधार नंबर बताइए" },
  { key: "symptoms", label: "वर्तमान लक्षण", question: "आपको अभी क्या लक्षण महसूस हो रहे हैं" }
];

export default function VoiceForm() {

  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [active, setActive] = useState(0);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [isFormComplete, setIsFormComplete] = useState(false);
  
  const recognitionRef = useRef(null);
  const isProcessingRef = useRef(false);
  const speechSupportedRef = useRef(true);
  const countdownTimerRef = useRef(null);
  const maxRetriesRef = useRef(2); // Maximum retry attempts per field
  const currentRetriesRef = useRef(0);

  // Check speech recognition support on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      speechSupportedRef.current = false;
      setError("आपका ब्राउज़र वॉइस रिकॉग्निशन सपोर्ट नहीं करता। कृपया मैन्युअल टाइप करें।");
    }
  }, []);

  // Check if form is complete and start countdown
  useEffect(() => {
    const allFilled = fields.every(field => data[field.key] && data[field.key].trim() !== "");
    
    if (allFilled && !isFormComplete) {
      setIsFormComplete(true);
      startCountdown();
    } else if (!allFilled && isFormComplete) {
      setIsFormComplete(false);
      stopCountdown();
    }
  }, [data, isFormComplete]);

  // Start 15-second countdown
  const startCountdown = async () => {
    stopCountdown(); // Clear any existing countdown
    
    await speak("फॉर्म पूरा हो गया है। 10 सेकंड में ऑटो सबमिट हो जाएगा।", "hi-IN");
    
    setCountdown(10);
    
    countdownTimerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          stopCountdown();
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Stop countdown
  const stopCountdown = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setCountdown(null);
  };

  // Auto-submit and navigate
  const handleAutoSubmit = async () => {
    console.log("Auto-submitting form data:", data);
    await speak("फॉर्म सबमिट हो रहा है।", "hi-IN");
    
    // Wait for speech to complete
    setTimeout(() => {
      // Navigate to health scanner
     navigate("/patient")
    }, 1000);
  };

  // Speak helper with promise-based completion
  const speak = (text, lang = "hi-IN") => {
    return new Promise((resolve) => {
      try {
        window.speechSynthesis.cancel();
        setSpeaking(true);
        
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = lang;
        utter.rate = 0.9;
        utter.pitch = 1.0;
        
        utter.onend = () => {
          setSpeaking(false);
          resolve();
        };
        
        utter.onerror = () => {
          setSpeaking(false);
          resolve();
        };
        
        window.speechSynthesis.speak(utter);
        
        // Fallback timeout
        setTimeout(() => {
          setSpeaking(false);
          resolve();
        }, text.length * 100 + 1000);
      } catch (err) {
        console.warn("TTS failed", err);
        setSpeaking(false);
        resolve();
      }
    });
  };

  const listenOnce = ({ lang = "hi-IN", mode = "text", timeout = 10000 } = {}) => {
    return new Promise((resolve) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        resolve(null);
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.lang = lang;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;
        
        let completed = false;

        recognition.onstart = () => {
          setListening(true);
        };

        recognition.onresult = (event) => {
          if (completed) return;
          completed = true;
          
          const transcript = event.results[0][0].transcript.trim();
          console.log("Recognized:", transcript);
          
          try {
            recognition.stop();
          } catch (e) {
            // ignore
          }
          
          if (mode === "digits") {
            const digits = transcript.replace(/\D+/g, "");
            resolve(digits || transcript || null);
          } else {
            resolve(transcript || null);
          }
        };

        recognition.onerror = (event) => {
          if (completed) return;
          completed = true;
          
          console.warn("Recognition error:", event.error);
          
          try {
            recognition.stop();
          } catch (e) {
            // ignore
          }
          
          resolve(null);
        };

        recognition.onend = () => {
          setListening(false);
          if (!completed) {
            completed = true;
            resolve(null);
          }
        };

        recognitionRef.current = recognition;
        recognition.start();

        // Timeout fallback
        setTimeout(() => {
          if (!completed) {
            completed = true;
            try {
              recognition.stop();
            } catch (e) {
              // ignore
            }
            resolve(null);
          }
        }, timeout);
        
      } catch (err) {
        console.error("Failed to start recognition:", err);
        setListening(false);
        resolve(null);
      }
    });
  };

  // Process the current field with retry logic
  const processField = async (fieldIndex) => {
    if (isProcessingRef.current || !speechSupportedRef.current) return;
    
    isProcessingRef.current = true;
    const field = fields[fieldIndex];
    
    if (!field) {
      isProcessingRef.current = false;
      return;
    }

    try {
      // Speak the question
      await speak(field.question, "hi-IN");
      
      // Wait a bit before listening
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Listen for response
      const mode = (field.key === "aadhaar" || field.key === "age") ? "digits" : "text";
      const result = await listenOnce({ lang: "hi-IN", mode, timeout: 12000 });
      
      if (result) {
        // Successful capture - reset retry counter
        currentRetriesRef.current = 0;
        
        // Update data
        setData((prev) => ({ ...prev, [field.key]: result }));
        
        // Confirmation feedback
        await speak("धन्यवाद", "hi-IN");
        
        // Move to next field
        await new Promise(resolve => setTimeout(resolve, 500));
        if (fieldIndex < fields.length - 1) {
          setActive(fieldIndex + 1);
        }
      } else {
        // No input detected - check retry count
        currentRetriesRef.current += 1;
        
        if (currentRetriesRef.current <= maxRetriesRef.current) {
          // Retry with feedback
          await speak("मैंने कुछ नहीं सुना। कृपया फिर से बोलें।", "hi-IN");
          
          // Wait a bit then retry the same field
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Retry by calling processField again recursively
          isProcessingRef.current = false;
          await processField(fieldIndex);
          return; // Important: return here to avoid setting isProcessingRef to false below
        } else {
          // Max retries reached
          currentRetriesRef.current = 0;
          await speak("कृपया इस फील्ड को मैन्युअल टाइप करें और अगली फील्ड के लिए क्लिक करें।", "hi-IN");
        }
      }
    } catch (err) {
      console.error("Error processing field:", err);
      currentRetriesRef.current = 0;
    } finally {
      isProcessingRef.current = false;
    }
  };

  // Trigger processing when active field changes
  useEffect(() => {
    // Reset retry counter when changing fields
    currentRetriesRef.current = 0;
    
    if (speechSupportedRef.current && active >= 0 && active < fields.length && !isFormComplete) {
      // Small delay to avoid rapid transitions
      const timer = setTimeout(() => {
        processField(active);
      }, 300);
      
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, isFormComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
        window.speechSynthesis.cancel();
        stopCountdown();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const handleReset = async () => {
    try {
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
    
    // Stop countdown and reset form
    stopCountdown();
    
    isProcessingRef.current = false;
    currentRetriesRef.current = 0;
    setData({});
    setActive(0);
    setListening(false);
    setSpeaking(false);
    setIsFormComplete(false);
    
    if (speechSupportedRef.current) {
      await speak("फॉर्म रीसेट हो गया है। शुरू कर रहे हैं।", "hi-IN");
    }
  };

  const handleSubmit = async () => {
    try {
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
    
    stopCountdown();
    
    console.log("Form data:", data);
    await speak("फॉर्म सबमिट हो रहा है।", "hi-IN");
    
    // Wait for speech then navigate
    setTimeout(() => {
      navigate("/patient");
    }, 1500);
  };

  const handleFieldClick = (index) => {
    if (index !== active && !isProcessingRef.current && !isFormComplete) {
      try {
        recognitionRef.current?.stop();
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
      isProcessingRef.current = false;
      currentRetriesRef.current = 0;
      setListening(false);
      setSpeaking(false);
      setActive(index);
    }
  };

  return (
    <div className="form-wrapper">
      <h1>आरोग्य मित्र – वॉइस आधारित स्वास्थ्य फॉर्म</h1>
      
      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}

      {/* Countdown Timer */}
      {countdown !== null && (
        <div className="countdown-banner">
          <div className="countdown-content">
            <span className="countdown-icon">⏱️</span>
            <span className="countdown-text">
              फॉर्म ऑटो-सबमिट होगा: <strong>{countdown}</strong> सेकंड में
            </span>
          </div>
          <div className="countdown-bar">
            <div 
              className="countdown-progress" 
              style={{ width: `${(countdown / 15) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="status-indicator">
        {speaking && <span className="status speaking">🔊 बोल रहा है...</span>}
        {listening && <span className="status listening">🎤 सुन रहा है... कृपया बोलें</span>}
        {!speaking && !listening && !isFormComplete && <span className="status idle">✓ तैयार</span>}
        {isFormComplete && <span className="status complete">✅ फॉर्म पूरा!</span>}
      </div>

      <form className="voice-form" onSubmit={(e) => e.preventDefault()}>
        {fields.map((field, index) => (
          <div
            key={field.key}
            className={`form-group ${index === active ? "active" : ""} ${data[field.key] ? "filled" : ""} ${isFormComplete ? "complete" : ""}`}
            onClick={() => handleFieldClick(index)}
          >
            <label>
              {field.label}
              {data[field.key] && <span className="checkmark"> ✓</span>}
            </label>
            <input
              type="text"
              value={data[field.key] || ""}
              onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
              placeholder="बोलें या टाइप करें..."
              onFocus={() => handleFieldClick(index)}
              disabled={isFormComplete}
            />
          </div>
        ))}
      </form>

      <div className="button-group">
        <button className="btn btn-reset" onClick={handleReset}>
          🔄 फिर से शुरू करें
        </button>
        <button 
          className="btn btn-submit" 
          onClick={handleSubmit}
          disabled={!isFormComplete && fields.some(f => !data[f.key])}
        >
          ✅ अभी जमा करें
        </button>
      </div>
      
      <div className="instructions">
        <p>💡 <strong>निर्देश:</strong> प्रत्येक प्रश्न सुनें और जवाब बोलें। या मैन्युअल टाइप करें।</p>
        {isFormComplete && (
          <p className="complete-message">
            🎉 फॉर्म पूरा हो गया! 15 सेकंड में ऑटो-सबमिट होगा या "अभी जमा करें" पर क्लिक करें।
          </p>
        )}
      </div>
    </div>
  );

}
