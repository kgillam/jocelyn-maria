export const allProducts = [
  {
    id: 1,
    title: "Blueberry Botanical Card",
    price: '$8.00',
    images: ['/cardblueberryproduct.png?v=4'],
    category: 'Cards',
    type: 'Greeting Card'
  },
  {
    id: 101,
    title: "Lavender Botanical Card",
    price: '$8.00',
    images: ['/cardlavenderproduct.png?v=4'],
    category: 'Cards',
    type: 'Greeting Card'
  },
  {
    id: 102,
    title: "Margaritas Card",
    price: '$8.00',
    images: ['/cardmargaritasproduct.png?v=4'],
    category: 'Cards',
    type: 'Greeting Card'
  },
  {
    id: 103,
    title: "Mother's Day Card",
    price: '$8.00',
    images: ['/cardmothersdayproduct.png?v=4'],
    category: 'Cards',
    type: 'Greeting Card'
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
      '/momanddaughterportrait.png',
      '/girlsontripportrait.png',
      '/girlsatcampportrait.png',
      '/girlsatpromportrait.png',
      '/momandgirlsportrait.png',
      '/momandkidsreadingportrait.png'
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
