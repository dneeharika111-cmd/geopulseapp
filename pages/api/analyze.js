import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { keyword, brand } = req.body;

  if (!keyword || !brand) {
    return res.status(400).json({ error: "Missing keyword or brand" });
  }

  // Simulate AI visibility analysis
  const visibilityScore = Math.random() * 100;

  const results = [
    { query: `What is ${brand}?`, found: Math.random() > 0.5 },
    { query: `${keyword} ${brand}`, found: Math.random() > 0.5 },
    { query: `${brand} review`, found: Math.random() > 0.5 },
  ];

  return res.status(200).json({
    visibilityScore,
    results,
  });
}
