import { NextResponse } from "next/server";

type ButtonActionApi = {
  id: string;
  timestamp: string;
};

export type ButtonAction = {
  id: number;
  timestamp: number;
};

// Temporary in-memory storage
const temporaryList: ButtonActionApi[] = [];

export async function POST(request: Request) {
  try {
    const { id, timestamp } = await request.json();

    if (!id || !timestamp) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (ensureOnlyOneActionPerRound({ id, timestamp })) {
      temporaryList.push({ id, timestamp });
    }

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
    id: String(id),
    timestamp: String(timestamp),
  }));

  return NextResponse.json(plainList);
}

const ensureOnlyOneActionPerRound = (newAction: ButtonActionApi) => {
  const teamNumbersThatheardThisQuestion = temporaryList.map(
    (action) => action.id
  );
  if (temporaryList.length > 0) {
    if (teamNumbersThatheardThisQuestion.includes(newAction.id)) {
      return false;
    }
  }
  return true;
};
