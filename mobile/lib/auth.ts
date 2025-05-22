export const addNewUser = async (email: string, clerkId: string) => {
  try {
    if (!email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const res = await fetch(`http://192.168.0.100:8000/api/users`, {
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
