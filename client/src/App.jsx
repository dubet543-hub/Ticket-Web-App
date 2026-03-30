import { useCallback, useEffect, useRef, useState } from "react";
import API from "./api";
import { generateWhatsAppLink } from "./utils/ticketMessage";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CategoryForm from "./components/CategoryForm";
import FacilityForm from "./components/FacilityForm";
import UserManagement from "./components/UserManagement";
import CheckInScanner from "./components/CheckInScanner";
import AttendeeForm from "./components/AttendeeForm";
import ReportView from "./components/ReportView";
import Login from "./components/Login";

const ROLE_MENU_ACCESS = {
  Admin: [
    "dashboard",
    "add-category",
    "add-facility",
    "users",
    "attendees",
    "check-in",
    "member-report",
    "facility-report",
    "registration-report",
  ],
  DataEntry: [
    "dashboard",
    "attendees",
    "member-report",
    "registration-report",
  ],
  Scanner: ["dashboard", "check-in", "facility-report"],
};

// ─── Robust role normalizer ────────────────────────────────────────────────────
// Strips spaces, underscores, hyphens and lowercases before comparing,
// so "Data Entry", "data_entry", "DataEntry", "DATA-ENTRY" all map to "DataEntry".
const normalizeRole = (role) => {
  const value = String(role || "").toLowerCase().replace(/[\s_\-]+/g, "");

  console.log(
    `[normalizeRole] raw value from DB: "${role}"  →  normalized key: "${value}"`
  );

  if (value === "admin") return "Admin";
  if (value === "dataentry") return "DataEntry";
  if (value === "scanner") return "Scanner";

  console.warn(
    `[normalizeRole] Unrecognized role "${role}". ` +
      `Add a matching case above or fix the value stored in MongoDB. Defaulting to Scanner.`
  );
  return "Scanner";
};

