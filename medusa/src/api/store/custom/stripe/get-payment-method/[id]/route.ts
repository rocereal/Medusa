import { MedusaResponse, MedusaStoreRequest } from "@medusajs/framework";
import Stripe from "stripe";

export const GET = async (req: MedusaStoreRequest, res: MedusaResponse) => {
  const stripe = new Stripe(process.env.STRIPE_API_KEY);
  const { id } = req.params;

  const paymentMethod = await stripe.paymentMethods.retrieve(id);
  res.status(200).json(paymentMethod);
};
