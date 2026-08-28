package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.AppDatabase
import com.example.data.local.entity.BookmarkEntity
import com.example.data.local.entity.DailyHabitEntity
import com.example.data.local.entity.ReadingProgressEntity
import com.example.data.local.entity.UserSettingsEntity
import com.example.data.model.AsmaulHusna
import com.example.data.model.Ayah
import com.example.data.model.CalculationMethod
import com.example.data.model.CityPreset
import com.example.data.model.DailyHabit
import com.example.data.model.DailyPrayerSchedule
import com.example.data.model.DailyReminder
import com.example.data.model.DhikrCategory
import com.example.data.model.DhikrItem
import com.example.data.model.DuaCategory
import com.example.data.model.DuaItem
import com.example.data.model.HijriDate
import com.example.data.model.IslamicEvent
import com.example.data.model.NawawiHadith
import com.example.data.model.PrayerType
import com.example.data.model.QiblaData
import com.example.data.model.Reciter
import com.example.data.model.Surah
import com.example.data.repository.DhikrRepository
import com.example.data.repository.DuaRepository
import com.example.data.repository.IslamicContentRepository
import com.example.data.repository.PrayerRepository
import com.example.data.repository.QuranRepository
import com.example.data.repository.UserDataRepository
import com.example.data.service.AudioPlayerManager
import com.example.data.service.CompassSensorManager
import com.example.data.service.NotificationScheduler
import com.example.data.service.PlaybackState

import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.util.Date

class AppViewModel(application: Application) : AndroidViewModel(application) {

    private val db = AppDatabase.getDatabase(application)
    val userDataRepository = UserDataRepository(db)
    val quranRepository = QuranRepository()
    val dhikrRepository = DhikrRepository()
    val prayerRepository = PrayerRepository()
    val duaRepository = DuaRepository()
    val islamicContentRepository = IslamicContentRepository()

    val audioPlayerManager = AudioPlayerManager(application)
    val compassSensorManager = CompassSensorManager(application)
    val notificationScheduler = NotificationScheduler(application)

    // City & Location
    val cityPresets: List<CityPreset> = islamicContentRepository.cityPresets
    private val _selectedCity = MutableStateFlow(cityPresets.first())
    val selectedCity: StateFlow<CityPreset> = _selectedCity.asStateFlow()

    // 99 Names of Allah
    val asmaulHusnaList: List<AsmaulHusna> = islamicContentRepository.asmaulHusnaList
    private val _filteredAsmaulHusna = MutableStateFlow(asmaulHusnaList)
    val filteredAsmaulHusna: StateFlow<List<AsmaulHusna>> = _filteredAsmaulHusna.asStateFlow()

    // 40 Nawawi Hadiths
    val nawawiHadithsList: List<NawawiHadith> = islamicContentRepository.nawawiHadithsList
    private val _filteredHadiths = MutableStateFlow(nawawiHadithsList)
    val filteredHadiths: StateFlow<List<NawawiHadith>> = _filteredHadiths.asStateFlow()


    // User settings
    val userSettings: StateFlow<UserSettingsEntity?> = userDataRepository.userSettings
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    // Bookmarks & Reading Progress
    val bookmarks: StateFlow<List<BookmarkEntity>> = userDataRepository.allBookmarks
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val readingProgress: StateFlow<ReadingProgressEntity?> = userDataRepository.readingProgress
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    // Prayer schedule
    private val _prayerSchedule = MutableStateFlow(prayerRepository.calculatePrayerTimes())
    val prayerSchedule: StateFlow<DailyPrayerSchedule> = _prayerSchedule.asStateFlow()

    // Hijri date & Islamic events
    val hijriDate: HijriDate = prayerRepository.getHijriDate()
    val islamicEvents: List<IslamicEvent> = prayerRepository.getIslamicEvents()

    // Quran State
    val surahs: List<Surah> = quranRepository.surahs
    val reciters: List<Reciter> = quranRepository.reciters
    
    private val _selectedSurah = MutableStateFlow<Surah?>(quranRepository.surahs.first())
    val selectedSurah: StateFlow<Surah?> = _selectedSurah.asStateFlow()

