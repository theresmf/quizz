import { NextResponse } from "next/server";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const COLLECTION_NAME = "teamClicks";

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

// Fetch all team clicks from Firestore
const fetchTeamClicks = async (): Promise<TeamClickActionApi[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  const currentClicks = snapshot.docs.map(
    (doc) => doc.data() as TeamClickActionApi
  );
  currentClicks.sort(
    (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)
  );
  return snapshot.docs.map((doc) => doc.data() as TeamClickActionApi);
};

// Add a team click to Firestore
const addTeamClick = async (teamClick: TeamClickActionApi) => {
  const currentClicks = await fetchTeamClicks();
  if (currentClicks.some((click) => click.teamId === teamClick.teamId)) {
    return;
  }
  await addDoc(collection(db, COLLECTION_NAME), teamClick);
};

// Reset all team clicks in Firestore
const resetTeamClicks = async () => {
  const q = query(collection(db, COLLECTION_NAME));
  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
};

export async function POST(request: Request) {
  try {
    const { action } = (await request.json()) as PostRequest;
    const timestamp = Date.now().toString();

    if (action.type === "reset") {
      await resetTeamClicks(); // Reset Firestore collection
      return NextResponse.json({ message: "Reset successful" });
    } else if (action.type === "trykk") {
      const teamId = action.id;

      if (!teamId) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
      }

      const existingClicks = await fetchTeamClicks();
      const teamAlreadyClicked = existingClicks.some(
        (click) => click.teamId === teamId
      );

      if (!teamAlreadyClicked) {
        await addTeamClick({ teamId, timestamp });
      }

      const updatedClicks = await fetchTeamClicks();
      return NextResponse.json({ listOfCurrentPlayersClicked: updatedClicks });
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
  try {
    const teamClicks = await fetchTeamClicks();
    return NextResponse.json(teamClicks);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
