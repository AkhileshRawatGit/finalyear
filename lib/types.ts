// Core type definitions for MedFinder platform

export interface User {
  id: string
  name: string
  email: string
  phone: string
  userType: "customer" | "pharmacy" | "admin"
  createdAt: string
  location?: {
    latitude: number
    longitude: number
    address: string
  }
  avatar?: string
}

export interface Medicine {
  id: string
  name: string
  genericName: string
  dosage: string
  category: string
  manufacturer: string
  price: number
  description: string
  sideEffects: string[]
  uses: string[]
  precautions: string[]
  expiryDate: string
  substitutes: string[]
  requiresPrescription: boolean
}

export interface PharmacyStore {
  id: string
  name: string
  ownerId: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  phone: string
  email: string
  rating: number
  reviews: number
  deliveryAvailable: boolean
  deliveryRadius: number
  openingTime: string
  closingTime: string
  stock: MedicineStock[]
  createdAt: string
}

export interface MedicineStock {
  medicineId: string
  quantity: number
  reorderLevel: number
  price: number
  lastUpdated: string
}

export interface Order {
  id: string
  userId: string
  pharmacyId: string
  medicines: OrderItem[]
  totalPrice: number
  prescriptionFile?: string
  status: "pending" | "confirmed" | "ready" | "shipped" | "delivered" | "cancelled"
  deliveryType: "pickup" | "delivery"
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  medicineId: string
  quantity: number
  price: number
}

export interface Prescription {
  id: string
  userId: string
  doctorName: string
  doctorLicense: string
  medicines: PrescriptionMedicine[]
  uploadedAt: string
  expiryDate: string
  fileUrl: string
}

export interface PrescriptionMedicine {
  medicineId: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

export interface MedicineReminder {
  id: string
  userId: string
  medicineId: string
  medicineName: string
  frequency: string
  dosage: string
  nextDue: string
  enabled: boolean
  notificationTime: string
  createdAt: string
}

export interface DigitalRecord {
  id: string
  userId: string
  recordType: "prescription" | "test_report" | "vaccination" | "allergy" | "diagnosis"
  title: string
  date: string
  doctorName?: string
  details: string
  fileUrl: string
  createdAt: string
}

export interface Review {
  id: string
  pharmacyId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export interface Dispute {
  id: string
  orderId: string
  userId: string
  pharmacyId: string
  issue: string
  status: "open" | "in_review" | "resolved" | "rejected"
  resolution?: string
  createdAt: string
}

export interface Analytics {
  date: string
  totalOrders: number
  totalRevenue: number
  topMedicines: Array<{ medicineName: string; count: number }>
  customerSatisfaction: number
}

export interface DoctorMapping {
  id: string
  doctorName: string
  specialization: string
  license: string
  pharmacy: string
  phone: string
  consultationFee: number
  rating: number
  reviews: number
}
