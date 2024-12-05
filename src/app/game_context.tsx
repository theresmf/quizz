"use client";

import React, { createContext, useContext, useState } from "react";

type Question = {
  id: number;
  value: number;
  question: string;
  answer: string;
  image: string;
  categories: string[];
};

type Category = {
  name: string;
  questions: Question[];
};

export type Player = {
  id: number;
  name: string;
  score: number;
};

type JeopardyContextType = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  availableQuestions: Question[];
  setAvailableQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  addPlayer: (name: string) => void;
  removePlayer: (id: number) => void;
  updateScore: (id: number, points: number) => void;
};

const JeopardyContext = createContext<JeopardyContextType | undefined>(
  undefined
);

export const useJeopardyContext = () => {
  const context = useContext(JeopardyContext);
  if (context === undefined) {
    throw new Error(
      "useJeopardyContext must be used within a JeopardyProvider"
    );
  }
  return context;
};

const questionsBilde = [
  {
    id: 12345,
    value: 200,
    image: "/pictures/Level1.png",
    question: "Hvem er dette?",
    categories: ["bilde"],
    answer: "Gøril og Grinchen",
  },
  {
    id: 12346,
    value: 400,
    image: "/pictures/Level2.png",
    question: "Hvem er dette?",
    categories: ["bilde"],
    answer: "Markus, Jostein og Rudolf",
  },
  {
    id: 12347,
    value: 600,
    image: "/pictures/Level3.png",
    question: "Hvem er dette?",
    categories: ["bilde"],
    answer: "Kevin McCallister, Emil Telstad og John McClane",
  },
  {
    id: 12348,
    value: 800,
    image: "/pictures/Level4.png",
    question: "Hvem er dette?",
    categories: ["bilde"],
    answer: "Vilde, Anne Marie, Gizmo og David",
  },
];

export const JeopardyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<Category[]>([
    { questions: questionsBilde, name: "Hvem er dette?" },
  ]);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([
    {
      id: 12345,
      value: 200,
      image: "/pictures/Level1.png",
      question: "Hvem er dette?",
      categories: ["bilde"],
      answer: "Gøril og Grinchen",
    },
    {
      id: 12346,
      value: 400,
      image: "pictures/Level2.png",
      question: "Hvem er dette?",
      categories: ["bilde"],
      answer: "Markus, Jostein og Rudolf",
    },
    {
      id: 12347,
      value: 600,
      image: "pictures/Level3.png",
      question: "Hvem er dette?",
      categories: ["bilde"],
      answer: "Kevin McCallister, Emil Telstad og John McClane",
    },
    {
      id: 12348,
      value: 800,
      image: "pictures/Level4.png",
      question: "Hvem er dette?",
      categories: ["bilde"],
      answer: "Vilde, Anne Marie, Gizmo og David",
    },
  ]);
  const [players, setPlayers] = useState<Player[]>([]);
  const addPlayer = (name: string) => {
    if (name.trim()) {
      setPlayers((prevPlayers) => [
        ...prevPlayers,
        { id: prevPlayers.length + 1, name: name.trim(), score: 0 },
      ]);
    }
  };

  const removePlayer = (id: number) => {
    setPlayers((prevPlayers) =>
      prevPlayers.filter((player) => player.id !== id)
    );
  };

  const updateScore = (id: number, points: number) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === id ? { ...player, score: player.score + points } : player
      )
    );
  };

  return (
    <JeopardyContext.Provider
      value={{
        categories,
        setCategories,
        availableQuestions,
        setAvailableQuestions,
        players,
        setPlayers,
        addPlayer,
        removePlayer,
        updateScore,
      }}
    >
      {children}
    </JeopardyContext.Provider>
  );
};
