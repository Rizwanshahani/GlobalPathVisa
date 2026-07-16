import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Download, Search, RefreshCw, Edit, Shield, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    // Protect Route
    useEffect(() => {
        if (!user || user.role !== "admin") {
            toast.error("Access denied: admins only");
            navigate("/");
        }
    }, [user, navigate]);

    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // Edit Modal States
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        status: "",
        appointmentDate: "",
        appointmentTime: "",
        timelineNotes: ""
    });
    const [saving, setSaving] = useState(false);

    const fetchInquiries = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:8000/api/v1/inquiry/all", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (res.data.success) {
                setInquiries(res.data.inquiries);
            }
        } catch (err) {
            toast.error("Failed to load inquiries");
            console.error("Fetch inquiries error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === "admin") {
            const timer = setTimeout(() => {
                fetchInquiries();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [user]);

    // Export Today's Inquiries as CSV
    const handleExportDaily = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;
        try {
            const res = await axios.get("http://localhost:8000/api/v1/inquiry/export", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                responseType: "blob"
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `daily_inquiries_${new Date().toISOString().split("T")[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success("Daily inquiries exported successfully!");
        } catch (err) {
            toast.error("Failed to export daily inquiries");
            console.error("Export error:", err);
        }
    };

    // Export All Inquiries as CSV
    const handleExportAll = () => {
        if (inquiries.length === 0) {
            toast.error("No inquiries available to export");
            return;
        }

        let csvContent = "\uFEFF"; // BOM for Excel UTF-8
        csvContent += "Tracking ID,Full Name,Email,Phone,Destination,Visa Type,Travel Date,Appointment Date,Appointment Time,Status,Created At\n";

        inquiries.forEach(inq => {
            const row = [
                inq.trackingId,
                inq.fullName,
                inq.email,
                inq.phone,
                inq.destination,
                inq.visaType,
                inq.travelDate || "",
                inq.appointmentDate || "",
                inq.appointmentTime || "",
                inq.status,
                inq.createdAt ? new Date(inq.createdAt).toLocaleString() : ""
            ].map(val => `"${String(val).replace(/"/g, '""')}"`);

            csvContent += row.join(",") + "\n";
        });

        const url = window.URL.createObjectURL(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `all_inquiries_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        toast.success("All inquiries exported successfully!");
    };

    // Open Edit Modal
    const handleEditClick = (inq) => {
        setSelectedInquiry(inq);
        setEditForm({
            status: inq.status,
            appointmentDate: inq.appointmentDate === "Pending Scheduling" ? "" : inq.appointmentDate,
            appointmentTime: inq.appointmentTime || "",
            timelineNotes: ""
        });
        setShowEditModal(true);
    };

    // Submit Edit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken || !selectedInquiry) return;

        setSaving(true);
        try {
            // Build new timeline based on status change or notes
            let newTimeline = [...selectedInquiry.timeline];
            
            // If the status has changed, let's mark timeline items as completed
            const statuses = ["Submitted", "Document Audit", "Appointment Booking", "Embassy Submission", "Passport Dispatched"];
            const targetIdx = statuses.indexOf(editForm.status);
            
            newTimeline = newTimeline.map((item) => {
                const currentStatusIdx = statuses.indexOf(item.status);
                
                // If it is the status being set, update description/date if provided
                if (item.status === editForm.status) {
                    return {
                        ...item,
                        completed: true,
                        date: new Date().toLocaleDateString(),
                        description: editForm.timelineNotes || item.description
                    };
                }
                
                // If it's prior to the target status, make sure it is marked completed
                if (currentStatusIdx < targetIdx) {
                    return {
                        ...item,
                        completed: true,
                        date: item.date === "Pending" ? new Date().toLocaleDateString() : item.date
                    };
                }
                
                // If it's subsequent to target status, reset to pending
                return {
                    ...item,
                    completed: false,
                    date: "Pending"
                };
            });

            const updatePayload = {
                status: editForm.status,
                appointmentDate: editForm.appointmentDate || "Pending Scheduling",
                appointmentTime: editForm.appointmentTime,
                timeline: newTimeline
            };

            const res = await axios.put(
                `http://localhost:8000/api/v1/inquiry/update/${selectedInquiry._id}`,
                updatePayload,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (res.data.success) {
                toast.success("Inquiry updated successfully!");
                fetchInquiries();
                setShowEditModal(false);
            }
        } catch (err) {
            toast.error("Failed to update inquiry");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    // Filter inquiries
    const filteredInquiries = inquiries.filter(inq => {
        const matchesSearch = 
            inq.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.destination.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "All" || inq.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Count statistics
    const stats = {
        total: inquiries.length,
        submitted: inquiries.filter(i => i.status === "Submitted").length,
        audit: inquiries.filter(i => i.status === "Document Audit").length,
        booking: inquiries.filter(i => i.status === "Appointment Booking").length,
        submission: inquiries.filter(i => i.status === "Embassy Submission").length,
        completed: inquiries.filter(i => i.status === "Passport Dispatched").length
    };

    return (
        <div className="bg-slate-50 min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 text-left">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl shadow-md border border-slate-100">
                    <div className="space-y-1">
                        <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Admin Portal</span>
                        <h1 className="text-3xl font-black text-slate-900">Visa Inquiry Management</h1>
                        <p className="text-slate-500 text-xs sm:text-sm">Manage applicant travel files, update biometrics schedules, and export daily statistics.</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        <Button 
                            variant="outline" 
                            onClick={fetchInquiries} 
                            className="flex items-center gap-1.5 h-10 px-4 rounded-xl text-xs font-bold border-slate-200"
                        >
                            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                            Reload
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={handleExportDaily} 
                            className="flex items-center gap-1.5 h-10 px-4 rounded-xl text-xs font-bold text-indigo-600 border-indigo-200 hover:bg-indigo-50/50"
                        >
                            <Download size={14} />
                            Export Today (Excel/CSV)
                        </Button>
                        <Button 
                            onClick={handleExportAll} 
                            className="flex items-center gap-1.5 h-10 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10"
                        >
                            <Download size={14} />
                            Export All
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { title: "Total Files", val: stats.total, color: "text-slate-900", bg: "bg-slate-100" },
                        { title: "Submitted", val: stats.submitted, color: "text-indigo-600", bg: "bg-indigo-50" },
                        { title: "Document Audit", val: stats.audit, color: "text-amber-600", bg: "bg-amber-50" },
                        { title: "Biometrics Slot", val: stats.booking, color: "text-blue-600", bg: "bg-blue-50" },
                        { title: "Submitted Embassy", val: stats.submission, color: "text-rose-600", bg: "bg-rose-50" },
                        { title: "Passport Ready", val: stats.completed, color: "text-emerald-600", bg: "bg-emerald-50" }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{stat.title}</span>
                            <span className={`text-2xl font-black ${stat.color} block`}>{stat.val}</span>
                        </div>
                    ))}
                </div>

                {/* List Filters & Table dashboard */}
                <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden">
                    
                    {/* Filters bar */}
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative max-w-md w-full">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <Input
                                type="text"
                                placeholder="Search by name, email, phone, or tracking ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 h-10 text-xs rounded-xl border-slate-200 outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Filter Status:</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-10 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Submitted">Submitted</option>
                                <option value="Document Audit">Document Audit</option>
                                <option value="Appointment Booking">Appointment Booking</option>
                                <option value="Embassy Submission">Embassy Submission</option>
                                <option value="Passport Dispatched">Passport Dispatched</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="py-20 text-center space-y-3">
                            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                            <p className="text-xs text-slate-400">Loading inquiries from database...</p>
                        </div>
                    ) : filteredInquiries.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                        <th className="px-6 py-4">Tracking ID</th>
                                        <th className="px-6 py-4">Applicant</th>
                                        <th className="px-6 py-4">Visa Details</th>
                                        <th className="px-6 py-4">Consultation Details</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs text-slate-650">
                                    {filteredInquiries.map((inq) => (
                                        <tr key={inq._id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-mono font-bold text-slate-900 block">{inq.trackingId}</span>
                                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                                    {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : ""}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 space-y-1">
                                                <span className="font-bold text-slate-800 block">{inq.fullName}</span>
                                                <span className="text-slate-400 block text-[10px]">{inq.email}</span>
                                                <span className="text-slate-500 block text-[10px]">{inq.phone}</span>
                                            </td>
                                            <td className="px-6 py-4 space-y-1">
                                                <span className="font-semibold text-indigo-600 block">{inq.destination}</span>
                                                <span className="text-slate-500 block text-[10px] uppercase">{inq.visaType}</span>
                                                {inq.travelDate && (
                                                    <span className="text-slate-400 text-[9px] block">Travel: {new Date(inq.travelDate).toLocaleDateString()}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {inq.appointmentDate !== "Pending Scheduling" ? (
                                                    <div className="space-y-0.5">
                                                        <span className="text-indigo-600 font-bold block">{new Date(inq.appointmentDate).toLocaleDateString()}</span>
                                                        <span className="text-slate-500 font-semibold block text-[10px]">{inq.appointmentTime}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 italic">Unscheduled</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                    inq.status === "Submitted" ? "bg-indigo-50 text-indigo-600" :
                                                    inq.status === "Document Audit" ? "bg-amber-100/70 text-amber-700" :
                                                    inq.status === "Appointment Booking" ? "bg-blue-50 text-blue-600" :
                                                    inq.status === "Embassy Submission" ? "bg-rose-50 text-rose-600" :
                                                    "bg-emerald-50 text-emerald-600"
                                                }`}>
                                                    {inq.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Button 
                                                    variant="ghost" 
                                                    onClick={() => handleEditClick(inq)} 
                                                    className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-indigo-600"
                                                >
                                                    <Edit size={14} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-20 text-center space-y-3">
                            <Shield className="w-12 h-12 text-slate-300 mx-auto" />
                            <p className="text-slate-500 font-semibold">No inquiries match your filter criteria.</p>
                            <button 
                                onClick={() => { setSearchTerm(""); setStatusFilter("All"); }}
                                className="text-xs font-bold text-indigo-600 hover:underline"
                            >
                                Reset filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* EDIT INQUIRY MODAL */}
            {showEditModal && selectedInquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Header */}
                        <div className="bg-slate-900 text-white p-6 relative">
                            <button 
                                onClick={() => setShowEditModal(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                            <span className="text-[10px] font-mono tracking-wider uppercase text-indigo-400">File Update</span>
                            <h3 className="text-lg font-bold mt-1">Inquiry: {selectedInquiry.trackingId}</h3>
                            <p className="text-xs text-slate-400 mt-1">Update biometrics appointment slot or progress status for {selectedInquiry.fullName}.</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div>
                                <Label className="block text-xs font-bold text-slate-500 uppercase mb-1">Application Status</Label>
                                <select
                                    value={editForm.status}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                                >
                                    <option value="Submitted">Submitted (Initial Stage)</option>
                                    <option value="Document Audit">Document Audit (Specialist Review)</option>
                                    <option value="Appointment Booking">Appointment Booking (Secured slot)</option>
                                    <option value="Embassy Submission">Embassy Submission (Filing completed)</option>
                                    <option value="Passport Dispatched">Passport Dispatched (Decision Ready)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="block text-xs font-bold text-slate-500 uppercase mb-1">Appointment Date</Label>
                                    <Input
                                        type="date"
                                        value={editForm.appointmentDate}
                                        onChange={(e) => setEditForm({ ...editForm, appointmentDate: e.target.value })}
                                        className="w-full text-xs rounded-xl h-10 border-slate-200"
                                    />
                                </div>
                                <div>
                                    <Label className="block text-xs font-bold text-slate-500 uppercase mb-1">Appointment Time</Label>
                                    <Input
                                        type="text"
                                        placeholder="e.g. 10:30 AM"
                                        value={editForm.appointmentTime}
                                        onChange={(e) => setEditForm({ ...editForm, appointmentTime: e.target.value })}
                                        className="w-full text-xs rounded-xl h-10 border-slate-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="block text-xs font-bold text-slate-500 uppercase mb-1">Timeline Update Notes</Label>
                                <textarea
                                    rows={3}
                                    placeholder="Enter descriptive notes to display on the client's tracking timeline (e.g. 'Biometrics appointment successfully secured at VFS London...')"
                                    value={editForm.timelineNotes}
                                    onChange={(e) => setEditForm({ ...editForm, timelineNotes: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                                />
                            </div>

                            <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setShowEditModal(false)}
                                    className="h-10 px-5 rounded-xl text-xs font-bold border-slate-200"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={saving}
                                    className="h-10 px-5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10"
                                >
                                    {saving ? "Saving Updates..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
