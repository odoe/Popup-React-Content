import { useEffect } from "react";
import { createPortal } from "react-dom";

const PopupPortal = ({ mount, children }) => {
  const el = document.createElement("div");

  useEffect(() => {
    mount.appendChild(el);
    return () => mount.removeChild(el);
  }, [el, mount]);

  return createPortal(children, el);
};

export default PopupPortal;