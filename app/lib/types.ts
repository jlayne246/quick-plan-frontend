type Course = {
  id: number;
  course_name: string;
  course_code: string;
  programme_code: string;
  credits: number;
  mandatory_for_degrees: number[]; // array of degree IDs
};

type CourseOffering = {
  id: number;
  semester_code: number;
  lecturer: string;
  course: Course;
};

type Degree = {
    id: number;
    title: string;
    major: string;
    minor: string[];
}

type Programme = {
    programme_code: string;
    programme_name: string;
    faculty_code: string;
    department_code: string;
    degrees: Degree[];
}

type Faculty = {
    faculty_code: string;
    faculty_name: string;
    programmes: string[];
}

export type { Course, CourseOffering, Degree, Faculty, Programme };