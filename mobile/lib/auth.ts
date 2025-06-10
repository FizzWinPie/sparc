export const addNewUser = async (email: string, clerkId: string) => {
  try {
    if (!email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // On your laptop, localhost points to your machine. Use: http://localhost:8000
    // On your phone, localhost points to the phone itself — and your Node.js server isn’t running there. Use: http://<your ip address which can be found with command in terminal: 'ipconfig getifaddr en0'>:8000
    const res = await fetch(`http://localhost:8000/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, clerkId }),
    });
    return await res.json();
  } catch (err) {
    console.error("Failed to create user:", err);
    throw err;
  }
};
