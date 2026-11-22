import { connectToDatabase } from "@/lib/db";
import { Admin } from "@/models/Admin";
import { hashPassword } from "@/lib/auth";

/**
 * Seed initial administrative owner account from environment variables.
 * Safe to execute multiple times (idempotent: updates password if exists).
 */
export async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const username = process.env.ADMIN_USERNAME || "rajshila_admin";

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required to seed the admin account."
    );
  }

  await connectToDatabase();

  const passwordHash = await hashPassword(password);

  const existingAdmin = await Admin.findOne({ email: email.toLowerCase().trim() });

  if (existingAdmin) {
    existingAdmin.passwordHash = passwordHash;
    existingAdmin.username = username;
    existingAdmin.role = "superadmin";
    existingAdmin.isActive = true;
    await existingAdmin.save();
    console.log(`[SEED] Admin account updated for: ${email}`);
    return { success: true, action: "updated", email };
  } else {
    await Admin.create({
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: "superadmin",
      isActive: true,
    });
    console.log(`[SEED] Admin account created for: ${email}`);
    return { success: true, action: "created", email };
  }
}
