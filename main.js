// --- 状態管理とデータ定義 ---
let appState = {
    logs: [],
    journals: [],
    unlockedBadges: [],
    totalMarginTime: 0
};

// 答えのない問いリスト
const ZEN_QUESTIONS = [
    "「絶対に効率化してはいけない、人生の大切な時間」とは何ですか？",
    "今日見つけた、もっとも「美しくて無駄なもの」は何ですか？",
    "もしスマートフォンの画面が1日中真っ黒になったら、あなたは何をしますか？",
    "あなたの心が一番「動く」のは、どんなに非効率なことをしている時ですか？",
    "「時間を無駄にした」という罪悪感は、誰があなたに植え付けたものでしょうか？",
    "目的地へ「一番遠回り」で行くとしたら、どんなルートを通りますか？",
    "あなたの「人間らしさ」を最も感じられるバグ（欠点・失敗）は何ですか？"
];

// バッジ定義
const BADGE_DEFINITIONS = [
    { id: 'first_step', name: '人間味の第一歩', emoji: '🐣', desc: '最初の「余白」または「バグ」を記録した。', condition: 'logs.length >= 1' },
    { id: 'cat_sync', name: '猫との同期マスター', emoji: '🐱', desc: '猫や動物を観察する無駄な時間を過ごした。', condition: 'hasKeyword(["猫", "ねこ", "イヌ", "犬", "動物", "鳥"])' },
    { id: 'random_walker', name: 'ランダムウォーカー', emoji: '🧭', desc: '寄り道や迷子を楽しみ、未知のノードを探索した。', condition: 'hasKeyword(["迷う", "道", "寄り道", "散歩", "迷子", "歩く"])' },
    { id: 'memory_opt', name: 'メモリ・オプティマイザー', emoji: '💤', desc: '睡眠や休息を「メモリ解放」として優先できた。', condition: 'hasKeyword(["睡眠", "寝る", "昼寝", "休息", "ベッド", "ふとん"])' },
    { id: 'offline_explorer', name: 'オフライン探検家', emoji: '📴', desc: 'デジタルから切断し、現実のランダム性を楽しんだ。', condition: 'hasKeyword(["スマホ", "携帯", "SNS", "ツイッター", "インスタ", "デジタル", "画面"])' },
    { id: 'zen_master', name: 'ZEN・マスター', emoji: '🍵', desc: '答えのない問いに対して、3回ジャーナリングを行った。', condition: 'journals.length >= 3' },
    { id: 'margin_guardian', name: '余白の守護者', emoji: '🌸', desc: '合計余白時間が120分（2時間）を突破した。', condition: 'totalMarginTime >= 120' }
];

