import { DeliveryPrice } from '@/types';
import { wilayas } from './wilayas';

// Generate default delivery prices for all wilayas
export const generateDefaultDeliveryPrices = (): DeliveryPrice[] => {
  return wilayas.map((wilaya) => {
    // Different pricing tiers based on distance from central regions
    const centralWilayas = ['16', '09', '35', '42']; // Alger, Blida, Boumerdes, Tipaza
    const nearbyWilayas = ['15', '06', '19', '25', '31', '23']; // Major cities
    const farWilayas = ['01', '11', '33', '37', '52', '53', '54', '56', '57', '58']; // Sahara regions

    let domicile = 600;
    let bureau = 400;

    if (centralWilayas.includes(wilaya.code)) {
      domicile = 400;
      bureau = 300;
    } else if (nearbyWilayas.includes(wilaya.code)) {
      domicile = 500;
      bureau = 350;
    } else if (farWilayas.includes(wilaya.code)) {
      domicile = 1200;
      bureau = 800;
    }

    return {
      wilaya: wilaya.nom,
      domicile,
      bureau,
    };
  });
};

export const initialDeliveryPrices = generateDefaultDeliveryPrices();
