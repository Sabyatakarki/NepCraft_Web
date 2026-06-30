import { Router } from "express";
import * as ArtisanController from "../controllers/artisan.controller";

const router = Router();

router.post("/", ArtisanController.createArtisan);

router.get("/", ArtisanController.getAllArtisans);

router.get("/:id", ArtisanController.getArtisanById);

router.put("/:id", ArtisanController.updateArtisan);


export default router;