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
import { TreePine, Gift, Snowflake, Star, Bell } from "lucide-react";
import { useJeopardyContext } from "../game_context";
import PlayerManagement from "../_components/PlayerManagement";

type Question = {
  id: number;
  value: number;
  question: string;
  answer: string;
  categories: string[];
  image: string;
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
            className="bg-red-600 text-white hover:bg-red-700 mr-2"
            onClick={() => router.push("/question-bank")}
          >
            <TreePine className="mr-2 h-4 w-4" />
            Spørsmålsbank
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

      <Card className="bg-red-800 mb-8 border-4 border-yellow-300">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-yellow-300 flex items-center justify-center">
            <Gift className="mr-2 h-6 w-6" /> Manage Categories{" "}
            <Gift className="ml-2 h-6 w-6" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Select onValueChange={addCategory}>
              <SelectTrigger className="bg-white text-red-900">
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
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Star className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between bg-green-700 p-2 rounded"
              >
                <span className="flex items-center">
                  <Snowflake className="mr-2 h-4 w-4" />
                  {category.name}
                </span>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2 bg-yellow-400 text-red-900 hover:bg-yellow-300"
                    onClick={() => setEditingCategory(category.name)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeCategory(category.name)}
                    className="bg-red-600 hover:bg-red-700"
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
          <Card
            key={category.name}
            className="bg-red-800 border-4 border-yellow-300"
          >
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-yellow-300 flex items-center justify-center">
                <Star className="mr-2 h-6 w-6" /> {category.name}{" "}
                <Star className="ml-2 h-6 w-6" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((question, index) => (
                  <AccordionItem key={question.id} value={`item-${index}`}>
                    <AccordionTrigger className="text-white">
                      ${question.value}: {question.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-yellow-300">
                      <p className="mb-2">{question.answer}</p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          removeQuestionFromCategory(category.name, question.id)
                        }
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Remove Question
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Button
                variant="outline"
                className="mt-4 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setEditingCategory(category.name)}
              >
                <Gift className="mr-2 h-4 w-4" />
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
        <DialogContent className="bg-red-800 text-white border-4 border-yellow-300">
          <DialogHeader>
            <DialogTitle className="text-yellow-300 flex items-center justify-center">
              <Gift className="mr-2 h-6 w-6" /> Edit Category: {editingCategory}{" "}
              <Gift className="ml-2 h-6 w-6" />
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
              <SelectTrigger className="bg-white text-red-900">
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
            <Button
              variant="outline"
              onClick={() => setEditingCategory(null)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Snowflake className="mr-2 h-4 w-4" />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <PlayerManagement />
    </div>
  );
}
