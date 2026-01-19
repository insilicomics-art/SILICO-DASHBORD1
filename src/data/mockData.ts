export type Institution = string;
export type Status = 'Ongoing' | 'Completed' | 'Planned' | 'Stopped';
export type Office = 'Ooty' | 'Coimbatore';

export interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export const mockUsers: User[] = [
  { id: 'U001', name: 'Dr. Sarah Chen', role: 'Lead Scientist' },
  { id: 'U002', name: 'Prof. R. Venkat', role: 'Professor' },
  { id: 'U003', name: 'Dr. Vivek Chandramohan', role: 'Senior Researcher' },
  { id: 'U004', name: 'Dr. Emily Watson', role: 'Principal Investigator' },
  { id: 'U005', name: 'Dr. K. Gupta', role: 'Associate Professor' },
  { id: 'U006', name: 'Prof. S. Deshpande', role: 'Head of Dept' },
  { id: 'U007', name: 'Dr. M. Johnson', role: 'Clinical Research Lead' },
  { id: 'U008', name: 'Dr. A. Verma', role: 'Security Analyst' },
  { id: 'U009', name: 'Dr. P. Kulkarni', role: 'Energy Systems Engineer' },
  { id: 'U010', name: 'Dr. L. Thomas', role: 'Chemical Engineer' },
  { id: 'U011', name: 'Dr. H. Lee', role: 'Nanotech Specialist' },
  { id: 'U012', name: 'Prof. J. Smith', role: 'Renewable Energy Expert' }
];

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
  institution: Institution;
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

export const projects: Project[] = [
  {
    id: 'P001',
    title: 'SARS-CoV-2 Spike Protein Dynamics',
    projectType: 'Molecular Dynamics',
    office: 'Coimbatore',
    clientName: 'Dr. Rajesh Kumar',
    institution: 'VIT Vellore',
    description: 'Investigating the stability of the spike protein RBD variants.',
    status: 'Ongoing',
    startDate: '2025-11-01',
    lead: 'Dr. Sarah Chen',
    totalFunding: 150000,
    firstPaymentAmount: 75000,
    firstPaymentDate: '2025-11-01',
    paymentMode: 'Bank Transfer',
    bankDetails: 'Insilicomics HDFC',
    progress: 65,
    scientificDetails: {
      targetProtein: 'Spike Glycoprotein',
      simulationEngine: 'GROMACS',
      atomsCount: 125000,
      simulationTimeNs: 300
    },
    activities: [
      {
        id: 'A001',
        name: 'System Minimization',
        assignedTo: 'Dr. Sarah Chen',
        server: 'HPC Cluster',
        duration: '100ns',
        progress: 100,
        startDate: '2025-11-01',
        endDate: '2025-11-05',
        totalAtoms: 125000,
        status: 'Completed',
        simulationEngine: 'GROMACS'
      },
      {
        id: 'A002',
        name: 'Production Run Phase 1',
        assignedTo: 'Dr. Sarah Chen',
        server: 'Server 1',
        duration: '200ns',
        progress: 50,
        startDate: '2025-11-10',
        endDate: '',
        totalAtoms: 125000,
        status: 'In Progress',
        simulationEngine: 'GROMACS'
      }
    ]
  },
  {
    id: 'P002',
    title: 'Oncology Drug Repurposing',
    projectType: 'Molecular Docking',
    office: 'Ooty',
    clientName: 'Prof. Michael Brown',
    institution: 'Bionome',
    description: 'Screening FDA approved drugs against EGFR mutants.',
    status: 'Completed',
    startDate: '2025-10-15',
    completionDate: '2026-01-10',
    lead: 'Dr. Vivek Chandramohan',
    totalFunding: 80000,
    firstPaymentAmount: 40000,
    firstPaymentDate: '2025-10-15',
    paymentMode: 'Cheque',
    bankDetails: 'Insilicomics Research Pvt, Ltd',
    finalPaymentAmount: 40000,
    finalPaymentDate: '2026-01-10',
    progress: 100,
    scientificDetails: {
      targetProtein: 'EGFR T790M',
      ligandCount: 2500,
      simulationEngine: 'AutoDock',
      dockingScore: -9.8,
      simulationTimeNs: 500
    },
    activities: [
      {
        id: 'A003',
        name: 'Virtual Screening',
        assignedTo: 'Dr. Vivek Chandramohan',
        server: 'Server 3',
        duration: '500ns',
        progress: 100,
        startDate: '2025-10-20',
        endDate: '2025-11-15',
        totalAtoms: 5000,
        status: 'Completed',
        simulationEngine: 'AutoDock'
      }
    ]
  },
  {
    id: 'P003',
    title: 'Neurodegenerative Peptide Design',
    projectType: 'Homology Modelling',
    office: 'Coimbatore',
    clientName: 'Dr. Linda Garcia',
    institution: 'KLE Tech',
    description: 'Designing novel peptides for Alzheimer inhibition.',
    status: 'Ongoing',
    startDate: '2026-01-05',
    lead: 'Dr. Sarah Chen',
    totalFunding: 120000,
    firstPaymentAmount: 0,
    paymentMode: 'GPay',
    bankDetails: 'Vivek Personal SBI',
    progress: 15,
    scientificDetails: {
      targetProtein: 'Amyloid Beta',
      simulationEngine: 'Desmond',
      atomsCount: 45000,
      simulationTimeNs: 50
    },
    activities: [
      {
        id: 'A004',
        name: 'Template Selection',
        assignedTo: 'Dr. Sarah Chen',
        server: 'Server 2',
        duration: '50ns',
        progress: 100,
        startDate: '2026-01-10',
        endDate: '2026-01-12',
        totalAtoms: 10000,
        status: 'Completed',
        simulationEngine: 'Desmond'
      }
    ]
  }
];

