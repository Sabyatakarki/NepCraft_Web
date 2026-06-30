import { Request, Response } from "express";
import * as ArtisanService from "../services/artisans.service";

export const createArtisan = async (req: Request, res: Response) => {
  try {
    const artisan = await ArtisanService.createArtisan(req.body);

    res.status(201).json({
      success: true,
      artisan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create artisan",
    });
  }
};

export const getAllArtisans = async (
  req: Request,
  res: Response
) => {
  try {
    const artisans = await ArtisanService.getAllArtisans();

    res.status(200).json({
      success: true,
      artisans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch artisans",
    });
  }
};

export const getArtisanById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const artisan = await ArtisanService.getArtisanById(req.params.id);

    res.status(200).json({
      success: true,
      artisan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Artisan not found",
    });
  }
};

export const updateArtisan = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const artisan = await ArtisanService.updateArtisan(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      artisan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};
