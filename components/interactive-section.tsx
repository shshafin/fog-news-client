"use client";

import { useLanguage } from "../providers/language-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useApi, usePatchForPoll } from "@/hooks/useApi";
import { IPoll } from "@/lib/content-models";
import toast from "react-hot-toast";

export default function InteractiveSection() {
  const [score, setScore] = useState(0); // Track the score
  const { language, t } = useLanguage();
  const { data, isLoading, refetch } = useApi<IPoll[]>(["poll"], "/poll");
  const [startQuize, setStartQuize] = useState(false);
  const { data: quizeData, refetch: quizeRef } = useApi<IPoll[]>(
    ["quiz"],
    "/quiz/quizzes"
  );
  const [pollData, setPollData] = useState<IPoll | null>(null);
  const [quiz, setQuiz] = useState<any>(null); // Set mock data for quiz if not fetched
  const [selectedPollOption, setSelectedPollOption] = useState<string>("");
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [pollResults, setPollResults] = useState<any>({});
  const patchPoll = usePatchForPoll(
    (pollId, optionId) => `/poll/${pollId}/vote/${optionId}`,
    ["poll", "votes"]
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the current question
  const [userAnswers, setUserAnswers] = useState<any[]>([]); // Store user's selected answers

  // Fetch poll data from the backend
  useEffect(() => {
    const fetchPollData = async () => {
      await refetch();
      if (data) {
        setPollData(data[0]); // Assuming data[0] contains the current poll
      }
    };
    const fetchQuizData = async () => {
      await quizeRef();
      if (quizeData) {
        setQuiz(quizeData[0]); // Assuming data[0] contains the current poll
      }
    };
    fetchQuizData();
    fetchPollData();
  }, [data, refetch, quizeData, quizeRef]);

  const getTotalVotes = () => {
    return (
      pollData?.options.reduce(
        (total: number, option: any) => total + option.votes,
        0
      ) || 0
    );
  };

  const getPercentage = (votes: number) => {
    const total = getTotalVotes();
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  const handleVote = async () => {
    if (pollData && selectedPollOption) {
      try {
        await patchPoll.mutateAsync({
          pollId: pollData._id!,
          optionId: selectedPollOption, // Pass the optionId
          data: {}, // Add the required data property (empty object if not needed)
        });
        setHasVoted(true);
        await refetch();
        setPollResults(
          pollData.options.reduce((results: any, option: any) => {
            results[option.id] = option.votes;
            return results;
          }, {})
        );
        toast.success("Vote submitted successfully!");
      } catch (error) {
        toast.error("Failed to submit vote.");
      }
    }
  };

  // Handle answer selection for quiz
  const handleAnswerSelect = (answer: any) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setUserAnswers(updatedAnswers);
  };

  // Proceed to the next question
  const nextQuestion = () => {
    if (userAnswers[currentQuestionIndex]) {
      // Calculate score immediately after updating user answer
      const newScore =
        score +
        (userAnswers[currentQuestionIndex].isCorrect
          ? quiz.questions[currentQuestionIndex].points
          : 0);
      setScore(newScore); // Update state with new score

      // If it's the last question, show the final result
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Show the alert with the updated score immediately after the quiz is completed
        toast.success(`Quiz completed! Your score is: ${newScore}`);
        setScore(0); // Reset score for next attempt
        setCurrentQuestionIndex(0); // Reset to the first question for next attempt
        setStartQuize(false); // Reset quiz state
        setUserAnswers([]); // Clear user answers for next attempt
      }
    } else {
      toast.error("Please select an answer.");
    }
  };

  const currentQuestion = quiz?.questions[currentQuestionIndex];

  if (isLoading || !pollData) {
    return <div className="h-64 bg-muted animate-pulse rounded-lg"></div>;
  }

  return (
    <section>
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className="border-l-4 border-red-600 pl-2">
          {t("section.interactive")}
        </span>
      </h2>

      <Tabs defaultValue="poll">
        <TabsList className="w-full">
          <TabsTrigger value="poll" className="flex-1">
            <button onClick={() => setStartQuize(false)}>
              {" "}
              {t("poll.title")}
            </button>
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex-1">
            {t("quiz.title")}
          </TabsTrigger>
        </TabsList>

        {/* Poll Section */}
        <TabsContent value="poll">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{pollData.question}</CardTitle>
            </CardHeader>
            <CardContent>
              {!hasVoted ? (
                <>
                  <RadioGroup
                    value={selectedPollOption}
                    onValueChange={setSelectedPollOption}
                    className="space-y-3"
                  >
                    {pollData.options.map((option: any) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id}>{option.option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <Button
                    className="w-full mt-4"
                    onClick={handleVote}
                    disabled={!selectedPollOption}
                  >
                    {t("poll.vote")}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-medium">{t("poll.results")}</h3>
                  {pollData.options.map((option: any) => (
                    <div key={option.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{option.option}</span>
                        <span>{getPercentage(option.votes)}%</span>
                      </div>
                      <Progress
                        value={getPercentage(option.votes)}
                        className="h-2"
                      />
                    </div>
                  ))}
                  <div className="text-sm text-muted-foreground">
                    Total votes: {getTotalVotes()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quiz Section */}
        {startQuize ? (
          <div>
            {/* Display the current question */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">
                {currentQuestionIndex + 1}. {currentQuestion?.question}
              </h3>
              <div className="space-y-2">
                {currentQuestion?.options.map(
                  (option: any, optionIndex: number) => (
                    <div key={optionIndex} className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${currentQuestionIndex}`} // Ensure radio buttons are grouped by question
                        value={option.text}
                        onChange={() => handleAnswerSelect(option)} // Handle answer selection
                      />
                      <label className="ml-2">{option.text}</label>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Next Button */}
            <div>
              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="w-full bg-blue-500 text-white p-2 rounded-md"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="w-full bg-green-500 text-white p-2 rounded-md"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        ) : (
          <TabsContent value="quiz">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{quiz?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {quiz?.description}
                </p>
                <Button onClick={() => setStartQuize(true)} className="w-full">
                  {t("quiz.start")}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </section>
  );
}