    private val _currentAyahs = MutableStateFlow<List<Ayah>>(emptyList())
    val currentAyahs: StateFlow<List<Ayah>> = _currentAyahs.asStateFlow()

    private val _selectedAyahForTafsir = MutableStateFlow<Ayah?>(null)
    val selectedAyahForTafsir: StateFlow<Ayah?> = _selectedAyahForTafsir.asStateFlow()

    private val _quranSearchQuery = MutableStateFlow("")
    val quranSearchQuery: StateFlow<String> = _quranSearchQuery.asStateFlow()

    private val _quranSearchResults = MutableStateFlow<List<Ayah>>(emptyList())
    val quranSearchResults: StateFlow<List<Ayah>> = _quranSearchResults.asStateFlow()

    // Dhikr State
    val dhikrCategories: List<DhikrCategory> = dhikrRepository.categories
    
    private val _selectedDhikrCategory = MutableStateFlow<DhikrCategory?>(dhikrRepository.categories.first())
    val selectedDhikrCategory: StateFlow<DhikrCategory?> = _selectedDhikrCategory.asStateFlow()

    private val _categoryDhikrItems = MutableStateFlow<List<DhikrItem>>(emptyList())
    val categoryDhikrItems: StateFlow<List<DhikrItem>> = _categoryDhikrItems.asStateFlow()

    private val _currentDhikrIndex = MutableStateFlow(0)
    val currentDhikrIndex: StateFlow<Int> = _currentDhikrIndex.asStateFlow()

    private val _dhikrItemProgressCount = MutableStateFlow(0)
    val dhikrItemProgressCount: StateFlow<Int> = _dhikrItemProgressCount.asStateFlow()

    // Per-item session repetition progress tracker: Map<itemId, currentCount>
    private val _dhikrSessionCounts = MutableStateFlow<Map<String, Int>>(emptyMap())
    val dhikrSessionCounts: StateFlow<Map<String, Int>> = _dhikrSessionCounts.asStateFlow()

    private val _completedDhikrIds = MutableStateFlow<Set<String>>(emptySet())
    val completedDhikrIds: StateFlow<Set<String>> = _completedDhikrIds.asStateFlow()

    private val _totalSessionDhikrCount = MutableStateFlow(0)
    val totalSessionDhikrCount: StateFlow<Int> = _totalSessionDhikrCount.asStateFlow()

    // Digital Tasbih
    private val _tasbihCount = MutableStateFlow(0)
    val tasbihCount: StateFlow<Int> = _tasbihCount.asStateFlow()

    private val _tasbihTarget = MutableStateFlow(33)
    val tasbihTarget: StateFlow<Int> = _tasbihTarget.asStateFlow()

    private val _tasbihPhrase = MutableStateFlow("سُبْحَانَ اللَّهِ")
    val tasbihPhrase: StateFlow<String> = _tasbihPhrase.asStateFlow()

    // Salawat on the Prophet ﷺ
    private val _salawatCount = MutableStateFlow(42)
    val salawatCount: StateFlow<Int> = _salawatCount.asStateFlow()
    val salawatTarget: Int = 500

    // Istighfar
    private val _istighfarCount = MutableStateFlow(70)
    val istighfarCount: StateFlow<Int> = _istighfarCount.asStateFlow()
    val istighfarTarget: Int = 100

    // Duas
    val duaCategories: List<DuaCategory> = duaRepository.categories
    private val _selectedDuaCategory = MutableStateFlow(duaRepository.categories.first())
    val selectedDuaCategory: StateFlow<DuaCategory> = _selectedDuaCategory.asStateFlow()
    
    private val _currentDuas = MutableStateFlow<List<DuaItem>>(emptyList())
    val currentDuas: StateFlow<List<DuaItem>> = _currentDuas.asStateFlow()

