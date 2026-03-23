import { useEffect } from "react";

export default function AdminLayout({ children }) {
  useEffect(() => {
    const prev = {
      backgroundImage: document.body.style.backgroundImage,
      backgroundSize: document.body.style.backgroundSize,
      backgroundPosition: document.body.style.backgroundPosition,
      backgroundAttachment: document.body.style.backgroundAttachment,
      backgroundColor: document.body.style.backgroundColor,
    };

    document.body.style.backgroundImage = 'url("/background img.png")';
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundColor = "#d5dbd7";

    return () => {
      document.body.style.backgroundImage = prev.backgroundImage;
      document.body.style.backgroundSize = prev.backgroundSize;
      document.body.style.backgroundPosition = prev.backgroundPosition;
      document.body.style.backgroundAttachment = prev.backgroundAttachment;
      document.body.style.backgroundColor = prev.backgroundColor;
    };
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100dvh", fontFamily: '"Lexend", system-ui, -apple-system, Arial, sans-serif' }}>
      {children}
    </div>
  );
}
