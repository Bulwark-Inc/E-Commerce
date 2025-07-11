import { API_BASE_URL } from '../../../shared/constants/constants';

export const getPrimaryImage = (product) => {
  if (!product) return {
    image: '/placeholder.jpg',
    alt_text: 'Product Image'
  };

  const imageObj =
    product.primary_image ||
    (product.images && product.images.find(img => img.is_primary)) ||
    null;

  let image = '/placeholder.jpg';
  let alt_text = product.name || 'Product Image';

  if (imageObj?.url || imageObj?.image) {
    const rawUrl = imageObj.url || imageObj.image;

    // Safe URL append
    const cleanBase = API_BASE_URL.replace(/\/+$/, '');
    image = rawUrl.startsWith('http') ? rawUrl : `${cleanBase}${rawUrl}`;
    alt_text = imageObj.alt_text || alt_text;
  }

  return { image, alt_text };
};
