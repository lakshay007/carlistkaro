export interface Car {
  _id: string;
  title: string;
  description: string;
  images: string[];
  tags: {
    car_type: string;
    company: string;
    dealer: string;
  };
  user: string;
  createdAt: string;
  updatedAt: string;
} 