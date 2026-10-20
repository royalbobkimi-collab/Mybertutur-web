/**
 * Lightweight in-app i18n dictionary (Bahasa Melayu / English).
 *
 * All user-facing "app chrome" strings live here. Test screens (testbm, testbi)
 * intentionally keep their own fixed language and are NOT part of this dictionary.
 */

export type Lang = 'bm' | 'en';

export type TranslationKey =
  // ── Bottom navigation ──
  | 'nav.home'
  | 'nav.subject'
  | 'nav.leaderboard'
  | 'nav.settings'
  // ── Drawer ──
  | 'drawer.utama'
  | 'drawer.ujianLisan'
  | 'drawer.analisis'
  | 'drawer.petiKata'
  | 'drawer.leaderboard'
  | 'drawer.tetapan'
  | 'drawer.logout'
  | 'drawer.accountSettings'
  | 'drawer.accountSettingsSub'
  | 'drawer.updated'
  | 'drawer.mistakeBank'
  | 'drawer.progress'
  // ── Home ──
  | 'home.eyebrow'
  | 'home.title'
  | 'home.subtitle'
  | 'home.progressTitle'
  | 'home.completedTests'
  | 'home.averageScore'
  /** Estimated practice minutes this Monday-to-Sunday week. */
  | 'home.estimatedMinutesThisWeek'
  /** "Mon/Tue/…" label paksi carta aktiviti mingguan. */
  | 'home.dayShort.mon'
  | 'home.dayShort.tue'
  | 'home.dayShort.wed'
  | 'home.dayShort.thu'
  | 'home.dayShort.fri'
  | 'home.dayShort.sat'
  | 'home.dayShort.sun'
  // ── Settings ──
  | 'settings.title'
  | 'settings.subtitle'
  | 'settings.groupAccount'
  | 'settings.groupApp'
  | 'settings.groupSecurity'
  | 'settings.accountDetails'
  | 'settings.accountDetailsSub'
  | 'settings.myBadges'
  | 'settings.myBadgesSub'
  | 'settings.appPrefs'
  | 'settings.appPrefsSub'
  | 'settings.privacy'
  | 'settings.privacySub'
  | 'settings.logout'
  | 'settings.logoutSub'
  | 'settings.groupDisplay'
  | 'settings.theme'
  | 'settings.themeSub'
  | 'settings.themeDark'
  | 'settings.themeLight'
  | 'settings.language'
  | 'settings.languageSub'
  // ── Preferences ──
  | 'prefs.title'
  | 'prefs.subtitle'
  | 'prefs.language'
  | 'prefs.languageHint'
  | 'prefs.languageBm'
  | 'prefs.languageEn'
  | 'prefs.theme'
  | 'prefs.themeText'
  | 'prefs.notifications'
  | 'prefs.notificationsText'
  | 'prefs.sound'
  | 'prefs.soundText'
  | 'prefs.autoPlay'
  | 'prefs.autoPlayText'
  | 'prefs.haptics'
  | 'prefs.hapticsText'
  | 'prefs.audioSpeed'
  | 'prefs.audioSpeedText'
  | 'prefs.speed075'
  | 'prefs.speed10'
  | 'prefs.speed125'
  | 'prefs.speed15'
  | 'settings.support'
  | 'settings.supportSub'
  // ── Account ──
  | 'account.title'
  | 'account.subtitle'
  | 'account.nameLabel'
  | 'account.emailLabel'
  | 'account.passwordLabel'
  | 'account.hint'
  | 'account.namePlaceholder'
  | 'account.emailPlaceholder'
  | 'account.passwordPlaceholder'
  // ── Profile ──
  | 'profile.heading'
  | 'profile.hint'
  | 'profile.fullname'
  | 'profile.email'
  | 'profile.password'
  | 'profile.save'
  | 'profile.savedMessage'
  | 'profile.noChanges'
  | 'profile.saveFailed'
  // ── Badges ──
  | 'badges.title'
  | 'badges.subtitle'
  | 'badges.earned'
  | 'badges.sessions'
  | 'badges.tests'
  | 'badges.streak'
  | 'badges.first.name'
  | 'badges.first.desc'
  | 'badges.first.locked'
  | 'badges.duo.name'
  | 'badges.duo.desc'
  | 'badges.duo.locked'
  | 'badges.scorer.name'
  | 'badges.scorer.desc'
  | 'badges.scorer.locked'
  | 'badges.perfect.name'
  | 'badges.perfect.desc'
  | 'badges.perfect.locked'
  | 'badges.streakBadge.name'
  | 'badges.streakBadge.desc'
  | 'badges.streakBadge.locked';

