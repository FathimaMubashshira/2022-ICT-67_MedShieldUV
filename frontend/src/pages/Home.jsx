import { Link } from "react-router-dom";
import uvLogo from "../assets/uvlogo.jpg";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center" }}>

      {/* ── HEADER: logo + name side by side ── */}
      <header style={{
        width: "100%",
        background: "#fff",
        borderBottom: "3px solid #7b1d4e",
        padding: "18px 40px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        boxShadow: "0 2px 8px rgba(123,29,78,0.10)",
        boxSizing: "border-box"
      }}>
        <img
          src={uvLogo}
          alt="University of Vavuniya Logo"
          style={{ width: "80px", height: "80px", objectFit: "contain", flexShrink: 0 }}
        />
        <div style={{ textAlign: "left" }}>
          <div style={{
            fontSize: "26px",
            fontWeight: "900",
            color: "#7b1d4e",
            letterSpacing: "0.5px",
            lineHeight: 1.2,
            fontFamily: "Georgia, serif"
          }}>
            University of Vavuniya
          </div>
          <div style={{
            fontSize: "15px",
            fontWeight: "700",
            color: "#444",
            marginTop: "4px",
            fontFamily: "Georgia, serif",
            letterSpacing: "0.2px"
          }}>
            MedShieldUV — Student Medical Attendance Protection System
          </div>
        </div>
      </header>

      {/* ── BODY: centered content ── */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        textAlign: "center",
        width: "100%"
      }}>
        <h1 style={{
          fontSize: "42px",
          fontWeight: "900",
          color: "#7b1d4e",
          margin: "0 0 10px",
          fontFamily: "Georgia, serif"
        }}>
          University of Vavuniya
        </h1>

        <h2 style={{
          fontSize: "22px",
          fontWeight: "700",
          color: "#333",
          margin: "0 0 16px",
          fontFamily: "Georgia, serif"
        }}>
          MedShieldUV — Student Medical Attendance Protection System
        </h2>

        <p style={{
          fontSize: "16px",
          fontStyle: "italic",
          color: "#666",
          margin: "0 0 48px",
          fontFamily: "Georgia, serif"
        }}>
          <strong>Protecting academic records during genuine health crises</strong>
        </p>

        <div style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
          <Link to="/login">
            <button style={{
              padding: "16px 48px",
              fontSize: "17px",
              fontWeight: "700",
              color: "#fff",
              background: "#7b1d4e",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              letterSpacing: "0.5px",
              boxShadow: "0 4px 14px rgba(123,29,78,0.35)"
            }}>
              Login
            </button>
          </Link>

          <Link to="/register">
            <button style={{
              padding: "16px 48px",
              fontSize: "17px",
              fontWeight: "700",
              color: "#fff",
              background: "#7b1d4e",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              letterSpacing: "0.5px",
              boxShadow: "0 4px 14px rgba(123,29,78,0.35)"
            }}>
              Register
            </button>
          </Link>
        </div>
      </main>

    </div>
  );
}
