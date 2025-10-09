"use client";

import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import { usePost } from "@/hooks/useApi";
import { IQuiz } from "@/lib/content-models"; // Assuming these are defined correctly
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/authProvider";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function CreateQuizPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [quizData, setQuizData] = useState<IQuiz>({
    _id: "",
    title: "",
    description: "",
    duration: 30,
    passingScore: 70,
    language: "en",
    questions: [
      {
        question: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
        explanation: "",
        points: 5,
        category: "",
        difficulty: "easy",
        language: "en",
      },
    ],
  });

  const { mutate: createQuiz } = usePost("/quiz/create-with-questions", [
    "quiz",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Handle input change for quiz questions and options
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    questionIndex: number,
    optionIndex: number
  ) => {
    const { name, value } = e.target;
    const updatedQuestions = [...quizData.questions];

    if (name === "question") {
      updatedQuestions[questionIndex].question = value;
    } else if (name === "option") {
      updatedQuestions[questionIndex].options[optionIndex].text = value;
    } else if (name === "isCorrect" && e.target instanceof HTMLSelectElement) {
      updatedQuestions[questionIndex].options[optionIndex].isCorrect =
        value === "correct";
    } else if (name === "explanation") {
      updatedQuestions[questionIndex].explanation = value;
    } else if (name === "points") {
      updatedQuestions[questionIndex].points = parseInt(value, 10);
    } else if (name === "category") {
      updatedQuestions[questionIndex].category = value;
    } else if (name === "difficulty") {
      updatedQuestions[questionIndex].difficulty = value as
        | "easy"
        | "medium"
        | "hard";
    }

    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  // Add new question to the quiz
  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          question: "",
          options: [{ text: "", isCorrect: false }],
          explanation: "",
          points: 5,
          category: "",
          difficulty: "easy",
          language: "en",
        },
      ],
    });
  };

  // Remove a question
  const removeQuestion = (questionIndex: number) => {
    const updatedQuestions = quizData.questions.filter(
      (_, index) => index !== questionIndex
    );
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  // Add a new option to a question
  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options.push({
      text: "",
      isCorrect: false,
    });
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  // Remove an option from a question
  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...quizData.questions];
    if (updatedQuestions[questionIndex].options.length > 1) {
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      setQuizData({ ...quizData, questions: updatedQuestions });
    } else {
      toast.error("A question must have at least one option.");
    }
  };

  // Handle quiz form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quizData.title || !quizData.questions.every((q) => q.question)) {
      toast.error("Please fill in all fields.");
      return;
    }

    const submitQuizData = {
      title: quizData.title,
      description: quizData.description,
      duration: quizData.duration,
      passingScore: quizData.passingScore,
      language: "en",
      questions: [
        ...quizData.questions.map((q) => ({
          question: q.question,
          options: q.options.map((o) => ({
            text: o.text,
            isCorrect: o.isCorrect,
          })),
          explanation: q.explanation,
          points: q.points,
          category: q.category,
          difficulty: q.difficulty,
        })),
      ],
    };

    // Call the API to create the quiz
    try {
      await createQuiz(submitQuizData);
      toast.success("Quiz created successfully!");
      router.push(`/${user?.role}/quizzes`);
      // Reset the form after success
      setQuizData({
        _id: "",
        title: "",
        description: "",
        duration: 30,
        passingScore: 70,
        language: "en",
        questions: [
          {
            question: "",
            options: [{ text: "", isCorrect: false }],
            explanation: "",
            points: 5,
            category: "",
            difficulty: "easy",
            language: "en",
          },
        ],
      });
    } catch (error) {
      toast.error("Failed to create quiz. Please try again.");
    }
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {" "}
      <div className="space-y-6 w-full p-4">
        {/* Quiz Form */}
        <div>
          <h2 className="text-xl font-semibold">Create a Quiz</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block">Quiz Title</label>
              <input
                type="text"
                name="title"
                value={quizData.title}
                onChange={(e) =>
                  setQuizData({ ...quizData, title: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Enter the quiz title"
                required
              />
            </div>

            <div>
              <label className="block">Quiz Description</label>
              <input
                type="text"
                name="description"
                value={quizData.description}
                onChange={(e) =>
                  setQuizData({ ...quizData, description: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Enter the quiz description"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={quizData.duration}
                onChange={(e) =>
                  setQuizData({ ...quizData, duration: Number(e.target.value) })
                }
                className="w-full p-2 border rounded"
                placeholder="Enter duration in minutes"
                min={1}
                required
              />
            </div>

            {/* Passing Score */}
            <div>
              <label className="block">Passing Score (%)</label>
              <input
                type="number"
                name="passingScore"
                value={quizData.passingScore}
                onChange={(e) =>
                  setQuizData({
                    ...quizData,
                    passingScore: Number(e.target.value),
                  })
                }
                className="w-full p-2 border rounded"
                placeholder="Enter passing score in percentage"
                min={0}
                max={100}
                required
              />
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <label className="block">Questions</label>
              {quizData.questions.map((question, qIndex) => (
                <div key={qIndex} className="space-y-4">
                  {/* Question Text */}
                  <input
                    type="text"
                    name="question"
                    value={question.question}
                    onChange={(e) => handleInputChange(e, qIndex, -1)}
                    className="w-full p-2 border rounded"
                    placeholder={`Question ${qIndex + 1}`}
                    required
                  />

                  {/* Options */}
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-2">
                      <input
                        type="text"
                        name="option"
                        value={option.text}
                        onChange={(e) => handleInputChange(e, qIndex, oIndex)}
                        className="p-2 border rounded w-full"
                        placeholder={`Option ${oIndex + 1}`}
                        required
                      />
                      <select
                        name="isCorrect"
                        value={option.isCorrect ? "correct" : "incorrect"}
                        onChange={(e) => handleInputChange(e, qIndex, oIndex)}
                        className="p-2 border rounded"
                      >
                        <option value="incorrect">Incorrect</option>
                        <option value="correct">Correct</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        -
                      </button>

                      {oIndex === question.options.length - 1 && (
                        <button
                          type="button"
                          onClick={() => addOption(qIndex)}
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          +
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Explanation, Points, Category, Difficulty */}
                  <div>
                    <label className="block">Explanation</label>
                    <textarea
                      name="explanation"
                      value={question.explanation}
                      onChange={(e) => handleInputChange(e, qIndex, -1)}
                      className="w-full p-2 border rounded"
                      placeholder="Explanation for the question"
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <div>
                      <label className="block">Points</label>
                      <input
                        type="number"
                        name="points"
                        value={question.points}
                        onChange={(e) => handleInputChange(e, qIndex, -1)}
                        className="w-full p-2 border rounded"
                        placeholder="Points for the question"
                        min={1}
                        required
                      />
                    </div>

                    <div>
                      <label className="block">Category</label>
                      <input
                        type="text"
                        name="category"
                        value={question.category}
                        onChange={(e) => handleInputChange(e, qIndex, -1)}
                        className="w-full p-2 border rounded"
                        placeholder="Category"
                        required
                      />
                    </div>

                    <div>
                      <label className="block">Difficulty</label>
                      <select
                        name="difficulty"
                        value={question.difficulty}
                        onChange={(e) => handleInputChange(e, qIndex, -1)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Remove Question
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addQuestion}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Add Question
              </button>
            </div>

            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Create Quiz
            </button>
          </form>
        </div>
      </div>
    </Suspense>
  );
}
