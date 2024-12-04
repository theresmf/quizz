"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Minus,
  TreePine,
  Gift,
  Snowflake,
  Star,
  Bell,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Player, useJeopardyContext } from "../game_context";
import { motion, AnimatePresence } from "framer-motion";
import { ButtonAction } from "../api/raspberry/route";

type ConfettiProps = {
  count: number;
};

/* const fetchButtonActions = async (): Promise<ButtonAction[]> => {
  const res = await fetch("/api/raspberry", { method: "GET" });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();

  console.log("data", data);
  return data;
}; */

const SnowflakeBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute text-white opacity-20 animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}%`,
            fontSize: `${Math.random() * 20 + 10}px`,
            animationDuration: `${Math.random() * 10 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

const SnowflakeConfetti: React.FC<ConfettiProps> = ({ count }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute text-white text-4xl"
          initial={{
            opacity: 1,
            top: "50%",
            left: "50%",
            scale: 0,
          }}
          animate={{
            opacity: [1, 1, 0],
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            scale: [0, 1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            ease: "easeOut",
            times: [0, 0.2, 1],
          }}
        >
          ❄
        </motion.div>
      ))}
    </div>
  );
};

export default function JeopardyBoard() {
  const router = useRouter();
  const { categories, players, updateScore } = useJeopardyContext();
  const [revealedQuestions, setRevealedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSnowflakes, setShowSnowflakes] = useState(false);
  useEffect(() => {
    setShowSnowflakes(true);
  }, []);
  const [, setActiveQuestion] = useState<{
    value: number;
    categoryIndex: number;
    questionIndex: number;
  } | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(
    new Set()
  );

  /*   const { data, error } = useQuery({
    queryKey: ["buttonActions"],
    queryFn: fetchButtonActions,
    refetchInterval: 100,
  }); */

  /*   const data = {
    teamId: 1,
    timestamp: Date.now(),
  }; */
  const error = null;

  if (error) {
    console.error("Query Error:", error);
  }

  const transformedData = [] as ButtonAction[];

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

  const revealAnswer = (categoryIndex: number, questionIndex: number) => {
    setRevealedAnswers((prev) =>
      new Set(prev).add(`${categoryIndex}-${questionIndex}`)
    );
  };

  const handleUpdateScore = useCallback(
    (playerId: number, points: number) => {
      updateScore(playerId, points);
      if (points > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
    },
    [updateScore]
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-red-700 to-green-800 text-white">
      {showSnowflakes && <SnowflakeBackground />}
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-center text-yellow-300 drop-shadow-lg flex items-center">
            <Bell className="mr-4 h-12 w-12" />
            Christmas Jeopardy: Web Dev Edition
            <Bell className="ml-4 h-12 w-12" />
          </h1>
          <div>
            <Button
              variant="outline"
              className="bg-red-600 text-white hover:bg-red-700 mr-2"
              onClick={() => router.push("/admin")}
            >
              <TreePine className="mr-2 h-4 w-4" />
              Admin
            </Button>
            <Link href="/players">
              <Button
                variant="outline"
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <Gift className="mr-2 h-4 w-4" />
                Manage Players
              </Button>
            </Link>
          </div>
        </div>

        {/* Jeopardy Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 flex-grow">
          {categories.map((category, categoryIndex) => (
            <div key={category.name} className="space-y-4">
              <h2 className="text-xl font-semibold text-center bg-red-600 text-white p-2 rounded-t-lg shadow border-2 border-yellow-300 flex items-center justify-center">
                <Star className="mr-2 h-4 w-4" />
                {category.name}
                <Star className="ml-2 h-4 w-4" />
              </h2>
              {category.questions.map((item, questionIndex) => (
                <Dialog key={`${categoryIndex}-${questionIndex}`}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-20 text-2xl font-bold bg-green-700 hover:bg-green-600 text-white border-2 border-yellow-300"
                      onClick={() =>
                        handleReveal(categoryIndex, questionIndex, item.value)
                      }
                      disabled={revealedQuestions.has(
                        `${categoryIndex}-${questionIndex}`
                      )}
                    >
                      {revealedQuestions.has(
                        `${categoryIndex}-${questionIndex}`
                      )
                        ? "Revealed"
                        : `$${item.value}`}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-red-800 text-white border-4 border-yellow-300">
                    <DialogHeader>
                      <DialogTitle className="text-yellow-300 flex items-center justify-center">
                        <Gift className="mr-2 h-6 w-6" /> ${item.value} Question{" "}
                        <Gift className="ml-2 h-6 w-6" />
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
                          className="w-full mt-2 bg-green-600 hover:bg-green-500"
                        >
                          Reveal Answer
                        </Button>
                      )}
                    </div>
                    {players.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2 text-yellow-300 flex items-center justify-center">
                          <Gift className="mr-2 h-5 w-5" /> Assign Points{" "}
                          <Gift className="ml-2 h-5 w-5" />
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {players.map((player) => (
                            <div
                              key={player.id}
                              className="flex items-center justify-between bg-green-700 p-2 rounded"
                            >
                              <span>{player.name}</span>
                              <div className="flex gap-1">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() =>
                                    handleUpdateScore(player.id, item.value)
                                  }
                                  className="bg-yellow-400 hover:bg-yellow-300 text-red-900 p-2 rounded"
                                >
                                  <Plus className="h-4 w-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    handleUpdateScore(player.id, -item.value)
                                  }
                                  className="bg-red-500 hover:bg-red-400 text-white p-2 rounded"
                                >
                                  <Minus className="h-4 w-4" />
                                </motion.button>
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
        <TeamBoxes players={players} transformedData={transformedData} />
      </div>

      <AnimatePresence>
        {showConfetti && <SnowflakeConfetti count={50} />}
      </AnimatePresence>
    </div>
  );
}

interface TeamBoxesProps {
  players: Player[];
  transformedData: ButtonAction[];
}

const TeamBoxes = ({ players, transformedData }: TeamBoxesProps) => {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {players.map((player) => {
        const rank = transformedData.findIndex(
          (action) => action.id === player.id
        );
        const isActive = rank !== -1;

        return (
          <motion.div
            key={player.id}
            className={`relative bg-green-700 border-4 ${getBorderColourForPlayer(
              player.id,
              transformedData
            )} p-4 rounded-lg shadow-lg flex items-center justify-between`}
            initial={{ opacity: 0.5, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              boxShadow: isActive
                ? "0 0 20px 5px rgba(255, 255, 255, 0.5)"
                : "none",
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <Snowflake className="text-white mr-2 h-6 w-6" />
              <h3 className="text-xl font-bold text-white">{player.name}</h3>
            </div>
            <div className="text-2xl font-bold text-yellow-300">
              ${player.score}
            </div>
            {isActive && (
              <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-yellow-400 text-red-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl border-2 border-red-900">
                {rank + 1}
              </div>
            )}
          </motion.div>
        );
      })}
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
      return "border-8 border-indigo-900";
    case 1: // Second place
      return "border-8 border-emerald-900";
    case 2: // Third place
      return "border-8 border-yellow-900";
    default: // Other places
      return "border-4 border-purple-900";
  }
};
