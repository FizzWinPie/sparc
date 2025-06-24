import express from 'express';
import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing
} from '../controllers/listingController.js';

const router = express.Router();

router.post('/listings', createListing);
router.get('/listings', getListings);
router.get('/listings/:id', getListingById);
router.put('/listings/:id', updateListing);
router.delete('/listings/:id', deleteListing);

export default router;