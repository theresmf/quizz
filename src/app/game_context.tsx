"use client";

import React, { createContext, useContext, useState } from "react";

type Question = {
  id: number;
  value: number;
  question: string;
  answer: string;
  image: string | null;
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
  revealedQuestions: Set<string>;
  setRevealedQuestions: React.Dispatch<React.SetStateAction<Set<string>>>;
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

const questionsQuotes = [
  {
    id: 12335,
    value: 200,
    image: null,
    question:
      "Han som sa: “Det er egentlig litt behagelig å jobbe i Lovisa også. Man kan være litt mer skjetten der inne når alt er skjettent rundt dæ.”",
    categories: ["quotes"],
    answer: "Tor Martin",
  },
  {
    id: 12336,
    value: 400,
    image: null,
    question: "Jeg er forræder by default",
    categories: ["quotes"],
    answer: "Janniche",
  },
  {
    id: 12337,
    value: 600,
    image: null,
    question:
      "Mine grunnleggende behov e mat, vann, vindussete og priority boarding",
    categories: ["quotes"],
    answer: "Runar",
  },
  {
    id: 12338,
    value: 800,
    image: null,
    question:
      "Han som spurte Johannes:\n'Kan vi ikke bare bruke sånn derre Moscow Mule til å predikere?'",
    categories: ["quotes"],
    answer: "Lars",
  },
];

const questionsSongs = [
  {
    id: 22335,
    value: 200,
    image: null,
    question:
      "Julesangen som på svensk oversettes til: ”Att julen är roligast för alla som är små, om ingen går i fällan och aktar sig för den, ska alla nästa år få fira jul igen.”",
    categories: ["songs"],
    answer: "Musevisa",
  },
  {
    id: 22336,
    value: 400,
    image: null,
    question:
      "Julesangen som på tysk oversettes til: “Fröhliche Weihnachten, Fröhliche Weihnachten, Ich wünsche dir fröhliche Weihnachten, Ich wünsche dir fröhliche Weihnachten, Und ein glückliches neues Jahr.”",
    categories: ["songs"],
    answer: "Feliz navidad",
  },
  {
    id: 22337,
    value: 600,
    image: null,
    question:
      "Julesangen som på nederlandsk oversettes til: “Nu branden duizend kerstlichten, Overal in de stad, Met vreugde en liefde, Kerstdagen zijn zo fijn!”",
    categories: ["songs"],
    answer: "Nå tennes tusen julelys",
  },
  {
    id: 22338,
    value: 800,
    image: null,
    question:
      "Julesangen som på fransk oversettes til: “Vive le vent, vive le vent, Vive le vent d'hiver, Qui rapporte aux vieux enfants Leurs souvenirs d'hier. Vive le vent, vive le vent, Vive le vent d'hiver.”",
    categories: ["songs"],
    answer: "Jingle bells",
  },
];

const questionsProduct = [
  {
    id: 22445,
    value: 200,
    image: null,
    question:
      "Hvert smart produktteams sin flittige assistent som slaver natt og dag for å besvare all verdens spørsmål ",
    categories: ["product"],
    answer: "ChatGPT",
  },
  {
    id: 22446,
    value: 400,
    image: null,
    question:
      "En visuell metode som hjelper team å navigere produktutforskning som gifter seg fint med vin",
    categories: ["product"],
    answer: "OST",
  },
  {
    id: 22447,
    value: 600,
    image: null,
    question:
      "Ett banebrytende rammeverk med fokus på hyppige leveranser på tom mage",
    categories: ["product"],
    answer: "PIL (prod innen lunsj)",
  },
  {
    id: 22448,
    value: 800,
    image: null,
    question:
      "Guru designmetode som hver seriøse produktutvikler skyr som pesten",
    categories: ["product"],
    answer: "I-design",
  },
];

export const JeopardyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  /* Question management */
  const [categories, setCategories] = useState<Category[]>([
    { questions: questionsBilde, name: "Hvem er dette?" },
    { questions: questionsQuotes, name: "Gullkorn" },
    { questions: questionsSongs, name: "Julesanger" },
    { questions: questionsProduct, name: "Produktutvikling" },
  ]);

  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([
    ...questionsBilde,
    ...questionsQuotes,
    ...questionsSongs,
    ...questionsProduct,
  ]);

  /* Player management*/
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

  const [revealedQuestions, setRevealedQuestions] = useState<Set<string>>(
    new Set()
  );

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
        revealedQuestions,
        setRevealedQuestions,
      }}
    >
      {children}
    </JeopardyContext.Provider>
  );
};
