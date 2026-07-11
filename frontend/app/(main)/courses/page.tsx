import { getCourses, getUserProgress } from "@/db/queries";
import { ChevronDown } from "lucide-react";

import { List } from "./list";

const CoursesPage = async () => {
  const coursesData = getCourses();
  const userProgressData = getUserProgress();

  const [
    courses,
    userProgress,
  ] = await Promise.all([
    coursesData,
    userProgressData,
  ]);

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
      <div className="relative flex items-center justify-center border-b-2 border-gray-200 dark:border-slate-800 pb-4 mb-8 pt-8">
        <h1 className="text-2xl font-bold text-neutral-700 dark:text-neutral-200 text-center">
          Courses for English Speakers
        </h1>
        <div className="absolute right-0 hidden lg:flex items-center text-xs font-bold text-gray-400 cursor-pointer hover:text-gray-500 transition uppercase tracking-wider">
          I speak English <ChevronDown className="ml-2 h-4 w-4 stroke-[3]" />
        </div>
      </div>
      <List
        courses={courses}
        activeCourseId={userProgress?.activeCourseId}
      />
    </div>
  );
};

export default CoursesPage;