    // Habits & Tracker
    private val _todayHabits = MutableStateFlow(
        listOf(
            DailyHabit("fajr", "صلاة الفجر في وقتها", "Fajr Prayer on time", "prayer", true),
            DailyHabit("dhuhr", "صلاة الظهر", "Dhuhr Prayer", "prayer", true),
            DailyHabit("asr", "صلاة العصر", "Asr Prayer", "prayer", false),
            DailyHabit("maghrib", "صلاة المغرب", "Maghrib Prayer", "prayer", false),
            DailyHabit("isha", "صلاة العشاء", "Isha Prayer", "prayer", false),
            DailyHabit("morning_adhkar", "أذكار الصباح", "Morning Adhkar", "adhkar", true),
            DailyHabit("evening_adhkar", "أذكار المساء", "Evening Adhkar", "adhkar", false),
            DailyHabit("quran_wird", "ورد القرآن الكريم (5 صفحات)", "Quran Daily Wird (5 pages)", "quran", true),
            DailyHabit("salawat_daily", "الصلاة على النبي ﷺ (100 مرة)", "Salawat on Prophet (100x)", "dhikr", true),
            DailyHabit("istighfar_daily", "الاستغفار اليومي (100 مرة)", "Daily Istighfar (100x)", "dhikr", true)
        )
    )
    val todayHabits: StateFlow<List<DailyHabit>> = _todayHabits.asStateFlow()

    // Qibla live data
    private val _qiblaData = MutableStateFlow(prayerRepository.calculateQibla(21.4225, 39.8262, 0f))
    val qiblaData: StateFlow<QiblaData> = _qiblaData.asStateFlow()

    // Daily Reminder & Ayah
    val ayahOfTheDay: Ayah = quranRepository.getAyahOfTheDay()
    val dhikrOfTheDay: DhikrItem = dhikrRepository.getDhikrOfTheDay()
    val dailyReminders: List<DailyReminder> = duaRepository.getDailyReminders()

    // App Preferences
    private val _appLanguage = MutableStateFlow("ar") // "ar" or "en"
    val appLanguage: StateFlow<String> = _appLanguage.asStateFlow()

    private val _themeMode = MutableStateFlow("system") // "system", "light", "dark"
    val themeMode: StateFlow<String> = _themeMode.asStateFlow()

    private val _quranFontSize = MutableStateFlow(24f)
    val quranFontSize: StateFlow<Float> = _quranFontSize.asStateFlow()

    private val _showTranslation = MutableStateFlow(true)
    val showTranslation: StateFlow<Boolean> = _showTranslation.asStateFlow()

    private val _selectedReciter = MutableStateFlow(reciters.first())
    val selectedReciter: StateFlow<Reciter> = _selectedReciter.asStateFlow()

    val audioState: StateFlow<PlaybackState> = audioPlayerManager.playbackState

    init {
        loadSurah(1)
        selectDhikrCategory("morning")
        selectDuaCategory("rizq")
        startPrayerTimer()
        observeCompass()
    }

    private fun startPrayerTimer() {
        viewModelScope.launch {
            while (true) {
                _prayerSchedule.value = prayerRepository.calculatePrayerTimes()
                delay(1000) // Update countdown each second
            }
        }
    }

    private fun observeCompass() {
        viewModelScope.launch {
            compassSensorManager.azimuth.collect { heading ->
                _qiblaData.value = prayerRepository.calculateQibla(21.4225, 39.8262, heading)
            }
        }
    }

    fun loadSurah(surahNumber: Int) {
        viewModelScope.launch {
            val s = quranRepository.getSurahByNumber(surahNumber)
            _selectedSurah.value = s
            val ayahs = quranRepository.getAyahsForSurah(surahNumber, _selectedReciter.value.id)
            _currentAyahs.value = ayahs
            s?.let {
                userDataRepository.saveReadingProgress(it.number, 1, it.nameArabic, it.nameEnglish)
            }
        }
    }

    fun openTafsir(ayah: Ayah) {
        _selectedAyahForTafsir.value = ayah
    }

    fun closeTafsir() {
        _selectedAyahForTafsir.value = null
    }

