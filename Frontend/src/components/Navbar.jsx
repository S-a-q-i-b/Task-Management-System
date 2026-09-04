import gsap from "gsap";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "../styles/navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navbarRef = useRef(null);
  const brandRef = useRef(null);
  const userRef = useRef(null);
  const logoutRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .from(navbarRef.current, {
          y: -30,
          opacity: 0,
          duration: 0.6,
        })
        .from(
          brandRef.current,
          {
            x: -20,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.3",
        )
        .from(
          userRef.current,
          {
            x: 20,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.35",
        );
    }, navbarRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleBrandEnter = () => {
    gsap.to(brandRef.current, {
      scale: 1.04,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleBrandLeave = () => {
    gsap.to(brandRef.current, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleUserEnter = () => {
    const avatar = userRef.current?.querySelector(".user-avatar");

    if (!avatar) {
      return;
    }

    gsap.to(avatar, {
      scale: 1.08,
      rotation: 3,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleUserLeave = () => {
    const avatar = userRef.current?.querySelector(".user-avatar");

    if (!avatar) {
      return;
    }

    gsap.to(avatar, {
      scale: 1,
      rotation: 0,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleLogoutEnter = () => {
    gsap.to(logoutRef.current, {
      y: -2,
      scale: 1.03,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleLogoutLeave = () => {
    gsap.to(logoutRef.current, {
      y: 0,
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleLogout = async () => {
    try {
      await logout();

      toast.success("Logged out successfully!");

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);

      toast.error("Logout failed.");
    }
  };

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-container">
        <Link
          to="/dashboard"
          className="navbar-brand"
          ref={brandRef}
          onMouseEnter={handleBrandEnter}
          onMouseLeave={handleBrandLeave}
        >
          Task<span>Manager</span>
        </Link>

        <div className="navbar-right">
          {user && (
            <div
              className="navbar-user"
              ref={userRef}
              onMouseEnter={handleUserEnter}
              onMouseLeave={handleUserLeave}
            >
              <div className="user-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div className="user-info">
                <strong>{user.name}</strong>

                <span>{user.email}</span>
              </div>
            </div>
          )}

          <button
            ref={logoutRef}
            className="logout-button"
            onClick={handleLogout}
            onMouseEnter={handleLogoutEnter}
            onMouseLeave={handleLogoutLeave}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
