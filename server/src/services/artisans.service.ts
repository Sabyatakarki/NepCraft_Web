import Artisan from "../model/artisans.model";

export const createArtisan = async (data: any) => {
  return await Artisan.create(data);
};

export const getAllArtisans = async () => {
  return await Artisan.find().sort({ createdAt: -1 });
};

export const getArtisanById = async (id: string) => {
  return await Artisan.findById(id);
};

export const updateArtisan = async (id: string, data: any) => {
  return await Artisan.findByIdAndUpdate(id, data, {
    new: true,
  });
};
