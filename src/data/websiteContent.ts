/**
 * =========================================================================
 * IEEE EPS student chapter BVRIT NARSAPUR - WEBPAGE CONTENT SOURCE FILE
 * =========================================================================
 * 
 * INSTRUCTIONS FOR MANUAL MODIFICATION:
 * This file contains all the text, image URLs, links, and details for the website.
 * If you want to change any text, images, names, roles, or links, you only need
 * to modify this file! You do not need to edit the complex HTML/React code.
 * 
 * Standard Image Guide:
 * - Replace placeholder URLs (like 'https://picsum.photos/...') with your actual 
 *   image paths (e.g., 'src/assets/advisor.jpg' or any web URL).
 * - Ensure your images are saved in a folder like '/public/images/' or similar
 *   if modifying locally.
 */

export const CHAPTER_INFO = {
  chapterName: "IEEE Electronics Packaging Society",
  shortName: "IEEE EPS Student Chapter",
  institution: "BVRIT Narsapur",
  collegeFullName: "Padmasri Dr. B.V. Raju Institute of Technology",
  universityAffiliation: "Affiliated to JNTUH, Accredited by NAAC & NBA",
  establishedYear: "2026",
  email: "ieeeeps090754@gmail.com", // <-- Change this to your actual chapter email
  contactPhone: "+91 9573644820", // <-- Change to your contact phone
  location: "Narsapur, Medak District, Telangana - 502313, India",
  
  // LOGO IMAGES: Replace empty strings with actual physical file paths or Web URLs
  // E.g. ieeeEpsLogo: "/images/ieee_eps_logo.png" or "https://..."
  ieeeEpsLogo: "https://eps.ieee.org/images/files/logos/EPS_logo_no_tag_color_RGB.png", 
  bvritLogo: "https://bvrit.ac.in/wp-content/themes/bvrit/images/logo.png",
  
  // Social Media Links (Leave blank or change to your actual links)
  socials: {
    linkedin: "https://www.linkedin.com/school/bvrit-narsapur/",
    instagram: "https://www.instagram.com/",
    twitter: "https://twitter.com/",
    github: "https://github.com/",
    collegeWebsite: "https://bvrit.ac.in/"
  }
};

