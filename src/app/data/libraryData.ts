export type LibraryCategory =
  | 'Peribahasa'
  | 'Simpulan Bahasa'
  | 'Penjodoh Bilangan'
  | 'Tatabahasa'
  | 'Vocab BI'
  | 'Umum'
  | 'Sosial'
  | 'Pendidikan'
  | 'Perniagaan'
  | 'Teknologi'
  | 'Alam Sekitar'
  | 'Sastera'
  | 'Seni'
  | 'Sains'
  | 'Profesional';

/** Jenis entri kosa-kata: kosa kata biasa atau peribahasa. */
export type LibraryEntryType = 'vocabulary' | 'peribahasa';

export type LibraryItem = {
  id: string;
  category: LibraryCategory;
  title: string;
  meaning: string;
  example: string;
  /** (Pilihan) Jenis entri — dipaparkan pada kad bagi data daripada vocabulary.json. */
  type?: LibraryEntryType;
};

export const libraryData: LibraryItem[] = [
  { id: 'p1', category: 'Peribahasa', title: 'Bagai tikus membaiki labu', meaning: 'Seseorang yang cuba membaiki sesuatu yang tidak diketahuinya, lalu merosakkannya lagi.', example: 'Tindakan Amin membaiki enjin keretanya itu bagai tikus membaiki labu kerana keretanya kini tidak boleh dihidupkan langsung.' },
  { id: 'p2', category: 'Peribahasa', title: 'Alah membeli menang memakai', meaning: 'Walaupun sesuatu barang itu mahal, tetapi mutunya baik dan tahan lama.', example: 'Ayah sanggup membeli kasut yang mahal ini kerana alah membeli menang memakai.' },
  { id: 'p3', category: 'Peribahasa', title: 'Sedikit-sedikit, lama-lama jadi bukit', meaning: 'Sabar dan tekun mengerjakan sesuatu, akhirnya berjaya juga.', example: 'Amalan menabung wang saku setiap hari ibarat sedikit-sedikit, lama-lama jadi bukit.' },
  { id: 'p4', category: 'Peribahasa', title: 'Biar mati anak, jangan mati adat', meaning: 'Adat resam yang tidak boleh dilanggar atau ditinggalkan.', example: 'Walaupun zaman telah berubah, majlis perkahwinan itu tetap mengekalkan tradisi lama umpama biar mati anak, jangan mati adat.' },
  { id: 'p5', category: 'Peribahasa', title: 'Masuk kandang kambing mengembek, masuk kandang kerbau menguak', meaning: 'Menyesuaikan diri dengan tempat dan keadaan.', example: 'Apabila kita berada di negara orang, kita hendaklah mengikut budaya mereka ibarat masuk kandang kambing mengembek, masuk kandang kerbau menguak.' },
  { id: 'p6', category: 'Peribahasa', title: 'Melentur buluh biarlah dari rebungnya', meaning: 'Mendidik anak biarlah sejak mereka kecil lagi.', example: 'Ibu bapa perlu mendidik anak-anak berakhlak mulia sejak kecil kerana melentur buluh biarlah dari rebungnya.' },
  { id: 'p7', category: 'Peribahasa', title: 'Hujan emas di negeri orang, hujan batu di negeri sendiri', meaning: 'Walau bagaimanapun kelebihan di negara orang, tetap negeri sendiri lebih baik lagi.', example: 'Walaupun Ali berjaya di luar negara, dia tetap kembali ke Malaysia kerana hujan emas di negeri orang, hujan batu di negeri sendiri.' },
  { id: 'p8', category: 'Peribahasa', title: 'Seperti katak di bawah tempurung', meaning: 'Orang yang terhad ilmu pengetahuannya dan tidak tahu hal ehwal sekeliling.', example: 'Janganlah kita menjadi seperti katak di bawah tempurung dengan menolak penggunaan teknologi moden.' },
  { id: 'p9', category: 'Peribahasa', title: 'Bagai melepaskan batuk di tangga', meaning: 'Membuat sesuatu kerja dengan tidak bersungguh-sungguh.', example: 'Kerja sekolah itu disiapkan bagai melepaskan batuk di tangga sahaja, penuh dengan kesilapan.' },
  { id: 'p10', category: 'Peribahasa', title: 'Seperti kera mendapat bunga', meaning: 'Seseorang yang tidak tahu menghargai pemberian orang lain.', example: 'Tindakan membuang hadiah buku rujukan itu sama seperti kera mendapat bunga.' },
  
  { id: 'sb1', category: 'Simpulan Bahasa', title: 'Rambang mata', meaning: 'Sukar untuk membuat pilihan kerana terlalu banyak pilihan yang menarik.', example: 'Salmah menjadi rambang mata apabila melihat pelbagai jenis kuih-muih dijual di bazar Ramadan itu.' },
  { id: 'sb2', category: 'Simpulan Bahasa', title: 'Kaki ayam', meaning: 'Orang yang tidak berkasut atau berselipar.', example: 'Kanak-kanak itu berlari-lari kaki ayam di halaman rumah.' },
  { id: 'sb3', category: 'Simpulan Bahasa', title: 'Ulat buku', meaning: 'Orang yang sangat suka membaca buku.', example: 'Zarif dikenali sebagai ulat buku kerana dia sering menghabiskan masa lapangnya di perpustakaan.' },
  { id: 'sb4', category: 'Simpulan Bahasa', title: 'Anak emas', meaning: 'Anak yang paling disayangi oleh ibu bapa atau ketua.', example: 'Ahmad merupakan anak emas majikannya kerana dia sangat rajin bekerja.' },
  
  { id: 'pb1', category: 'Penjodoh Bilangan', title: 'Utas', meaning: 'Digunakan untuk benda yang panjang dan boleh digulung atau berurai.', example: 'Ibu membelikan kakak seutas rantai mutiara sempena hari lahirnya.' },
  { id: 'pb2', category: 'Penjodoh Bilangan', title: 'Rawan', meaning: 'Digunakan untuk benda yang bersirat atau berjaring.', example: 'Nelayan itu sedang menebar serawan jala di muara sungai.' },
  
  { id: 'tb1', category: 'Tatabahasa', title: 'Kata Hubung', meaning: 'Kata yang digunakan untuk menghubungkan dua ayat atau lebih menjadi ayat majmuk.', example: 'Ali dan Abu pergi ke padang untuk bermain bola sepak.' },
  { id: 'tb2', category: 'Tatabahasa', title: 'Kata Majmuk', meaning: 'Dua atau lebih kata dasar yang digabungkan untuk membentuk satu perkataan baharu yang membawa makna tertentu.', example: 'Antara contoh kata majmuk ialah jalan raya, kereta api, dan buku tulis.' },

  { id: 'vb1', category: 'Vocab BI', title: 'Perseverance', meaning: 'Steady persistence in a course of action, especially in spite of difficulties.', example: 'Her perseverance in studying English paid off with an A+.' },
  { id: 'vb2', category: 'Vocab BI', title: 'Innovation', meaning: 'The action or process of introducing new ideas, devices, or methods.', example: 'Technology has accelerated innovation in the classroom.' },
  { id: 'vb3', category: 'Vocab BI', title: 'Sustainability', meaning: 'Avoidance of the depletion of natural resources to maintain ecological balance.', example: 'Sustainability is a key topic in modern education.' },
  { id: 'vb4', category: 'Vocab BI', title: 'Collaboration', meaning: 'The action of working with someone to produce or create something.', example: 'Group discussions encourage collaboration among students.' },
  { id: 'vb5', category: 'Vocab BI', title: 'Resilience', meaning: 'The capacity to recover quickly from difficulties; toughness.', example: 'Resilience helps students bounce back from failures.' },
];
