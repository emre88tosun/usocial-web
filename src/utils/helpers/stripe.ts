import { type Stripe, loadStripe } from '@stripe/stripe-js';
import safeString from './safeString';

let stripeContainer: Stripe | null = null;
const stripe = async (publicKey: string) => {
  if (
    !stripeContainer &&
    safeString(publicKey) !== '' &&
    typeof window !== 'undefined'
  ) {
    stripeContainer = await loadStripe(publicKey);
  }
  return stripeContainer;
};

export default stripe;
