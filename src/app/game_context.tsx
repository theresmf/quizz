"use client";

import React, { createContext, useContext, useState } from "react";

type Question = {
  id: number;
  value: number;
  question: string;
  answer: string;
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

export const JeopardyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([
    {
      id: 1,
      value: 200,
      question: "What is React?",
      answer: "A JavaScript library for building user interfaces",
      categories: ["React", "JavaScript"],
    },
    {
      id: 2,
      value: 400,
      question: "What is JSX?",
      answer: "A syntax extension for JavaScript used with React",
      categories: ["React", "JavaScript"],
    },
    {
      id: 3,
      value: 600,
      question: "What is a React component?",
      answer: "A reusable piece of UI in React",
      categories: ["React"],
    },
    {
      id: 4,
      value: 800,
      question: "What is the virtual DOM?",
      answer:
        "A lightweight copy of the actual DOM used by React for performance optimization",
      categories: ["React"],
    },
    {
      id: 5,
      value: 1000,
      question: "What are React Hooks?",
      answer:
        "Functions that let you use state and other React features in functional components",
      categories: ["React"],
    },
    {
      id: 6,
      value: 200,
      question: "What is Node.js?",
      answer: "A JavaScript runtime built on Chrome's V8 JavaScript engine",
      categories: ["JavaScript", "Backend"],
    },
    {
      id: 7,
      value: 400,
      question: "What is Express.js?",
      answer: "A minimal and flexible Node.js web application framework",
      categories: ["JavaScript", "Backend"],
    },
    {
      id: 8,
      value: 600,
      question: "What is MongoDB?",
      answer: "A document-oriented NoSQL database",
      categories: ["Database"],
    },
    {
      id: 9,
      value: 800,
      question: "What is GraphQL?",
      answer:
        "A query language for APIs and a runtime for executing those queries",
      categories: ["API", "Backend"],
    },
    {
      id: 10,
      value: 1000,
      question: "What is Docker?",
      answer:
        "A platform for developing, shipping, and running applications in containers",
      categories: ["DevOps"],
    },
  ]);
  const [players, setPlayers] = useState<Player[]>([]);

  return (
    <JeopardyContext.Provider
      value={{
        categories,
        setCategories,
        availableQuestions,
        setAvailableQuestions,
        players,
        setPlayers,
      }}
    >
      {children}
    </JeopardyContext.Provider>
  );
};
