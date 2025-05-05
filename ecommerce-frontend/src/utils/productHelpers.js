import { API_BASE_URL } from '../config/constants';

export const getPrimaryImage = (product) => {
    const imageObj = product?.primary_image || product?.images?.find(img => img.is_primary);
  
    let image = '/placeholder.jpg';
    let alt_text = product?.name || 'Product Image';

    if (imageObj?.url || imageObj?.image) {
        const rawUrl = imageObj.url || imageObj.image;
        image = rawUrl.startsWith('http') ? rawUrl : `${API_BASE_URL}${rawUrl}`;
        console.log("image", image)
        alt_text = imageObj.alt_text || alt_text;
    }

    return { image, alt_text };
};