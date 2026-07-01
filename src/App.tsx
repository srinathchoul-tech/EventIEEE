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

import { useState, useEffect, useRef, FormEvent } from "react";
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
  ChevronLeft,
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
  Settings,
  Twitter,
  Facebook,
  Instagram,
  Image,
  Plus,
  Edit,
  FileText,
  ClipboardList
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
import facultyPrasannaImg from "../assets/faculty-prasanna.jpg";
import { db, auth, isFirebaseEnabled } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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

const isAdminEmail = (email: string) => {
  if (!email) return false;
  const e = email.toLowerCase().trim();
  return e === "24211a04r1@bvrit.ac.in" || e === "24211a05r1@bvrit.ac.in" || e === "24211a05b5@bvrit.ac.in" || e === "admin@ieee.org";
};

export default function App() {
  // Page routing state ('home' | 'about' | 'admin' | 'student' | 'settings')
  const [currentPage, setCurrentPage] = useState<"home" | "about" | "admin" | "student" | "settings" | "gallery" | "location">("home");
  
  // Mobile sidebar navigation rail toggle state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // References for handling click-outside dismissals
  const searchRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Profile dropdown menu state
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  // Gallery state management
  const [galleryImages, setGalleryImages] = useState<Array<{
    id: string;
    title: string;
    caption: string;
    url: string;
    category: string;
  }>>(() => {
    const saved = localStorage.getItem("ieee_gallery_images");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: "gal-1",
        title: "Hands-on Modeling Session",
        caption: "Students analyzing thermodynamic plots of 3D package stacks.",
        url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
        category: "Workshops"
      },
      {
        id: "gal-2",
        title: "Chapter Orientation 2026",
        caption: "A huge turnout of engineering enthusiasts for our initial EPS roadmap briefing.",
        url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80",
        category: "Inauguration"
      },
      {
        id: "gal-3",
        title: "Micro-PCB Solder Workshop",
        caption: "Getting hands-on precision soldering with standard lead-free substrates.",
        url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
        category: "Workshops"
      },
      {
        id: "gal-4",
        title: "Industry Expert Virtual Meet",
        caption: "Virtual roundtable discussing Advanced Packaging innovations with Silicon Valley mentors.",
        url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80",
        category: "Seminars"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("ieee_gallery_images", JSON.stringify(galleryImages));
  }, [galleryImages]);

  // Gallery view and interactive controls
  const [galleryFilter, setGalleryFilter] = useState("All");
  const [lightboxImage, setLightboxImage] = useState<any | null>(null);
  const [showGalleryAddEditModal, setShowGalleryAddEditModal] = useState<"add" | "edit" | null>(null);
  const [editingGalleryImage, setEditingGalleryImage] = useState<any | null>(null);

  // Form states for gallery add/edit
  const [galleryFormTitle, setGalleryFormTitle] = useState("");
  const [galleryFormCaption, setGalleryFormCaption] = useState("");
  const [galleryFormCategory, setGalleryFormCategory] = useState("Workshops");
  const [galleryFormUrl, setGalleryFormUrl] = useState("");
  const [galleryFormError, setGalleryFormError] = useState("");
  const [galleryNotification, setGalleryNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (galleryNotification) {
      const timer = setTimeout(() => setGalleryNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [galleryNotification]);

  // Gallery view helper variables and hooks
  const filteredImages = galleryImages.filter(img => {
    if (galleryFilter === "All") return true;
    return img.category === galleryFilter;
  });

  const getCategoryCount = (cat: string) => {
    if (cat === "All") return galleryImages.length;
    return galleryImages.filter(img => img.category === cat).length;
  };

  useEffect(() => {
    if (!lightboxImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeIndex = filteredImages.findIndex(img => img.id === lightboxImage.id);
      if (activeIndex === -1) return;

      if (e.key === "ArrowLeft") {
        const prevIndex = (activeIndex - 1 + filteredImages.length) % filteredImages.length;
        setLightboxImage(filteredImages[prevIndex]);
      } else if (e.key === "ArrowRight") {
        const nextIndex = (activeIndex + 1) % filteredImages.length;
        setLightboxImage(filteredImages[nextIndex]);
      } else if (e.key === "Escape") {
        setLightboxImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImage, galleryImages, galleryFilter]);
  
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
  const [openSettingSection, setOpenSettingSection] = useState<string>("notifications");
  const [showStudentAuthModal, setShowStudentAuthModal] = useState(false);
  const [pendingEventToRegister, setPendingEventToRegister] = useState<string | null>(null);
  
  // Local Student Inquiry Submission State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    rollNumber: "",
    ieeeId: "",
    password: "",
    year: "1st Year",
    branch: "APS",
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
  const [studentAuthBranch, setStudentAuthBranch] = useState("APS");
  const [studentAuthError, setStudentAuthError] = useState("");
  const [studentDashboardTab, setStudentDashboardTab] = useState<"registered" | "upcoming" | "results">("registered");
  const [studentRegistrations, setStudentRegistrations] = useState<any[]>([]);

  // Competitions & Hackathons state
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [competitionFormData, setCompetitionFormData] = useState({
    title: "",
    category: "Hackathons",
    desc: "",
    date: "",
    cost: "Free",
    googleFormUrl: ""
  });
  const [selectedCompForRegs, setSelectedCompForRegs] = useState<any | null>(null);
  const [pastedRegsInput, setPastedRegsInput] = useState("");
  const [selectedCompForResults, setSelectedCompForResults] = useState<any | null>(null);
  const [resultsInput, setResultsInput] = useState("");

  // Announcements, Ticker and Admin Tabs state
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [tickerText, setTickerText] = useState("");
  const [adminTab, setAdminTab] = useState<"enquiries" | "announcements" | "ticker" | "carousel" | "pending-requests" | "gallery" | "competitions">("enquiries");
  
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
  const [adminNotification, setAdminNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error" | "info" | "warning"; message: string } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "success") => {
    setToast({ type, message });
  };

  // Firebase Admin Console State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem("ieee_is_admin_logged_in") === "true";
  });
  const [loggedInAdminEmail, setLoggedInAdminEmail] = useState(() => {
    return localStorage.getItem("ieee_logged_in_admin_email") || "";
  });
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

  // Auto-dismiss admin toast notifications
  useEffect(() => {
    if (adminNotification) {
      const timer = setTimeout(() => setAdminNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [adminNotification]);

  // Auto-dismiss global toast notifications
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Click outside to dismiss search popup & register dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchPopupOpen(false);
      }
      if (registerRef.current && !registerRef.current.contains(event.target as Node)) {
        setIsRegisterDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Override window.alert globally to use custom inline toast notifications
  useEffect(() => {
    window.alert = (message) => {
      let type: "success" | "error" | "info" | "warning" = "info";
      const lower = message.toLowerCase();
      if (
        lower.includes("success") || 
        lower.includes("created") || 
        lower.includes("logged in") || 
        lower.includes("updated") || 
        lower.includes("saved") ||
        lower.includes("added")
      ) {
        type = "success";
      } else if (
        lower.includes("failed") || 
        lower.includes("error") || 
        lower.includes("invalid") || 
        lower.includes("incorrect") ||
        lower.includes("could not") ||
        lower.includes("no active")
      ) {
        type = "error";
      } else if (
        lower.includes("already") ||
        lower.includes("please") ||
        lower.includes("deactivated")
      ) {
        type = "warning";
      }
      showToast(message, type);
    };
  }, []);

  // Monitor auth state changes & load registrations on component mount
  useEffect(() => {
    if (isFirebaseEnabled && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAdminLoggedIn(true);
          setLoggedInAdminEmail(user.email || "");
          localStorage.setItem("ieee_is_admin_logged_in", "true");
          localStorage.setItem("ieee_logged_in_admin_email", user.email || "");
        } else {
          setIsAdminLoggedIn(false);
          setLoggedInAdminEmail("");
          localStorage.removeItem("ieee_is_admin_logged_in");
          localStorage.removeItem("ieee_logged_in_admin_email");
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

    // Load dynamic competitions
    const savedCompetitions = localStorage.getItem("ieee_competitions");
    if (savedCompetitions) {
      try {
        setCompetitions(JSON.parse(savedCompetitions));
      } catch (e) {
        console.error(e);
      }
    } else {
      setCompetitions([]);
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
  const navigateTo = (page: "home" | "about" | "admin" | "student" | "settings" | "gallery") => {
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
      showToast("Please fill in the required fields (Name, Email, Roll Number).", "warning");
      return;
    }
    const timestampStr = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    const isChair = isAdminEmail(formData.email);
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
      timestamp: timestampStr,
      status: formData.password ? (isChair ? "approved" : "pending") : "approved"
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
          showToast("Could not connect to online cloud. Saving locally to browser cache.", "warning");
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
      branch: "APS",
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
        showToast("Failed to delete the online record.", "error");
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

  // Approve request handler
  const handleApproveRequest = async (id: string) => {
    if (!window.confirm("Are you sure you want to approve this registration request?")) return;
    
    if (isFirebaseEnabled && db) {
      try {
        const docRef = doc(db, "enquiries", id);
        await updateDoc(docRef, { status: "approved" });
        setReceivedEnquiries(prev => prev.map(item => item.id === id ? { ...item, status: "approved" } : item));
      } catch (err) {
        console.error("Error updating Firestore status:", err);
        showToast("Failed to approve the online request.", "error");
      }
    } else {
      // Fallback local storage
      const saved = localStorage.getItem("ieee_eps_enquiries");
      if (saved) {
        try {
          const list = JSON.parse(saved);
          const updated = list.map((item: any) => item.id === id ? { ...item, status: "approved" } : item);
          setReceivedEnquiries(updated);
          localStorage.setItem("ieee_eps_enquiries", JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  // Reject request handler
  const handleRejectRequest = async (id: string) => {
    if (!window.confirm("Are you sure you want to reject (delete) this registration request?")) return;
    
    if (isFirebaseEnabled && db) {
      try {
        const docRef = doc(db, "enquiries", id);
        await deleteDoc(docRef);
        setReceivedEnquiries(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        console.error("Error deleting from Firestore:", err);
        showToast("Failed to reject the online request.", "error");
      }
    } else {
      // Fallback local storage
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

  // Gallery Management Handlers
  const handleOpenAddGalleryModal = () => {
    setGalleryFormTitle("");
    setGalleryFormCaption("");
    setGalleryFormCategory("Workshops");
    setGalleryFormUrl("");
    setGalleryFormError("");
    setEditingGalleryImage(null);
    setShowGalleryAddEditModal("add");
  };

  const handleOpenEditGalleryModal = (img: any) => {
    setEditingGalleryImage(img);
    setGalleryFormTitle(img.title);
    setGalleryFormCaption(img.caption);
    setGalleryFormCategory(img.category);
    setGalleryFormUrl(img.url);
    setGalleryFormError("");
    setShowGalleryAddEditModal("edit");
  };

  const handleSaveGalleryImage = (e: any) => {
    e.preventDefault();
    if (!galleryFormTitle.trim() || !galleryFormCaption.trim() || !galleryFormUrl.trim()) {
      setGalleryFormError("Please fill in all fields and upload/provide an image.");
      return;
    }

    if (showGalleryAddEditModal === "add") {
      const newImg = {
        id: "gal-" + Date.now(),
        title: galleryFormTitle.trim(),
        caption: galleryFormCaption.trim(),
        category: galleryFormCategory,
        url: galleryFormUrl
      };
      setGalleryImages([newImg, ...galleryImages]);
      setGalleryNotification({ type: "success", message: "Photo added successfully to the gallery!" });
    } else if (showGalleryAddEditModal === "edit" && editingGalleryImage) {
      const updated = galleryImages.map((img) => 
        img.id === editingGalleryImage.id 
          ? { 
              ...img, 
              title: galleryFormTitle.trim(), 
              caption: galleryFormCaption.trim(), 
              category: galleryFormCategory, 
              url: galleryFormUrl 
            } 
          : img
      );
      setGalleryImages(updated);
      setGalleryNotification({ type: "success", message: "Photo details updated successfully!" });
    }

    setShowGalleryAddEditModal(null);
    setEditingGalleryImage(null);
  };

  const handleDeleteGalleryImage = (id: string) => {
    if (confirm("Are you sure you want to delete this photo from the gallery?")) {
      const updated = galleryImages.filter((img) => img.id !== id);
      setGalleryImages(updated);
      setGalleryNotification({ type: "success", message: "Photo deleted successfully from the gallery!" });
    }
  };

  const isImageUrl = (url: string) => {
    if (!url) return false;
    if (url.startsWith("data:image/")) return true;
    const cleanUrl = url.toLowerCase().split(/[?#]/)[0];
    return cleanUrl.match(/\.(jpeg|jpg|gif|png|webp|svg|bmp)$/) !== null || url.includes("unsplash.com") || url.includes("picsum.photos");
  };

  const getFileExtensionLabel = (url: string) => {
    if (!url) return "FILE";
    if (url.startsWith("data:")) {
      const match = url.match(/data:(.*?);/);
      if (match) {
        const mime = match[1];
        if (mime.includes("pdf")) return "PDF";
        if (mime.includes("msword") || mime.includes("officedocument.wordprocessingml")) return "DOCX";
        if (mime.includes("excel") || mime.includes("officedocument.spreadsheetml")) return "XLSX";
        if (mime.includes("powerpoint") || mime.includes("officedocument.presentationml")) return "PPTX";
        if (mime.includes("text/plain")) return "TXT";
      }
    }
    const cleanUrl = url.toLowerCase().split(/[?#]/)[0];
    const ext = cleanUrl.split('.').pop();
    return ext ? ext.toUpperCase() : "FILE";
  };

  const getFileIcon = (url: string, className = "w-6 h-6") => {
    const ext = getFileExtensionLabel(url);
    if (ext === "PDF") return <FileText className={`${className} text-rose-500`} />;
    if (ext === "DOCX" || ext === "DOC") return <FileText className={`${className} text-blue-500`} />;
    if (ext === "XLSX" || ext === "XLS") return <FileText className={`${className} text-emerald-500`} />;
    if (ext === "PPTX" || ext === "PPT") return <FileText className={`${className} text-amber-500`} />;
    return <FileText className={`${className} text-slate-400`} />;
  };

  const handleViewOrDownloadFile = (url: string, title: string) => {
    if (!url) return;
    if (url.startsWith("data:application/pdf") || url.startsWith("data:text") || url.startsWith("data:image")) {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<iframe src="${url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
        newWindow.document.title = title;
      }
    } else if (url.startsWith("data:")) {
      const link = document.createElement("a");
      link.href = url;
      const ext = getFileExtensionLabel(url).toLowerCase();
      link.download = `${title.replace(/\s+/g, "_")}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(url, "_blank");
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
      const emailLower = adminEmail.toLowerCase();
      const matchesEnrolled = receivedEnquiries.find(
        enq => enq.email?.toLowerCase() === emailLower && enq.password === adminPassword
      );

      if (matchesEnrolled) {
        if (matchesEnrolled.status === "pending") {
          setAuthError("Your registration request is pending approval from the Chair (24211a05r1@bvrit.ac.in).");
          setIsAuthenticating(false);
          return;
        }
        if (matchesEnrolled.status === "rejected") {
          setAuthError("Your registration request has been rejected.");
          setIsAuthenticating(false);
          return;
        }
      }

      if ((emailLower === "admin@ieee.org" && adminPassword === "admin123") || (matchesEnrolled && matchesEnrolled.status !== "pending")) {
        setIsAdminLoggedIn(true);
        setLoggedInAdminEmail(emailLower);
        localStorage.setItem("ieee_is_admin_logged_in", "true");
        localStorage.setItem("ieee_logged_in_admin_email", emailLower);
        setAdminEmail("");
        setAdminPassword("");
        fetchEnquiries();
      } else {
        setAuthError("Invalid credentials. Hint: Use 'admin@ieee.org' and 'admin123', or any approved student organizer account to login.");
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
        setLoggedInAdminEmail("");
        localStorage.removeItem("ieee_is_admin_logged_in");
        localStorage.removeItem("ieee_logged_in_admin_email");
      } catch (err) {
        console.error("Sign out error:", err);
      }
    } else {
      setIsAdminLoggedIn(false);
      setLoggedInAdminEmail("");
      localStorage.removeItem("ieee_is_admin_logged_in");
      localStorage.removeItem("ieee_logged_in_admin_email");
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
    setShowStudentAuthModal(false);

    // Auto-register pending event if any
    if (pendingEventToRegister) {
      const eventTitle = pendingEventToRegister;
      setPendingEventToRegister(null);
      
      const newReg = {
        id: "reg-" + Date.now(),
        studentId: newStudent.id,
        studentName: newStudent.name,
        studentRoll: newStudent.rollNumber,
        eventTitle: eventTitle,
        timestamp: new Date().toLocaleString(),
        status: "Confirmed"
      };
      const updatedRegs = [...studentRegistrations, newReg];
      setStudentRegistrations(updatedRegs);
      localStorage.setItem("ieee_student_registrations", JSON.stringify(updatedRegs));
      showToast(`Account created! Success: registered for "${eventTitle}".`, "success");
    }
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
      setShowStudentAuthModal(false);
      
      // Auto-register pending event if any
      if (pendingEventToRegister) {
        const eventTitle = pendingEventToRegister;
        setPendingEventToRegister(null);
        
        // Execute registration logic
        const alreadyRegistered = studentRegistrations.find(
          r => r.studentId === user.id && r.eventTitle === eventTitle
        );
        if (!alreadyRegistered) {
          const newReg = {
            id: "reg-" + Date.now(),
            studentId: user.id,
            studentName: user.name,
            studentRoll: user.rollNumber,
            eventTitle: eventTitle,
            timestamp: new Date().toLocaleString(),
            status: "Confirmed"
          };
          const updatedRegs = [...studentRegistrations, newReg];
          setStudentRegistrations(updatedRegs);
          localStorage.setItem("ieee_student_registrations", JSON.stringify(updatedRegs));
          showToast(`Logged in! Success: registered for "${eventTitle}".`, "success");
        } else {
          showToast(`Logged in! Note: You were already registered for "${eventTitle}".`, "warning");
        }
      }
    } else {
      setStudentAuthError("Invalid student credentials. If you do not have an account, click 'Create Account' above.");
    }
  };

  // Google Login Handlers
  const handleStudentGoogleLogin = async () => {
    setStudentAuthError("");
    if (isFirebaseEnabled && auth) {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        if (user && user.email) {
          const emailLower = user.email.toLowerCase();
          let student = studentUsers.find(u => u.email.toLowerCase() === emailLower);
          
          if (!student) {
            // Register new Google student user
            const randomRoll = "G-" + Math.floor(100000 + Math.random() * 900000);
            student = {
              id: "student-" + Date.now(),
              name: user.displayName || "Google Student",
              email: user.email,
              password: "google-auth-protected",
              rollNumber: randomRoll,
              college: "BVRIT Narsapur",
              branch: "APS"
            };
            const updatedUsers = [...studentUsers, student];
            setStudentUsers(updatedUsers);
            localStorage.setItem("ieee_student_users", JSON.stringify(updatedUsers));
          }
          
          setCurrentStudentUser(student);
          localStorage.setItem("ieee_student_current_user", JSON.stringify(student));
          setShowStudentAuthModal(false);
          
          // Auto-register pending event if any
          if (pendingEventToRegister) {
            const eventTitle = pendingEventToRegister;
            setPendingEventToRegister(null);
            
            const alreadyRegistered = studentRegistrations.find(
              r => r.studentId === student.id && r.eventTitle === eventTitle
            );
            if (!alreadyRegistered) {
              const newReg = {
                id: "reg-" + Date.now(),
                studentId: student.id,
                studentName: student.name,
                studentRoll: student.rollNumber,
                eventTitle: eventTitle,
                timestamp: new Date().toLocaleString(),
                status: "Confirmed"
              };
              const updatedRegs = [...studentRegistrations, newReg];
              setStudentRegistrations(updatedRegs);
              localStorage.setItem("ieee_student_registrations", JSON.stringify(updatedRegs));
              showToast(`Success! Logged in via Google and registered for "${eventTitle}".`, "success");
            } else {
              showToast(`Success! Logged in via Google. Note: You were already registered for "${eventTitle}".`, "warning");
            }
          } else {
            showToast(`Welcome back! Successfully logged in via Google.`, "success");
          }
        }
      } catch (err: any) {
        console.error("Google login error:", err);
        setStudentAuthError(err.message || "Failed to sign in with Google.");
      }
    } else {
      // Local fallback Google Sign-in Mock
      const mockEmail = "google_student@bvrit.ac.in";
      let student = studentUsers.find(u => u.email.toLowerCase() === mockEmail);
      if (!student) {
        student = {
          id: "student-mock-google",
          name: "Mock Google Student",
          email: mockEmail,
          password: "google-auth-protected",
          rollNumber: "G-24211A0501",
          college: "BVRIT Narsapur",
          branch: "APS"
        };
        const updatedUsers = [...studentUsers, student];
        setStudentUsers(updatedUsers);
        localStorage.setItem("ieee_student_users", JSON.stringify(updatedUsers));
      }
      setCurrentStudentUser(student);
      localStorage.setItem("ieee_student_current_user", JSON.stringify(student));
      setShowStudentAuthModal(false);
      
      // Auto-register pending event if any
      if (pendingEventToRegister) {
        const eventTitle = pendingEventToRegister;
        setPendingEventToRegister(null);
        
        const alreadyRegistered = studentRegistrations.find(
          r => r.studentId === student.id && r.eventTitle === eventTitle
        );
        if (!alreadyRegistered) {
          const newReg = {
            id: "reg-" + Date.now(),
            studentId: student.id,
            studentName: student.name,
            studentRoll: student.rollNumber,
            eventTitle: eventTitle,
            timestamp: new Date().toLocaleString(),
            status: "Confirmed"
          };
          const updatedRegs = [...studentRegistrations, newReg];
          setStudentRegistrations(updatedRegs);
          localStorage.setItem("ieee_student_registrations", JSON.stringify(updatedRegs));
          showToast(`Sandbox Mode: Logged in via Mock Google Account and registered for "${eventTitle}".`, "success");
        } else {
          showToast(`Sandbox Mode: Logged in via Mock Google Account. Note: You were already registered for "${eventTitle}".`, "warning");
        }
      } else {
        showToast("Sandbox Mode: Successfully logged in via Mock Google Account.", "success");
      }
    }
  };

  const handleAdminGoogleLogin = async () => {
    setAuthError("");
    setIsAuthenticating(true);
    if (isFirebaseEnabled && auth) {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        if (user && user.email) {
          const emailLower = user.email.toLowerCase();
          
          // Verify if they are in the database/approvals or is the default admin
          const matchesEnrolled = receivedEnquiries.find(
            enq => enq.email?.toLowerCase() === emailLower
          );
          
          if (emailLower === "admin@ieee.org" || (matchesEnrolled && matchesEnrolled.status !== "pending" && matchesEnrolled.status !== "rejected") || emailLower.endsWith("@bvrit.ac.in") || emailLower.endsWith("@ieee.org")) {
            setIsAdminLoggedIn(true);
            setLoggedInAdminEmail(emailLower);
            localStorage.setItem("ieee_is_admin_logged_in", "true");
            localStorage.setItem("ieee_logged_in_admin_email", emailLower);
            fetchEnquiries();
            showToast(`Welcome! Successfully logged in as organizer via Google.`, "success");
          } else {
            // Default authorization message
            setAuthError(`Email ${emailLower} is not registered or approved as an organizer. Please complete the Chapter Enrollment Desk request first.`);
          }
        }
      } catch (err: any) {
        console.error("Admin Google login error:", err);
        setAuthError(err.message || "Failed to sign in with Google.");
      } finally {
        setIsAuthenticating(false);
      }
    } else {
      // Local fallback Mock Google Login for Admin
      const mockEmail = "admin@ieee.org";
      setIsAdminLoggedIn(true);
      setLoggedInAdminEmail(mockEmail);
      localStorage.setItem("ieee_is_admin_logged_in", "true");
      localStorage.setItem("ieee_logged_in_admin_email", mockEmail);
      fetchEnquiries();
      showToast("Sandbox Mode: Successfully logged in as Admin via Mock Google Account.", "success");
      setIsAuthenticating(false);
    }
  };

  // Student Logout Handler
  const handleStudentLogout = () => {
    setCurrentStudentUser(null);
    localStorage.removeItem("ieee_student_current_user");
  };

  // Student Event Registration Handler
  const handleStudentEventRegister = (eventTitle: string, initialStatus: string = "Confirmed") => {
    if (!currentStudentUser) {
      setPendingEventToRegister(eventTitle);
      setStudentAuthTab("login");
      setStudentAuthError("");
      setShowStudentAuthModal(true);
      return;
    }

    const alreadyRegistered = studentRegistrations.find(
      r => r.studentId === currentStudentUser.id && r.eventTitle === eventTitle
    );

    if (alreadyRegistered) {
      showToast(`You are already registered for "${eventTitle}"!`, "warning");
      return;
    }

    const newReg = {
      id: "reg-" + Date.now(),
      studentId: currentStudentUser.id,
      studentName: currentStudentUser.name,
      studentRoll: currentStudentUser.rollNumber,
      eventTitle: eventTitle,
      timestamp: new Date().toLocaleString(),
      status: initialStatus
    };

    const updatedRegs = [...studentRegistrations, newReg];
    setStudentRegistrations(updatedRegs);
    localStorage.setItem("ieee_student_registrations", JSON.stringify(updatedRegs));
    
    if (initialStatus === "Confirmed") {
      showToast(`Success! You have registered for "${eventTitle}". View details inside your dashboard.`, "success");
    } else {
      showToast(`Redirecting to registration form. View status in your dashboard.`, "info");
    }
  };

  // Create Competition / Opportunity
  const handleCreateCompetition = (e: FormEvent) => {
    e.preventDefault();
    if (!competitionFormData.title || !competitionFormData.googleFormUrl) {
      showToast("Please fill in all required fields.", "warning");
      return;
    }

    const newComp = {
      id: "comp-" + Date.now(),
      title: competitionFormData.title,
      category: competitionFormData.category,
      desc: competitionFormData.desc,
      date: competitionFormData.date,
      cost: competitionFormData.cost,
      googleFormUrl: competitionFormData.googleFormUrl,
      results: "",
      status: "Upcoming"
    };

    const updatedComps = [...competitions, newComp];
    setCompetitions(updatedComps);
    localStorage.setItem("ieee_competitions", JSON.stringify(updatedComps));

    // Reset Form
    setCompetitionFormData({
      title: "",
      category: "Hackathons",
      desc: "",
      date: "",
      cost: "Free",
      googleFormUrl: ""
    });

    showToast(`Opportunity "${newComp.title}" published successfully!`, "success");
  };

  // Delete Competition
  const handleDeleteCompetition = (compId: string) => {
    const updatedComps = competitions.filter(c => c.id !== compId);
    setCompetitions(updatedComps);
    localStorage.setItem("ieee_competitions", JSON.stringify(updatedComps));
    showToast("Opportunity deleted successfully.", "info");
  };

  // Link Google Form Responses to Student Accounts & Registrations
  const handleLinkGoogleFormResponses = (compId: string) => {
    if (!pastedRegsInput.trim()) {
      showToast("Please paste some roll numbers or emails.", "warning");
      return;
    }

    const targetComp = competitions.find(c => c.id === compId);
    if (!targetComp) return;

    // Split input by newlines, commas, or semicolons
    const tokens = pastedRegsInput
      .split(/[\n,;]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    let newlyLinkedCount = 0;
    let accountsCreatedCount = 0;

    let updatedUsers = [...studentUsers];
    let updatedRegs = [...studentRegistrations];

    tokens.forEach(token => {
      const isEmail = token.includes("@");
      
      // Try to find if student user already exists
      let matchedStudent = updatedUsers.find(u => 
        isEmail 
          ? u.email.toLowerCase() === token.toLowerCase() 
          : u.rollNumber.toLowerCase() === token.toLowerCase()
      );

      // If student user does not exist, create a placeholder student account!
      if (!matchedStudent) {
        const dummyId = "std-" + Date.now() + Math.random().toString(36).substr(2, 5);
        const namePart = isEmail ? token.split("@")[0] : token;
        matchedStudent = {
          id: dummyId,
          email: isEmail ? token.toLowerCase() : `${token.toLowerCase()}@bvrit.ac.in`,
          password: "password123", // Default placeholder password
          name: namePart.toUpperCase(),
          rollNumber: isEmail ? "LINKED-" + Date.now().toString().substr(-4) : token.toUpperCase(),
          branch: "ECE",
          college: "BVRIT Narsapur",
          isVerified: true
        };
        updatedUsers.push(matchedStudent);
        accountsCreatedCount++;
      }

      // Check if registration already exists for this student and this event
      const regExists = updatedRegs.find(
        r => r.studentId === matchedStudent.id && r.eventTitle === targetComp.title
      );

      if (!regExists) {
        // Create registration record
        const newReg = {
          id: "reg-" + Date.now() + Math.random().toString(36).substr(2, 5),
          studentId: matchedStudent.id,
          studentName: matchedStudent.name,
          studentRoll: matchedStudent.rollNumber,
          eventTitle: targetComp.title,
          timestamp: new Date().toLocaleString(),
          status: "Confirmed" // Organizer confirmed from Google Form
        };
        updatedRegs.push(newReg);
        newlyLinkedCount++;
      } else if (regExists.status === "Pending Confirmation") {
        // Upgrade from Pending to Confirmed!
        regExists.status = "Confirmed";
        newlyLinkedCount++;
      }
    });

    setStudentUsers(updatedUsers);
    localStorage.setItem("ieee_student_users", JSON.stringify(updatedUsers));

    setStudentRegistrations(updatedRegs);
    localStorage.setItem("ieee_student_registrations", JSON.stringify(updatedRegs));
    
    showToast(
      `Successfully linked ${newlyLinkedCount} registration(s)! Created ${accountsCreatedCount} new student profile(s) with password 'password123'.`, 
      "success"
    );

    // Clear modals
    setSelectedCompForRegs(null);
    setPastedRegsInput("");
  };

  // Save Competition Results / Prizes
  const handleSaveResults = (compId: string) => {
    const updatedComps = competitions.map(c => {
      if (c.id === compId) {
        return { ...c, results: resultsInput };
      }
      return c;
    });
    setCompetitions(updatedComps);
    localStorage.setItem("ieee_competitions", JSON.stringify(updatedComps));
    showToast(`Results updated for this opportunity.`, "success");
    setSelectedCompForResults(null);
    setResultsInput("");
  };

  // CSV Export logic
  const handleExportCSV = () => {
    if (receivedEnquiries.length === 0) {
      showToast("No data available to export.", "warning");
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
      showToast("No data available to export.", "warning");
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
      {/* Dimmed Background Overlay on Mobile when Sidebar is Open */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 sm:hidden transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Unstop-Style Left Navigation Sidebar Rail */}
      <aside className={`fixed bottom-0 w-16 sm:w-20 bg-[#0F172A] border-r border-slate-800 z-40 flex flex-col items-center py-5 gap-6 shadow-2xl text-white select-none transition-all duration-300 left-0 sm:translate-x-0 ${
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } ${
        currentPage === "home" ? "top-[128px] sm:top-[140px]" : "top-[84px] sm:top-[96px]"
      }`}>
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
                navigateTo("student");
                setStudentDashboardTab("upcoming");
              },
              subsections: [
                { name: "Events Calendar", action: () => {
                  navigateTo("student");
                  setStudentDashboardTab("upcoming");
                }},
                { name: "Competitions", action: () => {
                  navigateTo("student");
                  setSearchQuery("Competitions");
                  setStudentDashboardTab("upcoming");
                }},
                { name: "Quizzes", action: () => {
                  navigateTo("student");
                  setSearchQuery("Quizzes");
                  setStudentDashboardTab("upcoming");
                }},
                { name: "Hackathons", action: () => {
                  navigateTo("student");
                  setSearchQuery("Hackathons");
                  setStudentDashboardTab("upcoming");
                }},
                { name: "Cultural Events", action: () => {
                  navigateTo("student");
                  setSearchQuery("Cultural Events");
                  setStudentDashboardTab("upcoming");
                }},
                { name: "Conferences", action: () => {
                  navigateTo("student");
                  setSearchQuery("Conferences");
                  setStudentDashboardTab("upcoming");
                }},
                { name: "Workshops", action: () => {
                  navigateTo("student");
                  setSearchQuery("Workshops");
                  setStudentDashboardTab("upcoming");
                }},
                { name: "College Festivals", action: () => {
                  navigateTo("student");
                  setSearchQuery("College Festivals");
                  setStudentDashboardTab("upcoming");
                }},
                { name: "Mentors", action: () => {
                  navigateTo("about");
                  setTimeout(() => document.getElementById("advisory-section")?.scrollIntoView({ behavior: "smooth" }), 400);
                }},
                { name: "Articles", action: () => {
                  navigateTo("home");
                  setTimeout(() => document.getElementById("announcements")?.scrollIntoView({ behavior: "smooth" }), 400);
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
              id: "gallery",
              name: "Society Gallery",
              icon: <Image className="w-5 h-5 sm:w-6 sm:h-6" />,
              action: () => {
                navigateTo("gallery");
              },
              subsections: [
                { name: "View Gallery", action: () => navigateTo("gallery") },
                { name: "Photo Archive", action: () => navigateTo("gallery") }
              ]
            },
            {
              id: "contact",
              name: "Contact us",
              icon: <Phone className="w-5 h-5 sm:w-6 sm:h-6" />,
              action: () => {
                if (currentPage !== "home") {
                  navigateTo("home");
                  setTimeout(() => {
                    document.getElementById("footer-section")?.scrollIntoView({ behavior: "smooth" });
                  }, 300);
                } else {
                  document.getElementById("footer-section")?.scrollIntoView({ behavior: "smooth" });
                }
              }
            },
            {
              id: "location",
              name: "Location",
              icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />,
              action: () => {
                navigateTo("location");
              }
            }
          ].map((sec) => {
            const isActive = currentPage === sec.id;
            return (
              <div key={sec.id} className="relative group w-full flex flex-col items-center">
                <button
                  onClick={() => {
                    sec.action();
                    setIsMobileSidebarOpen(false);
                  }}
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
                {sec.subsections && sec.subsections.length > 0 && (
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
                            setIsMobileSidebarOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 text-slate-700 hover:text-[#00629B] transition-colors"
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
            {/* Left Brand Area: Toggle & Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="sm:hidden p-1.5 text-slate-600 hover:text-[#00629B] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer mr-1 flex items-center justify-center shrink-0"
                title="Toggle Menu"
              >
                {isMobileSidebarOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
              </button>
              {/* Header Brand Information */}
              <div 
                className="flex items-center cursor-pointer select-none group" 
                onClick={() => navigateTo("home")}
              >
                <div className="relative shrink-0 flex items-center h-[50px] sm:h-[76px] w-[80px] sm:w-[124px]">
                  <img 
                    src={combinedLogoImg} 
                    alt="IEEE EPS BVRIT Student Chapter combined logo" 
                    className="h-full w-full object-fill hover:scale-102 transition-transform duration-300" 
                  />
                </div>
              </div>
            </div>

            {/* Right Brand Area: Search opportunities + Register/Enquire / Profile */}
            <div className="flex items-center gap-4 shrink-0">
              
              {/* Search opportunities Icon button relocated here */}
              <div ref={searchRef} className="relative z-50">
                {/* Search Icon Button - larger size */}
                <button
                  onClick={() => setIsSearchPopupOpen(!isSearchPopupOpen)}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#00629B] rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                  title="Search Opportunities"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Popover / Overlay Card */}
                <AnimatePresence>
                  {isSearchPopupOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      className="fixed inset-x-4 top-20 w-auto sm:absolute sm:right-0 sm:left-auto sm:top-full sm:mt-2 sm:w-[420px] bg-white border border-slate-200 shadow-2xl rounded-2xl p-5 z-50 space-y-4 text-left"
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
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { name: "Events Calendar", icon: "Calendar", color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
                            { name: "Competitions", icon: "Trophy", color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
                            { name: "Quizzes", icon: "HelpCircle", color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" },
                            { name: "Hackathons", icon: "Code", color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
                            { name: "Cultural Events", icon: "Music", color: "bg-pink-50 text-pink-600 hover:bg-pink-100" },
                            { name: "Conferences", icon: "Users", color: "bg-orange-50 text-orange-600 hover:bg-orange-100" },
                            { name: "Workshops", icon: "Wrench", color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
                            { name: "College Festivals", icon: "Building", color: "bg-teal-50 text-teal-600 hover:bg-teal-100" },
                            { name: "Mentors", icon: "GraduationCap", color: "bg-sky-50 text-sky-600 hover:bg-sky-100" },
                            { name: "Articles", icon: "BookOpen", color: "bg-violet-50 text-violet-600 hover:bg-violet-100" },
                            { name: "Enrollment Desk", icon: "ClipboardList", color: "bg-rose-50 text-rose-600 hover:bg-rose-100" }
                          ].map((cat) => {
                            const renderCatIcon = (name: string) => {
                              switch (name) {
                                case "Calendar": return <Calendar className="w-5 h-5" />;
                                case "Trophy": return <Award className="w-5 h-5" />;
                                case "HelpCircle": return <BookOpen className="w-5 h-5" />;
                                case "Code": return <Cpu className="w-5 h-5" />;
                                case "Music": return <Globe className="w-5 h-5" />;
                                case "Users": return <Compass className="w-5 h-5" />;
                                case "Wrench": return <Wrench className="w-5 h-5" />;
                                case "Building": return <Activity className="w-5 h-5" />;
                                case "GraduationCap": return <GraduationCap className="w-5 h-5" />;
                                case "BookOpen": return <BookOpen className="w-5 h-5" />;
                                case "ClipboardList": return <ClipboardList className="w-5 h-5" />;
                                default: return <BookOpen className="w-5 h-5" />;
                              }
                            };

                            return (
                              <button
                                key={cat.name}
                                type="button"
                                onClick={() => {
                                  setIsSearchPopupOpen(false);
                                  if (cat.name === "Events Calendar") {
                                    navigateTo("student");
                                    setStudentDashboardTab("upcoming");
                                  } else if (cat.name === "Mentors") {
                                    navigateTo("about");
                                    setTimeout(() => {
                                      document.getElementById("advisory-section")?.scrollIntoView({ behavior: "smooth" });
                                    }, 400);
                                  } else if (cat.name === "Articles") {
                                    navigateTo("home");
                                    setTimeout(() => {
                                      document.getElementById("announcements")?.scrollIntoView({ behavior: "smooth" });
                                    }, 400);
                                  } else if (cat.name === "Enrollment Desk") {
                                    navigateTo("home");
                                    setTimeout(() => {
                                      document.getElementById("inquiry-section")?.scrollIntoView({ behavior: "smooth" });
                                    }, 400);
                                  } else {
                                    navigateTo("student");
                                    setSearchQuery(cat.name);
                                    setStudentDashboardTab("upcoming");
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
                  )}
                </AnimatePresence>
              </div>
              {isAdminLoggedIn || currentStudentUser ? (
                /* USER PROFILE DROPDOWN */
                <div ref={profileRef} className="relative z-50">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#00629B]/10 hover:bg-[#00629B]/20 text-[#00629B] border-2 border-[#00629B]/30 flex items-center justify-center cursor-pointer transition-all duration-200 relative"
                    title="User Profile"
                  >
                    <span className="font-extrabold text-xs">
                      {isAdminLoggedIn ? "AD" : (currentStudentUser?.name?.substr(0, 2).toUpperCase() || "ST")}
                    </span>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full"></span>
                  </button>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-[240px] rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 overflow-hidden text-xs text-slate-800 text-left"
                      >
                        {/* Header Info */}
                        <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                          <div className="font-bold text-slate-800">
                            {isAdminLoggedIn ? "System Admin Console" : currentStudentUser.name}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            {isAdminLoggedIn ? loggedInAdminEmail : currentStudentUser.email}
                          </div>
                        </div>

                        {/* Options */}
                        <div className="py-1">
                          {isAdminLoggedIn ? (
                            <button
                              onClick={() => {
                                setIsProfileDropdownOpen(false);
                                navigateTo("admin");
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 font-semibold text-slate-700 cursor-pointer border-none bg-transparent"
                            >
                              <Lock className="w-4 h-4 text-slate-400" />
                              <span>Organizers Console</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setIsProfileDropdownOpen(false);
                                navigateTo("student");
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 font-semibold text-slate-700 cursor-pointer border-none bg-transparent"
                            >
                              <Globe className="w-4 h-4 text-slate-400" />
                              <span>Student Event Portal</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              navigateTo("settings");
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 font-semibold text-slate-700 cursor-pointer border-none bg-transparent"
                          >
                            <Settings className="w-4 h-4 text-slate-400" />
                            <span>Account Settings</span>
                          </button>

                          <div className="w-full my-1 border-t border-slate-100"></div>

                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              if (isAdminLoggedIn) {
                                handleAdminSignOut();
                              } else {
                                handleStudentLogout();
                              }
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 font-semibold cursor-pointer border-none bg-transparent"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* ANONYMOUS REGISTER/LOGIN DROPDOWN */
                <div ref={registerRef} className="relative inline-flex items-center">
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
                      className="px-4 py-2 text-xs sm:text-sm font-bold text-white tracking-wide cursor-pointer transition border-none"
                    >
                      Register/Login
                    </button>
                    <div className="w-[1px] bg-white/20 my-2"></div>
                    <button
                      onClick={() => setIsRegisterDropdownOpen(!isRegisterDropdownOpen)}
                      className="px-2.5 text-white transition flex items-center justify-center cursor-pointer hover:bg-white/10 border-none bg-transparent"
                      title="Console Options"
                    >
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isRegisterDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {isRegisterDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-[260px] rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 overflow-hidden text-xs sm:text-sm text-slate-800"
                      >
                        <button
                          onClick={() => {
                            setIsRegisterDropdownOpen(false);
                            navigateTo("student");
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2 font-bold text-indigo-700 border-b border-slate-100 cursor-pointer border-none bg-transparent"
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
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2 font-semibold text-[#00629B] cursor-pointer border-none bg-transparent"
                        >
                          <GraduationCap className="w-4 h-4 text-[#00629B]" />
                          <span>Chapter Enrollment Desk</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* FULL-WIDTH LIVE UPDATES NEWS TICKER BANNER (visible only on Home Page) */}
      {currentPage === "home" && (
        <div className="fixed left-0 right-0 top-[84px] sm:top-[96px] z-30 shadow-inner">
          <section className="bg-gradient-to-r from-[#00629B] to-[#004B75] text-white py-3 relative overflow-hidden border-b border-sky-300/30 flex items-center h-11">
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
        </div>
      )}

      {/* Main Content Area shifted to the right to accommodate the Unstop Left Rail Sidebar */}
      <div className="pl-0 sm:pl-20 min-h-screen flex flex-col transition-all duration-300">
        {/* Spacing Offset for Fixed Navbar & Live Updates Ribbon */}
        <div className={`transition-all duration-300 ${
          currentPage === "home" ? "pt-[128px] sm:pt-[140px]" : "pt-[84px] sm:pt-[96px]"
        }`}></div>

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
                    {isImageUrl(slide.url) ? (
                      <img
                        src={slide.url}
                        alt={slide.caption}
                        className="w-full h-full object-contain object-center"
                      />
                    ) : (
                      <div 
                        onClick={() => handleViewOrDownloadFile(slide.url, slide.caption)}
                        className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-6 gap-4 cursor-pointer"
                      >
                        <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 hover:scale-105 transition-transform duration-300">
                          {getFileIcon(slide.url, "w-10 h-10")}
                        </div>
                        <div className="text-center space-y-1">
                          <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                            {getFileExtensionLabel(slide.url)} Document
                          </span>
                          <p className="text-xs text-slate-300 mt-1">Click anywhere on the slide to open / download the file</p>
                        </div>
                      </div>
                    )}
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
                <div id="hero-heading" className="lg:col-span-5 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-100 text-[#00629B] rounded-full text-xs font-semibold tracking-wider uppercase font-display">
                    <GraduationCap className="w-4 h-4" />
                    <span>{HOME_CONTENT.hero.badge}</span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl lg:text-[2.2rem] font-black leading-tight tracking-tight text-[#00629B] font-display">
                    {HOME_CONTENT.hero.title}
                  </h1>
                  
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                    {HOME_CONTENT.hero.description}
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button 
                      onClick={() => navigateTo("about")}
                      className="bg-[#00629B] hover:bg-[#004B75] text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-lg shadow-[#00629B]/15 hover:shadow-xl hover:shadow-[#00629B]/20 transition-all duration-300 flex items-center gap-2 group cursor-pointer border-none"
                    >
                      <span>{HOME_CONTENT.hero.primaryButtonText}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <button 
                      onClick={() => {
                        navigateTo("student");
                        setStudentDashboardTab("upcoming");
                      }}
                      className="bg-white hover:bg-slate-50 text-slate-700 hover:text-[#00629B] font-semibold text-xs px-5 py-3 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 flex items-center gap-2 cursor-pointer"
                    >
                      <span>{HOME_CONTENT.hero.secondaryButtonText}</span>
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Announcements Card Column */}
                <div className="lg:col-span-3 bg-slate-100/80 border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col h-[380px] text-left relative overflow-hidden self-stretch justify-center">
                  <h3 className="text-lg sm:text-xl font-black text-[#800000] font-display mb-3 tracking-tight">Announcements</h3>
                  <div className="flex-grow overflow-hidden relative">
                    {announcements.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No current announcements.</p>
                    ) : (
                      <marquee
                        direction="up"
                        scrollamount="2"
                        className="h-full w-full"
                        onMouseOver={(e) => e.currentTarget.stop()}
                        onMouseOut={(e) => e.currentTarget.start()}
                      >
                        {announcements.map((ann) => {
                          const isMilestone = ann.type.toLowerCase().includes("milestone") || ann.title.toLowerCase().includes("welcoming");
                          return (
                            <div key={ann.id} className="mb-4 pb-3 border-b border-slate-200/40 last:border-none">
                              <div className="flex items-start gap-2">
                                <span className="text-sm shrink-0">{isMilestone ? "🎉" : "📢"}</span>
                                <div className="space-y-1">
                                  <h4 className="font-extrabold text-xs text-slate-900 leading-snug">{ann.title}</h4>
                                  <p className="text-[10px] text-slate-600 leading-relaxed">{ann.description}</p>
                                  <span className="text-[8px] font-bold text-slate-400 block">{ann.date}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </marquee>
                    )}
                  </div>
                </div>

                {/* Interactive Visual Semiconductor Box (3D Package simulation concept) */}
                <div id="hero-interactive" className="lg:col-span-4 relative self-stretch flex items-center justify-center">
                  
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

          {/* BVRIT Joint Affiliation Promotion */}
          <section className="bg-white py-12 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
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
                    Instant Registration
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
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Societies</label>
                        <select 
                          value={formData.branch}
                          onChange={e => setFormData({...formData, branch: e.target.value})}
                          className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1"
                        >
                          <option value="APS">APS</option>
                          <option value="PES">PES</option>
                          <option value="IETE">IETE</option>
                          <option value="IEOM">IEOM</option>
                          <option value="MTT-S">MTT-S</option>
                          <option value="EPS">EPS</option>
                          <option value="CAS">CAS</option>
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
                    image: facultyPrasannaImg,
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
                      {/* Student profile photo / avatar */}
                      <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300 mx-auto text-slate-400 overflow-hidden shrink-0 shadow-inner">
                        {('image' in student && student.image) ? (
                          <img 
                            src={student.image} 
                            alt={student.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <svg className="w-10 h-10 mt-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        )}
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

              {/* Google Sign In Divider & Button */}
              <div className="relative flex items-center justify-center my-3.5">
                <div className="border-t border-slate-200 w-full absolute"></div>
                <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase relative z-10">or</span>
              </div>

              <button
                type="button"
                onClick={handleAdminGoogleLogin}
                className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer border-solid"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

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
              {/* Dynamic On-page Alert Banner */}
              <AnimatePresence>
                {adminNotification && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 rounded-xl border flex items-center justify-between shadow-md text-xs font-bold leading-relaxed transition ${
                      adminNotification.type === "success" 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    <span>{adminNotification.message}</span>
                    <button 
                      onClick={() => setAdminNotification(null)}
                      className="ml-4 hover:opacity-85 text-slate-400 hover:text-slate-600 font-black"
                    >
                      ✕
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

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
                <button
                  onClick={() => setAdminTab("gallery")}
                  className={`px-6 py-3 font-bold text-sm border-b-2 transition cursor-pointer ${
                    adminTab === "gallery"
                      ? "border-[#00629B] text-[#00629B]"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Manage Gallery ({galleryImages.length})
                </button>
                <button
                  onClick={() => setAdminTab("competitions")}
                  className={`px-6 py-3 font-bold text-sm border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    adminTab === "competitions"
                      ? "border-[#00629B] text-[#00629B]"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Manage Opportunities ({competitions.length})</span>
                </button>
                {isAdminEmail(loggedInAdminEmail) && (
                  <button
                    onClick={() => setAdminTab("pending-requests")}
                    className={`px-6 py-3 font-bold text-sm border-b-2 transition cursor-pointer ${
                      adminTab === "pending-requests"
                        ? "border-[#00629B] text-[#00629B]"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Pending Organizer Requests ({receivedEnquiries.filter(e => e.status === "pending" && e.password).length})
                  </button>
                )}
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

              {adminTab === "pending-requests" && isAdminEmail(loggedInAdminEmail) && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800 font-display">Pending Organizer Console Requests</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Approve or Reject registration requests for the Organizers Console. Only approved users can log in.
                    </p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-bold text-xs bg-slate-50 font-display">
                          <th className="px-6 py-3 font-semibold uppercase tracking-wider">Timestamp</th>
                          <th className="px-6 py-3 font-semibold uppercase tracking-wider">Full Name</th>
                          <th className="px-6 py-3 font-semibold uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 font-semibold uppercase tracking-wider">Roll Number</th>
                          <th className="px-6 py-3 font-semibold uppercase tracking-wider">Year/Society</th>
                          <th className="px-6 py-3 font-semibold uppercase tracking-wider text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receivedEnquiries.filter(e => e.status === "pending" && e.password).length > 0 ? (
                          receivedEnquiries.filter(e => e.status === "pending" && e.password).map((req) => (
                            <tr key={req.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                                {req.timestamp}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800">
                                {req.fullName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-xs font-mono">
                                {req.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap font-semibold font-mono text-slate-700">
                                {req.rollNumber}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded mr-1">
                                  {req.year}
                                </span>
                                <span className="bg-sky-50 text-[#00629B] border border-sky-100 text-[10px] font-bold px-2 py-0.5 rounded">
                                  {req.branch}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleApproveRequest(req.id)}
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-emerald-700/10 cursor-pointer transition"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectRequest(req.id)}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-red-700/10 cursor-pointer transition"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                              <ShieldAlert className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                              <p className="font-semibold text-slate-500">No pending organizer requests</p>
                              <p className="text-xs text-slate-400 mt-1">All registrations are up to date.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
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
                          setAdminNotification({ type: "error", message: "Please fill in all required announcement fields!" });
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
                        setAdminNotification({ type: "success", message: "Announcement published successfully and is live on the website!" });
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
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Banner Image (Upload from PC)</label>
                        <input 
                          type="file" 
                          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === "string") {
                                  setAnnouncementFormData({...announcementFormData, image: reader.result});
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#00629B]/10 file:text-[#00629B] hover:file:bg-[#00629B]/20 cursor-pointer"
                        />
                        {announcementFormData.image && (
                          <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                            <span className="text-emerald-600 font-bold">✓ Loaded</span>
                            <img src={announcementFormData.image} alt="Preview" className="w-8 h-8 object-cover rounded border border-slate-200" />
                          </div>
                        )}
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
                              {isImageUrl(ann.image) ? (
                                <img src={ann.image} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
                                  {getFileIcon(ann.image, "w-6 h-6")}
                                </div>
                              )}
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
                      setAdminNotification({ type: "success", message: "News ticker updated successfully! The new text is now live on the homepage." });
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
                      showToast("New picture added to the carousel successfully!", "success");
                    }}
                    className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid md:grid-cols-2 gap-4 items-end"
                  >
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">Upload Poster / Image *</label>
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
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
                              {isImageUrl(slide.url) ? (
                                <img 
                                  src={slide.url} 
                                  alt={slide.caption} 
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=300&q=80";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-3 gap-2">
                                  {getFileIcon(slide.url, "w-8 h-8")}
                                  <span className="text-[9px] uppercase font-black bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                                    {getFileExtensionLabel(slide.url)} Document
                                  </span>
                                </div>
                              )}
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

              {adminTab === "gallery" && (
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6 max-w-4xl mx-auto animate-fade-in text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#00629B] font-display flex items-center gap-2">
                        <Database className="w-5 h-5 text-[#00629B]" />
                        <span>Manage Society Gallery</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Add new event pictures, edit existing labels/categories, or remove outdated slides from the public Society Gallery tab.
                      </p>
                    </div>
                    <button 
                      onClick={handleOpenAddGalleryModal}
                      className="bg-[#00629B] hover:bg-[#004B75] text-white text-xs font-bold py-2 px-4 rounded-xl shadow transition duration-200 uppercase tracking-widest flex items-center gap-2 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Photo</span>
                    </button>
                  </div>

                  {/* Grid or list of active gallery images */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Gallery Photos ({galleryImages.length})</h4>
                    {galleryImages.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No images currently in the gallery. Add one above.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {galleryImages.map((img) => (
                          <div key={img.id} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between shadow-xs">
                            <div className="relative h-36 bg-slate-900 flex items-center justify-center group">
                              {isImageUrl(img.url) ? (
                                <img 
                                  src={img.url} 
                                  alt={img.title} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-4 gap-2">
                                  {getFileIcon(img.url, "w-10 h-10")}
                                  <span className="text-[9px] uppercase font-black bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                                    {getFileExtensionLabel(img.url)} Document
                                  </span>
                                </div>
                              )}
                              <span className="absolute top-2 left-2 bg-[#00629B]/90 text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                                {img.category}
                              </span>
                              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditGalleryModal(img)}
                                  className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-xl transition cursor-pointer"
                                  title="Edit image labels"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGalleryImage(img.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl transition cursor-pointer"
                                  title="Delete image"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="p-3 bg-white border-t border-slate-100 flex-grow flex flex-col justify-between">
                              <div>
                                <h5 className="font-bold text-slate-800 line-clamp-1">{img.title}</h5>
                                <p className="text-slate-500 text-[10px] line-clamp-2 leading-relaxed mt-1">{img.caption}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: MANAGE COMPETITIONS & OPPORTUNITIES */}
              {adminTab === "competitions" && (
                <div className="space-y-8 animate-fade-in text-left">
                  <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6 max-w-4xl mx-auto">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
                      <Plus className="w-5 h-5 text-[#00629B]" />
                      <span>Post New Competition / Hackathon / Opportunity</span>
                    </h3>
                    <form onSubmit={handleCreateCompetition} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Opportunity Title *</label>
                        <input
                          type="text"
                          required
                          value={competitionFormData.title}
                          onChange={(e) => setCompetitionFormData({ ...competitionFormData, title: e.target.value })}
                          placeholder="e.g. BVRIT National Semiconductor Hackathon 2026"
                          className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00629B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category / Type *</label>
                        <select
                          value={competitionFormData.category}
                          onChange={(e) => setCompetitionFormData({ ...competitionFormData, category: e.target.value })}
                          className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00629B] cursor-pointer font-bold text-slate-700"
                        >
                          <option value="Competitions">Competitions</option>
                          <option value="Quizzes">Quizzes</option>
                          <option value="Hackathons">Hackathons</option>
                          <option value="Cultural Events">Cultural Events</option>
                          <option value="Conferences">Conferences</option>
                          <option value="Workshops">Workshops</option>
                          <option value="College Festivals">College Festivals</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Timeline / Date *</label>
                        <input
                          type="text"
                          required
                          value={competitionFormData.date}
                          onChange={(e) => setCompetitionFormData({ ...competitionFormData, date: e.target.value })}
                          placeholder="e.g. July 28 - August 02, 2026"
                          className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00629B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cost / Fee Info *</label>
                        <input
                          type="text"
                          required
                          value={competitionFormData.cost}
                          onChange={(e) => setCompetitionFormData({ ...competitionFormData, cost: e.target.value })}
                          placeholder="e.g. Free (IEEE members) / INR 150"
                          className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00629B]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Google Form Registration Link *</label>
                        <input
                          type="url"
                          required
                          value={competitionFormData.googleFormUrl}
                          onChange={(e) => setCompetitionFormData({ ...competitionFormData, googleFormUrl: e.target.value })}
                          placeholder="https://docs.google.com/forms/d/e/.../viewform"
                          className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00629B] font-mono"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Brief Description *</label>
                        <textarea
                          required
                          rows={3}
                          value={competitionFormData.desc}
                          onChange={(e) => setCompetitionFormData({ ...competitionFormData, desc: e.target.value })}
                          placeholder="Provide details about the hackathon tracks, prizes, and submission guidelines..."
                          className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00629B] resize-none"
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#00629B] hover:bg-[#004B75] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition cursor-pointer border-none"
                        >
                          Publish Opportunity
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Active Opportunities list */}
                  <div className="space-y-4 max-w-4xl mx-auto">
                    <h3 className="text-base font-bold text-slate-800">Published Opportunities ({competitions.length})</h3>
                    {competitions.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-semibold">
                        No opportunities posted yet. Use the form above to add a hackathon or quiz.
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-6">
                        {competitions.map((comp) => {
                          const compRegs = studentRegistrations.filter(r => r.eventTitle === comp.title);
                          return (
                            <div key={comp.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xs transition">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-indigo-100">
                                    {comp.category}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-bold">{comp.date}</span>
                                </div>
                                <h4 className="font-bold text-slate-800 text-sm font-display leading-tight">{comp.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{comp.desc}</p>
                                <div className="text-[11px] text-slate-400 flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                                  <div>Fee: <span className="font-bold text-slate-600">{comp.cost}</span></div>
                                  <div className="flex items-center gap-1">
                                    <span>Form Link:</span>
                                    <a href={comp.googleFormUrl} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline font-mono truncate max-w-[150px] inline-block">{comp.googleFormUrl}</a>
                                  </div>
                                  <div>Registrants: <span className="font-black text-[#00629B] bg-[#00629B]/10 px-1.5 py-0.5 rounded-full ml-1">{compRegs.length}</span></div>
                                  {comp.results && (
                                    <div className="mt-1.5 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[10px] text-amber-800 font-semibold">
                                      <div className="font-bold uppercase tracking-wider flex items-center gap-1">
                                        <Award className="w-3.5 h-3.5 text-amber-600" />
                                        <span>Results Declared:</span>
                                      </div>
                                      <p className="mt-0.5 whitespace-pre-wrap leading-relaxed">{comp.results}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                                <button
                                  onClick={() => {
                                    setSelectedCompForRegs(comp);
                                    setPastedRegsInput("");
                                  }}
                                  className="flex-grow py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] uppercase tracking-wider rounded-xl transition cursor-pointer text-center border-none"
                                >
                                  Link Form Responses
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedCompForResults(comp);
                                    setResultsInput(comp.results || "");
                                  }}
                                  className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[10px] uppercase tracking-wider rounded-xl transition cursor-pointer text-center border-none"
                                  title="Declare Results"
                                >
                                  Results
                                </button>
                                <button
                                  onClick={() => handleDeleteCompetition(comp.id)}
                                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition cursor-pointer flex items-center justify-center border-none"
                                  title="Delete Opportunity"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* MODAL: Link Responses */}
                  {selectedCompForRegs && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-left">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-indigo-600" />
                            <span>Link Form Responses: {selectedCompForRegs.title}</span>
                          </h3>
                          <button 
                            onClick={() => setSelectedCompForRegs(null)}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Paste a list of roll numbers or email addresses of students who successfully registered on your Google Form (one per line, or separated by commas). The system will link their registrations and automatically generate dummy student logins (password: <code className="bg-slate-100 px-1 rounded font-bold">password123</code>) for new roll numbers.
                        </p>
                        <textarea
                          rows={6}
                          value={pastedRegsInput}
                          onChange={(e) => setPastedRegsInput(e.target.value)}
                          placeholder="e.g.&#10;2301A0512&#10;srinath@gmail.com&#10;2301A0544"
                          className="w-full text-xs font-mono p-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500"
                        />
                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            onClick={() => handleLinkGoogleFormResponses(selectedCompForRegs.id)}
                            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer border-none"
                          >
                            Link Students
                          </button>
                          <button
                            onClick={() => setSelectedCompForRegs(null)}
                            className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-50 transition cursor-pointer bg-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODAL: Declare Results */}
                  {selectedCompForResults && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-left">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <Award className="w-5 h-5 text-amber-500" />
                            <span>Declare Results: {selectedCompForResults.title}</span>
                          </h3>
                          <button 
                            onClick={() => setSelectedCompForResults(null)}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Enter the prize distribution and winner names for this opportunity. This text will be displayed to all students under the results page tab.
                        </p>
                        <textarea
                          rows={5}
                          value={resultsInput}
                          onChange={(e) => setResultsInput(e.target.value)}
                          placeholder="e.g.&#10;🏆 1st Prize: Rahul Verma (Roll 2301A0412) - Rs 5000&#10;🥈 2nd Prize: Sneha Reddy (Roll 2301A0502) - Rs 3000&#10;🥉 3rd Prize: Amit Shah (Roll 2301A0214) - Rs 1500"
                          className="w-full text-xs p-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-amber-500"
                        />
                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            onClick={() => handleSaveResults(selectedCompForResults.id)}
                            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer border-none"
                          >
                            Save Results
                          </button>
                          <button
                            onClick={() => setSelectedCompForResults(null)}
                            className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-50 transition cursor-pointer bg-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
          {/* STUDENT DASHBOARD PANEL - If not logged in, we allow browsing upcoming events */}
          <div className="space-y-8">
            {/* Dynamic Welcome / Explore Header Banner */}
            {!currentStudentUser ? (
              <div className="bg-gradient-to-r from-slate-800 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10">
                  <Globe className="w-64 h-64" />
                </div>
                <div className="space-y-2 relative z-10 text-center sm:text-left">
                  <span className="text-xs font-bold bg-white/25 px-3 py-1 rounded-full text-white uppercase tracking-wider font-display">Public Opportunities Hub</span>
                  <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight mt-1">
                    Explore IEEE Events & Workshops
                  </h1>
                  <p className="text-indigo-100 text-xs sm:text-sm">
                    Browse all active contests, seminars, and hackathons. Sign in to register instantly and record credentials.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setStudentAuthTab("login");
                    setStudentAuthError("");
                    setShowStudentAuthModal(true);
                  }}
                  className="shrink-0 relative z-10 px-5 py-2.5 bg-white text-indigo-900 hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition shadow cursor-pointer border-none"
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign In / Register</span>
                </button>
              </div>
            ) : (
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
                    {currentStudentUser.college} • Roll: {currentStudentUser.rollNumber} • Society: {currentStudentUser.branch}
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
            )}

            {/* Tab Selector Buttons */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-px">
              {currentStudentUser && (
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
              )}
              <button
                onClick={() => setStudentDashboardTab("upcoming")}
                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  studentDashboardTab === "upcoming" || (!currentStudentUser && studentDashboardTab === "registered")
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Upcoming Events & Register</span>
              </button>
              {currentStudentUser && (
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
              )}
            </div>

            {/* Content Panel Area */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[300px]">
              {(studentDashboardTab === "registered" && currentStudentUser) ? (
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
              ) : (studentDashboardTab === "upcoming" || !currentStudentUser) ? (
                /* TAB 2: UPCOMING EVENTS & REGISTRATION */
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-display">Upcoming Chapter Workshops & Events</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Register for any IEEE Electronics Packaging Society event with a single click!</p>
                    </div>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold self-start md:self-auto cursor-pointer"
                      >
                        Clear Filter: "{searchQuery}"
                      </button>
                    )}
                  </div>

                  {/* Horizontal Scrollable Category Filter pills */}
                  <div className="flex flex-wrap gap-2 pb-2">
                    {["All", "Competitions", "Quizzes", "Hackathons", "Cultural Events", "Conferences", "Workshops", "College Festivals"].map((cat) => {
                      const isActive = (cat === "All" && !searchQuery) || (searchQuery.toLowerCase() === cat.toLowerCase());
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            if (cat === "All") {
                              setSearchQuery("");
                            } else {
                              setSearchQuery(cat);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                            isActive
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {(() => {
                    const filteredEvents = competitions.filter(evt => {
                      if (!searchQuery) return true;
                      const q = searchQuery.toLowerCase();
                      return (
                        evt.title.toLowerCase().includes(q) ||
                        evt.category.toLowerCase().includes(q) ||
                        evt.desc.toLowerCase().includes(q)
                      );
                    });

                    if (competitions.length === 0) {
                      return (
                        <div className="py-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <Award className="w-12 h-12 text-slate-300 mx-auto" />
                          <h4 className="text-sm font-bold text-slate-700">No current events</h4>
                          <p className="text-xs text-slate-400 max-w-xs mx-auto">
                            There are currently no active competitions, hackathons, or workshops listed. Please check back later!
                          </p>
                        </div>
                      );
                    }

                    if (filteredEvents.length === 0) {
                      return (
                        <div className="py-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <Search className="w-10 h-10 text-slate-300 mx-auto" />
                          <h4 className="text-sm font-bold text-slate-700">No opportunities found</h4>
                          <p className="text-xs text-slate-400 max-w-xs mx-auto">
                            No upcoming events match the current filter "{searchQuery}". Try selecting another category tab above.
                          </p>
                          <button
                            onClick={() => setSearchQuery("")}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                          >
                            Reset filters
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="grid sm:grid-cols-2 gap-6">
                        {filteredEvents.map((evt, idx) => {
                          const isRegistered = currentStudentUser && studentRegistrations.find(
                            r => r.studentId === currentStudentUser.id && r.eventTitle === evt.title
                          );

                          return (
                            <div key={evt.id || idx} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition">
                              <div className="space-y-2.5 text-left">
                                <div className="flex items-center justify-between">
                                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded font-mono uppercase">
                                    {evt.date}
                                  </span>
                                  <span className="text-[10px] text-emerald-600 font-bold">{evt.cost}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="bg-indigo-100/70 text-indigo-800 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                                    {evt.category}
                                  </span>
                                </div>
                                <h4 className="font-bold text-slate-900 text-sm font-display leading-tight">{evt.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">{evt.desc}</p>
                              </div>
                              <div className="pt-4 border-t border-slate-100 mt-4">
                                {isRegistered ? (
                                  <button
                                    disabled
                                    className={`w-full py-2 border font-bold text-xs rounded-xl cursor-not-allowed flex items-center justify-center gap-1 ${
                                      isRegistered.status === "Confirmed"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                        : "bg-amber-50 text-amber-700 border-amber-100"
                                    }`}
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>
                                      {isRegistered.status === "Confirmed" ? "Confirmed Registration" : "Pending Confirmation"}
                                    </span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      window.open(evt.googleFormUrl, "_blank");
                                      handleStudentEventRegister(evt.title, "Pending Confirmation");
                                    }}
                                    className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition flex items-center justify-center gap-1 border-none"
                                  >
                                    <span>Instant Registration (Google Form)</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* TAB 3: ACADEMIC RESULTS & PRIZES */
                <div className="space-y-6 text-left">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-display">My Achievements & Prizes Showcase</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Track your certified awards and positions won in Chapter challenges.</p>
                  </div>

                  {(() => {
                    const competitionsWithResults = competitions.filter(c => c.results);

                    if (competitionsWithResults.length === 0) {
                      return (
                        <div className="py-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <Award className="w-12 h-12 text-slate-300 mx-auto" />
                          <h4 className="text-sm font-bold text-slate-700">No results declared yet</h4>
                          <p className="text-xs text-slate-400 max-w-xs mx-auto">
                            Coordinators haven't published results for any opportunities yet. Once results are declared, they will display here.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="grid sm:grid-cols-2 gap-6">
                        {competitionsWithResults.map((comp) => {
                          const isParticipant = currentStudentUser && studentRegistrations.find(
                            r => r.studentId === currentStudentUser.id && r.eventTitle === comp.title
                          );

                          return (
                            <div key={comp.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex gap-4 hover:shadow transition">
                              <Award className="w-10 h-10 text-amber-500 shrink-0 mt-0.5 animate-bounce" />
                              <div className="space-y-2 flex-grow">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">
                                    {isParticipant ? "Your Certified Result" : "Announced Winners"}
                                  </span>
                                  <span className="text-[9px] bg-slate-200/60 px-2 py-0.5 rounded text-slate-600 font-bold uppercase font-mono">
                                    {comp.category}
                                  </span>
                                </div>
                                <h4 className="font-bold text-slate-800 text-sm font-display leading-tight">{comp.title}</h4>
                                <p className="text-[11px] text-slate-700 bg-white border border-slate-100 p-2.5 rounded-xl whitespace-pre-wrap leading-relaxed mt-1 font-medium">
                                  {comp.results}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
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
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3.10. DYNAMIC MAIN BODY ROUTER - SOCIETY GALLERY PAGE                      */}
      {/* ========================================================================= */}
      {currentPage === "gallery" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
        >
          {/* Gallery Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00629B]/10 text-[#00629B] text-[10px] font-black tracking-widest uppercase mb-2">
                <Image className="w-3.5 h-3.5" />
                <span>Capturing Society Moments</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-display">Society Gallery</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Visual highlights from our lab sessions, guest lectures, campaign runs, and orientation programs.
              </p>
            </div>
            
            <button
              onClick={() => navigateTo("home")}
              className="text-xs text-slate-500 hover:text-[#00629B] font-bold self-start md:self-auto transition cursor-pointer"
            >
              ← Return to Dashboard
            </button>
          </div>

          {/* On-page alerts */}
          <AnimatePresence>
            {galleryNotification && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-xl border flex items-center justify-between shadow-md text-xs font-bold leading-relaxed transition ${
                  galleryNotification.type === "success" 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                <span>{galleryNotification.message}</span>
                <button 
                  onClick={() => setGalleryNotification(null)}
                  className="ml-4 hover:opacity-85 text-slate-400 hover:text-slate-600 font-black cursor-pointer"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Organizer Info panel */}
          {isAdminLoggedIn && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#00629B]">Organizer Control Center</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  You are logged in as an Organizer. You have permissions to add, edit, or delete pictures in the Society Gallery.
                </p>
              </div>
              <button 
                onClick={handleOpenAddGalleryModal}
                className="bg-[#00629B] hover:bg-[#004B75] text-white text-xs font-bold py-2 px-4 rounded-xl shadow transition duration-200 uppercase tracking-widest flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Photo</span>
              </button>
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
            {["All", "Seminars", "Workshops", "Inauguration", "Activities", "Other"].map((cat) => {
              const isActive = galleryFilter === cat;
              const count = getCategoryCount(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setGalleryFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive 
                      ? "bg-[#00629B] text-white shadow-md shadow-[#00629B]/10" 
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/50"
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Gallery Grid */}
          {filteredImages.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
              <Image className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-sm">No photos found in this category</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Upload a new photo or select a different category to explore.</p>
              {isAdminLoggedIn && (
                <button 
                  onClick={handleOpenAddGalleryModal}
                  className="mt-4 bg-[#00629B] hover:bg-[#004B75] text-white text-[10px] font-bold py-2 px-3 rounded-lg shadow-sm transition uppercase tracking-wider cursor-pointer"
                >
                  Upload Photo
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredImages.map((img) => (
                  <motion.div
                     key={img.id}
                     layout
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     transition={{ duration: 0.3 }}
                     onClick={() => {
                       if (isImageUrl(img.url)) {
                         setLightboxImage(img);
                       } else {
                         handleViewOrDownloadFile(img.url, img.title);
                       }
                     }}
                     className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100 border border-slate-200/50 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
                   >
                     {isImageUrl(img.url) ? (
                       <img 
                         src={img.url} 
                         alt={img.title} 
                         className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                         loading="lazy"
                       />
                     ) : (
                       <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-6 gap-3 transition-transform duration-700 ease-out group-hover:scale-105">
                         {getFileIcon(img.url, "w-16 h-16")}
                         <span className="text-[10px] uppercase font-black bg-amber-500/20 text-amber-300 px-2 py-1 rounded">
                           {getFileExtensionLabel(img.url)} Document
                         </span>
                       </div>
                     )}
                     
                     {/* Category Badge */}
                     <span className="absolute top-3 left-3 bg-[#00629B]/90 text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow-sm backdrop-blur-xs z-10">
                       {img.category}
                     </span>

                     {/* Admin Hover Actions Overlay */}
                     {isAdminLoggedIn && (
                       <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             handleOpenEditGalleryModal(img);
                           }}
                           className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-xl transition-colors shadow-md hover:scale-105 cursor-pointer"
                           title="Edit Details"
                         >
                           <Edit className="w-3.5 h-3.5" />
                         </button>
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             handleDeleteGalleryImage(img.id);
                           }}
                           className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl transition-colors shadow-md hover:scale-105 cursor-pointer"
                           title="Delete Image"
                         >
                           <Trash2 className="w-3.5 h-3.5" />
                         </button>
                       </div>
                     )}

                     {/* Details Slide-up Overlay */}
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                       <h4 className="font-bold text-sm tracking-wide line-clamp-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{img.title}</h4>
                       <p className="text-[10px] text-slate-200 line-clamp-2 mt-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">{img.caption}</p>
                       <span className="text-[9px] text-[#38BDF8] font-bold mt-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-100 uppercase tracking-widest flex items-center gap-1">
                         {isImageUrl(img.url) ? "Click to enlarge ↗" : "Click to view/download ↗"}
                       </span>
                     </div>
                   </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}



          <div className="text-center pt-6">
            <button onClick={() => navigateTo("home")} className="text-xs font-bold text-slate-500 hover:text-[#00629B] transition cursor-pointer">
              ← Return to Dashboard
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3.9. DYNAMIC MAIN BODY ROUTER - SETTINGS PAGE                             */}
      {/* ========================================================================= */}
      {currentPage === "settings" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
        >
          {/* Settings Header */}
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-display">Settings</h2>
            <p className="text-sm text-slate-500 mt-1">Manage notifications, security credentials, devices, and profile options.</p>
          </div>

          <div className="space-y-4">
            {/* Accordion 1: Notifications */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <button 
                onClick={() => setOpenSettingSection(openSettingSection === "notifications" ? "" : "notifications")}
                className="w-full px-6 py-4 flex items-center justify-between font-bold text-slate-800 text-left cursor-pointer hover:bg-slate-50 transition"
              >
                <span>Notifications</span>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openSettingSection === "notifications" ? "rotate-180" : ""}`} />
              </button>
              
              {openSettingSection === "notifications" && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-6 text-sm text-slate-600">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h5 className="font-bold text-slate-800">Newsletter Preference</h5>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                        Our newsletter will gain you access to the latest updates regarding the hiring challenges of top recruiters (like Walmart, Flipkart, Uber, Amazon, etc.), jobs & internships, competitions, quizzes, and hackathons from elite colleges across the world.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00629B]"></div>
                    </label>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h5 className="font-bold text-slate-800">Email Notification Preferences</h5>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                        Automated reminders are sent in case of incomplete registration (incomplete extended form or incomplete payment), daily quiz and hackathon reminders, submission reminders, and reminder to submit a review.
                      </p>
                      <p className="text-[11px] text-slate-500 italic">You can turn off the automated email notifications for a particular opportunity from 'My Registrations/Application'.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00629B]"></div>
                    </label>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h5 className="font-bold text-slate-800">Receive relevant Jobs notifications</h5>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00629B]"></div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Password */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <button 
                onClick={() => setOpenSettingSection(openSettingSection === "password" ? "" : "password")}
                className="w-full px-6 py-4 flex items-center justify-between font-bold text-slate-800 text-left cursor-pointer hover:bg-slate-50 transition"
              >
                <span>Password</span>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openSettingSection === "password" ? "rotate-180" : ""}`} />
              </button>
              
              {openSettingSection === "password" && (
                <div className="px-6 pb-6 pt-4 border-t border-slate-100 space-y-4 max-w-md">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!settingsNewPassword.trim()) return;

                    const savedUsers = localStorage.getItem("student_auth_users");
                    if (savedUsers) {
                      try {
                        const users = JSON.parse(savedUsers);
                        if (users.length > 0) {
                          users[0].password = settingsNewPassword.trim();
                          localStorage.setItem("student_auth_users", JSON.stringify(users));
                          showToast("Organizer credential password updated successfully!", "success");
                        } else {
                          showToast("No active user records found. Log in or sign up first.", "error");
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    } else {
                      showToast("Password updated successfully!", "success");
                    }
                    setSettingsOldPassword("");
                    setSettingsNewPassword("");
                  }} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Current Password</label>
                      <input
                        type="password"
                        value={settingsOldPassword}
                        onChange={(e) => setSettingsOldPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">New Password</label>
                      <input
                        type="password"
                        required
                        value={settingsNewPassword}
                        onChange={(e) => setSettingsNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-[#00629B] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#004B75] transition">
                      Update Password
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Accordion 3: Security */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <button 
                onClick={() => setOpenSettingSection(openSettingSection === "security" ? "" : "security")}
                className="w-full px-6 py-4 flex items-center justify-between font-bold text-slate-800 text-left cursor-pointer hover:bg-slate-50 transition"
              >
                <span>Security</span>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openSettingSection === "security" ? "rotate-180" : ""}`} />
              </button>
              
              {openSettingSection === "security" && (
                <div className="px-6 pb-6 pt-4 border-t border-slate-100 space-y-4 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <h6 className="font-bold text-slate-800">Two-Factor Authentication (2FA)</h6>
                      <p className="text-slate-400 mt-0.5">Secure your organizer account with an extra verification layer.</p>
                    </div>
                    <button className="px-3 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 4: Manage Account */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <button 
                onClick={() => setOpenSettingSection(openSettingSection === "account" ? "" : "account")}
                className="w-full px-6 py-4 flex items-center justify-between font-bold text-slate-800 text-left cursor-pointer hover:bg-slate-50 transition"
              >
                <span>Manage Account</span>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openSettingSection === "account" ? "rotate-180" : ""}`} />
              </button>
              
              {openSettingSection === "account" && (
                <div className="px-6 pb-6 pt-4 border-t border-slate-100 space-y-4 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <h6 className="font-bold text-red-600">Deactivate Account</h6>
                      <p className="text-slate-400 mt-0.5">Permanently delete your profile and event registry logs.</p>
                    </div>
                    <button onClick={() => {
                      if (confirm("Are you sure you want to deactivate your account? This action is irreversible.")) {
                        showToast("Account deactivated.", "warning");
                        navigateTo("home");
                      }
                    }} className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition cursor-pointer">
                      Deactivate Account
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 5: Manage Devices */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <button 
                onClick={() => setOpenSettingSection(openSettingSection === "devices" ? "" : "devices")}
                className="w-full px-6 py-4 flex items-center justify-between font-bold text-slate-800 text-left cursor-pointer hover:bg-slate-50 transition"
              >
                <span>Manage Devices</span>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openSettingSection === "devices" ? "rotate-180" : ""}`} />
              </button>
              
              {openSettingSection === "devices" && (
                <div className="px-6 pb-6 pt-4 border-t border-slate-100 space-y-4 text-xs text-slate-600">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <div className="font-bold text-slate-800">Chrome on Windows 11 (Current)</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Narsapur, India • Active Now</div>
                      </div>
                      <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Active</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center pt-6">
            <button onClick={() => navigateTo("home")} className="text-xs font-bold text-slate-500 hover:text-[#00629B] transition cursor-pointer">
              ← Return to Dashboard
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3.10. DYNAMIC MAIN BODY ROUTER - LOCATION MAP PAGE                        */}
      {/* ========================================================================= */}
      {currentPage === "location" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800">
            <div className="absolute right-0 top-0 w-80 h-80 bg-[#00629B]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00629B]/20 text-[#38BDF8] border border-[#00629B]/30 text-xs font-black uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>Campus Location</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  BVRIT Narsapur Campus
                </h1>
                <p className="text-slate-400 text-sm max-w-2xl font-semibold">
                  Padmasri Dr. B.V. Raju Institute of Technology, located in a lush green campus at Vishnupur, Narsapur, Medak, Telangana.
                </p>
              </div>
              <a 
                href="https://maps.google.com/?q=BVRIT+Narsapur" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00629B] hover:bg-[#004B75] text-white font-bold text-sm shadow-lg shadow-[#00629B]/20 transition-all hover:scale-102 cursor-pointer w-fit shrink-0"
              >
                <Compass className="w-4 h-4" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>

          {/* Main Grid: Map Embed & Directions Info */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Interactive Map Card */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-4">
              <div className="relative w-full h-[480px] rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.4111042120853!2d78.25457617450839!3d17.725258383220687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcc0af1ba39c677%3A0xc4ae2d2cf9b35b63!2sBVRIT!5e0!3m2!1sen!2sin!4v1782752889431!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="BVRIT Narsapur Location Map"
                ></iframe>
              </div>
            </div>

            {/* Address & Travel Directions Panel */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Address card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#00629B]" />
                  <span>Campus Address</span>
                </h3>
                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-800">Padmasri Dr. B.V. Raju Institute of Technology</div>
                    <div className="text-slate-500 font-semibold leading-relaxed">
                      Vishnupur, Narsapur,<br />
                      Medak District, Telangana,<br />
                      PIN - 502313, India.
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-50 space-y-2">
                    <div className="flex items-center gap-2 text-slate-600 font-semibold">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <a href="mailto:ieeeeps090754@gmail.com" className="hover:text-[#00629B] transition-colors">
                        ieeeeps090754@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 font-semibold">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <a href="tel:+919573644820" className="hover:text-[#00629B] transition-colors">
                        +91 9573644820
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Travel Directions card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#00629B]" />
                  <span>How to Reach</span>
                </h3>
                <div className="space-y-4 text-xs font-semibold text-slate-600 leading-relaxed">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-800">By Bus (From Hyderabad)</div>
                    <p>
                      Regular TSRTC buses run from Secunderabad (JBS) and Balanagar/Kukatpally towards Narsapur. College bus service is also available for registered students and faculty across major routes.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-800">Nearest Railway Station</div>
                    <p>
                      Secunderabad Junction (SC) or Lingampally Railway Station (LPI) are approximately 45-50 km from the campus, from where you can take a cab or bus.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-800">Nearest Airport</div>
                    <p>
                      Rajiv Gandhi International Airport (HYD) is about 80 km away. Cabs are readily available from the airport terminal directly to the campus via the ORR (Outer Ring Road).
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
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
                {isImageUrl(activeEvent.image) ? (
                  <img 
                    src={activeEvent.image} 
                    alt={activeEvent.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div 
                    onClick={() => handleViewOrDownloadFile(activeEvent.image, activeEvent.title)}
                    className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-3 gap-2 cursor-pointer hover:bg-slate-700 transition"
                  >
                    {getFileIcon(activeEvent.image, "w-10 h-10")}
                    <span className="text-[10px] uppercase font-black bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                      {getFileExtensionLabel(activeEvent.image)} Document
                    </span>
                    <span className="text-[9px] text-slate-400">Click to open/download</span>
                  </div>
                )}
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
                        showToast("Enrollment credential password updated successfully!", "success");
                      } else {
                        showToast("No active user records found. Log in or sign up first.", "error");
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  } else {
                    showToast("Settings updated successfully!", "success");
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
      {/* 5.5. STUDENT AUTHENTICATION MODAL (EXPLORE MODE REGISTRATION TRIGGER)     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showStudentAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 text-left"
            >
              {/* Brand Banner */}
              <div className="bg-gradient-to-r from-indigo-700 to-[#00629B] p-6 text-white text-center relative">
                <button 
                  onClick={() => setShowStudentAuthModal(false)}
                  className="absolute top-4 right-4 text-white hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <Globe className="w-8 h-8 mx-auto text-indigo-200 mb-2" />
                <h2 className="text-lg font-bold font-display">IEEE Student Portal Login</h2>
                <p className="text-[11px] text-indigo-100 mt-1">Sign in or create a student account to register for events instantly.</p>
              </div>

              {/* Tab selectors */}
              <div className="flex border-b border-slate-100 bg-slate-50">
                <button
                  onClick={() => {
                    setStudentAuthTab("login");
                    setStudentAuthError("");
                  }}
                  className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all cursor-pointer ${
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
                  className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all cursor-pointer ${
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
                      Sign In & Register
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
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Societies *</label>
                        <select
                          value={studentAuthBranch}
                          onChange={(e) => setStudentAuthBranch(e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="APS">APS</option>
                          <option value="PES">PES</option>
                          <option value="IETE">IETE</option>
                          <option value="IEOM">IEOM</option>
                          <option value="MTT-S">MTT-S</option>
                          <option value="EPS">EPS</option>
                          <option value="CAS">CAS</option>
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
                      Create Account & Register
                    </button>
                  </form>
                )}

                {/* Google Sign In Divider & Button */}
                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-slate-200 w-full absolute"></div>
                  <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase relative z-10">or</span>
                </div>

                <button
                  type="button"
                  onClick={handleStudentGoogleLogin}
                  className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer border-solid"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (() => {
          const activeIndex = filteredImages.findIndex(img => img.id === lightboxImage.id);
          const handlePrev = (e?: any) => {
            if (e) e.stopPropagation();
            if (activeIndex === -1) return;
            const prevIndex = (activeIndex - 1 + filteredImages.length) % filteredImages.length;
            setLightboxImage(filteredImages[prevIndex]);
          };
          const handleNext = (e?: any) => {
            if (e) e.stopPropagation();
            if (activeIndex === -1) return;
            const nextIndex = (activeIndex + 1) % filteredImages.length;
            setLightboxImage(filteredImages[nextIndex]);
          };

          return (
            <div 
              className="fixed inset-0 z-[100] flex flex-col justify-center items-center p-4 bg-slate-950/95 backdrop-blur-md transition-all duration-300"
              onClick={() => setLightboxImage(null)}
            >
              <button 
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 bg-slate-800/80 hover:bg-slate-700/80 text-white p-2.5 rounded-full transition shadow-md z-[110] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Next/Prev buttons */}
              <button 
                onClick={handlePrev}
                className="absolute left-6 bg-slate-800/85 hover:bg-slate-700/85 text-white p-3 rounded-full transition shadow-md hidden sm:block z-[110] cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-6 bg-slate-800/85 hover:bg-slate-700/85 text-white p-3 rounded-full transition shadow-md hidden sm:block z-[110] cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Main container */}
              <div 
                className="max-w-4xl w-full flex flex-col items-center space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={lightboxImage.url} 
                  alt={lightboxImage.title} 
                  className="max-h-[70vh] max-w-[85vw] object-contain rounded-2xl shadow-2xl border border-slate-800 animate-zoom-in"
                />
                <div className="text-center space-y-1.5 px-4 max-w-xl">
                  <div className="flex items-center justify-center gap-2">
                    <span className="bg-[#38BDF8] text-slate-950 font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">
                      {lightboxImage.category}
                    </span>
                    <h3 className="font-bold text-white text-base sm:text-lg font-display">{lightboxImage.title}</h3>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{lightboxImage.caption}</p>
                </div>
              </div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Gallery Add/Edit Form Modal */}
      <AnimatePresence>
        {showGalleryAddEditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 overflow-hidden shadow-2xl border border-slate-200 space-y-4 text-left"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Image className="w-4 h-4 text-[#00629B]" />
                  <span>{showGalleryAddEditModal === "add" ? "Add Photo to Gallery" : "Edit Photo Details"}</span>
                </h3>
                <button 
                  onClick={() => {
                    setShowGalleryAddEditModal(null);
                    setEditingGalleryImage(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {galleryFormError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                  {galleryFormError}
                </div>
              )}

              <form onSubmit={handleSaveGalleryImage} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={galleryFormTitle}
                    onChange={(e) => setGalleryFormTitle(e.target.value)}
                    placeholder="e.g. Hands-on Modeling Session"
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00629B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Caption / Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={galleryFormCaption}
                    onChange={(e) => setGalleryFormCaption(e.target.value)}
                    placeholder="e.g. Students analyzing thermodynamic plots of 3D package stacks."
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00629B] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category *</label>
                    <select
                      value={galleryFormCategory}
                      onChange={(e) => setGalleryFormCategory(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00629B] cursor-pointer"
                    >
                      <option value="Seminars">Seminars</option>
                      <option value="Workshops">Workshops</option>
                      <option value="Inauguration">Inauguration</option>
                      <option value="Activities">Activities</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Image URL Option</label>
                    <input
                      type="text"
                      value={galleryFormUrl}
                      onChange={(e) => setGalleryFormUrl(e.target.value)}
                      placeholder="Or paste direct URL"
                      className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00629B]"
                    />
                  </div>
                </div>

                {/* Upload File Section */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Upload Photo from PC *</label>
                  <input 
                    type="file" 
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === "string") {
                            setGalleryFormUrl(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#00629B]/10 file:text-[#00629B] hover:file:bg-[#00629B]/20 cursor-pointer"
                  />
                  {galleryFormUrl && (
                    <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓ Loaded</span>
                      <img src={galleryFormUrl} alt="Preview" className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-grow bg-[#00629B] hover:bg-[#004B75] text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer text-center"
                  >
                    {showGalleryAddEditModal === "add" ? "Save Photo" : "Update Photo"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowGalleryAddEditModal(null);
                      setEditingGalleryImage(null);
                    }}
                    className="px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. CONTACT & FOOTER SECTION                                              */}
      {/* ========================================================================= */}
      <footer id="footer-section" className="bg-slate-900 text-slate-100 pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-12 pb-12 border-b border-slate-800">
            
            {/* Column 1: Joint Affiliation and Core Details */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-3 h-10">
                <img 
                  src={ieeeEpsLogoImg} 
                  alt="IEEE EPS SBC Logo" 
                  className="w-10 h-10 object-contain rounded-full bg-white p-0.5 border border-slate-700 shrink-0" 
                />
                <strong className="text-white text-base font-display leading-none">{CHAPTER_INFO.shortName}</strong>
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
              <div className="flex items-center h-10">
                <h4 className="text-xs font-bold uppercase text-white tracking-wider font-display leading-none">Sitemap Links</h4>
              </div>
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

            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center h-10">
                <h4 className="text-xs font-bold uppercase text-white tracking-wider font-display leading-none">Office Enquiries</h4>
              </div>
              <div className="space-y-2 pt-1">
                <a 
                  href="tel:+918523009720" 
                  className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-amber-400 font-semibold transition-colors w-fit"
                >
                  <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Tech Admin: +91 85230 09720</span>
                </a>
                <a 
                  href="mailto:ieeeeps090754@gmail.com" 
                  className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-amber-400 font-semibold transition-colors w-fit"
                >
                  <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>ieeeeps090754@gmail.com</span>
                </a>
              </div>

              {/* Social Media Link Buttons Grid */}
              <div className="flex gap-3 pt-2">
                <a 
                  href="https://in.linkedin.com/in/ieee-eps-bvritn-850a10416" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-slate-800 hover:bg-[#0077B5] text-white p-2 rounded-lg transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                 <a 
                  href="https://x.com/ieee_eps_bvritn?s=11" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-slate-800 hover:bg-black text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                  title="Twitter / X"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.facebook.com/share/p/17eFPy7UBp/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-slate-800 hover:bg-[#1877F2] text-white p-2 rounded-lg transition-colors"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href="https://www.instagram.com/bvritn_ieee_eps?igsh=MW4xcmRuZzFoOHNnbA%3D%3D&utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-slate-800 hover:bg-[#E1306C] text-white p-2 rounded-lg transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
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

      {/* Dynamic Global Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-[150] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md max-w-sm ${
              toast.type === "success"
                ? "bg-emerald-500/95 text-white border-emerald-400 shadow-emerald-500/10"
                : toast.type === "error"
                ? "bg-rose-500/95 text-white border-rose-400 shadow-rose-500/10"
                : toast.type === "warning"
                ? "bg-amber-500/95 text-white border-amber-400 shadow-amber-500/10"
                : "bg-slate-800/95 text-white border-slate-700 shadow-slate-800/10"
            }`}
          >
            {toast.type === "success" && <CheckCircle className="w-5 h-5 shrink-0 text-emerald-100" />}
            {toast.type === "error" && <ShieldAlert className="w-5 h-5 shrink-0 text-rose-100" />}
            {toast.type === "warning" && <Info className="w-5 h-5 shrink-0 text-amber-100" />}
            {toast.type === "info" && <Info className="w-5 h-5 shrink-0 text-sky-100" />}
            <span className="text-xs font-bold leading-relaxed">{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="text-white/60 hover:text-white ml-2 cursor-pointer font-bold text-xs"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

    </div>
  );
}
