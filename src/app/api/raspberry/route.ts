import { NextResponse } from "next/server";

export type TeamClickActionApi = {
  teamId: string;
  timestamp: string;
};

type PostRequest = {
  action: {
    type: "reset" | "trykk";
    id: string;
  };
};
// Temporary in-memory storage
const listOfCurrentPlayersClicked: TeamClickActionApi[] = [];

export async function POST(request: Request) {
  try {
    const { action } = (await request.json()) as PostRequest;

    const timestamp = Date.now().toString();

    if (action.type === "reset") {
      listOfCurrentPlayersClicked.length = 0;
      return NextResponse.json({ message: "Reset successful" });
    } else {
      const teamId = action.id;

      if (!teamId) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
      }

      if (ensureOnlyOneTeamClickPerRound({ teamId, timestamp })) {
        listOfCurrentPlayersClicked.push({ teamId, timestamp });
      }

      return NextResponse.json({
        listOfCurrentPlayersClicked,
      });
    }
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
  if (listOfCurrentPlayersClicked.length === 0) {
    return NextResponse.json([]);
  }

  return NextResponse.json(listOfCurrentPlayersClicked);
}

const ensureOnlyOneTeamClickPerRound = (newClick: TeamClickActionApi) => {
  const teamsThatWantToAnswer = listOfCurrentPlayersClicked.map(
    (action) => action.teamId
  );
  if (listOfCurrentPlayersClicked.length > 0) {
    if (teamsThatWantToAnswer.includes(newClick.teamId)) {
      return false;
    }
  }
  return true;
};
