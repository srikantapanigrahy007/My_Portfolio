import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/db.js";
import Profile from "../src/models/Profile.js";
import Skill from "../src/models/Skill.js";
import Experience from "../src/models/Experience.js";
import Education from "../src/models/Education.js";
import Certification from "../src/models/Certification.js";
import Project from "../src/models/Project.js";

// One-time/reset seed: populates the database with Srikanta's current
// portfolio content. Safe to re-run — it replaces each collection wholesale.
async function seed() {
  await connectDB(process.env.MONGODB_URI);

  await Profile.findOneAndUpdate(
    { singleton: "profile" },
    {
      singleton: "profile",
      name: "Srikanta Panigrahy",
      initials: "SP",
      url: "https://srikantapanigrahy.com",
      resumeUrl: "/Srikanta_Panigrahy_SDE.pdf",
      avatarUrl: "/srikanta-panigrahy.png",
      description:
        "Srikanta Panigrahy is a Full Stack Developer building production-grade web applications with React.js, Node.js, Express.js, and MongoDB.",
      summary:
        "I'm **Srikanta Panigrahy**, a **Full Stack Developer** with hands-on experience building and deploying production-grade web applications using **React.js, Node.js, Express.js, and MongoDB**. I'm skilled in **REST API design, JWT authentication, and real-time features**, backed by a strong foundation in **Data Structures & Algorithms, OOP, and database management**. I enjoy debugging, troubleshooting, and optimizing full-stack systems, and I'm currently an **SDE Trainee at Jspider**, sharpening my skills in AI-driven full-stack development while looking for **Software Developer** opportunities where I can contribute, learn, and grow.",
      heroDescription:
        "**Full Stack Developer** specializing in **React.js**, **Node.js**, **Express.js**, and **MongoDB**. Building production-grade web apps with clean REST APIs and secure authentication, and open to **Software Developer** opportunities.",
      email: "srikantapanigrahy0760@gmail.com",
      tel: "+91 9337883281",
      socials: [
        {
          key: "GitHub",
          name: "Github",
          url: "https://github.com/srikantapanigrahy007",
          icon: "github",
          navbar: true,
        },
        {
          key: "LinkedIn",
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/srikanta-panigrahy07/",
          icon: "linkedin",
          navbar: true,
        },
        {
          key: "X",
          name: "X",
          url: "https://x.com/Srikanta_2004",
          icon: "x",
          navbar: true,
        },
        {
          key: "email",
          name: "Send Email",
          url: "#",
          icon: "email",
          navbar: false,
        },
      ],
    },
    { upsert: true, new: true }
  );

  await Skill.deleteMany({});
  await Skill.insertMany(
    [
      "html5",
      "css3",
      "javascript",
      "java",
      "react",
      "nodejs",
      "express",
      "mongodb",
      "mysql",
      "sql",
      "tailwindcss",
      "bootstrap",
      "git",
    ].map((icon, i) => ({
      name:
        {
          html5: "HTML5",
          css3: "CSS3",
          javascript: "JavaScript",
          java: "Java",
          react: "React",
          nodejs: "Node.js",
          express: "Express.js",
          mongodb: "MongoDB",
          mysql: "MySQL",
          sql: "SQL",
          tailwindcss: "TailwindCSS",
          bootstrap: "Bootstrap",
          git: "Git",
        }[icon],
      icon,
      order: i,
    }))
  );

  await Experience.deleteMany({});
  await Experience.insertMany([
    {
      company: "Jspider",
      href: "https://jspiders.com/",
      location: "Bengaluru, India",
      title: "SDE Trainee",
      logoUrl: "/llgo.webp",
      start: "Feb 2026",
      end: "",
      description:
        "Developing responsive web applications using **HTML, CSS, Bootstrap, JavaScript, and React.js**, following modern frontend development practices. Building autonomous **AI agents** for email automation, workflow orchestration, patient triage, and business process automation. Applying full-stack development concepts through hands-on assignments, coding exercises, projects, and regular code execution tests, strengthening debugging and problem-solving skills.",
      order: 0,
    },
  ]);

  await Education.deleteMany({});
  await Education.insertMany([
    {
      school: "Roland Institute of Technology",
      href: "https://roland.ac.in/",
      degree: "B.Tech in Computer Science and Engineering — CGPA 8.19",
      logoUrl: "/rit.jpg",
      start: "Nov 2022",
      end: "May 2026",
      order: 0,
    },
  ]);

  await Certification.deleteMany({});
  await Certification.insertMany([
    {
      name: "Python Essentials",
      issuer: "Cisco Networking Academy",
      href: "#",
      description:
        "Covered Python fundamentals, variables, data types, control flow, functions, data structures, exception handling, and basic programming concepts.",
      order: 0,
    },
    {
      name: "MySQL Bootcamp",
      issuer: "LetsUpgrade",
      href: "#",
      description:
        "Covered SQL fundamentals, database design, CRUD operations, joins, subqueries, aggregate functions, constraints, and data manipulation/querying.",
      order: 1,
    },
  ]);

  await Project.deleteMany({});
  await Project.insertMany([
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
        { type: "Website", href: "https://miyora-lifestyle.vercel.app/", icon: "globe" },
        {
          type: "Source",
          href: "https://github.com/srikantapanigrahy007/Miyora_LifeStyle",
          icon: "github",
        },
      ],
      image: "",
      video:
        "https://res.cloudinary.com/dbodedzho/video/upload/v1782919419/worksync_online-video-cutter.com_zv35qp.mp4",
      order: 0,
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
        { type: "Website", href: "https://vibe-chat-rho.vercel.app/", icon: "globe" },
        {
          type: "Source",
          href: "https://github.com/srikantapanigrahy007/Vibe-Chat",
          icon: "github",
        },
      ],
      image: "",
      video:
        "https://res.cloudinary.com/dbodedzho/video/upload/v1782919419/credo_dkhxp0.mp4",
      order: 1,
    },
  ]);

  console.log("Seed complete.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
