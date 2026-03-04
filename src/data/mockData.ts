// Import DB content
import db from '../../db.json';

// --- DATA MAPPING ---

// Map DB Projects to App Project Type
export const projects: Project[] = (db.projects || []).map((p: any) => ({
  ...p,
  progress: p.progress || 0,
  totalFunding: Number(p.totalFunding) || 0,
  firstPaymentAmount: Number(p.firstPaymentAmount) || 0,
  finalPaymentAmount: Number(p.finalPaymentAmount) || 0,
  activities: p.activities || []
}));

// Map DB Students to App Student Type
export const initialStudents: Student[] = (db.students || []).map((s: any) => ({
  ...s,
  totalFee: Number(s.totalFee) || 0,
  firstPaymentAmount: Number(s.firstPaymentAmount) || 0,
  finalPaymentAmount: Number(s.finalPaymentAmount) || 0
}));

// Map DB Client Profiles
export const initialClientProfiles: ClientProfile[] = (db.clientProfiles || []).map((c: any) => ({
  ...c,
  status: c.status as 'Active' | 'Inactive'
}));

// Map DB Users
export const mockUsers: User[] = (db.users || []).map((u: any) => ({
  id: u.id,
  name: u.name,
  role: u.role || 'User', // Default role if missing
  avatar: u.avatar
}));

// Map DB Payments
export const initialPayments: Payment[] = (db.payments || []).map((p: any) => ({
  ...p,
  amount: Number(p.amount) || 0
}));

// Map DB Servers
export const initialServers: any[] = (db.servers || []).map((s: any) => ({
  id: s.id,
  name: s.name,
  specs: s.specs || '',
  status: s.status || 'Inactive'
}));

export const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", 
  "Japan", "China", "Singapore", "South Korea", "Russia", "Brazil", "Italy", "Spain", 
  "Netherlands", "Switzerland", "Sweden", "Belgium", "Austria", "Norway", "Denmark", 
  "Finland", "Ireland", "New Zealand", "United Arab Emirates", "Saudi Arabia", "South Africa", 
  "Malaysia", "Thailand", "Indonesia", "Vietnam", "Philippines", "Mexico", "Argentina", 
  "Chile", "Colombia", "Egypt", "Nigeria", "Kenya", "Global"
].sort();

export const institutionCountries: Record<string, string> = {
  'VIT Vellore': 'India',
  'Vellore Institute of Technology': 'India',
  'Bionome': 'India',
  'KLE Tech': 'India',
  'IIT Madras': 'India',
  'PES University': 'India',
  'Jain University': 'India',
  'Sri Ramachandra Institute': 'India',
  'Smt Gandhimathi College of Pharmacy': 'India',
  'Manipal University': 'India',
  'Amrita Vishwa Vidyapeetham': 'India',
  'SRM Institute': 'India',
  'Anna University': 'India',
  'MS Ramaiah': 'India',
  'REVA University': 'India',
  'Nehru Arts and Science College': 'India',
  'Siddaganga Institute of Technology': 'India',
  'JSS College of Arts, Commerce and Science, Mysore': 'India',
  'School of Life Science - Ooty Campus': 'India',
  'V. V. Vanniyaperumal college for women': 'India',
  'K.S. Rangasamy College of Arts and Science': 'India',
  'Bioneeds': 'India',
  'Tamil Nadu Agricultural University': 'India',
  'P. Rami Reddy Memorial College of Pharmacy': 'India',
  'KLE Technological University': 'India',
  'Kumaraguru College of Technology': 'India',
  'PSGR Krishnammal College for Women': 'India',
  'Dr.N.G.P. Arts and Science College': 'India',
  'Acharya Institute of Technology': 'India',
  'University of Horticultural Sciences': 'India',
  'Maharani Lakshmi Ammanni College for Women': 'India',
  'Ramaiah Institute of Technology': 'India',
  'University of Tokyo': 'Japan',
  'Kyoto University': 'Japan',
  'Osaka University': 'Japan',
  'Hokkaido University': 'Japan',
  'Harvard University': 'United States',
  'Stanford University': 'United States',
  'MIT': 'United States',
  'Other': 'Global'
};

// Extract Institutions from Projects & Client Profiles for the dropdown list
// Also include the ones explicitly in db.institutions if that exists
const dbInstitutions = (db.institutions || []).map((i: any) => ({ name: i.name, country: i.country || 'India', id: i.id }));
const projectInstitutions = projects.map(p => p.institution).filter(Boolean);
const clientInstitutions = initialClientProfiles.map(c => c.university).filter(Boolean);
const studentInstitutions = initialStudents.map(s => s.university).filter(Boolean);

const uniqueInstitutionNames = Array.from(new Set([
  ...dbInstitutions.map((i: any) => i.name),
  ...projectInstitutions,
  ...clientInstitutions,
  ...studentInstitutions,
  // Keep some defaults if DB is empty
  'VIT Vellore', 'Bionome', 'KLE Tech', 'IIT Madras' 
])).sort();

