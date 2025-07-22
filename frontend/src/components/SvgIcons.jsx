const SvgIcon = ({ name, size = 24, className = '', ...props }) => {
  const iconStyle = {
    width: size,
    height: size,
    display: 'inline-block',
    verticalAlign: 'middle',
    ...props.style
  };

  const icons = {
    // Medical & Healthcare
    hospital: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M18,14H14V18H10V14H6V10H10V6H14V10H18V14Z"/>
      </svg>
    ),
    stethoscope: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M19.5,3.5L18,5L19.5,6.5L21,5L19.5,3.5M17.5,9.5C17.5,8.1 18.6,7 20,7S22.5,8.1 22.5,9.5C22.5,10.9 21.4,12 20,12C20,14.4 18.4,16 16,16H15V14.5C15,13.1 13.9,12 12.5,12H10V10C10,7.8 8.2,6 6,6S2,7.8 2,10V11C2,13.2 3.8,15 6,15H8V17C8,18.1 8.9,19 10,19H12.5C15.5,19 18,16.5 18,13.5V12C18.8,11.2 19.5,10.4 19.5,9.5M6,13C4.9,13 4,12.1 4,11V10C4,8.9 4.9,8 6,8S8,8.9 8,9V11C8,12.1 7.1,13 6,13Z"/>
      </svg>
    ),
    pill: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M4.22,11.29L11.29,4.22C13.64,1.88 17.43,1.88 19.78,4.22C22.12,6.56 22.12,10.36 19.78,12.71L12.71,19.78C10.36,22.12 6.56,22.12 4.22,19.78C1.88,17.43 1.88,13.64 4.22,11.29M5.64,12.71C4.59,13.75 4.24,15.24 4.64,16.64L10.29,11L5.64,12.71M12.71,5.64C13.75,4.59 15.24,4.24 16.64,4.64L11,10.29L12.71,5.64Z"/>
      </svg>
    ),
    doctor: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,5V11A3,3 0 0,1 12,2M21,9V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V9A1,1 0 0,1 4,8H8V10A4,4 0 0,0 12,14A4,4 0 0,0 16,10V8H20A1,1 0 0,1 21,9Z"/>
      </svg>
    ),
    emergency: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M12,2L13.09,8.26L22,9L14,12L22,15L13.09,15.74L12,22L10.91,15.74L2,15L10,12L2,9L10.91,8.26L12,2Z"/>
      </svg>
    ),
    
    // User & People
    person: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
      </svg>
    ),
    male: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M9,9C10.29,9 11.5,9.41 12.47,10.11L17.58,5H13V3H21V11H19V6.41L13.89,11.5C14.59,12.5 15,13.7 15,15A6,6 0 0,1 9,21A6,6 0 0,1 3,15A6,6 0 0,1 9,9M9,11A4,4 0 0,0 5,15A4,4 0 0,0 9,19A4,4 0 0,0 13,15A4,4 0 0,0 9,11Z"/>
      </svg>
    ),
    female: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M12,4A6,6 0 0,1 18,10A6,6 0 0,1 12,16A6,6 0 0,1 6,10A6,6 0 0,1 12,4M12,6A4,4 0 0,0 8,10A4,4 0 0,0 12,14A4,4 0 0,0 16,10A4,4 0 0,0 12,6M12,16V18H14V20H12V22H10V20H8V18H10V16H12Z"/>
      </svg>
    ),
    people: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M16,4C18.2,4 20,5.8 20,8C20,10.2 18.2,12 16,12C13.8,12 12,10.2 12,8C12,5.8 13.8,4 16,4M16,14C18.7,14 24,15.3 24,18V20H8V18C8,15.3 13.3,14 16,14M8,4C10.2,4 12,5.8 12,8C12,10.2 10.2,12 8,12C5.8,12 4,10.2 4,8C4,5.8 5.8,4 8,4M8,14C10.7,14 16,15.3 16,18V20H0V18C0,15.3 5.3,14 8,14Z"/>
      </svg>
    ),
    
    // Technology & Communication
    mobile: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z"/>
      </svg>
    ),
    phone: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
      </svg>
    ),
    chat: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3Z"/>
      </svg>
    ),
    video: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z"/>
      </svg>
    ),
    globe: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M17.9,17.39C17.64,16.58 16.9,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39Z"/>
      </svg>
    ),
    
    // Interface & Actions
    search: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
      </svg>
    ),
    home: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
      </svg>
    ),
    calendar: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/>
      </svg>
    ),
    clipboard: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3Z"/>
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
      </svg>
    ),
    
    // Status & Feedback
    checkCircle: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
      </svg>
    ),
    info: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
      </svg>
    ),
    error: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/>
      </svg>
    ),
    
    // Documents & Files
    document: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
      </svg>
    ),
    edit: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
      </svg>
    ),
    save: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"/>
      </svg>
    ),
    
    // Security & Lock
    lock: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
      </svg>
    ),
    id: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M2,3H22C23.05,3 24,3.95 24,5V19C24,20.05 23.05,21 22,21H2C0.95,21 0,20.05 0,19V5C0,3.95 0.95,3 2,3M14,6V7H22V6H14M14,8V9H21.5L22,9V8H14M14,10V11H21V10H14M8,13.91C6,13.91 2,15 2,17V18H14V17C14,15 10,13.91 8,13.91M8,6A3,3 0 0,0 5,9A3,3 0 0,0 8,12A3,3 0 0,0 11,9A3,3 0 0,0 8,6Z"/>
      </svg>
    ),
    
    // Chart & Analytics
    chart: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M22,21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21Z"/>
      </svg>
    ),
    trending: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
      </svg>
    ),
    
    // Time & Clock
    clock: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z"/>
      </svg>
    ),
    
    // Notifications & Alerts
    bell: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21"/>
      </svg>
    ),
    
    // Gender symbols
    gender: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M12,4A6,6 0 0,1 18,10A6,6 0 0,1 12,16A6,6 0 0,1 6,10A6,6 0 0,1 12,4M12,6A4,4 0 0,0 8,10A4,4 0 0,0 12,14A4,4 0 0,0 16,10A4,4 0 0,0 12,6Z"/>
      </svg>
    ),
    
    // Loading spinner
    loading: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z">
          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
        </path>
      </svg>
    ),
    
    // Export/Import
    export: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
      </svg>
    ),
    
    // Robot/AI
    robot: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/>
      </svg>
    ),
    
    // Fever/Temperature
    thermometer: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z"/>
      </svg>
    ),
    
    // Heart
    heart: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
      </svg>
    ),
    
    // Cough/Mask
    mask: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,13L13.5,7.5C13.1,6.4 12.1,5.5 10.9,5.5H7.1C5.9,5.5 4.9,6.4 4.5,7.5L3,13L9,7V9H21M7.5,12A1.5,1.5 0 0,1 9,10.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 9,13.5A1.5,1.5 0 0,1 7.5,12M16.5,12A1.5,1.5 0 0,1 18,10.5A1.5,1.5 0 0,1 19.5,12A1.5,1.5 0 0,1 18,13.5A1.5,1.5 0 0,1 16.5,12Z"/>
      </svg>
    ),
    
    // Light bulb
    lightbulb: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z"/>
      </svg>
    ),
    
    // Plus/Add
    plus: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
      </svg>
    ),
    
    // Close/X
    close: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle} className={className} {...props}>
        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
      </svg>
    )
  };

  if (!icons[name]) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return icons[name];
};