function App() {
  // ── Auth state ──────────────────────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser]         = useState(null);
  const [authToken, setAuthToken]             = useState(null);

  const [activeMenu, setActiveMenu] = useState("dashboard");

  const menuItems = [
    { id: "dashboard",            label: "Dashboard"            },
    { id: "add-category",         label: "Add Category"         },
    { id: "add-facility",         label: "Add Facility"         },
    { id: "users",                label: "Create Login"         },
    { id: "attendees",            label: "Member"               },
    { id: "check-in",             label: "Check-In"             },
    { id: "member-report",        label: "Member Report"        },
    { id: "facility-report",      label: "Facility Report"      },
    { id: "registration-report",  label: "Registration Report"  },
  ];

  const currentRole   = normalizeRole(currentUser?.role);
  const allowedMenus  = ROLE_MENU_ACCESS[currentRole] || ROLE_MENU_ACCESS.Scanner;

  // ── Form state ──────────────────────────────────────────────────────────────
  const [categoryForm, setCategoryForm] = useState({
    categoryName: "", price: "", coverPrice: "",
  });

  const [facilityForm, setFacilityForm] = useState({
    facilityName: "", description: "",
  });

  const [userForm, setUserForm] = useState({
    name: "", username: "", password: "", role: "",
  });

  const [attendeeForm, setAttendeeForm] = useState({
    name: "", email: "", mobile: "", gender: "", age: "", category: "", sendWhatsApp: false,
  });

  const [checkInForm, setCheckInForm] = useState({
    scanValue: "", facility: "",
  });

  // ── Data state ──────────────────────────────────────────────────────────────
  const [categories,     setCategories]     = useState([]);
  const [facilities,     setFacilities]     = useState([]);
  const [users,          setUsers]          = useState([]);
  const [attendees,      setAttendees]      = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalAttendees:      0,
    checkedInCount:      0,
    pendingCount:        0,
    totalTicketAmount:   0,
    totalCoverAmount:    0,
    whatsappSentCount:   0,
    whatsappFailedCount: 0,
    duplicateScanCount:  0,
    categoryWiseCount:   [],
  });

  // ── Loading state ───────────────────────────────────────────────────────────
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [facilityLoading, setFacilityLoading] = useState(false);
  const [userLoading,     setUserLoading]     = useState(false);
  const [attendeeLoading, setAttendeeLoading] = useState(false);
  const [checkInLoading,  setCheckInLoading]  = useState(false);
  const [checkInResult,   setCheckInResult]   = useState(null);

  const [editingAttendeeId, setEditingAttendeeId] = useState(null);

  const scanInputRef         = useRef(null);
  const scanBufferRef        = useRef("");
  const scanBufferTimeoutRef = useRef(null);

  // ── Restore session from localStorage ──────────────────────────────────────
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser  = localStorage.getItem("authUser");

    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        console.log("[session restore] user:", user);
        setAuthToken(savedToken);
        setCurrentUser(user);
        setIsAuthenticated(true);
        API.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      } catch (error) {
        console.error("Error parsing saved auth data:", error);
        localStorage.clear();
      }
    }
  }, []);

  // ── Fetch helpers ───────────────────────────────────────────────────────────
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("fetchCategories:", err);
      alert("Failed to load categories");
    }
  };

  const fetchFacilities = async () => {
    try {
      const res = await API.get("/facilities");
      setFacilities(res.data);
    } catch (err) {
      console.error("fetchFacilities:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("fetchUsers:", err);
    }
  };

  const fetchAttendees = async (filter = "all") => {
    try {
      let url = "/reports/attendees";
      if (filter === "checked-in") url += "?status=checked-in";
      else if (filter === "pending") url += "?status=pending";
      const res = await API.get(url);
      setAttendees(res.data.attendees);
      if (res.data.summary) setDashboardStats(res.data.summary);
    } catch (err) {
      console.error("fetchAttendees:", err);
      alert("Failed to load attendees");
    }
  };

  const fetchDashboardSummary = async () => {
    try {
      const res = await API.get("/dashboard/summary");
      setDashboardStats(res.data);
    } catch (err) {
      console.error("fetchDashboardSummary:", err);
    }
  };

  const refreshAllData = async () => {
    await Promise.all([
      fetchCategories(),
      fetchFacilities(),
      fetchUsers(),
      fetchAttendees(),
      fetchDashboardSummary(),
    ]);
  };

  // Refresh data once after authentication is confirmed
  useEffect(() => {
    if (isAuthenticated) refreshAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Keep scan input focused when on check-in screen
  useEffect(() => {
    if (scanInputRef.current) scanInputRef.current.focus();
  }, [activeMenu]);

  // If the active menu is not allowed for the current role, redirect to first allowed
  useEffect(() => {
    if (isAuthenticated && !allowedMenus.includes(activeMenu)) {
      setActiveMenu(allowedMenus[0] || "dashboard");
    }
  }, [isAuthenticated, activeMenu, allowedMenus]);

  // ── Form change handlers ────────────────────────────────────────────────────
  const handleCategoryChange  = (e) => setCategoryForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleFacilityChange  = (e) => setFacilityForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleUserChange      = (e) => setUserForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleCheckInChange   = (e) => setCheckInForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleAttendeeChange  = (e) => {
    const { name, value, type, checked } = e.target;
    setAttendeeForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  // ── Reset helpers ───────────────────────────────────────────────────────────
  const resetCategoryForm = () => setCategoryForm({ categoryName: "", price: "", coverPrice: "" });
  const resetFacilityForm = () => setFacilityForm({ facilityName: "", description: "" });

  const resetAttendeeForm = () => {
    setAttendeeForm({ name: "", email: "", mobile: "", gender: "", age: "", category: "", sendWhatsApp: false });
    setEditingAttendeeId(null);
  };

  // ── Attendee edit / delete ──────────────────────────────────────────────────
  const handleEditAttendee = (attendee) => {
    setEditingAttendeeId(attendee._id);
    setAttendeeForm({
      name:     attendee.name     || "",
      email:    attendee.email    || "",
      mobile:   attendee.mobile   || "",
      gender:   attendee.gender   || "",
      age:      attendee.age      || "",
      category: attendee.category?._id || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteAttendee = async (attendeeId, attendeeName) => {
    if (!window.confirm(`Are you sure you want to delete ${attendeeName}?`)) return;
    try {
      await API.delete(`/attendees/${attendeeId}`);
      if (editingAttendeeId === attendeeId) resetAttendeeForm();
      await Promise.all([fetchAttendees(), fetchDashboardSummary()]);
      alert("Attendee deleted successfully");
    } catch (err) {
      console.error("handleDeleteAttendee:", err);
      alert(err?.response?.data?.message || "Failed to delete attendee");
    }
  };

  // ── Submit handlers ─────────────────────────────────────────────────────────
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.categoryName || !categoryForm.price || !categoryForm.coverPrice) {
      alert("Please fill all category fields"); return;
    }
    try {
      setCategoryLoading(true);
      await API.post("/categories", {
        categoryName: categoryForm.categoryName,
        price:        Number(categoryForm.price),
        coverPrice:   Number(categoryForm.coverPrice),
      });
      resetCategoryForm();
      await Promise.all([fetchCategories(), fetchDashboardSummary()]);
      alert("Category added successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add category");
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleFacilitySubmit = async (e) => {
    e.preventDefault();
    if (!facilityForm.facilityName) { alert("Please enter facility name"); return; }
    try {
      setFacilityLoading(true);
      await API.post("/facilities", {
        facilityName: facilityForm.facilityName,
        description:  facilityForm.description,
        status:       "Active",
      });
      resetFacilityForm();
      await fetchFacilities();
      alert("Facility added successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add facility");
    } finally {
      setFacilityLoading(false);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.username || !userForm.password) {
      alert("Please fill all required fields"); return;
    }
    try {
      setUserLoading(true);
      await API.post("/users", {
        name:     userForm.name,
        username: userForm.username,
        password: userForm.password,
        role:     userForm.role || "DataEntry",
        status:   "Active",
      });
      setUserForm({ name: "", username: "", password: "", role: "" });
      await fetchUsers();
      alert("User created successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create user");
    } finally {
      setUserLoading(false);
    }
  };

  const handleAttendeeSubmit = async (e) => {
    e.preventDefault();
    if (!attendeeForm.name || !attendeeForm.mobile || !attendeeForm.category) {
      alert("Name, mobile, and category are required"); return;
    }
    try {
      setAttendeeLoading(true);
      const payload = { ...attendeeForm, age: attendeeForm.age ? Number(attendeeForm.age) : "" };
      if (editingAttendeeId) {
        await API.put(`/attendees/${editingAttendeeId}`, payload);
        alert("Attendee updated successfully");
      } else {
        await API.post("/attendees", payload);
        alert("Attendee added successfully");
      }
      resetAttendeeForm();
      await Promise.all([fetchAttendees(), fetchDashboardSummary()]);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save attendee");
    } finally {
      setAttendeeLoading(false);
    }
  };

  const performCheckIn = useCallback(async (rawScanValue) => {
    const scanValue = String(rawScanValue || "").trim();
    if (!scanValue) { alert("Please scan or enter a ticket code"); return; }
    try {
      setCheckInLoading(true);
      setCheckInResult(null);
      const res = await API.post("/checkin", {
        scanValue,
        facility:    checkInForm.facility,
        notes:       "",
        checkedInBy: "operator",
      });
      setCheckInResult({ type: "success", message: res.data.message, attendee: res.data.attendee });
      setCheckInForm({ scanValue: "", facility: "" });
      await Promise.all([fetchAttendees(), fetchDashboardSummary()]);
    } catch (err) {
      setCheckInResult({
        type:     "error",
        message:  err?.response?.data?.message || "Check-in failed",
        attendee: err?.response?.data?.attendee || null,
      });
      setCheckInForm({ scanValue: "", facility: "" });
    } finally {
      setCheckInLoading(false);
      setTimeout(() => { if (scanInputRef.current) scanInputRef.current.focus(); }, 100);
    }
  }, [checkInForm.facility]);

  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    await performCheckIn(checkInForm.scanValue);
  };

  // Global QR / barcode scanner listener (hardware scanners send keydown events)
  useEffect(() => {
    if (!isAuthenticated || activeMenu !== "check-in") return;

    const handleGlobalScan = (event) => {
      if (event.ctrlKey || event.altKey || event.metaKey) return;

      const activeEl = document.activeElement;
      const isScanInputFocused =
        activeEl?.tagName === "INPUT" && activeEl?.getAttribute("name") === "scanValue";
      if (isScanInputFocused) return;

      if (event.key === "Enter") {
        const captured = scanBufferRef.current.trim();
        scanBufferRef.current = "";
        if (scanBufferTimeoutRef.current) {
          clearTimeout(scanBufferTimeoutRef.current);
          scanBufferTimeoutRef.current = null;
        }
        if (captured && !checkInLoading) {
          event.preventDefault();
          setCheckInForm(p => ({ ...p, scanValue: captured }));
          void performCheckIn(captured);
        }
        return;
      }

      if (event.key.length !== 1) return;
      scanBufferRef.current += event.key;
      if (scanBufferTimeoutRef.current) clearTimeout(scanBufferTimeoutRef.current);
      scanBufferTimeoutRef.current = setTimeout(() => {
        scanBufferRef.current = "";
        scanBufferTimeoutRef.current = null;
      }, 150);
    };

    window.addEventListener("keydown", handleGlobalScan);
    return () => {
      window.removeEventListener("keydown", handleGlobalScan);
      scanBufferRef.current = "";
      if (scanBufferTimeoutRef.current) {
        clearTimeout(scanBufferTimeoutRef.current);
        scanBufferTimeoutRef.current = null;
      }
    };
  }, [activeMenu, isAuthenticated, checkInLoading, performCheckIn]);

  // ── Misc handlers ───────────────────────────────────────────────────────────
  const handlePrintReport = () => window.print();

  const handleSendWhatsApp = (attendee) => {
    const link = generateWhatsAppLink(attendee);
    if (!link) { alert("Mobile number not found for this attendee"); return; }
    window.open(link, "_blank");
  };

  const handleResendWhatsApp = async (attendeeId) => {
    try {
      await API.post(`/attendees/${attendeeId}/resend-whatsapp`);
      alert("WhatsApp ticket resent successfully");
      await Promise.all([fetchAttendees(), fetchDashboardSummary()]);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to resend WhatsApp");
    }
  };

  // ── Auth handlers ───────────────────────────────────────────────────────────
  const handleLoginSuccess = (user, token) => {
    // ↓ Keep this log until role routing is confirmed working, then remove it
    console.log("[handleLoginSuccess] user object from API:", user);
    console.log("[handleLoginSuccess] role field value:", user?.role);

    setCurrentUser(user);
    setAuthToken(token);
    setIsAuthenticated(true);
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // refreshAllData is triggered by the isAuthenticated useEffect above
  };

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthToken(null);
    delete API.defaults.headers.common["Authorization"];
    setActiveMenu("dashboard");
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body, #root { height: 100%; margin: 0; padding: 0; }

        .app-shell {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: #f0f6fb;
        }

        .app-main {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
          overflow-x: hidden;
          background:
            radial-gradient(ellipse 800px 500px at 8% 0%, #c2e8e3 0%, transparent 55%),
            radial-gradient(ellipse 600px 500px at 92% 100%, #d4e8f8 0%, transparent 55%),
            #edf3fa;
        }

        .app-inner {
          max-width: 1380px;
          margin: 0 auto;
          padding: 28px 28px 48px;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .mobile-nav {
          position: sticky; top: 0; z-index: 20;
          border-radius: 14px;
          border: 1px solid rgba(210,224,239,0.8);
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(14px);
          padding: 12px 14px;
          display: none;
        }
        @media (max-width: 768px) { .mobile-nav { display: block; } }

        .mobile-nav-label {
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.18em;
          text-transform: uppercase; color: #94a3b8;
          font-family: 'DM Mono', monospace; margin-bottom: 8px;
        }
        .mobile-nav-pills { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px; }
        .mobile-nav-pills::-webkit-scrollbar { display: none; }

        .pill {
          white-space: nowrap; border: none; cursor: pointer;
          border-radius: 99px; padding: 6px 14px;
          font-size: 11.5px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.15s, color 0.15s;
        }
        .pill.active  { background: #1a8f84; color: #fff; }
        .pill.inactive { background: #f1f5f9; color: #475569; }
        .pill.inactive:hover { background: #e2e8f0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.3s ease both; }
      `}</style>

      {!isAuthenticated ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="app-shell">

          <Sidebar
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            currentUser={currentUser}
            allowedMenus={allowedMenus}
            onLogout={handleLogout}
          />

          <main className="app-main">
            <div className="app-inner">

              {/* Mobile pill navigation */}
              <div className="mobile-nav">
                <p className="mobile-nav-label">Navigate</p>
                <div className="mobile-nav-pills">
                  {menuItems.map((item) =>
                    allowedMenus.includes(item.id) ? (
                      <button
                        key={item.id}
                        type="button"
                        className={`pill ${activeMenu === item.id ? "active" : "inactive"}`}
                        onClick={() => setActiveMenu(item.id)}
                      >
                        {item.label}
                      </button>
                    ) : null
                  )}
                </div>
              </div>

              {/* ── Views ── */}
              <div className="fade-up" key={activeMenu}>

                {activeMenu === "dashboard" && (
                  <Dashboard
                    dashboardStats={dashboardStats}
                    onPrintReport={handlePrintReport}
                  />
                )}

                {activeMenu === "add-category" && (
                  <CategoryForm
                    categoryForm={categoryForm}
                    categories={categories}
                    categoryLoading={categoryLoading}
                    onFormChange={handleCategoryChange}
                    onSubmit={handleCategorySubmit}
                    onReset={resetCategoryForm}
                  />
                )}

                {activeMenu === "add-facility" && (
                  <FacilityForm
                    facilityForm={facilityForm}
                    facilities={facilities}
                    facilityLoading={facilityLoading}
                    onFormChange={handleFacilityChange}
                    onSubmit={handleFacilitySubmit}
                    onReset={resetFacilityForm}
                  />
                )}

                {activeMenu === "users" && (
                  <UserManagement
                    userForm={userForm}
                    userLoading={userLoading}
                    users={users}
                    onFormChange={handleUserChange}
                    onSubmit={handleUserSubmit}
                  />
                )}

                {activeMenu === "attendees" && (
                  <AttendeeForm
                    attendeeForm={attendeeForm}
                    attendeeLoading={attendeeLoading}
                    editingAttendeeId={editingAttendeeId}
                    categories={categories}
                    onFormChange={handleAttendeeChange}
                    onSubmit={handleAttendeeSubmit}
                    onCancelEdit={resetAttendeeForm}
                  />
                )}

                {activeMenu === "check-in" && (
                  <CheckInScanner
                    checkInForm={checkInForm}
                    checkInLoading={checkInLoading}
                    checkInResult={checkInResult}
                    scanInputRef={scanInputRef}
                    facilities={facilities}
                    onFormChange={handleCheckInChange}
                    onSubmit={handleCheckInSubmit}
                  />
                )}

                {activeMenu === "member-report" && (
                  <ReportView
                    type="member"
                    attendees={attendees}
                    facilities={facilities}
                    users={users}
                    onPrintReport={handlePrintReport}
                    onSendWhatsApp={handleSendWhatsApp}
                    onResendWhatsApp={handleResendWhatsApp}
                    onEditAttendee={handleEditAttendee}
                    onDeleteAttendee={handleDeleteAttendee}
                    onFetchAttendees={fetchAttendees}
                  />
                )}

                {activeMenu === "facility-report" && (
                  <ReportView
                    type="facility"
                    attendees={attendees}
                    facilities={facilities}
                    users={users}
                    onPrintReport={handlePrintReport}
                  />
                )}

                {activeMenu === "registration-report" && (
                  <ReportView
                    type="registration"
                    attendees={attendees}
                    facilities={facilities}
                    users={users}
                    onPrintReport={handlePrintReport}
                  />
                )}

              </div>
            </div>
          </main>

        </div>
      )}
    </>
  );
}

export default App;