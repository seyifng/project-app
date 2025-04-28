import { clerkClient, currentUser } from "@clerk/nextjs/server";
import mysql from "mysql2/promise";

const db = await mysql.createPool({
  host: "your-host",
  user: "your-username",
  password: "your-password",
  database: "your-database",
});

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE clerkUserId = ?",
      [user.id]
    );

    if (rows.length > 0) {
      return rows[0];
    }

    const name = `${user.firstName} ${user.lastName}`;
    const username = name.split(" ").join("-") + user.id.slice(-4);

    await clerkClient.users.updateUser(user.id, {
      username,
    });

    const [result] = await db.query(
      "INSERT INTO users (clerkUserId, name, imageUrl, email, username) VALUES (?, ?, ?, ?, ?)",
      [user.id, name, user.imageUrl, user.emailAddresses[0].emailAddress, username]
    );

    const [newUser] = await db.query("SELECT * FROM users WHERE id = ?", [
      result.insertId,
    ]);

    return newUser[0];
  } catch (error) {
    console.log(error);
  }
};