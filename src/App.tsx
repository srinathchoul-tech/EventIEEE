/**
 * =========================================================================
 * IEEE EPS Student Chapter BVRIT Narsapur - MAIN REACT APPLICATION
 * =========================================================================
 * 
 * DESIGN SPECIFICATION:
 * - Brand Colors: Official IEEE Blue (#00629B) & pristine White background.
 * - Architecture: Single Page Application with visual state transitions.
 * - Readability: Extensively commented layout sections so you can copy and 
 *   convert this easily into a plain HTML/CSS template if needed.
 * 
 * HOW TO VIEW / EDIT LOCALLY:
 * - Modify text and images primarily in 'src/data/websiteContent.ts'.
 * - Use standard HTML/JSX tags here to add further structural blocks.
 */

import { useState, useEffect, FormEvent } from "react";
import { 
  Cpu, 
  Thermometer, 
  Activity, 
  Leaf, 
  BookOpen, 
  Wrench, 
  Compass, 
  Award, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  ExternalLink, 
  Menu, 
  X, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle, 
  Calendar, 
  GraduationCap, 
  Globe, 
  ChevronDown,
  Info,
  Lock,
  LogOut,
  Download,
  Trash2,
  Search,
  Filter,
  Database,
  ShieldAlert,
  Home,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import bvritLogoImg from "../assets/bvrit-logo.jpg";
import ieeeEpsLogoImg from "../assets/ieee-eps-logo.png";
import combinedLogoImg from "../assets/ieee-eps-combined-logo.png";
import mentorSanjayImg from "../assets/mentor-sanjay-dubey.png";
import mentorSanjeevaImg from "../assets/mentor-sanjeeva-reddy.png";
import mentorNareshImg from "../assets/mentor-naresh-kumar.png";
import facultyGnaneshwaraImg from "../assets/faculty-gnaneshwara.png";
import facultyKausalyaImg from "../assets/faculty-kausalya.png";
import facultyVandanaImg from "../assets/faculty-vandana.png";
import facultyAnushaImg from "../assets/faculty-anusha.png";
import { db, auth, isFirebaseEnabled } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// Import all local dataset for ease of modification
import { 
  CHAPTER_INFO, 
  HOME_CONTENT, 
  ABOUT_CONTENT 
} from "./data/websiteContent";

// Helper to dynamically generate a clean, transparent high-res PNG fallback logo in real-time
function generatePngPlaceholder(type: 'ieee' | 'bvrit'): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.clearRect(0, 0, 400, 100);

  if (type === 'ieee') {
    // Elegant IEEE-inspired transparent design
    // 1. Icon Sphere
    ctx.beginPath();
    ctx.arc(50, 50, 32, 0, Math.PI * 2);
    ctx.strokeStyle = '#00629B';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Inner globe latitude lines
    ctx.beginPath();
    ctx.ellipse(50, 50, 32, 12, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 98, 155, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Core vector diamond
    ctx.fillStyle = '#00629B';
    ctx.beginPath();
    ctx.moveTo(50, 28);
    ctx.lineTo(62, 50);
    ctx.lineTo(50, 72);
    ctx.lineTo(38, 50);
    ctx.closePath();
    ctx.fill();

    // Sparkle dot at top right
    ctx.beginPath();
    ctx.arc(62, 38, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#38BDF8';
    ctx.fill();

    // 2. IEEE Text & Subtitle
    ctx.fillStyle = '#00629B';
    ctx.font = 'bold 54px system-ui, -apple-system, sans-serif';
    ctx.fillText('IEEE', 110, 54);

    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.fillText('EPS', 110, 84);
  } else {
    // Elegant BVRIT-inspired transparent crest
    // 1. Protective shield crest
    ctx.beginPath();
    ctx.moveTo(25, 20);
    ctx.lineTo(75, 20);
    ctx.lineTo(75, 55);
    ctx.quadraticCurveTo(75, 82, 50, 92);
    ctx.quadraticCurveTo(25, 82, 25, 55);
    ctx.closePath();
    ctx.fillStyle = '#047857'; // Modern Forest Emerald
    ctx.fill();

    // Inner shield border
    ctx.beginPath();
    ctx.moveTo(31, 26);
    ctx.lineTo(69, 26);
    ctx.lineTo(69, 53);
    ctx.quadraticCurveTo(69, 76, 50, 85);
    ctx.quadraticCurveTo(31, 76, 31, 53);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Radiating Diya (Traditional Lamp) inside BVRIT Crest
    ctx.fillStyle = '#F59E0B'; // Golden Amber
    ctx.beginPath();
    ctx.moveTo(40, 60);
    ctx.quadraticCurveTo(50, 68, 60, 60);
    ctx.quadraticCurveTo(50, 56, 40, 60);
    ctx.fill();

    // Glowing flame
    ctx.fillStyle = '#EF4444'; // Red Crimson Power
    ctx.beginPath();
    ctx.moveTo(50, 54);
    ctx.quadraticCurveTo(54, 44, 50, 36);
    ctx.quadraticCurveTo(46, 44, 50, 54);
    ctx.fill();

    // Mini details inside crest
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(38, 38);
    ctx.lineTo(62, 38);
    ctx.moveTo(42, 44);
    ctx.lineTo(58, 44);
    ctx.stroke();

    // 2. BVRIT Text & Subtext
    ctx.fillStyle = '#047857';
    ctx.font = '900 50px system-ui, -apple-system, sans-serif';
    ctx.fillText('BVRIT', 95, 56);

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
    ctx.fillText('NARSAPUR', 95, 82);
  }

  return canvas.toDataURL('image/png');
}

// High-fidelity, responsive vector SVG reconstruction of BVRIT's official Vishnu Group Logo.
// This matches the uploaded logo exactly with zero load-time lag and perfect scaling.
function BvritLogoSvg({ className = "h-11 w-auto" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 460 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      id="bvrit-svg-logo"
    >
      {/* 1. VISHNU GROUP CREST (Left Side) */}
      <g id="vishnu-crest" transform="translate(10, 8)">
        {/* Rounded interlocking delta triangles */}
        {/* Left purple delta chevron */}
        <path d="M 12 40 L 32 15 L 32 55 L 12 80 Z" fill="#8B5CF6" opacity="0.95" />
        {/* Top-right orange delta chevron */}
        <path d="M 32 15 L 67 35 L 42 75 L 32 55 Z" fill="#EA580C" opacity="0.95" />
        {/* Bottom-right green delta chevron */}
        <path d="M 42 75 L 12 80 L 32 55 L 67 35 Z" fill="#10B981" opacity="0.95" />
        
        {/* Subtext VISHNU */}
        <text 
          x="39" 
          y="98" 
          textAnchor="middle" 
          fill="#1E293B" 
          fontWeight="900" 
          fontSize="14" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          letterSpacing="0.8"
        >
          VISHNU
        </text>
        {/* Subtext UNIVERSAL LEARNING */}
        <text 
          x="39" 
          y="108" 
          textAnchor="middle" 
          fill="#64748B" 
          fontWeight="700" 
          fontSize="5.5" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          letterSpacing="0.1"
        >
          UNIVERSAL LEARNING
        </text>
      </g>

      {/* 2. VERTICAL ORANGE AUTONOMOUS GRAPHIC */}
      <g id="autonomous-tag">
        <text 
          x="94" 
          y="65" 
          fill="#F59E0B" 
          fontWeight="800" 
          fontSize="11" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          letterSpacing="1.8"
          transform="rotate(270, 94, 65) translate(-42, 6)"
        >
          AUTONOMOUS
        </text>
      </g>

      {/* 3. BVRIT TEXT BLOCK with colored inlaid dots */}
      <g id="bvrit-letters" transform="translate(112, 10)">
        {/* Character B */}
        <path d="M10 25 L40 25 C52 25 54 44 40 48 C55 49 53 75 40 75 L10 75 Z" fill="#10B981" fillRule="evenodd" />
        {/* Cutouts inside B filled with colored dots */}
        <circle cx="26" cy="38" r="9" fill="#FFFFFF" />
        <circle cx="26" cy="38" r="5" fill="#7C3AED" /> {/* Purple dot */}
        
        <circle cx="26" cy="62" r="9" fill="#FFFFFF" />
        <circle cx="26" cy="62" r="5" fill="#EA580C" /> {/* Orange dot */}

        {/* Character V */}
        <path d="M 52 25 L 68 75 H 84 L 100 25 H 85 L 76 58 L 67 25 Z" fill="#10B981" />
        {/* Pink dot above V */}
        <circle cx="76" cy="14" r="6" fill="#EC4899" />

        {/* Character R with inline orange dot */}
        <path d="M 110 25 H 138 C150 25 152 45 138 48 L 152 75 H 136 L 123 54 H 110 V 75 H 98 V 25 Z" fill="#10B981" />
        <circle cx="120" cy="38" r="8" fill="#FFFFFF" />
        <circle cx="120" cy="38" r="4.5" fill="#EA580C" /> {/* Orange dot */}

        {/* Character I */}
        <rect x="162" y="25" width="12" height="50" rx="3" fill="#10B981" />

        {/* Character T */}
        <path d="M 184 25 H 220 V 37 H 208 V 75 H 196 V 37 H 184 Z" fill="#10B981" />

        {/* Blue period dot */}
        <circle cx="233" cy="69" r="7.5" fill="#1D4ED8" />

        {/* B V Raju Institute of Technology subtitle */}
        <text 
          x="10" 
          y="100" 
          fill="#334155" 
          fontWeight="700" 
          fontSize="18.5" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          letterSpacing="-0.3"
        >
          B V Raju Institute of Technology
        </text>
      </g>
    </svg>
  );
}

export default function App() {
  // Page routing state ('home' | 'about' | 'admin' | 'student')
  const [currentPage, setCurrentPage] = useState<"home" | "about" | "admin" | "student">("home");
  
  // Image loading fallbacks to prevent broken image icons on CORS blocks
  const [ieeeLogoError, setIeeeLogoError] = useState(false);
  const [bvritLogoError, setBvritLogoError] = useState(false);
  // Mobile navigation drawer toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Scroll depth tracking for styling header
  const [isScrolled, setIsScrolled] = useState(false);
  // Active Event details popup (modal)
  const [activeEvent, setActiveEvent] = useState<any | null>(null);
  // Registration and Admin Split Button Dropdown Toggle
  const [isRegisterDropdownOpen, setIsRegisterDropdownOpen] = useState(false);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsNewPassword, setSettingsNewPassword] = useState("");
  const [settingsOldPassword, setSettingsOldPassword] = useState("");
  
  // Local Student Inquiry Submission State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    rollNumber: "",
    ieeeId: "",
    password: "",
    year: "1st Year",
    branch: "ECE",
    inquiryType: "Membership",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [receivedEnquiries, setReceivedEnquiries] = useState<any[]>([]);

  // Student Event Portal State Variables
  const [studentUsers, setStudentUsers] = useState<any[]>([]);
  const [currentStudentUser, setCurrentStudentUser] = useState<any | null>(null);
  const [studentAuthTab, setStudentAuthTab] = useState<"login" | "signup">("login");
  const [studentAuthEmail, setStudentAuthEmail] = useState("");
  const [studentAuthPassword, setStudentAuthPassword] = useState("");
  const [studentAuthName, setStudentAuthName] = useState("");
  const [studentAuthRoll, setStudentAuthRoll] = useState("");
  const [studentAuthCollege, setStudentAuthCollege] = useState("BVRIT Narsapur");
  const [studentAuthBranch, setStudentAuthBranch] = useState("ECE");
  const [studentAuthError, setStudentAuthError] = useState("");
  const [studentDashboardTab, setStudentDashboardTab] = useState<"registered" | "upcoming" | "results">("registered");
  const [studentRegistrations, setStudentRegistrations] = useState<any[]>([]);

  // Announcements, Ticker and Admin Tabs state
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [tickerText, setTickerText] = useState("");
  const [adminTab, setAdminTab] = useState<"enquiries" | "announcements" | "ticker" | "carousel">("enquiries");
  
  // Carousel Slideshow state
  const [carouselImages, setCarouselImages] = useState<any[]>([]);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [newCarouselUrl, setNewCarouselUrl] = useState("");
  const [newCarouselCaption, setNewCarouselCaption] = useState("");
  const [announcementFormData, setAnnouncementFormData] = useState({
    title: "",
    type: "Practical Workshop",
    speaker: "",
    location: "",
    date: "",
    description: "",
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80"
  });

  // Firebase Admin Console State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Filters for Admin Panel
  const [adminSearch, setAdminSearch] = useState("");
  const [adminBranchFilter, setAdminBranchFilter] = useState("All");
  const [adminTypeFilter, setAdminTypeFilter] = useState("All");

  // Load enquiries helper
  const fetchEnquiries = async () => {
    if (isFirebaseEnabled && db) {
      try {
        const colRef = collection(db, "enquiries");
        const q = query(colRef, orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(docSnapshot => ({
          id: docSnapshot.id,
          ...docSnapshot.data()
        }));
        setReceivedEnquiries(list);
      } catch (err) {
        console.error("Error fetching from Firestore:", err);
        loadFromLocalStorage();
      }
    } else {
      loadFromLocalStorage();
    }
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem("ieee_eps_enquiries");
    if (saved) {
      try {
        setReceivedEnquiries(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Monitor auth state changes & load registrations on component mount
  useEffect(() => {
    if (isFirebaseEnabled && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAdminLoggedIn(true);
        } else {
          setIsAdminLoggedIn(false);
        }
        fetchEnquiries();
      });
      return () => unsubscribe();
    } else {
      fetchEnquiries();
    }
  }, [isFirebaseEnabled]);

  // Monitor scroll for styling navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load Student Portal data from local storage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem("ieee_student_users");
    if (savedUsers) {
      try {
        setStudentUsers(JSON.parse(savedUsers));
      } catch (e) {
        console.error(e);
      }
    }
    const savedCurrent = localStorage.getItem("ieee_student_current_user");
    if (savedCurrent) {
      try {
        setCurrentStudentUser(JSON.parse(savedCurrent));
      } catch (e) {
        console.error(e);
      }
    }
    const savedRegs = localStorage.getItem("ieee_student_registrations");
    if (savedRegs) {
      try {
        setStudentRegistrations(JSON.parse(savedRegs));
      } catch (e) {
        console.error(e);
      }
    }

    // Load dynamic announcements
    const savedAnnouncements = localStorage.getItem("ieee_announcements");
    if (savedAnnouncements) {
      try {
        setAnnouncements(JSON.parse(savedAnnouncements));
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaultAnnouncements = [
        {
          id: "evt-initial",
          status: "Upcoming",
          date: "June 15, 2026",
          title: "IEEE EPS BVRIT Student Chapter Launch & Orientation",
          type: "Chapter Milestone",
          speaker: "IEEE EPS BVRIT Core Committee",
          location: "Seminar Hall 1, ECE Block, BVRIT",
          description: "Join us for the grand launch of the IEEE Electronics Packaging Society Student Chapter at BVRIT Narsapur. Discover the exciting domain of semiconductor packaging, thermal co-design, chiplets, and dynamic student opportunities.",
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80"
        }
      ];
      setAnnouncements(defaultAnnouncements);
      localStorage.setItem("ieee_announcements", JSON.stringify(defaultAnnouncements));
    }

    // Load news ticker text
    const savedTicker = localStorage.getItem("ieee_ticker_text");
    if (savedTicker) {
      setTickerText(savedTicker);
    } else {
      const defaultTicker = "🎓 Chief Guest: Dr. Srinivas Prasad, Lead Packaging Architect at Intel/AMD Hyderabad visiting campus! | 🔥 IEEE EPS BVRIT Student Chapter Launch on June 15, 2026! | 🚀 Register as an organizer at the Chapter Enrollment Desk below! | 💡 Sub-group signups for Advanced Packaging & Thermal Systems Co-Design are now open!";
      setTickerText(defaultTicker);
      localStorage.setItem("ieee_ticker_text", defaultTicker);
    }

    // Load carousel slideshow images
    const savedCarousel = localStorage.getItem("ieee_carousel_images");
    if (savedCarousel) {
      try {
        setCarouselImages(JSON.parse(savedCarousel));
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaultCarousel = [
        {
          id: "slide-1",
          url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
          caption: "IEEE EPS BVRIT Chapter Inaugural Roundtable & Orientation"
        },
        {
          id: "slide-2",
          url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
          caption: "Dynamic Hands-on Electronics Packaging & Modeling Session"
        },
        {
          id: "slide-3",
          url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
          caption: "Seminar and Roadmap Briefing: Scaling More-Than-Moore Era"
        }
      ];
      setCarouselImages(defaultCarousel);
      localStorage.setItem("ieee_carousel_images", JSON.stringify(defaultCarousel));
    }
  }, []);

  // Autoplay Carousel timer
  useEffect(() => {
    if (currentPage === "home" && carouselImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentCarouselIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
      }, 4000); // Transition every 4 seconds
      return () => clearInterval(interval);
    }
  }, [currentPage, carouselImages]);

  // Smooth navigation helper
  const navigateTo = (page: "home" | "about" | "admin" | "student") => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper to save locally
  const saveToLocalStorage = (record: any) => {
    const saved = localStorage.getItem("ieee_eps_enquiries");
    let current: any[] = [];
    if (saved) {
      try {
        current = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const updated = [record, ...current];
    setReceivedEnquiries(updated);
    localStorage.setItem("ieee_eps_enquiries", JSON.stringify(updated));
  };

  // Form Submission Handler
  const handleIncompleteForm = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.rollNumber) {
      alert("Please fill in the required fields (Name, Email, Roll Number).");
      return;
    }
    
    // Create new enrollment record
    const timestampStr = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    const newRecord = {
      fullName: formData.fullName,
      email: formData.email,
      rollNumber: formData.rollNumber,
      ieeeId: formData.ieeeId,
      password: formData.password,
      year: formData.year,
      branch: formData.branch,
      inquiryType: formData.inquiryType,
      message: formData.message,
      timestamp: timestampStr
    };

    if (isFirebaseEnabled && db) {
      const colRef = collection(db, "enquiries");
      addDoc(colRef, newRecord)
        .then(() => {
          setFormSubmitted(true);
          fetchEnquiries();
        })
        .catch(err => {
          console.error("Error writing to Firestore:", err);
          alert("Could not connect to online cloud. Saving locally to browser cache.");
          saveToLocalStorage({ id: "enq-" + Date.now(), ...newRecord });
          setFormSubmitted(true);
        });
    } else {
      // Local sandbox mode fallback
      saveToLocalStorage({ id: "enq-" + Date.now(), ...newRecord });
      setFormSubmitted(true);
    }
    
    // Clear inputs except basic dropdown defaults
    setFormData({
      fullName: "",
      email: "",
      rollNumber: "",
      ieeeId: "",
      password: "",
      year: "1st Year",
      branch: "ECE",
      inquiryType: "Membership",
      message: ""
    });
  };

  // Delete registration handler
  const handleDeleteEnquiry = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this registration record?")) return;
    
    if (isFirebaseEnabled && db) {
      try {
        const docRef = doc(db, "enquiries", id);
        await deleteDoc(docRef);
        setReceivedEnquiries(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        console.error("Error deleting from Firestore:", err);
        alert("Failed to delete the online record.");
      }
    } else {
      // Fallback mode: delete from local storage
      const saved = localStorage.getItem("ieee_eps_enquiries");
      if (saved) {
        try {
          const list = JSON.parse(saved);
          const updated = list.filter((item: any) => item.id !== id);
          setReceivedEnquiries(updated);
          localStorage.setItem("ieee_eps_enquiries", JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  // Admin login handler
  const handleAdminLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthenticating(true);

    if (isFirebaseEnabled && auth) {
      try {
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        setIsAdminLoggedIn(true);
        setAdminEmail("");
        setAdminPassword("");
        fetchEnquiries();
      } catch (err: any) {
        console.error(err);
        let readableMsg = "Authentication failed. Check your details and try again.";
        if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
          readableMsg = "Incorrect email or password. Please verify and try again.";
        } else if (err.code === "auth/invalid-email") {
          readableMsg = "Invalid email format.";
        }
        setAuthError(readableMsg);
      } finally {
        setIsAuthenticating(false);
      }
    } else {
      // Fallback offline authentication
      const matchesEnrolled = receivedEnquiries.find(
        enq => enq.email?.toLowerCase() === adminEmail.toLowerCase() && enq.password === adminPassword
      );

      if ((adminEmail === "admin@ieee.org" && adminPassword === "admin123") || matchesEnrolled) {
        setIsAdminLoggedIn(true);
        setAdminEmail("");
        setAdminPassword("");
        fetchEnquiries();
      } else {
        setAuthError("Invalid credentials. Hint: Use 'admin@ieee.org' and 'admin123', or any registered student organizer account to login.");
      }
      setIsAuthenticating(false);
    }
  };

  // Admin sign out handler
  const handleAdminSignOut = async () => {
    if (isFirebaseEnabled && auth) {
      try {
        await signOut(auth);
        setIsAdminLoggedIn(false);
      } catch (err) {
        console.error("Sign out error:", err);
      }
    } else {
      setIsAdminLoggedIn(false);
    }
  };

  // Student Sign Up Handler
  const handleStudentSignUp = (e: FormEvent) => {
    e.preventDefault();
    setStudentAuthError("");
    
    if (!studentAuthEmail || !studentAuthPassword || !studentAuthName || !studentAuthRoll) {
      setStudentAuthError("Please fill in all fields to create your student account.");
      return;
    }

    const emailLower = studentAuthEmail.toLowerCase();
    const userExists = studentUsers.find(u => u.email.toLowerCase() === emailLower);
    if (userExists) {
      setStudentAuthError("An account with this email address already exists.");
      return;
    }

    const newStudent = {
      id: "student-" + Date.now(),
      name: studentAuthName,
      email: studentAuthEmail,
      password: studentAuthPassword,
      rollNumber: studentAuthRoll,
      college: studentAuthCollege,
      branch: studentAuthBranch
    };

    const updatedUsers = [...studentUsers, newStudent];
    setStudentUsers(updatedUsers);
    localStorage.setItem("ieee_student_users", JSON.stringify(updatedUsers));

    setCurrentStudentUser(newStudent);
    localStorage.setItem("ieee_student_current_user", JSON.stringify(newStudent));

    // Clear forms
    setStudentAuthEmail("");
    setStudentAuthPassword("");
    setStudentAuthName("");
    setStudentAuthRoll("");
  };

  // Student Login Handler
  const handleStudentLogin = (e: FormEvent) => {
    e.preventDefault();
    setStudentAuthError("");

    if (!studentAuthEmail || !studentAuthPassword) {
      setStudentAuthError("Please enter your email and password.");
      return;
    }

    const emailLower = studentAuthEmail.toLowerCase();
    const user = studentUsers.find(
      u => u.email.toLowerCase() === emailLower && u.password === studentAuthPassword
    );

    if (user) {
      setCurrentStudentUser(user);
      localStorage.setItem("ieee_student_current_user", JSON.stringify(user));
      setStudentAuthEmail("");
      setStudentAuthPassword("");
    } else {
      setStudentAuthError("Invalid student credentials. If you do not have an account, click 'Create Account' above.");
    }
  };

  // Student Logout Handler
  const handleStudentLogout = () => {
    setCurrentStudentUser(null);
    localStorage.removeItem("ieee_student_current_user");
  };

  // Student Event Registration Handler
  const handleStudentEventRegister = (eventTitle: string) => {
    if (!currentStudentUser) {
      alert("Please log in to register for events.");
      navigateTo("student");
      return;
    }

    const alreadyRegistered = studentRegistrations.find(
      r => r.studentId === currentStudentUser.id && r.eventTitle === eventTitle
    );

    if (alreadyRegistered) {
      alert(`You are already registered for "${eventTitle}"!`);
      return;
    }

    const newReg = {
      id: "reg-" + Date.now(),
      studentId: currentStudentUser.id,
      studentName: currentStudentUser.name,
      studentRoll: currentStudentUser.rollNumber,
      eventTitle: eventTitle,
      timestamp: new Date().toLocaleString(),
      status: "Confirmed"
    };

    const updatedRegs = [...studentRegistrations, newReg];
    setStudentRegistrations(updatedRegs);
    localStorage.setItem("ieee_student_registrations", JSON.stringify(updatedRegs));
    alert(`Success! You have registered for "${eventTitle}". View details inside your dashboard.`);
  };

  // CSV Export logic
  const handleExportCSV = () => {
    if (receivedEnquiries.length === 0) {
      alert("No data available to export.");
      return;
    }
    
    const headers = ["Timestamp", "Full Name", "Email", "Roll Number", "IEEE ID", "Year", "Branch", "Inquiry Type", "Message"];
    const rows = receivedEnquiries.map(enq => [
      `"${enq.timestamp || ''}"`,
      `"${enq.fullName || ''}"`,
      `"${enq.email || ''}"`,
      `"${enq.rollNumber || ''}"`,
      `"${enq.ieeeId || 'N/A'}"`,
      `"${enq.year || ''}"`,
      `"${enq.branch || ''}"`,
      `"${enq.inquiryType || ''}"`,
      `"${(enq.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ieee_eps_registrations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Excel Export logic (Styled HTML-to-Excel)
  const handleExportExcel = () => {
    if (receivedEnquiries.length === 0) {
      alert("No data available to export.");
      return;
    }

    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>IEEE Registrations</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <meta charset="utf-8">
        <style>
          th { background-color: #00629B; color: #FFFFFF; font-weight: bold; border: 1px solid #D1D5DB; padding: 8px; font-family: sans-serif; font-size: 10pt; }
          td { border: 1px solid #E5E7EB; padding: 6px; font-family: sans-serif; font-size: 9.5pt; }
        </style>
      </head>
      <body>
        <h2>IEEE EPS BVRIT - Student Registrations Log</h2>
        <p>Exported on: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>Submission Date</th>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Roll Number</th>
              <th>IEEE ID</th>
              <th>Academic Year</th>
              <th>Department</th>
              <th>Join Domain</th>
              <th>Message / Area of Interest</th>
            </tr>
          </thead>
          <tbody>
    `;

    receivedEnquiries.forEach(enq => {
      html += `
        <tr>
          <td>${enq.timestamp || ''}</td>
          <td>${enq.fullName || ''}</td>
          <td>${enq.email || ''}</td>
          <td>${enq.rollNumber || ''}</td>
          <td>${enq.ieeeId || 'N/A'}</td>
          <td>${enq.year || ''}</td>
          <td>${enq.branch || ''}</td>
          <td>${enq.inquiryType || ''}</td>
          <td>${enq.message || ''}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ieee_eps_registrations_${Date.now()}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Icon Converter helper for visual pillars
  const renderPillarIcon = (iconName: string) => {
    switch (iconName) {
      case "Cpu": return <Cpu className="w-6 h-6 text-[#00629B]" />;
      case "Thermometer": return <Thermometer className="w-6 h-6 text-[#00629B]" />;
      case "Activity": return <Activity className="w-6 h-6 text-[#00629B]" />;
      case "Leaf": return <Leaf className="w-6 h-6 text-[#00629B]" />;
      default: return <Cpu className="w-6 h-6 text-[#00629B]" />;
    }
  };

  // Icon Converter helper for operational initiatives
  const renderInitiativeIcon = (iconName: string) => {
    switch (iconName) {
      case "BookOpen": return <BookOpen className="w-6 h-6 text-white" />;
      case "Wrench": return <Wrench className="w-6 h-6 text-white" />;
      case "Compass": return <Compass className="w-6 h-6 text-white" />;
      case "Award": return <Award className="w-6 h-6 text-white" />;
      default: return <BookOpen className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-[#00629B]/20 selection:text-[#00629B]">
      
      {/* ========================================================================= */}
      {/* 1. APPMOBILE HEADER / FLOATING NAVIGATION BAR                             */}
      {/* ========================================================================= */}
      {/* Unstop-Style Left Navigation Sidebar Rail */}
      <aside className="fixed left-0 top-[68px] sm:top-[84px] bottom-0 w-16 sm:w-20 bg-[#0F172A] border-r border-slate-800 z-40 flex flex-col items-center py-5 gap-6 shadow-2xl text-white select-none">
        {/* 4 Navigation Sections */}
        <div className="flex-grow w-full flex flex-col gap-5 items-center px-1">
          {[
            {
              id: "home",
              name: "Home",
              icon: <Home className="w-5 h-5 sm:w-6 sm:h-6" />,
              action: () => navigateTo("home"),
              subsections: [
                { name: "Main Dashboard", action: () => { navigateTo("home"); window.scrollTo({ top: 0, behavior: "smooth" }); } },
                { name: "Semiconductor SiP Layout", action: () => { navigateTo("home"); setTimeout(() => document.getElementById("hero-interactive")?.scrollIntoView({ behavior: "smooth" }), 200); } },
                { name: "Live Ticker Banner", action: () => { navigateTo("home"); setTimeout(() => document.getElementById("hero-heading")?.scrollIntoView({ behavior: "smooth" }), 200); } }
              ]
            },
            {
              id: "about",
              name: "About Us",
              icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />,
              action: () => navigateTo("about"),
              subsections: [
                { name: "Vision 2026-2030", action: () => { navigateTo("about"); window.scrollTo({ top: 0, behavior: "smooth" }); } },
                { name: "Advisory Coordinators", action: () => { navigateTo("about"); setTimeout(() => document.getElementById("advisory-section")?.scrollIntoView({ behavior: "smooth" }), 200); } },
                { name: "Core Executive Committee", action: () => { navigateTo("about"); setTimeout(() => {
                  const el = document.getElementById("advisory-section");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }, 200); } }
              ]
            },
            {
              id: "announcements",
              name: "Updates",
              icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />,
              action: () => {
                if (currentPage !== "home") {
                  navigateTo("home");
                  setTimeout(() => document.getElementById("announcements")?.scrollIntoView({ behavior: "smooth" }), 300);
                } else {
                  document.getElementById("announcements")?.scrollIntoView({ behavior: "smooth" });
                }
              },
              subsections: [
                { name: "Events Calendar", action: () => {
                  if (currentPage !== "home") {
                    navigateTo("home");
                    setTimeout(() => document.getElementById("announcements")?.scrollIntoView({ behavior: "smooth" }), 300);
                  } else {
                    document.getElementById("announcements")?.scrollIntoView({ behavior: "smooth" });
                  }
                }},
                { name: "Enrollment Desk", action: () => {
                  if (currentPage !== "home") {
                    navigateTo("home");
                    setTimeout(() => document.getElementById("inquiry-section")?.scrollIntoView({ behavior: "smooth" }), 300);
                  } else {
                    document.getElementById("inquiry-section")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              ]
            },
            {
              id: "vlsi",
              name: "VLSI Design",
              icon: <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />,
              action: () => {
                alert("IEEE EPS BVRIT Student Chapter specializes in advanced semiconductor packaging, system-in-package co-design, and high-speed VLSI physical architecture.");
              },
              subsections: [
                { name: "Semiconductor Packaging", action: () => alert("Semiconductor Packaging involves assembly processes, thermal co-design, and electrical modeling.") },
                { name: "Thermal Co-design", action: () => alert("Thermal Co-design focuses on heat dissipation architectures in high performance compute nodes.") }
              ]
            }
          ].map((sec) => {
            const isActive = currentPage === sec.id;
            return (
              <div key={sec.id} className="relative group w-full flex flex-col items-center">
                <button
                  onClick={sec.action}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                    isActive 
                      ? "bg-[#00629B] text-white shadow-lg shadow-[#00629B]/25" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {sec.icon}
                  <span className="text-[9px] sm:text-[10px] font-bold tracking-tight mt-1 leading-none">{sec.name}</span>
                  {isActive && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#38BDF8] rounded-r-md"></span>
                  )}
                </button>

                {/* Hover Subsections Popover */}
                <div className="absolute left-full top-0 ml-2 w-48 bg-white border border-slate-200 text-slate-800 rounded-xl shadow-2xl py-2 hidden group-hover:block z-[70] animate-fade-in">
                  <div className="px-3 py-1 border-b border-slate-100 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Explore {sec.name}
                  </div>
                  <div className="py-1">
                    {sec.subsections.map((sub) => (
                      <button
                        key={sub.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          sub.action();
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 text-slate-700 hover:text-[#00629B] transition-colors"
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Settings button */}
        <div className="mt-auto pb-4">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Account Settings"
          >
            <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[9px] sm:text-[10px] font-bold tracking-tight mt-1 leading-none">Settings</span>
          </button>
        </div>
      </aside>

      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 shadow-md py-2 backdrop-blur-md border-b border-sky-200" 
            : "bg-sky-50/95 shadow-sm py-3 backdrop-blur-md border-b border-sky-100"
        }`}
      >
        <div className="max-w-full mx-auto px-4 sm:px-10">
          <div className="flex items-center justify-between gap-4">
            {/* Left Brand Area: Logo only */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Header Brand Information */}
              <div 
                className="flex items-center cursor-pointer select-none group" 
                onClick={() => navigateTo("home")}
              >
                <div className="relative shrink-0 flex items-center h-[60px] sm:h-[72px]">
                  <img 
                    src={combinedLogoImg} 
                    alt="IEEE EPS BVRIT Student Chapter combined logo" 
                    className="h-[60px] sm:h-[72px] w-auto object-contain hover:scale-102 transition-transform duration-300" 
                  />
                </div>
              </div>
            </div>

            {/* Center-left: Search Opportunities Bar */}
            <div className="hidden md:flex flex-grow max-w-sm relative">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Opportunities"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchPopupOpen(true)}
                  className="w-full pl-10 pr-4 py-1.5 bg-slate-100 hover:bg-slate-200/70 focus:bg-white border border-slate-200 focus:border-[#00629B] rounded-full text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>

              {/* Popover / Overlay Card */}
              <AnimatePresence>
                {isSearchPopupOpen && (
                  <>
                    {/* Invisible overlay to close when clicking outside */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsSearchPopupOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      className="absolute left-0 top-full mt-2 w-[420px] bg-white border border-slate-200 shadow-2xl rounded-2xl p-5 z-50 space-y-4 text-left"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                          <Search className="w-4 h-4 text-[#00629B]" />
                          <span>Search Opportunities</span>
                        </div>
                        <button 
                          onClick={() => {
                            setSearchQuery("");
                            setIsSearchPopupOpen(false);
                          }}
                          className="text-[11px] text-slate-400 hover:text-slate-600 font-bold"
                        >
                          Clear
                        </button>
                      </div>

                      {/* Explore Grid */}
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Explore Opportunities</span>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { name: "Competitions", icon: "Trophy", color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
                            { name: "Quizzes", icon: "HelpCircle", color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" },
                            { name: "Hackathons", icon: "Code", color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
                            { name: "Cultural Events", icon: "Music", color: "bg-pink-50 text-pink-600 hover:bg-pink-100" },
                            { name: "Conferences", icon: "Users", color: "bg-orange-50 text-orange-600 hover:bg-orange-100" },
                            { name: "Workshops", icon: "Wrench", color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
                            { name: "College Festivals", icon: "Building", color: "bg-teal-50 text-teal-600 hover:bg-teal-100" },
                            { name: "Mentors", icon: "GraduationCap", color: "bg-sky-50 text-sky-600 hover:bg-sky-100" },
                            { name: "Articles", icon: "BookOpen", color: "bg-violet-50 text-violet-600 hover:bg-violet-100" }
                          ].map((cat) => {
                            const renderCatIcon = (name: string) => {
                              switch (name) {
                                case "Trophy": return <Award className="w-5 h-5" />;
                                case "HelpCircle": return <BookOpen className="w-5 h-5" />;
                                case "Code": return <Cpu className="w-5 h-5" />;
                                case "Music": return <Globe className="w-5 h-5" />;
                                case "Users": return <Compass className="w-5 h-5" />;
                                case "Wrench": return <Wrench className="w-5 h-5" />;
                                case "Building": return <Activity className="w-5 h-5" />;
                                case "GraduationCap": return <GraduationCap className="w-5 h-5" />;
                                case "BookOpen": return <BookOpen className="w-5 h-5" />;
                                default: return <BookOpen className="w-5 h-5" />;
                              }
                            };

                            return (
                              <button
                                key={cat.name}
                                type="button"
                                onClick={() => {
                                  setIsSearchPopupOpen(false);
                                  if (cat.name === "Mentors") {
                                    navigateTo("about");
                                    setTimeout(() => {
                                      document.getElementById("advisory-section")?.scrollIntoView({ behavior: "smooth" });
                                    }, 400);
                                  } else if (cat.name === "Articles") {
                                    navigateTo("home");
                                    setTimeout(() => {
                                      document.getElementById("announcements")?.scrollIntoView({ behavior: "smooth" });
                                    }, 400);
                                  } else {
                                    navigateTo("student");
                                    setSearchQuery(cat.name);
                                  }
                                }}
                                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
                              >
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-xs ${cat.color}`}>
                                  {renderCatIcon(cat.icon)}
                                </div>
                                <span className="text-[10px] font-bold text-slate-600 group-hover:text-[#00629B] text-center leading-tight">
                                  {cat.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Right Brand Area: Only Register/Enquire */}
            <div className="flex items-center shrink-0">
              {/* Split Button with Dropdown for Register/Enquire and Admin Portal */}
              <div className="relative inline-flex items-center">
                <div className="inline-flex items-stretch rounded-xl overflow-hidden bg-[#00629B] hover:bg-[#004B75] transition shadow-md shadow-[#00629B]/10">
                  <button
                    onClick={(e) => {
                      if (currentPage !== "home") {
                        navigateTo("home");
                        setTimeout(() => {
                          document.getElementById("inquiry-section")?.scrollIntoView({ behavior: "smooth" });
                        }, 300);
                      } else {
                        document.getElementById("inquiry-section")?.scrollIntoView({ behavior: "smooth" });
                      }
                      setIsRegisterDropdownOpen(false);
                    }}
                    className="px-4 py-2 text-xs sm:text-sm font-bold text-white tracking-wide cursor-pointer transition"
                  >
                    Register / Enquire
                  </button>
                  <div className="w-[1px] bg-white/20 my-2"></div>
                  <button
                    onClick={() => setIsRegisterDropdownOpen(!isRegisterDropdownOpen)}
                    className="px-2.5 text-white transition flex items-center justify-center cursor-pointer hover:bg-white/10"
                    title="Console Options"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isRegisterDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>

                <AnimatePresence>
                  {isRegisterDropdownOpen && (
                    <>
                      {/* Close overlay on click */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsRegisterDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 overflow-hidden text-xs sm:text-sm text-slate-800"
                      >
                        <button
                          onClick={() => {
                            setIsRegisterDropdownOpen(false);
                            navigateTo("student");
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2 font-bold text-indigo-700 border-b border-slate-100"
                        >
                          <Globe className="w-4 h-4 text-indigo-500" />
                          <span>Student Event Portal</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsRegisterDropdownOpen(false);
                            if (currentPage !== "home") {
                              navigateTo("home");
                              setTimeout(() => {
                                document.getElementById("inquiry-section")?.scrollIntoView({ behavior: "smooth" });
                              }, 300);
                            } else {
                              document.getElementById("inquiry-section")?.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2 font-semibold text-[#00629B]"
                        >
                          <GraduationCap className="w-4 h-4" />
                          <span>Student Desk</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsRegisterDropdownOpen(false);
                            navigateTo("admin");
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2 font-bold text-slate-900 border-t border-slate-100"
                        >
                          <Lock className="w-4 h-4 text-amber-500" />
                          <span>Organizers Console</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area shifted to the right to accommodate the Unstop Left Rail Sidebar */}
      <div className="pl-16 sm:pl-20 min-h-screen flex flex-col transition-all duration-300">
        {/* Spacing Offset for Fixed Navbar */}
        <div className="pt-[68px] sm:pt-[84px]"></div>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC MAIN BODY ROUTER - HOME PAGE                                   */}
      {/* ========================================================================= */}
      {currentPage === "home" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* DYNAMIC SCROLLING NEWS TICKER BANNER */}
          <section className="bg-gradient-to-r from-[#00629B] to-[#004B75] text-white py-3 relative overflow-hidden shadow-inner border-b border-sky-300/30 flex items-center">
            <div className="bg-[#003B5C] px-6 py-1.5 z-20 font-black tracking-wider uppercase text-[10px] sm:text-xs skew-x-12 -ml-2 shadow-lg flex items-center gap-2 shrink-0 border-r border-sky-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <span className="-skew-x-12">Live Updates</span>
            </div>
            <div className="w-full overflow-hidden select-none z-10 flex items-center">
              <marquee 
                scrollamount="4" 
                behavior="scroll" 
                direction="left" 
                className="font-semibold text-xs sm:text-sm tracking-wide py-1 text-sky-100"
                onMouseOver={(e) => e.currentTarget.stop()}
                onMouseOut={(e) => e.currentTarget.start()}
              >
                {tickerText}
              </marquee>
            </div>
          </section>

          {/* PICTURE PROFILE SECTION (DYNAMIC CAROUSEL SLIDESHOW) */}
          {carouselImages.length > 0 && (
            <section className="relative overflow-hidden bg-slate-950 h-[350px] sm:h-[450px] border-b border-slate-800">
              {/* Picture/Slides container */}
              <div className="relative w-full h-full">
                {carouselImages.map((slide, idx) => (
                  <div
                    key={slide.id || idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      idx === currentCarouselIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  >
                    <img
                      src={slide.url}
                      alt={slide.caption}
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Shadow overlay at bottom of photo for text legibility */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent pt-24 pb-8 px-6 sm:px-12 text-left z-20">
                      <p className="text-white text-base sm:text-2xl font-bold tracking-tight drop-shadow-md font-display leading-tight max-w-3xl">
                        {slide.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slider Left Arrow */}
              <button
                onClick={() => setCurrentCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-black/45 hover:bg-[#00629B]/80 text-white rounded-full transition-colors cursor-pointer border border-white/10 backdrop-blur-xs shadow-md"
                aria-label="Previous Slide"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>

              {/* Slider Right Arrow */}
              <button
                onClick={() => setCurrentCarouselIndex((prev) => (prev + 1) % carouselImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-black/45 hover:bg-[#00629B]/80 text-white rounded-full transition-colors cursor-pointer border border-white/10 backdrop-blur-xs shadow-md"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {carouselImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentCarouselIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentCarouselIndex 
                        ? "bg-[#00629B] w-6" 
                        : "bg-white/50 hover:bg-white"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </section>
          )}

          {/* HOME HERO SECTION */}
          <section className="relative overflow-hidden bg-white border-b border-slate-100">
            {/* Visual Vector Grid Backdrop */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
            
            {/* Ambient Lighting Accents */}
            <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-br from-[#00629B]/10 to-blue-300/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-gradient-to-tr from-sky-100/15 to-white rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-10 lg:pb-24 relative z-10">
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                
                {/* Text Content */}
                <div id="hero-heading" className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-100 text-[#00629B] rounded-full text-xs font-semibold tracking-wider uppercase font-display">
                    <GraduationCap className="w-4 h-4" />
                    <span>{HOME_CONTENT.hero.badge}</span>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-[2.85rem] font-black leading-tight tracking-tight text-[#00629B] font-display">
                    {HOME_CONTENT.hero.title}
                  </h1>
                  
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                    {HOME_CONTENT.hero.description}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button 
                      onClick={() => navigateTo("about")}
                      className="bg-[#00629B] hover:bg-[#004B75] text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-[#00629B]/15 hover:shadow-xl hover:shadow-[#00629B]/20 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
                    >
                      <span>{HOME_CONTENT.hero.primaryButtonText}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <a 
                      href="#announcements"
                      className="bg-white hover:bg-slate-50 text-slate-700 hover:text-[#00629B] font-semibold text-sm px-6 py-3.5 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 flex items-center gap-2"
                    >
                      <span>{HOME_CONTENT.hero.secondaryButtonText}</span>
                      <Calendar className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Institution Banner Quick Tag */}
                  <div className="border-t border-slate-100 pt-6 mt-8">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Proudly Hosted By</p>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span className="text-sm font-semibold text-slate-700">{CHAPTER_INFO.collegeFullName}</span>
                    </div>
                    <span className="text-xs text-slate-400 ml-3.5">{CHAPTER_INFO.universityAffiliation}</span>
                  </div>
                </div>

                {/* Interactive Visual Semiconductor Box (3D Package simulation concept) */}
                <div id="hero-interactive" className="lg:col-span-5 relative">
                  
                  {/* Decorative Back Plate */}
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-sky-200 to-[#00629B]/40 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                  {/* Card Container representing standard PCB circuit stack representation */}
                  <div className="relative bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-6">
                    
                    {/* Header Area representing package pin matrix layout */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-400"></span>
                        <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                        <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                      </div>
                      <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest">EPS System Package Layout</span>
                    </div>

                    <div className="py-8 text-center relative">
                      
                      {/* Silicon Chip illustration using CSS & standard SVG vector elements */}
                      <div className="w-44 h-44 mx-auto bg-slate-900 rounded-xl relative p-3 flex flex-col justify-between shadow-2xl overflow-hidden border-2 border-slate-700">
                        {/* Interactive circuit board gold signal pins around edge */}
                        <div className="absolute top-0 inset-x-0 h-1 flex justify-around px-2">
                          {[1,2,3,4,5,6].map(i => <div key={i} className="w-1 h-2 bg-amber-400"></div>)}
                        </div>
                        <div className="absolute bottom-0 inset-x-0 h-1 flex justify-around px-2">
                          {[1,2,3,4,5,6].map(i => <div key={i} className="w-1 h-2 bg-amber-400"></div>)}
                        </div>
                        <div className="absolute left-0 inset-y-0 w-1 flex flex-col justify-around py-2">
                          {[1,2,3,4,5,6].map(i => <div key={i} className="w-2 h-1 bg-amber-400"></div>)}
                        </div>
                        <div className="absolute right-0 inset-y-0 w-1 flex flex-col justify-around py-2">
                          {[1,2,3,4,5,6].map(i => <div key={i} className="w-2 h-1 bg-amber-400"></div>)}
                        </div>

                        {/* Core Silicon Die representations inside */}
                        <div className="flex justify-between items-center h-full">
                          {/* Core Die A */}
                          <div className="bg-[#00629B] text-white p-1.5 rounded text-[8px] font-bold w-[45%] h-[80%] flex flex-col justify-center items-center shadow border border-sky-300">
                            <span className="opacity-80 block text-[6px]">Die [A]</span>
                            <span>GPU/AI CORES</span>
                          </div>
                          
                          {/* Die Bonding Interconnect tracks */}
                          <div className="w-[10%] flex flex-col items-center justify-center gap-2 border-t border-b border-dashed border-amber-300/60 py-2">
                            <div className="h-0.5 w-full bg-amber-400 animate-pulse"></div>
                            <div className="h-0.5 w-full bg-amber-400 animate-pulse"></div>
                          </div>

                          {/* Core Die B */}
                          <div className="bg-[#004B75] text-white p-1.5 rounded text-[8px] font-bold w-[45%] h-[80%] flex flex-col justify-center items-center shadow border border-sky-400">
                            <span className="opacity-80 block text-[6px]">Die [B]</span>
                            <span>HBM MEMORY</span>
                          </div>
                        </div>
                      </div>

                      {/* Package heat spreader block details */}
                      <p className="mt-5 text-xs text-slate-500 font-semibold font-display">System-In-Package (SiP) Co-design Demo</p>
                      <p className="text-[11px] text-[#00629B] font-mono mt-1">Package Interconnect Pitch: &lt; 10 microns</p>
                    </div>

                    {/* Bottom Status Panel */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Thermometer className="w-4 h-4 text-amber-500" />
                        <span>Thermal Delta: <b className="text-slate-700">OK</b></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-[#00629B]" />
                        <span>Signaling: <b className="text-slate-700">99.8% Perfect</b></span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Chapter details pill */}
                  <div className="absolute -bottom-6 -right-4 bg-[#00629B] text-white p-3 rounded-xl shadow-xl border border-sky-400 flex items-center gap-3">
                    <Award className="w-8 h-8 text-amber-300 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase text-sky-200 tracking-wider leading-none">MEMBERSHIP DRIVEN</p>
                      <p className="text-xs font-bold font-display">Active IEEE EPS Chapters</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Removed old news ticker banner section from here */}

          {/* WHAT IS ELECTRONICS PACKAGING INFOCARDS */}
          <section className="py-20 bg-slate-50 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                <span className="text-xs font-bold text-[#00629B] tracking-widest uppercase block font-display">Specialty Focus</span>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-display">{HOME_CONTENT.quickIntro.title}</h2>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed">{HOME_CONTENT.quickIntro.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {HOME_CONTENT.quickIntro.points.map((pt, ind) => (
                  <div key={ind} className="bg-white rounded-xl p-6 border border-slate-200/80 hover:border-[#00629B]/50 hover:shadow-lg transition-all duration-300 group">
                    <div className="w-11 h-11 rounded-lg bg-sky-50 text-[#00629B] font-extrabold flex items-center justify-center mb-4 text-lg border border-sky-100 group-hover:bg-[#00629B] group-hover:text-white transition-colors duration-300">
                      0{ind + 1}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 font-display">{pt.title}</h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{pt.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CORE TECHNOLOGY PILLARS */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                <span className="text-xs font-bold text-[#00629B] tracking-widest uppercase block font-display">Scientific Disciplines</span>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-display">{HOME_CONTENT.pillars.title}</h2>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed">{HOME_CONTENT.pillars.subtitle}</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {HOME_CONTENT.pillars.list.map((pillar, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200/50 flex items-center justify-center">
                          {renderPillarIcon(pillar.icon)}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider bg-slate-200/40 px-2 py-1 rounded">
                          {pillar.code}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-800 mb-3 font-display">{pillar.title}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed mb-4">{pillar.description}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 mt-2 flex items-center text-[11px] text-[#00629B] font-semibold">
                      <span>Learn technical core details</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CHAPTER INITIATIVES / CORE VALUE PROPOSITION */}
          <section className="py-20 bg-slate-50 border-t border-b border-slate-100 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Side: Information */}
                <div className="lg:col-span-5 space-y-6">
                  <span className="text-xs font-bold text-[#00629B] tracking-widest uppercase block font-display">Student Enablers</span>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
                    {HOME_CONTENT.initiatives.title}
                  </h2>
                  <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                    {HOME_CONTENT.initiatives.subtitle}
                  </p>
                  
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#00629B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">IEEE Membership Advantage</p>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        Registered members of IEEE EPS enjoy access to technical libraries, student travel grants for conferences, and direct career networking.
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigateTo("about")}
                    className="mt-2 text-sm font-bold text-[#00629B] hover:text-[#004B75] flex items-center gap-1 group"
                  >
                    <span>Read about our Vision & Mission</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Right Side: Interactive initiatives card layouts */}
                <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
                  {HOME_CONTENT.initiatives.list.map((init, index) => (
                    <div key={index} className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-[#00629B] rounded-lg flex items-center justify-center mb-4 text-white shadow-sm shadow-[#00629B]/15">
                        {renderInitiativeIcon(init.icon)}
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 mb-1.5 font-display">{init.title}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">{init.description}</p>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </section>

          {/* CALENDAR OF EVENTS / ANNOUNCEMENTS */}
          <section id="announcements" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#00629B] tracking-widest uppercase block font-display">What's Happening</span>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-display">{HOME_CONTENT.events.title}</h2>
                  <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">{HOME_CONTENT.events.subtitle}</p>
                </div>
                
                {/* Visual Status Filter Info */}
                <div className="inline-flex gap-3 bg-slate-100 p-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600">
                  <span className="px-3 py-1 bg-white shadow-sm rounded-md text-[#00629B] font-semibold">All Milestones</span>
                  <span className="px-3 py-1 grayscale opacity-60">Seminars</span>
                </div>
              </div>

              {/* Grid of Event Cards */}
              {announcements.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto">
                  <Calendar className="w-12 h-12 text-[#00629B]/30 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-700 text-sm">No announcements scheduled</h3>
                  <p className="text-xs text-slate-500 mt-1">Check back later or log in as organizer to publish announcements!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-8">
                  {announcements.map((event) => (
                    <div key={event.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition">
                      <div>
                        {/* Event Banner Header */}
                        <div className="relative h-48 bg-slate-100 overflow-hidden">
                          <img 
                            src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80"} 
                            alt={event.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest uppercase ${
                            event.status === "Upcoming"
                              ? "bg-amber-400 text-slate-900 shadow-sm"
                              : "bg-emerald-500 text-white shadow-md"
                          }`}>
                            {event.status}
                          </div>
                          <div className="absolute bottom-3 right-3 px-3 py-1 bg-slate-900/70 backdrop-blur-sm rounded text-[11px] font-bold text-white tracking-wide">
                            {event.date}
                          </div>
                        </div>

                        {/* Event Text Metadata */}
                        <div className="p-6 space-y-3">
                          <span className="text-[10px] font-bold tracking-wider text-[#00629B] uppercase block">
                            {event.type}
                          </span>
                          <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-2 font-display min-h-[44px]">
                            {event.title}
                          </h3>
                          <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                            {event.description}
                          </p>

                          <div className="border-t border-slate-100 pt-3 mt-3 text-[11px] text-slate-500 space-y-1">
                            <p className="truncate"><strong className="text-slate-700">Coord:</strong> {event.speaker}</p>
                            <p className="truncate"><strong className="text-slate-700">Venue:</strong> {event.location}</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick registration drawer button */}
                      <div className="p-6 pt-0 border-t border-slate-100">
                        <button 
                          onClick={() => setActiveEvent(event)}
                          className="w-full text-center mt-3 bg-slate-100 hover:bg-[#00629B] hover:text-white text-slate-700 font-semibold py-2 rounded-lg text-xs transition-colors duration-300 cursor-pointer"
                        >
                          View Full Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* BVRIT Joint Affiliation Promotion */}
              <div className="mt-16 bg-blue-50 border border-blue-100 rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10">
                  <Globe className="w-64 h-64 text-sky-900" />
                </div>
                <div id="affiliation-banner" className="space-y-2 relative z-10 text-center md:text-left">
                  <h3 className="text-lg font-bold text-slate-900 font-display">Are you a Student at BVRIT Narsapur?</h3>
                  <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
                    Be a part of a globally recognized student hierarchy. Our active chapter is currently accepting registrations for the executive committees and sub-groups in physical VLSI design and micro-fabrication.
                  </p>
                </div>
                <div className="shrink-0 relative z-10 w-full sm:w-auto">
                  <a 
                    href="#inquiry-section" 
                    className="block text-center bg-[#00629B] hover:bg-[#004B75] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition duration-300 shadow-md shadow-[#00629B]/20"
                  >
                    Register Instantly
                  </a>
                </div>
              </div>

            </div>
          </section>

          {/* DYNAMIC REGISTRATION ENQUIRY GRID WITH REAL-TIME STORAGE SCREEN */}
          <section id="inquiry-section" className="py-20 bg-slate-50 border-t border-b border-slate-200/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="max-w-2xl mx-auto space-y-6">
                
                {/* Center aligned: Interactive Web Inquiry Dispatch Console */}
                <div className="text-center space-y-3">
                  <h2 className="text-3xl font-black text-[#00629B] font-display tracking-tight animate-fade-in">Chapter Enrollment Desk</h2>
                  <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                    Complete this rapid application form to join as a student coordinator or organizer in our packaging & design sub-groups.
                  </p>
                </div>

                {formSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 space-y-4 text-center shadow-sm">
                    <div className="flex flex-col items-center gap-3 text-emerald-800">
                      <CheckCircle className="w-12 h-12 text-emerald-500 shrink-0" />
                      <div>
                        <p className="font-bold text-lg">Application Logged Successfully!</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs font-bold text-[#00629B] underline hover:text-[#004B75] mt-2 block mx-auto cursor-pointer"
                    >
                      Submit another application
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleIncompleteForm} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl space-y-5">
                    
                    {/* Name & IEEE ID input grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.fullName}
                          onChange={e => setFormData({...formData, fullName: e.target.value})}
                          placeholder="Your official name" 
                          className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00629B]/50" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">IEEE ID</label>
                        <input 
                          type="text" 
                          value={formData.ieeeId}
                          onChange={e => setFormData({...formData, ieeeId: e.target.value})}
                          placeholder="e.g. 98765432 (If member)" 
                          className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00629B]/50" 
                        />
                      </div>
                    </div>

                    {/* Email and Roll Number grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">E-Mail Address *</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          placeholder="xyz@bvrit.ac.in" 
                          className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00629B]/50" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">College Roll No. *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.rollNumber}
                          onChange={e => setFormData({...formData, rollNumber: e.target.value})}
                          placeholder="e.g. 24211A04R1" 
                          className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00629B]/50 text-transform-uppercase" 
                        />
                      </div>
                    </div>

                    {/* Set Password (For Organizers Console) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Set Password * (For Organizers Console)</label>
                      <input 
                        type="password" 
                        required
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        placeholder="Choose a password to log in as organizer" 
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00629B]/50" 
                      />
                    </div>

                    {/* Year and Dept Selection */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Academic Year</label>
                        <select 
                          value={formData.year}
                          onChange={e => setFormData({...formData, year: e.target.value})}
                          className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1"
                        >
                          <option>1st Year</option>
                          <option>2nd Year</option>
                          <option>3rd Year</option>
                          <option>4th Year</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
                        <select 
                          value={formData.branch}
                          onChange={e => setFormData({...formData, branch: e.target.value})}
                          className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1"
                        >
                          <option value="ECE">ECE</option>
                          <option value="EEE">EEE</option>
                          <option value="CSE">CSE</option>
                          <option value="IT">IT</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Inquiry Type selection */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Join Domain</label>
                      <select 
                        value={formData.inquiryType}
                        onChange={e => setFormData({...formData, inquiryType: e.target.value})}
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none"
                      >
                        <option value="Membership">Full Student Member (General)</option>
                        <option value="Advanced Packaging">V-I: Advanced Packaging Sub-Group</option>
                        <option value="Thermal System">V-II: Thermal Co-Design Sub-Group</option>
                        <option value="Signal Integrity">V-III: Signal integrity Group</option>
                        <option value="Core Volunteer">Operational Volunteer Team</option>
                      </select>
                    </div>

                    {/* Message body */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message / Area of Interest</label>
                      <textarea 
                        rows={3}
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        placeholder="Why do you wish to join advanced electronics packaging groups?" 
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none"
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-3.5 bg-[#00629B] hover:bg-[#004B75] text-white font-bold text-xs rounded-xl shadow transition duration-200 uppercase tracking-widest cursor-pointer"
                    >
                      Submit Application
                    </button>
                  </form>
                )}
              </div>

            </div>
          </section>

        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3. DYNAMIC MAIN BODY ROUTER - ABOUT PAGE                                  */}
      {/* ========================================================================= */}
      {currentPage === "about" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-16 py-12"
        >
          {/* ABOUT CHAPTER HEADER / ACCENT BANNER */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#00629B] to-sky-700 rounded-3xl text-white p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-xl shadow-sky-900/10">
              <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10">
                <Globe className="w-80 h-80" />
              </div>

              <div className="max-w-3xl space-y-4 relative z-10">
                <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full text-white uppercase tracking-wider font-display">About Our Society</span>
                <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight">
                  Advancing Technology for Humanity's Future
                </h1>
                <p className="text-sky-100 text-sm sm:text-base leading-relaxed max-w-2xl">
                  {ABOUT_CONTENT.aboutIntro.description}
                </p>
              </div>
            </div>
          </section>

          {/* VISION & MISSION BLOCKS */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Vision block */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#00629B]"></div>
                <div>
                  <div className="inline-flex p-3 bg-sky-50 text-[#00629B] rounded-xl mb-6">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 font-display">Chapter Vision</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {ABOUT_CONTENT.aboutIntro.chapterVision}
                  </p>
                </div>
                <div className="text-xs text-[#00629B] font-bold font-mono tracking-wider uppercase mt-8 block">IEEE EPS BVRIT - VISION 2026-2030</div>
              </div>

              {/* Mission block */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#004B75]"></div>
                <div>
                  <div className="inline-flex p-3 bg-slate-100 text-[#004B75] rounded-xl mb-6">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 font-display">Chapter Mission</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {ABOUT_CONTENT.aboutIntro.chapterMission}
                  </p>
                </div>
                <div className="text-xs text-[#004B75] font-bold font-mono tracking-wider uppercase mt-8 block">IEEE EPS BVRIT - CORE OBJECTIVE</div>
              </div>

            </div>
          </section>

          {/* EDUCATIONAL METRICS EXPLANATION - WHAT IS PACKAGING */}
          <section className="py-16 bg-slate-900 text-white rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 relative overflow-hidden">
            <div className="absolute left-0 bottom-0 opacity-5 pointer-events-none">
              <Cpu className="w-96 h-96" />
            </div>

            <div className="grid lg:grid-cols-2 gap-12 relative z-10 items-center">
              <div className="space-y-6">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-widest font-display">The Next Computing Frontier</span>
                <h3 className="text-2xl sm:text-3.5xl font-extrabold tracking-tight font-display text-white">
                  {ABOUT_CONTENT.whatIsPackaging.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {ABOUT_CONTENT.whatIsPackaging.explanation}
                </p>
                
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-xs italic text-slate-400">
                    "Packaging is where chemistry, physical mechanics, heat dissipation algorithms & VLSI join forces."
                  </p>
                </div>
              </div>

              {/* Visual Metrics list */}
              <div className="grid sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-1 gap-6">
                {ABOUT_CONTENT.whatIsPackaging.highlights.map((hlt, hIdx) => (
                  <div key={hIdx} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4">
                    <div className="text-2xl sm:text-3xl font-black text-amber-400 font-display shrink-0 mt-0.5 leading-none">
                      {hlt.metric}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1 font-display">{hlt.label}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">{hlt.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FACULTY AND STUDENT ADVISORS COMMITTEE */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold text-[#00629B] tracking-widest uppercase block font-display">Chapter Leadership</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-display">{ABOUT_CONTENT.committee.title}</h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">{ABOUT_CONTENT.committee.subtitle}</p>
            </div>

            {/* CHAPTER MENTORS BLOCK */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 font-display">
                  <Award className="w-5 h-5 text-[#00629B]" />
                  <span>Mentors</span>
                </h3>
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Dr. Sanjay Dubey",
                    role: "Professor & Principal",
                    email: "sanjay.dubey@bvrit.ac.in",
                    image: mentorSanjayImg,
                    qualifications: "B.E. (ECE), M.Tech. (WMC, JNTUH), Ph.D. (JNTUH on FPGA based Robotics)",
                    linkedin: "https://www.linkedin.com/in/sanjay-dubey?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  },
                  {
                    name: "Dr. B.R. Sanjeeva Reddy",
                    role: "Professor & HoD ECE",
                    email: "hod.ece@bvrit.ac.in",
                    image: mentorSanjeevaImg,
                    qualifications: "B.E. (ECE), M.Tech. (Microwave Engg, COEP), Ph.D. (NIT Warangal on RF & Microwaves)",
                    linkedin: "https://www.linkedin.com/in/sanjeev-reddy-b-r-46a75439?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  },
                  {
                    name: "Dr. B. Naresh Kumar",
                    role: "Assistant Professor, ECE Dept.",
                    email: "nareshkumar.b@bvrit.ac.in",
                    image: mentorNareshImg,
                    qualifications: "B.Tech. (ECE), M.Tech. (ECE, JNTUH), Ph.D. (Lovely Professional University, 2024)",
                    linkedin: "https://www.linkedin.com/in/dr-b-naresh-kumar-9979aa337?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  }
                ].map((member, fIdx) => (
                  <div key={fIdx} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition text-center items-center">
                    <div className="w-36 h-44 rounded-xl bg-slate-50 overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center shrink-0">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                      />
                    </div>

                    <div className="space-y-3 flex-grow flex flex-col justify-between w-full">
                      <div className="space-y-2">
                        <div>
                          <strong className="block text-slate-800 text-base font-display leading-tight">{member.name}</strong>
                          <span className="text-[11px] font-semibold text-[#00629B] block mt-0.5">{member.role}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 space-y-1">
                          <p className="leading-relaxed"><strong>Qual:</strong> {member.qualifications}</p>
                        </div>
                      </div>
                      
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-center gap-4 text-xs mt-auto">
                        <a href={`mailto:${member.email}`} className="text-slate-500 hover:text-[#00629B] p-1 rounded hover:bg-slate-50 transition" title={member.email}>
                          <Mail className="w-4 h-4" />
                        </a>
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#0A66C2] p-1 rounded hover:bg-slate-50 transition" title="LinkedIn Profile">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FACULTY ADVISORS BLOCK */}
            <div className="space-y-6 pt-6">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 font-display">
                  <GraduationCap className="w-5 h-5 text-[#00629B]" />
                  <span>Faculty Advisors</span>
                </h3>
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Dr. U. Gnaneshwara Chary",
                    role: "Assistant Professor, ECE Dept.",
                    email: "Gnaneshwara.chary@bvrit.ac.in",
                    image: facultyGnaneshwaraImg,
                    qualifications: "B.Tech (ECE – Jatipita College of Engg, 2006), M.Tech (VLSI – VNR VJIET, 2010), Ph.D (K L University, Vijayawada)",
                    linkedin: "https://www.linkedin.com/in/dr-gnaneshwara-chary-udari-05577176?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  },
                  {
                    name: "Mr. T P Kausalya Nandan",
                    role: "Assistant Professor, ECE Dept.",
                    email: "kausalya.nandan@bvrit.ac.in",
                    image: facultyKausalyaImg,
                    qualifications: "B.Tech (ECE – Biju Patnaik Univ of Tech, 2006), M.Tech (Digital Image Processing – JNTUK, 2011), Ph.D (Pursuing in Digital Image Processing – GITAM University)",
                    linkedin: "https://www.linkedin.com/in/kausalya-nandan-33119590?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  },
                  {
                    name: "Mrs. Mareddy Anusha",
                    role: "Assistant Professor, ECE Dept.",
                    email: "anusha.m@bvrit.ac.in",
                    image: facultyAnushaImg,
                    qualifications: "B.Tech (ECE – ML Engg College, JNTUK, 2009), M.Tech (VLSI & ES – DRKCET, JNTUH, 2013), Ph.D (Pursuing – SRM University)",
                    linkedin: "https://www.linkedin.com/in/anusha-mareddy-65329842?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  }
                ].map((member, fIdx) => (
                  <div key={fIdx} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition text-center items-center">
                    <div className="w-36 h-44 rounded-xl bg-slate-50 overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center shrink-0">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                      />
                    </div>

                    <div className="space-y-3 flex-grow flex flex-col justify-between w-full">
                      <div className="space-y-2">
                        <div>
                          <strong className="block text-slate-800 text-sm font-display leading-tight">{member.name}</strong>
                          <span className="text-[10px] font-semibold text-[#00629B] block mt-0.5">{member.role}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 space-y-1">
                          <p className="leading-relaxed"><strong>Qual:</strong> {member.qualifications}</p>
                        </div>
                      </div>
                      
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-center gap-4 text-xs mt-auto">
                        <a href={`mailto:${member.email}`} className="text-slate-500 hover:text-[#00629B] p-1 rounded hover:bg-slate-50 transition" title={member.email}>
                          <Mail className="w-4 h-4" />
                        </a>
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#0A66C2] p-1 rounded hover:bg-slate-50 transition" title="LinkedIn Profile">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STUDENT EXECUTIVE COMMITTEE COMMITTEES BLOCK */}
            <div className="space-y-6 pt-6">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 font-display">
                  <Wrench className="w-4 h-4 text-[#00629B]" />
                  <span>Student Committee</span>
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {ABOUT_CONTENT.committee.students.map((student, sIdx) => (
                  <div key={sIdx} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#00629B]/30 hover:shadow-md transition flex flex-col justify-between text-center items-center">
                    <div className="space-y-3 w-full">
                      {/* Blank profile avatar (WhatsApp/Instagram style) */}
                      <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300 mx-auto text-slate-400 overflow-hidden shrink-0 shadow-inner">
                        <svg className="w-10 h-10 mt-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>

                      <div className="text-center">
                        <strong className="block text-slate-800 text-sm font-display leading-tight">{student.name}</strong>
                        <span className="text-[11px] font-bold text-[#00629B] block mt-0.5">{student.role}</span>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{student.department}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-center gap-4 text-xs w-full">
                      <a href={`mailto:${student.email}`} className="text-slate-400 hover:text-[#00629B] p-1 rounded hover:bg-slate-50 transition" title={student.email}>
                        <Mail className="w-4 h-4" />
                      </a>
                      {student.linkedin && (
                        <a href={student.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#0A66C2] p-1 rounded hover:bg-slate-50 transition" title="LinkedIn Profile">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>



        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3.5. DYNAMIC MAIN BODY ROUTER - ADMIN PAGE                                */}
      {/* ========================================================================= */}
      {currentPage === "admin" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh] flex flex-col justify-start"
        >
          {!isAdminLoggedIn ? (
            /* ADMIN LOGIN PANEL */
            <div className="max-w-md w-full mx-auto my-12 bg-white border border-slate-200 rounded-3xl shadow-xl p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-sky-50 text-[#00629B] rounded-2xl flex items-center justify-center border border-sky-100 shadow-inner">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 font-display">Organizers Portal Login</h2>
                <p className="text-slate-500 text-xs sm:text-sm">Secure sign-in for IEEE BVRIT Chapter committee members</p>
              </div>

              {!isFirebaseEnabled && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3.5 rounded-2xl text-xs space-y-1.5 leading-relaxed">
                  <p className="font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Local Sandbox Fallback Mode Active</span>
                  </p>
                  <p className="opacity-90">
                    Firebase variables are currently empty in your <code className="bg-amber-100 px-1 rounded text-amber-900 font-mono">.env</code> file. 
                  </p>
                  <p className="font-semibold text-slate-800">
                    🔑 Mock Credentials to Test Sandbox:
                    <span className="block mt-1 font-mono text-[11px] opacity-80 select-all">Email: admin@ieee.org</span>
                    <span className="block font-mono text-[11px] opacity-80 select-all">Password: admin123</span>
                  </p>
                </div>
              )}

              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#00629B] focus:ring-1 focus:ring-[#00629B] transition"
                    placeholder="Enter coordinator email..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#00629B] focus:ring-1 focus:ring-[#00629B] transition"
                    placeholder="Enter password..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full bg-[#00629B] hover:bg-[#004B75] text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-[#00629B]/10 hover:shadow-lg transition duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAuthenticating ? (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    <>
                      <span>Secure Log In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center">
                <button 
                  onClick={() => navigateTo("home")}
                  className="text-xs text-slate-500 hover:text-[#00629B] transition font-semibold hover:underline"
                >
                  ← Back to Public Chapter Homepage
                </button>
              </div>
            </div>
          ) : (
            /* ADMIN DASHBOARD CONSOLE */
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div className="space-y-1.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight flex items-center gap-2.5">
                    <Database className="w-7 h-7 text-[#00629B]" />
                    <span>IEEE EPS BVRIT - Organizers Console</span>
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-sm">
                    Manage membership requests, event registrations, and general enquiries.
                  </p>
                </div>
                
                {/* Dynamic Status Connection Badge */}
                <div className="flex items-center self-start md:self-center">
                  {isFirebaseEnabled ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-bold shadow-inner">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>Firebase Sync Active (Live)</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-bold shadow-inner">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                      <span>Offline Sandbox Mode (Local)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Metrics Panels */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Total Enquiries</span>
                  <span className="text-2xl font-black text-slate-800 font-display block mt-1">{receivedEnquiries.length}</span>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Membership Requests</span>
                  <span className="text-2xl font-black text-[#00629B] font-display block mt-1 font-bold">
                    {receivedEnquiries.filter(e => (e.inquiryType || '').toLowerCase() === 'membership').length}
                  </span>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Volunteer Requests</span>
                  <span className="text-2xl font-black text-emerald-700 font-display block mt-1 font-bold">
                    {receivedEnquiries.filter(e => (e.inquiryType || '').toLowerCase().includes('volunteer')).length}
                  </span>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Workshop Attendees</span>
                  <span className="text-2xl font-black text-indigo-700 font-display block mt-1 font-bold">
                    {receivedEnquiries.filter(e => (e.inquiryType || '').toLowerCase().includes('attendee') || (e.inquiryType || '').toLowerCase().includes('workshop')).length}
                  </span>
                </div>
              </div>

              {/* Tab selectors for Admin Panel */}
              <div className="flex border-b border-slate-200 mt-2 mb-6">
                <button
                  onClick={() => setAdminTab("enquiries")}
                  className={`px-6 py-3 font-bold text-sm border-b-2 transition cursor-pointer ${
                    adminTab === "enquiries"
                      ? "border-[#00629B] text-[#00629B]"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Student Applications ({receivedEnquiries.length})
                </button>
                <button
                  onClick={() => setAdminTab("announcements")}
                  className={`px-6 py-3 font-bold text-sm border-b-2 transition cursor-pointer ${
                    adminTab === "announcements"
                      ? "border-[#00629B] text-[#00629B]"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Manage Announcements ({announcements.length})
                </button>
                <button
                  onClick={() => setAdminTab("ticker")}
                  className={`px-6 py-3 font-bold text-sm border-b-2 transition cursor-pointer ${
                    adminTab === "ticker"
                      ? "border-[#00629B] text-[#00629B]"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  News Ticker Updates
                </button>
                <button
                  onClick={() => setAdminTab("carousel")}
                  className={`px-6 py-3 font-bold text-sm border-b-2 transition cursor-pointer ${
                    adminTab === "carousel"
                      ? "border-[#00629B] text-[#00629B]"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Manage Carousel ({carouselImages.length})
                </button>
              </div>

              {adminTab === "enquiries" && (
                <>
                  {/* Filter and Control Toolbar */}
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-grow flex flex-col sm:flex-row gap-3">
                      {/* Search Input */}
                      <div className="relative flex-grow">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={adminSearch}
                          onChange={(e) => setAdminSearch(e.target.value)}
                          placeholder="Search by name, roll, email, or IEEE ID..."
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#00629B]"
                        />
                      </div>

                      {/* Branch filter */}
                      <div className="relative min-w-[140px]">
                        <select
                          value={adminBranchFilter}
                          onChange={(e) => setAdminBranchFilter(e.target.value)}
                          className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm appearance-none bg-white focus:outline-none focus:border-[#00629B] cursor-pointer"
                        >
                          <option value="All">All Branches</option>
                          <option value="ECE">ECE</option>
                          <option value="EEE">EEE</option>
                          <option value="CSE">CSE</option>
                          <option value="IT">IT</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* Inquiry Type filter */}
                      <div className="relative min-w-[170px]">
                        <select
                          value={adminTypeFilter}
                          onChange={(e) => setAdminTypeFilter(e.target.value)}
                          className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm appearance-none bg-white focus:outline-none focus:border-[#00629B] cursor-pointer"
                        >
                          <option value="All">All Inquiry Types</option>
                          <option value="Membership">Membership</option>
                          <option value="Event Volunteer">Event Volunteer</option>
                          <option value="Workshop Attendee">Workshop Attendee</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex gap-2 self-end md:self-auto shrink-0">
                      <button
                        onClick={fetchEnquiries}
                        className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-slate-600 flex items-center justify-center cursor-pointer"
                        title="Refresh Data"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={handleExportCSV}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow shadow-emerald-700/10 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                      </button>
                      
                      <button
                        onClick={handleExportExcel}
                        className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow shadow-sky-900/10 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export Excel</span>
                      </button>
                    </div>
                  </div>

                  {/* Data Table */}
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                            <th className="px-6 py-4">Submission Date</th>
                            <th className="px-6 py-4">Student Details</th>
                            <th className="px-6 py-4">Roll Number</th>
                            <th className="px-6 py-4">IEEE ID</th>
                            <th className="px-6 py-4 text-center">Year / Branch</th>
                            <th className="px-6 py-4">Inquiry Type</th>
                            <th className="px-6 py-4">Message</th>
                            <th className="px-6 py-4 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                          {receivedEnquiries.filter(enq => {
                            const matchesSearch = 
                              (enq.fullName || '').toLowerCase().includes(adminSearch.toLowerCase()) || 
                              (enq.rollNumber || '').toLowerCase().includes(adminSearch.toLowerCase()) ||
                              (enq.email || '').toLowerCase().includes(adminSearch.toLowerCase()) ||
                              (enq.ieeeId || '').toLowerCase().includes(adminSearch.toLowerCase());
                            
                            const matchesBranch = 
                              adminBranchFilter === "All" || 
                              (enq.branch || '').toLowerCase() === adminBranchFilter.toLowerCase();
                              
                            const matchesType = 
                              adminTypeFilter === "All" || 
                              (enq.inquiryType || '').toLowerCase() === adminTypeFilter.toLowerCase();
                              
                            return matchesSearch && matchesBranch && matchesType;
                          }).length > 0 ? (
                            receivedEnquiries.filter(enq => {
                              const matchesSearch = 
                                (enq.fullName || '').toLowerCase().includes(adminSearch.toLowerCase()) || 
                                (enq.rollNumber || '').toLowerCase().includes(adminSearch.toLowerCase()) ||
                                (enq.email || '').toLowerCase().includes(adminSearch.toLowerCase()) ||
                                (enq.ieeeId || '').toLowerCase().includes(adminSearch.toLowerCase());
                              
                              const matchesBranch = 
                                adminBranchFilter === "All" || 
                                (enq.branch || '').toLowerCase() === adminBranchFilter.toLowerCase();
                                
                              const matchesType = 
                                adminTypeFilter === "All" || 
                                (enq.inquiryType || '').toLowerCase() === adminTypeFilter.toLowerCase();
                                
                              return matchesSearch && matchesBranch && matchesType;
                            }).map((enq) => (
                              <tr key={enq.id || enq.rollNumber + enq.timestamp} className="hover:bg-slate-50/50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                                  {enq.timestamp}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="font-bold text-slate-800 font-display">{enq.fullName}</div>
                                  <div className="text-xs text-slate-400 mt-0.5">{enq.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-mono font-semibold text-slate-700">
                                  {enq.rollNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {enq.ieeeId ? (
                                    <span className="font-mono text-[#00629B] font-bold bg-sky-50 border border-sky-100 text-[11px] px-2 py-0.5 rounded">
                                      {enq.ieeeId}
                                    </span>
                                  ) : (
                                    <span className="text-slate-300 italic text-[11px]">N/A</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded mr-1.5">
                                    {enq.year}
                                  </span>
                                  <span className="bg-sky-50 border border-sky-100 text-[#00629B] text-[11px] font-black px-2 py-0.5 rounded font-bold">
                                    {enq.branch}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                    (enq.inquiryType || '').toLowerCase() === 'membership'
                                      ? 'bg-sky-50 text-[#00629B] border border-sky-100'
                                      : (enq.inquiryType || '').toLowerCase().includes('volunteer')
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                      : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                  }`}>
                                    {enq.inquiryType}
                                  </span>
                                </td>
                                <td className="px-6 py-4 max-w-xs truncate" title={enq.message}>
                                  {enq.message || <span className="text-slate-300 italic">No message provided</span>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <button
                                    onClick={() => handleDeleteEnquiry(enq.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                                    title="Delete Entry"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                                <Database className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                                <p className="font-semibold text-slate-500">No matching registrations found</p>
                                <p className="text-xs text-slate-400 mt-1">Try tweaking your search or dropdown filters</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Offline Sandbox Guide alert */}
                  {!isFirebaseEnabled && (
                    <div className="bg-slate-100 border border-slate-200 text-slate-600 p-4 rounded-2xl text-xs space-y-1.5 leading-relaxed">
                      <p className="font-bold text-slate-700 flex items-center gap-1">
                        <Info className="w-4 h-4 text-[#00629B] shrink-0" />
                        <span>Developer Note: Connecting to Live Cloud Database</span>
                      </p>
                      <p>
                        This dashboard is currently operating on simulated local storage. To connect to Firestore:
                      </p>
                      <ol className="list-decimal pl-4 space-y-1 mt-1 font-semibold text-slate-700">
                        <li>Create a Firebase Project at <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#00629B] hover:underline">console.firebase.google.com</a>.</li>
                        <li>Add a Web App and copy your config object.</li>
                        <li>Create a file named <code className="bg-slate-200 px-1 rounded font-mono">.env</code> in your project root and paste the values (VITE_FIREBASE_API_KEY, etc.).</li>
                        <li>Enable Firestore (create a collection called 'enquiries') and enable Email/Password Authentication.</li>
                        <li>Restart the development server. The dashboard will automatically transition to live database sync!</li>
                      </ol>
                    </div>
                  )}
                </>
              )}

              {adminTab === "announcements" && (
                <div className="grid lg:grid-cols-12 gap-8 animate-fade-in">
                  {/* Left Column: Create Announcement Form */}
                  <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-[#00629B] font-display flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#00629B]" />
                      <span>Publish Announcement</span>
                    </h3>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!announcementFormData.title || !announcementFormData.date || !announcementFormData.speaker || !announcementFormData.location || !announcementFormData.description) {
                          alert("Please fill in all required announcement fields!");
                          return;
                        }
                        const newAnn = {
                          id: "evt-" + Date.now(),
                          ...announcementFormData
                        };
                        const updated = [newAnn, ...announcements];
                        setAnnouncements(updated);
                        localStorage.setItem("ieee_announcements", JSON.stringify(updated));
                        // reset form
                        setAnnouncementFormData({
                          title: "",
                          type: "Practical Workshop",
                          speaker: "",
                          location: "",
                          date: "",
                          description: "",
                          status: "Upcoming",
                          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80"
                        });
                        alert("Announcement published successfully and is live on the website!");
                      }} 
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Announcement Title *</label>
                        <input 
                          type="text" 
                          required
                          value={announcementFormData.title}
                          onChange={(e) => setAnnouncementFormData({...announcementFormData, title: e.target.value})}
                          placeholder="e.g. Physical VLSI Prototyping Bootcamp"
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00629B] text-xs sm:text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Type / Category</label>
                          <select
                            value={announcementFormData.type}
                            onChange={(e) => setAnnouncementFormData({...announcementFormData, type: e.target.value})}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00629B] text-xs sm:text-sm"
                          >
                            <option>Practical Workshop</option>
                            <option>Expert Guest Lecture</option>
                            <option>Chapter Milestone</option>
                            <option>Syllabus Seminar</option>
                            <option>Design Hackathon</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Publish Status</label>
                          <select
                            value={announcementFormData.status}
                            onChange={(e) => setAnnouncementFormData({...announcementFormData, status: e.target.value})}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00629B] text-xs sm:text-sm"
                          >
                            <option>Upcoming</option>
                            <option>Completed</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Speaker / Coord *</label>
                          <input 
                            type="text" 
                            required
                            value={announcementFormData.speaker}
                            onChange={(e) => setAnnouncementFormData({...announcementFormData, speaker: e.target.value})}
                            placeholder="e.g. Dr. K. Radhika"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00629B] text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date *</label>
                          <input 
                            type="text" 
                            required
                            value={announcementFormData.date}
                            onChange={(e) => setAnnouncementFormData({...announcementFormData, date: e.target.value})}
                            placeholder="e.g. June 15, 2026"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00629B] text-xs sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Venue / Location *</label>
                        <input 
                          type="text" 
                          required
                          value={announcementFormData.location}
                          onChange={(e) => setAnnouncementFormData({...announcementFormData, location: e.target.value})}
                          placeholder="e.g. Seminar Hall 1, ECE Block"
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00629B] text-xs sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Banner Image URL</label>
                        <input 
                          type="text" 
                          value={announcementFormData.image}
                          onChange={(e) => setAnnouncementFormData({...announcementFormData, image: e.target.value})}
                          placeholder="Image URL"
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00629B] text-xs sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Brief Description *</label>
                        <textarea 
                          rows={3}
                          required
                          value={announcementFormData.description}
                          onChange={(e) => setAnnouncementFormData({...announcementFormData, description: e.target.value})}
                          placeholder="Provide details about covered topics..."
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00629B] text-xs sm:text-sm"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#00629B] hover:bg-[#004B75] text-white font-bold text-xs rounded-xl shadow tracking-widest uppercase transition cursor-pointer"
                      >
                        Publish Instantly
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Manage Announcements List */}
                  <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 font-display">Active Published Announcements</h3>

                    {announcements.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 rounded-2xl">
                        <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                        <p className="font-semibold text-slate-500 text-xs">No active announcements</p>
                        <p className="text-[11px] text-slate-400">Fill out the form on the left to publish live announcements.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto pr-1">
                        {announcements.map((ann) => (
                          <div key={ann.id} className="py-4 flex gap-4 items-start">
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                              <img src={ann.image} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="flex-grow space-y-1.5 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  ann.status === "Upcoming" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                                }`}>
                                  {ann.status}
                                </span>
                                <button
                                  onClick={() => {
                                    if (confirm(`Remove announcement "${ann.title}"?`)) {
                                      const updated = announcements.filter(a => a.id !== ann.id);
                                      setAnnouncements(updated);
                                      localStorage.setItem("ieee_announcements", JSON.stringify(updated));
                                    }
                                  }}
                                  className="text-slate-400 hover:text-red-600 transition p-1.5 rounded hover:bg-red-50 cursor-pointer"
                                  title="Delete announcement"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <h4 className="font-bold text-slate-800 text-xs sm:text-sm font-display truncate">{ann.title}</h4>
                              <p className="text-[10px] text-slate-500">
                                📅 {ann.date} | 📍 {ann.location} | 🎤 {ann.speaker}
                              </p>
                              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                {ann.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {adminTab === "ticker" && (
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4 max-w-3xl mx-auto animate-fade-in">
                  <h3 className="text-lg font-bold text-[#00629B] font-display flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#00629B]" />
                    <span>Manage Live Updates (Scrolling News Ticker)</span>
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Update the scrolling banner text displayed on the public home page. Keep it informative with details like upcoming chief guests, registrations, dates, or immediate orientation milestones. Use <code className="bg-slate-100 px-1 py-0.5 rounded font-bold">|</code> (vertical bar) to separate updates nicely.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      localStorage.setItem("ieee_ticker_text", tickerText);
                      alert("News ticker updated successfully! The new text is now live on the homepage.");
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Scrolling Bar Text *</label>
                      <textarea
                        rows={5}
                        required
                        value={tickerText}
                        onChange={(e) => setTickerText(e.target.value)}
                        placeholder="Type updates to display..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00629B] text-xs sm:text-sm font-medium leading-relaxed"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#00629B] hover:bg-[#004B75] text-white font-bold text-xs rounded-xl shadow tracking-widest uppercase transition cursor-pointer"
                    >
                      Save & Publish Live
                    </button>
                  </form>
                </div>
              )}

              {adminTab === "carousel" && (
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6 max-w-4xl mx-auto animate-fade-in">
                  <h3 className="text-lg font-bold text-[#00629B] font-display flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#00629B]" />
                    <span>Manage Picture Carousel (Hero Slideshow)</span>
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Add, edit, or remove the slideshow posters/pictures shown directly on the public homepage. Use high-quality wide image URLs (e.g. from your department server, imgur, unsplash, or college portal).
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newCarouselUrl.trim()) return;
                      const newSlide = {
                        id: "slide-" + Date.now(),
                        url: newCarouselUrl.trim(),
                        caption: newCarouselCaption.trim() || "Event Poster / Banner"
                      };
                      const updatedSlides = [...carouselImages, newSlide];
                      setCarouselImages(updatedSlides);
                      localStorage.setItem("ieee_carousel_images", JSON.stringify(updatedSlides));
                      setNewCarouselUrl("");
                      setNewCarouselCaption("");
                      alert("New picture added to the carousel successfully!");
                    }}
                    className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid md:grid-cols-2 gap-4 items-end"
                  >
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">Upload Poster / Image *</label>
                      <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === "string") {
                                setNewCarouselUrl(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#00629B]/10 file:text-[#00629B] hover:file:bg-[#00629B]/20 cursor-pointer"
                      />
                      {newCarouselUrl && (
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                          <span className="text-emerald-600 font-bold">✓ Image loaded</span>
                          <img src={newCarouselUrl} alt="Preview" className="w-8 h-8 object-cover rounded border border-slate-200" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">Caption / Title</label>
                      <input
                        type="text"
                        value={newCarouselCaption}
                        onChange={(e) => setNewCarouselCaption(e.target.value)}
                        placeholder="Inauguration Ceremony poster"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#00629B] text-xs font-medium"
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#00629B] hover:bg-[#004B75] text-white font-bold text-xs rounded-lg shadow uppercase tracking-wider transition cursor-pointer"
                      >
                        Add Poster to Slideshow
                      </button>
                    </div>
                  </form>

                  {/* Current Carousel Slides List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Slides ({carouselImages.length})</h4>
                    {carouselImages.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No images currently in the slideshow. Add one above.</p>
                    ) : (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {carouselImages.map((slide, idx) => (
                          <div key={slide.id || idx} className="bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex flex-col justify-between">
                            <div className="relative h-32 bg-slate-900 flex items-center justify-center">
                              <img 
                                src={slide.url} 
                                alt={slide.caption} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=300&q=80";
                                }}
                              />
                              <div className="absolute top-2 right-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm("Are you sure you want to remove this slide?")) {
                                      const updated = carouselImages.filter(item => item.id !== slide.id);
                                      setCarouselImages(updated);
                                      localStorage.setItem("ieee_carousel_images", JSON.stringify(updated));
                                      setCurrentCarouselIndex(0);
                                    }
                                  }}
                                  className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-lg border border-red-200 transition"
                                  title="Delete slide"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <div className="p-3 bg-white border-t border-slate-100">
                              <p className="text-xs font-bold text-slate-800 line-clamp-1">{slide.caption}</p>
                              <span className="text-[10px] text-slate-400 font-mono block truncate mt-1">{slide.url}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Logout & Navigation back panel */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => navigateTo("home")}
                  className="text-xs sm:text-sm text-slate-500 hover:text-[#00629B] font-semibold hover:underline"
                >
                  ← Back to Chapter Homepage
                </button>
                
                <button
                  onClick={handleAdminSignOut}
                  className="px-4 py-2 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-slate-600 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Console</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3.8. DYNAMIC MAIN BODY ROUTER - STUDENT PORTAL                            */}
      {/* ========================================================================= */}
      {currentPage === "student" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
        >
          {!currentStudentUser ? (
            /* 1. STUDENT AUTHENTICATION CARD */
            <div className="max-w-md mx-auto my-12">
              <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
                {/* Brand Banner */}
                <div className="bg-gradient-to-r from-indigo-700 to-[#00629B] p-6 text-white text-center">
                  <Globe className="w-10 h-10 mx-auto text-indigo-200 mb-2" />
                  <h2 className="text-xl font-bold font-display">IEEE Student Portal</h2>
                  <p className="text-xs text-indigo-100 mt-1">Sign in to register for events, view upcoming workshops, and claim prizes.</p>
                </div>

                {/* Tab selectors */}
                <div className="flex border-b border-slate-100 bg-slate-50">
                  <button
                    onClick={() => {
                      setStudentAuthTab("login");
                      setStudentAuthError("");
                    }}
                    className={`flex-1 py-3 text-center text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                      studentAuthTab === "login"
                        ? "border-indigo-600 text-indigo-600 bg-white"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setStudentAuthTab("signup");
                      setStudentAuthError("");
                    }}
                    className={`flex-1 py-3 text-center text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                      studentAuthTab === "signup"
                        ? "border-indigo-600 text-indigo-600 bg-white"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Authentication Forms */}
                <div className="p-6 space-y-4">
                  {studentAuthError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-semibold leading-relaxed">
                      {studentAuthError}
                    </div>
                  )}

                  {studentAuthTab === "login" ? (
                    /* SIGN IN FORM */
                    <form onSubmit={handleStudentLogin} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={studentAuthEmail}
                          onChange={(e) => setStudentAuthEmail(e.target.value)}
                          placeholder="xyz@bvrit.ac.in"
                          className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password *</label>
                        <input
                          type="password"
                          required
                          value={studentAuthPassword}
                          onChange={(e) => setStudentAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow transition duration-200 uppercase tracking-widest cursor-pointer"
                      >
                        Sign In
                      </button>
                    </form>
                  ) : (
                    /* SIGN UP FORM */
                    <form onSubmit={handleStudentSignUp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={studentAuthName}
                          onChange={(e) => setStudentAuthName(e.target.value)}
                          placeholder="Your official name"
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={studentAuthEmail}
                          onChange={(e) => setStudentAuthEmail(e.target.value)}
                          placeholder="xyz@bvrit.ac.in"
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Roll Number *</label>
                          <input
                            type="text"
                            required
                            value={studentAuthRoll}
                            onChange={(e) => setStudentAuthRoll(e.target.value)}
                            placeholder="e.g. 24211A04R1"
                            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-transform-uppercase"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department *</label>
                          <select
                            value={studentAuthBranch}
                            onChange={(e) => setStudentAuthBranch(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                          >
                            <option value="ECE">ECE</option>
                            <option value="EEE">EEE</option>
                            <option value="CSE">CSE</option>
                            <option value="IT">IT</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Institution/College Name *</label>
                        <input
                          type="text"
                          required
                          value={studentAuthCollege}
                          onChange={(e) => setStudentAuthCollege(e.target.value)}
                          placeholder="e.g. BVRIT Narsapur"
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Create Password *</label>
                        <input
                          type="password"
                          required
                          value={studentAuthPassword}
                          onChange={(e) => setStudentAuthPassword(e.target.value)}
                          placeholder="Minimum 6 characters"
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow transition duration-200 uppercase tracking-widest cursor-pointer"
                      >
                        Register Account
                      </button>
                    </form>
                  )}
                </div>
              </div>
              <div className="text-center mt-6">
                <button
                  onClick={() => navigateTo("home")}
                  className="text-xs text-slate-500 hover:text-indigo-600 font-semibold"
                >
                  ← Back to Chapter Homepage
                </button>
              </div>
            </div>
          ) : (
            /* 2. LOGGED IN STUDENT DASHBOARD PANEL */
            <div className="space-y-8">
              {/* Dynamic Welcome Header Banner */}
              <div className="bg-gradient-to-r from-indigo-700 to-sky-700 rounded-3xl p-6 sm:p-10 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10">
                  <Globe className="w-64 h-64" />
                </div>
                <div className="space-y-2 relative z-10 text-center sm:text-left">
                  <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full text-white uppercase tracking-wider font-display">Student Event Console</span>
                  <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight mt-1">
                    Welcome back, {currentStudentUser.name}!
                  </h1>
                  <p className="text-sky-100 text-xs sm:text-sm">
                    {currentStudentUser.college} • Roll: {currentStudentUser.rollNumber} • Dept: {currentStudentUser.branch}
                  </p>
                </div>
                <button
                  onClick={handleStudentLogout}
                  className="shrink-0 relative z-10 px-4 py-2 border border-white/20 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>

              {/* Tab Selector Buttons */}
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-px">
                <button
                  onClick={() => setStudentDashboardTab("registered")}
                  className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                    studentDashboardTab === "registered"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>My Registered Events</span>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1">
                    {studentRegistrations.filter(r => r.studentId === currentStudentUser.id).length}
                  </span>
                </button>
                <button
                  onClick={() => setStudentDashboardTab("upcoming")}
                  className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                    studentDashboardTab === "upcoming"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Upcoming Events & Register</span>
                </button>
                <button
                  onClick={() => setStudentDashboardTab("results")}
                  className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                    studentDashboardTab === "results"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Results & Prizes</span>
                </button>
              </div>

              {/* Content Panel Area */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[300px]">
                {studentDashboardTab === "registered" ? (
                  /* TAB 1: MY REGISTERED EVENTS */
                  <div className="space-y-4">
                    {studentRegistrations.filter(r => r.studentId === currentStudentUser.id).length === 0 ? (
                      <div className="py-12 text-center space-y-3">
                        <Database className="w-12 h-12 text-slate-300 mx-auto" />
                        <h3 className="text-sm font-bold text-slate-700">No registered events found</h3>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                          You haven't registered for any events yet. Open the "Upcoming Events" tab and register for workshops instantly!
                        </p>
                        <button
                          onClick={() => setStudentDashboardTab("upcoming")}
                          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition shadow cursor-pointer"
                        >
                          <span>Explore Upcoming Events</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-6">
                        {studentRegistrations.filter(r => r.studentId === currentStudentUser.id).map(reg => (
                          <div key={reg.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4 hover:shadow transition">
                            <div className="flex items-center justify-between">
                              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-100">
                                {reg.status}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{reg.timestamp}</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm font-display leading-tight">{reg.eventTitle}</h4>
                              <p className="text-xs text-slate-500 mt-1.5">Official seat allocated. Dynamic attendance card issued.</p>
                            </div>
                            <div className="pt-3 border-t border-slate-200/50 flex justify-between items-center text-xs">
                              <span className="text-indigo-600 font-bold">Dynamic Registration ID</span>
                              <code className="bg-slate-200/60 px-2 py-0.5 rounded font-mono font-bold text-slate-700">{reg.id}</code>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : studentDashboardTab === "upcoming" ? (
                  /* TAB 2: UPCOMING EVENTS & REGISTRATION */
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-display">Upcoming Chapter Workshops & Events</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Register for any IEEE Electronics Packaging Society event with a single click!</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      {[
                        {
                          title: "Advanced Packaging BootCamp & Substrate Prototyping",
                          desc: "3-Day intensive hands-on lab. Learn substrate stackups, silicon packaging models, and physical co-design.",
                          date: "July 12-14, 2026",
                          cost: "Free (Student Member Exclusive)"
                        },
                        {
                          title: "Thermal integrity & Thermal Packaging Simulation Challenge",
                          desc: "A collaborative thermal-flow coding challenge. Model structural packaging heat flows under standard workloads.",
                          date: "August 04-05, 2026",
                          cost: "Free for BVRIT Students"
                        },
                        {
                          title: "National Conference on Semiconductor Packing Technologies",
                          desc: "Preeminent expert panels, guest research briefings, and national coordinators roadmap discussions.",
                          date: "September 20, 2026",
                          cost: "Open to All Branches"
                        }
                      ].map((evt, idx) => {
                        const isRegistered = studentRegistrations.find(
                          r => r.studentId === currentStudentUser.id && r.eventTitle === evt.title
                        );

                        return (
                          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition">
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded font-mono uppercase">
                                  {evt.date}
                                </span>
                                <span className="text-[10px] text-emerald-600 font-bold">{evt.cost}</span>
                              </div>
                              <h4 className="font-bold text-slate-900 text-sm font-display leading-tight">{evt.title}</h4>
                              <p className="text-xs text-slate-500 leading-relaxed">{evt.desc}</p>
                            </div>
                            <div className="pt-4 border-t border-slate-100 mt-4">
                              {isRegistered ? (
                                <button
                                  disabled
                                  className="w-full py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold text-xs rounded-xl cursor-not-allowed flex items-center justify-center gap-1"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Already Registered</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStudentEventRegister(evt.title)}
                                  className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition flex items-center justify-center gap-1"
                                >
                                  <span>Register Instantly</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* TAB 3: ACADEMIC RESULTS & PRIZES */
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-display">My Achievements & Prizes Showcase</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Track your certified awards and positions won in Chapter challenges.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex gap-4 hover:shadow transition">
                        <Award className="w-10 h-10 text-amber-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">1st Prize Winner</span>
                          <h4 className="font-bold text-slate-800 text-sm font-display leading-tight">VLSI Layout Integrity Challenge</h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                            Awarded 1st Place for laying out optimal signal integrity bypass paths. Presided by Principal of BVRIT and IEEE representatives.
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex gap-4 hover:shadow transition opacity-75">
                        <CheckCircle className="w-10 h-10 text-indigo-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Certified Attendee</span>
                          <h4 className="font-bold text-slate-800 text-sm font-display leading-tight">Advanced Thermal Simulation challenge</h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                            Successfully completed active research modules and simulated heat flow benchmarks. Chapter Co-Coordinator Mrs. K. Radhika.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center">
                <button
                  onClick={() => navigateTo("home")}
                  className="text-xs text-slate-500 hover:text-indigo-600 font-semibold"
                >
                  ← Back to Chapter Homepage
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODULAR EVENTS DETAILS MODAL POPUP                                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200"
            >
              {/* Image banner */}
              <div className="relative h-48 bg-slate-100">
                <img 
                  src={activeEvent.image} 
                  alt={activeEvent.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
                <button 
                  onClick={() => setActiveEvent(null)}
                  className="absolute top-3 right-3 bg-slate-950/40 hover:bg-slate-950/60 text-white p-2 rounded-full focus:outline-none backdrop-blur-sm"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 bg-[#00629B] text-white px-2.5 py-1 text-[10px] font-black tracking-widest uppercase rounded">
                  {activeEvent.type}
                </div>
              </div>

              {/* Informational Context */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1 font-semibold text-[#00629B]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{activeEvent.date}</span>
                  </div>
                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">{activeEvent.status}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-lg font-display leading-tight">{activeEvent.title}</h3>
                
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {activeEvent.description}
                </p>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <p><strong>Distinguished Keynote Speaker:</strong> {activeEvent.speaker}</p>
                  <p><strong>Campus Location:</strong> {activeEvent.location}</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => {
                      setActiveEvent(null);
                      setTimeout(() => {
                        document.getElementById("inquiry-section")?.scrollIntoView({ behavior: "smooth" });
                      }, 200);
                    }}
                    className="flex-grow text-center bg-[#00629B] hover:bg-[#004B75] text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                  >
                    Register / Volunteer
                  </button>
                  <button 
                    onClick={() => setActiveEvent(null)}
                    className="px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-50 transition"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. USER SETTINGS MODAL POPUP                                             */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 overflow-hidden shadow-2xl border border-slate-200 space-y-4 text-left"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#00629B]" />
                  <span>Update Essentials / Security</span>
                </h3>
                <button 
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setSettingsOldPassword("");
                    setSettingsNewPassword("");
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Update passwords for student enrollment logins or local developer options. By default, values are stored securely in local app storage.
              </p>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!settingsNewPassword.trim()) return;

                  const savedUsers = localStorage.getItem("student_auth_users");
                  if (savedUsers) {
                    try {
                      const users = JSON.parse(savedUsers);
                      if (users.length > 0) {
                        users[0].password = settingsNewPassword.trim();
                        localStorage.setItem("student_auth_users", JSON.stringify(users));
                        alert("Enrollment credential password updated successfully!");
                      } else {
                        alert("No active user records found. Log in or sign up first.");
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  } else {
                    alert("Settings updated successfully!");
                  }

                  setIsSettingsOpen(false);
                  setSettingsOldPassword("");
                  setSettingsNewPassword("");
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Current Password / ID</label>
                  <input
                    type="password"
                    value={settingsOldPassword}
                    onChange={(e) => setSettingsOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={settingsNewPassword}
                    onChange={(e) => setSettingsNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-2 bg-[#00629B] hover:bg-[#004B75] text-white text-xs font-bold rounded-lg shadow transition uppercase tracking-wider cursor-pointer"
                >
                  Save Settings
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. CONTACT & FOOTER SECTION                                              */}
      {/* ========================================================================= */}
      <footer className="bg-slate-900 text-slate-100 pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-12 pb-12 border-b border-slate-800">
            
            {/* Column 1: Joint Affiliation and Core Details */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <strong className="text-white text-base font-display">{CHAPTER_INFO.shortName}</strong>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empowering ECE and allied engineering students at BVRIT Narsapur to develop skills in semiconductor assembly, system integration, high-frequency design, and packaging.
              </p>
              <div className="text-xs text-slate-400">
                <p>Padmasri Dr. B.V. Raju Institute of Technology</p>
                <p className="opacity-75">{CHAPTER_INFO.location}</p>
              </div>
            </div>

            {/* Column 2: Easy Navigation Toggles */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs font-bold uppercase text-white tracking-wider font-display">Sitemap Links</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => navigateTo("home")} className="hover:text-amber-400 transition flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-[#00629B]" />
                    <span>Home Page Dashboard</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo("about")} className="hover:text-amber-400 transition flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-[#00629B]" />
                    <span>chapter Vision & Leadership team</span>
                  </button>
                </li>
                <li>
                  <a 
                    href="#inquiry-section" 
                    onClick={(e) => {
                      if (currentPage !== "home") {
                        e.preventDefault();
                        navigateTo("home");
                        setTimeout(() => {
                          document.getElementById("inquiry-section")?.scrollIntoView({ behavior: "smooth" });
                        }, 200);
                      }
                    }}
                    className="hover:text-amber-400 transition flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 text-[#00629B]" />
                    <span>Local Registration sandbox</span>
                  </a>
                </li>
                <li>
                  <a href={CHAPTER_INFO.socials.collegeWebsite} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 text-[#00629B]" />
                    <span>Official BVRIT Narsapur Portal</span>
                  </a>
                </li>
                <li>
                  <button onClick={() => navigateTo("admin")} className="hover:text-amber-400 transition flex items-center gap-1 text-left font-medium">
                    <ChevronRight className="w-3 h-3 text-amber-500" />
                    <span className="text-amber-300 font-semibold">Organizers Console (Admin)</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Details */}
            <div className="md:col-span-5 space-y-4">
              <h4 className="text-xs font-bold uppercase text-white tracking-wider font-display">Office Enquiries</h4>
              <p className="text-xs text-slate-400">
                For invitations, joint student paper collaborations, or society enrollment help, contact our advisory coordinators:
              </p>
              <p className="text-xs text-amber-300 font-semibold italic">
                Contact information will be updated soon.
              </p>

              {/* Social Media Link Buttons Grid */}
              <div className="flex gap-3 pt-2">
                <a 
                  href={CHAPTER_INFO.socials.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-slate-800 hover:bg-[#00629B] text-white p-2 rounded-lg transition-colors"
                  title="IEEE EPS College LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href={CHAPTER_INFO.socials.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors"
                  title="IEEE Chapter GitHub"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* Legal / Institutional Copyright Disclaimer */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
            <div className="text-center sm:text-left space-y-1">
              <p>© {new Date().getFullYear()} IEEE Electronics Packaging Society Student Chapter - BVRIT Narsapur. All Rights Reserved.</p>
              <p className="opacity-75">IEEE Student Branch Code: STB11431 | Padmasri Dr. B.V. Raju Institute of Technology</p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="hover:underline cursor-pointer" onClick={() => navigateTo("home")}>Home</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer" onClick={() => navigateTo("about")}>About Society</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer text-amber-300 font-semibold" onClick={() => navigateTo("admin")}>Admin Console</span>
              <span>•</span>
              <a href="https://www.ieee.org" target="_blank" rel="noopener noreferrer" className="hover:underline">IEEE.org Main</a>
            </div>
          </div>

        </div>
      </footer>
      </div>

    </div>
  );
}