export const HOME_CONTENT = {
  // Hero Banner Section
  hero: {
    badge: "Welcome to IEEE EPS BVRIT",
    title: "The Next Frontier in Semiconductor Scaling & Microelectronics",
    description: "Welcome to the IEEE Electronics Packaging Society (EPS) Student Chapter at Padmasri Dr. B.V. Raju Institute of Technology, Narsapur. We bridge the gap between silicon chips and the real world through advanced packaging, thermal design, and system integration.",
    
    // HERO IMAGE: Swap this URL with your custom high-quality banner image!
    // Recommended size: 1920x1080 pixels (aspect ratio 16:9).
    backgroundImage: "https://picsum.photos/seed/semiconductor/1920/1080", 
    
    primaryButtonText: "Explore Who We Are",
    secondaryButtonText: "Upcoming Events",
  },

  // What is Electronics Packaging? Quick Intro on Homepage
  quickIntro: {
    title: "Why Systems Packaging Matters",
    subtitle: "In the era of modern computing, packaging is no longer just a container for microchips—it is the system itself.",
    points: [
      {
        title: "More-Than-Moore Era",
        description: "As physical transistor limits are reached, advanced 2.5D/3D packaging is the primary driver of computing performance."
      },
      {
        title: "Thermal Management",
        description: "Designing packaging that dissipates heat efficiently from billion-transistor processors is crucial for AI and cloud servers."
      },
      {
        title: "High-Frequency Signals",
        description: "Packaging engineers optimize high-speed signal pathways to reduce delay, distortion, and electromagnetic interference."
      }
    ]
  },

  // Core Pillars / Tech Focus of the Society
  pillars: {
    title: "Our Core Technology Domains",
    subtitle: "Through hands-on projects, workshops, and technical talks, our chapter focuses on key industry disciplines.",
    list: [
      {
        code: "EPS-01",
        title: "Advanced Packaging & 3D ICs",
        description: "Exploring Multi-Chip Modules (MCM), System-in-Package (SiP), Chiplets, and Through-Silicon Vias (TSVs).",
        icon: "Cpu" // Matches generic icon lookup
      },
      {
        code: "EPS-02",
        title: "Thermal & Mechanical Co-Design",
        description: "Analyzing heat dissipation, dissipation materials, thermal stress, mechanical reliability, and structural integrity of components.",
        icon: "Thermometer"
      },
      {
        code: "EPS-03",
        title: "Signal & Power Integrity",
        description: "Minimizing electromagnetic interference, cross-talk, and power delivery network impedance in complex motherboard designs.",
        icon: "Activity"
      },
      {
        code: "EPS-04",
        title: "Sustainable Electronics Packaging",
        description: "Investigating green/biodegradable PCB substrate materials, lead-free solder, and energy-efficient manufacturing processes.",
        icon: "Leaf"
      }
    ]
  },

  // Student Chapter Initiatives / Activities 
  initiatives: {
    title: "Chapter Activities",
    subtitle: "How we foster engineering talent and build professional readiness among students at BVRIT.",
    list: [
      {
        title: "Technical Seminars & Guest Lectures",
        description: "Learn directly from distinguished industry experts and academicians about current microelectronics trends.",
        icon: "BookOpen"
      },
      {
        title: "Hands-on VLSI & Packaging Workshops",
        description: "Gain dynamic experience using simulation software, thermal modeling tools, and high-frequency circuit design methodologies.",
        icon: "Wrench"
      },
      {
        title: "Industrial Site Visits",
        description: "Tour cutting-edge semiconductor assembly lines, testing labs, and electronic manufacturing facilities standard in Hyderabad.",
        icon: "Compass"
      },
      {
        title: "Student Research & Innovation",
        description: "Collaborate with peers on micro-projects, research reviews, and participate in national level design hackathons.",
        icon: "Award"
      }
    ]
  },

  // Highlight of Upcoming or Recent Events
  events: {
    title: "Events Calendar & Announcements",
    subtitle: "Stay updated with the latest workshops, panel discussions, and webinars scheduled at BVRIT Narsapur.",
    list: [
      {
        id: "evt-1",
        status: "Upcoming", // "Upcoming" or "Completed"
        date: "June 15, 2026",
        title: "Vitals of Modern Semiconductor Packaging",
        type: "Expert Guest Lecture",
        speaker: "Dr. Srinivas Prasad, Lead Packaging Architect at Intel / AMD Hyderabad",
        location: "Main Auditorium, BVRIT Narsapur",
        description: "An intensive lecture focusing on the paradigm transition from monolithic System-on-Clips (SoCs) to modular heterogeneous chiplet architectures.",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80" // Placeholder
      },
      {
        id: "evt-2",
        status: "Upcoming",
        date: "July 04, 2026",
        title: "Thermal Simulation Hands-on Mini Hack",
        type: "Practical Workshop",
        speaker: "BVRIT Department of ECE & IEEE EPS Coordinators",
        location: "Electronics Simulation Lab, Phase II",
        description: "Introduction to thermal modeling of microprocessors under active and passive heat sinks using open simulation platforms.",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80" // Placeholder
      },
      {
        id: "evt-3",
        status: "Completed",
        date: "May 10, 2026",
        title: "Inaugural Ceremony & Chapter Roadmap Unveiling",
        type: "Milestone Celebration",
        speaker: "Presided by Principal of BVRIT and IEEE Hyderabad Section Representatives",
        location: "Seminar Hall 1, ECE Block",
        description: "The official launch of IEEE EPS Student Chapter at BVRIT Narsapur! Setup of general goals and division of working student committees.",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80" // Placeholder
      }
    ]
  }
};

