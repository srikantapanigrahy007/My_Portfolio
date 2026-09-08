import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";
import {
  faReact,
  faNodeJs,
  faJava,
  faJsSquare,
  faHtml5,
  faCss3,
  faGitAlt,
  faCss3Alt,
  faBootstrap,
} from "@fortawesome/free-brands-svg-icons";
import {
  faDatabase,
  faLeaf,
  faServer,
} from "@fortawesome/free-solid-svg-icons";

export const DATA = {
  name: "Srikanta Panigrahy",
  initials: "SP",
  url: "https://srikantapanigrahy.com",
  resumeUrl: "/Srikanta_Panigrahy_SDE.pdf",
  description:
    "Srikanta Panigrahy is a Full Stack Developer building production-grade web applications with React.js, Node.js, Express.js, and MongoDB.",
  summary:
    "I'm **Srikanta Panigrahy**, a **Full Stack Developer** with hands-on experience building and deploying production-grade web applications using **React.js, Node.js, Express.js, and MongoDB**. I'm skilled in **REST API design, JWT authentication, and real-time features**, backed by a strong foundation in **Data Structures & Algorithms, OOP, and database management**. I enjoy debugging, troubleshooting, and optimizing full-stack systems, and I'm currently an **SDE Trainee at Jspider**, sharpening my skills in AI-driven full-stack development while looking for **Software Developer** opportunities where I can contribute, learn, and grow.",
  avatarUrl: "/srikanta-panigrahy.png",
  skills: [
    { name: "HTML5", icon: faHtml5 },
    { name: "CSS3", icon: faCss3 },
    { name: "JavaScript", icon: faJsSquare },
    { name: "Java", icon: faJava },
    { name: "React", icon: faReact },
    { name: "Node.js", icon: faNodeJs },
    { name: "Express.js", icon: faServer },
    { name: "MongoDB", icon: faLeaf },
    { name: "MySQL", icon: faDatabase },
    { name: "SQL", icon: faDatabase },
    { name: "TailwindCSS", icon: faCss3Alt },
    { name: "Bootstrap", icon: faBootstrap },
    { name: "Git", icon: faGitAlt },
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "srikantapanigrahy0760@gmail.com",
    tel: "+91 9337883281",
    social: {
      GitHub: {
        name: "Github",
        url: "https://github.com/srikantapanigrahy007",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/srikanta-panigrahy07/",
        icon: Icons.linkedin,
        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/Srikanta_2004",
        icon: Icons.x,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "#",
        icon: Icons.email,
        navbar: false,
      },
    },
  },
  work: [
    {
      company: "Jspider",
      href: "https://jspiders.com/",
      badges: [],
      location: "Bengaluru, India",
      title: "SDE Trainee",
      logoUrl: "/llgo.webp",
      start: "Feb 2026",
      end: undefined,
      description:
        "Developing responsive web applications using **HTML, CSS, Bootstrap, JavaScript, and React.js**, following modern frontend development practices. Building autonomous **AI agents** for email automation, workflow orchestration, patient triage, and business process automation. Applying full-stack development concepts through hands-on assignments, coding exercises, projects, and regular code execution tests, strengthening debugging and problem-solving skills.",
    },
  ],
  education: [
    {
      school: "Roland Institute of Technology",
      href: "https://roland.ac.in/",
      degree: "B.Tech in Computer Science and Engineering — CGPA 8.19",
      logoUrl: "/rit.jpg",
      start: "Nov 2022",
      end: "May 2026",
    },
  ],
  certifications: [
    {
      name: "Python Essentials",
      issuer: "Cisco Networking Academy",
      href: "#",
      description:
        "Covered Python fundamentals, variables, data types, control flow, functions, data structures, exception handling, and basic programming concepts.",
    },
    {
      name: "MySQL Bootcamp",
      issuer: "LetsUpgrade",
      href: "#",
      description:
        "Covered SQL fundamentals, database design, CRUD operations, joins, subqueries, aggregate functions, constraints, and data manipulation/querying.",
    },
  ],
  projects: [
    {
      title: "Miyora LifeStyle - Everything That Fits Your Life.",
      href: "https://miyora-lifestyle.vercel.app/",
      active: true,
      description:
        "Miyora Lifestyle is a production-ready multi-vendor e-commerce platform built with MERN, providing dedicated experiences for customers, sellers, and administrators with secure authentication, product and inventory management, payments, orders, reviews, and responsive interfaces.",
      dates: "2026",
      technologies: [
        "React",
        "JavaScript",
        "MongoDB",
        "NodeJS",
        "ExpressJs",
        "Socket.io",
        "TailwindCSS",
        "Razorpay",
        "Zustand",
        "TanStack Query",
        "REST APIs",
      ],
      links: [
        {
          type: "Website",
          href: "https://miyora-lifestyle.vercel.app/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/srikantapanigrahy007/Miyora_LifeStyle",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://res.cloudinary.com/dbodedzho/video/upload/v1782919419/worksync_online-video-cutter.com_zv35qp.mp4",
    },
    {
      title: "VibeChat",
      href: "https://vibe-chat-rho.vercel.app/",
      active: true,
      description:
        "A real-time chat application built with the MERN stack. Implemented JWT-based authentication for secure registration, login, and protected access, along with typing indicators and online presence status for an interactive messaging experience. Optimized MongoDB schemas for high-frequency message writes and efficient chat history retrieval, and designed RESTful APIs connecting the React frontend to the Node.js backend.",
      dates: "2025",
      technologies: [
        "React",
        "Node.js",
        "MongoDB",
        "Express.js",
        "TailwindCSS",
        "JWT",
        "Socket.io",
        "NodeMailer",
        "Cloudinary",
      ],
      links: [
        {
          type: "Website",
          href: "https://vibe-chat-rho.vercel.app/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/srikantapanigrahy007/Vibe-Chat",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://res.cloudinary.com/dbodedzho/video/upload/v1782919419/credo_dkhxp0.mp4",
    },
  ],
  hackathons: [],
} as const;