export const initialInstitutions: Institution[] = uniqueInstitutionNames.map(name => {
  // Try to find existing object from DB or use default mapping
  const existing = dbInstitutions.find((i: any) => i.name === name);
  return {
    id: existing?.id || name.replace(/\s+/g, '-').toLowerCase(),
    name: name,
    country: existing?.country || institutionCountries[name] || 'India'
  };
});

// Project Types
const dbProjectTypes = (db.projectTypes || []).map((t: any) => t.name);
const usedProjectTypes = projects.map(p => p.projectType).filter(Boolean);

export const initialProjectTypes: string[] = Array.from(new Set([
  ...dbProjectTypes,
  ...usedProjectTypes,
  'Molecular Dynamics', 'Molecular Docking'
])).sort();


// --- CONSTANTS & OPTIONS ---

export interface Institution {
  id: string;
  name: string;
  country: string;
}

export type Status = 'Ongoing' | 'Completed' | 'Planned' | 'Stopped';
export type Office = 'Ooty' | 'Coimbatore';

export interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface ProjectActivity {
  id: string;
  name: string;
  assignedTo: string;
  server: string;
  duration: string;
  progress: number;
  startDate: string;
  endDate: string;
  totalAtoms: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Failed';
  simulationEngine?: 'GROMACS' | 'NAMD' | 'AutoDock' | 'Desmond' | 'Other' | 'HADDOCK' | 'ZDOCK' | 'Silico Dock' | 'Denovo' | 'WGS' | 'QTL' | 'GWAS';
  totalParticipants?: number;
  mode?: 'Online' | 'Offline';
}

export interface ScientificDetails {
  targetProtein?: string;
  ligandCount?: number;
  simulationEngine?: 'GROMACS' | 'NAMD' | 'AutoDock' | 'Desmond' | 'Other';
  atomsCount?: number;
  simulationTimeNs?: number;
  dockingScore?: number;
}

export interface Project {
  id: string;
  title: string;
  projectType: string;
  office: Office;
  clientName: string;
  institution: string;
  description: string;
  status: Status;
  startDate: string;
  completionDate?: string;
  lead: string;
  totalFunding: number; // in INR
  gstType?: 'With GST' | 'Without GST';
  firstPaymentAmount?: number;
  firstPaymentDate?: string;
  paymentMode?: 'Cash' | 'Bank Transfer' | 'Cheque' | 'GPay' | 'PhonePe';
  bankDetails?: string;
  finalPaymentAmount?: number;
  finalPaymentDate?: string;
  progress: number; // 0-100
  activities?: ProjectActivity[];
  scientificDetails?: ScientificDetails;
}

export const institutionColors: Record<string, string> = {
  'VIT Vellore': '#0ea5e9', // Sky Blue
  'Vellore Institute of Technology': '#0ea5e9',
  'Bionome': '#10b981',    // Emerald
  'KLE Tech': '#f59e0b',    // Amber
  'IIT Madras': '#ef4444',   // Red
  'PES University': '#6366f1', // Indigo
  'Jain University': '#8b5cf6', // Violet
  'Sri Ramachandra Institute': '#ec4899', // Pink
  'Smt Gandhimathi College of Pharmacy': '#f43f5e', // Rose
  'Manipal University': '#f97316', // Orange
  'Amrita Vishwa Vidyapeetham': '#14b8a6', // Teal
  'SRM Institute': '#84cc16', // Lime
  'Anna University': '#06b6d4', // Cyan
  'MS Ramaiah': '#a855f7', // Purple
  'REVA University': '#d946ef', // Fuchsia
  'Nehru Arts and Science College': '#3b82f6',
  'Siddaganga Institute of Technology': '#ef4444',
  'JSS College of Arts, Commerce and Science, Mysore': '#f59e0b',
  'School of Life Science - Ooty Campus': '#10b981',
  'V. V. Vanniyaperumal college for women': '#ec4899',
  'K.S. Rangasamy College of Arts and Science': '#8b5cf6',
  'Bioneeds': '#6366f1',
  'Tamil Nadu Agricultural University': '#84cc16',
  'P. Rami Reddy Memorial College of Pharmacy': '#f97316',
  'KLE Technological University': '#f59e0b',
  'Other': '#64748b' // Slate
};

export const departments = [
  'Biotechnology',
  'Bioinformatics',
  'Pharmacology',
  'Research Lab',
  'Chemical Engineering',
  'Genetics',
  'Microbiology',
  'Molecular Biology',
  'Biochemistry',
  'R&D',
  'Computer Science',
  'Information Technology',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical & Electronics',
  'Electronics & Communication',
  'Physics',
  'Chemistry',
  'Mathematics',
  'English',
  'Psychology',
  'Economics',
  'Business Administration',
  'Commerce',
  'Data Science',
  'Artificial Intelligence',
  'Robotics',
  'Aerospace Engineering',
  'Biomedical Engineering',
  'Environmental Science',
  'Forensic Science',
  'Clinical Research',
  'Pharmaceutical Analysis',
  'Pharmaceutics',
  'Pharmacognosy'
];

