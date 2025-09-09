// page.tsx (server)

import SemesterCourses from "./SemesterCourses";
import { Suspense } from "react";

export default function Page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SemesterCourses /> {/* client component */}
      </Suspense>
    </div>
  );
}

