package com.example.data.service

import android.content.Context
import android.media.AudioAttributes
import android.media.MediaPlayer
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

enum class AudioStatus {
    IDLE,
    PREPARING,
    PLAYING,
    PAUSED,
    ERROR
}

data class PlaybackState(
    val status: AudioStatus = AudioStatus.IDLE,
    val currentSurah: Int = 1,
    val currentAyah: Int = 1,
    val currentAyahText: String = "",
    val currentReciterName: String = "مشاري راشد العفاسي",
    val isPlaying: Boolean = false,
    val progress: Float = 0f
)

class AudioPlayerManager(private val context: Context) {

    private var mediaPlayer: MediaPlayer? = null
    private val _playbackState = MutableStateFlow(PlaybackState())
    val playbackState: StateFlow<PlaybackState> = _playbackState.asStateFlow()

    fun playAyah(
        audioUrl: String,
        surahNumber: Int,
        ayahNumber: Int,
        ayahText: String,
        reciterName: String
    ) {
        try {
            mediaPlayer?.release()
            mediaPlayer = null

            _playbackState.value = _playbackState.value.copy(
                status = AudioStatus.PREPARING,
                currentSurah = surahNumber,
                currentAyah = ayahNumber,
                currentAyahText = ayahText,
                currentReciterName = reciterName,
                isPlaying = true
            )

            mediaPlayer = MediaPlayer().apply {
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .build()
                )
                setDataSource(audioUrl)
                setOnPreparedListener { mp ->
                    mp.start()
                    _playbackState.value = _playbackState.value.copy(
                        status = AudioStatus.PLAYING,
                        isPlaying = true
                    )
                }
                setOnCompletionListener {
                    _playbackState.value = _playbackState.value.copy(
                        status = AudioStatus.IDLE,
                        isPlaying = false
                    )
                }
                setOnErrorListener { _, _, _ ->
                    _playbackState.value = _playbackState.value.copy(
                        status = AudioStatus.ERROR,
                        isPlaying = false
                    )
                    true
                }
                prepareAsync()
            }
        } catch (e: Exception) {
            _playbackState.value = _playbackState.value.copy(
                status = AudioStatus.ERROR,
                isPlaying = false
            )
        }
    }

    fun togglePlayPause() {
        mediaPlayer?.let { player ->
            if (player.isPlaying) {
                player.pause()
                _playbackState.value = _playbackState.value.copy(
                    status = AudioStatus.PAUSED,
                    isPlaying = false
                )
            } else {
                player.start()
                _playbackState.value = _playbackState.value.copy(
                    status = AudioStatus.PLAYING,
                    isPlaying = true
                )
            }
        }
    }

    private var toneGenerator: android.media.ToneGenerator? = null

    fun playDhikrCompletionTone() {
        try {
            if (toneGenerator == null) {
                toneGenerator = android.media.ToneGenerator(android.media.AudioManager.STREAM_NOTIFICATION, 75)
            }
            toneGenerator?.startTone(android.media.ToneGenerator.TONE_PROP_BEEP2, 180)
        } catch (_: Exception) {
            // Ignored safely
        }
    }

    fun playBeadClick() {
        try {
            if (toneGenerator == null) {
                toneGenerator = android.media.ToneGenerator(android.media.AudioManager.STREAM_NOTIFICATION, 45)
            }
            toneGenerator?.startTone(android.media.ToneGenerator.TONE_PROP_BEEP, 30)
        } catch (_: Exception) {
            // Ignored safely
        }
    }

    fun stop() {
        try {
            mediaPlayer?.stop()
            mediaPlayer?.release()
            mediaPlayer = null
            _playbackState.value = _playbackState.value.copy(
                status = AudioStatus.IDLE,
                isPlaying = false
            )
        } catch (e: Exception) {
            // Ignored
        }
    }
}