export const initialInstitutions: string[] = [
  'VIT Vellore',
  'Bionome',
  'KLE Tech',
  'IIT Madras'
];

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
  'Other': '#64748b' // Slate
};

export const initialProjectTypes: string[] = [
  'Molecular Dynamics',
  'Molecular Docking',
  'Protein Protein Docking',
  'Homology Modelling',
  'NGS Data Analysis',
  'Genomic Sequencing',
  'Bioinformatics',
  'Drug Discovery',
  'Student Training',
  'Workshop',
  'VAP',
  'Course',
  'QSAR',
  'Network Pharmacology'
];

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

export const stateCities: Record<string, string[]> = {
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Vellore", "Erode", "Thoothukudi", "Tirunelveli", "Thanjavur",
    "Ooty", "Tiruppur", "Dindigul", "Kanchipuram", "Cuddalore", "Karur", "Nagercoil", "Kumbakonam", "Hosur", "Pollachi",
    "Karaikudi", "Neyveli", "Sivakasi", "Ramanathapuram", "Pudukkottai", "Theni", "Virudhunagar", "Dharmapuri", "Krishnagiri",
    "Nagapattinam", "Viluppuram", "Chengalpattu", "Kanyakumari", "Udhagamandalam"
  ],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi", "Kalaburagi", "Davanagere", "Ballari", "Vijayapura", "Shivamogga"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Kalyan-Dombivli", "Vasai-Virar", "Aurangabad", "Navi Mumbai", "Solapur"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Kakinada", "Rajahmundry", "Kadapa", "Tirupati", "Anantapur"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Nadiad", "Gandhidham"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Prayagraj", "Bareilly", "Aligarh", "Moradabad"],
  "West Bengal": ["Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur", "Maheshtala", "Rajpur Sonarpur", "Gaya", "South Dumdum", "Gopalpur"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", "Sikar"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Alappuzha", "Palakkad", "Malappuram", "Punnapra", "Thalassery"],
  "Delhi": ["New Delhi", "Delhi Cantt", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali"],
  "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Jagdalpur"],
  "Jharkhand": ["Jamshedpur", "Dhanbad", "Ranchi", "Bokaro Steel City", "Deoghar", "Phusro"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Nahan", "Paonta Sahib"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim"]
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
  status: 'Active' | 'Inactive';
}

export interface Student {
  id: string;
  name: string;
  university: string;
  department: string;
  email: string;
  phone: string;
  office: Office;
  address: string;
  city: string;
  state: string;
  country: string;
  enrollmentDate: string;
  status: 'Active' | 'Inactive' | 'Graduated';
  enrollmentType: 'Internship' | 'Workshop' | 'Training' | 'VAP' | 'Student Project' | 'Other';
  mode: 'Offline' | 'Online' | 'Hybrid';
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

export const initialClientProfiles: ClientProfile[] = [
  // ... existing profiles
];

export const initialStudents: Student[] = [
  {
    id: 'S001',
    name: 'Arjun Mehta',
    university: 'VIT Vellore',
    department: 'Biotechnology',
    email: 'arjun.m@vit.ac.in',
    phone: '+91 99887 76655',
    office: 'Coimbatore',
    address: 'Vellore',
    city: 'Vellore',
    state: 'Tamil Nadu',
    country: 'India',
    enrollmentDate: '2025-12-01',
    status: 'Active',
    enrollmentType: 'Internship',
    mode: 'Offline',
    enrollmentNumber: 'VIT2025001',
    totalFee: 25000,
    gstType: 'With GST',
    firstPaymentAmount: 15000,
    firstPaymentDate: '2025-12-01',
    paymentMode: 'Bank Transfer',
    bankDetails: 'Insilicomics SBI',
    finalPaymentAmount: 0,
    finalPaymentDate: ''
  },
  {
    id: 'S002',
    name: 'Priya Das',
    university: 'Bionome',
    department: 'R&D',
    email: 'priya.d@bionome.com',
    phone: '+91 88776 65544',
    office: 'Ooty',
    address: 'Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    enrollmentDate: '2026-01-05',
    status: 'Active',
    enrollmentType: 'Training',
    mode: 'Online',
    enrollmentNumber: 'BIO2026001',
    totalFee: 15000,
    gstType: 'Without GST',
    firstPaymentAmount: 15000,
    firstPaymentDate: '2026-01-05',
    paymentMode: 'GPay',
    bankDetails: 'Appa Personal SBI',
    finalPaymentAmount: 0,
    finalPaymentDate: ''
  },
  {
    id: 'S003',
    name: 'Rahul K.',
    university: 'Bionome',
    department: 'Bioinformatics',
    email: 'rahul.k@gmail.com',
    phone: '+91 77665 54433',
    office: 'Ooty',
    address: 'Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    enrollmentDate: '2026-01-10',
    status: 'Active',
    enrollmentType: 'Internship',
    mode: 'Hybrid',
    enrollmentNumber: 'BIO2026002',
    totalFee: 20000,
    firstPaymentAmount: 10000,
    firstPaymentDate: '2026-01-10',
    finalPaymentAmount: 0,
    finalPaymentDate: ''
  }
];

export const paymentModeOptions = ['Cash', 'Bank Transfer', 'Cheque', 'GPay', 'PhonePe'];

export const bankAccountOptions = {
  withoutGST: ['Vivek Personal SBI', 'Appa Personal SBI', 'Vinoth Personal SBI'],
  withGST: {
    Coimbatore: ['Insilicomics SBI', 'Insilicomics HDFC'],
    Ooty: ['Insilicomics Research Pvt, Ltd']
  }
};
