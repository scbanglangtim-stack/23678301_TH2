import apiClient from './apiClient';

export interface Product {
  id: number;
  title: string;
  shortTitle?: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export const KTX_FOOD_ITEMS = [
  {
    title: 'Cơm nắm tam giác rong biển',
    shortTitle: 'Cơm nắm rong biển',
    category: 'Đồ ăn',
    price: 28500 / 25500, // 28.500 đ
    description: 'Cơm nắm rong biển Nhật Bản nhân cá ngừ sốt mayo thơm ngon, tiện lợi cho bữa sáng.',
    image: 'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=500&auto=format&fit=crop&q=80',
  },
  {
    title: 'Trà sữa trân châu đường đen',
    shortTitle: 'Trà sữa trân châu',
    category: 'Thức uống',
    price: 35000 / 25500, // 35.000 đ
    description: 'Trà sữa đậm vị béo ngậy kèm trân châu đường đen dẻo dai mát lạnh, giao tận phòng.',
    image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=500&auto=format&fit=crop&q=80',
  },
  {
    title: 'Bút bi Thiên Long 0.5mm',
    shortTitle: 'Bút bi Thiên Long',
    category: 'Văn phòng phẩm',
    price: 12000 / 25500, // 12.000 đ
    description: 'Bút bi ngòi 0.5mm êm mượt mực xanh bền màu cho sinh viên ghi chép bài vở.',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80',
  },
  {
    title: 'Mì ly Handy Hảo Hảo chua cay',
    shortTitle: 'Mì ly Hảo Hảo',
    category: 'Đồ ăn',
    price: 18000 / 25500, // 18.000 đ
    description: 'Mì ly vị tôm chua cay đậm đà, shipper kèm nước sôi khi giao tới phòng KTX.',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80',
  },
  {
    title: 'Bánh mì pate chả lụa',
    shortTitle: 'Bánh mì pate chả',
    category: 'Đồ ăn',
    price: 22000 / 25500, // 22.000 đ
    description: 'Bánh mì giòn rụm kẹp pate béo, chả lụa thơm và dưa leo sốt mayonnaise.',
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=500&auto=format&fit=crop&q=80',
  },
  {
    title: 'Cà phê sữa đá Sài Gòn',
    shortTitle: 'Cà phê sữa đá',
    category: 'Thức uống',
    price: 20000 / 25500, // 20.000 đ
    description: 'Cà phê pha phin truyền thống đậm đà giúp sinh viên tỉnh táo ôn thi đêm.',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&auto=format&fit=crop&q=80',
  },
  {
    title: 'Snack khoai tây Oishi Swing',
    shortTitle: 'Snack khoai tây',
    category: 'Ăn vặt',
    price: 15000 / 25500, // 15.000 đ
    description: 'Bánh snack khoai tây chiên giòn rụm vị phô mai cho giờ giải lao học tập.',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80',
  },
  {
    title: 'Sữa tươi tiệt trùng Vinamilk 180ml',
    shortTitle: 'Sữa tươi Vinamilk',
    category: 'Thức uống',
    price: 12000 / 25500, // 12.000 đ
    description: 'Sữa tươi 100% dinh dưỡng tiệt trùng nạp nhanh năng lượng cho buổi học.',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
  },
  {
    title: 'Tập vở 200 trang sinh viên Campus',
    shortTitle: 'Tập vở Campus 200T',
    category: 'Văn phòng phẩm',
    price: 16000 / 25500, // 16.000 đ
    description: 'Vở kẻ ngang Campus chống loá mắt, giấy dày dặn chuẩn chất lượng sinh viên.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
  },
  {
    title: 'Xúc xích tiệt trùng Ponnie',
    shortTitle: 'Xúc xích Ponnie',
    category: 'Ăn vặt',
    price: 14000 / 25500, // 14.000 đ
    description: 'Xúc xích heo thịt ngọt tự nhiên, món ăn nhanh bổ dưỡng được sinh viên ưa chuộng.',
    image: 'https://images.unsplash.com/photo-1585325701165-351af916e581?w=500&auto=format&fit=crop&q=80',
  },
  {
    title: 'Nước khoáng thiên nhiên Aquafina 500ml',
    shortTitle: 'Nước suối Aquafina',
    category: 'Thức uống',
    price: 10000 / 25500, // 10.000 đ
    description: 'Nước uống đóng chai tinh khiết chuẩn vệ sinh an toàn, giao tận phòng KTX.',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80',
  },
  {
    title: 'Bánh bao xá xíu trứng cút',
    shortTitle: 'Bánh bao xá xíu',
    category: 'Đồ ăn',
    price: 20000 / 25500, // 20.000 đ
    description: 'Bánh bao nóng hổi nhân thịt xá xíu trứng cút đậm vị giao liền tay tới phòng.',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=80',
  },
];

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>('/products?limit=12');
  const apiList = response.data;

  // Map API items sang chuẩn dữ liệu món ăn, đồ uống, văn phòng phẩm KTXGo
  return apiList.map((item, index) => {
    const ktx = KTX_FOOD_ITEMS[index % KTX_FOOD_ITEMS.length];
    return {
      id: item.id,
      title: ktx.shortTitle || ktx.title,
      price: ktx.price,
      category: ktx.category,
      description: ktx.description,
      image: ktx.image,
      rating: item.rating,
    };
  });
};

export const fetchProductById = async (id: string | number): Promise<Product> => {
  const numId = typeof id === 'string' ? parseInt(id, 10) || 1 : id;
  const response = await apiClient.get<Product>(`/products/${numId}`);
  const item = response.data;

  const index = (numId - 1) % KTX_FOOD_ITEMS.length;
  const ktx = KTX_FOOD_ITEMS[index >= 0 ? index : 0];

  return {
    id: item.id,
    title: ktx.title,
    shortTitle: ktx.shortTitle,
    price: ktx.price,
    category: ktx.category,
    description: ktx.description,
    image: ktx.image,
    rating: item.rating,
  };
};
