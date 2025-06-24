import express from "express";
import { createListing, deleteListing, getListing, getListingByHostId, getListings, updateListing } from "../controllers/listingController.js";

const router = express.Router();

router.get('/listings', getListings);
router.get('/listings/:id', getListing);
router.get('/listings/users/:hostId', getListingByHostId);
router.post('/listings', createListing);
router.delete('/listings/:id', deleteListing);
router.put('/listings/:id', updateListing);

export default router;