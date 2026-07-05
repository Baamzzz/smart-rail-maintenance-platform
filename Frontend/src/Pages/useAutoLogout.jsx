import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const FIVE_MINUTES = 5 * 60 * 1000;

export default function useAutoLogout() {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const logout = () => {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("role");
      localStorage.removeItem("token");

      navigate("/");
    };

    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(logout, FIVE_MINUTES);
    };

    const activityEvents = [
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
      "touchstart",
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [navigate]);
}