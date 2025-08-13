export const addNewUser = async (email: string, clerkId: string) => {
  try {
    if (!email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const checkRes = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/users?clerkId=${clerkId}`
    );

    if (!checkRes.ok) {
      console.error("Failed to check user existence");
      return;
    }

    const existingUser = await checkRes.json();

    if (existingUser?.user) {
      console.log("User already exists, skipping creation:", existingUser.user);
      return existingUser.user;
    }

    // On your laptop, if using an emulator localhost points to your machine. Use: http://localhost:8000
    // On your phone, localhost points to the phone itself — and your Node.js server isn’t running there. Use: http://<your ip address which can be found with command in terminal: 'ipconfig getifaddr en0'>:8000
    // const res = await fetch(`http://localhost:8000/api/users`, {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, clerkId }),
      }
    );
    
    if (!res.ok) {
      console.error("User creation failed");
      return;
    }

    return await res.json();
  } catch (err) {
    console.error("Failed to create user:", err);
    throw err;
  }
};

export const updateUser = async (
  email: string,
  clerkId: string,
  firstName: string
) => {
  try {
    if (!email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // On your laptop, if using an emulator localhost points to your machine. Use: http://localhost:8000
    // On your phone, localhost points to the phone itself — and your Node.js server isn’t running there. Use: http://<your ip address which can be found with command in terminal: 'ipconfig getifaddr en0'>:8000
    // const res = await fetch(`http://localhost:8000/api/users`, {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/users`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, clerkId, firstName }),
      }
    );
    return await res.json();
  } catch (err) {
    console.error("Failed to update user:", err);
    throw err;
  }
};

export const deleteUser = async (email: string, clerkId: string) => {
  try {
    if (!email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // On your laptop, if using an emulator localhost points to your machine. Use: http://localhost:8000
    // On your phone, localhost points to the phone itself — and your Node.js server isn’t running there. Use: http://<your ip address which can be found with command in terminal: 'ipconfig getifaddr en0'>:8000
    // const res = await fetch(`http://localhost:8000/api/users`, {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/users`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, clerkId }),
      }
    );
    return await res.json();
  } catch (err) {
    console.error("Failed to delete user:", err);
    throw err;
  }
};
