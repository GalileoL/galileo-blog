import { Webhook } from "svix";
import User from "../models/user.model.js";

export const clerkWebhook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("CLERK_WEBHOOK_SECRET is not set");
  }
  const payload = req.body;
  const header = req.headers;

  const wh = new Webhook(WEBHOOK_SECRET);
  let event;

  try {
    event = wh.verify(payload, header);
  } catch (error) {
    res.status(400).json({ message: " webhook verification failed" });
  }

  // console.log(`${event.type} event received`, event.data.id);

  if (event.type === "user.created") {
    const user = new User({
      clerkUserId: event.data.id,
      username:
        event.data.username || event.data.email_addresses[0].email_address,
      email: event.data.email_addresses[0].email_address,
      img: event.data.profile_image_url,
    });
    await user.save();
    // res.status(200).json({ message: "user created" });
  }
};
