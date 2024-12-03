import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TreePine, Gift, Snowflake, X, Bell, Star } from "lucide-react";
import { useJeopardyContext } from "../game_context";

export default function PlayerManagement() {
  const router = useRouter();
  const { players, addPlayer, removePlayer } = useJeopardyContext();
  const [newPlayerName, setNewPlayerName] = useState("");

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName);
      setNewPlayerName("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-red-700 to-green-800 text-white">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-300 flex items-center">
            <Bell className="mr-4 h-10 w-10" />
            Christmas Jeopardy: Player Management
            <Bell className="ml-4 h-10 w-10" />
          </h1>
          <Button
            variant="outline"
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => router.push("/")}
          >
            <TreePine className="mr-2 h-4 w-4" />
            Back to Game
          </Button>
        </div>

        <Card className="bg-red-800 mb-8 border-4 border-yellow-300">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-yellow-300 flex items-center justify-center">
              <Gift className="mr-2 h-6 w-6" /> Manage Players{" "}
              <Gift className="ml-2 h-6 w-6" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                placeholder="New player name"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddPlayer()}
                className="bg-white text-red-900"
              />
              <Button
                onClick={handleAddPlayer}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Star className="mr-2 h-4 w-4" />
                Add Player
              </Button>
            </div>
            <div className="space-y-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-green-700 p-2 rounded"
                >
                  <span className="flex items-center">
                    <Snowflake className="mr-2 h-4 w-4" />
                    {player.name}
                  </span>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removePlayer(player.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
