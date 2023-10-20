import { v2 } from 'cloudinary';
const CLOUDINARY = 'Cloudinary';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: 'dylqbgiha',
      api_key: '416489684695369',
      api_secret: 'sb_uj-Xnqeys2B5LruMsh9w9bXY',
    });
  },
};
