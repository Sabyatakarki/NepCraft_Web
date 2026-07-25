import { Request, Response } from "express";
import * as ArtisanService from "../services/artisans.service";

export const createArtisan = async (req: Request, res: Response) => {
  try {
    const artisan = await ArtisanService.createArtisan(req.body);

    res.status(201).json({
      success: true,
      artisan,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getArtisanById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const artisan = await ArtisanService.getArtisanById(req.params.id);

    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: "Artisan not found",
      });
    }

    res.status(200).json({
      success: true,
      artisan,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
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

    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: "Artisan not found",
      });
    }

    res.status(200).json({
      success: true,
      artisan,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteArtisan = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const artisan = await ArtisanService.deleteArtisan(req.params.id);

    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: "Artisan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Artisan deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};