import React, { useRef, useState, useEffect } from "react";
import { navbarStyles } from "../assets/dummyStyles";
import logo from "../assets/logo.png";
import { BookMarked, BookOpen, Contact, Home, Menu, Users, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth, useClerk, UserButton, useUser } from "@clerk/clerk-react";

const baseNav = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Courses", icon: BookOpen, href: "/Courses" },
  { name: "About", icon: BookMarked, href: "/About" },
  { name: "Faculty", icon: Users, href: "/faculty" },
  { name: "Contact", icon: Contact, href: "/contact" }
];

const Navbar = () => {
  // Clerk
  const { openSignUp } = useClerk();
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();

  // States
  const [isOpen, setIsOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  const menuRef = useRef(null);

  const navItems = isSignedIn
  ? [
      ...baseNav,
      { name: "MyCourses", icon: BookOpen, href: "/mycourses" },
    ]
  : baseNav;

  
  useEffect(() => {
    const fetchToken = async () => {
      try {
        console.log("isSignedIn:", isSignedIn);

        if (isSignedIn) {
          const token = await getToken();
          console.log("TOKEN:", token);

          if (token) {
            localStorage.setItem("token", token);
          }
        } else {
          localStorage.removeItem("token");
          console.log("Clerk Token Removed");
        }
      } catch (err) {
        console.error("Token fetch error:", err);
      }
    };

    fetchToken();
  }, [isSignedIn, getToken]);

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      if (scrollY > lastScrollY && scrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const desktopLinkClass = (isActive) =>
    `${navbarStyles.desktopNavItem} ${
      isActive ? navbarStyles.desktopNavItemActive : ""
    }`;

  const mobileLinkClass = (isActive) =>
    `${navbarStyles.mobileNavItem} ${
      isActive
        ? navbarStyles.mobileNavItemActive
        : navbarStyles.mobileMenuItemHover
    }`;

  return (
    <nav
      className={`${navbarStyles.navbar} ${
        showNavbar ? navbarStyles.navbarVisible : navbarStyles.navbarHidden
      } ${
        isScrolled ? navbarStyles.navbarScrolled : navbarStyles.navbarDefault
      }`}
    >
      <div className={navbarStyles.container}>
        <div className={navbarStyles.innerContainer}>
          {/* Logo */}
          <div className="flex items-center gap-3 select-none">
            <img src={logo} alt="Logo" className="w-12 h-12" />
            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-700 to-cyan-600 font-serif leading-[0.95]">
              SkillForge
            </div>
          </div>

          {/* Desktop Nav */}
          <div className={navbarStyles.desktopNav}>
            <div className={navbarStyles.desktopNavContainer}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end={item.href === "/"}
                    className={({ isActive }) =>
                      desktopLinkClass(isActive)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <Icon size={16} />
                      <span>{item.name}</span>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Right Side */}
          <div className={navbarStyles.authContainer}>
            {!isSignedIn ? (
              <button
                onClick={() => openSignUp({})}
                className={navbarStyles.loginButton}
              >
                Create Account
              </button>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={navbarStyles.mobileMenuButton}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-lg lg:hidden z-50">
            <div className={navbarStyles.mobileMenuItems}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end={item.href === "/"}
                    className={({ isActive }) =>
                      mobileLinkClass(isActive)
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center gap-2 px-4 py-2">
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </div>
                  </NavLink>
                );
              })}
            </div>

            {!isSignedIn ? (
              <button
                onClick={() => {
                  openSignUp({});
                  setIsOpen(false);
                }}
                className="w-full py-2"
              >
                Create Account
              </button>
            ) : (
              <div className="p-4">
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;