export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export const usaStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", 
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", 
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export const japanPrefectures = [
  "Aichi", "Akita", "Aomori", "Chiba", "Ehime", "Fukui", "Fukuoka", "Fukushima", "Gifu", "Gunma", 
  "Hiroshima", "Hokkaido", "Hyogo", "Ibaraki", "Ishikawa", "Iwate", "Kagawa", "Kagoshima", "Kanagawa", "Kochi", 
  "Kumamoto", "Kyoto", "Mie", "Miyagi", "Miyazaki", "Nagano", "Nagasaki", "Nara", "Niigata", "Oita", 
  "Okayama", "Okinawa", "Osaka", "Saga", "Saitama", "Sapporo", "Shiga", "Shimane", "Shizuoka", "Tochigi", "Tokushima", 
  "Tokyo", "Tottori", "Toyama", "Wakayama", "Yamagata", "Yamaguchi", "Yamanashi"
];

export const stateCities: Record<string, string[]> = {
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Vellore", "Erode", "Thoothukudi", "Tirunelveli", "Thanjavur", 
    "Karaikudi", "Neyveli", "Sivakasi", "Ramanathapuram", "Pudukkottai", "Theni", "Virudhunagar", "Dharmapuri", "Krishnagiri",
    "Nagapattinam", "Viluppuram", "Chengalpattu", "Kanyakumari", "Udhagamandalam"
  ],
  "Karnataka": [
    "Bengaluru", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi", "Kalaburagi", "Davanagere", "Ballari", "Vijayapura", "Shivamogga",
    "Tumakuru", "Raichur", "Bidar", "Hosapete", "Gadag", "Hassan", "Udupi", "Robertsonpet", "Bhadravati", "Chitradurga", "Kolar", 
    "Mandya", "Chikmagalur", "Gangavathi", "Bagalkot", "Ranebennuru"
  ],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Kalyan-Dombivli", "Vasai-Virar", "Aurangabad", "Navi Mumbai", "Solapur"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Kakinada", "Rajahmundry", "Kadapa", "Tirupati", "Anantapur"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Kannur", "Alappuzha", "Palakkad", "Malappuram", "Manjeri"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Bareilly", "Aligarh", "Moradabad"],
  "West Bengal": ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Malda", "Baharampur", "Habra", "Kharagpur", "Shantipur"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Gandhidham", "Anand"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", "Sikar"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Jagdalpur"],
  "Jharkhand": ["Jamshedpur", "Dhanbad", "Ranchi", "Bokaro Steel City", "Deoghar", "Phusro"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Nahan", "Paonta Sahib"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim"],
  // Japan Cities
  "Hokkaido": ["Sapporo", "Asahikawa", "Hakodate", "Kushiro", "Tomakomai", "Obihiro", "Otaru", "Kitami", "Ebetsu"],
  "Sapporo": ["Chuo-ku", "Kita-ku", "Higashi-ku", "Shiroishi-ku", "Toyohira-ku", "Minami-ku", "Nishi-ku", "Atsubetsu-ku", "Teine-ku", "Kiyota-ku"],
  "Tokyo": ["Shinjuku", "Shibuya", "Minato", "Chuo", "Chiyoda", "Setagaya", "Meguro", "Toshima", "Nakano", "Suginami", "Hachioji", "Tachikawa", "Musashino", "Mitaka"]
};

export interface ClientProfile {
  id: string;
  name: string;
  university: string;
  department: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country?: string;
  designation?: string;
  gstNo?: string;
  status: 'Active' | 'Inactive';
}

export interface Student {
  id: string;
  name: string;
  university: string;
  department: string;
  email: string;
  phone: string;
  office: string;
  address: string;
  city: string;
  state: string;
  country: string;
  enrollmentDate: string;
  status: 'Active' | 'Graduated' | 'Dropped';
  enrollmentType: 'Internship' | 'Training' | 'Student Project' | 'Course' | 'Workshop';
  mode: 'Online' | 'Offline' | 'Hybrid';
  enrollmentNumber: string;
  totalFee: number;
  gstType?: 'With GST' | 'Without GST';
  firstPaymentAmount: number;
  firstPaymentDate: string;
  paymentMode?: 'Cash' | 'Bank Transfer' | 'Cheque' | 'GPay' | 'PhonePe';
  bankDetails?: string;
  finalPaymentAmount: number;
  finalPaymentDate: string;
}

export interface Payment {
  id: string;
  clientId: string;
  projectIds?: string[];
  studentIds?: string[];
  date: string;
  amount: number;
  type: 'Common' | 'Project' | 'Advance' | 'Other';
  description?: string;
  paymentMode?: 'Cash' | 'Bank Transfer' | 'Cheque' | 'GPay' | 'PhonePe';
  reference?: string;
  gstType?: 'With GST' | 'Without GST';
  office?: 'Ooty' | 'Coimbatore';
  bankAccount?: string;
}

export const paymentModeOptions = ['Cash', 'Bank Transfer', 'Cheque', 'GPay', 'PhonePe'];

export const bankAccountOptions = {
  withoutGST: ['Vivek Personal SBI', 'Appa Personal SBI', 'Vinoth Personal SBI'],
  withGST: {
    Coimbatore: ['Insilicomics SBI', 'Insilicomics HDFC'],
    Ooty: ['Axis Bank']
  }
};