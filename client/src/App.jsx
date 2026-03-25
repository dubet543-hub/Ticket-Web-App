import { useEffect, useRef, useState } from "react";
import API from "./api";
import { generateWhatsAppLink } from "./utils/ticketMessage";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CategoryForm from "./components/CategoryForm";
import FacilityForm from "./components/FacilityForm";
import AttendeeForm from "./components/AttendeeForm";
import UserManagement from "./components/UserManagement";
import CheckInScanner from "./components/CheckInScanner";
import AttendeeReport from "./components/AttendeeReport";
import MemberList from "./components/MemberList";
import Login from "./components/Login";

function App() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const [activeMenu, setActiveMenu] = useState("dashboard");

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
      setCategoryForm({ categoryName: "", price: "", coverPrice: "" });
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
      setFacilityForm({ facilityName: "", description: "" });
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

  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    if (!checkInForm.scanValue.trim()) {
      alert("Please scan or enter a ticket code");
      return;
    }
    try {
      setCheckInLoading(true);
      setCheckInResult(null);
      const response = await API.post("/checkin", {
        scanValue: checkInForm.scanValue.trim(),
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
  };

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
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
          <div className="flex min-h-screen">
            <Sidebar 
              activeMenu={activeMenu} 
              setActiveMenu={setActiveMenu}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
            
            <main className="flex-1 p-6 md:p-12">
              {/* DASHBOARD VIEW */}
              {activeMenu === "dashboard" && (
                <Dashboard 
                  dashboardStats={dashboardStats} 
                  onPrintReport={handlePrintReport} 
                />
              )}

              {/* MASTER VIEW - Categories & Facilities */}
              {activeMenu === "master" && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Master Data</h1>
                    <p className="mt-2 text-slate-600 text-sm">Manage ticket categories and event facilities</p>
                  </div>
                  <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                    <CategoryForm
                      categoryForm={categoryForm}
                      categoryLoading={categoryLoading}
                      onFormChange={handleCategoryChange}
                      onSubmit={handleCategorySubmit}
                    />
                    <FacilityForm
                      facilityForm={facilityForm}
                      facilityLoading={facilityLoading}
                      onFormChange={handleFacilityChange}
                      onSubmit={handleFacilitySubmit}
                    />
                  </div>
                </div>
              )}

              {/* USERS VIEW */}
              {activeMenu === "users" && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">User Management</h1>
                    <p className="mt-2 text-slate-600 text-sm">Create and manage user accounts for event operations</p>
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
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Event Attendees</h1>
                    <p className="mt-2 text-slate-600 text-sm">Register attendees and manage tickets with WhatsApp delivery</p>
                  </div>
                  <div className="grid grid-cols-1 gap-8 xl:grid-cols-2 print:hidden">
                    <AttendeeForm
                      attendeeForm={attendeeForm}
                      attendeeLoading={attendeeLoading}
                      editingAttendeeId={editingAttendeeId}
                      categories={categories}
                      onFormChange={handleAttendeeChange}
                      onSubmit={handleAttendeeSubmit}
                      onCancelEdit={resetAttendeeForm}
                    />
                    <MemberList
                      members={attendees}
                      onEdit={handleEditAttendee}
                      onDelete={handleDeleteAttendee}
                      onResendWhatsApp={handleResendWhatsApp}
                    />
                  </div>
                </div>
              )}

              {/* CHECK-IN VIEW */}
              {activeMenu === "check-in" && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">Event Check-In</h1>
                    <p className="mt-2 text-slate-600 text-sm">Scan QR codes and track attendee entries in real-time</p>
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

              {/* REPORTS VIEW */}
              {activeMenu === "reports" && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">Entry Report</h1>
                    <p className="mt-2 text-slate-600 text-sm">View detailed analytics and generate reports for your event</p>
                  </div>
                  <AttendeeReport
                    attendees={attendees}
                    dashboardStats={dashboardStats}
                    onPrintReport={handlePrintReport}
                    onEditAttendee={handleEditAttendee}
                    onDeleteAttendee={handleDeleteAttendee}
                    onSendWhatsApp={handleSendWhatsApp}
                  />
                </div>
              )}
          </main>
        </div>
      </div>
      )}
    </>
  );
}

export default App;