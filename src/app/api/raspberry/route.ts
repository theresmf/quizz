import { NextResponse } from "next/server";

type ButtonAction = {
  id: string;
  timestamp: string;
};

// Temporary in-memory storage
const temporaryList: ButtonAction[] = [];

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { id, timestamp } = await request.json();

    if (!id || !timestamp) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Add the action to the temporary list
    temporaryList.push({ id, timestamp });

    // Return success
    return NextResponse.json({ message: "Action added", list: temporaryList });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET request to retrieve the current list
export async function GET() {
  if (temporaryList.length === 0) {
    console.error("temporaryList is empty!");
    return NextResponse.json([]);
  }

  const plainList = temporaryList.map(({ id, timestamp }) => ({
    id: String(id), // Ensure ID is a string
    timestamp: String(timestamp), // Ensure timestamp is a string
  }));

  return NextResponse.json(plainList);
}
