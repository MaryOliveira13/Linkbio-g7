export interface Testimonial {
  title: string;
  poster: string;
  video: string;
  captions?: string;
}

const place = 'ChIJV2BQ5ttJvJQRE8EyJ8Xy3VA';
const whatsapp = 'https://wa.me/5517991155149';

export function whatsappLink(message: string) {
  return `${whatsapp}?text=${encodeURIComponent(message)}`;
}

export const config = {
  name: 'G7 Scooters',
  logo: '/media/g7.webp',
  opening: {
    image: '/media/g7-opening-store-light.webp',
  },
  catalog: 'https://g7scooters.vercel.app/',
  workshop: '',
  maintenanceMessage: 'Olá! Vim pelo link da bio da G7 Scooters e gostaria de consultar conserto ou manutenção para minha scooter elétrica.',
  contactMessage: 'Olá! Vim pelo link da bio da G7 Scooters e gostaria de mais informações.',
  store: {
    street: 'Av. Cel. Silvério da Cunha Lacerda, Centro',
    city: 'Cedral – SP',
    postalCode: '15895-001',
    weekdays: 'Segunda a sexta, 9h às 19h',
    saturday: 'Sábado, 9h às 12h',
    mapImage: '/media/cedral.webp',
    facade: '',
    listing: `https://www.google.com/maps/search/?api=1&query=G7+Scooters+Cedral+SP&query_place_id=${place}`,
    directions: `https://www.google.com/maps/dir/?api=1&destination=G7+Scooters+Cedral+SP&destination_place_id=${place}`,
    embed: 'https://maps.google.com/maps?q=G7%20Scooters%2C%20Cedral%20SP&output=embed',
  },
  testimonials: [] as Testimonial[],
};