// キーワードベースのリフレーミングデータベース
const REFRAMING_RULES = [
    {
        keywords: ["スマホ", "SNS", "ツイッター", "インスタ", "通知", "ネット"],
        type: "margin",
        responses: [
            "脳が一時的に『他人の脳の同期プロトコル』に接続され、ランダムな思考パケットのダンプを行っています。デジタル空間での漂流は、現実世界のタスクキューが自動デフラグされている証拠です！",
            "あなたの意識は今、超長距離のデータ航海に出ていました。SNSのタイムラインという果てしない情報ノイズの海を泳ぎ切ったあなたの指先と視神経に、いま『無駄』という名の勲章が与えられました。"
        ]
    },
    {
        keywords: ["睡眠", "寝る", "遅起き", "二度寝", "寝坊"],
        type: "bug",
        responses: [
            "システムメモリ（脳）が蓄積されたキャッシュ（ストレス）を安全にパージするため、自動シャットダウン・リカバリー処理が走りました。二度寝は、脳のハードウェア保護のためのもっとも健全なエラーハンドリングです！",
            "これは時間管理の失敗ではありません。長時間のオペレーションで加熱したコアを冷却するための『強制冷却サイクル（オーバーヒート防止機能）』が正常に稼働した証拠です。心ゆくまでシステムを休止させてください。"
        ]
    },
    {
        keywords: ["迷う", "道", "寄り道", "間違える", "逆方向"],
        type: "margin",
        responses: [
            "最短経路探索アルゴリズムをあえてハックし、ランダムウォークによる『実空間の未知ノード探索』を実行しました。この寄り道により、周囲の風景の描画エンジンが最大解像度で稼働し、セレンディピティの発生確率が200%向上しました！",
            "目的地への最短ルートという『予定調和のコンパイル』を拒否し、現実世界に隠されたサイドクエスト（美しい路地、知らない看板）をアンロックしました。素晴らしい冒険的エラーです。"
        ]
    },
    {
        keywords: ["猫", "犬", "動物", "鳥", "花", "空"],
        type: "margin",
        responses: [
            "非人間のオペレーティングシステム（自然・動物）との同期セッションを確立しました。言葉を使わないプロトコルで交わされた10分間は、人間社会のロジックを超越した『精神のガベージコレクション（不要データの掃除）』に最適化されています。",
            "空のグラデーションや、野良猫の気まぐれな挙動という『非論理的でエモい生データ』を感性ハードウェアに直接インプットしました。脳の感受性センサーが再キャリブレーション（微調整）されました。"
        ]
    },
    {
        keywords: ["タスク", "仕事", "焦る", "スケジュール", "カレンダー"],
        type: "bug",
        responses: [
            "休日のスケジュールまで『タスク』で埋めようとする、慢性的な『メモリリーク・焦燥症候群』を検知しました。これはバグではなく、効率化社会のウイルスによる誤動作です。あえて予定を『null（空）』にするコードを挿入しましょう。",
            "効率化の追求がスタックオーバーフローを起こしています。処理能力を上げるために処理を増やすループを断ち切り、一度 CPU 使用率を 0% に落とす『アイドル状態』を意識的に確保してください。"
        ]
    }
];

// フォールバック用のリフレーミングテンプレート
const FALLBACK_REFRAMING = {
    margin: [
        "論理では説明できない非効率な行動を選択し、人間としての柔軟な『ランダム性』を確保しました。効率化のコンテキストから解放された、極上のゆとり時間です。",
        "『何かを生産しなければならない』という社会の強迫パケットを一時的にドロップ（拒否）しました。この時間は、あなたの心が純粋に『そこにあること』を味わうための余白です。"
    ],
    bug: [
        "予定通りにいかないバグが発生しましたが、これこそが人生に偶発性と彩りを与える『人間味のコア』です。バグがあるからこそ、人間は機械と一線を画すことができます。",
        "社会の求める最適解からは外れたかもしれませんが、独自の例外処理（エラーハンドリング）により、予想外の寄り道や感情の動きをキャッチできました。ナイス・ハックです！"
    ]
};

