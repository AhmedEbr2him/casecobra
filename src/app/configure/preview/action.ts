"use server";

import { BASE_PRICE, PRODUCT_PRICE } from "@/config/products";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Order } from "@prisma/client";

export const createCheckoutSession = async ({
  configId,
}: {
  configId: string;
}) => {
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });
  if (!configuration) {
    throw new Error("No such configuration found");
  }
  // get user status Login | Not login
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    throw new Error("You need to be logged in");
  }
  // ensuring user pay all price on server
  let price = BASE_PRICE;
  const { material, finish } = configuration;
  if (material === "polycarbonate")
    price += PRODUCT_PRICE.material.polycarbonate;
  if (finish === "textured") price += PRODUCT_PRICE.finish.texture;

  let order: Order | undefined = undefined;
  // we fixed user id error with add userId manually in prisam studio
  // console.log('userId:' + user.id, 'configurationId:' + configuration.id);

  const existOrder = await db.order.findFirst({
    where: {
      userId: user.id,
      configurationId: configuration.id,
    },
  });

  if (existOrder) {
    order = existOrder;
  } else {
    order = await db.order.create({
      data: {
        amount: price / 100,
        userId: user.id,
        configurationId: configuration.id,
      },
    });
  }

  // create a product for stripe
  const product = await stripe.products.create({
    name: "Custom iPhone Case",
    images: [configuration.imageUrl],
    default_price_data: {
      currency: "USD",
      unit_amount: price,
    },
  });

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    mode: "payment",
    payment_method_types: ["card", "link"],
    shipping_address_collection: {
      allowed_countries: ["EG", "US", "DE", "SA"],
    },
    metadata: {
      // to know which user order the product
      userId: user.id,
      orderId: order.id,
    },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });

  return { url: stripeSession.url };
};
