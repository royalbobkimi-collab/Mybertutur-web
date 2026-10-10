import { useState } from 'react';
import { ChevronDownIcon, SparkIcon } from './Icons';
import { Reveal } from './Reveal';

const FAQS = [
  {
    q: 'Apakah itu MyBertutur?',
    a: 'MyBertutur ialah aplikasi latihan Ujian Lisan SPM berkuasa AI. Anda merakam jawapan lisan anda, dan Gemini AI memberikan penilaian masa nyata — termasuk skor, huraian isi, analisis sebutan, kelancaran dan tatabahasa — mengikut format peperiksaan sebenar Bahasa Melayu (Bahagian A & B) dan Bahasa Inggeris (Part 2, Part 3, KBAT).',
  },
  {
    q: 'Adakah penilaian AI ini tepat?',
    a: 'Ya. Penilaian menggunakan Gemini AI 3.8 Flash — model bahasa generasi terkini — dengan rubrik khusus yang dibina mengikut piawaian SPM sebenar. Setiap jawapan dinilai berdasarkan 4 kriteria utama (sebutan, kelancaran, tatabahasa & isi) dan dijajar dengan garis panduan pemarkahan rasmi. Ribu-uan pelajar telah menggunakannya untuk menilai dengan konsisten.',
  },
  {
    q: 'Bolehkah saya gunakan di telefon?',
    a: 'Boleh. MyBertutur berfungsi di mana-mana — telefon pintar, tablet dan komputer. Ia 100% berasaskan web, jadi tiada muat turun diperlukan. Cuma perlukan mikrofon dan sambungan internet.',
  },
  {
    q: 'Berapakah kosnya?',
    a: 'MyBertutur boleh digunakan secara percuma dengan had latihan seminggu. Untuk latihan tanpa had, maklum balas penuh dan Mistake Bank, langganan Premium bermula dari RM9 sebulan. Pelajar sekolah kerajaan layari percuma melalui program digital KPM.',
  },
  {
    q: 'Apakah "Mistake Bank" itu?',
    a: 'Mistake Bank mengumpul setiap kesilapan tatabahasa, sebutan dan isi yang dikesan AI semasa latihan anda, dan menyimpannya untuk latihan ulangan berfokus. Anda boleh mengulangi kesilapan anda sendiri sehingga anda tidak mengulanginya lagi — teknik pembelajaran yang terbukti berkesan.',
  },
  {
    q: 'Adakah data saya selamat?',
    a: 'Ya. Semua data disimpan di Supabase (perkakasan Eropah) dengan penyulitan TLS. Rakaman audio anda hanya digunakan untuk penilaian dan tidak dikongsi dengan pihak ketiga. Anda boleh memadam akaun anda pada bila-bila masa.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <span className="eyebrow">
            <SparkIcon size={14} /> Soalan Lazim
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Soalan <span className="gradient-text">kerap ditanya</span>
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 60}>
                <div
                  className={`glass overflow-hidden rounded-2xl transition-all duration-300 ${
                    isOpen ? 'border-brand-500/40 shadow-glow/50' : ''
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white">{item.q}</span>
                    <ChevronDownIcon
                      size={18}
                      className={`shrink-0 text-brand-600 transition-transform duration-300 dark:text-brand-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}