export const allProducts = [
  {
    id: 1,
    title: "Cards Collection",
    price: '$8.00+',
    images: [
      '/cardblueberry.png',
      '/cardlavender.png',
      '/cardmargaritas.png',
      '/cardmothersday.png'
    ],
    category: 'Cards',
    type: 'Cards (Multiple Variations)'
  },
  {
    id: 2,
    title: "Watercolor House Portraits",
    price: '$65.00',
    images: [
      '/watercolorbrickhome.png',
      '/watercolorredbrickhome.png',
      '/watercolorwhitehome.png'
    ],
    category: 'Watercolor Houses',
    type: 'Custom'
  },
  {
    id: 3,
    title: "Custom Portraits",
    price: '$30.00',
    images: [
      '/portraitgirlsontrip.png',
      '/portrait mom&daughter.png',
      '/portraitgirlscamp.png',
      '/portraitgirlsatprom.png',
      '/portraitmom&daughters.png',
      '/portraitmom&kidsreading.png'
    ],
    category: 'Portraits',
    type: 'Custom'
  },
  {
    id: 4,
    title: "Misty Mountains",
    price: '$150.00',
    images: [
      '/MistyMountains.png'
    ],
    category: 'Original Paintings',
    type: 'Original Painting'
  }
];

export const categories = ['All Shop', 'Cards', 'Watercolor Houses', 'Portraits', 'Original Paintings'];

export type Product = typeof allProducts[0];