    fun toggleBookmark(ayah: Ayah) {
        viewModelScope.launch {
            val surah = _selectedSurah.value ?: return@launch
            userDataRepository.toggleBookmark(
                surahNumber = surah.number,
                surahNameAr = surah.nameArabic,
                surahNameEn = surah.nameEnglish,
                ayahNumber = ayah.numberInSurah,
                ayahTextAr = ayah.textArabic,
                ayahTextEn = ayah.textEnglish
            )
        }
    }

    fun removeBookmark(id: Int) {
        viewModelScope.launch {
            userDataRepository.removeBookmark(id)
        }
    }

    fun searchQuran(query: String) {
        _quranSearchQuery.value = query
        _quranSearchResults.value = quranRepository.searchQuran(query)
    }

    fun selectDhikrCategory(categoryId: String) {
        val cat = dhikrCategories.find { it.id == categoryId } ?: dhikrCategories.first()
        _selectedDhikrCategory.value = cat
        _categoryDhikrItems.value = dhikrRepository.getItemsForCategory(categoryId)
        _currentDhikrIndex.value = 0
        _dhikrItemProgressCount.value = _dhikrSessionCounts.value[cat.id + "_0"] ?: 0
    }

    fun incrementDhikrCount() {
        val items = _categoryDhikrItems.value
        val currentIndex = _currentDhikrIndex.value
        if (items.isEmpty() || currentIndex !in items.indices) return

        val currentItem = items[currentIndex]
        val newCount = _dhikrItemProgressCount.value + 1
        _totalSessionDhikrCount.value += 1

        val currentMap = _dhikrSessionCounts.value.toMutableMap()
        currentMap[currentItem.id] = newCount
        _dhikrSessionCounts.value = currentMap

        if (newCount >= currentItem.countTarget) {
            _dhikrItemProgressCount.value = currentItem.countTarget
            _completedDhikrIds.value = _completedDhikrIds.value + currentItem.id
            if (currentIndex + 1 < items.size) {
                _currentDhikrIndex.value = currentIndex + 1
                _dhikrItemProgressCount.value = _dhikrSessionCounts.value[items[currentIndex + 1].id] ?: 0
            }
        } else {
            _dhikrItemProgressCount.value = newCount
        }
    }

    fun incrementItemDhikrById(item: DhikrItem) {
        val currentCount = _dhikrSessionCounts.value[item.id] ?: 0
        if (currentCount < item.countTarget) {
            val newCount = currentCount + 1
            val currentMap = _dhikrSessionCounts.value.toMutableMap()
            currentMap[item.id] = newCount
            _dhikrSessionCounts.value = currentMap
            _totalSessionDhikrCount.value += 1

            if (newCount >= item.countTarget) {
                _completedDhikrIds.value = _completedDhikrIds.value + item.id
            }
        }
    }

    fun resetItemDhikrById(item: DhikrItem) {
        val currentCount = _dhikrSessionCounts.value[item.id] ?: 0
        val currentMap = _dhikrSessionCounts.value.toMutableMap()
        currentMap.remove(item.id)
        _dhikrSessionCounts.value = currentMap
        _completedDhikrIds.value = _completedDhikrIds.value - item.id
        _totalSessionDhikrCount.value = (_totalSessionDhikrCount.value - currentCount).coerceAtLeast(0)
    }

    fun resetCategoryDhikrSession(categoryId: String? = null) {
        val targetCatId = categoryId ?: _selectedDhikrCategory.value?.id ?: return
        val catItems = dhikrRepository.getItemsForCategory(targetCatId)
        val currentMap = _dhikrSessionCounts.value.toMutableMap()
        val currentCompleted = _completedDhikrIds.value.toMutableSet()
        
        catItems.forEach { item ->
            currentMap.remove(item.id)
            currentCompleted.remove(item.id)
        }
        
        _dhikrSessionCounts.value = currentMap
        _completedDhikrIds.value = currentCompleted
        _currentDhikrIndex.value = 0
        _dhikrItemProgressCount.value = 0
    }

    fun resetAllDhikrSessions() {
        _dhikrSessionCounts.value = emptyMap()
        _completedDhikrIds.value = emptySet()
        _totalSessionDhikrCount.value = 0
        _currentDhikrIndex.value = 0
        _dhikrItemProgressCount.value = 0
    }

