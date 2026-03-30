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

const normalizeRole = (role) => {
  const value = String(role || "").toLowerCase().replace(/\s+/g, "");

  if (value === "admin") return "Admin";
  if (value === "dataentry") return "DataEntry";
  if (value === "scanner") return "Scanner";

  return "Scanner";
};

function App() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const [activeMenu, setActiveMenu] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "add-category", label: "Add Category" },
    { id: "add-facility", label: "Add Facility" },
    { id: "users", label: "Create Login" },
    { id: "attendees", label: "Member" },
    { id: "check-in", label: "Check-In" },
    { id: "member-report", label: "Member Report" },
    { id: "facility-report", label: "Facility Report" },
    { id: "registration-report", label: "Registration Report" },
  ];

  const currentRole = normalizeRole(currentUser?.role);
  const allowedMenus = ROLE_MENU_ACCESS[currentRole] || ROLE_MENU_ACCESS.Scanner;

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    categoryName: "",
    price: "",
    coverPrice: "",
  });

  // Facility Form State
  const [facilityForm, setFacilityForm] = useState({
    facilityName: "",
    description: "",
  });

  // User Form State
  const [userForm, setUserForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "",
  });

  // Attendee Form State
  const [attendeeForm, setAttendeeForm] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    age: "",
    category: "",
    sendWhatsApp: false,
  });

  // Check-In Form State
  const [checkInForm, setCheckInForm] = useState({
    scanValue: "",
    facility: "",
  });

  // Data Storage
  const [categories, setCategories] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [users, setUsers] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalAttendees: 0,
    checkedInCount: 0,
    pendingCount: 0,
    totalTicketAmount: 0,
    totalCoverAmount: 0,
    whatsappSentCount: 0,
    whatsappFailedCount: 0,
    duplicateScanCount: 0,
    categoryWiseCount: [],
  });

  // Loading States
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [facilityLoading, setFacilityLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [attendeeLoading, setAttendeeLoading] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkInResult, setCheckInResult] = useState(null);

  const [editingAttendeeId, setEditingAttendeeId] = useState(null);
  const scanInputRef = useRef(null);
  const scanBufferRef = useRef("");
  const scanBufferTimeoutRef = useRef(null);

  // ==================== FETCH DATA ====================

  // Check auth on app load
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");
    
    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthToken(savedToken);
        setCurrentUser(user);
        setIsAuthenticated(true);
        // Set default auth header for all API calls
        API.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      } catch (error) {
        console.error("Error parsing auth data:", error);
        localStorage.clear();
      }
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await API.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to load categories");
    }
  };

  const fetchFacilities = async () => {
    try {
      const response = await API.get("/facilities");
      setFacilities(response.data);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await API.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchAttendees = async (filter = "all") => {
    try {
      let url = "/reports/attendees";
      if (filter === "checked-in") {
        url += "?status=checked-in";
      } else if (filter === "pending") {
        url += "?status=pending";
      }
      const response = await API.get(url);
      setAttendees(response.data.attendees);
      if (response.data.summary) {
        setDashboardStats(response.data.summary);
      }
    } catch (error) {
      console.error("Error fetching attendees:", error);
      alert("Failed to load attendees");
    }
  };

  const fetchDashboardSummary = async () => {
    try {
      const response = await API.get("/dashboard/summary");
      setDashboardStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
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

  // Initial Load
  useEffect(() => {
    refreshAllData();
  }, []);

  useEffect(() => {
    if (scanInputRef.current) {
      scanInputRef.current.focus();
    }
  }, [activeMenu]);

  useEffect(() => {
    if (isAuthenticated && !allowedMenus.includes(activeMenu)) {
      setActiveMenu(allowedMenus[0] || "dashboard");
    }
  }, [isAuthenticated, activeMenu, allowedMenus]);

  // ==================== FORM HANDLERS ====================

  const handleCategoryChange = (e) => {
    setCategoryForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFacilityChange = (e) => {
    setFacilityForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetCategoryForm = () => {
    setCategoryForm({ categoryName: "", price: "", coverPrice: "" });
  };

  const resetFacilityForm = () => {
    setFacilityForm({ facilityName: "", description: "" });
  };

  const handleUserChange = (e) => {
    setUserForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAttendeeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAttendeeForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckInChange = (e) => {
    const { name, value } = e.target;
    setCheckInForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetAttendeeForm = () => {
    setAttendeeForm({
      name: "",
      email: "",
      mobile: "",
      gender: "",
      age: "",
      category: "",
      sendWhatsApp: false,
    });
    setEditingAttendeeId(null);
  };

  const handleEditAttendee = (attendee) => {
    setEditingAttendeeId(attendee._id);
    setAttendeeForm({
      name: attendee.name || "",
      email: attendee.email || "",
      mobile: attendee.mobile || "",
      gender: attendee.gender || "",
      age: attendee.age || "",
      category: attendee.category?._id || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteAttendee = async (attendeeId, attendeeName) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${attendeeName}?`
    );

    if (!isConfirmed) return;

    try {
      await API.delete(`/attendees/${attendeeId}`);

      if (editingAttendeeId === attendeeId) {
        resetAttendeeForm();
      }

      await Promise.all([fetchAttendees(), fetchDashboardSummary()]);
      alert("Attendee deleted successfully");
    } catch (error) {
      console.error("Error deleting attendee:", error);
      alert(error?.response?.data?.message || "Failed to delete attendee");
    }
  };

  // ==================== SUBMIT HANDLERS ====================

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.categoryName || !categoryForm.price || !categoryForm.coverPrice) {
      alert("Please fill all category fields");
      return;
    }
    try {
      setCategoryLoading(true);
      await API.post("/categories", {
        categoryName: categoryForm.categoryName,
        price: Number(categoryForm.price),
        coverPrice: Number(categoryForm.coverPrice),
      });
      resetCategoryForm();
      await Promise.all([fetchCategories(), fetchDashboardSummary()]);
      alert("Category added successfully");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to add category");
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleFacilitySubmit = async (e) => {
    e.preventDefault();
    if (!facilityForm.facilityName) {
      alert("Please enter facility name");
      return;
    }
    try {
      setFacilityLoading(true);
      await API.post("/facilities", {
        facilityName: facilityForm.facilityName,
        description: facilityForm.description,
        status: "Active",
      });
      resetFacilityForm();
      await fetchFacilities();
      alert("Facility added successfully");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to add facility");
    } finally {
      setFacilityLoading(false);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.username || !userForm.password) {
      alert("Please fill all required fields");
      return;
    }
    try {
      setUserLoading(true);
      await API.post("/users", {
        name: userForm.name,
        username: userForm.username,
        password: userForm.password,
        role: userForm.role || "DataEntry",
        status: "Active",
      });
      setUserForm({ name: "", username: "", password: "", role: "" });
      await fetchUsers();
      alert("User created successfully");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to create user");
    } finally {
      setUserLoading(false);
    }
  };

  const handleAttendeeSubmit = async (e) => {
    e.preventDefault();
    if (!attendeeForm.name || !attendeeForm.mobile || !attendeeForm.category) {
      alert("Name, mobile, and category are required");
      return;
    }
    try {
      setAttendeeLoading(true);
      const payload = {
        ...attendeeForm,
        age: attendeeForm.age ? Number(attendeeForm.age) : "",
      };
      if (editingAttendeeId) {
        await API.put(`/attendees/${editingAttendeeId}`, payload);
        alert("Attendee updated successfully");
      } else {
        await API.post("/attendees", payload);
        alert("Attendee added successfully");
      }
      resetAttendeeForm();
      await Promise.all([fetchAttendees(), fetchDashboardSummary()]);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to save attendee");
    } finally {
      setAttendeeLoading(false);
    }
  };

  const performCheckIn = useCallback(async (rawScanValue) => {
    const scanValue = String(rawScanValue || "").trim();

    if (!scanValue) {
      alert("Please scan or enter a ticket code");
      return;
    }

    try {
      setCheckInLoading(true);
      setCheckInResult(null);
      const response = await API.post("/checkin", {
        scanValue,
        facility: checkInForm.facility,
        notes: "",
        checkedInBy: "operator",
      });
      setCheckInResult({
        type: "success",
        message: response.data.message,
        attendee: response.data.attendee,
      });
      setCheckInForm({ scanValue: "", facility: "" });
      await Promise.all([fetchAttendees(), fetchDashboardSummary()]);
    } catch (error) {
      setCheckInResult({
        type: "error",
        message: error?.response?.data?.message || "Check-in failed",
        attendee: error?.response?.data?.attendee || null,
      });
      setCheckInForm({ scanValue: "", facility: "" });
    } finally {
      setCheckInLoading(false);
      setTimeout(() => {
        if (scanInputRef.current) {
          scanInputRef.current.focus();
        }
      }, 100);
    }
  }, [checkInForm.facility]);

  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    await performCheckIn(checkInForm.scanValue);
  };

  useEffect(() => {
    if (!isAuthenticated || activeMenu !== "check-in") {
      return;
    }

    const handleGlobalScan = (event) => {
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      const activeElement = document.activeElement;
      const isScanInputFocused =
        activeElement?.tagName === "INPUT" &&
        activeElement?.getAttribute("name") === "scanValue";

      // Let the form handle Enter when scanner input already has focus.
      if (isScanInputFocused) {
        return;
      }

      if (event.key === "Enter") {
        const capturedValue = scanBufferRef.current.trim();
        scanBufferRef.current = "";

        if (scanBufferTimeoutRef.current) {
          clearTimeout(scanBufferTimeoutRef.current);
          scanBufferTimeoutRef.current = null;
        }

        if (capturedValue && !checkInLoading) {
          event.preventDefault();
          setCheckInForm((prev) => ({ ...prev, scanValue: capturedValue }));
          void performCheckIn(capturedValue);
        }

        return;
      }

      if (event.key.length !== 1) {
        return;
      }

      scanBufferRef.current += event.key;

      if (scanBufferTimeoutRef.current) {
        clearTimeout(scanBufferTimeoutRef.current);
      }

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

  const handlePrintReport = () => {
    window.print();
  };

  const handleSendWhatsApp = (attendee) => {
    const link = generateWhatsAppLink(attendee);

    if (!link) {
      alert("Mobile number not found for this attendee");
      return;
    }

    window.open(link, "_blank");
  };

  const handleResendWhatsApp = async (attendeeId) => {
    try {
      await API.post(`/attendees/${attendeeId}/resend-whatsapp`);
      alert("WhatsApp ticket resent successfully");
      await Promise.all([fetchAttendees(), fetchDashboardSummary()]);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to resend WhatsApp");
    }
  };

  // ==================== AUTH HANDLERS ====================

  const handleLoginSuccess = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    setIsAuthenticated(true);
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // Refresh data after login
    refreshAllData();
  };

  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to logout?");
    if (!isConfirmed) return;

    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthToken(null);
    delete API.defaults.headers.common["Authorization"];
    setActiveMenu("dashboard");
  };

  return (
    <>
      {!isAuthenticated ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="min-h-screen bg-transparent">
          <div className="flex min-h-screen">
            <Sidebar 
              activeMenu={activeMenu} 
              setActiveMenu={setActiveMenu}
              currentUser={currentUser}
              allowedMenus={allowedMenus}
              onLogout={handleLogout}
            />
            
            <main className="flex-1 p-4 md:p-8 lg:p-10">
              <div className="mx-auto w-full max-w-7xl space-y-6 fade-up">
              <div className="sticky top-0 z-20 -mx-1 rounded-xl border border-[#d2e0ef] bg-white/85 p-3 backdrop-blur md:hidden">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Navigate</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {menuItems.map((item) => (
                    allowedMenus.includes(item.id) && (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveMenu(item.id)}
                        className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
                          activeMenu === item.id
                            ? "bg-teal-600 text-white shadow"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.label}
                      </button>
                    )
                  ))}
                </div>
              </div>

              {/* DASHBOARD VIEW */}
              {activeMenu === "dashboard" && (
                <Dashboard 
                  dashboardStats={dashboardStats} 
                  onPrintReport={handlePrintReport} 
                />
              )}

              {/* ADD CATEGORY VIEW */}
              {activeMenu === "add-category" && (
                <div className="space-y-8">
                  <div className="rounded-2xl border border-[#d3e2ef] bg-white/85 px-6 py-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Operations</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">Add Category</h1>
                    <p className="mt-1 text-xs text-slate-500">Home / Master / Add Category</p>
                    <p className="mt-2 text-sm text-slate-600">Create and manage ticket categories.</p>
                  </div>
                  <CategoryForm
                    categoryForm={categoryForm}
                    categories={categories}
                    categoryLoading={categoryLoading}
                    onFormChange={handleCategoryChange}
                    onSubmit={handleCategorySubmit}
                    onReset={resetCategoryForm}
                  />
                </div>
              )}

              {/* ADD FACILITY VIEW */}
              {activeMenu === "add-facility" && (
                <div className="space-y-8">
                  <div className="rounded-2xl border border-[#d3e2ef] bg-white/85 px-6 py-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Operations</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">Add Facility</h1>
                    <p className="mt-1 text-xs text-slate-500">Home / Master / Add Facility</p>
                    <p className="mt-2 text-sm text-slate-600">Create and manage event facilities.</p>
                  </div>
                  <FacilityForm
                    facilityForm={facilityForm}
                    facilities={facilities}
                    facilityLoading={facilityLoading}
                    onFormChange={handleFacilityChange}
                    onSubmit={handleFacilitySubmit}
                    onReset={resetFacilityForm}
                  />
                </div>
              )}

              {/* USERS VIEW */}
              {activeMenu === "users" && (
                <div className="space-y-8">
                  <div className="rounded-2xl border border-[#d3e2ef] bg-white/85 px-6 py-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Access</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">User Management</h1>
                    <p className="mt-2 text-sm text-slate-600">Create and manage user accounts for event operations.</p>
                  </div>
                  <UserManagement
                    userForm={userForm}
                    userLoading={userLoading}
                    users={users}
                    onFormChange={handleUserChange}
                    onSubmit={handleUserSubmit}
                  />
                </div>
              )}

              {/* ATTENDEES VIEW */}
              {activeMenu === "attendees" && (
                <div className="space-y-8">
                  <div className="rounded-2xl border border-[#d3e2ef] bg-white/85 px-6 py-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Member</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">Add Member</h1>
                    <p className="mt-1 text-xs text-slate-500">Home / Member / Add Member</p>
                    <p className="mt-2 text-sm text-slate-600">Register a new member quickly with all required ticket details.</p>
                  </div>
                  <AttendeeForm
                    attendeeForm={attendeeForm}
                    attendeeLoading={attendeeLoading}
                    editingAttendeeId={editingAttendeeId}
                    categories={categories}
                    onFormChange={handleAttendeeChange}
                    onSubmit={handleAttendeeSubmit}
                    onCancelEdit={resetAttendeeForm}
                  />
                </div>
              )}

              {/* CHECK-IN VIEW */}
              {activeMenu === "check-in" && (
                <div className="space-y-8">
                  <div className="rounded-2xl border border-[#d3e2ef] bg-white/85 px-6 py-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Entry</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">Event Check-In</h1>
                    <p className="mt-2 text-sm text-slate-600">Scan QR codes and track attendee entries in real time.</p>
                  </div>
                  <CheckInScanner
                    checkInForm={checkInForm}
                    checkInLoading={checkInLoading}
                    checkInResult={checkInResult}
                    scanInputRef={scanInputRef}
                    facilities={facilities}
                    onFormChange={handleCheckInChange}
                    onSubmit={handleCheckInSubmit}
                  />
                </div>
              )}

              {/* MEMBER REPORT VIEW */}
              {activeMenu === "member-report" && (
                <div className="space-y-8">
                  <div className="rounded-2xl border border-[#d3e2ef] bg-white/85 px-6 py-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Insights</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">Member Report</h1>
                    <p className="mt-1 text-xs text-slate-500">Home / Report / Member Report</p>
                    <p className="mt-2 text-sm text-slate-600">Member wise listing and summary report.</p>
                  </div>
                  <ReportView
                    type="member"
                    attendees={attendees}
                    facilities={facilities}
                    users={users}
                    onPrintReport={handlePrintReport}
                  />
                </div>
              )}

              {/* FACILITY REPORT VIEW */}
              {activeMenu === "facility-report" && (
                <div className="space-y-8">
                  <div className="rounded-2xl border border-[#d3e2ef] bg-white/85 px-6 py-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Insights</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">Facility Report</h1>
                    <p className="mt-1 text-xs text-slate-500">Home / Report / Facility Report</p>
                    <p className="mt-2 text-sm text-slate-600">Facility collection and entry report.</p>
                  </div>
                  <ReportView
                    type="facility"
                    attendees={attendees}
                    facilities={facilities}
                    users={users}
                    onPrintReport={handlePrintReport}
                  />
                </div>
              )}

              {/* REGISTRATION REPORT VIEW */}
              {activeMenu === "registration-report" && (
                <div className="space-y-8">
                  <div className="rounded-2xl border border-[#d3e2ef] bg-white/85 px-6 py-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Insights</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">Registration Report</h1>
                    <p className="mt-1 text-xs text-slate-500">Home / Report / Registration Report</p>
                    <p className="mt-2 text-sm text-slate-600">Registration details with ticket and cover amounts.</p>
                  </div>
                  <ReportView
                    type="registration"
                    attendees={attendees}
                    facilities={facilities}
                    users={users}
                    onPrintReport={handlePrintReport}
                  />
                </div>
              )}
              </div>
          </main>
        </div>
      </div>
      )}
    </>
  );
}

export default App;