// --- DOM 要素の取得 ---
document.addEventListener("DOMContentLoaded", () => {
    // フォーム
    const logForm = document.getElementById("log-form");
    const logTypeSelect = document.getElementById("log-type");
    const logContentInput = document.getElementById("log-content");
    const logTimeInput = document.getElementById("log-time");
    
    // エモさレベルの選択
    const emoButtons = document.querySelectorAll(".level-btn");
    let selectedEmoLevel = 3; // デフォルト 3
    
    // タイムラインと統計
    const timelineList = document.getElementById("timeline-list");
    const statsTotalMargin = document.getElementById("stats-total-margin");
    const statsHumanityCount = document.getElementById("stats-humanity-count");
    const statsZenCount = document.getElementById("stats-zen-count");
    const meterFill = document.getElementById("meter-fill");
    const meterNumber = document.getElementById("meter-number");
    
    // バッジ
    const badgeGrid = document.getElementById("badge-grid");
    
    // ジャーナル
    const zenQuestionText = document.getElementById("zen-question");
    const journalAnswerInput = document.getElementById("journal-answer");
    const submitJournalBtn = document.getElementById("submit-journal");
    const refreshQuestionBtn = document.getElementById("refresh-question");
    const historyList = document.getElementById("history-list");
    
    // モーダル
    const modalOverlay = document.getElementById("modal-overlay");
    const modalBadgeIcon = document.getElementById("modal-badge-icon");
    const modalBadgeName = document.getElementById("modal-badge-name");
    const modalBadgeDesc = document.getElementById("modal-badge-desc");
    const closeModalBtn = document.getElementById("close-modal");

    // --- 初期化 ---
    loadStateFromLocalStorage();
    initBadgesUI();
    updateUI();
    setRandomZenQuestion();

    // --- イベントリスナーの登録 ---
    
    // エモさレベルボタンの切り替え
    emoButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            emoButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedEmoLevel = parseInt(btn.dataset.level);
        });
    });

    // ログ登録フォームの送信
    logForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const type = logTypeSelect.value;
        const content = logContentInput.value.trim();
        const time = parseInt(logTimeInput.value) || 0;
        
        if (!content) return;
        
        // リフレーミングテキストの生成
        const reframedText = generateReframing(content, type);
        
        // 新しいログオブジェクト
        const newLog = {
            id: Date.now(),
            type: type,
            content: content,
            time: time,
            emoLevel: selectedEmoLevel,
            reframedText: reframedText,
            timestamp: new Date().toLocaleString("ja-JP")
        };
        
        // 状態の更新
        appState.logs.unshift(newLog);
        if (type === 'margin') {
            appState.totalMarginTime += time;
        }
        
        // 保存とUI更新
        saveStateToLocalStorage();
        updateUI();
        
        // バッジ解放のチェック
        checkBadgeUnlocks();
        
        // フォームのリセット
        logContentInput.value = "";
        logTimeInput.value = "10";
        emoButtons.forEach(b => b.classList.remove("active"));
        document.querySelector('[data-level="3"]').classList.add("active");
        selectedEmoLevel = 3;
    });

    // ジャーナルの送信
    submitJournalBtn.addEventListener("click", () => {
        const question = zenQuestionText.textContent;
        const answer = journalAnswerInput.value.trim();
        
        if (!answer) return;
        
        const newJournal = {
            id: Date.now(),
            question: question,
            answer: answer,
            timestamp: new Date().toLocaleDateString("ja-JP")
        };
        
        appState.journals.unshift(newJournal);
        saveStateToLocalStorage();
        updateUI();
        
        // ジャーナル送信後のバッジチェック
        checkBadgeUnlocks();
        
        // 入力欄をクリアして新しい問いを表示
        journalAnswerInput.value = "";
        setRandomZenQuestion();
    });

    // 問いのシャッフル
    refreshQuestionBtn.addEventListener("click", () => {
        setRandomZenQuestion();
    });

    // モーダル閉じる
    closeModalBtn.addEventListener("click", () => {
        modalOverlay.classList.remove("active");
    });
    
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove("active");
        }
    });

    // --- ヘルパー関数 ---

    // データをローカルストレージから読み込む
    function loadStateFromLocalStorage() {
        const savedData = localStorage.getItem("yutori_journal_state");
        if (savedData) {
            try {
                appState = JSON.parse(savedData);
                // データのマイグレーション用（古いフォーマット対応）
                if (!appState.logs) appState.logs = [];
                if (!appState.journals) appState.journals = [];
                if (!appState.unlockedBadges) appState.unlockedBadges = [];
                if (typeof appState.totalMarginTime !== 'number') appState.totalMarginTime = 0;
            } catch (e) {
                console.error("データの読み込みに失敗しました。初期値を使用します。", e);
            }
        }
    }

    // データをローカルストレージへ保存する
    function saveStateToLocalStorage() {
        localStorage.setItem("yutori_journal_state", JSON.stringify(appState));
    }

    // ランダムなZenの問いを表示
    function setRandomZenQuestion() {
        const randomIndex = Math.floor(Math.random() * ZEN_QUESTIONS.length);
        zenQuestionText.textContent = ZEN_QUESTIONS[randomIndex];
    }

    // キーワードに基づいたリフレーミング生成
    function generateReframing(content, type) {
        const lowerContent = content.toLowerCase();
        
        // キーワードに合致するルールを探す
        for (const rule of REFRAMING_RULES) {
            if (rule.type === type) {
                for (const keyword of rule.keywords) {
                    if (lowerContent.includes(keyword)) {
                        const randomIndex = Math.floor(Math.random() * rule.responses.length);
                        return rule.responses[randomIndex];
                    }
                }
            }
        }
        
        // 合致するルールがなければフォールバックからランダムに取得
        const fallbackList = FALLBACK_REFRAMING[type];
        const randomIndex = Math.floor(Math.random() * fallbackList.length);
        return fallbackList[randomIndex];
    }

    // バッジUIの初期描画（ロック状態で生成）
    function initBadgesUI() {
        badgeGrid.innerHTML = "";
        BADGE_DEFINITIONS.forEach(badge => {
            const isUnlocked = appState.unlockedBadges.includes(badge.id);
            const badgeEl = document.createElement("div");
            badgeEl.className = `badge-item ${isUnlocked ? 'unlocked' : 'locked'}`;
            badgeEl.id = `badge-${badge.id}`;
            badgeEl.setAttribute("data-tooltip", `${badge.name}: ${badge.desc}${isUnlocked ? ' (解放済み)' : ' (未解放)'}`);
            
            badgeEl.innerHTML = `
                <div class="badge-icon">${badge.emoji}</div>
                <div class="badge-name">${badge.name}</div>
            `;
            badgeGrid.appendChild(badgeEl);
        });
    }

    // バッジ解放条件のチェック
    function checkBadgeUnlocks() {
        // キーワード判定用ヘルパー
        const hasKeyword = (keywords) => {
            return appState.logs.some(log => {
                const content = log.content.toLowerCase();
                return keywords.some(keyword => content.includes(keyword));
            });
        };

        let newUnlockOccurred = false;

        BADGE_DEFINITIONS.forEach(badge => {
            // すでに解放済みの場合はスキップ
            if (appState.unlockedBadges.includes(badge.id)) return;

            // 条件式の簡易評価
            let conditionMet = false;
            
            // LocalStorage の変数/関数を参照できるように eval-like な簡易処理
            if (badge.id === 'first_step') {
                conditionMet = appState.logs.length >= 1;
            } else if (badge.id === 'zen_master') {
                conditionMet = appState.journals.length >= 3;
            } else if (badge.id === 'margin_guardian') {
                conditionMet = appState.totalMarginTime >= 120;
            } else if (badge.id === 'cat_sync') {
                conditionMet = hasKeyword(["猫", "ねこ", "イヌ", "犬", "動物", "鳥", "ペット", "キャット"]);
            } else if (badge.id === 'random_walker') {
                conditionMet = hasKeyword(["迷う", "道", "寄り道", "散歩", "迷子", "歩く", "遠回り"]);
            } else if (badge.id === 'memory_opt') {
                conditionMet = hasKeyword(["睡眠", "寝る", "昼寝", "休息", "ベッド", "ふとん", "布団", "眠"]);
            } else if (badge.id === 'offline_explorer') {
                conditionMet = hasKeyword(["スマホ", "携帯", "sns", "ツイッター", "インスタ", "デジタル", "画面", "通知", "ネット"]);
            }

            if (conditionMet) {
                appState.unlockedBadges.push(badge.id);
                showUnlockModal(badge);
                newUnlockOccurred = true;
            }
        });

        if (newUnlockOccurred) {
            saveStateToLocalStorage();
            initBadgesUI(); // UIを更新
        }
    }

    // バッジ解放モーダルの表示
    function showUnlockModal(badge) {
        modalBadgeIcon.textContent = badge.emoji;
        modalBadgeName.textContent = badge.name;
        modalBadgeDesc.textContent = badge.desc;
        modalOverlay.classList.add("active");
    }

    // UIの描画更新
    function updateUI() {
        // 統計情報の更新
        statsTotalMargin.textContent = `${appState.totalMarginTime}分`;
        statsHumanityCount.textContent = `${appState.logs.length}回`;
        statsZenCount.textContent = `${appState.journals.length}回`;
        
        // メーターグラフィックの更新（目標：今日120分の余白）
        const targetMargin = 120;
        const percentage = Math.min((appState.totalMarginTime / targetMargin) * 100, 100);
        
        // SVG 円形ダッシュオフセット計算 (円周: 2 * PI * r = 2 * 3.14159 * 60 = ~377)
        const circumference = 377;
        const offset = circumference - (percentage / 100) * circumference;
        
        meterFill.style.strokeDashoffset = offset;
        meterNumber.textContent = Math.round(percentage);

        // タイムラインの描画
        if (appState.logs.length === 0) {
            timelineList.innerHTML = `
                <div class="empty-state">
                    <i class="lucide-history"></i>
                    <p>まだ記録がありません。</p>
                    <p style="font-size: 0.8rem; opacity: 0.7;">今日の「余白時間」や「非効率バグ」を左のフォームから記録してみましょう。</p>
                </div>
            `;
        } else {
            timelineList.innerHTML = "";
            appState.logs.forEach(log => {
                const itemEl = document.createElement("div");
                itemEl.className = "timeline-item";
                
                const typeText = log.type === 'margin' ? '余白の記録' : '効率バグ';
                const typeClass = log.type === 'margin' ? 'type-margin' : 'type-bug';
                const typeIcon = log.type === 'margin' ? '<i class="lucide-sparkles"></i>' : '<i class="lucide-alert-triangle"></i>';
                const timeText = log.type === 'margin' ? `・ ${log.time}分` : '';
                const emoStars = '★'.repeat(log.emoLevel) + '☆'.repeat(5 - log.emoLevel);
                
                itemEl.innerHTML = `
                    <div class="item-header">
                        <span class="item-type ${typeClass}">
                            ${typeIcon} ${typeText}
                        </span>
                        <div class="item-time-info">
                            <span>${log.timestamp}</span>
                            ${timeText}
                            <span style="color: var(--accent); margin-left: 0.5rem;">${emoStars}</span>
                        </div>
                    </div>
                    <div class="item-original">${log.content}</div>
                    <div class="item-reframed">
                        <i class="lucide-info"></i>
                        <div>
                            <strong style="color: var(--success); font-size: 0.8rem; display: block; margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.05em;">Humanity Reframed</strong>
                            ${log.reframedText}
                        </div>
                    </div>
                `;
                timelineList.appendChild(itemEl);
            });
        }

        // ジャーナル履歴の描画
        if (appState.journals.length === 0) {
            historyList.innerHTML = `
                <p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 1.5rem 0;">回答履歴はまだありません。</p>
            `;
        } else {
            historyList.innerHTML = "";
            appState.journals.forEach(journal => {
                const historyEl = document.createElement("div");
                historyEl.className = "history-item";
                historyEl.innerHTML = `
                    <div class="history-header">
                        <span>${journal.timestamp}</span>
                    </div>
                    <div class="history-q">${journal.question}</div>
                    <div class="history-a">${journal.answer}</div>
                `;
                historyList.appendChild(historyEl);
            });
        }
        
        // バッジの解放状態の適用
        BADGE_DEFINITIONS.forEach(badge => {
            const badgeEl = document.getElementById(`badge-${badge.id}`);
            if (badgeEl) {
                const isUnlocked = appState.unlockedBadges.includes(badge.id);
                if (isUnlocked) {
                    badgeEl.className = "badge-item unlocked";
                    badgeEl.setAttribute("data-tooltip", `${badge.name}: ${badge.desc} (解放済み)`);
                } else {
                    badgeEl.className = "badge-item locked";
                    badgeEl.setAttribute("data-tooltip", `${badge.name}: ${badge.desc} (未解放)`);
                }
            }
        });
    }
});