export default SvgIcon;


export const HospitalIcon = (props) => <SvgIcon name="hospital" {...props} />;
export const StethoscopeIcon = (props) => <SvgIcon name="stethoscope" {...props} />;
export const PillIcon = (props) => <SvgIcon name="pill" {...props} />;
export const DoctorIcon = (props) => <SvgIcon name="doctor" {...props} />;
export const EmergencyIcon = (props) => <SvgIcon name="emergency" {...props} />;
export const PersonIcon = (props) => <SvgIcon name="person" {...props} />;
export const MaleIcon = (props) => <SvgIcon name="male" {...props} />;
export const FemaleIcon = (props) => <SvgIcon name="female" {...props} />;
export const PeopleIcon = (props) => <SvgIcon name="people" {...props} />;
export const MobileIcon = (props) => <SvgIcon name="mobile" {...props} />;
export const PhoneIcon = (props) => <SvgIcon name="phone" {...props} />;
export const ChatIcon = (props) => <SvgIcon name="chat" {...props} />;
export const VideoIcon = (props) => <SvgIcon name="video" {...props} />;
export const GlobeIcon = (props) => <SvgIcon name="globe" {...props} />;
export const SearchIcon = (props) => <SvgIcon name="search" {...props} />;
export const HomeIcon = (props) => <SvgIcon name="home" {...props} />;
export const CalendarIcon = (props) => <SvgIcon name="calendar" {...props} />;
export const ClipboardIcon = (props) => <SvgIcon name="clipboard" {...props} />;
export const SettingsIcon = (props) => <SvgIcon name="settings" {...props} />;
export const CheckCircleIcon = (props) => <SvgIcon name="checkCircle" {...props} />;
export const WarningIcon = (props) => <SvgIcon name="warning" {...props} />;
export const InfoIcon = (props) => <SvgIcon name="info" {...props} />;
export const ErrorIcon = (props) => <SvgIcon name="error" {...props} />;
export const DocumentIcon = (props) => <SvgIcon name="document" {...props} />;
export const EditIcon = (props) => <SvgIcon name="edit" {...props} />;
export const SaveIcon = (props) => <SvgIcon name="save" {...props} />;
export const LockIcon = (props) => <SvgIcon name="lock" {...props} />;
export const IdIcon = (props) => <SvgIcon name="id" {...props} />;
export const ChartIcon = (props) => <SvgIcon name="chart" {...props} />;
export const TrendingIcon = (props) => <SvgIcon name="trending" {...props} />;
export const ClockIcon = (props) => <SvgIcon name="clock" {...props} />;
export const BellIcon = (props) => <SvgIcon name="bell" {...props} />;
export const GenderIcon = (props) => <SvgIcon name="gender" {...props} />;
export const LoadingIcon = (props) => <SvgIcon name="loading" {...props} />;
export const ExportIcon = (props) => <SvgIcon name="export" {...props} />;
export const RobotIcon = (props) => <SvgIcon name="robot" {...props} />;
export const ThermometerIcon = (props) => <SvgIcon name="thermometer" {...props} />;
export const HeartIcon = (props) => <SvgIcon name="heart" {...props} />;
export const MaskIcon = (props) => <SvgIcon name="mask" {...props} />;
export const LightbulbIcon = (props) => <SvgIcon name="lightbulb" {...props} />;
export const PlusIcon = (props) => <SvgIcon name="plus" {...props} />;
export const CloseIcon = (props) => <SvgIcon name="close" {...props} />;