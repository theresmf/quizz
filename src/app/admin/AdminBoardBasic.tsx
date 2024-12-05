"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import PlayerManagement from "../_components/PlayerManagement";
import { Bell, TreePine } from "lucide-react";

export default function AdminBoardBasic() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-red-700 to-green-800 min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-300 flex items-center">
          <Bell className="mr-4 h-10 w-10" />
          Admin
          <Bell className="ml-4 h-10 w-10" />
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() =>
              fetch("/api/raspberry", {
                method: "POST",
                body: JSON.stringify({ action: { type: "reset" } }),
              })
            }
          >
            <TreePine className="mr-2 h-4 w-4" />
            Reset call
          </Button>
          <Button
            variant="outline"
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => router.push("/")}
          >
            <TreePine className="mr-2 h-4 w-4" />
            Back to Game
          </Button>
        </div>
      </div>

      <PlayerManagement />
    </div>
  );
}