export const ABOUT_CONTENT = {
  // Vision and Mission Section
  aboutIntro: {
    title: "Advancing Science and Microelectronics Technology",
    description: "The IEEE Electronics Packaging Society (EPS) is the leading forum for scientists and engineers globally. At BVRIT Narsapur, our student chapter is dedicated to nurturing technical literacy in systems packaging, PCB substrate prototyping, thermal integrity, and microelectronic devices.",
    chapterVision: "To establish a center of student excellence in semiconductor hardware co-design and electronics packaging technologies, enabling BVRIT students to pioneer smart micro-systems and lead national/global industrial VLSI workforces.",
    chapterMission: "To bridge academical electronics engineering curricula with practical microelectronics industry realities by hosting technical sessions, hands-on mechanical-to-electrical thermal simulation labs, and mentoring collaborative student research publications."
  },

  // Core Educational Subsection: What is Packaging?
  whatIsPackaging: {
    title: "Understanding Microelectronics Packaging",
    subtitle: "What exactly is Electronics Packaging & Systems Integration?",
    explanation: "Electronics packaging is the art and science of housing, powering, cooling, and connecting semiconductor integrated circuits. Every microchip in your smartphone, laptop, or electric vehicle needs to communicate with the rest of the motherboard while being protected from heat, dust, moisture, and impact. Packaging is where chemistry, physics, mechanical engineering, and electrical design converge.",
    highlights: [
      {
        metric: "90%",
        label: "System Optimization",
        detail: "of performance bottleneck occurs in interconnect spacing and transmission pathways rather than pure transistor speed."
      },
      {
        metric: "2.5D/3D",
        label: "Vertical Stacking",
        detail: "Chip stacking is the current mainstream method used by AMD, Apple, and NVIDIA to scale micro-computing throughput."
      },
      {
        metric: "100W+",
        label: "Heat Dissipation",
        detail: "Efficient micro-convection and advanced heat sinks are required to sustain stable performance in server CPUs."
      }
    ]
  },

  // Faculty Coordinators / Leadership
  // MANUAL MODIFICATION: Replace titles, names, emails, and images with actual chapter details!
  committee: {
    title: "Our Leadership Team",
    subtitle: "The visionary faculty and enthusiastic students driving the chapter's operational excellence.",
    
    // Faculty Advisors Group
    faculty: [
      {
        name: "Dr. J. Prasanna Kumar", // <-- Replace with your real Advisor Name
        role: "Head of Dept, ECE & Head Coordinator",
        description: "Guiding the chapter with over 15 years of academic and industrial research expertise in micro-sensor fabrication and embedded systems.",
        email: "prasannakumar.j@bvrit.ac.in", // <-- Replace Email
        linkedin: "https://www.linkedin.com/",
        // Replace with Faculty photo URL
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80"
      },
      {
        name: "Mrs. K. Radhika", // <-- Replace with your Co-coordinator
        role: "Faculty Advisor, IEEE-EPS Team-Lead",
        description: "Specializes in VLSI layout designs and High-Frequency antennas. Spearheading active student research papers.",
        email: "radhika.k@bvrit.ac.in",
        linkedin: "https://www.linkedin.com/",
        // Replace with Faculty photo URL
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
      }
    ],

    // Student Executive Committee 
    students: [
      {
        name: "Charansaitej Voorugunda",
        role: "Chair",
        department: "ECE, 3rd year",
        email: "24211A04R1@bvrit.ac.in",
        linkedin: "https://www.linkedin.com/in/charansaitej-voorugonda",
        image: "/student-charansaitej.png"
      },
      {
        name: "Sai Aashrita Vasagiri",
        role: "Co-Chair",
        department: "ECE, 3rd year",
        email: "24211A04Q3@bvrit.ac.in",
        linkedin: "https://www.linkedin.com/in/vasagiri-sai-aashrita-b41bb6327?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        name: "Vaishnavi Cherukuri",
        role: "Secretary",
        department: "ECE, 3rd year",
        email: "24211A0452@bvrit.ac.in",
        linkedin: "https://www.linkedin.com/in/vaishnavi-cherukuri-b6aa5933b?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        name: "SREEJAN GOUD ROUTHU",
        role: "Treasurer",
        department: "ECE, 3rd year",
        email: "24211A04M8@bvrit.ac.in",
        linkedin: "https://www.linkedin.com/in/sreejan-goud-routhu-15ba4033b?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        name: "P V Lalith Surya",
        role: "Technical Lead",
        department: "ECE, 3rd year",
        email: "24211A04G9@bvrit.ac.in",
        linkedin: "https://www.linkedin.com/in/pv-lalith-surya-577ab733b?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        name: "BANDI REDDAPPA VENKATESH",
        role: "Web Master & Tech Admin",
        department: "ECE, 3rd year",
        email: "24211A0423@bvrit.ac.in",
        linkedin: "https://www.linkedin.com/in/bandireddappa-venkatesh-889a3533b?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        name: "HASINI PRIYA AVULA",
        role: "Event Coordinator",
        department: "ECE, 3rd year",
        email: "24211A0418@bvrit.ac.in",
        linkedin: "https://www.linkedin.com/in/avula-hasini-priya-7aa98433b?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        name: "Patlolla Rushitha",
        role: "Logistics Lead",
        department: "ECE, 3rd year",
        email: "24211A04H9@bvritr.ac.in",
        linkedin: "https://www.linkedin.com/in/rushitha-p-6a8a5933b?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        name: "AISHWARYA BATINI",
        role: "Public & Industry Relation Lead",
        department: "ECE, 3rd year",
        email: "24211A0429@bvrit.ac.in",
        linkedin: "https://www.linkedin.com/in/aishwarya-batini-ab40a5340?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        name: "Bhaskar Akshaya",
        role: "Design Lead",
        department: "ECE, 3rd year",
        email: "24211a0437@bvrit.ac.in",
        linkedin: "https://www.linkedin.com/in/bhaskar-akshaya-42098933b?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        name: "YOGESH BALINENI",
        role: "Social Media Lead",
        department: "ECE, 3rd year",
        email: "24211A0421@bvrit.ac.in",
        linkedin: "https://www.linkedin.com/in/yogesh-chandra-5b5682331?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
        image: "/student-yogesh.jpg"
      },
      {
        name: "Niharika Rathod",
        role: "Membership Development & OutReach head",
        department: "ECE, 3rd year",
        email: "24211A04K3@bvrit.ac.in",
        linkedin: "https://www.linkedin.com/in/niharika-rathod-14a681223?utm_source=share_via&utm_content=profile&utm_medium=member_android"
      },
      {
        name: "Choul Srinath",
        role: "Web Master & Tech Admin",
        department: "CSE, 3rd year",
        email: "24211a05b5@bvrit.ac.in",
        linkedin: "https://www.linkedin.com/in/srinathchoul/",
        image: "/student-srinath.jpg"
      }
    ]
  },

  // Elegant Photo Gallery placeholders
  gallery: {
    title: "Chapter Gallery",
    subtitle: "Visual highlights from our lab sessions, guest lectures, student campaigns, and group photos.",
    images: [
      {
        title: "Hands-on Modeling Session",
        caption: "Students analyzing thermodynamic plots of 3D package stacks.",
        url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Chapter Orientation 2026",
        caption: "A huge turnout of engineering enthusiasts for our initial EPS roadmap briefing.",
        url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Micro-PCB Solder Workshop",
        caption: "Getting hands-on precision soldering with standard lead-free substrates.",
        url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Industry Expert Virtual Meet",
        caption: "Virtual roundtable discussing Advanced Packaging innovations with Silicon Valley mentors.",
        url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80"
      }
    ]
  }
};

export const CONTACT_CONTENT = {
  title: "Contact IEEE EPS BVRIT Chapter",
  subtitle: "Have questions about society enrollment, upcoming workshops, or research collaboration? Reach out to us!",
  faq: [
    {
      q: "Who can join the IEEE EPS student chapter?",
      a: "Engineering students from ECE, EEE, CSE, IT, and Allied Branches of BVRIT Narsapur who are interested in micro-electronics, VLSI design, physical fabrication, simulation, and thermal systems co-design can join."
    },
    {
      q: "Do I need to be an official IEEE member first?",
      a: "While we encourage all active participants to register for full IEEE and EPS student memberships for official certificates/discounts, local BVRIT student chapter bootcamps are open to all passionate beginners."
    },
    {
      q: "How can I register for the upcoming expert lectures?",
      a: "You can easily submit your details via our online registration form in the events calendar or simply complete the rapid query form at the bottom of this website. Our team will mail you details."
    }
  ]
};
