export type Role = "student" | "client";

export type TaskStatus = "open" | "in_progress" | "completed";

export type ApplicationStatus = "pending" | "hired" | "rejected";

export type Category =
  | "Cleaning"
  | "Delivery"
  | "Tutoring"
  | "Graphic Design"
  | "Moving"
  | "Tech Help"
  | "Other";

export type Residency = "domestic" | "international";

export type Profile = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  uni?: string;
  bio: string;
  skills: string[];
  licences: string[];
  residency?: Residency;
  visaDocumentName?: string;
  fortnightHours: number;
  location: string;
  verifiedBadge: boolean;
  rating: number;
  reviewCount: number;
  completedTasks: number;
  totalEarnings: number;
  createdAt: string;
};

export type JobType = "one_off" | "ongoing";

export type Task = {
  id: string;
  title: string;
  description: string;
  category: Category;
  budget: number;
  location: string;
  deadline: string;
  status: TaskStatus;
  clientId: string;
  hiredStudentId?: string;
  createdAt: string;
  appliedHint?: number;
  customCategory?: string;
  jobType?: JobType;
  requiredSkills?: string;
  requiredEquipment?: string;
  estimatedHours?: number;
};

export type Application = {
  id: string;
  taskId: string;
  studentId: string;
  message: string;
  status: ApplicationStatus;
  createdAt: string;
};

export type Review = {
  id: string;
  taskId: string;
  fromId: string;
  toId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type EquipmentItem = {
  id: string;
  name: string;
  category: string;
  dailyRate: number;
  available: boolean;
  description: string;
  location: string;
};

export type EquipmentBooking = {
  id: string;
  equipmentId: string;
  studentId: string;
  startDate: string;
  endDate: string;
  status: "booked" | "cancelled";
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  source: "google" | "sidequest" | "demo";
};

export type QuestSuggestion = {
  id: string;
  studentId: string;
  category: Category;
  reason: string;
  start: string;
  end: string;
  taskId?: string;
  confirmed: boolean;
};

export type ChatMessage = {
  id: string;
  taskId: string;
  fromId: string;
  body: string;
  createdAt: string;
};

export type AppState = {
  profiles: Profile[];
  tasks: Task[];
  applications: Application[];
  reviews: Review[];
  equipment: EquipmentItem[];
  bookings: EquipmentBooking[];
  calendarEvents: CalendarEvent[];
  suggestions: QuestSuggestion[];
  messages: ChatMessage[];
  currentUserId: string | null;
  googleConnected: boolean;
};
