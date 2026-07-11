"use client";

import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { Course } from "@/db/queries";
import { upsertUserProgress } from "@/actions/user-progress";

import { Card } from "./card";

type Props = {
  courses: Course[];
  activeCourseId?: number;
};

export const List = ({ courses, activeCourseId }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = (id: number) => {
    if (pending) return;

    if (id === activeCourseId) {
      return router.push("/learn");
    }

    startTransition(() => {
      upsertUserProgress(id)  
        .catch(() => toast.error("Something went wrong."));
    });
  };

  return (
    <div className="pt-2 flex flex-wrap justify-center gap-4 lg:gap-6">
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          title={course.title}
          imageSrc={course.imageSrc}
          onClick={onClick}
          disabled={pending}
          active={course.id === activeCourseId}
        />
      ))}
    </div>
  );
};
