// Product Types
export interface Product {
  id: string;
  nom: string;
  image: string;
  description: string;
  prix: number;
  categorie: 'cosmetique' | 'paramedical' | 'complement' | 'vitamine';
  createdAt: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Order Types
export interface Order {
  id: string;
  nomComplet: string;
  telephone: string;
  wilaya: string;
  baladiya: string;
  methodeLivraison: 'domicile' | 'bureau';
  items: CartItem[];
  sousTotal: number;
  fraisLivraison: number;
  total: number;
  status: 'en_attente' | 'confirmee' | 'livree' | 'annulee';
  createdAt: string;
}

// Delivery Pricing
export interface DeliveryPrice {
  wilaya: string;
  domicile: number;
  bureau: number;
}

// Ordonnance Types
export interface Ordonnance {
  id: string;
  nom: string;
  telephone: string;
  note: string;
  fichier: string; // Base64 encoded file
  fichierNom: string;
  fichierType: string;
  createdAt: string;
}

// Admin Types
export interface AdminUser {
  id: string;
  telephone: string;
  password: string;
}

// Wilaya & Baladiya
export interface Wilaya {
  code: string;
  nom: string;
  baladiyas: string[];
}
