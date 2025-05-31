// ゲームの状態管理
class JustArrangeGame {
    constructor() {
        this.currentStage = 0;
        this.arrangedItems = [];
        this.isDragging = false;
        this.totalScore = 0;
        this.streakCount = 0;
        this.skipCount = 0; // スキップ回数を追加
        this.audioContext = null;
        this.bgmOscillators = [];
        this.bgmGainNode = null;
        this.isBgmPlaying = false;
        this.bgmEnabled = false; // BGMをデフォルトで無効に
        this.masterVolume = 0.0; // マスター音量（0-1）
        this.isMuted = true; // 最初はミュート状態
        
        // 外部BGMファイルは使用せず、合成BGMのみを使用
        this.useSyntheticBgm = true;
        
        // Audio要素を準備（リザルト画面用の簡単な効果音）
        this.bgmAudio = null;
        this.victoryAudio = null;
        
        this.stages = [
            {
                theme: "成長の物語",
                hint: "生命の成長には順番がある...",
                items: ["🥚", "🐣", "🐥", "🐔"],
                solutions: [
                    {
                        pattern: ["🥚", "🐣", "🐥", "🐔"],
                        feedback: {
                            animation: ["🌟", "✨", "🎉"],
                            text: "美しい成長の物語！",
                            sound: "success"
                        }
                    }
                ]
            },
            {
                theme: "一日の流れ",
                hint: "時は流れ、景色は変わる...",
                items: ["🌙", "🌅", "☀️", "🌇"],
                solutions: [
                    {
                        pattern: ["🌙", "🌅", "☀️", "🌇"],
                        feedback: {
                            animation: ["🌈", "💫", "⭐"],
                            text: "夜から始まる一日の物語！",
                            sound: "success"
                        }
                    },
                    {
                        pattern: ["🌅", "☀️", "🌇", "🌙"],
                        feedback: {
                            animation: ["🔄", "✨", "🎵"],
                            text: "朝から始まる美しい一日！",
                            sound: "alternative"
                        }
                    },
                    {
                        pattern: ["🌇", "🌙", "🌅", "☀️"],
                        feedback: {
                            animation: ["🌀", "💙", "🌀"],
                            text: "時は循環する...",
                            sound: "alternative"
                        }
                    }
                ]
            },
            {
                theme: "サイズの調和",
                hint: "大きさには美しい順番がある...",
                items: ["🐭", "🐱", "🐕", "🐘"],
                solutions: [
                    {
                        pattern: ["🐭", "🐱", "🐕", "🐘"],
                        feedback: {
                            animation: ["📏", "✨", "📏"],
                            text: "小さなものから大きなものへ！",
                            sound: "rhythm"
                        }
                    },
                    {
                        pattern: ["🐘", "🐕", "🐱", "🐭"],
                        feedback: {
                            animation: ["🔽", "💫", "🔽"],
                            text: "大きなものから小さなものへ...",
                            sound: "alternative"
                        }
                    }
                ]
            },
            {
                theme: "感情のグラデーション",
                hint: "心の変化を並べてみて...",
                items: ["😢", "😐", "🙂", "😊", "😍"],
                solutions: [
                    {
                        pattern: ["😢", "😐", "🙂", "😊", "😍"],
                        feedback: {
                            animation: ["💖", "✨", "🌈"],
                            text: "心が明るくなっていく...",
                            sound: "emotional"
                        }
                    },
                    {
                        pattern: ["😍", "😊", "🙂", "😐", "😢"],
                        feedback: {
                            animation: ["🌧️", "💙", "🌧️"],
                            text: "悲しみも美しい物語...",
                            sound: "melancholy"
                        }
                    },
                    {
                        pattern: ["😐", "🙂", "😊", "😍", "😢"],
                        feedback: {
                            animation: ["🎭", "🌟", "🎭"],
                            text: "喜びと悲しみの調和...",
                            sound: "alternative"
                        }
                    }
                ]
            },
            {
                theme: "季節の巡り",
                hint: "自然の循環に耳を澄ませて...",
                items: ["🌸", "☀️", "🍂", "❄️"],
                solutions: [
                    {
                        pattern: ["🌸", "☀️", "🍂", "❄️"],
                        feedback: {
                            animation: ["🔄", "🌿", "💫"],
                            text: "春から始まる季節の巡り...",
                            sound: "nature"
                        }
                    },
                    {
                        pattern: ["❄️", "🌸", "☀️", "🍂"],
                        feedback: {
                            animation: ["🌟", "❄️", "🌟"],
                            text: "冬から始まる新しい物語...",
                            sound: "alternative"
                        }
                    },
                    {
                        pattern: ["☀️", "🍂", "❄️", "🌸"],
                        feedback: {
                            animation: ["🌞", "🍃", "🌞"],
                            text: "夏から始まる季節の輪...",
                            sound: "alternative"
                        }
                    },
                    {
                        pattern: ["🍂", "❄️", "🌸", "☀️"],
                        feedback: {
                            animation: ["🍁", "✨", "🍁"],
                            text: "秋から始まる自然の詩...",
                            sound: "alternative"
                        }
                    }
                ]
            },
            {
                theme: "食物連鎖",
                hint: "生物間の食べられる関係...",
                items: ["🐟", "🐙", "🐚", "🐌"],
                solutions: [
                    {
                        pattern: ["🐟", "🐙", "🐚", "🐌"],
                        feedback: {
                            animation: ["🌿", "✨", "🌿"],
                            text: "食物連鎖の美しい物語！",
                            sound: "success"
                        }
                    },
                    {
                        pattern: ["🐙", "🐟", "🐚", "🐌"],
                        feedback: {
                            animation: ["🌿", "💫", "🌿"],
                            text: "食物連鎖の複雑な物語！",
                            sound: "alternative"
                        }
                    },
                    {
                        pattern: ["🐚", "🐟", "🐙", "🐌"],
                        feedback: {
                            animation: ["🌿", "💫", "🌿"],
                            text: "食物連鎖の異なる視点！",
                            sound: "alternative"
                        }
                    }
                ]
            },
            {
                theme: "水の状態変化",
                hint: "水は様々な形を変える...",
                items: ["🌧️", "🌨️", "🌊", "🌋"],
                solutions: [
                    {
                        pattern: ["🌧️", "🌨️", "🌊", "🌋"],
                        feedback: {
                            animation: ["🌿", "✨", "🌿"],
                            text: "水の多様な物語！",
                            sound: "success"
                        }
                    },
                    {
                        pattern: ["🌨️", "🌧️", "🌊", "🌋"],
                        feedback: {
                            animation: ["🌿", "💫", "🌿"],
                            text: "水の変化の美しさ！",
                            sound: "alternative"
                        }
                    },
                    {
                        pattern: ["🌊", "🌧️", "🌨️", "🌋"],
                        feedback: {
                            animation: ["🌿", "💫", "🌿"],
                            text: "水の異なる状態の物語！",
                            sound: "alternative"
                        }
                    }
                ]
            },
            {
                theme: "音楽のピッチ",
                hint: "音楽は高さによって構成される...",
                items: ["🎶", "🎵", "🎤", "🎹"],
                solutions: [
                    {
                        pattern: ["🎶", "🎵", "🎤", "🎹"],
                        feedback: {
                            animation: ["🌟", "✨", "🎉"],
                            text: "音楽の高さの物語！",
                            sound: "success"
                        }
                    },
                    {
                        pattern: ["🎵", "🎶", "🎤", "🎹"],
                        feedback: {
                            animation: ["🌟", "💫", "🎉"],
                            text: "音楽の異なる視点の物語！",
                            sound: "alternative"
                        }
                    },
                    {
                        pattern: ["🎤", "🎵", "🎶", "🎹"],
                        feedback: {
                            animation: ["🌟", "💫", "🎉"],
                            text: "音楽の異なる側面の物語！",
                            sound: "alternative"
                        }
                    }
                ]
            },
            {
                theme: "建築構造",
                hint: "建築は様々な形を持つ...",
                items: ["🏠", "🏢", "🏭", "🏛️"],
                solutions: [
                    {
                        pattern: ["🏠", "🏢", "🏭", "🏛️"],
                        feedback: {
                            animation: ["🌟", "✨", "🎉"],
                            text: "建築の様々な形の物語！",
                            sound: "success"
                        }
                    },
                    {
                        pattern: ["🏢", "🏠", "🏭", "🏛️"],
                        feedback: {
                            animation: ["🌟", "💫", "🎉"],
                            text: "建築の異なる視点の物語！",
                            sound: "alternative"
                        }
                    },
                    {
                        pattern: ["🏭", "🏢", "🏠", "🏛️"],
                        feedback: {
                            animation: ["🌟", "💫", "🎉"],
                            text: "建築の異なる側面の物語！",
                            sound: "alternative"
                        }
                    }
                ]
            },
            {
                theme: "宇宙の階層",
                hint: "宇宙は小さなものから大きなものへと階層を成す...",
                items: ["🪐", "🌍", "☀️", "🌌"],
                solutions: [
                    {
                        pattern: ["🪐", "🌍", "☀️", "🌌"],
                        feedback: {
                            animation: ["🌟", "✨", "🎉"],
                            text: "惑星から宇宙へ！美しい階層の物語",
                            sound: "success"
                        }
                    },
                    {
                        pattern: ["🌌", "☀️", "🌍", "🪐"],
                        feedback: {
                            animation: ["🌟", "💫", "🎉"],
                            text: "宇宙から惑星へ...壮大なスケールの物語！",
                            sound: "alternative"
                        }
                    },
                    {
                        pattern: ["🌍", "🪐", "☀️", "🌌"],
                        feedback: {
                            animation: ["🌟", "💫", "🎉"],
                            text: "地球から始まる宇宙の旅！",
                            sound: "alternative"
                        }
                    }
                ]
            },
            {
                theme: "料理の工程",
                hint: "料理は様々な工程を経る...",
                items: ["🍳", "🥣", "🥗", "🍽️"],
                solutions: [
                    {
                        pattern: ["🍳", "🥣", "🥗", "🍽️"],
                        feedback: {
                            animation: ["🌟", "✨", "🎉"],
                            text: "料理の様々な工程の物語！",
                            sound: "success"
                        }
                    },
                    {
                        pattern: ["🥣", "🍳", "🥗", "🍽️"],
                        feedback: {
                            animation: ["🌟", "💫", "🎉"],
                            text: "料理の異なる視点の物語！",
                            sound: "alternative"
                        }
                    },
                    {
                        pattern: ["🥗", "🍳", "🥣", "🍽️"],
                        feedback: {
                            animation: ["🌟", "💫", "🎉"],
                            text: "料理の異なる側面の物語！",
                            sound: "alternative"
                        }
                    }
                ]
            }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadStage(this.currentStage);
        this.setupDragAndDrop();
        this.initAudio();
        this.setupVolumeControls(); // 音量制御のセットアップを追加
        this.updateProgressBar();
        // BGMの自動開始を削除（音量制御で手動開始）
    }

    setupEventListeners() {
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetArrangement();
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextStage();
        });