export const translations: Record<Lang, Record<TranslationKey, string>> = {
  bm: {
    'nav.home': 'Utama',
    'nav.subject': 'Subjek',
    'nav.leaderboard': 'Papan Markah',
    'nav.settings': 'Tetapan',

    'drawer.utama': 'Utama',
    'drawer.ujianLisan': 'Ujian Lisan',
    'drawer.analisis': 'Analisis Prestasi',
    'drawer.petiKata': 'Peti Kata-kata',
    'drawer.leaderboard': 'Papan Markah',
    'drawer.tetapan': 'Tetapan',
    'drawer.logout': 'Log Keluar',
    'drawer.accountSettings': 'Tetapan Akaun',
    'drawer.accountSettingsSub': 'Urus profil, kata laluan & maklumat anda',
    'drawer.updated': 'Profil dikemas kini',
    'drawer.mistakeBank': 'Peti Kesilapan',
    'drawer.progress': 'Rekod Kemajuan',

    'home.eyebrow': 'Analisis Kemajuan',
    'home.title': 'Selamat kembali',
    'home.subtitle':
      'Keputusan ujian terbaharu anda sudah sedia. Teruskan meningkatkan kemahiran dengan cerapan pintar.',
    'home.progressTitle': 'Kemajuan Ujian',
    'home.completedTests': 'Ujian selesai',
    'home.averageScore': 'Purata markah',
    'home.estimatedMinutesThisWeek': '≈ {minutes} minit minggu ini',
    'home.dayShort.mon': 'Is',
    'home.dayShort.tue': 'Se',
    'home.dayShort.wed': 'Ra',
    'home.dayShort.thu': 'Kh',
    'home.dayShort.fri': 'Ju',
    'home.dayShort.sat': 'Sa',
    'home.dayShort.sun': 'Ah',

    'settings.title': 'Tetapan',
    'settings.subtitle':
      'Urus akaun, keutamaan dan privasi anda dari satu papan pemuka yang kemas.',
    'settings.groupAccount': 'Akaun',
    'settings.groupApp': 'Aplikasi',
    'settings.groupSecurity': 'Keselamatan',
    'settings.accountDetails': 'Butiran Akaun',
    'settings.accountDetailsSub': 'Urus profil dan maklumat peribadi anda',
    'settings.myBadges': 'Lencana & Pencapaian Saya',
    'settings.myBadgesSub': 'Jejak lencana yang diperolehi dan kemajuan',
    'settings.appPrefs': 'Keutamaan Aplikasi',
    'settings.appPrefsSub': 'Sesuaikan tema, pemberitahuan dan audio',
    'settings.privacy': 'Dasar Privasi',
    'settings.privacySub': 'Semak terma data dan keselamatan',
    'settings.logout': 'Log Keluar',
    'settings.logoutSub': 'Keluar daripada aplikasi',
    'settings.groupDisplay': 'Paparan',
    'settings.theme': 'Tema Aplikasi',
    'settings.themeSub': 'Pilih tema gelap atau terang',
    'settings.themeDark': 'Gelap',
    'settings.themeLight': 'Terang',
    'settings.language': 'Bahasa',
    'settings.languageSub': 'Pilih Melayu atau English',

    'prefs.title': 'Keutamaan Aplikasi',
    'prefs.subtitle':
      'Kawal pengalaman aplikasi anda dengan tetapan moden yang kemas.',
    'prefs.language': 'Bahasa',
    'prefs.languageHint':
      'Pilih bahasa paparan aplikasi. Skrin ujian dikecualikan.',
    'prefs.languageBm': 'Melayu',
    'prefs.languageEn': 'English',
    'prefs.theme': 'Tema',
    'prefs.themeText':
      'Mod gelap, warna aksen dan kawalan paparan akan tersedia di sini.',
    'prefs.notifications': 'Pemberitahuan',
    'prefs.notificationsText':
      'Urus pemberitahuan tolak dan peringatan untuk latihan harian.',
    'prefs.sound': 'Bunyi & Audio',
    'prefs.soundText':
      'Konfigurasikan arahan suara dan bunyi maklum balas untuk jurulatih pertuturan.',
    'prefs.autoPlay': 'Main Audio Soalan Automatik',
    'prefs.autoPlayText': 'Mainkan audio soalan secara automatik apabila ujian dimulakan.',
    'prefs.haptics': 'Maklum Balas Getaran',
    'prefs.hapticsText': 'Getaran ringan pada butang dan interaksi.',
    'prefs.audioSpeed': 'Kelajuan Audio Lalai',
    'prefs.audioSpeedText': 'Tetapkan kelajuan main semula audio soalan daripada 0.75x hingga 1.5x.',
    'prefs.speed075': '0.75x',
    'prefs.speed10': '1.0x',
    'prefs.speed125': '1.25x',
    'prefs.speed15': '1.5x',

    'settings.support': 'Khidmat Pelanggan',
    'settings.supportSub': 'Bantuan, maklum balas, atau hubungi kami',


    'account.title': 'Butiran Akaun',
    'account.subtitle': 'Ubah nama, e-mel, dan kata laluan anda.',
    'account.nameLabel': 'Nama',
    'account.emailLabel': 'E-mel',
    'account.passwordLabel': 'Kata Laluan',
    'account.hint': 'Ketuk untuk melihat profil anda',
    'account.namePlaceholder': 'Masukkan nama penuh',
    'account.emailPlaceholder': 'Masukkan e-mel',
    'account.passwordPlaceholder': 'Masukkan kata laluan',

    'profile.heading': 'Profil Akaun',
    'profile.hint': 'Ketuk untuk melihat profil anda',
    'profile.fullname': 'Nama penuh',
    'profile.email': 'E-mel',
    'profile.password': 'Kata laluan',
    'profile.save': 'Simpan Perubahan',
    'profile.savedMessage': 'Profil anda telah dikemas kini.',
    'profile.noChanges': 'Tiada perubahan untuk disimpan.',
    'profile.saveFailed': 'Perubahan profil tidak dapat disimpan. Sila cuba lagi.',

    'badges.title': 'Lencana & Pencapaian',
    'badges.subtitle': 'Statistik sebenar daripada aktiviti anda.',
    'badges.earned': 'Lencana diperoleh',
    'badges.sessions': 'Sesi',
    'badges.tests': 'Ujian',
    'badges.streak': 'Rentetan',
    'badges.first.name': 'Ujian Pertama',
    'badges.first.desc': 'Lengkapkan ujian lisan pertama anda.',
    'badges.first.locked': 'Lengkapkan 1 ujian lisan',
    'badges.duo.name': 'Dwibahasa',
    'badges.duo.desc': 'Cuba kedua-dua ujian BM dan BI.',
    'badges.duo.locked': 'Lengkapkan BM dan BI',
    'badges.scorer.name': 'Pencetak Markah Tinggi',
    'badges.scorer.desc': 'Capai purata skor sekurang-kurangnya 80.',
    'badges.scorer.locked': 'Purata skor 80 atau lebih',
    'badges.perfect.name': 'Skor Sempurna',
    'badges.perfect.desc': 'Dapatkan skor penuh 100 dalam mana-mana ujian.',
    'badges.perfect.locked': 'Dapatkan skor 100',
    'badges.streakBadge.name': 'Rentetan 3 Hari',
    'badges.streakBadge.desc': 'Berlatih selama 3 hari berturut-turut.',
    'badges.streakBadge.locked': 'Berlatih selama 3 hari berturut-turut',
  },

  en: {
    'nav.home': 'Home',
    'nav.subject': 'Subject',
    'nav.leaderboard': 'Leaderboard',
    'nav.settings': 'Settings',

    'drawer.utama': 'Home',
    'drawer.ujianLisan': 'Oral Test',
    'drawer.analisis': 'Performance Analysis',
    'drawer.petiKata': 'Word Bank',
    'drawer.leaderboard': 'Leaderboard',
    'drawer.tetapan': 'Settings',
    'drawer.logout': 'Log Out',
    'drawer.accountSettings': 'Account Settings',
    'drawer.accountSettingsSub': 'Manage your profile, password & details',
    'drawer.updated': 'Profile updated',
    'drawer.mistakeBank': 'Mistake Bank',
    'drawer.progress': 'Progress Record',

    'home.eyebrow': 'Progress Analysis',
    'home.title': 'Welcome back',
    'home.subtitle':
      'Your latest test results are ready. Keep improving with smart insights.',
    'home.progressTitle': 'Test Progress',
    'home.completedTests': 'Tests completed',
    'home.averageScore': 'Average score',
    'home.estimatedMinutesThisWeek': '≈ {minutes} min this week',
    'home.dayShort.mon': 'Mon',
    'home.dayShort.tue': 'Tue',
    'home.dayShort.wed': 'Wed',
    'home.dayShort.thu': 'Thu',
    'home.dayShort.fri': 'Fri',
    'home.dayShort.sat': 'Sat',
    'home.dayShort.sun': 'Sun',

    'settings.title': 'Settings',
    'settings.subtitle':
      'Organize your account, preferences, and privacy from one polished dashboard.',
    'settings.groupAccount': 'Account',
    'settings.groupApp': 'App',
    'settings.groupSecurity': 'Security',
    'settings.accountDetails': 'Account Details',
    'settings.accountDetailsSub': 'Manage your profile and personal info',
    'settings.myBadges': 'My Badges & Achievements',
    'settings.myBadgesSub': 'Track earned badges and progress',
    'settings.appPrefs': 'App Preferences',
    'settings.appPrefsSub': 'Customize theme, notifications and audio',
    'settings.privacy': 'Privacy Policy',
    'settings.privacySub': 'Review data and security terms',
    'settings.logout': 'Log Out',
    'settings.logoutSub': 'Sign out from the app',
    'settings.groupDisplay': 'Display',
    'settings.theme': 'App Theme',
    'settings.themeSub': 'Choose dark or light theme',
    'settings.themeDark': 'Dark',
    'settings.themeLight': 'Light',
    'settings.language': 'Language',
    'settings.languageSub': 'Choose Malay or English',

    'prefs.title': 'App Preferences',
    'prefs.subtitle': 'Control your app experience with sleek, modern settings.',
    'prefs.language': 'Language',
    'prefs.languageHint': 'Choose the app display language. Test screens are excluded.',
    'prefs.languageBm': 'Malay',
    'prefs.languageEn': 'English',
    'prefs.theme': 'Theme',
    'prefs.themeText':
      'Dark mode, accent colors and display preference controls will live here.',
    'prefs.notifications': 'Notifications',
    'prefs.notificationsText': 'Manage push alerts and reminders for daily practice.',
    'prefs.sound': 'Sound & Audio',
    'prefs.soundText':
      'Configure voice prompts and feedback sounds for the speaking trainer.',
    'prefs.autoPlay': 'Auto-play Question Audio',
    'prefs.autoPlayText': 'Automatically play question audio when a test starts.',
    'prefs.haptics': 'Haptic Feedback',
    'prefs.hapticsText': 'Light vibration on buttons and interactions.',
    'prefs.audioSpeed': 'Default Audio Speed',
    'prefs.audioSpeedText': 'Set question audio playback speed from 0.75x to 1.5x.',
    'prefs.speed075': '0.75x',
    'prefs.speed10': '1.0x',
    'prefs.speed125': '1.25x',
    'prefs.speed15': '1.5x',

    'settings.support': 'Customer Service',
    'settings.supportSub': 'Help, feedback, or contact us',

    'account.title': 'Account Details',
    'account.subtitle': 'Edit your name, email, and password.',
    'account.nameLabel': 'Name',
    'account.emailLabel': 'E-mel',
    'account.passwordLabel': 'Password',
    'account.hint': 'Tap to view your profile',
    'account.namePlaceholder': 'Enter full name',
    'account.emailPlaceholder': 'Enter E-mel',
    'account.passwordPlaceholder': 'Enter password',

    'profile.heading': 'Account Profile',
    'profile.hint': 'Tap to view your profile',
    'profile.fullname': 'Full name',
    'profile.email': 'E-mel',
    'profile.password': 'Password',
    'profile.save': 'Save Changes',
    'profile.savedMessage': 'Your profile has been updated.',
    'profile.noChanges': 'There are no changes to save.',
    'profile.saveFailed': 'Could not save your profile changes. Please try again.',

    'badges.title': 'Badges & Achievements',
    'badges.subtitle': 'Statistics from your activity.',
    'badges.earned': 'Badges earned',
    'badges.sessions': 'Sessions',
    'badges.tests': 'Tests',
    'badges.streak': 'Streak',
    'badges.first.name': 'First Test',
    'badges.first.desc': 'Complete your first oral test.',
    'badges.first.locked': 'Complete 1 oral test',
    'badges.duo.name': 'Bilingual',
    'badges.duo.desc': 'Try both BM and BI tests.',
    'badges.duo.locked': 'Complete both BM and BI tests',
    'badges.scorer.name': 'High Scorer',
    'badges.scorer.desc': 'Reach an average score of at least 80.',
    'badges.scorer.locked': 'Reach an average score of 80 or higher',
    'badges.perfect.name': 'Perfect Score',
    'badges.perfect.desc': 'Earn a perfect score of 100 in any test.',
    'badges.perfect.locked': 'Earn a score of 100',
    'badges.streakBadge.name': '3-Day Streak',
    'badges.streakBadge.desc': 'Practice for 3 consecutive days.',
    'badges.streakBadge.locked': 'Practice for 3 consecutive days',
  },
};
