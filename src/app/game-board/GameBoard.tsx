"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Minus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Player, useJeopardyContext } from "../game_context";
import { useQuery } from "@tanstack/react-query";

type ButtonAction = {
  id: number;
  timestamp: number;
};

const fetchButtonActions = async (): Promise<ButtonAction[]> => {
  const res = await fetch("/api/raspberry", { method: "GET" });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();

  console.log("data", data);
  return data;
};

export default function GameBoard() {
  const { categories, players, setPlayers } = useJeopardyContext();
  const router = useRouter();
  const [revealedQuestions, setRevealedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [newPlayerName, setNewPlayerName] = useState("");

  const [activeQuestion, setActiveQuestion] = useState<{
    value: number;
    categoryIndex: number;
    questionIndex: number;
  } | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(
    new Set()
  );

  const handleReveal = (
    categoryIndex: number,
    questionIndex: number,
    value: number
  ) => {
    setRevealedQuestions((prev) =>
      new Set(prev).add(`${categoryIndex}-${questionIndex}`)
    );
    setActiveQuestion({ value, categoryIndex, questionIndex });
  };

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers((prevPlayers) => [
        ...prevPlayers,
        { id: prevPlayers.length + 1, name: newPlayerName.trim(), score: 0 },
      ]);
      setNewPlayerName("");
    }
  };

  const removePlayer = (id: number) => {
    setPlayers((prevPlayers) =>
      prevPlayers.filter((player) => player.id !== id)
    );
  };

  const updateScore = (playerId: number, points: number) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId
          ? { ...player, score: player.score + points }
          : player
      )
    );
  };

  const revealAnswer = (categoryIndex: number, questionIndex: number) => {
    setRevealedAnswers((prev) =>
      new Set(prev).add(`${categoryIndex}-${questionIndex}`)
    );
  };

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-purple-600 to-blue-600 min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold text-center text-yellow-300 drop-shadow-lg">
          Bekk Christmas Quiz
        </h1>
        <Button
          variant="outline"
          className="bg-yellow-400 text-purple-900 hover:bg-yellow-300"
          onClick={() => router.push("/")}
        >
          Admin
        </Button>
        <Link href="/question-bank">
          <Button
            variant="outline"
            className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 ml-2"
          >
            Question Bank
          </Button>
        </Link>
      </div>

      {/* Player Management */}
      <div className="mb-8 bg-purple-700 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-300">Players</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center gap-2 bg-blue-500 p-2 rounded-md shadow"
            >
              <span className="font-semibold">
                {player.name}: ${player.score}
              </span>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removePlayer(player.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="New player name"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addPlayer()}
            className="bg-white text-purple-900"
          />
          <Button
            onClick={addPlayer}
            className="bg-yellow-400 text-purple-900 hover:bg-yellow-300"
          >
            Add Player
          </Button>
        </div>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category, categoryIndex) => (
          <div key={category.name} className="space-y-4">
            <h2 className="text-xl font-semibold text-center bg-yellow-400 text-purple-900 p-2 rounded-t-lg shadow">
              {category.name}
            </h2>
            {category.questions.map((item, questionIndex) => (
              <Dialog key={`${categoryIndex}-${questionIndex}`}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-20 text-2xl font-bold bg-blue-500 hover:bg-blue-400 text-white border-2 border-yellow-400"
                    onClick={() =>
                      handleReveal(categoryIndex, questionIndex, item.value)
                    }
                    disabled={revealedQuestions.has(
                      `${categoryIndex}-${questionIndex}`
                    )}
                  >
                    {revealedQuestions.has(`${categoryIndex}-${questionIndex}`)
                      ? "Revealed"
                      : `$${item.value}`}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-purple-700 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-yellow-300">
                      ${item.value} Question
                    </DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-lg font-semibold mb-4">
                      {item.question}
                    </p>
                    {revealedAnswers.has(
                      `${categoryIndex}-${questionIndex}`
                    ) ? (
                      <p className="text-yellow-300 font-bold mt-4">
                        {item.answer}
                      </p>
                    ) : (
                      <Button
                        onClick={() =>
                          revealAnswer(categoryIndex, questionIndex)
                        }
                        className="w-full mt-2 bg-blue-500 hover:bg-blue-400"
                      >
                        Reveal Answer
                      </Button>
                    )}
                  </div>
                  {players.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2 text-yellow-300">
                        Assign Points
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {players.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center justify-between bg-blue-600 p-2 rounded"
                          >
                            <span>{player.name}</span>
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() =>
                                  updateScore(player.id, item.value)
                                }
                                className="bg-green-500 hover:bg-green-400"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() =>
                                  updateScore(player.id, -item.value)
                                }
                                className="bg-red-500 hover:bg-red-400"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ))}
      </div>
      {/* Team Boxes */}
      <TeamBoxes players={players}></TeamBoxes>
    </div>
  );
}

interface TeamBoxes {
  players: Player[];
}

const TeamBoxes = ({ players }: TeamBoxes) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["buttonActions"], // The unique key for this query
    queryFn: fetchButtonActions, // The function to fetch data
    refetchInterval: 100, // Poll every second
  });

  if (error) {
    console.error("Query Error:", error);
  }

  const transformedData =
    data != undefined
      ? data.map((action) => {
          return {
            ...action,
            id: Number(action.id),
            timestamp: Number(action.timestamp),
          };
        })
      : [];

  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {players.map((player) => (
        <div
          key={player.id}
          className={`bg-yellow-400 border-4 ${getBorderColourForPlayer(
            player.id,
            transformedData
          )}  p-4 rounded-lg shadow-lg`}
        >
          <h3 className="text-xl font-bold text-purple-900 text-center">
            {player.name}
          </h3>
        </div>
      ))}
    </div>
  );
};

const getBorderColourForPlayer = (
  playerId: number,
  rankedList: ButtonAction[] | undefined
): string => {
  if (!rankedList) return ""; // Handle the case where rankedList isn't available

  const rank = rankedList.findIndex((action) => action.id === playerId);

  return getBorderColour(rank);
};

const getBorderColour = (rank: number): string => {
  switch (rank) {
    case 0: // First place
      return "border-10 border-green-900";
    case 1: // Second place
      return "border-10 border-orange-900";
    case 2: // Third place
      return "border-10 border-yellow-900";
    default: // Other places
      return "border-4 border-purple-900";
  }
};