        document.getElementById('skip-btn').addEventListener('click', () => {
            this.skipStage();
        });
    }

    // 音量制御のセットアップ
    setupVolumeControls() {
        const volumeSlider = document.getElementById('volume-slider');
        const volumePercentage = document.getElementById('volume-percentage');
        const audioToggleBtn = document.getElementById('audio-toggle-btn');

        if (volumeSlider && volumePercentage && audioToggleBtn) {
            // 初期状態をミュート状態（0%）に設定
            volumeSlider.value = 0;
            volumePercentage.textContent = '0%';
            this.masterVolume = 0.0;
            this.isMuted = true;
            audioToggleBtn.textContent = '🔇';
            audioToggleBtn.classList.add('muted');

            // 音量スライダーのイベント
            volumeSlider.addEventListener('input', (e) => {
                const percentage = parseInt(e.target.value);
                volumePercentage.textContent = `${percentage}%`;
                this.setMasterVolume(percentage);
                
                // スライダーを動かした場合はミュート解除
                if (percentage > 0 && this.isMuted) {
                    this.isMuted = false;
                    this.updateAudioToggleButton();
                }
            });

            // ミュートボタンのイベント
            audioToggleBtn.addEventListener('click', () => {
                this.toggleMute();
            });
        }
    }

    // マスター音量の設定
    setMasterVolume(percentage) {
        this.masterVolume = percentage / 100.0;
        
        // マスター音量に応じてBGMの有効/無効を切り替え
        if (percentage > 0) {
            this.bgmEnabled = true;
            // BGMが再生されていない場合は開始
            if (!this.isBgmPlaying) {
                this.startBgm();
            }
        } else {
            this.bgmEnabled = false;
            this.stopBgm();
        }
        
        // BGMが再生中の場合、リアルタイムで音量を更新
        if (this.bgmGainNode && this.audioContext) {
            const bgmVolume = this.masterVolume * 0.2; // マスター音量を適用（0.03→0.2に変更）
            this.bgmGainNode.gain.setValueAtTime(bgmVolume, this.audioContext.currentTime);
        }
        
        // ビクトリーBGMが再生中の場合も音量を更新
        if (this.victoryAudio) {
            this.victoryAudio.volume = this.masterVolume * 0.5; // ビクトリー音量係数
        }
        
        // ミュート状態の更新
        if (percentage === 0) {
            this.isMuted = true;
        } else if (this.isMuted) {
            this.isMuted = false;
        }
        
        this.updateAudioToggleButton();
    }

    // ミュート/ミュート解除の切り替え
    toggleMute() {
        const volumeSlider = document.getElementById('volume-slider');
        const volumePercentage = document.getElementById('volume-percentage');
        
        if (this.isMuted) {
            // ミュート解除: 30%に設定
            this.isMuted = false;
            this.bgmEnabled = true; // BGMを有効化
            this.setMasterVolume(30);
            if (volumeSlider) volumeSlider.value = 30;
            if (volumePercentage) volumePercentage.textContent = '30%';
        } else {
            // ミュート: 0%に設定
            this.isMuted = true;
            this.bgmEnabled = false; // BGMを無効化
            this.setMasterVolume(0);
            if (volumeSlider) volumeSlider.value = 0;
            if (volumePercentage) volumePercentage.textContent = '0%';
        }
        
        this.updateAudioToggleButton();
    }

    // 音量ボタンの表示を更新
    updateAudioToggleButton() {
        const audioToggleBtn = document.getElementById('audio-toggle-btn');
        
        if (this.isMuted || this.masterVolume === 0) {
            audioToggleBtn.textContent = '🔇';
            audioToggleBtn.classList.add('muted');
            audioToggleBtn.title = '音量をオンにする';
        } else {
            audioToggleBtn.textContent = '🔊';
            audioToggleBtn.classList.remove('muted');
            audioToggleBtn.title = '音量をミュートする';
        }
    }

    loadStage(stageIndex) {
        if (stageIndex >= this.stages.length) {
            this.showGameComplete();
            return;
        }

        const stage = this.stages[stageIndex];
        
        // ステージ切り替えの演出
        if (stageIndex > 0) {
            this.showStageTransition(stageIndex);
        }
        
        // ステージ情報を更新
        document.getElementById('current-stage').textContent = stageIndex + 1;
        document.getElementById('theme-hint').textContent = stage.hint;
        
        // 前のステージのアイテムを完全にクリア
        this.clearAllItems();
        
        // 新しいステージのアイテムを作成
        this.createItems(stage.items);
        
        // UI状態をリセット
        this.resetFeedback();
        document.getElementById('next-btn').style.display = 'none';
        
        // プログレスバー更新
        this.updateProgressBar();
        
        this.arrangedItems = [];
    }

    setupDragAndDrop() {
        const itemsPool = document.getElementById('items-pool');
        const dropZone = document.getElementById('drop-zone');

        // タッチデバイス用の変数
        this.touchData = {
            isDragging: false,
            dragElement: null,
            startX: 0,
            startY: 0,
            offsetX: 0,
            offsetY: 0,
            longPressTimer: null,
            placeholder: null
        };

        // 長押し時間の設定（ミリ秒）
        const LONG_PRESS_DURATION = 500;

        // ドラッグ開始（デスクトップ）
        itemsPool.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('draggable-item')) {
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.dataset.item);
                e.dataTransfer.setData('source', 'pool');
                this.isDragging = true;
            }
        });

        // ドラッグ終了（デスクトップ）
        itemsPool.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('draggable-item')) {
                e.target.classList.remove('dragging');
                this.isDragging = false;
            }
        });

        // タッチ開始（モバイル）
        itemsPool.addEventListener('touchstart', (e) => {
            const target = e.target.closest('.draggable-item');
            if (!target) return;

            e.preventDefault(); // デフォルトの動作を防止
            const touch = e.touches[0];
            
            this.touchData.startX = touch.clientX;
            this.touchData.startY = touch.clientY;
            
            // 長押しタイマーを設定
            this.touchData.longPressTimer = setTimeout(() => {
                this.startTouchDrag(target, touch);
            }, LONG_PRESS_DURATION);
        }, { passive: false });

        // タッチ移動（モバイル）
        document.addEventListener('touchmove', (e) => {
            if (!this.touchData.isDragging) {
                // ドラッグが開始されていない場合、少しでも動いたら長押しタイマーをクリア
                const touch = e.touches[0];
                const deltaX = Math.abs(touch.clientX - this.touchData.startX);
                const deltaY = Math.abs(touch.clientY - this.touchData.startY);
                
                if (deltaX > 10 || deltaY > 10) {
                    clearTimeout(this.touchData.longPressTimer);
                }
                return;
            }

            e.preventDefault();
            const touch = e.touches[0];
            
            // ドラッグ中の要素の位置を更新
            if (this.touchData.dragElement) {
                const x = touch.clientX - this.touchData.offsetX;
                const y = touch.clientY - this.touchData.offsetY;
                
                this.touchData.dragElement.style.position = 'fixed';
                this.touchData.dragElement.style.left = x + 'px';
                this.touchData.dragElement.style.top = y + 'px';
                this.touchData.dragElement.style.zIndex = '1000';
                this.touchData.dragElement.style.pointerEvents = 'none';
                
                // ドロップゾーンとの衝突判定
                this.checkTouchDropZone(touch.clientX, touch.clientY);
            }
        }, { passive: false });

        // タッチ終了（モバイル）
        document.addEventListener('touchend', (e) => {
            clearTimeout(this.touchData.longPressTimer);
            
            if (this.touchData.isDragging) {
                e.preventDefault();
                this.endTouchDrag(e.changedTouches[0]);
            }
        }, { passive: false });

        // ドロップゾーンでのドラッグオーバー（デスクトップ）
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', (e) => {
            if (!dropZone.contains(e.relatedTarget)) {
                dropZone.classList.remove('drag-over');
            }
        });

        // ドロップ処理（デスクトップ）
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');

            const itemData = e.dataTransfer.getData('text/plain');
            const source = e.dataTransfer.getData('source');

            if (source === 'pool') {
                this.moveItemToDropZone(itemData);
            }
        });

        // ドロップゾーン内でのドラッグ開始（デスクトップ）
        dropZone.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('draggable-item')) {
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.dataset.item);
                e.dataTransfer.setData('source', 'zone');
                e.dataTransfer.setData('index', Array.from(dropZone.children).indexOf(e.target));
            }
        });

        // ドロップゾーン内での並び替え（デスクトップ）
        dropZone.addEventListener('drop', (e) => {
            const itemData = e.dataTransfer.getData('text/plain');
            const source = e.dataTransfer.getData('source');
            
            if (source === 'zone') {
                const sourceIndex = parseInt(e.dataTransfer.getData('index'));
                const targetElement = e.target.closest('.draggable-item');
                
                if (targetElement && targetElement !== dropZone.children[sourceIndex]) {
                    const targetIndex = Array.from(dropZone.children).indexOf(targetElement);
                    this.reorderItems(sourceIndex, targetIndex);
                }
            }
        });

        // ドロップゾーン内でのタッチ開始
        dropZone.addEventListener('touchstart', (e) => {
            const target = e.target.closest('.draggable-item');
            if (!target) return;

            e.preventDefault();
            const touch = e.touches[0];
            
            this.touchData.startX = touch.clientX;
            this.touchData.startY = touch.clientY;
            
            // 長押しタイマーを設定
            this.touchData.longPressTimer = setTimeout(() => {
                this.startTouchDragInZone(target, touch);
            }, LONG_PRESS_DURATION);
        }, { passive: false });
    }

    // タッチドラッグ開始
    startTouchDrag(element, touch) {
        this.touchData.isDragging = true;
        this.touchData.dragElement = element;
        
        const rect = element.getBoundingClientRect();
        this.touchData.offsetX = touch.clientX - rect.left;
        this.touchData.offsetY = touch.clientY - rect.top;
        
        // プレースホルダーを作成
        this.touchData.placeholder = element.cloneNode(true);
        this.touchData.placeholder.style.opacity = '0.3';
        this.touchData.placeholder.style.transform = 'scale(0.9)';
        this.touchData.placeholder.classList.add('placeholder');
        element.parentNode.insertBefore(this.touchData.placeholder, element);
        
        element.classList.add('dragging');
        element.style.transform = 'scale(1.1) rotate(5deg)';
        
        // 触覚フィードバック（対応デバイスのみ・安全に実行）
        try {
            if (navigator.vibrate && typeof navigator.vibrate === 'function') {
                navigator.vibrate(50);
            }
        } catch (e) {
            // 振動が許可されていない場合は無視
        }
    }

    // ゾーン内でのタッチドラッグ開始
    startTouchDragInZone(element, touch) {
        this.touchData.isDragging = true;
        this.touchData.dragElement = element;
        this.touchData.sourceIndex = Array.from(element.parentNode.children).indexOf(element);
        
        const rect = element.getBoundingClientRect();
        this.touchData.offsetX = touch.clientX - rect.left;
        this.touchData.offsetY = touch.clientY - rect.top;
        
        // プレースホルダーを作成
        this.touchData.placeholder = element.cloneNode(true);
        this.touchData.placeholder.style.opacity = '0.3';
        this.touchData.placeholder.style.transform = 'scale(0.9)';
        this.touchData.placeholder.classList.add('placeholder');
        element.parentNode.insertBefore(this.touchData.placeholder, element);
        
        element.classList.add('dragging');
        element.style.transform = 'scale(1.1) rotate(5deg)';
        
        // 触覚フィードバック（安全に実行）
        try {
            if (navigator.vibrate && typeof navigator.vibrate === 'function') {
                navigator.vibrate(50);
            }
        } catch (e) {
            // 振動が許可されていない場合は無視
        }
    }

    // タッチドロップゾーンの衝突判定
    checkTouchDropZone(x, y) {
        const dropZone = document.getElementById('drop-zone');
        const rect = dropZone.getBoundingClientRect();
        
        const isOverDropZone = (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
        );
        
        if (isOverDropZone) {
            dropZone.classList.add('drag-over');
            
            // ゾーン内での並び替えの場合
            if (this.touchData.sourceIndex !== undefined) {
                const items = Array.from(dropZone.children).filter(child => 
                    child.classList.contains('draggable-item') && !child.classList.contains('placeholder')
                );
                
                // 最も近いアイテムを見つける
                let closestItem = null;
                let closestDistance = Infinity;
                
                items.forEach(item => {
                    if (item === this.touchData.dragElement) return;
                    
                    const itemRect = item.getBoundingClientRect();
                    const itemCenterX = itemRect.left + itemRect.width / 2;
                    const itemCenterY = itemRect.top + itemRect.height / 2;
                    const distance = Math.sqrt(
                        Math.pow(x - itemCenterX, 2) + Math.pow(y - itemCenterY, 2)
                    );
                    
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestItem = item;
                    }
                });
                
                // プレースホルダーの位置を更新
                if (closestItem && this.touchData.placeholder) {
                    const insertBefore = x < closestItem.getBoundingClientRect().left + closestItem.getBoundingClientRect().width / 2;
                    if (insertBefore) {
                        dropZone.insertBefore(this.touchData.placeholder, closestItem);
                    } else {
                        dropZone.insertBefore(this.touchData.placeholder, closestItem.nextSibling);
                    }
                }
            }
        } else {
            dropZone.classList.remove('drag-over');
        }
    }

    // タッチドラッグ終了
    endTouchDrag(touch) {
        const dropZone = document.getElementById('drop-zone');
        const rect = dropZone.getBoundingClientRect();
        
        const isOverDropZone = (
            touch.clientX >= rect.left &&
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top &&
            touch.clientY <= rect.bottom
        );
        
        if (this.touchData.dragElement) {
            // スタイルをリセット
            this.touchData.dragElement.style.position = '';
            this.touchData.dragElement.style.left = '';
            this.touchData.dragElement.style.top = '';
            this.touchData.dragElement.style.zIndex = '';
            this.touchData.dragElement.style.pointerEvents = '';
            this.touchData.dragElement.style.transform = '';
            this.touchData.dragElement.classList.remove('dragging');
            
            if (isOverDropZone) {
                // ドロップゾーンのヒントテキストを削除（最初のアイテムを追加する際）
                const dropHint = dropZone.querySelector('.drop-hint');
                if (dropHint) {
                    dropHint.remove();
                }

                if (this.touchData.sourceIndex !== undefined) {
                    // ゾーン内での並び替え
                    const targetIndex = Array.from(dropZone.children).indexOf(this.touchData.placeholder);
                    if (targetIndex !== -1 && targetIndex !== this.touchData.sourceIndex) {
                        dropZone.insertBefore(this.touchData.dragElement, this.touchData.placeholder);
                        this.updateArrangement();
                        this.playMoveSound();
                    } else {
                        // 元の位置に戻す
                        dropZone.insertBefore(this.touchData.dragElement, this.touchData.placeholder);
                    }
                } else {
                    // プールからドロップゾーンへの移動
                    this.moveItemToDropZone(this.touchData.dragElement.dataset.item);
                }
                
                // 成功の触覚フィードバック（安全に実行）
                try {
                    if (navigator.vibrate && typeof navigator.vibrate === 'function') {
                        navigator.vibrate([30, 50, 30]);
                    }
                } catch (e) {
                    // 振動が許可されていない場合は無視
                }
            } else {
                // ドロップ失敗の場合、元の位置に戻す
                if (this.touchData.sourceIndex !== undefined) {
                    dropZone.insertBefore(this.touchData.dragElement, this.touchData.placeholder);
                }
            }
            
            // プレースホルダーを削除
            if (this.touchData.placeholder) {
                this.touchData.placeholder.remove();
            }
        }
        
        dropZone.classList.remove('drag-over');
        
        // タッチデータをリセット
        this.touchData = {
            isDragging: false,
            dragElement: null,
            startX: 0,
            startY: 0,
            offsetX: 0,
            offsetY: 0,
            longPressTimer: null,
            placeholder: null,
            sourceIndex: undefined
        };
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    updateProgressBar() {
        const progress = (this.currentStage / this.stages.length) * 100;
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        if (progressText) {
            progressText.textContent = `${this.currentStage}/${this.stages.length}`;
        }
    }

    clearAllItems() {
        const itemsPool = document.getElementById('items-pool');
        const dropZone = document.getElementById('drop-zone');
        
        // アイテムプールを完全にクリア
        itemsPool.innerHTML = '';
        
        // ドロップゾーンからすべてのアイテムを削除
        const arrangedItems = dropZone.querySelectorAll('.draggable-item');
        arrangedItems.forEach(item => {
            item.remove();
        });
        
        // ヒントテキストを再表示
        const dropHint = dropZone.querySelector('.drop-hint');
        if (!dropHint) {
            const hintElement = document.createElement('p');
            hintElement.className = 'drop-hint';
            hintElement.textContent = 'ここに並べてください';
            dropZone.appendChild(hintElement);
        }
    }

    createItems(items) {
        const itemsPool = document.getElementById('items-pool');
        
        // 念のため再度クリア
        itemsPool.innerHTML = '';

        // アイテムをシャッフル
        const shuffledItems = [...items].sort(() => Math.random() - 0.5);

        shuffledItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'draggable-item';
            itemElement.textContent = item;
            itemElement.draggable = true;
            itemElement.dataset.item = item;
            itemElement.dataset.originalIndex = index;
            
            itemsPool.appendChild(itemElement);
        });
    }

    moveItemToDropZone(itemData) {
        const sourceItem = document.querySelector(`[data-item="${itemData}"]`);
        if (!sourceItem || sourceItem.parentElement.id === 'drop-zone') return;

        // ドロップゾーンのヒントテキストを削除
        const dropZone = document.getElementById('drop-zone');
        const dropHint = dropZone.querySelector('.drop-hint');
        if (dropHint) {
            dropHint.remove();
        }

        sourceItem.classList.add('in-zone');
        dropZone.appendChild(sourceItem);
        
        this.updateArrangement();
        this.playMoveSound();
    }

    reorderItems(fromIndex, toIndex) {
        const dropZone = document.getElementById('drop-zone');
        const items = Array.from(dropZone.children);
        
        if (fromIndex < toIndex) {
            dropZone.insertBefore(items[fromIndex], items[toIndex].nextSibling);
        } else {
            dropZone.insertBefore(items[fromIndex], items[toIndex]);
        }
        
        this.updateArrangement();
        this.playMoveSound();
    }

    updateArrangement() {
        const dropZone = document.getElementById('drop-zone');
        this.arrangedItems = Array.from(dropZone.children)
            .filter(child => child.classList.contains('draggable-item'))
            .map(item => item.dataset.item);
        
        this.checkSolution();
    }

    checkSolution() {
        if (this.arrangedItems.length === 0) return;

        const currentStage = this.stages[this.currentStage];
        const solution = currentStage.solutions.find(sol => 
            this.arraysEqual(sol.pattern, this.arrangedItems)
        );

        if (solution) {
            this.showSuccess(solution.feedback);
        } else if (this.arrangedItems.length === currentStage.items.length) {
            this.showNeutralFeedback();
        }
    }

    arraysEqual(a, b) {
        return a.length === b.length && a.every((val, i) => val === b[i]);
    }

    startBgm() {

        if (this.isBgmPlaying || !this.bgmEnabled) {
            return;
        }

        this.playMelodicBgm();
    }

    stopBgm() {
        if (this.bgmAudio) {
            this.bgmAudio.pause();
            this.bgmAudio.currentTime = 0;
            this.bgmAudio = null;
        }
        
        // 合成BGMの停止処理（フォールバック用）
        if (this.bgmOscillators.length > 0) {
            this.bgmOscillators.forEach(node => {
                try {
                    if (node.stop) {
                        node.stop();
                    } else if (node.disconnect) {
                        node.disconnect();
                    }
                } catch (e) {
                    // Already stopped or disconnected
                }
            });
            
            // ゲインノードも切断
            if (this.bgmGainNode) {
                try {
                    this.bgmGainNode.disconnect();
                } catch (e) {
                    // Already disconnected
                }
            }
            
            this.bgmOscillators = [];
            this.bgmGainNode = null;
        }
        
        this.isBgmPlaying = false;
    }

    playVictoryBgm() {
        this.playOriginalVictoryBgm();
    }

    // メロディックBGMを再生するメソッド
    playMelodicBgm() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('Web Audio API not supported');
                return;
            }
        }
        
        this.bgmGainNode = this.audioContext.createGain();
        this.bgmGainNode.connect(this.audioContext.destination);
        const bgmVolume = this.masterVolume * 0.2; // マスター音量を適用（0.03→0.2に変更）
        this.bgmGainNode.gain.setValueAtTime(bgmVolume, this.audioContext.currentTime);
        
        this.isBgmPlaying = true;
        
        // より豊かなコード進行 (I - vi - IV - V - iii - vi - ii - V)
        const chordProgression = [
            [261.63, 329.63, 392.00, 523.25], // C major 7 (C-E-G-C)
            [220.00, 261.63, 329.63, 440.00], // A minor 7 (A-C-E-A)
            [174.61, 220.00, 261.63, 349.23], // F major 7 (F-A-C-F)
            [196.00, 246.94, 293.66, 392.00], // G major 7 (G-B-D-G)
            [164.81, 207.65, 246.94, 329.63], // E minor 7 (E-G#-B-E)
            [220.00, 277.18, 329.63, 440.00], // A minor 7 (A-C#-E-A)
            [146.83, 185.00, 220.00, 293.66], // D minor 7 (D-F#-A-D)
            [196.00, 246.94, 293.66, 392.00]  // G major 7 (G-B-D-G)
        ];

        // より表現豊かなメロディーライン（16小節）
        const mainMelody = [
            // フレーズ1（明るく上昇）
            523.25, 587.33, 659.25, 698.46, 783.99, 659.25, 523.25, 587.33,
            // フレーズ2（装飾的下降）
            659.25, 622.25, 587.33, 554.37, 523.25, 493.88, 466.16, 440.00,
            // フレーズ3（跳躍とアルペジオ）
            392.00, 523.25, 659.25, 523.25, 392.00, 466.16, 523.25, 440.00,
            // フレーズ4（クライマックス）
            783.99, 659.25, 587.33, 523.25, 659.25, 587.33, 523.25, 493.88
        ];

        // カウンターメロディー（ハーモニー）
        const counterMelody = [
            329.63, 369.99, 415.30, 440.00, 493.88, 415.30, 329.63, 369.99,
            415.30, 392.00, 369.99, 349.23, 329.63, 311.13, 293.66, 277.18,
            261.63, 329.63, 415.30, 329.63, 261.63, 293.66, 329.63, 277.18,
            493.88, 415.30, 369.99, 329.63, 415.30, 369.99, 329.63, 311.13
        ];

        // アルペジオパターン
        const arpeggioPattern = [
            261.63, 329.63, 392.00, 523.25, 392.00, 329.63, // C major arpeggio
            220.00, 261.63, 329.63, 440.00, 329.63, 261.63, // A minor arpeggio
            174.61, 220.00, 261.63, 349.23, 261.63, 220.00, // F major arpeggio
            196.00, 246.94, 293.66, 392.00, 293.66, 246.94  // G major arpeggio
        ];

        let currentChordIndex = 0;
        let currentMelodyIndex = 0;
        let currentCounterIndex = 0;
        let currentArpeggioIndex = 0;
        
        const chordDuration = 3000; // 3秒ごとにコード変更
        const melodyDuration = 750; // 0.75秒ごとにメロディー音符
        const arpeggioSpeed = 250; // アルペジオの速度

        const playFullBgm = () => {
            if (!this.isBgmPlaying) return;

            // 和音の演奏（より豊かな響き）
            const currentChord = chordProgression[currentChordIndex];
            currentChord.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                const filter = this.audioContext.createBiquadFilter();

                oscillator.connect(filter);
                filter.connect(gain);
                gain.connect(this.bgmGainNode);

                // 音色をインデックスに応じて変化
                oscillator.type = index < 2 ? 'sine' : 'triangle';
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);

                // フィルター設定
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(1200 + index * 200, this.audioContext.currentTime);
                filter.Q.setValueAtTime(0.7, this.audioContext.currentTime);

                // 動的な音量変化
                const baseVolume = 0.08 - index * 0.015;
                gain.gain.setValueAtTime(0, this.audioContext.currentTime);
                gain.gain.linearRampToValueAtTime(baseVolume, this.audioContext.currentTime + 0.3);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + chordDuration / 1000 - 0.3);

                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + chordDuration / 1000);

                this.bgmOscillators.push(oscillator);
            });

            // メインメロディーの演奏（4音符分）
            for (let i = 0; i < 4; i++) {
                if (currentMelodyIndex >= mainMelody.length) {
                    currentMelodyIndex = 0;
                }

                const melodyFreq = mainMelody[currentMelodyIndex];
                const startTime = this.audioContext.currentTime + (i * melodyDuration / 1000);
                
                const melodyOscillator = this.audioContext.createOscillator();
                const melodyGain = this.audioContext.createGain();
                const melodyFilter = this.audioContext.createBiquadFilter();

                melodyOscillator.connect(melodyFilter);
                melodyFilter.connect(melodyGain);
                melodyGain.connect(this.bgmGainNode);

                melodyOscillator.type = 'triangle';
                melodyOscillator.frequency.setValueAtTime(melodyFreq, startTime);

                // メロディー用フィルター
                melodyFilter.type = 'lowpass';
                melodyFilter.frequency.setValueAtTime(2500, startTime);
                melodyFilter.Q.setValueAtTime(1.2, startTime);

                // 表現豊かな音量変化
                const dynamicVolume = 0.15 + Math.sin(currentMelodyIndex * 0.5) * 0.05;
                melodyGain.gain.setValueAtTime(0, startTime);
                melodyGain.gain.linearRampToValueAtTime(dynamicVolume, startTime + 0.1);
                melodyGain.gain.exponentialRampToValueAtTime(0.01, startTime + melodyDuration / 1000 - 0.05);

                melodyOscillator.start(startTime);
                melodyOscillator.stop(startTime + melodyDuration / 1000);

                this.bgmOscillators.push(melodyOscillator);
                currentMelodyIndex++;
            }

            // カウンターメロディーの演奏
            for (let i = 0; i < 4; i++) {
                if (currentCounterIndex >= counterMelody.length) {
                    currentCounterIndex = 0;
                }

                const counterFreq = counterMelody[currentCounterIndex];
                const startTime = this.audioContext.currentTime + (i * melodyDuration / 1000) + 0.1;
                
                const counterOscillator = this.audioContext.createOscillator();
                const counterGain = this.audioContext.createGain();
                const counterFilter = this.audioContext.createBiquadFilter();

                counterOscillator.connect(counterFilter);
                counterFilter.connect(counterGain);
                counterGain.connect(this.bgmGainNode);

                counterOscillator.type = 'sine';
                counterOscillator.frequency.setValueAtTime(counterFreq, startTime);

                counterFilter.type = 'lowpass';
                counterFilter.frequency.setValueAtTime(1800, startTime);
                counterFilter.Q.setValueAtTime(0.8, startTime);

                counterGain.gain.setValueAtTime(0, startTime);
                counterGain.gain.linearRampToValueAtTime(0.08, startTime + 0.08);
                counterGain.gain.exponentialRampToValueAtTime(0.01, startTime + melodyDuration / 1000 - 0.05);

                counterOscillator.start(startTime);
                counterOscillator.stop(startTime + melodyDuration / 1000);

                this.bgmOscillators.push(counterOscillator);
                currentCounterIndex++;
            }

            // アルペジオの演奏（装飾的）
            for (let i = 0; i < 12; i++) {
                if (currentArpeggioIndex >= arpeggioPattern.length) {
                    currentArpeggioIndex = 0;
                }

                const arpeggioFreq = arpeggioPattern[currentArpeggioIndex];
                const startTime = this.audioContext.currentTime + (i * arpeggioSpeed / 1000);
                
                const arpeggioOscillator = this.audioContext.createOscillator();
                const arpeggioGain = this.audioContext.createGain();

                arpeggioOscillator.connect(arpeggioGain);
                arpeggioGain.connect(this.bgmGainNode);

                arpeggioOscillator.type = 'sine';
                arpeggioOscillator.frequency.setValueAtTime(arpeggioFreq * 2, startTime); // オクターブ上

                arpeggioGain.gain.setValueAtTime(0, startTime);
                arpeggioGain.gain.linearRampToValueAtTime(0.04, startTime + 0.02);
                arpeggioGain.gain.exponentialRampToValueAtTime(0.01, startTime + arpeggioSpeed / 1000);

                arpeggioOscillator.start(startTime);
                arpeggioOscillator.stop(startTime + arpeggioSpeed / 1000);

                this.bgmOscillators.push(arpeggioOscillator);
                currentArpeggioIndex++;
            }

            // 次のコードへ
            currentChordIndex = (currentChordIndex + 1) % chordProgression.length;

            // 次の演奏をスケジュール
            setTimeout(playFullBgm, chordDuration);
        };

        // BGM開始
        playFullBgm();
    }

    // フォールバック用：オリジナルの合成勝利BGM
    playOriginalVictoryBgm() {
        if (!this.audioContext) return;
        
        try {
            // 勝利BGM用のゲインノード作成
            this.victoryGainNode = this.audioContext.createGain();
            this.victoryGainNode.connect(this.audioContext.destination);
            this.victoryGainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            
            // 壮大な勝利ファンファーレのメロディー（オーケストラ風）
            const fanfareMelody = [
                // 第1フレーズ（トランペット風上昇）
                523.25, 659.25, 783.99, 1046.50, 1174.66, 1046.50, 880.00, 783.99,
                // 第2フレーズ（華やかな装飾）
                1046.50, 1174.66, 1318.51, 1174.66, 1046.50, 880.00, 783.99, 659.25,
                // 第3フレーズ（クライマックス）
                1318.51, 1174.66, 1046.50, 1174.66, 1318.51, 1567.98, 1318.51, 1046.50,
                // 第4フレーズ（勝利の締めくくり）
                880.00, 1046.50, 1174.66, 1046.50, 880.00, 783.99, 1046.50, 523.25
            ];
            
            // ハーモニーパート（ホルン風）
            const harmonyMelody = [
                329.63, 415.30, 523.25, 659.25, 783.99, 659.25, 523.25, 415.30,
                659.25, 783.99, 880.00, 783.99, 659.25, 523.25, 415.30, 329.63,
                880.00, 783.99, 659.25, 783.99, 880.00, 1046.50, 880.00, 659.25,
                523.25, 659.25, 783.99, 659.25, 523.25, 415.30, 659.25, 329.63
            ];
            
            // ベースライン（チューバ風）
            const bassLine = [
                130.81, 164.81, 196.00, 261.63, 196.00, 164.81, 130.81, 98.00,
                261.63, 196.00, 164.81, 130.81, 174.61, 220.00, 196.00, 164.81,
                130.81, 174.61, 220.00, 261.63, 329.63, 261.63, 220.00, 174.61,
                196.00, 261.63, 329.63, 261.63, 196.00, 164.81, 261.63, 130.81
            ];

            // 壮大なコード進行（オーケストラ風ハーモニー）
            const victoryChords = [
                [523.25, 659.25, 783.99, 1046.50], // C major
                [587.33, 739.99, 880.00, 1174.66], // D major
                [392.00, 493.88, 587.33, 783.99],  // G major
                [523.25, 659.25, 783.99, 1046.50], // C major
                [440.00, 554.37, 659.25, 880.00],  // A major
                [493.88, 622.25, 739.99, 987.77],  // B major
                [523.25, 659.25, 783.99, 1046.50], // C major
                [587.33, 739.99, 880.00, 1174.66]  // D major
            ];
            
            let melodyIndex = 0;
            let harmonyIndex = 0;
            let bassIndex = 0;
            let chordIndex = 0;
            
            const playVictorySequence = () => {
                const currentTime = this.audioContext.currentTime;
                
                // ドラムビート効果（キックとスネア）
                this.playDrumBeat(currentTime);
                
                // メインファンファーレ（トランペット風）
                if (melodyIndex < fanfareMelody.length) {
                    const freq = fanfareMelody[melodyIndex];
                    this.playTrumpetSound(freq, currentTime, 0.25, 0.4);
                    melodyIndex++;
                }
                
                // ハーモニーパート（ホルン風）
                if (harmonyIndex < harmonyMelody.length) {
                    const freq = harmonyMelody[harmonyIndex];
                    this.playHornSound(freq, currentTime + 0.1, 0.3, 0.2);
                    harmonyIndex++;
                }
                
                // ベースライン（チューバ風）
                if (bassIndex < bassLine.length) {
                    const freq = bassLine[bassIndex];
                    this.playTubaSound(freq, currentTime, 0.4, 0.15);
                    bassIndex++;
                }
                
                // コード演奏（オーケストラ風ハーモニー）
                if (chordIndex < victoryChords.length && melodyIndex % 4 === 0) {
                    const chord = victoryChords[chordIndex];
                    this.playOrchestraChord(chord, currentTime, 2.0);
                    chordIndex++;
                }
                
                // シンバルクラッシュ（特別なタイミング）
                if (melodyIndex % 8 === 0 && melodyIndex > 0) {
                    this.playCymbalCrash(currentTime);
                }
                
                // グロッケンシュピール効果（キラキラ）
                if (melodyIndex % 2 === 0) {
                    this.playGlockenspiel(currentTime);
                }
                
                // 次の音符を再生
                if (melodyIndex < fanfareMelody.length) {
                    setTimeout(playVictorySequence, 400); // 0.4秒間隔
                } else {
                    // メロディー終了後、壮大なエンディング
                    this.playGrandFinale(currentTime + 1);

                }
            };
            
            // 派手なイントロから開始
            this.playVictoryIntro(() => {
                playVictorySequence();
            });
            
        } catch (error) {
            console.error('勝利BGM再生エラー:', error);
        }
    }

    // トランペット風の音色
    playTrumpetSound(frequency, startTime, duration, volume) {
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        oscillator.connect(filter);
        filter.connect(gain);
        gain.connect(this.victoryGainNode);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(frequency, startTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, startTime);
        filter.Q.setValueAtTime(2, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }

    // ホルン風の音色
    playHornSound(frequency, startTime, duration, volume) {
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        oscillator.connect(filter);
        filter.connect(gain);
        gain.connect(this.victoryGainNode);

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(frequency, startTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, startTime);
        filter.Q.setValueAtTime(1.5, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }

    // チューバ風の音色
    playTubaSound(frequency, startTime, duration, volume) {
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        oscillator.connect(filter);
        filter.connect(gain);
        gain.connect(this.victoryGainNode);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, startTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, startTime);
        filter.Q.setValueAtTime(1, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }

    // オーケストラ風コード
    playOrchestraChord(chord, startTime, duration) {
        chord.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();

            oscillator.connect(filter);
            filter.connect(gain);
            gain.connect(this.victoryGainNode);

            oscillator.type = index < 2 ? 'triangle' : 'sine';
            oscillator.frequency.setValueAtTime(freq, startTime);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2500 - index * 200, startTime);
            filter.Q.setValueAtTime(1.2, startTime);

            const volume = 0.1 - index * 0.02;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(volume, startTime + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    }

    // ドラムビート効果
    playDrumBeat(startTime) {
        // キックドラム（低音）
        const kickOsc = this.audioContext.createOscillator();
        const kickGain = this.audioContext.createGain();
        const kickFilter = this.audioContext.createBiquadFilter();

        kickOsc.connect(kickFilter);
        kickFilter.connect(kickGain);
        kickGain.connect(this.victoryGainNode);

        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(60, startTime);
        kickOsc.frequency.exponentialRampToValueAtTime(30, startTime + 0.1);

        kickFilter.type = 'lowpass';
        kickFilter.frequency.setValueAtTime(200, startTime);

        kickGain.gain.setValueAtTime(0.3, startTime);
        kickGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

        kickOsc.start(startTime);
        kickOsc.stop(startTime + 0.2);

        // スネアドラム（ホワイトノイズ風）
        const snareOsc = this.audioContext.createOscillator();
        const snareGain = this.audioContext.createGain();
        const snareFilter = this.audioContext.createBiquadFilter();

        snareOsc.connect(snareFilter);
        snareFilter.connect(snareGain);
        snareGain.connect(this.victoryGainNode);

        snareOsc.type = 'square';
        snareOsc.frequency.setValueAtTime(200, startTime + 0.2);

        snareFilter.type = 'highpass';
        snareFilter.frequency.setValueAtTime(1000, startTime + 0.2);

        snareGain.gain.setValueAtTime(0, startTime + 0.2);
        snareGain.gain.linearRampToValueAtTime(0.15, startTime + 0.22);
        snareGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);

        snareOsc.start(startTime + 0.2);
        snareOsc.stop(startTime + 0.35);
    }

    // シンバルクラッシュ
    playCymbalCrash(startTime) {
        const cymbalOsc = this.audioContext.createOscillator();
        const cymbalGain = this.audioContext.createGain();
        const cymbalFilter = this.audioContext.createBiquadFilter();

        cymbalOsc.connect(cymbalFilter);
        cymbalFilter.connect(cymbalGain);
        cymbalGain.connect(this.victoryGainNode);

        cymbalOsc.type = 'square';
        cymbalOsc.frequency.setValueAtTime(4000, startTime);
        cymbalOsc.frequency.exponentialRampToValueAtTime(2000, startTime + 1);

        cymbalFilter.type = 'highpass';
        cymbalFilter.frequency.setValueAtTime(3000, startTime);

        cymbalGain.gain.setValueAtTime(0.2, startTime);
        cymbalGain.gain.exponentialRampToValueAtTime(0.01, startTime + 2);

        cymbalOsc.start(startTime);
        cymbalOsc.stop(startTime + 2);
    }

    // グロッケンシュピール（キラキラ効果）
    playGlockenspiel(startTime) {
        const frequencies = [1046.50, 1318.51, 1567.98, 2093.00];
        frequencies.forEach((freq, index) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.victoryGainNode);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime + index * 0.05);

            gain.gain.setValueAtTime(0, startTime + index * 0.05);
            gain.gain.linearRampToValueAtTime(0.08, startTime + index * 0.05 + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + index * 0.05 + 0.3);

            osc.start(startTime + index * 0.05);
            osc.stop(startTime + index * 0.05 + 0.3);
        });
    }

    // 派手なイントロ
    playVictoryIntro(callback) {
        const startTime = this.audioContext.currentTime;
        
        // トランペットファンファーレ
        const introNotes = [523.25, 659.25, 783.99, 1046.50];
        introNotes.forEach((freq, index) => {
            this.playTrumpetSound(freq, startTime + index * 0.2, 0.5, 0.4);
        });
        
        // シンバルクラッシュ
        this.playCymbalCrash(startTime + 0.8);
        
        // コールバック実行
        setTimeout(callback, 1500);
    }

    // 壮大なエンディング
    playGrandFinale(startTime) {
        // 全楽器でクライマックス
        const finaleChord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        
        finaleChord.forEach((freq, index) => {
            this.playTrumpetSound(freq, startTime, 3, 0.3);
            this.playHornSound(freq * 0.5, startTime + 0.1, 3, 0.2);
        });
        
        // 特大シンバルクラッシュ
        this.playCymbalCrash(startTime);
        
        // グロッケンシュピールの華やかな装飾
        for (let i = 0; i < 5; i++) {
            this.playGlockenspiel(startTime + i * 0.3);
        }
    }

    playTone(frequency, duration, volume = 0.1) {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playMoveSound() {
        this.playTone(220, 0.1, 0.05);
    }

    playSuccessSound() {
        // 成功時のメロディー
        const notes = [261.63, 329.63, 392.00, 523.25]; // C-E-G-C
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 0.2, 0.1);
            }, index * 150);
        });
    }

    showSuccess(feedback) {
        // ストリーク数を増やし、スコア計算
        this.streakCount++;
        const baseScore = 100;
        const bonusMultiplier = Math.min(this.streakCount, 5); // 最大5倍
        const stageBonus = (this.currentStage + 1) * 10;
        const earnedScore = (baseScore + stageBonus) * bonusMultiplier;
        this.totalScore += earnedScore;

        const feedbackAnimation = document.getElementById('feedback-animation');
        const feedbackText = document.getElementById('feedback-text');
        const dropZone = document.getElementById('drop-zone');

        // アニメーション表示（配列として処理）
        feedbackAnimation.innerHTML = '';
        feedback.animation.forEach((char, index) => {
            setTimeout(() => {
                const span = document.createElement('span');
                span.textContent = char;
                span.className = 'floating';
                span.style.fontSize = '1.5rem';
                feedbackAnimation.appendChild(span);
            }, index * 200);
        });

        // テキスト表示
        setTimeout(() => {
            let displayText = feedback.text;
            if (this.streakCount > 1) {
                displayText += `\n🔥 ${this.streakCount}連続成功！`;
            }
            if (earnedScore > baseScore) {
                displayText += `\n✨ +${earnedScore}点`;
            }
            
            feedbackText.innerHTML = displayText.replace(/\n/g, '<br>');
            feedbackText.classList.add('show');
        }, 600);

        // ドロップゾーンアニメーション
        dropZone.classList.add('success-animation');
        setTimeout(() => {
            dropZone.classList.remove('success-animation');
        }, 600);

        // 次へボタン表示
        setTimeout(() => {
            document.getElementById('next-btn').style.display = 'inline-block';
        }, 1000);

        // 成功音
        this.playSuccessSound();
        
        // スコア表示更新
        this.updateScoreDisplay();
    }

    showNeutralFeedback() {
        const feedbackText = document.getElementById('feedback-text');
        const neutralMessages = [
            "ふむふむ...",
            "なるほど...",
            "うーん...",
            "もう少し...",
            "何か感じる..."
        ];
        
        feedbackText.textContent = neutralMessages[Math.floor(Math.random() * neutralMessages.length)];
        feedbackText.classList.add('show');
        
        // ストリークリセット
        this.streakCount = 0;
        
        setTimeout(() => {
            feedbackText.classList.remove('show');
        }, 2000);
    }

    updateScoreDisplay() {
        // スコア表示の更新（必要に応じてHTMLに追加）
        let scoreElement = document.getElementById('score-display');
        if (!scoreElement) {
            scoreElement = document.createElement('div');
            scoreElement.id = 'score-display';
            scoreElement.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 1rem;
                color: #667eea;
                font-weight: bold;
            `;
            // game-headerに追加してヒントテキストと分離
            document.querySelector('.game-header').appendChild(scoreElement);
        }
        scoreElement.textContent = `スコア: ${this.totalScore}`;
    }

    resetArrangement() {
        const dropZone = document.getElementById('drop-zone');
        const itemsPool = document.getElementById('items-pool');

        // アイテムをプールに戻す
        const arrangedItems = dropZone.querySelectorAll('.draggable-item');
        arrangedItems.forEach(item => {
            item.classList.remove('in-zone');
            itemsPool.appendChild(item);
        });

        // フィードバックをリセット
        this.resetFeedback();
        
        this.arrangedItems = [];
        document.getElementById('next-btn').style.display = 'none';
    }

    resetFeedback() {
        const feedbackText = document.getElementById('feedback-text');
        const feedbackAnimation = document.getElementById('feedback-animation');

        // フィードバック消去
        feedbackText.classList.remove('show');
        feedbackText.textContent = '';
        feedbackAnimation.innerHTML = '';
    }

    nextStage() {
        this.currentStage++;
        this.loadStage(this.currentStage);
    }

    skipStage() {
        // スキップ統計
        this.skipCount++;
        
        // ストリークをリセット
        this.streakCount = 0;
        
        // スキップフィードバックを表示
        this.showSkipFeedback();
        
        // 1.5秒後に次のステージへ
        setTimeout(() => {
            this.currentStage++;
            this.loadStage(this.currentStage);
        }, 1500);
    }

    showSkipFeedback() {
        const feedbackAnimation = document.getElementById('feedback-animation');
        const feedbackText = document.getElementById('feedback-text');

        // アニメーション表示
        feedbackAnimation.innerHTML = '';
        const skipEmojis = ['⏭️', '💨', '🏃'];
        skipEmojis.forEach((emoji, index) => {
            setTimeout(() => {
                const span = document.createElement('span');
                span.textContent = emoji;
                span.className = 'floating';
                span.style.fontSize = '1.5rem';
                feedbackAnimation.appendChild(span);
            }, index * 200);
        });

        // フィードバックテキスト
        setTimeout(() => {
            const skipMessages = [
                "🚀 次の問題へジャンプ！",
                "⏭️ この問題をスキップしました",
                "💨 颯爽と次へ進みます！",
                "🏃 急いで次の物語へ..."
            ];
            
            feedbackText.innerHTML = skipMessages[Math.floor(Math.random() * skipMessages.length)];
            feedbackText.classList.add('show');
            feedbackText.style.color = '#999';
        }, 600);

        // ドロップゾーンアニメーション
        const dropZone = document.getElementById('drop-zone');
        dropZone.classList.add('skip-animation');
        setTimeout(() => {
            dropZone.classList.remove('skip-animation');
        }, 800);

        // スコア表示更新
        this.updateScoreDisplay();
    }

    showGameComplete() {
        this.stopBgm(); // 通常のBGMを停止
        this.playVictoryBgm(); // 勝利BGMを再生
        
        // パーティクルエフェクトを開始
        this.startVictoryParticles();
        
        // プレイ統計を計算
        const perfectBonus = this.streakCount >= this.stages.length ? 2000 : 0;
        const finalScore = this.totalScore + perfectBonus;
        
        // 称号を決定
        const title = this.getPlayerTitle(finalScore, this.streakCount);
        
        const gameMain = document.querySelector('.game-main');
        gameMain.innerHTML = `
            <div class="victory-screen" style="text-align: center; padding: 40px 20px; position: relative;">
                <div class="victory-animation" style="font-size: 5rem; margin-bottom: 30px; animation: victoryBounce 2s ease-in-out infinite;">
                    🎉✨🏆✨🎉
                </div>
                
                <h1 class="victory-title" style="font-size: 3rem; margin-bottom: 20px; color: #667eea; animation: titleGlow 3s ease-in-out infinite;">
                    🌟 完全制覇！ 🌟
                </h1>
                
                <div class="achievement-badge" style="background: linear-gradient(135deg, #ffd700, #ffed4e); color: #333; padding: 15px 30px; border-radius: 50px; margin: 20px auto; max-width: 300px; animation: badgeShine 2s ease-in-out infinite;">
                    <div style="font-size: 1.5rem; font-weight: bold;">${title}</div>
                </div>
                
                <div class="score-showcase" style="background: rgba(255,255,255,0.1); border-radius: 20px; padding: 30px; margin: 30px auto; max-width: 400px; animation: scoreFloat 4s ease-in-out infinite;">
                    <div class="final-score" style="font-size: 3rem; color: #ffd700; font-weight: bold; margin-bottom: 20px; text-shadow: 0 0 20px #ffd700;">
                        ${finalScore.toLocaleString()}点
                    </div>
                    
                    <div class="score-breakdown" style="font-size: 1rem; color: #666; line-height: 1.6;">
                        <div style="margin-bottom: 8px;">📊 基本スコア: ${this.totalScore.toLocaleString()}点</div>
                        ${perfectBonus > 0 ? `<div style="margin-bottom: 8px; color: #ff6b6b;">🎯 完璧ボーナス: +${perfectBonus.toLocaleString()}点</div>` : ''}
                        <div style="margin-bottom: 8px;">🔥 最高ストリーク: ${this.streakCount}連続</div>
                        <div style="margin-bottom: 8px;">🌟 クリアステージ: ${this.stages.length - this.skipCount}/${this.stages.length}${this.skipCount > 0 ? `（⏭️${this.skipCount}回スキップ）` : ''}</div>
                    </div>
                </div>
                
                <div class="completion-message" style="font-size: 1.3rem; color: #333; margin: 30px 0; line-height: 1.6;">
                    🎭 すべての物語を見つけ出しました！<br>
                    ✨ 「順番」に隠された美しい意味を<br>
                    💫 あなたは感じることができましたか？
                </div>
                
                <div class="action-buttons" style="margin-top: 40px;">
                    <button id="share-result-btn" class="btn btn-victory" style="background: linear-gradient(135deg, #1da1f2, #0d8bd9); color: white; margin: 0 10px; padding: 15px 30px; font-size: 1.1rem; border-radius: 30px; border: none; cursor: pointer; animation: buttonPulse 2s ease-in-out infinite;">
                        🐦 X でシェア
                    </button>
                    <button onclick="location.reload()" style="background: linear-gradient(135deg, #ff6b6b, #ff8e8e); color: white; margin: 0 10px; padding: 15px 30px; font-size: 1.1rem; border-radius: 30px; border: none; cursor: pointer; animation: buttonPulse 2s ease-in-out infinite 0.5s;">
                        🎮 もう一度挑戦
                    </button>
                </div>
            </div>
        `;
        
        // シェアボタンのイベントリスナーを正しく設定
        const shareBtn = document.getElementById('share-result-btn');
        shareBtn.addEventListener('click', () => {
            this.shareResult();
        });
        
        // 勝利アニメーション用CSSを動的に追加
        this.addVictoryAnimationCSS();
    }

    startVictoryParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;
        
        // パーティクル生成
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'victory-particle';
            
            // ランダムな絵文字
            const emojis = ['🎉', '✨', '🌟', '💫', '🎊', '🎈', '💖', '🏆', '👑', '💎'];
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            
            // ランダムな位置とサイズ
            const size = Math.random() * 30 + 20;
            particle.style.cssText = `
                position: absolute;
                font-size: ${size}px;
                left: ${Math.random() * 100}%;
                top: -50px;
                animation: particleFall ${Math.random() * 3 + 2}s linear forwards;
                z-index: 1000;
                pointer-events: none;
                transform: rotate(${Math.random() * 360}deg);
            `;
            
            particlesContainer.appendChild(particle);
            
            // パーティクルを削除
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 5000);
        };
        
        // 継続的にパーティクルを生成
        const particleInterval = setInterval(createParticle, 200);
        
        // 10秒後に停止
        setTimeout(() => {
            clearInterval(particleInterval);
        }, 10000);
        
        // 初期バースト
        for (let i = 0; i < 20; i++) {
            setTimeout(createParticle, i * 100);
        }
    }

    addVictoryAnimationCSS() {
        // 勝利アニメーション用のCSSを動的に追加
        const style = document.createElement('style');
        style.textContent = `
            @keyframes victoryBounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-30px); }
                60% { transform: translateY(-15px); }
            }
            
            @keyframes titleGlow {
                0%, 100% { text-shadow: 0 0 10px #667eea; }
                50% { text-shadow: 0 0 20px #667eea, 0 0 30px #667eea; }
            }
            
            @keyframes badgeShine {
                0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
                50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(255, 215, 0, 0.8); }
            }
            
            @keyframes scoreFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes buttonPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            @keyframes particleFall {
                0% {
                    transform: translateY(-50px) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
            
            .victory-particle {
                animation: particleFall 4s linear forwards;
            }
        `;
        document.head.appendChild(style);
    }

    getPlayerTitle(score, streak) {
        if (score >= 15000 && streak >= this.stages.length) {
            return "🏆 伝説の順序マスター";
        } else if (score >= 12000) {
            return "👑 順序の王様";
        } else if (score >= 10000) {
            return "🌟 調和の達人";
        } else if (score >= 8000) {
            return "✨ 並べの名人";
        } else if (score >= 5000) {
            return "🎯 秩序の探求者";
        } else {
            return "🌱 新たな発見者";
        }
    }

    shareResult() {
        const perfectBonus = this.streakCount >= this.stages.length ? 2000 : 0;
        const finalScore = this.totalScore + perfectBonus;
        const title = this.getPlayerTitle(finalScore, this.streakCount);
        
        const shareText = `🎮 パズルクリアしました！

✨ 称号: ${title}
🏆 スコア: ${finalScore.toLocaleString()}点
🔥 最高ストリーク: ${this.streakCount}連続
🌟 クリアステージ: ${this.stages.length - this.skipCount}/${this.stages.length}${this.skipCount > 0 ? `（⏭️${this.skipCount}回スキップ）` : ''}

「順番」に隠された美しい意味を見つけるパズルゲーム
#パズルゲーム #ブラウザゲーム`;
        
        // X（Twitter）専用のシェア機能
        const gameUrl = window.location.href;
        const tweetText = encodeURIComponent(shareText + '\n\n' + gameUrl);
        const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
        
        // 新しいタブでX（Twitter）を開く
        window.open(twitterUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
        
        // 成功メッセージを表示
        this.showShareToast('🐦 X（Twitter）でシェアしました！\n新しいタブが開きます');
    }
    
    showShareToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            font-size: 1.1rem;
            text-align: center;
            z-index: 3000;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    showStageTransition(stageIndex) {
        // ステージ切り替えの演出
        const gameMain = document.querySelector('.game-main');
        const stage = this.stages[stageIndex];
        
        // フェードアウト → フェードイン
        gameMain.style.opacity = '0.7';
        gameMain.style.transform = 'scale(0.95)';
        
        // ステージ切り替えアニメーションオーバーレイを作成
        const overlay = document.createElement('div');
        overlay.className = 'stage-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(102, 126, 234, 0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            transform: scale(1.1);
            transition: all 0.5s ease;
            backdrop-filter: blur(10px);
        `;
        
        // ステージ番号表示
        const stageNumber = document.createElement('div');
        stageNumber.className = 'stage-number-display';
        stageNumber.style.cssText = `
            font-size: 8rem;
            font-weight: bold;
            color: white;
            text-shadow: 0 4px 8px rgba(0,0,0,0.3);
            margin-bottom: 20px;
            transform: scale(0);
            transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;
        stageNumber.textContent = `${stageIndex + 1}`;
        
        // ステージテーマ表示
        const stageTheme = document.createElement('div');
        stageTheme.className = 'stage-theme-display';
        stageTheme.style.cssText = `
            font-size: 2rem;
            color: white;
            text-align: center;
            margin-bottom: 10px;
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease 0.3s;
        `;
        stageTheme.textContent = stage.theme;
        
        // サブテキスト表示
        const stageSubtext = document.createElement('div');
        stageSubtext.className = 'stage-subtext-display';
        stageSubtext.style.cssText = `
            font-size: 1.2rem;
            color: rgba(255,255,255,0.8);
            text-align: center;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease 0.5s;
        `;
        stageSubtext.textContent = stage.hint;
        
        // 装飾エフェクト
        const decorEffect = document.createElement('div');
        decorEffect.className = 'stage-decoration';
        decorEffect.style.cssText = `
            font-size: 3rem;
            margin-top: 30px;
            opacity: 0;
            transform: rotate(180deg) scale(0);
            transition: all 0.8s ease 0.7s;
        `;
        decorEffect.textContent = '✨🌟✨';
        
        // 要素を組み立て
        overlay.appendChild(stageNumber);
        overlay.appendChild(stageTheme);
        overlay.appendChild(stageSubtext);
        overlay.appendChild(decorEffect);
        document.body.appendChild(overlay);
        
        // アニメーション開始
        setTimeout(() => {
            overlay.style.opacity = '1';
            overlay.style.transform = 'scale(1)';
        }, 100);
        
        setTimeout(() => {
            stageNumber.style.transform = 'scale(1)';
        }, 200);
        
        setTimeout(() => {
            stageTheme.style.opacity = '1';
            stageTheme.style.transform = 'translateY(0)';
        }, 400);
        
        setTimeout(() => {
            stageSubtext.style.opacity = '1';
            stageSubtext.style.transform = 'translateY(0)';
        }, 600);
        
        setTimeout(() => {
            decorEffect.style.opacity = '1';
            decorEffect.style.transform = 'rotate(0deg) scale(1)';
        }, 800);
        
        // アニメーション終了とフェードアウト
        setTimeout(() => {
            overlay.style.opacity = '0';
            overlay.style.transform = 'scale(0.9)';
            
            gameMain.style.opacity = '1';
            gameMain.style.transform = 'scale(1)';
        }, 2500);
        
        // オーバーレイ削除
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 3000);
    }

    // 勝利BGM停止メソッドを追加
    stopVictoryBgm() {
        if (this.victoryAudio) {
            this.victoryAudio.pause();
            this.victoryAudio.currentTime = 0;
            this.victoryAudio = null;
        }
        
        // 合成勝利BGMの停止処理（フォールバック用）
        if (this.victoryGainNode) {
            try {
                this.victoryGainNode.disconnect();
            } catch (e) {
                // Already disconnected
            }
            this.victoryGainNode = null;
        }
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    new JustArrangeGame();
}); 