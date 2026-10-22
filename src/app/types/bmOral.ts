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

/**
 * Skema data Bank Soalan SPM (spm_soalan_bank.json).
 */
export type SpMSoalan = {
  n: number;
  text: string;
  jenis?: 'bahan' | 'kbat' | string;
};

export type SpmSoalan = SpMSoalan;

export type SpMQuestionItem = {
  n: number;
  jenis: 'bahan' | 'kbat' | string;
  teks: string;
};

export type SpMSet = {
  id: string;
  tema: string;
  individu: {
    tajuk: string;
    bahan: string;
    soalan: SpMQuestionItem[];
  };
  kumpulan: {
    tajuk: string;
    bahan: string;
    soalanPerbincangan: string;
  };
};

export type SpmSet = SpMSet;

export type SpMBank = {
  meta?: Record<string, unknown>;
  bm: SpMSet[];
};

export type SpmBank = SpMBank;