    fun incrementTasbih() {
        _tasbihCount.value = _tasbihCount.value + 1
    }

    fun resetTasbih() {
        _tasbihCount.value = 0
    }

    fun setTasbihTarget(target: Int) {
        _tasbihTarget.value = target
        _tasbihCount.value = 0
    }

    fun setTasbihPhrase(phrase: String) {
        _tasbihPhrase.value = phrase
        _tasbihCount.value = 0
    }

    fun incrementSalawat() {
        _salawatCount.value = _salawatCount.value + 1
    }

    fun incrementIstighfar() {
        _istighfarCount.value = _istighfarCount.value + 1
    }

    fun selectDuaCategory(categoryId: String) {
        val cat = duaCategories.find { it.id == categoryId } ?: duaCategories.first()
        _selectedDuaCategory.value = cat
        _currentDuas.value = duaRepository.getDuasForCategory(categoryId)
    }

    fun toggleHabit(habitId: String) {
        val updated = _todayHabits.value.map { habit ->
            if (habit.id == habitId) habit.copy(isCompleted = !habit.isCompleted) else habit
        }
        _todayHabits.value = updated
    }

    fun playAyahAudio(ayah: Ayah) {
        val surah = _selectedSurah.value ?: return
        audioPlayerManager.playAyah(
            audioUrl = ayah.audioUrl,
            surahNumber = surah.number,
            ayahNumber = ayah.numberInSurah,
            ayahText = ayah.textArabic,
            reciterName = _selectedReciter.value.nameArabic
        )
    }

    fun toggleAudio() {
        audioPlayerManager.togglePlayPause()
    }

    fun stopAudio() {
        audioPlayerManager.stop()
    }

    fun setReciter(reciter: Reciter) {
        _selectedReciter.value = reciter
        _selectedSurah.value?.let { loadSurah(it.number) }
    }

    fun setLanguage(lang: String) {
        _appLanguage.value = lang
    }

    fun setThemeMode(mode: String) {
        _themeMode.value = mode
    }

    fun setQuranFontSize(size: Float) {
        _quranFontSize.value = size
    }

    fun toggleShowTranslation() {
        _showTranslation.value = !_showTranslation.value
    }

    fun selectCity(city: CityPreset) {
        _selectedCity.value = city
        _prayerSchedule.value = prayerRepository.calculatePrayerTimes(
            latitude = city.latitude,
            longitude = city.longitude
        )
        _qiblaData.value = prayerRepository.calculateQibla(
            userLat = city.latitude,
            userLng = city.longitude,
            deviceBearing = compassSensorManager.azimuth.value
        )
    }

    fun searchAsmaulHusna(query: String) {
        val trimmed = query.trim()
        if (trimmed.isEmpty()) {
            _filteredAsmaulHusna.value = asmaulHusnaList
        } else {
            _filteredAsmaulHusna.value = asmaulHusnaList.filter {
                it.nameArabic.contains(trimmed) ||
                it.transliteration.contains(trimmed, ignoreCase = true) ||
                it.meaningArabic.contains(trimmed) ||
                it.meaningEnglish.contains(trimmed, ignoreCase = true)
            }
        }
    }

    fun searchHadiths(query: String) {
        val trimmed = query.trim()
        if (trimmed.isEmpty()) {
            _filteredHadiths.value = nawawiHadithsList
        } else {
            _filteredHadiths.value = nawawiHadithsList.filter {
                it.titleArabic.contains(trimmed) ||
                it.titleEnglish.contains(trimmed, ignoreCase = true) ||
                it.matnArabic.contains(trimmed) ||
                it.explanationArabic.contains(trimmed) ||
                it.narratorArabic.contains(trimmed)
            }
        }
    }

    fun sendTestNotification(title: String, body: String) {
        notificationScheduler.showImmediateNotification(title, body)
    }


    override fun onCleared() {
        super.onCleared()
        compassSensorManager.stopListening()
        audioPlayerManager.stop()
    }
}
