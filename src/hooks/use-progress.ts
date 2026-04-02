"use client";

import { useState, useCallback, useEffect } from "react";

interface Progress {
  completedLessons: Record<string, boolean>;
  completedExercises: Record<string, boolean>;
  challengeScores: Record<string, number>;
}

const STORAGE_KEY = "sql-tutor-progress";

function loadProgress(): Progress {
  if (typeof window === "undefined") {
    return { completedLessons: {}, completedExercises: {}, challengeScores: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { completedLessons: {}, completedExercises: {}, challengeScores: {} };
}

function saveProgress(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const completeLesson = useCallback((slug: string) => {
    setProgress((prev) => {
      const next = { ...prev, completedLessons: { ...prev.completedLessons, [slug]: true } };
      saveProgress(next);
      return next;
    });
  }, []);

  const completeExercise = useCallback((id: string) => {
    setProgress((prev) => {
      const next = { ...prev, completedExercises: { ...prev.completedExercises, [id]: true } };
      saveProgress(next);
      return next;
    });
  }, []);

  const saveChallengeScore = useCallback((id: string, score: number) => {
    setProgress((prev) => {
      const existing = prev.challengeScores[id] ?? 0;
      if (score <= existing) return prev;
      const next = { ...prev, challengeScores: { ...prev.challengeScores, [id]: score } };
      saveProgress(next);
      return next;
    });
  }, []);

  const isLessonComplete = useCallback(
    (slug: string) => !!progress.completedLessons[slug],
    [progress]
  );

  const isExerciseComplete = useCallback(
    (id: string) => !!progress.completedExercises[id],
    [progress]
  );

  const getChallengeScore = useCallback(
    (id: string) => progress.challengeScores[id] ?? null,
    [progress]
  );

  return {
    progress,
    completeLesson,
    completeExercise,
    saveChallengeScore,
    isLessonComplete,
    isExerciseComplete,
    getChallengeScore,
  };
}
