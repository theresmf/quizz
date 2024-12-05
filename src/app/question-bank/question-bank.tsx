"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { X, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Question = {
  id: number;
  value: number;
  question: string;
  answer: string;
  categories: string[];
  image: string;
};

export default function QuestionBank() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<Omit<Question, "id">>({
    value: 200,
    question: "",
    answer: "",
    categories: [],
    image: "",
  });
  const [newCategory, setNewCategory] = useState("");
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const router = useRouter();

  const addQuestion = () => {
    if (newQuestion.question && newQuestion.answer) {
      setQuestions([...questions, { ...newQuestion, id: Date.now() }]);
      setNewQuestion({
        value: 200,
        question: "",
        answer: "",
        categories: [],
        image: "",
      });
    }
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const addCategory = () => {
    if (newCategory && !newQuestion.categories.includes(newCategory)) {
      setNewQuestion({
        ...newQuestion,
        categories: [...newQuestion.categories, newCategory],
      });
      setNewCategory("");
    }
  };

  const removeCategory = (category: string) => {
    setNewQuestion({
      ...newQuestion,
      categories: newQuestion.categories.filter((c) => c !== category),
    });
  };

  const toggleFilterCategory = (category: string) => {
    setFilterCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const allCategories = Array.from(
    new Set(questions.flatMap((q) => q.categories))
  );

  const filteredQuestions = questions.filter(
    (q) =>
      filterCategories.length === 0 ||
      q.categories.some((c) => filterCategories.includes(c))
  );

  return (
    <div className="p5">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-300">Question Bank</h1>
        <Button
          variant="outline"
          className="bg-yellow-400 text-purple-900 hover:bg-yellow-300"
          onClick={() => router.push("/game-board")}
        >
          Back to Game
        </Button>
      </div>

      <Card className="bg-purple-700 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-yellow-300">
            Add New Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="number"
                value={newQuestion.value}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    value: parseInt(e.target.value),
                  })
                }
                className="bg-white text-purple-900"
              />
            </div>
            <div>
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={newQuestion.question}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, question: e.target.value })
                }
                className="bg-white text-purple-900"
              />
            </div>
            <div>
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={newQuestion.answer}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, answer: e.target.value })
                }
                className="bg-white text-purple-900"
              />
            </div>
            <div>
              <Label htmlFor="category">Categories</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="bg-white text-purple-900"
                />
                <Button onClick={addCategory} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newQuestion.categories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="bg-blue-500"
                  >
                    {category}
                    <button
                      onClick={() => removeCategory(category)}
                      className="ml-2 text-xs"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <Button onClick={addQuestion} className="w-full">
              Add Question
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-300">
          Filter by Categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category) => (
            <Badge
              key={category}
              variant={
                filterCategories.includes(category) ? "default" : "secondary"
              }
              className="cursor-pointer"
              onClick={() => toggleFilterCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className="bg-blue-600">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-yellow-300">
                ${question.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">
                <strong>Question:</strong> {question.question}
              </p>
              <p className="mb-2">
                <strong>Answer:</strong> {question.answer}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {question.categories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="bg-purple-500"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              <Button
                variant="destructive"
                onClick={() => removeQuestion(question.id)}
              >
                Remove Question
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
