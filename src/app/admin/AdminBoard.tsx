"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJeopardyContext } from "../game_context";

type Question = {
  id: number;
  value: number;
  question: string;
  answer: string;
  categories: string[];
};

export default function AdminBoard() {
  const {
    categories,
    setCategories,
    availableQuestions,
    setAvailableQuestions,
  } = useJeopardyContext();

  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(availableQuestions.flatMap((q) => q.categories))
    );
    setAvailableCategories(uniqueCategories);
  }, [availableQuestions]);

  const addCategory = (categoryName: string) => {
    if (categoryName && !categories.some((cat) => cat.name === categoryName)) {
      setCategories([...categories, { name: categoryName, questions: [] }]);
    }
  };

  const removeCategory = (categoryName: string) => {
    setCategories(categories.filter((cat) => cat.name !== categoryName));
  };

  const addQuestionToCategory = (categoryName: string, question: Question) => {
    setCategories(
      categories.map((cat) =>
        cat.name === categoryName
          ? { ...cat, questions: [...cat.questions, question] }
          : cat
      )
    );
    setAvailableQuestions(
      availableQuestions.filter((q) => q.id !== question.id)
    );
  };

  const removeQuestionFromCategory = (
    categoryName: string,
    questionId: number
  ) => {
    const removedQuestion = categories
      .find((cat) => cat.name === categoryName)
      ?.questions.find((q) => q.id === questionId);

    if (removedQuestion) {
      setCategories(
        categories.map((cat) =>
          cat.name === categoryName
            ? {
                ...cat,
                questions: cat.questions.filter((q) => q.id !== questionId),
              }
            : cat
        )
      );
      setAvailableQuestions([...availableQuestions, removedQuestion]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-300">Jeopardy Admin</h1>
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
            Manage Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Select onValueChange={addCategory}>
              <SelectTrigger className="bg-white text-purple-900">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories
                  .filter((cat) => !categories.some((c) => c.name === cat))
                  .map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => {}}
              className="bg-green-500 hover:bg-green-600"
            >
              Add Category
            </Button>
          </div>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between bg-blue-600 p-2 rounded"
              >
                <span>{category.name}</span>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => setEditingCategory(category.name)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeCategory(category.name)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {categories.map((category) => (
          <Card key={category.name} className="bg-purple-700">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-yellow-300">
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((question, index) => (
                  <AccordionItem key={question.id} value={`item-${index}`}>
                    <AccordionTrigger className="text-white">
                      ${question.value}: {question.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-yellow-200">
                      <p className="mb-2">{question.answer}</p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          removeQuestionFromCategory(category.name, question.id)
                        }
                      >
                        Remove Question
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Button
                variant="outline"
                className="mt-4 bg-blue-500 hover:bg-blue-600"
                onClick={() => setEditingCategory(category.name)}
              >
                Add Question
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={editingCategory !== null}
        onOpenChange={() => setEditingCategory(null)}
      >
        <DialogContent className="bg-purple-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-yellow-300">
              Edit Category: {editingCategory}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="question-select" className="text-white">
              Select a question to add
            </Label>
            <Select
              onValueChange={(value) => {
                const question = availableQuestions.find(
                  (q) => q.id === parseInt(value)
                );
                if (question && editingCategory) {
                  addQuestionToCategory(editingCategory, question);
                }
              }}
            >
              <SelectTrigger className="bg-white text-purple-900">
                <SelectValue placeholder="Select a question" />
              </SelectTrigger>
              <SelectContent>
                {availableQuestions
                  .filter((q) => q.categories.includes(editingCategory || ""))
                  .map((question) => (
                    <SelectItem
                      key={question.id}
                      value={question.id.toString()}
                    >
                      ${question.value}: {question.question}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCategory(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
