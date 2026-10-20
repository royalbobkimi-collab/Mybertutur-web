/**
 * Skema data MODUL NASKAH CALON (Modul Kompilasi Latihan Ujian Bertutur
 * Berpandukan Tema Buku Teks Bahasa Melayu Tingkatan 4 dan 5).
 */
export type BmOralExercise = {
  id: string;
  exerciseNumber: number;
  assessmentType: 'individual' | 'group';
  stimulusTitle: string;
  stimulusText: string;
  instruction: string;
  readingInstruction: string;
  sourceReference: string;
  sourceTitle: string;
  sourcePage: string;
  modulePage: number | null;
  marks: number;
};

export type BmOralTheme = {
  id: string;
  level: number;
  number: number;
  title: string;
  individual: BmOralExercise[];
  group: BmOralExercise[];
};
