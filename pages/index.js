import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [brand, setBrand] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();

  const handleAnalyze = async () => {
    setError(null);

    if (status !== "authenticated") {
      setError("Please sign in before running analysis.");
      return;
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, brand }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to analyze");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">AI Visibility Tool 🚀</h1>
          {status === "authenticated" ? (
            <div className="text-right">
              <p className="text-sm">Signed in as {session.user.email}</p>
              <button
                onClick={() => signOut()}
                className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded"
            >
              Sign in with Google
            </button>
          )}
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter keyword"
            className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-700"
          />

          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Enter brand"
            className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-700"
          />

          <button
            onClick={handleAnalyze}
            className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded font-semibold"
          >
            Analyze
          </button>

          {/* Results Section */}
          {result && (
            <div className="mt-6 bg-gray-800 p-4 rounded">
              <h2 className="text-xl mb-3">
                Visibility Score: {result.visibilityScore.toFixed(2)}%
              </h2>

              {result.results.map((item, index) => (
                <div key={index} className="mb-3 border-b border-gray-700 pb-2">
                  <p className="text-sm">
                    <strong>Query:</strong> {item.query}
                  </p>

                  <p>{item.found ? "✅ Found" : "❌ Not Found"}</p>
                </div>
              ))}
            </div>
          )}

          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
